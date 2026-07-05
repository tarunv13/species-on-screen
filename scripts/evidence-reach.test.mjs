/*
  scripts/evidence-reach.test.mjs
  -------------------------------
  Black-box test of scripts/evidence-reach.mjs:
    - D7: non-resolution (open) is a first-class terminal state, distinct from
      both "traceable" and "gap".
    - D6: every badge names REACH, not truth (no pass/fail / error / check-cross
      language), the three states map to three distinct badges, and reason codes
      are surfaced verbatim (never paraphrased or dropped when valid).
  Dependency-free (Node stdlib), no DOM. Run: npm run test:evidence-reach.
*/
import assert from 'node:assert/strict';
import { classifyReach, REACH_META, REACH_STATES, reasonCodesVerbatim } from './evidence-reach.mjs';

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

// --- D6: badges name REACH, not truth ---------------------------------------
// No pass/fail, correctness, or check/cross language may appear in any badge.
const FORBIDDEN = ['pass', 'fail', 'error', 'invalid', 'valid', 'wrong', 'correct', 'true', 'false', 'ok', 'bad', '✓', '✗', '×', 'check', 'cross'];
const badges = REACH_STATES.map((s) => REACH_META[s].badge);
assert.equal(new Set(badges).size, 3, 'three distinct badge labels');
for (const s of REACH_STATES) {
  const b = REACH_META[s].badge;
  const low = b.toLowerCase();
  for (const term of FORBIDDEN) {
    assert.ok(!low.includes(term), `badge "${b}" (${s}) must not use truth/pass-fail term "${term}"`);
  }
  // Each badge names reach (the axis of D6): it speaks of what the warrant reaches.
  assert.ok(/reach/i.test(b), `badge "${b}" (${s}) must name reach`);
  n++;
}

// --- D6: reason codes are surfaced VERBATIM ---------------------------------
// The helper only filters non-strings and stably orders; it never renames.
assert.deepEqual(reasonCodesVerbatim(['SOURCE_UNRESOLVABLE']), ['SOURCE_UNRESOLVABLE'], 'single code passes through verbatim');
assert.deepEqual(reasonCodesVerbatim(['EVIDENCE_UNRESOLVABLE', 'RELATION_UNTYPED', 'SOURCE_UNRESOLVABLE']), ['EVIDENCE_UNRESOLVABLE', 'RELATION_UNTYPED', 'SOURCE_UNRESOLVABLE'], 'multiple codes verbatim, order preserved');
assert.deepEqual(reasonCodesVerbatim([]), [], 'no codes → empty');
assert.deepEqual(reasonCodesVerbatim(undefined), [], 'undefined → empty (no throw)');
assert.deepEqual(reasonCodesVerbatim(['SOURCE_MISSING', '', null, 42]), ['SOURCE_MISSING'], 'non-string / empty entries dropped, real code kept');
n += 5;

console.log(`evidence-reach.test: PASS (${n} checks; non-resolution first-class [D7]; badges name reach + reason codes verbatim [D6])`);
