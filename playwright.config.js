import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/ui',
  timeout: 45000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:18123', trace: 'retain-on-failure' },
  reporter: 'list',
  projects: [
    {name:'desktop',use:{viewport:{width:1280,height:900}}},
    {name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
    {name:'webkit-desktop',testMatch:['**/picker.spec.js','**/medicine.spec.js','**/categories.spec.js','**/navigation.spec.js','**/stocktake.spec.js'],use:{browserName:'webkit',viewport:{width:1280,height:900}}},
    {name:'webkit-mobile',testMatch:['**/picker.spec.js','**/medicine.spec.js','**/categories.spec.js','**/navigation.spec.js','**/stocktake.spec.js'],use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  ],
});
