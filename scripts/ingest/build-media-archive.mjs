/*
  build-media-archive — V1.6. How the Sundarbans taxa appear in human visual
  culture, admitted only through the citation bar.

  Scope: the nine taxa in public/dwca/sundarbans/occurrence.txt. Not widened to
  other places or the 24-landscape registry in this pass.

  EVERY RECORD PASSES scripts/media-citation-bar.mjs. A harvester cannot admit
  a row by being careless; the gate is a separate pure module and the refusals
  are written to the output file rather than dropped, because the refusals are
  the evidence the bar works.

  RELEVANCE IS NOT THE SAME QUESTION AS CITABILITY, AND THIS SCRIPT ONLY
  ANSWERS THE SECOND.

  The bar decides whether a record can be re-pulled. It cannot decide whether a
  film called "Tiger" is about Panthera tigris or about a golfer. This session
  retired the GDELT news layer for exactly that failure — a crofelemer press
  release matched "Amazon rainforest" and would have been captioned as coverage
  of the varzea.

  So matching here is deliberately narrow: the taxon's vernacular or scientific
  name must appear in the item's own title, and every admitted record carries
  `matched_on` naming which string matched. That is a stated, checkable rule,
  not a judgement — and the rendered surface says so, so no reader mistakes a
  name match for curation. Narrow matching means most taxa return nothing. That
  is the correct outcome for a mangrove tree, and an empty class renders
  nothing.

  CREDENTIALS come from the environment, never from source. Absent key -> that
  source is skipped and the run says so; it is not an error and it is not
  silently an empty result.

  Run: node scripts/ingest/build-media-archive.mjs
*/

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { screen } from '../media-citation-bar.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

try { process.loadEnvFile?.(resolve(ROOT, '.env')); } catch { /* no .env */ }

const TMDB_KEY = process.env.TMDB_API_KEY || '';
const YT_KEY = process.env.YOUTUBE_API_KEY || '';
let YT_FAILURE = null;
const REL_REFUSED = [];

/* A zoonosis record must be about disease. Enumerated rather than inferred, so
   the rule is readable and arguable instead of a similarity score. */
const DISEASE_TERM = /zoono|pathogen|infect|virus|viral|bacteri|parasit|disease|h[ae]mopla|tuberculo|seropreval|tick-borne|hepatitis|sarcocyst|coronavir|influenza|rabies|anthrax|brucell|leptospir|toxoplasm/i;

