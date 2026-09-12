#!/usr/bin/env node
/*
  normalise-dossier-media-ids — recover the TMDB id that was always there.

  Every tmdb_media entry across the ten species dossiers carries `tmdb_url` and
  no id. Under the V1.6 citation bar a bare URL is not an identifier: it names a
  location, it rots, and the archive refuses it.

  But the identifier is not missing — it is spelled as a route.
  https://www.themoviedb.org/movie/833064 contains 833064. Parsing it out is
  NORMALISATION, not invention: nothing is looked up, nothing is guessed, and if
  the route does not contain an id the record is left exactly as it is and
  reported. That distinction is the whole reason this is a separate script with
  its own docstring rather than a quiet fix inside the harvester.

  Writes `tmdb_id` alongside the existing fields. `tmdb_url` is KEPT — removing
  it would discard the provenance of the normalisation, and a future reader
  should be able to see where the id came from.

  Idempotent: a dossier that already carries tmdb_id for every entry is
  reported as unchanged and not rewritten.

  Run: node scripts/ingest/normalise-dossier-media-ids.mjs
*/

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DATA = join(ROOT, 'public', 'data');

// /movie/<id> or /tv/<id>, with the media kind kept so a later consumer can
// build the right canonical link rather than assuming everything is a film.
const ROUTE = /themoviedb\.org\/(movie|tv)\/(\d+)/i;

let files = 0, touched = 0, ids = 0, already = 0, unparsable = 0;
const unresolved = [];

for (const name of readdirSync(DATA).filter((f) => f.endsWith('.json')).sort()) {
  const path = join(DATA, name);
  let doc;
  try { doc = JSON.parse(readFileSync(path, 'utf8')); } catch { continue; }
  if (!Array.isArray(doc.tmdb_media) || !doc.tmdb_media.length) continue;
  files++;

  let changed = false;
  for (const m of doc.tmdb_media) {
    if (m.tmdb_id) { already++; continue; }
    const hit = ROUTE.exec(String(m.tmdb_url || ''));
    if (!hit) {
      unparsable++;
      unresolved.push({ dossier: name, title: m.title || '(untitled)', url: m.tmdb_url || '(none)' });
      continue;
    }
    m.tmdb_kind = hit[1];
    m.tmdb_id = hit[2];
    ids++; changed = true;
  }
  if (changed) {
    writeFileSync(path, JSON.stringify(doc, null, 2) + '\n', 'utf8');
    touched++;
  }
}

console.log(`dossiers with tmdb_media : ${files}`);
console.log(`ids normalised           : ${ids}`);
console.log(`already had an id        : ${already}`);
console.log(`dossiers rewritten       : ${touched}`);
console.log(`could not parse a route  : ${unparsable}`);
for (const u of unresolved) {
  console.log(`  UNRESOLVED  ${u.dossier}  ${u.title}  <- ${u.url}`);
}
if (unparsable) {
  console.log('\nAn unparsable row is left untouched and reported. It is not given a');
  console.log('guessed id; it stays refused by the citation bar until a human supplies one.');
}
