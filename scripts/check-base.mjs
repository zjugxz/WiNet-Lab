import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';

const base = (process.env.SITE_BASE || '/WiNet-Lab/').replace(/\/?$/, '/');
const baseUrl = `http://127.0.0.1:4323${base}`;
const server = await preview({
  base,
  outDir: './.tools/base-dist',
  server: { host: '127.0.0.1', port: 4323 },
});
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const failed = [];
  page.on('response', (response) => {
    if (response.status() >= 400)
      failed.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => {
    // Navigating away cancels in-flight video ranges. Actual media decoding and
    // downloads are verified separately; keep all other network failures fatal.
    if (
      request.resourceType() === 'media' &&
      request.failure()?.errorText === 'net::ERR_ABORTED'
    )
      return;
    failed.push(request.url());
  });
  await page.goto(baseUrl, {
    waitUntil: 'networkidle',
  });
  const links = await page
    .locator('a')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    );
  // External http(s) links are deliberate (e.g. news links to the PI page).
  assert(
    links.every(
      (link) =>
        link.startsWith('#') ||
        link.startsWith(base) ||
        /^https?:\/\//.test(link),
    ),
  );
  const background = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  assert.equal(
    background,
    'rgb(255, 255, 255)',
    'Styles must load under the repository base path',
  );
  const heroImage = page.getByRole('img', {
    name: /WiNet Lab research word cloud/,
  });
  assert.equal(
    await heroImage.getAttribute('src'),
    `${base}images/winet-lab-wordcloud.png`,
  );
  assert(
    await heroImage.evaluate(
      (img, siteBase) =>
        img.complete &&
        img.naturalWidth > 0 &&
        new URL(img.currentSrc).pathname.startsWith(`${siteBase}_astro/`) &&
        img.currentSrc.endsWith('.webp'),
      base,
    ),
  );
  for (const name of [
    'Research',
    'Publications',
    'People',
    'Gallery',
    'Contact',
    'Home',
  ]) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    assert(page.url().startsWith(baseUrl));
    assert.equal(await page.title(), `${name} | WiNet Lab`);
    if (name === 'Publications') {
      assert.equal(
        await page.locator('[data-publication]:visible').count(),
        74,
      );
      await page.getByRole('searchbox').fill('wizig');
      assert.equal(await page.locator('[data-publication]:visible').count(), 2);
      assert.equal(
        await page.locator('#p05 .publication-resource').getAttribute('href'),
        'https://doi.org/10.1109/tnet.2020.3013921',
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu' }).click();
  assert.equal(
    await page
      .getByRole('button', { name: 'Menu' })
      .getAttribute('aria-expanded'),
    'true',
  );
  assert.deepEqual(failed, []);
  console.log(
    `Repository base path ${base} verified: five pages, links, CSS, hero image, 74 publications, filters, and mobile menu; no failed requests.`,
  );
} finally {
  await browser.close();
  await server.stop();
}
