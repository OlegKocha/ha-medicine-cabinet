"""Home Assistant lifecycle, durable inventory, and server-side notifications."""

from __future__ import annotations

import asyncio
import logging
from datetime import time, timedelta
from pathlib import Path

from homeassistant.components import persistent_notification
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.helpers.event import async_track_time_change, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, EVENT_CHANGED, PANEL_URL, STORAGE_VERSION
from .images import save_image
from .localization import tr
from .model import (
    InventoryError,
    mutate,
    notification_key,
    notification_stage,
    parse_date,
)
from .repository import Repository
from .settings import entry_options
from .storage_tools import build_backup, clean_photos, storage_info

_LOGGER = logging.getLogger(__name__)


class CabinetManager:
    def __init__(self, hass, entry):
        self.hass = hass
        self.entry = entry
        self.repo = Repository(
            Store(hass, STORAGE_VERSION, DOMAIN, atomic_writes=True), dt_util.now
        )
        self.media_dir = Path(hass.config.path(DOMAIN, "images"))
        self._last_date = None
        self._stopped = False
        self.media_epoch = 0
        self._tick_lock = asyncio.Lock()
        self._notification_ids: set[str] = hass.data.setdefault(f"{DOMAIN}_notices", set())

    @property
    def options(self):
        return entry_options(self.entry)

    async def async_load(self):
        storage_path = Path(self.hass.config.path(".storage", DOMAIN))
        existed = await self.hass.async_add_executor_job(storage_path.is_file)
        if not existed and await self.hass.async_add_executor_job(
            lambda: any(storage_path.parent.glob(f"{DOMAIN}.corrupt.*"))
        ):
            raise InventoryError(
                "storage_invalid",
                "Найдена повреждённая копия данных. Восстановите резервную копию HA",
            )
        await self.repo.load()
        if existed and not await self.hass.async_add_executor_job(storage_path.is_file):
            # HA quarantines corrupt Store files. Require an explicit restore instead
            # of allowing an empty inventory to overwrite the user's expectations.
            raise InventoryError(
                "storage_invalid", "Файл аптечки повреждён. Восстановите резервную копию HA"
            )
        await self.hass.async_add_executor_job(
            lambda: self.media_dir.mkdir(parents=True, exist_ok=True)
        )

    async def async_start(self):
        self.entry.async_on_unload(
            async_track_time_interval(self.hass, self.async_tick, timedelta(minutes=1))
        )
        self.entry.async_on_unload(
            async_track_time_change(self.hass, self.async_tick, hour=0, minute=0, second=0)
        )
        when = time.fromisoformat(self.options["notification_time"])
        self.entry.async_on_unload(
            async_track_time_change(
                self.hass, self.async_tick, hour=when.hour, minute=when.minute, second=when.second
            )
        )
        self.entry.async_on_unload(self.stop)
        if self.hass.is_running:
            await self.async_tick(force=True)
        else:

            async def started(_event):
                await self.async_tick(force=True)

            self.entry.async_on_unload(
                self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, started)
            )

    def stop(self):
        self._stopped = True
        self.repo.accept_changes = False

    async def async_stop(self):
        self.stop()
        # Finish in-flight writes before a replacement manager loads the Store.
        async with self._tick_lock, self.repo.lock:
            pass

    def snapshot(self):
        return {
            **self.repo.snapshot(),
            "settings": {
                key: entry_options(self.entry)[key] for key in ("language", "sidebar_title")
            },
        }

    def changed(self):
        self.hass.bus.async_fire(EVENT_CHANGED)

    def _require_storage(self, revision=None):
        if self._stopped or not self.repo.accept_changes:
            raise InventoryError("not_loaded", "Интеграция перезагружается. Повторите действие")
        if revision is not None and (
            type(revision) is not int or revision != self.repo.data["revision"]
        ):
            raise InventoryError(
                "conflict",
                "Данные изменились на другом устройстве. Обновите список и повторите изменение",
            )

    async def _file_job(self, function, *args):
        # Keep the repository lock until the filesystem worker has really finished.
        future = self.hass.async_add_executor_job(function, *args)
        try:
            return await asyncio.shield(future)
        except asyncio.CancelledError:
            result = await future
            if function is build_backup:
                result[0].close()
            raise

    async def async_save_image(self, content, epoch):
        async with self.repo.lock:
            self._require_storage()
            if epoch != self.media_epoch:
                raise InventoryError(
                    "conflict",
                    "Данные изменились на другом устройстве. Обновите список и повторите изменение",
                )
            return await self._file_job(save_image, content, self.media_dir)

    async def async_storage_info(self):
        async with self.repo.lock:
            self._require_storage()
            return await self._file_job(
                storage_info, self.repo.data, self.media_dir, dt_util.now().timestamp()
            )

    async def async_backup(self):
        async with self.repo.lock:
            self._require_storage()
            return await self._file_job(
                build_backup, self.repo.data, self.media_dir, dt_util.now().isoformat()
            )

    async def async_storage_change(self, operation, payload, revision):
        if operation not in ("storage_cleanup", "storage_clear"):
            raise InventoryError("invalid", "Неизвестное действие")
        committed = False
        try:
            async with self.repo.lock:
                self._require_storage()
                if type(revision) is not int:
                    raise InventoryError("invalid", "Обновите сведения о хранилище")
                self._require_storage(revision)
                if operation == "storage_clear":
                    if payload.get("confirmation") != "DELETE":
                        raise InventoryError("invalid", "Подтвердите удаление всех данных")
                    # Commit the empty inventory first. A failed save must not delete photos.
                    changed = mutate(self.repo.data, operation, payload, revision, dt_util.now())
                    await self.repo.store.async_save(changed)
                    self.repo.data = changed
                    self.media_epoch += 1
                    committed = True
                result = await self._file_job(
                    lambda: clean_photos(
                        self.repo.data,
                        self.media_dir,
                        dt_util.now().timestamp(),
                        all_photos=operation == "storage_clear",
                    )
                )
                result["storage"] = await self._file_job(
                    storage_info, self.repo.data, self.media_dir, dt_util.now().timestamp()
                )
        finally:
            if committed:
                # A cleanup failure must still publish the already-durable reset.
                self.changed()
                await self.async_tick(force=True)
        return result

    async def async_change(self, operation, payload, revision):
        async with self.repo.lock:
            self._require_storage()
            image_id = payload.get("image_id")
            if operation in ("package_save", "group_save") and image_id:
                # Validate identifier before constructing a filesystem path.
                import re

                if not isinstance(image_id, str) or not re.fullmatch(r"[a-f0-9]{64}", image_id):
                    raise InventoryError("invalid", "Некорректная фотография")
                if not await self._file_job((self.media_dir / f"{image_id}.jpg").is_file):
                    raise InventoryError("invalid", "Фотография не найдена. Загрузите её снова")
            changed = mutate(self.repo.data, operation, payload, revision, dt_util.now())
            await self.repo.store.async_save(changed)
            self.repo.data = changed
        self.changed()
        await self.async_tick(force=True)
        return self.snapshot()

    async def async_tick(self, _now=None, *, force=False):
        if self._stopped:
            return
        async with self._tick_lock:
            now = dt_util.now()
            if self._last_date != now.date():
                self._last_date = now.date()
                self.changed()
            # Stale notices are removed even when no new notification is due.
            async with self.repo.lock:
                active_ids = (
                    {
                        f"{DOMAIN}_{p['id']}_{p['generation']}"
                        for p in self.repo.data["packages"].values()
                        if p["available"] and notification_stage(p, now.date()) is not None
                    }
                    if self.options["persistent_notifications"]
                    else set()
                )
                for notice_id in self._notification_ids - active_ids:
                    persistent_notification.async_dismiss(self.hass, notice_id)
                self._notification_ids &= active_ids
            when = time.fromisoformat(self.options["notification_time"])
            if not force and now.time().replace(tzinfo=None) < when:
                return
            # Mutations wait while sending, avoiding notification about a replaced package.
            async with self.repo.lock:
                for item in list(self.repo.data["packages"].values()):
                    stage = notification_stage(item, now.date())
                    if stage is None:
                        continue
                    group = self.repo.data["groups"][item["group_id"]]
                    kit = self.repo.data["kits"][group["kit_id"]]
                    has_other_packages = any(
                        p["group_id"] == item["group_id"]
                        and p["id"] != item["id"]
                        and p["available"]
                        for p in self.repo.data["packages"].values()
                    )
                    expiry = parse_date(item["expires_on"])
                    if has_other_packages:
                        warning = (
                            "Одна из упаковок «{name}» уже просрочена."
                            if expiry <= now.date()
                            else "Одна из упаковок «{name}» скоро просрочится."
                        )
                    else:
                        warning = (
                            "Срок годности «{name}» истёк."
                            if expiry <= now.date()
                            else "«{name}» скоро просрочится."
                        )
                    language = self.options.get("language", "ru")
                    title = "HAMB"
                    message = tr(
                        language,
                        "Аптечка: {kit}\n{warning}\nГоден до: {expiry}",
                        kit=kit["name"],
                        warning=tr(language, warning, name=group["name"]),
                        expiry=f"{expiry:%d.%m.%Y}",
                    )
                    notice_id = f"{DOMAIN}_{item['id']}_{item['generation']}"
                    key = notification_key(item, stage)
                    sent = self.repo.data["notifications"].get(key, [])
                    channels = (
                        ["persistent"] if self.options["persistent_notifications"] else []
                    ) + self.options["notify_targets"]
                    for channel in channels:
                        if channel in sent:
                            # Recreate local UI notices after HA restarts; no mobile resend.
                            if channel == "persistent" and notice_id not in self._notification_ids:
                                persistent_notification.async_create(
                                    self.hass, message, title, notice_id
                                )
                                self._notification_ids.add(notice_id)
                            continue
                        try:
                            if channel == "persistent":
                                persistent_notification.async_create(
                                    self.hass, message, title, notice_id
                                )
                                self._notification_ids.add(notice_id)
                            else:
                                async with asyncio.timeout(10):
                                    await self.hass.services.async_call(
                                        "notify",
                                        channel,
                                        {
                                            "title": title,
                                            "message": message,
                                            "data": {
                                                "tag": notice_id,
                                                "url": f"/{PANEL_URL}",
                                                "clickAction": f"/{PANEL_URL}",
                                            },
                                        },
                                        blocking=True,
                                    )
                            await self.repo.mark_notified(key, channel)
                        except Exception:  # A failed phone must not block other recipients.
                            _LOGGER.exception(
                                "Medicine Cabinet notification failed for %s", channel
                            )
