from copy import deepcopy

import pytest

from custom_components.medicine_cabinet.model import (
    InventoryError,
    empty_inventory,
    load_inventory,
    mutate,
    public_snapshot,
)
from custom_components.medicine_cabinet.repository import Repository
from tests.test_inventory import NOW, MemoryStore, change, inventory


def test_starter_catalog_has_21_stable_categories_and_no_automatic_assignments():
    data, _, _ = inventory()
    assert len(data["categories"]) == 21
    assert data["categories"]["default_eyes_ears"]["name"] == "Глазные и ушные капли"
    assert data["categories"]["default_sleep"]["name_en"] == "Nervous system and sleep"
    assert all(p["category_ids"] == [] for p in data["packages"].values())
    assert public_snapshot(data, NOW)["categories"] == data["categories"]
    assert load_inventory(data) == data
    data["categories"]["default_sleep"]["name"] = "Своё название"
    assert empty_inventory()["categories"]["default_sleep"]["name"] == "Нервная система и сон"


@pytest.mark.parametrize("schema", [1, 2])
async def test_catalog_migration_preserves_inventory_and_is_saved_once(schema):
    original, _, _ = inventory()
    original["schema"] = schema
    original.pop("categories")
    for group in original["groups"].values():
        group.pop("category_ids", None)
    if schema == 1:
        for item in original["packages"].values():
            item.pop("no_expiry")
    store = MemoryStore()
    store.data = deepcopy(original)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    assert store.data == repo.data
    assert repo.data["revision"] == original["revision"] + 1
    assert repo.data["schema"] == 4
    assert len(repo.data["categories"]) == 21
    assert repo.data["kits"] == original["kits"]
    assert repo.data["notifications"] == original["notifications"]
    for key, item in original["packages"].items():
        assert repo.data["packages"][key] == {**item, "no_expiry": False}
    saved = deepcopy(repo.data)
    await repo.load()
    assert repo.data == saved == store.data


async def test_custom_category_persists_without_medicines_and_across_boxes():
    store = MemoryStore()
    repo = Repository(store, lambda: NOW)
    await repo.change(
        "category_save", {"name": "Для питомца", "color": "#1A2B3C", "icon": "mdi:cat"}, 0
    )
    created = next(c for c in repo.data["categories"].values() if c["name"] == "Для питомца")
    assert created["color"] == "#1a2b3c"
    restored = Repository(store, lambda: NOW)
    await restored.load()
    assert restored.data == repo.data
    for name in ["Дом", "Дача"]:
        data = await restored.change("kit_save", {"name": name}, restored.data["revision"])
        kit = next(k["id"] for k in data["kits"].values() if k["name"] == name)
        await restored.change(
            "package_save",
            {"kit_id": kit, "name": "Пластырь", "no_expiry": True, "category_ids": [created["id"]]},
            data["revision"],
        )
    assert {tuple(g["category_ids"]) for g in restored.data["packages"].values()} == {
        (created["id"],)
    }


@pytest.mark.parametrize("name", ["Аллергия", "  АЛЛЕРГИЯ ", "Allergy", " allergy  "])
def test_existing_category_is_reused_without_changing_its_appearance(name):
    data = empty_inventory()
    result = change(data, "category_save", name=name, color="#000000", icon="mdi:cat")
    assert result["categories"] == data["categories"]


@pytest.mark.parametrize(
    "payload",
    [
        {"name": " "},
        {"name": "x" * 101},
        {"name": 1},
        {"color": "red;position:fixed"},
        {"color": None},
        {"icon": 'mdi:cat" onload="alert(1)'},
        {"icon": "https://example.com/a.svg"},
    ],
)
def test_category_validation_is_atomic(payload):
    data = empty_inventory()
    with pytest.raises(InventoryError):
        change(
            data,
            "category_save",
            **({"name": "Своя", "color": "#123abc", "icon": "mdi:cat"} | payload),
        )
    assert data == empty_inventory()


