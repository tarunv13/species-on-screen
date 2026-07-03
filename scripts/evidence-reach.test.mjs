/*
  scripts/evidence-reach.test.mjs
  -------------------------------
  Black-box test of the D7 reach classifier (scripts/evidence-reach.mjs): proves
  non-resolution is a first-class terminal state distinct from both "traceable"
  and "gap". Dependency-free (Node stdlib), no DOM. Run: npm run test:evidence-reach.
*/
import assert from 'node:assert/strict';
import { classifyReach, REACH_META, REACH_STATES } from './evidence-reach.mjs';

let n = 0;
const check = (label, got, want) => { assert.equal(got, want, `${label}: expected ${want}, got ${got}`); n++; };

// Baseline-conformant, source resolves to a persistent id → traceable.
check('conformant + no L2 codes', classifyReach('CONFORMANT', []), 'traceable');
check('conformant + unrelated L2 codes', classifyReach('CONFORMANT', ['BACKBONE_UNPINNED']), 'traceable');

// Baseline-conformant but source has no persistent identifier → OPEN (the D7
// first-class non-resolution terminal state — NOT collapsed into traceable, and
// NOT collapsed into gap).
check('conformant + SOURCE_UNRESOLVABLE', classifyReach('CONFORMANT', ['SOURCE_UNRESOLVABLE']), 'open');
check('conformant + SOURCE_UNRESOLVABLE among others', classifyReach('CONFORMANT', ['BACKBONE_UNPINNED', 'SOURCE_UNRESOLVABLE']), 'open');

// Baseline-nonconformant → gap, regardless of L2 codes. An absent source
// (SOURCE_MISSING) fails at baseline and is a gap, never non-resolution.
check('nonconformant (SOURCE_MISSING)', classifyReach('NON_CONFORMANT', ['SOURCE_MISSING']), 'gap');
check('nonconformant (multiple)', classifyReach('NON_CONFORMANT', ['EVIDENCE_UNRESOLVABLE', 'RELATION_UNTYPED']), 'gap');
check('nonconformant even with SOURCE_UNRESOLVABLE', classifyReach('NON_CONFORMANT', ['SOURCE_MISSING', 'SOURCE_UNRESOLVABLE']), 'gap');

// Defensive: undefined/garbage reasons never throw.
check('conformant + undefined reasons', classifyReach('CONFORMANT', undefined), 'traceable');

// Every state has complete, distinct presentation metadata.
assert.equal(REACH_STATES.length, 3, 'exactly three reach-states');
for (const s of REACH_STATES) {
  assert.ok(REACH_META[s], `REACH_META has ${s}`);
  assert.ok(REACH_META[s].badge && REACH_META[s].cls && REACH_META[s].note, `${s} metadata complete`);
  n++;
}
const clss = REACH_STATES.map((s) => REACH_META[s].cls);
assert.equal(new Set(clss).size, 3, 'each state has a distinct css class');

console.log(`evidence-reach.test: PASS (${n} reach classifications; non-resolution is a first-class terminal state)`);
