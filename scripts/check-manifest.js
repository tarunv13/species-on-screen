#!/usr/bin/env node
/*
  scripts/check-manifest.js
  -------------------------
  Build-time integrity check for the canonical Place Manifest
  (cinematic-language/place-manifest.json, ADR-001). Runs as part of the
  `prebuild` step and is invokable via `npm run check-manifest`.

  It enforces, dependency-free (Node stdlib only), what the JSON Schema
  describes and what the schema alone cannot:

    1. Schema-shape    — required fields, types, enums, no unknown keys.
    2. Canonical ids   — placeId unique + kebab; narrativeId/slugs kebab;
                         homepage.order unique; research.slug == narrativeId.
    3. Referenced files — every declared surface points at a file/dir that
                         exists: notes/<slug>.html, places/<slug>.html,
                         atlas/<slug>.html, public/dwca/<slug>/{occurrence,
                         resource-relationship}.txt + meta.xml + eml.xml, and
                         the bound narrative cinematic-language/narratives/<id>.ts.
    4. DwC-A bindings   — declared actors/interactions equal the archive's
                         actual row counts.
    5. Navigation bindings — a cinematic surface has an arrival (hotspotId when
                         globe-hotspot); a homepage entry requires a cinematic
                         surface; a companion atlas requires a field-record atlas.

  M23 Phase 0 is "describe, don't consume": no runtime consumes the manifest,
  so this check guards that the description stays true to the repository.

  Exits 0 on pass, 1 on any failure. Missing manifest is a failure (the file
  is expected once ADR-001 is implemented).
*/

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const MANIFEST = path.join(REPO_ROOT, 'cinematic-language', 'place-manifest.json');

const SLUG = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const ARRIVAL_KINDS = new Set(['globe-hotspot', 'dip']);
const ATLAS_KINDS = new Set(['field-record', 'companion']);

const PLACE_KEYS = new Set(['placeId', 'displayName', 'type', 'narrativeId', 'surfaces', 'homepage']);
const SURFACE_KEYS = new Set(['research', 'cinematic', 'atlas', 'dwca']);

function rel(p) { return path.relative(REPO_ROOT, p); }
function isStr(v) { return typeof v === 'string' && v.length > 0; }
function repoFile(...seg) { return existsSync(path.join(REPO_ROOT, ...seg)); }

async function countDataRows(archiveDir, file) {
  // Non-empty lines minus the header row.
  const text = await readFile(path.join(REPO_ROOT, archiveDir, file), 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length > 0);
  return Math.max(0, lines.length - 1);
}

