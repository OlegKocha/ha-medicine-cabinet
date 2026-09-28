import csv
from datetime import datetime
from io import BytesIO, StringIO
from zoneinfo import ZoneInfo

import pytest
from PIL import Image
from pypdf import PdfReader

from custom_components.medicine_cabinet.export import export_csv, export_pdf
from custom_components.medicine_cabinet.images import save_image
from custom_components.medicine_cabinet.model import InventoryError


def row(**kwargs):
    return {
        "kit_name": "Дача",
        "name": "Препарат А",
        "group_id": "a",
        "id": "pack-a",
        "number": 1,
        "info": "Дозировка: по упаковке\nЗаметка <b>не HTML</b>",
        "available": True,
        "status": "expired",
        "expires_on": "2026-09-01",
        "added_at": "2026-06-01T15:00:00+03:00",
        "image_id": None,
        **kwargs,
    }


def test_csv_cyrillic_multiline_and_formula_protection():
    result = export_csv([row(name="=1+1", info="строка; с разделителем\nи переносом")])
    assert result.startswith(b"\xef\xbb\xbf")
    text = result.decode("utf-8-sig")
    assert "Аптечка" in text and "'=1+1" in text
    assert '"строка; с разделителем\nи переносом"' in text


def test_pdf_unicode_long_notes_and_photo(tmp_path):
    photo = BytesIO()
    Image.new("RGB", (300, 600), "#1b8991").save(photo, "PNG")
    image_id = save_image(photo.getvalue(), tmp_path)
    now = datetime(2026, 9, 20, 12, tzinfo=ZoneInfo("Europe/Moscow"))
    content = export_pdf(
        "Дача",
        [row(image_id=image_id), row(id="long", number=2, info="Длинная заметка. " * 280)],
        now,
        tmp_path,
    )
    reader = PdfReader(BytesIO(content))
    text = "\n".join(page.extract_text() for page in reader.pages)
    assert "Препарат А" in text and "Просрочено" in text
    assert "<b>не HTML</b>" in text
    assert len(reader.pages) >= 2
    assert sum(len(page.images) for page in reader.pages) >= 1


def test_empty_pdf(tmp_path):
    result = export_pdf("Авто", [], datetime.now(ZoneInfo("Europe/Moscow")), tmp_path)
    assert "упаковок нет" in PdfReader(BytesIO(result)).pages[0].extract_text()


def test_image_validation_orientation_resize_and_dedup(tmp_path):
    with pytest.raises(InventoryError):
        save_image(b"<svg onload='evil()'/>", tmp_path)
    with pytest.raises(InventoryError):
        save_image(b"x" * (10 * 1024 * 1024 + 1), tmp_path)
    data = BytesIO()
    Image.new("RGB", (2000, 1000), "white").save(data, "JPEG")
    first = save_image(data.getvalue(), tmp_path)
    assert first == save_image(data.getvalue(), tmp_path)
    with Image.open(tmp_path / f"{first}.jpg") as image:
        assert image.size == (1600, 800)
        assert not image.getexif()


def test_csv_groups_medicines_omits_ids_and_formats_local_dates():
    rows = [
        row(number=2, id="second-a", expires_on="2028-01-01"),
        row(name="Препарат Б", group_id="b", id="first-b"),
        row(added_at="2026-05-31T22:30:00+00:00"),
    ]
    original = [dict(p) for p in rows]
    result = export_csv(rows, ZoneInfo("Europe/Moscow")).decode("utf-8-sig")
    reader = csv.DictReader(StringIO(result), delimiter=";")
    exported = list(reader)
    assert reader.fieldnames == [
        "Аптечка",
        "Препарат",
        "Упаковка",
        "Категории",
        "Доп. информация",
        "Наличие",
        "Состояние",
        "Годен ДО",
        "Дата добавления",
    ]
    assert [p["Препарат"] for p in exported] == ["Препарат А", "Препарат А", "Препарат Б"]
    assert [p["Упаковка"] for p in exported] == ["1", "2", "1"]
    assert exported[0]["Дата добавления"] == "01.06.2026"
    assert exported[0]["Годен ДО"] == "01.09.2026"
    assert exported[1]["Годен ДО"] == "01.01.2028"
    assert all(p["id"] not in result for p in rows)
    assert rows == original


