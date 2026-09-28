"""Inventory rules, independent of Home Assistant and the user interface."""

from __future__ import annotations

import re
from copy import deepcopy
from datetime import date, datetime
from uuid import uuid4

from .categories import MAX_CATEGORIES_PER_PACKAGE, default_categories, valid_color, valid_icon


class InventoryError(ValueError):
    """A user-correctable inventory error."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def empty_inventory() -> dict:
    return {
        "schema": 4,
        "revision": 0,
        "next_number": 1,
        "kits": {},
        "groups": {},
        "categories": default_categories(),
        "packages": {},
        "notifications": {},
    }


def load_inventory(data: dict | None) -> dict:
    """Never silently replace a damaged or unsupported inventory."""
    if data is None:
        return empty_inventory()
    if data.get("schema") not in (1, 2, 3, 4):
        raise InventoryError("storage_version", "Неподдерживаемая версия данных аптечки")
    result = deepcopy(data)
    for name in ("kits", "groups", "packages", "notifications"):
        if not isinstance(result.get(name), dict):
            raise InventoryError("storage_invalid", "Повреждён файл данных аптечки")
    for group in result["groups"].values():
        require(result["kits"], group["kit_id"])
    for item in result["packages"].values():
        require(result["groups"], item["group_id"])
        if result["schema"] == 1:
            # Existing dates stay mandatory during migration: a missing date is
            # never silently reinterpreted as the user's explicit choice.
            parse_date(item["expires_on"])
            item["no_expiry"] = False
        elif type(item.get("no_expiry")) is not bool:
            raise InventoryError("storage_invalid", "Повреждён срок годности упаковки")
        elif item["no_expiry"]:
            if item.get("expires_on", "missing") is not None:
                raise InventoryError("storage_invalid", "Повреждён срок годности упаковки")
        else:
            parse_date(item["expires_on"])
    if result["schema"] < 3:
        result["categories"] = default_categories()
        for group in result["groups"].values():
            group["category_ids"] = []
    if not isinstance(result.get("categories"), dict):
        raise InventoryError("storage_invalid", "Повреждён список категорий")
    for category_id, category in result["categories"].items():
        if (
            not isinstance(category, dict)
            or category.get("id") != category_id
            or not isinstance(category.get("name"), str)
            or not category["name"].strip()
            or len(category["name"]) > 100
            or ("name_en" in category and not isinstance(category["name_en"], str))
            or not valid_color(category.get("color"))
            or not valid_icon(category.get("icon"))
        ):
            raise InventoryError("storage_invalid", "Повреждён список категорий")
    if result["schema"] < 4:
        # Copy the former shared assignments before merging any duplicate groups.
        # Each package now owns its labels independently.
        for group in result["groups"].values():
            validate_category_ids(result, group.get("category_ids"))
        for item in result["packages"].values():
            item["category_ids"] = list(result["groups"][item["group_id"]]["category_ids"])
    for item in result["packages"].values():
        validate_category_ids(result, item.get("category_ids"))
    for group in result["groups"].values():
        group.pop("category_ids", None)
    result["schema"] = 4
    merge_duplicate_groups(result)
    return result


def medicine_name_key(name: str) -> str:
    """Ignore case and incidental whitespace, preserving dosage/form distinctions."""
    return " ".join(name.split()).casefold()


def merge_duplicate_groups(data: dict) -> None:
    """Unify old same-name groups within a cabinet without changing package content."""
    canonical = {}
    aliases = {}
    groups = {}
    for group_id, group in data["groups"].items():
        key = (group["kit_id"], medicine_name_key(group["name"]))
        canonical_id = canonical.setdefault(key, group_id)
        aliases[group_id] = canonical_id
        if group_id == canonical_id:
            groups[group_id] = group
    for item in data["packages"].values():
        item["group_id"] = aliases[item["group_id"]]
    data["groups"] = groups


def text_field(value: object, label: str, limit: int, *, required: bool = False) -> str:
    if not isinstance(value, str):
        raise InventoryError("invalid", f"{label}: требуется текст")
    value = value.strip()
    if len(value) > limit or (required and not value):
        raise InventoryError("invalid", f"{label}: от {1 if required else 0} до {limit} символов")
    return value


def parse_date(value: object) -> date:
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise InventoryError("invalid", "Укажите дату в формате ГГГГ-ММ-ДД")
    try:
        return date.fromisoformat(value)
    except ValueError as err:
        raise InventoryError("invalid", "Укажите существующую дату") from err


def require(items: dict, key: object) -> dict:
    if not isinstance(key, str) or key not in items:
        raise InventoryError("not_found", "Запись не найдена. Обновите страницу")
    return items[key]


def validate_category_ids(data: dict, value: object) -> list[str]:
    if not isinstance(value, list) or any(not isinstance(key, str) for key in value):
        raise InventoryError("invalid", "Некорректный список категорий")
    selected = list(dict.fromkeys(value))
    if len(selected) > MAX_CATEGORIES_PER_PACKAGE:
        raise InventoryError("category_limit", "Можно выбрать не больше 5 категорий")
    for category_id in selected:
        require(data["categories"], category_id)
    return selected


def expiry_status(item: dict, today: date) -> str:
    if item.get("no_expiry", False):
        return "no_expiry"
    days = (parse_date(item["expires_on"]) - today).days
    if days <= 0:
        return "expired"
    if days <= 7:
        return "due_7"
    if days <= 90:
        return "due_90"
    return "ok"


def notification_stage(item: dict, today: date) -> int | None:
    """Only the most urgent threshold is relevant, including catch-up after downtime."""
    if not item["available"] or item.get("no_expiry", False):
        return None
    days = (parse_date(item["expires_on"]) - today).days
    return 7 if days <= 7 else 90 if days <= 90 else None


def notification_key(item: dict, stage: int) -> str:
    return f"{item['id']}:{item['generation']}:{stage}"


def package_numbers(data: dict) -> dict[str, int]:
    """Display consecutive numbers within each group without changing stored identities."""
    counts: dict[str, int] = {}
    numbers = {}
    for item in sorted(data["packages"].values(), key=lambda p: (p["number"], p["id"])):
        group_id = item["group_id"]
        counts[group_id] = counts.get(group_id, 0) + 1
        numbers[item["id"]] = counts[group_id]
    return numbers


def public_snapshot(data: dict, now: datetime) -> dict:
    result = {
        key: deepcopy(data[key]) for key in ("revision", "kits", "groups", "packages", "categories")
    }
    result["today"] = now.date().isoformat()
    result["timezone"] = str(now.tzinfo)
    numbers = package_numbers(data)
    # The header is a derived union; its size is not limited by the package cap.
    for group in result["groups"].values():
        group["category_ids"] = []
    for item in result["packages"].values():
        ids = result["groups"][item["group_id"]]["category_ids"]
        ids.extend(key for key in item["category_ids"] if key not in ids)
        item["number"] = numbers[item["id"]]
        item["status"] = expiry_status(item, now.date())
        item["days_remaining"] = (
            None if item["no_expiry"] else (parse_date(item["expires_on"]) - now.date()).days
        )
    return result


def select_packages(
    data: dict,
    kit_id: str,
    query: str = "",
    status: str = "all",
    availability: str = "all",
    sort: str = "name",
) -> list[dict]:
    require(data["kits"], kit_id)
    if (
        status not in ("all", "ok", "due_90", "due_7", "expired", "no_expiry")
        or availability not in ("all", "present", "finished")
        or sort not in ("expiry", "name")
    ):
        raise InventoryError("invalid", "Неизвестный фильтр")
    query = query.strip().casefold()
    result = []
    for item in data["packages"].values():
        group = data["groups"][item["group_id"]]
        if group["kit_id"] != kit_id:
            continue
        if query and query not in (group["name"] + " " + item["info"]).casefold():
            continue
        if status != "all" and item["status"] != status:
            continue
        if availability == "present" and not item["available"]:
            continue
        if availability == "finished" and item["available"]:
            continue
        result.append(
            {
                **item,
                "name": group["name"],
                "kit_name": data["kits"][kit_id]["name"],
                "categories": [deepcopy(data["categories"][key]) for key in item["category_ids"]],
            }
        )

    def expiry_key(item):
        # Explicitly put undated packages after every real date.
        return item["expires_on"] is None, item["expires_on"] or ""

    result.sort(
        key=lambda item: (item["name"].casefold(), expiry_key(item), item["number"])
        if sort == "name"
        else (expiry_key(item), item["name"].casefold(), item["number"])
    )
    return result


def select_export_packages(
    data: dict, kit_id: str, expiry: str = "all", include_finished: bool = True
) -> list[dict]:
    """Select in-stock packages by date, optionally union all finished packages."""
    if (
        expiry not in ("all", "expired", "within_90", "over_90")
        or type(include_finished) is not bool
    ):
        raise InventoryError("invalid", "Некорректный фильтр")
    rows = select_packages(data, kit_id)
    selected = []
    for item in rows:
        if not item["available"]:
            if include_finished:
                selected.append(item)
            continue
        days = item["days_remaining"]
        if (
            expiry == "all"
            or (days is not None and expiry == "expired" and days <= 0)
            or (days is not None and expiry == "within_90" and days <= 90)
            or (days is not None and expiry == "over_90" and days > 90)
        ):
            selected.append(item)
    return selected


def mutate(data: dict, operation: str, payload: dict, revision: int, now: datetime) -> dict:
    """Apply an optimistic transaction to a copy; callers persist before publishing."""
    if type(revision) is not int or revision != data["revision"]:
        raise InventoryError(
            "conflict",
            "Данные изменились на другом устройстве. Обновите список и повторите изменение",
        )
    result = deepcopy(data)
    stamp = now.isoformat()
    if operation == "kit_save":
        name = text_field(payload.get("name"), "Название аптечки", 100, required=True)
        item_id = payload.get("id")
        if item_id:
            require(result["kits"], item_id)["name"] = name
        else:
            item_id = uuid4().hex
            result["kits"][item_id] = {"id": item_id, "name": name}
    elif operation == "kit_delete":
        item_id = payload.get("id")
        require(result["kits"], item_id)
        del result["kits"][item_id]
        group_ids = {g["id"] for g in result["groups"].values() if g["kit_id"] == item_id}
        result["packages"] = {
            k: v for k, v in result["packages"].items() if v["group_id"] not in group_ids
        }
        result["groups"] = {k: v for k, v in result["groups"].items() if k not in group_ids}
    elif operation == "category_save":
        name = " ".join(
            text_field(payload.get("name"), "Название категории", 100, required=True).split()
        )
        color = payload.get("color")
        icon = payload.get("icon")
        if not valid_color(color):
            raise InventoryError("invalid", "Укажите цвет в формате #RRGGBB")
        if not valid_icon(icon):
            raise InventoryError("invalid", "Укажите значок Home Assistant, например mdi:pill")
        category_id = payload.get("id")
        category = require(result["categories"], category_id) if category_id else None
        # Reuse names on creation; renaming must not collide with another category.
        existing = next(
            (
                c
                for c in result["categories"].values()
                if c["id"] != category_id
                and medicine_name_key(name)
                in (medicine_name_key(c["name"]), medicine_name_key(c.get("name_en", "")))
            ),
            None,
        )
        if category is not None:
            if existing is not None:
                raise InventoryError(
                    "duplicate_category", "Категория с таким названием уже существует"
                )
            # Keep built-in translations when only changing appearance. A custom
            # replacement name is user text and is shown verbatim in both languages.
            if name not in (category["name"], category.get("name_en")):
                category["name"] = name
                category.pop("name_en", None)
            category.update(color=color.lower(), icon=icon)
        elif existing is None:
            category_id = uuid4().hex
            result["categories"][category_id] = {
                "id": category_id,
                "name": name,
                "color": color.lower(),
                "icon": icon,
            }
    elif operation in ("category_delete", "categories_clear"):
        if operation == "category_delete":
            category_id = payload.get("id")
            require(result["categories"], category_id)
            removed = {category_id}
        else:
            removed = set(result["categories"])
        result["categories"] = {
            key: category for key, category in result["categories"].items() if key not in removed
        }
        for item in result["packages"].values():
            item["category_ids"] = [key for key in item["category_ids"] if key not in removed]
    elif operation == "audit_complete":
        kit_id = payload.get("kit_id")
        kit = require(result["kits"], kit_id)
        checks = payload.get("checks")
        if not isinstance(checks, list):
            raise InventoryError("invalid", "Некорректные отметки ревизии")
        seen = set()
        counts = {"present": 0, "finished": 0, "missing": 0}
        missing = []
        numbers = package_numbers(result)
        for check in checks:
            if not isinstance(check, dict):
                raise InventoryError("invalid", "Некорректные отметки ревизии")
            item_id = check.get("id")
            item = require(result["packages"], item_id)
            group = result["groups"][item["group_id"]]
            if group["kit_id"] != kit_id:
                raise InventoryError("invalid", "Упаковка находится в другой аптечке")
            state = check.get("state")
            if not isinstance(state, str) or state not in counts or item_id in seen:
                raise InventoryError("invalid", "Некорректные отметки ревизии")
            seen.add(item_id)
            counts[state] += 1
            if state == "missing":
                # Missing is an observation, not permission to delete or finish stock.
                missing.append(
                    {
                        "name": group["name"],
                        "number": numbers[item_id],
                        "expires_on": item["expires_on"],
                    }
                )
            elif item["available"] != (state == "present"):
                item.update(available=state == "present", updated_at=stamp)
        total = sum(
            result["groups"][p["group_id"]]["kit_id"] == kit_id for p in result["packages"].values()
        )
        kit["last_audit"] = {
            "completed_at": stamp,
            "total": total,
            "counts": counts,
            "missing": missing,
        }
    elif operation == "package_save":
        count = payload.get("count", 1)
        if type(count) is not int or not 1 <= count <= 100:
            raise InventoryError(
                "invalid", "Количество упаковок должно быть целым числом от 1 до 100"
            )
        if payload.get("id") and count != 1:
            raise InventoryError(
                "invalid", "Количество можно указать только при добавлении упаковок"
            )
        kit_id = payload.get("kit_id")
        require(result["kits"], kit_id)
        group_id = payload.get("group_id")
        if group_id:
            group = require(result["groups"], group_id)
            if group["kit_id"] != kit_id:
                raise InventoryError("invalid", "Препарат находится в другой аптечке")
        else:
            name = text_field(payload.get("name"), "Название препарата", 200, required=True)
            name_key = medicine_name_key(name)
            group_id = next(
                (
                    group["id"]
                    for group in result["groups"].values()
                    if group["kit_id"] == kit_id and medicine_name_key(group["name"]) == name_key
                ),
                None,
            )
            if group_id is None:
                group_id = uuid4().hex
                result["groups"][group_id] = {
                    "id": group_id,
                    "kit_id": kit_id,
                    "name": name,
                }
        no_expiry = payload.get("no_expiry", False)
        if type(no_expiry) is not bool:
            raise InventoryError("invalid", "Некорректное значение «Бессрочно»")
        expires = None if no_expiry else parse_date(payload.get("expires_on")).isoformat()
        info = text_field(payload.get("info", ""), "Доп. информация", 5000)
        image_id = payload.get("image_id") or None
        if image_id is not None and (
            not isinstance(image_id, str) or not re.fullmatch(r"[a-f0-9]{64}", image_id)
        ):
            raise InventoryError("invalid", "Некорректная фотография")
        available = payload.get("available", True)
        if type(available) is not bool:
            raise InventoryError("invalid", "Некорректное наличие")
        item_id = payload.get("id")
        if item_id:
            item = require(result["packages"], item_id)
            if result["groups"][item["group_id"]]["kit_id"] != kit_id:
                raise InventoryError("invalid", "Упаковка находится в другой аптечке")
            replaced = item["expires_on"] != expires
            if replaced:
                item["added_at"] = stamp
                item["generation"] += 1
                available = True
        else:
            item_id = uuid4().hex
            item = {
                "id": item_id,
                "number": result["next_number"],
                "created_at": stamp,
                "added_at": stamp,
                "generation": 1,
            }
            result["next_number"] += 1
            result["packages"][item_id] = item
        item.update(
            category_ids=validate_category_ids(
                result, payload.get("category_ids", item.get("category_ids", []))
            ),
            group_id=group_id,
            expires_on=expires,
            no_expiry=no_expiry,
            info=info,
            image_id=image_id,
            available=available,
            updated_at=stamp,
        )
        # Create independent packages in one durable transaction and one revision.
        for _ in range(count - 1):
            extra_id = uuid4().hex
            result["packages"][extra_id] = {
                **deepcopy(item),
                "id": extra_id,
                "number": result["next_number"],
            }
            result["next_number"] += 1
    elif operation == "group_save":
        group_id = payload.get("id")
        group = require(result["groups"], group_id)
        kit_id = payload.get("kit_id")
        require(result["kits"], kit_id)
        if group["kit_id"] != kit_id:
            raise InventoryError("invalid", "Препарат находится в другой аптечке")
        if "name" in payload:
            name = text_field(payload["name"], "Название препарата", 200, required=True)
            if any(
                other["id"] != group_id
                and other["kit_id"] == kit_id
                and medicine_name_key(other["name"]) == medicine_name_key(name)
                for other in result["groups"].values()
            ):
                raise InventoryError(
                    "duplicate_medicine", "Лекарство с таким названием уже есть в этой аптечке"
                )
            group["name"] = name
        # One atomic patch for the whole group, including packages hidden by filters.
        # Omitted fields keep their per-package values.
        updates = {}
        if "category_ids" in payload:
            updates["category_ids"] = validate_category_ids(result, payload["category_ids"])
        if "info" in payload:
            updates["info"] = text_field(payload["info"], "Доп. информация", 5000)
        if "image_id" in payload:
            image_id = payload["image_id"]
            if image_id is not None and (
                not isinstance(image_id, str) or not re.fullmatch(r"[a-f0-9]{64}", image_id)
            ):
                raise InventoryError("invalid", "Некорректная фотография")
            updates["image_id"] = image_id
        if "available" in payload:
            if type(payload["available"]) is not bool:
                raise InventoryError("invalid", "Некорректное наличие")
            updates["available"] = payload["available"]
        if "no_expiry" in payload or "expires_on" in payload:
            no_expiry = payload.get("no_expiry", False)
            if type(no_expiry) is not bool:
                raise InventoryError("invalid", "Некорректное значение «Бессрочно»")
            updates["no_expiry"] = no_expiry
            updates["expires_on"] = (
                None if no_expiry else parse_date(payload.get("expires_on")).isoformat()
            )
        for item in result["packages"].values():
            if item["group_id"] != group_id:
                continue
            changed = any(item.get(key) != value for key, value in updates.items())
            replaced = "expires_on" in updates and item["expires_on"] != updates["expires_on"]
            item.update(deepcopy(updates))
            if replaced:
                item.update(added_at=stamp, generation=item["generation"] + 1, available=True)
            if changed:
                item["updated_at"] = stamp
    elif operation in ("group_set_available", "group_delete"):
        group_id = payload.get("id")
        group = require(result["groups"], group_id)
        kit_id = payload.get("kit_id")
        require(result["kits"], kit_id)
        if group["kit_id"] != kit_id:
            raise InventoryError("invalid", "Препарат находится в другой аптечке")
        if operation == "group_delete":
            result["packages"] = {
                k: v for k, v in result["packages"].items() if v["group_id"] != group_id
            }
        else:
            available = payload.get("available")
            if type(available) is not bool:
                raise InventoryError("invalid", "Некорректное наличие")
            for item in result["packages"].values():
                if item["group_id"] == group_id and item["available"] != available:
                    item.update(available=available, updated_at=stamp)
    elif operation == "package_delete":
        item_id = payload.get("id")
        require(result["packages"], item_id)
        del result["packages"][item_id]
    else:
        raise InventoryError("invalid", "Неизвестное действие")
    used_groups = {p["group_id"] for p in result["packages"].values()}
    result["groups"] = {k: v for k, v in result["groups"].items() if k in used_groups}
    valid_prefixes = {f"{p['id']}:{p['generation']}:" for p in result["packages"].values()}
    result["notifications"] = {
        k: v
        for k, v in result["notifications"].items()
        if k.rsplit(":", 1)[0] + ":" in valid_prefixes
    }
    result["revision"] += 1
    return result
