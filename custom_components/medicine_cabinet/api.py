"""Authenticated WebSocket inventory and HTTP photo/export endpoints."""

from __future__ import annotations

import asyncio
import re

from aiohttp import web
from homeassistant.components import websocket_api
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import callback
from homeassistant.util import dt as dt_util

from .compat import vol
from .const import DOMAIN, EVENT_CHANGED, MAX_IMAGE_BYTES
from .export import export_csv, export_pdf
from .localization import error_message
from .model import InventoryError, select_export_packages, select_packages
from .settings import entry_options


def localized_error(hass, err):
    entries = hass.config_entries.async_entries(DOMAIN)
    language = entry_options(entries[0])["language"] if entries else "ru"
    return error_message(language, str(err))


def manager_for(hass):
    manager = hass.data.get(DOMAIN)
    if manager is None:
        raise InventoryError("not_loaded", "Интеграция отключена или ещё загружается")
    return manager


@websocket_api.websocket_command(
    {
        "type": f"{DOMAIN}/request",
        vol.Required("operation"): str,
        vol.Optional("payload", default={}): dict,
        vol.Optional("revision"): int,
    }
)
@websocket_api.async_response
async def websocket_request(hass, connection, msg):
    try:
        manager = manager_for(hass)
        if msg["operation"] in ("storage_info", "storage_cleanup", "storage_clear"):
            if connection.user is None or not connection.user.is_admin:
                raise InventoryError("unauthorized", "Доступно только администратору")
            if msg["operation"] == "storage_info":
                result = await manager.async_storage_info()
            else:
                result = await manager.async_storage_change(
                    msg["operation"], msg["payload"], msg.get("revision")
                )
        elif msg["operation"] == "list":
            result = manager.snapshot()
        else:
            result = await manager.async_change(
                msg["operation"], msg["payload"], msg.get("revision")
            )
        connection.send_result(msg["id"], result)
    except OSError:
        connection.send_error(
            msg["id"],
            "storage_error",
            localized_error(
                hass,
                "Не удалось обработать файлы хранилища. Обновите сведения и повторите действие",
            ),
        )
    except InventoryError as err:
        connection.send_error(msg["id"], err.code, localized_error(hass, err))


@websocket_api.websocket_command({"type": f"{DOMAIN}/subscribe"})
@callback
def websocket_subscribe(hass, connection, msg):
    @callback
    def changed(_event):
        connection.send_event(msg["id"], {})

    connection.subscriptions[msg["id"]] = hass.bus.async_listen(EVENT_CHANGED, changed)
    connection.send_result(msg["id"])


class ImageUploadView(HomeAssistantView):
    url = f"/api/{DOMAIN}/images"
    name = f"api:{DOMAIN}:images"
    requires_auth = True

    def __init__(self):
        self.lock = asyncio.Lock()

    async def post(self, request):
        try:
            manager = manager_for(request.app["hass"])
            epoch = manager.media_epoch
            if request.content_length and request.content_length > MAX_IMAGE_BYTES:
                raise InventoryError("invalid_image", "Фото должно быть не больше 10 МБ")
            data = bytearray()
            async for chunk in request.content.iter_chunked(65536):
                data.extend(chunk)
                if len(data) > MAX_IMAGE_BYTES:
                    raise InventoryError("invalid_image", "Фото должно быть не больше 10 МБ")
            async with self.lock:
                image_id = await manager.async_save_image(bytes(data), epoch)
            return web.json_response({"image_id": image_id})
        except InventoryError as err:
            return web.json_response(
                {"code": err.code, "message": localized_error(request.app["hass"], err)}, status=400
            )


class ImageView(HomeAssistantView):
    url = f"/api/{DOMAIN}/images/{{image_id}}"
    name = f"api:{DOMAIN}:image"
    requires_auth = True

    async def get(self, request, image_id):
        if not re.fullmatch(r"[a-f0-9]{64}", image_id):
            raise web.HTTPNotFound()
        try:
            manager = manager_for(request.app["hass"])
        except InventoryError as err:
            raise web.HTTPServiceUnavailable(
                text=localized_error(request.app["hass"], err)
            ) from err
        path = manager.media_dir / f"{image_id}.jpg"
        if not await manager.hass.async_add_executor_job(path.is_file):
            raise web.HTTPNotFound()
        return web.FileResponse(
            path,
            headers={"Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff"},
        )