const OUT_DIR = resolve(ROOT, 'public/data/media-archive');
const OUT = resolve(OUT_DIR, 'sundarbans.json');
const UA = { 'User-Agent': 'species-on-screen/research (media archive; non-commercial)' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- the taxa, read from the archive rather than retyped ---------- */

function taxa() {
  const tsv = readFileSync(resolve(ROOT, 'public/dwca/sundarbans/occurrence.txt'), 'utf8');
  const [head, ...rows] = tsv.trim().split(/\r?\n/);
  const cols = head.split('\t');
  return rows.map((line) => {
    const cells = line.split('\t');
    const row = Object.fromEntries(cols.map((c, i) => [c, cells[i]]));
    return { sci: row.scientificName, vern: row.vernacularName };
  }).filter((t) => t.sci && t.sci !== 'Homo sapiens');
  // Homo sapiens is excluded deliberately: the human community appears in the
  // interaction web as HumanObservation records, and cataloguing "depictions of
  // people" against a named community is not this archive's business.
}

/* ---------- narrow, stated relevance ---------- */

function matchNames(t) {
  const names = [t.sci];
  // "Chital (spotted deer)" -> "Chital", "spotted deer"
  const v = (t.vern || '').replace(/[()]/g, '|');
  for (const part of v.split('|')) {
    const s = part.trim();
    if (s.length >= 4) names.push(s);
  }
  // a subspecies trinomial also matches its binomial
  const bits = t.sci.split(/\s+/);
  if (bits.length === 3) names.push(`${bits[0]} ${bits[1]}`);
  return [...new Set(names)];
}

function matchedOn(title, names) {
  const hay = String(title || '').toLowerCase();
  for (const n of names) if (n && hay.includes(n.toLowerCase())) return n;
  return null;
}

/* ---------- sources ---------- */

async function tmdbFor(t, names, refusedSink) {
  if (!TMDB_KEY) return [];
  const out = [];
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}`
    + `&query=${encodeURIComponent(t.vern.split('(')[0].trim())}&include_adult=false`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) return [];
  const data = await res.json();
  for (const r of (data.results || []).slice(0, 20)) {
    if (r.media_type !== 'movie' && r.media_type !== 'tv') continue;
    const title = r.title || r.name || '';
    const on = matchedOn(title, names);
    if (!on) continue;                                   // relevance, stated
    const date = r.release_date || r.first_air_date || '';
    if (!r.id) { refusedSink.push({ class: 'film', title, taxon: t.sci, reason: 'NO_IDENTIFIER' }); continue; }
    // SECOND GATE, and it is the one that matters. A title match alone admits
    // collisions: "Mud Crab" (2022) is about an assault in an Australian
    // coastal town and has nothing to do with Scylla serrata. So the name must
    // ALSO appear in the item's own synopsis. Stated, mechanical, conservative
    // — it drops genuinely relevant items whose synopsis happens not to repeat
    // the name, and this archive would rather under-claim than caption a
    // melodrama as a depiction of a species.
    const overview = String(r.overview || '');
    if (!matchedOn(overview, [on])) {
      refusedSink.push({ class: r.media_type === 'tv' ? 'series' : 'film', title, taxon: t.sci,
        identifier: { scheme: 'tmdb', value: String(r.id) }, year: date ? Number(date.slice(0, 4)) : null,
        reason: 'RELEVANCE_NOT_ESTABLISHED:name_absent_from_synopsis' });
      continue;
    }
    out.push({
      taxon: t.sci, vernacular: t.vern,
      class: r.media_type === 'tv' ? 'series' : 'film',
      title,
      year: date ? Number(date.slice(0, 4)) : null,
      identifier: { scheme: 'tmdb', value: String(r.id) },
      source: 'TMDB',
      matched_on: on,
    });
  }
  return out;
}

async function youtubeFor(t, names) {
  if (!YT_KEY) return [];
  const out = [];
  const q = `${t.sci} ${t.vern.split('(')[0].trim()}`;
  const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15'
    + `&q=${encodeURIComponent(q)}&key=${YT_KEY}`;
  const res = await fetch(url, { headers: UA });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    // A dead credential is not an empty result, and must never be recorded as
    // one: "no videos exist" and "the key expired" are different claims.
    YT_FAILURE = (data.error && data.error.message) || `HTTP ${res.status}`;
    return [];
  }
  for (const r of (data.items || [])) {
    const sn = r.snippet || {};
    const on = matchedOn(sn.title, names);
    if (!on) continue;
    const id = r.id && r.id.videoId;
    if (!id) continue;
    out.push({
      taxon: t.sci, vernacular: t.vern,
      class: 'video',
      title: sn.title,
      year: sn.publishedAt ? Number(sn.publishedAt.slice(0, 4)) : null,
      identifier: { scheme: 'platform_id', value: id },
      platform: 'YouTube',
      channel: sn.channelTitle || '',
      uploaded: sn.publishedAt ? sn.publishedAt.slice(0, 10) : '',
      source: 'YouTube Data API v3',
      matched_on: on,
    });
  }
  return out;
}

async function metFor(t, names) {
  // The Metropolitan Museum of Art Collection API: no key, and every object
  // carries a real accession number — the identifier this class requires.
  const out = [];
  for (const term of [t.vern.split('(')[0].trim(), t.sci]) {
    const s = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(term)}`, { headers: UA });
    if (!s.ok) continue;
    const ids = ((await s.json()).objectIDs || []).slice(0, 12);
    for (const id of ids) {
      await sleep(120);
      const o = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`, { headers: UA });
      if (!o.ok) continue;
      const obj = await o.json();
      const on = matchedOn(obj.title, names);
      if (!on) continue;
      if (!obj.accessionNumber) continue;                // no accession, no row
      if (out.some((x) => x.identifier.value === obj.accessionNumber)) continue;
      out.push({
        taxon: t.sci, vernacular: t.vern,
        class: 'artwork',
        title: obj.title,
        year: obj.objectDate || null,
        creator: obj.artistDisplayName || '',
        institution: 'The Metropolitan Museum of Art',
        identifier: { scheme: 'accession', value: obj.accessionNumber },
        source: 'The Metropolitan Museum of Art Collection API',
        matched_on: on,
      });
    }
  }
  return out;
}

/* ---------- the already-shipped dossier records ----------

   public/data/tiger.json has carried five tmdb_media entries since it was
   written, and the "On screen" section rendered them. Every one of them fails
   this bar as it stands: they carry `tmdb_url` and no id, and a bare URL is a
   location, not an identifier.

   The id is recoverable from the URL path — /movie/833064 — which is
   NORMALISATION, not invention: the identifier was always there, spelled as a
   route. So they are re-admitted through the same gate as everything else,
   with the same relevance rule applied, and whatever fails is refused in
   public. Previously-shipped content is not grandfathered; if the bar means
   anything it has to be able to reject what is already on the site. */

const DOSSIER_FOR = { 'Panthera tigris tigris': 'tiger.json' };

function dossierFor(t, names) {
  const file = DOSSIER_FOR[t.sci];
  if (!file) return [];
  const path = resolve(ROOT, 'public/data', file);
  if (!existsSync(path)) return [];
  let doc = {};
  try { doc = JSON.parse(readFileSync(path, 'utf8')); } catch { return []; }
  const out = [];
  for (const m of (doc.tmdb_media || [])) {
    const title = m.title || '';
    const idm = /\/movie\/(\d+)|\/tv\/(\d+)/.exec(String(m.tmdb_url || ''));
    const id = idm ? (idm[1] || idm[2]) : null;
    if (!id) {
      REL_REFUSED.push({ class: 'film', title, taxon: t.sci, reason: 'REFUSED_BARE_URL' });
      continue;
    }
    // A refusal carries the identifier it WOULD have used. The curator needs it
    // to admit the record by hand, and a worklist that says "go find the id
    // again" wastes the scarcest resource in this project.
    const ident = { scheme: 'tmdb', value: String(id) };
    const on = matchedOn(title, names);
    if (!on) {
      REL_REFUSED.push({ class: 'film', title, taxon: t.sci, identifier: ident, year: m.year || null,
        reason: 'RELEVANCE_NOT_ESTABLISHED:taxon_absent_from_title' });
      continue;
    }
    if (!matchedOn(String(m.overview || ''), [on])) {
      REL_REFUSED.push({ class: 'film', title, taxon: t.sci, identifier: ident, year: m.year || null,
        reason: 'RELEVANCE_NOT_ESTABLISHED:name_absent_from_synopsis' });
      continue;
    }
    out.push({
      taxon: t.sci, vernacular: t.vern, class: 'film', title,
      year: m.year || null,
      director: m.director || '',
      identifier: { scheme: 'tmdb', value: String(id) },
      source: 'TMDB (via this place\'s species dossier)',
      matched_on: on,
    });
  }
  return out;
}

/* ---------- the two sensitive classes ----------

   ILLEGAL WILDLIFE TRADE cannot resolve in this pass. CITES Species+ returns
   401 without an API token, and no token is held. The appendix listings are
   well known and are deliberately NOT written from memory: this repository
   leaves Bates et al. 2005 unresolved rather than guess a DOI (M31/M32), and a
   guessed appendix would be the same error with higher stakes. It is reported
   as a credential gap, not rendered as an absence of listings.

   Note what is NOT the blocker: the citation bar would happily admit a CITES
   record. The bar also refuses outright any trade record that carries a
   locality, route, price or market field, so that when a token does arrive the
   sensitive fields cannot enter the file even by accident.

   ZOONOSIS resolves through PubMed, which is keyless and issues PMIDs — a
   stable identifier that re-pulls the same article forever.

   WHAT IS RECORDED IS THE CITATION, AND ONLY THE CITATION. Title, journal,
   year, PMID. No finding is extracted, no host association is paraphrased, no
   risk is scored, and nothing is framed as prediction. Summarising an abstract
   would mean this archive asserting epidemiology it has not done; listing the
   citation means it asserts only that the literature exists, which is true and
   checkable. The rendered surface says exactly that. This is the easiest place
   in the whole project to over-claim, so the record is made as small as it can
   be while still being useful. */

async function pubmedFor(t) {
  const out = [];
  const term = `${t.sci}[Title/Abstract] AND (zoonos*[Title/Abstract] OR reservoir[Title/Abstract] OR "host association"[Title/Abstract])`;
  const es = await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8'
    + `&term=${encodeURIComponent(term)}`, { headers: UA });
  if (!es.ok) return out;
  const ids = (((await es.json()).esearchresult) || {}).idlist || [];
  if (!ids.length) return out;
  await sleep(350);   // NCBI asks for <=3 req/s without a key
  const su = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`, { headers: UA });
  if (!su.ok) return out;
  const result = ((await su.json()) || {}).result || {};
  for (const id of ids) {
    const a = result[id];
    if (!a || !a.title) continue;
    // TWO MECHANICAL CONDITIONS, BOTH ON THE TITLE — an abstract match is far
    // too loose here. The first loose pass labelled a plant arachidonic-acid
    // enzyme study, a hilsa genome assembly and a SARS-CoV-2 survey of
    // Odocoileus virginianus as zoonosis records for three Sundarbans taxa.
    // Each was in the literature, each named the taxon somewhere, and each
    // would have been a false claim about what that literature is. Requiring
    // the taxon AND a disease term in the article's own title is the narrowest
    // rule that still admits real records.
    const title = String(a.title).replace(/\.$/, '');
    if (!matchedOn(title, [t.sci])) {
      REL_REFUSED.push({ class: 'zoonosis', title, taxon: t.sci,
        identifier: { scheme: 'pmid', value: String(id) }, year: a.pubdate ? Number(String(a.pubdate).slice(0, 4)) : null,
        reason: 'RELEVANCE_NOT_ESTABLISHED:taxon_absent_from_title' });
      continue;
    }
    if (!DISEASE_TERM.test(title)) {
      REL_REFUSED.push({ class: 'zoonosis', title, taxon: t.sci,
        identifier: { scheme: 'pmid', value: String(id) }, year: a.pubdate ? Number(String(a.pubdate).slice(0, 4)) : null,
        reason: 'RELEVANCE_NOT_ESTABLISHED:no_disease_term_in_title' });
      continue;
    }
    out.push({
      taxon: t.sci, vernacular: t.vern,
      class: 'zoonosis',
      title,
      year: a.pubdate ? Number(String(a.pubdate).slice(0, 4)) : null,
      journal: a.fulljournalname || a.source || '',
      identifier: { scheme: 'pmid', value: String(id) },
      source: 'PubMed (NCBI E-utilities)',
      matched_on: t.sci,
    });
  }
  return out;
}