async function checkPlace(place, i, errors, seenIds, seenOrders) {
  const where = `places[${i}]` + (isStr(place && place.placeId) ? ` "${place.placeId}"` : '');
  const err = (m) => errors.push(`${where}: ${m}`);

  if (!place || typeof place !== 'object' || Array.isArray(place)) {
    err('is not an object'); return;
  }
  for (const k of Object.keys(place)) {
    if (!PLACE_KEYS.has(k)) err(`unknown key "${k}"`);
  }

  // Canonical identifiers.
  if (!isStr(place.placeId) || !SLUG.test(place.placeId)) err('placeId missing or not kebab-case');
  else if (seenIds.has(place.placeId)) err(`duplicate placeId "${place.placeId}"`);
  else seenIds.add(place.placeId);

  if (!isStr(place.displayName)) err('displayName missing');
  if (!isStr(place.type)) err('type missing');
  if (!isStr(place.narrativeId) || !SLUG.test(place.narrativeId)) err('narrativeId missing or not kebab-case');

  // Bound narrative must exist in the registry.
  if (isStr(place.narrativeId) && !repoFile('cinematic-language', 'narratives', `${place.narrativeId}.ts`)) {
    err(`narrativeId "${place.narrativeId}" has no record at cinematic-language/narratives/${place.narrativeId}.ts`);
  }

  const s = place.surfaces;
  if (!s || typeof s !== 'object' || Array.isArray(s)) { err('surfaces missing'); return; }
  for (const k of Object.keys(s)) { if (!SURFACE_KEYS.has(k)) err(`surfaces.unknown key "${k}"`); }

  // research (required).
  if (!s.research || !isStr(s.research.slug) || !SLUG.test(s.research.slug)) {
    err('surfaces.research.slug missing or not kebab-case');
  } else {
    if (isStr(place.narrativeId) && s.research.slug !== place.narrativeId) {
      err(`surfaces.research.slug "${s.research.slug}" must equal narrativeId "${place.narrativeId}" (notes slug convention)`);
    }
    if (!repoFile('notes', `${s.research.slug}.html`)) err(`missing notes/${s.research.slug}.html`);
  }

  // cinematic (optional).
  if (s.cinematic !== undefined) {
    const c = s.cinematic;
    if (!isStr(c.slug) || !SLUG.test(c.slug)) err('surfaces.cinematic.slug missing or not kebab-case');
    else if (!repoFile('places', `${c.slug}.html`)) err(`missing places/${c.slug}.html`);
    if (!isStr(c.enterLabel)) err('surfaces.cinematic.enterLabel missing');
    if (!c.arrival || typeof c.arrival !== 'object') err('surfaces.cinematic.arrival missing');
    else {
      if (!ARRIVAL_KINDS.has(c.arrival.kind)) err(`surfaces.cinematic.arrival.kind "${c.arrival.kind}" invalid (globe-hotspot|dip)`);
      if (c.arrival.kind === 'globe-hotspot' && !isStr(c.arrival.hotspotId)) {
        err('surfaces.cinematic.arrival.hotspotId required when kind = globe-hotspot');
      }
    }
  }

  // atlas (optional array).
  if (s.atlas !== undefined) {
    if (!Array.isArray(s.atlas)) err('surfaces.atlas must be an array');
    else {
      let fieldRecords = 0, companions = 0;
      s.atlas.forEach((a, j) => {
        if (!isStr(a.slug) || !SLUG.test(a.slug)) err(`surfaces.atlas[${j}].slug missing or not kebab-case`);
        else if (!repoFile('atlas', `${a.slug}.html`)) err(`missing atlas/${a.slug}.html`);
        if (!ATLAS_KINDS.has(a.kind)) err(`surfaces.atlas[${j}].kind "${a.kind}" invalid (field-record|companion)`);
        if (a.kind === 'field-record') fieldRecords++;
        if (a.kind === 'companion') companions++;
      });
      if (companions > 0 && fieldRecords === 0) {
        err('a companion atlas requires at least one field-record atlas');
      }
    }
  }

  // dwca (optional) — existence + count parity.
  if (s.dwca !== undefined) {
    const d = s.dwca;
    if (!isStr(d.slug) || !SLUG.test(d.slug)) err('surfaces.dwca.slug missing or not kebab-case');
    else {
      const dir = path.join('public', 'dwca', d.slug);
      const required = ['occurrence.txt', 'resource-relationship.txt', 'meta.xml', 'eml.xml'];
      const missing = required.filter((f) => !repoFile('public', 'dwca', d.slug, f));
      if (missing.length) err(`public/dwca/${d.slug}/ missing: ${missing.join(', ')}`);
      if (!Number.isInteger(d.actors) || d.actors < 1) err('surfaces.dwca.actors must be a positive integer');
      if (!Number.isInteger(d.interactions) || d.interactions < 0) err('surfaces.dwca.interactions must be a non-negative integer');
      if (!missing.length && Number.isInteger(d.actors) && Number.isInteger(d.interactions)) {
        const occ = await countDataRows(dir, 'occurrence.txt');
        const rels = await countDataRows(dir, 'resource-relationship.txt');
        if (occ !== d.actors) err(`surfaces.dwca.actors=${d.actors} but occurrence.txt has ${occ} rows`);
        if (rels !== d.interactions) err(`surfaces.dwca.interactions=${d.interactions} but resource-relationship.txt has ${rels} rows`);
      }
    }
  }

  // homepage (optional) — requires a cinematic surface (you cannot enter a
  // place with no cinematic from the planetary homepage).
  if (place.homepage !== undefined) {
    const h = place.homepage;
    if (!isStr(h.caption)) err('homepage.caption missing');
    if (!Number.isInteger(h.order) || h.order < 1) err('homepage.order must be a positive integer');
    else if (seenOrders.has(h.order)) err(`duplicate homepage.order ${h.order}`);
    else seenOrders.add(h.order);
    if (!s.cinematic) err('homepage entry requires a cinematic surface');
  }
}

async function main() {
  if (!existsSync(MANIFEST)) {
    console.error(`\ncheck-manifest: manifest not found at ${rel(MANIFEST)}.\n`);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch (e) {
    console.error(`\ncheck-manifest: ${rel(MANIFEST)} is not valid JSON — ${e.message}\n`);
    process.exit(1);
  }

  const errors = [];
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.places)) {
    console.error('\ncheck-manifest: top-level object must have a "places" array.\n');
    process.exit(1);
  }

  const seenIds = new Set();
  const seenOrders = new Set();
  for (let i = 0; i < manifest.places.length; i++) {
    await checkPlace(manifest.places[i], i, errors, seenIds, seenOrders);
  }

  if (errors.length) {
    console.error(`\ncheck-manifest: ${errors.length} issue(s) in ${rel(MANIFEST)}.\n`);
    for (const e of errors) console.error(`  - ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log(
    `check-manifest: ok (${manifest.places.length} place` +
    `${manifest.places.length === 1 ? '' : 's'}, all bindings resolve)`
  );
}

main().catch((e) => {
  console.error(`\ncheck-manifest: ${e && e.message ? e.message : e}`);
  process.exit(1);
});
