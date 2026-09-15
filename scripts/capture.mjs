import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch();
try {
  const directory = new URL('../docs/verification/', import.meta.url);
  await mkdir(directory, { recursive: true });
  for (const [name, width, height] of [
    ['home-desktop', 1440, 1000],
    ['home-mobile', 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: fileURLToPath(new URL(`${name}.png`, directory)),
      fullPage: true,
    });
    if (name === 'home-desktop') {
      await page.locator('.site-header .brand').screenshot({
        path: fileURLToPath(new URL('logo-preview.png', directory)),
      });
      await page.locator('.site-footer').screenshot({
        path: fileURLToPath(new URL('footer-logo.png', directory)),
      });
    }
    await page.close();
  }
  if (process.argv.includes('--reference')) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    await page.goto('https://marslab.tech/', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    await page.screenshot({
      path: '.tools/reference-home.png',
      fullPage: true,
    });
  }
} finally {
  await browser.close();
}
