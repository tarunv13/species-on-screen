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

  RETIRED FROM THE RENDER PATH (2026-09-11). This script is KEPT and still
  works; nothing renders its output. The atlas field record no longer fetches
  public/news/<place>.json, and that directory is gone.

  The measurement that retired it, so the decision is reproducible rather than
  remembered. Run across the three landscapes that have a surface, over GDELT's
  full TWELVE-MONTH window:

      sundarbans      0 articles
      coral-triangle  0 articles
      amazon-varzea   1 article, a FALSE POSITIVE — a crofelemer clinical-trial
                      press release, matched because the company is named
                      Jaguar and the compound derives from an Amazonian tree,
                      so the wire copy contains "Amazon rainforest"

  Zero usable items and one misleading one in a year. GDELT's English-language
  index does not reach these places, and a block captioned "Current coverage"
  showing a pharmaceutical press release for the Amazon varzea misstates the
  place. Re-run this script to re-measure before any argument to reinstate it.

  NOT PRE-STAGED (ruling 2026-09-11). Generate news JSON only for landscapes
  that HAVE a surface to render it. The field record fetches
  public/news/<place>.json for the place it is displaying, so a file written
  for a landscape with no atlas page is unreachable by construction — it is
  fetched by nobody and goes stale unobserved. Three such files (congo-basin,
  great-barrier-reef, serengeti-mara) were removed on 2026-09-11: each held
  articles: [] from a 2026-06-21 fetch, none appeared in index.json, and none
  was reachable. Empty files standing in for an intention are speculative
  artifacts, which do not ship here — the same rule that deleted the V1.4
  composition scale. Regenerating one is a single command once its page
  exists, so nothing is lost by not pre-staging.

  The registry (landscapes.json) remains deliberately aspirational — it is a
  superset of the built places. That is the right place for an intention; an
  empty data file is not.
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
