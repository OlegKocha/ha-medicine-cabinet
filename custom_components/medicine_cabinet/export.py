"""Self-contained CSV and PDF exports; called outside the HA event loop."""

from __future__ import annotations

import csv
import threading
from datetime import date, datetime, tzinfo
from io import BytesIO, StringIO
from pathlib import Path
from xml.sax.saxutils import escape

from .localization import tr

STATUS_RU = {
    "no_expiry": "Бессрочно",
    "ok": "Срок не истёк",
    "due_90": "Истекает в течение 90 дней",
    "due_7": "Истекает в течение 7 дней",
    "expired": "Просрочено",
}
_FONT_LOCK = threading.Lock()


def csv_safe(value):
    """Prevent spreadsheet formula execution when opening user-entered text."""
    value = str(value)
    return (
        "'" + value if value.lstrip().startswith(("=", "+", "-", "@", "\t", "\r", "\n")) else value
    )


def format_expiry(value: str | None, language: str = "ru") -> str:
    return (
        tr(language, "Бессрочно")
        if value is None
        else date.fromisoformat(value).strftime("%d.%m.%Y")
    )


def export_csv(rows: list[dict], timezone: tzinfo | None = None, language: str = "ru") -> bytes:
    def t(message):
        return tr(language, message)

    output = StringIO(newline="")
    writer = csv.writer(output, delimiter=";", lineterminator="\r\n")
    writer.writerow(
        [
            t("Аптечка"),
            t("Препарат"),
            t("Упаковка"),
            t("Доп. информация"),
            t("Наличие"),
            t("Состояние"),
            t("Годен ДО"),
            t("Дата добавления"),
        ]
    )
    # Keep all packages of a medicine together, even when the screen sorts by expiry.
    ordered = sorted(rows, key=lambda p: (p["name"].casefold(), p["group_id"], p["number"]))
    for item in ordered:
        added_at = datetime.fromisoformat(item["added_at"])
        if timezone is not None:
            added_at = added_at.astimezone(timezone)
        writer.writerow(
            [
                csv_safe(v)
                for v in [
                    item["kit_name"],
                    item["name"],
                    item["number"],
                    item["info"],
                    t("Есть") if item["available"] else t("Закончился"),
                    t(STATUS_RU[item["status"]]),
                    format_expiry(item["expires_on"], language),
                    added_at.strftime("%d.%m.%Y"),
                ]
            ]
        )
    return output.getvalue().encode("utf-8-sig")


def export_pdf(
    kit_name: str, rows: list[dict], generated_at: datetime, media_dir: Path, language: str = "ru"
) -> bytes:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    def t(message, **values):
        return tr(language, message, **values)

    with _FONT_LOCK:
        if "CabinetSans" not in pdfmetrics.getRegisteredFontNames():
            fonts = Path(__file__).parent / "fonts"
            pdfmetrics.registerFont(TTFont("CabinetSans", str(fonts / "DejaVuSans.ttf")))
            pdfmetrics.registerFont(TTFont("CabinetSansBold", str(fonts / "DejaVuSans-Bold.ttf")))
            pdfmetrics.registerFontFamily(
                "CabinetSans",
                normal="CabinetSans",
                bold="CabinetSansBold",
                italic="CabinetSans",
                boldItalic="CabinetSansBold",
            )
    output = BytesIO()
    doc = SimpleDocTemplate(
        output,
        pagesize=A4,
        rightMargin=38,
        leftMargin=38,
        topMargin=38,
        bottomMargin=42,
        title=f"{t('Аптечка')}: {kit_name}",
        author="HAMB",
    )
    body = ParagraphStyle(
        "body",
        fontName="CabinetSans",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#263742"),
        alignment=TA_LEFT,
        splitLongWords=True,
    )
    heading = ParagraphStyle(
        "heading", parent=body, fontName="CabinetSansBold", fontSize=18, leading=23, spaceAfter=10
    )
    group_style = ParagraphStyle(
        "group",
        parent=body,
        fontName="CabinetSansBold",
        fontSize=12,
        leading=17,
        spaceBefore=14,
        spaceAfter=7,
        keepWithNext=True,
    )
    small = ParagraphStyle(
        "small", parent=body, fontSize=8, leading=12, textColor=colors.HexColor("#526570")
    )

    def para(text, style=body):
        # All medicine/user text is literal; never interpreted as reportlab markup.
        return Paragraph(escape(str(text)).replace("\n", "<br/>"), style)

    story = [
        para(f"{t('Аптечка')} · {kit_name}", heading),
        para(
            t(
                "Сформировано: {stamp} ({zone}). Упаковок в выборке: {count}.",
                stamp=generated_at.strftime("%d.%m.%Y %H:%M"),
                zone=generated_at.tzinfo,
                count=len(rows),
            ),
            small,
        ),
        Spacer(1, 10),
    ]
    groups = {}
    for item in rows:
        groups.setdefault(item["group_id"], []).append(item)
    if not rows:
        story.append(para(t("В выбранной аптечке или по указанным фильтрам упаковок нет.")))
    for items in groups.values():
        story.append(para(items[0]["name"], group_style))
        for item in items:
            available = t("Есть") if item["available"] else t("Закончился")
            stamp = (
                datetime.fromisoformat(item["added_at"])
                .astimezone(generated_at.tzinfo)
                .strftime("%d.%m.%Y %H:%M")
            )
            description = f"{t('Упаковка')} №{item['number']} · {available}\n{t(STATUS_RU[item['status']])}\n{t('Годен ДО')}: {format_expiry(item['expires_on'], language)}\n{t('Добавлено')}: {stamp}"
            image_id = item.get("image_id")
            photo_path = media_dir / f"{image_id}.jpg" if image_id else None
            photo = ""
            if photo_path and photo_path.is_file():
                reader = ImageReader(str(photo_path))
                width, height = reader.getSize()
                factor = min(64 / width, 64 / height)
                photo = Image(str(photo_path), width=width * factor, height=height * factor)
            info = Table([[photo, para(description)]], colWidths=[78, 441])
            border = "#c33d43" if item["status"] == "expired" else "#d7e2e7"
            info.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 8),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                        ("LINEBEFORE", (0, 0), (0, -1), 2, colors.HexColor(border)),
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f3f7f8")),
                    ]
                )
            )
            story.extend([info, Spacer(1, 5)])
            if item["info"]:
                # A separate paragraph may split across pages even for 5000-character notes.
                story.extend([para(t("Доп. информация") + ": " + item["info"]), Spacer(1, 9)])

    def footer(canvas, document):
        canvas.saveState()
        canvas.setFont("CabinetSans", 8)
        canvas.setFillColor(colors.HexColor("#526570"))
        canvas.drawString(38, 24, t("Medicine Cabinet · Состояние на момент экспорта"))
        canvas.drawRightString(A4[0] - 38, 24, str(document.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return output.getvalue()
