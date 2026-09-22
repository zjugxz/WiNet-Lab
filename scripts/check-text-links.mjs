// Isolated real-browser check for EmphasisText bold and link markers.
// Fixtures are injected only into ignored test builds.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'astro';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch();
try {
  for (const base of ['/', '/WiNet-Lab/']) {
    const outDir = new URL(
      `../.tools/text-links-${base === '/' ? 'root' : 'base'}/`,
      import.meta.url,
    );
    const config = { base, outDir: fileURLToPath(outDir), logLevel: 'error' };
    await build({
      ...config,
      integrations: [
        {
          name: 'text-links-fixture',
          hooks: {
            'astro:config:setup': ({ injectRoute }) =>
              injectRoute({
                pattern: '/__text-links-check/',
                entrypoint: './tests/fixtures/text-links.astro',
              }),
          },
        },
      ],
    });
    const server = await preview({
      ...config,
      server: { host: '127.0.0.1', port: 4323 },
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const failures = [];
      const requests = [];
      page.on('pageerror', (error) => failures.push(error.message));
      page.on('request', (request) => requests.push(request.url()));
      await page.goto(`http://127.0.0.1:4323${base}__text-links-check/`);

      const links = page.locator('a.text-link');
      await expect(links).toHaveCount(3);
      const first = links.nth(0);
      await expect(first).toHaveAttribute(
        'href',
        'https://www.zju.edu.cn/english/',
      );
      await expect(first).toHaveText('Zhejiang University');
      await expect(first).toHaveAttribute('target', '_blank');
      await expect(first).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(first).toHaveCSS('text-decoration-line', 'underline');
      await expect(links.nth(1)).toHaveAttribute(
        'href',
        'https://example.com/paper?a=1&b=%E4%B8%AD',
      );
      await expect(links.nth(1)).toHaveText('the paper page');
      await expect(links.nth(2)).toHaveAttribute(
        'href',
        'https://doi.org/10.1145/3704413.3764420',
      );

      // Bold markers still work next to links.
      await expect(page.locator('strong').filter({ hasText: 'bold phrase' })).toHaveCSS(
        'font-weight',
        '700',
      );

      // Malformed or non-http URLs stay literal text, never anchors.
      const body = await page.locator('body').innerText();
      assert(body.includes('[x](javascript:alert(1))'));
      assert(body.includes('[y](ftp://example.com)'));
      assert(body.includes('[z](/research/)'));
      const hrefs = await page
        .locator('a')
        .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href') ?? ''));
      assert(
        hrefs.every((href) => !/^(javascript|ftp|data):/i.test(href)),
        'no executable or non-http protocol reaches an href',
      );

      // Fixture page must not fetch any linked destination.
      assert.deepEqual(
        requests.filter((url) => !url.startsWith('http://127.0.0.1:4323/')),
        [],
      );

      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      assert.deepEqual(accessibility.violations, []);
      assert.deepEqual(failures, []);
      console.log(
        `Text links ${base}: marker rendering, underline style, protocol whitelist and accessibility passed.`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
