#!/usr/bin/env node
/**
 * Завантажує куровані стокові фото з Pexels/Unsplash у raw-photos/,
 * щоб далі їх обробив pnpm optimize:images.
 *
 * Усі фото — free commercial license, без вотермарків:
 *   - Pexels License: https://www.pexels.com/license/
 *   - Unsplash License: https://unsplash.com/license
 */
import { writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.resolve(__dirname, '..', 'raw-photos');

const STOCK = [
  // ─── poslugy.pomynalnyi-obid ──────────────────────────────────
  {
    name: 'stock-memorial-table',
    url: 'https://images.pexels.com/photos/8871516/pexels-photo-8871516.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Kampus Production',
    page: 'https://www.pexels.com/photo/8871516/',
    license: 'Pexels License',
  },
  {
    name: 'stock-memorial-dinner',
    url: 'https://images.pexels.com/photos/6715103/pexels-photo-6715103.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'cottonbro studio',
    page: 'https://www.pexels.com/photo/6715103/',
    license: 'Pexels License',
  },
  // ─── poslugy.oformlennya-dokumentiv ──────────────────────────
  {
    name: 'stock-signing-documents',
    url: 'https://images.pexels.com/photos/8730977/pexels-photo-8730977.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Mikhail Nilov',
    page: 'https://www.pexels.com/photo/8730977/',
    license: 'Pexels License',
  },
  // ─── tovary.odiah (краща версія - сукня на вішаку) ───────────
  {
    name: 'stock-black-dress',
    url: 'https://images.pexels.com/photos/19895955/pexels-photo-19895955.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'marceloverfe',
    page: 'https://www.pexels.com/photo/19895955/',
    license: 'Pexels License',
  },
  // ─── tovary.khresty ───────────────────────────────────────────
  {
    name: 'stock-wooden-cross',
    url: 'https://images.pexels.com/photos/6769912/pexels-photo-6769912.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Karola G',
    page: 'https://www.pexels.com/photo/6769912/',
    license: 'Pexels License',
  },
  {
    name: 'stock-wooden-cross-flowers',
    url: 'https://images.pexels.com/photos/34351057/pexels-photo-34351057.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Shox',
    page: 'https://www.pexels.com/photo/34351057/',
    license: 'Pexels License',
  },
  // ─── tovary.odiah ─────────────────────────────────────────────
  {
    name: 'stock-formal-suit',
    url: 'https://images.pexels.com/photos/32392072/pexels-photo-32392072.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Raana Jenab',
    page: 'https://www.pexels.com/photo/32392072/',
    license: 'Pexels License',
  },
  {
    name: 'stock-suit-hanger',
    url: 'https://images.pexels.com/photos/11474337/pexels-photo-11474337.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Filip Sestrenek',
    page: 'https://www.pexels.com/photo/11474337/',
    license: 'Pexels License',
  },
  // ─── tovary.aksesuary ─────────────────────────────────────────
  {
    name: 'stock-church-candles',
    url: 'https://images.pexels.com/photos/17841194/pexels-photo-17841194.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Emre Akyol',
    page: 'https://www.pexels.com/photo/17841194/',
    license: 'Pexels License',
  },
  {
    name: 'stock-orthodox-icon',
    url: 'https://images.pexels.com/photos/10618918/pexels-photo-10618918.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Ron Lach',
    page: 'https://www.pexels.com/photo/10618918/',
    license: 'Pexels License',
  },
  {
    name: 'stock-icon-candle',
    url: 'https://images.pexels.com/photos/10618849/pexels-photo-10618849.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Ron Lach',
    page: 'https://www.pexels.com/photo/10618849/',
    license: 'Pexels License',
  },
  // ─── poslugy.orkestr ──────────────────────────────────────────
  {
    name: 'stock-trumpet-bw',
    url: 'https://images.unsplash.com/photo-1698912236962-f0c136ad65a4?w=2400&fm=jpg&q=85',
    source: 'Unsplash',
    author: 'Gilles Gravier',
    page: 'https://unsplash.com/photos/hLwh2H6RXsU',
    license: 'Unsplash License',
  },
  {
    name: 'stock-brass-band',
    url: 'https://images.pexels.com/photos/33968490/pexels-photo-33968490.jpeg?auto=compress&cs=tinysrgb&w=2400',
    source: 'Pexels',
    author: 'Kari Alfonso',
    page: 'https://www.pexels.com/photo/33968490/',
    license: 'Pexels License',
  },
  // ─── poslugy.psaltyr-synhumator ───────────────────────────────
  {
    name: 'stock-open-book-candle',
    url: 'https://images.unsplash.com/photo-1639753759816-fd5442a41d1f?w=2400&fm=jpg&q=85',
    source: 'Unsplash',
    author: 'Sixteen Miles Out',
    page: 'https://unsplash.com/photos/1N8e3hMTAb8',
    license: 'Unsplash License',
  },
  {
    name: 'stock-cross-candle-table',
    url: 'https://images.unsplash.com/photo-1642715422854-7d3ff46cb036?w=2400&fm=jpg&q=85',
    source: 'Unsplash',
    author: 'Maegan Martin',
    page: 'https://unsplash.com/photos/u_BxRvxX6aQ',
    license: 'Unsplash License',
  },
];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function download(item) {
  const target = path.join(RAW_DIR, `${item.name}.jpg`);
  if (await exists(target)) {
    console.log(`◦  ${item.name}  (вже завантажено, пропускаю)`);
    return { ...item, skipped: true };
  }
  const res = await fetch(item.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ritual-vn-ua/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${item.url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  console.log(`✓  ${item.name}  (${(buf.length / 1024).toFixed(0)} KB)  — ${item.author}, ${item.source}`);
  return item;
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  console.log(`Завантажую ${STOCK.length} стокових фото у ${RAW_DIR}\n`);
  console.log('━'.repeat(60));

  const results = [];
  for (const item of STOCK) {
    try {
      results.push(await download(item));
    } catch (e) {
      console.error(`✗  ${item.name}: ${e.message}`);
    }
  }

  console.log('━'.repeat(60));
  const downloaded = results.filter((r) => !r.skipped).length;
  console.log(`\n✓ Готово. Нових: ${downloaded}. Загалом: ${results.length}/${STOCK.length}.`);
  console.log('\nДалі запусти:  pnpm optimize:images');
  console.log('\nКредити (потрібні для футера):');
  for (const r of results) {
    console.log(`  • ${r.author} (${r.source})  ← ${r.page}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
