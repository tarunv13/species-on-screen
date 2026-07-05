/*
  scripts/grammar-constraints.mjs
  -------------------------------
  The two Observatory v2 grammar constraints M37 did not cover, added so the M38
  composite gate (scripts/check-grammar.js) enforces all four. Pure, dependency-
  free predicates; they REUSE M37's helpers (cinematic-grammar.mjs) rather than
  re-implementing them.

    subject invariant (D1 / "one invariant") — the held subject is a SINGLE
      identity: `eke-subject` is the ONLY view-transition-name anywhere. Any
      other name is a competing subject and breaks the invariant. (M37/D9 checks
      the morph is PRESENT on each transition surface; this checks it is the same
      one everywhere.)

    depth discreteness (D2) — depth is a discrete, multi-document coordinate and
      SCROLL NEVER CROSSES DEPTH. Cross-depth movement must be a declarative
      <a href> (a user navigation → multi-document view transition), never a
      PROGRAMMATIC jump (location/history) that scroll or a timer could drive.
*/
import { stripJsComments, SUBJECT_MORPH } from './cinematic-grammar.mjs';

export { SUBJECT_MORPH };

// D1 — every view-transition-name in production surfaces must be eke-subject.
export function findForeignSubjectNames(name, css) {
  const out = [];
  for (const m of String(css).matchAll(/view-transition-name\s*:\s*([a-z0-9_-]+)/gi)) {
    if (m[1] !== SUBJECT_MORPH) {
      out.push({ file: name, kind: `foreign subject identity "${m[1]}" breaks the single-subject invariant` });
    }
  }
  return out;
}

// The non-experiential depths. Movement between depths must be declarative:
// experiential (cinematic: index ↔ places) is ONE depth, so places/ is not a
// depth crossing and is excluded here.
const CROSS_DEPTH = /['"`][^'"`]*\b(?:atlas|notes|evidence)\/[^'"`]*['"`]/;
// A programmatic navigation (not an element's .href assignment — that is a
// declarative link). Matches location.href/assign/replace, (window.)location =,
// history.push/replaceState.
const PROGRAMMATIC_NAV = /\b(?:window\s*\.\s*)?location\s*(?:\.\s*(?:href|assign|replace)\b|=)|\bhistory\s*\.\s*(?:push|replace)State\b/;

// D2 — flag any surface JS that navigates PROGRAMMATICALLY to another depth
// (which scroll/timers could then cross). `js` is comment-stripped first so a
// commented example never counts.
export function findScrollDepthCrossing(name, js) {
  const out = [];
  const src = stripJsComments(js);
  for (const line of src.split('\n')) {
    if (PROGRAMMATIC_NAV.test(line) && CROSS_DEPTH.test(line)) {
      out.push({ file: name, kind: 'programmatic cross-depth navigation (scroll must never cross depth; movement is declarative & multi-document)', match: line.trim().slice(0, 90) });
    }
  }
  return out;
}
