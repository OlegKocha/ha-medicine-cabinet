import csv
import shutil
from copy import deepcopy
from datetime import timedelta
from hashlib import sha256
from io import BytesIO, StringIO
from pathlib import Path
from unittest.mock import patch

import aiohttp
import pytest
from homeassistant.components import persistent_notification
from homeassistant.components.frontend import DATA_PANELS
from homeassistant.util import dt as dt_util
from PIL import Image
from pypdf import PdfReader

from tests.ha_runtime import create_token, start_hass


@pytest.fixture
async def runtime(tmp_path, unused_tcp_port):
    hass = await start_hass(tmp_path, unused_tcp_port)
    _, _, token = await create_token(hass)
    try:
        yield hass, f"http://127.0.0.1:{unused_tcp_port}", token
    finally:
        await hass.async_stop(force=True)


async def test_real_setup_auth_crud_upload_export_and_reload(runtime):
    hass, base, token = runtime
    headers = {"Authorization": f"Bearer {token}"}
    async with aiohttp.ClientSession() as session:
        response = await session.get(base + "/api/medicine_cabinet/images/" + "a" * 64)
        assert response.status == 401
        response = await session.post(base + "/api/medicine_cabinet/export/csv", json={})
        assert response.status == 401
        response = await session.get(base + "/medicine_cabinet/frontend/medicine-cabinet.js")
        assert response.status == 200
        frontend_content = await response.read()
        assert b"medicine-cabinet-panel" in frontend_content
        module_url = hass.data[DATA_PANELS]["medicine-cabinet"].config["_panel_custom"][
            "module_url"
        ]
        assert module_url.endswith("&build=" + sha256(frontend_content).hexdigest()[:16])
        response = await session.get(base + module_url)
        assert response.status == 200
        assert await response.read() == frontend_content
        async with session.ws_connect(base + "/api/websocket") as ws:
            assert (await ws.receive_json())["type"] == "auth_required"
            await ws.send_json({"type": "auth", "access_token": token})
            assert (await ws.receive_json())["type"] == "auth_ok"
            sequence = 0

            async def request(operation, payload=None, revision=None):
                nonlocal sequence
                sequence += 1
                msg = {"id": sequence, "type": "medicine_cabinet/request", "operation": operation}
                if payload is not None:
                    msg["payload"] = payload
                if revision is not None:
                    msg["revision"] = revision
                await ws.send_json(msg)
                return await ws.receive_json()

            initial = await request("list")
            assert initial["success"]
            assert len(initial["result"]["categories"]) == 21
            initial = await request(
                "category_save",
                {"name": "Для питомца", "color": "#229977", "icon": "mdi:cat"},
                initial["result"]["revision"],
            )
            assert initial["success"], initial
            category_id = next(
                c["id"]
                for c in initial["result"]["categories"].values()
                if c["name"] == "Для питомца"
            )
            result = await request("kit_save", {"name": "Дача"}, initial["result"]["revision"])
            assert result["success"], result
            snapshot = result["result"]
            kit = next(iter(snapshot["kits"]))
            conflict = await request("kit_save", {"name": "Потерянное изменение"}, 0)
            assert conflict["error"]["code"] == "conflict"
            photo = BytesIO()
            Image.new("RGB", (120, 80), "#007f88").save(photo, "PNG")
            response = await session.post(
                base + "/api/medicine_cabinet/images", data=photo.getvalue(), headers=headers
            )
            assert response.status == 200, await response.text()
            image_id = (await response.json())["image_id"]
            result = await request(
                "package_save",
                {
                    "kit_id": kit,
                    "name": "Препарат",
                    "category_ids": [category_id, "default_travel"],
                    "info": "Дозировка и заметка",
                    "expires_on": (dt_util.now().date() + timedelta(days=120)).isoformat(),
                    "image_id": image_id,
                },
                snapshot["revision"],
            )
            assert result["success"], result
            snapshot = result["result"]
            for format in ("csv", "pdf"):
                response = await session.post(
                    base + f"/api/medicine_cabinet/export/{format}",
                    json={"kit_id": kit},
                    headers=headers,
                )
                assert response.status == 200, await response.text()
                content = await response.read()
                if format == "pdf":
                    text = "\n".join(
                        page.extract_text() for page in PdfReader(BytesIO(content)).pages
                    )
                    assert "Для питомца" in text and "Дорожная аптечка" in text
                    assert "Дозировка и заметка" in text and "Добавлено" not in text
                else:
                    rows = list(
                        csv.DictReader(StringIO(content.decode("utf-8-sig")), delimiter=";")
                    )
                    assert rows[0]["Категории"] == "Для питомца; Дорожная аптечка"
                    assert rows[0]["Доп. информация"] == "Дозировка и заметка"
            response = await session.get(
                base + f"/api/medicine_cabinet/images/{image_id}", headers=headers
            )
            assert response.status == 200
        entry = hass.config_entries.async_entries("medicine_cabinet")[0]
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        restored = hass.data["medicine_cabinet"].snapshot()
        assert restored["packages"] == snapshot["packages"]
        assert restored["categories"] == snapshot["categories"]
        assert restored["groups"] == snapshot["groups"]
        assert next(iter(restored["groups"].values()))["category_ids"] == [
            category_id,
            "default_travel",
        ]
        _, _, regular_token = await create_token(hass, "Семья", False)
        response = await session.post(
            base + "/api/medicine_cabinet/export/csv",
            json={"kit_id": kit},
            headers={"Authorization": f"Bearer {regular_token}"},
        )
        assert response.status == 200


