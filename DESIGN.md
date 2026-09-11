---
name: Eco-Cinema Observatory
description: Two-surface ecological observatory — a cinematic surface of held darkness and an analytical surface of tokenized glass.
colors:
  night: "#0a0a1a"
  night-deep: "#050510"
  ink-high: "rgba(255, 255, 255, 1)"
  ink-mid: "rgba(255, 255, 255, 0.78)"
  ink-low: "rgba(255, 255, 255, 0.50)"
  dawn-rim: "rgb(140, 128, 107)"
typography:
  display:
    fontFamily: "Iowan Old Style, Georgia, Times New Roman, serif"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Iowan Old Style, Georgia, Times New Roman, serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.6
  caption:
    fontFamily: "Iowan Old Style, Georgia, Times New Roman, serif"
    fontSize: "0.78rem"
    fontWeight: 300
    letterSpacing: "0.04em"
rounded:
  glass-sm: "14px"
  glass-md: "16px"
  glass-lg: "20px"
  glass-xl: "24px"
---

# Eco-Cinema Observatory — Design System

> **Extracted, not authored.** Every token here was read out of the running
> codebase (`src/style.css`, `src/atlas/liquid-glass.css`) and every rule cites
> the decision record that produced it. This file records an incumbent system;
> it does not propose a new one.

## Overview

The Observatory has **two surfaces with deliberately different design
languages**. This is the single most load-bearing fact in this document. A rule
that is correct on one surface is a documented anti-pattern on the other.

| | **Cinematic** | **Analytical / Research** |
|---|---|---|
| Where | `index.html`, `src/places/`, `src/main.js`, `src/globe.js` | `atlas/`, `notes/`, `src/atlas/`, `src/notes/` |
| Register | Held darkness, editorial type, one anchored line | Journal / atlas / magazine |
| Glass | **Forbidden** | Liquid Glass system |
| Accent colour | **None** | None |
| Governing doc | `cinematic-language/platform-architecture.md` | `.kiro/steering/liquid-glass-design-system.md` |

The boundary is enforced mechanically, not by convention: `check-grammar`
(`npm run check-grammar`, wired into `prebuild` and CI) fails the build on
violations of D1/D2/D3/D9, and Liquid Glass is reachable only from `src/atlas/`
by file isolation (`liquid-glass-design-system.md:27-28`).

## Colors

Declared in `src/style.css:15-27`.

| Token | Value | Use |
|---|---|---|
| `night` | `#0a0a1a` | Page background; held darkness |
| `night-deep` | `#050510` | Deeper recess; reserved |
| `ink-high` | `rgba(255,255,255,1)` | Heading, hover, emphasis |
| `ink-mid` | `rgba(255,255,255,0.78)` | Body, caption, default |
| `ink-low` | `rgba(255,255,255,0.50)` | Metadata; recedes |
| `dawn-rim` | `rgb(140,128,107)` | Atmosphere shader **only** |

**There is no brand-accent colour, and its absence is a decision, not a gap.**
`src/style.css:7-10` states it directly: no conservation green, no alert orange.
The editorial register is white text at three weights against held darkness.
`dawn-rim` is reserved for the planetary atmosphere shader and nothing else.

The token block carries its own tripwire (`src/style.css:12-13`): *"If a new rule
is tempted to introduce a saturated colour, that is the moment to consult the
audit before adding the variable."* Treat that as normative.

## Typography

One serif stack across both surfaces: `"Iowan Old Style", Georgia, "Times New
Roman", serif` at weight 300, line-height 1.6 (`src/style.css:29-34, 48-57`).

- Body `1rem`; anchored species captions `0.78rem` with `0.04em` tracking.
- Light weight (300) is the default, not an exception.
- Antialiasing is on (`-webkit-font-smoothing: antialiased`).

## Layout

