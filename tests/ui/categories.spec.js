import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript(value => { window.DEV_ACCESS = value; }, JSON.parse(fs.readFileSync('.ha-test/access.json', 'utf8')));
  await page.goto('/test-panel');
  await page.waitForFunction(() => window.testHass);
  const kit = await page.evaluate(async name => {
    let state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    // Each scenario owns its fixtures: clearing the shared catalog must not make
    // subsequent tests depend on execution order or repopulate it in production.
    for (const category of ['Раны и ожоги', 'Детская аптечка', 'Дорожная аптечка', 'Экстренные средства', 'Антисептики и дезинфекция', 'Аллергия']) {
      if (!Object.values(state.categories).some(c => c.name === category)) {
        state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'category_save', payload: { name: category, color: '#5786b8', icon: 'mdi:pill' }, revision: state.revision });
      }
    }
    const result = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'kit_save', payload: { name }, revision: state.revision });
    return Object.values(result.kits).find(k => k.name === name).id;
  }, `Категории ${testInfo.project.name} ${Date.now()}`);
  await expect(page.locator(`#kit option[value="${kit}"]`)).toHaveCount(1);
  await page.locator('#kit').selectOption(kit);
});

function categoryOption(page, name) {
  return page.locator('.category-option').filter({ has: page.getByText(name, { exact: true }) }).getByRole('checkbox');
}

async function addMedicine(page, name) {
  await page.getByRole('button', { name: 'Добавить', exact: true }).click();
  await page.getByRole('textbox', { name: 'Название', exact: true }).fill(name);
  await page.getByRole('checkbox', { name: 'Бессрочно', exact: true }).check();
  await page.locator('.category-picker > summary').click();
}

test('custom categories are saved, reused after reload, and copied to new packages', async ({ page }, testInfo) => {
  const categoryName = `Для питомца ${testInfo.project.name} ${Date.now()}`;
  await addMedicine(page, 'Пластырь');
  await page.locator('.category-create > summary').click();
  await page.getByRole('textbox', { name: 'Название категории', exact: true }).fill(categoryName);
  await page.locator('[name=category_color]').fill('#aa3399');
  await page.getByRole('textbox', { name: 'Значок Home Assistant', exact: true }).fill('mdi:cat');
  await page.getByRole('button', { name: 'Создать и выбрать', exact: true }).click();
  await expect(page.locator('.selected-categories')).toContainText(categoryName);
  await expect(page.locator('.category-count')).toHaveText('1 из 5');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveText(categoryName);
  await expect(page.locator('.medicine-heading ha-icon')).toHaveAttribute('icon', 'mdi:cat');
  await expect(page.locator('.medicine-heading .category-badge')).toHaveAttribute('style', '--category-color:#aa3399');
  await page.reload();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveText(categoryName);
  await addMedicine(page, 'Бинт');
  await page.getByRole('searchbox', { name: 'Поиск категории', exact: true }).fill(categoryName);
  await page.locator('.category-option').getByRole('checkbox').check();
  await expect(page.locator('.selected-categories')).toContainText(categoryName);
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Добавить упаковку Пластырь', exact: true }).click();
  await expect(page.locator('.selected-categories')).toContainText(categoryName);
  await page.getByRole('checkbox', { name: 'Бессрочно', exact: true }).check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  const card = page.locator('.medicine').filter({ has: page.getByRole('heading', { name: 'Пластырь', exact: true }) });
  await expect(card.locator('details')).not.toHaveAttribute('open');
  await expect(card.locator('.medicine-heading .category-badge')).toHaveText(categoryName);
  await expect(card.locator('summary')).toContainText('2 в наличии');
});

