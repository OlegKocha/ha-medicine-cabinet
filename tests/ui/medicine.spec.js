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
