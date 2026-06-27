# Technical Lead Session — 2026-06-27

**Milestones completed:** M4, M5a, M5b, M5c, M5d, M6, M7
**Commits:** `ebe1805`, `410d3c0`, `55f1092`, `f81312e`, `10560a4`, `91fd779`, `21985a8`
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Session log

### M4 — Atlas field record for Sundarbans (`ebe1805`)
- Promoted `src/prototypes/field-record.*` to canonical `src/atlas/field-record.*` (js + css)
- Created `atlas/sundarbans.html` — first canonical research-surface field-record page
- Only changes from prototype: two import paths (`../prototypes/species-art.js`, `../prototypes/biome-backdrop.js`)
- DwC-A at `public/dwca/sundarbans/` already present; page boots and renders immediately

### M5a — Atlas navigation connections (`410d3c0`)
- `src/atlas/atlas.js`: species card actions now include "Field note", "Interaction web" (Sundarbans), "Enter the living place" (Sundarbans), "Research companion" (Coral Triangle), "Enter the crossing" (Coral Triangle)
- Corrected Crossing narrative status from `draft` to `verified` in the registry
- **Lesson:** Git commit messages must not contain `->` arrows in PowerShell heredocs — they parse as file paths. Rewrote with Unicode `→` or plain text

### M5b — Amazon várzea canonical field record (`55f1092`)
- Created `atlas/amazon-varzea.html` — promotes existing DwC-A (8 actors, 8 interactions)
- Added URL-pathname PLACE derivation to `field-record.js` so canonical pages don't need `?place=` param
- Guard: `_pPlace !== 'field-record'` prevents the prototype page from resolving to a wrong place

### M5c — Field-record back-navigation (`f81312e`)
- `field-record.js`: injects `.fr-nav` bar at top of `#fr` in `init()`
- `field-record.css`: `.fr-nav` styles added
- Links: "← Living Atlas" always present; "Enter the living place →" for Sundarbans only
- Coral Triangle field record does not exist yet — nav will be added when `atlas/coral-triangle.html` ships

### M5d — Field-record discovery panel in atlas index (`10560a4`)
- `atlas/index.html`: added `#field-records-panel` div (hidden by default)
- `atlas.js`: fetches `public/dwca/index.json`, renders `.field-record-chip` links per place
- `atlas.css`: panel styles + mobile override
- Panel appears bottom-right, independent of narrative registry — surfaces Amazon várzea which has no narrative chip

### M6 — Hawksbill research companion (`91fd779`)
- Created `atlas/crossing.html` and `src/atlas/crossing.js`
- Reads narrative registry + `public/data/hawksbill-turtle.json`
- Renders: observation card, key habitats, pressures (warn class), peer-reviewed sources, CTA links
- **Design decision:** Original M5/M6 plan called for a "Migration Atlas" with GBIF occurrence data. That data doesn't exist in `public/`. Built `atlas/crossing.html` instead — sourced from existing data, no fabricated route data. Full Migration Atlas blocked on `public/dwca/coral-triangle/` (future backlog item)

### M7 — Cross-surface navigation from notes pages (`21985a8`)
- `render-narrative.js`: added `SURFACE_LINKS` map and `renderSurfaceLinks()` — outputs `.surface-links` nav after footer
- `research-article.css`: added `.narrative .surface-links` styles
- Uses relative paths (`../atlas/`, `../places/`) — no BASE_URL dependency
- Only Sundarbans and Coral Triangle notes pages receive links (others have no atlas/place companions yet)

---

## Navigation graph — final state

```
index.html  <-->  places/sundarbans.html
                  places/crossing.html
                    |
atlas/index.html  <-->  atlas/sundarbans.html
                         atlas/amazon-varzea.html
                         atlas/crossing.html
                           |
notes/<id>.html  (Sundarbans, Coral Triangle get surface-links nav)
```

All surfaces reachable from all other surfaces they relate to.

---

## Backlog items recorded (not started)

1. **Coral Triangle DwC-A** — `public/dwca/coral-triangle/` + `atlas/coral-triangle.html`. Blocked on data assembly (species occurrences, interactions). No code blocker.
2. **Third cinematic place** — No candidate yet. Homepage nav evolution may require `places/index.html` when third place ships.
3. **In-review narrative elevations** — Atacama tamarugo, Delaware Bay horseshoe crab, Santa Barbara giant kelp, Sendai crow. Source verification only, no code changes.
