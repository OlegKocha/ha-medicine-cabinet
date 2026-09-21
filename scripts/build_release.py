"""Create deterministic manual/HACS release archives without development files."""

import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "medicine_cabinet"


def build():
    version = json.loads((COMPONENT / "manifest.json").read_text())["version"]
    out = ROOT / "dist"
    out.mkdir(exist_ok=True)
    files = sorted(
        p
        for p in COMPONENT.rglob("*")
        if p.is_file() and "__pycache__" not in p.parts and p.suffix != ".pyc"
    )
    archives = []
    for name, prefix in (
        (f"medicine-cabinet-{version}.zip", "custom_components/medicine_cabinet/"),
        ("medicine_cabinet.zip", ""),
    ):
        path = out / name
        with ZipFile(path, "w", ZIP_DEFLATED) as archive:
            for file in files:
                info = ZipInfo(
                    prefix + file.relative_to(COMPONENT).as_posix(), (2026, 9, 20, 0, 0, 0)
                )
                info.compress_type = ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                archive.writestr(info, file.read_bytes())
        archives.append(path)
    (out / "SHA256SUMS").write_text(
        "".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n" for p in archives)
    )
    for archive in archives:
        print(f"{archive.name}: {archive.stat().st_size} bytes")


if __name__ == "__main__":
    build()
