import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publications = JSON.parse(
  await readFile('src/data/publications.json', 'utf8'),
);
const sources = JSON.parse(
  await readFile('src/data/citations/sources.json', 'utf8'),
);
const formats = [
  { label: 'Text', ext: 'txt' },
  { label: 'BibTeX', ext: 'bib' },
  { label: 'RIS', ext: 'ris' },
];
const sourceText = async (id, ext) =>
  (await readFile(`src/data/citations/${id}.${ext}`, 'utf8'))
    .replace(/\r\n?/g, '\n')
    .trim() + '\n';

const citable = publications.filter((p) => p.id !== 'p03');
assert.equal(citable.length, 73);
assert.equal(sources.p03, undefined);

// Every citable publication ships all three formats from real sources.
for (const pub of citable) {
  assert.ok(sources[pub.id], `${pub.id}: sources.json entry`);
  assert.match(sources[pub.id].url, /^https:\/\//);
  assert.ok(
    ['Cell', 'IEEE', 'GB/T 7714'].includes(sources[pub.id].textStyle),
    `${pub.id}: text style`,
  );
  const ris = await sourceText(pub.id, 'ris');
  const fields = [...ris.matchAll(/^([A-Z0-9]{2})  -(?: (.*))?$/gm)];
  const values = (tag) =>
    fields.filter((f) => f[1] === tag).map((f) => f[2] || '');
  const expectedType =
    pub.type === 'book' ? 'BOOK' : pub.type === 'journal' ? 'JOUR' : 'CONF';
  assert.equal(values('TY')[0], expectedType, `${pub.id}: TY`);
  assert.equal(values('TI')[0], pub.title, `${pub.id}: TI`);
  if (pub.type !== 'book')
    assert.equal(values('T2')[0], pub.venue, `${pub.id}: T2`);
  assert.deepEqual(
    values('AU').map((name) =>
      name.includes(', ')
        ? name.split(', ').reverse().join(' ')
        : name,
    ),
    pub.authors,
    `${pub.id}: AU order`,
  );
  assert.equal(values('PY')[0], String(pub.year), `${pub.id}: PY`);
  if (pub.doi) {
    assert.equal(
      values('DO')[0].toLowerCase(),
      pub.doi.toLowerCase(),
      `${pub.id}: DO`,
    );
  } else {
    assert.equal(values('DO').length, 0, `${pub.id}: no DOI expected`);
  }
  // Books carry an extent ("XV, 183") rather than a citable page range.
  if (pub.pages && pub.type !== 'book')
    assert.equal(
      [values('SP')[0], values('EP')[0]].filter(Boolean).join('-'),
      pub.pages.replace(/–/g, '-'),
      `${pub.id}: SP/EP`,
    );
  if (pub.volume)
    assert.equal(values('VL')[0], pub.volume, `${pub.id}: VL`);
  if (pub.issue) assert.equal(values('IS')[0], pub.issue, `${pub.id}: IS`);
  assert.ok(ris.endsWith('ER  -\n'), `${pub.id}: ER terminator`);

  const bib = await sourceText(pub.id, 'bib');
  const bibType =
    pub.type === 'book'
      ? '@book'
      : pub.type === 'journal'
        ? '@article'
        : '@inproceedings';
  assert.ok(bib.startsWith(bibType + '{'), `${pub.id}: bib type`);
  const bibTitle = bib.match(/^  title = \{(.*)\},$/m)[1].replace(/[{}]/g, '');
  assert.equal(bibTitle, pub.title, `${pub.id}: bib title`);
  assert.deepEqual(
    bib
      .match(/^  author = \{(.*)\},$/m)[1]
      .split(' and ')
      .map((name) => name.split(', ').reverse().join(' ')),
    pub.authors,
    `${pub.id}: bib authors`,
  );
  assert.ok(bib.includes(`  year = {${pub.year}},`), `${pub.id}: bib year`);
  if (pub.type !== 'book')
    assert.ok(
      bib.includes(
        `  ${pub.type === 'journal' ? 'journal' : 'booktitle'} = {${pub.venue}},`,
      ),
      `${pub.id}: bib venue`,
    );
  if (pub.volume)
    assert.ok(bib.includes(`  volume = {${pub.volume}},`), `${pub.id}: bib vol`);
  if (pub.pages && pub.type !== 'book')
    assert.ok(
      bib.includes(`  pages = {${pub.pages.replace(/(\d)[-–](\d)/g, '$1--$2')}}`),
      `${pub.id}: bib pages`,
    );
  if (pub.doi)
    assert.ok(
      bib.toLowerCase().includes(pub.doi.toLowerCase()),
      `${pub.id}: bib doi`,
    );

  const txt = await sourceText(pub.id, 'txt');
  assert.ok(txt.includes(pub.title), `${pub.id}: txt title`);
  assert.ok(txt.includes(pub.venue), `${pub.id}: txt venue`);
  assert.ok(txt.includes(String(pub.year)), `${pub.id}: txt year`);
  if (pub.doi)
    assert.ok(
      txt.toLowerCase().includes(pub.doi.toLowerCase()),
      `${pub.id}: txt doi`,
    );
}
assert.equal(
  Object.keys(sources).filter((id) => /^p\d+$/.test(id)).length,
  73,
  'exactly 73 publication registrations',
);

const browser = await chromium.launch();
try {
  // Deep interaction sample: Cell text, IEEE journal, USENIX conference
  // without DOI, GB/T Chinese article, and the Springer book.
  const sample = ['p01', 'p16', 'p23', 'p34', 'p75'];
  for (const base of ['/', '/WiNet-Lab/']) {
    const server = await preview({
      base,
      outDir: base === '/' ? 'dist' : '.tools/base-dist',
      server: { host: '127.0.0.1', port: 4326 },
    });
    const origin = 'http://127.0.0.1:4326';
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${origin}${base}publications/`);
      await expect(page.locator('[data-publication]')).toHaveCount(74);
      await expect(
        page.getByRole('button', { name: /^Cite: / }),
      ).toHaveCount(73);
      assert.equal(
        await page.locator('#p03 citation-dialog').count(),
        0,
        'unconfirmed p03 has no Cite entry',
      );
      // Search behavior stays bound to card text, not citation payloads.
      await page.getByRole('searchbox').fill('wizig');
      await expect(page.locator('[data-publication]:visible')).toHaveCount(2);
      await page.getByRole('button', { name: 'Clear all', exact: true }).click();

      for (const id of sample) {
        const pub = publications.find((p) => p.id === id);
        const opener = page.getByRole('button', {
          name: `Cite: ${pub.title}`,
          exact: true,
        });
        await opener.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Cite this paper' });
        await expect(dialog).toBeVisible();
        await expect(
          dialog.getByRole('radio', { name: 'Text', exact: true }),
        ).toBeChecked();
        const help = await dialog.locator('.format-help').first().textContent();
        assert.ok(
          help.startsWith(sources[id].textStyle + ' style'),
          `${id}: ${help}`,
        );
        assert.equal(
          await dialog
            .getByRole('link', { name: 'View publication' })
            .getAttribute('href'),
          sources[id].url,
        );
        for (const format of formats) {
          const source = await sourceText(id, format.ext);
          await dialog
            .getByRole('radio', { name: format.label, exact: true })
            .check();
          await expect(dialog.getByRole('textbox')).toHaveValue(source);
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
          assert.equal(download.suggestedFilename(), `${id}.${format.ext}`);
          assert.equal(await readFile(await download.path(), 'utf8'), source);
          const response = await context.request.get(
            `${origin}${base}publications/citations/${id}.${format.ext}`,
          );
          assert.equal(response.status(), 200);
          assert.equal(await response.text(), source);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
      }

      // Every exported file of every entry serves the exact source bytes.
      for (const pub of citable) {
        for (const format of formats) {
          const response = await context.request.get(
            `${origin}${base}publications/citations/${pub.id}.${format.ext}`,
          );
          assert.equal(response.status(), 200, `${pub.id}.${format.ext}`);
          assert.equal(
            await response.text(),
            await sourceText(pub.id, format.ext),
          );
        }
      }
      assert.equal(
        (
          await context.request.get(`${origin}${base}publications/citations/p03.txt`)
        ).status(),
        404,
      );

      const first = page.getByRole('button', { name: /^Cite: / }).first();
      for (const width of [390, 1440]) {
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
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
        }
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: `.tools/publications-cite-${width}-${base === '/' ? 'root' : 'base'}.png`,
          });
        const audit = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        assert.deepEqual(audit.violations, []);
        await dialog.getByRole('button', { name: 'Close citation' }).click();
        await expect(first).toBeFocused();
      }
      assert.deepEqual(errors, []);

      const noJS = await browser.newContext({ javaScriptEnabled: false });
      try {
        const plain = await noJS.newPage();
        await plain.goto(`${origin}${base}publications/`);
        for (const format of formats) {
          const links = plain.getByRole('link', {
            name: format.ext === 'txt' ? /^Cite: / : format.label,
            exact: true,
          });
          await expect(links).toHaveCount(73);
        }
        const ready = plain.waitForEvent('download');
        await plain
          .getByRole('link', { name: /^Cite: / })
          .first()
          .click();
        const download = await ready;
        assert.equal(download.suggestedFilename(), 'p01.txt');
        assert.equal(
          await readFile(await download.path(), 'utf8'),
          await sourceText('p01', 'txt'),
        );
      } finally {
        await noJS.close();
      }
      console.log(
        `${base}: 73 citations x 3 formats static+HTTP verified; sample dialogs, search, widths, axe and no-JS passed`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
