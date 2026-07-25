# Architecture Decision Record — Visual Layer Recovery (§9 no-image clause reconciliation)

**Date:** 2026-07-25
**Status:** RATIFIED (2026-07-25) — maintainer-directed. Sections 1–7 are the ratified record; §8 records the ratification. Amendments, if any, are appended and dated per the project's amendment convention (`cinematic-vocabulary.md` §13); the ruling is not overwritten.
**Role:** Chief Architect ruling, recording a maintainer-directed doctrine *reconciliation*. Per `PROJECT_OPERATING_MANUAL.md` §5 (doctrine is not changed ad hoc — "no new … without a ruling") and §6 step 5 (a ruling that opens or closes an architectural question is a decision record under `.agents/decisions/`), reconciling a standing contradiction between two doctrine strata requires this record. **This record introduces no new principle; it reconciles two that already exist and records which one governs.**

---

## 1. The contradiction this closes

Two strata of the project's writing disagree about whether ecological scenes may use image assets.

**The archival clause.** `cinematic-language/cinematic-principles.md` §9 (*Sensory Ethics*) states:

> No image assets for ecological scenes. Procedural, painted, or composed. Photography turns ecology into postcard.

**The canonical Constitution.** The auto-loaded doctrine layer (`.kiro/steering/`, `PROJECT_OPERATING_MANUAL.md` §1) permits photographs and governs how they are composed:

- **Article IX — The subject claims the frame** (`cinematic-vocabulary.md`): "Photographs are subjects, not textures. If a photograph appears, the text either holds beside it, holds beneath it on a dedicated band, or does not appear at the same moment." Its own citation example (§13) reads: "Approved against Article IX — the photograph claims the frame and the caption holds beneath it."
- **Article VI — Darkness is content** supplies "the held darkness around photographs" — the exact phrase, cross-referenced from **Article XVII** (line 224): "This Article is the cinematic-grammar reason for the first hold of any safari scene … and for the held darkness around photographs (Article VI)."
- `editorial-voice.md` (photograph caption/credit rules), `pacing-principles.md` (safari photographs have a reserved beat in the cadence), and `experiential-references.md` §2.6 (*Photography*; the Wildlife Photographer of the Year reference for photograph layout) all presuppose photographs as first-class content.

