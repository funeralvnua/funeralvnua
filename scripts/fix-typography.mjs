/**
 * Безпечне виправлення типографіки в текстовому контенті.
 *
 * Що робить:
 * - ASCII apostrophe ' → ʼ (U+02BC), ТІЛЬКИ між кириличними літерами
 *   (захищає JS-синтаксис, YAML-frontmatter delimiters, code)
 * - Три ASCII крапки ... → … (U+2026), тільки в кінці речення (не у спред-операторі)
 * - "грн" → "₴" (consistency)
 * - UK-only: "крещен*" → "хрещен*", "Тройц*" → "Трійц*", "з священ" → "зі священ"
 *
 * Запуск: node scripts/fix-typography.mjs
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Файли для обробки ──────────────────────────────────────────
const MDX_DIRS = [
  'content/poslugy',
  'content/poradnyk',
  'content/blog',
  'content/dopomoga',
];

const JSON_FILES = [
  'data/services.json',
  'data/packages.json',
  'data/reviews.json',
  'data/faq.json',
  'data/offices.json',
  'data/locations.json',
  'messages/uk.json',
  // messages/ru.json — російська не використовує апостроф у рідних словах
];

// ─── Заміни ─────────────────────────────────────────────────────

/** Apostrophe між двома кириличними літерами */
const APOS = /(?<=[а-яА-ЯіІїЇєЄґҐ])'(?=[а-яА-ЯіІїЇєЄґҐ])/g;

/** Три ASCII крапки в кінці слова/після кириличного тексту */
const ELLIPSIS = /(?<=[а-яА-ЯіІїЇєЄґҐ»"'])\.\.\.(?![\w.])/g;

/** "грн" в контексті цін (з пробілом перед чи після числа) */
const HRN = /(\d[\d  ]*)\s*грн(?![а-яА-ЯіІїЇєЄґҐ])/g;

/** Російське/неправильне UK "крещен" → "хрещен" */
const KRESCHEN = /(?<![а-яА-ЯіІїЇєЄґҐ])([Кк])рещен/g;

/** "Тройці/Тройця/Тройцю" — застаріла форма → "Трійц*" */
const TROYTSYA = /\b([ТтсСвВ])([рp])([оo])([йj])([цc])/g;
// упрощений вариант
const TROYTSYA_SIMPLE = /Тройц/g;
const troytsya_simple_lc = /тройц/g;

/** "з священ" → "зі священ" (UK) */
const Z_SVYASHCH = /(?<![а-яА-ЯіІїЇєЄґҐ])з священ/g;

// ─── Допоміжні функції ──────────────────────────────────────────

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function applyReplacements(text, isUk, isMdx) {
  let count = { apos: 0, ellipsis: 0, hrn: 0, kreschen: 0, troytsya: 0, zsvyashch: 0 };
  let out = text;

  // Apostrophe — універсальна
  out = out.replace(APOS, () => { count.apos++; return 'ʼ'; });

  // Ellipsis — універсальна (тільки після кирилиці)
  out = out.replace(ELLIPSIS, () => { count.ellipsis++; return '…'; });

  // грн → ₴ — універсальна
  out = out.replace(HRN, (_m, num) => { count.hrn++; return `${num.trim()} ₴`; });

  // UK-only заміни
  if (isUk) {
    out = out.replace(KRESCHEN, (_m, c) => { count.kreschen++; return `${c}рещен`.replace('к', 'х').replace('К', 'Х'); });
    out = out.replace(TROYTSYA_SIMPLE, () => { count.troytsya++; return 'Трійц'; });
    out = out.replace(troytsya_simple_lc, () => { count.troytsya++; return 'трійц'; });
    out = out.replace(Z_SVYASHCH, () => { count.zsvyashch++; return 'зі священ'; });
  }

  return { out, count };
}

function isUkFile(filePath) {
  if (filePath.endsWith('.uk.mdx')) return true;
  if (filePath.endsWith('uk.json')) return true;
  // data/*.json — мають як uk, так і ru ключі. Універсальні заміни (apos, ellipsis, hrn) безпечні.
  // UK-специфічні (хрещен, Трійц) застосовуються тільки до явно UK-strings — пропускаємо для data/*.json.
  return false;
}

const totals = { files: 0, changed: 0, ...{ apos: 0, ellipsis: 0, hrn: 0, kreschen: 0, troytsya: 0, zsvyashch: 0 } };

async function processFile(absPath) {
  const rel = path.relative(ROOT, absPath);
  totals.files++;

  const isMdx = absPath.endsWith('.mdx');
  const isJson = absPath.endsWith('.json');
  if (!isMdx && !isJson) return;

  const text = await fs.readFile(absPath, 'utf8');
  const isUk = isUkFile(absPath);
  const { out, count } = applyReplacements(text, isUk, isMdx);

  const total = Object.values(count).reduce((a, b) => a + b, 0);
  if (total > 0) {
    await fs.writeFile(absPath, out, 'utf8');
    totals.changed++;
    Object.keys(count).forEach((k) => (totals[k] += count[k]));
    console.log(
      `  ${rel}: apos=${count.apos} ellipsis=${count.ellipsis} hrn=${count.hrn} ` +
      `xreshch=${count.kreschen} triyc=${count.troytsya} zsvy=${count.zsvyashch}`
    );
  }
}

async function main() {
  console.log('Processing MDX files...');
  for (const dir of MDX_DIRS) {
    const abs = path.join(ROOT, dir);
    for await (const f of walk(abs)) {
      if (f.endsWith('.mdx')) await processFile(f);
    }
  }

  console.log('\nProcessing JSON files...');
  for (const f of JSON_FILES) {
    await processFile(path.join(ROOT, f));
  }

  console.log('\n────────────────────────────────────');
  console.log(`Files scanned: ${totals.files}`);
  console.log(`Files changed: ${totals.changed}`);
  console.log(`Apostrophe ' → ʼ: ${totals.apos}`);
  console.log(`Ellipsis ... → …: ${totals.ellipsis}`);
  console.log(`грн → ₴: ${totals.hrn}`);
  console.log(`крещен → хрещен (UK): ${totals.kreschen}`);
  console.log(`Тройц → Трійц (UK): ${totals.troytsya}`);
  console.log(`з священ → зі священ (UK): ${totals.zsvyashch}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
