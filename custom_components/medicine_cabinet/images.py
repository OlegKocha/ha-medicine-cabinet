"""Bounded image decoding and content-addressed, metadata-free local storage."""

import warnings
from hashlib import sha256
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

from .const import MAX_IMAGE_BYTES
from .model import InventoryError


def save_image(data: bytes, directory: Path) -> str:
    if not data or len(data) > MAX_IMAGE_BYTES:
        raise InventoryError("invalid_image", "Фото должно быть не больше 10 МБ")
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(data)) as original:
                if (
                    original.format not in ("JPEG", "PNG", "WEBP")
                    or original.width * original.height > 40_000_000
                ):
                    raise InventoryError(
                        "invalid_image", "Выберите JPEG, PNG или WebP до 40 мегапикселей"
                    )
                image = ImageOps.exif_transpose(original)
                image.thumbnail((1600, 1600))
                if image.mode in ("RGBA", "LA") or "transparency" in image.info:
                    rgba = image.convert("RGBA")
                    background = Image.new("RGB", rgba.size, "white")
                    background.paste(rgba, mask=rgba.getchannel("A"))
                    image = background
                else:
                    image = image.convert("RGB")
                output = BytesIO()
                image.save(output, format="JPEG", quality=85, optimize=True)
    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
    ) as err:
        if isinstance(err, InventoryError):
            raise
        raise InventoryError(
            "invalid_image", "Не удалось прочитать фото. Выберите JPEG, PNG или WebP"
        ) from err
    content = output.getvalue()
    image_id = sha256(content).hexdigest()
    destination = directory / f"{image_id}.jpg"
    if not destination.exists():
        temporary = directory / f"{image_id}.tmp"
        # Requests are serialised by the manager's image lock.
        temporary.write_bytes(content)
        temporary.replace(destination)
    else:
        # Reusing an unreferenced image starts a new grace period for the open form.
        destination.touch()
    return image_id