def test_no_expiry_is_written_in_csv_and_pdf_with_ordinary_dates(tmp_path):
    rows = [row(status="no_expiry", expires_on=None, no_expiry=True), row(number=2)]
    csv_rows = list(csv.DictReader(StringIO(export_csv(rows).decode("utf-8-sig")), delimiter=";"))
    assert csv_rows[0]["Годен ДО"] == "Бессрочно"
    assert csv_rows[0]["Состояние"] == "Бессрочно"
    assert csv_rows[1]["Годен ДО"] == "01.09.2026"
    pdf = export_pdf("Дом", rows, datetime.now(ZoneInfo("Europe/Moscow")), tmp_path)
    text = "\n".join(page.extract_text() for page in PdfReader(BytesIO(pdf)).pages)
    assert "Годен ДО: Бессрочно" in text
    assert "Годен ДО: 01.09.2026" in text
    assert "None" not in text


def test_english_exports_translate_labels_and_preserve_user_text(tmp_path):
    rows = [
        row(status="no_expiry", expires_on=None, no_expiry=True),
        row(number=2, available=False),
    ]
    text = export_csv(rows, language="en").decode("utf-8-sig")
    exported = list(csv.DictReader(StringIO(text), delimiter=";"))
    assert exported[0]["Medicine"] == "Препарат А"
    assert exported[0]["Expiry date"] == "No expiry"
    assert exported[1]["Availability"] == "Finished"
    assert exported[1]["Status"] == "Expired"
    assert exported[0]["Additional information"] == rows[0]["info"]
    result = export_pdf("Дача", rows, datetime.now(ZoneInfo("Europe/Moscow")), tmp_path, "en")
    text = "\n".join(page.extract_text() for page in PdfReader(BytesIO(result)).pages)
    assert "Medicine Box" in text and "Дача" in text
    assert "Expiry date: No expiry" in text
    assert "Additional information" in text and "Заметка <b>не HTML</b>" in text
    assert "Годен" not in text and "Дата добавления" not in text


def category(name, color="#6a84b3", **extra):
    return {"name": name, "color": color, **extra}


@pytest.mark.parametrize("language", ["ru", "en"])
def test_exports_use_each_packages_categories_and_omit_blank_pdf_description(tmp_path, language):
    rows = [
        row(
            number=1,
            status="ok",
            info="Описание первой упаковки",
            categories=[
                category("Детская аптечка", name_en="Children's medicine box"),
                category("Дорожная аптечка", name_en="Travel medicine box"),
            ],
        ),
        row(
            number=2,
            status="ok",
            info=" \n\t",
            categories=[
                category("Детская аптечка", name_en="Children's medicine box"),
                category("Моя <особая> категория & дом", "#c46565"),
            ],
        ),
        row(number=3, status="no_expiry", expires_on=None, info="", categories=[]),
    ]
    columns = "Категории" if language == "ru" else "Categories"
    exported = list(
        csv.DictReader(
            StringIO(export_csv(rows, language=language).decode("utf-8-sig")), delimiter=";"
        )
    )
    children = "Детская аптечка" if language == "ru" else "Children's medicine box"
    travel = "Дорожная аптечка" if language == "ru" else "Travel medicine box"
    assert exported[0][columns] == f"{children}; {travel}"
    assert exported[1][columns] == f"{children}; Моя <особая> категория & дом"
    assert exported[2][columns] == ""
    result = export_pdf("Дом", rows, datetime.now(ZoneInfo("Europe/Moscow")), tmp_path, language)
    text = "\n".join(page.extract_text() for page in PdfReader(BytesIO(result)).pages)
    package = "Упаковка" if language == "ru" else "Package"
    first, second, third = [
        text.split(f"{package} №{i}")[1].split(f"{package} №{i + 1}")[0] for i in range(1, 4)
    ]
    assert children in first and travel in first and "Моя <особая>" not in first
    assert children in second and "Моя <особая> категория & дом" in second and travel not in second
    assert children not in third and travel not in third
    label = "Доп. информация" if language == "ru" else "Additional information"
    assert text.count(label) == 1
    assert "Описание первой упаковки" in first
    assert "Добавлено" not in text and "Added" not in text
    assert "Срок не истёк" not in text and "Not expired" not in text


