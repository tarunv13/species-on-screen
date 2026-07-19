# Launch checklist — Eco-Cinema Observatory

Release Manager tracker. **Feature-frozen until public launch.** One task at a
time. Scope: technical polish only — no architecture, no redesign, no new
features. Derived from the pre-announcement technical backlog (2026-07-18).

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
- [ ] **T4 · Reduced-motion gate on homepage globe + sr-only h1** — gate ambient
  rotation (`src/globe.js:340`) on `prefers-reduced-motion`; add `sr-only`
  `<h1>` to `index.html` and `places/sundarbans.html` (both have zero `<h1>`).
- [ ] **T5 · Loading-screen masks Three init + focus-visibility spot-check** —
  confirm `#loading-screen` hides first paint; ensure visible keyboard focus on
  all interactive elements (only `field-record.css` defines custom focus today).

## VERIFY-ONLY — look, fix only if broken
- [ ] **T6** — atlas empty-season state; homepage caption fallback target;
  Safari/iOS smoke pass.

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
