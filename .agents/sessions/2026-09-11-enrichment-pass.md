# Session diary — the enrichment pass: dossiers consumed, news scoped, plates sourced

**Date:** 2026-09-11
**Type:** Application (research surface, data layer) + sourcing research + one prioritisation Thought. No doctrine amended.
**Role:** Creative Technical Lead → Research Curator → Repository steward.
**Branch:** `feat/exploration-prototypes-and-data-pipelines`. Not merged, not deployed.

---

## Opening act: the composition scale was deleted, not kept

Backlog item 10 closed by deleting the V1.4 token block outright (`ff37f0e`).
Scoping it to `src/style.css` the previous day was the right first move; the
homepage then failed the same test every other surface had failed — no
editorial line and no sub-line to take `--type-line`/`--type-lead`, three
`white-space:nowrap` caption links that can never take a measure in any unit,
and caption insets (2rem / 3.6rem / 5.2rem; 1rem / 3.3rem / 5.6rem under 768px)
of which exactly one touches the spacing scale. Zero consumers on its one
resolving surface.

Keeping it as an honestly-labelled unused block was the weaker option: a
declared, unconsumed token set is a standing invitation for a later session to
wire it, and this one encoded a composition the repository does not have. Two
things survived, because both are measured facts rather than intentions — the
weight retraction and the scope-boundary prohibition. Zero pixels moved,
re-verified by the 353-rule declaration-set comparison across all seven
bundles. The eleven per-sheet measure tokens from `3407f10` are untouched; they
are the durable half of that work.

## A · The dossiers finally have a consumer (`d6b7cbb`)

`public/data/` has carried authored `threats[]` and `conservation{}` since the
dossiers were written, and no surface has ever shown them. They now render on
the Sundarbans field record, research register, between the interaction web and
"On screen".

**The fields are not equal, and the rendering says so.** The reach vocabulary is
the evidence ledger's own (M33/M34), used verbatim rather than softened into a
second vocabulary:

- **IUCN Red List category** — *Endangered*, **REACHES A SOURCE**, bound to the
  dossier's own `data_sources` entry typed `assessment`. No mapping is invented;
  with no such entry the row degrades to REACH INCOMPLETE and claims no source
  at all, which was tested.
- **No dossier records an assessment year.** The row says so outright:
  "Assessment year unrecorded in this dossier — this category should not be read
  as current." A bare "Endangered" would imply a currency the record has not
  got.
- **Population estimate, trend, programmes, and all five threats** — REACH
  INCOMPLETE. `threats[]` are `{name, description}` with zero attribution per
  item, so not one is presented as a bare assertion.

**Not a dashboard.** No icon, no severity bar, no meter, no colour-coded badge —
every reach chip is the same neutral ink at the same size whatever it says. That
is D6's "identically shaped for every state" applied here: a differently
coloured badge would re-introduce the pass/fail reading that reach-not-truth
exists to refuse. Nothing is ranked or weighted. **A threat is not a score.**

**Place honesty.** A species dossier is range-wide, and the tiger dossier's
threats name palm-oil plantations, which are not a Sundarbans pressure. The note
says it directly. Rendering them without that line would misstate the place —
the error the coral scene plate was vetoed for.

Citation-or-skip verified across five cases: absent field, empty field, and each
field present alone. Nothing renders a placeholder.

## B · The news layer, and a placeholder that was addressed to a developer (`bf7509b`)

**A defect was live.** When a landscape had no articles, the field record
rendered a labelled "Current coverage · GDELT" block containing *"Run
`npm run ingest:news <place>` to populate it."* Two faults in one string: it is
a placeholder, which citation-or-skip forbids; and it is developer build copy on
a public research surface, instructing a visitor who cannot run npm. Every one
of the four shipped news files had `articles: []`, so that is what the block
actually rendered everywhere it appeared. An empty coverage block now renders
nothing.

**The refresh, and what it returned.** `ingest:news` for the three landscapes
that have a surface: sundarbans 0, coral-triangle 0, amazon-varzea 1, over
GDELT's twelve-month window.

**That one article is a false positive and is not fit to render.** It is a
pharmaceutical press release — a clinical trial of crofelemer — which matched
because the company is named Jaguar and the compound derives from an Amazonian
tree, so the wire copy says "Amazon rainforest". It is not reporting on the
Amazon várzea. The fetched record is kept exactly as GDELT returned it, because
deleting the row by hand would fabricate an absence and hide the problem; the
finding is reported instead. Nothing is deployed this session, so it reaches no
reader before it is ruled on.

The wider question this raises is not tuning: across a full year, three
landscapes yielded zero usable items and one misleading one. Whether this layer
should render at all is a live question, recorded for a ruling.

