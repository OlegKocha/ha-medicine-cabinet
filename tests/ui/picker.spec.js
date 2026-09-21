import {test,expect} from '@playwright/test';
import fs from 'node:fs';

const medicine='Парацетамол 500 мг';
const description='Сохранённое описание\nЗаметка для новой упаковки';

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
});

async function seedMedicine(page) {
 const ids=await page.evaluate(async({medicine,description,photo})=>{
  const response=await window.testHass.fetchWithAuth('/api/medicine_cabinet/images',{
   method:'POST',headers:{'Content-Type':'application/octet-stream'},body:new Uint8Array(photo),
  });
  if(!response.ok) throw new Error('Photo upload failed');
  const {image_id}=await response.json();
  let state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  const change=async(operation,payload)=>state=await window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
  const name=`Выбор препарата ${Date.now()}`;
  await change('kit_save',{name});
  const kit_id=Object.values(state.kits).find(k=>k.name===name).id;
  await change('package_save',{kit_id,name:'Аспирин',info:'Другая заметка',expires_on:'2030-01-01'});
  await change('package_save',{kit_id,name:medicine,info:description,image_id,expires_on:'2030-01-01'});
  const group_id=Object.values(state.groups).find(g=>g.kit_id===kit_id&&g.name===medicine).id;
  return {kit_id,group_id,image_id};
 },{medicine,description,photo:[...fs.readFileSync('tests/fixtures/photo.png')]});
 await page.locator('#kit').selectOption(ids.kit_id);
 await page.getByRole('button',{name:'Добавить',exact:true}).click();
 return ids;
}

async function expectSelected(page,ids) {
 await expect(page.locator('.group-picker')).not.toHaveAttribute('open');
 await expect(page.locator('.group-value')).toHaveText(medicine);
 await expect(page.locator('[name=group_id]')).toHaveValue(ids.group_id);
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toHaveValue(medicine);
 await expect(page.getByRole('textbox',{name:'Название',exact:true})).toBeDisabled();
 await expect(page.getByRole('textbox',{name:'Доп. информация',exact:true})).toHaveValue(description);
 await expect(page.locator('[name=image_id]')).toHaveValue(ids.image_id);
 await expect(page.locator('.photo-status')).toHaveText('Используется фото другой упаковки');
 await expect(page.locator('[name=expires_on]')).toHaveValue('');
}

for(const filtered of [false,true]) {
 test(`saved medicine pointer selection autofills and saves (${filtered?'search':'full list'})`,async({page,isMobile},testInfo)=>{
  const ids=await seedMedicine(page);
  const activate=async locator=>isMobile?locator.tap():locator.click();
  await activate(page.locator('.group-picker summary'));
  const search=page.getByRole('searchbox',{name:'Поиск препарата'});
  await expect(search).toBeFocused();
  if(filtered) await search.fill('пАРАцет');
  // Use a real mouse/touch sequence: WebKit transfers focus to the dialog
  // before click, so prematurely closing the picker would lose this selection.
  await activate(page.locator('.group-results').getByRole('button',{name:medicine,exact:true}));
  await expectSelected(page,ids);
  await page.locator('[name=expires_on]').fill('2031-02-03');
  if(filtered) await page.screenshot({path:`tmp/ui-picker-autofill-${testInfo.project.name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  await expect(page.locator('dialog')).not.toBeVisible();
  const saved=await page.evaluate(async group_id=>{
   const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
   return Object.values(state.packages).filter(p=>p.group_id===group_id);
  },ids.group_id);
  expect(saved).toHaveLength(2);
  expect(saved.find(p=>p.expires_on==='2031-02-03')).toMatchObject({info:description,image_id:ids.image_id,available:true});
  const card=page.locator('.medicine').filter({has:page.getByRole('heading',{name:medicine,exact:true})});
  await expect(card.locator('summary')).toContainText('2 в наличии');
 });
}

test('medicine picker still supports keyboard selection and closes on leaving the control',async({page})=>{
 const ids=await seedMedicine(page);
 const summary=page.locator('.group-picker summary');
 const search=page.getByRole('searchbox',{name:'Поиск препарата'});
 await summary.focus();
 await summary.press('ArrowDown');
 await search.fill('Парацетамол');
 await search.press('ArrowDown');
 const option=page.locator('.group-results').getByRole('button',{name:medicine,exact:true});
 await expect(option).toBeFocused();
 await option.press('Enter');
 await expectSelected(page,ids);
 await summary.press('ArrowDown');
 await search.fill('Парацетамол');
 await search.press('ArrowDown');
 await option.press('Tab');
 await expect(page.locator('.group-picker')).not.toHaveAttribute('open');
 await expect(page.getByRole('textbox',{name:'Доп. информация',exact:true})).toBeFocused();
 await summary.click();
 await page.locator('.dialog-heading h2').click();
 await expect(page.locator('.group-picker')).not.toHaveAttribute('open');
 await summary.click();
 await search.press('Escape');
 await expect(page.locator('.group-picker')).not.toHaveAttribute('open');
 await expect(page.locator('dialog')).toBeVisible();
 await expect(summary).toBeFocused();
});
