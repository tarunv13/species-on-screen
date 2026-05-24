# Pilot Biodiversity Media Corpus Plan

> Operational plan for the *first* small-scale research corpus
> testing the methodology proposed in the prior research-matrix
> documents.
>
> **Scale.** ~30 artefacts (range: 25–40). Single-researcher
> executable. Spreadsheet-grade tooling.
>
> **Status.** Working draft. Fourth research-matrix companion;
> the operational successor to PR #21's methodology.
>
> **Not.** Not a database project. Not an infrastructure plan. Not
> a final corpus. Not a publication of analytical results. The
> pilot's deliverables are *methodological*, not substantive.

---

## Preamble

### Relationship to prior research-matrix artefacts

This plan operationalises the corpus methodology in
`corpus-seed-framework.md` (PR #21) at the smallest useful scale.
It is the first concrete instance against which the methodology
is tested.

- **PR #19 (species coverage typology)** supplies the species-
  category multi-tagging used in the pilot.
- **PR #20 (audience effects framework)** supplies the form
  classification and the four-construct distinction the pilot
  preserves.
- **PR #21 (corpus seed framework)** supplies the artefact
  schema, sampling logic, and ethics framework the pilot
  follows.

The pilot is not novel methodology. It is the first execution.

### What the pilot is for

The pilot exists to fail informatively. Specifically, it exists
to:

1. Stress-test the artefact schema (PR #21 §1) against actual
   media in the wild.
2. Identify which fields are codable and which are not.
3. Surface category boundary problems (where the controlled
   vocabularies need refinement).
4. Estimate per-artefact coding effort and total
   single-researcher feasibility.
5. Identify which comparative analyses are tractable at small
   N and which require larger corpora.
6. Produce a publishable methodology paper, not analytical
   conclusions.
7. Generate anchored coding exemplars that anchor inter-coder
   reliability work in any subsequent larger corpus.

### What the pilot is NOT for

- Generalising about biodiversity media. N=~30 cannot support
  generalisation; the pilot's outputs are methodological, not
  substantive.
- Producing inter-coder reliability statistics that bind a full
  corpus. Pilot reliability work is exploratory.
- Building infrastructure. The pilot operates on a spreadsheet
  and a Zotero library. Anything more elaborate is premature.
- Validating PR #19, #20, or #21's analytical claims. Validation
  requires designs the pilot does not support.

### Operating constraints

- **One researcher**, with optional secondary reviewer for a
  subset of artefacts.
- **Calendar window:** 6–10 weeks of part-time work, OR 2–3
  weeks of full-time equivalent.
- **Total effort estimate:** 60–100 person-hours including
  setup, capture, coding, synthesis, and writeup.
- **Tooling:** Zotero or comparable reference manager;
  spreadsheet (Google Sheets or Airtable Lite); Wayback Machine;
  manual capture where necessary; markdown notes.
- **No code, no database, no pipeline.** The pilot operates at
  human scale.

### Document structure

- **§1** — Pilot goals (what we want to learn).
- **§2** — Selection criteria.
- **§3** — Inclusion and exclusion at pilot scale.
- **§4** — Minimum diversity requirements.
- **§5** — Sampling logic.
- **§6** — Proposed artefact list (~30 entries).
- **§7** — Coding priorities (what to code).
- **§8** — Coding deferrals (what NOT to code yet).
- **§9** — Expected methodological failures.
- **§10** — Success criteria.
- **§11** — Comparative analyses tractable at pilot scale.
- **§12** — Execution plan and timeline.
- **§13** — Deliverables.
- **§14** — Maintenance and pilot lifecycle.

---

## §1 — Pilot goals

The pilot has six goals, ordered by priority. Subsequent design
decisions trade off against this order.

**G1. Establish that the artefact schema is codable.**
Determine, with evidence, whether a single trained researcher can
code the twelve fields of PR #21 §1 to a reasonable standard
within reasonable time. If the schema requires more than ~2 hours
per artefact at pilot stage, it is too elaborate.

**G2. Identify uncodeable or unreliable fields.**
Specific candidates for failure (per §9): narrative-technique
intensity (§1.5), spectacle vs understanding scales (§1.9),
behavioural-change-claim sub-fields (§1.11) for artefacts that
make no claims. The pilot generates evidence on each.

**G3. Stress-test the controlled vocabularies.**
Surface vocabulary entries that are missing, redundant, or
ambiguous. The pilot's deliverables include controlled-vocabulary
amendments for the next corpus version.

**G4. Generate anchored coding exemplars.**
Each pilot artefact, once coded, becomes a candidate exemplar
for the codebook's training material. The pilot produces the
first generation of exemplar tags.

**G5. Estimate scaling cost.**
Concrete per-artefact effort × required total artefact count =
realistic budget for v1.0 corpus. Without this estimate, scale
decisions are speculative.

**G6. Test which comparative analyses are tractable at small N.**
Some analyses require N≫30 (e.g., regression of spectacle vs
understanding across forms). Others are tractable at N=30
(e.g., spectacle-understanding distributional comparison
within paired sub-corpora). The pilot tells us which is which.

---

## §2 — Selection criteria

A pilot artefact is selected if it satisfies the PR #21 inclusion
criteria (§2 of that document) AND additionally:

1. **High pedagogical value for the pilot.** The artefact
   exercises a feature of the schema, a category boundary, or
   a known difficult case.
2. **Capture-stable.** The artefact is reasonably likely to
   remain accessible during the pilot window. Already-archived
   artefacts (Wayback, Internet Archive) are preferred over
   ephemeral platform content for pilot inclusion, with
   exceptions for forms (TikTok, Instagram) where ephemeral
   content is the form.
3. **Codable in <2 hours by a trained researcher.** Long-form
   artefacts (game playthroughs, interactive documentaries)
   are coded against bounded engagement (e.g., the first hour
   of play for games) with the bound documented in
   `coding_notes`.
4. **Publicly available without paywall, OR available to the
   researcher through institutional access.** The pilot does
   not include content the researcher cannot lawfully access.
5. **At least one of the artefact's coded categories must be
   testable.** The pilot avoids artefacts that are merely
   "nice to have" without exercising any specific schema
   feature.

---

## §3 — Inclusion and exclusion at pilot scale

### What changes from PR #21 at pilot scale

- **Tiering is suspended.** PR #21's three-tier scheme is for
  the v1.0 corpus. The pilot is single-tier and labels each
  artefact instead with the *schema feature it tests*.
- **Producer consent thresholds are simplified.** Pilot uses only
  Tier 1 canonical and Tier 2 institutionally-published
  artefacts. Small-creator content (Tier 3 in PR #21 terms) is
  excluded from the pilot to avoid consent complications at
  pilot stage.
- **Multilingual quotas are advisory, not mandatory.** The pilot
  aims for ≥3 non-English artefacts but does not enforce the
  30%/20% PR #21 floors. Multilingual coding is a separate
  research challenge that should not be tested simultaneously
  with schema feasibility.
- **Geographic balance is required but light.** At least one
  artefact subject in each of: South Asia, Sub-Saharan Africa,
  South America, Southeast Asia. Producer-country diversity is
  not enforced (most pilot artefacts will be UK/US-produced;
  this is the bias to be exposed and recorded).

### Pilot exclusions

In addition to PR #21 §3 exclusions, the pilot excludes:

- Content requiring deep field expertise the researcher lacks
  (e.g., specialist mycology channels, professional taxonomy
  databases). Their absence is recorded as a sampling-frame
  limitation.
- Content from platforms the researcher cannot lawfully access
  (e.g., paywalled streaming services without institutional
  subscription).
- Content too long to code within the pilot window (e.g.,
  full Planet Earth season). Bounded selections (single
  episodes, opening hour of a game) are admissible.

---

## §4 — Minimum diversity requirements

The pilot must satisfy *all* of the following before it is
considered ready for execution:

- **All 12 forms** from `audience-effects-framework.md` are
  represented by at least 1 artefact, ideally 2–3.
- **At least 10 of the 17 species categories** from
  `species-coverage-typology.md` are represented across the
  corpus.
- **At least 5 distinct biomes** are represented.
- **At least 4 geographic regions** for subjects (per §3 above).
- **At least 3 non-English artefacts** (subtitle, narration, or
  body text).
- **At least 5 artefacts** featuring non-charismatic taxa (per
  PR #19's neglected-biodiversity / "ugly" / ecological-engineer
  categories). This is the most likely diversity floor to be
  violated; the pilot enforces it explicitly.
- **At least 3 artefacts** with no clear conservation framing
  (per PR #21 §1.7's `no-conservation-frame` value), to test
  schema robustness on edge cases.
- **At least 2 artefacts** where the producer makes explicit
  behavioural-change claims, AND at least 2 where they do not,
  to exercise the §1.11 schema across the claim/no-claim
  distinction.

If any minimum is unmet at the proposed list, the list is
amended before coding begins.

---

## §5 — Sampling logic

The pilot uses **purposive stratified sampling** with deliberate
counter-bias inclusion. The strategy is:

1. **Form-stratified.** 1–3 artefacts per form, totalling ~30.
2. **Schema-feature-driven.** Within each form cell, artefacts
   are selected to exercise specific schema features (e.g.,
   the slow-loris TikTok exercises the gap between coded and
   actual behaviour; Mountain by David O'Reilly exercises
   "art game with no conservation frame").
3. **Counter-bias light.** Per §4, ~5 artefacts in
   neglected-biodiversity territory. The pilot does not aim to
   correct conservation-media bias; it aims to test whether
   the schema captures that bias visibly.
4. **Convenience-acknowledged.** Artefact selection is
   constrained by the researcher's access, language, and
   field knowledge. These constraints are recorded with the
   pilot, not hidden.

---

## §6 — Proposed artefact list

A reference list of approximately 30 artefacts. The list is
illustrative; actual pilot selection may substitute equivalents
based on access, ethics review, and schema-feature priorities.
Each entry shows the schema feature(s) it primarily exercises.

The list is grouped by form. Coding order need not follow form
groupings; see §12 for execution sequencing.

### Nature documentaries (3)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 1 | *Planet Earth II*, "Mountains" episode (BBC, 2016) | Tier 1 canonical; charismatic-predator + alpine biome; awe-cinematography intensity coding |
| 2 | *Virunga* (Netflix, 2014) | Conflict-species framing; Global South subject; complicity-framing presence |
| 3 | *The Year Earth Changed* (Apple TV+, 2021) | Multi-species, hope-framing; ambiguous solution-framing |

### Streaming-platform productions (3)

Distinguished from broadcast documentary by streaming-native
production and platform-native distribution. Some overlap with
"nature documentary" as form; coded primarily by distribution
context.

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 4 | *My Octopus Teacher* (Netflix, 2020) | Single-individual subject; intimacy + parasocial-with-animal-subject; understanding-dominant balance candidate |
| 5 | *Our Planet*, "Frozen Worlds" (Netflix, 2019) | Climate-symbol species; blue-chip register; spectacle-dominant balance |
| 6 | *Sea of Shadows* (Nat Geo / streaming, 2019) | Rescue + last-chance rhetoric; named campaign integration; Mexico subject |

### YouTube ecology content (3)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 7 | A *Real Science* or comparable explainer ecology video | Educator register; high structural-content; low-spectacle scale anchor |
| 8 | A *Brave Wilderness* / *Coyote Peterson* episode | Parasocial creator-led; encounter format; animal-handling welfare flag |
| 9 | A specialist niche channel (e.g., a mycology, deep-sea, or invertebrate channel) | Neglected-biodiversity coverage; long-tail subject testing |

### TikTok wildlife virality (3)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 10 | A high-engagement capybara video | Internet-viral category; out-of-context behaviour testing |
| 11 | A "tickling slow loris" video | Documented harm case; behaviour mis-coding (defensive posture as "play") |
| 12 | A pangolin awareness short (post-COVID) | Conservation-campaign on TikTok; cross-form content adaptation |

### Instagram conservation accounts (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 13 | One specific WWF main-account post + Reel | Institutional Instagram strategy; campaign-species-driven content |
| 14 | One post from a small-NGO account (e.g., Olive Ridley Project) | Field-photographer regional content; attention asymmetry vs WWF |

### Environmental journalism (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 15 | A Mongabay long-form article on a specific Global South subject | Investigative journalism register; structural-content high; agency-attribution to local actors |
| 16 | A *Guardian* environment investigation | Mainstream English-language journalism; comparative anchor |

### Conservation campaigns (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 17 | TX2 tiger campaign material (campaign page / video) | Campaign-species framing; specific behavioural-change claims; doubling rhetoric |
| 18 | Pangolin Crisis Fund campaign material | Anti-trafficking framing; international-campaign aesthetic |

### Interactive documentaries (1)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 19 | *Bear71* (NFB, 2012) | Canonical i-doc; user-pathway agency; bounding-the-artefact problem |

### Serious games (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 20 | *Beyond Blue* (E-Line / BBC, 2020) | Ocean exploration serious game; designed pedagogy; mechanism-bound understanding |
| 21 | *Eco* (Strange Loop, ongoing) | Multiplayer ecosystem simulation; collective-action mechanic |

### Non-commercial / art games (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 22 | *Mountain* (David O'Reilly, 2014) | No conservation frame; non-anthropocentric design; near-non-interactive form |
| 23 | *Endling — Extinction is Forever* (Herobeat, 2022) | Extinction grief mechanic; first-person environmental perspective |

### VR / immersive (2)

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 24 | *BBC Earth: Life in VR* | Mainstream VR documentary; presence + awe; novelty-confound flag |
| 25 | An academic VR experience (e.g., *The Stanford Ocean Acidification Experience*) | Research-context VR; explicit behavioural-change claim with evidence |

### Citizen science (3)

Distinct in that the unit of analysis is debatable. The pilot
explicitly tests this.

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 26 | The iNaturalist platform interface itself | "Platform as artefact" boundary problem |
| 27 | A specific Zooniverse project (e.g., Penguin Watch) | Project-as-artefact alternative unit |
| 28 | An eBird user-facing entry-flow walkthrough | Workflow-as-artefact alternative unit |

### Reserve / substitution candidates (2)

In case ethics review or access blocks any of #1–28:

| # | Candidate artefact | Primary schema feature tested |
|---|---|---|
| 29 | *Le Monde* or *El País* environmental article in French/Spanish | Non-English mainstream journalism; multilingual coding feasibility |
| 30 | An Indian regional environment-magazine piece (e.g., *Down To Earth* article) | Global South production about Global South subject; mismatch_flag = false |

**Final count: 30 artefacts** (with 25 minimum, 30 target, up to
40 if execution capacity allows additional schema-feature
candidates).

---

## §7 — Coding priorities

The pilot codes all twelve PR #21 §1 fields, but with the
following priority order. Higher-priority fields are coded for
all artefacts; lower-priority fields may be partially coded if
time runs out.

### Priority 1 — Always code, fully

- **Field 1: Core metadata** — without this, no artefact is in
  the corpus.
- **Field 2: Species represented** including PR #19 typology
  cross-tags. Multi-tagging is mandatory.
- **Field 8: Audience relationship type** including PR #20 form
  classification. Single-classification per artefact.
- **Field 12: Research usefulness** at minimum the
  `corpus_role`, `methodological_fit`, and `limitations`
  sub-fields.

### Priority 2 — Always code; structured fields complete; free-text fields acceptable in note form

- **Field 3: Ecosystem represented**, including the mandatory
  `notable_absences` sub-field.
- **Field 4: Geographic region**, including `mismatch_flag`.
- **Field 7: Conservation framing**, including
  `agency_attribution`.
- **Field 11: Behavioural-change claims or evidence**, including
  `four_construct_classification` per PR #20.

### Priority 3 — Code with explicit pilot-stage caveats

- **Field 5: Narrative techniques used.** Code multi-tag
  `techniques_present` and `techniques_dominant`. Defer
  `intensity_per_technique` to v1.0; the provisional vocabulary
  is acknowledged as incomplete and the entire field will be
  re-coded once the narrative-technique taxonomy is authored.
- **Field 6: Emotional framing.** Code `dominant_register`,
  `valence`, `arousal`, `intended_target`. `secondary_registers`
  may be coded selectively.
- **Field 9: Spectacle vs ecological-understanding balance.**
  Code both 1–5 scales. *Code each artefact twice — once on
  capture, once after a 7-day delay — and document
  intra-coder drift.* This is the pilot's primary reliability
  test.
- **Field 10: Interaction type.** Code `interaction_mode`,
  `agency_level`, `repetition_potential`, `social_dimension`.

---

## §8 — Coding deferrals (what NOT to code yet)

The pilot does *not* attempt the following, by design:

1. **Inter-coder reliability statistics** with multiple
   independent coders. The pilot uses one researcher with a
   secondary review on a subset (~5 artefacts). Reliability
   work at scale is a v1.0 task.
2. **Krippendorff's alpha or comparable agreement metrics**
   beyond simple percent-agreement on the secondary-review
   subset. Methodological investment in agreement metrics is
   premature until the schema has stabilised.
3. **Quantitative comparative analysis** as substantive
   research output. The pilot reports *which* analyses are
   tractable at the pilot's scale (§11), not their results.
4. **Expanded controlled vocabularies.** Vocabulary gaps are
   *recorded* during pilot coding; formal vocabulary expansion
   happens between pilot completion and v1.0.
5. **Multi-language coding workflows.** Non-English artefacts
   are coded by the researcher in source language where
   competent, with explicit translator support flagged where
   used. Systematic multi-language coding is a v1.0 problem.
6. **Audience-side data.** No reception studies, no audience
   surveys, no eye-tracking, no analytics. The pilot is supply-
   side only.
7. **Cross-platform algorithmic sourcing.** All capture is
   manual; no API harvesting, no automated scraping. Algorithmic
   research access is its own ethics-and-design task.
8. **Sub-corpora for specific research questions.** The pilot
   is a single corpus; sub-corpus design happens after the
   pilot reveals what's tractable.
9. **Public release of the pilot dataset.** The pilot is
   research-internal until the methodology paper is written;
   public release decisions follow publication conventions for
   the chosen venue.
10. **Comparative production-cost analysis** (e.g., budget
    estimates for the artefacts). Useful but premature.

---

## §9 — Expected methodological failures

The pilot is *expected* to surface these failures. Their
appearance is success, not a problem; their absence would suggest
the pilot has not stress-tested hard enough.

### F1. Narrative-technique vocabulary is incomplete

The provisional vocabulary in PR #21 §1.5 will fail on at least
one artefact in any corpus of 30. Specific predicted failures:

- TikTok virality will use techniques the vocabulary does not
  name (audio-overdub anthropomorphism; layered-text
  commentary).
- Art games (Mountain, Endling) will require categories such as
  "ambient-passive-witness" or "non-anthropocentric-perspective"
  not currently in the vocabulary.
- Citizen-science platforms will push back on "narrative
  technique" as a coherent unit at all.

The pilot's deliverable on F1 is a list of vocabulary additions
or schema reorganisations needed for v1.0.

### F2. Spectacle vs understanding scales drift

The 1–5 anchors in PR #21 §1.9 are operational but coder drift
is predictable, especially on the structural-content scale (the
boundary between scale point 3 and scale point 4 is where
disagreement clusters).

The pilot's intra-coder reliability test (§7, code each artefact
twice) generates evidence on drift magnitude. Expected: ≥1
scale-point drift on at least 20% of artefacts.

### F3. Behavioural-change-claim sub-fields are over-specified for low-claim artefacts

PR #21 §1.11 has eleven sub-fields. Most TikTok videos, most art
games, and many YouTube ecology videos make no behavioural-change
claims at all. Recording "no claim" eleven times is wasteful.

The pilot's deliverable on F3 is either:

- A simplified "no-claim path" through the field (a single
  no_claims_made flag short-circuiting the sub-fields), OR
- A defence of the current structure based on what the pilot
  learned.

### F4. Citizen-science platform unit-of-analysis problem

The pilot deliberately includes three citizen-science entries
with three different unit-of-analysis choices (platform
interface, specific project, workflow walkthrough) because
PR #21's schema does not specify which is "the artefact."

The pilot's deliverable on F4 is a schema clarification or
extension that names the unit explicitly.

### F5. Interactive-form bounding problem

Games, VR experiences, and interactive documentaries have
no fixed length. Coding "the artefact" requires bounding the
researcher's engagement (first hour of play; one full pathway;
30-minute session). Bounding rules are not in PR #21.

The pilot's deliverable on F5 is a draft bounding-rules
appendix.

### F6. Conservation framing assumes conservation framing exists

PR #21 §1.7's `no-conservation-frame` value is one option
among nine, but the field's structure assumes conservation
framing is the unmarked case. Several pilot artefacts (Mountain,
some TikToks, some Instagram aesthetic content, a specialist
mycology video) will have no conservation framing at all and
will leave most sub-fields empty.

The pilot's deliverable on F6 is either a restructured field
that handles no-conservation-frame as cleanly as it handles
conservation-frame, or a defended decision to leave the field
asymmetric.

### F7. Notable-absences field requires domain knowledge

PR #21 §1.3's mandatory `notable_absences` sub-field assumes
the coder knows what *should* have been present. For artefacts
about familiar subjects, this is tractable; for unfamiliar
subjects, the coder may not register absences.

The pilot's deliverable on F7 is an honest report of how often
the researcher had to consult external sources to code
absences, and a recommendation about coder-training
requirements.

### F8. Per-artefact effort exceeds estimate

The per-artefact 2-hour budget will be exceeded on some
artefacts (long-form interactive documentaries, complex
serious games). The pilot's deliverable on F8 is the actual
distribution of per-artefact effort and a recommendation
about realistic budgets.

### F9. Archive instability during the pilot window

At least one pilot artefact will become inaccessible (TikTok
removed, Instagram post deleted, URL broken) during the pilot
window. The pilot's deliverable on F9 is the observed rate of
loss and the operational lessons (capture earlier, archive
more aggressively).

### F10. Researcher positionality affects coding

Predictably present and worth documenting: which categories
the researcher codes confidently versus hesitantly; which
species typology categories the researcher over- or
under-applies; which framings the researcher reads as
"obvious" that another researcher might read differently.

The pilot's deliverable on F10 is a positionality statement
based on actual coding behaviour, not abstract reflection.

---

## §10 — Success criteria

The pilot succeeds, and the methodology is judged ready to
scale, if at least the following are achieved:

**S1. Schema completability.**
≥85% of priority-1 and priority-2 fields are codable on
≥85% of pilot artefacts. Below this, the schema is not yet
operational.

**S2. Time tractability.**
Median per-artefact effort ≤2 hours, with 75th-percentile
effort ≤3 hours. Above this, scaling cost is prohibitive.

**S3. Vocabulary gaps surfaced.**
At least 5 vocabulary additions are recommended for v1.0,
with concrete justifications. Fewer than 5 suggests the
pilot has not stretched the vocabulary; more than 30
suggests the vocabulary requires a structural rebuild.

**S4. Intra-coder drift quantified.**
On the spectacle vs understanding scales, drift is documented
with magnitude. Within-1-scale-point drift on ≤25% of
artefacts is acceptable; above this, the anchors require
substantial revision.

**S5. At least three failure modes (§9 F1–F10) confirmed and
documented.**
This is the pilot's diagnostic value. Failure-mode-poor
pilots have not been hard enough on the methodology.

**S6. At least one comparative analysis (§11) is shown to be
tractable at N=30.**
If no analysis is tractable at this scale, the pilot has
failed at G6.

**S7. A methodology paper is publishable.**
The pilot produces ≥6,000 words of methodology writeup
suitable for submission to *Conservation Letters*,
*Environmental Communication*, *People and Nature*, or a
comparable venue, OR for a digital humanities methods
journal. The paper's contribution is methodological, not
substantive.

The pilot is judged unsuccessful — and the methodology is
judged not yet ready to scale — if any of S1, S2, or S5 fail.
S3, S4, S6, S7 partial achievement is acceptable but flagged
in the pilot report.

---

## §11 — Comparative analyses tractable at pilot scale

The following analyses are tractable at N=30. Each is sketched at
research-question level, not implementation level.

**C1. Cross-form spectacle vs understanding distribution.**
For each form (12 cells, 1–3 artefacts per cell), report the
median spectacle and structural-content scores. Visualise as
a 12-row × 2-column distribution. Does the pattern predicted
by `audience-effects-framework.md` §"Comparative summary"
hold even at small N?

**C2. Charismatic vs non-charismatic species coverage by form.**
Across the corpus, what proportion of artefacts in each form
feature at least one PR #19 flagship-megafauna or charismatic-
predator species, vs at least one neglected-biodiversity or
"ugly" species? Pilot data may be too sparse for inferential
statistics; descriptive comparison is the goal.

**C3. Producer-subject geographic mismatch by form.**
The proportion of artefacts in each form where producer_country
≠ subject_country. Predicted: highest mismatch in nature
documentary and streaming productions; lowest in citizen
science and environmental journalism. Even at N=30, the
direction of the pattern is observable.

**C4. Conservation framing presence by form.**
The proportion of artefacts in each form with explicit
conservation framing vs no-conservation-frame. Predicted:
near-100% in conservation campaigns and serious games;
variable in TikTok and Instagram; near-0 in art games.
This analysis exercises §F6's edge cases.

**C5. Behavioural-change-claim density by form.**
The proportion of artefacts making explicit behavioural-change
claims by form. Predicted: near-100% in conservation campaigns;
moderate in serious games; very low in art games and
contemplative documentary; null in art games. Evidence-quality
distribution within claim-making artefacts.

**C6. Notable-absences pattern by form.**
Qualitative thematic analysis of `notable_absences` entries
across the corpus. Likely patterns: human pastoralism /
agriculture absent from broadcast documentaries; extractive
industries absent from blue-chip productions; local human
actors absent from BBC-style work about Global South subjects;
welfare context absent from charismatic-pet TikTok. Even at
N=30, thematic patterns are observable.

**C7. Paired-case deep analyses (single-case work).**
Three to five paired comparisons, each as a single case study:

- The same species across forms (e.g., one tiger artefact in
  documentary, TikTok, and journalism — three short artefacts
  paired).
- The same biome across producers (e.g., Sundarbans coverage
  by an Indian producer vs by a BBC production, if both can
  be obtained).
- The same campaign across distribution channels.

These are not statistical analyses; they are method-
demonstrating case-pairs that show what fine-grained
comparative work the schema enables.

**Analyses NOT tractable at pilot scale:**

- Regression of spectacle vs understanding on form, species,
  region (requires N≫30).
- Algorithmic-amplification longitudinal analysis (requires
  longitudinal sampling).
- Cross-cultural reception comparison (requires audience data).
- Generational coverage shift (requires multi-year temporal
  sampling).
- Survival analysis on archive decay (requires longitudinal
  re-checking).

---

## §12 — Execution plan

### 12.1 Phase structure

The pilot runs in four phases.

**Phase 1 — Setup (1 week, ~8 hours).**
- Confirm artefact list against §4 minimum diversity.
- Set up Zotero library; set up coding spreadsheet.
- Confirm institutional access for paywalled artefacts.
- Run any required ethics review.
- Final per-artefact ID assignment.

**Phase 2 — Capture (1–2 weeks, ~15 hours).**
- For each artefact: archive at Wayback or comparable;
  internal capture where licence permits; metadata
  documentation.
- Document per-artefact `archive_status` honestly. Some
  artefacts will not be fully archivable; record metadata-
  only.
- Note any access failures during capture; substitute from
  reserve list (§6) if necessary.

**Phase 3 — Coding (3–5 weeks, ~50 hours).**
- Code in form-batches (all nature documentaries together,
  then all streaming, etc.). Within-form batching exposes
  vocabulary gaps faster.
- Single-pass coding per artefact, with the §7 priority order.
- For Field 9 (spectacle/understanding), recode each artefact
  on day 7+ after first coding to measure intra-coder drift.
- Maintain a *failure log* during coding: every time a field
  is hard to code, the entry goes in the log with the
  artefact ID and a brief description. The failure log is the
  primary input to the pilot's methodology paper.

**Phase 4 — Synthesis and writeup (1–2 weeks, ~15 hours).**
- Compile failure log into structured failure-mode evidence.
- Compute simple descriptive statistics for §10 success
  criteria.
- Run the §11 tractable analyses.
- Draft methodology paper (~6,000 words).
- Produce vocabulary-amendment recommendations for v1.0.

**Total calendar time:** 6–10 weeks part-time, or 2–3 weeks
full-time-equivalent.
**Total effort:** ~88 hours.

### 12.2 Tooling

- **Reference manager:** Zotero (free; open metadata).
- **Coding spreadsheet:** Google Sheets or Airtable Lite. One
  row per artefact; columns per sub-field. Versioned.
- **Archive capture:** Wayback Machine "Save Page Now"; manual
  download where licence permits; screenshots for ephemeral
  social content.
- **Notes:** Markdown files, one per artefact, kept alongside
  the spreadsheet row.
- **Failure log:** A single ongoing markdown file, append-only.
- **NO databases, pipelines, or custom code.**

### 12.3 Effort distribution

| Activity | Hours | % of total |
|---|---|---|
| Setup, ethics, list-finalisation | 8 | 9% |
| Capture and archival | 15 | 17% |
| Coding (initial pass, all fields) | 35 | 40% |
| Recoding (Field 9 drift test only) | 5 | 6% |
| Failure-log maintenance | 5 | 6% |
| Synthesis and analysis | 8 | 9% |
| Methodology paper draft | 12 | 14% |

### 12.4 Risk mitigations

- **Researcher illness or interruption.** Phases are
  independent enough that pause-and-resume costs are modest.
  No phase is dependent on continuous attention.
- **Artefact access failure.** Reserve list (§6 #29–30) plus
  acknowledgement that mid-pilot substitution is acceptable
  if documented.
- **Effort underestimate.** Drop priority-3 sub-fields (§7)
  before dropping artefacts; preserve corpus diversity even at
  reduced field-coding depth.
- **Ethics complication.** A ready exclusion-decision
  framework: producer opt-out → exclude with note; consent
  ambiguity → exclude with note; access via questionable means
  → exclude. Better to exclude with documentation than to
  include with ethics debt.

---

## §13 — Deliverables

The pilot produces five concrete deliverables, in order of
priority:

**D1. The pilot corpus itself.**
~30 artefacts, fully coded against §7, archived, documented,
versioned as `pilot-v0.1`. Deliverable form: a Zotero library +
coding spreadsheet + per-artefact notes folder + capture archive.

**D2. The failure log.**
A structured catalogue of every coding difficulty, vocabulary
gap, schema ambiguity, and execution surprise encountered
during the pilot. Deliverable form: a single markdown document,
~3,000–5,000 words, organised by failure type.

**D3. A vocabulary amendments document.**
Specific additions, deletions, and rewordings recommended for
the controlled vocabularies in PR #21 §1, with justification
per recommendation. Deliverable form: a structured markdown
document feeding into the v1.0 corpus methodology revision.

**D4. A methodology paper draft.**
~6,000 words suitable for submission to a conservation-
communication, environmental-communication, or digital-
humanities-methods venue. Contribution: methodological lessons
from a pilot biodiversity-media corpus. Not analytical claims
about biodiversity media.

**D5. A scaling decision document.**
A short structured assessment (1,500–2,500 words) addressing:
do we proceed to v1.0 corpus? Under what amendments? With
what budget? What is the minimum viable v1.0?

---

## §14 — Maintenance and pilot lifecycle

### 14.1 The pilot has a finite life

The pilot is a learning instrument. Within 6–12 months of
completion:

- The methodology paper is submitted.
- The vocabulary amendments are integrated into a revised
  corpus methodology document.
- The scaling decision is made.
- The pilot corpus is either:
  - **Promoted** into v1.0 (its artefacts re-coded against
    the revised schema and absorbed), OR
  - **Retired** with the methodology paper as the durable
    output, OR
  - **Preserved** as a separate "pilot snapshot" while v1.0
    is built fresh.

The choice between these is the scaling decision (D5). It is
not pre-determined.

### 14.2 The pilot is citable

Once `pilot-v0.1` is finalised:

- A version tag is applied.
- A short README accompanies the corpus, citing the four
  research-matrix companion documents (PR #19, #20, #21, and
  the present plan).
- The pilot is referenceable from the methodology paper as a
  named, dated artefact.

### 14.3 The pilot's success is methodological

The pilot does not aspire to substantive findings about
biodiversity media. Its deliverables are the methodological
infrastructure on which subsequent corpus and audience-side
research can build. A pilot that produces no substantive
findings but produces robust methodology is a successful
pilot. A pilot that produces seductive substantive findings
on N=30 is a *failed* pilot — it has confused itself with the
v1.0 corpus.

---

## Closing note

The pilot is an exercise in restraint as much as in ambition.
Its design refuses three temptations:

1. **The temptation to scale prematurely.** N=30 is chosen
   deliberately. A 100-artefact pilot is not "more rigorous";
   it is a v1.0 corpus the methodology has not yet earned.
2. **The temptation to publish substantive findings on
   pilot data.** N=30 cannot support generalisation. The
   methodology paper is the appropriate publication; analytical
   claims await v1.0.
3. **The temptation to build infrastructure.** A spreadsheet
   and a Zotero library are sufficient for the pilot. Anything
   more is engineering ahead of evidence.

The pilot's primary virtue is that it can actually be done,
this year, by one researcher, at known cost, with predictable
deliverables. Its primary risk is that, having been done, the
researchers conclude the methodology is "good enough" without
implementing the failure-mode-derived amendments. The §13
deliverables, particularly D2 and D3, exist to make that
conclusion impossible.
