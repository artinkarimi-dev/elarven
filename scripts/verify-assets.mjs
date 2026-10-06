import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const imageDir = path.join(process.cwd(), 'public', 'images');
const files = await readdir(imageDir);
const raster = files.filter((file) => /\.(avif|webp|png|jpe?g)$/i.test(file));
const invalid = raster.filter((file) => !/\.webp$/i.test(file));

if (invalid.length) {
  throw new Error(`Non-WebP source assets found: ${invalid.join(', ')}`);
}

const oversized = [];
for (const file of raster) {
  const info = await stat(path.join(imageDir, file));
  if (info.size > 400 * 1024) oversized.push(`${file} (${Math.round(info.size / 1024)} KiB)`);
}

if (oversized.length) {
  throw new Error(`Source assets above the 400 KiB budget: ${oversized.join(', ')}`);
}

console.log(`Asset budget passed: ${raster.length} WebP images, each <= 400 KiB.`);
