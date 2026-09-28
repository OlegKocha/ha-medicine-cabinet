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

test('custom categories are saved, reused after reload, and shared by packages', async ({ page }, testInfo) => {
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
  await expect(card.locator('.category-badge')).toHaveText(categoryName);
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
  await expect(page.locator('.medicine .category-badge')).toHaveCount(5);
  for (const label of await page.locator('.medicine .category-badge').all()) await expect(label).toBeVisible();
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
  await expect(page.getByText('Категорий пока нет. Добавьте свою категорию.', { exact: true })).toBeVisible();
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