@pytest.mark.parametrize(
    "selection",
    [list(empty_inventory()["categories"])[:6], ["missing"], None, "default_allergy", [1]],
)
def test_category_assignment_rejects_invalid_values_without_partial_save(selection):
    data, kit, _ = inventory()
    before = deepcopy(data)
    with pytest.raises(InventoryError):
        change(
            data, "package_save", kit_id=kit, name="Другое", no_expiry=True, category_ids=selection
        )
    assert data == before


def test_package_categories_are_independent_and_omitted_fields_preserve_them():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    selected = list(data["categories"])[:5]
    original = deepcopy(data["packages"][first])
    data = change(
        data, "package_save", kit_id=kit, group_id=group, no_expiry=True, category_ids=selected
    )
    second = next(key for key in data["packages"] if key != first)
    assert data["packages"][first] == original
    assert data["packages"][second]["category_ids"] == selected
    # An availability toggle/old client omits category_ids, preserving only this package.
    data = change(
        data, "package_save", id=second, kit_id=kit, group_id=group, no_expiry=True, available=False
    )
    assert data["packages"][second]["category_ids"] == selected
    data = change(
        data, "package_save", id=second, kit_id=kit, group_id=group, no_expiry=True, category_ids=[]
    )
    assert data["packages"][second]["category_ids"] == []
    assert data["packages"][first] == original
    assert public_snapshot(data, NOW)["groups"][group]["category_ids"] == []


def test_typed_duplicate_medicine_keeps_package_labels_and_uncapped_header_union():
    data, kit, _ = inventory()
    selected = list(data["categories"])[:5]
    data = change(
        data, "package_save", kit_id=kit, name="Препарат А", no_expiry=True, category_ids=selected
    )
    before = deepcopy(data["packages"])
    result = change(
        data,
        "package_save",
        kit_id=kit,
        name="препарат а",
        no_expiry=True,
        category_ids=[selected[0], "default_sleep"],
    )
    assert result["groups"] == data["groups"]
    assert all(result["packages"][key] == value for key, value in before.items())
    group = next(g["id"] for g in result["groups"].values() if g["name"] == "Препарат А")
    assert public_snapshot(result, NOW)["groups"][group]["category_ids"] == selected + [
        "default_sleep"
    ]
    assert load_inventory(result) == result


def test_stale_category_creation_is_rejected():
    data = change(
        empty_inventory(), "category_save", name="Своя", color="#123456", icon="my-icons:cat"
    )
    with pytest.raises(InventoryError, match="другом устройстве"):
        mutate(
            data, "category_save", {"name": "Другая", "color": "#123456", "icon": "mdi:cat"}, 0, NOW
        )


def test_catalog_corruption_is_not_silently_reset_or_reseeded():
    data = empty_inventory()
    data["categories"].clear()
    assert load_inventory(data)["categories"] == {}
    data.pop("categories")
    with pytest.raises(InventoryError):
        load_inventory(data)


@pytest.mark.parametrize("category_id", ["default_allergy", "custom"])
def test_edit_category_keeps_assignments_in_all_boxes(category_id):
    data, kit, _ = inventory()
    if category_id == "custom":
        data = change(data, "category_save", name="Своё", color="#112233", icon="mdi:cat")
        category_id = next(c["id"] for c in data["categories"].values() if c["name"] == "Своё")
    data = change(data, "kit_save", name="Другая аптечка")
    for box in data["kits"]:
        data = change(
            data,
            "package_save",
            kit_id=box,
            name="Тест",
            no_expiry=True,
            category_ids=[category_id, "default_travel"],
        )
    before = deepcopy(data)
    result = change(
        data,
        "category_save",
        id=category_id,
        name="Для семьи",
        color="#ABCDEF",
        icon="my-icons:family",
    )
    assert result["categories"][category_id] == {
        "id": category_id,
        "name": "Для семьи",
        "color": "#abcdef",
        "icon": "my-icons:family",
    }
    assert result["groups"] == before["groups"]
    assert result["packages"] == before["packages"]
    assert result["notifications"] == before["notifications"]
    assert load_inventory(result) == result