async def test_real_notifications_dedup_replacement_finished(runtime):
    hass, _, _ = runtime
    manager = hass.data["medicine_cabinet"]
    entry = hass.config_entries.async_entries("medicine_cabinet")[0]
    delivered = []

    async def notify(call):
        delivered.append(deepcopy(call.data))

    hass.services.async_register("notify", "mobile_app_test", notify)
    # Direct entry options update without firing listeners in this test.
    with patch.object(
        type(manager),
        "options",
        property(
            lambda _: {
                "notification_time": "09:00:00",
                "notify_targets": ["mobile_app_test"],
                "persistent_notifications": True,
            }
        ),
    ):
        await manager.async_change("kit_save", {"name": "Дача"}, 0)
        kit = next(iter(manager.repo.data["kits"]))
        today = dt_util.now().date()
        payload = {
            "kit_id": kit,
            "name": "Тест",
            "expires_on": (today + timedelta(days=80)).isoformat(),
        }
        await manager.async_change("package_save", payload, 1)
        assert len(delivered) == 1
        await manager.async_tick(force=True)
        assert len(delivered) == 1
        await manager.repo.load()
        await manager.async_tick(force=True)
        assert len(delivered) == 1
        item = next(iter(manager.repo.data["packages"].values()))
        payload.update(
            id=item["id"],
            group_id=item["group_id"],
            expires_on=(today + timedelta(days=6)).isoformat(),
        )
        await manager.async_change("package_save", payload, 2)
        assert len(delivered) == 2
        assert delivered[-1]["title"] == "HAMB"
        assert delivered[-1]["message"] == (
            f"Аптечка: Дача\n«Тест» скоро просрочится.\nГоден до: {today + timedelta(days=6):%d.%m.%Y}"
        )
        payload["available"] = False
        await manager.async_change("package_save", payload, 3)
        await manager.async_tick(force=True)
        assert len(delivered) == 2
        assert manager._notification_ids == set()
        # A group action clears notices for every package in one transaction.
        payload.pop("id")
        payload["available"] = True
        await manager.async_change("package_save", payload, manager.repo.data["revision"])
        assert len(delivered) == 3
        assert len(manager._notification_ids) == 1
        group_payload = {"id": item["group_id"], "kit_id": kit, "available": False}
        await manager.async_change(
            "group_set_available", group_payload, manager.repo.data["revision"]
        )
        await manager.async_tick(force=True)
        assert len(delivered) == 3
        assert manager._notification_ids == set()
        await manager.async_change("group_delete", group_payload, manager.repo.data["revision"])
        assert manager.repo.data["packages"] == {}
        assert manager.repo.data["notifications"] == {}
        assert entry.state.value == "loaded"


