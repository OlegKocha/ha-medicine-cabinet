import {test,expect} from '@playwright/test';
import fs from 'node:fs';

async function change(page,operation,payload){
 return page.evaluate(async({operation,payload})=>{
  const state=await window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'});
  return window.testHass.callWS({type:'medicine_cabinet/request',operation,payload,revision:state.revision});
 },{operation,payload});
}
async function snapshot(page){return page.evaluate(()=>window.testHass.callWS({type:'medicine_cabinet/request',operation:'list'}));}
async function kitId(page){return page.locator('#kit').inputValue();}
async function packages(page){const state=await snapshot(page);const kit=await kitId(page);return Object.values(state.packages).filter(p=>state.groups[p.group_id].kit_id===kit);}
async function settings(page){await page.locator('[data-action=settings]').click();}
async function start(page){await settings(page);await page.locator('[data-action=audit-start]').click();}
async function close(page){await page.locator('dialog .dialog-heading [data-action=close]').click();}
async function auditCategories(page){
 // Own the fixtures: other suites intentionally delete the shared category catalog.
 const ids=[];
 for(const name of ['Ревизия: детская аптечка','Ревизия: дорожная аптечка']){
  const data=await change(page,'category_save',{name,color:'#5786b8',icon:'mdi:pill'});
  ids.push(Object.values(data.categories).find(category=>category.name===name).id);
 }
 return ids;
}

test.beforeEach(async({page},testInfo)=>{
 const access=JSON.parse(fs.readFileSync('.ha-test/access.json','utf8'));
 await page.addInitScript(value=>{window.DEV_ACCESS=value;},access);
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='127.0.0.1'||url.protocol==='blob:')return route.continue();
  throw new Error(`Unexpected external request: ${url}`);
 });
 await page.goto('/test-panel');await page.waitForFunction(()=>window.testHass);
 const name=`Ревизия ${testInfo.project.name} ${Date.now()}`;
 const data=await change(page,'kit_save',{name});
 const kit=Object.values(data.kits).find(k=>k.name===name).id;
 await expect(page.locator(`#kit option[value="${kit}"]`)).toHaveCount(1);
 await page.locator('#kit').selectOption(kit);
});

test('quantity defaults to one, supports buttons and typing, and creates independent packages atomically',async({page})=>{
 const [children]=await auditCategories(page);
 await page.locator('.toolbar [data-action=add]').click();
 const count=page.getByRole('spinbutton',{name:'Количество упаковок'});
 await expect(count).toHaveValue('1');
 await page.getByRole('button',{name:'Уменьшить количество',exact:true}).click();await expect(count).toHaveValue('1');
 await page.getByRole('button',{name:'Увеличить количество',exact:true}).click();await expect(count).toHaveValue('2');
 await count.fill('3');
 await page.locator('[name=name]').fill('Пенталгин');await page.locator('[name=info]').fill('Общая заметка');
 await page.locator('[name=expires_on]').fill('2030-01-01');
 await page.locator('[name=photo]').setInputFiles('tests/fixtures/photo.png');
 await page.locator('.category-picker>summary').click();await page.locator(`[name=category_choice][value="${children}"]`).check();
 const before=await snapshot(page);
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();await expect(page.locator('dialog')).not.toBeVisible();
 const added=await packages(page);expect(added).toHaveLength(3);expect(new Set(added.map(p=>p.id)).size).toBe(3);
 expect((await snapshot(page)).revision).toBe(before.revision+1);
 for(const item of added){expect(item.category_ids).toEqual([children]);expect(item.info).toBe('Общая заметка');expect(item.expires_on).toBe('2030-01-01');expect(item.image_id).toBe(added[0].image_id);}
 expect(added[0].image_id).toBeTruthy();
 await expect(page.locator('.medicine')).toHaveCount(1);
 await page.locator('[data-action=add-pack]').click();await expect(count).toHaveValue('1');
 await page.locator('[name=no_expiry]').check();await count.fill('101');await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await expect(page.locator('dialog')).toBeVisible();expect(await packages(page)).toHaveLength(3);
 await count.fill('');await page.getByRole('button',{name:'Сохранить',exact:true}).click();await expect(page.locator('dialog')).not.toBeVisible();
 expect(await packages(page)).toHaveLength(4);
 await page.locator('.medicine details>summary').click();await page.locator('[data-action=edit]').first().click();
 await expect(count).toHaveCount(0);
});

