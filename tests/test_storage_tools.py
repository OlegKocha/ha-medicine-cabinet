import json
import os
from copy import deepcopy
from pathlib import Path
from unittest.mock import patch
from zipfile import ZipFile

import pytest

from custom_components.medicine_cabinet.images import save_image
from custom_components.medicine_cabinet.model import InventoryError, load_inventory
from custom_components.medicine_cabinet.storage_tools import (
    UPLOAD_GRACE_SECONDS,
    build_backup,
    clean_photos,
    storage_info,
)
from tests.test_inventory import NOW, change, inventory


def photo(directory, char, *, age=UPLOAD_GRACE_SECONDS + 1, suffix="jpg"):
    path = directory / f"{char * 64}.{suffix}"
    path.write_bytes(b"photo")
    stamp = NOW.timestamp() - age
    os.utime(path, (stamp, stamp))
    return path


def test_cleanup_preserves_shared_finished_other_cabinet_and_recent_photos(tmp_path):
    data, kit, first = inventory()
    data["packages"][first]["image_id"] = "a" * 64
    data = change(data, "kit_save", name="Another cabinet")
    other = next(key for key in data["kits"] if key != kit)
    data = change(
        data,
        "package_save",
        kit_id=other,
        name="Shared",
        no_expiry=True,
        image_id="a" * 64,
        available=False,
    )
    data = change(data, "package_delete", id=first)
    shared = photo(tmp_path, "a")
    orphan = photo(tmp_path, "b")
    recent = photo(tmp_path, "c", age=60)
    temporary = photo(tmp_path, "d", suffix="tmp")
    unrelated = tmp_path / "keep.txt"
    unrelated.write_text("Unrelated file")
    nested = tmp_path / "nested"
    nested.mkdir()
    linked = tmp_path / f"{'e' * 64}.jpg"
    linked.symlink_to(unrelated)
    before = deepcopy(data)
    info = storage_info(data, tmp_path, NOW.timestamp())
    assert (info["photos"], info["unused"], info["recent_unused"], info["missing_photos"]) == (
        3,
        2,
        1,
        0,
    )
    result = clean_photos(data, tmp_path, NOW.timestamp())
    assert result == {"removed": 2, "removed_bytes": 10, "failed": 0}
    assert not orphan.exists() and not temporary.exists()
    assert all(p.exists() for p in (shared, recent, unrelated, nested, linked))
    assert data == before
    assert storage_info(data, tmp_path, NOW.timestamp())["unused"] == 0


def test_backup_contains_raw_inventory_and_only_distinct_referenced_photos(tmp_path):
    data, kit, first = inventory()
    data["packages"][first]["image_id"] = "a" * 64
    data = change(
        data,
        "package_save",
        kit_id=kit,
        name="Second",
        no_expiry=True,
        image_id="a" * 64,
        available=False,
    )
    data = change(data, "audit_complete", kit_id=kit, checks=[])
    used = photo(tmp_path, "a")
    photo(tmp_path, "b")
    archive, size = build_backup(data, tmp_path, NOW.isoformat())
    try:
        assert size > 0
        with ZipFile(archive) as bundle:
            assert set(bundle.namelist()) == {
                ".storage/medicine_cabinet",
                "backup.json",
                "README.txt",
                f"medicine_cabinet/images/{used.name}",
            }
            stored = json.loads(bundle.read(".storage/medicine_cabinet"))
            assert stored["key"] == "medicine_cabinet"
            assert load_inventory(stored["data"]) == data
            assert bundle.read(f"medicine_cabinet/images/{used.name}") == used.read_bytes()
            assert json.loads(bundle.read("backup.json"))["photos"] == 1
            assert "/config/.storage/medicine_cabinet" in bundle.read("README.txt").decode()
    finally:
        archive.close()
    used.unlink()
    with pytest.raises(InventoryError, match="Не хватает фотографий"):
        build_backup(data, tmp_path, NOW.isoformat())


def test_cleanup_reports_failed_files_and_full_clear_also_removes_recent_photos(tmp_path):
    data, _, first = inventory()
    data["packages"][first]["image_id"] = "a" * 64
    used = photo(tmp_path, "a", age=1)
    denied = photo(tmp_path, "b")
    unlink = Path.unlink

    def sometimes_denied(path, *args, **kwargs):
        if path == denied:
            raise PermissionError("read only")
        return unlink(path, *args, **kwargs)

    with patch.object(Path, "unlink", sometimes_denied):
        result = clean_photos(data, tmp_path, NOW.timestamp(), all_photos=True)
    assert result == {"removed": 1, "removed_bytes": 5, "failed": 1}
    assert not used.exists() and denied.exists()


def test_reusing_an_orphan_renews_upload_grace_period(tmp_path):
    content = Path("tests/fixtures/photo.png").read_bytes()
    image_id = save_image(content, tmp_path)
    path = tmp_path / f"{image_id}.jpg"
    os.utime(path, (1, 1))
    assert save_image(content, tmp_path) == image_id
    assert path.stat().st_mtime > 1


def test_reset_keeps_revision_monotonic_and_empty_catalog_after_reload():
    data, kit, _ = inventory()
    data = change(data, "audit_complete", kit_id=kit, checks=[])
    reset = change(data, "storage_clear")
    assert reset["revision"] == data["revision"] + 1
    for key in ("kits", "groups", "packages", "categories", "notifications"):
        assert reset[key] == {}
    assert load_inventory(reset) == reset
