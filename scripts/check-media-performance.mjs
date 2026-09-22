import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';

const manifest = JSON.parse(
  await readFile('docs/verification/media-optimization-manifest.json', 'utf8'),
);
for (const item of [...manifest.previews, ...manifest.downloads]) {
  const bytes = await readFile(`public/${item.source}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256);
  if (!item.afterBytes) continue;
  assert.equal(bytes.length, item.afterBytes);
  const boxes = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    let size = bytes.readUInt32BE(offset);
    if (size === 1) size = Number(bytes.readBigUInt64BE(offset + 8));
    if (size === 0) size = bytes.length - offset;
    assert(size >= 8);
    boxes.push(bytes.toString('ascii', offset + 4, offset + 8));
    offset += size;
  }
  assert(
    boxes.indexOf('moov') >= 0 && boxes.indexOf('moov') < boxes.indexOf('mdat'),
  );
}

await mkdir('.tools/media-optimization', { recursive: true });
const results = [];
const browser = await chromium.launch({
  ignoreDefaultArgs: ['--autoplay-policy=no-user-gesture-required'],
});
try {
  for (const base of ['/', '/WiNet-Lab/']) {
    const tag = base === '/' ? 'root' : 'base';
    const server = await preview({
      base,
      outDir: base === '/' ? 'dist' : '.tools/base-dist',
      server: { host: '127.0.0.1', port: 4325 },
    });
    const url = `http://127.0.0.1:4325${base}`;
    try {
      for (const [width, dpr] of [
        [320, 2],
        [390, 2],
        [768, 1],
        [1440, 1],
        [1440, 2],
      ]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          deviceScaleFactor: dpr,
        });
        const page = await context.newPage();
        const requests = [];
        page.on('request', (request) => requests.push(request.url()));
        await page.goto(url);
        const image = page.locator('.hero-visual img');
        await expect
          .poll(() =>
            image.evaluate((img) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
        const src = await image.evaluate((img) => img.currentSrc);
        assert(
          new URL(src).pathname.startsWith(`${base}_astro/`) &&
            src.endsWith('.webp'),
        );
        assert(
          !requests.some((request) =>
            request.endsWith('/images/winet-lab-wordcloud.png'),
          ),
        );
        const response = await page.request.get(src);
        const bytes = (await response.body()).length;
        assert(bytes < 1_854_233);
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        results.push({ base, width, dpr, homeImageBytes: bytes });
        if ([390, 1440].includes(width))
          await page.screenshot({
            path: `.tools/media-optimization/home-${tag}-${width}-${dpr}.png`,
          });
        await context.close();
      }

      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      });
      const page = await context.newPage();
      const errors = [];
      const mediaRequests = new Set();
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (request.url().endsWith('.mp4'))
          mediaRequests.add(new URL(request.url()).pathname);
      });
      await page.goto(`${url}research/`);
      const clips = page.locator('video[data-preview-video]');
      await expect(clips).toHaveCount(7);
      const playing = (clip) =>
        clip.evaluate((video) => !video.paused && video.currentTime > 0);
      await expect.poll(() => playing(clips.nth(0))).toBe(true);
      // The queue grants the connection to one clip until it is fully
      // buffered; Chromium also suspends the tail of a download briefly, so
      // the side-by-side clip may take well past the default poll timeout.
      await expect
        .poll(() => playing(clips.nth(1)), { timeout: 30000 })
        .toBe(true);
      for (let i = 2; i < 7; i++)
        await expect(clips.nth(i)).not.toHaveAttribute('src');
      assert.equal(
        mediaRequests.size,
        2,
        'Only the first visible row should request video',
      );
      results.push({ base, initialVideoRequests: [...mediaRequests] });
      await page.screenshot({
        path: `.tools/media-optimization/research-${tag}-1440.png`,
      });

      // An automatic offscreen pause must resume; a visitor pause must persist.
      await clips.nth(0).press('Space');
      await expect
        .poll(() => clips.nth(0).evaluate((v) => v.paused))
        .toBe(true);
      await clips.nth(4).scrollIntoViewIfNeeded();
      await expect.poll(() => playing(clips.nth(4))).toBe(true);
      await expect
        .poll(() => clips.nth(1).evaluate((v) => v.paused))
        .toBe(true);
      await clips.nth(0).scrollIntoViewIfNeeded();
      await expect.poll(() => playing(clips.nth(1))).toBe(true);
      assert(await clips.nth(0).evaluate((v) => v.paused));
      await clips.nth(0).press('Space');
      await expect.poll(() => playing(clips.nth(0))).toBe(true);

      // Seek close to the end, then observe an actual wrap into the next loop.
      for (let i = 0; i < 5; i++) {
        const clip = clips.nth(i);
        await clip.scrollIntoViewIfNeeded();
        await expect.poll(() => playing(clip)).toBe(true);
        const media = await clip.evaluate((v) => ({
          duration: v.duration,
          width: v.videoWidth,
          height: v.videoHeight,
          muted: v.muted,
          loop: v.loop,
          inline: v.playsInline,
        }));
        assert(
          media.width > 0 &&
            media.height <= 720 &&
            media.muted &&
            media.loop &&
            media.inline,
        );
        await clip.evaluate((v) => {
          v.currentTime = v.duration - 0.3;
        });
        await expect
          .poll(() => clip.evaluate((v) => v.currentTime < 3 && !v.paused), {
            timeout: 10000,
          })
          .toBe(true);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await clips.nth(2).scrollIntoViewIfNeeded();
      await expect.poll(() => playing(clips.nth(2))).toBe(true);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({
        path: `.tools/media-optimization/research-${tag}-390.png`,
      });
      assert.deepEqual(errors, []);
      await context.close();

      const nojs = await browser.newContext({ javaScriptEnabled: false });
      const fallback = await nojs.newPage();
      await fallback.goto(`${url}research/`);
      await expect(fallback.locator('video:visible')).toHaveCount(7);
      const manual = fallback.locator('noscript video').first();
      await manual.scrollIntoViewIfNeeded();
      await manual.press('Space');
      await expect.poll(() => playing(manual)).toBe(true);
      await nojs.close();
      console.log(
        `${base}: responsive images, deferred requests, auto playback/loop, scroll pause/resume, manual pause, mobile and no-JS fallback passed`,
      );
    } finally {
      await server.stop();
    }
  }
} finally {
  await browser.close();
}
await writeFile(
  '.tools/media-optimization/browser-results.json',
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
