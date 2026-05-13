#!/usr/bin/env node
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { readdir, mkdir, stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const INPUT = path.join(ROOT, 'raw-photos');
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

const formatBytes = (b) => `${(b / 1024).toFixed(0)} KB`;

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(jpe?g|png|tiff?|webp|heic|heif)$/i.test(e.name))
    .map((e) => e.name);
}

async function loadAsBuffer(inputPath) {
  const raw = await readFile(inputPath);
  const ext = path.extname(inputPath).toLowerCase();
  // Detect real format from magic bytes — extensions lie sometimes (HEIC files
  // that are actually JPEG, etc).
  const isJpegMagic = raw[0] === 0xff && raw[1] === 0xd8;
  const isPngMagic = raw[0] === 0x89 && raw[1] === 0x50;
  const isHeicByExt = ext === '.heic' || ext === '.heif';

  if (isHeicByExt && !isJpegMagic && !isPngMagic) {
    try {
      const jpegBuf = await heicConvert({ buffer: raw, format: 'JPEG', quality: 0.95 });
      return Buffer.from(jpegBuf);
    } catch (e) {
      // Fall through to raw — sharp may still handle it
    }
  }
  return raw;
}

async function processOne(file) {
  const input = path.join(INPUT, file);
  const name = path.parse(file).name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const buffer = await loadAsBuffer(input);
  const meta = await sharp(buffer).metadata();
  const origSize = (await stat(input)).size;
  console.log(`\n→ ${file}  (${meta.width}×${meta.height}, ${formatBytes(origSize)})`);

  // Production outputs
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

    const [jpgS, webpS, avifS] = await Promise.all([
      stat(jpgPath), stat(webpPath), stat(avifPath),
    ]);
    console.log(
      `   ${p.suffix.padEnd(10)} ${p.width}${p.height ? `×${p.height}` : 'w'}: ` +
      `jpg ${formatBytes(jpgS.size)}  webp ${formatBytes(webpS.size)}  avif ${formatBytes(avifS.size)}`
    );
  }

  // Lightweight copy for Claude analysis
  const reviewPath = path.join(REVIEW, `${name}.webp`);
  await sharp(buffer)
    .rotate()
    .resize({ width: REVIEW_PROFILE.width, withoutEnlargement: true })
    .webp({ quality: REVIEW_PROFILE.webpQ })
    .toFile(reviewPath);
  const reviewSize = (await stat(reviewPath)).size;
  console.log(`   review     ${REVIEW_PROFILE.width}w: webp ${formatBytes(reviewSize)}`);
}

async function main() {
  await Promise.all([ensureDir(OUTPUT), ensureDir(REVIEW)]);

  const files = await listImages(INPUT).catch(() => []);
  if (files.length === 0) {
    console.error(`\n⚠  Немає фото у ${INPUT}\n   Скинь оригінали туди й запусти знову.\n`);
    process.exit(1);
  }

  console.log(`\nЗнайдено ${files.length} фото у raw-photos/`);
  console.log(`Вихід: public/images/  +  raw-photos/for-claude/`);
  console.log('━'.repeat(60));

  const t0 = Date.now();
  let ok = 0, fail = 0;
  for (const f of files) {
    try { await processOne(f); ok++; }
    catch (e) { console.error(`   ✗ ${f}: ${e.message}`); fail++; }
  }
  const sec = ((Date.now() - t0) / 1000).toFixed(1);

  console.log('\n' + '━'.repeat(60));
  console.log(`✓ Готово за ${sec}s.  Успішно: ${ok}.  Помилок: ${fail}.`);
  console.log(`\nПродакшн-фото:  public/images/`);
  console.log(`Для аналізу:    raw-photos/for-claude/  (надішли мені цю папку)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
