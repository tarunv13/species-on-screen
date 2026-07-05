/*
  scripts/evidence-interrogate.mjs
  --------------------------------
  Pure builder for the evidence chain revealed by INTERROGATE — the D5 primitive
  of the Observatory v2 Interaction Grammar ("interrogate = a depth-local reveal
  from check-bindings --json, never re-derived").

  It takes ONE per-binding record exactly as the reference validator emits it
  (scripts/check-bindings.js --json, with build-evidence's L2 reachCodes) and
  returns the claim's full evidence chain — verdict, reason codes, source, and
  each occurrence's backbone / as-of / pinned status — WITHOUT recomputing any
  evidentiary logic. Every field is copied straight from the validator record;
  this module only selects and shapes, it never re-derives. Rendering (the
  <details> reveal) lives in the caller (scripts/build-evidence.mjs).

  Dependency-free (no DOM, no imports) so it is unit-testable in Node.
*/

// Shape a single occurrence end of the chain from the validator's evidence
// object — verbatim; booleans are normalised only for safe rendering.
function occ(o, role) {
  const x = o || {};
  return {
    role,
    occurrenceID: x.occurrenceID || '',
    name: x.name || '',
    backbone: x.backbone === true, // GBIF backbone reconciled?
    asOf: x.asOf || null,          // eventDate (the as-of stamp)
    pinned: x.pinned === true,     // backbone version pinned?
  };
}

/**
 * Build the interrogation evidence chain for one validator record.
 * @param {object} record  a check-bindings --json record (verdict, reasons/
 *                          reachCodes, source, subject{}, object{}, relation …).
 * @returns {{verdict, reasons:string[], source:string|null, relation:string,
 *            subject:object, object:object}}
 */
export function interrogationChain(record) {
  const r = record || {};
  // Reason codes verbatim: prefer build-evidence's L2 reachCodes (the fullest
  // signal it renders), falling back to the record's own L1 reasons. Either way
  // the strings are the validator's — never paraphrased.
  const reasons = Array.isArray(r.reachCodes)
    ? r.reachCodes.filter((c) => typeof c === 'string' && c.length > 0)
    : (Array.isArray(r.reasons) ? r.reasons.filter((c) => typeof c === 'string' && c.length > 0) : []);
  return {
    verdict: r.verdict || '',
    reasons,
    source: r.source || null,
    relation: r.relation || '',
    subject: occ(r.subject, 'subject'),
    object: occ(r.object, 'object'),
  };
}
