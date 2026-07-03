#!/usr/bin/env node
/*
  scripts/check-bindings.js
  -------------------------
  First behaviour of the Ecological Knowledge Environment's REFERENCE VALIDATOR
  (see .agents/decisions/2026-07-03-eke-reference-implementation-founding-spec.md).

  It certifies, for every interaction claim in every Darwin Core archive bound by
  the Place Manifest, that the claim is TRACEABILITY-CONFORMANT — i.e. it traces
  to declared, resolvable, typed, sourced, reconciled, dated evidence.

  It certifies TRACEABILITY, NEVER TRUTH. It does not judge whether an asserted
  interaction is correct — only whether the assertion carries a verifiable
  evidentiary binding, expressed entirely in existing standards:

    - Darwin Core ResourceRelationship (the interaction claim + its source)
    - OBO Relations Ontology PURLs        (the typed relation)
    - GBIF backbone keys / associatedReferences (taxon reconciliation)
    - eventDate                           (the as-of stamp)

  Conformance predicate — a binding is conformant iff NONE of these hold:

    EVIDENCE_UNRESOLVABLE  a resourceID/relatedResourceID has no occurrence row.
    RELATION_UNTYPED       relationshipOfResourceID is not a controlled IRI.
    SOURCE_MISSING         relationshipAccordingTo is empty.
    BACKBONE_UNRECONCILED  a referenced occurrence has no backbone taxon key.
    AS_OF_MISSING          a referenced occurrence has no eventDate.

  The reason-code vocabulary is APPEND-ONLY: never remove or repurpose a code.
  Two independent implementations conform iff they agree on the verdict AND the
  reason codes for every binding — this is the conformance mechanism the profile
  is a reference for.

  Usage:
    node scripts/check-bindings.js                 validate the manifest-bound corpus (ADR-001)
    node scripts/check-bindings.js <archiveDir>...  validate arbitrary DwC archive directories
    --level=L1|L2|L3  conformance level (default L1; L2 = PID sources; L3 = pinned backbone + dated binding)
    --json          emit machine-readable per-binding verdicts (with the evidence chain)
    --trace         render the evidence chain per claim (human-readable)

  With no archive arguments, discovery is manifest-driven; with archive
  directories given, any producer can validate their own bindings without the
  manifest. Dependency-free (Node stdlib only). Exit 0 iff every binding conforms.
*/

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

// The reference validator must be runnable against an arbitrary conformance test
// corpus, not only the repository's own archives (founding spec §8). These two
// optional overrides point it at a test manifest and a test archive root; unset,
// it validates the repository's canonical corpus.
const MANIFEST = process.env.EKE_MANIFEST
  ? path.resolve(process.env.EKE_MANIFEST)
  : path.join(REPO_ROOT, 'cinematic-language', 'place-manifest.json');
const DWCA_ROOT = process.env.EKE_DWCA_ROOT
  ? path.resolve(process.env.EKE_DWCA_ROOT)
  : path.join(REPO_ROOT, 'public', 'dwca');

// A controlled, resolvable interaction-type IRI: the OBO Relations Ontology PURL
// namespace (the declared, pinned relation vocabulary for these archives).
const CONTROLLED_RELATION_IRI = /^https?:\/\/purl\.obolibrary\.org\/obo\/RO_\d+$/;

// A source resolves to a persistent identifier iff it carries a DOI or an
// http(s) URL. Used only at conformance level L2+ (see LEVEL below).
const PERSISTENT_ID = /(\b10\.\d{4,9}\/\S+|https?:\/\/\S+)/i;

// Conformance level (founding spec §5 / the profile's §5). L1 is baseline
// traceability (default); L2 additionally requires resolvable sources. Higher
// levels are strictly additive: a binding conformant at L2 is conformant at L1.
const LEVEL = (() => {
  const arg = process.argv.find((a) => a.startsWith('--level='));
  return (arg ? arg.slice('--level='.length) : process.env.EKE_LEVEL || 'L1').toUpperCase();
})();
const LEVEL_RANK = { L1: 1, L2: 2, L3: 3 }[LEVEL];

function rel(p) { return path.relative(REPO_ROOT, p); }

// Minimal TSV reader: returns { header: string[], rows: string[][] } for a
// Darwin Core text file (tab-delimited, one header row, LF or CRLF).
function parseTsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length > 0);
  if (lines.length === 0) return { header: [], rows: [] };
  const header = lines[0].split('\t');
  const rows = lines.slice(1).map((l) => l.split('\t'));
  return { header, rows };
}

function column(header, name) {
  const i = header.indexOf(name);
  return (row) => (i >= 0 && i < row.length ? row[i] : '');
}

