---
id: 2026-09-11-nature-security-landscape-priority
title: An external security assessment corroborates three of our four built places — and names one landscape we do not have
domain:
  - editorial
  - research
origin: Research report (UK Government national security assessment), supplied in conversation
status: Working
opened: 2026-09-11
updated: 2026-09-11
promoted:
maturation: Thought
supersedes:
superseded-by:
---

# An external security assessment corroborates three of our four built places — and names one landscape we do not have

> Working. Nothing here is ratified and nothing in the repository has changed on
> account of it. This is the prioritisation reasoning, held where prioritisation
> reasoning belongs, so that a later decision about which landscape to build
> next has something better than taste behind it.

**Thesis.** A UK Government national security assessment, *Global biodiversity
loss, ecosystem collapse and national security*, names six ecosystems as
critical to UK national security. **Three of those six are the three landscapes
this project has already built end to end** — Sundarbans mangroves, the Amazon
várzea, and South East Asia's coral reefs. Two more are already carried in the
landscape registry as aspirational. One is absent from the registry entirely.
The overlap was not designed; the places were chosen on editorial grounds years
before this assessment was read. That makes it corroboration rather than
confirmation — and corroboration of a coverage decision is worth recording,
because the obvious next question, *which landscape next*, now has an
independent answer that does not come from our own taste.

## Reasoning

### What the assessment says, and how far I can vouch for it

The assessment applies the analytic apparatus of national-security work —
structured confidence ratings, reasonable-worst-case scenarios — to ecological
collapse, and concludes with high analytical confidence that biodiversity loss
and ecosystem degradation threaten UK national security and prosperity. Its
operative sentence for our purposes names the Amazon rainforest, the Congo
rainforest, boreal forests, the Himalayas, and South East Asia's coral reefs
and mangroves as particularly significant for the UK.

**A source-integrity warning, and it is load-bearing.** The copy supplied to
this repository —
`National_security_assessment_-_global_biodiversity_loss__ecosystem_collapse_and_national_security.md`
at the repository root — is a **badly corrupted text extraction**. It drops
characters systematically: its own title reads "Global bioversit ecystem clae
and nationa security", and the OFFICIAL page markings render as "UFIAL". Whole
clauses are unrecoverable.

That file therefore **must not be quoted, cited at sentence level, or used to
support a page-numbered claim**, and it is deliberately left untracked rather
than committed as if it were a reference. This is the same discipline as Bates
et al. 2005 (M31/M32): a citation is a falsifiable claim, and a claim sourced
to a corrupted document is not falsifiable.

What *is* recoverable from it is structural, and I cross-checked every
structural claim below against independent reporting of the assessment before
relying on it. The ecosystem list, the six-ecosystem framing, and the
"every critical ecosystem is on a pathway to collapse" conclusion are
corroborated externally, not read off the damaged file alone. The clean source
is published at
`https://assets.publishing.service.gov.uk/media/696e0eae719d837d69afc7de/National_security_assessment_-_global_biodiversity_loss__ecosystem_collapse_and_national_security.pdf`
and **a clean copy must be obtained before any figure, date or threshold from
this assessment is rendered on any surface.**

Specifically not carried forward here, because the corruption makes them
unsafe: the Amazon deforestation tipping threshold and current-deforestation
figure, the paired temperature threshold, the collapse-onset dates, the
per-feature expert vote counts. Those numbers appear in the damaged text. They
are exactly the kind of thing that would be quoted, and exactly the kind of
thing a dropped character silently falsifies.

### The overlap, computed against the registry as it stands

Mapped against `scripts/ingest/landscapes.json` (24 landscapes) and
`public/dwca/` (4 archives):

| Assessment's critical ecosystem | Registry landscape | Built? |
|---|---|---|
| South East Asia's mangroves | `sundarbans` | **Full three-surface experience** |
| Amazon rainforest | `amazon-varzea` | **Full three-surface experience** |
| South East Asia's coral reefs | `coral-triangle` | **Full three-surface experience** |
| Congo rainforest | `congo-basin` | Registry only — no archive, no page |
| Himalayas | `eastern-himalaya` | Registry only — no archive, no page |
| **Boreal forests** | **ABSENT FROM THE REGISTRY** | — |

Three observations follow, in descending order of confidence.

**One — the built coverage is three-for-three.** Every landscape that carries a
Darwin Core Archive and a three-surface experience is on the assessment's
critical list. Not one built place is off it. The fourth archive, East Pacific
Rise, is not on the list and is not expected to be: a deep-sea vent field is a
different kind of argument, and the reason it exists here — that an evidential
record can be honest about a place almost nobody will ever see — is unaffected
by a food-security framing.

**Two — the boreal gap is real and is the one genuine finding.** The registry
carries `svalbard-barents` (Arctic sea ice and tundra) and `bialowieza`
(temperate lowland old-growth forest). Neither is boreal forest. The taiga —
the largest terrestrial biome on Earth, and the one the assessment groups with
South East Asian coral reefs as potentially beginning to collapse earliest — has
no entry at all. That is a coverage gap in the *registry*, which is the
aspirational document and therefore the right place to fix it; it is not yet an
argument for building a boreal place.

**Three — the two unbuilt criticals are already queued, and one of them is
harder than it looks.** `congo-basin` and `eastern-himalaya` are in the registry
with authored news queries. `congo-basin` is one of the three landscapes whose
pre-staged news file was removed on 2026-09-11 for being unreachable — which is
a statement about our build order, not about its importance, and the two facts
should not be confused by a later reader.

