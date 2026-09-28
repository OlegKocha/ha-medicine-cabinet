from copy import deepcopy
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.medicine_cabinet.model import (
    InventoryError,
    empty_inventory,
    expiry_status,
    load_inventory,
    mutate,
    notification_key,
    notification_stage,
    public_snapshot,
    select_packages,
)
from custom_components.medicine_cabinet.repository import Repository

NOW = datetime(2026, 9, 20, 12, tzinfo=ZoneInfo("Europe/Moscow"))


def change(data, op, **payload):
    return mutate(data, op, payload, data["revision"], NOW)


def inventory(expires="2026-10-01"):
    data = change(empty_inventory(), "kit_save", name="Дача")
    kit = next(iter(data["kits"]))
    data = change(
        data,
        "package_save",
        kit_id=kit,
        name="Препарат А",
        expires_on=expires,
        info="Дозировка и заметки",
    )
    return data, kit, next(iter(data["packages"]))


@pytest.mark.parametrize(
    ("days", "status", "stage"),
    [
        (91, "ok", None),
        (90, "due_90", 90),
        (8, "due_90", 90),
        (7, "due_7", 7),
        (1, "due_7", 7),
        (0, "expired", 7),
        (-1, "expired", 7),
    ],
)
def test_expiry_boundaries(days, status, stage):
    data, _, item_id = inventory((NOW.date() + timedelta(days=days)).isoformat())
    item = data["packages"][item_id]
    assert expiry_status(item, NOW.date()) == status
    assert notification_stage(item, NOW.date()) == stage


def test_local_midnight_and_date_added():
    data, _, item_id = inventory("2026-10-01")
    before = datetime(2026, 9, 30, 23, 59, tzinfo=NOW.tzinfo)
    after = before + timedelta(minutes=1)
    assert public_snapshot(data, before)["packages"][item_id]["status"] == "due_7"
    assert public_snapshot(data, after)["packages"][item_id]["status"] == "expired"
    assert data["packages"][item_id]["added_at"] == NOW.isoformat()


def test_replacement_only_updates_one_package():
    data, kit, item_id = inventory("2026-09-01")
    group = data["packages"][item_id]["group_id"]
    data = change(data, "package_save", kit_id=kit, group_id=group, expires_on="2027-01-01")
    other_id = next(k for k in data["packages"] if k != item_id)
    original = deepcopy(data)
    later = NOW + timedelta(days=1)
    result = mutate(
        data,
        "package_save",
        dict(id=item_id, kit_id=kit, group_id=group, expires_on="2027-02-01", available=False),
        data["revision"],
        later,
    )
    item = result["packages"][item_id]
    assert item["added_at"] == later.isoformat()
    assert item["created_at"] == NOW.isoformat()
    assert item["available"] is True
    assert item["generation"] == 2
    assert result["packages"][other_id] == data["packages"][other_id]
    assert data == original


def test_note_edit_does_not_reset_date_or_notifications():
    data, kit, item_id = inventory()
    item = data["packages"][item_id]
    data["notifications"][notification_key(item, 90)] = ["persistent"]
    result = mutate(
        data,
        "package_save",
        dict(
            id=item_id,
            kit_id=kit,
            group_id=item["group_id"],
            expires_on=item["expires_on"],
            info="Новая заметка",
        ),
        data["revision"],
        NOW + timedelta(days=2),
    )
    assert result["packages"][item_id]["added_at"] == item["added_at"]
    assert result["notifications"] == data["notifications"]


@pytest.mark.parametrize("name", ["Препарат А", "препарат а", "  Препарат   А  "])
def test_same_name_packages_join_existing_group(name):
    data, kit, item_id = inventory()
    data = change(data, "package_save", kit_id=kit, name=name, expires_on="2027-01-01")
    assert len(data["groups"]) == 1
    data = change(
        data,
        "package_save",
        kit_id=kit,
        group_id=data["packages"][item_id]["group_id"],
        expires_on="2027-02-01",
    )
    assert len(data["groups"]) == 1
    assert len(data["packages"]) == 3
    assert {p["group_id"] for p in data["packages"].values()} == {
        data["packages"][item_id]["group_id"]
    }
    assert [p["number"] for p in public_snapshot(data, NOW)["packages"].values()] == [1, 2, 3]


def test_finished_retained_and_no_notifications():
    data, kit, item_id = inventory()
    item = data["packages"][item_id]
    data = change(
        data,
        "package_save",
        id=item_id,
        kit_id=kit,
        group_id=item["group_id"],
        expires_on=item["expires_on"],
        available=False,
    )
    assert notification_stage(data["packages"][item_id], NOW.date()) is None
    assert item_id in data["packages"]


