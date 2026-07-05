/*
  scripts/interrogation-url.test.mjs
  ----------------------------------
  Black-box test of the D8 interrogation-fragment mapping (interrogation-url.mjs):
  proves a claim's DOM id and the fragment that restores it round-trip, and that
  a non-interrogation fragment (e.g. M36's #fr-node-… follow target, or a subject
  query) is ignored. Dependency-free (Node stdlib), no DOM.
  Run: npm run test:interrogation-url.
*/
import assert from 'node:assert/strict';
import { CLAIM_PREFIX, claimDomId, domIdFromHash } from './interrogation-url.mjs';

let n = 0;
const eq = (label, got, want) => { assert.equal(got, want, `${label}: expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`); n++; };

// DOM id for the Nth claim.
eq('first claim id', claimDomId(1), 'claim-1');
eq('nth claim id', claimDomId(37), 'claim-37');

// Round-trip: the fragment for a claim restores exactly that claim's id.
for (const i of [1, 3, 10, 38]) {
  eq(`round-trip claim ${i}`, domIdFromHash('#' + claimDomId(i)), claimDomId(i));
}

// A fragment addresses an interrogation only when it matches claim-<digits>.
eq('bare claim fragment (no #)', domIdFromHash('claim-2'), 'claim-2');
eq('non-interrogation fragment ignored', domIdFromHash('#fr-node-EPR:OCC:1'), '');
eq('empty fragment ignored', domIdFromHash('#'), '');
eq('no fragment ignored', domIdFromHash(''), '');
eq('null ignored (no throw)', domIdFromHash(null), '');
eq('non-numeric suffix ignored', domIdFromHash('#claim-abc'), '');
eq('prefix-only ignored', domIdFromHash('#claim-'), '');
eq('trailing junk ignored', domIdFromHash('#claim-3x'), '');

// The prefix is the single shared constant the ledger's inline script also uses.
eq('prefix is stable', CLAIM_PREFIX, 'claim-');

console.log(`interrogation-url.test: PASS (${n} checks; a claim's interrogation state round-trips through the URL fragment, and non-interrogation fragments are ignored)`);