class BackupView(HomeAssistantView):
    url = f"/api/{DOMAIN}/backup"
    name = f"api:{DOMAIN}:backup"
    requires_auth = True

    async def get(self, request):
        if not request["hass_user"].is_admin:
            raise web.HTTPForbidden()
        hass = request.app["hass"]
        try:
            archive, size = await manager_for(hass).async_backup()
        except (InventoryError, OSError) as err:
            message = (
                str(err)
                if isinstance(err, InventoryError)
                else "Не удалось обработать файлы хранилища. Обновите сведения и повторите действие"
            )
            return web.json_response({"message": localized_error(hass, message)}, status=400)
        response = web.StreamResponse(
            headers={
                "Content-Type": "application/zip",
                "Content-Length": str(size),
                "Content-Disposition": f'attachment; filename="hamb-backup-{dt_util.now():%Y-%m-%d-%H%M%S}.zip"',
                "Cache-Control": "no-store",
            }
        )
        try:
            await response.prepare(request)
            while True:
                read = hass.async_add_executor_job(archive.read, 256 * 1024)
                try:
                    chunk = await asyncio.shield(read)
                except asyncio.CancelledError:
                    # Do not close the file while the executor is reading it.
                    await read
                    raise
                if not chunk:
                    break
                await response.write(chunk)
            await response.write_eof()
            return response
        finally:
            archive.close()


class ExportView(HomeAssistantView):
    url = f"/api/{DOMAIN}/export/{{format}}"
    name = f"api:{DOMAIN}:export"
    requires_auth = True

    def __init__(self):
        self.lock = asyncio.Lock()

    async def post(self, request, format):
        if format not in ("csv", "pdf"):
            raise web.HTTPNotFound()
        try:
            manager = manager_for(request.app["hass"])
            payload = await request.json()
            if not isinstance(payload, dict):
                raise InventoryError("invalid", "Некорректные параметры экспорта")
            snapshot = manager.snapshot()
            kit_id = payload.get("kit_id")
            filters = {
                key: payload.get(key, default)
                for key, default in (
                    ("query", ""),
                    ("status", "all"),
                    ("availability", "all"),
                    ("sort", "name"),
                )
            }
            if any(not isinstance(v, str) for v in filters.values()):
                raise InventoryError("invalid", "Некорректный фильтр")
            if "expiry" in payload or "include_finished" in payload:
                rows = select_export_packages(
                    snapshot,
                    kit_id,
                    payload.get("expiry", "all"),
                    payload.get("include_finished", True),
                )
            else:
                # Keep the previous API usable by a cached panel during upgrades.
                rows = select_packages(snapshot, kit_id, **filters)
            async with self.lock:
                if format == "csv":
                    result = await manager.hass.async_add_executor_job(
                        export_csv, rows, dt_util.now().tzinfo, manager.options["language"]
                    )
                else:
                    result = await manager.hass.async_add_executor_job(
                        export_pdf,
                        snapshot["kits"][kit_id]["name"],
                        rows,
                        dt_util.now(),
                        manager.media_dir,
                        manager.options["language"],
                    )
            return web.Response(
                body=result,
                content_type="text/csv" if format == "csv" else "application/pdf",
                headers={
                    "Content-Disposition": f'attachment; filename="medicine-cabinet-{dt_util.now():%Y-%m-%d}.{format}"',
                    "Cache-Control": "no-store",
                },
            )
        except (InventoryError, ValueError) as err:
            return web.json_response(
                {"message": localized_error(request.app["hass"], err)}, status=400
            )


@callback
def async_register_api(hass):
    websocket_api.async_register_command(hass, websocket_request)
    websocket_api.async_register_command(hass, websocket_subscribe)
    hass.http.register_view(ImageUploadView())
    hass.http.register_view(ImageView())
    hass.http.register_view(ExportView())
    hass.http.register_view(BackupView())
