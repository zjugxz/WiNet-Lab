import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');
const outDir = base === '/' ? './dist' : './.tools/base-dist';
const port = base === '/' ? 4326 : 4325;
const baseUrl = `http://127.0.0.1:${port}${base}`;

const names = {
  'Principal Investigator': ['Xiuzhen Guo'],
  'Ph.D. Students': [
    'Haobo Zhang',
    'Hongyu Wang',
    'Junying Huang',
    'Long Tan',
    'Xiangguang Wang',
    'Yifan Yan',
    'Yu Cao',
    'Zikang Zhang',
  ],
  'Master Students': [
    'Binghe Li',
    'Gaoming Yang',
    'Tianyou Li',
    'Xu Chen',
    'Yaobin Zhu',
    'Zeyang Yang',
    'Zhou Yang',
  ],
};
const allNames = Object.values(names).flat();

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
  await page.goto(`${baseUrl}people/`, { waitUntil: 'networkidle' });

  assert.equal(await page.title(), 'People | WiNet Lab');
  for (const heading of Object.keys(names)) {
    await page
      .getByRole('heading', { name: heading, exact: true })
      .isVisible();
  }
  for (const name of allNames) {
    await page.getByRole('heading', { name, exact: true }).isVisible();
  }

  const photos = page.locator('.people-photo img');
  assert.equal(await photos.count(), allNames.length);
  for (const name of allNames) {
    const photo = page.getByRole('img', { name: `Photo of ${name}` });
    assert(
      await photo.evaluate(
        (img, siteBase) =>
          img.complete &&
          img.naturalWidth > 0 &&
          new URL(img.currentSrc, location.href)
            .pathname.startsWith(`${siteBase}people/`) &&
          img.currentSrc.endsWith('.webp'),
        base,
      ),
      `Photo of ${name} must load as WebP under the site base`,
    );
  }

  const sectionIds = await page
    .locator('.people-section h2')
    .evaluateAll((elements) => elements.map((e) => e.textContent));
  assert.deepEqual(sectionIds, Object.keys(names));
  const firstCardName = await page
    .locator('.people-card h3')
    .first()
    .textContent();
  assert.equal(firstCardName, 'Xiuzhen Guo');
  const role = await page.locator('.people-role').textContent();
  assert.equal(role, 'Tenure-track Assistant Professor');
  const piBio = await page.locator('.people-card-featured .people-bio').textContent();
  assert(piBio.includes('国家自然科学基金青B项目'));
  assert(piBio.includes('浙江省杰出青年科学基金'));
  assert.equal(await page.locator('.people-card-featured').count(), 1);
  assert.equal(await page.locator('.people-card-grid').count(), 15);

  const scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(
    scan.violations,
    [],
    `Accessibility violations: ${JSON.stringify(
      scan.violations.map((v) => v.id),
    )}`,
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
    path: `.tools/people-${base === '/' ? 'root' : 'base'}-1440.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({
    path: `.tools/people-${base === '/' ? 'root' : 'base'}-390.png`,
    fullPage: true,
  });
  console.log(
    `People page checks passed (${allNames.length} members, base ${base || '/'})`,
  );
} finally {
  await context.close();
  await browser.close();
  await server.stop();
}
