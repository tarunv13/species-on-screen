# Product Decisions

*Concise, stable register of approved and proposed experience/product decisions,
keyed by stable IDs. One entry per decision; entries are appended and their Status
updated in place, never renumbered. This register indexes product-level decisions —
when one also requires a full architectural ruling, that ruling remains an
Architecture Decision Record under `.agents/decisions/` and the entry references it
(reference, never copy). Tier established by
`.agents/decisions/2026-07-21-product-decisions-log.md`; listed in the governance map
at `PROJECT_OPERATING_MANUAL.md` §1.*

## D1 — Remove "Choice of One"
Status: Implemented (2026-07-23)
Scope: Launch
Rationale: The threshold should invite entry rather than present a false choice.
Implementation: threshold `.lenses` group aria-label "Choose a perspective" → "Enter through the place" (`places/sundarbans.html`).

## D2 — Continuous World
Status: Implemented (2026-07-23)
Scope: Launch
Rationale: The Observatory should remain perceptually alive throughout commitment.
Implementation: ambient breath continues while committed-but-not-yet-advancing, then blends out over the first movement; governor (WP8 Amendment 4) untouched (`src/places/sundarbans.js`).

## D3 — Truthful Scope
Status: Implemented (2026-07-23)
Scope: Launch
Rationale: Public descriptions must accurately reflect the current experience.
Implementation: meta/og/twitter description "one inhabited place" → "three inhabited places" (`index.html`).

## D4 — Wonder → Witness Crossing
Status: Proposed
Scope: Post-launch
Blocked by: Validation of Q1 and Q3
Gate: docs/VALIDATION_PROTOCOL.md — status may change only via a Q1–Q5 ratification ADR.

## D5 — One Unbroken Surrender
Status: Proposed
Scope: Post-launch
Blocked by: Validation of Q2 and Q5
Gate: docs/VALIDATION_PROTOCOL.md — status may change only via a Q1–Q5 ratification ADR.

## D6 — Lower Barriers to the Center
Status: Proposed
Scope: Post-launch
Blocked by: Validation of Q4
Gate: docs/VALIDATION_PROTOCOL.md — status may change only via a Q1–Q5 ratification ADR.

## Rulings

Ruling 2026-07-24: the one-fragment allowance attaches to inhabitation only; journeys carry no inscription.