def test_csv_category_text_is_quoted_and_formula_safe():
    name = '=HYPERLINK("something"); домашняя\nкатегория'
    result = export_csv([row(categories=[category(name)])]).decode("utf-8-sig")
    exported = list(csv.DictReader(StringIO(result), delimiter=";"))
    assert exported[0]["Категории"] == "'" + name
    assert len(exported) == 1


def test_pdf_wraps_five_long_categories_and_splits_description_without_losing_text(tmp_path):
    names = [f"Категория {i} " + "ДлинноеНазвание" * 5 for i in range(5)]
    info = "\n".join(f"Строка {i:03d}: заметка об этой упаковке." for i in range(100))
    photo = BytesIO()
    Image.new("RGB", (600, 300), "#3686a0").save(photo, "PNG")
    image_id = save_image(photo.getvalue(), tmp_path)
    rows = [
        row(image_id=image_id, info=info, categories=[category(n) for n in names]),
        row(number=2, info="Последняя заметка"),
    ]
    result = export_pdf(
        "Аптечка с длинным названием " * 3, rows, datetime.now(ZoneInfo("Europe/Moscow")), tmp_path
    )
    reader = PdfReader(BytesIO(result))
    text = "\n".join(page.extract_text() for page in reader.pages)
    normalized = "".join(text.split())
    for name in names:
        assert "".join(name.split()) in normalized
    for i in range(100):
        assert f"Строка {i:03d}" in text
    assert "Последняя заметка" in text
    assert len(reader.pages) > 2
    assert "Строка 000" in reader.pages[0].extract_text()
    assert all(
        page.extract_text().count("HAMB · Состояние на момент экспорта") == 1
        for page in reader.pages
    )


def test_export_selection_resolves_package_categories_from_current_catalog():
    from custom_components.medicine_cabinet.model import (
        empty_inventory,
        mutate,
        public_snapshot,
        select_export_packages,
    )

    now = datetime(2026, 9, 28, tzinfo=ZoneInfo("Europe/Moscow"))
    data = mutate(empty_inventory(), "kit_save", {"name": "Дача"}, 0, now)
    kit = next(iter(data["kits"]))
    for category_id in ("default_children", "default_travel"):
        data = mutate(
            data,
            "package_save",
            {"kit_id": kit, "name": "Лекарство", "no_expiry": True, "category_ids": [category_id]},
            data["revision"],
            now,
        )
    snapshot = public_snapshot(data, now)
    rows = select_export_packages(snapshot, kit)
    assert [p["categories"][0]["id"] for p in rows] == ["default_children", "default_travel"]
    rows[0]["categories"][0]["name"] = "Не менять исходные данные"
    assert snapshot["categories"]["default_children"]["name"] == "Детская аптечка"
    data = mutate(
        data,
        "category_save",
        {"id": "default_travel", "name": "Для поездок", "color": "#123456", "icon": "mdi:car"},
        data["revision"],
        now,
    )
    data = mutate(data, "category_delete", {"id": "default_children"}, data["revision"], now)
    rows = select_export_packages(public_snapshot(data, now), kit)
    assert rows[0]["categories"] == []
    assert rows[1]["categories"][0]["name"] == "Для поездок"
    assert rows[1]["categories"][0]["color"] == "#123456"
