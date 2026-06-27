# Eco-Cinema Observatory — Project Status

**Last updated:** 2026-06-27
**Current git commit:** `2e3834d` — feat(cinematic): canonicalize Crossing as places/crossing.html
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**AI Operating System:** v1.0 — frozen. See `.agents/AI-OS.md`.

---

## Observatory — current state

Two canonical cinematic place pages exist and build cleanly:
- `places/sundarbans.html` — Bengal tiger, DOM/GSAP descent (narrative: `verified`)
- `places/crossing.html` — Hawksbill natal homing, Canvas 2D scroll-governed (narrative: `draft`)

The Crossing is unreachable from the homepage. That is the single open production gap.

---

## Production Roadmap

Ordered by dependency. Execute one milestone per session.

---

### M1 — Crossing canonicalization ✓ COMPLETE (2026-06-27)

Committed in `2e3834d`. `places/crossing.html` exists, builds, passes check-narratives.

---

### M2 — Homepage surfaces the Crossing ← NEXT

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

**Why it matters:** The narrative is at `draft` — invisible in the Archive (`notes/index.html`). The research surface for the Crossing is unreachable until the narrative is listed. Completes the cinematic-to-research surface connection.

**Blocking dependencies:** M1 (done). Requires editorial second pass on two sources:
- Lohmann, K.J., Putman, N.F. & Lohmann, C.M.F. (2008) PNAS 105(49) — verify citation accuracy
- Meylan, A.B. & Donnelly, M. (1999) Chelonian Conservation and Biology 3(2) — verify citation accuracy

**Estimated effort:** 30 minutes (source verification + status field change + one list item in notes/index.html).

**Definition of Done:**
- `metadata.status: 'verified'` in `coral-triangle-hawksbill-natal-homing.ts`
- Link added under "Verified" section of `notes/index.html`
- `npm run check-narratives` passes (the archive-index drift check will now require the link)

**Expected commit:** `feat(research): elevate hawksbill narrative to verified`

---

### M4 — Field record promoted to `atlas/sundarbans.html`

**Why it matters:** The field-record scrollytelling (`prototypes/field-record.html`) is the Observatory's most sophisticated research surface feature — interactive species interaction graph, real Darwin Core data, biome backdrop, cascade visualization. It is currently only dev-served and invisible in production. Promoting it to `atlas/sundarbans.html` completes the Sundarbans two-surface experience.

**Blocking dependencies:** M1 (done). No dependency on M2 or M3.

**Estimated effort:** 3–4 hours. The field-record JS already handles arbitrary places via `?place=<id>`. The canonical page needs to be added to the Vite build (currently `prototypes/` is excluded). The atlas surface already exists; this adds a place-specific atlas page.

**Files:** `atlas/sundarbans.html` (new) + move/adapt `src/prototypes/field-record.{js,css}` to `src/atlas/field-record.{js,css}`.

**Definition of Done:**
- `atlas/sundarbans.html` renders the Sundarbans field record from the production build
- `npm run build` includes it in `dist/atlas/sundarbans.html`
- Prototype files remain in `prototypes/` (additive, not destructive)

**Expected commit:** `feat(atlas): promote Sundarbans field record to canonical atlas page`

---

### M5 — Migration Atlas (Crossing research companion)

**Why it matters:** The Crossing cinematic page has no research surface counterpart beyond the raw narrative notes page. The Migration Atlas would be a glassmorphic atlas-surface page showing the hawksbill's natal homing route with real GBIF occurrence data and the Liquid Glass design system.

**Blocking dependencies:** M1 (done). M3 recommended first (narrative should be verified before the atlas page launches).

**Estimated effort:** 6–8 hours. New surface: `atlas/migration.html` + `src/atlas/migration.{js,css}`. Uses existing Liquid Glass tokens (`src/atlas/liquid-glass.{css,js}`).

**Expected commit:** `feat(atlas): Migration Atlas — hawksbill natal homing route`

---

## Next recommended session

**Execute M2** (homepage surfaces the Crossing). Approach A. No design exploration needed — two captions, one new click handler. Estimated 2–3 hours including doctrine review and commit.

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
