import { test,expect } from '@playwright/test';
test('complete simulation, recovery, export and used quota',async({page})=>{
 await page.goto('/simulator');
 await page.getByLabel('Your startup idea').fill('A subscription tool that helps independent bookshops manage inventory.');
 await page.getByLabel('Monthly operating cost (USD)').fill('100');
 await page.getByRole('button',{name:'Begin simulation',exact:true}).click();
 await expect(page.getByTestId('sim-day')).toHaveText('Day 0');
 await expect(page.getByRole('button',{name:'Interview potential customers',exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('button',{name:'Interview potential customers',exact:true})).toBeVisible();
 for(const day of [5,90,120,150,180]){
  await page.getByRole('button',{name:'Interview potential customers',exact:true}).click();
  await expect(page.getByTestId('sim-day')).toHaveText('Day '+day);
 }
 await expect(page.getByRole('heading',{name:'Simulation complete',exact:true})).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export local record',exact:true}).click();expect((await download).suggestedFilename()).toContain('.json');
 await page.getByRole('button',{name:'Start another simulation',exact:true}).click();
 await expect(page.getByText('Your free simulation has been used.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('language switch preserves setup, corrupted storage is recoverable, IME does not submit',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('gs_game_state','{broken'));
 await page.goto('/simulator');
 await expect(page.getByText('A previous local save is available for export.',{exact:true})).toBeVisible();
 const idea=page.getByLabel('Your startup idea');await idea.fill('保留这段输入');
 await page.getByLabel('Language').selectOption('zh');
 await expect(page.getByLabel('你的创业想法')).toHaveValue('保留这段输入');
 await expect(page.locator('html')).toHaveAttribute('lang','zh');
 await page.getByLabel('每月运营成本（美元）').fill('100');
 await page.getByRole('button',{name:'开始模拟',exact:true}).click();
 const input=page.getByLabel('你的决策');await input.fill('正在输入');
 await input.dispatchEvent('keydown',{key:'Enter',isComposing:true});
 await expect(page.getByTestId('sim-day')).toHaveText('第 0 天');
});
test('failed inference preserves decision and allows explicit retry',async({page})=>{
 await page.goto('/simulator');
 await page.getByLabel('Your startup idea').fill('A booking tool for independent workshops.');
 let failed=false;
 await page.route('**/api/simulations/*/turn',async route=>{if(!failed){failed=true;await route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'AI_UNAVAILABLE',code:'AI_UNAVAILABLE',requestId:'test'})});}else await route.continue();});
 await page.getByRole('button',{name:'Begin simulation',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
 await page.getByRole('button',{name:'Try again',exact:true}).click();
 await expect(page.getByRole('button',{name:'Interview potential customers',exact:true})).toBeVisible();
});
