# Session diary — M39: subject URL-addressability across surfaces (D1)

**Date:** 2026-07-04
**Milestone:** M39 (Observatory v2, roadmap milestone — Architecture Decision D1)
**Role:** Principal Engineer (autonomous milestone execution)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`

---

## Task

Implement **only M39**, satisfy every acceptance criterion, verify, regenerate outputs, run
repository verification, update the three docs, land one clean commit. Do not touch any other
milestone. M39 is the "high blast radius, spans sessions" milestone — landed here as a complete,
additive increment in one session.

## D1, precisely

D1: **subject = URL-addressable manifest id (`?subject=`)** — the held subject is identified by a
stable canonical id in the URL, resolving to the same subject on every surface via the manifest
resolvers (ADR-001), with no per-surface bespoke mapping. The subject id is the canonical `placeId`,
deliberately distinct from per-surface slugs (`east-pacific-rise` → `epr-vents`; `coral-triangle` →
`crossing`).

## Design

**One shared mechanism, no second identity scheme.** New dependency-free `src/subject.js`:
`subjectIdFromSearch` (read `?subject=`), `resolveSubject(places, id)` (place by `placeId`),
`heldSubject(places, search, fallbackId)` (resolved subject or graceful fallback), `withSubject(href,
id)` (carry the id across a **declarative** navigation, preserving existing query/fragment, no-op on a
falsy id). Pure and Node-testable (resolvers take `places` as an argument, mirroring `surface-links.js`).
The manifest gained a typed `resolveSubject(subjectId)` (= `getPlaceById`).

**Additive, target-preserving.** Every surface derives its own local slug from the one resolved
place and carries `?subject=` on its cross-surface links; link **targets** are unchanged. The subject
is layered on **at render** in the consumers, so the pure derivation modules (`surface-links.js`) and
their tests are untouched.

## Consumers wired

- `src/atlas/field-record.js` — resolves `?subject=` to establish `PLACE` (subject → field-record
  slug wins, else `?place=`/filename) and carries `?subject=` on all four nav links.
- `src/atlas/atlas.js` — carries it on the detail-card bridges + the discovery chips.
- `src/notes/render-narrative.js` — carries it on the cross-surface links.
- `scripts/build-evidence.mjs` — the evidence ledger's ascent links carry `?subject=<placeId>`.

## The key scope decision — cinematic left untouched

The M39 goal listed `src/main.js`, but I **did not touch any cinematic file**. The cinematic surface
is an affordance-sink (M37/M38): giving it a subject-carrying cross-depth affordance would violate D3
and trip the M38 grammar gate. And it isn't needed — the cinematic place page *is* the subject, and
other surfaces' links *into* it already carry `?subject=`. So `main.js` and `src/places/*` are
byte-identical. This keeps cinematic purity + the grammar gate intact while fully delivering
URL-addressability.

Depth discreteness (D2) is also preserved: every new link is a **declarative** `<a href>` /
element-`.href` assignment, never a programmatic `location`/`history` jump — so the M38 gate stays
green.

## Verification

- `npm run test:subject` — PASS (37 checks against the **real manifest**: one id resolves to one
  subject with every surface slug derivable; `?subject=` parsing; `withSubject` with existing
  query/fragment/no-double-add; unknown/absent graceful).
- `npm run verify` — 14 checks green, **including the M38 grammar gate** (cinematic purity + depth
  discreteness intact after the surface edits).
- `npm run build` — green. Built evidence ledgers carry `?subject=<placeId>` on every ascent link,
  with the correct per-surface slug (EPR → `epr-vents`; coral-triangle → `crossing`); amazon-várzea
  (no cinematic) carries subject on atlas + research only.
- Cinematic bundles confirmed **pure** (no `?subject=` cross-depth logic in any
  `dist/assets/places-*.js`); the atlas/research/field-record bundles carry the subject logic.

## Outcome

The held subject is now URL-addressable by its canonical manifest id: the same `?subject=<placeId>`
resolves to the same subject on every surface via one resolver, is carried across depth transitions,
and degrades gracefully — with cinematic purity and the grammar gate untouched.

**Stopping here per protocol** — one milestone. Next is M40 (D8, history-as-trace + interrogation in
URL — the last milestone).