### Why this does not become a ruling today

Three reasons, and the first is decisive.

**The gate.** D4–D6 remain `Proposed` behind the eight moderated validation
sessions and a Q1–Q5 ratification record. "Which landscape next" is downstream
of "what is this instrument for and who is it for", and PRODUCT.md deliberately
leaves users and jobs UNRESOLVED BY DESIGN. An external prioritisation is a good
input to that question and a poor substitute for it.

**Editorial independence.** A national-security framing values an ecosystem by
its consequences for one country's food and water supply. That is a legitimate
frame and it is not this project's frame. The Observatory's claim is that a
stranger can be lowered into a place until they care, and that care ends in
understanding — a value that does not route through anyone's national interest.
Adopting a security ranking as our build order would quietly re-found the
project on instrumental grounds. Using it as *corroboration* costs nothing;
using it as *doctrine* would cost the thing the project is for.

**The source is not yet citable.** Until a clean copy is in hand, nothing from
this assessment may reach a rendered surface. Citation-or-skip applies to
prioritisation inputs exactly as it applies to occurrence records.

### What it does license, cheaply

Two things, neither requiring a ruling:

1. **A registry addition for boreal forest.** `landscapes.json` is explicitly
   aspirational and a superset of the built places — that is its stated purpose.
   Adding a boreal entry costs an authored `newsQuery` and nothing else, and it
   closes a gap that is real independent of this assessment: a global landscape
   registry that omits the largest terrestrial biome is incomplete on its own
   terms.
2. **A recorded tie-break.** If two candidate landscapes are ever otherwise
   equal on editorial grounds, the one on this list is the better build. That is
   a tie-break, not a ranking, and it is stated here so that it is visible as a
   tie-break rather than smuggled in later as an obvious preference.

## Decision to make

Three, none urgent, all downstream of the gate:

1. Does `landscapes.json` gain a boreal-forest entry now, as registry
   housekeeping, or does it wait for a place-building decision? (My reading:
   now — the registry is aspirational by design and the omission is a defect on
   its own terms.)
2. Is the corroboration recorded anywhere a reader will see it — `PRODUCT.md`,
   a note, the book — or does it stay here until the gate clears? (My reading:
   stays here. It is an input, not a finding about the work.)
3. Does a clean copy of the assessment get obtained and registered as a
   reference, so that its figures become quotable? Required before any
   surface renders a number from it.

## Evolution

### 2026-09-11 — opened

- **Previous understanding:** The four built places were chosen on editorial
  grounds — a mangrove, a floodplain forest, a reef, a vent field — with no
  external corroboration of that selection, and the landscape registry's
  24 entries were an undifferentiated aspiration.
- **New evidence:** A UK Government national security assessment names six
  ecosystems as critical; three are exactly our three built terrestrial/marine
  places, two more are already in the registry, and one — boreal forest — is
  absent from the registry entirely.
- **Repository artifact that changed it:** none. Nothing was changed. The
  comparison is against `scripts/ingest/landscapes.json` and `public/dwca/` as
  they stand at `7cf2b36`.
- **Resulting conclusion:** The selection is externally corroborated and the
  registry has one genuine gap. Neither fact is permitted to reorder the build
  queue while the Q1–Q5 gate stands, and the supplied source copy is too
  corrupted to cite.

### 2026-09-11 (later the same day) — partially ruled; this Thought stays open

- **Previous understanding:** three open questions — the boreal registry entry,
  whether to record the corroboration where a reader sees it, and whether to
  obtain a clean copy of the source.
- **New evidence:** the clean publication was located and read (Defra, *Nature
  security assessment…*, updated 2 February 2026), which settled the citation
  and produced two verified quotes plus the collapse-onset dates. It also
  produced a correction this Thought had not anticipated: the assessment
  **delimits its mangrove region to South East Asia and never mentions the
  Sundarbans, Bangladesh or India**. The Sundarbans is South Asia, so the
  "three of six are ours" framing above is true of the *ecosystem types* and
  over-tight about the Sundarbans specifically. That is recorded here rather
  than edited away upstream, because the over-tight version is what the
  corrupted extraction supported and the correction is the useful part.
- **Repository artifact that changed it:**
  `.agents/decisions/2026-09-11-security-assessment-as-source.md`
- **Resulting conclusion:** Questions 1 and 3 are ruled — the boreal entry is
  added as a registry correction (`wood-buffalo-boreal`), and the clean
  publication is the citation of record. Question 2 is ruled narrowly: one
  attested line per place on the research register, each stating how far the
  naming actually reaches for that place. **The build-order question is not
  ruled and is not deferred — it is declined.** The assessment is recorded as a
  tie-break and nothing more, so this Thought stays `Working` on that question
  alone rather than being promoted and frozen.

## Cross-references

- ADR:              .agents/decisions/2026-09-11-security-assessment-as-source.md
- Task:             PROJECT_STATUS.md backlog #1 (Amazon várzea cinematic surface)  ·  #12 (boreal gap, CLOSED)
- Session diaries:  .agents/sessions/2026-09-11-enrichment-pass.md
- Doctrine:         PRODUCT.md (users/jobs UNRESOLVED BY DESIGN; success unmeasured)
