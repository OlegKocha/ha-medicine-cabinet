import asyncio
import json
from copy import deepcopy
from io import BytesIO
from pathlib import Path
from threading import Event
from unittest.mock import AsyncMock, patch
from zipfile import ZipFile

import aiohttp
import pytest

from custom_components.medicine_cabinet import manager as manager_module
from custom_components.medicine_cabinet.model import InventoryError
from tests.ha_runtime import create_token, start_hass


@pytest.fixture
async def runtime(tmp_path, unused_tcp_port):
    hass = await start_hass(tmp_path, unused_tcp_port)
    _, _, token = await create_token(hass)
    try:
        yield hass, f"http://127.0.0.1:{unused_tcp_port}", token
    finally:
        await hass.async_stop(force=True)


async def seed(hass):
    manager = hass.data["medicine_cabinet"]
    image_id = await manager.async_save_image(
        Path("tests/fixtures/photo.png").read_bytes(), manager.media_epoch
    )
    await manager.async_change("kit_save", {"name": "Дача"}, manager.repo.data["revision"])
    kit = next(iter(manager.repo.data["kits"]))
    await manager.async_change(
        "package_save",
        {"kit_id": kit, "name": "Test", "no_expiry": True, "count": 2, "image_id": image_id},
        manager.repo.data["revision"],
    )
    await manager.async_change(
        "audit_complete", {"kit_id": kit, "checks": []}, manager.repo.data["revision"]
    )
    return manager, image_id