@pytest.mark.parametrize("language", ["ru", "en"])
@pytest.mark.parametrize(
    ("days", "multiple", "expected_ru", "expected_en"),
    [
        (46, False, "«Тест» скоро просрочится.", "“Тест” expires soon."),
        (
            7,
            True,
            "Одна из упаковок «Тест» скоро просрочится.",
            "One of the packages of “Тест” expires soon.",
        ),
        (0, False, "Срок годности «Тест» истёк.", "“Тест” has expired."),
        (
            -1,
            True,
            "Одна из упаковок «Тест» уже просрочена.",
            "One of the packages of “Тест” has expired.",
        ),
    ],
)
async def test_notification_copy_and_package_scope(
    runtime, language, days, multiple, expected_ru, expected_en
):
    hass, _, _ = runtime
    manager = hass.data["medicine_cabinet"]
    delivered = []

    async def notify(call):
        delivered.append(deepcopy(call.data))

    async def seed(operation, **payload):
        # Prepare the whole inventory before the first notification check.
        await manager.repo.change(operation, payload, manager.repo.data["revision"])

    hass.services.async_register("notify", "mobile_app_copy", notify)
    await seed("kit_save", name="Дача")
    kit = next(iter(manager.repo.data["kits"]))
    expiry = dt_util.now().date() + timedelta(days=days)
    await seed("package_save", kit_id=kit, name="Тест", expires_on=expiry.isoformat())
    item = next(iter(manager.repo.data["packages"].values()))
    await seed(
        "package_save", kit_id=kit, group_id=item["group_id"], no_expiry=True, available=False
    )
    if multiple:
        await seed("package_save", kit_id=kit, group_id=item["group_id"], no_expiry=True)
    # Finished packages, a different dosage and medicines in other boxes do not
    # turn a single in-stock package into "one of the packages".
    await seed("package_save", kit_id=kit, name="Тест 500 мг", no_expiry=True)
    await seed("kit_save", name="Машина")
    other_kit = next(key for key in manager.repo.data["kits"] if key != kit)
    await seed("package_save", kit_id=other_kit, name="Тест", no_expiry=True)

    options = {
        **manager.options,
        "language": language,
        "notify_targets": ["mobile_app_copy"],
        "persistent_notifications": True,
    }
    with (
        patch.object(type(manager), "options", property(lambda _: options)),
        patch.object(
            persistent_notification, "async_create", wraps=persistent_notification.async_create
        ) as local_notice,
    ):
        await manager.async_tick(force=True)
        assert len(delivered) == 1
        expected_message = (
            f"Аптечка: Дача\n{expected_ru}\nГоден до: {expiry:%d.%m.%Y}"
            if language == "ru"
            else f"Medicine box: Дача\n{expected_en}\nExpiry date: {expiry:%d.%m.%Y}"
        )
        notice_id = f"medicine_cabinet_{item['id']}_{item['generation']}"
        assert delivered[0]["title"] == "HAMB"
        assert delivered[0]["message"] == expected_message
        assert delivered[0]["data"]["tag"] == notice_id
        local_notice.assert_called_once_with(hass, expected_message, "HAMB", notice_id)
        await manager.async_tick(force=True)
        assert len(delivered) == 1
        local_notice.assert_called_once()


async def test_options_flow_and_regular_user_can_edit(runtime):
    hass, base, _ = runtime
    entry = hass.config_entries.async_entries("medicine_cabinet")[0]
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    assert flow["type"] == "form"
    flow = await hass.config_entries.options.async_configure(flow["flow_id"], {"language": "ru"})
    result = await hass.config_entries.options.async_configure(
        flow["flow_id"],
        {
            "sidebar_title": "Аптечка",
            "notification_time": "10:15:00",
            "persistent_notifications": True,
            "notify_targets": [],
        },
    )
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()
    assert hass.data["medicine_cabinet"].options["notification_time"] == "10:15:00"
    _, _, token = await create_token(hass, "Обычный пользователь", False)
    async with (
        aiohttp.ClientSession() as session,
        session.ws_connect(base + "/api/websocket") as ws,
    ):
        await ws.receive_json()
        await ws.send_json({"type": "auth", "access_token": token})
        assert (await ws.receive_json())["type"] == "auth_ok"
        await ws.send_json(
            {
                "id": 1,
                "type": "medicine_cabinet/request",
                "operation": "kit_save",
                "payload": {"name": "Семейная"},
                "revision": 0,
            }
        )
        result = await ws.receive_json()
        assert result["success"], result