def test_deletion_is_scoped_and_cleans_ledger():
    data, kit, item_id = inventory()
    data["notifications"][notification_key(data["packages"][item_id], 90)] = ["persistent"]
    data = change(data, "kit_save", name="Квартира")
    other = next(k for k in data["kits"] if k != kit)
    data = change(data, "package_save", kit_id=other, name="Другое", expires_on="2028-01-01")
    result = change(data, "kit_delete", id=kit)
    assert len(result["packages"]) == 1
    assert result["notifications"] == {}
    assert other in result["kits"]


@pytest.mark.parametrize("value", ["2026-02-30", "01.10.2026", "20261001", "", None, "2026-1-1"])
def test_invalid_dates(value):
    with pytest.raises(InventoryError):
        inventory(value)


def test_reject_cross_cabinet_group_and_path_traversal():
    data, kit, item_id = inventory()
    group = data["packages"][item_id]["group_id"]
    data = change(data, "kit_save", name="Авто")
    other = next(k for k in data["kits"] if k != kit)
    with pytest.raises(InventoryError):
        change(data, "package_save", kit_id=other, group_id=group, expires_on="2027-01-01")
    with pytest.raises(InventoryError):
        change(
            data,
            "package_save",
            kit_id=kit,
            group_id=group,
            expires_on="2027-01-01",
            image_id="../../secrets.yaml",
        )


def test_filter_and_snapshot_do_not_leak_notification_state():
    data, kit, item_id = inventory()
    snapshot = public_snapshot(data, NOW)
    assert "notifications" not in snapshot
    assert len(select_packages(snapshot, kit, query="заметки")) == 1
    assert not select_packages(snapshot, kit, status="expired")
    with pytest.raises(InventoryError):
        select_packages(snapshot, kit, status="invalid")


def test_invalid_storage_not_silently_reset():
    with pytest.raises(InventoryError):
        load_inventory({"schema": 4})
    with pytest.raises(InventoryError):
        load_inventory({"schema": 1})


class MemoryStore:
    def __init__(self):
        self.data = None
        self.fail = False

    async def async_load(self):
        return deepcopy(self.data)

    async def async_save(self, data):
        if self.fail:
            raise OSError("disk full")
        self.data = deepcopy(data)


async def test_durable_transaction_and_conflict():
    store = MemoryStore()
    repo = Repository(store, lambda: NOW)
    await repo.load()
    await repo.change("kit_save", {"name": "Дача"}, 0)
    with pytest.raises(InventoryError, match="другом устройстве"):
        await repo.change("kit_save", {"name": "Авто"}, 0)
    assert len(repo.data["kits"]) == 1
    restored = Repository(store, lambda: NOW)
    await restored.load()
    assert restored.snapshot() == repo.snapshot()
    store.fail = True
    with pytest.raises(OSError):
        await repo.change("kit_save", {"name": "Авто"}, 1)
    assert repo.data["revision"] == 1
    assert len(repo.data["kits"]) == 1


async def test_stopping_repository_rejects_new_writes():
    repo = Repository(MemoryStore(), lambda: NOW)
    repo.accept_changes = False
    with pytest.raises(InventoryError, match="перезагружается"):
        await repo.change("kit_save", {"name": "Дача"}, 0)
    assert repo.data["revision"] == 0


def test_group_numbers_survive_interleaved_additions_and_compact_after_deletion():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(data, "package_save", kit_id=kit, name="Другое", expires_on="2027-01-01")
    other = next(p for p in data["packages"] if p != first)
    data = change(data, "package_save", kit_id=kit, group_id=group, expires_on="2026-10-01")
    second = next(p for p in data["packages"] if p not in (first, other))
    # Existing beta storage uses a global ordinal. The new display must not change
    # package IDs, dates, photos, or notification identities during an upgrade.
    data["notifications"][notification_key(data["packages"][second], 90)] = ["persistent"]
    original = deepcopy(data)
    snapshot = public_snapshot(load_inventory(data), NOW)
    assert [snapshot["packages"][p]["number"] for p in (first, other, second)] == [1, 1, 2]
    assert data == original
    for package_id, item in data["packages"].items():
        for field in ("id", "added_at", "expires_on", "image_id", "generation"):
            assert snapshot["packages"][package_id][field] == item[field]
    filtered = select_packages(snapshot, kit, query="Препарат А")
    assert [p["number"] for p in filtered] == [1, 2]
    remaining = change(data, "package_delete", id=first)
    assert public_snapshot(remaining, NOW)["packages"][second]["number"] == 1
    assert remaining["notifications"] == data["notifications"]


