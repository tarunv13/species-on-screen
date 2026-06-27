# Eco-Cinema Observatory — Project Status

**Last updated:** 2026-06-27
**Current git commit:** `21985a8` — feat(notes): cross-surface navigation links from research pages
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**AI Operating System:** v1.0 — frozen. See `.agents/AI-OS.md`.

---

## Observatory — current state

Two canonical cinematic place pages, fully navigable from the homepage:
- `places/sundarbans.html` — Bengal tiger, DOM/GSAP descent (narrative: `verified`)
- `places/crossing.html` — Hawksbill natal homing, Canvas 2D scroll-governed (narrative: `verified`)

Atlas surface: four canonical pages, all production-built and cross-linked:
- `atlas/index.html` — Living Atlas globe (12 narrative chips + Interaction records panel)
- `atlas/sundarbans.html` — Sundarbans interaction web (DwC-A, 9 actors, 10 interactions)
- `atlas/amazon-varzea.html` — Amazon várzea interaction web (DwC-A, 8 actors, 8 interactions)
- `atlas/crossing.html` — Hawksbill research companion (narrative + species data)

Research surface: 12 narrative notes pages. Sundarbans and Coral Triangle notes pages carry cross-surface navigation links to atlas/place companions.

Navigation graph is complete: every surface can reach every other surface it relates to.

---

## Production Roadmap

---

### M1 — Crossing canonicalization ✓ COMPLETE (2026-06-27)
Committed in `2e3834d`.

### M2 — Homepage surfaces the Crossing ✓ COMPLETE (2026-06-27)
Committed in `e389ea7`.

### M3 — Hawksbill narrative elevated to `verified` ✓ COMPLETE (2026-06-27)
Committed in `860f5e8`.

### M4 — Field record promoted to `atlas/sundarbans.html` ✓ COMPLETE (2026-06-27)
Committed in `ebe1805`.

### M5a — Atlas navigation connections ✓ COMPLETE (2026-06-27)
Committed in `410d3c0`. Atlas species cards now surface Field note, Interaction web, and cinematic place links where available. Crossing narrative status corrected to `verified`.

### M5b — Amazon várzea canonical field record ✓ COMPLETE (2026-06-27)
Committed in `55f1092`. `atlas/amazon-varzea.html` promotes the existing DwC-A (8 actors, 8 interactions) to production. PLACE now derived from URL filename in `field-record.js`.

### M5c — Field-record back-navigation ✓ COMPLETE (2026-06-27)
Committed in `f81312e`. `.fr-nav` bar on all atlas field-record pages links back to Living Atlas and forward to the cinematic place (Sundarbans only).

### M5d — Field-record discovery panel in atlas index ✓ COMPLETE (2026-06-27)
Committed in `10560a4`. Bottom-right glass panel in atlas/index.html lists all DwC-A places from `public/dwca/index.json` as direct links to `atlas/<id>.html`.

### M6 — Hawksbill research companion (`atlas/crossing.html`) ✓ COMPLETE (2026-06-27)
Committed in `91fd779`. Completes the Crossing two-surface experience. Reads from narrative registry + `public/data/hawksbill-turtle.json` (nesting habitats, pressures). All claims cited.

### M7 — Cross-surface navigation from notes pages ✓ COMPLETE (2026-06-27)
Committed in `21985a8`. `render-narrative.js` appends `.surface-links` nav for Sundarbans and Coral Triangle narratives, linking to atlas companions and cinematic places.

---

## Next recommended session

**Backlog (re-ranked):**

1. **Coral Triangle DwC-A** — Create `public/dwca/coral-triangle/` to enable a full interaction-web field record (`atlas/coral-triangle.html`). This is data/research work: requires sourcing species occurrences and interactions for the Coral Triangle reef system. Estimated effort: 4–6 hours (data assembly + field-record promotion). No development blocker — field-record.js already handles arbitrary places.

2. **Third cinematic place** — No candidate species/place selected yet. When selected, the homepage navigation pattern evolves: a third caption may require a `places/index.html` (as noted in M3 design record — Approach B). Estimated: 3–5 hours once species/place is confirmed.

3. **In-review narrative elevations** — Four narratives are `in_review` (Atacama tamarugo, Delaware Bay horseshoe crab, Santa Barbara giant kelp, Sendai crow). Each requires a Research Curator Track A source verification before elevation to `verified`. Sources are already listed in the narrative files; verification is confirming publication existence and independence.

**Highest priority:** Coral Triangle DwC-A unlocks the last gap in the Crossing two-surface experience (interaction-web field record). However, it requires ecological data assembly rather than development work. If data assembly is not the current priority, in-review narrative elevations are the next highest-value development task (pure research verification, no code changes).

---

## Paper 1 — frozen

Status unchanged. Blocked on B-1 through B-6 below. Do not initiate Paper 1 work unless it blocks the doctoral submission timeline.

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
