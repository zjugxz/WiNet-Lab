import { chromium } from '@playwright/test';
import { preview } from 'astro';
import { fileURLToPath } from 'node:url';

const server = await preview({ server: { host: '127.0.0.1', port: 4324 } });
const browser = await chromium.launch();
try {
  for (const [name, width, height] of [
    ['publications-desktop', 1440, 1000],
    ['publications-mobile', 390, 1000],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('http://127.0.0.1:4324/publications/', {
      waitUntil: 'networkidle',
    });
    await page.screenshot({
      path: fileURLToPath(
        new URL(`../docs/verification/${name}.png`, import.meta.url),
      ),
    });
    if (width === 390) {
      await page
        .getByRole('button', { name: 'Show filters', exact: true })
        .click();
      await page.screenshot({
        path: fileURLToPath(
          new URL(
            '../docs/verification/publications-mobile-filters.png',
            import.meta.url,
          ),
        ),
      });
    }
    if (width === 1440) {
      await page.locator('#year-2025').evaluate((heading) => {
        window.scrollTo({
          top: heading.getBoundingClientRect().top + window.scrollY - 260,
          behavior: 'instant',
        });
      });
      await page.screenshot({
        path: fileURLToPath(
          new URL(
            '../docs/verification/publications-years.png',
            import.meta.url,
          ),
        ),
      });
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' }),
      );
      await page.locator('input[name="type"][value="book"]').check();
      await page.screenshot({
        path: fileURLToPath(
          new URL(
            '../docs/verification/publications-book.png',
            import.meta.url,
          ),
        ),
        fullPage: true,
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
  await server.stop();
}