def grouped_inventory():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(
        data,
        "package_save",
        kit_id=kit,
        group_id=group,
        expires_on="2028-01-01",
        available=False,
        info="Другая заметка",
        image_id="a" * 64,
    )
    target_ids = set(data["packages"])
    # Different dosages and identical names in other cabinets remain separate.
    data = change(
        data, "package_save", kit_id=kit, name="Препарат А 500 мг", expires_on="2029-01-01"
    )
    data = change(data, "kit_save", name="Дом")
    other_kit = next(k for k in data["kits"] if k != kit)
    data = change(
        data, "package_save", kit_id=other_kit, name="Препарат А", expires_on="2029-01-01"
    )
    data["notifications"] = {
        notification_key(p, 90): ["persistent"] for p in data["packages"].values()
    }
    return data, kit, group, target_ids, other_kit


def test_group_availability_preserves_package_content_and_other_groups():
    data, kit, group, target_ids, _ = grouped_inventory()
    original = deepcopy(data)
    later = NOW + timedelta(days=1)
    result = mutate(
        data,
        "group_set_available",
        {"id": group, "kit_id": kit, "available": False},
        data["revision"],
        later,
    )
    for item_id, before in data["packages"].items():
        expected = deepcopy(before)
        if item_id in target_ids and before["available"]:
            expected.update(available=False, updated_at=later.isoformat())
        assert result["packages"][item_id] == expected
    assert result["notifications"] == data["notifications"]
    assert all(notification_stage(result["packages"][i], later.date()) is None for i in target_ids)
    restored = change(result, "group_set_available", id=group, kit_id=kit, available=True)
    assert all(restored["packages"][i]["available"] for i in target_ids)
    assert restored["notifications"] == data["notifications"]
    assert data == original


def test_group_delete_removes_only_selected_packages_and_their_notifications():
    data, kit, group, target_ids, _ = grouped_inventory()
    original = deepcopy(data)
    result = change(data, "group_delete", id=group, kit_id=kit)
    assert result["packages"] == {k: v for k, v in data["packages"].items() if k not in target_ids}
    assert result["groups"] == {k: v for k, v in data["groups"].items() if k != group}
    assert result["kits"] == data["kits"]
    assert result["notifications"] == {
        notification_key(p, 90): ["persistent"] for p in result["packages"].values()
    }
    assert result["revision"] == data["revision"] + 1
    assert data == original


@pytest.mark.parametrize("operation", ["group_set_available", "group_delete"])
async def test_group_transaction_is_atomic_and_rejects_stale_confirmation(operation):
    data, kit, group, _, other_kit = grouped_inventory()
    store = MemoryStore()
    store.data = deepcopy(data)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    payload = {"id": group, "kit_id": kit, "available": False}
    with pytest.raises(InventoryError):
        await repo.change(operation, {**payload, "kit_id": other_kit}, data["revision"])
    with pytest.raises(InventoryError):
        await repo.change(operation, {**payload, "id": "missing"}, data["revision"])
    store.fail = True
    with pytest.raises(OSError):
        await repo.change(operation, payload, data["revision"])
    assert repo.data == store.data == data
    store.fail = False
    # A package added after the confirmation was opened must not be deleted.
    await repo.change(
        "package_save",
        {"kit_id": kit, "group_id": group, "expires_on": "2029-01-01"},
        data["revision"],
    )
    changed = deepcopy(repo.data)
    with pytest.raises(InventoryError, match="другом устройстве"):
        await repo.change(operation, payload, data["revision"])
    assert repo.data == store.data == changed
    await repo.change(operation, payload, changed["revision"])
    assert repo.data == store.data
    assert repo.data["revision"] == changed["revision"] + 1


@pytest.mark.parametrize("available", [None, "false", 0])
def test_group_availability_requires_boolean(available):
    data, kit, group, _, _ = grouped_inventory()
    original = deepcopy(data)
    with pytest.raises(InventoryError):
        change(data, "group_set_available", id=group, kit_id=kit, available=available)
    assert data == original