The cinematic surface is a fixed full-viewport canvas (`#cinematic-canvas`,
`src/style.css:60-67`) with `body { overflow: hidden }`. Scroll is driven by
Lenis + GSAP, not native document flow. Layout changes here are motion changes.

## Elevation & Depth

**Analytical surface only.** Liquid Glass composes four layers on pseudo-elements
so no markup change is required (`liquid-glass-design-system.md:30-45`):
body frost (`backdrop-filter`), specular rim (`::before`), a single travelling
key light (`::after`), and depth (outer elevation + inner base shadow — "a slab,
not a sticker").

Sidecar tokens (outside the 8-prop component schema), from
`src/atlas/liquid-glass.css:45-63`:

| Token | Default | Note |
|---|---|---|
| `--lg-blur` | `18px` | Frost radius |
| `--lg-saturate` | `1.6` | |
| `--lg-brightness` | `1.06` | |
| `--lg-tint-top` / `-bottom` | `0.20` / `0.07` | Tint alpha, lit → unlit edge |
| `--lg-scrim` | `0` (→ `0.34` on text cards) | Contrast wash behind body text |
| `--lg-rim` | `0.6` | Specular rim brightness |
| `--lg-sweep` | `0.10` | Travelling key-light strength |
| `--lg-key-angle` | `135deg` | **One** key light, top-left → bottom-right |
| `--lg-elev-y/-blur/-alpha` | `16px` / `44px` / `0.30` | Elevation shadow |

**One key light.** The angle is a single canonical value. Multiple light sources
are the failure mode this system exists to prevent.

## Shapes

Glass radii scale with tier: `14px` (sm) → `16px` (md) → `20px` (base) → `24px`
(lg). Larger tiers also raise blur, rim, and elevation together — radius alone is
not the tier.

## Do's and Don'ts

### Don't — recorded failures, not hypotheticals

The 2026-05-24 homepage audit removed **eleven** surfaces from the cinematic
homepage across PRs #35–#37. `private-book/chapters/asymmetry.md:40-42` lists
them. Do not reintroduce:

- **Floating-card glassmorphism** on the cinematic surface.
- **A brand accent.** The pre-doctrine homepage carried "a brand-accent green
  inherited from Tailwind's `green-400`" (`asymmetry.md:40`). It was removed.
  A saturated accent has already been tried here and rejected on the record —
  changing the hue does not change the finding.
- Layer-toggle bars in the segmented-control register.
- A frosted species card with a status pill.
- Cursor-following tooltips, cursor pointer, hover flash, ring halos.
- A loading screen in the SaaS-onboarding register.
- Drag-to-rotate inertia; column-as-bar-chart.

The audit's framing, worth keeping in mind for every future change: *"the
homepage was a dashboard with a globe inside it; the cinematic register and the
dashboard register cannot share a frame."*

### Don't — structural

- Don't import `src/atlas/` styling from any cinematic page. File isolation is
  the enforcement mechanism.
- Don't add a second view-transition name. `eke-subject` is the only one
  permitted anywhere (D1, enforced by `check-grammar`).
- Don't add programmatic cross-depth navigation (D2) or depth affordances to the
  cinematic runtime (D3).
- Don't introduce pass/fail, error, or check/cross language on the evidential
  surface. M33/M34 replaced it with reach-states
  (`REACHES EVIDENCE` / `REACHES A SOURCE` / `REACH INCOMPLETE`); a `confidence`
  field was **permanently rejected** as the summary register M34 forbids.

### Do

- Add tokens to `src/style.css:15-39` rather than hard-coding values.
- Keep motion in service of state change. Existing easing is
  `--ease-editorial: cubic-bezier(0.25, 0.1, 0.25, 1)` at `--duration-fade: 0.6s`.
- Run `npm run verify` (17 checks) before proposing any surface change.
- When a change is tempting on the cinematic surface, check
  `.agents/tasks/task-homepage-audit/2026-05-24-homepage-review.md` first —
  there is a good chance it was already removed once.
