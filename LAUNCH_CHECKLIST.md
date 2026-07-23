# Launch checklist — Eco-Cinema Observatory

Release Manager tracker. **Feature-frozen until public launch.** One task at a
time. Scope: technical polish only — no architecture, no redesign, no new
features. Derived from the pre-announcement technical backlog (2026-07-18).

## V1.0 — LAUNCHED
V1.0 launched 2026-07-23 — deploy 110306df, Editorial QA PASS (structural + felt).

Launch product decisions (canonical record: `docs/PRODUCT_DECISIONS.md`):
- [x] **D1 — Remove "Choice of One"** — threshold invites entry, not selection. Implemented, live, QA PASS.
- [x] **D2 — Continuous World** — breath continues through commitment, blends out on first movement (no stall, no snap). Implemented, live; C1–C5 structural + human felt pass PASS.
- [x] **D3 — Truthful Scope** — "three inhabited places" description. Implemented, live, QA PASS.

## MUST — gates the public announcement
- [x] **T1a · Link-preview metadata + favicon** — OG + Twitter Card + canonical
  on `index.html`; `favicon.svg` linked across the homepage, both indexes, and
  the 3 place pages; Vite base-rewrite (`/species-on-screen/favicon.svg`)
  verified in `dist/`; build green. _Done 2026-07-19._
- [x] **T1b · og:image raster (1200×630)** — `public/og-image.png` shipped
  (brand-consistent planet/orbit motif, generated deterministically via Node
  zlib — no new deps); present in `dist/`; OG/Twitter image URL resolves. _Done
  2026-07-19. Design may swap for a live globe screenshot post-launch (same
  filename, non-blocking)._
- [x] **T2 · WebGL init failure fallback** — `try/catch` in `src/main.js`
  around engine/globe construction (catches the throw from the WebGLRenderer);
  on failure `showStaticFallback()` hides the scrim/canvas and reveals the
  curated captions as plain links to their research notes (same destination the
  `<noscript>` block offers). _Done 2026-07-19; verify+build green, path
  confirmed in bundle. WebGL-off **runtime** render to be confirmed under T6._
- [x] **T3 · 404.html** — `public/404.html` (→ `dist/404.html`, the root page
  GitHub Pages serves for any unmatched path); self-contained, held-darkness
  register, links to the observatory + the archive; `noindex`. _Done 2026-07-19;
  build green, links resolve to real deployed paths._

## SHOULD — visible quality, cheap
- [x] **T4 · Reduced-motion gate on homepage globe + sr-only h1** — `src/globe.js`
  now captures `this._reduce` (matchMedia) and suppresses both ambient drift and
  cursor bias under `prefers-reduced-motion` (planet holds still); `sr-only`
  `<h1>` added to `index.html` (class) and `places/sundarbans.html` (inline
  hidden). _Done 2026-07-19; verify 17/17 incl. D10 grammar gate, build green.
  Reduced-motion **visual** confirmation folded into T6._
- [x] **T5 · Loading-screen masks Three init + focus-visibility spot-check** —
  **verified, no fix needed.** (A) Built `index.html` ships render-blocking CSS
  and the globe is built synchronously before the 1.5s hold → held darkness
  masks init, no first-paint flash. (B) Focus visible everywhere: both
  `outline:none` cases are legitimate (`.fr-node` is a `tabindex=-1` scroll
  target with `:focus-visible` on its links; `.lens--live` replaces the outline
  with a designed focus state); all other controls keep the default ring.
  _Done 2026-07-19._

## VERIFY-ONLY — look, fix only if broken
- [x] **T6 · verify-only** (2 of 3 verified sound; T6c device/browser QA closed at V1.0 launch by the human live-browser Editorial QA pass, 2026-07-23)
  - (a) atlas "In season now" badge — **verified sound**: `describeSeason(45,
    null).label` = "Summer"; the "—" seen server-side is the pre-JS default,
    replaced on load. Not a bug.
  - (b) homepage caption fallback — **verified intended**: `href` → research
    note (JS-off), `arrive()` → cinematic place (JS-on), per the in-code
    comments. Graceful degradation, no action.
  - (c) **BLOCKED — Safari/iOS smoke + runtime toggles** (WebGL-off render from
    T2, reduced-motion visual from T4): needs a real Safari/iOS device and
    browser toggles; unavailable on this Windows machine. Maintainer/Design
    device-QA gate.

## Out of scope until after launch
Three.js code-splitting; `sitemap.xml` / `robots.txt`; analytics.

## Progress log
- 2026-07-19 — **T1a done**: OG/Twitter/canonical + `favicon.svg` shipped across
  homepage, both indexes, and 3 place pages; build-verified in `dist/`. Split the
  og:image raster into **T1b** (pending — needs a screenshot).
- 2026-07-19 — **T1b done**: 1200×630 `og-image.png` generated and shipped;
  `verify` 17/17 + `build` green; asset present in `dist/`. **T1 complete.**
- 2026-07-19 — **T2 done**: WebGL-failure fallback (`showStaticFallback`) added
  to `src/main.js`; `verify` 17/17 + `build` green; fallback path present in the
  built bundle. Runtime WebGL-off render deferred to T6 browser smoke.
- 2026-07-19 — **T3 done**: `404.html` shipped to `dist/` root; `build` green;
  links to observatory + archive resolve. **MUST tier (T1–T3) complete.**
- 2026-07-19 — **T4 done**: globe reduced-motion gate + sr-only `<h1>` on
  homepage and Sundarbans place page; `verify` 17/17 (D10 grammar gate passed on
  the added heading) + `build` green.
- 2026-07-19 — **T5 verified**: loading-screen masking and focus visibility both
  sound; no code change required. **SHOULD tier (T4–T5) complete.**
- 2026-07-19 — **T6 partial**: (a) atlas season badge and (b) caption fallback
  both verified sound (no bug, intended behaviour). (c) Safari/iOS smoke +
  WebGL-off/reduced-motion runtime toggles **blocked** — needs real browser/
  device; hands to maintainer/Design QA gate. **STOP: blocker + human review.**
- 2026-07-19 — Not yet deployed: T1–T5 commits sit on
  `feat/exploration-prototypes-and-data-pipelines`. Merge/push to `main` (the
  production deploy trigger) is a human decision — see stop summary.
