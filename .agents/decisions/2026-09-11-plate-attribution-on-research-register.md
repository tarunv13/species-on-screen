# Plate attribution lives on the research register, never on the cinematic frame

**Date:** 2026-09-11
**Status:** Ratified
**Scope:** Where the attribution required by CC-BY and CC-BY-SA is discharged for any image asset used by this project; and the permanent closure of two species plate searches.
**Occasion:** Backlog item 8, opened 2026-09-10 while deciding whether to commit a vetoed CC-BY-SA scene plate; brought to a head by the 2026-09-11 species plate sourcing pass, in which four of five viable candidates are CC-BY.

## The problem this settles

CC-BY and CC-BY-SA require **visible attribution**. D3 and the 2026-07-25
visual-layer-recovery ADR §6 forbid chrome on the cinematic surface: a plate
there is *"held in darkness, never captioned, never given UI"*. Those two
requirements meet head-on the moment a CC-BY image is used as a cinematic
plate, and until now the repository had no answer — only the observation that
it had none.

The question was live rather than theoretical. Of the five viable species-plate
candidates found on 2026-09-11, **four are CC-BY and one is CC0**; the vetoed
coral scene plate is CC-BY-SA, whose ShareAlike term reaches further still.

## Decision

**Attribution is discharged on the research register, and only there.** Two
places, both already visitor-reachable:

1. **`public/art/STYLE-GUIDE.md`** — the provenance table. Every asset carries
   source record, observer, date, locality, licence and modification. This is
   the canonical, complete record.
2. **The atlas field record's provenance/sources block** — where a plate is
   actually used for a place, its credit appears in the same source voice as
   every other citation on that surface.

**No credit, caption, label, watermark, corner mark, hover state, or overlay of
any kind appears on the cinematic surface.** The cinematic frame carries the
image and nothing else. This holds whether or not a given plate's licence
technically requires it — a rule with an exception is not a rule the grammar
gate can hold.

## Why this is permissible and not a dodge

CC-BY 4.0 §3(a)(2) allows attribution to be satisfied *"in any reasonable
manner based on the medium, means and context"*, and expressly permits
satisfying it **by a link to a resource that carries the attribution
information**. The research register is that resource: it is part of the same
work, reachable from the place the plate appears on, and it names every
required element in full rather than in an abbreviated overlay.

This is the ordinary practice of a publication with a credits page, not a
loophole. What would be a dodge is attribution that exists nowhere, or that is
technically present but unreachable — and the test of the difference is whether
a reader who wants to know *can find out*. Here they can, from the same surface
the record itself is read on.

## Its limit — which is the honest part

**This does not make every licence admissible on the cinematic surface.** It
resolves *where credit lives*. It does not resolve ShareAlike.

CC-BY-SA additionally requires that adaptations carry the same licence. A
cut-out plate is an adaptation, and a composited cinematic scene containing it
raises a question about the licence of the composite that this record does not
answer and does not pretend to. **CC-BY-SA remains unresolved for cinematic
use** and must not be assumed cleared by this ruling.

Order of preference for any future cinematic plate, therefore:

1. **CC0 / public domain** — no obligation, no question. Prefer on sight.
2. **CC-BY** — cleared by this record; credit on the research register.
3. **CC-BY-SA** — *not* cleared for the cinematic surface. Research surface
   only, where a visible credit is unproblematic, until the composite question
   is ruled on separately.
4. **NC / rights-reserved** — rejected outright by the standing licensing
   policy; this repository is open source and a downstream fork must be able to
   honour every asset licence.

This reorders one earlier note: the 2026-09-11 sourcing table observed that the
sole CC0 candidate (*Todiramphus chloris*) was "the only row raising no D3
credit problem". With this record that is no longer the distinction — CC-BY
rows raise none either. CC0's advantage is now narrower and still real: it is
the only tier with no ShareAlike question waiting behind it.

## Also ratified: two plate searches are permanently closed

***Apis dorsata*** and ***Scylla serrata*** are **closed, not unfinished.** Do
not re-search either.

The reason is structural and worth stating once, properly, because it
generalises: **occurrence photography optimises for documentation, and its best
frames are unusable as portraits.** A research-grade photograph exists to prove
that an organism was in a place at a time. The frames that serve that best are
exactly the ones a plate cannot use — top-down for diagnostic features, in-hand
for scale, dead because a specimen holds still, on a neutral substrate because
background is noise. The searches returned, as their *best* regional results: a
dead bee on red concrete, a bee being eaten by a lynx spider, a crab held in a
man's hands, and a dead crab entangled in a ghost net.

Searching harder does not change an optimisation target. A compliant frame for
either species would have to come from a different kind of source — commissioned
illustration, a natural-history archive, or a photographer working to a brief —
which is a different decision with a different budget, not a continuation of
this search.

This is the same closure the coral scene plate has: *none findable by this
method*, with the method named, rather than *none found yet*.

## Consequences

- Any future plate is sourced CC0-first, and a CC-BY-SA candidate is not
  proposed for cinematic use without a separate ruling on the composite.
- `PROJECT_STATUS.md` backlog item 8 closes.
- The STYLE-GUIDE's provenance table becomes load-bearing rather than
  documentary: it is now the mechanism by which a licence obligation is met,
  so an asset missing from it is an unmet obligation, not merely an
  undocumented file.
- No code changes. Nothing is installed; this record governs how a plate would
  be credited when one is.

## Ratification

**Ratified by:** Chief Architect, 2026-09-11.
**Decision:** CC-BY attribution is discharged on the research register and never
on the cinematic frame; CC0 is preferred and CC-BY-SA stays unresolved for
cinematic use; the *Apis dorsata* and *Scylla serrata* searches are permanently
closed with the structural reason recorded.
