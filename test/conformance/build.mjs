#!/usr/bin/env node
/*
  test/conformance/build.mjs
  --------------------------
  Deterministically (re)materializes the tab-delimited Darwin Core fixtures for
  the reference validator's conformance corpus. The materialized files are
  committed static assets (so any implementation can be pointed at them); this
  generator exists so they can be regenerated with guaranteed tab delimiters and
  can never silently drift. It writes fixtures only — the manifest, the expected
  verdicts (expected.json), and the README are hand-authored static contracts.

  Run: node test/conformance/build.mjs   (or: npm run conformance:build)
*/
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const tsv = (rows) => rows.map((r) => r.join('\t')).join('\n') + '\n';

const RO_POLLINATES = 'http://purl.obolibrary.org/obo/RO_0002455';
const RO_EATS = 'http://purl.obolibrary.org/obo/RO_0002470';
const gbif = (id) => `https://www.gbif.org/species/${id}`;
const backbone = (key) => `{"gbifTaxonKey":${key}}`;
// L3: reconciliation pinned to a declared backbone version (GBIF Backbone DOI).
const pinned = (key) => `{"gbifTaxonKey":${key},"backboneVersion":"10.15468/39omei"}`;

const OCC_HEADER = ['occurrenceID', 'scientificName', 'associatedReferences', 'eventDate', 'dynamicProperties'];
const REL_HEADER = ['resourceRelationshipID', 'resourceID', 'relatedResourceID', 'relationshipOfResource', 'relationshipOfResourceID', 'relationshipAccordingTo', 'relationshipEstablishedDate', 'relationshipRemarks'];

// --- clean: every binding fully traceability-conformant -------------------
const cleanOcc = tsv([
  OCC_HEADER,
  ['OCC:1', 'Alpha alpha', gbif(1), '2001', pinned(1)],
  ['OCC:2', 'Beta beta', gbif(2), '2001', pinned(2)],
  ['OCC:3', 'Gamma gamma', gbif(3), '2002', pinned(3)],
]);
const cleanRel = tsv([
  REL_HEADER,
  ['REL:1', 'OCC:2', 'OCC:1', 'pollinates', RO_POLLINATES, 'https://doi.org/10.1111/jbi.14001', '2020-01-01', 'conformant at L1, L2, L3 (DOI source, pinned backbone, dated binding)'],
  ['REL:2', 'OCC:3', 'OCC:1', 'eats', RO_EATS, '10.1111/jbi.14002', '2020-01-01', 'conformant at L1, L2, L3 (bare DOI, pinned backbone, dated binding)'],
]);

// --- mixed: one conformant + one binding per reason code ------------------
const mixedOcc = tsv([
  OCC_HEADER,
  ['OCC:1', 'Alpha alpha', gbif(1), '2001', backbone(1)],
  ['OCC:2', 'Beta beta', gbif(2), '2001', backbone(2)],
  ['OCC:3', 'Gamma gamma', '', '2002', '{}'],          // no backbone reconciliation
  ['OCC:4', 'Delta delta', gbif(4), '', backbone(4)],  // no as-of stamp
]);
const mixedRel = tsv([
  REL_HEADER,
  ['MREL:1', 'OCC:2', 'OCC:1', 'pollinates', RO_POLLINATES, 'Ref (2001)', '', 'conformant at L1; SOURCE_UNRESOLVABLE at L2 (citation string, no PID)'],
  ['MREL:2', 'OCC:99', 'OCC:1', 'eats', RO_EATS, 'Ref', '', 'EVIDENCE_UNRESOLVABLE'],
  ['MREL:3', 'OCC:2', 'OCC:1', 'eats', 'eats', 'Ref', '', 'RELATION_UNTYPED (bare label, not a controlled IRI)'],
  ['MREL:4', 'OCC:2', 'OCC:1', 'eats', RO_EATS, '', '', 'SOURCE_MISSING (relationshipAccordingTo empty)'],
  ['MREL:5', 'OCC:3', 'OCC:1', 'eats', RO_EATS, 'Ref', '', 'BACKBONE_UNRECONCILED (OCC:3 has no taxon key)'],
  ['MREL:6', 'OCC:4', 'OCC:1', 'eats', RO_EATS, 'Ref', '', 'AS_OF_MISSING (OCC:4 has no eventDate)'],
]);

async function writeArchive(slug, occ, rel) {
  const dir = path.join(HERE, 'dwca', slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'occurrence.txt'), occ);
  await writeFile(path.join(dir, 'resource-relationship.txt'), rel);
}

await writeArchive('clean', cleanOcc, cleanRel);
await writeArchive('mixed', mixedOcc, mixedRel);
console.log('conformance fixtures materialized: test/conformance/dwca/{clean,mixed}/');
