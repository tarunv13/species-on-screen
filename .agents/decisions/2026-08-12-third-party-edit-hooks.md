# Third-party edit hooks — off by default, scoped trial permitted

**Date:** 2026-08-12
**Status:** Ratified
**Scope:** Any third-party tool that registers an edit hook in this repository.
**Occasion:** `pbakaus/impeccable` installed during V1.4 tooling setup; it ships
`scripts/hook-before-edit.mjs`, `hook.mjs`, and `hook-admin.mjs`.

## Decision

Third-party edit hooks are **off by default**. The skill is kept as a
**read-and-advise** tool. A **scoped trial** is permitted: hooks may be enabled
on `atlas/` and `notes/` alone. They must **never** be enabled on
`src/places/` or `index.html`.

## Reasoning

The first version of this ruling argued that a hook "sits upstream of the
grammar gates, which is precisely the position from which a doctrine violation
could land while the gates report green." **That reasoning was wrong and is
retracted.** `check-grammar` and `check-cinematic-grammar` run at `prebuild`,
`verify`, and in CI — they read the files as they are on disk at that moment. A
hook that modifies an edit before it lands cannot make those gates report green
on a violation they cover. The gates would catch it.

The defensible objection is narrower, and it survives:

**The gates check vocabulary and grammar. They do not check copy, spacing, or
token values.** They enforce the four constraints — affordance placement (D3),
subject morph (D9), subject invariant (D1), depth discreteness (D2) — and
cinematic purity. They say nothing about whether a line of editorial copy was
rewritten, whether a measure was widened, or whether a spacing value drifted.

Those are exactly the surfaces a generic polish tool acts on. So the risk is not
that hooks defeat enforcement; it is that hooks act precisely where enforcement
does not look. On the cinematic surface that is the whole material: the copy,
the held timing, the composition. An unreviewed rewrite there is a doctrine
change that no gate would report.

That risk is real but reversible — every edit is in git. It does not justify a
permanent refusal. It justifies scoping.

## Why the boundary falls where it does

- `atlas/`, `notes/` — research register. Copy is expository, the design
  language is tokenized (`--fr-*`), and drift is visible and cheap to revert.
  A trial here is informative.
- `src/places/`, `index.html` — cinematic register. Governed by C1–C5, the
  Article III dip, the per-place light vocabulary, and the 2026-05-24 audit's
  eleven removals. Copy here is load-bearing and the timing contract is
  falsifiable. No automated rewrite is admissible.

## Consequences

- Hook registration stays disabled until a trial is explicitly opened.
- A trial must name its scope in the session diary before it begins.
- The vendored payload is gitignored; `skills-lock.json` is committed as the
  provenance receipt naming which version touched the repo.

## Supersedes

The retracted "nothing may sit upstream of the grammar gates" framing. Recorded
here rather than deleted, because the correction is the useful part: a
governance argument that overstates its mechanism is weaker than the narrower
one it displaces, and this repository prefers the accurate objection.