**The contradiction is not new.** The 2026-05-26 doctrine consolidation (`private-book/chapters/doctrine-consolidation.md`, recording PR #61) already named it: §9's *no image assets* rule was "in active contradiction with … Article IX's allowance for photographs," and "the non-amendments stayed in the archival body." That consolidation made the whole of `cinematic-principles.md` archival — "no longer load-bearing … must not be cited in PR review" — but left the losing clause standing in the preserved body. This record closes the question the consolidation named but did not adjudicate at the point of contradiction.

## 2. Decision

§9's no-image / "photography turns ecology into postcard" clause is **SUPERSEDED** by Article IX (photographs are permitted subjects) and Article VI (photographs are composed in held darkness). The canonical Constitution governs; the archival clause carries no authority. The clause is marked superseded **in place** — strikethrough plus a pointer to this record — with its text preserved. No history is deleted (`PROJECT_OPERATING_MANUAL.md` §6 step 3: *archive* = "retire without deleting the historical record").

## 3. Why a dead clause still did harm (the rationale)

Archival is not inert. The asset slots — `public/art/STYLE-GUIDE.md`, `public/art/3d/README.md`, and the renderer `src/prototypes/species-art.js` — were introduced on 2026-06-22 (commit `c222ce7`). Each ships a procedural **fallback** that renders when no plate/model is present, and each carries a provenance table that reads "*(none yet — procedural illustrations in use)*."

An empty slot whose provenance says "none yet" is indistinguishable from an editorial decision to *withhold* images. The design was never installed; only the fallback ever shipped. And §9's surviving no-image clause — even inside an archival file — supplied false doctrinal cover for reading the procedural fallback *as the intended design* rather than as a placeholder awaiting its plate. The visible symptom is that the cinematic place is still drawn as the procedural horizon (the sine-wave hills and the field of black vertical lines) with no authored plate behind it, and nothing in the writing flagged that as a gap rather than a decision.

> Correction of record: the sprint brief characterised this as "four months of empty asset slots." Repository history does not support that figure — the slots were introduced 2026-06-22 (~one month before this record), and the §9/Article IX contradiction was named on 2026-05-26 (~two months before). The *mechanism* (empty slots with "none yet" provenance read as compliance) is real and is the operative rationale; the duration is corrected here rather than transcribed, per `PROJECT_OPERATING_MANUAL.md` §6 step 1 ("a citation … is a falsifiable claim").

## 4. The contradiction is one-sided (why this changes no binding rule)

The no-image / "postcard" rule survives only in **non-binding** strata:

- `cinematic-language/cinematic-principles.md` §9 — archival; explicitly non-load-bearing since 2026-05-26.
- `private-book/chapters/doctrine-consolidation.md` — a book chapter that *itself records the clause as superseded*.
- `prototypes/reviews/sundarbans-descent-review-v{1,2}.md` and `.agents/tasks/task-doctrine-validation/evaluation-framework.md` — reviews and task observations, which are **never doctrine** (the consolidation's own non-duplication rule; `PROJECT_OPERATING_MANUAL.md` §1).

No auto-loaded Constitution file forbids image assets (verified by full-tree grep across `.kiro/steering/`). Therefore this reconciliation strikes no live rule; it removes a dead clause's false cover and records, at the point of contradiction, which side already governs.

## 5. Scope of Sprint V1.2 (what is unfrozen)

The **visual layer** is unfrozen for this sprint, and only the visual layer. The sprint installs real plate/model assets into the existing asset slots and authors a scene/place plate slot one level up — the *place itself* held as a plate in darkness, replacing the procedural horizon. Assets authored now are authored **spatially-forward**: as declared-depth layers a future (2040) spatial / AR / VR renderer can consume without re-authoring. Nothing speculative is built now; the forward-compatibility lives in how the still layer is *declared*, not in any renderer shipped this sprint.

## 6. Preserved unchanged — cinematic purity is not relaxed

This record unfreezes image assets. It relaxes nothing else. The following remain in full force and are **not** touched by this sprint:

- **Tiger-as-absence.** The tiger is present by its absence; a plate does not make it a portrait subject.
- **No chrome, no affordance on cinematic surfaces** (D3; grammar gate D10). A plate is not a caption, a card, a label, or a control.
- **Evidence before spectacle.** A plate never precedes or substitutes for the evidence layer.
- **Plates are held IN darkness (Article VI), never captioned, never given UI — on the cinematic surface.** Photograph caption/credit obligations (`editorial-voice.md`, `experiential-references.md` §2.6) continue to apply on the **research** surface; the darkness-and-no-caption treatment is the cinematic-surface rule, consistent with the two-surface asymmetry (`PROJECT_OPERATING_MANUAL.md` §2).
- **Frozen, untouched:** the Editorial Corpus; the Descent Approval Specification (C1–C5 + R); the evidence / citation layer; the grammar gates; and the eight-session gate on D4–D6.

## 7. In-place marking performed under this record

`cinematic-language/cinematic-principles.md` §9: the no-image bullet is struck through (`~~…~~`), its original text preserved, and a dated, bracketed pointer to this ADR appended. The file's archival header and all other sections are unchanged. This is the only edit to that file under this record.

## 8. Ratification

**Ratified by:** Chief Architect
**Date:** 2026-07-25
**Decision:** §9's no-image clause of `cinematic-principles.md` is superseded by Article IX + Article VI and is marked superseded in place, history preserved. The visual layer is unfrozen for Sprint V1.2 to the scope in §5; everything in §6 stays frozen. No new principle is created. `.kiro/steering/` doctrine is unchanged — the reconciliation records which existing Article governs, and needed no amendment to any Article.
