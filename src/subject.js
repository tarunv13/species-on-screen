/*
  src/subject.js
  --------------
  The held SUBJECT as a URL-addressable manifest id — the D1 primitive of the
  Observatory v2 Interaction Grammar ("subject = URL-addressable manifest id,
  ?subject="). ONE shared mechanism every surface uses to (a) read the held
  subject from the URL and (b) carry it across a (declarative) navigation, so
  the same `?subject=<placeId>` resolves to the same subject on every depth —
  experiential, analytical, evidential — with no per-surface bespoke mapping.

  The subject id is the canonical `placeId` from the Place Manifest (ADR-001);
  each surface derives its own local slug from the resolved place, never from a
  second identity scheme. Unknown / absent subjects degrade gracefully.

  Pure and dependency-free (no DOM, no manifest import): the resolvers take the
  manifest `places` array as an argument, so this is unit-testable in Node and
  reusable by every surface. Surfaces pass `PLACES` from the typed manifest.
*/

export const SUBJECT_PARAM = 'subject';

// Read the ?subject= id from a location.search string. Returns null when absent
// or empty (never throws on malformed input).
export function subjectIdFromSearch(search) {
  try {
    const v = new URLSearchParams(search || '').get(SUBJECT_PARAM);
    return v && v.length ? v : null;
  } catch {
    return null;
  }
}

// Resolve a subject id to its manifest place (by canonical placeId). Returns
// undefined for an unknown id or bad input — never throws.
export function resolveSubject(places, subjectId) {
  if (!subjectId || !Array.isArray(places)) return undefined;
  return places.find((p) => p && p.placeId === subjectId);
}

// The held subject for a surface: the ?subject= place if it resolves, else the
// surface's own fallback identity (its filename/slug-derived placeId). Graceful
// — an unknown or absent subject never yields a broken surface, it falls back.
export function heldSubject(places, search, fallbackId) {
  return resolveSubject(places, subjectIdFromSearch(search)) || resolveSubject(places, fallbackId);
}

// Append ?subject=<id> to a link href, carrying the held subject across a
// declarative navigation (an <a href>, never a programmatic jump — depth stays
// discrete, D2). Preserves any existing query and fragment; a falsy id, an
// already-subject-tagged href, or a falsy href returns the href unchanged.
export function withSubject(href, subjectId) {
  if (!href || !subjectId) return href;
  const hashIdx = href.indexOf('#');
  const base = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
  if (new RegExp(`[?&]${SUBJECT_PARAM}=`).test(base)) return href;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}${SUBJECT_PARAM}=${encodeURIComponent(subjectId)}${hash}`;
}