@pytest.mark.parametrize("name", ["Аллергия", "Allergy"])
def test_editing_default_appearance_preserves_translations(name):
    data = change(
        empty_inventory(),
        "category_save",
        id="default_allergy",
        name=name,
        color="#112233",
        icon="mdi:cat",
    )
    category = data["categories"]["default_allergy"]
    assert category["name"] == "Аллергия"
    assert category["name_en"] == "Allergy"
    assert category["color"] == "#112233"


@pytest.mark.parametrize("name", ["Раны и ожоги", " WOUNDS AND BURNS "])
def test_rename_collision_is_rejected_atomically(name):
    original = empty_inventory()
    with pytest.raises(InventoryError, match="уже существует"):
        change(
            original,
            "category_save",
            id="default_allergy",
            name=name,
            color="#112233",
            icon="mdi:cat",
        )
    assert original == empty_inventory()


def test_delete_detaches_only_that_category_and_keeps_packages_and_notifications():
    data, _, _ = inventory()
    data = change(data, "kit_save", name="Другая аптечка")
    for kit in data["kits"]:
        data = change(
            data,
            "package_save",
            kit_id=kit,
            name="Тест",
            no_expiry=True,
            category_ids=["default_allergy", "default_travel"],
        )
    before = deepcopy(data)
    result = change(data, "category_delete", id="default_allergy")
    assert "default_allergy" not in result["categories"]
    assert len(result["categories"]) == 20
    assert result["groups"] == before["groups"]
    assert result["notifications"] == before["notifications"]
    for key, item in result["packages"].items():
        assert item == {
            **before["packages"][key],
            "category_ids": [
                value
                for value in before["packages"][key]["category_ids"]
                if value != "default_allergy"
            ],
        }
    assert load_inventory(result) == result


async def test_clear_persists_empty_catalog_across_reload_and_allows_new_categories():
    original, kit, _ = inventory()
    original = change(
        original,
        "package_save",
        kit_id=kit,
        name="Тест",
        no_expiry=True,
        category_ids=["default_allergy"],
    )
    store = MemoryStore()
    store.data = deepcopy(original)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    await repo.change("categories_clear", {}, original["revision"])
    cleared = deepcopy(repo.data)
    assert cleared["categories"] == {}
    assert cleared["groups"] == original["groups"]
    assert cleared["packages"] == {
        key: {**item, "category_ids": []} for key, item in original["packages"].items()
    }
    assert cleared["notifications"] == original["notifications"]
    for _ in range(2):
        restored = Repository(store, lambda: NOW)
        await restored.load()
        assert restored.data == cleared
    result = await restored.change(
        "category_save",
        {"name": "Единственная", "color": "#112233", "icon": "mdi:cat"},
        cleared["revision"],
    )
    assert len(result["categories"]) == 1
    assert next(iter(result["categories"].values()))["name"] == "Единственная"


@pytest.mark.parametrize("operation", ["category_save", "category_delete", "categories_clear"])
def test_stale_category_management_is_rejected(operation):
    original = empty_inventory()
    changed = change(original, "category_save", name="Другая", color="#112233", icon="mdi:cat")
    with pytest.raises(InventoryError, match="другом устройстве"):
        mutate(
            changed,
            operation,
            {"id": "default_allergy", "name": "Новое", "color": "#112233", "icon": "mdi:cat"},
            0,
            NOW,
        )
    assert len(changed["categories"]) == 22


@pytest.mark.parametrize("operation", ["category_save", "category_delete"])
def test_deleted_category_cannot_be_edited_or_deleted_again(operation):
    data = change(empty_inventory(), "category_delete", id="default_allergy")
    before = deepcopy(data)
    with pytest.raises(InventoryError, match="не найдена"):
        change(
            data, operation, id="default_allergy", name="Аллергия", color="#112233", icon="mdi:cat"
        )
    assert data == before


