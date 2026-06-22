/*
  build-news — the current-events / news layer.
  ---------------------------------------------
  Reads scripts/ingest/landscapes.json (the global landscape registry),
  queries GDELT for recent English coverage per landscape (throttled to
  respect the ~1 request / 5s limit), and writes public/news/<id>.json
  plus public/news/index.json. The field-record surfaces these as dated,
  sourced coverage in its cascade beat.

  Run: npm run ingest:news               (all landscapes — slow, ~5s each)
       npm run ingest:news sundarbans amazon-varzea   (subset)
*/

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchNews } from './gdelt.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REG = JSON.parse(readFileSync(resolve(__dirname, 'landscapes.json'), 'utf8')).landscapes;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const only = process.argv.slice(2);
  const list = only.length ? REG.filter((l) => only.includes(l.id)) : REG;
  if (!list.length) { console.error('No matching landscape id.'); process.exit(1); }

  const dir = resolve(ROOT, 'public/news');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const index = [];
  for (let i = 0; i < list.length; i++) {
    const l = list[i];
    if (i > 0) await sleep(5500); // GDELT throttle
    process.stdout.write(`[${l.id}] ${l.name} … `);
    let res = await fetchNews(l.newsQuery, 8);
    if (res.rateLimited) { await sleep(6000); res = await fetchNews(l.newsQuery, 8); }
    const out = {
      id: l.id, name: l.name, region: l.region, biome: l.biome,
      protectedArea: l.protectedArea, query: l.newsQuery,
      fetched: new Date().toISOString(),
      source: 'GDELT 2.0 DOC API',
      articles: res.articles || [],
    };
    writeFileSync(resolve(dir, `${l.id}.json`), JSON.stringify(out, null, 2) + '\n');
    index.push({ id: l.id, name: l.name, region: l.region, count: out.articles.length });
    console.log(`${out.articles.length} article(s)`);
  }
  writeFileSync(resolve(dir, 'index.json'), JSON.stringify({ generated: new Date().toISOString(), places: index }, null, 2) + '\n');
  console.log(`\n✓ news complete: ${index.map((p) => `${p.id}(${p.count})`).join(', ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
