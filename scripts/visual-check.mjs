import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const viewports = [
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];
const report = [];
for (const [width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  for (const [name, path] of [
    ['home', '/'],
    ['results', '/stays'],
    ['detail', '/stays/stillhaus-ridge-cabin'],
    ['reserve', '/reserve/stillhaus-ridge-cabin'],
  ]) {
    errors.length = 0;
    await page.goto('http://127.0.0.1:3000' + path, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `docs/screenshots/${name}-${width}-viewport.png` });
    await page.screenshot({ path: `docs/screenshots/${name}-${width}.png`, fullPage: true });
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.images]
        .filter((i) => i.getClientRects().length > 0 && (!i.complete || i.naturalWidth === 0))
        .map((i) => i.src),
    }));
    report.push({ name, width, height, ...metrics, errors: [...errors] });
  }
  await page.close();
}
await fs.writeFile('docs/screenshots/verification.json', JSON.stringify(report, null, 2));
console.log(`${report.length} responsive checks saved to docs/screenshots/verification.json`);
await browser.close();
if (report.some((r) => r.overflow || r.brokenImages.length || r.errors.length)) {
  throw new Error('Visual checks found overflow, broken images, or browser errors.');
}