def test_no_expiry_is_explicit_and_survives_storage_and_time():
    data = change(empty_inventory(), "kit_save", name="Дом")
    kit = next(iter(data["kits"]))
    with pytest.raises(InventoryError):
        change(data, "package_save", kit_id=kit, name="Без даты")
    data = change(data, "package_save", kit_id=kit, name="Без срока", no_expiry=True)
    item = next(iter(data["packages"].values()))
    assert item["expires_on"] is None and item["no_expiry"] is True
    assert load_inventory(data) == data
    for now in (NOW, NOW.replace(year=2099)):
        snapshot = public_snapshot(data, now)["packages"][item["id"]]
        assert snapshot["status"] == "no_expiry"
        assert snapshot["days_remaining"] is None
        assert notification_stage(item, now.date()) is None


@pytest.mark.parametrize("value", [None, "true", 1])
def test_no_expiry_flag_requires_boolean(value):
    data, kit, _ = inventory()
    with pytest.raises(InventoryError):
        change(
            data,
            "package_save",
            kit_id=kit,
            name="Ошибка",
            no_expiry=value,
            expires_on="2027-01-01",
        )


def test_switching_no_expiry_replaces_only_selected_package_and_resets_reminders():
    data, kit, item_id = inventory()
    item = data["packages"][item_id]
    group = item["group_id"]
    data = change(data, "package_save", kit_id=kit, group_id=group, expires_on="2028-01-01")
    other_id = next(i for i in data["packages"] if i != item_id)
    data["notifications"][notification_key(item, 90)] = ["persistent"]
    later = NOW + timedelta(days=1)
    payload = dict(
        id=item_id, kit_id=kit, group_id=group, no_expiry=True, available=False, info="Заметка"
    )
    result = mutate(data, "package_save", payload, data["revision"], later)
    item = result["packages"][item_id]
    assert item["expires_on"] is None and item["available"] is True
    assert item["added_at"] == later.isoformat() and item["generation"] == 2
    assert result["notifications"] == {}
    assert result["packages"][other_id] == data["packages"][other_id]
    # Editing just the note/availability keeps this package's original dates.
    result = mutate(result, "package_save", payload, result["revision"], later + timedelta(days=1))
    assert result["packages"][item_id]["added_at"] == item["added_at"]
    assert result["packages"][item_id]["available"] is False
    payload.update(no_expiry=False, expires_on="2028-02-01")
    result = mutate(result, "package_save", payload, result["revision"], later + timedelta(days=2))
    item = result["packages"][item_id]
    assert item["expires_on"] == "2028-02-01" and item["no_expiry"] is False
    assert item["added_at"] == (later + timedelta(days=2)).isoformat()
    assert item["generation"] == 3 and item["available"] is True


async def test_legacy_inventory_migration_preserves_dates_ids_and_notifications():
    data, kit, item_id = inventory()
    data["notifications"][notification_key(data["packages"][item_id], 90)] = ["persistent"]
    legacy = deepcopy(data)
    legacy["schema"] = 1
    for item in legacy["packages"].values():
        item.pop("no_expiry")
    original = deepcopy(legacy)
    store = MemoryStore()
    store.data = deepcopy(legacy)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    assert repo.data == {**data, "revision": data["revision"] + 1}
    assert legacy == original and store.data == repo.data
    await repo.change(
        "kit_save", {"id": kit, "name": "Дача после обновления"}, repo.data["revision"]
    )
    assert store.data["schema"] == 4
    assert store.data["packages"] == data["packages"]
    assert store.data["notifications"] == data["notifications"]
    legacy["packages"][item_id]["expires_on"] = None
    with pytest.raises(InventoryError):
        load_inventory(legacy)


@pytest.mark.parametrize(("flag", "expires"), [(True, "2028-01-01"), (False, None), (None, None)])
def test_malformed_no_expiry_storage_is_not_silently_accepted(flag, expires):
    data, _, item_id = inventory()
    data["packages"][item_id].update(no_expiry=flag, expires_on=expires)
    with pytest.raises(InventoryError):
        load_inventory(data)


def test_default_alphabetical_sort_and_no_expiry_filter_and_sort():
    data, kit, _ = inventory("2027-01-01")
    data = change(data, "package_save", kit_id=kit, name="А без срока", no_expiry=True)
    data = change(
        data, "package_save", kit_id=kit, name="Я с ранним сроком", expires_on="2026-09-21"
    )
    snapshot = public_snapshot(data, NOW)
    names = [p["name"] for p in select_packages(snapshot, kit)]
    assert names == ["А без срока", "Препарат А", "Я с ранним сроком"]
    assert [p["name"] for p in select_packages(snapshot, kit, sort="expiry")] == list(
        reversed(names)
    )
    assert [p["name"] for p in select_packages(snapshot, kit, status="no_expiry")] == [
        "А без срока"
    ]
    for status in ("ok", "expired", "due_7", "due_90"):
        assert all(not p["no_expiry"] for p in select_packages(snapshot, kit, status=status))


