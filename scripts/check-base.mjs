import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';

const server = await preview({
  base: '/winet-group/',
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
  await page.goto('http://127.0.0.1:4323/winet-group/', {
    waitUntil: 'networkidle',
  });
  const links = await page
    .locator('a')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    );
  assert(
    links.every(
      (link) => link.startsWith('#') || link.startsWith('/winet-group/'),
    ),
  );
  const background = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  assert.equal(
    background,
    'rgb(247, 247, 240)',
    'Styles must load under the repository base path',
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
    assert(page.url().startsWith('http://127.0.0.1:4323/winet-group/'));
    assert.equal(await page.title(), `${name} | Winet Group`);
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
    'Repository base path verified: five pages, links, CSS, and mobile menu; no failed requests.',
  );
} finally {
  await browser.close();
  await server.stop();
}
