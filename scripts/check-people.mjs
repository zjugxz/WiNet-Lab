import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';
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
const alumni = [
  ['chuchuan-ceng', 'Chuchuan Ceng'],
  ['kaixuan-xie', 'Kaixuan Xie'],
];
const allProfiles = [...allMembers, ...alumni];
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
const context = await browser.newContext({
  permissions: ['clipboard-read', 'clipboard-write'],
});
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
  // Alumni use the same photo cards and dialog as current members, without
  // email/link controls.
  await page.getByRole('heading', { name: 'Alumni', exact: true }).isVisible();
  assert.equal(
    await page.locator('.people-section-alumni a.people-card').count(),
    alumni.length,
    'Every supplied alumnus has a profile card',
  );
  const cards = page.locator('.people-grid a.people-card');
  assert.equal(await cards.count(), allProfiles.length - 1);
  assert.equal(
    await page.locator('a[data-person-open]').count(),
    allProfiles.length + 1,
    '17 student/alumni cards + PI photo link + PI name link',
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

  // PI link buttons: website/email/scholar with correct targets; students
  // have no link rows until their data is supplied.
  const expectedLinks = {
    website: 'https://zjugxz.github.io/xiuzhen-guo-homepage/',
    email: 'mailto:guoxz@zju.edu.cn',
    scholar:
      'https://scholar.google.com/citations?user=JMmLdgsAAAAJ&hl=zh-CN',
  };
  assert.equal(
    await page.locator('.people-featured-info .person-link').count(),
    3,
  );
  for (const [key, href] of Object.entries(expectedLinks)) {
    const link = page.locator(
      `.people-featured-info a[data-person-link="${key}"]`,
    );
    assert.equal(await link.getAttribute('href'), href);
    assert.equal(
      await link.getAttribute('aria-label'),
      {
        website: 'Personal website of Xiuzhen Guo',
        email: 'Email of Xiuzhen Guo',
        scholar: 'Xiuzhen Guo on Google Scholar',
      }[key],
    );
    if (key === 'email') {
      assert.equal(await link.getAttribute('target'), null);
      assert.equal(await link.getAttribute('rel'), null);
    } else {
      assert.equal(await link.getAttribute('target'), '_blank');
      assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
    }
  }
  // Every student already has an email button; website/scholar appear per
  // member once their data is supplied.
  const studentRows = page.locator('.people-grid .person-links');
  assert.equal(
    await studentRows.count(),
    15,
    'Every current student card has a link row; alumni do not',
  );
  const rowLinks = await studentRows
    .locator('a.person-link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  assert.deepEqual(
    rowLinks,
    allMembers
      .filter(([id]) => id !== 'xiuzhen-guo')
      .map(([id]) => `mailto:${emails[id]}`),
    'Each student row has exactly their email button',
  );
  assert.equal(
    await page.locator('.people-section-alumni .person-links').count(),
    0,
    'Alumni cards must not invent email or personal links',
  );

  // Clicking an email button copies the address and confirms in place
  // instead of navigating to the mailto link.
  const piEmailButton = page.locator(
    '.people-featured-info a[data-person-link="email"]',
  );
  await piEmailButton.click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    'guoxz@zju.edu.cn',
    'PI email must land in the clipboard',
  );
  assert.equal(page.url(), `${baseUrl}people/`, 'No mailto navigation');
  await expect(piEmailButton).toHaveClass(/copied/);
  await expect(piEmailButton).not.toHaveClass(/copied/, { timeout: 5000 });
  await page
    .locator('.people-grid a[data-person-link="email"]')
    .first()
    .click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    '12532092@zju.edu.cn',
    'Student email button copies too',
  );
  const hrefs = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href')),
  );
  assert.deepEqual(
    hrefs,
    allProfiles
      .filter(([id]) => id !== 'xiuzhen-guo')
      .map(([id]) => `${base}people/${id}/`),
  );
  for (const [, name] of allProfiles) {
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
  await page.keyboard.press('Escape');
  await page.locator('a[data-person-open="chuchuan-ceng"]').click();
  assert.equal(
    await dialog.locator('[data-person-section]').textContent(),
    'Alumni',
  );
  assert.equal(
    await dialog.locator('[data-person-role]').textContent(),
    'Algorithm Engineer at Shopee',
  );
  assert.equal(
    await dialog.locator('[data-person-graduation]').textContent(),
    'Graduated March 2026',
  );
  assert.equal(await dialog.locator('[data-person-age]').isVisible(), false);
  assert.equal(await dialog.locator('[data-person-email]').isVisible(), false);
  assert.match(
    await dialog.locator('[data-person-bio]').textContent(),
    /adaptive decision-making in edge environments/,
  );
  await page.screenshot({
    path: `.tools/person-dialog-alumni-${base === '/' ? 'root' : 'base'}-1440.png`,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Alumni dialog must not overflow the mobile viewport',
  );
  await page.screenshot({
    path: `.tools/person-dialog-alumni-${base === '/' ? 'root' : 'base'}-390.png`,
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.keyboard.press('Escape');
  await page.locator('a[data-person-open="kaixuan-xie"]').click();
  assert.match(
    await dialog.locator('[data-person-bio]').textContent(),
    /distributed edge settings/,
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
  for (const id of ['zhou-yang', 'xiangguang-wang', 'yu-cao', 'kaixuan-xie']) {
    sizes.push(await sizeOf(id));
    await page.keyboard.press('Escape');
  }
  for (const [kind] of Object.entries(sizes[0])) {
    for (const later of sizes.slice(1)) {
      assert.ok(
        Math.abs(sizes[0][kind].width - later[kind].width) < 1 &&
          Math.abs(sizes[0][kind].height - later[kind].height) < 1,
        `${kind} area must be identical for every member: ${JSON.stringify(sizes)}`,
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
  for (const [index, [id, name]] of allProfiles.entries()) {
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
    const isAlumni = alumni.some(([alumnusId]) => alumnusId === id);
    if (isAlumni) {
      assert.equal(await metaMail.count(), 0, 'Alumni detail has no email');
      assert.equal(
        await page.locator('.person-meta span').textContent(),
        'Graduated March 2026',
      );
      assert.equal(
        await page.locator('.person-links').count(),
        0,
        'Alumni detail has no empty link controls',
      );
      assert.equal(
        await page.locator('.person-role').textContent(),
        'Algorithm Engineer at Shopee',
      );
    } else {
      assert.equal(await metaMail.getAttribute('href'), `mailto:${emails[id]}`);
      assert.equal(await metaMail.textContent(), emails[id]);
    }
    if (id === 'xiuzhen-guo') {
      assert.equal(await page.locator('.person-meta span').count(), 0);
      const labeled = page.locator('.person-links .person-link');
      assert.equal(await labeled.count(), 3, 'PI detail shows labeled links');
      assert.equal(
        await page
          .locator('.person-links a[data-person-link="scholar"]')
          .textContent(),
        'Google Scholar',
      );
      assert.equal(
        await page
          .locator('.person-links a[data-person-link="website"]')
          .getAttribute('href'),
        'https://zjugxz.github.io/xiuzhen-guo-homepage/',
      );
      const piEmail = page.locator(
        '.person-links a[data-person-link="email"]',
      );
      await piEmail.click();
      assert.equal(
        await page.evaluate(() => navigator.clipboard.readText()),
        'guoxz@zju.edu.cn',
      );
      assert.equal(
        await piEmail.locator('.link-text').textContent(),
        'Copied',
        'Labeled button swaps its text while confirming',
      );
      assert.equal(await piEmail.getAttribute('title'), 'Copied: guoxz@zju.edu.cn');
    } else if (!isAlumni) {
      const labeled = page.locator('.person-links .person-link');
      assert.equal(await labeled.count(), 1, 'Student detail shows email only');
      assert.equal(
        await labeled.first().getAttribute('href'),
        `mailto:${emails[id]}`,
      );
    }
    if (id !== 'xiuzhen-guo' && !isAlumni) {
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
    `People checks passed (${allProfiles.length} profiles + ${allProfiles.length} detail pages, base ${base || '/'})`,
  );
} finally {
  await context.close();
  await browser.close();
  await server.stop();
}