async def test_admin_backup_authorization_and_clear_are_durable(runtime):
    hass, base, admin_token = runtime
    manager, image_id = await seed(hass)
    original = deepcopy(manager.repo.data)
    entry = manager.entry
    options = deepcopy(dict(entry.options))
    _, _, member_token = await create_token(hass, "Member", False)
    async with aiohttp.ClientSession() as session:
        response = await session.get(base + "/api/medicine_cabinet/backup")
        assert response.status == 401
        response = await session.get(
            base + "/api/medicine_cabinet/backup",
            headers={"Authorization": f"Bearer {member_token}"},
        )
        assert response.status == 403
        response = await session.get(
            base + "/api/medicine_cabinet/backup",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status == 200
        assert response.headers["Cache-Control"] == "no-store"
        backup = await response.read()
        with ZipFile(BytesIO(backup)) as bundle:
            assert json.loads(bundle.read(".storage/medicine_cabinet"))["data"] == original
            assert bundle.read(f"medicine_cabinet/images/{image_id}.jpg")

        for token, admin in [(member_token, False), (admin_token, True)]:
            async with session.ws_connect(base + "/api/websocket") as ws:
                await ws.receive_json()
                await ws.send_json({"type": "auth", "access_token": token})
                assert (await ws.receive_json())["type"] == "auth_ok"
                sequence = 0

                async def request(operation, payload=None, revision=None):
                    nonlocal sequence
                    sequence += 1
                    message = {
                        "id": sequence,
                        "type": "medicine_cabinet/request",
                        "operation": operation,
                        "payload": payload or {},
                    }
                    if revision is not None:
                        message["revision"] = revision
                    await ws.send_json(message)
                    return await ws.receive_json()

                if not admin:
                    for operation in ("storage_info", "storage_cleanup", "storage_clear"):
                        result = await request(
                            operation, {"confirmation": "DELETE"}, original["revision"]
                        )
                        assert result["error"]["code"] == "unauthorized"
                    assert manager.repo.data == original
                    continue
                info = await request("storage_info")
                assert info["result"]["packages"] == 2 and info["result"]["photos"] == 1
                assert (await request("storage_clear", revision=original["revision"]))["error"][
                    "code"
                ] == "invalid"
                assert (await request("storage_clear", {"confirmation": "DELETE"}))["error"][
                    "code"
                ] == "invalid"
                assert (
                    await request(
                        "storage_clear", {"confirmation": "DELETE"}, original["revision"] - 1
                    )
                )["error"]["code"] == "conflict"
                assert manager.repo.data == original
                epoch = manager.media_epoch
                result = await request(
                    "storage_clear", {"confirmation": "DELETE"}, original["revision"]
                )
                assert result["success"], result
                assert result["result"]["removed"] == 1
                assert not list(manager.media_dir.glob("*.jpg"))
                assert result["result"]["storage"]["packages"] == 0
                with pytest.raises(InventoryError, match="Данные изменились"):
                    await manager.async_save_image(
                        Path("tests/fixtures/photo.png").read_bytes(), epoch
                    )
                assert (await request("kit_save", {"name": "Stale"}, original["revision"]))[
                    "error"
                ]["code"] == "conflict"
    cleared = deepcopy(manager.repo.data)
    assert cleared["revision"] == original["revision"] + 1
    assert all(
        not cleared[k] for k in ("kits", "groups", "packages", "categories", "notifications")
    )
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data["medicine_cabinet"].repo.data == cleared
    assert dict(entry.options) == options
    # The ZIP contains an HA Store file that can actually be restored and reloaded.
    await hass.config_entries.async_unload(entry.entry_id)
    with ZipFile(BytesIO(backup)) as bundle:
        await hass.async_add_executor_job(bundle.extractall, hass.config.config_dir)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data["medicine_cabinet"].repo.data == original


async def test_failed_store_write_does_not_remove_data_or_photos(runtime):
    hass, _, _ = runtime
    manager, image_id = await seed(hass)
    before = deepcopy(manager.repo.data)
    with patch.object(
        manager.repo.store, "async_save", AsyncMock(side_effect=OSError("disk full"))
    ):
        with pytest.raises(OSError):
            await manager.async_storage_change(
                "storage_clear", {"confirmation": "DELETE"}, before["revision"]
            )
    assert manager.repo.data == before
    assert (manager.media_dir / f"{image_id}.jpg").is_file()


@pytest.mark.parametrize("cancel", [False, True])
async def test_reset_waits_for_backup_worker_even_after_request_cancellation(runtime, cancel):
    hass, _, _ = runtime
    manager, image_id = await seed(hass)
    revision = manager.repo.data["revision"]
    started, release = Event(), Event()
    original = manager_module.build_backup
    result = []

    def held_backup(*args):
        started.set()
        assert release.wait(10)
        result.append(original(*args))
        return result[-1]

    with patch.object(manager_module, "build_backup", held_backup):
        backup = asyncio.create_task(manager.async_backup())
        assert await hass.async_add_executor_job(started.wait, 5)
        if cancel:
            backup.cancel()
        clear = asyncio.create_task(
            manager.async_storage_change("storage_clear", {"confirmation": "DELETE"}, revision)
        )
        await asyncio.sleep(0)
        assert not clear.done()
        assert (manager.media_dir / f"{image_id}.jpg").is_file()
        release.set()
        if cancel:
            with pytest.raises(asyncio.CancelledError):
                await backup
            assert result[0][0].closed
        else:
            archive, _ = await backup
            with archive, ZipFile(archive) as bundle:
                assert f"medicine_cabinet/images/{image_id}.jpg" in bundle.namelist()
        await clear
    assert manager.repo.data["packages"] == {}


async def test_photo_cleanup_failure_still_publishes_committed_reset(runtime):
    hass, _, _ = runtime
    manager, _ = await seed(hass)
    revision = manager.repo.data["revision"]
    with (
        patch.object(manager_module, "clean_photos", side_effect=PermissionError("denied")),
        patch.object(manager, "changed") as changed,
    ):
        with pytest.raises(PermissionError):
            await manager.async_storage_change(
                "storage_clear", {"confirmation": "DELETE"}, revision
            )
        changed.assert_called_once()
    assert manager.repo.data["revision"] == revision + 1
    assert manager.repo.data["packages"] == {}
    # Retrying the now-unreferenced photo cleanup is safe after fixing permissions.
    result = await manager.async_storage_change(
        "storage_clear", {"confirmation": "DELETE"}, revision + 1
    )
    assert result["removed"] == 1
