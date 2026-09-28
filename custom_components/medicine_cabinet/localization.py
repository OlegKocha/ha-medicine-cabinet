"""Local server translations; user-entered text is kept verbatim."""

import re

EN = {
    "Лекарство с таким названием уже есть в этой аптечке": "A medicine with this name already exists in this medicine box",
    "Категория с таким названием уже существует": "A category with this name already exists",
    "Название категории": "Category name",
    "Категории": "Categories",
    "Повреждён список категорий": "The category catalog is damaged",
    "Некорректный список категорий": "Invalid category selection",
    "Можно выбрать не больше 5 категорий": "Choose no more than 5 categories",
    "Укажите цвет в формате #RRGGBB": "Enter a color in #RRGGBB format",
    "Укажите значок Home Assistant, например mdi:pill": "Enter a Home Assistant icon, for example mdi:pill",
    "Истекает в течение 90 дней": "Expires within 90 days",
    "Истекает в течение 7 дней": "Expires within 7 days",
    "Просрочено": "Expired",
    "Аптечка": "Medicine Box",
    "Бессрочно": "No expiry",
    "Наличие": "Availability",
    "Есть": "In stock",
    "Закончился": "Finished",
    "Годен ДО": "Expiry date",
    "Доп. информация": "Additional information",
    "Добавлено": "Added",
    "Название аптечки": "Medicine box name",
    "Препарат": "Medicine",
    "Фото должно быть не больше 10 МБ": "Photo must be no larger than 10 MB",
    "Упаковка": "Package",
    "Дата добавления": "Date added",
    "Состояние": "Status",
    "Срок не истёк": "Not expired",
    "Сформировано: {stamp} ({zone}). Упаковок в выборке: {count}.": "Generated: {stamp} ({zone}). Packages selected: {count}.",
    "В выбранной аптечке или по указанным фильтрам упаковок нет.": "No packages in this medicine box or matching the selected filters.",
    "HAMB · Состояние на момент экспорта": "HAMB · Inventory at the time of export",
    "«{name}» скоро просрочится.": "“{name}” expires soon.",
    "Одна из упаковок «{name}» скоро просрочится.": "One of the packages of “{name}” expires soon.",
    "Срок годности «{name}» истёк.": "“{name}” has expired.",
    "Одна из упаковок «{name}» уже просрочена.": "One of the packages of “{name}” has expired.",
    "Аптечка: {kit}\n{warning}\nГоден до: {expiry}": "Medicine box: {kit}\n{warning}\nExpiry date: {expiry}",
    "Неподдерживаемая версия данных аптечки": "Unsupported inventory data version",
    "Повреждён файл данных аптечки": "The inventory data file is damaged",
    "Повреждён срок годности упаковки": "The package expiry data is damaged",
    "Укажите дату в формате ГГГГ-ММ-ДД": "Enter a date in YYYY-MM-DD format",
    "Укажите существующую дату": "Enter a valid date",
    "Запись не найдена. Обновите страницу": "Record not found. Refresh the page",
    "Неизвестный фильтр": "Unknown filter",
    "Данные изменились на другом устройстве. Обновите список и повторите изменение": "The inventory changed on another device. Refresh the list and try again",
    "Препарат находится в другой аптечке": "This medicine is in another medicine box",
    "Упаковка находится в другой аптечке": "This package is in another medicine box",
    "Некорректное значение «Бессрочно»": "Invalid No expiry value",
    "Некорректная фотография": "Invalid photo",
    "Некорректное наличие": "Invalid availability",
    "Неизвестное действие": "Unknown action",
    "Название препарата": "Medicine name",
    "Интеграция перезагружается. Повторите действие": "The integration is reloading. Please try again",
    "Интеграция отключена или ещё загружается": "The integration is disabled or still loading",
    "Некорректные параметры экспорта": "Invalid export parameters",
    "Некорректный фильтр": "Invalid filter",
    "Фотография не найдена. Загрузите её снова": "Photo not found. Upload it again",
    "Выберите JPEG, PNG или WebP до 40 мегапикселей": "Choose a JPEG, PNG, or WebP image up to 40 megapixels",
    "Не удалось прочитать фото. Выберите JPEG, PNG или WebP": "Could not read the photo. Choose JPEG, PNG, or WebP",
    "Найдена повреждённая копия данных. Восстановите резервную копию HA": "A damaged inventory copy was found. Restore a Home Assistant backup",
    "Файл аптечки повреждён. Восстановите резервную копию HA": "The inventory file is damaged. Restore a Home Assistant backup",
}


def tr(language, message, **values):
    translated = EN.get(message, message) if language == "en" else message
    return translated.format(**values) if values else translated


def error_message(language, message):
    if language != "en":
        return message
    if message in EN:
        return EN[message]
    match = re.fullmatch(r"(.+): от ([01]) до (\d+) символов", message)
    if match:
        return f"{tr(language, match[1])}: between {match[2]} and {match[3]} characters"
    if message.endswith(": требуется текст"):
        return tr(language, message.removesuffix(": требуется текст")) + ": text is required"
    return "Unable to complete the operation. Refresh the page and try again."