test('all five labels stay visible while extra categories are blocked and replaceable', async ({ page }, testInfo) => {
  await addMedicine(page, 'Пластырь');
  const names = ['Раны и ожоги', 'Детская аптечка', 'Дорожная аптечка', 'Экстренные средства', 'Антисептики и дезинфекция'];
  for (const name of names) await categoryOption(page, name).check();
  await expect(page.locator('.category-count')).toHaveText('5 из 5');
  await expect(categoryOption(page, 'Аллергия')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Создать и выбрать' })).toBeHidden();
  await page.locator('.category-create > summary').click();
  await expect(page.getByRole('button', { name: 'Создать и выбрать' })).toBeDisabled();
  await expect(page.locator('#category-limit')).toContainText('Снимите одну');
  await page.getByRole('button', { name: 'Снять категорию Антисептики и дезинфекция', exact: true }).click();
  await expect(categoryOption(page, 'Аллергия')).toBeEnabled();
  await categoryOption(page, 'Аллергия').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Добавить упаковку Пластырь', exact: true }).click();
  await expect(page.locator('.selected-categories .category-badge')).toHaveCount(5);
  await page.getByRole('checkbox', { name: 'Бессрочно', exact: true }).check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.locator('.medicine details')).not.toHaveAttribute('open');
  await expect(page.locator('.medicine-heading .category-badge')).toHaveCount(5);
  for (const label of await page.locator('.medicine-heading .category-badge').all()) await expect(label).toBeVisible();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const overflow = await page.locator('.medicine').evaluate(el => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
  await page.screenshot({ path: `tmp/ui-categories-${testInfo.project.name}.png`, fullPage: true });
});

test('choosing a saved medicine restores its categories and typing a duplicate category reuses it', async ({ page }) => {
  await addMedicine(page, 'Пластырь');
  await categoryOption(page, 'Раны и ожоги').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Добавить', exact: true }).click();
  await page.locator('.group-picker summary').click();
  await page.locator('.group-results').getByRole('button', { name: 'Пластырь', exact: true }).click();
  await expect(page.locator('.selected-categories')).toContainText('Раны и ожоги');
  await page.locator('.category-picker > summary').click();
  await page.locator('.category-create > summary').click();
  await page.getByRole('textbox', { name: 'Название категории', exact: true }).fill('  РАНЫ   И ОЖОГИ ');
  await page.getByRole('button', { name: 'Создать и выбрать', exact: true }).click();
  await expect(page.locator('.category-count')).toHaveText('1 из 5');
  await expect(page.locator('.selected-categories .category-badge')).toHaveCount(1);
  await expect(page.locator('.category-option').filter({ hasText: 'Раны и ожоги' })).toHaveCount(1);
});

async function openSettings(page) {
  await page.getByRole('button', { name: 'Настройки аптечек', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Аптечки и настройки', exact: true })).toBeVisible();
}

async function catalogRow(page, name) {
  return page.locator('.category-catalog-row').filter({ has: page.getByText(name, { exact: true }) });
}

test('settings create and edit reusable categories and deleting a used category keeps medicine', async ({ page }, testInfo) => {
  const name = `Настройки ${testInfo.project.name} ${Date.now()}`;
  const renamed = `${name} новое`;
  await openSettings(page);
  await page.getByRole('button', { name: 'Добавить категорию', exact: true }).click();
  await page.getByRole('textbox', { name: 'Название категории', exact: true }).fill(name);
  await page.locator('[name=category_color]').fill('#aa3399');
  await page.getByRole('textbox', { name: 'Значок Home Assistant', exact: true }).fill('mdi:cat');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(await catalogRow(page, name)).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await addMedicine(page, 'Бинт');
  await categoryOption(page, name).check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await openSettings(page);
  await page.locator('#category-catalog-search').fill(name);
  await page.getByRole('button', { name: `Изменить категорию ${name}`, exact: true }).click();
  await page.getByRole('textbox', { name: 'Название категории', exact: true }).fill(renamed);
  await page.locator('[name=category_color]').fill('#226688');
  await page.getByRole('textbox', { name: 'Значок Home Assistant', exact: true }).fill('mdi:dog');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(await catalogRow(page, renamed)).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveText(renamed);
  await expect(page.locator('.medicine-heading .category-badge')).toHaveAttribute('style', '--category-color:#226688');
  await expect(page.locator('.medicine-heading ha-icon')).toHaveAttribute('icon', 'mdi:dog');
  await page.reload();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveText(renamed);
  await openSettings(page);
  await page.getByRole('button', { name: `Удалить категорию ${renamed}`, exact: true }).click();
  await expect(page.locator('dialog .explanation')).toContainText('Сами лекарства сохранятся');
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  await expect(await catalogRow(page, renamed)).toBeVisible();
  await page.getByRole('button', { name: `Удалить категорию ${renamed}`, exact: true }).click();
  await page.locator('dialog').getByRole('button', { name: 'Удалить', exact: true }).click();
  await expect(await catalogRow(page, renamed)).toHaveCount(0);
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Бинт', exact: true })).toBeVisible();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveCount(0);
});

test('default categories can be edited and deleted through settings', async ({ page }, testInfo) => {
  await openSettings(page);
  await page.locator('#category-catalog-search').fill('Аллергия');
  await page.getByRole('button', { name: 'Изменить категорию Аллергия', exact: true }).click();
  await page.locator('[name=category_color]').fill('#112233');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect((await catalogRow(page, 'Аллергия')).locator('.category-badge')).toHaveAttribute('style', '--category-color:#112233');
  // Native browser search Enter must not submit a settings form.
  await page.locator('#category-catalog-search').fill('Аллергия');
  await page.locator('#category-catalog-search').press('Enter');
  await expect(page.getByRole('heading', { name: 'Аптечки и настройки', exact: true })).toBeVisible();
  await expect(page.locator('.form-error')).toBeEmpty();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator('dialog').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize(testInfo.project.use.viewport);
  await page.screenshot({ path: `tmp/category-settings-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Удалить категорию Аллергия', exact: true }).click();
  const focus = await page.locator('dialog').evaluate(el => el.getRootNode().activeElement.id);
  expect(focus).toBe('dialog-title');
  await page.locator('dialog').getByRole('button', { name: 'Удалить', exact: true }).click();
  await expect(await catalogRow(page, 'Аллергия')).toHaveCount(0);
  await page.reload();
  await openSettings(page);
  await expect(await catalogRow(page, 'Аллергия')).toHaveCount(0);
});

test('clearing categories keeps medicines and stays empty after reopening and reload', async ({ page }, testInfo) => {
  await addMedicine(page, 'Бинт');
  await categoryOption(page, 'Раны и ожоги').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await openSettings(page);
  await page.getByRole('button', { name: 'Удалить все категории', exact: true }).click();
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  await expect(page.locator('.category-catalog-row').first()).toBeVisible();
  await page.getByRole('button', { name: 'Удалить все категории', exact: true }).click();
  await page.locator('dialog').getByRole('button', { name: 'Удалить', exact: true }).click();
  await expect(page.locator('.category-catalog-count')).toHaveText('Всего категорий: 0');
  await expect(page.locator('dialog').getByText('Категорий пока нет. Добавьте свою категорию.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Бинт', exact: true })).toBeVisible();
  await expect(page.locator('.medicine-heading .category-badge')).toHaveCount(0);
  await page.reload();
  await openSettings(page);
  await expect(page.locator('.category-catalog-count')).toHaveText('Всего категорий: 0');
  const name = `После очистки ${testInfo.project.name}`;
  await page.getByRole('button', { name: 'Добавить категорию', exact: true }).click();
  await page.getByRole('textbox', { name: 'Название категории', exact: true }).fill(name);
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('.category-catalog-count')).toHaveText('Всего категорий: 1');
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await addMedicine(page, 'Пластырь');
  await expect(page.locator('.category-option')).toHaveCount(1);
  await categoryOption(page, name).check();
});

test('stale clear confirmation cannot delete categories added by another client', async ({ page }) => {
  await openSettings(page);
  await page.getByRole('button', { name: 'Удалить все категории', exact: true }).click();
  const name = `Другой клиент ${Date.now()}`;
  await page.evaluate(async name => {
    const state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'category_save', payload: { name, color: '#123456', icon: 'mdi:cat' }, revision: state.revision });
  }, name);
  await page.locator('dialog').getByRole('button', { name: 'Удалить', exact: true }).click();
  await expect(page.locator('.form-error')).toContainText('Данные изменились');
  await page.getByRole('button', { name: 'Обновить список категорий', exact: true }).click();
  await expect(await catalogRow(page, name)).toBeVisible();
});

async function createTwoCategoryPackages(page) {
  await addMedicine(page, 'Пенталгин');
  await page.getByRole('checkbox', { name: 'Бессрочно', exact: true }).uncheck();
  await page.locator('[name=expires_on]').fill('2030-02-03');
  await categoryOption(page, 'Детская аптечка').check();
  await categoryOption(page, 'Дорожная аптечка').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Добавить упаковку Пенталгин', exact: true }).click();
  await page.locator('[name=expires_on]').fill('2031-02-02');
  await page.locator('.category-picker > summary').click();
  await categoryOption(page, 'Дорожная аптечка').uncheck();
  await categoryOption(page, 'Экстренные средства').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
}

async function expectCategories(locator, names) {
  await expect.poll(async () => (await locator.locator('.category-badge > span').allTextContents()).sort()).toEqual([...names].sort());
}

test('each package has its own categories and the collapsed header shows their unique union', async ({ page }, testInfo) => {
  await createTwoCategoryPackages(page);
  const header = page.locator('.medicine-heading');
  const first = page.locator('.pack').nth(0);
  const second = page.locator('.pack').nth(1);
  await expectCategories(header, ['Детская аптечка', 'Дорожная аптечка', 'Экстренные средства']);
  await expect(page.locator('.medicine details')).not.toHaveAttribute('open');
  await page.locator('.medicine summary').click();
  await expectCategories(first, ['Детская аптечка', 'Дорожная аптечка']);
  await expectCategories(second, ['Детская аптечка', 'Экстренные средства']);
  await expect(first.locator('.pack-meta')).toContainText('03.02.2030');
  await expect(second.locator('.pack-meta')).toContainText('02.02.2031');
  const label = 'Детская аптечка';
  const headerBadge = header.locator('.category-badge').filter({ hasText: label });
  const packBadge = first.locator('.category-badge').filter({ hasText: label });
  expect(await packBadge.getAttribute('style')).toBe(await headerBadge.getAttribute('style'));
  expect(await packBadge.locator('ha-icon').getAttribute('icon')).toBe(await headerBadge.locator('ha-icon').getAttribute('icon'));
  await page.screenshot({ path: `tmp/ui-package-categories-${testInfo.project.name}.png`, fullPage: true });
  // Reselecting the same medicine in a package form keeps that package's labels.
  await page.getByRole('button', { name: 'Изменить упаковку №2', exact: true }).click();
  await page.locator('.group-picker > summary').click();
  await page.locator('.group-results').getByRole('button', { name: 'Пенталгин', exact: true }).click();
  await expectCategories(page.locator('.selected-categories'), ['Детская аптечка', 'Экстренные средства']);
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  // Editing one package does not overwrite its sibling; removing the last use
  // also removes that category from the header.
  await page.getByRole('button', { name: 'Изменить упаковку №1', exact: true }).click();
  await expectCategories(page.locator('.selected-categories'), ['Детская аптечка', 'Дорожная аптечка']);
  await page.getByRole('button', { name: 'Снять категорию Дорожная аптечка', exact: true }).click();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expectCategories(header, ['Детская аптечка', 'Экстренные средства']);
  await expectCategories(second, ['Детская аптечка', 'Экстренные средства']);
  await page.reload();
  await expectCategories(header, ['Детская аптечка', 'Экстренные средства']);
  await page.locator('.medicine summary').click();
  await expectCategories(first, ['Детская аптечка']);
  await expectCategories(second, ['Детская аптечка', 'Экстренные средства']);
  await expect(first.locator('.pack-meta')).toContainText('03.02.2030');
  await expect(second.locator('.pack-meta')).toContainText('02.02.2031');
  // Main-list filters must not drop hidden packages' labels from the header.
  await second.getByRole('button', { name: 'Отметить: закончился', exact: true }).click();
  await page.locator('#availability').selectOption('present');
  await expect(page.locator('.pack')).toHaveCount(1);
  await expectCategories(header, ['Детская аптечка', 'Экстренные средства']);
});

test('bulk editing preserves different categories until explicitly replacing them for all packages', async ({ page }) => {
  await createTwoCategoryPackages(page);
  await page.getByRole('button', { name: 'Изменить Пенталгин', exact: true }).click();
  const toggle = page.getByRole('checkbox', { name: 'Заменить категории у всех упаковок', exact: true });
  await expect(toggle).not.toBeChecked();
  await expect(page.locator('.category-assignment')).toBeHidden();
  await page.getByRole('textbox', { name: 'Доп. информация', exact: true }).fill('Общее описание');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.locator('.medicine summary').click();
  await expectCategories(page.locator('.pack').nth(0), ['Детская аптечка', 'Дорожная аптечка']);
  await expectCategories(page.locator('.pack').nth(1), ['Детская аптечка', 'Экстренные средства']);
  await page.getByRole('button', { name: 'Изменить Пенталгин', exact: true }).click();
  await toggle.check();
  await expectCategories(page.locator('.selected-categories'), ['Детская аптечка']);
  await page.locator('.category-picker > summary').click();
  await categoryOption(page, 'Дорожная аптечка').check();
  await toggle.uncheck(); // Turning replacement off must cancel it.
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expectCategories(page.locator('.medicine-heading'), ['Детская аптечка', 'Дорожная аптечка', 'Экстренные средства']);
  await page.getByRole('button', { name: 'Изменить Пенталгин', exact: true }).click();
  await toggle.check();
  await page.getByRole('button', { name: 'Снять категорию Детская аптечка', exact: true }).click();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expectCategories(page.locator('.medicine-heading'), []);
  for (const pack of await page.locator('.pack').all()) {
    await expectCategories(pack, []);
    await expect(pack).toContainText('Без категории');
  }
  await page.reload();
  await expectCategories(page.locator('.medicine-heading'), []);
});

test('header can show more than five categories while each package and its prefill stay within five', async ({ page }) => {
  await addMedicine(page, 'Пластырь');
  const names = ['Раны и ожоги', 'Детская аптечка', 'Дорожная аптечка', 'Экстренные средства', 'Антисептики и дезинфекция'];
  for (const name of names) await categoryOption(page, name).check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Добавить упаковку Пластырь', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Бессрочно', exact: true }).check();
  await page.getByRole('button', { name: 'Снять категорию Раны и ожоги', exact: true }).click();
  await page.locator('.category-picker > summary').click();
  await categoryOption(page, 'Аллергия').check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expectCategories(page.locator('.medicine-heading'), [...names, 'Аллергия']);
  await page.locator('.medicine summary').click();
  await expect(page.locator('.pack').nth(0).locator('.category-badge')).toHaveCount(5);
  await expect(page.locator('.pack').nth(1).locator('.category-badge')).toHaveCount(5);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator('.medicine').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.getByRole('button', { name: 'Добавить упаковку Пластырь', exact: true }).click();
  await expect(page.locator('.category-count')).toHaveText('5 из 5');
  await expectCategories(page.locator('.selected-categories'), names);
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  await page.getByRole('button', { name: 'Изменить Пластырь', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Заменить категории у всех упаковок', exact: true }).check();
  await expect(page.locator('.category-count')).toHaveText('4 из 5');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expectCategories(page.locator('.medicine-heading'), names.slice(1));
  for (const pack of await page.locator('.pack').all()) await expectCategories(pack, names.slice(1));
});

async function categoryFilterInventory(page) {
  const kitId = await page.locator('#kit').inputValue();
  await page.evaluate(async kit => {
    let state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    const ids = names => names.map(name => Object.values(state.categories).find(c => c.name === name).id);
    for (const pack of [
      { name: 'Пенталгин', info: 'Поездка', expires_on: '2030-01-01', category_ids: ids(['Детская аптечка', 'Дорожная аптечка']) },
      { name: 'Пенталгин', no_expiry: true, category_ids: ids(['Детская аптечка', 'Экстренные средства']) },
      { name: 'Бинт', expires_on: '2000-01-01', available: false, category_ids: ids(['Экстренные средства']) },
      { name: 'Пластырь', no_expiry: true, category_ids: [] },
    ]) {
      state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'package_save', payload: { kit_id: kit, ...pack }, revision: state.revision });
    }
  }, kitId);
  await expect(page.locator('#summary')).toContainText('В выборке: 4');
}

function filterOption(page, name) {
  return page.locator('.category-filter-option').filter({ has: page.getByText(name, { exact: true }) }).getByRole('checkbox');
}

async function openCategoryFilter(page) {
  const picker = page.locator('.category-filter');
  if (await picker.getAttribute('open') === null) await picker.locator('summary').click();
  return picker;
}

test('category filter searches and unions matching packages, combining with other filters and reset', async ({ page }) => {
  await categoryFilterInventory(page);
  const picker = await openCategoryFilter(page);
  const search = page.getByRole('searchbox', { name: 'Поиск в фильтре категорий', exact: true });
  await expect(picker.getByRole('checkbox', { name: 'Все', exact: true })).toBeChecked();
  await search.fill('ДОРОЖНАЯ');
  await expect(picker.locator('.category-filter-option')).toHaveCount(1);
  await filterOption(page, 'Дорожная аптечка').check();
  await expect(picker).toHaveAttribute('open');
  await expect(picker.locator('.category-filter-value')).toHaveText('Дорожная аптечка');
  await expect(page.locator('#summary')).toContainText('В выборке: 1');
  await picker.locator('summary').press('Escape');
  await page.locator('.medicine summary').click();
  await expect(page.locator('.medicine summary')).toContainText('показано 1 из 2');
  await expectCategories(page.locator('.pack'), ['Детская аптечка', 'Дорожная аптечка']);
  await expectCategories(page.locator('.medicine-heading'), ['Детская аптечка', 'Дорожная аптечка', 'Экстренные средства']);
  await openCategoryFilter(page);
  await search.fill('экстр');
  await filterOption(page, 'Экстренные средства').check();
  await expect(page.locator('#summary')).toContainText('В выборке: 3');
  await expect(picker.locator('.category-filter-value')).toHaveText('Категории: 2');
  await search.fill('неизвестная категория');
  await expect(picker).toContainText('Категории не найдены.');
  await expect(page.locator('#summary')).toContainText('В выборке: 3');
  await search.fill('');
  await expect(filterOption(page, 'Дорожная аптечка')).toBeChecked();
  await expect(filterOption(page, 'Экстренные средства')).toBeChecked();
  await filterOption(page, 'Детская аптечка').check();
  await expect(page.locator('#summary')).toContainText('В выборке: 3'); // No duplicate packages.
  await picker.locator('summary').press('Escape');
  await page.locator('#availability').selectOption('present');
  await expect(page.locator('#summary')).toContainText('В выборке: 2');
  await page.locator('#status').selectOption('no_expiry');
  await expect(page.locator('#summary')).toContainText('В выборке: 1');
  await page.locator('#sort').selectOption('expiry');
  await page.locator('#query').fill('Бинт');
  await expect(page.getByRole('heading', { name: 'Ничего не найдено', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить все фильтры', exact: true }).click();
  await expect(page.locator('#summary')).toContainText('В выборке: 4');
  await expect(page.locator('#status')).toHaveValue('all');
  await expect(page.locator('#availability')).toHaveValue('all');
  await expect(page.locator('#sort')).toHaveValue('name');
  await expect(page.locator('#query')).toHaveValue('');
  await expect(picker.locator('.category-filter-value')).toHaveText('Все категории');
  await openCategoryFilter(page);
  await expect(search).toHaveValue('');
  await expect(picker.locator('[name=filter_category]:checked')).toHaveCount(0);
});

test('category filter supports every category without a five-label cap and All includes uncategorized packages', async ({ page }) => {
  await categoryFilterInventory(page);
  const picker = await openCategoryFilter(page);
  const choices = picker.locator('[name=filter_category]');
  const names = await picker.locator('.category-badge > span').allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'ru')));
  expect(names.length).toBeGreaterThan(5);
  for (let i = 0; i < names.length; i++) await choices.nth(i).check();
  await expect(picker.locator('[name=filter_category]:checked')).toHaveCount(names.length);
  await expect(page.locator('#summary')).toContainText('В выборке: 4');
  await expect(picker.locator('.category-filter-value')).toHaveText('Все категории');
  await filterOption(page, 'Детская аптечка').uncheck();
  await expect(page.locator('#summary')).toContainText('В выборке: 3');
  await expect(picker.getByRole('checkbox', { name: 'Все', exact: true })).not.toBeChecked();
  await picker.getByRole('checkbox', { name: 'Все', exact: true }).check();
  await expect(page.locator('#summary')).toContainText('В выборке: 4');
  await expect(picker.locator('[name=filter_category]:checked')).toHaveCount(0);
  await filterOption(page, 'Дорожная аптечка').check();
  await expect(page.locator('#summary')).toContainText('В выборке: 1');
  await filterOption(page, 'Дорожная аптечка').uncheck();
  await expect(page.locator('#summary')).toContainText('В выборке: 4');
  await expect(picker.locator('.category-filter-value')).toHaveText('Все категории');
});

test('category filter follows category renames and deletions without losing other filters', async ({ page }) => {
  await categoryFilterInventory(page);
  const picker = await openCategoryFilter(page);
  await filterOption(page, 'Дорожная аптечка').check();
  await page.evaluate(async () => {
    const state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    const category = Object.values(state.categories).find(c => c.name === 'Дорожная аптечка');
    await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'category_save', payload: { id: category.id, name: 'Для поездок', color: '#123456', icon: 'mdi:car' }, revision: state.revision });
  });
  await expect(picker.locator('.category-filter-value')).toHaveText('Для поездок');
  await expect(filterOption(page, 'Для поездок')).toBeChecked();
  await expect(page.locator('#summary')).toContainText('В выборке: 1');
  await page.locator('#query').fill('Пенталгин');
  await page.evaluate(async () => {
    const state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    const category = Object.values(state.categories).find(c => c.name === 'Для поездок');
    await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'category_delete', payload: { id: category.id }, revision: state.revision });
  });
  await expect(picker.locator('.category-filter-value')).toHaveText('Все категории');
  await expect(page.locator('#query')).toHaveValue('Пенталгин');
  await expect(page.locator('#summary')).toContainText('В выборке: 2');
  await page.evaluate(async () => {
    const state = await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'list' });
    await window.testHass.callWS({ type: 'medicine_cabinet/request', operation: 'categories_clear', payload: {}, revision: state.revision });
  });
  await openCategoryFilter(page);
  await expect(picker).toContainText('Категорий пока нет.');
  await expect(picker.getByRole('checkbox', { name: 'Все', exact: true })).toBeChecked();
  await expect(page.locator('#summary')).toContainText('В выборке: 2');
});

test('category filter works with keyboard, outside clicks and narrow screens', async ({ page }, testInfo) => {
  await categoryFilterInventory(page);
  const picker = page.locator('.category-filter');
  await picker.locator('summary').focus();
  await picker.locator('summary').press('ArrowDown');
  const search = page.getByRole('searchbox', { name: 'Поиск в фильтре категорий', exact: true });
  await expect(search).toBeFocused();
  await search.fill('Дорожная');
  await search.press('ArrowDown');
  await expect(filterOption(page, 'Дорожная аптечка')).toBeFocused();
  await filterOption(page, 'Дорожная аптечка').press('Space');
  await expect(filterOption(page, 'Дорожная аптечка')).toBeChecked();
  await expect(filterOption(page, 'Дорожная аптечка')).toBeFocused();
  await filterOption(page, 'Дорожная аптечка').press('Escape');
  await expect(picker).not.toHaveAttribute('open');
  await expect(picker.locator('summary')).toBeFocused();
  await openCategoryFilter(page);
  await search.fill('');
  for (const width of [320, 390, 701, 900, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const box = await picker.locator('.category-filter-dropdown').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await page.locator('.filters').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  const options = picker.locator('.category-filter-options');
  expect(await options.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await options.locator('input').last().scrollIntoViewIfNeeded();
  await options.locator('input').last().check();
  expect(await options.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await page.setViewportSize(testInfo.project.use.viewport);
  await page.screenshot({ path: `tmp/ui-category-filter-${testInfo.project.name}.png`, fullPage: true });
  await page.locator('header strong').click();
  await expect(picker).not.toHaveAttribute('open');
  await openCategoryFilter(page);
  await options.locator('input').last().focus();
  await options.locator('input').last().press('Tab');
  await expect(picker).not.toHaveAttribute('open');
  await expect(page.locator('#sort')).toBeFocused();
});
