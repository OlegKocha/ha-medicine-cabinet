import {test,expect} from '@playwright/test';
import fs from 'node:fs';

test.beforeEach(async({page},testInfo)=>{
 const access=JSON.parse(fs.readFileSync('.ha-test/access.json','utf8'));
 await page.addInitScript(value=>{window.DEV_ACCESS=value;},access);
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='127.0.0.1'||url.protocol==='blob:')return route.continue();
  throw new Error(`Unexpected external request: ${url}`);
 });
 await page.goto('/test-panel');
 await page.waitForFunction(()=>window.testHass);
 const kit=await page.evaluate(async name=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const result=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'kit_save',payload:{name},revision:state.revision});
  return Object.values(result.kits).find(k=>k.name===name).id;
 },`Лекарства ${testInfo.project.name} ${Date.now()}`);
 await expect(page.locator(`#kit option[value="${kit}"]`)).toHaveCount(1);
 await page.locator('#kit').selectOption(kit);
});

test('same medicine entered twice uses one card and preserves both packages',async({page})=>{
 for(const [info,date] of [['Первая заметка','2030-11-06'],['Вторая заметка','2031-07-01']]){
  await page.getByRole('button',{name:'Добавить',exact:true}).click();
  await page.getByRole('textbox',{name:'Название',exact:true}).fill('Пенталгин');
  await page.getByRole('textbox',{name:'Доп. информация',exact:true}).fill(info);
  await page.locator('[name=expires_on]').fill(date);
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
 }
 const card=page.locator('.medicine');
 await expect(card).toHaveCount(1);
 await expect(card.getByRole('heading',{name:'Пенталгин',exact:true})).toBeVisible();
 await expect(card.locator('summary')).toContainText('2 в наличии');
 await expect(card.locator('details')).not.toHaveAttribute('open');
 await card.locator('summary').click();
 await expect(card.locator('.pack-head')).toHaveText(['Упаковка №1','Упаковка №2']);
 await expect(card.locator('.pack').nth(0)).toContainText('Первая заметка');
 await expect(card.locator('.pack').nth(0)).toContainText('06.11.2030');
 await expect(card.locator('.pack').nth(1)).toContainText('Вторая заметка');
 await expect(card.locator('.pack').nth(1)).toContainText('01.07.2031');
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 await page.locator('.group-picker summary').click();
 await expect(page.locator('.group-results').getByRole('button',{name:'Пенталгин',exact:true})).toHaveCount(1);
});

test('expiry date fits the form when empty, filled, focused and edited',async({page,isMobile},testInfo)=>{
 const widths=isMobile?[320,390]:[700,1280];
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 const expiry=page.locator('[name=expires_on]');
 const assertFits=async()=>{
  const bounds=await expiry.evaluate(input=>{
   const field=input.closest('.field');
   const form=input.closest('form');
   const dialog=input.closest('dialog');
   const rect=input.getBoundingClientRect();
   const parent=field.getBoundingClientRect();
   return {left:rect.left,right:rect.right,width:rect.width,parentLeft:parent.left,parentRight:parent.right,
    formOverflow:form.scrollWidth-form.clientWidth,dialogOverflow:dialog.scrollWidth-dialog.clientWidth};
  });
  expect(bounds.width).toBeGreaterThan(100);
  expect(bounds.left).toBeGreaterThanOrEqual(bounds.parentLeft-1);
  expect(bounds.right).toBeLessThanOrEqual(bounds.parentRight+1);
  expect(bounds.formOverflow).toBeLessThanOrEqual(1);
  expect(bounds.dialogOverflow).toBeLessThanOrEqual(1);
 };
 for(const width of widths){
  await page.setViewportSize({width,height:844});
  await expiry.fill('');
  await expiry.focus();
  await assertFits();
  await expiry.fill('2030-11-06');
  await assertFits();
  await page.getByRole('checkbox',{name:'Бессрочно',exact:true}).check();
  await expect(expiry).toBeHidden();
  await page.getByRole('checkbox',{name:'Бессрочно',exact:true}).uncheck();
  await expect(expiry).toHaveValue('2030-11-06');
  await assertFits();
 }
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Пенталгин');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 for(const width of widths){
  await page.setViewportSize({width,height:844});
  await expect(expiry).toHaveValue('2030-11-06');
  await expiry.focus();
  await assertFits();
 }
 await page.screenshot({path:`tmp/ui-expiry-layout-${testInfo.project.name}.png`,fullPage:true});
});

async function twoPhotoFreePackages(page) {
 for(const [info,date] of [['Первая заметка','2030-01-01'],['Вторая заметка','2031-02-02']]) {
  await page.getByRole('button',{name:'Добавить',exact:true}).click();
  await page.getByRole('textbox',{name:'Название',exact:true}).fill('Пенталгин');
  await page.getByRole('textbox',{name:'Доп. информация',exact:true}).fill(info);
  await page.locator('[name=expires_on]').fill(date);
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
 }
}
async function currentKitPackages(page) {
 return page.evaluate(async()=>{
  const data=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const kit=document.querySelector('medicine-cabinet-panel').shadowRoot.querySelector('#kit').value;
  return Object.values(data.packages).filter(p=>data.groups[p.group_id].kit_id===kit);
 });
}

