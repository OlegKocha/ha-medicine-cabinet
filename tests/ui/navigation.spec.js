import { test, expect } from '@playwright/test';

// Exercise the compiled panel in real browsers with a fixed inventory;
// navigation and dialog focus must not require a running HA backend.
async function mountPanel(page, language = 'ru') {
 await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;font-family:Arial}home-assistant{display:block;height:100%}body{--primary-color:#469bc1}</style><home-assistant></home-assistant>');
 await page.addScriptTag({type:'module',path:'custom_components/medicine_cabinet/frontend/medicine-cabinet.js'});
 await page.evaluate(async language=>{
  await customElements.whenDefined('medicine-cabinet-panel');
  const shell=document.querySelector('home-assistant').attachShadow({mode:'open'});
  const panel=document.createElement('medicine-cabinet-panel');
  shell.append(panel);
  const media=matchMedia('(max-width: 870px)');
  const updateLayout=()=>{panel.narrow=media.matches;};
  updateLayout();media.addEventListener('change',updateLayout);
  window.panel=panel;
  window.menuEvents=[];
  document.addEventListener('hass-toggle-menu',event=>window.menuEvents.push({bubbles:event.bubbles,composed:event.composed}));
  const pack=number=>({id:`p${number}`,number,group_id:'medicine',category_ids:[],info:'A saved note',image_id:null,expires_on:'2030-01-01',no_expiry:false,added_at:'2026-09-28T12:00:00+00:00',available:true,status:'ok',days_remaining:1000});
  panel.hass={language,user:{id:'test',is_admin:true},connection:{subscribeMessage:async()=>()=>{}},callWS:async()=>({revision:0,kits:{home:{id:'home',name:'Дача'}},groups:{medicine:{id:'medicine',kit_id:'home',name:'Medicine'}},packages:{p1:pack(1),p2:pack(2)},categories:{},settings:{language,sidebar_title:language==='en'?'Medicine Box':'Аптечка'},today:'2026-09-28',timezone:'Europe/Moscow'})};
 },language);
 await expect(page.locator('#kit')).toHaveValue('home');
 await expect(page.locator('.medicine')).toHaveCount(1);
}

for (const language of ['ru','en']) {
 test(`${language}: adding and editing packages starts on the heading and preserves keyboard focus`,async({page,isMobile,browserName},testInfo)=>{
  await mountPanel(page,language);
  const dialog=page.locator('dialog');
  const close=dialog.locator('.dialog-heading [data-action=close]');
  const activate=locator=>isMobile?locator.tap():locator.click();
  for (const action of ['add','add-pack','edit']) {
   if(action==='edit') await page.locator('.medicine details>summary').click();
   const opener=page.locator(`[data-action=${action}]`).first();
   await activate(opener);
   await expect(dialog.getByRole('heading',{level:2})).toBeFocused();
   await expect(close).not.toBeFocused();
   expect(await close.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('none');
   expect(await dialog.evaluate(el=>el.scrollTop)).toBe(0);
   if(action==='add') await page.screenshot({path:`tmp/ui-add-focus-${language}-${testInfo.project.name}.png`});
   // macOS WebKit uses Option+Tab to include buttons in keyboard navigation.
   await page.keyboard.press(browserName==='webkit' && process.platform==='darwin'?'Alt+Tab':'Tab');
   await expect(close).toBeFocused();
   expect(await close.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
   await page.keyboard.press('Escape');
   await expect(dialog).not.toBeVisible();
   // Keyboard-triggered opening follows the same neutral-focus policy.
   await opener.focus();
   await opener.press('Enter');
   await expect(dialog.getByRole('heading',{level:2})).toBeFocused();
   await page.keyboard.press('Escape');
   await expect(opener).toBeFocused();
  }
  for(const action of ['export','settings']) {
   await activate(page.locator(`[data-action=${action}]`));
   await expect(dialog.getByRole('heading',{level:2})).toBeFocused();
   expect(await close.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('none');
   await page.keyboard.press('Escape');
  }
 });

 test(`${language}: sidebar button follows HA narrow mode and reaches the outer shell`,async({page,isMobile},testInfo)=>{
  await mountPanel(page,language);
  const menu=page.getByRole('button',{name:language==='en'?'Open sidebar':'Открыть боковое меню',exact:true});
  await page.setViewportSize({width:1280,height:900});
  await expect(menu).toBeHidden();
  await page.setViewportSize({width:390,height:844});
  await expect(menu).toBeVisible();
  const bounds=await menu.boundingBox();
  expect(bounds.width).toBeGreaterThanOrEqual(44);
  expect(bounds.height).toBeGreaterThanOrEqual(44);
  await (isMobile?menu.tap():menu.click());
  expect(await page.evaluate(()=>window.menuEvents)).toEqual([{bubbles:true,composed:true}]);
  await menu.focus();
  await menu.press('Enter');
  expect(await page.evaluate(()=>window.menuEvents.length)).toBe(2);
  expect(await page.locator('header').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await page.screenshot({path:`tmp/ui-sidebar-${language}-${testInfo.project.name}.png`});
  // Changing HA layout must not reconstruct the panel or lose a form draft.
  await page.locator('[data-action=add]').click();
  await page.locator('[name=name]').fill('Draft medicine');
  await page.setViewportSize({width:1280,height:900});
  await expect(menu).toBeHidden();
  await expect(page.locator('[name=name]')).toHaveValue('Draft medicine');
  await page.keyboard.press('Escape');
  // The HA-provided property is authoritative, not user-agent detection.
  await page.evaluate(()=>{window.panel.narrow=true;});
  await expect(menu).toBeVisible();
  await page.evaluate(()=>{window.panel.narrow=false;});
  await expect(menu).toBeHidden();
 });
}
