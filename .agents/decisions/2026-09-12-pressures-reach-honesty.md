# The pressures block keeps its reach chips — citation-or-skip governs claims, not rows

**Date:** 2026-09-12
**Status:** Ratified — the principal's ruling, correcting a brief the principal had issued
**Scope:** How the species dossiers' `threats[]` and `conservation{}` render on the atlas field record; what citation-or-skip governs and what it does not; the attribution gap the block now makes visible.
**Occasion:** A brief was issued to surface the dossier pressures under a strict reading of citation-or-skip — *anything unattributed renders NOTHING, no placeholder*. Verification found the section already built, already deployed, and rendering unattributed rows with a `REACH INCOMPLETE` chip instead. The principal has ruled that the deployed behaviour is correct and the brief was wrong.

## Decision

**The deployed pressures block stands unchanged.** The strict empty-section
reading is **withdrawn, not deferred**. No code changed under this record.

**Citation-or-skip governs CLAIMS, not rows.** The distinction is the whole
ruling:

- A **claim** that cannot name its warrant is not made. An identifier is not
  guessed, a DOI is not forced, an appendix listing is not written from memory,
  an ecosystem is not bound by string similarity.
- A **row** that states plainly *"no source recorded for this figure"* has made
  no claim about the world. It has made a claim about the record, and that
  claim is true and checkable.

The `REACH INCOMPLETE` chip **is** the citation-honesty mechanism on this
surface. It is not a placeholder standing in for missing content; it is the
finding.

## Why the strict reading was worse

**A silently empty section is less honest than a labelled one.** Under strict
skip, eight of nine fields vanish and the visitor cannot distinguish three very
different situations: the dossier is thin, the renderer is broken, or the place
genuinely has nothing recorded. Absence renders as absence. The reach chip
renders the *reason* for the absence, which is the thing a research surface
exists to carry.

**The pattern is already the repository's own.** The three reach states come
from the evidence ledger verbatim (`scripts/evidence-reach.mjs`, M33/M34) —
`REACHES EVIDENCE` / `REACHES A SOURCE` / `REACH INCOMPLETE`. Inventing a
second, softer vocabulary for the same idea is how a surface starts
over-claiming; inventing a *stricter* one for the same idea fragments a grammar
that was deliberately unified.

**The place-honesty note does work the strict reading would have discarded.**
The block states that these pressures are *range-wide for the species — not
observations made here*. The tiger dossier names palm-oil plantations, which are
not a Sundarbans pressure. Rendering them without saying so would misstate the
place, which is the error the coral scene plate was vetoed for. Under strict
skip the threats disappear and the note disappears with them, and the
misstatement is avoided by silence rather than by disclosure.

**A threat is still not a score.** Nothing in this ruling loosens that. The chip
is one weight, one ink colour, a hairline border, no fill — identical for every
state. No icon, no severity bar, no meter, no urgency colour, no countdown. The
`--fr-space-section` separation, the plain-row voice and the absence of cards
are all unchanged.

## What was verified, and how

The section was **not** rebuilt. It was found at `793d551`
(*"feat(atlas): surface the dossiers' threats and conservation status, with
honest reach"*), confirmed wired (`src/atlas/field-record.js:111` populates
`PRESSURES`, `:940` renders it), and confirmed **live to visitors** — the
deployed bundle `assets/field-record-a1mOarHe.js` on `/atlas/sundarbans.html`
carries both `Pressures and conservation status` and `REACH INCOMPLETE`.
`check-grammar` and `check-cinematic-grammar` both PASS; the code touches only
`src/atlas/`, so no cinematic surface is involved.

## The attribution gap, recorded

**1 of 9 dossier fields has usable attribution.** This is a real gap, and the
block's value is that it is now visible instead of hidden.

```
field                              attribution in dossier            deployed        strict
conservation.iucn_status           data_sources[type=assessment]      render          render
   assessment year                 absent from every dossier          render + note   DROP
conservation.population_estimate   none                               render + note   DROP
conservation.population_trend      none                               render + note   DROP
conservation.key_programs          none                               render + note   DROP
threats[] Habitat Loss             none — {name, description} only    render          DROP
threats[] Poaching                 none — {name, description} only    render          DROP
threats[] Human-Wildlife Conflict  none — {name, description} only    render          DROP
threats[] Prey Depletion           none — {name, description} only    render          DROP
threats[] Climate Change           none — {name, description} only    render          DROP
```

The single attributed field is `conservation.iucn_status`, and its binding is
the dossier's **own** typing — a document-level `data_sources` entry of
`type: "assessment"` pointing at that taxon's Red List page. No mapping is
invented to produce it.

The shape is uniform across all ten dossiers: `threats[]` entries carry exactly
`{name, description}`; `conservation{}` carries exactly `{iucn_status,
key_programs, population_estimate, population_trend}`. No per-claim source and
no assessment year exists anywhere in `public/data/`.

Curator follow-up: backlog item 15.

## Rebuild-artifact caution — read this before concluding work is unbuilt

The brief read this section as unbuilt because **the public repository was
rebuilt from scratch on 2026-09-11** (the original was renamed to
`species-on-screen-legacy`, private; a new repository took the name and received
a purged history). Every commit has a new SHA.

`PROJECT_STATUS.md` still cites this work as `d6b7cbb`. That SHA:

- **resolves on the build machine** — the pre-rebuild objects linger in the
  local object store, unreferenced, so `git cat-file -e d6b7cbb` succeeds and
  looks like confirmation;
- **is reachable from no ref** — `git merge-base --is-ancestor d6b7cbb <every
  ref>` matches nothing;
- **does not resolve in a fresh clone at all.**

Its post-rebuild identity is `793d551`.

**How to apply.** A short SHA in the prose of `PROJECT_STATUS.md`, a session
diary or an ADR written before 2026-09-11 is not evidence that work exists, and
a local `cat-file` is not a check. Confirm by *behaviour* — grep the source,
find the call site, look at the deployed bundle — before concluding that
something needs building. Pre-rebuild SHAs in existing records are deliberately
**not** being rewritten: they are the historical record, and
`species-on-screen-legacy` plus the archive mirrors resolve them.

## What this record does not change

The citation bar's strictness · the IUCN GET crosswalk or its 21 `null`
placeholders · Wood Buffalo's single element · C1–C5 · the Article III dip ·
both grammar gates · tiger-as-absence · all existing copy · D4–D6 · the
eight-session gate. No deploy accompanies this record.
