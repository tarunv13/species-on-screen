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
- [ ] **T2 · WebGL init failure fallback** — guard `new THREE.WebGLRenderer`
  (`src/cinematic-engine.js:110`); on failure reveal the caption links / route
  to `notes/`. _Evidence: no try/catch or WebGL guard today._
- [ ] **T3 · 404.html** — minimal branded 404 that links home. _Evidence: no
  `404.html` exists; GitHub Pages serves its generic page._

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
