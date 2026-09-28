import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('complete discovery, filter, save, gallery and reservation journey', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('combobox', { name: /Destination/ }).fill('Dolomites, Italy');
  await page.getByRole('button', { name: /When/ }).click();
  await page.getByLabel('Check-in', { exact: true }).fill('2027-03-12');
  await page.getByLabel('Check-out', { exact: true }).fill('2027-03-15');
  await page.getByRole('dialog').getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: /Who.*guests/ }).click();
  await page.getByRole('button', { name: 'More children' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Find my stay' }).click();
  await expect(page).toHaveURL(/destination=Dolomites/);
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByLabel('Place type').selectOption('Cabin');
  await page.getByRole('button', { name: 'Show stays' }).click();
  await expect(page.locator('.stay-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Stillhaus · Ridge Cabin', exact: true }).click();
  await page.getByRole('button', { name: 'Save The Ridge Cabin', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Unsave The Ridge Cabin' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const gallery = page.getByRole('button', { name: /Open gallery:/ }).first();
  await gallery.click();
  await page.getByRole('button', { name: 'Next photo' }).click();
  await expect(page.locator('.gallery-top')).toContainText('02');
  await page.keyboard.press('Escape');
  await expect(gallery).toBeFocused();
  await expect(page.locator('.total dd')).toHaveText('€993.40');
  await page.getByRole('link', { name: 'Reserve this stay' }).click();
  await page.getByRole('button', { name: 'Review reservation' }).click();
  await expect(page.getByLabel('First name', { exact: true })).toBeFocused();
  await page.getByLabel('First name', { exact: true }).fill('Alex');
  await page.getByLabel('Last name', { exact: true }).fill('River');
  await page.getByLabel('Email address', { exact: true }).fill('alex@example.com');
  await page.getByLabel(/I’ve read and accept/).check();
  await page.getByRole('button', { name: 'Review reservation' }).click();
  await expect(page.getByRole('heading', { name: 'One last look.' })).toBeFocused();
  await expect(page.locator('.review-details')).toContainText('1 child');
  await page.getByRole('button', { name: 'Confirm reservation' }).click();
  await expect(page).toHaveURL('/reservation/confirmed');
  await expect(page.getByRole('heading', { name: /Somewhere to look forward to/ })).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).not.toContain(
    'alex@example.com',
  );
  expect(errors).toEqual([]);
  await page.reload();
  await expect(page.getByRole('link', { name: 'Explore stays' })).toBeVisible();
});
test('mobile filters, no-results recovery, map synchronization and saved persistence', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/stays?destination=Atlantis');
  await expect(page.getByRole('heading', { name: 'No stays for this search.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset search' }).click();
  await expect(page.locator('.stay-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Map view' }).click();
  const pin = page.getByRole('button', { name: /The Sea Terrace, Mallorca/ });
  await pin.click();
  await expect(page.locator('.map-selection .card-title')).toHaveText('Casa Brisa · Sea Terrace');
  await page.getByRole('button', { name: 'Save The Sea Terrace', exact: true }).click();
  await page.goto('/saved');
  await page.reload();
  await expect(page.locator('.stay-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Unsave The Sea Terrace' }).click();
  await expect(page.getByRole('heading', { name: 'Your next escape starts here.' })).toBeVisible();
});
test('date errors, blocked dates and a missing property recover cleanly', async ({ page }) => {
  await page.goto('/stays/stillhaus-ridge-cabin?checkin=2026-12-24&checkout=2026-12-27', {
    waitUntil: 'networkidle',
  });
  await expect(
    page.getByText('These dates are unavailable. Try another date range.'),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose available dates' })).toBeDisabled();
  await page.getByLabel('Check-in', { exact: true }).fill('2027-03-15');
  await page.getByLabel('Check-out', { exact: true }).fill('2027-03-12');
  await expect(page.getByText('Departure must be after arrival.')).toBeVisible();
  await page.goto('/stays/not-a-real-stay');
  await expect(page.getByRole('heading', { name: 'This path ends here.' })).toBeVisible();
});
test('keyboard search dialog traps focus and restores it', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  const trigger = page.getByRole('button', { name: /Who.*guests/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(
      true,
    );
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('every mobile map pin is reachable by touch-sized pointer selection', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/stays?view=map');
  const pins = page.locator('.map-pin');
  await expect(pins).toHaveCount(12);
  for (const pin of await pins.all()) {
    await pin.click();
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
  }
});

test('image failure and incomplete search dates recover without losing the controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/_next/image?**', (route) => route.abort());
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.hero .image-fallback')).toBeVisible();
  await page.getByRole('button', { name: /When/ }).click();
  await page.getByLabel('Check-out', { exact: true }).fill('');
  await page.getByRole('dialog').getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Find my stay' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText(
    'Choose both your arrival and departure dates.',
  );
  await expect(page).toHaveURL('/');
});

for (const path of [
  '/',
  '/stays',
  '/stays/stillhaus-ridge-cabin',
  '/saved',
  '/reserve/stillhaus-ridge-cabin',
]) {
  test(`WCAG automated scan: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    const labels = await new AxeBuilder({ page })
      .withRules(['label-content-name-mismatch'])
      .analyze();
    expect(labels.violations).toEqual([]);
  });
}

test('production image optimizer returns a resized image instead of the original', async ({
  page,
}) => {
  await page.goto('/');
  const width = await page.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image.naturalWidth);
        image.onerror = () => reject(new Error('Optimized image failed to load'));
        image.src = '/_next/image?url=%2Fimages%2Falpine.webp&w=640&q=75';
      }),
  );
  expect(width).toBe(640);
});
