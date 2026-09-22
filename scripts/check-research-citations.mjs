import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const data = JSON.parse(await readFile('src/data/research.json', 'utf8'));
const publications = JSON.parse(
  await readFile('src/data/publications.json', 'utf8'),
);
const papers = data.directions.flatMap((d) => d.papers);
const published = papers.filter((p) => p.citationId);
const formats = [
  { label: 'Text', ext: 'txt' },
  { label: 'BibTeX', ext: 'bib' },
  { label: 'RIS', ext: 'ris' },
];
const sourceText = async (id, ext) =>
  (await readFile(`src/data/citations/${id}.${ext}`, 'utf8'))
    .replace(/\r\n?/g, '\n')
    .trim() + '\n';
assert.equal(published.length, 4);
// Independently cross-check bibliographic fields against the verified publication list.
for (const paper of published) {
  const record = publications.find((p) => p.title === paper.title);
  assert.ok(record);
  const ris = await sourceText(paper.citationId, 'ris');
  const fields = [...ris.matchAll(/^([A-Z0-9]{2})  -(?: (.*))?$/gm)];
  const values = (tag) =>
    fields.filter((f) => f[1] === tag).map((f) => f[2] || '');
  assert.equal(
    values('TY')[0],
    record.type === 'conference' ? 'CONF' : 'JOUR',
  );
  assert.equal(values('TI')[0], record.title);
  assert.equal(values('T2')[0], record.venue);
  assert.equal(values('PY')[0], String(record.year));
  assert.equal(values('DO')[0].toLowerCase(), record.doi.toLowerCase());
  assert.deepEqual(
    values('AU').map((name) => name.split(', ').reverse().join(' ')),
    record.authors,
  );
  assert.equal(
    [values('SP')[0], values('EP')[0]].filter(Boolean).join('-'),
    record.pages,
  );
  assert.equal(values('VL')[0], record.volume);
  assert.equal(values('IS')[0], record.issue);
  assert.ok(ris.endsWith('ER  -\n'));
  for (const ext of ['txt', 'bib']) {
    const text = await sourceText(paper.citationId, ext);
    assert.ok(text.toLowerCase().includes(record.doi.toLowerCase()));
    assert.ok(text.includes(record.venue));
    assert.ok(text.includes(String(record.year)));
  }
}

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
      await expect(page.getByRole('button', { name: /^Cite: / })).toHaveCount(
        4,
      );
      for (const paper of published) {
        const opener = page.getByRole('button', {
          name: `Cite: ${paper.title}`,
          exact: true,
        });
        await opener.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Cite this paper' });
        await expect(dialog).toBeVisible();
        await expect(
          dialog.getByRole('radio', { name: 'Text', exact: true }),
        ).toBeChecked();
        const publisher = dialog.getByRole('link', {
          name: 'View publication',
        });
        assert.match(
          await publisher.getAttribute('href'),
          /^https:\/\/(www\.sciencedirect\.com|doi\.org)\//,
        );
        for (const format of formats) {
          const source = await sourceText(paper.citationId, format.ext);
          await dialog
            .getByRole('radio', { name: format.label, exact: true })
            .check();
          await expect(dialog.getByRole('textbox')).toHaveCount(1);
          await expect(dialog.getByRole('textbox')).toHaveValue(source);
          await expect(dialog.getByRole('status')).toBeEmpty();
          await dialog
            .getByRole('button', { name: `Copy ${format.label}`, exact: true })
            .click();
          await expect(dialog.getByRole('status')).toHaveText(
            `${format.label} copied.`,
          );
          assert.equal(
            (await page.evaluate(() => navigator.clipboard.readText())).replace(
              /\r\n?/g,
              '\n',
            ),
            source,
          );
          const ready = page.waitForEvent('download');
          await dialog
            .getByRole('link', { name: `Download .${format.ext}` })
            .click();
          const download = await ready;
          assert.equal(
            download.suggestedFilename(),
            `${paper.citationId}.${format.ext}`,
          );
          assert.equal(await readFile(await download.path(), 'utf8'), source);
          const response = await context.request.get(
            `${origin}${base}research/citations/${paper.citationId}.${format.ext}`,
          );
          assert.equal(response.status(), 200);
          assert.equal(await response.text(), source);
        }
        await dialog.getByRole('radio', { name: 'Text', exact: true }).focus();
        await page.keyboard.press('ArrowRight');
        await expect(
          dialog.getByRole('radio', { name: 'BibTeX', exact: true }),
        ).toBeChecked();
        await expect(dialog.getByRole('textbox')).toHaveValue(
          await sourceText(paper.citationId, 'bib'),
        );
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
      }
      for (const paper of papers.filter(
        (p) => p.publication?.status === 'submitted',
      )) {
        const card = page
          .locator('.paper-card')
          .filter({
            has: page.getByRole('heading', { name: paper.title, exact: true }),
          });
        await expect(card.locator('citation-dialog')).toHaveCount(0);
        await expect(
          card.getByRole('button', { name: 'Paper coming soon', exact: true }),
        ).toBeDisabled();
        for (const path of [
          ...formats.map((f) => `research/citations/${paper.id}.${f.ext}`),
          `research/${paper.id}/paper.pdf`,
        ]) {
          assert.equal(
            (await context.request.get(`${origin}${base}${path}`)).status(),
            404,
          );
        }
      }
      const first = page.getByRole('button', { name: /^Cite: / }).first();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await first.focus();
        await page.keyboard.press('Space');
        const dialog = page.getByRole('dialog');
        for (const format of formats) {
          await dialog
            .getByRole('radio', { name: format.label, exact: true })
            .check();
          const box = await dialog.boundingBox();
          assert.ok(box.x >= 0 && box.x + box.width <= width);
          assert.ok(
            await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
          );
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          if (width === 390 || width === 1440)
            await page.screenshot({
              path: `.tools/research-cite-${format.ext}-${width}-${base === '/' ? 'root' : 'base'}.png`,
            });
          const audit = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();
          assert.deepEqual(audit.violations, []);
          for (let i = 0; i < 8; i++) {
            await page.keyboard.press('Tab');
            assert.ok(
              await dialog.evaluate((el) =>
                el.contains(document.activeElement),
              ),
            );
          }
        }
        await dialog.getByRole('button', { name: 'Close citation' }).click();
        await expect(first).toBeFocused();
      }
      await first.click();
      await page.mouse.click(1, 1);
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: () =>
              Promise.reject(new DOMException('Denied', 'NotAllowedError')),
          },
        }),
      );
      await first.click();
      const dialog = page.getByRole('dialog');
      for (const format of formats) {
        await dialog
          .getByRole('radio', { name: format.label, exact: true })
          .check();
        await dialog
          .getByRole('button', { name: `Copy ${format.label}`, exact: true })
          .click();
        await expect(dialog.getByRole('status')).toContainText(
          'Copy unavailable.',
        );
        const input = dialog.getByRole('textbox');
        await expect(input).toBeFocused();
        assert.ok(
          await input.evaluate(
            (el) =>
              el instanceof HTMLTextAreaElement &&
              el.selectionStart === 0 &&
              el.selectionEnd === el.value.length,
          ),
        );
      }
      assert.deepEqual(errors, []);
      const noJS = await browser.newContext({ javaScriptEnabled: false });
      try {
        const plain = await noJS.newPage();
        await plain.goto(`${origin}${base}research/`);
        for (const format of formats) {
          const links = plain.getByRole('link', {
            name: format.ext === 'txt' ? /^Cite: / : format.label,
            exact: true,
          });
          await expect(links).toHaveCount(4);
          const ready = plain.waitForEvent('download');
          await links.first().click();
          const download = await ready;
          assert.equal(
            download.suggestedFilename(),
            `magnetic-rf-computing.${format.ext}`,
          );
          assert.equal(
            await readFile(await download.path(), 'utf8'),
            await sourceText('magnetic-rf-computing', format.ext),
          );
        }
      } finally {
        await noJS.close();
      }
      console.log(
        `${base}: ${published.length} papers x Text/BibTeX/RIS view/copy/download passed; metadata, restricted URLs, keyboard, fallback, no-JS, four widths and axe passed`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
