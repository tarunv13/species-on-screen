/*
  scripts/follow-url.test.mjs
  ---------------------------
  Black-box test of the D4 follow-fragment mapping (src/atlas/follow-url.js):
  proves an actor node's DOM id and the `#fr-node-<id>` fragment that restores it
  round-trip, and that a non-follow fragment (e.g. M40's #claim-N interrogation, or
  a subject query) is ignored — the restore half of the D4 follow primitive, so a
  copied `#fr-node-<id>` URL resolves to the same actor node the follow click sets.
  Dependency-free (Node stdlib), no DOM. Run: npm run test:follow-url.
*/
import assert from 'node:assert/strict';
import { FOLLOW_PREFIX, followDomId, followDomIdFromHash } from '../src/atlas/follow-url.js';

let n = 0;
const eq = (label, got, want) => { assert.equal(got, want, `${label}: expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`); n++; };

// DOM id for an occurrence id (mirrors the field-record template).
eq('simple dom id', followDomId('OCC1'), 'fr-node-OCC1');
eq('colon-bearing occ id', followDomId('EPR-VENTS:OCC:3'), 'fr-node-EPR-VENTS:OCC:3');
eq('null occ id degrades', followDomId(null), 'fr-node-');

// Round-trip: the fragment for a node restores exactly that node's DOM id.
for (const occ of ['OCC1', 'EPR-VENTS:OCC:3', 'SUNDARBANS:OCC:9']) {
  const dom = followDomId(occ);
  eq(`round-trip ${occ}`, followDomIdFromHash('#' + dom), dom);
}

// A fragment addresses a follow node only when it starts with fr-node-.
eq('bare follow fragment (no #)', followDomIdFromHash('fr-node-OCC2'), 'fr-node-OCC2');
eq('percent-decoded to match getElementById', followDomIdFromHash('#fr-node-A%20B'), 'fr-node-A B');
eq('interrogation fragment ignored', followDomIdFromHash('#claim-3'), null);
eq('empty fragment ignored', followDomIdFromHash('#'), null);
eq('no fragment ignored', followDomIdFromHash(''), null);
eq('null ignored (no throw)', followDomIdFromHash(null), null);
eq('prefix-only ignored', followDomIdFromHash('#fr-node-'), null);
eq('unrelated fragment ignored', followDomIdFromHash('#somewhere'), null);

// The prefix is the single shared constant the field-record renderer also uses.
eq('prefix is stable', FOLLOW_PREFIX, 'fr-node-');

console.log(`follow-url.test: PASS (${n} checks; a follow target's DOM id round-trips through the #fr-node-<id> fragment, and non-follow fragments are ignored)`);
