from copy import deepcopy
from datetime import timedelta

import pytest

from custom_components.medicine_cabinet.model import (
    InventoryError,
    load_inventory,
    mutate,
    notification_key,
    public_snapshot,
)
from custom_components.medicine_cabinet.repository import Repository
from tests.test_inventory import NOW, change, inventory


def test_batch_add_is_one_revision_with_independent_packages_and_shared_details():
    data, kit, first = inventory()
    before = deepcopy(data)
    group = data["packages"][first]["group_id"]
    result = change(
        data,
        "package_save",
        kit_id=kit,
        group_id=group,
        count=3,
        expires_on="2030-01-01",
        info="Three boxes",
        image_id="a" * 64,
        category_ids=["default_children", "default_travel"],
    )
    assert data == before
    assert result["revision"] == data["revision"] + 1
    assert len(result["groups"]) == 1
    assert len(result["packages"]) == 4
    added = [p for key, p in result["packages"].items() if key != first]
    assert len({p["id"] for p in added}) == 3
    assert [p["number"] for p in public_snapshot(result, NOW)["packages"].values()] == [1, 2, 3, 4]
    for p in added:
        assert (p["expires_on"], p["info"], p["image_id"], p["group_id"]) == (
            "2030-01-01",
            "Three boxes",
            "a" * 64,
            group,
        )
        assert p["category_ids"] == ["default_children", "default_travel"]
        assert p["available"] and p["generation"] == 1
    added[0]["category_ids"].clear()
    assert added[1]["category_ids"] == ["default_children", "default_travel"]


@pytest.mark.parametrize("count", [0, -1, 101, 1.5, True, "3", None, [], {}])
def test_invalid_batch_count_does_not_create_anything(count):
    data, kit, _ = inventory()
    before = deepcopy(data)
    with pytest.raises(InventoryError):
        change(
            data, "package_save", kit_id=kit, name="Another medicine", count=count, no_expiry=True
        )
    assert data == before


def test_batch_default_no_expiry_limit_and_edit_guard():
    data, kit, first = inventory()
    result = change(data, "package_save", kit_id=kit, name="Plaster", no_expiry=True, count=100)
    assert len(result["packages"]) == 101
    assert len(result["groups"]) == 2
    assert all(p["expires_on"] is None for key, p in result["packages"].items() if key != first)
    assert load_inventory(result) == result
    with pytest.raises(InventoryError):
        change(data, "package_save", id=first, kit_id=kit, name="Changed", no_expiry=True, count=2)
    default = change(data, "package_save", kit_id=kit, name="Default", no_expiry=True)
    assert len(default["packages"]) == 2


def stocktake_inventory():
    data, kit, first = inventory()
    data = change(data, "package_save", kit_id=kit, name="Second", no_expiry=True, count=3)
    ids = list(data["packages"])
    data["packages"][ids[1]]["available"] = False
    for item in data["packages"].values():
        data["notifications"][notification_key(item, 90)] = ["persistent"]
    data = change(data, "kit_save", name="Other box")
    other = next(key for key in data["kits"] if key != kit)
    data = change(data, "package_save", kit_id=other, name="Other", no_expiry=True)
    return data, kit, ids, other


def test_partial_stocktake_only_changes_explicit_availability_and_saves_missing_report():
    data, kit, ids, other = stocktake_inventory()
    before = deepcopy(data)
    later = NOW + timedelta(days=1)
    result = mutate(
        data,
        "audit_complete",
        {
            "kit_id": kit,
            "checks": [
                {"id": ids[0], "state": "finished"},
                {"id": ids[1], "state": "present"},
                {"id": ids[2], "state": "missing"},
            ],
        },
        data["revision"],
        later,
    )
    assert data == before
    assert result["revision"] == data["revision"] + 1
    assert result["packages"][ids[0]] == {
        **data["packages"][ids[0]],
        "available": False,
        "updated_at": later.isoformat(),
    }
    assert result["packages"][ids[1]] == {
        **data["packages"][ids[1]],
        "available": True,
        "updated_at": later.isoformat(),
    }
    for key in set(data["packages"]) - {ids[0], ids[1]}:
        assert result["packages"][key] == data["packages"][key]
    assert result["notifications"] == data["notifications"]
    report = result["kits"][kit]["last_audit"]
    assert report["total"] == 4
    assert report["counts"] == {"present": 1, "finished": 1, "missing": 1}
    assert report["missing"] == [{"name": "Second", "number": 2, "expires_on": None}]
    assert report["completed_at"] == later.isoformat()
    assert result["kits"][other] == data["kits"][other]
    assert load_inventory(result) == result
    renamed = change(result, "kit_save", id=kit, name="Renamed")
    assert renamed["kits"][kit]["last_audit"] == report


def test_empty_stocktake_can_finish_without_touching_any_packages():
    data, kit, _, _ = stocktake_inventory()
    result = change(data, "audit_complete", kit_id=kit, checks=[])
    assert result["packages"] == data["packages"]
    assert result["kits"][kit]["last_audit"]["counts"] == {
        "present": 0,
        "finished": 0,
        "missing": 0,
    }


@pytest.mark.parametrize(
    "bad",
    [None, {}, [None], [{"id": "unknown", "state": "present"}], [{"id": [], "state": "present"}]],
)
def test_stocktake_invalid_inputs_are_atomic(bad):
    data, kit, _, _ = stocktake_inventory()
    before = deepcopy(data)
    with pytest.raises(InventoryError):
        change(data, "audit_complete", kit_id=kit, checks=bad)
    assert data == before


def test_stocktake_rejects_duplicate_invalid_foreign_and_stale_choices():
    data, kit, ids, other = stocktake_inventory()
    foreign = next(
        key
        for key, p in data["packages"].items()
        if data["groups"][p["group_id"]]["kit_id"] == other
    )
    good = {"id": ids[0], "state": "finished"}
    for bad in [
        good,
        {"id": ids[1], "state": "delete"},
        {"id": ids[1], "state": []},
        {"id": foreign, "state": "finished"},
    ]:
        before = deepcopy(data)
        with pytest.raises(InventoryError):
            change(data, "audit_complete", kit_id=kit, checks=[good, bad])
        assert data == before
    with pytest.raises(InventoryError, match="Данные изменились"):
        mutate(data, "audit_complete", {"kit_id": kit, "checks": [good]}, data["revision"] - 1, NOW)


@pytest.mark.asyncio
@pytest.mark.parametrize("operation", ["package_save", "audit_complete"])
async def test_failed_batch_or_stocktake_disk_write_does_not_publish_partial_changes(operation):
    data, kit, first = inventory()

    class FailedStore:
        async def async_save(self, value):
            raise OSError("disk full")

    repo = Repository(FailedStore(), lambda: NOW)
    repo.data = deepcopy(data)
    payload = (
        {"kit_id": kit, "name": "Batch", "count": 3, "no_expiry": True}
        if operation == "package_save"
        else {"kit_id": kit, "checks": [{"id": first, "state": "finished"}]}
    )
    with pytest.raises(OSError):
        await repo.change(operation, payload, data["revision"])
    assert repo.data == data
