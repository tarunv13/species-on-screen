# Session diary — M16: East Pacific Rise cinematic surface

**Date:** 2026-06-27  
**Milestone:** M16  
**Role:** Technical Lead (autonomous execution)  
**Branch:** `feat/exploration-prototypes-and-data-pipelines`  
**Commit:** `2eaf8e6`

---

## What was implemented

Third cinematic place live: `places/epr-vents.html`.

Wired to the verified narrative `east-pacific-rise-tubeworm-chemosynthesis`. Extracts exactly 3 fields per platform-architecture §5: `place.name` → title, `place.editorialPlaceLine` → meta description, `editorial.fragment` → inscription beat.

### Files created

**`places/epr-vents.html`**  
HTML shell. Canvas id `epr-vents`, captions div, begin div ("descend" — EPR-specific, contrasting The Crossing's "begin"), scroll-track div. Inline `background:#02030a` for first-paint darkness. Module script at `/src/places/epr-vents.js`.

**`src/places/epr-vents.css`**  
Frame styles cloned from `crossing.css` with two changes: `--ink-abyss: #02030a` (two integer points below The Crossing's `--ink-deep: #05070d`, reflecting structural light absence at 2,500m rather than deep ocean darkness) and `#epr-vents` as the canvas selector. All other rules identical: fixed full-bleed canvas, 720vh scroll-track, captions at bottom 18vh, begin at bottom 7vh.

**`src/places/epr-vents.js`**  
Canvas 2D scroll-driven renderer. Key design decisions:

*Rendering layers (Article XVII atmospheric hierarchy):*
1. `paintBase(p, ventA)` — depth gradient from dim surface-blue (`midWater: [12,30,55]`) to absolute abyss (`[2,3,8]`); bottom-of-frame warms with `ventGlow` tint as `ventA` increases
2. `paintThermalGlow(cam, ventA)` — orange radial gradients at each vent position, `globalCompositeOperation: 'lighter'`; light arrives before mass (Article XVII)
3. `paintMotes()` — marine snow falling downward; `vy` positive (in contrast to The Crossing's upward bioluminescent drift; `vy` negative); cold blue-white (`snow: [170,195,215]`)
4. `paintPlumes(cam, ventA, time)` — white smoker columns; quadratic bezier wedge with `amb`-driven lateral wobble; gradient from mineral white to transparent
5. `paintWorms(cam, wormA)` — tubeworm clusters seeded at load time; dark tube bodies with soft arterial-red radial glow at tips (`wormPlume: [165,40,35]`); inhabitants arrive last (Article XVII); `wormA` gate is later than `ventA` gate
6. `paintVentParticles(cam, ventA)` — upward vent-fluid particles using `amb`-driven phase progression
7. `paintLuminanceDip(p)` — Article III sanctioned cut; Gaussian centred at p=0.48 (just before the "warmth" beat at p=0.52); amplitude 0.82

*Camera:*  
Vertical descent only (no route/catmull-rom). `zoom` lerps from 0.60 to 2.20 across `smoothstep(0.20, 0.92, p)`; `cy` moves from `FIELD_H * 0.30` to `FIELD_H * 0.92`. Camera centre maps to screen centre (`ax: W/2, ay: H*0.50`). At p=1, all four vent sites are on-screen.

*Editorial beats (7):*
```
p=0.00  "No light reaches the bottom of this."   [framing]
p=0.17  "the water deepens without changing colour"
p=0.34  "one kilometre, then two, then silence"
p=0.52  "a warmth with no source above it"
p=0.68  "the rock is opening"
p=0.84  "red in the water where the plumes are"
p=0.955  FRAGMENT — "the meal arrives dissolved in the water"  [inscription]
```

`beatOpacity()` function is identical to `crossing.js` — the Observatory's standard beat timing grammar.

### Files modified

**`src/notes/render-narrative.js`**  
Added to `SURFACE_LINKS`:
```javascript
'east-pacific-rise-vents': [
  { href: '../places/epr-vents.html', label: 'Enter the vent field →' },
],
```
Keyed by `n.place.id` which is `'east-pacific-rise-vents'` in the narrative. The research page at `notes/east-pacific-rise-tubeworm-chemosynthesis.html` now renders a cross-surface nav link.

---

## Validation

```
npm run check-narratives  →  ok (13 narratives, all invariants pass)
npm run build             →  ✓ built in 371ms
dist/places/epr-vents.html                     2.51 kB
dist/assets/places-epr-vents-CtVxeFwB.js       6.57 kB
dist/assets/places-epr-vents-DiISAfS0.css      1.61 kB
```

Existing chunk-size warning is pre-existing (three.js); no new warnings introduced.

---

## What was not implemented

- **Homepage nav** (`index.html`) — deferred per M15 decision record; implement after EPR atlas complete
- **EPR atlas field record** (`atlas/epr-vents.html`) — requires DwC-A design session first
- **EPR DwC-A** — requires Research Curator session (international-waters jurisdiction, deepwater observational access)

---

## Observatory state after M16

Three cinematic places live:
1. `places/sundarbans.html` — Sundarbans tiger territory (three-surface complete)
2. `places/crossing.html` — Coral Triangle hawksbill natal homing (three-surface complete)
3. `places/epr-vents.html` — East Pacific Rise vent field (cinematic only; atlas + DwC-A pending)

Three biome registers: coastal mangrove margin, open tropical ocean, abyssal hydrothermal vent. The Observatory's cinematic palette now includes darkness not as atmosphere but as medium — no other page in the project can render absolute black as ecological fact.
