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
    assert all(g["category_ids"] == [] for g in data["groups"].values())
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
        group.pop("category_ids")
    if schema == 1:
        for item in original["packages"].values():
            item.pop("no_expiry")
    store = MemoryStore()
    store.data = deepcopy(original)
    repo = Repository(store, lambda: NOW)
    await repo.load()
    assert store.data == repo.data
    assert repo.data["revision"] == original["revision"] + 1
    assert repo.data["schema"] == 3
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
    assert {tuple(g["category_ids"]) for g in restored.data["groups"].values()} == {
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


def test_five_categories_are_shared_and_old_clients_preserve_them():
    data, kit, item_id = inventory()
    group_id = data["packages"][item_id]["group_id"]
    selected = list(data["categories"])[:5]
    data = change(
        data, "package_save", kit_id=kit, group_id=group_id, no_expiry=True, category_ids=selected
    )
    assert data["groups"][group_id]["category_ids"] == selected
    # An old panel or an availability toggle omits category_ids.
    data = change(data, "package_save", kit_id=kit, group_id=group_id, no_expiry=True)
    assert data["groups"][group_id]["category_ids"] == selected
    assert len(data["packages"]) == 3
    data = change(
        data, "package_save", kit_id=kit, group_id=group_id, no_expiry=True, category_ids=[]
    )
    assert data["groups"][group_id]["category_ids"] == []


def test_typed_duplicate_medicine_preserves_earlier_labels_and_caps_union():
    data, kit, _ = inventory()
    data = change(
        data,
        "package_save",
        kit_id=kit,
        name="Препарат А",
        no_expiry=True,
        category_ids=list(data["categories"])[:5],
    )
    result = change(
        data, "package_save", kit_id=kit, name="препарат а", no_expiry=True, category_ids=[]
    )
    assert result["groups"] == data["groups"]
    with pytest.raises(InventoryError, match="5 категорий"):
        change(
            data,
            "package_save",
            kit_id=kit,
            name="Препарат А",
            no_expiry=True,
            category_ids=["default_sleep"],
        )


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
    assert result["packages"] == before["packages"]
    assert result["notifications"] == before["notifications"]
    for key, group in result["groups"].items():
        assert group == {
            **before["groups"][key],
            "category_ids": [
                value
                for value in before["groups"][key]["category_ids"]
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
    assert all(g["category_ids"] == [] for g in cleared["groups"].values())
    assert cleared["packages"] == original["packages"]
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
