/**
 * Замінює "—" (em-dash U+2014) і "→" (rightwards arrow U+2192)
 * на ASCII "-" (hyphen-minus U+002D) у всіх перекладах.
 *
 * Scope:
 * - content/**\/*.mdx
 * - data/*.json
 * - messages/*.json
 * - app/[locale]/**\/*.tsx (hardcoded UK/RU рядки)
 * - components/**\/*.tsx (hardcoded user-visible тексти)
 *
 * "—" і "→" — Unicode-символи поза синтаксисом JS/JSX/CSS/JSON,
 * тому blanket-replace безпечний (вони існують тільки в текстах для користувача).
 *
 * Запуск: node scripts/replace-dashes.mjs
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGET_DIRS = [
  'content',
  'data',
  'messages',
  'app',
  'components',
];

const VALID_EXT = new Set(['.mdx', '.json', '.tsx']);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const totals = { files: 0, changed: 0, emDash: 0, arrow: 0 };

async function processFile(absPath) {
  const ext = path.extname(absPath);
  if (!VALID_EXT.has(ext)) return;
  totals.files++;

  const text = await fs.readFile(absPath, 'utf8');
  const emDashCount = (text.match(/—/g) || []).length;
  const arrowCount = (text.match(/→/g) || []).length;

  if (emDashCount === 0 && arrowCount === 0) return;

  const out = text.replaceAll('—', '-').replaceAll('→', '-');
  await fs.writeFile(absPath, out, 'utf8');

  totals.changed++;
  totals.emDash += emDashCount;
  totals.arrow += arrowCount;
  console.log(`  ${path.relative(ROOT, absPath)}: em-dash=${emDashCount} arrow=${arrowCount}`);
}

async function main() {
  for (const dir of TARGET_DIRS) {
    const abs = path.join(ROOT, dir);
    try {
      for await (const f of walk(abs)) await processFile(f);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }

  console.log('\n────────────────────────────────────');
  console.log(`Files scanned: ${totals.files}`);
  console.log(`Files changed: ${totals.changed}`);
  console.log(`Em-dash "—" → "-": ${totals.emDash}`);
  console.log(`Arrow "→" → "-": ${totals.arrow}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
