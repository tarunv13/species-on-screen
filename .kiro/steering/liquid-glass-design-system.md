# Liquid Glass — design system (research surface; additive, reversible)

**Status:** active, additive, reversible
**Authority:** scoped to the research/atlas surface. Does **not** amend
`platform-architecture.md` or the canonical doctrine governing the
cinematic surface. Companion to
[`atlas-living-glass.md`](./atlas-living-glass.md).

## What this is

The **Liquid Glass** material is the tokenized glass design language of
the research surface, implemented in `src/atlas/liquid-glass.css`
(material) and `src/atlas/liquid-glass.js` (pointer-lensing controller).
It elevates the Atlas's earlier flat `.glass` primitive into a
refined, restraint-disciplined glass with a specular rim, depth, and a
single travelling key light.

## Why it lives here and not on the cinematic surface

This boundary is load-bearing. `platform-architecture.md` §4 lets the
research surface "look like a journal, an atlas, or a magazine"; glass
is a research-surface styling choice. On the **cinematic** surface glass
is a documented anti-pattern — `private-book/chapters/asymmetry.md`
records that floating-card glassmorphism was one of eleven surfaces
*removed* from the homepage in the 2026-05-24 audit (the "dashboard
register"; continuity-dossier; Canons XII–XIV). Nothing in this system
is imported by any cinematic page. The boundary is enforced by file
isolation: Liquid Glass is reachable only from `src/atlas/`.

## The material (in layers)

A single `.glass` element composes four layers, built on pseudo-elements
so no markup change is required:

1. **Body frost** — `backdrop-filter` blur/saturate/brightness, a
   tint gradient, and a dark **contrast scrim** so light ink stays
   legible over the drifting mesh.
2. **Specular rim** (`::before`) — a gradient hairline lit from one key
   light angle (the lensed edge), via the mask-composite border trick.
3. **Travelling key light** (`::after`) — a soft highlight at
   `(--lg-px, --lg-py)`; it drifts slowly (ambient) and biases toward
   the pointer. Sits below content (`z-index: -1` inside an isolated
   stacking context) so text reads cleanly.
4. **Depth** — outer elevation shadow + inner base shadow (a slab, not
   a sticker).

## Tokens

Authored as CSS custom properties on `.glass` (see `liquid-glass.css`
for the full set and defaults):

`--lg-blur`, `--lg-saturate`, `--lg-brightness`, `--lg-tint` (defaults to
`--glass-rgb` from `season.js`, so the material re-tints per habitat
season), `--lg-tint-top/-bottom`, `--lg-scrim` (contrast wash),
`--lg-rim`, `--lg-sweep`, `--lg-elev-*` (depth), `--lg-key-angle`,
`--lg-px/--lg-py` (key-light position), `--lg-rx/--lg-ry` (pointer tilt).

## Elevation tiers

A material hierarchy, applied as modifier classes:

| Tier | Used for | Character |
|---|---|---|
| `.glass--chip` | habitat entry chips | lightest blur, shallow shadow |
| `.glass--bar` | masthead badge, back button, clusters | mid |
| `.glass--card` | the species card | deepest blur, brightest rim, dark contrast scrim, pointer tilt |

## Motion

- **Ambient key light** — a slow sine drift of `--lg-px/--lg-py`, written
  on `#atlas` and inherited by every panel (controller, throttled to
  ~12 fps; the drift period is tens of seconds).
- **Pointer lensing** — while a panel is hovered its key light eases to
  the pointer; `.glass--card` leans a capped **≤ 3°** toward the cursor.
- **Frost-forms reveal** — when the species card opens, `--lg-blur` and
  `--lg-scrim` transition up from near-zero (registered `@property`), so
  the glass condenses into being.
- Hover scale stays **≤ 1.04**. Easing is decelerating. No bounce.

## Accessibility and performance (first-class)

- `prefers-reduced-transparency: reduce` → glass becomes a near-solid
  **dark** slab (so the light ink stays legible) with no key light.
- `@supports not (backdrop-filter)` → opaque dark fallback.
- `prefers-reduced-motion: reduce` → no travelling light, no tilt, no
  transitions; the controller is a no-op (also on coarse / no-hover
  pointers).
- The `.glass--card` scrim guarantees text contrast even as the mesh
  drifts bright. Animations are transform/opacity and the throttled
  custom-property writes; blurs are bounded.

## Reversibility

1. delete `src/atlas/liquid-glass.css` and `src/atlas/liquid-glass.js`
2. revert the `.glass` block in `src/atlas/atlas.css` to its flat v1
   form; remove the `glass--*` tier classes from `src/atlas/atlas.js`
   and `atlas/index.html`
3. delete this steering file

No `vite.config.js` change and no cinematic-surface change to undo. The
seasonal palette engine (`src/atlas/season.js`) is unchanged by this
system.
