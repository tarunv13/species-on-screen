/*
  scripts/interrogation-url.mjs
  -----------------------------
  Pure mapping between an interrogated claim and the URL FRAGMENT that addresses
  it — the D8 primitive ("interrogation state in the URL fragment"). One shared
  definition used to (a) stamp each interrogable claim's DOM id at build time and
  (b) drive the ledger's tiny restore/sync script, so a copied URL restores which
  claim is open and opening one is a history entry (back/forward retraces).

  The subject lives in the query (?subject=, D1/M39) and the interrogation in the
  fragment (#claim-N) — a shared, restorable URL model. Dependency-free, no DOM,
  unit-testable in Node; the browser script inlines the same CLAIM_PREFIX.
*/

// Fragment / DOM-id prefix for an interrogable claim. Claims are addressed by
// their 1-based position on the ledger (stable per render, collision-free —
// avoids relying on a resourceRelationshipID that may be absent or duplicated).
export const CLAIM_PREFIX = 'claim-';

/** The DOM id / fragment target for the Nth interrogable claim (1-based). */
export function claimDomId(index) {
  return `${CLAIM_PREFIX}${index}`;
}

/**
 * The claim DOM-id addressed by a location.hash, or '' when the fragment does
 * not address an interrogation (so an unrelated #fragment is ignored).
 */
export function domIdFromHash(hash) {
  const h = String(hash == null ? '' : hash).replace(/^#/, '');
  return new RegExp(`^${CLAIM_PREFIX}\\d+$`).test(h) ? h : '';
}
