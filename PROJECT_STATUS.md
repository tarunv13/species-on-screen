# Eco-Cinema Observatory — Project Status

**Last updated:** 2026-06-27
**Current git commit:** TBD — feat(atlas): promote Sundarbans field record to canonical atlas page
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**AI Operating System:** v1.0 — frozen. See `.agents/AI-OS.md`.

---

## Observatory — current state

Two canonical cinematic place pages exist, build cleanly, and are both reachable from the homepage:
- `places/sundarbans.html` — Bengal tiger, DOM/GSAP descent (narrative: `verified`)
- `places/crossing.html` — Hawksbill natal homing, Canvas 2D scroll-governed (narrative: `draft`)

Homepage navigation: two-caption stack (lower-right). Sundarbans = primary (ink-mid). Crossing = secondary (ink-low, above). Both transition via Article III luminance dip.

---

## Production Roadmap

Ordered by dependency. Execute one milestone per session.

---

### M1 — Crossing canonicalization ✓ COMPLETE (2026-06-27)

Committed in `2e3834d`.

---

### M2 — Homepage surfaces the Crossing ✓ COMPLETE (2026-06-27)

Committed in `e389ea7`. Two-caption navigation stack in lower-right. `arriveToCrossing()` delivers Article III luminance dip transition to `places/crossing.html` in 1.5s.

---

### M3 — Hawksbill narrative elevated to `verified` ✓ COMPLETE (2026-06-27)

**Why it matters:** The Crossing exists but is unreachable. The Observatory has two canonical cinematic experiences and only one is navigable. Until M2 ships, the architecture validation is invisible to any visitor.

**Blocking dependencies:** M1 (done).

**Design decision required before implementation:**
The homepage currently has one hardcoded navigation entry (`arriveAtSundarbans()`, globe species marker at tiger hotspot, caption "Sundarbans · Bengal tiger"). The Crossing is an open-ocean journey — it has no single point on the globe. Two viable approaches:
- **A. Second static caption** — Add "Coral Triangle · Hawksbill" below the existing caption; clicking navigates directly to `places/crossing.html` without a globe transition (the ocean crossing doesn't need the globe as an entry frame).
- **B. Places index page** — Create `places/index.html` as a minimal navigation surface listing both places, accessible from a homepage link.

Approach A is lower effort and consistent with the Observatory's one-editorial-voice-at-a-time principle. Approach B is more scalable as places grow. **Recommend A for now; B when a third place is added.**

**Estimated effort:** 2–3 hours (Approach A: one new caption element + click handler in `src/main.js`).

**Definition of Done:**
- Homepage shows a navigation entry to the Crossing
- Clicking it navigates to `places/crossing.html` without a full-screen flash
- Existing Sundarbans navigation is unaffected
- `npm run build` clean

**Expected commit:** `feat(homepage): surface Crossing as second navigable place`

---

### M3 — Hawksbill narrative elevated to `verified`

Committed in `860f5e8`. Both sources confirmed (Lohmann et al. 2008 PNAS, Meylan & Donnelly 1999 Chelonian Conservation and Biology). Archive entry added alphabetically. check-narratives archive-index drift check now enforces the link.

---

### M4 — Field record promoted to `atlas/sundarbans.html` ✓ COMPLETE (2026-06-27)

Committed in `TBD`. Files created: `atlas/sundarbans.html`, `src/atlas/field-record.js`, `src/atlas/field-record.css`. The JS imports `species-art.js` and `biome-backdrop.js` from `../prototypes/` (additive — prototype originals untouched). `vite.config.js` auto-discovered `atlas/sundarbans.html` without modification. Build: clean, `dist/atlas/sundarbans.html` = 3.03 kB.

---

### M5 — Migration Atlas (Crossing research companion)

**Why it matters:** The Crossing cinematic page has no research surface counterpart beyond the raw narrative notes page. The Migration Atlas would be a glassmorphic atlas-surface page showing the hawksbill's natal homing route with real GBIF occurrence data and the Liquid Glass design system.

**Blocking dependencies:** M1 (done). M3 recommended first (narrative should be verified before the atlas page launches).

**Estimated effort:** 6–8 hours. New surface: `atlas/migration.html` + `src/atlas/migration.{js,css}`. Uses existing Liquid Glass tokens (`src/atlas/liquid-glass.{css,js}`).

**Expected commit:** `feat(atlas): Migration Atlas — hawksbill natal homing route`

---

## Next recommended session

**Execute M5** (Migration Atlas — hawksbill natal homing route). Requires GBIF data fetch and Liquid Glass design system. Estimated 6–8 hours.

---

## Paper 1 — frozen

Status unchanged. Blocked on B-1 through B-6 (see below). Do not initiate Paper 1 work unless it blocks the doctoral submission timeline.

### Blocking tasks before pilot

| # | Task | Owner |
|---|---|---|
| B-1 | Write `paper1-coding-manual-v1.2.md` (HB-8 extension + HB-9) | Primary coder |
| B-2 | Pre-register v1.2 on OSF before Day 1 of pilot | Primary coder |
| B-3 | Update `paper1-coding-starter.csv`: add `kf_confidence`, `nc_confidence`, `in_scope` columns | Primary coder |
| B-4 | Identify and onboard second coder | Primary coder |
| B-5 | Second-coder calibration session (Training Set A + Training Set B Papers 2, 6, 9) | Both coders |
| B-6 | Resolve Jepson (2015) scope gate | Primary coder |

### IRR thresholds

| Variable | Statistic | Threshold |
|---|---|---|
| ER | Weighted Cohen's κ (quadratic) | ≥ 0.75 |
| KF | Krippendorff's α | ≥ 0.70 |
| NC | Krippendorff's α | ≥ 0.75 |