async def test_backup_copy_restores_records_photos_and_notification_ledger(
    runtime, tmp_path, unused_tcp_port
):
    from custom_components.medicine_cabinet.images import save_image

    hass, _, _ = runtime
    manager = hass.data["medicine_cabinet"]
    await manager.async_change("kit_save", {"name": "Дача"}, 0)
    kit = next(iter(manager.repo.data["kits"]))
    photo = BytesIO()
    Image.new("RGB", (40, 40), "white").save(photo, "PNG")
    image_id = await hass.async_add_executor_job(save_image, photo.getvalue(), manager.media_dir)
    await manager.async_change(
        "package_save",
        {
            "kit_id": kit,
            "name": "Из резервной копии",
            "expires_on": (dt_util.now().date() + timedelta(days=20)).isoformat(),
            "image_id": image_id,
        },
        1,
    )
    await manager.async_change(
        "package_save",
        {"kit_id": kit, "name": "Без срока из копии", "no_expiry": True},
        manager.repo.data["revision"],
    )
    saved = deepcopy(manager.repo.data)
    await hass.async_stop(force=True)
    destination = tmp_path / "restored"
    (destination / ".storage").mkdir(parents=True)
    shutil.copy2(
        Path(hass.config.config_dir) / ".storage/medicine_cabinet",
        destination / ".storage/medicine_cabinet",
    )
    shutil.copytree(manager.media_dir, destination / "medicine_cabinet/images")
    restored = await start_hass(destination, unused_tcp_port)
    try:
        result = restored.data["medicine_cabinet"]
        assert result.repo.data == saved
        assert (result.media_dir / f"{image_id}.jpg").read_bytes() == (
            manager.media_dir / f"{image_id}.jpg"
        ).read_bytes()
    finally:
        await restored.async_stop(force=True)


async def test_no_expiry_does_not_notify_and_dismisses_old_notices(runtime):
    hass, _, _ = runtime
    manager = hass.data["medicine_cabinet"]
    delivered = []

    async def notify(call):
        delivered.append(deepcopy(call.data))

    hass.services.async_register("notify", "mobile_app_test", notify)
    with patch.object(
        type(manager),
        "options",
        property(
            lambda _: {
                "notification_time": "09:00:00",
                "notify_targets": ["mobile_app_test"],
                "persistent_notifications": True,
            }
        ),
    ):
        await manager.async_change("kit_save", {"name": "Бессрочные"}, 0)
        kit = next(iter(manager.repo.data["kits"]))
        payload = {"kit_id": kit, "name": "Без срока", "no_expiry": True}
        await manager.async_change("package_save", payload, manager.repo.data["revision"])
        await manager.async_tick(force=True)
        assert delivered == [] and manager._notification_ids == set()
        item = next(iter(manager.repo.data["packages"].values()))
        payload.update(
            id=item["id"],
            group_id=item["group_id"],
            no_expiry=False,
            expires_on=(dt_util.now().date() + timedelta(days=3)).isoformat(),
        )
        await manager.async_change("package_save", payload, manager.repo.data["revision"])
        assert len(delivered) == 1 and len(manager._notification_ids) == 1
        payload.update(no_expiry=True, expires_on=None)
        await manager.async_change("package_save", payload, manager.repo.data["revision"])
        assert manager._notification_ids == set()
        assert manager.repo.data["notifications"] == {}
        entry = hass.config_entries.async_entries("medicine_cabinet")[0]
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        manager = hass.data["medicine_cabinet"]
        await manager.async_tick(force=True)
        assert len(delivered) == 1 and manager._notification_ids == set()
        assert manager.snapshot()["packages"][item["id"]]["expires_on"] is None
        payload.update(
            no_expiry=False, expires_on=(dt_util.now().date() + timedelta(days=2)).isoformat()
        )
        await manager.async_change("package_save", payload, manager.repo.data["revision"])
        assert len(delivered) == 2


