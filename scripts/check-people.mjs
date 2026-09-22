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
const emails = {
  'xiuzhen-guo': 'guoxz@zju.edu.cn',
  'haobo-zhang': '12532092@zju.edu.cn',
  'hongyu-wang': '12632049@zju.edu.cn',
  'junying-huang': 'hjy23@zju.edu.cn',
  'long-tan': 'long.tan@zju.edu.cn',
  'xiangguang-wang': 'xgwwwang@zju.edu.cn',
  'yifan-yan': 'yyf020517@outlook.com',
  'yu-cao': 'yu.cao@zju.edu.cn',
  'zikang-zhang': 'zzk040912@gmail.com',
  'binghe-li': '22532178@zju.edu.cn',
  'gaoming-yang': '22532053@zju.edu.cn',
  'tianyou-li': 'tianyouli@zju.edu.cn',
  'xu-chen': 'chenxu_03@zju.edu.cn',
  'yaobin-zhu': '1973206857@qq.com',
  'zeyang-yang': '22432047@zju.edu.cn',
  'zhou-yang': 'yangzhouzju@gmail.com',
};

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
  assert(
    piBioParas[0].includes('国家自然科学基金青B项目') ||
      piBioParas[0].includes('（原优青）'),
    'PI bio keeps its NSFC award note',
  );
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
  // PI shows the email but no age.
  assert.equal(
    await dialog.locator('[data-person-age]').isVisible(),
    false,
  );
  assert.equal(
    await dialog.locator('[data-person-email]').textContent(),
    'guoxz@zju.edu.cn',
  );
  assert.equal(
    await dialog.locator('[data-person-email]').getAttribute('href'),
    'mailto:guoxz@zju.edu.cn',
  );
  // Students show both age and email.
  await page.keyboard.press('Escape');
  await page.locator('a[data-person-open="haobo-zhang"]').click();
  assert.equal(await dialog.locator('[data-person-age]').textContent(), 'Age 22');
  assert.equal(
    await dialog.locator('[data-person-email]').textContent(),
    '12532092@zju.edu.cn',
  );
  await page.mouse.click(4, 4);
  await page.waitForFunction(
    () => document.querySelector('person-dialog dialog')?.open === false,
  );
  assert.equal(page.url(), `${baseUrl}people/`, 'Still no navigation');

  // Fixed dialog geometry and in-dialog scrolling for long bios.
  const sizeOf = async (id) => {
    await page.locator(`a[data-person-open="${id}"]`).first().click();
    await page.waitForSelector('person-dialog dialog[open]');
    return page.evaluate(() => {
      const dialog = document.querySelector('person-dialog dialog');
      const photo = dialog.querySelector('[data-person-photo]');
      const bio = dialog.querySelector('[data-person-bio]');
      const box = (node) => {
        const r = node.getBoundingClientRect();
        return { width: r.width, height: r.height };
      };
      return { dialog: box(dialog), photo: box(photo), bio: box(bio) };
    });
  };
  const sizes = [];
  for (const id of ['zhou-yang', 'xiangguang-wang', 'yu-cao']) {
    sizes.push(await sizeOf(id));
    await page.keyboard.press('Escape');
  }
  for (const [kind] of Object.entries(sizes[0])) {
    for (const later of sizes.slice(1)) {
      assert.ok(
        Math.abs(sizes[0][kind].width - later[kind].width) < 1 &&
          Math.abs(sizes[0][kind].height - later[kind].height) < 1,
        `${kind} area must be identical for every member`,
      );
    }
  }
  await page.locator('a[data-person-open="xiangguang-wang"]').click();
  await page.waitForSelector('person-dialog dialog[open]');
  const scrollable = await page.evaluate(() => {
    const bio = document.querySelector(
      'person-dialog dialog [data-person-bio]',
    );
    return { overflow: getComputedStyle(bio).overflowY, tall: bio.scrollHeight > bio.clientHeight };
  });
  assert.equal(scrollable.overflow, 'auto');
  assert.ok(scrollable.tall, 'The longest bio must exceed the fixed text area');
  const scrolled = await page.evaluate(() => {
    const bio = document.querySelector(
      'person-dialog dialog [data-person-bio]',
    );
    bio.scrollTop = 9999;
    return bio.scrollTop > 0;
  });
  assert.ok(scrolled, 'The bio area must actually scroll');
  await page.screenshot({
    path: `.tools/person-dialog-scroll-${base === '/' ? 'root' : 'base'}-1440.png`,
  });
  await page.keyboard.press('Escape');

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
    const metaMail = page.locator('.person-meta a');
    assert.equal(await metaMail.getAttribute('href'), `mailto:${emails[id]}`);
    assert.equal(await metaMail.textContent(), emails[id]);
    if (id === 'xiuzhen-guo') {
      assert.equal(await page.locator('.person-meta span').count(), 0);
    } else {
      assert.match(
        await page.locator('.person-meta span').textContent(),
        /^Age \d+$/,
      );
    }
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
