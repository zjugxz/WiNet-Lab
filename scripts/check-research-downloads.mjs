import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';

const data = JSON.parse(await readFile('src/data/research.json', 'utf8'));
const withheldIds = [
  'underwater-visible-light-backscatter',
  'eeg-fatigue-interaction',
  'cardiac-monitoring',
  'mmprism-sign-language',
];
const papers = data.directions.flatMap((direction) => direction.papers);
for (const id of withheldIds) {
  assert.equal(papers.find((paper) => paper.id === id)?.pdf, null);
}
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const browser = await chromium.launch();
try {
  for (const base of ['/', '/WiNet-Lab/']) {
    const outDir = base === '/' ? 'dist' : '.tools/base-dist';
    const server = await preview({
      base,
      outDir,
      server: { host: '127.0.0.1', port: 4324 },
    });
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const origin = 'http://127.0.0.1:4324';
      await page.goto(`${origin}${base}research/`);
      await expect(page.locator('video')).toHaveCount(7);
      await expect(page.getByRole('button', { name: /Demo/ })).toHaveCount(0);
      await expect(
        page.getByText('Demo coming soon', { exact: true }),
      ).toHaveCount(0);
      await expect(page.locator('.paper-publication')).toHaveCount(4);
      let downloads = 0;
      for (const direction of data.directions) {
        if (direction.papers.length) {
          const expectedOrder = [
            ...direction.papers.filter((paper) => paper.demo),
            ...direction.papers.filter((paper) => !paper.demo),
          ].map((paper) => paper.title);
          await expect(
            page.locator(`#${direction.id} .paper-card h3`),
          ).toHaveText(expectedOrder);
        }
        for (const paper of direction.papers) {
          const card = page.locator(
            `article[aria-labelledby="${direction.id}-${paper.id}-title"]`,
          );
          if (paper.pdf === null) {
            // Hiding a link alone is insufficient: the old file must be absent.
            await expect(
              card.getByRole('link', { name: /^Paper:/ }),
            ).toHaveCount(0);
            await expect(
              card.getByRole('button', {
                name: 'Paper coming soon',
                exact: true,
              }),
            ).toBeDisabled();
            await expect(card.locator('.paper-publication')).toHaveCount(0);
            const oldPath = `research/${paper.id}/paper.pdf`;
            for (const dir of ['public', outDir]) {
              await assert.rejects(access(`${dir}/${oldPath}`), {
                code: 'ENOENT',
              });
            }
            const response = await context.request.get(
              `${origin}${base}${oldPath}`,
            );
            assert.equal(response.status(), 404, oldPath);
          }
          if (paper.publication?.venue) {
            await expect(card.locator('.venue-name')).toHaveText(
              paper.publication.venue,
            );
            await expect(card.locator('.venue-year')).toHaveText(
              String(paper.publication.year),
            );
            const style = await card.locator('.venue-name').evaluate((el) => {
              const css = getComputedStyle(el);
              return {
                font: css.fontFamily,
                size: css.fontSize,
                style: css.fontStyle,
                color: css.color,
              };
            });
            assert.match(style.font, /Georgia/);
            assert.equal(style.size, '18px');
            assert.equal(style.style, 'italic');
            assert.equal(style.color, 'rgb(164, 81, 34)');
          }
          for (const [field, label] of [
            ['pdf', 'Paper'],
            ['demo', 'Demo'],
          ]) {
            const resource = paper[field];
            if (!resource) continue;
            const link = card.getByRole('link', {
              name: new RegExp(`^${label}:`),
            });
            const pending = page.waitForEvent('download');
            await link.focus();
            await page.keyboard.press('Enter');
            const download = await pending;
            assert.equal(download.suggestedFilename(), resource.filename);
            assert.equal(await download.failure(), null);
            assert.equal(
              hash(await readFile(await download.path())),
              hash(await readFile(`public/${resource.src}`)),
            );
            downloads++;
          }
        }
      }
      assert.equal(downloads, 11);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
      }
      console.log(
        `${base}: Demo-first stable order, no missing Demo buttons, 4 styled venue/year labels, 4 Paper coming soon labels, withheld URLs 404; 11 exact downloads and four widths passed.`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