@pytest.mark.parametrize("language, default_title", [("ru", "Аптечка"), ("en", "Medicine Box")])
async def test_initial_language_title_and_later_options(
    tmp_path, unused_tcp_port, language, default_title
):
    from homeassistant.components.frontend import DATA_PANELS

    hass = await start_hass(tmp_path, unused_tcp_port, setup_integration=False)
    try:
        flow = await hass.config_entries.flow.async_init(
            "medicine_cabinet", context={"source": "user"}
        )
        schema = flow["data_schema"].schema
        select = next(iter(schema.values()))
        assert select.config["mode"] == "list"
        assert not select.config.get("multiple", False)
        assert {item["value"] for item in select.config["options"]} == {"ru", "en"}
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"language": language}
        )
        assert flow["step_id"] == "name"
        assert next(iter(flow["data_schema"].schema)).default() == default_title
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"sidebar_title": "   "}
        )
        assert flow["errors"] == {"sidebar_title": "invalid_title"}
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"sidebar_title": default_title}
        )
        assert flow["type"] == "create_entry"
        await hass.async_block_till_done()
        entry = hass.config_entries.async_entries("medicine_cabinet")[0]
        assert hass.data[DATA_PANELS]["medicine-cabinet"].sidebar_title == default_title
        manager = hass.data["medicine_cabinet"]
        assert manager.snapshot()["settings"] == {
            "language": language,
            "sidebar_title": default_title,
        }
        await manager.async_change("kit_save", {"name": "Личные названия не переводятся"}, 0)
        saved = manager.snapshot()["kits"]
        other_language = "en" if language == "ru" else "ru"
        other_title = "Medicine Box" if other_language == "en" else "Аптечка"
        options = await hass.config_entries.options.async_init(entry.entry_id)
        options = await hass.config_entries.options.async_configure(
            options["flow_id"], {"language": other_language}
        )
        assert next(iter(options["data_schema"].schema)).default() == other_title
        custom = 'Семейная <аптечка> & "Box"'
        result = await hass.config_entries.options.async_configure(
            options["flow_id"],
            {
                "sidebar_title": custom,
                "notification_time": "10:15:00",
                "persistent_notifications": True,
                "notify_targets": [],
            },
        )
        assert result["type"] == "create_entry"
        await hass.async_block_till_done()
        assert hass.data[DATA_PANELS]["medicine-cabinet"].sidebar_title == custom
        assert hass.data["medicine_cabinet"].snapshot()["kits"] == saved
        assert hass.data["medicine_cabinet"].snapshot()["settings"] == {
            "language": other_language,
            "sidebar_title": custom,
        }
        options = await hass.config_entries.options.async_init(entry.entry_id)
        options = await hass.config_entries.options.async_configure(
            options["flow_id"], {"language": language}
        )
        assert next(iter(options["data_schema"].schema)).default() == custom
        hass.config_entries.options.async_abort(options["flow_id"])
        duplicate = await hass.config_entries.flow.async_init(
            "medicine_cabinet", context={"source": "user"}
        )
        assert duplicate["type"] == "abort" and duplicate["reason"] in (
            "already_configured",
            "single_instance_allowed",
        )
    finally:
        await hass.async_stop(force=True)


async def test_english_notifications_errors_and_legacy_defaults(runtime):
    from homeassistant.components.frontend import DATA_PANELS

    hass, base, token = runtime
    entry = hass.config_entries.async_entries("medicine_cabinet")[0]
    # Entries without presentation settings use the default language and title.
    hass.config_entries.async_update_entry(entry, options={})
    await hass.async_block_till_done()
    assert hass.data["medicine_cabinet"].snapshot()["settings"] == {
        "language": "ru",
        "sidebar_title": "Аптечка",
    }
    assert hass.data[DATA_PANELS]["medicine-cabinet"].sidebar_title == "Аптечка"
    delivered = []

    async def notify(call):
        delivered.append(deepcopy(call.data))

    hass.services.async_register("notify", "mobile_app_english", notify)
    hass.config_entries.async_update_entry(
        entry,
        options={
            "language": "en",
            "sidebar_title": "My medicines",
            "notify_targets": ["mobile_app_english"],
        },
    )
    await hass.async_block_till_done()
    manager = hass.data["medicine_cabinet"]
    await manager.async_change("kit_save", {"name": "Дача"}, 0)
    kit = next(iter(manager.repo.data["kits"]))
    await manager.async_change(
        "package_save",
        {"kit_id": kit, "name": "Парацетамол", "expires_on": "2020-01-01"},
        manager.repo.data["revision"],
    )
    assert len(delivered) == 1
    assert delivered[0]["title"] == "HAMB"
    assert delivered[0]["message"] == (
        "Medicine box: Дача\n“Парацетамол” has expired.\nExpiry date: 01.01.2020"
    )
    headers = {"Authorization": f"Bearer {token}"}
    async with aiohttp.ClientSession() as session:
        response = await session.post(
            base + "/api/medicine_cabinet/export/csv", json={"kit_id": kit}, headers=headers
        )
        csv = (await response.read()).decode("utf-8-sig")
        assert "Medicine Box;Medicine;Package" in csv
        assert "Дача;Парацетамол" in csv
        response = await session.post(
            base + "/api/medicine_cabinet/images", data=b"not an image", headers=headers
        )
        assert response.status == 400
        assert (await response.json())[
            "message"
        ] == "Could not read the photo. Choose JPEG, PNG, or WebP"


