import {test,expect} from '@playwright/test';
import fs from 'node:fs';

test.beforeEach(async({page})=>{
 const access=JSON.parse(fs.readFileSync('.ha-test/access.json','utf8'));
 await page.addInitScript(value=>{window.DEV_ACCESS=value;},access);
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='127.0.0.1'||url.protocol==='blob:')return route.continue();
  throw new Error(`Unexpected external request: ${url}`);
 });
 await page.goto('/test-panel');
 await expect(page.locator('#kit')).toBeVisible();
 await page.waitForFunction(()=>window.testHass);
 await expect(page.locator('header button')).toHaveCount(0);
});

test('real inventory: cabinet, photo-free item, duplicate spoiler, edit, search and PDF',async({page},testInfo)=>{
 const kit=`Дача ${testInfo.project.name} ${Date.now()}`;
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 await page.getByRole('button',{name:'Новая аптечка',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill(kit);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await page.locator('#kit').selectOption({label:kit});
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Тестовый препарат');
 await page.getByRole('textbox',{name:'Доп. информация',exact:true}).fill('Дозировка 1\nОсобая заметка <img src=x onerror=alert(1)>');
 await page.locator('input[name=expires_on]').fill('2020-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.getByRole('heading',{name:'Тестовый препарат',exact:true})).toBeVisible();
 await expect(page.locator('.medicine details')).toHaveCount(0);
 const medicine=page.locator('.medicine').filter({has:page.getByRole('heading',{name:'Тестовый препарат',exact:true})});
 await expect(medicine.locator('.medicine-header')).toContainText('Просрочено');
 await expect(medicine.locator('.medicine-header')).toContainText('Особая заметка');
 await expect(medicine.locator('.medicine-header')).toContainText('Годен ДО: 01.01.2020');
 // A different medicine between additions must not consume this group's numbers.
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Другой препарат');
 await page.locator('input[name=expires_on]').fill('2032-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.locator('.medicine')).toHaveCount(2);
 await page.getByRole('button',{name:'Добавить упаковку Тестовый препарат',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Доп. информация',exact:true})).toContainText('Особая заметка');
 await page.locator('input[name=expires_on]').fill('2030-12-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('summary')).toContainText('2 в наличии');
 await expect(medicine.locator('details')).not.toHaveAttribute('open','');
 await medicine.locator('summary').click();
 await expect(medicine.locator('.pack')).toHaveCount(2);
 await expect(medicine.locator('.pack-head')).toHaveText(['Упаковка №1','Упаковка №2']);
 await expect(medicine.locator('.pack [data-action=edit]')).toHaveCount(2);
 await expect(page.locator('#list')).not.toContainText('Срок не истёк');
 await medicine.locator('summary').click();
 await medicine.getByRole('button',{name:'Изменить Тестовый препарат',exact:true}).click();
 await page.locator('dialog').getByRole('button',{name:/Упаковка №2/}).click();
 await expect(page.locator('input[name=expires_on]')).toHaveValue('2030-12-01');
 await page.locator('textarea[name=info]').fill('Другая заметка второй упаковки');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('.medicine-header')).toContainText('№2: Другая заметка');
 await medicine.locator('summary').click();
 await expect(medicine.locator('.pack').first()).toContainText('Особая заметка');
 await expect(medicine.locator('.note').first()).toContainText('<img src=x onerror=alert(1)>');
 await expect(page.locator('.note img')).toHaveCount(0);
 await medicine.getByRole('button',{name:'Изменить Тестовый препарат',exact:true}).click();
 await page.locator('dialog').getByRole('button',{name:/Упаковка №1/}).click();
 await page.locator('input[name=expires_on]').fill('2031-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('.medicine-header')).not.toContainText('Просрочено');
 await expect(medicine.locator('.badges')).toHaveCount(0);
 // The per-package pencil edits exactly that package, independently of the header picker.
 await medicine.getByRole('button',{name:'Изменить упаковку №2',exact:true}).click();
 await expect(page.locator('input[name=expires_on]')).toHaveValue('2030-12-01');
 const dueDate=await page.evaluate(async()=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  return new Date(Date.parse(state.today)+60*86400000).toISOString().slice(0,10);
 });
 await page.locator('input[name=expires_on]').fill(dueDate);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('.medicine-header')).toContainText('Истекает в течение 90 дней: 1');
 await expect(medicine.locator('.pack').first()).toContainText('01.01.2031');
 await expect(medicine.locator('.pack').nth(1)).toContainText('Истекает в течение 90 дней');
 await expect(medicine).not.toContainText('Срок не истёк');
 await page.screenshot({path:`tmp/ui-packages-${testInfo.project.name}.png`,fullPage:true});
 await page.locator('#query').fill('Особая заметка');
 await expect(page.locator('.medicine')).toHaveCount(1);
 await page.locator('#query').fill('не существует');
 await expect(page.getByRole('heading',{name:'Ничего не найдено'})).toBeVisible();
 await page.getByRole('button',{name:'Сбросить фильтры'}).click();
 await page.getByRole('button',{name:'Экспорт',exact:true}).click();
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать',exact:true}).click();
 const download=await downloadPromise;
 await download.saveAs(`tmp/qa-${testInfo.project.name}.pdf`);
 expect(fs.readFileSync(`tmp/qa-${testInfo.project.name}.pdf`).subarray(0,4).toString()).toBe('%PDF');
 await expect(page.locator('dialog')).not.toBeVisible();
 await medicine.locator('summary').click();
 await expect(page.locator('.medicine details[open]')).toHaveCount(0);
 await page.screenshot({path:`tmp/ui-${testInfo.project.name}.png`,fullPage:true});
 await page.evaluate(()=>document.body.classList.add('dark'));
 await page.screenshot({path:`tmp/ui-${testInfo.project.name}-dark.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test('stale form cannot overwrite changes from another device',async({page})=>{
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 await page.getByRole('button',{name:'Новая аптечка',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Черновик');
 await page.evaluate(async()=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'kit_save',payload:{name:'Другое устройство'},revision:state.revision});
 });
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('.form-error')).toContainText('другом устройстве');
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toHaveValue('Черновик');
 await expect(page.locator('dialog')).toBeVisible();
});

test('upload a photograph, preserve it after reconnect, and export CSV',async({page},testInfo)=>{
 const kit=`Фото ${testInfo.project.name} ${Date.now()}`;
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 await page.getByRole('button',{name:'Новая аптечка',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill(kit);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await page.locator('#kit').selectOption({label:kit});
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Упаковка с фото');
 await page.locator('input[name=expires_on]').fill('2030-01-01');
 await page.locator('input[type=file]').setInputFiles('tests/fixtures/photo.png');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 const photo=page.locator('.medicine-header img');
 await expect(photo).toBeVisible();
 await expect.poll(()=>photo.evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
 await page.reload();
 await page.locator('#kit').selectOption({label:kit});
 await expect.poll(()=>page.locator('.medicine-header img').evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Экспорт',exact:true}).click();
 await page.locator('select[name=format]').selectOption('csv');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать',exact:true}).click();
 const download=await downloadPromise;
 await download.saveAs(`tmp/qa-${testInfo.project.name}.csv`);
 const csv=fs.readFileSync(`tmp/qa-${testInfo.project.name}.csv`,'utf8');
 expect(csv).toContain('Упаковка с фото');
 expect(csv).not.toContain('Идентификатор');
 expect(csv).toContain('Годен ДО');
 expect(csv).toContain('01.01.2030');
 expect(csv).toMatch(/;\d{2}\.\d{2}\.\d{4}\r\n$/);
 // A single package is editable directly from its header.
 await page.getByRole('button',{name:'Изменить Упаковка с фото',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Упаковка №1',exact:true})).toBeVisible();
 await expect(page.locator('input[name=expires_on]')).toHaveValue('2030-01-01');
});


test('compact medicine picker: alphabet, three rows, scrolling, search and keyboard',async({page},testInfo)=>{
 const kit=`Поиск ${testInfo.project.name} ${Date.now()}`;
 await page.evaluate(async name=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>{
   state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  };
  await change('kit_save',{name});
  const kit_id=Object.values(state.kits).find(k=>k.name===name).id;
  for(let i=36;i>=1;i--) await change('package_save',{kit_id,name:`Лекарство ${String(i).padStart(2,'0')}`,info:`Описание ${i}`,expires_on:'2030-01-01'});
 },kit);
 await expect(page.locator('#kit option').filter({hasText:kit})).toHaveCount(1);
 await page.locator('#kit').selectOption({label:kit});
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.locator('.group-picker summary').click();
 const results=page.locator('.group-results');
 const search=page.getByRole('searchbox',{name:'Поиск препарата'});
 await expect(results.getByRole('button')).toHaveCount(36);
 expect((await results.getByRole('button').allTextContents()).slice(0,3)).toEqual(['Лекарство 01','Лекарство 02','Лекарство 03']);
 const visibleRows=await results.evaluate(list=>{
  const bounds=list.getBoundingClientRect();
  return {visible:[...list.querySelectorAll('button')].filter(button=>{
   const row=button.getBoundingClientRect();
   return row.top>=bounds.top && row.bottom<=bounds.bottom;
  }).map(button=>button.textContent),height:list.clientHeight,rowHeight:list.firstElementChild.getBoundingClientRect().height,scrolls:list.scrollHeight>list.clientHeight};
 });
 expect(visibleRows.visible).toEqual(['Лекарство 01','Лекарство 02','Лекарство 03']);
 expect(visibleRows.height).toBeLessThanOrEqual(3*visibleRows.rowHeight);
 expect(visibleRows.scrolls).toBe(true);
 await page.screenshot({path:`tmp/ui-dropdown-${testInfo.project.name}.png`,fullPage:true});
 await results.evaluate(list=>{list.scrollTop=list.scrollHeight;});
 await results.getByRole('button',{name:'Лекарство 36',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toHaveValue('Лекарство 36');
 await page.locator('.group-picker summary').click();
 await search.press('Escape');
 await expect(page.locator('dialog')).toBeVisible();
 await expect(search).not.toBeVisible();
 await expect(page.locator('.group-picker summary')).toBeFocused();
 await page.locator('.group-picker summary').press('ArrowDown');
 await search.press('ArrowDown');
 await expect(results.getByRole('button',{name:'Лекарство 01',exact:true})).toBeFocused();
 await page.keyboard.press('End');
 await expect(results.getByRole('button',{name:'Лекарство 36',exact:true})).toBeFocused();
 await page.keyboard.press('Home');
 await page.keyboard.press('ArrowUp');
 await expect(search).toBeFocused();
 // Return to a new medicine so the next selection can copy its own description.
 await page.getByRole('button',{name:'Новое лекарство',exact:true}).click();
 await page.locator('textarea[name=info]').fill('');
 await page.locator('.group-picker summary').click();
 await search.fill('лЕКАрство 24');
 await expect(results.getByRole('button')).toHaveCount(1);
 await page.screenshot({path:`tmp/ui-search-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('searchbox',{name:'Поиск препарата'}).press('ArrowDown');
 await expect(page.locator('.group-results').getByRole('button',{name:'Лекарство 24',exact:true})).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toHaveValue('Лекарство 24');
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toBeDisabled();
 await expect(page.locator('textarea[name=info]')).toHaveValue('Описание 24');
 await page.locator('input[name=expires_on]').fill('2031-01-01');
 await page.screenshot({path:`tmp/ui-picker-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await page.locator('#query').fill('Лекарство 24');
 await expect(page.locator('.medicine')).toHaveCount(1);
 await page.locator('.medicine summary').click();
 await expect(page.locator('.pack-head')).toHaveText(['Упаковка №1','Упаковка №2']);
 await expect(page.locator('.medicine summary')).toContainText('2 в наличии');
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.locator('.group-picker summary').click();
 await page.getByRole('searchbox',{name:'Поиск препарата'}).fill('ничего такого');
 await expect(page.locator('.group-results [role=status]')).toContainText('Препараты не найдены');
 await page.getByRole('button',{name:'Новое лекарство',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toBeEnabled();
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toBeFocused();
});


test('new packages are available by default while editing keeps availability',async({page},testInfo)=>{
 const kit=`Наличие ${testInfo.project.name} ${Date.now()}`;
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 await page.getByRole('button',{name:'Новая аптечка',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill(kit);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await page.locator('#kit').selectOption({label:kit});
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await expect(page.locator('dialog [name=available]')).toHaveCount(0);
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Новый препарат');
 await page.locator('input[name=expires_on]').fill('2032-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.locator('#summary')).toContainText('В наличии: 1');
 await page.getByRole('button',{name:'Отметить: закончился',exact:true}).click();
 await expect(page.locator('.medicine-header')).toContainText('Закончился');
 await page.getByRole('button',{name:'Изменить Новый препарат',exact:true}).click();
 await expect(page.locator('dialog [name=available]')).toHaveValue('false');
 await page.locator('textarea[name=info]').fill('Изменена только заметка');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.locator('#summary')).toContainText('В наличии: 0');
 await page.getByRole('button',{name:'Добавить упаковку Новый препарат',exact:true}).click();
 await expect(page.locator('dialog [name=available]')).toHaveCount(0);
 await page.locator('input[name=expires_on]').fill('2033-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.locator('.medicine summary')).toContainText('1 в наличии · 1 закончились');
 await page.locator('.medicine summary').click();
 await page.getByRole('button',{name:'Изменить упаковку №1',exact:true}).click();
 await page.locator('dialog [name=available]').selectOption('true');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.locator('.medicine summary')).toContainText('2 в наличии');
});


test('settings open without a close-button ring and retain keyboard focus',async({page},testInfo)=>{
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 const dialog=page.locator('dialog');
 const close=dialog.getByRole('button',{name:'Закрыть',exact:true});
 await expect(dialog.getByRole('heading',{name:'Аптечки и настройки',exact:true})).toBeFocused();
 expect(await close.evaluate(button=>getComputedStyle(button).outlineStyle)).toBe('none');
 await page.screenshot({path:`tmp/ui-settings-${testInfo.project.name}.png`,fullPage:true});
 await page.keyboard.press('Tab');
 await expect(close).toBeFocused();
 expect(await close.evaluate(button=>getComputedStyle(button).outlineStyle)).not.toBe('none');
 await page.keyboard.press('Escape');
 await expect(dialog).not.toBeVisible();
 await expect(page.getByRole('button',{name:'Настройки аптечек'})).toBeFocused();
});

test('collapsed group actions include hidden packages and confirm deletion with name and count',async({page},testInfo)=>{
 const kit=`Группа ${testInfo.project.name} ${Date.now()}`;
 const medicineName='Препарат <все> & "два"';
 const ids=await page.evaluate(async({kit,name})=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  await change('kit_save',{name:kit});
  const kit_id=Object.values(state.kits).find(k=>k.name===kit).id;
  await change('package_save',{kit_id,name,info:'Видимая заметка',expires_on:'2030-01-01'});
  const group_id=Object.values(state.groups).find(g=>g.kit_id===kit_id && g.name===name).id;
  await change('package_save',{kit_id,group_id,info:'Скрытая заметка',expires_on:'2031-01-01'});
  await change('package_save',{kit_id,name:'Соседний препарат',expires_on:'2032-01-01'});
  return {kit_id,group_id};
 },{kit,name:medicineName});
 await expect(page.locator('#kit option').filter({hasText:kit})).toHaveCount(1);
 await page.locator('#kit').selectOption({label:kit});
 await page.locator('#query').fill('Видимая заметка');
 const group=page.locator('.medicine').filter({has:page.getByRole('heading',{name:medicineName,exact:true})});
 await expect(group.locator('details')).not.toHaveAttribute('open');
 await expect(group.locator('summary')).toContainText('показано 1 из 2');
 await expect(group.locator('.group-footer')).toContainText('Все упаковки: 2');
 await group.getByRole('button',{name:'Отметить: закончились',exact:true}).click();
 await expect(group.locator('summary')).toContainText('0 в наличии · 2 закончились');
 await group.locator('.group-footer').getByRole('button',{name:'Отметить: есть',exact:true}).click();
 await expect(group.locator('summary')).toContainText('2 в наличии');
 await page.screenshot({path:`tmp/ui-group-actions-${testInfo.project.name}.png`,fullPage:true});
 await group.locator('.group-footer').getByRole('button',{name:'Удалить',exact:true}).click();
 const dialog=page.locator('dialog');
 await expect(dialog).toContainText(`Вы действительно хотите удалить все упаковки лекарства «${medicineName}»? Количество: 2 шт.`);
 await expect(dialog.getByRole('heading')).toBeFocused();
 expect(await dialog.getByRole('button',{name:'Закрыть',exact:true}).evaluate(button=>getComputedStyle(button).outlineStyle)).toBe('none');

 await page.screenshot({path:`tmp/ui-group-delete-${testInfo.project.name}.png`,fullPage:true});
 await dialog.getByRole('button',{name:'Отмена',exact:true}).click();
 await expect(group).toBeVisible();
 await group.locator('.group-footer').getByRole('button',{name:'Удалить',exact:true}).click();
 // Another client adds a package while the confirmation is open.
 await page.evaluate(async({kit_id,group_id})=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'package_save',revision:state.revision,payload:{kit_id,group_id,expires_on:'2033-01-01'}});
 },ids);
 await dialog.getByRole('button',{name:'Удалить',exact:true}).click();
 await expect(dialog.locator('.form-error')).toContainText('другом устройстве');
 await expect(group.locator('.group-footer')).toContainText('Все упаковки: 3');
 await dialog.getByRole('button',{name:'Отмена',exact:true}).click();
 await group.locator('.group-footer').getByRole('button',{name:'Удалить',exact:true}).click();
 await expect(dialog).toContainText('Количество: 3 шт.');
 await dialog.getByRole('button',{name:'Удалить',exact:true}).click();
 await expect(dialog).not.toBeVisible();
 await expect(group).toHaveCount(0);
 await page.locator('#query').fill('');
 await expect(page.locator('.medicine')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'Соседний препарат',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Отметить: закончился',exact:true})).toBeVisible();
 // Reopening the page proves the entire operation was saved, not just rendered.
 await page.reload();
 await page.locator('#kit').selectOption({label:kit});
 await expect(page.locator('.medicine')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'Соседний препарат',exact:true})).toBeVisible();
});


test('no-expiry checkbox, mixed packages, default alphabet, filters and exports',async({page},testInfo)=>{
 const kit=`Сроки ${testInfo.project.name} ${Date.now()}`;
 await page.evaluate(async name=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  await change('kit_save',{name});
  const kit_id=Object.values(state.kits).find(k=>k.name===name).id;
  await change('package_save',{kit_id,name:'Ящик для таблеток',expires_on:'2028-01-01'});
  await change('package_save',{kit_id,name:'Бинт',expires_on:'2034-01-01'});
 },kit);
 await expect(page.locator('#kit option').filter({hasText:kit})).toHaveCount(1);
 await page.locator('#kit').selectOption({label:kit});
 await expect(page.locator('#sort')).toHaveValue('name');
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 const noExpiry=page.getByRole('checkbox',{name:'Бессрочно',exact:true});
 const date=page.locator('input[name=expires_on]');
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Аптечные ножницы');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).toBeVisible();
 expect(await date.evaluate(input=>input.validity.valueMissing)).toBe(true);
 await date.fill('2036-01-01');
 await noExpiry.check();
 await expect(date).toBeDisabled();
 await expect(page.locator('.expiry-unlimited')).toHaveValue('Бессрочно');
 await noExpiry.uncheck();
 await expect(date).toBeEnabled();
 await expect(date).toHaveValue('2036-01-01');
 await date.fill('');
 await noExpiry.check();
 await page.screenshot({path:`tmp/ui-no-expiry-form-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 const medicine=page.locator('.medicine').filter({has:page.getByRole('heading',{name:'Аптечные ножницы',exact:true})});
 await expect(medicine.locator('.medicine-header')).toContainText('Годен ДО: Бессрочно');
 await expect(medicine.locator('.badge')).toHaveCount(0);
 await expect(page.locator('.medicine h2')).toHaveText(['Аптечные ножницы','Бинт','Ящик для таблеток']);
 await medicine.getByRole('button',{name:'Отметить: закончился',exact:true}).click();
 await expect(medicine.locator('.pack-meta')).toContainText('Бессрочно');
 await medicine.getByRole('button',{name:'Отметить: есть',exact:true}).click();
 await page.reload();
 await page.locator('#kit').selectOption({label:kit});
 await expect(page.locator('#sort')).toHaveValue('name');
 await medicine.getByRole('button',{name:'Изменить Аптечные ножницы',exact:true}).click();
 await expect(noExpiry).toBeChecked();
 await expect(page.locator('.expiry-unlimited')).toBeVisible();
 await page.getByRole('button',{name:'Отмена',exact:true}).click();
 await medicine.getByRole('button',{name:'Добавить упаковку Аптечные ножницы',exact:true}).click();
 await expect(noExpiry).not.toBeChecked();
 await date.fill('2030-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('.medicine-header')).toContainText('Ближайший срок: 01.01.2030');
 await medicine.locator('summary').click();
 await expect(medicine.locator('.pack').first()).toContainText('Бессрочно');
 await expect(medicine.locator('.pack').nth(1)).toContainText('01.01.2030');
 await medicine.getByRole('button',{name:'Изменить Аптечные ножницы',exact:true}).click();
 await expect(page.locator('.package-choice').first()).toContainText('Годен ДО: Бессрочно');
 await page.locator('.package-choice').first().click();
 await noExpiry.uncheck();
 await date.fill('2029-01-01');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(medicine.locator('.medicine-header')).toContainText('Ближайший срок: 01.01.2029');
 for(const number of [1,2]){
  await medicine.getByRole('button',{name:`Изменить упаковку №${number}`,exact:true}).click();
  await noExpiry.check();
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
 }
 await expect(medicine.locator('.medicine-header')).toContainText('Годен ДО: Бессрочно');
 await page.locator('#status').selectOption('no_expiry');
 await expect(page.locator('.medicine')).toHaveCount(1);
 await expect(medicine.locator('.pack')).toHaveCount(2);
 await page.locator('#status').selectOption('ok');
 await expect(medicine).toHaveCount(0);
 await page.locator('#status').selectOption('all');
 await page.locator('#sort').selectOption('expiry');
 await expect(page.locator('.medicine h2')).toHaveText(['Ящик для таблеток','Бинт','Аптечные ножницы']);
 await page.locator('#sort').selectOption('name');
 await page.screenshot({path:`tmp/ui-no-expiry-${testInfo.project.name}.png`,fullPage:true});
 for(const format of ['csv','pdf']){
  await page.getByRole('button',{name:'Экспорт',exact:true}).click();
  await page.locator('select[name=format]').selectOption(format);
  const downloading=page.waitForEvent('download');
  await page.getByRole('button',{name:'Скачать',exact:true}).click();
  const download=await downloading;
  await download.saveAs(`tmp/qa-no-expiry-${testInfo.project.name}.${format}`);
  await expect(page.locator('dialog')).not.toBeVisible();
 }
 expect(fs.readFileSync(`tmp/qa-no-expiry-${testInfo.project.name}.csv`,'utf8')).toContain('Бессрочно');
});


test('single-package and cabinet confirmations start without a close ring',async({page},testInfo)=>{
 const kit=`Удаление ${testInfo.project.name} ${Date.now()}`;
 await page.evaluate(async(kit)=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  await change('kit_save',{name:kit});
  const kit_id=Object.values(state.kits).find(k=>k.name===kit).id;
  await change('package_save',{kit_id,name:'Одна упаковка',no_expiry:true});
 },kit);
 await expect(page.locator('#kit option').filter({hasText:kit})).toHaveCount(1);
 await page.locator('#kit').selectOption({label:kit});
 await page.locator('.single-pack').getByRole('button',{name:'Удалить',exact:true}).click();
 const dialog=page.locator('dialog');
 await expect(dialog.getByRole('heading',{name:'Удалить упаковку?'})).toBeFocused();
 const close=dialog.getByRole('button',{name:'Закрыть',exact:true});
 expect(await close.evaluate(button=>getComputedStyle(button).outlineStyle)).toBe('none');
 await page.screenshot({path:`tmp/ui-single-delete-${testInfo.project.name}.png`,fullPage:true});
 await page.keyboard.press('Tab');
 await expect(close).toBeFocused();
 expect(await close.evaluate(button=>getComputedStyle(button).outlineStyle)).not.toBe('none');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Настройки аптечек'}).click();
 await page.getByRole('button',{name:'Удалить аптечку',exact:true}).click();
 await expect(dialog.getByRole('heading',{name:'Удалить аптечку?'})).toBeFocused();
 expect(await close.evaluate(button=>getComputedStyle(button).outlineStyle)).toBe('none');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('heading',{name:'Одна упаковка',exact:true})).toBeVisible();
});

test('language options update sidebar and panel, preserve custom text, and export in English',async({page},testInfo)=>{
 const custom='Family <Box> & "Health"';
 const setOptions=async(language,title)=>page.evaluate(async({language,title})=>{
  const entries=await window.testHass.callWS({type:'config_entries/get',domain:'medicine_cabinet'});
  const entry=entries.find(e=>e.domain==='medicine_cabinet');
  const post=async(path,body)=>{
   const response=await window.testHass.fetchWithAuth(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
   if(!response.ok)throw Error(await response.text());return response.json();
  };
  let flow=await post('/api/config/config_entries/options/flow',{handler:entry.entry_id});
  flow=await post('/api/config/config_entries/options/flow/'+flow.flow_id,{language});
  return post('/api/config/config_entries/options/flow/'+flow.flow_id,{sidebar_title:title,notification_time:'09:00:00',persistent_notifications:true,notify_targets:[]});
 },{language,title});
 try{
  const result=await setOptions('en',custom);expect(result.type).toBe('create_entry');
  await expect(page.locator('header strong')).toHaveText(custom);
  await expect(page.locator('header strong box')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Medicine box settings'})).toBeVisible();
  await page.locator('#sort').selectOption('expiry');
  await page.getByRole('button',{name:'Reset all filters',exact:true}).click();
  await expect(page.locator('#sort')).toHaveValue('name');
  const panels=await page.evaluate(()=>window.testHass.callWS({type:'get_panels'}));
  expect(panels['medicine-cabinet'].title).toBe(custom);
  await page.getByRole('button',{name:'Medicine box settings'}).click();
  await expect(page.locator('dialog').getByRole('heading')).toBeFocused();
  await page.getByRole('button',{name:'New medicine box',exact:true}).click();
  const kit=`English ${testInfo.project.name} ${Date.now()}`;
  await page.getByRole('textbox',{name:'Name',exact:true}).fill(kit);
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.locator('#kit').selectOption({label:kit});
  await page.getByRole('button',{name:'Add',exact:true}).click();
  await expect(page.locator('.group-value')).toHaveText('New medicine');
  await page.getByRole('textbox',{name:'Name',exact:true}).fill('Парацетамол <literal>');
  await page.getByRole('textbox',{name:'Additional information',exact:true}).fill('Заметка без перевода');
  await page.getByRole('checkbox',{name:'No expiry',exact:true}).check();
  await page.screenshot({path:`tmp/ui-english-form-${testInfo.project.name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.locator('.medicine')).toContainText('Expiry date: No expiry');
  await expect(page.locator('.medicine')).toContainText('Заметка без перевода');
  await page.reload();
  await expect(page.locator('header strong')).toHaveText(custom);
  await page.locator('#kit').selectOption({label:kit});
  await page.screenshot({path:`tmp/ui-english-${testInfo.project.name}.png`,fullPage:true});
  for(const format of ['csv','pdf']){
   await page.getByRole('button',{name:'Export',exact:true}).click();
   await expect(page.locator('dialog').getByRole('heading')).toBeFocused();
   await expect(page.getByRole('checkbox',{name:'Include all finished packages'})).toBeChecked();
   await expect(page.locator('select[name=expiry]')).toContainText('Within 90 days, including expired');
   await expect(page.locator('dialog').getByRole('heading')).toHaveText(`Download medicine box «${kit}»`);
   await expect(page.locator('dialog .explanation')).toHaveText('The file will be saved locally.');
   await page.locator('select[name=format]').selectOption(format);
   await expect(page.locator('.export-count')).toHaveText(`${format.toUpperCase()} · Medicines: 1 · Packages: 1`);
   const downloadPromise=page.waitForEvent('download');
   await page.getByRole('button',{name:'Download',exact:true}).click();
   const download=await downloadPromise;
   await download.saveAs(`tmp/qa-english-${testInfo.project.name}.${format}`);
   await expect(page.locator('dialog')).not.toBeVisible();
   if(format==='csv')expect(fs.readFileSync(`tmp/qa-english-${testInfo.project.name}.csv`,'utf8')).toContain('No expiry');
  }
  await page.locator('.single-pack').getByRole('button',{name:'Delete',exact:true}).click();
  await expect(page.locator('dialog').getByRole('heading',{name:'Delete package?'})).toBeFocused();
  await expect(page.locator('dialog')).toContainText('Package #1 will be deleted');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  const longTitle='Длинное название аптечки '.repeat(4).trim();
  await setOptions('en',longTitle);
  await expect(page.locator('header strong')).toHaveText(longTitle);
  expect(await page.locator('header').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 }finally{
  await setOptions('ru','Аптечка');
  await expect(page.locator('header strong')).toHaveText('Аптечка');
 }
});


test('export dialog: neutral focus, expiry boundary, shopping list and independent filters',async({page},testInfo)=>{
 const kit=await page.evaluate(async()=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  const name=`Экспорт ${Date.now()}`;
  await change('kit_save',{name});
  const kit_id=Object.values(state.kits).find(k=>k.name===name).id;
  for(const [name,days,available] of [['Просроченный',-1,true],['Ровно 90',90,true],['Через 91',91,true],['Закончился бессрочный',null,false],['Бессрочный',null,true]]) {
   await change('package_save',{kit_id,name,available,no_expiry:days===null,expires_on:days===null?null:new Date(Date.parse(state.today)+days*86400000).toISOString().slice(0,10)});
  }
  return kit_id;
 });
 await page.locator('#kit').selectOption(kit);
 await page.locator('#query').fill('Ничего не совпадёт');
 await page.getByRole('button',{name:'Экспорт',exact:true}).click();
 const dialog=page.locator('dialog');
 await expect(dialog.getByRole('heading')).toBeFocused();
 await expect(dialog.getByRole('heading')).toHaveText(`Скачать аптечку «${await page.locator('#kit option:checked').textContent()}»`);
 await expect(dialog.locator('.explanation')).toHaveText('Файл сохранится локально.');
 await expect(dialog.locator('.export-count')).toHaveText('PDF · Препаратов: 5 · Упаковок: 5');
 const close=dialog.getByRole('button',{name:'Закрыть',exact:true});
 expect(await close.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('none');
 await page.screenshot({path:`tmp/ui-export-initial-${testInfo.project.name}.png`,fullPage:true});
 await page.keyboard.press('Tab');
 await expect(close).toBeFocused();
 expect(await close.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
 await expect(dialog.locator('[name=scope]')).toHaveCount(0);
 await page.locator('select[name=format]').selectOption('csv');
 await page.locator('select[name=expiry]').selectOption('within_90');
 await expect(dialog.locator('.export-count')).toHaveText('CSV · Препаратов: 3 · Упаковок: 3');
 await dialog.getByRole('heading').click();
 await page.screenshot({path:`tmp/ui-export-${testInfo.project.name}.png`,fullPage:true});
 expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 const first=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать',exact:true}).click();
 const download=await first;
 const file=`tmp/qa-selection-${testInfo.project.name}.csv`;
 await download.saveAs(file);
 const text=fs.readFileSync(file,'utf8');
 expect(text).toContain('Просроченный');expect(text).toContain('Ровно 90');
 expect(text).toContain('Закончился бессрочный');expect(text).not.toContain('Через 91');
 expect(text.trim().split('\n')).toHaveLength(4);
 await page.getByRole('button',{name:'Экспорт',exact:true}).click();
 await page.locator('select[name=format]').selectOption('csv');
 await page.locator('select[name=expiry]').selectOption('over_90');
 await page.getByRole('checkbox',{name:'Добавить закончившиеся'}).uncheck();
 await expect(dialog.locator('.export-count')).toHaveText('CSV · Препаратов: 1 · Упаковок: 1');
 const second=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать',exact:true}).click();
 await (await second).saveAs(file);
 const over=fs.readFileSync(file,'utf8');
 expect(over).toContain('Через 91');expect(over).not.toContain('Закончился бессрочный');
 expect(over.trim().split('\n')).toHaveLength(2);
 await page.getByRole('button',{name:'Экспорт',exact:true}).click();
 await page.locator('select[name=expiry]').selectOption('expired');
 await page.getByRole('checkbox',{name:'Добавить закончившиеся'}).uncheck();
 await expect(dialog.locator('.export-count')).toHaveText('PDF · Препаратов: 1 · Упаковок: 1');
 const group=await page.evaluate(async kit_id=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const group=Object.values(state.groups).find(g=>g.kit_id===kit_id&&g.name==='Просроченный');
  const first=Object.values(state.packages).find(p=>p.group_id===group.id);
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'package_save',revision:state.revision,payload:{kit_id,group_id:group.id,expires_on:first.expires_on}});
  return group.id;
 },kit);
 await expect(dialog.locator('.export-count')).toHaveText('PDF · Препаратов: 1 · Упаковок: 2');
 await page.evaluate(async({id,kit_id})=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'group_set_available',revision:state.revision,payload:{id,kit_id,available:false}});
 },{id:group,kit_id:kit});
 await expect(dialog.locator('.export-count')).toHaveText('PDF · Препаратов: 0 · Упаковок: 0');
 await expect(dialog.locator('.export-empty')).toBeVisible();
 await page.screenshot({path:`tmp/ui-export-empty-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('checkbox',{name:'Добавить закончившиеся'}).check();
 await page.locator('select[name=format]').selectOption('csv');
 await expect(dialog.locator('.export-count')).toHaveText('CSV · Препаратов: 2 · Упаковок: 3');
 await expect(dialog.locator('.export-empty')).toBeHidden();
 const third=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать',exact:true}).click();
 await (await third).saveAs(file);
 expect(fs.readFileSync(file,'utf8').trim().split('\n')).toHaveLength(4);
});

test('selected cabinet survives navigation and reload, isolates users and handles deletion/storage denial',async({page})=>{
 const ids=await page.evaluate(async()=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const ids=[];
  for(const name of [`Дом ${Date.now()}`,`Машина ${Date.now()}`]) {
   state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'kit_save',payload:{name},revision:state.revision});
   ids.push(Object.values(state.kits).find(k=>k.name===name).id);
  }
  return ids;
 });
 await page.locator('#kit').selectOption(ids[1]);
 // Recreate the panel as HA does when navigating between sidebar pages.
 await page.evaluate(()=>{
  document.querySelector('medicine-cabinet-panel').remove();
  const panel=document.createElement('medicine-cabinet-panel');
  panel.hass=window.testHass;document.body.append(panel);
 });
 await expect(page.locator('#kit')).toHaveValue(ids[1]);
 await page.reload();await expect(page.locator('#kit')).toHaveValue(ids[1]);
 await page.evaluate(()=>{
  const panel=document.querySelector('medicine-cabinet-panel');
  panel.hass={...window.testHass,user:{...window.testHass.user,id:'another-ui-user'}};
 });
 await page.locator('#kit').selectOption(ids[0]);
 await page.evaluate(()=>document.querySelector('medicine-cabinet-panel').hass=window.testHass);
 await expect(page.locator('#kit')).toHaveValue(ids[1]);
 await page.evaluate(async id=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'kit_delete',payload:{id},revision:state.revision});
 },ids[1]);
 await expect(page.locator('#kit')).not.toHaveValue(ids[1]);
 const fallback=await page.locator('#kit').inputValue();
 await page.reload();await expect(page.locator('#kit')).toHaveValue(fallback);
 await page.addInitScript(()=>{
  Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});
 });
 await page.reload();await expect(page.locator('#kit')).toBeVisible();
 await page.locator('#kit').selectOption(ids[0]);
 await expect(page.locator('#kit')).toHaveValue(ids[0]);
 await expect(page.locator('#error')).toBeEmpty();
});


test('reset all filters clears search and restores any expiry, any availability and alphabet',async({page},testInfo)=>{
 const kit=await page.evaluate(async()=>{
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  const name=`Сброс ${Date.now()}`;
  await change('kit_save',{name});
  const kit_id=Object.values(state.kits).find(k=>k.name===name).id;
  await change('package_save',{kit_id,name:'Альфа',expires_on:'2035-01-01'});
  await change('package_save',{kit_id,name:'Бета',expires_on:'2020-01-01',available:false});
  return kit_id;
 });
 await page.locator('#kit').selectOption(kit);
 const reset=page.getByRole('button',{name:'Сбросить все фильтры',exact:true});
 await expect(reset).toBeVisible();
 await page.locator('#sort').selectOption('expiry');
 await expect(page.locator('.medicine-heading h2')).toHaveText(['Бета','Альфа']);
 await page.locator('#status').selectOption('expired');
 await page.locator('#availability').selectOption('finished');
 await page.locator('#query').fill('Бета');
 await expect(page.locator('.medicine-heading h2')).toHaveText(['Бета']);
 await reset.click();
 await expect(page.locator('#status')).toHaveValue('all');
 await expect(page.locator('#availability')).toHaveValue('all');
 await expect(page.locator('#sort')).toHaveValue('name');
 await expect(page.locator('#query')).toHaveValue('');
 await expect(page.locator('#kit')).toHaveValue(kit);
 await expect(page.locator('.medicine-heading h2')).toHaveText(['Альфа','Бета']);
 await expect(page.locator('#summary')).toContainText('В выборке: 2');
 // The button remains available even when the chosen filters match nothing.
 await page.locator('#sort').selectOption('expiry');
 await page.locator('#query').fill('Совпадений нет');
 await expect(page.getByRole('heading',{name:'Ничего не найдено'})).toBeVisible();
 await reset.click();
 await expect(page.locator('.medicine-heading h2')).toHaveText(['Альфа','Бета']);
 await expect(page.locator('#sort')).toHaveValue('name');
 await reset.click();
 await expect(page.locator('#kit')).toHaveValue(kit);
 await page.screenshot({path:`tmp/ui-reset-${testInfo.project.name}.png`,fullPage:true});
 const checkBounds=async()=>expect(await page.locator('.filters').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 await checkBounds();
 if(testInfo.project.name==='desktop') {
  for(const width of [1100,900,701]) {await page.setViewportSize({width,height:900});await checkBounds();}
 }
});
