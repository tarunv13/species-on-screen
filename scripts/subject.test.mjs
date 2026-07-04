/*
  scripts/subject.test.mjs
  ------------------------
  Black-box test of the D1 subject URL-addressability mechanism (src/subject.js):
  proves the SAME ?subject=<placeId> resolves to the SAME subject via the one
  shared resolver, that each surface's local slug is derivable from the resolved
  place (no second identity scheme), that withSubject carries the id across a
  navigation, and that unknown/absent subjects degrade gracefully.

  Resolution is exercised against the REAL manifest, so it proves cross-surface
  consistency on the actual data. Dependency-free (Node stdlib), no DOM.
  Run: npm run test:subject.
*/
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { subjectIdFromSearch, resolveSubject, heldSubject, withSubject, SUBJECT_PARAM } from '../src/subject.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(REPO_ROOT, 'cinematic-language', 'place-manifest.json'), 'utf8'));
const PLACES = manifest.places;

let n = 0;
const ok = (label, cond) => { assert.ok(cond, label); n++; };

// --- reading ?subject= -------------------------------------------------------
ok('reads subject id', subjectIdFromSearch('?subject=east-pacific-rise') === 'east-pacific-rise');
ok('reads subject amid other params', subjectIdFromSearch('?foo=1&subject=sundarbans&bar=2') === 'sundarbans');
ok('absent subject → null', subjectIdFromSearch('?place=epr-vents') === null);
ok('empty search → null', subjectIdFromSearch('') === null);
ok('malformed → null (no throw)', subjectIdFromSearch(undefined) === null);

// --- the SAME id resolves to the SAME subject, everywhere --------------------
for (const p of PLACES) {
  const resolved = resolveSubject(PLACES, p.placeId);
  ok(`${p.placeId} resolves to itself`, resolved && resolved.placeId === p.placeId);
  // Every surface's local slug is derivable from the one resolved place — no
  // second identity scheme. (Research always present; others where the place has them.)
  ok(`${p.placeId} → research slug`, typeof resolved.surfaces.research.slug === 'string');
  if (resolved.surfaces.cinematic) ok(`${p.placeId} → cinematic slug`, !!resolved.surfaces.cinematic.slug);
  if (resolved.surfaces.dwca) ok(`${p.placeId} → dwca/evidence slug`, !!resolved.surfaces.dwca.slug);
  const fr = (resolved.surfaces.atlas || []).find((a) => a.kind === 'field-record');
  if (fr) ok(`${p.placeId} → atlas field-record slug`, !!fr.slug);
}

// The canonical id is distinct from per-surface slugs (the point of D1): e.g.
// east-pacific-rise (subject) maps to cinematic/atlas/dwca slug "epr-vents".
{
  const epr = resolveSubject(PLACES, 'east-pacific-rise');
  ok('subject id ≠ cinematic slug', epr.surfaces.cinematic.slug === 'epr-vents' && epr.placeId !== 'epr-vents');
  const ct = resolveSubject(PLACES, 'coral-triangle');
  ok('coral-triangle cinematic slug is "crossing"', ct.surfaces.cinematic.slug === 'crossing');
}

// --- graceful degradation ----------------------------------------------------
ok('unknown subject → undefined', resolveSubject(PLACES, 'atlantis') === undefined);
ok('unknown subject → falls back to surface identity', heldSubject(PLACES, '?subject=atlantis', 'sundarbans').placeId === 'sundarbans');
ok('absent subject → falls back to surface identity', heldSubject(PLACES, '', 'east-pacific-rise').placeId === 'east-pacific-rise');
ok('absent subject + unknown fallback → undefined (graceful, no throw)', heldSubject(PLACES, '', 'nope') === undefined);
ok('present subject wins over fallback', heldSubject(PLACES, '?subject=coral-triangle', 'sundarbans').placeId === 'coral-triangle');

// --- carrying the subject across a navigation --------------------------------
ok('appends subject to a bare href', withSubject('../atlas/epr-vents.html', 'east-pacific-rise') === `../atlas/epr-vents.html?${SUBJECT_PARAM}=east-pacific-rise`);
ok('respects an existing query', withSubject('../atlas/x.html?place=y', 'sundarbans') === `../atlas/x.html?place=y&${SUBJECT_PARAM}=sundarbans`);
ok('preserves a fragment', withSubject('../evidence/x.html#claim-3', 'coral-triangle') === `../evidence/x.html?${SUBJECT_PARAM}=coral-triangle#claim-3`);
ok('does not double-add', withSubject('../x.html?subject=a', 'b') === '../x.html?subject=a');
ok('falsy id → unchanged (graceful)', withSubject('../x.html', null) === '../x.html');
ok('falsy href → unchanged', withSubject('', 'a') === '');

console.log(`subject.test: PASS (${n} checks; one ?subject=<placeId> resolves to one subject across every surface, and degrades gracefully)`);