async def test_export_expiry_selection_and_finished_union(runtime):
    import csv
    from io import StringIO

    from pypdf import PdfReader

    hass, base, token = runtime
    manager = hass.data["medicine_cabinet"]

    async def change(operation, **payload):
        return await manager.async_change(operation, payload, manager.repo.data["revision"])

    state = await change("kit_save", name="Export selection")
    kit = next(iter(state["kits"]))
    today = dt_util.now().date()
    present = {}
    finished = set()
    for available in (True, False):
        for days in (-1, 0, 1, 7, 8, 90, 91, None):
            name = f"{'Present' if available else 'Finished'}_{days}_pack"
            await change(
                "package_save",
                kit_id=kit,
                name=name,
                available=available,
                no_expiry=days is None,
                expires_on=None if days is None else (today + timedelta(days=days)).isoformat(),
            )
            if available:
                present[days] = name
            else:
                finished.add(name)
    before = deepcopy(manager.repo.data)
    state = await change("kit_save", name="Other cabinet")
    other = next(k for k in state["kits"] if k != kit)
    await change(
        "package_save", kit_id=other, name="Other_finished_pack", available=False, no_expiry=True
    )
    selections = {
        "expired": {-1, 0},
        "within_90": {-1, 0, 1, 7, 8, 90},
        "over_90": {91},
        "all": set(present),
    }
    headers = {"Authorization": f"Bearer {token}"}
    async with aiohttp.ClientSession() as session:
        for expiry, days in selections.items():
            for include_finished in (True, False):
                expected = {present[d] for d in days} | (finished if include_finished else set())
                for format in ("csv", "pdf"):
                    response = await session.post(
                        base + f"/api/medicine_cabinet/export/{format}",
                        headers=headers,
                        json={
                            "kit_id": kit,
                            "expiry": expiry,
                            "include_finished": include_finished,
                        },
                    )
                    assert response.status == 200, await response.text()
                    content = await response.read()
                    if format == "csv":
                        rows = list(
                            csv.DictReader(StringIO(content.decode("utf-8-sig")), delimiter=";")
                        )
                        assert {r["Препарат"] for r in rows} == expected
                        assert len(rows) == len(expected)  # No duplicate finished+expired rows.
                    else:
                        text = "\n".join(
                            p.extract_text() for p in PdfReader(BytesIO(content)).pages
                        )
                        for name in set(present.values()) | finished:
                            assert (name in text) == (name in expected)
                        assert "Other_finished_pack" not in text
        for invalid in (
            {"expiry": "due_90"},
            {"expiry": None},
            {"expiry": []},
            {"include_finished": "false"},
            {"include_finished": 1},
        ):
            response = await session.post(
                base + "/api/medicine_cabinet/export/csv",
                headers=headers,
                json={"kit_id": kit, **invalid},
            )
            assert response.status == 400
    assert {
        k: p for k, p in manager.repo.data["packages"].items() if k in before["packages"]
    } == before["packages"]


