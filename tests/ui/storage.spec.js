import {test,expect} from '@playwright/test';
import fs from 'node:fs';

async function snapshot(page){return page.evaluate(()=>window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'}));}
async function change(page,operation,payload){
 return page.evaluate(async({operation,payload})=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  return window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
 },{operation,payload});
}
async function settings(page){await page.locator('[data-action=settings]').click();}
async function storage(page){await settings(page);await page.getByRole('button',{name:'Данные и хранилища',exact:true}).click();await expect(page.locator('.storage-summary')).toBeVisible();}
async function close(page){await page.locator('dialog .dialog-heading [data-action=close]').click();}

test.beforeEach(async({page},testInfo)=>{
 const access=JSON.parse(fs.readFileSync('.ha-test/access.json','utf8'));
 await page.addInitScript(value=>{window.DEV_ACCESS=value;},access);
 await page.goto('/test-panel');await page.waitForFunction(()=>window.testHass);
 const name=`Хранилище ${testInfo.project.name} ${Date.now()}`;
 const data=await change(page,'kit_save',{name});
 const kit=Object.values(data.kits).find(k=>k.name===name).id;
 await expect(page.locator(`#kit option[value="${kit}"]`)).toHaveCount(1);
 await page.locator('#kit').selectOption(kit);
 const imageId=await page.evaluate(async bytes=>{
  const response=await window.testHass.fetchWithAuth('/api/medicine_cabinet/images',{method:'POST',body:new Uint8Array(bytes)});
  if(!response.ok)throw new Error(await response.text());return (await response.json()).image_id;
 },Array.from(fs.readFileSync('tests/fixtures/photo.png')));
 await change(page,'package_save',{kit_id:kit,name:'Препарат для копии',count:2,no_expiry:true,image_id:imageId});
 await expect(page.locator('.medicine')).toHaveCount(1);
});

test('gear opens a separate storage dialog, downloads ZIP and cleans only unused photos',async({page},testInfo)=>{
 const orphan='.ha-test/medicine_cabinet/images/'+ 'f'.repeat(64)+'.jpg';
 fs.writeFileSync(orphan,'unused test photo');fs.utimesSync(orphan,new Date(0),new Date(0));
 const before=await snapshot(page);
 await settings(page);
 await expect(page.locator('[data-action=storage-backup]')).toHaveCount(0);
 await page.getByRole('button',{name:'Данные и хранилища',exact:true}).click();
 await expect(page.locator('.storage-summary')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Данные и хранилища',exact:true})).toBeVisible();
 const closeButton=page.locator('dialog .dialog-heading [data-action=close]');
 expect(await closeButton.evaluate(el=>el.matches(':focus-visible'))).toBe(false);
 expect(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 await page.screenshot({path:`tmp/ui-storage-${testInfo.project.name}.png`,fullPage:true});
 const downloadEvent=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать резервную копию ZIP',exact:true}).click();
 const download=await downloadEvent;expect(download.suggestedFilename()).toMatch(/^hamb-backup-.*\.zip$/);
 const bytes=fs.readFileSync(await download.path());expect(bytes.subarray(0,2).toString()).toBe('PK');
 await expect(page.locator('[data-action=storage-cleanup-confirm]')).toBeEnabled();
 await page.locator('[data-action=storage-cleanup-confirm]').click();
 await expect(page.getByRole('heading',{name:'Очистить неиспользуемые фото?',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Очистить',exact:true}).click();
 await expect(page.locator('.storage-summary')).toBeVisible();
 expect(fs.existsSync(orphan)).toBe(false);expect(await snapshot(page)).toEqual(before);
 for(const item of Object.values(before.packages).filter(p=>p.image_id))expect(fs.existsSync(`.ha-test/medicine_cabinet/images/${item.image_id}.jpg`)).toBe(true);
 await page.getByRole('button',{name:'Назад к настройкам',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Аптечки и настройки',exact:true})).toBeVisible();
});

test('full deletion requires typed confirmation, rejects stale data and stays empty after reload',async({page})=>{
 const before=await snapshot(page);
 await storage(page);await page.locator('[data-action=storage-clear-confirm]').click();
 const submit=page.getByRole('button',{name:'Удалить все данные',exact:true});
 await expect(submit).toBeDisabled();await page.locator('[name=confirmation]').fill('incorrect');await expect(submit).toBeDisabled();
 await page.getByRole('button',{name:'Отмена',exact:true}).click();await expect(page.locator('.storage-summary')).toBeVisible();
 expect(await snapshot(page)).toEqual(before);
 await page.locator('[data-action=storage-clear-confirm]').click();
 await change(page,'kit_save',{name:'Создана на другом устройстве'});
 await page.locator('[name=confirmation]').fill('УДАЛИТЬ');await submit.click();
 await expect(page.getByRole('button',{name:'Обновить сведения о хранилище',exact:true})).toBeVisible();
 expect(Object.keys((await snapshot(page)).packages)).toHaveLength(Object.keys(before.packages).length);
 await page.getByRole('button',{name:'Обновить сведения о хранилище',exact:true}).click();
 await expect(page.locator('.storage-summary')).toBeVisible();await page.locator('[data-action=storage-clear-confirm]').click();
 await page.locator('[name=confirmation]').fill('УДАЛИТЬ');await submit.click();
 await expect(page.locator('.storage-summary')).toBeVisible();
 const after=await snapshot(page);
 for(const key of ['kits','groups','packages','categories'])expect(after[key]).toEqual({});
 expect(fs.readdirSync('.ha-test/medicine_cabinet/images').filter(n=>n.endsWith('.jpg'))).toHaveLength(0);
 await close(page);await page.reload();await page.waitForFunction(()=>window.testHass);
 expect((await snapshot(page)).kits).toEqual({});expect((await snapshot(page)).categories).toEqual({});
});

test('restoring defaults from storage fills an empty catalog and is safe to repeat',async({page},testInfo)=>{
 await change(page,'categories_clear',{});
 const before=await snapshot(page);
 await storage(page);
 const restore=page.getByRole('button',{name:'Восстановить стандартные категории',exact:true});
 await expect(restore).toBeVisible();await restore.click();
 await expect(page.locator('.category-restore-result')).toHaveText('Восстановлено категорий: 21');
 await expect(restore).toBeEnabled();
 const restored=await snapshot(page);
 expect(Object.keys(restored.categories)).toHaveLength(21);
 for(const key of ['kits','groups','packages'])expect(restored[key]).toEqual(before[key]);
 for(const item of Object.values(restored.packages).filter(p=>p.image_id))expect(fs.existsSync(`.ha-test/medicine_cabinet/images/${item.image_id}.jpg`)).toBe(true);
 expect(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 await restore.scrollIntoViewIfNeeded();
 await page.screenshot({path:`tmp/ui-restore-categories-${testInfo.project.name}.png`,fullPage:true});
 await restore.click();await expect(page.locator('.category-restore-result')).toHaveText('Стандартные категории уже добавлены');
 expect((await snapshot(page)).categories).toEqual(restored.categories);
 await close(page);await page.reload();await page.waitForFunction(()=>window.testHass);
 expect((await snapshot(page)).categories).toEqual(restored.categories);
 await settings(page);await expect(page.locator('[data-action=storage-restore-categories]')).toHaveCount(0);
 await expect(page.locator('.category-catalog-list .category-badge')).toHaveCount(21);
});

test('restoration rejects stale storage details and preserves edited and custom categories',async({page})=>{
 await change(page,'categories_clear',{});
 await change(page,'categories_restore',{});
 await change(page,'category_delete',{id:'default_children'});
 await change(page,'category_save',{name:'Детская аптечка',color:'#123456',icon:'mdi:star'});
 await change(page,'category_save',{id:'default_allergy',name:'Своё название',color:'#abcdef',icon:'mdi:cat'});
 await change(page,'category_delete',{id:'default_travel'});
 await storage(page);
 await change(page,'category_save',{name:'Новая категория',color:'#112233',icon:'mdi:bag-suitcase'});
 const before=await snapshot(page);
 const restore=page.getByRole('button',{name:'Восстановить стандартные категории',exact:true});
 await restore.click();
 await expect(page.getByRole('button',{name:'Обновить сведения о хранилище',exact:true})).toBeVisible();
 expect((await snapshot(page)).categories).toEqual(before.categories);
 await page.getByRole('button',{name:'Обновить сведения о хранилище',exact:true}).click();
 await restore.click();await expect(page.locator('.category-restore-result')).toHaveText('Восстановлено категорий: 1');
 const after=await snapshot(page);
 for(const [key,value] of Object.entries(before.categories))expect(after.categories[key]).toEqual(value);
 expect(after.categories.default_children).toBeUndefined();
 expect(after.categories.default_travel.name).toBe('Дорожная аптечка');
 expect(after.packages).toEqual(before.packages);
});

test('storage labels translate to English and controls are hidden for non-admin users',async({page})=>{
 await change(page,'categories_restore',{});
 await page.evaluate(()=>{const call=window.testHass.callWS;window.testHass.callWS=async message=>{const data=await call(message);if(data?.settings)data.settings={...data.settings,language:'en',sidebar_title:'Medicine Box'};return data;};});
 await change(page,'kit_save',{name:'English trigger'});await expect(page.locator('header strong')).toHaveText('Medicine Box');
 await settings(page);await page.getByRole('button',{name:'Data and storage',exact:true}).click();
 await expect(page.getByRole('button',{name:'Download ZIP backup',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Restore default categories',exact:true}).click();
 await expect(page.locator('.category-restore-result')).toHaveText('Default categories are already present');
 await page.locator('[data-action=storage-clear-confirm]').click();
 await expect(page.locator('[name=confirmation]')).toHaveAttribute('pattern','DELETE');
 await close(page);
 await page.evaluate(()=>{window.testHass.user={...window.testHass.user,is_admin:false};});
 await settings(page);await expect(page.locator('[data-action=storage]')).toHaveCount(0);
});