test('header pencil replaces photos for every package, including filtered packages, without changing expiry or notes',async({page})=>{
 await twoPhotoFreePackages(page);
 const card=page.locator('.medicine');
 await card.locator('summary').click();
 await card.locator('.pack').nth(1).getByRole('button',{name:'Отметить: закончился',exact:true}).click();
 await expect(card.locator('summary')).toContainText('1 закончились');
 const before=await currentKitPackages(page);
 await page.locator('#availability').selectOption('present');
 await expect(card.locator('.pack')).toHaveCount(1);
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Изменить лекарство',exact:true})).toBeFocused();
 await expect(page.locator('dialog')).toContainText('ко всем упаковкам: 2');
 await expect(page.locator('[name=expires_on]')).toHaveValue('');
 await page.locator('[name=photo]').setInputFiles('tests/fixtures/photo.png');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 const after=await currentKitPackages(page);
 expect(after).toHaveLength(2);
 expect(after[0].image_id).toBeTruthy();
 expect(after[1].image_id).toBe(after[0].image_id);
 for(const item of after) {
  const old=before.find(p=>p.id===item.id);
  for(const key of ['expires_on','no_expiry','info','available','added_at']) expect(item[key]).toEqual(old[key]);
 }
 await page.locator('#availability').selectOption('all');
 await expect(card.locator('.pack-photo img')).toHaveCount(2);
 await expect.poll(()=>card.locator('.pack-photo img').evaluateAll(imgs=>imgs.every(img=>img.naturalWidth>0))).toBe(true);
 await page.reload();
 await expect(card.locator('summary')).toBeVisible();
 await card.locator('summary').click();
 await expect(card.locator('.pack-photo img')).toHaveCount(2);
 // A child pencil changes only that package.
 await page.getByRole('button',{name:'Изменить упаковку №1',exact:true}).click();
 await page.getByRole('button',{name:'Убрать',exact:true}).click();
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 const individual=await currentKitPackages(page);
 expect(individual.filter(p=>p.image_id===null)).toHaveLength(1);
 expect(individual.filter(p=>p.image_id!==null)).toHaveLength(1);
 // Merely opening/saving the group must not overwrite different photos.
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 await expect(page.locator('.photo-status')).toContainText('разные фотографии');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 expect(await currentKitPackages(page)).toEqual(individual);
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 await page.getByRole('button',{name:'Убрать фото у всех',exact:true}).click();
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 expect((await currentKitPackages(page)).every(p=>p.image_id===null)).toBe(true);
});

test('group editor applies name notes date availability and categories to all packages',async({page},testInfo)=>{
 await twoPhotoFreePackages(page);
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 await page.getByRole('textbox',{name:'Название',exact:true}).fill('Общее лекарство');
 await page.getByRole('textbox',{name:'Доп. информация',exact:true}).fill('Общая заметка');
 await page.locator('[name=expires_on]').fill('2032-03-03');
 await page.locator('.category-picker > summary').click();
 await page.locator('.category-create > summary').click();
 const category=`Общая ${testInfo.project.name} ${Date.now()}`;
 await page.getByRole('textbox',{name:'Название категории',exact:true}).fill(category);
 await page.getByRole('button',{name:'Создать и выбрать',exact:true}).click();
 await expect(page.locator('.selected-categories')).toContainText(category);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 await expect(page.getByRole('heading',{name:'Общее лекарство',exact:true})).toBeVisible();
 await expect(page.locator('.medicine-heading .category-badge')).toHaveText(category);
 for(const item of await currentKitPackages(page)) {
  expect(item.info).toBe('Общая заметка');
  expect(item.expires_on).toBe('2032-03-03');
 }
 await page.getByRole('button',{name:'Изменить Общее лекарство',exact:true}).click();
 await page.locator('[name=available]').selectOption('false');
 await page.getByRole('button',{name:'Очистить описание у всех',exact:true}).click();
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 for(const item of await currentKitPackages(page)) { expect(item.available).toBe(false); expect(item.info).toBe(''); }
 await page.getByRole('button',{name:'Изменить Общее лекарство',exact:true}).click();
 await page.getByRole('checkbox',{name:'Бессрочно',exact:true}).check();
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).not.toBeVisible();
 for(const item of await currentKitPackages(page)) { expect(item.no_expiry).toBe(true); expect(item.expires_on).toBeNull(); expect(item.available).toBe(true); }
});

test('stale group editor preserves input and reloads the whole group before retry',async({page})=>{
 await twoPhotoFreePackages(page);
 await page.getByRole('button',{name:'Изменить Пенталгин',exact:true}).click();
 await page.getByRole('textbox',{name:'Доп. информация',exact:true}).fill('Правка из старой формы');
 await page.evaluate(async()=>{
  const data=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const kit_id=document.querySelector('medicine-cabinet-panel').shadowRoot.querySelector('#kit').value;
  const group=Object.values(data.groups).find(g=>g.kit_id===kit_id);
  await window.testHass.callWS({type:'medicine_cabinet/request',operation:'package_save',revision:data.revision,payload:{kit_id,group_id:group.id,info:'Новая упаковка',no_expiry:true}});
 });
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('.form-error')).toContainText('Данные изменились');
 await expect(page.getByRole('textbox',{name:'Доп. информация',exact:true})).toHaveValue('Правка из старой формы');
 await page.getByRole('button',{name:'Перезагрузить запись',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Изменить лекарство',exact:true})).toBeVisible();
 await expect(page.locator('dialog')).toContainText('ко всем упаковкам: 3');
 await expect(page.locator('[name=expires_on]')).toHaveValue('');
});
