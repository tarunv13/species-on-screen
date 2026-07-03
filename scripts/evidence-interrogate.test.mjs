/*
  scripts/evidence-interrogate.test.mjs
  -------------------------------------
  Black-box test of the D5 interrogation chain (scripts/evidence-interrogate.mjs):
  proves the revealed evidence is copied VERBATIM from the validator record and
  never re-derived. Dependency-free (Node stdlib), no DOM.
  Run: npm run test:evidence-interrogate.
*/
import assert from 'node:assert/strict';
import { interrogationChain } from './evidence-interrogate.mjs';

let n = 0;
const ok = (label, cond) => { assert.ok(cond, label); n++; };

// A record exactly as check-bindings.js --json emits it (+ build-evidence's L2
// reachCodes). Every field the reveal shows must come straight from here.
const record = {
  archive: 'sundarbans',
  id: 'SUNDARBANS:REL:1',
  resourceID: 'SUNDARBANS:OCC:2',
  relatedResourceID: 'SUNDARBANS:OCC:1',
  relation: 'pollinates',
  source: 'Gani (2003)',
  subject: { occurrenceID: 'SUNDARBANS:OCC:2', name: 'Apis dorsata', backbone: true, asOf: '2019-03', pinned: false },
  object: { occurrenceID: 'SUNDARBANS:OCC:1', name: 'Heritiera fomes', backbone: true, asOf: null, pinned: false },
  verdict: 'CONFORMANT',
  reasons: [],
  reachCodes: ['SOURCE_UNRESOLVABLE'],
};
const c = interrogationChain(record);

// Verdict + source are echoed verbatim.
ok('verdict verbatim', c.verdict === 'CONFORMANT');
ok('source verbatim', c.source === 'Gani (2003)');
ok('relation verbatim', c.relation === 'pollinates');

// Reason codes prefer the L2 reachCodes, verbatim.
ok('reason codes from reachCodes, verbatim', c.reasons.length === 1 && c.reasons[0] === 'SOURCE_UNRESOLVABLE');

// Subject occurrence echoed field-for-field (no re-derivation).
ok('subject occurrenceID', c.subject.occurrenceID === 'SUNDARBANS:OCC:2');
ok('subject name', c.subject.name === 'Apis dorsata');
ok('subject backbone', c.subject.backbone === true);
ok('subject asOf', c.subject.asOf === '2019-03');
ok('subject pinned', c.subject.pinned === false);
ok('subject role labelled', c.subject.role === 'subject');

// Object occurrence: a null asOf stays null (not fabricated).
ok('object occurrenceID', c.object.occurrenceID === 'SUNDARBANS:OCC:1');
ok('object asOf null preserved', c.object.asOf === null);
ok('object role labelled', c.object.role === 'object');

// Falls back to L1 reasons when no reachCodes are present.
const l1only = interrogationChain({ verdict: 'NON_CONFORMANT', reasons: ['SOURCE_MISSING', 'RELATION_UNTYPED'], subject: {}, object: {} });
ok('L1 reasons used when reachCodes absent', l1only.reasons.join() === 'SOURCE_MISSING,RELATION_UNTYPED');
ok('nonconformant verdict verbatim', l1only.verdict === 'NON_CONFORMANT');

// Defensive: a bare/empty record never throws and yields empty, not fabricated.
const empty = interrogationChain(undefined);
ok('empty record → empty verdict', empty.verdict === '');
ok('empty record → no reasons', empty.reasons.length === 0);
ok('empty record → null source', empty.source === null);
ok('empty record → empty occ ids', empty.subject.occurrenceID === '' && empty.object.occurrenceID === '');
ok('empty record → booleans false', empty.subject.backbone === false && empty.subject.pinned === false);

// Non-string reason entries are dropped, never coerced.
const dirty = interrogationChain({ reachCodes: ['SOURCE_UNRESOLVABLE', '', null, 7], subject: {}, object: {} });
ok('non-string reason codes dropped', dirty.reasons.join() === 'SOURCE_UNRESOLVABLE');

console.log(`evidence-interrogate.test: PASS (${n} checks; the interrogation reveal is copied verbatim from the validator record, never re-derived)`);
