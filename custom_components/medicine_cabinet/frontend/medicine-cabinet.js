"use strict";
/** Local translations. User-entered names and notes are never translated. */
const english = {
    "Количество упаковок": "Number of packages",
    "Уменьшить количество": "Decrease quantity",
    "Увеличить количество": "Increase quantity",
    "От 1 до 100. Дата, фото и категории будут одинаковыми.": "From 1 to 100. All packages will share the date, photo, and categories.",
    "Отображение": "Display",
    "Развёрнутый": "Expanded",
    "Компактный": "Compact",
    "Вид списка": "List view",
    "Сохраняется для вас в этом браузере.": "Saved for you in this browser.",
    "Ревизия аптечки": "Medicine box stocktake",
    "Начать ревизию": "Start stocktake",
    "Ревизия: ": "Stocktake: ",
    "Проверьте каждую упаковку. Отметки можно менять до завершения.": "Check each package. You can change your selections before finishing.",
    "Будут показаны все упаковки этой аптечки, включая закончившиеся.": "Includes every package in this medicine box, including finished ones.",
    "На месте": "Present",
    "Закончилась": "Finished",
    "Не нашёл": "Not found",
    "Сбросить отметку": "Clear selection",
    "Проверено: ": "Checked: ",
    "Не проверено: ": "Unchecked: ",
    "Завершить ревизию": "Finish stocktake",
    "Завершить ревизию?": "Finish stocktake?",
    "Вернуться к ревизии": "Continue stocktake",
    "Наличие изменится только у упаковок с отметками «На месте» и «Закончилась».": "Only packages marked Present or Finished will have their availability updated.",
    "Ненайденные и непроверенные упаковки сохранятся без изменений.": "Not-found and unchecked packages will be kept unchanged.",
    "Последняя ревизия": "Last stocktake",
    "Посмотреть результат": "View results",
    "Ревизия завершена": "Stocktake complete",
    "Ненайденные упаковки": "Packages not found",
    "Ненайденных упаковок нет.": "No packages were marked Not found.",
    "Список изменился на другом устройстве. Обновите ревизию и проверьте новые или изменённые упаковки.": "The inventory changed on another device. Refresh the stocktake and check any new or changed packages.",
    "Обновить ревизию": "Refresh stocktake",
    "Отметки неизменённых упаковок сохранены. Проверьте оставшиеся.": "Selections for unchanged packages were kept. Check the remaining packages.",
    "Аптечка удалена на другом устройстве. Ревизия закрыта.": "This medicine box was deleted on another device. The stocktake was closed.",
    "Пока нет упаковок для ревизии.": "There are no packages to check yet.",
    "Сохранить и завершить": "Save and finish",
    "Изменить лекарство": "Edit medicine",
    "Изменённые поля применятся ко всем упаковкам: ": "Changed fields will apply to all packages: ",
    "Остальные данные каждой упаковки сохранятся.": "Other details of each package will be kept.",
    "Разные значения": "Different values",
    "У упаковок разные описания. Введите новое, чтобы заменить их у всех.": "Packages have different notes. Enter new notes to replace them for all packages.",
    "Очистить описание у всех": "Clear notes for all packages",
    "Разные сроки. Без изменения поля каждый сохранится.": "Expiry dates differ. Leave this field unchanged to keep each date.",
    "Разное — не менять": "Mixed — keep unchanged",
    "У упаковок разные фотографии. Новое фото заменит их у всех.": "Packages have different photos. A new photo will replace them for all packages.",
    "Убрать фото у всех": "Remove photo from all packages",
    "Добавить категорию": "Add category",
    "Изменить категорию": "Edit category",
    "Изменить категорию ": "Edit category ",
    "Удалить категорию ": "Delete category ",
    "Удалить категорию?": "Delete category?",
    "Удалить все категории": "Delete all categories",
    "Удалить все категории?": "Delete all categories?",
    "Всего категорий: ": "Total categories: ",
    "Общий список для всех аптечек. Можно изменить или удалить любую категорию, включая стандартные.": "Shared by all medicine boxes. You can edit or delete any category, including the defaults.",
    "Категорий пока нет. Добавьте свою категорию.": "No categories yet. Add your own category.",
    "Категории не найдены.": "No matching categories.",
    "Удалить категорию «": "Delete the category “",
    "»? Она будет снята со всех лекарств. Сами лекарства сохранятся.": "”? It will be removed from all medicines. The medicines will be kept.",
    "Категорий будет удалено: ": "Categories to delete: ",
    "Метки будут сняты со всех лекарств. Сами лекарства сохранятся. Стандартные категории не появятся снова после перезапуска.": "Labels will be removed from all medicines. The medicines will be kept. Default categories will not return after restarting.",
    "Изменения отобразятся у всех лекарств с этой категорией.": "Changes will apply to every medicine using this category.",
    "Обновить список категорий": "Refresh categories",
    "Фильтр по категориям": "Filter by category",
    "Все категории": "All categories",
    "Все": "All",
    "Категории: ": "Categories: ",
    "Поиск в фильтре категорий": "Search category filter",
    "Показываются упаковки из любой выбранной категории.": "Packages from any selected category are shown.",
    "Категории": "Categories",
    "Снять категорию ": "Remove category ",
    "До 5 категорий на упаковку.": "Up to 5 categories per package.",
    "Заменить категории у всех упаковок": "Replace categories for all packages",
    "Без этой отметки категории каждой упаковки сохранятся.": "Leave unchecked to keep each package's categories.",
    "Сначала выбраны только категории, общие для всех упаковок.": "Initially, only categories shared by all packages are selected.",
    "Выбрать категории": "Choose categories",
    "Поиск категории": "Search categories",
    "Своя категория": "Custom category",
    "Название категории": "Category name",
    "Например, Для питомца": "For example, For my pet",
    "Цвет": "Color",
    "Значок Home Assistant": "Home Assistant icon",
    "Сохранится в общем списке для всех аптечек.": "Saved in the shared catalog for all medicine boxes.",
    "Создать и выбрать": "Create and select",
    "Без категории": "Uncategorized",
    "Категория не найдена. Можно создать свою ниже.": "No matching category. Create your own below.",
    "Выбрано 5 категорий. Снимите одну, чтобы выбрать другую.": "5 categories selected. Remove one to choose another.",
    "Новая категория": "New category",
    "Укажите название категории": "Enter a category name",
    "Выбрана сохранённая категория": "Saved category selected",
    "Категория сохранена": "Category saved",
    "Не удалось сохранить категорию": "Could not save the category",
    "Истекает в течение 90 дней": "Expires within 90 days",
    "Истекает в течение 7 дней": "Expires within 7 days",
    "Просрочено": "Expired",
    "Аптечка": "Medicine Box",
    "Открыть боковое меню": "Open sidebar",
    "Данные в Home Assistant": "Stored in Home Assistant",
    "МЕСТО ХРАНЕНИЯ": "STORAGE LOCATION",
    "Выбрать аптечку": "Choose a medicine box",
    "Добавить": "Add",
    "Экспорт": "Export",
    "Настройки аптечек": "Medicine box settings",
    "Поиск по названию и дополнительной информации": "Search by name and additional information",
    "Название или доп. информация": "Name or additional information",
    "Срок годности": "Expiry date",
    "Все сроки": "All expiry dates",
    "До 7 дней": "Within 7 days",
    "От 8 до 90 дней": "8 to 90 days",
    "Более 90 дней": "Over 90 days",
    "Бессрочно": "No expiry",
    "Наличие": "Availability",
    "Любое наличие": "Any availability",
    "Есть": "In stock",
    "Закончился": "Finished",
    "Сортировка": "Sort order",
    "По названию": "Alphabetical",
    "Ближайший срок": "Nearest expiry",
    "Загружаем аптечки…": "Loading medicine boxes…",
    "Нет связи с Home Assistant. Проверьте подключение и обновите страницу.": "Cannot connect to Home Assistant. Check your connection and refresh the page.",
    "Создайте аптечку": "Create a medicine box",
    "В наличии: ": "In stock: ",
    "Просрочено: ": "Expired: ",
    "Закончились: ": "Finished: ",
    "В выборке: ": "Selected: ",
    "У каждой аптечки своё место": "A medicine box for every location",
    "Создайте первую аптечку — например, «Дача». Затем добавьте лекарства и сроки их годности.": "Create your first medicine box, for example Home. Then add medicines and their expiry dates.",
    "Создать аптечку": "Create medicine box",
    "Ничего не найдено": "No results",
    "Здесь будут ваши лекарства": "Your medicines will appear here",
    "Измените поиск или сбросьте фильтры.": "Change your search or reset the filters.",
    "Добавьте первую упаковку. Фотографию можно загрузить позже.": "Add your first package. You can upload a photo later.",
    "Сбросить фильтры": "Reset filters",
    "Сбросить все фильтры": "Reset all filters",
    "Добавить лекарство": "Add medicine",
    "Упаковки: ": "Packages: ",
    "в наличии": "in stock",
    "просрочено": "expired",
    "закончились": "finished",
    "показано ": "showing ",
    "из ": "of ",
    "Фото ": "Photo of ",
    "Годен ДО": "Expiry date",
    "Все упаковки закончились": "All packages are finished",
    "Доп. информация": "Additional information",
    "Не указана": "Not provided",
    "Изменить ": "Edit ",
    "Добавить упаковку ": "Add package of ",
    "Все упаковки: ": "All packages: ",
    "Отметить: закончились": "Mark all as finished",
    "Отметить: есть": "Mark as in stock",
    "Удалить": "Delete",
    "Упаковка №": "Package #",
    "Изменить упаковку №": "Edit package #",
    "Фото упаковки №": "Photo of package #",
    "Добавлено": "Added",
    "Отметить: закончился": "Mark as finished",
    "Годен ДО: ": "Expiry date: ",
    "Не удалось загрузить фото": "Could not load photo",
    "Фото временно недоступно": "Photo temporarily unavailable",
    "Препараты не найдены": "No medicines found",
    "Используется фото другой упаковки": "Using a photo from another package",
    "Новое лекарство": "New medicine",
    "Удалить аптечку?": "Delete medicine box?",
    "Все препараты и упаковки этой аптечки будут удалены.": "All medicines and packages in this medicine box will be deleted.",
    "Удалить упаковку?": "Delete package?",
    "будет удалена из аптечки.": "will be deleted from this medicine box.",
    "Удалить все упаковки?": "Delete all packages?",
    "Вы действительно хотите удалить все упаковки лекарства «": "Do you really want to delete all packages of «",
    "Количество: ": "Quantity: ",
    "шт.": "packages.",
    "Без фотографии": "No photo",
    "Список обновлён. Повторите изменение.": "List refreshed. Please try your change again.",
    "Сохранить": "Save",
    "Закрыть": "Close",
    "Отмена": "Cancel",
    "Название аптечки": "Medicine box name",
    "Новая аптечка": "New medicine box",
    "Название": "Name",
    "Например, Дача": "For example, Home",
    "Препарат": "Medicine",
    "Поиск препарата": "Search medicines",
    "Сохранённые лекарства": "Saved medicines",
    "Название, форма или дозировка": "Name, form, or strength",
    "Дозировка, описание или ваши заметки": "Dosage, description, or your notes",
    "Фотография · необязательно": "Photo · optional",
    "Убрать": "Remove",
    "Используется сохранённая фотография": "Using the saved photo",
    "JPEG, PNG или WebP, до 10 МБ. HEIC сначала сохраните как JPEG.": "JPEG, PNG, or WebP, up to 10 MB. Convert HEIC to JPEG first.",
    "Изменение срока, включая отметку «Бессрочно», означает замену упаковки: дата добавления обновится, наличие станет «Есть».": "Changing the expiry date or No expiry setting replaces this package: the date added is updated and availability becomes In stock.",
    "Напоминания о сроке не отправляются.": "No expiry reminders will be sent.",
    "Просрочен с 00:00 указанной даты по времени HA.": "Expired from 00:00 on this date in the Home Assistant time zone.",
    "Аптечки и настройки": "Medicine boxes and settings",
    "Переименовать": "Rename",
    "Удалить аптечку": "Delete medicine box",
    "Напоминания отправляются отдельно для каждой упаковки за 90 и за 7 дней. Данные и фотографии хранятся на вашем сервере.": "Each package has reminders at 90 and 7 days. Records and photos are stored on your server.",
    "Время и получателей уведомлений настраивает администратор HA.": "A Home Assistant administrator can change the language, sidebar title, and reminders.",
    "Скачать аптечку": "Download medicine box",
    "Файл сохранится локально.": "The file will be saved locally.",
    "Препаратов: ": "Medicines: ",
    "Упаковок: ": "Packages: ",
    "По выбранным фильтрам лекарств нет.": "No medicines match the selected filters.",
    "Формат": "Format",
    "с фотографиями": "with photos",
    "для таблиц": "for spreadsheets",
    "Просроченные": "Expired medicines",
    "До 90 дней, включая просроченные": "Within 90 days, including expired",
    "Более чем через 90 дней": "More than 90 days away",
    "Все лекарства": "All medicines",
    "Добавить закончившиеся": "Include all finished packages",
    "По сроку выбираются упаковки в наличии. Галочка добавляет все закончившиеся независимо от срока.": "Expiry filters select packages in stock. The checkbox adds all finished packages, regardless of expiry.",
    "Бессрочные упаковки входят в «Все лекарства». Закончившиеся можно добавить при любом сроке.": "Packages without expiry are included in All medicines. Finished packages can be added to any expiry selection.",
    "Скачать": "Download",
    "Упаковка отмечена как закончившаяся": "Package marked as finished",
    "Упаковка снова в наличии": "Package is in stock again",
    "Все упаковки снова в наличии": "All packages are in stock again",
    "Все упаковки отмечены как закончившиеся": "All packages marked as finished",
    "Файл подготовлен для скачивания": "File ready to download",
    "Фото должно быть не больше 10 МБ": "Photo must be no larger than 10 MB",
    "Удалено": "Deleted",
    "Сохранено": "Saved",
    "Состав аптечки изменился. Обновите список, проверьте количество упаковок и повторите удаление.": "The inventory has changed. Refresh the list, check the package count, and try deleting again.",
    "Ваш ввод пока сохранён в форме. Скопируйте нужные изменения перед перезагрузкой записи.": "Your input is still in this form. Copy any changes you need before reloading the record.",
    "Перезагрузить запись": "Reload record",
    "Язык, название и уведомления →": "Language, sidebar title, and reminders →"
};
function translate(language, message) {
    return language === "en" ? (english[message] ?? message) : message;
}
const escapeHtml = (text) => String(text ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const compareExpiry = (a, b) => Number(a.expires_on === null) - Number(b.expires_on === null) || (a.expires_on || "").localeCompare(b.expires_on || "");
const labels = { due_90: "Истекает в течение 90 дней", due_7: "Истекает в течение 7 дней", expired: "Просрочено" };
const icon = (name) => {
    const paths = {
        check: '<path d="m5 12 4 4L19 6"/>',
        minus: '<path d="M5 12h14"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        bag: '<path d="M8 6V4h8v2m-12 0h16v15H4zM12 10v7m-3-3.5h6"/>',
        plus: '<path d="M12 5v14M5 12h14"/>', edit: '<path d="m4 16-1 5 5-1L20 8l-4-4L4 16Zm10-10 4 4"/>',
        search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
        download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', photo: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 6-6 5 5 3-3 4 4"/>',
        settings: '<path d="m9 3-.6 2.4-2 .9-2.2-.7-2 3.4L4 10.7v2.6l-1.8 1.7 2 3.4 2.2-.7 2 .9L9 21h4l.6-2.4 2-.9 2.2.7 2-3.4-1.8-1.7v-2.6L19.8 9l-2-3.4-2.2.7-2-.9L13 3Z"/><circle cx="11" cy="12" r="3"/>',
        trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
        close: '<path d="m6 6 12 12M18 6 6 18"/>',
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bag}</svg>`;
};
const styles = `
:host{display:block;height:100%;color:var(--primary-text-color,#243746);background:var(--primary-background-color,#f5f8fa);font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,sans-serif);--mc-accent:var(--primary-color,#007f88);--mc-line:var(--divider-color,#d9e3e8);--mc-muted:var(--secondary-text-color,#627782);--mc-card:var(--card-background-color,#fff);--mc-danger:var(--error-color,#c33d43);--mc-warn:var(--warning-color,#ad6a13);--mc-radius:var(--ha-card-border-radius,14px)}
*{box-sizing:border-box}button,input,select,textarea{font:inherit;color:inherit}button,select{cursor:pointer}button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;border:1px solid var(--mc-line);border-radius:9px;padding:8px 13px;background:var(--mc-card);font-weight:600}button:hover{border-color:var(--mc-accent)}button:disabled{opacity:.5;cursor:wait}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid var(--mc-accent);outline-offset:3px}svg{width:21px;height:21px;flex-shrink:0}.primary{background:var(--mc-accent);color:var(--text-primary-color,#fff);border-color:transparent}.quiet{background:transparent;border-color:transparent}.icon{width:42px;padding:8px}.danger{color:var(--mc-danger)}.muted{color:var(--mc-muted)}.small{font-size:13px}.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.app{height:100%;overflow:auto;padding-bottom:env(safe-area-inset-bottom,16px)}header{height:64px;display:flex;align-items:center;gap:14px;padding:0 22px;border-bottom:1px solid var(--mc-line);background:var(--mc-card)}.sidebar-toggle{display:none;flex-shrink:0;width:44px;min-height:44px}:host([narrow]) .sidebar-toggle{display:inline-flex}.header-logo{display:inline-flex}:host([narrow]) .header-logo{display:none}header strong{font-size:20px;font-weight:600;letter-spacing:-.4px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.offline-label{margin-left:auto;display:flex;align-items:center;gap:6px;color:var(--mc-muted);font-size:12px}.dot{width:7px;height:7px;border-radius:50%;background:var(--mc-accent)}main{max-width:1080px;margin:auto;padding:32px 28px 64px}.toolbar{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:24px}.kit-picker{flex:1;min-width:180px}.eyebrow{display:block;color:var(--mc-muted);font-size:12px;margin-bottom:7px}.kit-picker select{font-size:26px;font-weight:650;letter-spacing:-.7px;border:1px solid #8dbcd3;border-radius:9px;padding:7px 36px 7px 12px;background:var(--mc-card);width:100%;max-width:420px}.kit-picker option{background:var(--mc-card);font-size:16px}.actions{display:flex;gap:8px;flex-wrap:wrap}.filters{--mc-filter-font-size:14px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;gap:10px;margin:20px 0}.filters>.search{grid-column:1/-1}.filters>select{min-width:0;width:100%}.search{position:relative}.search svg{position:absolute;left:12px;top:12px;color:var(--mc-muted)}input,select,textarea{min-height:44px;border:1px solid var(--mc-line);border-radius:8px;background:var(--mc-card);padding:10px 12px;max-width:100%}.search input{padding-left:40px;width:100%}.summary-line{display:flex;gap:16px;flex-wrap:wrap;min-height:25px;color:var(--mc-muted);font-size:13px;margin-bottom:13px}.summary-line b{color:var(--primary-text-color,#243746)}.cards{display:flex;flex-direction:column;gap:13px}.medicine{border:1px solid var(--mc-line);border-radius:var(--mc-radius);background:var(--mc-card);overflow:hidden}.medicine-header{display:grid;grid-template-columns:67px minmax(0,1fr) minmax(0,1fr) 42px;align-items:center;gap:17px;padding:19px 21px}.medicine-header.has-expired{border-left:4px solid var(--mc-danger);padding-left:17px}.photo{width:67px;height:67px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--secondary-background-color,#edf3f5);flex-shrink:0;overflow:hidden;color:var(--mc-accent)}.photo svg{width:29px;height:29px}.photo img{width:100%;height:100%;object-fit:contain}.medicine-heading{flex:1;min-width:0}.medicine-heading h2{margin:0 0 6px;font-size:18px;font-weight:650;line-height:1.35;overflow-wrap:anywhere}.medicine-heading p{margin:0;color:var(--mc-muted);font-size:13px}.badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 8px;border-radius:6px;border:1px solid currentColor}.badge.expired{color:var(--mc-danger)}.badge.due_7,.badge.due_90{color:var(--mc-warn)}.badge.finished{color:var(--mc-muted);border-style:dashed}.badges{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0}details>summary{padding:12px 21px;font-size:13px;border-top:1px solid var(--mc-line);color:var(--mc-muted);cursor:pointer;line-height:1.6}details[open]>summary{background:var(--secondary-background-color,#edf3f5)}.pack,.group-footer{padding:18px 21px;border-top:1px solid var(--mc-line)}.pack-head{display:flex;align-items:center;gap:10px}.pack-head strong{flex:1;font-size:14px}.pack-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 25px;margin-top:12px;font-size:13px}.pack-meta span{display:block;color:var(--mc-muted);font-size:12px;margin-bottom:4px}.note{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.55;margin:13px 0 0}.pack-photo{width:100px;height:80px;float:right;margin:10px 0 10px 15px}.pack-footer{display:flex;gap:9px;margin-top:15px}.pack-footer button{font-size:12px;min-height:34px}.add-pack{padding:12px 21px;border-top:1px solid var(--mc-line)}.empty{text-align:center;padding:60px 20px;border:1px dashed var(--mc-line);border-radius:var(--mc-radius);background:var(--mc-card)}.empty>svg{width:48px;height:48px;color:var(--mc-accent);margin-bottom:8px}.empty h2{font-size:22px;font-weight:600;margin:12px 0}.empty p{color:var(--mc-muted);max-width:400px;margin:0 auto 20px;line-height:1.6}.notice{padding:12px 15px;border:1px solid var(--mc-danger);border-radius:8px;color:var(--mc-danger);margin:12px 0;white-space:pre-wrap}.notice:empty{display:none}.toast{position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:var(--primary-text-color,#243746);color:var(--primary-background-color,#fff);border-radius:9px;padding:12px 20px;z-index:20;max-width:90vw;font-size:14px}.toast:empty{display:none}
dialog{color:inherit;background:var(--mc-card);border:1px solid var(--mc-line);border-radius:16px;padding:0;max-width:560px;width:calc(100% - 28px);max-height:90dvh;box-shadow:0 18px 70px #0005}dialog::backdrop{background:#142a3b80}dialog form{padding:24px;overflow:auto}dialog h2{font-size:23px;font-weight:650;letter-spacing:-.5px;margin:0}.dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.field{display:flex;flex-direction:column;gap:6px;font-size:14px;min-width:0}.field.full{grid-column:1/-1}.field small{font-size:12px;color:var(--mc-muted);line-height:1.5}.field input,.field select{width:100%;min-width:0}.field input[type=date]{appearance:none;-webkit-appearance:none;min-inline-size:0;max-inline-size:100%}.field input[type=date]::-webkit-date-and-time-value{min-width:0;text-align:left}.field textarea{resize:vertical;min-height:96px;line-height:1.5}.export-preview{border-top:1px solid var(--mc-line);margin-top:20px;padding-top:16px;line-height:1.6;font-size:14px}.export-preview p{margin:4px 0 0}.dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:24px}.file-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.file-row input{font-size:12px;flex:1;min-width:180px}.check{display:flex;align-items:center;gap:8px}.expiry-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:20px}.expiry-heading .check{white-space:nowrap;font-size:13px}.check input{min-height:20px;width:18px;height:18px}.explanation{overflow-wrap:anywhere;color:var(--mc-muted);font-size:14px;line-height:1.65}.settings-link{display:block;padding:12px;border:1px solid var(--mc-line);border-radius:8px;margin:10px 0;color:var(--mc-accent);text-decoration:none}.loading{text-align:center;padding:60px 20px;color:var(--mc-muted)}
.medicine-info{min-width:0}.medicine-info .note{margin:0;font-size:13px}.medicine-info.multiple .note{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.medicine-actions{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.single-pack{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.single-pack .pack-meta,.single-pack .pack-footer,.group-footer .pack-footer{margin:0}.group-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.dialog-heading h2[tabindex]:focus{outline:none}.group-picker{position:relative;border:1px solid var(--mc-line);border-radius:8px;min-width:0}.group-picker>summary{display:flex;align-items:center;gap:12px;min-height:44px;list-style:none;border:0;padding:10px 12px;color:inherit;font-size:14px;line-height:1.5;background:var(--mc-card);border-radius:8px}.group-picker>summary::-webkit-details-marker{display:none}.group-value{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.group-picker>summary::after{content:"";width:8px;height:8px;border-right:1.7px solid currentColor;border-bottom:1.7px solid currentColor;transform:rotate(45deg);margin:0 3px 4px;flex-shrink:0}.group-picker[open]>summary::after{transform:rotate(225deg);margin-bottom:-4px}.group-dropdown{position:absolute;z-index:2;top:calc(100% + 4px);left:-1px;right:-1px;border:1px solid var(--mc-line);border-radius:9px;background:var(--mc-card);box-shadow:0 8px 24px #0002;overflow:hidden}.group-search{padding:8px}.group-search input{font-size:14px}.group-search svg{left:20px;top:20px}.group-option{display:block;width:100%;height:44px;min-height:44px;border:0;border-radius:0;padding:10px 12px;text-align:left;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.group-option:hover,.group-option:focus-visible{background:var(--secondary-background-color,#edf3f5)}.group-option:focus-visible{outline:2px solid var(--mc-accent);outline-offset:-2px}.group-option[aria-pressed=true]{color:var(--mc-accent);background:var(--secondary-background-color,#edf3f5)}.group-new{border-bottom:1px solid var(--mc-line)}.group-results{max-height:132px;overflow-y:auto;overscroll-behavior:contain}.group-results p{padding:0 12px}

.settings-categories>.search,.category-picker-body>.search{display:block}.settings-categories{border-top:1px solid var(--mc-line);margin-top:22px;padding-top:18px}.category-catalog-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}.category-catalog-heading h3{font-size:18px;margin:0}.category-catalog-list{max-height:320px;max-height:min(40dvh,320px);overflow:auto;overscroll-behavior:contain;margin:12px 0}.category-catalog-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--mc-line)}.category-catalog-row>.category-badge{min-width:0}.category-row-actions{display:flex;flex:none;gap:2px}.category-row-actions .icon{width:38px;min-height:38px;padding:8px}.category-catalog-count{margin:10px 0}.category-editor{display:flex;flex-direction:column;gap:14px}.category-catalog-footer button{font-size:13px}.category-catalog-footer[hidden]{display:none}
.category-badges{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 10px}.category-badge{display:inline-flex;align-items:center;gap:6px;max-width:100%;min-width:0;padding:4px 8px;border-radius:7px;background:color-mix(in srgb,var(--category-color) 16%,var(--mc-card));color:var(--primary-text-color,#243746);font-size:12px;line-height:1.5}.category-badge>span{min-width:0;overflow-wrap:anywhere}.category-badge ha-icon{--mdc-icon-size:17px;width:17px;height:17px;flex:none;color:var(--category-color)}.category-badge .category-remove{min-height:26px;width:26px;padding:3px;margin:-3px -5px -3px 0;border-radius:5px}.category-remove svg{width:15px;height:15px}.category-title{display:flex;align-items:center;justify-content:space-between;gap:12px}.selected-categories{margin:3px 0}.category-picker{border:1px solid var(--mc-line);border-radius:8px}.category-picker>summary,.category-create>summary{border:0;padding:10px 12px;color:inherit;font-size:14px}.category-picker-body{padding:0 12px 12px}.category-options{display:flex;flex-direction:column;max-height:240px;overflow:auto;margin:10px 0;overscroll-behavior:contain}.category-option{display:flex;align-items:center;gap:8px;min-height:44px;padding:5px 0;cursor:pointer}.category-option input{width:18px;height:18px;min-height:18px;margin:0;flex-shrink:0;accent-color:var(--mc-accent)}.category-option:has(input:disabled){opacity:.5;cursor:not-allowed}.category-limit{display:block}.category-create{border-top:1px solid var(--mc-line);margin-top:8px}.category-create-fields{display:flex;flex-direction:column;gap:12px}.category-appearance{display:grid;grid-template-columns:70px minmax(0,1fr);gap:12px}.category-icon-field{min-width:0}.category-icon-field ha-form{display:block}.category-icon-field label[hidden]{display:none}.category-appearance input[type=color]{padding:4px;min-height:44px}.category-create-fields button:disabled{cursor:not-allowed}.category-new-preview{margin:0}.category-error{margin:0}.category-field [hidden]{display:none}
.filters>select,.filters>.reset-filters,.filters>.category-filter>summary{font-family:inherit;font-size:var(--mc-filter-font-size);font-weight:400;font-style:normal;line-height:1.4;letter-spacing:normal}
.category-filter{position:relative;min-width:0}.category-filter>summary{display:flex;align-items:center;gap:8px;min-height:44px;height:100%;border:1px solid var(--mc-line);border-radius:8px;padding:10px 12px;list-style:none;color:inherit;background:var(--mc-card)}.category-filter>summary::-webkit-details-marker{display:none}.category-filter-value{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.category-filter>summary::after{content:"";width:7px;height:7px;border-right:1.7px solid currentColor;border-bottom:1.7px solid currentColor;transform:rotate(45deg);margin:0 3px 4px;flex:none}.category-filter[open]>summary::after{transform:rotate(225deg);margin-bottom:-4px}.category-filter[data-active=true]>summary{border-color:var(--mc-accent)}.category-filter-dropdown{position:absolute;z-index:5;top:calc(100% + 6px);left:0;width:320px;max-width:calc(100vw - 28px);padding:12px;border:1px solid var(--mc-line);border-radius:9px;background:var(--mc-card);box-shadow:0 8px 24px #0002}.category-filter-dropdown>.search{display:block}.category-filter-dropdown input[type=search]{font-size:14px}.category-filter-dropdown>p{font-size:12px;line-height:1.5;margin:10px 0 0}.category-filter-options{max-height:min(240px,35dvh);overflow:auto;overscroll-behavior:contain}.category-filter-option,.category-filter-all{display:flex;align-items:center;gap:8px;min-height:44px;padding:5px 2px;cursor:pointer;font-size:14px}.category-filter-option input,.category-filter-all input{width:18px;height:18px;min-height:18px;margin:0;flex:none;accent-color:var(--mc-accent)}.category-filter-all{border-bottom:1px solid var(--mc-line);margin:5px 0}.category-filter-options>p{font-size:13px;line-height:1.5;padding:0 2px}
@media(min-width:701px) and (max-width:1100px){.category-filter-dropdown{left:auto;right:0}.filters{--mc-filter-font-size:13px;grid-template-columns:repeat(4,minmax(0,1fr))}.filters .search{grid-column:1/-1}.filters .reset-filters{grid-column:1/-1}.filters select,.filters button{min-width:0}}
@media(max-width:700px){.medicine-header{grid-template-columns:56px minmax(0,1fr) 42px}.medicine-info{grid-column:1/-1}.medicine-actions{grid-column:3;grid-row:1}.single-pack{align-items:flex-start}main{padding:21px 14px 50px}header{padding:0 12px}.offline-label{font-size:11px}.toolbar{gap:10px;margin-bottom:18px}.kit-picker select{font-size:25px}.actions{width:100%}.actions .primary{flex:1}.filters{--mc-filter-font-size:12px;grid-template-columns:1fr 1fr}.search{grid-column:1/-1}.filters select{min-width:0}.filters .reset-filters{min-width:0;grid-column:1/-1}.medicine-header{padding:16px;gap:12px}.medicine-header.has-expired{padding-left:12px}.medicine-heading h2{font-size:17px}.photo{width:56px;height:56px}.pack,.group-footer,details>summary,.add-pack{padding-left:16px;padding-right:16px}.pack-meta{gap:10px;font-size:12px}.form-grid{grid-template-columns:minmax(0,1fr)}.field.full{grid-column:auto}dialog form{padding:20px}.summary-line{gap:10px;font-size:12px}}

[hidden]{display:none!important}.settings-section{border-top:1px solid var(--mc-line);padding-top:18px;margin-top:20px}.settings-section h3{font-size:18px;margin:0 0 12px}.settings-section p{line-height:1.5}.view-switch{display:flex;gap:8px}.view-switch button{flex:1;font-size:14px}.view-switch button[aria-pressed=true]{border-color:var(--mc-accent);color:var(--mc-accent);background:color-mix(in srgb,var(--mc-accent) 9%,var(--mc-card))}.quantity-control{display:flex;gap:8px;align-items:center}.quantity-control button{width:44px;min-height:44px;padding:8px}.quantity-control input{width:90px;text-align:center;appearance:textfield}.quantity-control input::-webkit-inner-spin-button,.quantity-control input::-webkit-outer-spin-button{appearance:none;margin:0}
.compact-medicine>summary{list-style:none;display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:0;color:inherit}.compact-medicine>summary::-webkit-details-marker{display:none}.compact-medicine>summary::after{content:"";width:8px;height:8px;border-right:1.7px solid currentColor;border-bottom:1.7px solid currentColor;transform:rotate(45deg);flex:none;margin:0 4px 4px}.compact-medicine[open]>summary::after{transform:rotate(225deg)}.compact-medicine .photo{width:40px;height:40px}.compact-heading{flex:1;min-width:0}.compact-heading h2{font-size:16px;line-height:1.4;margin:0 0 3px;overflow-wrap:anywhere}.compact-heading p{margin:0;font-size:12px;color:var(--mc-muted)}.compact-heading .category-badges{margin:5px 0 0;gap:4px}.compact-heading .category-badge{font-size:11px;padding:3px 6px;gap:4px}.compact-heading ha-icon{--mdc-icon-size:16px}.compact-actions{padding:10px 16px;display:flex;gap:8px;border-top:1px solid var(--mc-line)}.compact-actions button{font-size:13px}.compact-medicine .pack{padding:14px 16px}
.audit-bar{position:sticky;top:0;z-index:4;background:var(--mc-card);border-bottom:1px solid var(--mc-line);box-shadow:0 3px 12px #0001}.audit-bar-inner{max-width:1080px;margin:auto;padding:12px 28px;display:flex;align-items:center;gap:12px}.audit-bar-copy{flex:1;min-width:0}.audit-bar strong{display:block;font-size:16px;overflow-wrap:anywhere}.audit-progress-text{font-size:13px;color:var(--mc-muted);margin:4px 0}.audit-bar progress{display:block;width:100%;height:5px;accent-color:var(--mc-accent)}.audit-bar button{font-size:13px;flex:none}.audit-intro{margin:0 0 16px;font-size:14px;line-height:1.5;color:var(--mc-muted)}.audit-card-heading{display:flex;align-items:center;gap:12px;padding:16px 20px}.audit-card-heading h2{font-size:18px;margin:0;overflow-wrap:anywhere}.audit-card-heading .photo{width:48px;height:48px}.audit-pack{padding:16px 20px;border-top:1px solid var(--mc-line)}.audit-pack-title{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:14px}.audit-pack .category-badges{margin:10px 0}.audit-pack .note{font-size:13px;margin:8px 0}.audit-choices{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.audit-choices button{min-height:44px;font-size:13px;--choice-color:var(--mc-accent)}.audit-choices [data-state=present]{--choice-color:var(--success-color,#25836b)}.audit-choices [data-state=finished]{--choice-color:var(--warning-color,#ad6a13)}.audit-choices [data-state=missing]{--choice-color:var(--mc-danger)}.audit-choices button[aria-pressed=true]{border-color:var(--choice-color);background:color-mix(in srgb,var(--choice-color) 15%,var(--mc-card));box-shadow:inset 0 0 0 1px var(--choice-color)}.audit-choices button[aria-pressed=true] svg{color:var(--choice-color)}.audit-choices[data-answered=true] button[aria-pressed=false]{border-color:transparent;background:transparent;color:var(--mc-muted)}.audit-choices .audit-clear{margin-left:auto;color:var(--mc-muted);font-weight:400}.audit-counts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.audit-counts div{padding:12px;border:1px solid var(--mc-line);border-radius:9px;font-size:13px}.audit-counts b{display:block;font-size:22px;margin-top:4px}.audit-missing{padding-left:20px;line-height:1.5}.audit-missing li{margin-bottom:10px;overflow-wrap:anywhere}.audit-result-footer{display:flex;justify-content:flex-end;margin-top:22px}
@media(max-width:700px){.audit-bar-inner{padding:10px 14px;align-items:flex-start}.audit-bar strong{font-size:14px}.audit-bar button{font-size:12px;max-width:132px}.audit-pack,.audit-card-heading{padding:14px}.audit-choices{gap:5px}.audit-choices button{padding:8px;font-size:12px;flex:1}.audit-choices .audit-clear{flex:none}.audit-bar-copy{padding-top:3px}.compact-medicine>summary{padding:12px;gap:9px}}
@media(prefers-reduced-motion:no-preference){button{transition:background .12s,border-color .12s}.medicine{animation:appear .18s ease-out}@keyframes appear{from{opacity:.5;transform:translateY(3px)}to{opacity:1;transform:none}}}
`;
class MedicineCabinetPanel extends HTMLElement {
    // Home Assistant updates this property when its navigation changes layout.
    set narrow(value) { this.toggleAttribute("narrow", value); }
    get narrow() { return this.hasAttribute("narrow"); }
    _hass;
    data;
    get language() { return this.data?.settings?.language || "ru"; }
    t(text) { return translate(this.language, text); }
    shellKey = "";
    kitId = "";
    query = "";
    filter = "all";
    availability = "all";
    sort = "name";
    filterCategories = new Set();
    openGroups = new Set();
    compactOpenGroups = new Set();
    viewMode = "expanded";
    audit;
    categorySelection = [];
    groupEdits = new Set();
    creatingCategory = false;
    unsubscribe;
    initialized = false;
    starting = false;
    requestSequence = 0;
    imageUrls = new Map();
    imageRequests = new Map();
    toastTimer;
    reconnect = () => { void this.refresh(); };
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    set hass(value) {
        const userChanged = this._hass?.user?.id !== value.user?.id;
        this._hass = value;
        if (userChanged) {
            this.kitId = this.readSelectedKit();
            this.viewMode = this.readViewMode();
            this.audit = undefined;
            this.openGroups.clear();
            if (this.initialized && this.data) {
                this.resolveSelectedKit();
                this.render();
            }
        }
        if (this.isConnected && !this.initialized)
            void this.start();
    }
    get hass() { return this._hass; }
    connectedCallback() { if (this._hass)
        void this.start(); }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        this._hass?.connection.removeEventListener?.("ready", this.reconnect);
        this.initialized = false;
        this.ownerDocument.removeEventListener("pointerdown", this.onCategoryFilterOutside);
        for (const url of this.imageUrls.values())
            URL.revokeObjectURL(url);
        this.imageUrls.clear();
        if (this.toastTimer)
            clearTimeout(this.toastTimer);
    }
    get root() { return this.shadowRoot; }
    async start() {
        if (this.initialized || this.starting || !this._hass)
            return;
        this.starting = true;
        this.renderShell();
        this.root.addEventListener("click", this.onClick);
        this.root.addEventListener("input", this.onInput);
        this.root.addEventListener("change", this.onChange);
        this.root.addEventListener("submit", this.onSubmit);
        this.root.addEventListener("keydown", this.onPickerKeydown);
        this.ownerDocument.addEventListener("pointerdown", this.onCategoryFilterOutside);
        this.root.addEventListener("focusout", event => {
            const picker = this.dialog.querySelector(".group-picker");
            const next = event.relatedTarget;
            // WebKit moves focus to the dialog on pointer presses on buttons.
            // Let the click handler select the option or close the picker outside it.
            if (picker?.open && next && next !== this.dialog && !picker.contains(next))
                picker.open = false;
            const categoryFilter = this.root.querySelector(".category-filter");
            if (categoryFilter?.open && next && !categoryFilter.contains(next))
                categoryFilter.open = false;
        });
        this.root.addEventListener("toggle", event => {
            const element = event.target;
            if (element.classList.contains("group-picker") && element.open && (!element.contains(this.root.activeElement) || this.root.activeElement?.tagName === "SUMMARY")) {
                element.querySelector("#group-search")?.focus();
            }
            if (element.tagName === "DETAILS" && element.dataset.compactGroup) {
                if (element.open)
                    this.compactOpenGroups.add(element.dataset.compactGroup);
                else
                    this.compactOpenGroups.delete(element.dataset.compactGroup);
            }
            if (element.tagName === "DETAILS" && element.dataset.group) {
                if (element.open)
                    this.openGroups.add(element.dataset.group);
                else
                    this.openGroups.delete(element.dataset.group);
            }
        }, true);
        try {
            this.unsubscribe = await this.hass.connection.subscribeMessage(() => { void this.refresh(); }, { type: "medicine_cabinet/subscribe" });
            this.hass.connection.addEventListener?.("ready", this.reconnect);
            this.initialized = true;
            await this.refresh();
        }
        catch (err) {
            this.showError(err);
        }
        finally {
            this.starting = false;
        }
    }
    get selectionKey() {
        return this.hass.user?.id ? `medicine_cabinet:selected_kit:${this.hass.user.id}` : null;
    }
    get viewKey() {
        return this.hass.user?.id ? `medicine_cabinet:view:${this.hass.user.id}` : null;
    }
    readViewMode() {
        try {
            return this.viewKey && localStorage.getItem(this.viewKey) === "compact" ? "compact" : "expanded";
        }
        catch {
            return "expanded";
        }
    }
    setViewMode(mode) {
        this.viewMode = mode;
        try {
            if (this.viewKey)
                localStorage.setItem(this.viewKey, mode);
        }
        catch { /* The current view still works without browser storage. */ }
        this.dialog.querySelectorAll('[data-action="set-view"]').forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
        this.renderList();
    }
    readSelectedKit() {
        try {
            return this.selectionKey ? localStorage.getItem(this.selectionKey) || "" : "";
        }
        catch {
            return "";
        }
    }
    rememberSelectedKit() {
        try {
            if (!this.selectionKey)
                return;
            if (this.kitId)
                localStorage.setItem(this.selectionKey, this.kitId);
            else
                localStorage.removeItem(this.selectionKey);
        }
        catch { /* Browser storage may be disabled; the panel still works. */ }
    }
    resolveSelectedKit() {
        if (!this.data.kits[this.kitId])
            this.kitId = Object.keys(this.data.kits)[0] || "";
        this.rememberSelectedKit();
    }
    async refresh() {
        const sequence = ++this.requestSequence;
        try {
            const result = await this.hass.callWS({ type: "medicine_cabinet/request", operation: "list" });
            if (sequence !== this.requestSequence || !this.isConnected)
                return;
            this.data = result;
            this.resolveSelectedKit();
            this.render();
            this.showError("");
        }
        catch (err) {
            this.showError(err);
        }
    }
    showError(error, form = false) {
        const message = typeof error === "string" ? error : error?.message || this.t("Нет связи с Home Assistant. Проверьте подключение и обновите страницу.");
        const element = this.root.querySelector(form ? ".form-error" : "#error");
        if (element)
            element.textContent = message;
    }
    toast(message) {
        const el = this.root.querySelector(".toast");
        el.textContent = message;
        if (this.toastTimer)
            clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => { el.textContent = ""; }, 4000);
    }
    visiblePackages() {
        if (!this.data)
            return [];
        const query = this.query.trim().toLocaleLowerCase();
        const allCategories = this.allCategoriesSelected();
        const rows = Object.values(this.data.packages).filter(item => {
            const group = this.data.groups[item.group_id];
            return group.kit_id === this.kitId && (allCategories || item.category_ids.some(id => this.filterCategories.has(id))) && (!query || `${group.name} ${item.info}`.toLocaleLowerCase().includes(query)) && (this.filter === "all" || item.status === this.filter) && (this.availability === "all" || item.available === (this.availability === "present"));
        });
        return rows.sort((a, b) => this.sort === "name" ? this.data.groups[a.group_id].name.localeCompare(this.data.groups[b.group_id].name, this.language) || compareExpiry(a, b) : compareExpiry(a, b) || this.data.groups[a.group_id].name.localeCompare(this.data.groups[b.group_id].name, this.language) || a.number - b.number);
    }
    renderShell() {
        this.root.innerHTML = `<style>${styles}</style><div class="app"><header><button type="button" class="icon quiet sidebar-toggle" data-action="toggle-menu" aria-label="${this.t("Открыть боковое меню")}">${icon("menu")}</button><span class="header-logo" aria-hidden="true">${icon("bag")}</span><strong>${escapeHtml(this.data?.settings?.sidebar_title || this.t("Аптечка"))}</strong><span class="offline-label"><span class="dot"></span>${this.t("Данные в Home Assistant")}</span></header><div class="audit-bar" hidden></div><main><div class="toolbar"><div class="kit-picker"><label class="eyebrow" for="kit">${this.t("МЕСТО ХРАНЕНИЯ")}</label><select id="kit" aria-label="${this.t("Выбрать аптечку")}"></select></div><div class="actions"><button class="primary" data-action="add">${icon("plus")}${this.t("Добавить")}</button><button data-action="export">${icon("download")}${this.t("Экспорт")}</button><button class="icon" data-action="settings" aria-label="${this.t("Настройки аптечек")}">${icon("settings")}</button></div></div><div class="filters"><label class="search">${icon("search")}<span class="sr">${this.t("Поиск по названию и дополнительной информации")}</span><input id="query" type="search" placeholder="${this.t("Название или доп. информация")}" autocomplete="off"></label><select id="status" aria-label="${this.t("Срок годности")}"><option value="all">${this.t("Все сроки")}</option><option value="expired">${this.t("Просрочено")}</option><option value="due_7">${this.t("До 7 дней")}</option><option value="due_90">${this.t("От 8 до 90 дней")}</option><option value="ok">${this.t("Более 90 дней")}</option><option value="no_expiry">${this.t("Бессрочно")}</option></select><select id="availability" aria-label="${this.t("Наличие")}"><option value="all">${this.t("Любое наличие")}</option><option value="present">${this.t("Есть")}</option><option value="finished">${this.t("Закончился")}</option></select>${this.categoryFilterHtml()}<select id="sort" aria-label="${this.t("Сортировка")}"><option value="name">${this.t("По названию")}</option><option value="expiry">${this.t("Ближайший срок")}</option></select><button type="button" class="reset-filters" data-action="reset-filters">${this.t("Сбросить все фильтры")}</button></div><div id="error" class="notice" role="alert"></div><div id="summary" class="summary-line"></div><div id="list" class="cards"><p class="loading">${this.t("Загружаем аптечки…")}</p></div></main></div><dialog id="dialog"></dialog><div class="toast" role="status" aria-live="polite"></div>`;
        this.root.querySelector(".app").setAttribute("lang", this.language);
        this.root.querySelector("#query").value = this.query;
        this.root.querySelector("#status").value = this.filter;
        this.root.querySelector("#availability").value = this.availability;
        this.root.querySelector("#sort").value = this.sort;
    }
    render() {
        if (!this.data)
            return;
        const shellKey = JSON.stringify(this.data.settings);
        if (shellKey !== this.shellKey) {
            this.shellKey = shellKey;
            this.renderShell();
        }
        const kitSelect = this.root.querySelector("#kit");
        kitSelect.innerHTML = Object.values(this.data.kits).map(kit => `<option value="${escapeHtml(kit.id)}">${escapeHtml(kit.name)}</option>`).join("") || `<option value="">${this.t("Создайте аптечку")}</option>`;
        kitSelect.value = this.kitId;
        this.root.querySelector('[data-action="export"]').disabled = !this.kitId;
        this.renderCategoryFilter();
        this.renderList();
        this.updateExportPreview();
        this.renderCategoryCatalog();
    }
    categoryFilterHtml() {
        return `<details class="category-filter"><summary aria-label="${this.t("Фильтр по категориям")}"><span class="category-filter-value">${this.t("Все категории")}</span></summary><div class="category-filter-dropdown" role="group" aria-label="${this.t("Фильтр по категориям")}"><label class="search">${icon("search")}<span class="sr">${this.t("Поиск в фильтре категорий")}</span><input type="search" id="category-filter-search" placeholder="${this.t("Поиск категории")}" autocomplete="off"></label><label class="category-filter-all"><input type="checkbox" name="filter_all_categories" checked>${this.t("Все")}</label><div class="category-filter-options"></div><p class="muted">${this.t("Показываются упаковки из любой выбранной категории.")}</p></div></details>`;
    }
    allCategoriesSelected() {
        return !this.filterCategories.size || this.filterCategories.size === Object.keys(this.data?.categories || {}).length;
    }
    renderCategoryFilter() {
        const picker = this.root.querySelector(".category-filter");
        if (!picker || !this.data)
            return;
        this.filterCategories = new Set([...this.filterCategories].filter(id => this.data.categories[id]));
        const all = this.allCategoriesSelected();
        const selected = [...this.filterCategories].map(id => this.categoryName(this.data.categories[id]));
        picker.querySelector(".category-filter-value").textContent = all ? this.t("Все категории") : selected.length === 1 ? selected[0] : `${this.t("Категории: ")}${selected.length}`;
        picker.querySelector("summary").title = all ? this.t("Все категории") : selected.join(", ");
        picker.dataset.active = String(!all);
        picker.querySelector('[name="filter_all_categories"]').checked = all;
        const options = picker.querySelector(".category-filter-options");
        const active = this.root.activeElement;
        const focusedId = active?.name === "filter_category" ? active.value : null;
        const scroll = options.scrollTop;
        const query = this.categoryKey(picker.querySelector("#category-filter-search").value);
        const categories = Object.values(this.data.categories).sort((a, b) => this.categoryName(a).localeCompare(this.categoryName(b), this.language));
        const matches = categories.filter(c => this.categoryKey(`${c.name} ${c.name_en || ""}`).includes(query));
        options.innerHTML = matches.map(c => `<label class="category-filter-option"><input type="checkbox" name="filter_category" value="${escapeHtml(c.id)}" ${this.filterCategories.has(c.id) ? "checked" : ""}>${this.categoryBadge(c)}</label>`).join("") || `<p class="muted">${this.t(categories.length ? "Категории не найдены." : "Категорий пока нет. Добавьте свою категорию.")}</p>`;
        if (focusedId !== null)
            (options.querySelector(`input[value="${CSS.escape(focusedId)}"]`) || picker.querySelector("#category-filter-search"))?.focus({ preventScroll: true });
        options.scrollTop = scroll;
    }
    onCategoryFilterOutside = (event) => {
        const picker = this.root.querySelector(".category-filter");
        if (picker?.open && !event.composedPath().includes(picker))
            picker.open = false;
    };
    renderList() {
        if (!this.data)
            return;
        this.renderAuditBar();
        const list = this.root.querySelector("#list");
        if (this.audit) {
            this.renderAuditList();
            return;
        }
        const rows = this.visiblePackages();
        const all = Object.values(this.data.packages).filter(p => this.data.groups[p.group_id].kit_id === this.kitId);
        const present = all.filter(p => p.available);
        this.root.querySelector("#summary").innerHTML = this.kitId ? `<span>${this.t("В наличии: ")}<b>${present.length}</b></span><span>${this.t("Просрочено: ")}<b>${present.filter(p => p.status === "expired").length}</b></span><span>${this.t("Закончились: ")}<b>${all.length - present.length}</b></span><span>${this.t("В выборке: ")}<b>${rows.length}</b></span>` : "";
        if (!this.kitId) {
            list.innerHTML = `<div class="empty">${icon("bag")}<h2>${this.t("У каждой аптечки своё место")}</h2><p>${this.t("Создайте первую аптечку — например, «Дача». Затем добавьте лекарства и сроки их годности.")}</p><button class="primary" data-action="kit-add">${icon("plus")}${this.t("Создать аптечку")}</button></div>`;
            return;
        }
        if (!rows.length) {
            list.innerHTML = `<div class="empty">${icon("bag")}<h2>${all.length ? this.t("Ничего не найдено") : this.t("Здесь будут ваши лекарства")}</h2><p>${all.length ? this.t("Измените поиск или сбросьте фильтры.") : this.t("Добавьте первую упаковку. Фотографию можно загрузить позже.")}</p><button class="primary" data-action="${all.length ? "reset-filters" : "add"}">${all.length ? this.t("Сбросить фильтры") : this.t("Добавить лекарство")}</button></div>`;
            return;
        }
        const groups = new Map();
        for (const item of rows) {
            if (!groups.has(item.group_id))
                groups.set(item.group_id, []);
            groups.get(item.group_id).push(item);
        }
        list.innerHTML = [...groups].map(([id, items]) => {
            const group = this.data.groups[id];
            const siblings = all.filter(p => p.group_id === id);
            const available = siblings.filter(p => p.available);
            const expired = available.filter(p => p.status === "expired").length;
            const finished = siblings.length - available.length;
            const nearest = available.slice().sort(compareExpiry)[0];
            items.sort((a, b) => a.number - b.number);
            const photo = items.find(p => p.image_id)?.image_id;
            const notes = [...new Set(items.map(p => p.info).filter(Boolean))];
            const note = notes.length > 1 ? items.filter(p => p.info).map(p => `№${p.number}: ${p.info}`).join("\n") : notes[0];
            const multiple = siblings.length > 1;
            const badges = multiple ? this.groupBadges(siblings) : this.packageBadges(items[0]);
            if (this.viewMode === "compact")
                return this.compactGroupHtml(group, items, siblings, nearest);
            const contents = multiple ? `<details data-group="${id}" ${this.openGroups.has(id) ? "open" : ""}><summary>${this.t("Упаковки: ")}<b>${available.length} ${this.t("в наличии")}</b>${expired ? ` · ${expired} ${this.t("просрочено")}` : ""}${finished ? ` · ${finished} ${this.t("закончились")}` : ""}${items.length !== siblings.length ? ` · ${this.t("показано ")}${items.length} ${this.t("из ")}${siblings.length}` : ""}</summary>${items.map(p => this.packageHtml(p)).join("")}</details>` : this.packageHtml(items[0], true);
            return `<article class="medicine"><div class="medicine-header ${expired ? "has-expired" : ""}"><div class="photo">${photo ? `<img data-image="${photo}" alt="${this.t("Фото ")}${escapeHtml(group.name)}">` : icon("bag")}</div><div class="medicine-heading"><h2>${escapeHtml(group.name)}</h2>${group.category_ids?.length ? `<div class="category-badges">${this.categoryBadges(group.category_ids)}</div>` : ""}<p>${nearest ? `${multiple && !nearest.no_expiry ? this.t("Ближайший срок") : this.t("Годен ДО")}: ${this.date(nearest.expires_on)}` : this.t("Все упаковки закончились")}</p>${badges}</div><div class="medicine-info ${multiple ? "multiple" : ""}"><span class="eyebrow">${this.t("Доп. информация")}</span><p class="note">${note ? escapeHtml(note) : this.t("Не указана")}</p></div><div class="medicine-actions"><button class="icon quiet" data-action="edit-group" data-group="${id}" aria-label="${this.t("Изменить ")}${escapeHtml(group.name)}">${icon("edit")}</button><button class="icon quiet" data-action="add-pack" data-group="${id}" aria-label="${this.t("Добавить упаковку ")}${escapeHtml(group.name)}">${icon("plus")}</button></div></div>${contents}${multiple ? `<div class="group-footer"><span class="small muted">${this.t("Все упаковки: ")}${siblings.length}</span><div class="pack-footer"><button data-action="toggle-group-available" data-group="${id}">${available.length ? this.t("Отметить: закончились") : this.t("Отметить: есть")}</button><button class="quiet danger" data-action="delete-group" data-group="${id}">${this.t("Удалить")}</button></div></div>` : ""}</article>`;
        }).join("");
        void this.loadPhotos();
    }
    compactGroupHtml(group, items, siblings, nearest) {
        const photo = items.find(p => p.image_id)?.image_id;
        const available = siblings.filter(p => p.available).length;
        const expiry = nearest ? `${this.t("Годен ДО")}: ${this.date(nearest.expires_on)}` : this.t("Все упаковки закончились");
        return `<details class="medicine compact-medicine" data-compact-group="${group.id}" ${this.compactOpenGroups.has(group.id) ? "open" : ""}><summary><div class="photo">${photo ? `<img data-image="${photo}" alt="${this.t("Фото ")}${escapeHtml(group.name)}">` : icon("bag")}</div><div class="compact-heading"><h2>${escapeHtml(group.name)}</h2><p>${this.t("Упаковок: ")}${siblings.length} · ${available} ${this.t("в наличии")} · ${expiry}</p>${group.category_ids?.length ? `<div class="category-badges">${this.categoryBadges(group.category_ids)}</div>` : ""}${this.groupBadges(siblings)}</div></summary><div class="compact-actions"><button type="button" data-action="edit-group" data-group="${group.id}">${icon("edit")}${this.t("Изменить лекарство")}</button><button type="button" data-action="add-pack" data-group="${group.id}" aria-label="${this.t("Добавить упаковку ")}${escapeHtml(group.name)}">${icon("plus")}${this.t("Добавить")}</button></div>${items.length !== siblings.length ? `<p class="small muted" style="padding:0 16px">${this.t("показано ")}${items.length} ${this.t("из ")}${siblings.length}</p>` : ""}${items.map(p => this.packageHtml(p)).join("")}</details>`;
    }
    viewSettingsHtml() {
        return `<section class="settings-section"><h3>${this.t("Отображение")}</h3><div class="view-switch" role="group" aria-label="${this.t("Вид списка")}">${["expanded", "compact"].map(mode => `<button type="button" data-action="set-view" data-mode="${mode}" aria-pressed="${this.viewMode === mode}">${this.t(mode === "compact" ? "Компактный" : "Развёрнутый")}</button>`).join("")}</div><p class="small muted">${this.t("Сохраняется для вас в этом браузере.")}</p></section>`;
    }
    auditSettingsHtml() {
        const kit = this.data?.kits[this.kitId];
        if (!kit)
            return "";
        const hasPackages = Object.values(this.data.packages).some(p => this.data.groups[p.group_id].kit_id === kit.id);
        return `<section class="settings-section"><h3>${this.t("Ревизия аптечки")} «${escapeHtml(kit.name)}»</h3><p class="small muted">${this.t(hasPackages ? "Будут показаны все упаковки этой аптечки, включая закончившиеся." : "Пока нет упаковок для ревизии.")}</p><button type="button" data-action="audit-start" ${hasPackages ? "" : "disabled"}>${this.t("Начать ревизию")}</button>${kit.last_audit ? `<p class="small muted">${this.t("Последняя ревизия")}: ${escapeHtml(this.dateTime(kit.last_audit.completed_at))}</p><button type="button" class="quiet" data-action="audit-result">${this.t("Посмотреть результат")}</button>` : ""}</section>`;
    }
    dateTime(value) {
        return new Intl.DateTimeFormat(this.language, { dateStyle: "short", timeStyle: "short", timeZone: this.data.timezone }).format(new Date(value));
    }
    auditPackages(kitId) {
        return Object.values(this.data.packages).filter(p => this.data.groups[p.group_id].kit_id === kitId)
            .sort((a, b) => this.data.groups[a.group_id].name.localeCompare(this.data.groups[b.group_id].name, this.language) || a.number - b.number);
    }
    startAudit() {
        const kit = this.data?.kits[this.kitId];
        if (!kit)
            return;
        this.audit = { kitId: kit.id, name: kit.name, revision: this.data.revision, packages: structuredClone(this.auditPackages(kit.id)), groups: structuredClone(this.data.groups), choices: new Map() };
        this.dialog.close();
        this.render();
        this.root.querySelector(".app").scrollTop = 0;
        this.root.querySelector(".audit-bar strong").focus({ preventScroll: true });
    }
    auditCounts() {
        const counts = { present: 0, finished: 0, missing: 0 };
        for (const state of this.audit?.choices.values() || [])
            counts[state]++;
        return counts;
    }
    auditLabel(state) {
        return this.t({ present: "На месте", finished: "Закончилась", missing: "Не нашёл" }[state]);
    }
    renderAuditBar() {
        const bar = this.root.querySelector(".audit-bar");
        bar.hidden = !this.audit;
        for (const selector of [".toolbar", ".filters", "#summary"])
            this.root.querySelector(selector).hidden = !!this.audit;
        if (!this.audit) {
            bar.innerHTML = "";
            return;
        }
        if (!bar.childElementCount)
            bar.innerHTML = `<div class="audit-bar-inner"><div class="audit-bar-copy"><strong tabindex="-1"></strong><p class="audit-progress-text" role="status" aria-live="polite"></p><progress aria-label="${this.t("Проверено: ")}"></progress></div><button type="button" class="primary" data-action="audit-finish">${this.t("Завершить ревизию")}</button></div>`;
        bar.querySelector("strong").textContent = this.t("Ревизия: ") + this.audit.name;
        bar.querySelector(".audit-progress-text").textContent = `${this.t("Проверено: ")}${this.audit.choices.size} ${this.t("из ")}${this.audit.packages.length}`;
        const progress = bar.querySelector("progress");
        progress.max = Math.max(1, this.audit.packages.length);
        progress.value = this.audit.choices.size;
    }
    auditChoicesHtml(item) {
        const selected = this.audit.choices.get(item.id);
        return `<div class="audit-choices" role="group" aria-label="${this.t("Упаковка №")}${item.number}" data-answered="${!!selected}">${["present", "finished", "missing"].map(state => `<button type="button" data-action="audit-mark" data-id="${item.id}" data-state="${state}" aria-pressed="${state === selected}">${state === selected ? icon("check") : ""}${this.auditLabel(state)}</button>`).join("")}<button type="button" class="quiet icon audit-clear" data-action="audit-clear" data-id="${item.id}" aria-label="${this.t("Сбросить отметку")}" ${selected ? "" : "hidden"}>${icon("close")}</button></div>`;
    }
    renderAuditList() {
        const audit = this.audit;
        const groups = new Map();
        for (const p of audit.packages) {
            if (!groups.has(p.group_id))
                groups.set(p.group_id, []);
            groups.get(p.group_id).push(p);
        }
        this.root.querySelector("#list").innerHTML = `<p class="audit-intro">${this.t("Проверьте каждую упаковку. Отметки можно менять до завершения.")}</p>${[...groups].map(([id, items]) => {
            const name = audit.groups[id].name;
            const photo = items.find(p => p.image_id)?.image_id;
            return `<article class="medicine audit-medicine"><div class="audit-card-heading"><div class="photo">${photo ? `<img data-image="${photo}" alt="${this.t("Фото ")}${escapeHtml(name)}">` : icon("bag")}</div><h2>${escapeHtml(name)}</h2></div>${items.map(p => `<section class="audit-pack" data-package="${p.id}"><div class="audit-pack-title"><strong>${this.t("Упаковка №")}${p.number}</strong><span>${this.t("Годен ДО")}: ${this.date(p.expires_on)}</span></div>${this.packageBadges(p)}${p.category_ids.length ? `<div class="category-badges">${this.categoryBadges(p.category_ids)}</div>` : ""}${p.info ? `<p class="note">${escapeHtml(p.info)}</p>` : ""}${this.auditChoicesHtml(p)}</section>`).join("")}</article>`;
        }).join("")}`;
        void this.loadPhotos();
    }
    markAudit(id, state) {
        const item = this.audit?.packages.find(p => p.id === id);
        if (!item)
            return;
        if (state)
            this.audit.choices.set(id, state);
        else
            this.audit.choices.delete(id);
        const row = this.root.querySelector(`.audit-pack[data-package="${CSS.escape(id)}"]`);
        row.querySelector(".audit-choices").outerHTML = this.auditChoicesHtml(item);
        row.querySelector(state ? `[data-state="${state}"]` : '[data-state="present"]').focus({ preventScroll: true });
        this.renderAuditBar();
    }
    auditCountsHtml(counts, total) {
        const checked = counts.present + counts.finished + counts.missing;
        return `<div class="audit-counts">${["present", "finished", "missing"].map(state => `<div>${this.auditLabel(state)}<b>${counts[state]}</b></div>`).join("")}<div>${this.t("Не проверено: ")}<b>${Math.max(0, total - checked)}</b></div></div>`;
    }
    auditMissingHtml(items) {
        if (!items.length)
            return "";
        return `<h3>${this.t("Ненайденные упаковки")}</h3><ul class="audit-missing">${items.map(p => `<li><strong>${escapeHtml(p.name)}</strong> · ${this.t("Упаковка №")}${p.number}<br><span class="small muted">${this.t("Годен ДО")}: ${this.date(p.expires_on)}</span></li>`).join("")}</ul>`;
    }
    finishAuditDialog() {
        if (!this.audit)
            return;
        const missing = this.audit.packages.filter(p => this.audit.choices.get(p.id) === "missing").map(p => ({ ...p, name: this.audit.groups[p.group_id].name }));
        this.showDialog(this.t("Завершить ревизию?"), `<p class="explanation">${escapeHtml(this.audit.name)}</p>${this.auditCountsHtml(this.auditCounts(), this.audit.packages.length)}<p class="explanation">${this.t("Наличие изменится только у упаковок с отметками «На месте» и «Закончилась».")} ${this.t("Ненайденные и непроверенные упаковки сохранятся без изменений.")}</p>${this.auditMissingHtml(missing)}`, "audit_complete", "", this.t("Сохранить и завершить"));
        this.dialog.querySelector('.dialog-actions [data-action="close"]').textContent = this.t("Вернуться к ревизии");
    }
    auditResultDialog() {
        const kit = this.data?.kits[this.kitId];
        const report = kit?.last_audit;
        if (!report)
            return;
        this.showDialog(this.t("Ревизия завершена"), `<p class="explanation">${escapeHtml(kit.name)} · ${escapeHtml(this.dateTime(report.completed_at))}</p>${this.auditCountsHtml(report.counts, report.total)}${this.auditMissingHtml(report.missing)}<p class="explanation">${this.t("Ненайденные и непроверенные упаковки сохранятся без изменений.")}</p><div class="audit-result-footer"><button type="button" data-action="close">${this.t("Закрыть")}</button></div>`, "audit_result", "", "");
    }
    async refreshAudit() {
        if (!this.audit)
            return;
        try {
            const data = await this.hass.callWS({ type: "medicine_cabinet/request", operation: "list" });
            this.data = data;
            const kit = data.kits[this.audit.kitId];
            if (!kit) {
                this.audit = undefined;
                this.dialog.close();
                this.resolveSelectedKit();
                this.render();
                this.toast(this.t("Аптечка удалена на другом устройстве. Ревизия закрыта."));
                return;
            }
            const packages = this.auditPackages(kit.id);
            const choices = new Map();
            for (const p of packages) {
                const old = this.audit.packages.find(item => item.id === p.id);
                const choice = this.audit.choices.get(p.id);
                if (old && choice && JSON.stringify(old) === JSON.stringify(p) && this.audit.groups[old.group_id].name === data.groups[p.group_id].name)
                    choices.set(p.id, choice);
            }
            this.audit = { kitId: kit.id, name: kit.name, revision: data.revision, packages: structuredClone(packages), groups: structuredClone(data.groups), choices };
            this.dialog.close();
            this.render();
            this.toast(this.t("Отметки неизменённых упаковок сохранены. Проверьте оставшиеся."));
        }
        catch (err) {
            this.showError(err, true);
        }
    }
    categoryName(category) {
        return this.language === "en" ? category.name_en || category.name : category.name;
    }
    categoryKey(name) { return name.trim().replace(/\s+/g, " ").toLocaleLowerCase(); }
    categoryBadge(category, removable = false) {
        const name = escapeHtml(this.categoryName(category));
        // Only validated hex colors and icon identifiers enter style/attribute contexts.
        const color = /^#[a-f0-9]{6}$/i.test(category.color) ? category.color : "#658fa7";
        const symbol = /^[a-z0-9_-]+:[a-z0-9_-]+$/.test(category.icon) ? category.icon : "mdi:tag-outline";
        return `<span class="category-badge" style="--category-color:${color}"><ha-icon icon="${escapeHtml(symbol)}" aria-hidden="true"></ha-icon><span>${name}</span>${removable ? `<button type="button" class="quiet category-remove" data-action="remove-category" data-id="${escapeHtml(category.id)}" aria-label="${this.t("Снять категорию ")}${name}">${icon("close")}</button>` : ""}</span>`;
    }
    categoryBadges(ids = [], removable = false) {
        return ids.map(id => this.data?.categories?.[id]).filter((c) => !!c).map(c => this.categoryBadge(c, removable)).join("");
    }
    categoryEditorFields(category) {
        return `<label class="field">${this.t("Название категории")}<input name="category_name" maxlength="100" autocomplete="off" value="${escapeHtml(category ? this.categoryName(category) : "")}" placeholder="${this.t("Например, Для питомца")}"></label><div class="category-appearance"><label class="field">${this.t("Цвет")}<input name="category_color" type="color" value="${escapeHtml(category?.color || "#5786b8")}"></label><div class="category-icon-field"><label class="field">${this.t("Значок Home Assistant")}<input name="category_icon" value="${escapeHtml(category?.icon || "mdi:tag-outline")}" maxlength="160" spellcheck="false" placeholder="mdi:pill"></label></div></div><div class="category-new-preview category-badges"></div>`;
    }
    categoryFields(bulk = false) {
        return `<div class="field full category-field">${bulk ? `<label class="check"><input type="checkbox" name="apply_categories">${this.t("Заменить категории у всех упаковок")}</label><small>${this.t("Без этой отметки категории каждой упаковки сохранятся.")}</small>` : ""}<div class="category-assignment" ${bulk ? "hidden" : ""}><div class="category-title"><span id="category-label">${this.t("Категории")}</span><span class="category-count small muted" role="status" aria-live="polite"></span></div><small id="category-help">${this.t("До 5 категорий на упаковку.")}${bulk ? ` ${this.t("Сначала выбраны только категории, общие для всех упаковок.")}` : ""}</small><div class="selected-categories category-badges"></div><details class="category-picker"><summary>${this.t("Выбрать категории")}</summary><div class="category-picker-body"><label class="search">${icon("search")}<span class="sr">${this.t("Поиск категории")}</span><input type="search" id="category-search" placeholder="${this.t("Поиск категории")}" autocomplete="off"></label><div class="category-options" role="group" aria-labelledby="category-label" aria-describedby="category-help category-limit"></div><small id="category-limit" class="category-limit" role="status"></small><details class="category-create"><summary>${this.t("Своя категория")}</summary><div class="category-create-fields">${this.categoryEditorFields()}<small>${this.t("Сохранится в общем списке для всех аптечек.")}</small><button type="button" data-action="create-category">${this.t("Создать и выбрать")}</button><div class="category-error notice" role="alert"></div></div></details></div></details></div></div>`;
    }
    renderCategoryOptions() {
        const field = this.dialog.querySelector(".category-field");
        if (!field)
            return;
        const query = this.categoryKey(field.querySelector("#category-search").value);
        field.querySelector(".category-count").textContent = `${this.categorySelection.length} ${this.t("из ")}5`;
        field.querySelector(".selected-categories").innerHTML = this.categoryBadges(this.categorySelection, true) || `<span class="small muted">${this.t("Без категории")}</span>`;
        const categories = Object.values(this.data?.categories || {}).sort((a, b) => this.categoryName(a).localeCompare(this.categoryName(b), this.language));
        const matches = categories.filter(c => this.categoryKey(`${c.name} ${c.name_en || ""}`).includes(query));
        field.querySelector(".category-options").innerHTML = matches.map(c => {
            const checked = this.categorySelection.includes(c.id);
            return `<label class="category-option"><input type="checkbox" name="category_choice" value="${escapeHtml(c.id)}" ${checked ? "checked" : ""} ${!checked && this.categorySelection.length >= 5 ? "disabled" : ""}>${this.categoryBadge(c)}</label>`;
        }).join("") || `<p class="small muted">${this.t("Категория не найдена. Можно создать свою ниже.")}</p>`;
        field.querySelector(".category-limit").textContent = this.categorySelection.length >= 5 ? this.t("Выбрано 5 категорий. Снимите одну, чтобы выбрать другую.") : "";
        field.querySelector('[data-action="create-category"]').disabled = this.categorySelection.length >= 5 || this.creatingCategory;
    }
    updateCategoryPreview() {
        const field = this.dialog.querySelector(".category-field");
        if (!field)
            return;
        const name = field.querySelector('[name="category_name"]').value.trim() || this.t("Новая категория");
        const color = field.querySelector('[name="category_color"]').value;
        const symbol = field.querySelector('[name="category_icon"]').value;
        field.querySelector(".category-new-preview").innerHTML = this.categoryBadge({ id: "preview", name, color, icon: symbol });
    }
    async setupCategoryIconPicker() {
        const host = this.dialog.querySelector(".category-icon-field");
        if (!host)
            return;
        const input = host.querySelector("input");
        try {
            // HA loads selector components lazily. Its standard card editor loads ha-form.
            if (!customElements.get("ha-form")) {
                const load = window.loadCardHelpers;
                if (!load)
                    return; // Standalone preview: keep the editable HA icon identifier.
                const helpers = await load();
                const card = helpers.createCardElement({ type: "button", name: "" });
                const constructor = card.constructor;
                await constructor.getConfigElement?.();
            }
            if (!host.isConnected || !customElements.get("ha-form"))
                return;
            const form = document.createElement("ha-form");
            form.hass = this.hass;
            form.data = { icon: input.value };
            form.schema = [{ name: "icon", selector: { icon: {} } }];
            form.computeLabel = () => this.t("Значок Home Assistant");
            form.addEventListener("value-changed", event => {
                event.stopPropagation();
                input.value = String(event.detail.value.icon || "mdi:tag-outline");
                this.updateCategoryPreview();
            });
            host.querySelector("label").hidden = true;
            host.append(form);
        }
        catch { /* Keep the text field usable if HA's optional picker cannot load. */ }
    }
    async createCategory(button) {
        const form = this.dialog.querySelector('form[data-kind="package_save"],form[data-kind="group_save"]');
        if (!form || this.creatingCategory || this.categorySelection.length >= 5)
            return;
        const nameInput = form.querySelector('[name="category_name"]');
        const name = nameInput.value.trim().replace(/\s+/g, " ");
        const error = form.querySelector(".category-error");
        error.textContent = "";
        if (!name) {
            error.textContent = this.t("Укажите название категории");
            nameInput.focus();
            return;
        }
        const color = form.querySelector('[name="category_color"]').value;
        const symbol = form.querySelector('[name="category_icon"]').value;
        const before = Object.values(this.data?.categories || {}).find(c => [c.name, c.name_en || ""].some(n => this.categoryKey(n) === this.categoryKey(name)));
        const submit = form.querySelector('button[type="submit"]');
        this.creatingCategory = true;
        button.disabled = true;
        submit.disabled = true;
        try {
            if (!before) {
                await this.request("category_save", { name, color, icon: symbol }, Number(form.dataset.revision));
                form.dataset.revision = String(this.data.revision);
            }
            if (!form.isConnected || !this.dialog.open)
                return;
            const category = before || Object.values(this.data.categories).find(c => [c.name, c.name_en || ""].some(n => this.categoryKey(n) === this.categoryKey(name)));
            if (category && !this.categorySelection.includes(category.id) && this.categorySelection.length < 5)
                this.categorySelection.push(category.id);
            nameInput.value = "";
            form.querySelector("#category-search").value = "";
            form.querySelector(".category-create").open = false;
            this.toast(before ? this.t("Выбрана сохранённая категория") : this.t("Категория сохранена"));
        }
        catch (err) {
            error.textContent = err.message || this.t("Не удалось сохранить категорию");
        }
        finally {
            this.creatingCategory = false;
            button.disabled = false;
            submit.disabled = false;
            if (form.isConnected)
                this.renderCategoryOptions();
        }
    }
    packageBadges(item) {
        const expiry = (item.status === "ok" || item.status === "no_expiry") ? "" : `<span class="badge ${item.status}">${this.t(labels[item.status])}</span>`;
        const availability = !item.available ? `<span class="badge finished">${this.t("Закончился")}</span>` : "";
        return expiry || availability ? `<div class="badges">${expiry}${availability}</div>` : "";
    }
    groupBadges(items) {
        const badges = ["expired", "due_7", "due_90"].map(status => {
            const count = items.filter(p => p.available && p.status === status).length;
            return count ? `<span class="badge ${status}">${this.t(labels[status])}: ${count}</span>` : "";
        });
        const finished = items.filter(p => !p.available).length;
        if (finished)
            badges.push(`<span class="badge finished">${this.t("Закончились: ")}${finished}</span>`);
        const content = badges.join("");
        return content ? `<div class="badges">${content}</div>` : "";
    }
    packageHtml(item, single = false) {
        const dateAdded = new Intl.DateTimeFormat(this.language, { dateStyle: "short", timeStyle: "short", timeZone: this.data.timezone }).format(new Date(item.added_at));
        return `<section class="pack ${single ? "single-pack" : ""}">${single ? "" : `<div class="pack-head"><strong>${this.t("Упаковка №")}${item.number}</strong><button type="button" class="quiet icon" data-action="edit" data-id="${item.id}" aria-label="${this.t("Изменить упаковку №")}${item.number}">${icon("edit")}</button></div>${item.category_ids.length ? `<div class="category-badges">${this.categoryBadges(item.category_ids)}</div>` : `<p class="small muted">${this.t("Без категории")}</p>`}${this.packageBadges(item)}${item.image_id ? `<div class="photo pack-photo"><img data-image="${item.image_id}" alt="${this.t("Фото упаковки №")}${item.number}"></div>` : ""}`}<div class="pack-meta">${!single || !item.available ? `<div><span>${this.t("Годен ДО")}</span>${this.date(item.expires_on)}</div>` : ""}<div><span>${this.t("Добавлено")}</span>${escapeHtml(dateAdded)}</div></div>${!single && item.info ? `<p class="note">${escapeHtml(item.info)}</p>` : ""}<div class="pack-footer"><button data-action="toggle-available" data-id="${item.id}">${item.available ? this.t("Отметить: закончился") : this.t("Отметить: есть")}</button><button class="quiet danger" data-action="delete-pack" data-id="${item.id}">${this.t("Удалить")}</button></div></section>`;
    }
    editGroup(groupId) {
        const group = this.data?.groups[groupId];
        if (!group)
            return;
        const items = Object.values(this.data.packages).filter(p => p.group_id === groupId);
        if (!items.length)
            return;
        const sameInfo = items.every(p => p.info === items[0].info);
        const sameExpiry = items.every(p => p.expires_on === items[0].expires_on);
        const sameAvailability = items.every(p => p.available === items[0].available);
        const samePhoto = items.every(p => p.image_id === items[0].image_id);
        const image = samePhoto ? items[0].image_id || "" : "";
        this.groupEdits.clear();
        this.categorySelection = items[0].category_ids.filter(id => items.every(p => p.category_ids.includes(id)));
        this.showDialog(this.t("Изменить лекарство"), `<p class="explanation">${this.t("Изменённые поля применятся ко всем упаковкам: ")}<strong>${items.length}</strong>. ${this.t("Остальные данные каждой упаковки сохранятся.")}</p><div class="form-grid"><label class="field full">${this.t("Название")}<input name="name" maxlength="200" required value="${escapeHtml(group.name)}"></label><div class="field full"><label class="field">${this.t("Доп. информация")}<textarea name="info" maxlength="5000" placeholder="${this.t(sameInfo ? "Дозировка, описание или ваши заметки" : "Разные значения")}">${escapeHtml(sameInfo ? items[0].info : "")}</textarea></label>${sameInfo ? "" : `<small>${this.t("У упаковок разные описания. Введите новое, чтобы заменить их у всех.")}</small>`}<button type="button" class="quiet" data-action="clear-group-info">${this.t("Очистить описание у всех")}</button></div>${this.categoryFields(items.length > 1)}<div class="field"><div class="expiry-heading"><label for="mc-expiry">${this.t("Годен ДО")}</label><label class="check"><input name="no_expiry" type="checkbox" ${sameExpiry && items[0].no_expiry ? "checked" : ""}>${this.t("Бессрочно")}</label></div><input id="mc-expiry" name="expires_on" type="date" value="${escapeHtml(sameExpiry ? items[0].expires_on || "" : "")}"><input class="expiry-unlimited" type="text" value="${this.t("Бессрочно")}" aria-label="${this.t("Срок годности")}" disabled hidden><small class="expiry-hint"></small></div><label class="field">${this.t("Наличие")}<select name="available">${sameAvailability ? "" : `<option value="">${this.t("Разное — не менять")}</option>`}<option value="true" ${sameAvailability && items[0].available ? "selected" : ""}>${this.t("Есть")}</option><option value="false" ${sameAvailability && !items[0].available ? "selected" : ""}>${this.t("Закончился")}</option></select></label><div class="field full"><label for="mc-photo">${this.t("Фотография · необязательно")}</label><input type="hidden" name="image_id" value="${escapeHtml(image)}"><div class="file-row"><input id="mc-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="quiet" data-action="clear-photo">${this.t("Убрать фото у всех")}</button></div><small class="photo-status">${this.t(!samePhoto ? "У упаковок разные фотографии. Новое фото заменит их у всех." : image ? "Используется сохранённая фотография" : "JPEG, PNG или WebP, до 10 МБ. HEIC сначала сохраните как JPEG.")}</small></div></div><p class="explanation">${this.t("Изменение срока, включая отметку «Бессрочно», означает замену упаковки: дата добавления обновится, наличие станет «Есть».")}</p>`, "group_save", groupId, this.t("Сохранить"));
        const form = this.dialog.querySelector("form");
        form.dataset.kitId = group.kit_id;
        form.dataset.categories = JSON.stringify(this.categorySelection);
        form.dataset.mixedExpiry = String(!sameExpiry);
        this.renderCategoryOptions();
        this.updateCategoryPreview();
        void this.setupCategoryIconPicker();
        this.updateExpiryInput();
        const noExpiry = form.querySelector('[name="no_expiry"]');
        noExpiry.indeterminate = !items.every(p => p.no_expiry === items[0].no_expiry);
    }
    trackGroupEdit(target) {
        if (target.closest("form")?.dataset.kind !== "group_save")
            return;
        const name = target.name;
        if (["name", "info", "available"].includes(name))
            this.groupEdits.add(name);
        if (name === "photo")
            this.groupEdits.add("image_id");
        if (["expires_on", "no_expiry"].includes(name)) {
            this.groupEdits.add("expiry");
            this.updateExpiryInput();
        }
    }
    date(value) { return value === null ? this.t("Бессрочно") : value.split("-").reverse().join("."); }
    async imageUrl(id) {
        if (this.imageUrls.has(id))
            return this.imageUrls.get(id);
        if (this.imageRequests.has(id))
            return this.imageRequests.get(id);
        const promise = (async () => {
            const response = await this.hass.fetchWithAuth(`/api/medicine_cabinet/images/${id}`);
            if (!response.ok)
                throw new Error(this.t("Не удалось загрузить фото"));
            const url = URL.createObjectURL(await response.blob());
            this.imageUrls.set(id, url);
            return url;
        })();
        this.imageRequests.set(id, promise);
        try {
            return await promise;
        }
        finally {
            this.imageRequests.delete(id);
        }
    }
    async loadPhotos() {
        await Promise.all([...this.root.querySelectorAll("img[data-image]")].map(async (img) => {
            try {
                img.src = await this.imageUrl(img.dataset.image);
            }
            catch {
                img.alt = this.t("Фото временно недоступно");
            }
        }));
    }
    onInput = (event) => {
        const target = event.target;
        this.trackGroupEdit(target);
        if (target.id === "query") {
            this.query = target.value;
            this.renderList();
        }
        if (target.id === "group-search")
            this.renderGroupOptions(target.value);
        if (target.id === "category-filter-search") {
            this.renderCategoryFilter();
            this.root.querySelector(".category-filter-options").scrollTop = 0;
        }
        if (target.id === "category-search")
            this.renderCategoryOptions();
        if (target.id === "category-catalog-search")
            this.renderCategoryCatalog();
        if ((target.name || "").startsWith("category_"))
            this.updateCategoryPreview();
    };
    onChange = (event) => {
        const target = event.target;
        this.trackGroupEdit(target);
        if (target.id === "kit") {
            this.kitId = target.value;
            this.rememberSelectedKit();
            this.openGroups.clear();
            this.render();
        }
        if (target.id === "status") {
            this.filter = target.value;
            this.renderList();
        }
        if (target.id === "availability") {
            this.availability = target.value;
            this.renderList();
        }
        if (target.id === "sort") {
            this.sort = target.value;
            this.renderList();
        }
        if (target.name === "filter_all_categories" || target.name === "filter_category") {
            if (target.name === "filter_all_categories")
                this.filterCategories.clear();
            else if (target.checked)
                this.filterCategories.add(target.value);
            else
                this.filterCategories.delete(target.value);
            this.renderCategoryFilter();
            this.renderList();
        }
        if (target.name === "apply_categories") {
            this.dialog.querySelector(".category-assignment").hidden = !target.checked;
        }
        if (target.name === "category_choice") {
            const checked = target.checked;
            if (checked && this.categorySelection.length < 5)
                this.categorySelection.push(target.value);
            else if (!checked)
                this.categorySelection = this.categorySelection.filter(id => id !== target.value);
            this.renderCategoryOptions();
            this.dialog.querySelector(`[name="category_choice"][value="${CSS.escape(target.value)}"]`)?.focus();
        }
        if (target.name === "count" && !target.value)
            target.value = "1";
        if (target.name === "no_expiry")
            this.updateExpiryInput();
        if (target.closest("form")?.dataset.kind === "export")
            this.updateExportPreview();
    };
    onPickerKeydown = (event) => {
        const key = event;
        const target = event.target;
        if (key.key === "Enter" && ["category-search", "category-catalog-search"].includes(target.id)) {
            key.preventDefault();
            return;
        }
        if (key.key === "Enter" && target.tagName === "INPUT" && target.closest(".category-create")) {
            key.preventDefault();
            const button = this.dialog.querySelector('[data-action="create-category"]');
            if (button && !button.disabled)
                void this.createCategory(button);
            return;
        }
        const categoryFilter = target.closest(".category-filter");
        if (categoryFilter) {
            if (key.key === "Escape" && categoryFilter.open) {
                key.preventDefault();
                key.stopPropagation();
                categoryFilter.open = false;
                categoryFilter.querySelector("summary").focus();
            }
            else if (target.tagName === "SUMMARY" && ["ArrowDown", "ArrowUp"].includes(key.key)) {
                key.preventDefault();
                categoryFilter.open = true;
                categoryFilter.querySelector("#category-filter-search").focus();
            }
            else if (target.id === "category-filter-search" && ["ArrowDown", "Enter"].includes(key.key)) {
                key.preventDefault();
                (categoryFilter.querySelector(".category-filter-options input") || categoryFilter.querySelector('[name="filter_all_categories"]')).focus();
            }
            return;
        }
        const picker = target.closest(".group-picker");
        if (!picker)
            return;
        if (key.key === "Escape" && picker.open) {
            key.preventDefault();
            key.stopPropagation();
            picker.open = false;
            picker.querySelector("summary").focus();
            return;
        }
        if (target.tagName === "SUMMARY" && (key.key === "ArrowDown" || key.key === "ArrowUp")) {
            key.preventDefault();
            picker.open = true;
            picker.querySelector("#group-search").focus();
            return;
        }
        const options = [...picker.querySelectorAll(".group-results button")];
        if (target.id === "group-search" && ["Enter", "ArrowDown", "ArrowUp"].includes(key.key)) {
            key.preventDefault();
            const option = key.key === "ArrowUp" ? options.at(-1) : options[0];
            (option || picker.querySelector(".group-new"))?.focus();
        }
        else if (target.classList.contains("group-option") && ["ArrowDown", "ArrowUp", "Home", "End"].includes(key.key)) {
            key.preventDefault();
            const index = options.indexOf(target);
            const next = key.key === "Home" ? 0 : key.key === "End" ? options.length - 1 : index + (key.key === "ArrowDown" ? 1 : -1);
            if (next < 0)
                picker.querySelector("#group-search").focus();
            else
                options[Math.min(next, options.length - 1)]?.focus();
        }
    };
    renderGroupOptions(query = "") {
        const current = this.dialog.querySelector('[name="group_id"]').value;
        const groups = Object.values(this.data.groups).filter(g => g.kit_id === this.kitId && g.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a, b) => a.name.localeCompare(b.name, this.language));
        this.dialog.querySelector(".group-new").setAttribute("aria-pressed", String(!current));
        const results = this.dialog.querySelector(".group-results");
        results.innerHTML = `${groups.map(g => `<button type="button" class="group-option" data-action="select-group" data-group="${g.id}" aria-pressed="${g.id === current}" title="${escapeHtml(g.name)}">${escapeHtml(g.name)}</button>`).join("")}${!groups.length && query.trim() ? `<p class="small muted" role="status">${this.t("Препараты не найдены")}</p>` : ""}`;
        results.scrollTop = 0;
    }
    selectGroup(groupId) {
        const name = this.dialog.querySelector('[name="name"]');
        this.dialog.querySelector('[name="group_id"]').value = groupId;
        name.disabled = !!groupId;
        name.required = !groupId;
        name.value = groupId ? this.data.groups[groupId].name : "";
        if (groupId) {
            const pack = Object.values(this.data.packages).find(p => p.group_id === groupId);
            const info = this.dialog.querySelector('[name="info"]');
            if (pack && !info.value)
                info.value = pack.info;
            const image = this.dialog.querySelector('[name="image_id"]');
            if (pack?.image_id && !image.value) {
                image.value = pack.image_id;
                this.dialog.querySelector(".photo-status").textContent = this.t("Используется фото другой упаковки");
            }
        }
        const editedId = this.dialog.querySelector("form").dataset.id;
        const edited = editedId ? this.data.packages[editedId] : undefined;
        const source = edited?.group_id === groupId ? edited : Object.values(this.data.packages).find(p => p.group_id === groupId);
        this.categorySelection = [...(source?.category_ids || [])];
        this.renderCategoryOptions();
        const picker = this.dialog.querySelector(".group-picker");
        picker.querySelector(".group-value").textContent = groupId ? name.value : this.t("Новое лекарство");
        picker.open = false;
        this.dialog.querySelector("#group-search").value = "";
        this.renderGroupOptions();
        if (groupId)
            picker.querySelector("summary").focus();
        else
            name.focus();
    }
    onClick = (event) => {
        const picker = this.dialog.querySelector(".group-picker");
        if (picker?.open && !picker.contains(event.target))
            picker.open = false;
        const button = event.target.closest("[data-action]");
        if (!button)
            return;
        const action = button.dataset.action;
        const id = button.dataset.id;
        if (action === "toggle-menu")
            this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
        else if (action === "set-view")
            this.setViewMode(button.dataset.mode);
        else if (action === "quantity") {
            const input = this.dialog.querySelector('[name="count"]');
            const value = Number(input.value || 1);
            input.value = String(Math.min(100, Math.max(1, (Number.isFinite(value) ? Math.round(value) : 1) + Number(button.dataset.delta))));
        }
        else if (action === "audit-start")
            this.startAudit();
        else if (action === "audit-mark")
            this.markAudit(id, button.dataset.state);
        else if (action === "audit-clear")
            this.markAudit(id);
        else if (action === "audit-finish")
            this.finishAuditDialog();
        else if (action === "audit-refresh")
            void this.refreshAudit();
        else if (action === "audit-result")
            this.auditResultDialog();
        else if (action === "add")
            this.kitId ? this.packageDialog() : this.kitDialog();
        else if (action === "add-pack")
            this.packageDialog(undefined, button.dataset.group);
        else if (action === "edit")
            this.packageDialog(id);
        else if (action === "edit-group")
            this.editGroup(button.dataset.group);
        else if (action === "select-group")
            this.selectGroup(button.dataset.group);
        else if (action === "category-add")
            this.categoryDialog();
        else if (action === "category-edit")
            this.categoryDialog(id);
        else if (action === "category-delete") {
            const category = this.data?.categories[id];
            if (category)
                this.confirmDialog("category_delete", id, this.t("Удалить категорию?"), `${this.t("Удалить категорию «")}${this.categoryName(category)}${this.t("»? Она будет снята со всех лекарств. Сами лекарства сохранятся.")}`);
        }
        else if (action === "categories-clear")
            this.confirmDialog("categories_clear", "", this.t("Удалить все категории?"), `${this.t("Категорий будет удалено: ")}${Object.keys(this.data.categories).length}. ${this.t("Метки будут сняты со всех лекарств. Сами лекарства сохранятся. Стандартные категории не появятся снова после перезапуска.")}`);
        else if (action === "reload-categories")
            void this.refresh().then(() => this.settingsDialog());
        else if (action === "create-category")
            void this.createCategory(button);
        else if (action === "remove-category") {
            this.categorySelection = this.categorySelection.filter(value => value !== id);
            this.renderCategoryOptions();
            this.dialog.querySelector(".category-picker>summary")?.focus();
        }
        else if (action === "kit-add")
            this.kitDialog();
        else if (action === "kit-edit")
            this.kitDialog(this.kitId);
        else if (action === "kit-delete")
            this.confirmDialog("kit_delete", this.kitId, this.t("Удалить аптечку?"), this.t("Все препараты и упаковки этой аптечки будут удалены."));
        else if (action === "delete-pack")
            this.confirmDialog("package_delete", id, this.t("Удалить упаковку?"), `${this.t("Упаковка №")}${this.data.packages[id].number} ${this.t("будет удалена из аптечки.")}`);
        else if (action === "toggle-available")
            void this.toggleAvailable(id);
        else if (action === "toggle-group-available")
            void this.toggleGroupAvailable(button.dataset.group, button);
        else if (action === "delete-group") {
            const group = this.data.groups[button.dataset.group];
            const count = Object.values(this.data.packages).filter(p => p.group_id === group.id).length;
            this.confirmDialog("group_delete", group.id, this.t("Удалить все упаковки?"), `${this.t("Вы действительно хотите удалить все упаковки лекарства «")}${group.name}»? ${this.t("Количество: ")}${count} ${this.t("шт.")}`);
        }
        else if (action === "settings")
            this.settingsDialog();
        else if (action === "export")
            this.exportDialog();
        else if (action === "close")
            this.dialog.close();
        else if (action === "clear-group-info") {
            this.dialog.querySelector('[name="info"]').value = "";
            this.groupEdits.add("info");
        }
        else if (action === "clear-photo") {
            this.groupEdits.add("image_id");
            this.root.querySelector('[name="image_id"]').value = "";
            this.root.querySelector('[name="photo"]').value = "";
            this.root.querySelector(".photo-status").textContent = this.t("Без фотографии");
        }
        else if (action === "reload-form") {
            this.dialog.close();
            void this.refresh().then(() => { if (button.dataset.kind === "group_save" && id && this.data?.groups[id])
                this.editGroup(id);
            else if (id && this.data?.packages[id])
                this.packageDialog(id);
            else
                this.toast(this.t("Список обновлён. Повторите изменение.")); });
        }
        else if (action === "reset-filters") {
            this.query = "";
            this.filter = "all";
            this.availability = "all";
            this.sort = "name";
            this.filterCategories.clear();
            this.root.querySelector("#category-filter-search").value = "";
            this.root.querySelector(".category-filter").open = false;
            this.renderCategoryFilter();
            this.root.querySelector("#query").value = "";
            this.root.querySelector("#status").value = "all";
            this.root.querySelector("#availability").value = "all";
            this.root.querySelector("#sort").value = "name";
            this.renderList();
        }
    };
    get dialog() { return this.root.querySelector("#dialog"); }
    showDialog(title, content, kind, id = "", submit = this.t("Сохранить"), cancelAction = "close") {
        if (this.dialog.open)
            this.dialog.close();
        // Only the short cabinet-name form focuses its input on opening.
        // All other dialogs start on their heading, not the close button.
        const focusHeading = kind !== "kit_save";
        this.dialog.innerHTML = `<form data-kind="${kind}" data-id="${escapeHtml(id)}" data-revision="${this.data?.revision ?? 0}"><div class="dialog-heading"><h2 id="dialog-title" ${focusHeading ? 'tabindex="-1" autofocus' : ""}>${escapeHtml(title)}</h2><button type="button" class="quiet icon" data-action="close" aria-label="${this.t("Закрыть")}">${icon("close")}</button></div>${content}<div class="notice form-error" role="alert"></div><div class="conflict-actions"></div>${submit ? `<div class="dialog-actions"><button type="button" data-action="${cancelAction}">${this.t("Отмена")}</button><button type="submit" class="primary">${submit}</button></div>` : ""}</form>`;
        this.dialog.setAttribute("aria-labelledby", "dialog-title");
        this.dialog.showModal();
        if (focusHeading)
            this.dialog.querySelector("h2").focus({ preventScroll: true });
    }
    kitDialog(id) {
        this.showDialog(id ? this.t("Название аптечки") : this.t("Новая аптечка"), `<label class="field">${this.t("Название")}<input name="name" maxlength="100" required value="${escapeHtml(id ? this.data.kits[id].name : "")}" placeholder="${this.t("Например, Дача")}" autofocus></label>`, "kit_save", id);
    }
    packageDialog(id, groupId) {
        if (!this.data || !this.kitId)
            return;
        const item = id ? this.data.packages[id] : undefined;
        groupId = item?.group_id || groupId;
        const copy = !item && groupId ? Object.values(this.data.packages).find(p => p.group_id === groupId) : undefined;
        const image = item?.image_id || copy?.image_id || "";
        const info = item?.info ?? copy?.info ?? "";
        this.categorySelection = [...(item?.category_ids ?? copy?.category_ids ?? [])];
        const fields = `<div class="form-grid"><div class="field full"><span id="group-label">${this.t("Препарат")}</span><input type="hidden" name="group_id" value="${escapeHtml(groupId || "")}"><details class="group-picker"><summary aria-describedby="group-label"><span class="group-value">${groupId ? escapeHtml(this.data.groups[groupId].name) : this.t("Новое лекарство")}</span></summary><div class="group-dropdown"><div class="group-search search">${icon("search")}<label><span class="sr">${this.t("Поиск препарата")}</span><input id="group-search" type="search" placeholder="${this.t("Поиск препарата")}" autocomplete="off"></label></div><button type="button" class="group-option group-new" data-action="select-group" data-group="">${this.t("Новое лекарство")}</button><div class="group-results" role="group" aria-label="${this.t("Сохранённые лекарства")}"></div></div></details></div><label class="field full">${this.t("Название")}<input name="name" maxlength="200" ${groupId ? "disabled" : "required"} value="${escapeHtml(groupId ? this.data.groups[groupId].name : "")}" placeholder="${this.t("Название, форма или дозировка")}"></label><label class="field full">${this.t("Доп. информация")}<textarea name="info" maxlength="5000" placeholder="${this.t("Дозировка, описание или ваши заметки")}">${escapeHtml(info)}</textarea></label>${this.categoryFields()}${!item ? `<div class="field full"><label for="mc-count">${this.t("Количество упаковок")}</label><div class="quantity-control"><button type="button" data-action="quantity" data-delta="-1" aria-label="${this.t("Уменьшить количество")}">${icon("minus")}</button><input id="mc-count" name="count" type="number" inputmode="numeric" min="1" max="100" step="1" value="1" aria-describedby="quantity-hint"><button type="button" data-action="quantity" data-delta="1" aria-label="${this.t("Увеличить количество")}">${icon("plus")}</button></div><small id="quantity-hint">${this.t("От 1 до 100. Дата, фото и категории будут одинаковыми.")}</small></div>` : ""}<div class="field ${item ? "" : "full"}"><div class="expiry-heading"><label for="mc-expiry">${this.t("Годен ДО")}</label><label class="check"><input name="no_expiry" type="checkbox" ${item?.no_expiry ? "checked" : ""}>${this.t("Бессрочно")}</label></div><input id="mc-expiry" name="expires_on" type="date" required value="${escapeHtml(item?.expires_on || "")}"><input class="expiry-unlimited" type="text" value="${this.t("Бессрочно")}" aria-label="${this.t("Срок годности")}" disabled hidden><small class="expiry-hint"></small></div>${item ? `<label class="field">${this.t("Наличие")}<select name="available"><option value="true">${this.t("Есть")}</option><option value="false" ${!item.available ? "selected" : ""}>${this.t("Закончился")}</option></select></label>` : ""}<div class="field full"><label for="mc-photo">${this.t("Фотография · необязательно")}</label><input type="hidden" name="image_id" value="${escapeHtml(image)}"><div class="file-row"><input id="mc-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="quiet" data-action="clear-photo">${this.t("Убрать")}</button></div><small class="photo-status">${image ? this.t("Используется сохранённая фотография") : this.t("JPEG, PNG или WebP, до 10 МБ. HEIC сначала сохраните как JPEG.")}</small></div></div>${item ? `<p class="explanation">${this.t("Изменение срока, включая отметку «Бессрочно», означает замену упаковки: дата добавления обновится, наличие станет «Есть».")}</p>` : ""}`;
        this.showDialog(item ? `${this.t("Упаковка №")}${item.number}` : this.t("Добавить лекарство"), fields, "package_save", id);
        this.renderGroupOptions();
        this.renderCategoryOptions();
        this.updateCategoryPreview();
        void this.setupCategoryIconPicker();
        this.updateExpiryInput();
    }
    updateExpiryInput() {
        const noExpiry = this.dialog.querySelector('[name="no_expiry"]').checked;
        const date = this.dialog.querySelector('[name="expires_on"]');
        const form = date.closest("form");
        const groupForm = form.dataset.kind === "group_save";
        date.disabled = noExpiry;
        date.required = !noExpiry && (!groupForm || this.groupEdits.has("expiry"));
        date.hidden = noExpiry;
        this.dialog.querySelector(".expiry-unlimited").hidden = !noExpiry;
        this.dialog.querySelector(".expiry-hint").textContent = groupForm && form.dataset.mixedExpiry === "true" && !this.groupEdits.has("expiry") ? this.t("Разные сроки. Без изменения поля каждый сохранится.") : noExpiry
            ? this.t("Напоминания о сроке не отправляются.")
            : this.t("Просрочен с 00:00 указанной даты по времени HA.");
    }
    confirmDialog(operation, id, title, text) {
        this.showDialog(title, `<p class="explanation">${escapeHtml(text)}</p>`, operation, id, this.t("Удалить"), operation.startsWith("categor") ? "settings" : "close");
    }
    settingsDialog() {
        this.showDialog(this.t("Аптечки и настройки"), `<div class="actions"><button type="button" data-action="kit-add">${icon("plus")}${this.t("Новая аптечка")}</button>${this.kitId ? `<button type="button" data-action="kit-edit">${this.t("Переименовать")}</button><button type="button" class="danger" data-action="kit-delete">${this.t("Удалить аптечку")}</button>` : ""}</div>${this.viewSettingsHtml()}${this.auditSettingsHtml()}${this.categoryCatalogHtml()}<p class="explanation">${this.t("Напоминания отправляются отдельно для каждой упаковки за 90 и за 7 дней. Данные и фотографии хранятся на вашем сервере.")}</p>${this.hass.user?.is_admin ? `<a class="settings-link" href="/config/integrations/integration/medicine_cabinet">${this.t("Язык, название и уведомления →")}</a>` : `<p class="explanation">${this.t("Время и получателей уведомлений настраивает администратор HA.")}</p>`}`, "settings", "", "");
        this.renderCategoryCatalog();
    }
    categoryCatalogHtml() {
        return `<section class="settings-categories" aria-labelledby="catalog-title"><div class="category-catalog-heading"><h3 id="catalog-title">${this.t("Категории")}</h3><button type="button" data-action="category-add">${icon("plus")}${this.t("Добавить категорию")}</button></div><p class="explanation">${this.t("Общий список для всех аптечек. Можно изменить или удалить любую категорию, включая стандартные.")}</p><label class="search">${icon("search")}<span class="sr">${this.t("Поиск категории")}</span><input type="search" id="category-catalog-search" placeholder="${this.t("Поиск категории")}" autocomplete="off"></label><p class="category-catalog-count small muted" role="status" aria-live="polite"></p><div class="category-catalog-list"></div><div class="category-catalog-footer"><button type="button" class="quiet danger" data-action="categories-clear">${this.t("Удалить все категории")}</button></div></section>`;
    }
    renderCategoryCatalog() {
        const section = this.dialog?.querySelector(".settings-categories");
        if (!section || !this.data)
            return;
        const categories = Object.values(this.data.categories);
        const query = this.categoryKey(section.querySelector("#category-catalog-search").value);
        const matches = categories.filter(c => this.categoryKey(`${c.name} ${c.name_en || ""}`).includes(query)).sort((a, b) => this.categoryName(a).localeCompare(this.categoryName(b), this.language));
        section.querySelector(".category-catalog-count").textContent = `${this.t("Всего категорий: ")}${categories.length}`;
        section.querySelector(".category-catalog-list").innerHTML = matches.map(c => `<div class="category-catalog-row">${this.categoryBadge(c)}<div class="category-row-actions"><button type="button" class="quiet icon" data-action="category-edit" data-id="${escapeHtml(c.id)}" aria-label="${this.t("Изменить категорию ")}${escapeHtml(this.categoryName(c))}">${icon("edit")}</button><button type="button" class="quiet icon danger" data-action="category-delete" data-id="${escapeHtml(c.id)}" aria-label="${this.t("Удалить категорию ")}${escapeHtml(this.categoryName(c))}">${icon("trash")}</button></div></div>`).join("") || `<p class="explanation">${this.t(categories.length ? "Категории не найдены." : "Категорий пока нет. Добавьте свою категорию.")}</p>`;
        section.querySelector(".category-catalog-footer").hidden = categories.length === 0;
    }
    categoryDialog(id) {
        const category = id ? this.data?.categories[id] : undefined;
        if (id && !category) {
            this.settingsDialog();
            return;
        }
        this.showDialog(this.t(id ? "Изменить категорию" : "Добавить категорию"), `<div class="category-field category-editor">${this.categoryEditorFields(category)}</div><p class="explanation">${this.t(id ? "Изменения отобразятся у всех лекарств с этой категорией." : "Сохранится в общем списке для всех аптечек.")}</p>`, "category_save", id, this.t("Сохранить"), "settings");
        const input = this.dialog.querySelector('[name="category_name"]');
        input.required = true;
        input.focus();
        this.updateCategoryPreview();
        void this.setupCategoryIconPicker();
    }
    exportDialog() {
        this.showDialog(`${this.t("Скачать аптечку")} «${this.data.kits[this.kitId].name}»`, `<p class="explanation">${this.t("Файл сохранится локально.")}</p><div class="form-grid"><label class="field full">${this.t("Формат")}<select name="format"><option value="pdf">PDF ${this.t("с фотографиями")}</option><option value="csv">CSV ${this.t("для таблиц")}</option></select></label><label class="field full">${this.t("Срок годности")}<select name="expiry"><option value="expired">${this.t("Просроченные")}</option><option value="within_90">${this.t("До 90 дней, включая просроченные")}</option><option value="over_90">${this.t("Более чем через 90 дней")}</option><option value="all" selected>${this.t("Все лекарства")}</option></select><small>${this.t("Бессрочные упаковки входят в «Все лекарства». Закончившиеся можно добавить при любом сроке.")}</small></label><div class="field full"><label class="check"><input type="checkbox" name="include_finished" checked>${this.t("Добавить закончившиеся")}</label><small>${this.t("По сроку выбираются упаковки в наличии. Галочка добавляет все закончившиеся независимо от срока.")}</small></div></div><div class="export-preview" role="status" aria-live="polite" aria-atomic="true"><strong class="export-count"></strong><p class="export-empty small muted" hidden>${this.t("По выбранным фильтрам лекарств нет.")}</p></div>`, "export", "", this.t("Скачать"));
        this.dialog.querySelector("form").dataset.kitId = this.kitId;
        this.updateExportPreview();
    }
    exportFilters(form) {
        const fields = new FormData(form);
        return { expiry: String(fields.get("expiry")), include_finished: fields.get("include_finished") === "on" };
    }
    updateExportPreview() {
        const form = this.dialog.querySelector('form[data-kind="export"]');
        if (!this.data || !this.dialog.open || !form)
            return;
        const { expiry, include_finished } = this.exportFilters(form);
        const rows = Object.values(this.data.packages).filter(item => {
            if (this.data.groups[item.group_id].kit_id !== form.dataset.kitId)
                return false;
            if (!item.available)
                return include_finished;
            const days = item.days_remaining;
            return expiry === "all" || (days !== null && ((expiry === "expired" && days <= 0) ||
                (expiry === "within_90" && days <= 90) ||
                (expiry === "over_90" && days > 90)));
        });
        const medicines = new Set(rows.map(item => item.group_id)).size;
        const format = form.querySelector('[name="format"]').value.toUpperCase();
        form.querySelector(".export-count").textContent = `${format} · ${this.t("Препаратов: ")}${medicines} · ${this.t("Упаковок: ")}${rows.length}`;
        form.querySelector(".export-empty").hidden = rows.length !== 0;
    }
    async request(operation, payload, revision) {
        this.data = await this.hass.callWS({ type: "medicine_cabinet/request", operation, payload, revision });
        this.resolveSelectedKit();
        this.render();
    }
    async toggleAvailable(id) {
        const pack = this.data.packages[id];
        try {
            await this.request("package_save", { id, kit_id: this.kitId, group_id: pack.group_id, info: pack.info, expires_on: pack.expires_on, no_expiry: pack.no_expiry, image_id: pack.image_id, available: !pack.available }, this.data.revision);
            this.toast(pack.available ? this.t("Упаковка отмечена как закончившаяся") : this.t("Упаковка снова в наличии"));
        }
        catch (err) {
            this.showError(err);
            await this.refresh();
            this.showError(err);
        }
    }
    async toggleGroupAvailable(groupId, button) {
        const available = !Object.values(this.data.packages).some(p => p.group_id === groupId && p.available);
        button.disabled = true;
        try {
            await this.request("group_set_available", { id: groupId, kit_id: this.kitId, available }, this.data.revision);
            this.toast(available ? this.t("Все упаковки снова в наличии") : this.t("Все упаковки отмечены как закончившиеся"));
        }
        catch (err) {
            this.showError(err);
            await this.refresh();
            this.showError(err);
        }
        finally {
            button.disabled = false;
        }
    }
    onSubmit = (event) => {
        event.preventDefault();
        void this.submit(event.target);
    };
    async submit(form) {
        if (form.dataset.kind === "settings" || this.creatingCategory || !form.reportValidity())
            return;
        const buttons = [...form.querySelectorAll("button")];
        buttons.forEach(b => { b.disabled = true; });
        this.showError("", true);
        const fields = new FormData(form);
        const kind = form.dataset.kind;
        try {
            if (kind === "audit_complete") {
                const audit = this.audit;
                await this.request("audit_complete", { kit_id: audit.kitId, checks: [...audit.choices].map(([id, state]) => ({ id, state })) }, audit.revision);
                this.audit = undefined;
                this.render();
                this.auditResultDialog();
                return;
            }
            if (kind === "export") {
                const format = String(fields.get("format"));
                const filters = this.exportFilters(form);
                const response = await this.hass.fetchWithAuth(`/api/medicine_cabinet/export/${format}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kit_id: form.dataset.kitId, ...filters }) });
                if (!response.ok)
                    throw await response.json();
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `medicine-cabinet-${this.data.today}.${format}`;
                document.body.append(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 60000);
                this.dialog.close();
                this.toast(this.t("Файл подготовлен для скачивания"));
                return;
            }
            let payload = { id: form.dataset.id || undefined };
            if (kind === "kit_save")
                payload.name = fields.get("name");
            if (kind === "category_save")
                payload = { ...payload, name: fields.get("category_name"), color: fields.get("category_color"), icon: fields.get("category_icon") };
            if (kind === "group_delete")
                payload.kit_id = this.kitId;
            if (kind === "package_save" || kind === "group_save") {
                let imageId = String(fields.get("image_id") || "");
                const file = fields.get("photo");
                if (file?.size) {
                    if (file.size > 10 * 1024 * 1024)
                        throw new Error(this.t("Фото должно быть не больше 10 МБ"));
                    const response = await this.hass.fetchWithAuth("/api/medicine_cabinet/images", { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: file });
                    const result = await response.json();
                    if (!response.ok)
                        throw result;
                    imageId = result.image_id;
                    form.querySelector('[name="image_id"]').value = imageId;
                    form.querySelector('[name="photo"]').value = "";
                }
                if (kind === "group_save") {
                    payload.kit_id = form.dataset.kitId;
                    for (const key of ["name", "info"])
                        if (this.groupEdits.has(key))
                            payload[key] = fields.get(key);
                    if (this.groupEdits.has("available") && fields.get("available") !== "")
                        payload.available = fields.get("available") === "true";
                    if (this.groupEdits.has("image_id") || file?.size)
                        payload.image_id = imageId || null;
                    if (this.groupEdits.has("expiry")) {
                        payload.no_expiry = fields.get("no_expiry") === "on";
                        payload.expires_on = payload.no_expiry ? null : fields.get("expires_on");
                    }
                    const bulkCategories = form.querySelector('[name="apply_categories"]');
                    if (bulkCategories ? bulkCategories.checked : JSON.stringify(this.categorySelection) !== form.dataset.categories)
                        payload.category_ids = [...this.categorySelection];
                }
                else {
                    payload = { ...payload, count: form.dataset.id ? 1 : Number(fields.get("count") || 1), kit_id: this.kitId, category_ids: [...this.categorySelection], group_id: fields.get("group_id") || null, name: fields.get("name") || "", info: fields.get("info"), no_expiry: fields.get("no_expiry") === "on", expires_on: fields.get("no_expiry") === "on" ? null : fields.get("expires_on"), available: form.dataset.id ? fields.get("available") === "true" : true, image_id: imageId || null };
                }
            }
            await this.request(kind, payload, Number(form.dataset.revision));
            if (kind.startsWith("categor"))
                this.settingsDialog();
            else
                this.dialog.close();
            this.toast(kind.endsWith("delete") || kind === "categories_clear" ? this.t("Удалено") : this.t("Сохранено"));
        }
        catch (err) {
            this.showError(err, true);
            if (err.code === "conflict" && kind === "audit_complete") {
                form.querySelector(".conflict-actions").innerHTML = `<p class="explanation">${this.t("Список изменился на другом устройстве. Обновите ревизию и проверьте новые или изменённые упаковки.")}</p><button type="button" data-action="audit-refresh">${this.t("Обновить ревизию")}</button>`;
            }
            else if (err.code === "conflict") {
                form.querySelector(".conflict-actions").innerHTML = `<p class="explanation">${kind === "group_delete" ? this.t("Состав аптечки изменился. Обновите список, проверьте количество упаковок и повторите удаление.") : this.t("Ваш ввод пока сохранён в форме. Скопируйте нужные изменения перед перезагрузкой записи.")}</p><button type="button" data-action="${kind.startsWith("categor") ? "reload-categories" : "reload-form"}" data-kind="${kind}" data-id="${escapeHtml(form.dataset.id || "")}">${this.t(kind.startsWith("categor") ? "Обновить список категорий" : "Перезагрузить запись")}</button>`;
            }
        }
        finally {
            buttons.forEach(b => { b.disabled = false; });
            if (kind === "package_save" || kind === "group_save")
                this.renderCategoryOptions();
        }
    }
}
if (!customElements.get("medicine-cabinet-panel"))
    customElements.define("medicine-cabinet-panel", MedicineCabinetPanel);
