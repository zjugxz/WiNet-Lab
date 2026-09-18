// Isolated real-browser component check. Fixtures are injected only into ignored
// test builds; neither fixture pages nor generated media enter the published site.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'astro';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch({
  ignoreDefaultArgs: ['--autoplay-policy=no-user-gesture-required'],
});
try {
  const recorder = await browser.newPage();
  // Generate a tiny, silent playable WebM without downloading third-party media.
  const videoBytes = await recorder.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const context = canvas.getContext('2d');
    const stream = canvas.captureStream(12);
    const recording = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    recording.ondataavailable = (event) => chunks.push(event.data);
    const stopped = new Promise((resolve) => {
      recording.onstop = resolve;
    });
    recording.start();
    let frame = 0;
    const animation = setInterval(() => {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 160, 90);
      context.fillStyle = '#28563f';
      context.fillRect(frame++ * 8, 30, 20, 20);
    }, 80);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    recording.stop();
    await stopped;
    clearInterval(animation);
    stream.getTracks().forEach((track) => track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
  });
  await recorder.close();
  const video = Buffer.from(videoBytes);
  // Minimal blank PDF: exact bytes are checked after a real browser download.
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] >>',
  ];
  let pdfText = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdfText));
    pdfText += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdfText);
  pdfText += `xref\n0 4\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    .join('')}trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  const pdf = Buffer.from(pdfText);

  for (const base of ['/', '/WiNet-Lab/']) {
    const outDir = new URL(
      `../.tools/research-card-${base === '/' ? 'root' : 'base'}/`,
      import.meta.url,
    );
    const config = { base, outDir: fileURLToPath(outDir), logLevel: 'error' };
    await build({
      ...config,
      integrations: [
        {
          name: 'research-card-fixture',
          hooks: {
            'astro:config:setup': ({ injectRoute }) =>
              injectRoute({
                pattern: '/__research-card-check/',
                entrypoint: './tests/fixtures/research-card.astro',
              }),
          },
        },
      ],
    });
    const assets = new URL('research-check/', outDir);
    await mkdir(assets, { recursive: true });
    await Promise.all([
      writeFile(new URL('paper%20sample.pdf', assets), pdf),
      writeFile(new URL('short-preview.webm', assets), video),
      writeFile(new URL('full-demo.webm', assets), video),
      writeFile(
        new URL('captions.vtt', assets),
        'WEBVTT\n\n00:00.000 --> 00:01.200\nA green rectangle moves across the screen.\n',
      ),
    ]);
    const server = await preview({
      ...config,
      server: { host: '127.0.0.1', port: 4324 },
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const failures = [];
      page.on('pageerror', (error) => failures.push(error.message));
      page.on('response', (response) => {
        if (response.status() >= 400) failures.push(response.url());
      });
      await page.goto(`http://127.0.0.1:4324${base}__research-card-check/`);
      const videoCard = page.getByRole('article', {
        name: 'Video preview fixture',
        exact: true,
      });
      const clip = videoCard.locator('video');
      // Check before any click/key or explicit play(): autoplay must work by itself.
      assert.deepEqual(
        await clip.evaluate((element) => ({
          autoplay: element.autoplay,
          muted: element.muted,
          loop: element.loop,
          inline: element.playsInline,
        })),
        { autoplay: true, muted: true, loop: true, inline: true },
      );
      await expect
        .poll(() =>
          clip.evaluate(
            (element) => !element.paused && element.currentTime > 0,
          ),
        )
        .toBe(true);
      await clip.evaluate(
        (element) =>
          new Promise((resolve, reject) => {
            let previous = element.currentTime;
            const timeout = setTimeout(() => {
              element.removeEventListener('timeupdate', onTime);
              reject(new Error('Preview did not loop'));
            }, 6000);
            function onTime() {
              if (element.currentTime < previous) {
                clearTimeout(timeout);
                element.removeEventListener('timeupdate', onTime);
                resolve(true);
              }
              previous = element.currentTime;
            }
            element.addEventListener('timeupdate', onTime);
          }),
      );
      await clip.press('Space');
      await expect
        .poll(() => clip.evaluate((element) => element.paused))
        .toBe(true);
      await clip.press('Space');
      await expect
        .poll(() => clip.evaluate((element) => element.paused))
        .toBe(false);
      const imageCard = page.getByRole('article', {
        name: 'Image preview fixture',
        exact: true,
      });
      await expect
        .poll(() =>
          imageCard
            .locator('img')
            .evaluate((image) => image.complete && image.naturalWidth > 0),
        )
        .toBe(true);
      for (const [label, filename, expected] of [
        ['Paper:', 'test-paper.pdf', pdf],
        ['Demo:', 'test-full-demo.webm', video],
      ]) {
        const link = imageCard.getByRole('link', {
          name: new RegExp(`^${label}`),
        });
        assert(
          (await link.getAttribute('href')).startsWith(
            `${base}research-check/`,
          ),
        );
        const pending = page.waitForEvent('download');
        await link.press('Enter');
        const downloaded = await pending;
        assert.equal(downloaded.suggestedFilename(), filename);
        assert.deepEqual(await readFile(await downloaded.path()), expected);
      }
      await expect(
        videoCard.getByRole('button', { name: /Paper/ }),
      ).toBeDisabled();
      await expect(clip).toHaveAttribute('preload', 'metadata');
      assert.notEqual(
        await clip.getAttribute('src'),
        await videoCard.getByRole('link').getAttribute('href'),
      );
      await expect
        .poll(() => clip.locator('track').evaluate((track) => track.readyState))
        .toBe(2);
      const missing = page.getByRole('article', {
        name: 'Missing resources fixture',
        exact: true,
      });
      await expect(missing.getByRole('link')).toHaveCount(0);
      await expect(
        missing.getByRole('button', { name: /Paper/ }),
      ).toBeDisabled();
      await expect(missing.getByRole('button', { name: /Demo/ })).toHaveCount(
        0,
      );
      await expect(missing.locator('img, video')).toHaveCount(0);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        const [first, second, third] = await page
          .locator('.paper-card')
          .evaluateAll((cards) =>
            cards.map((card) => {
              const rect = card.getBoundingClientRect();
              return { x: rect.x, y: rect.y, width: rect.width };
            }),
          );
        if (width > 760) {
          assert.equal(first.y, second.y);
          assert(second.x > first.x + first.width);
          assert.equal(third.x, first.x);
          assert(third.y > first.y);
        } else {
          assert.equal(first.x, second.x);
          assert(second.y > first.y);
        }
        const button = await imageCard
          .getByRole('link', { name: /^Paper:/ })
          .boundingBox();
        assert(button.height >= 24 && button.height <= 32);
      }
      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      assert.deepEqual(accessibility.violations, []);
      assert.deepEqual(failures, []);
      console.log(
        `Research cards ${base}: muted autoplay/loop without interaction, pause/resume, two-column/mobile layout, compact buttons, exact downloads and accessibility passed.`,
      );
    } finally {
      await context.close();
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
