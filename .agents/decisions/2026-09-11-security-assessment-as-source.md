# An external security assessment enters as a cited source, not as a directive

**Date:** 2026-09-11
**Status:** Ratified
**Scope:** How the UK Government's nature security assessment is admitted to this repository; the boreal registry correction; what the assessment is not permitted to do.
**Occasion:** The assessment was supplied for integration with the landscape registry, in a corrupted text extraction.

## Decision

The assessment is admitted **as a cited source on the research register**. It
corroborates the place selection and closes one registry gap. **It does not
reorder the build queue and it does not touch any cinematic surface.**

Three rulings follow.

### 1 · Cite the clean publication. Never the supplied file.

The copy supplied to this repository is a corrupted PDF text extraction. It
drops characters systematically — its own title renders as *"Global bioversit
ecystem clae and nationa security"*, and the OFFICIAL page markings render as
*"UFIAL"*. Whole clauses are unrecoverable.

**A corrupted source is an unattested source, and citation-or-skip applies to
our own inputs exactly as it applies to occurrence records.** The supplied file
is therefore not cited, not quoted, and not committed. It is left untracked and
must stay that way; if it is ever kept, it must be plainly marked *corrupted
extraction — not citable*.

The citation of record is the clean publication:

> Department for Environment, Food & Rural Affairs (2026). *Nature security
> assessment on global biodiversity loss, ecosystem collapse and national
> security.* HM Government, updated 2 February 2026.
> `https://www.gov.uk/government/publications/nature-security-assessment-on-global-biodiversity-loss-ecosystem-collapse-and-national-security`

Every claim carried forward was read from the clean accessible HTML edition,
not from the extraction. Two are quoted here because they are the load-bearing
ones:

- *"Six ecosystem regions are critical for UK national security given the
  likelihood and impact of their collapse."*
- *"The Amazon rainforest, Congo rainforest, boreal forests, the Himalayas and
  South East Asia's coral reefs and mangroves are particularly significant for
  the UK."*

**Deliberately not carried forward:** the Amazon deforestation tipping
threshold and current-deforestation percentage, the paired temperature
threshold, and the per-feature expert vote counts. Those numbers appear in the
damaged extraction, and a dropped character falsifies a number silently while
leaving it looking exactly like a number. Where a figure ever matters, it comes
from the clean edition or it is omitted.

**Collapse-onset dates are verified but are still not rendered.** The clean
edition does support them — *"There is a realistic possibility that coral reefs
in SE Asia and boreal forests will start to collapse from 2030"*, rainforests
and mangroves from 2050 — so the constraint here is editorial, not evidential:
a date on a visitor-facing surface reads as a countdown, and a countdown is the
urgency register this project does not use. The dates live in this record,
where a future session can find them, and nowhere a reader will meet them.

### 2 · The boreal gap is closed as a registry correction

The assessment names six critical ecosystem regions. Mapped against
`scripts/ingest/landscapes.json` and `public/dwca/`, five were already present
and one was absent entirely: **boreal forest**. The registry carried
`svalbard-barents` (Arctic sea ice and tundra) and `bialowieza` (temperate
lowland old-growth) but had no boreal entry, while the assessment places boreal
forests in the *earliest* collapse bracket, alongside South East Asia's coral
reefs.

An omission at biome scale is a defect in a registry whose stated purpose is to
be the aspirational superset of places the observatory intends to cover. It is
a defect **on the registry's own terms**, independent of the assessment — the
assessment is what surfaced it, not what justifies it.

Added: **`wood-buffalo-boreal` — Wood Buffalo & the Peace-Athabasca Delta**,
`hasFieldRecord: false`, with a centroid and an authored query, in the existing
schema.

**Why that one.** The instruction was to pick an entry defensible as a *named
place*, not a biome abstraction. An entry called "boreal forest" would have
been the abstraction; Wood Buffalo National Park is a named place with a
protected-area anchor, which is the register every other entry in this file
uses (Serengeti–Mara, Greater Yellowstone, Okavango, Białowieża). It is the
largest boreal protected area in the world, and it sits in Canada — one of the
two countries the assessment names for this ecosystem.

**Its limitation, stated rather than discovered later.** One entry cannot
represent a biome spanning Russia and Canada, and the Siberian half is the
larger one. A Siberian counterpart is a later editorial decision, not an
oversight in this one.

**Registry only.** No scene, no place page, no archive. Widening the built
surface is post-gate work.

### 3 · The assessment does not set build order — declined, not deferred

"Which landscape next" sits downstream of the Q1–Q5 gate, and `PRODUCT.md`
leaves users and jobs UNRESOLVED BY DESIGN. An external prioritisation is a
good input to that question and a poor substitute for it.

More than sequencing, though: **a national-security frame values an ecosystem
by what its collapse would mean for one country's food and water supply.** That
is a legitimate frame. It is not this project's, whose claim is that a stranger
is lowered into a place until they care and that the care ends in understanding
— a value that does not route through anyone's national interest. Adopting a
security ranking as build order would quietly re-found the project on
instrumental grounds, and the re-founding would not announce itself.

So the assessment is recorded as a **tie-break**: where two candidate landscapes
are otherwise equal on editorial grounds, the one it names is the better build.
A tie-break, stated as a tie-break, so it cannot later be mistaken for an
obvious preference that was always there.

This is **declined, not deferred**. The Thought
(`.agents/thoughts/2026-09-11-nature-security-landscape-priority.md`) stays at
status `Working` for the build-order question, and that question stays open on
its own terms rather than waiting on this source.

## What the research surface now says

One attested line per place, beneath the pressures block in the atlas field
record, in the source voice, with the citation and an explicit statement of the
frame. No score, no badge, no countdown.

**Citation-or-skip bites here, and the Sundarbans is the proof.** The assessment
delimits both its mangrove and coral-reef regions to **South East Asia**, and
never mentions the Sundarbans, Bangladesh or India. The Sundarbans is South
Asia. Its line therefore says that the naming reaches the ecosystem *type* and
no further, and that it is not a statement about this place — rather than
quietly borrowing a naming that does not reach it. The Coral Triangle sits
inside the delimitation and its line says so. The Amazon várzea lies within a
rainforest the assessment names as a whole and does not treat separately, and
its line says that too. East Pacific Rise renders nothing.

That is three different reaches for three places from one source, written out
per place rather than derived, because a rule that smoothed the difference
would be the bug.

## Consequences

- The supplied extraction stays untracked and uncited.
- `landscapes.json` carries 25 landscapes; `PROJECT_STATUS.md` backlog item 12
  closes as a registry correction.
- No cinematic file is touched; both grammar gates stay green.
- If the assessment is ever to supply a figure to a surface, the clean edition
  must be re-read for that figure. This record does not license the extraction
  for any future use.

## Ratification

**Ratified by:** Chief Architect, 2026-09-11.
**Decision:** The assessment enters as a cited source on the research register;
the boreal gap closes as a registry correction; build order is unaffected and
that is a declination, not a deferral.