**Pre-staging stopped.** `congo-basin.json`, `great-barrier-reef.json` and
`serengeti-mara.json` removed — each held `articles: []` from a 2026-06-21
fetch, none appeared in `index.json`, and none was reachable, because the field
record fetches `news/<place>.json` for the place it is displaying and these
landscapes have no page. Empty files standing in for an intention are
speculative artifacts, which is the same rule that deleted the composition scale
an hour earlier. The rationale is recorded in `build-news.mjs`; the registry
stays aspirational, because a registry is the right place for an intention and
an empty data file is not.

## C · Species plates — the research half, and two honest failures (`7cf2b36`)

Nothing installed, cut out, or downloaded into the repository. This is the
licence-and-suitability record that has to exist *before* a cut-out is
attempted, so the sourcing survives even though the plates do not.

**Licences were read from the record.** Every licence in the table is the photo
object's own `license_code` from the iNaturalist observation record — never a
thumbnail, a search-page caption, or the observation's licence, which is a
separate field and does diverge from its photos'. Each candidate frame was then
viewed at full size before its pose note was written; nothing is described from
metadata alone.

Five rows, each with its reservation stated. The strongest by a distance is
*Heritiera fomes* — CC-BY, 2048×1365, photographed at Khulna, Bangladesh, which
is the Sundarbans itself, in dappled canopy daylight that already *is* the
vocabulary. Only one CC observation of that species exists on iNaturalist at
all. *Todiramphus chloris* is the only **CC0** row, and therefore the only one
that raises no attribution-versus-D3 problem (backlog item 8).

**Two documented failures, collections named.** *Apis dorsata* (1,249
research-grade CC observations, 67 CC photos) and *Scylla serrata* (113 / 67)
produced no compliant frame. What they produced instead: a dead bee on red
concrete, a bee being eaten by a lynx spider, a crab held in a man's hands, a
dead crab in a ghost net.

**The failure is structural, not bad luck**, and that is the finding worth
keeping. A licence-clean research-grade photograph exists to *document an
occurrence*, and the frames that document best — top-down, in-hand, dead, on a
neutral substrate — are exactly the frames a portrait plate cannot use. Two of
the five candidate rows are dead animals on man-made surfaces for the same
reason. Locality and dignity were not loosened to fill rows.

**Refusals recorded, not revisited.** *Panthera tigris tigris* — the slot
renders into the cinematic surface, where tiger-as-absence holds; no licence
makes it admissible. *Homo sapiens* — a licence covers the photographer's
rights, not a depicted person's dignity, which is not hypothetical here: the
*Scylla serrata* CC0 candidate was rejected partly on that ground.

## The security assessment — corroboration, not a new build order

A UK Government national security assessment naming six ecosystems critical to
UK national security was supplied for integration with the landscape registry.
The result is recorded as a Thought
(`.agents/thoughts/2026-09-11-nature-security-landscape-priority.md`), not as a
decision, because that is what it is.

**Three of the six criticals are the three landscapes already built end to
end** — Sundarbans mangroves, Amazon várzea, South East Asia's coral reefs. Not
one built place is off the list. Two more, Congo rainforest and the Himalayas,
are already in the registry. **One — boreal forest — is absent from the registry
entirely**, which is a real gap: a global landscape registry that omits the
largest terrestrial biome is incomplete on its own terms, independent of any
security framing.

**The supplied copy is a corrupted text extraction and must not be cited.** It
drops characters systematically — its own title reads "Global bioversit ecystem
clae and nationa security" — so every structural claim above was cross-checked
against independent reporting before being relied on, and every figure in it
(the Amazon tipping thresholds, the collapse-onset dates, the expert vote
counts) is deliberately not carried forward. Those are exactly the things a
dropped character silently falsifies. The clean published PDF is named in the
Thought; a clean copy is required before any number from this assessment
reaches a surface.

**It changes no build order.** "Which landscape next" sits downstream of the
Q1–Q5 gate, and a national-security frame values an ecosystem by its
consequences for one country's food and water supply — a legitimate frame, and
not this project's. Using it as corroboration costs nothing; using it as
doctrine would quietly re-found the project on instrumental grounds. It is
recorded as a tie-break, visible as a tie-break.

## Ruled the same day — the assessment lands, three prior findings close

The pass above surfaced four open questions. All four were ruled within the
session, which is why this diary has a second half.

**The assessment enters as a cited source, not a directive**
(`.agents/decisions/2026-09-11-security-assessment-as-source.md`). The clean
publication was located and read in its accessible HTML edition — Defra,
*Nature security assessment on global biodiversity loss, ecosystem collapse and
national security*, HM Government, updated 2 February 2026 — so the citation of
record is a real one and the corrupted extraction stays untracked and uncited.

