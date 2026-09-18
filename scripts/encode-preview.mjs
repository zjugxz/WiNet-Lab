// Explicit offline conversion: never overwrite the supplied original.
// node scripts/encode-preview.mjs INPUT OUTPUT [FFMPEG]
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const [input, output, ffmpeg = 'ffmpeg'] = process.argv.slice(2);
if (!input || !output || resolve(input) === resolve(output)) {
  throw new Error(
    'Provide distinct input and output paths. Original media must be preserved.',
  );
}
await mkdir(dirname(resolve(output)), { recursive: true });
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
    "scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '23',
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
