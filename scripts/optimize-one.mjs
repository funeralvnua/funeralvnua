#!/usr/bin/env node
// One-shot: same profiles as optimize-images.mjs but for a single file.
// Usage: node scripts/optimize-one.mjs <filename-in-raw-photos>
import sharp from 'sharp';
import { stat, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'raw-photos');
const OUTPUT = path.join(ROOT, 'public', 'images');
const REVIEW = path.join(ROOT, 'raw-photos', 'for-claude');

const PROFILES = [
  { suffix: '-hero',      width: 1920, jpegQ: 82, webpQ: 80, avifQ: 60 },
  { suffix: '-hero@2x',   width: 2560, jpegQ: 80, webpQ: 78, avifQ: 58 },
  { suffix: '-card',      width: 800,  jpegQ: 84, webpQ: 82, avifQ: 62 },
  { suffix: '-thumb',     width: 400,  jpegQ: 86, webpQ: 84, avifQ: 65 },
  { suffix: '-og',        width: 1200, height: 630, fit: 'cover', jpegQ: 85, webpQ: 82, avifQ: 62 },
];
const REVIEW_PROFILE = { width: 1024, webpQ: 75 };

const fmt = (b) => `${(b / 1024).toFixed(0)} KB`;

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/optimize-one.mjs <filename>');
  process.exit(1);
}

await mkdir(OUTPUT, { recursive: true });
await mkdir(REVIEW, { recursive: true });

const input = path.join(INPUT_DIR, file);
const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
const buffer = await readFile(input);
const meta = await sharp(buffer).metadata();
console.log(`\n→ ${file}  (${meta.width}×${meta.height}, slug=${name})`);

for (const p of PROFILES) {
  const base = sharp(buffer).rotate();
  const resized = p.height
    ? base.resize({ width: p.width, height: p.height, fit: p.fit, position: 'center' })
    : base.resize({ width: p.width, withoutEnlargement: true });
  const outName = `${name}${p.suffix}`;
  const jpgPath  = path.join(OUTPUT, `${outName}.jpg`);
  const webpPath = path.join(OUTPUT, `${outName}.webp`);
  const avifPath = path.join(OUTPUT, `${outName}.avif`);
  await Promise.all([
    resized.clone().jpeg({ quality: p.jpegQ, mozjpeg: true }).toFile(jpgPath),
    resized.clone().webp({ quality: p.webpQ, effort: 5 }).toFile(webpPath),
    resized.clone().avif({ quality: p.avifQ, effort: 5 }).toFile(avifPath),
  ]);
  const [jS, wS, aS] = await Promise.all([stat(jpgPath), stat(webpPath), stat(avifPath)]);
  console.log(`   ${p.suffix.padEnd(10)} jpg ${fmt(jS.size)}  webp ${fmt(wS.size)}  avif ${fmt(aS.size)}`);
}

const reviewPath = path.join(REVIEW, `${name}.webp`);
await sharp(buffer).rotate().resize({ width: REVIEW_PROFILE.width, withoutEnlargement: true })
  .webp({ quality: REVIEW_PROFILE.webpQ }).toFile(reviewPath);
const rS = await stat(reviewPath);
console.log(`   review     ${REVIEW_PROFILE.width}w: webp ${fmt(rS.size)}`);
console.log(`\n✓ Готово. src у photos.json: "${name}"\n`);
