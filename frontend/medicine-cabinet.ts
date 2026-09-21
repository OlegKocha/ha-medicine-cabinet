/** Local translations. User-entered names and notes are never translated. */
const english: Record<string, string> = {
  "Истекает в течение 90 дней": "Expires within 90 days",
  "Истекает в течение 7 дней": "Expires within 7 days",
  "Просрочено": "Expired",
  "Аптечка": "Medicine Box",
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
  "Выберите упаковку": "Choose a package",
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

function translate(language: "ru" | "en", message: string): string {
  return language === "en" ? (english[message] ?? message) : message;
}

/** Local Medicine Cabinet panel. No CDN, framework, or browser-stored inventory. */
type Kit = { id: string; name: string };
type Group = { id: string; kit_id: string; name: string };
type Pack = { id: string; number: number; group_id: string; info: string; image_id: string | null; expires_on: string | null; no_expiry: boolean; added_at: string; available: boolean; status: string; days_remaining: number | null };
type Snapshot = { revision: number; kits: Record<string, Kit>; groups: Record<string, Group>; packages: Record<string, Pack>; today: string; timezone: string; settings: { language: "ru" | "en"; sidebar_title: string } };
type Hass = { language: string; user?: { id?: string; is_admin: boolean }; callWS<T>(message: object): Promise<T>; fetchWithAuth(path: string, init?: RequestInit): Promise<Response>; connection: { subscribeMessage(callback: (data: unknown) => void, message: object): Promise<() => void>; addEventListener?(event: string, callback: () => void): void; removeEventListener?(event: string, callback: () => void): void } };

const escapeHtml = (text: unknown): string => String(text ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const compareExpiry = (a: Pack, b: Pack): number => Number(a.expires_on === null) - Number(b.expires_on === null) || (a.expires_on || "").localeCompare(b.expires_on || "");
const labels: Record<string, string> = { due_90: "Истекает в течение 90 дней", due_7: "Истекает в течение 7 дней", expired: "Просрочено" };
const icon = (name: string): string => {
  const paths: Record<string, string> = {
    bag: '<path d="M8 6V4h8v2m-12 0h16v15H4zM12 10v7m-3-3.5h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', edit: '<path d="m4 16-1 5 5-1L20 8l-4-4L4 16Zm10-10 4 4"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', photo: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 6-6 5 5 3-3 4 4"/>',
    settings: '<path d="m9 3-.6 2.4-2 .9-2.2-.7-2 3.4L4 10.7v2.6l-1.8 1.7 2 3.4 2.2-.7 2 .9L9 21h4l.6-2.4 2-.9 2.2.7 2-3.4-1.8-1.7v-2.6L19.8 9l-2-3.4-2.2.7-2-.9L13 3Z"/><circle cx="11" cy="12" r="3"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bag}</svg>`;
};

const styles = `
:host{display:block;height:100%;color:var(--primary-text-color,#243746);background:var(--primary-background-color,#f5f8fa);font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,sans-serif);--mc-accent:var(--primary-color,#007f88);--mc-line:var(--divider-color,#d9e3e8);--mc-muted:var(--secondary-text-color,#627782);--mc-card:var(--card-background-color,#fff);--mc-danger:var(--error-color,#c33d43);--mc-warn:var(--warning-color,#ad6a13);--mc-radius:var(--ha-card-border-radius,14px)}
*{box-sizing:border-box}button,input,select,textarea{font:inherit;color:inherit}button,select{cursor:pointer}button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;border:1px solid var(--mc-line);border-radius:9px;padding:8px 13px;background:var(--mc-card);font-weight:600}button:hover{border-color:var(--mc-accent)}button:disabled{opacity:.5;cursor:wait}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid var(--mc-accent);outline-offset:3px}svg{width:21px;height:21px;flex-shrink:0}.primary{background:var(--mc-accent);color:var(--text-primary-color,#fff);border-color:transparent}.quiet{background:transparent;border-color:transparent}.icon{width:42px;padding:8px}.danger{color:var(--mc-danger)}.muted{color:var(--mc-muted)}.small{font-size:13px}.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.app{height:100%;overflow:auto;padding-bottom:env(safe-area-inset-bottom,16px)}header{height:64px;display:flex;align-items:center;gap:14px;padding:0 22px;border-bottom:1px solid var(--mc-line);background:var(--mc-card)}header strong{font-size:20px;font-weight:600;letter-spacing:-.4px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.offline-label{margin-left:auto;display:flex;align-items:center;gap:6px;color:var(--mc-muted);font-size:12px}.dot{width:7px;height:7px;border-radius:50%;background:var(--mc-accent)}main{max-width:1080px;margin:auto;padding:32px 28px 64px}.toolbar{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:24px}.kit-picker{flex:1;min-width:180px}.eyebrow{display:block;color:var(--mc-muted);font-size:12px;margin-bottom:7px}.kit-picker select{font-size:26px;font-weight:650;letter-spacing:-.7px;border:1px solid #8dbcd3;border-radius:9px;padding:7px 36px 7px 12px;background:var(--mc-card);width:100%;max-width:420px}.kit-picker option{background:var(--mc-card);font-size:16px}.actions{display:flex;gap:8px;flex-wrap:wrap}.filters{display:grid;grid-template-columns:minmax(160px,1fr) auto auto auto auto;gap:10px;margin:20px 0}.search{position:relative}.search svg{position:absolute;left:12px;top:12px;color:var(--mc-muted)}input,select,textarea{min-height:44px;border:1px solid var(--mc-line);border-radius:8px;background:var(--mc-card);padding:10px 12px;max-width:100%}.search input{padding-left:40px;width:100%}.summary-line{display:flex;gap:16px;flex-wrap:wrap;min-height:25px;color:var(--mc-muted);font-size:13px;margin-bottom:13px}.summary-line b{color:var(--primary-text-color,#243746)}.cards{display:flex;flex-direction:column;gap:13px}.medicine{border:1px solid var(--mc-line);border-radius:var(--mc-radius);background:var(--mc-card);overflow:hidden}.medicine-header{display:grid;grid-template-columns:67px minmax(0,1fr) minmax(0,1fr) 42px;align-items:center;gap:17px;padding:19px 21px}.medicine-header.has-expired{border-left:4px solid var(--mc-danger);padding-left:17px}.photo{width:67px;height:67px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--secondary-background-color,#edf3f5);flex-shrink:0;overflow:hidden;color:var(--mc-accent)}.photo svg{width:29px;height:29px}.photo img{width:100%;height:100%;object-fit:contain}.medicine-heading{flex:1;min-width:0}.medicine-heading h2{margin:0 0 6px;font-size:18px;font-weight:650;line-height:1.35;overflow-wrap:anywhere}.medicine-heading p{margin:0;color:var(--mc-muted);font-size:13px}.badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 8px;border-radius:6px;border:1px solid currentColor}.badge.expired{color:var(--mc-danger)}.badge.due_7,.badge.due_90{color:var(--mc-warn)}.badge.finished{color:var(--mc-muted);border-style:dashed}.badges{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0}details>summary{padding:12px 21px;font-size:13px;border-top:1px solid var(--mc-line);color:var(--mc-muted);cursor:pointer;line-height:1.6}details[open]>summary{background:var(--secondary-background-color,#edf3f5)}.pack,.group-footer{padding:18px 21px;border-top:1px solid var(--mc-line)}.pack-head{display:flex;align-items:center;gap:10px}.pack-head strong{flex:1;font-size:14px}.pack-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 25px;margin-top:12px;font-size:13px}.pack-meta span{display:block;color:var(--mc-muted);font-size:12px;margin-bottom:4px}.note{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.55;margin:13px 0 0}.pack-photo{width:100px;height:80px;float:right;margin:10px 0 10px 15px}.pack-footer{display:flex;gap:9px;margin-top:15px}.pack-footer button{font-size:12px;min-height:34px}.add-pack{padding:12px 21px;border-top:1px solid var(--mc-line)}.empty{text-align:center;padding:60px 20px;border:1px dashed var(--mc-line);border-radius:var(--mc-radius);background:var(--mc-card)}.empty>svg{width:48px;height:48px;color:var(--mc-accent);margin-bottom:8px}.empty h2{font-size:22px;font-weight:600;margin:12px 0}.empty p{color:var(--mc-muted);max-width:400px;margin:0 auto 20px;line-height:1.6}.notice{padding:12px 15px;border:1px solid var(--mc-danger);border-radius:8px;color:var(--mc-danger);margin:12px 0;white-space:pre-wrap}.notice:empty{display:none}.toast{position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:var(--primary-text-color,#243746);color:var(--primary-background-color,#fff);border-radius:9px;padding:12px 20px;z-index:20;max-width:90vw;font-size:14px}.toast:empty{display:none}
dialog{color:inherit;background:var(--mc-card);border:1px solid var(--mc-line);border-radius:16px;padding:0;max-width:560px;width:calc(100% - 28px);max-height:90dvh;box-shadow:0 18px 70px #0005}dialog::backdrop{background:#142a3b80}dialog form{padding:24px;overflow:auto}dialog h2{font-size:23px;font-weight:650;letter-spacing:-.5px;margin:0}.dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.field{display:flex;flex-direction:column;gap:6px;font-size:14px;min-width:0}.field.full{grid-column:1/-1}.field small{font-size:12px;color:var(--mc-muted);line-height:1.5}.field input,.field select{width:100%;min-width:0}.field input[type=date]{appearance:none;-webkit-appearance:none;min-inline-size:0;max-inline-size:100%}.field input[type=date]::-webkit-date-and-time-value{min-width:0;text-align:left}.field textarea{resize:vertical;min-height:96px;line-height:1.5}.export-preview{border-top:1px solid var(--mc-line);margin-top:20px;padding-top:16px;line-height:1.6;font-size:14px}.export-preview p{margin:4px 0 0}.dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:24px}.file-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.file-row input{font-size:12px;flex:1;min-width:180px}.check{display:flex;align-items:center;gap:8px}.expiry-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:20px}.expiry-heading .check{white-space:nowrap;font-size:13px}.check input{min-height:20px;width:18px;height:18px}.explanation{overflow-wrap:anywhere;color:var(--mc-muted);font-size:14px;line-height:1.65}.settings-link{display:block;padding:12px;border:1px solid var(--mc-line);border-radius:8px;margin:10px 0;color:var(--mc-accent);text-decoration:none}.loading{text-align:center;padding:60px 20px;color:var(--mc-muted)}
.medicine-info{min-width:0}.medicine-info .note{margin:0;font-size:13px}.medicine-info.multiple .note{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.medicine-actions{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.single-pack{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.single-pack .pack-meta,.single-pack .pack-footer,.group-footer .pack-footer{margin:0}.group-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.dialog-heading h2[tabindex]:focus{outline:none}.group-picker{position:relative;border:1px solid var(--mc-line);border-radius:8px;min-width:0}.group-picker>summary{display:flex;align-items:center;gap:12px;min-height:44px;list-style:none;border:0;padding:10px 12px;color:inherit;font-size:14px;line-height:1.5;background:var(--mc-card);border-radius:8px}.group-picker>summary::-webkit-details-marker{display:none}.group-value{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.group-picker>summary::after{content:"";width:8px;height:8px;border-right:1.7px solid currentColor;border-bottom:1.7px solid currentColor;transform:rotate(45deg);margin:0 3px 4px;flex-shrink:0}.group-picker[open]>summary::after{transform:rotate(225deg);margin-bottom:-4px}.group-dropdown{position:absolute;z-index:2;top:calc(100% + 4px);left:-1px;right:-1px;border:1px solid var(--mc-line);border-radius:9px;background:var(--mc-card);box-shadow:0 8px 24px #0002;overflow:hidden}.group-search{padding:8px}.group-search input{font-size:14px}.group-search svg{left:20px;top:20px}.group-option{display:block;width:100%;height:44px;min-height:44px;border:0;border-radius:0;padding:10px 12px;text-align:left;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.group-option:hover,.group-option:focus-visible{background:var(--secondary-background-color,#edf3f5)}.group-option:focus-visible{outline:2px solid var(--mc-accent);outline-offset:-2px}.group-option[aria-pressed=true]{color:var(--mc-accent);background:var(--secondary-background-color,#edf3f5)}.group-new{border-bottom:1px solid var(--mc-line)}.group-results{max-height:132px;overflow-y:auto;overscroll-behavior:contain}.group-results p{padding:0 12px}.package-choices{display:flex;flex-direction:column;gap:10px}.package-choice{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:4px;padding:12px}.package-choice .note{margin:0;font-weight:400;max-height:4.5em;overflow:hidden}.package-choice .badges{margin:3px 0}
@media(min-width:701px) and (max-width:1100px){.filters{grid-template-columns:repeat(4,minmax(0,1fr))}.filters .search{grid-column:1/-1}.filters select,.filters button{min-width:0;font-size:13px}}
@media(max-width:700px){.medicine-header{grid-template-columns:56px minmax(0,1fr) 42px}.medicine-info{grid-column:1/-1}.medicine-actions{grid-column:3;grid-row:1}.single-pack{align-items:flex-start}main{padding:21px 14px 50px}header{padding:0 12px}.offline-label{font-size:11px}.toolbar{gap:10px;margin-bottom:18px}.kit-picker select{font-size:25px}.actions{width:100%}.actions .primary{flex:1}.filters{grid-template-columns:1fr 1fr}.search{grid-column:1/-1}.filters select{font-size:12px;min-width:0}.filters .reset-filters{font-size:12px;min-width:0}.medicine-header{padding:16px;gap:12px}.medicine-header.has-expired{padding-left:12px}.medicine-heading h2{font-size:17px}.photo{width:56px;height:56px}.pack,.group-footer,details>summary,.add-pack{padding-left:16px;padding-right:16px}.pack-meta{gap:10px;font-size:12px}.form-grid{grid-template-columns:minmax(0,1fr)}.field.full{grid-column:auto}dialog form{padding:20px}.summary-line{gap:10px;font-size:12px}}
@media(prefers-reduced-motion:no-preference){button{transition:background .12s,border-color .12s}.medicine{animation:appear .18s ease-out}@keyframes appear{from{opacity:.5;transform:translateY(3px)}to{opacity:1;transform:none}}}
`;

class MedicineCabinetPanel extends HTMLElement {
  private _hass?: Hass;
  private data?: Snapshot;
  private get language(): "ru" | "en" { return this.data?.settings?.language || "ru"; }
  private t(text: string): string { return translate(this.language, text); }
  private shellKey = "";
  private kitId = "";
  private query = "";
  private filter = "all";
  private availability = "all";
  private sort = "name";
  private openGroups = new Set<string>();
  private unsubscribe?: () => void;
  private initialized = false;
  private starting = false;
  private requestSequence = 0;
  private imageUrls = new Map<string, string>();
  private imageRequests = new Map<string, Promise<string>>();
  private toastTimer?: ReturnType<typeof setTimeout>;
  private reconnect = () => { void this.refresh(); };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  set hass(value: Hass) {
    const userChanged = this._hass?.user?.id !== value.user?.id;
    this._hass = value;
    if (userChanged) {
      this.kitId = this.readSelectedKit();
      this.openGroups.clear();
      if (this.initialized && this.data) { this.resolveSelectedKit(); this.render(); }
    }
    if (this.isConnected && !this.initialized) void this.start();
  }
  get hass(): Hass { return this._hass!; }
  connectedCallback() { if (this._hass) void this.start(); }
  disconnectedCallback() {
    this.unsubscribe?.(); this.unsubscribe = undefined;
    this._hass?.connection.removeEventListener?.("ready", this.reconnect);
    this.initialized = false;
    for (const url of this.imageUrls.values()) URL.revokeObjectURL(url);
    this.imageUrls.clear();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
  private get root(): ShadowRoot { return this.shadowRoot!; }
  private async start() {
    if (this.initialized || this.starting || !this._hass) return;
    this.starting = true;
    this.renderShell();
    this.root.addEventListener("click", this.onClick);
    this.root.addEventListener("input", this.onInput);
    this.root.addEventListener("change", this.onChange);
    this.root.addEventListener("submit", this.onSubmit);
    this.root.addEventListener("keydown", this.onPickerKeydown);
    this.root.addEventListener("focusout", event => {
      const picker = this.dialog.querySelector<HTMLDetailsElement>(".group-picker");
      const next = (event as FocusEvent).relatedTarget as Node | null;
      // WebKit moves focus to the dialog on pointer presses on buttons.
      // Let the click handler select the option or close the picker outside it.
      if (picker?.open && next && next !== this.dialog && !picker.contains(next)) picker.open = false;
    });
    this.root.addEventListener("toggle", event => {
      const element = event.target as HTMLDetailsElement;
      if (element.classList.contains("group-picker") && element.open && (!element.contains(this.root.activeElement) || this.root.activeElement?.tagName === "SUMMARY")) {
        element.querySelector<HTMLInputElement>("#group-search")?.focus();
      }
      if (element.tagName === "DETAILS" && element.dataset.group) {
        if (element.open) this.openGroups.add(element.dataset.group); else this.openGroups.delete(element.dataset.group);
      }
    }, true);
    try {
      this.unsubscribe = await this.hass.connection.subscribeMessage(() => { void this.refresh(); }, { type: "medicine_cabinet/subscribe" });
      this.hass.connection.addEventListener?.("ready", this.reconnect);
      this.initialized = true;
      await this.refresh();
    } catch (err) { this.showError(err); }
    finally { this.starting = false; }
  }
  private get selectionKey(): string | null {
    return this.hass.user?.id ? `medicine_cabinet:selected_kit:${this.hass.user.id}` : null;
  }
  private readSelectedKit(): string {
    try { return this.selectionKey ? localStorage.getItem(this.selectionKey) || "" : ""; }
    catch { return ""; }
  }
  private rememberSelectedKit() {
    try {
      if (!this.selectionKey) return;
      if (this.kitId) localStorage.setItem(this.selectionKey, this.kitId);
      else localStorage.removeItem(this.selectionKey);
    } catch { /* Browser storage may be disabled; the panel still works. */ }
  }
  private resolveSelectedKit() {
    if (!this.data!.kits[this.kitId]) this.kitId = Object.keys(this.data!.kits)[0] || "";
    this.rememberSelectedKit();
  }
  private async refresh() {
    const sequence = ++this.requestSequence;
    try {
      const result = await this.hass.callWS<Snapshot>({ type: "medicine_cabinet/request", operation: "list" });
      if (sequence !== this.requestSequence || !this.isConnected) return;
      this.data = result;
      this.resolveSelectedKit();
      this.render(); this.showError("");
    } catch (err) { this.showError(err); }
  }
  private showError(error: unknown, form = false) {
    const message = typeof error === "string" ? error : (error as { message?: string })?.message || this.t("Нет связи с Home Assistant. Проверьте подключение и обновите страницу.");
    const element = this.root.querySelector(form ? ".form-error" : "#error");
    if (element) element.textContent = message;
  }
  private toast(message: string) {
    const el = this.root.querySelector(".toast")!; el.textContent = message;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { el.textContent = ""; }, 4000);
  }
  private visiblePackages(): Pack[] {
    if (!this.data) return [];
    const query = this.query.trim().toLocaleLowerCase();
    const rows = Object.values(this.data.packages).filter(item => {
      const group = this.data!.groups[item.group_id];
      return group.kit_id === this.kitId && (!query || `${group.name} ${item.info}`.toLocaleLowerCase().includes(query)) && (this.filter === "all" || item.status === this.filter) && (this.availability === "all" || item.available === (this.availability === "present"));
    });
    return rows.sort((a, b) => this.sort === "name" ? this.data!.groups[a.group_id].name.localeCompare(this.data!.groups[b.group_id].name, this.language) || compareExpiry(a, b) : compareExpiry(a, b) || this.data!.groups[a.group_id].name.localeCompare(this.data!.groups[b.group_id].name, this.language) || a.number - b.number);
  }
  private renderShell() {
    this.root.innerHTML = `<style>${styles}</style><div class="app"><header>${icon("bag")}<strong>${escapeHtml(this.data?.settings?.sidebar_title || this.t("Аптечка"))}</strong><span class="offline-label"><span class="dot"></span>${this.t("Данные в Home Assistant")}</span></header><main><div class="toolbar"><div class="kit-picker"><label class="eyebrow" for="kit">${this.t("МЕСТО ХРАНЕНИЯ")}</label><select id="kit" aria-label="${this.t("Выбрать аптечку")}"></select></div><div class="actions"><button class="primary" data-action="add">${icon("plus")}${this.t("Добавить")}</button><button data-action="export">${icon("download")}${this.t("Экспорт")}</button><button class="icon" data-action="settings" aria-label="${this.t("Настройки аптечек")}">${icon("settings")}</button></div></div><div class="filters"><label class="search">${icon("search")}<span class="sr">${this.t("Поиск по названию и дополнительной информации")}</span><input id="query" type="search" placeholder="${this.t("Название или доп. информация")}" autocomplete="off"></label><select id="status" aria-label="${this.t("Срок годности")}"><option value="all">${this.t("Все сроки")}</option><option value="expired">${this.t("Просрочено")}</option><option value="due_7">${this.t("До 7 дней")}</option><option value="due_90">${this.t("От 8 до 90 дней")}</option><option value="ok">${this.t("Более 90 дней")}</option><option value="no_expiry">${this.t("Бессрочно")}</option></select><select id="availability" aria-label="${this.t("Наличие")}"><option value="all">${this.t("Любое наличие")}</option><option value="present">${this.t("Есть")}</option><option value="finished">${this.t("Закончился")}</option></select><select id="sort" aria-label="${this.t("Сортировка")}"><option value="name">${this.t("По названию")}</option><option value="expiry">${this.t("Ближайший срок")}</option></select><button type="button" class="reset-filters" data-action="reset-filters">${this.t("Сбросить все фильтры")}</button></div><div id="error" class="notice" role="alert"></div><div id="summary" class="summary-line"></div><div id="list" class="cards"><p class="loading">${this.t("Загружаем аптечки…")}</p></div></main></div><dialog id="dialog"></dialog><div class="toast" role="status" aria-live="polite"></div>`;
    this.root.querySelector(".app")!.setAttribute("lang", this.language);
    this.root.querySelector<HTMLInputElement>("#query")!.value = this.query;
    this.root.querySelector<HTMLSelectElement>("#status")!.value = this.filter;
    this.root.querySelector<HTMLSelectElement>("#availability")!.value = this.availability;
    this.root.querySelector<HTMLSelectElement>("#sort")!.value = this.sort;
  }
  private render() {
    if (!this.data) return;
    const shellKey = JSON.stringify(this.data.settings);
    if (shellKey !== this.shellKey) { this.shellKey = shellKey; this.renderShell(); }
    const kitSelect = this.root.querySelector<HTMLSelectElement>("#kit")!;
    kitSelect.innerHTML = Object.values(this.data.kits).map(kit => `<option value="${escapeHtml(kit.id)}">${escapeHtml(kit.name)}</option>`).join("") || `<option value="">${this.t("Создайте аптечку")}</option>`;
    kitSelect.value = this.kitId;
    this.root.querySelector<HTMLButtonElement>('[data-action="export"]')!.disabled = !this.kitId;
    this.renderList();
    this.updateExportPreview();
  }
  private renderList() {
    if (!this.data) return;
    const list = this.root.querySelector("#list")!;
    const rows = this.visiblePackages();
    const all = Object.values(this.data.packages).filter(p => this.data!.groups[p.group_id].kit_id === this.kitId);
    const present = all.filter(p => p.available);
    this.root.querySelector("#summary")!.innerHTML = this.kitId ? `<span>${this.t("В наличии: ")}<b>${present.length}</b></span><span>${this.t("Просрочено: ")}<b>${present.filter(p => p.status === "expired").length}</b></span><span>${this.t("Закончились: ")}<b>${all.length - present.length}</b></span><span>${this.t("В выборке: ")}<b>${rows.length}</b></span>` : "";
    if (!this.kitId) {
      list.innerHTML = `<div class="empty">${icon("bag")}<h2>${this.t("У каждой аптечки своё место")}</h2><p>${this.t("Создайте первую аптечку — например, «Дача». Затем добавьте лекарства и сроки их годности.")}</p><button class="primary" data-action="kit-add">${icon("plus")}${this.t("Создать аптечку")}</button></div>`; return;
    }
    if (!rows.length) {
      list.innerHTML = `<div class="empty">${icon("bag")}<h2>${all.length ? this.t("Ничего не найдено") : this.t("Здесь будут ваши лекарства")}</h2><p>${all.length ? this.t("Измените поиск или сбросьте фильтры.") : this.t("Добавьте первую упаковку. Фотографию можно загрузить позже.")}</p><button class="primary" data-action="${all.length ? "reset-filters" : "add"}">${all.length ? this.t("Сбросить фильтры") : this.t("Добавить лекарство")}</button></div>`; return;
    }
    const groups = new Map<string, Pack[]>();
    for (const item of rows) { if (!groups.has(item.group_id)) groups.set(item.group_id, []); groups.get(item.group_id)!.push(item); }
    list.innerHTML = [...groups].map(([id, items]) => {
      const group = this.data!.groups[id];
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
      const contents = multiple ? `<details data-group="${id}" ${this.openGroups.has(id) ? "open" : ""}><summary>${this.t("Упаковки: ")}<b>${available.length} ${this.t("в наличии")}</b>${expired ? ` · ${expired} ${this.t("просрочено")}` : ""}${finished ? ` · ${finished} ${this.t("закончились")}` : ""}${items.length !== siblings.length ? ` · ${this.t("показано ")}${items.length} ${this.t("из ")}${siblings.length}` : ""}</summary>${items.map(p => this.packageHtml(p)).join("")}</details>` : this.packageHtml(items[0], true);
      return `<article class="medicine"><div class="medicine-header ${expired ? "has-expired" : ""}"><div class="photo">${photo ? `<img data-image="${photo}" alt="${this.t("Фото ")}${escapeHtml(group.name)}">` : icon("bag")}</div><div class="medicine-heading"><h2>${escapeHtml(group.name)}</h2><p>${nearest ? `${multiple && !nearest.no_expiry ? this.t("Ближайший срок") : this.t("Годен ДО")}: ${this.date(nearest.expires_on)}` : this.t("Все упаковки закончились")}</p>${badges}</div><div class="medicine-info ${multiple ? "multiple" : ""}"><span class="eyebrow">${this.t("Доп. информация")}</span><p class="note">${note ? escapeHtml(note) : this.t("Не указана")}</p></div><div class="medicine-actions"><button class="icon quiet" data-action="edit-group" data-group="${id}" aria-label="${this.t("Изменить ")}${escapeHtml(group.name)}">${icon("edit")}</button><button class="icon quiet" data-action="add-pack" data-group="${id}" aria-label="${this.t("Добавить упаковку ")}${escapeHtml(group.name)}">${icon("plus")}</button></div></div>${contents}${multiple ? `<div class="group-footer"><span class="small muted">${this.t("Все упаковки: ")}${siblings.length}</span><div class="pack-footer"><button data-action="toggle-group-available" data-group="${id}">${available.length ? this.t("Отметить: закончились") : this.t("Отметить: есть")}</button><button class="quiet danger" data-action="delete-group" data-group="${id}">${this.t("Удалить")}</button></div></div>` : ""}</article>`;
    }).join("");
    void this.loadPhotos();
  }
  private packageBadges(item: Pack): string {
    const expiry = (item.status === "ok" || item.status === "no_expiry") ? "" : `<span class="badge ${item.status}">${this.t(labels[item.status])}</span>`;
    const availability = !item.available ? `<span class="badge finished">${this.t("Закончился")}</span>` : "";
    return expiry || availability ? `<div class="badges">${expiry}${availability}</div>` : "";
  }
  private groupBadges(items: Pack[]): string {
    const badges = ["expired", "due_7", "due_90"].map(status => {
      const count = items.filter(p => p.available && p.status === status).length;
      return count ? `<span class="badge ${status}">${this.t(labels[status])}: ${count}</span>` : "";
    });
    const finished = items.filter(p => !p.available).length;
    if (finished) badges.push(`<span class="badge finished">${this.t("Закончились: ")}${finished}</span>`);
    const content = badges.join("");
    return content ? `<div class="badges">${content}</div>` : "";
  }
  private packageHtml(item: Pack, single = false): string {
    const dateAdded = new Intl.DateTimeFormat(this.language, { dateStyle: "short", timeStyle: "short", timeZone: this.data!.timezone }).format(new Date(item.added_at));
    return `<section class="pack ${single ? "single-pack" : ""}">${single ? "" : `<div class="pack-head"><strong>${this.t("Упаковка №")}${item.number}</strong><button type="button" class="quiet icon" data-action="edit" data-id="${item.id}" aria-label="${this.t("Изменить упаковку №")}${item.number}">${icon("edit")}</button></div>${this.packageBadges(item)}${item.image_id ? `<div class="photo pack-photo"><img data-image="${item.image_id}" alt="${this.t("Фото упаковки №")}${item.number}"></div>` : ""}`}<div class="pack-meta">${!single || !item.available ? `<div><span>${this.t("Годен ДО")}</span>${this.date(item.expires_on)}</div>` : ""}<div><span>${this.t("Добавлено")}</span>${escapeHtml(dateAdded)}</div></div>${!single && item.info ? `<p class="note">${escapeHtml(item.info)}</p>` : ""}<div class="pack-footer"><button data-action="toggle-available" data-id="${item.id}">${item.available ? this.t("Отметить: закончился") : this.t("Отметить: есть")}</button><button class="quiet danger" data-action="delete-pack" data-id="${item.id}">${this.t("Удалить")}</button></div></section>`;
  }
  private editGroup(groupId: string) {
    const items = Object.values(this.data!.packages).filter(p => p.group_id === groupId).sort((a, b) => a.number - b.number);
    if (items.length === 1) { this.packageDialog(items[0].id); return; }
    this.showDialog(this.t("Выберите упаковку"), `<p class="explanation">${escapeHtml(this.data!.groups[groupId].name)}</p><div class="package-choices">${items.map(p => `<button type="button" class="package-choice" data-action="edit" data-id="${p.id}"><strong>${this.t("Упаковка №")}${p.number}</strong><span class="small">${this.t("Годен ДО: ")}${this.date(p.expires_on)}</span>${this.packageBadges(p)}${p.info ? `<span class="note">${escapeHtml(p.info)}</span>` : ""}</button>`).join("")}</div>`, "choose-package", "", "");
  }
  private date(value: string | null): string { return value === null ? this.t("Бессрочно") : value.split("-").reverse().join("."); }
  private async imageUrl(id: string): Promise<string> {
    if (this.imageUrls.has(id)) return this.imageUrls.get(id)!;
    if (this.imageRequests.has(id)) return this.imageRequests.get(id)!;
    const promise = (async () => {
      const response = await this.hass.fetchWithAuth(`/api/medicine_cabinet/images/${id}`);
      if (!response.ok) throw new Error(this.t("Не удалось загрузить фото"));
      const url = URL.createObjectURL(await response.blob());
      this.imageUrls.set(id, url); return url;
    })();
    this.imageRequests.set(id, promise);
    try { return await promise; } finally { this.imageRequests.delete(id); }
  }
  private async loadPhotos() {
    await Promise.all([...this.root.querySelectorAll<HTMLImageElement>("img[data-image]")].map(async img => {
      try { img.src = await this.imageUrl(img.dataset.image!); }
      catch { img.alt = this.t("Фото временно недоступно"); }
    }));
  }
  private onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.id === "query") { this.query = target.value; this.renderList(); }
    if (target.id === "group-search") this.renderGroupOptions(target.value);
  };
  private onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    if (target.id === "kit") { this.kitId = target.value; this.rememberSelectedKit(); this.openGroups.clear(); this.render(); }
    if (target.id === "status") { this.filter = target.value; this.renderList(); }
    if (target.id === "availability") { this.availability = target.value; this.renderList(); }
    if (target.id === "sort") { this.sort = target.value; this.renderList(); }
    if (target.name === "no_expiry") this.updateExpiryInput();
    if (target.closest("form")?.dataset.kind === "export") this.updateExportPreview();
  };
  private onPickerKeydown = (event: Event) => {
    const key = event as KeyboardEvent;
    const target = event.target as HTMLElement;
    const picker = target.closest<HTMLDetailsElement>(".group-picker");
    if (!picker) return;
    if (key.key === "Escape" && picker.open) {
      key.preventDefault(); key.stopPropagation();
      picker.open = false;
      picker.querySelector("summary")!.focus();
      return;
    }
    if (target.tagName === "SUMMARY" && (key.key === "ArrowDown" || key.key === "ArrowUp")) {
      key.preventDefault(); picker.open = true;
      picker.querySelector<HTMLInputElement>("#group-search")!.focus(); return;
    }
    const options = [...picker.querySelectorAll<HTMLButtonElement>(".group-results button")];
    if (target.id === "group-search" && ["Enter", "ArrowDown", "ArrowUp"].includes(key.key)) {
      key.preventDefault();
      const option = key.key === "ArrowUp" ? options.at(-1) : options[0];
      (option || picker.querySelector<HTMLButtonElement>(".group-new"))?.focus();
    } else if (target.classList.contains("group-option") && ["ArrowDown", "ArrowUp", "Home", "End"].includes(key.key)) {
      key.preventDefault();
      const index = options.indexOf(target as HTMLButtonElement);
      const next = key.key === "Home" ? 0 : key.key === "End" ? options.length - 1 : index + (key.key === "ArrowDown" ? 1 : -1);
      if (next < 0) picker.querySelector<HTMLInputElement>("#group-search")!.focus();
      else options[Math.min(next, options.length - 1)]?.focus();
    }
  };
  private renderGroupOptions(query = "") {
    const current = this.dialog.querySelector<HTMLInputElement>('[name="group_id"]')!.value;
    const groups = Object.values(this.data!.groups).filter(g => g.kit_id === this.kitId && g.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a, b) => a.name.localeCompare(b.name, this.language));
    this.dialog.querySelector(".group-new")!.setAttribute("aria-pressed", String(!current));
    const results = this.dialog.querySelector(".group-results")!;
    results.innerHTML = `${groups.map(g => `<button type="button" class="group-option" data-action="select-group" data-group="${g.id}" aria-pressed="${g.id === current}" title="${escapeHtml(g.name)}">${escapeHtml(g.name)}</button>`).join("")}${!groups.length && query.trim() ? `<p class="small muted" role="status">${this.t("Препараты не найдены")}</p>` : ""}`;
    results.scrollTop = 0;
  }
  private selectGroup(groupId: string) {
    const name = this.dialog.querySelector<HTMLInputElement>('[name="name"]')!;
    this.dialog.querySelector<HTMLInputElement>('[name="group_id"]')!.value = groupId;
    name.disabled = !!groupId; name.required = !groupId;
    name.value = groupId ? this.data!.groups[groupId].name : "";
    if (groupId) {
      const pack = Object.values(this.data!.packages).find(p => p.group_id === groupId);
      const info = this.dialog.querySelector<HTMLTextAreaElement>('[name="info"]')!;
      if (pack && !info.value) info.value = pack.info;
      const image = this.dialog.querySelector<HTMLInputElement>('[name="image_id"]')!;
      if (pack?.image_id && !image.value) { image.value = pack.image_id; this.dialog.querySelector(".photo-status")!.textContent = this.t("Используется фото другой упаковки"); }
    }
    const picker = this.dialog.querySelector<HTMLDetailsElement>(".group-picker")!;
    picker.querySelector(".group-value")!.textContent = groupId ? name.value : this.t("Новое лекарство");
    picker.open = false;
    this.dialog.querySelector<HTMLInputElement>("#group-search")!.value = "";
    this.renderGroupOptions();
    if (groupId) picker.querySelector("summary")!.focus(); else name.focus();
  }
  private onClick = (event: Event) => {
    const picker = this.dialog.querySelector<HTMLDetailsElement>(".group-picker");
    if (picker?.open && !picker.contains(event.target as Node)) picker.open = false;
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id!;
    if (action === "add") this.kitId ? this.packageDialog() : this.kitDialog();
    else if (action === "add-pack") this.packageDialog(undefined, button.dataset.group);
    else if (action === "edit") this.packageDialog(id);
    else if (action === "edit-group") this.editGroup(button.dataset.group!);
    else if (action === "select-group") this.selectGroup(button.dataset.group!);
    else if (action === "kit-add") this.kitDialog();
    else if (action === "kit-edit") this.kitDialog(this.kitId);
    else if (action === "kit-delete") this.confirmDialog("kit_delete", this.kitId, this.t("Удалить аптечку?"), this.t("Все препараты и упаковки этой аптечки будут удалены."));
    else if (action === "delete-pack") this.confirmDialog("package_delete", id, this.t("Удалить упаковку?"), `${this.t("Упаковка №")}${this.data!.packages[id].number} ${this.t("будет удалена из аптечки.")}`);
    else if (action === "toggle-available") void this.toggleAvailable(id);
    else if (action === "toggle-group-available") void this.toggleGroupAvailable(button.dataset.group!, button as HTMLButtonElement);
    else if (action === "delete-group") {
      const group = this.data!.groups[button.dataset.group!];
      const count = Object.values(this.data!.packages).filter(p => p.group_id === group.id).length;
      this.confirmDialog("group_delete", group.id, this.t("Удалить все упаковки?"), `${this.t("Вы действительно хотите удалить все упаковки лекарства «")}${group.name}»? ${this.t("Количество: ")}${count} ${this.t("шт.")}`);
    }
    else if (action === "settings") this.settingsDialog();
    else if (action === "export") this.exportDialog();
    else if (action === "close") this.dialog.close();
    else if (action === "clear-photo") { this.root.querySelector<HTMLInputElement>('[name="image_id"]')!.value = ""; this.root.querySelector<HTMLInputElement>('[name="photo"]')!.value = ""; this.root.querySelector(".photo-status")!.textContent = this.t("Без фотографии"); }
    else if (action === "reload-form") { this.dialog.close(); void this.refresh().then(() => { if (id && this.data?.packages[id]) this.packageDialog(id); else this.toast(this.t("Список обновлён. Повторите изменение.")); }); }
    else if (action === "reset-filters") {
      this.query = ""; this.filter = "all"; this.availability = "all"; this.sort = "name";
      this.root.querySelector<HTMLInputElement>("#query")!.value = "";
      this.root.querySelector<HTMLSelectElement>("#status")!.value = "all";
      this.root.querySelector<HTMLSelectElement>("#availability")!.value = "all";
      this.root.querySelector<HTMLSelectElement>("#sort")!.value = "name";
      this.renderList();
    }
  };
  private get dialog(): HTMLDialogElement { return this.root.querySelector<HTMLDialogElement>("#dialog")!; }
  private showDialog(title: string, content: string, kind: string, id = "", submit = this.t("Сохранить")) {
    if (this.dialog.open) this.dialog.close();
    this.dialog.innerHTML = `<form data-kind="${kind}" data-id="${escapeHtml(id)}" data-revision="${this.data?.revision ?? 0}"><div class="dialog-heading"><h2 id="dialog-title" ${(kind === "settings" || kind === "export" || kind.endsWith("_delete")) ? 'tabindex="-1" autofocus' : ""}>${escapeHtml(title)}</h2><button type="button" class="quiet icon" data-action="close" aria-label="${this.t("Закрыть")}">${icon("close")}</button></div>${content}<div class="notice form-error" role="alert"></div><div class="conflict-actions"></div>${submit ? `<div class="dialog-actions"><button type="button" data-action="close">${this.t("Отмена")}</button><button type="submit" class="primary">${submit}</button></div>` : ""}</form>`;
    this.dialog.setAttribute("aria-labelledby", "dialog-title");
    this.dialog.showModal();
    if ((kind === "settings" || kind === "export" || kind.endsWith("_delete"))) this.dialog.querySelector<HTMLHeadingElement>("h2")!.focus();
  }
  private kitDialog(id?: string) {
    this.showDialog(id ? this.t("Название аптечки") : this.t("Новая аптечка"), `<label class="field">${this.t("Название")}<input name="name" maxlength="100" required value="${escapeHtml(id ? this.data!.kits[id].name : "")}" placeholder="${this.t("Например, Дача")}" autofocus></label>`, "kit_save", id);
  }
  private packageDialog(id?: string, groupId?: string) {
    if (!this.data || !this.kitId) return;
    const item = id ? this.data.packages[id] : undefined;
    groupId = item?.group_id || groupId;
    const copy = !item && groupId ? Object.values(this.data.packages).find(p => p.group_id === groupId) : undefined;
    const image = item?.image_id || copy?.image_id || "";
    const info = item?.info ?? copy?.info ?? "";
    const fields = `<div class="form-grid"><div class="field full"><span id="group-label">${this.t("Препарат")}</span><input type="hidden" name="group_id" value="${escapeHtml(groupId || "")}"><details class="group-picker"><summary aria-describedby="group-label"><span class="group-value">${groupId ? escapeHtml(this.data.groups[groupId].name) : this.t("Новое лекарство")}</span></summary><div class="group-dropdown"><div class="group-search search">${icon("search")}<label><span class="sr">${this.t("Поиск препарата")}</span><input id="group-search" type="search" placeholder="${this.t("Поиск препарата")}" autocomplete="off"></label></div><button type="button" class="group-option group-new" data-action="select-group" data-group="">${this.t("Новое лекарство")}</button><div class="group-results" role="group" aria-label="${this.t("Сохранённые лекарства")}"></div></div></details></div><label class="field full">${this.t("Название")}<input name="name" maxlength="200" ${groupId ? "disabled" : "required"} value="${escapeHtml(groupId ? this.data.groups[groupId].name : "")}" placeholder="${this.t("Название, форма или дозировка")}"></label><label class="field full">${this.t("Доп. информация")}<textarea name="info" maxlength="5000" placeholder="${this.t("Дозировка, описание или ваши заметки")}">${escapeHtml(info)}</textarea></label><div class="field ${item ? "" : "full"}"><div class="expiry-heading"><label for="mc-expiry">${this.t("Годен ДО")}</label><label class="check"><input name="no_expiry" type="checkbox" ${item?.no_expiry ? "checked" : ""}>${this.t("Бессрочно")}</label></div><input id="mc-expiry" name="expires_on" type="date" required value="${escapeHtml(item?.expires_on || "")}"><input class="expiry-unlimited" type="text" value="${this.t("Бессрочно")}" aria-label="${this.t("Срок годности")}" disabled hidden><small class="expiry-hint"></small></div>${item ? `<label class="field">${this.t("Наличие")}<select name="available"><option value="true">${this.t("Есть")}</option><option value="false" ${!item.available ? "selected" : ""}>${this.t("Закончился")}</option></select></label>` : ""}<div class="field full"><label for="mc-photo">${this.t("Фотография · необязательно")}</label><input type="hidden" name="image_id" value="${escapeHtml(image)}"><div class="file-row"><input id="mc-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="quiet" data-action="clear-photo">${this.t("Убрать")}</button></div><small class="photo-status">${image ? this.t("Используется сохранённая фотография") : this.t("JPEG, PNG или WebP, до 10 МБ. HEIC сначала сохраните как JPEG.")}</small></div></div>${item ? `<p class="explanation">${this.t("Изменение срока, включая отметку «Бессрочно», означает замену упаковки: дата добавления обновится, наличие станет «Есть».")}</p>` : ""}`;
    this.showDialog(item ? `${this.t("Упаковка №")}${item.number}` : this.t("Добавить лекарство"), fields, "package_save", id);
    this.renderGroupOptions();
    this.updateExpiryInput();
  }
  private updateExpiryInput() {
    const noExpiry = this.dialog.querySelector<HTMLInputElement>('[name="no_expiry"]')!.checked;
    const date = this.dialog.querySelector<HTMLInputElement>('[name="expires_on"]')!;
    date.disabled = noExpiry; date.required = !noExpiry; date.hidden = noExpiry;
    this.dialog.querySelector<HTMLInputElement>(".expiry-unlimited")!.hidden = !noExpiry;
    this.dialog.querySelector(".expiry-hint")!.textContent = noExpiry
      ? this.t("Напоминания о сроке не отправляются.")
      : this.t("Просрочен с 00:00 указанной даты по времени HA.");
  }
  private confirmDialog(operation: string, id: string, title: string, text: string) {
    this.showDialog(title, `<p class="explanation">${escapeHtml(text)}</p>`, operation, id, this.t("Удалить"));
  }
  private settingsDialog() {
    this.showDialog(this.t("Аптечки и настройки"), `<div class="actions"><button type="button" data-action="kit-add">${icon("plus")}${this.t("Новая аптечка")}</button>${this.kitId ? `<button type="button" data-action="kit-edit">${this.t("Переименовать")}</button><button type="button" class="danger" data-action="kit-delete">${this.t("Удалить аптечку")}</button>` : ""}</div><p class="explanation">${this.t("Напоминания отправляются отдельно для каждой упаковки за 90 и за 7 дней. Данные и фотографии хранятся на вашем сервере.")}</p>${this.hass.user?.is_admin ? `<a class="settings-link" href="/config/integrations/integration/medicine_cabinet">${this.t("Язык, название и уведомления →")}</a>` : `<p class="explanation">${this.t("Время и получателей уведомлений настраивает администратор HA.")}</p>`}`, "settings", "", "");
  }
  private exportDialog() {
    this.showDialog(`${this.t("Скачать аптечку")} «${this.data!.kits[this.kitId].name}»`, `<p class="explanation">${this.t("Файл сохранится локально.")}</p><div class="form-grid"><label class="field full">${this.t("Формат")}<select name="format"><option value="pdf">PDF ${this.t("с фотографиями")}</option><option value="csv">CSV ${this.t("для таблиц")}</option></select></label><label class="field full">${this.t("Срок годности")}<select name="expiry"><option value="expired">${this.t("Просроченные")}</option><option value="within_90">${this.t("До 90 дней, включая просроченные")}</option><option value="over_90">${this.t("Более чем через 90 дней")}</option><option value="all" selected>${this.t("Все лекарства")}</option></select><small>${this.t("Бессрочные упаковки входят в «Все лекарства». Закончившиеся можно добавить при любом сроке.")}</small></label><div class="field full"><label class="check"><input type="checkbox" name="include_finished" checked>${this.t("Добавить закончившиеся")}</label><small>${this.t("По сроку выбираются упаковки в наличии. Галочка добавляет все закончившиеся независимо от срока.")}</small></div></div><div class="export-preview" role="status" aria-live="polite" aria-atomic="true"><strong class="export-count"></strong><p class="export-empty small muted" hidden>${this.t("По выбранным фильтрам лекарств нет.")}</p></div>`, "export", "", this.t("Скачать"));
    this.dialog.querySelector<HTMLFormElement>("form")!.dataset.kitId = this.kitId;
    this.updateExportPreview();
  }
  private exportFilters(form: HTMLFormElement) {
    const fields = new FormData(form);
    return { expiry: String(fields.get("expiry")), include_finished: fields.get("include_finished") === "on" };
  }
  private updateExportPreview() {
    const form = this.dialog.querySelector<HTMLFormElement>('form[data-kind="export"]');
    if (!this.data || !this.dialog.open || !form) return;
    const { expiry, include_finished } = this.exportFilters(form);
    const rows = Object.values(this.data.packages).filter(item => {
      if (this.data!.groups[item.group_id].kit_id !== form.dataset.kitId) return false;
      if (!item.available) return include_finished;
      const days = item.days_remaining;
      return expiry === "all" || (days !== null && (
        (expiry === "expired" && days <= 0) ||
        (expiry === "within_90" && days <= 90) ||
        (expiry === "over_90" && days > 90)
      ));
    });
    const medicines = new Set(rows.map(item => item.group_id)).size;
    const format = form.querySelector<HTMLSelectElement>('[name="format"]')!.value.toUpperCase();
    form.querySelector(".export-count")!.textContent = `${format} · ${this.t("Препаратов: ")}${medicines} · ${this.t("Упаковок: ")}${rows.length}`;
    form.querySelector<HTMLParagraphElement>(".export-empty")!.hidden = rows.length !== 0;
  }
  private async request(operation: string, payload: object, revision: number): Promise<void> {
    this.data = await this.hass.callWS<Snapshot>({ type: "medicine_cabinet/request", operation, payload, revision });
    this.resolveSelectedKit();
    this.render();
  }
  private async toggleAvailable(id: string) {
    const pack = this.data!.packages[id];
    try {
      await this.request("package_save", { id, kit_id: this.kitId, group_id: pack.group_id, info: pack.info, expires_on: pack.expires_on, no_expiry: pack.no_expiry, image_id: pack.image_id, available: !pack.available }, this.data!.revision);
      this.toast(pack.available ? this.t("Упаковка отмечена как закончившаяся") : this.t("Упаковка снова в наличии"));
    } catch (err) { this.showError(err); await this.refresh(); this.showError(err); }
  }
  private async toggleGroupAvailable(groupId: string, button: HTMLButtonElement) {
    const available = !Object.values(this.data!.packages).some(p => p.group_id === groupId && p.available);
    button.disabled = true;
    try {
      await this.request("group_set_available", { id: groupId, kit_id: this.kitId, available }, this.data!.revision);
      this.toast(available ? this.t("Все упаковки снова в наличии") : this.t("Все упаковки отмечены как закончившиеся"));
    } catch (err) { this.showError(err); await this.refresh(); this.showError(err); }
    finally { button.disabled = false; }
  }
  private onSubmit = (event: Event) => {
    event.preventDefault();
    void this.submit(event.target as HTMLFormElement);
  };
  private async submit(form: HTMLFormElement) {
    if (!form.reportValidity()) return;
    const buttons = [...form.querySelectorAll<HTMLButtonElement>("button")];
    buttons.forEach(b => { b.disabled = true; }); this.showError("", true);
    const fields = new FormData(form);
    const kind = form.dataset.kind!;
    try {
      if (kind === "export") {
        const format = String(fields.get("format"));
        const filters = this.exportFilters(form);
        const response = await this.hass.fetchWithAuth(`/api/medicine_cabinet/export/${format}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kit_id: form.dataset.kitId, ...filters }) });
        if (!response.ok) throw await response.json();
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a"); link.href = url; link.download = `medicine-cabinet-${this.data!.today}.${format}`;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        this.dialog.close(); this.toast(this.t("Файл подготовлен для скачивания")); return;
      }
      let payload: Record<string, unknown> = { id: form.dataset.id || undefined };
      if (kind === "kit_save") payload.name = fields.get("name");
      if (kind === "group_delete") payload.kit_id = this.kitId;
      if (kind === "package_save") {
        let imageId = String(fields.get("image_id") || "");
        const file = fields.get("photo") as File;
        if (file?.size) {
          if (file.size > 10 * 1024 * 1024) throw new Error(this.t("Фото должно быть не больше 10 МБ"));
          const response = await this.hass.fetchWithAuth("/api/medicine_cabinet/images", { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: file });
          const result = await response.json(); if (!response.ok) throw result;
          imageId = result.image_id;
          form.querySelector<HTMLInputElement>('[name="image_id"]')!.value = imageId;
          form.querySelector<HTMLInputElement>('[name="photo"]')!.value = "";
        }
        payload = { ...payload, kit_id: this.kitId, group_id: fields.get("group_id") || null, name: fields.get("name") || "", info: fields.get("info"), no_expiry: fields.get("no_expiry") === "on", expires_on: fields.get("no_expiry") === "on" ? null : fields.get("expires_on"), available: form.dataset.id ? fields.get("available") === "true" : true, image_id: imageId || null };
      }
      await this.request(kind, payload, Number(form.dataset.revision));
      this.dialog.close(); this.toast(kind.endsWith("delete") ? this.t("Удалено") : this.t("Сохранено"));
    } catch (err) {
      this.showError(err, true);
      if ((err as { code?: string }).code === "conflict") {
        form.querySelector(".conflict-actions")!.innerHTML = `<p class="explanation">${kind === "group_delete" ? this.t("Состав аптечки изменился. Обновите список, проверьте количество упаковок и повторите удаление.") : this.t("Ваш ввод пока сохранён в форме. Скопируйте нужные изменения перед перезагрузкой записи.")}</p><button type="button" data-action="reload-form" data-id="${escapeHtml(form.dataset.id || "")}">${this.t("Перезагрузить запись")}</button>`;
      }
    } finally { buttons.forEach(b => { b.disabled = false; }); }
  }
}

if (!customElements.get("medicine-cabinet-panel")) customElements.define("medicine-cabinet-panel", MedicineCabinetPanel);