async def test_category_management_over_websocket_and_empty_catalog_survives_restart(runtime):
    hass, base, token = runtime
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(base + "/api/websocket") as ws:
            assert (await ws.receive_json())["type"] == "auth_required"
            await ws.send_json({"type": "auth", "access_token": token})
            assert (await ws.receive_json())["type"] == "auth_ok"
            sequence = 0
            revision = None

            async def request(operation, payload=None):
                nonlocal sequence, revision
                sequence += 1
                message = {
                    "id": sequence,
                    "type": "medicine_cabinet/request",
                    "operation": operation,
                }
                if payload is not None:
                    message.update(payload=payload, revision=revision)
                await ws.send_json(message)
                result = await ws.receive_json()
                assert result["success"], result
                revision = result["result"]["revision"]
                return result["result"]

            await request("list")
            data = await request("kit_save", {"name": "Тест"})
            kit = next(iter(data["kits"]))
            data = await request(
                "package_save",
                {
                    "kit_id": kit,
                    "name": "Пластырь",
                    "no_expiry": True,
                    "category_ids": ["default_allergy", "default_travel"],
                },
            )
            packages = data["packages"]
            data = await request(
                "category_save",
                {
                    "id": "default_allergy",
                    "name": "Своя категория",
                    "color": "#112233",
                    "icon": "mdi:cat",
                },
            )
            assert data["categories"]["default_allergy"]["name"] == "Своя категория"
            data = await request("category_delete", {"id": "default_allergy"})
            assert next(iter(data["groups"].values()))["category_ids"] == ["default_travel"]
            data = await request("categories_clear", {})
            assert data["categories"] == {}
            assert next(iter(data["groups"].values()))["category_ids"] == []
            assert data["packages"] == {
                key: {**item, "category_ids": []} for key, item in packages.items()
            }
    entry = hass.config_entries.async_entries("medicine_cabinet")[0]
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    restored = hass.data["medicine_cabinet"].snapshot()
    assert restored["categories"] == {}
    assert restored["groups"] == data["groups"]
    assert restored["packages"] == data["packages"]


async def test_group_photo_update_validates_upload_and_persists_all_packages(runtime):
    hass, base, token = runtime
    headers = {"Authorization": f"Bearer {token}"}
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(base + "/api/websocket") as ws:
            assert (await ws.receive_json())["type"] == "auth_required"
            await ws.send_json({"type": "auth", "access_token": token})
            assert (await ws.receive_json())["type"] == "auth_ok"
            sequence = 0
            state = hass.data["medicine_cabinet"].snapshot()

            async def request(operation, payload):
                nonlocal sequence, state
                sequence += 1
                await ws.send_json(
                    {
                        "id": sequence,
                        "type": "medicine_cabinet/request",
                        "operation": operation,
                        "payload": payload,
                        "revision": state["revision"],
                    }
                )
                response = await ws.receive_json()
                if response["success"]:
                    state = response["result"]
                return response

            assert (await request("kit_save", {"name": "Групповое редактирование"}))["success"]
            kit = next(iter(state["kits"]))
            for date in ("2030-01-01", "2031-02-02"):
                assert (
                    await request(
                        "package_save",
                        {"kit_id": kit, "name": "Препарат", "expires_on": date, "info": date},
                    )
                )["success"]
            group = next(iter(state["groups"]))
            before = deepcopy(state)
            bad = await request("group_save", {"id": group, "kit_id": kit, "image_id": "f" * 64})
            assert bad["success"] is False
            assert "Фотография не найдена" in bad["error"]["message"]
            assert hass.data["medicine_cabinet"].snapshot() == before
            photo = BytesIO()
            Image.new("RGB", (50, 50), "#dd6633").save(photo, "PNG")
            response = await session.post(
                base + "/api/medicine_cabinet/images", data=photo.getvalue(), headers=headers
            )
            assert response.status == 200
            image = (await response.json())["image_id"]
            assert (await request("group_save", {"id": group, "kit_id": kit, "image_id": image}))[
                "success"
            ]
            for key, item in state["packages"].items():
                assert item["image_id"] == image
                assert item["expires_on"] == before["packages"][key]["expires_on"]
                assert item["info"] == before["packages"][key]["info"]
                assert item["added_at"] == before["packages"][key]["added_at"]
    entry = hass.config_entries.async_entries("medicine_cabinet")[0]
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data["medicine_cabinet"].snapshot()["packages"] == state["packages"]
