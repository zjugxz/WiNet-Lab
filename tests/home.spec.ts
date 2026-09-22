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
          img.naturalWidth > 0 &&
          Math.abs(img.naturalWidth / img.naturalHeight - 2154 / 1614) < 0.01 &&
          new URL(img.currentSrc).pathname.endsWith('.webp'),
      ),
    )
    .toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const footer = page.getByRole('contentinfo');
  await expect(
    footer.getByText('Research. People. Possibilities.'),
  ).toHaveCount(0);
  await expect(footer.getByRole('link', { name: /Get in touch/i })).toHaveCount(
    0,
  );
  await expect(footer.locator('.footer-top').getByRole('link')).toHaveCount(1);
  await expect(
    footer.getByRole('link', { name: 'WiNet Lab home' }),
  ).toBeVisible();
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
  await expect(news).toContainText(
    'Young Scientists Fund (Type B) from National Natural Science Foundation China',
  );
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
  // Chinese text is allowed on the site since the 2026-09-22 user decision.
  expect(text).not.toMatch(/winet\s+group/i);
  expect(text).not.toContain('**');
  expect(text).not.toMatch(/\]\(https?:/);
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('all navigation destinations share the layout and implemented pages show their content', async ({
  page,
}) => {
  await page.goto('/');
  for (const name of ['Research', 'Publications', 'People', 'Gallery', 'Contact']) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    if (name === 'Publications') {
      await expect(page.locator('[data-publication]')).toHaveCount(74);
    } else if (name === 'Research') {
      await expect(page.getByRole('heading', { level: 2 })).toHaveText([
        'Bits Meet Physics',
        'Wireless without Batteries',
        'Embodied Intelligence of Things',
      ]);
      await expect(
        page
          .getByRole('list', { name: 'Research directions' })
          .getByRole('link'),
      ).toHaveCount(3);
    } else if (name === 'Contact') {
      await expect(
        page.getByRole('link', { name: 'guoxz@zju.edu.cn', exact: true }),
      ).toHaveAttribute('href', 'mailto:guoxz@zju.edu.cn');
    } else if (name === 'People') {
      await expect(page.getByRole('heading', { level: 2 })).toHaveText([
        'Principal Investigator',
        'Ph.D. Students',
        'Master Students',
      ]);
      await expect(page.locator('.people-photo img')).toHaveCount(16);
    } else {
      await expect(
        page.getByText('Lab photos are coming soon.', { exact: true }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole('navigation').getByRole('link', { name, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(6);
  }
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Home', exact: true })
    .click();
  await expect(page).toHaveURL('/');
});

for (const width of [320, 390, 760]) {
  test(`mobile menu stays in place for repeated clicks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    const nav = page.getByRole('navigation');
    const closed = (await menu.boundingBox())!;
    const brand = page.locator('.site-header .brand');
    const closedBrand = (await brand.boundingBox())!;

    // Keep the original coordinates: locator.click() would follow a moving button.
    for (const fraction of [0.25, 0.5, 0.75]) {
      const x = closed.x + closed.width / 2;
      const y = closed.y + closed.height * fraction;
      await page.mouse.click(x, y);
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(nav).toBeVisible();
      const opened = (await menu.boundingBox())!;
      expect(opened.x).toBeCloseTo(closed.x, 1);
      expect(opened.y).toBeCloseTo(closed.y, 1);
      expect((await brand.boundingBox())!.y).toBeCloseTo(closedBrand.y, 1);
      await page.mouse.click(x, y);
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(nav).not.toBeVisible();
    }

    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    const focus = await menu.evaluate((button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      const inset =
        parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      return {
        visible: button.matches(':focus-visible'),
        top: rect.top - inset,
        left: rect.left - inset,
        right: rect.right + inset,
        bottom: rect.bottom + inset,
      };
    });
    expect(focus.visible).toBe(true);
    expect(focus.top).toBeGreaterThanOrEqual(0);
    expect(focus.left).toBeGreaterThanOrEqual(0);
    expect(focus.right).toBeLessThanOrEqual(width);
    expect(focus.bottom).toBeLessThanOrEqual(844);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`homepage fits ${width}px and has accessible navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const footerBrand = await page.locator('.footer-top .brand').boundingBox();
    expect(footerBrand).not.toBeNull();
    expect(
      Math.abs(footerBrand!.x + footerBrand!.width / 2 - width / 2),
    ).toBeLessThan(1);
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
