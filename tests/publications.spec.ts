import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import audit from '../docs/verification/publications-audit-2026-09-18.json' with { type: 'json' };
import publications from '../src/data/publications.json' with { type: 'json' };

test('74 retained records preserve source citations and the requested deletion is absent', async ({
  page,
}) => {
  expect(publications).toHaveLength(74);
  expect(new Set(publications.map((p) => p.id)).size).toBe(74);
  for (const entry of audit.records) {
    if (entry.id === 71) {
      expect(
        publications.some((p) => p.sourceNumber === 71 || p.id === 'p71'),
      ).toBe(false);
      continue;
    }
    const item = publications.find((p) => p.sourceNumber === entry.id)!;
    expect(item.originalCitation).toBe(entry.original);
    if (entry.bibliography) {
      expect(item.title).toBe(entry.bibliography.title);
      expect(item.authors).toEqual(entry.bibliography.authors);
      expect(item.year).toBe(entry.bibliography.year);
      expect(item.url).toBe(entry.bibliography.url);
    }
  }
  expect(
    publications.filter((p) => p.verification === 'pending').map((p) => p.id),
  ).toEqual(['p03', 'p37']);
  const errors: string[] = [];
  const failures: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => failures.push(request.url()));
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto('/publications/');
  await expect(page).toHaveTitle('Publications | WiNet Lab');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(74);
  await expect(page.locator('#p71')).toHaveCount(0);
  await expect(page.locator('.publication-resource')).toHaveCount(73);
  await expect(page.getByText('Details pending', { exact: true })).toHaveCount(
    0,
  );
  await expect(page.locator('#p03')).toContainText('Junying Huang');
  await expect(page.locator('#p03 a')).toHaveCount(0);
  await expect(page.locator('#p34 h3')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('#p60')).toContainText('Poster');
  await expect(page.locator('#p60')).toContainText('Xiaoran Fan');
  await expect(page.locator('#p73')).toContainText('2052–2087');
  await expect(page.locator('#p16')).toHaveAttribute('data-year', '2025');
  const expectedOrder = [...publications]
    .sort((a, b) => b.year - a.year || a.sourceNumber - b.sourceNumber)
    .map((p) => p.id);
  expect(
    await page
      .locator('[data-publication]')
      .evaluateAll((items) => items.map((item) => item.id)),
  ).toEqual(expectedOrder);
  for (const item of publications) {
    await expect(page.locator(`#${item.id} h3`)).toHaveText(item.title);
    await expect(page.locator(`#${item.id} .publication-authors`)).toHaveText(
      item.authors.join(', '),
    );
  }
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});

test('year and type filters use OR within each group and AND across groups and search', async ({
  page,
}) => {
  await page.goto('/publications/');
  await page.getByRole('searchbox').fill('wizig');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(2);
  await expect(page.locator('#p05')).toBeVisible();
  await expect(page.locator('#p27')).toBeVisible();
  await page.locator('input[name="year"][value="2020"]').check();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await page.locator('input[name="year"][value="2017"]').check();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(2);
  await page.locator('input[name="type"][value="conference"]').check();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await expect(page.locator('#p27')).toBeVisible();
  await page.locator('input[name="type"][value="journal"]').check();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(2);
  await expect(page.getByRole('status')).toHaveText('2 of 74 publications');
  await expect(page.locator('[data-year-group]:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(74);
  await page.getByRole('searchbox').fill('Guan Gui');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await expect(page.locator('#p72')).toBeVisible();
  await page.getByRole('searchbox').fill('射频');
  await expect(page.locator('#p37')).toBeVisible();
});

test('empty state, reset and keyboard interaction recover the entire list', async ({
  page,
}) => {
  await page.goto('/publications/');
  const book = page.locator('input[name="type"][value="book"]');
  await book.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
  await expect(page.locator('#p75')).toBeVisible();
  await page.locator('input[name="year"][value="2026"]').check();
  await expect(
    page.getByRole('heading', { name: 'No matching publications' }),
  ).toBeVisible();
  await expect(page.locator('[data-year-group]:visible')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('0 of 74 publications');
  await page
    .getByRole('button', { name: 'Clear filters', exact: true })
    .click();
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page.locator('[data-publication]:visible')).toHaveCount(74);
  await page.getByRole('searchbox').fill('  SOFTNB  ');
  await page.getByRole('searchbox').press('Enter');
  await expect(page).toHaveURL('/publications/');
  await expect(page.locator('[data-publication]:visible')).toHaveCount(2);
});

test('without JavaScript the full bibliography and paper links remain accessible', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4322/publications/');
    await expect(page.locator('[data-publication]:visible')).toHaveCount(74);
    await expect(page.locator('.publication-filters')).not.toBeVisible();
    await expect(page.locator('#p75 .publication-resource')).toHaveAttribute(
      'href',
      'https://doi.org/10.1007/978-981-99-3719-6',
    );
  } finally {
    await context.close();
  }
});

for (const width of [320, 390, 768, 1440]) {
  test(`Publications fits ${width}px and filters remain usable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/publications/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const filters = (await page.locator('.publication-filters').boundingBox())!;
    const results = (await page.locator('.publication-results').boundingBox())!;
    if (width <= 760)
      expect(filters.y + filters.height).toBeLessThan(results.y);
    else expect(filters.x).toBeGreaterThan(results.x + results.width);
    if (width <= 760) {
      const toggle = page.locator('.filter-toggle');
      await expect(toggle).toHaveAccessibleName('Show filters');
      await expect(page.getByRole('searchbox')).not.toBeVisible();
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('searchbox')).toBeVisible();
    }
    await page.locator('input[name="type"][value="book"]').check();
    await expect(page.locator('[data-publication]:visible')).toHaveCount(1);
    await expect(page.getByRole('link', { name: /^Book:/ })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    if (width === 320 || width === 1440) {
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(scan.violations).toEqual([]);
    }
  });
}