test('compact view keeps categories visible, expands package details and persists across reloads',async({page},testInfo)=>{
 const kit=await kitId(page);const [children,travel]=await auditCategories(page);
 await change(page,'package_save',{kit_id:kit,name:'Пенталгин',count:2,no_expiry:true,category_ids:[children,travel],info:'Заметка'});
 await expect(page.locator('.medicine')).toHaveCount(1);
 await settings(page);await page.getByRole('button',{name:'Компактный',exact:true}).click();
 await expect(page.getByRole('button',{name:'Компактный',exact:true})).toHaveAttribute('aria-pressed','true');await close(page);
 const card=page.locator('.compact-medicine');await expect(card).toHaveCount(1);
 await expect(card.locator(':scope>summary .category-badge')).toHaveCount(2);
 await expect(card.locator('.pack').first()).not.toBeVisible();
 await card.locator(':scope>summary').click();await expect(card.locator('.pack').first()).toBeVisible();
 await expect(card.locator('.pack')).toHaveCount(2);await expect(card.locator('.pack').first()).toContainText('Заметка');
 await page.locator('#query').fill('нет совпадений');await expect(card).toHaveCount(0);await page.locator('.reset-filters').click();await expect(card).toHaveCount(1);
 await page.reload();await expect(card).toHaveCount(1);await expect(card).not.toHaveAttribute('open');
 await page.screenshot({path:`tmp/ui-compact-${testInfo.project.name}.png`,fullPage:true});
 await settings(page);await page.getByRole('button',{name:'Развёрнутый',exact:true}).click();await close(page);
 await expect(card).toHaveCount(0);await expect(page.locator('.medicine-header')).toHaveCount(1);
});