/* ---------- main ---------- */

async function main() {
  const list = taxa();
  const skipped = [];
  if (!TMDB_KEY) skipped.push('TMDB (TMDB_API_KEY unset)');
  if (!YT_KEY) skipped.push('YouTube (YOUTUBE_API_KEY unset)');
  skipped.push('games — IGDB needs Twitch OAuth (IGDB_CLIENT_ID/SECRET unset); Steam has no topical search');
  skipped.push('illegal wildlife trade — CITES Species+ returns 401 without a token (none held). Appendix listings are NOT written from memory: a guessed appendix is the Bates et al. 2005 error with higher stakes.');
  skipped.push('scientific illustration — BHL API returns 401 without a key (BHL_API_KEY unset)');
  skipped.push('artworks beyond the Met — Smithsonian returns 403 without an api.data.gov key');

  const candidates = [];
  const preRefused = [];
  for (const t of list) {
    const names = matchNames(t);
    process.stdout.write(`[${t.sci}] `);
    const got = [];
    try { got.push(...await tmdbFor(t, names, preRefused)); } catch { /* source down */ }
    try { got.push(...await youtubeFor(t, names)); } catch { /* source down */ }
    try { got.push(...await metFor(t, names)); } catch { /* source down */ }
    try { got.push(...await pubmedFor(t)); } catch { /* source down */ }
    try { got.push(...dossierFor(t, names)); } catch { /* unreadable dossier */ }
    candidates.push(...got);
    console.log(`${got.length} candidate(s)`);
    await sleep(250);
  }

  if (YT_FAILURE) skipped.push(`YouTube — credential failed: ${YT_FAILURE}. The video class is empty for a CREDENTIAL reason, not an evidential one.`);

  const seen = new Set();
  const deduped = candidates.filter((c) => {
    const k = `${c.class}|${c.identifier && c.identifier.scheme}|${c.identifier && c.identifier.value}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });

  const { admitted, refused } = screen(deduped);
  const allRefused = [...preRefused, ...REL_REFUSED, ...refused];

  admitted.sort((a, b) =>
    a.taxon.localeCompare(b.taxon) || a.class.localeCompare(b.class) || (a.year || 0) - (b.year || 0));

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, JSON.stringify({
    _comment: 'Media archive for the Sundarbans taxa. Every record passed scripts/media-citation-bar.mjs. '
      + 'Relevance is a NAME MATCH on the item title (see matched_on), not editorial curation — these are '
      + 'candidate depictions, and the rendered surface says so.',
    place: 'sundarbans',
    generated: new Date().toISOString(),
    sources_skipped: skipped,
    records: admitted,
    refused: allRefused,
  }, null, 2) + '\n', 'utf8');

  const byClass = {};
  for (const r of admitted) byClass[r.class] = (byClass[r.class] || 0) + 1;
  console.log(`\nadmitted ${admitted.length}:`, JSON.stringify(byClass));
  console.log(`refused  ${allRefused.length}`);
  for (const s of skipped) console.log('  skipped:', s);
  console.log('->', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
