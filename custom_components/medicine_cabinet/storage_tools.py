"""Explicit storage maintenance and portable backups of the local inventory."""

from __future__ import annotations

import json
import re
from pathlib import Path
from tempfile import TemporaryFile
from zipfile import ZIP_DEFLATED, ZipFile

from .const import DOMAIN, STORAGE_VERSION, VERSION
from .model import InventoryError

PHOTO_NAME = re.compile(r"([a-f0-9]{64})\.(jpg|tmp)")
UPLOAD_GRACE_SECONDS = 24 * 60 * 60


def referenced_images(data: dict) -> set[str]:
    return {p["image_id"] for p in data["packages"].values() if p.get("image_id")}


def photo_files(directory: Path):
    """Only integration-owned files; never traverse subdirectories or symlinks."""
    if directory.exists():
        for path in directory.iterdir():
            if PHOTO_NAME.fullmatch(path.name) and path.is_file() and not path.is_symlink():
                yield path


def storage_info(data: dict, directory: Path, now: float) -> dict:
    used = referenced_images(data)
    files = list(photo_files(directory))
    unused = [p for p in files if p.suffix != ".jpg" or p.stem not in used]
    eligible = [p for p in unused if now - p.stat().st_mtime >= UPLOAD_GRACE_SECONDS]
    return {
        "revision": data["revision"],
        "kits": len(data["kits"]),
        "medicines": len(data["groups"]),
        "packages": len(data["packages"]),
        "categories": len(data["categories"]),
        "photos": sum(p.suffix == ".jpg" for p in files),
        "photo_bytes": sum(p.stat().st_size for p in files),
        "unused": len(eligible),
        "unused_bytes": sum(p.stat().st_size for p in eligible),
        "recent_unused": len(unused) - len(eligible),
        "missing_photos": len(used - {p.stem for p in files if p.suffix == ".jpg"}),
    }


def clean_photos(data: dict, directory: Path, now: float, *, all_photos=False) -> dict:
    used = referenced_images(data)
    removed = failed = size = 0
    for path in photo_files(directory):
        stat = path.stat()
        if not all_photos and (
            (path.suffix == ".jpg" and path.stem in used)
            or now - stat.st_mtime < UPLOAD_GRACE_SECONDS
        ):
            continue
        try:
            path.unlink()
        except OSError:
            failed += 1
        else:
            removed += 1
            size += stat.st_size
    return {"removed": removed, "removed_bytes": size, "failed": failed}


def build_backup(data: dict, directory: Path, created_at: str):
    """Return a seekable temporary ZIP, streamed and closed by the HTTP handler."""
    images = referenced_images(data)
    paths = {p.stem: p for p in photo_files(directory) if p.suffix == ".jpg"}
    if images - paths.keys():
        raise InventoryError(
            "missing_photos", "Не хватает фотографий. Исправьте записи перед созданием копии"
        )
    archive = TemporaryFile(mode="w+b")
    try:
        with ZipFile(archive, "w", ZIP_DEFLATED) as bundle:
            bundle.writestr(
                f".storage/{DOMAIN}",
                json.dumps(
                    {"version": STORAGE_VERSION, "minor_version": 1, "key": DOMAIN, "data": data},
                    ensure_ascii=False,
                    indent=2,
                ),
            )
            bundle.writestr(
                "backup.json",
                json.dumps(
                    {
                        "format": 1,
                        "integration": DOMAIN,
                        "version": VERSION,
                        "created_at": created_at,
                        "photos": len(images),
                    },
                    indent=2,
                ),
            )
            for image_id in sorted(images):
                bundle.write(paths[image_id], f"{DOMAIN}/images/{image_id}.jpg")
            bundle.writestr("README.txt", BACKUP_README)
        size = archive.tell()
        archive.seek(0)
        return archive, size
    except BaseException:
        archive.close()
        raise


BACKUP_README = """HAMB inventory backup / Резервная копия данных HAMB

This ZIP contains all medicine boxes, packages, categories, stocktake results,
notification delivery records, and only photos referenced by those packages.
It is not a full Home Assistant backup. Integration settings (language, sidebar
name and notification recipients) are not included.

Manual restore replaces the entire HAMB inventory:
1. Keep a copy of the current HAMB data before restoring. Install HAMB if needed.
2. Stop Home Assistant Core to prevent writes during restore.
3. Copy .storage/medicine_cabinet to /config/.storage/medicine_cabinet.
4. Copy medicine_cabinet/images/ into /config/medicine_cabinet/images/.
5. Start Home Assistant. Add the HAMB integration if it is not configured.

Архив содержит все аптечки, упаковки, категории, результаты ревизий,
историю отправки уведомлений и только используемые фотографии.
Это не полная копия Home Assistant. Настройки языка, названия панели
и получателей уведомлений не включены.

Восстановление заменяет все данные HAMB:
1. Сохраните текущую копию данных. При необходимости установите HAMB.
2. Остановите Home Assistant Core, чтобы он не записывал данные при переносе.
3. Скопируйте .storage/medicine_cabinet в /config/.storage/medicine_cabinet.
4. Скопируйте medicine_cabinet/images/ в /config/medicine_cabinet/images/.
5. Запустите Home Assistant. Если HAMB ещё не настроен, добавьте интеграцию.
"""
