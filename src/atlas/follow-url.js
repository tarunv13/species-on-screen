/*
  src/atlas/follow-url.js
  -----------------------
  Pure mapping between an atlas field-record follow target and the URL fragment
  that addresses it — the *restorable* half of the D4 follow primitive.

  A follow edge links to an actor node `id="fr-node-<occurrenceID>"` via the
  in-page fragment `#fr-node-<occurrenceID>` (see src/atlas/field-record.js and
  src/atlas/interaction-web.js). This module is the single definition of that
  fragment↔dom-id relation, so the click handler and the on-load restore agree —
  the same "one pure mapping drives both build-time ids and the restore" shape as
  scripts/interrogation-url.mjs does for the evidence ledger's `#claim-N`.

  Dependency-free (no DOM, no imports), so it is unit-testable in Node and shared
  by the browser renderer — the same pattern as interaction-web.js.
*/

// The dom-id / fragment prefix a follow target carries.
export const FOLLOW_PREFIX = 'fr-node-';

/** The DOM id for an actor's occurrence id (mirrors field-record.js). */
export function followDomId(occurrenceId) {
  return FOLLOW_PREFIX + String(occurrenceId == null ? '' : occurrenceId);
}

/**
 * The follow-target DOM id addressed by a URL fragment, or null when the fragment
 * does not address a follow node (empty, an interrogation `#claim-N`, or any other
 * fragment). The leading '#' is optional; the value is percent-decoded so it
 * matches document.getElementById on the rendered id.
 * @param {string} hash  e.g. location.hash
 * @returns {string|null}
 */
export function followDomIdFromHash(hash) {
  const raw = String(hash == null ? '' : hash).replace(/^#/, '');
  let id;
  try { id = decodeURIComponent(raw); } catch (e) { id = raw; }
  return id.startsWith(FOLLOW_PREFIX) && id.length > FOLLOW_PREFIX.length ? id : null;
}
