# Eco-Cinema Observatory — Project Status

**Updated:** 2026-06-27
**HEAD:** `9ee0437` on `feat/exploration-prototypes-and-data-pipelines`
**Build:** green (12 narratives, 20 production pages)

---

## Current repository state

**Cinematic surface**
- `index.html` — homepage; surfaces both cinematic places
- `places/sundarbans.html` — Bengal tiger natal descent (narrative: `verified`)
- `places/crossing.html` — Hawksbill natal homing, Canvas 2D scroll-driven (narrative: `verified`)

**Atlas surface**
- `atlas/index.html` — Living Atlas globe; 12 narrative chips + Interaction records panel
- `atlas/sundarbans.html` — Sundarbans interaction web (DwC-A: 9 actors, 10 interactions)
- `atlas/amazon-varzea.html` — Amazon várzea interaction web (DwC-A: 8 actors, 8 interactions)
- `atlas/crossing.html` — Hawksbill research companion (narrative + species data)

**Research surface**
- `notes/` — 12 narrative pages; Sundarbans and Coral Triangle carry cross-surface nav links

Navigation graph complete: every surface links to every related surface.

---

## Completed milestones

| ID | Description | Commit |
|----|---|---|
| M1 | Canonicalize `places/crossing.html` | `2e3834d` |
| M2 | Surface the Crossing on the homepage | `e389ea7` |
| M3 | Elevate hawksbill narrative to `verified` | `860f5e8` |
| M4 | Promote Sundarbans field record to `atlas/sundarbans.html` | `ebe1805` |
| M5a | Wire field-record and crossing links from atlas species cards | `410d3c0` |
| M5b | Canonical Amazon várzea field record | `55f1092` |
| M5c | Back-navigation on field-record pages | `f81312e` |
| M5d | Field-record discovery panel in atlas index | `10560a4` |
| M6 | Hawksbill research companion (`atlas/crossing.html`) | `91fd779` |
| M7 | Cross-surface navigation from notes pages | `21985a8` |

---

## Active blockers

- **Coral Triangle DwC-A absent** — `public/dwca/coral-triangle/` does not exist. Blocks `atlas/coral-triangle.html` and completion of the Crossing two-surface experience. Requires ecological data assembly (species occurrences, interactions); no code blocker.

---

## Prioritized backlog

1. **Coral Triangle DwC-A** — assemble `public/dwca/coral-triangle/` occurrence and relationship data, then promote to `atlas/coral-triangle.html`. Highest value: closes the last gap in the Crossing experience.
2. **In-review narrative elevations** — Atacama tamarugo, Delaware Bay horseshoe crab, Santa Barbara giant kelp, Sendai crow. Track A source verification only; no code changes.
3. **Third cinematic place** — candidate species/place not yet selected. Homepage nav may need `places/index.html` when a third place ships.

---

## Paper 1 — frozen

Do not initiate Paper 1 work unless it blocks the doctoral submission timeline. Blocking tasks (B-1 through B-6) and IRR thresholds documented in `.agents/sessions/2026-06-27-technical-lead-session.md`.
