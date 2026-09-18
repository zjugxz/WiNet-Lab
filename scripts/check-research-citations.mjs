import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const data = JSON.parse(await readFile('src/data/research.json', 'utf8'));
const papers = data.directions.flatMap((d) => d.papers);
const published = papers.filter((p) => p.bibtex);
assert.equal(published.length, 3);
const browser = await chromium.launch();
try {
  for (const base of ['/', '/WiNet-Lab/']) {
    const server = await preview({
      base,
      outDir: base === '/' ? 'dist' : '.tools/base-dist',
      server: { host: '127.0.0.1', port: 4325 },
    });
    const origin = 'http://127.0.0.1:4325';
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${origin}${base}research/`);
      await expect(
        page.getByRole('button', { name: /^Bib: Cite / }),
      ).toHaveCount(3);
      for (const paper of published) {
        const source =
          (await readFile(`src/data/citations/${paper.bibtex}.bib`, 'utf8'))
            .replace(/\r\n?/g, '\n')
            .trim() + '\n';
        const opener = page.getByRole('button', {
          name: `Bib: Cite ${paper.title}`,
          exact: true,
        });
        await opener.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Cite this paper' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByLabel('BibTeX', { exact: true })).toHaveValue(
          source,
        );
        await dialog
          .getByRole('button', { name: 'Copy BibTeX', exact: true })
          .click();
        await expect(dialog.getByRole('status')).toHaveText('BibTeX copied.');
        // Windows native clipboard uses CRLF; normalize only that platform boundary.
        assert.equal(
          (await page.evaluate(() => navigator.clipboard.readText())).replace(
            /\r\n?/g,
            '\n',
          ),
          source,
        );
        const downloadReady = page.waitForEvent('download');
        await dialog.getByRole('link', { name: 'Download .bib' }).click();
        const download = await downloadReady;
        assert.equal(download.suggestedFilename(), `${paper.bibtex}.bib`);
        assert.equal(await readFile(await download.path(), 'utf8'), source);
        const response = await context.request.get(
          `${origin}${base}research/citations/${paper.bibtex}.bib`,
        );
        assert.equal(response.status(), 200);
        assert.equal(await response.text(), source);
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
      }
      for (const paper of papers.filter(
        (p) => p.publication?.status === 'submitted',
      )) {
        const card = page.locator('.paper-card').filter({
          has: page.getByRole('heading', { name: paper.title, exact: true }),
        });
        await expect(card.locator('bib-citation')).toHaveCount(0);
        await expect(
          card.getByRole('button', { name: 'Paper coming soon', exact: true }),
        ).toBeDisabled();
        for (const path of [
          `research/citations/${paper.id}.bib`,
          `research/${paper.id}/paper.pdf`,
        ]) {
          assert.equal(
            (await context.request.get(`${origin}${base}${path}`)).status(),
            404,
          );
        }
      }
      const first = page.getByRole('button', { name: /^Bib: Cite / }).first();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await first.focus();
        await page.keyboard.press('Space');
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        const box = await dialog.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        assert.ok(
          await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
        );
        if (width === 390 || width === 1440) {
          await page.screenshot({
            path: `.tools/research-bib-${width}-${base === '/' ? 'root' : 'base'}.png`,
          });
        }
        const audit = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        assert.deepEqual(audit.violations, []);
        // Native modal focus must remain inside the dialog.
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press('Tab');
          assert.ok(
            await dialog.evaluate((el) => el.contains(document.activeElement)),
          );
        }
        await dialog.getByRole('button', { name: 'Close citation' }).click();
        await expect(first).toBeFocused();
      }
      await first.click();
      await page.mouse.click(1, 1);
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // Permission denial must leave a usable manual copy/download path.
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: () =>
              Promise.reject(new DOMException('Denied', 'NotAllowedError')),
          },
        });
      });
      await first.click();
      const dialog = page.getByRole('dialog');
      await dialog
        .getByRole('button', { name: 'Copy BibTeX', exact: true })
        .click();
      await expect(dialog.getByRole('status')).toContainText(
        'Copy unavailable.',
      );
      const input = dialog.getByLabel('BibTeX', { exact: true });
      await expect(input).toBeFocused();
      assert.ok(
        await input.evaluate(
          (el) =>
            el instanceof HTMLTextAreaElement &&
            el.selectionStart === 0 &&
            el.selectionEnd === el.value.length,
        ),
      );
      await expect(
        dialog.getByRole('link', { name: 'Download .bib' }),
      ).toBeVisible();
      assert.deepEqual(errors, []);
      const noJS = await browser.newContext({ javaScriptEnabled: false });
      try {
        const plain = await noJS.newPage();
        await plain.goto(`${origin}${base}research/`);
        const links = plain.getByRole('link', { name: /^Bib: Cite / });
        await expect(links).toHaveCount(3);
        const ready = plain.waitForEvent('download');
        await links.first().click();
        const download = await ready;
        assert.equal(download.suggestedFilename(), 'magnetic-rf-computing.bib');
        assert.match(
          await readFile(await download.path(), 'utf8'),
          /@article\{Tan2026PhysicalComputing,/,
        );
      } finally {
        await noJS.close();
      }
      console.log(
        `${base}: 3 verified Bib views/copies/downloads; submitted Bib/PDF 404; keyboard, focus, fallback, no-JS, 4 widths and axe passed`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
