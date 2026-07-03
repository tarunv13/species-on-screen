# Session diary — M36: typed-edge follow in the atlas (D4)

**Date:** 2026-07-04
**Milestone:** M36 (Observatory v2, roadmap milestone — Architecture Decision D4)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M36**, preserve all frozen architecture, verify, update documentation, prepare one
commit, stop. M36 is independent of M35 (parallel-landable per the execution order), so it can land
before M35.

## D4, precisely

D4: **follow = an RO-typed lateral edge at the same depth** on the analytical (atlas) surface.

Starting point: the atlas field-record already rendered the interaction web, but as a **flat list**
of relationship sentences in the Sources panel (`A eats B — according to …`), showing only the
human term (`relationshipOfResource`), not the controlled IRI, and with **no follow affordance**.

## Implementation

**`src/atlas/interaction-web.js` (new, pure, dependency-free).** `interactionWebModel(actors, rels)`
returns one node per actor, each with its edges to neighbours: `{ relType, iri, typed, dir,
otherId, otherVern, according }`. `dir` is `out` (actor is the subject) or `in` (object). `iri` is
the controlled OBO RO IRI or `null` (`typed:false`) — **never faked**. `isRoIri` mirrors the
validator's `CONTROLLED_RELATION_IRI` exactly. No DOM, no imports, so it is unit-testable in Node
and shared by the browser renderer — the same "pure model + render in the caller" pattern as
`surface-links.js` and `evidence-reach.mjs`.

**`src/atlas/field-record.js`.** `buildInteractionWeb()` now renders that model: each actor is a
`<section id="fr-node-<occurrenceID>">`; each edge shows its relation **linked to its OBO RO IRI**
(`<a class="fr-rel" href="…/RO_…">`), a direction glyph, and a **follow** link
(`<a class="fr-follow" href="#fr-node-<otherId>">`) — an in-page fragment, so following is
**lateral at the same depth**, never a press-in or step-back. Untyped edges render as marked
`.is-untyped` spans, not fabricated links. A small delegated click handler adds a11y focus + a
highlight pulse on the followed node; the native anchor does the scroll + `:target`.

**`src/atlas/field-record.css`.** Styles for the follow web (`.fr-node` / `.fr-web` / `.fr-rel` /
`.fr-follow`), a `:target` background and a reduced-motion-safe `is-followed` pulse.

**`scripts/interaction-web.test.mjs` (new).** 19 black-box checks: controlled-IRI recognition;
one node per actor; incoming/outgoing direction; verbatim RO IRI on typed edges; untyped edges
marked not faked; **every follow-target is an actor in the same set** (laterality); missing
neighbour degrades to its id; empty input never throws. Wired into `verify` as
`test:interaction-web` (now 10 checks).

`src/atlas/atlas.js` (the discovery overview) was **not** touched — it renders no interaction
edges, so the typed follow web lives entirely in the field-record interaction web.

## Design decision — DOM follow, not canvas focus

The follow is implemented as same-depth DOM navigation between actor nodes (the grammatically
essential lateral act). It is deliberately **not** wired into the canvas focus system: the draw
loop overwrites `curFocus` every frame from scroll position, so a persistent follow-focus would
fight the scroll-driven narrative. Coupling was not required by D4, and keeping them separate keeps
the surface robust. The canvas retains its own hover face-card for exploration.

## Verification

- `npm run test:interaction-web` — PASS (19 checks).
- `npm run verify` — 10 checks green.
- `npm run build` — green.
- **Real-data render check across all four archives** (parse the live TSV → `interactionWebModel`):
  sundarbans / coral-triangle / epr-vents 20 edges each, amazon-várzea 16 — **every edge RO-typed,
  every IRI a valid OBO RO PURL, every follow-target a same-depth actor id.** (Edge count is 2× the
  relationship count: each relationship appears under both endpoints — correct for an adjacency
  web.)
- Built `dist/assets/field-record-*.js` carries `interactionWebModel` / `fr-follow` / `fr-node-` /
  `purl.obolibrary`; **absent from every `dist/assets/places-*.js`** (cinematic purity).

## Frozen architecture preserved

No manifest, schema, or validator change. L1 stays the build gate (`prebuild` unchanged). Cinematic
surfaces untouched. Standards reuse only (OBO RO PURLs; no new vocabulary). Only the analytical
surface's interaction web changed.

## Outcome

The atlas interaction web is now a navigable, RO-typed follow graph: you can follow a typed edge
from any actor to the actor it links, laterally, at the analytical depth — the D4 primitive, real
and verified.

**Stopping here per protocol** — one milestone. M35 (D5, in-place interrogate) still remains, then
M37.
