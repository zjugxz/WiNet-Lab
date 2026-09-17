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
  page.on('requestfailed', (request) => failed.push(request.url()));
  await page.goto(baseUrl, {
    waitUntil: 'networkidle',
  });
  const links = await page
    .locator('a')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    );
  assert(
    links.every(
      (link) => link.startsWith('#') || link.startsWith(base),
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
      (img) => img.complete && img.naturalWidth === 2154,
    ),
  );
  for (const name of [
    'Research',
    'Publications',
    'People',
    'Contact',
    'Home',
  ]) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    assert(page.url().startsWith(baseUrl));
    assert.equal(await page.title(), `${name} | WiNet Lab`);
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
    `Repository base path ${base} verified: five pages, links, CSS, hero image, and mobile menu; no failed requests.`,
  );
} finally {
  await browser.close();
  await server.stop();
}
