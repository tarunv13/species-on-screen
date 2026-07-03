/*
  scripts/evidence-reach.mjs
  --------------------------
  Pure classification of how far a single interaction claim's warrant REACHES,
  derived entirely from the reference validator's own verdicts (no re-derivation,
  so the evidential surface can never drift from scripts/check-bindings.js).

  This is the D7 primitive of the Observatory v2 Interaction Grammar: NON-RESOLUTION
  is a FIRST-CLASS TERMINAL STATE. A claim whose warrant reaches a named source but
  no persistent identifier resolves it is not a failure and not a gap — it is an
  honestly-open terminal state ("understanding = reach of warrant, incl. honest
  non-resolution"). Three reach-states, no pass/fail:

    traceable  baseline-conformant AND the source resolves to a persistent id.
               The warrant reaches resolvable evidence.
    open       baseline-conformant but the source is a citation that resolves to
               no persistent identifier (validator's L2 SOURCE_UNRESOLVABLE).
               A FIRST-CLASS terminal state — the warrant reaches a named source,
               and resolution is honestly open. NOT a defect.
    gap        baseline-nonconformant: baseline traceability itself is incomplete
               (e.g. SOURCE_MISSING — no source at all — or an unresolvable/untyped
               binding). A real deficiency, distinct from honest non-resolution.

  The three states are computed from two facts the validator already emits:
    - baselineVerdict : the L1 verdict ('CONFORMANT' | 'NON_CONFORMANT')
    - l2Reasons       : the reason codes at level L2 (to read SOURCE_UNRESOLVABLE)

  Dependency-free. Reused by scripts/build-evidence.mjs and any future surface.
*/

// The one L2 reason code that names honest non-resolution of a *present* source.
// An absent source is SOURCE_MISSING at baseline (→ gap), never non-resolution.
export const SOURCE_UNRESOLVABLE = 'SOURCE_UNRESOLVABLE';

export const REACH_STATES = ['traceable', 'open', 'gap'];

// Presentation vocabulary shared by every surface that renders reach, so the
// wording of every reach-state is defined in exactly one place.
//
// D6/M34: every badge NAMES REACH, NOT TRUTH — how far the claim's warrant
// reaches (evidence → a source → nowhere yet), never whether the claim is
// correct. No pass/fail, no "error"/check/cross semantics. The three states
// stay consistent with D7's first-class non-resolution terminal state (open).
// Alongside the badge, the surface shows the validator's reason codes VERBATIM
// (the append-only vocabulary from check-bindings.js) — never paraphrased.
export const REACH_META = {
  traceable: {
    badge: 'REACHES EVIDENCE',
    cls: 'ok',
    note: 'The warrant reaches evidence that resolves to a persistent identifier.',
  },
  open: {
    badge: 'REACHES A SOURCE',
    cls: 'open',
    note: 'The warrant reaches a named source; no persistent identifier resolves it yet. An open question — a first-class terminal state, not a failure.',
  },
  gap: {
    badge: 'REACH INCOMPLETE',
    cls: 'no',
    note: 'The warrant does not yet reach a declared, typed, sourced evidentiary binding at baseline.',
  },
};

// Reason codes are surfaced VERBATIM — this helper only orders them stably and
// drops non-strings; it never renames, paraphrases, or hides a code (D6).
export function reasonCodesVerbatim(codes) {
  if (!Array.isArray(codes)) return [];
  return codes.filter((c) => typeof c === 'string' && c.length > 0);
}

/**
 * Classify a claim's reach into one of REACH_STATES.
 * @param {string} baselineVerdict  the validator's L1 verdict for this binding.
 * @param {string[]} l2Reasons      the validator's L2 reason codes for this binding.
 * @returns {'traceable'|'open'|'gap'}
 */
export function classifyReach(baselineVerdict, l2Reasons) {
  if (baselineVerdict !== 'CONFORMANT') return 'gap';
  const reasons = Array.isArray(l2Reasons) ? l2Reasons : [];
  if (reasons.includes(SOURCE_UNRESOLVABLE)) return 'open';
  return 'traceable';
}