def duplicate_group_inventory():
    data, kit, first = inventory()
    data = change(
        data,
        "package_save",
        kit_id=kit,
        name="Временное название",
        expires_on="2027-07-01",
        info="Собственная заметка второй упаковки",
        image_id="a" * 64,
        available=False,
    )
    second = next(item_id for item_id in data["packages"] if item_id != first)
    duplicate = data["packages"][second]["group_id"]
    data = change(
        data, "package_save", kit_id=kit, name="Препарат А 500 мг", expires_on="2028-01-01"
    )
    data = change(data, "kit_save", name="Машина")
    other_kit = next(kit_id for kit_id in data["kits"] if kit_id != kit)
    data = change(
        data, "package_save", kit_id=other_kit, name="Препарат А", expires_on="2029-01-01"
    )
    # Recreate a saved duplicate from the former explicit-group behaviour.
    data["groups"][duplicate]["name"] = "  препарат   а "
    data["notifications"] = {
        notification_key(item, 90): ["persistent", "mobile_app_test"]
        for item in data["packages"].values()
    }
    return data, kit, first, second


@pytest.mark.parametrize("schema", [1, 2])
def test_old_duplicate_groups_merge_without_losing_package_data(schema):
    data, kit, first, second = duplicate_group_inventory()
    data["schema"] = schema
    if schema == 1:
        for item in data["packages"].values():
            item.pop("no_expiry")
    original = deepcopy(data)
    result = load_inventory(data)
    canonical = data["packages"][first]["group_id"]
    assert len(result["groups"]) == len(data["groups"]) - 1
    for item_id, item in data["packages"].items():
        expected = {**item, "no_expiry": False}
        if item_id == second:
            expected["group_id"] = canonical
        assert result["packages"][item_id] == expected
    assert result["notifications"] == data["notifications"]
    assert result["kits"] == data["kits"]
    assert result["next_number"] == data["next_number"]
    assert data == original
    assert load_inventory(result) == result
    snapshot = public_snapshot(result, NOW)
    assert [snapshot["packages"][item_id]["number"] for item_id in (first, second)] == [1, 2]
    rows = [p for p in select_packages(snapshot, kit) if p["group_id"] == canonical]
    assert {p["id"] for p in rows} == {first, second}
    removed = change(result, "group_delete", id=canonical, kit_id=kit)
    assert set(removed["packages"]) == set(result["packages"]) - {first, second}


async def test_duplicate_group_migration_is_durable_once_and_invalidates_old_forms():
    data, kit, _, _ = duplicate_group_inventory()
    store = MemoryStore()
    store.data = deepcopy(data)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    assert repo.data == store.data
    assert repo.data["revision"] == data["revision"] + 1
    assert len(repo.data["groups"]) == len(data["groups"]) - 1
    migrated = deepcopy(repo.data)
    await repo.load()
    assert repo.data == store.data == migrated
    with pytest.raises(InventoryError, match="другом устройстве"):
        await repo.change("kit_save", {"id": kit, "name": "Старое окно"}, data["revision"])
    assert repo.data == store.data == migrated


async def test_duplicate_group_migration_failure_does_not_publish_or_overwrite_data():
    data, _, _, _ = duplicate_group_inventory()
    store = MemoryStore()
    store.data = deepcopy(data)
    store.fail = True
    repo = Repository(store, lambda: NOW)
    with pytest.raises(OSError, match="disk full"):
        await repo.load()
    assert store.data == data
    assert repo.data == empty_inventory()


def test_editing_name_joins_existing_group_without_resetting_package_or_reminders():
    data, kit, first = inventory()
    data = change(data, "package_save", kit_id=kit, name="Отдельное", expires_on="2027-07-01")
    second = next(item_id for item_id in data["packages"] if item_id != first)
    item = deepcopy(data["packages"][second])
    data["notifications"][notification_key(item, 90)] = ["persistent"]
    result = mutate(
        data,
        "package_save",
        {**item, "kit_id": kit, "group_id": "", "name": "Препарат А"},
        data["revision"],
        NOW + timedelta(days=1),
    )
    canonical = data["packages"][first]["group_id"]
    assert len(result["groups"]) == 1
    assert result["packages"][first] == data["packages"][first]
    assert result["packages"][second] == {
        **item,
        "group_id": canonical,
        "updated_at": (NOW + timedelta(days=1)).isoformat(),
    }
    assert result["notifications"] == data["notifications"]
