/*
  scripts/cinematic-grammar.mjs
  -----------------------------
  Pure predicates for the two Observatory v2 build invariants M37 enforces:

    D3  the CINEMATIC surface is an affordance-sink / one-way bridge — its
        runtime hosts NO depth affordance (no press-in / step-back / interrogate,
        no cross-depth link or import, no cross-document view-transition).

    D9  the held SUBJECT morph (view-transition-name: eke-subject) is present on
        every depth-transition surface, and it is the ONLY view-transition-name
        used there (the single-subject invariant).

  These functions take file contents (not paths) so they are unit-testable in
  Node with fixtures; the CLI wrapper (scripts/check-cinematic-grammar.js) reads
  the real surfaces. Dependency-free (no DOM, no imports).

  Scope note: the cinematic RUNTIME is the JS + CSS. No-JS HTML fallbacks (the
  homepage caption anchors the runtime intercepts) are graceful degradation, not
  runtime affordances, and are out of scope; place-shell HTML is still checked
  for real cross-depth links after comments are stripped.
*/

export const SUBJECT_MORPH = 'eke-subject';

// Strip JS comments so prose (e.g. a header comment naming notes/…) is never
// mistaken for a runtime affordance. Block comments go entirely; only PURE line
// comments (line's first non-space is //) go, so string URLs like 'http://…'
// (which contain //) are never corrupted.
export function stripJsComments(js) {
  const noBlock = String(js).replace(/\/\*[\s\S]*?\*\//g, '');
  return noBlock.split('\n').map((line) => (/^\s*\/\//.test(line) ? '' : line)).join('\n');
}

// Strip HTML comments (<!-- … -->), where the place shells keep their wiring
// documentation (including references to the research surface).
export function stripHtmlComments(html) {
  return String(html).replace(/<!--[\s\S]*?-->/g, '');
}

// D3 — a cinematic runtime (JS) must contain none of these:
const AFFORDANCE_PATTERNS = [
  { kind: 'cross-depth import', re: /\bimport\b[^;\n]*['"][^'"]*(?:\/atlas\/|\/notes\/|evidence-|interaction-web|surface-links|render-narrative|field-record|check-bindings|evidence-reach|evidence-interrogate)[^'"]*['"]/ },
  { kind: 'evidential/analytical logic', re: /\b(?:interrogationChain|interactionWebModel|classifyReach|REACH_META|reasonCodesVerbatim)\b/ },
  { kind: 'cross-depth navigation string', re: /['"`][^'"`]*\b(?:atlas|notes|evidence)\/[^'"`]*['"`]/ },
  { kind: 'interrogate affordance', re: /\binterrogate\b/i },
];

export function findCinematicJsAffordances(name, js) {
  const src = stripJsComments(js);
  const out = [];
  for (const p of AFFORDANCE_PATTERNS) {
    const m = src.match(p.re);
    if (m) out.push({ file: name, kind: p.kind, match: m[0].trim().slice(0, 80) });
  }
  return out;
}

// D3 — cinematic CSS must host no cross-document depth transition at all.
export function findCinematicCssTransitions(name, css) {
  const out = [];
  if (/@view-transition/.test(css)) out.push({ file: name, kind: '@view-transition opt-in in cinematic css' });
  if (new RegExp(SUBJECT_MORPH).test(css)) out.push({ file: name, kind: `${SUBJECT_MORPH} morph in cinematic css` });
  return out;
}

// D3 — a place-shell HTML must contain no real cross-depth link (after its
// wiring-documentation comments are stripped).
export function findHtmlCrossDepthLinks(name, html) {
  const stripped = stripHtmlComments(html);
  const out = [];
  const re = /<a\b[^>]*\bhref\s*=\s*["'][^"']*\b(atlas|notes|evidence)\/[^"']*["']/gi;
  let m;
  while ((m = re.exec(stripped))) out.push({ file: name, kind: `cross-depth link to ${m[1]}/`, match: m[0].slice(0, 80) });
  return out;
}

// D9 — a depth-transition surface must opt into the cross-document transition
// AND declare the ONE shared subject morph, and no other view-transition-name.
export function findMissingSubjectMorph(name, css) {
  const out = [];
  if (!/@view-transition/.test(css)) out.push({ file: name, kind: 'missing @view-transition opt-in' });
  if (!new RegExp(`view-transition-name\\s*:\\s*${SUBJECT_MORPH}\\b`).test(css)) {
    out.push({ file: name, kind: `missing view-transition-name: ${SUBJECT_MORPH}` });
  }
  for (const mm of css.matchAll(/view-transition-name\s*:\s*([a-z0-9_-]+)/gi)) {
    if (mm[1] !== SUBJECT_MORPH) out.push({ file: name, kind: `foreign view-transition-name "${mm[1]}" breaks the single-subject invariant` });
  }
  return out;
}
