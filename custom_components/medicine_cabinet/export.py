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


def category_name(category: dict, language: str) -> str:
    """Translate starter labels, retaining custom names exactly as entered."""
    return category.get("name_en", category["name"]) if language == "en" else category["name"]


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
            t("Категории"),
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
                    "; ".join(category_name(c, language) for c in item.get("categories", [])),
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
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import (
        CondPageBreak,
        Flowable,
        Image,
        Paragraph,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )

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
        topMargin=34,
        bottomMargin=42,
        title=f"{t('Аптечка')}: {kit_name}",
        author="HAMB",
    )
    ink = colors.HexColor("#263742")
    muted = colors.HexColor("#627782")
    accent = colors.HexColor("#3686a0")
    body = ParagraphStyle(
        "body",
        fontName="CabinetSans",
        fontSize=9,
        leading=14,
        textColor=ink,
        splitLongWords=True,
    )
    heading = ParagraphStyle(
        "heading",
        parent=body,
        fontName="CabinetSansBold",
        fontSize=21,
        leading=27,
        spaceAfter=9,
    )
    group_style = ParagraphStyle(
        "group",
        parent=body,
        fontName="CabinetSansBold",
        fontSize=13,
        leading=18,
        spaceBefore=14,
        spaceAfter=7,
    )
    small = ParagraphStyle("small", parent=body, fontSize=8, leading=12, textColor=muted)
    label = ParagraphStyle("label", parent=small, spaceAfter=4)
    brand = ParagraphStyle(
        "brand", parent=small, fontName="CabinetSansBold", textColor=accent, spaceAfter=7
    )
    tag_style = ParagraphStyle("category", parent=body, fontSize=8, leading=11)

    def literal(text):
        # All user text is literal; never interpreted as reportlab markup.
        return escape(str(text)).replace("\n", "<br/>")

    def para(text, style=body):
        return Paragraph(literal(text), style)

    class CategoryBadges(Flowable):
        """Wrap colored category labels, including names wider than one line."""

        def __init__(self, categories):
            super().__init__()
            self.categories = categories

        def wrap(self, avail_width, avail_height):
            self.badges = []
            x = y = line_height = 0
            for category in self.categories:
                name = category_name(category, language)
                text_width = max(
                    pdfmetrics.stringWidth(line, "CabinetSans", 8) for line in name.split("\n")
                )
                width = min(avail_width, text_width + 24)
                paragraph = para(name, tag_style)
                _, height = paragraph.wrap(width - 24, avail_height)
                height += 8
                if x and x + width > avail_width:
                    y += line_height + 5
                    x = line_height = 0
                self.badges.append(
                    (x, y, width, height, paragraph, colors.HexColor(category["color"]))
                )
                x += width + 5
                line_height = max(line_height, height)
            self.width, self.height = avail_width, y + line_height
            return self.width, self.height

        def draw(self):
            canvas = self.canv
            canvas.saveState()
            for x, y, width, height, paragraph, color in self.badges:
                bottom = self.height - y - height
                canvas.setFillColor(
                    colors.linearlyInterpolatedColor(color, colors.white, 0, 1, 0.9)
                )
                canvas.roundRect(x, bottom, width, height, 5, stroke=0, fill=1)
                canvas.setFillColor(color)
                canvas.circle(x + 8, bottom + height / 2, 2.3, stroke=0, fill=1)
                paragraph.drawOn(canvas, x + 16, bottom + 4)
            canvas.restoreState()

    story = [
        para("HAMB", brand),
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
        Spacer(1, 9),
    ]
    groups = {}
    for item in rows:
        groups.setdefault(item["group_id"], []).append(item)
    if not rows:
        story.append(para(t("В выбранной аптечке или по указанным фильтрам упаковок нет.")))
    for items in groups.values():
        # Reserve space for the heading and the start of its first card. Keeping
        # the entire card with the heading would leave a nearly blank page for long notes.
        story.extend([CondPageBreak(140), para(items[0]["name"], group_style)])
        for item in items:
            available = t("Есть") if item["available"] else t("Закончился")
            details = [
                para(f"{t('Упаковка')} №{item['number']} · {available}", label),
                Paragraph(
                    f"{literal(t('Годен ДО'))}: <b>{literal(format_expiry(item['expires_on'], language))}</b>",
                    body,
                ),
            ]
            border = "#d7e2e7"
            if item["status"] in ("expired", "due_7", "due_90"):
                border = "#b74348" if item["status"] == "expired" else "#a76a18"
                warning = ParagraphStyle(
                    "warning", parent=small, textColor=colors.HexColor(border), spaceBefore=3
                )
                details.append(para(t(STATUS_RU[item["status"]]), warning))
            if item.get("categories"):
                details.extend([Spacer(1, 9), CategoryBadges(item["categories"])])
            if item["info"].strip():
                details.extend(
                    [
                        Spacer(1, 10),
                        para(t("Доп. информация"), label),
                        para(item["info"]),
                    ]
                )
            image_id = item.get("image_id")
            photo_path = media_dir / f"{image_id}.jpg" if image_id else None
            cells = [details]
            widths = [doc.width - 12]  # Account for the document frame's inner padding.
            if photo_path and photo_path.is_file():
                width, height = ImageReader(str(photo_path)).getSize()
                factor = min(70 / width, 70 / height)
                cells.append(Image(str(photo_path), width=width * factor, height=height * factor))
                widths = [widths[0] - 94, 94]
            # A long description may split inside its card rather than overflow a page.
            card = Table([cells], colWidths=widths, splitByRow=1, splitInRow=1)
            card.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 12),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                        ("TOPPADDING", (0, 0), (-1, -1), 12),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                        ("LINEBEFORE", (0, 0), (0, -1), 2, colors.HexColor(border)),
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f5f8fa")),
                    ]
                )
            )
            story.extend([card, Spacer(1, 7)])

    def footer(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#d7e2e7"))
        canvas.setLineWidth(0.5)
        canvas.line(44, 36, A4[0] - 44, 36)
        canvas.setFont("CabinetSans", 8)
        canvas.setFillColor(muted)
        canvas.drawString(44, 23, t("HAMB · Состояние на момент экспорта"))
        canvas.drawRightString(A4[0] - 44, 23, str(document.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return output.getvalue()