test('stocktake choices can be corrected, finish stays visible, and partial results preserve untouched packages',async({page},testInfo)=>{
 const kit=await kitId(page);const [children]=await auditCategories(page);
 await change(page,'package_save',{kit_id:kit,name:'Пенталгин',count:8,expires_on:'2030-01-01',info:'Заметка',category_ids:[children]});
 await expect(page.locator('.medicine')).toHaveCount(1);
 const before=await packages(page);
 await page.locator('#query').fill('ничего');await start(page);
 await expect(page.locator('.audit-pack')).toHaveCount(8);await expect(page.locator('.filters')).toBeHidden();
 const first=page.locator('.audit-pack').nth(0),second=page.locator('.audit-pack').nth(1);
 await first.getByRole('button',{name:'На месте',exact:true}).click();
 await expect(first.locator('[data-state=present]')).toHaveAttribute('aria-pressed','true');
 await first.getByRole('button',{name:'Закончилась',exact:true}).click();
 await expect(first.locator('[data-state=present]')).toHaveAttribute('aria-pressed','false');
 await expect(first.locator('[data-state=finished]')).toHaveAttribute('aria-pressed','true');
 await second.getByRole('button',{name:'Не нашёл',exact:true}).click();
 await expect(page.locator('.audit-progress-text')).toHaveText('Проверено: 2 из 8');
 expect((await packages(page)).every(p=>p.available)).toBe(true);
 await page.locator('.audit-pack').last().scrollIntoViewIfNeeded();
 const finish=page.locator('[data-action=audit-finish]');
 const rect=await finish.boundingBox();expect(rect.y).toBeGreaterThanOrEqual(0);expect(rect.y+rect.height).toBeLessThanOrEqual(page.viewportSize().height);
 await page.screenshot({path:`tmp/ui-stocktake-${testInfo.project.name}.png`,fullPage:true});
 await finish.click();await page.getByRole('button',{name:'Вернуться к ревизии',exact:true}).click();
 await expect(page.locator('.audit-progress-text')).toHaveText('Проверено: 2 из 8');
 await finish.click();await page.getByRole('button',{name:'Сохранить и завершить',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Ревизия завершена',exact:true})).toBeVisible();
 await expect(page.locator('.audit-missing')).toContainText('Пенталгин');
 const after=await packages(page);expect(after[0].available).toBe(false);
 for(const item of after.slice(1))expect(item).toEqual(before.find(p=>p.id===item.id));
 expect((await snapshot(page)).kits[kit].last_audit.counts).toEqual({present:0,finished:1,missing:1});
 await close(page);await expect(page.locator('#query')).toHaveValue('ничего');
 await page.reload();await settings(page);await page.locator('[data-action=audit-result]').click();
 await expect(page.locator('.audit-missing')).toContainText('Упаковка №2');
});

test('stocktake can finish immediately and clearing a choice returns it to unchecked',async({page})=>{
 const kit=await kitId(page);await change(page,'package_save',{kit_id:kit,name:'Пластырь',no_expiry:true});
 await expect(page.locator('.medicine')).toHaveCount(1);const before=await packages(page);
 await start(page);await page.locator('[data-action=audit-finish]').click();await page.getByRole('button',{name:'Сохранить и завершить',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Ревизия завершена',exact:true})).toBeVisible();expect(await packages(page)).toEqual(before);await close(page);
 await start(page);await page.locator('[data-state=finished]').click();await page.locator('[data-action=audit-clear]').click();
 await expect(page.locator('.audit-progress-text')).toHaveText('Проверено: 0 из 1');
 await expect(page.locator('.audit-choices [aria-pressed=true]')).toHaveCount(0);
});

test('conflicting stocktake refreshes explicitly and retains only unchanged package choices',async({page})=>{
 const kit=await kitId(page);await change(page,'package_save',{kit_id:kit,name:'Пенталгин',no_expiry:true,count:3});
 await expect(page.locator('.medicine')).toHaveCount(1);const before=await packages(page);
 await start(page);
 for(const row of await page.locator('.audit-pack').all())await row.locator('[data-state=finished]').click();
 await change(page,'package_save',{id:before[0].id,kit_id:kit,group_id:before[0].group_id,no_expiry:true,info:'Изменено с другого устройства'});
 await change(page,'package_save',{kit_id:kit,name:'Новая упаковка',no_expiry:true});
 await page.locator('[data-action=audit-finish]').click();await page.getByRole('button',{name:'Сохранить и завершить',exact:true}).click();
 await expect(page.locator('[data-action=audit-refresh]')).toBeVisible();expect((await packages(page)).every(p=>p.available)).toBe(true);
 await page.locator('[data-action=audit-refresh]').click();await expect(page.locator('.audit-progress-text')).toHaveText('Проверено: 2 из 4');
 const changed=page.locator(`.audit-pack[data-package="${before[0].id}"]`);await expect(changed.locator('[aria-pressed=true]')).toHaveCount(0);
 await page.locator('[data-action=audit-finish]').click();await page.getByRole('button',{name:'Сохранить и завершить',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Ревизия завершена',exact:true})).toBeVisible();
 const after=await packages(page);expect(after.find(p=>p.id===before[0].id).available).toBe(true);expect(after.filter(p=>!p.available)).toHaveLength(2);
});

test('English settings, quantity and stocktake labels are translated',async({page})=>{
 await page.evaluate(()=>{const call=window.testHass.callWS;window.testHass.callWS=async message=>{const data=await call(message);if(data?.settings)data.settings={...data.settings,language:'en',sidebar_title:'Medicine Box'};return data;};});
 const kit=await kitId(page);await change(page,'package_save',{kit_id:kit,name:'Medicine',no_expiry:true});
 await expect(page.locator('header strong')).toHaveText('Medicine Box');
 await page.locator('.toolbar [data-action=add]').click();await expect(page.getByRole('spinbutton',{name:'Number of packages'})).toHaveValue('1');await close(page);
 await settings(page);await expect(page.getByRole('button',{name:'Compact',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Start stocktake',exact:true}).click();await page.getByRole('button',{name:'Present',exact:true}).click();
 await expect(page.locator('.audit-progress-text')).toHaveText('Checked: 1 of 1');
 await page.getByRole('button',{name:'Finish stocktake',exact:true}).click();await page.getByRole('button',{name:'Save and finish',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Stocktake complete'})).toBeVisible();
});
