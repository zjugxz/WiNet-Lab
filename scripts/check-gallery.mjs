import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');
const outDir = base === '/' ? './dist' : './.tools/base-dist';
const port = base === '/' ? 4330 : 4331;
const baseUrl = `http://127.0.0.1:${port}${base}`;

// Newest first.
const groups = [
  { title: 'Group photo', date: '2026', photo: 'group-2026' },
  { title: 'Team outing', date: '2025', photo: 'outing-2025' },
  { title: 'Lab dinner', date: '2024', photo: 'dinner-2024' },
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
  const headings = await page
    .locator('.gallery-group h2')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent));
  assert.deepEqual(headings, groups.map((group) => group.title));
  const dates = await page
    .locator('.gallery-group-date')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent));
  assert.deepEqual(dates, groups.map((group) => group.date));

  const photos = page.locator('.gallery-photo');
  assert.equal(await photos.count(), 3);
  for (const img of await photos.all()) {
    assert(
      await img.evaluate(
        (node, siteBase) => {
          const image = node;
          return (
            image.complete &&
            image.naturalWidth > 0 &&
            new URL(image.currentSrc, location.href)
              .pathname.startsWith(`${siteBase}gallery/`) &&
            image.currentSrc.endsWith('.webp')
          );
        },
        base,
      ),
      'Every gallery photo must load as WebP under the site base',
    );
  }
  // No lightbox or clickable photo controls anywhere.
  assert.equal(await page.locator('dialog').count(), 0);
  assert.equal(
    await page
      .locator('[data-lightbox-photo], [data-lightbox-prev], [data-lightbox-next], [data-lightbox-close]')
      .count(),
    0,
    'No lightbox controls may remain',
  );
  assert.equal(
    await page.locator('.gallery-page button, .gallery-page a').count(),
    0,
    'Gallery photos are static, not clickable controls',
  );
  assert.equal(await page.locator('.gallery-empty').count(), 0);
  // Uniform tiles: identical rendered size within the grid.
  const boxes = await page
    .locator('.gallery-photo')
    .evaluateAll((nodes) => {
      const rects = nodes.map((node) => {
        const r = node.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      });
      return [...new Set(rects)];
    });
  assert.equal(boxes.length, 1, `Photos must share one size, got ${boxes}`);
  // Desktop grids use three equal columns per row.
  await page.setViewportSize({ width: 1440, height: 900 });
  const columnCheck = await page.evaluate(() => {
    const grid = document.querySelector('.gallery-grid');
    const photo = grid?.querySelector('.gallery-photo');
    if (!grid || !photo) return null;
    const g = grid.getBoundingClientRect();
    const p = photo.getBoundingClientRect();
    return { grid: g.width, photo: p.width };
  });
  assert.ok(columnCheck, 'Gallery grid must exist');
  const expectedColumn = (columnCheck.grid - 2 * 16) / 3;
  assert.ok(
    Math.abs(columnCheck.photo - expectedColumn) < 8,
    `Each photo should fill one of three columns (${expectedColumn.toFixed(0)}px), got ${columnCheck.photo.toFixed(0)}px`,
  );

  const scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(
    scan.violations,
    [],
    `Gallery a11y: ${JSON.stringify(scan.violations.map((v) => v.id))}`,
  );
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

  console.log(
    `Gallery checks passed (newest-first groups, static photos, base ${base || '/'})`,
  );
} finally {
  await context.close();
  await browser.close();
  await server.stop();
}
