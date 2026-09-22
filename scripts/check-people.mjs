import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');
const outDir = base === '/' ? './dist' : './.tools/base-dist';
const port = base === '/' ? 4326 : 4325;
const baseUrl = `http://127.0.0.1:${port}${base}`;

const sections = {
  'Principal Investigator': [['xiuzhen-guo', 'Xiuzhen Guo']],
  'Ph.D. Students': [
    ['haobo-zhang', 'Haobo Zhang'],
    ['hongyu-wang', 'Hongyu Wang'],
    ['junying-huang', 'Junying Huang'],
    ['long-tan', 'Long Tan'],
    ['xiangguang-wang', 'Xiangguang Wang'],
    ['yifan-yan', 'Yifan Yan'],
    ['yu-cao', 'Yu Cao'],
    ['zikang-zhang', 'Zikang Zhang'],
  ],
  'Master Students': [
    ['binghe-li', 'Binghe Li'],
    ['gaoming-yang', 'Gaoming Yang'],
    ['tianyou-li', 'Tianyou Li'],
    ['xu-chen', 'Xu Chen'],
    ['yaobin-zhu', 'Yaobin Zhu'],
    ['zeyang-yang', 'Zeyang Yang'],
    ['zhou-yang', 'Zhou Yang'],
  ],
};
const allMembers = Object.values(sections).flat();

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

  // Index page: clickable cards, PI bio inline, no student bios.
  await page.goto(`${baseUrl}people/`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'People | WiNet Lab');
  for (const heading of Object.keys(sections)) {
    await page
      .getByRole('heading', { name: heading, exact: true })
      .isVisible();
  }
  const cards = page.locator('.people-grid a.people-card');
  assert.equal(await cards.count(), 15);
  assert.equal(
    await page.locator('a[data-person-open]').count(),
    allMembers.length + 1,
    '15 student cards + PI photo link + PI name link',
  );
  const piBioParas = await page
    .locator('.people-bio p')
    .evaluateAll((elements) =>
      elements.map((element) => element.textContent.trim()),
    );
  assert.equal(piBioParas.length, 1, 'Only the PI bio is inline');
  assert(piBioParas[0].includes('国家自然科学基金青B项目'));
  assert.equal(
    await page.locator('.people-featured-name .people-name').textContent(),
    'Xiuzhen Guo',
  );
  assert.equal(
    await page.locator('.people-role').first().textContent(),
    'Tenure-track Assistant Professor',
  );
  const hrefs = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href')),
  );
  assert.deepEqual(
    hrefs,
    allMembers
      .filter(([id]) => id !== 'xiuzhen-guo')
      .map(([id]) => `${base}people/${id}/`),
  );
  for (const [, name] of allMembers) {
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

  let scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(
    scan.violations,
    [],
    `Index a11y: ${JSON.stringify(scan.violations.map((v) => v.id))}`,
  );

  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow at ${width}px (index)`,
    );
  }

  // Dialog interaction: clicking a card opens the profile overlay without
  // navigating; Escape and backdrop clicks close it.
  await page.setViewportSize({ width: 1440, height: 900 });
  const dialog = page.locator('person-dialog dialog');
  assert.equal(await dialog.count(), 1);
  const [, firstStudent] = allMembers.find(([id]) => id === 'haobo-zhang');
  await page.locator('a[data-person-open="haobo-zhang"]').click();
  assert(await dialog.evaluate((node) => node.open));
  assert.equal(page.url(), `${baseUrl}people/`, 'No navigation');
  await dialog
    .getByRole('heading', { name: firstStudent, exact: true })
    .isVisible();
  const dialogBio = await dialog
    .locator('[data-person-bio] p')
    .evaluateAll((elements) =>
      elements.map((element) => element.textContent.trim()),
    );
  assert(dialogBio.length >= 1 && dialogBio.join(' ').length > 50);
  assert(
    await dialog.locator('[data-person-photo]').evaluate(
      (img) => img.complete && img.naturalWidth > 0,
    ),
    'Dialog photo must load',
  );
  await page.screenshot({
    path: `.tools/person-dialog-${base === '/' ? 'root' : 'base'}-1440.png`,
  });
  scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  assert.deepEqual(
    scan.violations,
    [],
    `Open dialog a11y: ${JSON.stringify(scan.violations.map((v) => v.id))}`,
  );
  await page.keyboard.press('Escape');
  assert(!(await dialog.evaluate((node) => node.open)));
  await page.locator('a[data-person-open="xiuzhen-guo"]').first().click();
  assert(await dialog.evaluate((node) => node.open));
  assert.equal(
    await dialog.locator('[data-person-name]').textContent(),
    'Xiuzhen Guo',
  );
  assert.equal(
    await dialog.locator('[data-person-role]').textContent(),
    'Tenure-track Assistant Professor',
  );
  await page.mouse.click(4, 4);
  await page.waitForFunction(
    () => document.querySelector('person-dialog dialog')?.open === false,
  );
  assert.equal(page.url(), `${baseUrl}people/`, 'Still no navigation');

  // Detail pages: photo, name, and the bio live here.
  for (const [index, [id, name]] of allMembers.entries()) {
    await page.goto(`${baseUrl}people/${id}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.title(), `${name} | WiNet Lab`);
    await page
      .getByRole('heading', { level: 1, name, exact: true })
      .isVisible();
    const photo = page.getByRole('img', { name: `Photo of ${name}` });
    assert(
      await photo.evaluate(
        (img) => img.complete && img.naturalWidth > 0,
      ),
      `Detail photo of ${name} must load`,
    );
    const bioParas = await page
      .locator('.person-bio p')
      .evaluateAll((elements) =>
        elements.map((element) => element.textContent.trim()),
      );
    assert(bioParas.length >= 1, `${name} must have a bio paragraph`);
    assert(
      bioParas.every((text) => text.length >= 20),
      `${name} bio paragraphs must be real text`,
    );
    const back = page.locator('a.back-link');
    assert.equal(await back.getAttribute('href'), `${base}people/`);
    if (index === 0 || index === 5) {
      scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      assert.deepEqual(
        scan.violations,
        [],
        `${name} detail a11y: ${JSON.stringify(
          scan.violations.map((v) => v.id),
        )}`,
      );
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `No horizontal overflow at ${width}px (${name} detail)`,
        );
      }
    }
  }
  assert.deepEqual(failed, [], 'No failed requests');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}people/`, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `.tools/people-${base === '/' ? 'root' : 'base'}-1440.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({
    path: `.tools/people-${base === '/' ? 'root' : 'base'}-390.png`,
    fullPage: true,
  });
  await page.goto(`${baseUrl}people/xiuzhen-guo/`, {
    waitUntil: 'networkidle',
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: `.tools/person-xiuzhen-guo-${base === '/' ? 'root' : 'base'}-1440.png`,
    fullPage: true,
  });
  console.log(
    `People checks passed (${allMembers.length} cards + ${allMembers.length} detail pages, base ${base || '/'})`,
  );
} finally {
  await context.close();
  await browser.close();
  await server.stop();
}
