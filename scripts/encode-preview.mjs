// Explicit offline conversion: never overwrite the supplied original.
// node scripts/encode-preview.mjs INPUT OUTPUT [FFMPEG] [--height N] [--maxrate Kbps]
// Defaults keep the original 720p CRF23 recipe; --height/--maxrate cap the
// resolution and bitrate for bandwidth-constrained previews.
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const positional = [];
let maxHeight = 720;
let maxrate;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--height') maxHeight = Number(process.argv[++i]);
  else if (arg === '--maxrate') maxrate = Number(process.argv[++i]);
  else positional.push(arg);
}
const [input, output, ffmpeg = 'ffmpeg'] = positional;
if (!input || !output || resolve(input) === resolve(output)) {
  throw new Error(
    'Provide distinct input and output paths. Original media must be preserved.',
  );
}
await mkdir(dirname(resolve(output)), { recursive: true });
const rate = [];
if (maxrate) rate.push('-maxrate', `${maxrate}k`, '-bufsize', `${maxrate * 2}k`);
const child = spawn(
  ffmpeg,
  [
    '-hide_banner',
    '-loglevel',
    'error',
    '-n',
    '-i',
    input,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-vf',
    `scale=w='min(${Math.round((maxHeight * 16) / 9)},iw)':h='min(${maxHeight},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '23',
    ...rate,
    '-pix_fmt',
    'yuv420p',
    '-threads',
    '2',
    '-g',
    '60',
    '-c:a',
    'copy',
    '-movflags',
    '+faststart',
    output,
  ],
  { stdio: 'inherit', windowsHide: true },
);
await new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) =>
    code === 0 ? resolve() : reject(new Error(`FFmpeg exit ${code}`)),
  );
});
