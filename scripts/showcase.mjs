import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('recordings', { recursive: true });
const browser = await chromium.launch({
  headless: process.env.SHOWCASE_HEADLESS !== 'false',
  slowMo: 80,
});
const context = await browser.newContext({
  viewport: { width: 432, height: 768 },
  deviceScaleFactor: 1,
  recordVideo: { dir: 'recordings', size: { width: 432, height: 768 } },
});
const page = await context.newPage();
const date = new Date();
date.setUTCDate(date.getUTCDate() + 21);
const arrival = date.toISOString().slice(0, 10);
date.setUTCDate(date.getUTCDate() + 3);
const departure = date.toISOString().slice(0, 10);
date.setUTCDate(date.getUTCDate() + 1);
const extended = date.toISOString().slice(0, 10);
await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3000);
const destination = page.getByRole('combobox', { name: /Destination/ });
await destination.fill('Dolo');
await page.waitForTimeout(650);
await destination.press('ArrowDown');
await destination.press('Enter');
await page.getByRole('button', { name: /When/ }).click();
await page.getByLabel('Check-out', { exact: true }).fill(departure);
await page.getByLabel('Check-in', { exact: true }).fill(arrival);
await page.waitForTimeout(700);
await page.getByRole('dialog').getByRole('button', { name: 'Done', exact: true }).click();
await page.getByRole('button', { name: 'Find my stay' }).click();
await page.getByRole('button', { name: 'Filters', exact: true }).click();
await page.getByLabel('Place type').selectOption('Cabin');
await page.getByRole('button', { name: 'Show stays' }).click();
await page.locator('.stay-card').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(2300);
await page.getByRole('link', { name: 'Stillhaus · Ridge Cabin', exact: true }).click();
await page.locator('.property-gallery').scrollIntoViewIfNeeded();
await page.waitForTimeout(1800);
await page
  .getByRole('button', { name: /Open gallery:/ })
  .first()
  .click();
await page.getByRole('button', { name: 'Next photo' }).click();
await page.waitForTimeout(2500);
await page.keyboard.press('Escape');
await page.getByRole('button', { name: 'Save The Ridge Cabin', exact: true }).click();
await page
  .locator('#availability')
  .evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
await page.waitForTimeout(1800);
await page.getByLabel('Check-out', { exact: true }).fill(extended);
await page.waitForTimeout(3000);
await page.getByRole('link', { name: 'Reserve this stay' }).click();
await page
  .locator('.reservation-summary')
  .evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
await page.waitForTimeout(3600);
const video = page.video();
await context.close();
console.log('Rehearsal recording:', await video.path());
await browser.close();
