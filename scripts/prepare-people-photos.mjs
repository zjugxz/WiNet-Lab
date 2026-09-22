// Offline utility: copies people photos from Git-ignored resources/ into
// optimized public/people/{id}.webp website copies. Originals stay untouched.
// Run from the project root: node scripts/prepare-people-photos.mjs
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const people = [
  ['Xiuzhen Guo_PI', '图片1.png', 'xiuzhen-guo'],
  ['Haobo Zhang_PhD', 'Joshua_2026-09-18 14.33.20_IMG_7121 2.jpg', 'haobo-zhang'],
  ['Hongyu Wang_PhD', '不日怪的日怪_2026-09-20 18.29.16_微信图片_20260920182338.jpg', 'hongyu-wang'],
  ['Junying Huang_PhD', '电信1904黄俊颖_2026-09-19 11.22.57_f40936072f4aa2333af9038228e069d1.jpg', 'junying-huang'],
  ['Long Tan_PhD', 'TTLL._2026-09-18 15.51.08_证件照.jpg', 'long-tan'],
  ['Xiangguang Wang_PhD', 'pepsi_2026-09-20 15.38.21_微信图片_20260920150055_82_114.jpg', 'xiangguang-wang'],
  ['Yifan Yan_PhD', '趁玖_2026-09-20 15.28.31_66d42f1e-eb01-49ae-9f15-0cee5fa4dee1.png', 'yifan-yan'],
  ['Yu Cao_PhD', '曹煜_2026-09-20 15.16.00_caoyu.jpg', 'yu-cao'],
  ['Zikang Zhang_PhD', 'abc_2026-09-20 23.18.32_WechatIMG1013.jpg', 'zikang-zhang'],
  ['Binghe Li_Master', 'LEE_2026-09-20 15.04.49_mmexport1778916642700.jpg', 'binghe-li'],
  ['Gaoming Yang_Master', '闲云野鹤_2026-09-20 23.28.52_IMG.jpg', 'gaoming-yang'],
  ['Tianyou Li_Master', '风起云归畔_2026-09-20 16.53.27_微信图片_20260920163519_211_2.jpg', 'tianyou-li'],
  ['Xu Chen_Master', 'uuSiXupup_2026-09-20 14.30.44_微信图片_20260330160629.png', 'xu-chen'],
  ['Yaobin Zhu_Master', '慢两拍_2026-09-18 13.05.54_微信图片_20260918130517_322_195.jpg', 'yaobin-zhu'],
  ['Zeyang Yang_Master', 'Zeyang yang.jpg', 'zeyang-yang'],
  ['Zhou Yang_Master', '憨祎的奶油_2026-09-20 14.57.38_IMG_2528_compressed.jpg', 'zhou-yang'],
];

const maxEdge = 960;
const outDir = path.resolve('public/people');
await mkdir(outDir, { recursive: true });

for (const [folder, file, id] of people) {
  const input = path.resolve('resources/people', folder, file);
  const output = path.join(outDir, `${id}.webp`);
  const { width, height } = await sharp(input)
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(output);
  const kb = (await sharp(output).metadata()).size / 1024;
  console.log(`${id}: ${width}x${height}, ${kb.toFixed(0)} KB <- ${folder}`);
}
