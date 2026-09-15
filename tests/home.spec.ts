import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage content, links, local assets and accessibility', async ({
  page,
}) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Home | WiNet Lab');
  await expect(
    page.getByRole('heading', { name: 'About WiNet Lab', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.about-copy > p')).toHaveCount(3);
  await expect(page.locator('.about-copy')).toContainText(
    'Wireless Intelligence for Networked and Embodied Things (WiNet) Lab at Zhejiang University',
  );
  const visual = page.getByRole('img', {
    name: /WiNet Lab research word cloud/,
  });
  await expect(visual).toBeVisible();
  await expect
    .poll(() =>
      visual.evaluate(
        (img: HTMLImageElement) =>
          img.complete &&
          img.naturalWidth === 2154 &&
          img.naturalHeight === 1614,
      ),
    )
    .toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'News', exact: true }),
  ).toBeVisible();
  const news = page.getByRole('list', { name: 'Lab news' });
  await expect(news.getByRole('listitem')).toHaveCount(7);
  await expect(news.locator('time')).toHaveText([
    'Sep 2026',
    'Aug 2026',
    'Aug 2026',
    'Jul 2026',
    'Jun 2026',
    'Apr 2026',
    'Apr 2026',
  ]);
  await expect(
    news.locator('strong').filter({ hasText: /^BCGscatter$/ }),
  ).toHaveCSS('font-weight', '700');
  await expect(page.locator('.about-copy strong').first()).toHaveCSS(
    'font-weight',
    '700',
  );
  await expect(news).toContainText('Excellent Young Scientists Fund of NSFC');
  await expect(news).toContainText('Cover Paper');
  await expect(news).toContainText('SoftNB');
  await expect(
    page.getByText('Updates coming soon', { exact: true }),
  ).toHaveCount(0);
  for (const title of ['Events', 'Collaborators']) {
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toHaveCount(0);
  }
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(
    page
      .getByRole('navigation')
      .getByRole('link', { name: 'Home', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  const scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  expect(
    requests.filter((url) => !url.startsWith('http://127.0.0.1:4322/')),
  ).toEqual([]);
  expect(errors).toEqual([]);
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/[\u3400-\u9fff]/);
  expect(text).not.toMatch(/winet\s+group/i);
  expect(text).not.toContain('**');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('all navigation destinations share the layout and explicitly identify draft content', async ({
  page,
}) => {
  await page.goto('/');
  for (const name of ['Research', 'Publications', 'People', 'Contact']) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await expect(
      page.getByText('This page is in preparation.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('link', { name, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(5);
  }
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('/');
});

for (const width of [320, 390, 768, 1440]) {
  test(`homepage fits ${width}px and has accessible navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    const menu = page.getByRole('button', { name: 'Menu' });
    if (width <= 760) {
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('navigation')).toBeVisible();
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(scan.violations).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeFocused();
      await menu.click();
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'People', exact: true })
        .click();
      await expect(
        page.getByRole('heading', { name: 'People', exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    } else {
      await expect(menu).not.toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
}
