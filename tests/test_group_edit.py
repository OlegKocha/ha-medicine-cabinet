from copy import deepcopy
from datetime import timedelta

import pytest

from custom_components.medicine_cabinet.model import (
    InventoryError,
    load_inventory,
    mutate,
    public_snapshot,
)
from tests.test_inventory import NOW, change, inventory


def grouped_inventory():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(
        data,
        "package_save",
        kit_id=kit,
        group_id=group,
        expires_on="2030-01-01",
        info="Вторая заметка",
        available=False,
        image_id="a" * 64,
        category_ids=["default_travel"],
    )
    data = change(
        data, "package_save", kit_id=kit, name="Другой препарат", no_expiry=True, image_id="b" * 64
    )
    return data, kit, group


def test_group_photo_updates_all_packages_and_preserves_individual_details():
    data, kit, group = grouped_inventory()
    result = change(data, "group_save", id=group, kit_id=kit, image_id="c" * 64)
    assert result["groups"] == data["groups"]
    for key, item in data["packages"].items():
        if item["group_id"] == group:
            assert result["packages"][key] == {
                **item,
                "image_id": "c" * 64,
                "updated_at": NOW.isoformat(),
            }
        else:
            assert result["packages"][key] == item
    assert result["notifications"] == data["notifications"]
    assert load_inventory(result) == result


def test_group_clear_photo_and_notes_applies_to_every_package():
    data, kit, group = grouped_inventory()
    result = change(data, "group_save", id=group, kit_id=kit, image_id=None, info="")
    for key, item in result["packages"].items():
        if item["group_id"] == group:
            assert item["image_id"] is None
            assert item["info"] == ""
            assert item["expires_on"] == data["packages"][key]["expires_on"]
        else:
            assert item == data["packages"][key]


def test_group_edit_all_fields_and_expiry_replacement_semantics():
    data, kit, group = grouped_inventory()
    now = NOW + timedelta(days=1)
    result = mutate(
        data,
        "group_save",
        {
            "id": group,
            "kit_id": kit,
            "name": "Новое название",
            "info": "Общее описание",
            "image_id": "d" * 64,
            "no_expiry": True,
            "available": True,
            "category_ids": ["default_allergy"],
        },
        data["revision"],
        now,
    )
    assert result["groups"][group]["name"] == "Новое название"
    assert public_snapshot(result, now)["groups"][group]["category_ids"] == ["default_allergy"]
    for key, item in result["packages"].items():
        if item["group_id"] == group:
            assert item["category_ids"] == ["default_allergy"]
            assert item["info"] == "Общее описание"
            assert item["image_id"] == "d" * 64
            assert item["no_expiry"] and item["expires_on"] is None
            assert item["available"]
            assert item["generation"] == data["packages"][key]["generation"] + 1
            assert item["added_at"] == now.isoformat()
        else:
            assert item == data["packages"][key]
    assert load_inventory(result) == result


def test_group_unchanged_fields_and_expiry_do_not_replace_packages():
    data, kit, group = grouped_inventory()
    assert change(data, "group_save", id=group, kit_id=kit) == {
        **data,
        "revision": data["revision"] + 1,
    }
    data = change(data, "group_save", id=group, kit_id=kit, no_expiry=True)
    result = change(data, "group_save", id=group, kit_id=kit, no_expiry=True)
    assert result == {**data, "revision": data["revision"] + 1}


@pytest.mark.parametrize(
    "extra",
    [
        {"image_id": "../bad"},
        {"info": "x" * 5001},
        {"name": ""},
        {"name": "другой препарат"},
        {"available": "false"},
        {"no_expiry": 1},
        {"expires_on": "not a date"},
        {"category_ids": ["missing"]},
        {
            "category_ids": [
                "default_allergy",
                "default_travel",
                "default_children",
                "default_sleep",
                "default_wounds",
                "default_heart",
            ]
        },
        {"id": "missing"},
        {"kit_id": "missing"},
    ],
)
def test_invalid_bulk_edit_is_atomic(extra):
    data, kit, group = grouped_inventory()
    before = deepcopy(data)
    with pytest.raises(InventoryError):
        change(data, "group_save", **({"id": group, "kit_id": kit, "info": "Не сохранить"} | extra))
    assert data == before


def test_stale_group_form_cannot_overwrite_new_packages():
    data, kit, group = grouped_inventory()
    changed = change(data, "package_save", kit_id=kit, group_id=group, no_expiry=True)
    with pytest.raises(InventoryError, match="другом устройстве"):
        mutate(
            changed,
            "group_save",
            {"id": group, "kit_id": kit, "image_id": "c" * 64},
            data["revision"],
            NOW,
        )
    assert sum(item["group_id"] == group for item in changed["packages"].values()) == 3


def test_bulk_edit_rejects_other_kit_and_individual_edit_still_updates_only_one_package():
    data, kit, group = grouped_inventory()
    data = change(data, "kit_save", name="Другая аптечка")
    other_kit = next(key for key in data["kits"] if key != kit)
    with pytest.raises(InventoryError, match="другой аптечке"):
        change(data, "group_save", id=group, kit_id=other_kit, info="Не сохранять")
    first, second = [item for item in data["packages"].values() if item["group_id"] == group]
    result = change(
        data,
        "package_save",
        id=first["id"],
        kit_id=kit,
        group_id=group,
        expires_on=first["expires_on"],
        info="Только эта упаковка",
        image_id="d" * 64,
    )
    assert result["packages"][first["id"]]["image_id"] == "d" * 64
    assert result["packages"][second["id"]] == second
