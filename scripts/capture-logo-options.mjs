import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1140, height: 650 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(
    new URL('../docs/design/logo-options/index.html', import.meta.url).href,
  );
  await page.locator('article').last().waitFor();
  await page.waitForFunction(() =>
    [...document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
  assert.equal(await page.locator('article').count(), 3);
  assert.equal(await page.locator('img').count(), 6);
  await page.screenshot({
    path: fileURLToPath(
      new URL('../docs/design/logo-options/comparison.png', import.meta.url),
    ),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: fileURLToPath(
      new URL(
        '../docs/design/logo-options/comparison-mobile.png',
        import.meta.url,
      ),
    ),
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    'Three logo concepts rendered; six SVG uses loaded; mobile layout fits; no script errors.',
  );
} finally {
  await browser.close();
}