// An occurrence reconciles to a backbone iff it declares a GBIF taxon key
// (in dynamicProperties) or cites a GBIF backbone reference.
function reconcilesToBackbone(dynamicProperties, associatedReferences) {
  if (/gbif\.org\/species\//i.test(associatedReferences || '')) return true;
  try {
    const dp = JSON.parse(dynamicProperties || '{}');
    return Number.isFinite(dp.gbifTaxonKey);
  } catch {
    return false;
  }
}

// L3: an occurrence declares a pinned backbone version in dynamicProperties
// (see .agents/decisions/2026-07-03-l3-conformance-data-model.md).
function hasBackboneVersion(dynamicProperties) {
  try {
    const dp = JSON.parse(dynamicProperties || '{}');
    return typeof dp.backboneVersion === 'string' && dp.backboneVersion.length > 0;
  } catch {
    return false;
  }
}

async function checkArchive(dirAbs, label) {
  const occPath = path.join(dirAbs, 'occurrence.txt');
  const relPath = path.join(dirAbs, 'resource-relationship.txt');

  if (!existsSync(occPath) || !existsSync(relPath)) {
    return { records: [], error: `${label}: missing occurrence.txt or resource-relationship.txt` };
  }

  const occ = parseTsv(await readFile(occPath, 'utf8'));
  const rels = parseTsv(await readFile(relPath, 'utf8'));

  // Index occurrences: id -> { backbone: bool, asOf: bool }.
  const occId = column(occ.header, 'occurrenceID');
  const occName = column(occ.header, 'scientificName');
  const occDyn = column(occ.header, 'dynamicProperties');
  const occRefs = column(occ.header, 'associatedReferences');
  const occDate = column(occ.header, 'eventDate');
  const occIndex = new Map();
  for (const row of occ.rows) {
    const id = occId(row);
    if (!id) continue;
    occIndex.set(id, {
      name: occName(row) || id,
      date: occDate(row).trim(),
      backbone: reconcilesToBackbone(occDyn(row), occRefs(row)),
      asOf: occDate(row).trim().length > 0,
      pinned: hasBackboneVersion(occDyn(row)),
    });
  }

  const relId = column(rels.header, 'resourceRelationshipID');
  const src = column(rels.header, 'resourceID');
  const tgt = column(rels.header, 'relatedResourceID');
  const relName = column(rels.header, 'relationshipOfResource');
  const relIri = column(rels.header, 'relationshipOfResourceID');
  const accordingTo = column(rels.header, 'relationshipAccordingTo');
  const establishedDate = column(rels.header, 'relationshipEstablishedDate');

  const records = [];
  for (const row of rels.rows) {
    const codes = [];
    const s = src(row);
    const t = tgt(row);
    const sOcc = occIndex.get(s);
    const tOcc = occIndex.get(t);

    const acc = (accordingTo(row) || '').trim();
    if (!sOcc || !tOcc) codes.push('EVIDENCE_UNRESOLVABLE');
    if (!CONTROLLED_RELATION_IRI.test((relIri(row) || '').trim())) codes.push('RELATION_UNTYPED');
    if (acc.length === 0) codes.push('SOURCE_MISSING');
    if ((sOcc && !sOcc.backbone) || (tOcc && !tOcc.backbone)) codes.push('BACKBONE_UNRECONCILED');
    if ((sOcc && !sOcc.asOf) || (tOcc && !tOcc.asOf)) codes.push('AS_OF_MISSING');
    // L2+ (additive): a present source must resolve to a persistent identifier.
    // An empty source is SOURCE_MISSING (above), never SOURCE_UNRESOLVABLE.
    if (LEVEL_RANK >= 2 && acc.length > 0 && !PERSISTENT_ID.test(acc)) codes.push('SOURCE_UNRESOLVABLE');
    // L3+ (additive, pure DwC reuse): reconciliation is pinned to a declared
    // backbone version, and the binding's creation is dated. The reserved
    // EVIDENCE_CODE_MISSING check awaits a TDWG placement (see the L3 decision).
    if (LEVEL_RANK >= 3) {
      if ((sOcc && !sOcc.pinned) || (tOcc && !tOcc.pinned)) codes.push('BACKBONE_UNPINNED');
      if (establishedDate(row).trim().length === 0) codes.push('ASSERTION_UNATTRIBUTED');
    }

    // The evidence chain, so a verdict is auditable and any consumer (a human,
    // a surface, or an AI system) can trace the claim to what licenses it.
    const evidence = (id, occ) => ({
      occurrenceID: id,
      name: occ ? occ.name : null,
      backbone: occ ? occ.backbone : false,
      asOf: occ ? occ.date || null : null,
      pinned: occ ? occ.pinned : false,
    });
    records.push({
      archive: label,
      id: relId(row) || '(no id)',
      resourceID: s,
      relatedResourceID: t,
      relation: relName(row) || '?',
      source: acc || null,
      subject: evidence(s, sOcc),
      object: evidence(t, tOcc),
      verdict: codes.length === 0 ? 'CONFORMANT' : 'NON_CONFORMANT',
      reasons: codes,
    });
  }

  return { records, error: null };
}

async function main() {
  const asJson = process.argv.includes('--json') || process.env.EKE_JSON === '1';
  const asTrace = process.argv.includes('--trace');

  if (!LEVEL_RANK) {
    console.error(`\ncheck-bindings: unknown conformance level "${LEVEL}" (expected L1, L2, or L3).\n`);
    process.exit(1);
  }

  // Positional (non-flag) arguments are Darwin Core archive directories to
  // validate directly, so any archive producer can check their own interaction
  // bindings against the profile without adopting the Observatory's Place
  // Manifest. With no positional args, discovery is manifest-driven (ADR-001).
  const archiveArgs = process.argv.slice(2).filter((a) => !a.startsWith('-'));

  let targets;
  if (archiveArgs.length > 0) {
    targets = archiveArgs.map((p) => {
      const dir = path.resolve(p);
      return { dir, label: path.basename(dir) };
    });
  } else {
    if (!existsSync(MANIFEST)) {
      console.error(`\ncheck-bindings: manifest not found at ${rel(MANIFEST)}.\n`);
      process.exit(1);
    }
    let manifest;
    try {
      manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
    } catch (e) {
      console.error(`\ncheck-bindings: ${rel(MANIFEST)} is not valid JSON — ${e.message}\n`);
      process.exit(1);
    }
    if (!manifest || !Array.isArray(manifest.places)) {
      console.error('\ncheck-bindings: manifest has no "places" array.\n');
      process.exit(1);
    }
    const slugs = manifest.places
      .map((p) => p && p.surfaces && p.surfaces.dwca && p.surfaces.dwca.slug)
      .filter((s) => typeof s === 'string' && s.length > 0);
    if (slugs.length === 0) {
      if (asJson) process.stdout.write('[]\n');
      else console.log('check-bindings: no manifest-bound Darwin Core archives to check.');
      return;
    }
    targets = slugs.map((slug) => ({ dir: path.join(DWCA_ROOT, slug), label: slug }));
  }

  const allRecords = [];
  const archiveErrors = [];
  for (const t of targets) {
    const { records, error } = await checkArchive(t.dir, t.label);
    if (error) archiveErrors.push(error);
    allRecords.push(...records);
  }

  const total = allRecords.length;
  const conformant = allRecords.filter((r) => r.verdict === 'CONFORMANT').length;
  const nonConformant = allRecords.filter((r) => r.verdict === 'NON_CONFORMANT');
  const ok = archiveErrors.length === 0 && nonConformant.length === 0;

  // --trace: render the evidence chain per claim — the "trace any claim to its
  // evidence, and see how far it reaches" capability, in a plain-text medium.
  if (asTrace) {
    const line = (occ, id) => {
      const bits = [`backbone:${occ.backbone ? 'yes' : 'no'}`, `asOf:${occ.asOf || '(none)'}`];
      if (LEVEL_RANK >= 3) bits.push(`pinned:${occ.pinned ? 'yes' : 'no'}`);
      return `      ${id}  ${occ.name || '(unresolved)'}  [${bits.join('  ')}]`;
    };
    for (const r of allRecords) {
      const tag = r.verdict === 'CONFORMANT' ? `CONFORMANT @ ${LEVEL}` : `NON_CONFORMANT @ ${LEVEL} [${r.reasons.join(', ')}]`;
      console.log(`${r.archive} ${r.id}: ${r.subject.name || r.resourceID} --${r.relation}--> ${r.object.name || r.relatedResourceID}   ${tag}`);
      console.log(`    source: ${r.source || '(none)'}`);
      console.log(line(r.subject, r.resourceID));
      console.log(line(r.object, r.relatedResourceID));
    }
    for (const e of archiveErrors) console.error(`  - ${e}`);
    process.exit(ok ? 0 : 1);
  }

  // Machine-readable verdicts: the conformance mechanism is verdict-and-reason
  // agreement over a corpus, so another implementation can be compared to this
  // one record-by-record (founding spec §4).
  if (asJson) {
    process.stdout.write(JSON.stringify(allRecords) + '\n');
    process.exit(ok ? 0 : 1);
  }

  if (!ok) {
    const n = archiveErrors.length + nonConformant.length;
    console.error(`\ncheck-bindings: ${n} issue(s) — ${conformant}/${total} bindings traceability-conformant.\n`);
    for (const e of archiveErrors) console.error(`  - ${e}`);
    for (const r of nonConformant) {
      console.error(`  - ${r.archive} ${r.id}  ${r.resourceID} --${r.relation}--> ${r.relatedResourceID}: [${r.reasons.join(', ')}]`);
    }
    console.error('');
    process.exit(1);
  }

  console.log(
    `check-bindings: ok (${total} interaction binding${total === 1 ? '' : 's'} across ` +
    `${targets.length} archive${targets.length === 1 ? '' : 's'} traceability-conformant at ${LEVEL}; certifies traceability, not truth)`
  );
}

main().catch((e) => {
  console.error(`\ncheck-bindings: ${e && e.message ? e.message : e}`);
  process.exit(1);
});