Reading the clean edition produced a correction the corrupted one had hidden:
**the assessment delimits both its mangrove and coral-reef regions to *South
East* Asia, and never mentions the Sundarbans, Bangladesh or India.** The
Sundarbans is South Asia. The comfortable "three of six criticals are ours"
framing is true of the ecosystem *types* and over-tight about the Sundarbans
specifically — so the Sundarbans line on the research surface says the naming
reaches the type and no further, and that it is not a statement about this
place. The Coral Triangle sits inside the delimitation and its line says so;
the Amazon várzea lies within a rainforest named as a whole; East Pacific Rise
renders nothing. Three different reaches from one source, written out per place,
because a rule that smoothed the difference would be the bug.

Collapse-onset dates were verified in the clean edition and are **still not
rendered**: a date on a visitor-facing surface reads as a countdown, and a
countdown is the urgency register this project does not use. They live in the
decision record instead.

**Build order is unaffected, and that is a declination rather than a deferral.**
A national-security frame values an ecosystem by what its collapse would mean
for one country's food and water supply. Legitimate, and not this project's —
adopting it as build order would quietly re-found the work on instrumental
grounds. It is recorded as a tie-break, visible as a tie-break. The Thought
stays at `Working` on that question alone.

**The boreal gap closed as a registry correction.** `wood-buffalo-boreal` —
Wood Buffalo & the Peace-Athabasca Delta — added to `landscapes.json`, taking
it to 25. A named place with a protected-area anchor, matching the register
every other entry uses, rather than an entry called "boreal forest" that would
have been the biome abstraction. Its limitation is stated in the file: one
entry cannot represent a biome spanning Russia and Canada, and the Siberian
half is the larger one.

**The GDELT news layer is retired** (backlog 11). Removed from the render path
entirely — `renderNews()`, its call site, the `NEWS` state, the `.fr-news` CSS,
and `public/news/`, which with nothing rendering it was unreachable by
construction. `build-news.mjs` is kept with the measurement in its header, so
the decision is reproducible rather than remembered, and a replacement note in
`field-record.js` says what was there and why it went.

**Plate attribution is settled** (backlog 8,
`.agents/decisions/2026-09-11-plate-attribution-on-research-register.md`).
Credit lives on the research register — the STYLE-GUIDE provenance table and
the field record's sources block — and never on the cinematic frame. CC-BY
4.0 §3(a)(2) permits satisfying attribution by a link to a resource carrying
it, which is what a credits page has always been. **The limit is stated rather
than glossed:** this resolves where credit lives, not ShareAlike — a cut-out is
an adaptation, the composite question is unanswered, and **CC-BY-SA stays
uncleared for cinematic use.** One earlier note is reordered by this: the
sourcing table had called CC0 "the only row raising no D3 credit problem", and
that is no longer the distinction — CC0's remaining advantage is narrower and
still real, being the only tier with no ShareAlike question behind it.

**The two plate searches are permanently closed.** *Apis dorsata* and *Scylla
serrata*: closed the way the coral plate is closed — *none findable by this
method*, with the method named — not *none found yet*. Occurrence photography
optimises for documentation, and its best frames are unusable as portraits.
Searching harder does not change an optimisation target.

## What did NOT change

C1–C5 · the Article III dip · both grammar gates · tiger-as-absence · every beat
and the beat-stack grid mechanism · all existing copy · every position and
alignment · the evidence and citation layer · D4–D6 · the eight-session gate ·
every homepage interaction and hit target. No accent colour, no glass on the
cinematic surface, no new dependency, no hook enabled, no asset installed. The
coral plate stays CLOSED.

**Another session's work was left alone.** The tree acquired changes this
session did not make — a secrets-hygiene fix moving the TMDB key out of source,
a `.env.example`, and a new `research/` pipeline. They are not mine and are not
committed here.

## Thought Review (AI-OS session-close step)

**One Thought opened** —
`2026-09-11-nature-security-landscape-priority`, status Working. It qualifies
precisely: durable pre-resolution reasoning, upstream of any ADR or milestone,
which would otherwise survive only in conversation. It is the second entry in a
system that has had one since 2026-07-07.

Two further candidates were considered and declined. *An empty state must never
be addressed to a developer* is an instance of citation-or-skip, already
doctrine. *Documentary photographs make poor portrait plates* is recorded where
it is actionable — in the STYLE-GUIDE, beside the failures that demonstrate it.

## Verify / build status

`npm run verify` green (17 checks, exit 0) and `npm run build` green at each
commit. Not deployed, not merged to `main`.

**No felt pass was run and none is claimed.** The gates cannot see light.

## Conclusion

Three bodies of authored data that the repository had been carrying without
showing — the dossiers' pressures, the news layer, the plate sourcing — are now
either rendered honestly, scoped honestly, or documented as failures with their
collections named. The one thing that was live and wrong, a build instruction
addressed to a visitor, is gone. And the project's four-place selection turns
out to be corroborated by an assessment that had no idea it existed, which is
worth knowing and is not worth reorganising around.
