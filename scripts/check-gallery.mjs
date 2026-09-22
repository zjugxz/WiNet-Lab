import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');
const outDir = base === '/' ? './dist' : './.tools/base-dist';
const port = base === '/' ? 4330 : 4331;
const baseUrl = `http://127.0.0.1:${port}${base}`;

const groups = [
  { title: 'Lab dinner', photo: 'dinner-2024' },
  { title: 'Team outing', photo: 'outing-2025' },
  { title: 'Group photo', photo: 'group-2026' },
];

const server = await preview({
  base,
  outDir,
  server: { host: '127.0.0.1', port },
});
const browser = await chromium.launch();
const context = await browser.newContext();
try {
  const page = await context.newPage();
  const failed = [];
  page.on('response', (response) => {
    if (response.status() >= 400)
      failed.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => failed.push(request.url()));

  await page.goto(`${baseUrl}gallery/`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Gallery | WiNet Lab');
  await expectHeadings();
  const thumbs = page.locator('.gallery-thumb img');
  await expectCount(await thumbs.count(), 3, 'thumbnails');
  for (const photo of ['dinner-2024', 'outing-2025', 'group-2026']) {
    const thumb = page.locator(`[data-gallery-open="${photo}"] img`);
    assert(
      await thumb.evaluate(
        (img, siteBase) =>
          img.complete &&
          img.naturalWidth > 0 &&
          new URL(img.currentSrc, location.href)
            .pathname.startsWith(`${siteBase}gallery/`) &&
          img.currentSrc.endsWith('.webp'),
        base,
      ),
      `${photo} must load as WebP under the site base`,
    );
  }
  assert.equal(
    await page.locator('.gallery-empty').count(),
    0,
    'Empty state must be gone',
  );

  // Lightbox: open, navigate, close.
  const dialog = page.locator('gallery-lightbox dialog');
  await page.locator(`[data-gallery-open="dinner-2024"]`).click();
  assert(await dialog.evaluate((node) => node.open));
  await expectCaption(0);
  assert(
    await dialog.locator('[data-lightbox-photo]').evaluate(
      (img) => img.complete && img.naturalWidth > 0,
    ),
    'Lightbox photo must load',
  );
  await page.keyboard.press('ArrowRight');
  await expectCaption(1);
  await page.locator('[data-lightbox-next]').click();
  await expectCaption(2);
  await page.locator('[data-lightbox-prev]').click();
  await expectCaption(1);
  await page.keyboard.press('ArrowLeft');
  await expectCaption(0);
  await page.screenshot({
    path: `.tools/gallery-lightbox-${base === '/' ? 'root' : 'base'}-1440.png`,
  });
  let scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(
    scan.violations,
    [],
    `Open lightbox a11y: ${JSON.stringify(scan.violations.map((v) => v.id))}`,
  );
  await page.keyboard.press('Escape');
  assert(!(await dialog.evaluate((node) => node.open)));
  await page.locator(`[data-gallery-open="group-2026"]`).click();
  assert(await dialog.evaluate((node) => node.open));
  await expectCaption(2);
  await page.mouse.click(4, 4);
  await page.waitForFunction(
    () => document.querySelector('gallery-lightbox dialog')?.open === false,
  );

  scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(scan.violations, []);
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow at ${width}px`,
    );
  }
  assert.deepEqual(failed, [], 'No failed requests');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: `.tools/gallery-${base === '/' ? 'root' : 'base'}-1440.png`,
    fullPage: true,
  });
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 900 });
  await mobile.goto(`${baseUrl}gallery/`, { waitUntil: 'networkidle' });
  await mobile.screenshot({
    path: `.tools/gallery-${base === '/' ? 'root' : 'base'}-390.png`,
    fullPage: true,
  });

  console.log(`Gallery checks passed (3 groups, lightbox, base ${base || '/'})`);

  async function expectHeadings() {
    const headings = await page
      .locator('.gallery-group h2')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent));
    assert.deepEqual(headings, groups.map((group) => group.title));
  }
  async function expectCaption(index) {
    const caption = await dialog
      .locator('.lightbox-caption')
      .textContent();
    assert.equal(caption, groups[index].title);
    assert.equal(
      await dialog.locator('[data-lightbox-counter]').textContent(),
      `${index + 1} / ${groups.length}`,
    );
  }
} finally {
  await context.close();
  await browser.close();
  await server.stop();
}
async function expectCount(actual, expected, label) {
  assert.equal(actual, expected, `${label} count`);
}