async def test_schema3_migration_copies_shared_labels_before_merging_duplicate_groups():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(data, "package_save", kit_id=kit, group_id=group, no_expiry=True)
    second = next(key for key in data["packages"] if key != first)
    old = deepcopy(data)
    old["schema"] = 3
    selected = list(old["categories"])[:5]
    old["groups"][group]["category_ids"] = selected
    old["groups"]["legacy_duplicate"] = {
        **old["groups"][group],
        "id": "legacy_duplicate",
        "category_ids": ["default_sleep"],
    }
    old["packages"][second]["group_id"] = "legacy_duplicate"
    for item in old["packages"].values():
        item.pop("category_ids")
    before = deepcopy(old)
    store = MemoryStore()
    store.data = old
    repo = Repository(store, lambda: NOW)
    await repo.load()
    assert old == before
    assert repo.data["revision"] == old["revision"] + 1
    assert repo.data["schema"] == 4
    assert repo.data["groups"] == data["groups"]
    assert repo.data["packages"][first] == {**data["packages"][first], "category_ids": selected}
    assert repo.data["packages"][second] == {
        **data["packages"][second],
        "category_ids": ["default_sleep"],
    }
    assert public_snapshot(repo.data, NOW)["groups"][group]["category_ids"] == selected + [
        "default_sleep"
    ]
    saved = deepcopy(repo.data)
    await repo.load()
    assert store.data == repo.data == saved
    with pytest.raises(InventoryError, match="другом устройстве"):
        await repo.change(
            "group_save", {"id": group, "kit_id": kit, "category_ids": []}, old["revision"]
        )


@pytest.mark.parametrize(
    "selection", [None, ["missing"], list(empty_inventory()["categories"])[:6]]
)
def test_corrupt_package_categories_are_rejected_without_reset(selection):
    data, _, item_id = inventory()
    data["packages"][item_id]["category_ids"] = selection
    with pytest.raises(InventoryError):
        load_inventory(data)


async def test_package_category_union_persists_and_shrinks_after_edit_and_delete():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(
        data,
        "group_save",
        id=group,
        kit_id=kit,
        category_ids=["default_children", "default_travel"],
    )
    data = change(
        data,
        "package_save",
        kit_id=kit,
        group_id=group,
        expires_on="2031-01-01",
        category_ids=["default_children", "default_emergency"],
    )
    second = next(key for key in data["packages"] if key != first)
    store = MemoryStore()
    store.data = data
    repo = Repository(store, lambda: NOW)
    await repo.load()
    snapshot = repo.snapshot()
    assert snapshot["groups"][group]["category_ids"] == [
        "default_children",
        "default_travel",
        "default_emergency",
    ]
    before = deepcopy(repo.data["packages"][first])
    result = await repo.change(
        "package_save",
        {
            "id": second,
            "kit_id": kit,
            "group_id": group,
            "expires_on": "2031-01-01",
            "category_ids": ["default_children"],
        },
        snapshot["revision"],
    )
    assert result["groups"][group]["category_ids"] == ["default_children", "default_travel"]
    assert repo.data["packages"][first] == before
    restored = Repository(store, lambda: NOW)
    await restored.load()
    assert restored.snapshot() == result
    result = await restored.change("package_delete", {"id": first}, result["revision"])
    assert result["groups"][group]["category_ids"] == ["default_children"]
    assert result["packages"][second]["category_ids"] == ["default_children"]


async def test_bulk_categories_remain_independent_after_saving_and_clearing():
    data, kit, first = inventory()
    group = data["packages"][first]["group_id"]
    data = change(data, "package_save", kit_id=kit, group_id=group, no_expiry=True)
    data = change(data, "group_save", kit_id=kit, id=group, category_ids=["default_children"])
    first_item, second_item = data["packages"].values()
    assert first_item["category_ids"] is not second_item["category_ids"]
    before = deepcopy(data)
    cleared = change(data, "group_save", kit_id=kit, id=group, category_ids=[])
    for key, item in cleared["packages"].items():
        assert item == {
            **before["packages"][key],
            "category_ids": [],
            "updated_at": NOW.isoformat(),
        }
    assert public_snapshot(cleared, NOW)["groups"][group]["category_ids"] == []
