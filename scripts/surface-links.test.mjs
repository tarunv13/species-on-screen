#!/usr/bin/env node
/*
  scripts/surface-links.test.mjs
  ------------------------------
  Unit test for the pure cross-depth navigation derivation
  (src/notes/surface-links.js) — the reciprocal descent from the research
  surface INTO the evidential depth (the evidence ledger). Runs in Node with
  plain fixtures: no DOM, no build. Exit 0 iff all assertions pass.
*/
import { surfaceLinksForPlace } from '../src/notes/surface-links.js';

let failures = 0;
const check = (name, cond) => { if (!cond) { failures++; console.error(`  FAIL: ${name}`); } };

const full = {
  surfaces: {
    atlas: [{ kind: 'field-record', slug: 'coral-triangle' }, { kind: 'companion', slug: 'crossing' }],
    cinematic: { slug: 'crossing', enterLabel: 'Enter the crossing' },
    dwca: { slug: 'coral-triangle' },
  },
};
const fullLinks = surfaceLinksForPlace(full);
check('full: four links', fullLinks.length === 4);
check('full: order is analytical → experiential → evidential', JSON.stringify(fullLinks.map((l) => l.label)) ===
  JSON.stringify(['Interaction web →', 'Research companion →', 'Enter the crossing', 'Evidence ledger →']));
check('full: descent link href points at the evidence ledger', fullLinks[3].href === '../evidence/coral-triangle.html');

const noDwca = { surfaces: { atlas: [{ kind: 'field-record', slug: 'x' }], cinematic: { slug: 'x', enterLabel: 'Enter' } } };
check('no dwca: no evidence-ledger link', !surfaceLinksForPlace(noDwca).some((l) => l.label === 'Evidence ledger →'));

const noCinematic = { surfaces: { atlas: [{ kind: 'field-record', slug: 'amazon-varzea' }], dwca: { slug: 'amazon-varzea' } } };
const nc = surfaceLinksForPlace(noCinematic);
check('no cinematic: still descends to the evidence ledger', nc.some((l) => l.href === '../evidence/amazon-varzea.html'));
check('no cinematic: no cinematic link', !nc.some((l) => l.href.startsWith('../places/')));

check('null place: no links', surfaceLinksForPlace(null).length === 0);
check('research-only (no surfaces): no links', surfaceLinksForPlace({ surfaces: {} }).length === 0);

if (failures) {
  console.error(`\nsurface-links.test: FAIL — ${failures} assertion(s).\n`);
  process.exit(1);
}
console.log('surface-links.test: PASS (reciprocal descent to the evidence ledger derives correctly)');
