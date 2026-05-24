# Biodiversity Media Corpus Seed Framework

> Methodology for constructing the first structured research corpus
> for comparative analysis of biodiversity representation across
> digital media ecosystems.
>
> **Scope.** Per-artefact metadata schema; corpus inclusion and
> exclusion criteria; sampling strategies; comparative,
> longitudinal, and culturomics study designs; ethics; bias risks;
> interpretive limitations.
>
> **Status.** Working draft. Third companion document in the
> research-matrix series.
>
> **Not.** This is not project doctrine, not steering, not
> implementation specification. It is a research methodology
> artefact. It does not bind PRs. It does not specify code,
> features, or data pipelines.

---

## Preamble

### Relationship to companion artefacts

This document operationalises the prior two research-matrix
artefacts into a corpus that supports the comparative analyses
they imply:

- **`species-coverage-typology.md`** (PR #19) supplies the
  17-category species classification used in the
  *species-represented* field of each artefact. Multi-tag rules
  apply (a tiger artefact tags multiple categories).
- **`audience-effects-framework.md`** (PR #20) supplies the
  12-form classification used in the *audience-relationship*
  field of each artefact, and supplies the spectacle-vs-
  understanding analytical framing for the corresponding field.

A future **narrative-technique taxonomy** (flagged in #19 and #20
but not yet authored) will supply controlled vocabulary for the
*narrative-techniques-used* field. Until that taxonomy is
authored, the field uses the provisional vocabulary listed in
§1.5 below, with explicit notice that re-coding will be required
once the taxonomy lands.

### Methodological orientation

The corpus is designed against the practices of:

- **Empirical media studies** — content-analysis methodology
  (Krippendorff; Neuendorf), inter-coder reliability practice,
  codebook-driven analysis.
- **Conservation culturomics** — Ladle, Correia, Jaric et al. on
  digital-data sources and biodiversity cultural salience;
  multi-platform corpus assembly methods.
- **Digital humanities corpus design** — versioned, reproducible
  corpus construction; archival-stability practice; metadata
  citability.
- **Critical platform studies** — Bucher, Bruns et al. on
  research access to platform data and the structural biases
  imposed by platform mediation.
- **Research ethics in computational media studies** — Williams,
  Burnap & Sloan on Twitter/X research ethics; the AoIR Internet
  Research Ethics guidelines; institutional IRB/ethics-board
  conventions for digital media research.

### Operating principles

1. **Reproducibility over exhaustiveness.** A small corpus that
   another researcher could rebuild from the criteria is more
   valuable than a large corpus that cannot be reconstructed.
2. **Versioning is mandatory.** Corpus state at any point in time
   must be citable; corpus drift over time is itself a research
   variable.
3. **Archive at capture.** Digital media artefacts are deletable;
   any artefact entered into the corpus is archived (Wayback
   Machine, internal capture, or comparable) at the moment of
   capture. Metadata is preserved even when content cannot be.
4. **Acknowledged sampling.** Every corpus is a sample of available
   material; the sampling frame is named explicitly and its
   biases are documented as part of the corpus, not as
   apologetic appendices.
5. **Coder transparency.** Coding decisions are documented;
   inter-coder reliability is computed where possible; the
   codebook is part of the corpus, not external to it.
6. **Ethical sourcing precedes analytical convenience.** Where
   corpus inclusion would violate platform terms, copyright, or
   subject consent in any non-trivial way, the artefact is
   excluded or its inclusion is justified explicitly in the
   ethics log.

### Field schema (overview)

Each artefact in the corpus is described against twelve fields,
detailed in §1:

1. Core metadata
2. Species represented
3. Ecosystem represented
4. Geographic region
5. Narrative techniques used
6. Emotional framing
7. Conservation framing
8. Audience relationship type
9. Spectacle vs ecological-understanding balance
10. Interaction type
11. Behavioural-change claims or evidence
12. Research usefulness

The schema is stable. Future amendments preserve the field count
and meaning; new sub-fields may be added under existing fields.

### Document structure

- **§1** — The artefact schema in detail.
- **§2** — Inclusion criteria.
- **§3** — Exclusion criteria.
- **§4** — Sampling strategies.
- **§5** — Comparative analysis designs.
- **§6** — Longitudinal study designs.
- **§7** — Culturomics applications.
- **§8** — Ethical concerns.
- **§9** — Bias risks.
- **§10** — Interpretive limitations.
- **§11** — Recommendations for the seed corpus.
- **§12** — Maintenance discipline.

---

## §1 — The artefact schema

### 1.1 Core metadata

Provenance and identification. Aligned with Dublin Core and
schema.org/VideoObject where applicable; extended for
research-corpus needs.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `artefact_id` | string (corpus-internal stable ID) | Yes | Format: `[corpus-version]-[sequential-number]`. Stable across re-coding. |
| `title` | string | Yes | Original-language title; transliteration secondary. |
| `creator` | structured (person/organisation) | Yes | Disambiguated: individual, studio, NGO, broadcaster, citizen contributor. Multiple permitted. |
| `producer_country` | ISO 3166 code | Yes | Country of production entity. |
| `platform_primary` | controlled vocab | Yes | The platform where the artefact was originally distributed or where it is most natively located. |
| `platform_others` | list, controlled vocab | No | Other platforms where the same artefact circulates. |
| `urls` | list, structured | Yes | Original URL plus archive URL plus internal capture path; date-stamped per URL. |
| `date_published` | ISO 8601 | Yes | First public release. |
| `date_captured` | ISO 8601 | Yes | When the corpus added it. |
| `duration_or_length` | structured | Yes | Seconds for AV; word-count for text; play-time-hours-median for games; varies by form. |
| `format` | controlled vocab | Yes | video, image, image-set, text-article, podcast, game, VR-experience, interactive-doc, livestream, mixed. |
| `languages` | list, ISO 639 | Yes | All languages of the artefact (audio, text, captions). |
| `access_state_at_capture` | controlled vocab | Yes | open, paywalled, geo-restricted, login-required, removed-but-archived, private. |
| `license_or_rights` | string | Yes | License where stated; "all rights reserved" otherwise; explicit research-permission record where obtained. |
| `archive_status` | controlled vocab | Yes | wayback-archived, internal-capture, metadata-only, unrecoverable. |
| `corpus_version_added` | string | Yes | The corpus release version in which the artefact entered. |
| `corpus_version_last_recoded` | string | No | Most recent re-coding pass. |
| `coder_id` | string | Yes | Coder or coder-team identifier. |

**Coding guidance.** `creator` requires care: a TikTok video by an
individual creator on a brand account, a co-production between
broadcaster and streamer, and an institutional video uploaded by an
intern all have legitimate but different attributions. Document the
attribution rule used per artefact.

**Platform vocabulary.** Maintain a controlled list per corpus
version. Initial seed list: youtube, tiktok, instagram,
broadcast-bbc, broadcast-pbs, broadcast-other, netflix,
disney-plus, apple-tv-plus, amazon-prime, vimeo, twitch, kick,
itch-io, steam, app-store-ios, google-play, museum-website,
ngo-website, journalism-outlet, citizen-science-platform,
inaturalist, ebird, zooniverse, vr-headset-store, mixed-platform.
Maintainers add platforms as the corpus grows; never collapse
distinct platforms into "social media" or "internet."

### 1.2 Species represented

Multi-tag, with explicit distinction between editorial focus and
incidental presence.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `primary_subject_taxa` | list, structured | Yes | Taxa with sustained editorial focus. |
| `background_taxa` | list, structured | No | Taxa appearing without editorial focus (passing shots, ecosystem context). |
| `taxon_name_common` | string per entry | Yes | Common name as used in artefact. |
| `taxon_name_scientific` | string per entry | Yes | Genus and species; subspecies where contested. |
| `taxon_id_external` | structured per entry | Yes | GBIF or IUCN Red List ID; both where available. |
| `coverage_proportion` | numeric per entry | No | Approximate fraction of artefact dedicated to the taxon. |
| `coverage_role` | controlled vocab per entry | Yes | protagonist, antagonist, ensemble, context, data-point, unmarked. |
| `iucn_status_at_publication` | controlled vocab per entry | No | EX/EW/CR/EN/VU/NT/LC/DD/NE; useful for status-vs-coverage longitudinal work. |
| `typology_categories` | multi-tag | Yes | Cross-tag from `species-coverage-typology.md` (PR #19). Multi-tag is the rule; a tiger reliably tags 7 categories. |

**Coding guidance.** Where the artefact uses common names that map
ambiguously to multiple species (e.g., "tiger shark" vs unspecified
"tiger" in metaphorical use), code both literal and metaphorical
mentions and disambiguate in `coding_notes`. Where game-mediated
content depicts designed-creatures inspired by real taxa, record
the inspiration relationship explicitly using the form
`inspired-by:[scientific-name]` and do not treat the design as the
real species in primary tagging.

### 1.3 Ecosystem represented

Multi-tag with explicit handling of absences and degradation
states.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `biome_primary` | controlled vocab | Yes | WWF biome scheme or comparable standard. |
| `biome_others` | list, controlled vocab | No | Secondary biomes appearing. |
| `habitat_specific` | string | No | Site or sub-habitat name where applicable. |
| `representation_state` | controlled vocab | Yes | pristine-framed, degraded-framed, contested, restoration-in-progress, industrial-adjacent, urban-edge, ambiguous. |
| `notable_absences` | list, structured | Yes | Ecosystems or habitat features mentioned but not shown; ecosystems materially relevant but excluded. |
| `human_presence_in_frame` | controlled vocab | Yes | none, ranger-or-scientist, indigenous-community, local-non-indigenous, tourist, industrial-actor, mixed. |

**Why `notable_absences` is mandatory.** What an artefact omits is
analytically as significant as what it includes. A documentary
about lions in the Serengeti that omits Maasai pastoralism, a film
about Bornean orangutans that omits palm-oil concessions, an
Antarctic film that omits research-station and tourism
infrastructure — these are coding facts and they belong in the
corpus.

### 1.4 Geographic region

Two distinct geographies, deliberately tracked separately. Their
mismatch is the norm and is itself a research variable.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `subject_country` | list, ISO 3166 | Yes | Country/countries where the biological subject occurs in the artefact. |
| `subject_region` | controlled vocab | Yes | Continent + sub-region. |
| `producer_country` | ISO 3166 | Yes | Already in core metadata; restated here for analytical convenience. |
| `subject_global_classification` | controlled vocab | Yes | global-north, global-south, transboundary, polar, marine-international, ambiguous. With explicit note in coding guidance that this classification is imperfect and politically contested. |
| `specific_locations_named` | list, structured | No | Place names mentioned. Useful for geo-tagged corpus work and for tourism-pressure studies. |
| `mismatch_flag` | boolean | Yes | True where producer_country ≠ subject_country. |

**Coding guidance.** Global-north/south is operationally useful but
politically reductive. Use the field for coarse-grained
distributional analysis; do not treat it as analytically primitive.
Where a finer-grained classification is needed for a study,
document the alternative scheme used and store it in a
study-specific extension field.

### 1.5 Narrative techniques used

Multi-tag from a controlled vocabulary. **This field is provisional
pending a future narrative-technique taxonomy** (flagged as a
companion artefact in PR #19 and #20). On authoring of that
taxonomy, this field will be re-coded across the corpus.

Provisional vocabulary:

- `anthropomorphism` — attribution of human emotions, thoughts, or
  intentions to non-human subjects.
- `catastrophe-framing` — emphasis on collapse, disaster, mass
  loss.
- `awe-cinematography` — production techniques optimised for awe
  response (scale, slow motion, sweeping camera, swelling music).
- `intimacy-shot` — close, sustained framing of an individual
  animal subject.
- `predator-prey-suspense` — narrative tension built on hunting
  outcome.
- `grief-narrative` — explicit framing of loss as central
  emotional content.
- `scientific-authority-narration` — narration claiming
  epistemic credibility through scientific identity.
- `first-person-environmental` — POV or near-POV from the
  ecological subject's perspective.
- `data-visualisation-storytelling` — quantitative information
  carried by visual abstraction.
- `gamified-exploration` — player-agency and reward-loop
  mechanics deployed in non-game contexts.
- `scarcity-framing` — emphasis on rarity, "the last," "only X
  remaining."
- `rescue-narrative` — focus on intervention and saving as the
  central story.
- `last-chance-rhetoric` — temporal urgency, "before it's too
  late."
- `hope-framing` — recovery and possibility as primary register.
- `interactivity-driven-immersion` — viewer action as the means
  of engagement.
- `naturalist-observation` — patient, low-affect, descriptive
  observation.
- `personification-of-place` — habitat or ecosystem as
  protagonist.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `techniques_present` | multi-tag, controlled vocab | Yes | All techniques observably present, regardless of intensity. |
| `techniques_dominant` | list, subset of `techniques_present` | Yes | Techniques that organise the artefact's structure. |
| `intensity_per_technique` | structured | No | Optional 1–5 scale per technique. |
| `coding_notes` | free text | Yes | Brief justification per dominant technique. |

**Coding guidance.** Techniques are not mutually exclusive; most
artefacts deploy several. Inter-coder reliability on this field is
historically low in content-analysis studies; the codebook should
include exemplars and contested cases for training. Re-coding will
be needed when the formal narrative-technique taxonomy is authored.

### 1.6 Emotional framing

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `dominant_register` | controlled vocab | Yes | awe, grief, amusement, urgency, disgust, contemplation, curiosity, fear, pride, melancholy, indignation, hope, neutral. |
| `secondary_registers` | list, controlled vocab | No | Other registers present. |
| `valence` | controlled vocab | Yes | positive, negative, mixed, neutral. |
| `arousal` | controlled vocab | Yes | low, moderate, high. |
| `intended_target` | controlled vocab | Yes | what affect the producer appears to be aiming at; same vocab as `dominant_register`. May differ from `dominant_register` (a producer may aim at hope and produce melancholy). |

**Cross-reference.** This field operationalises the
emotional-engagement construct from
`audience-effects-framework.md` at the artefact level.

### 1.7 Conservation framing

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `framing_mode` | controlled vocab | Yes | rescue, urgency, hope, blame, celebration, observation, advocacy, education, no-conservation-frame. |
| `threat_visibility` | controlled vocab | Yes | none, mentioned, structural-context-given, dominant-frame. |
| `agency_attribution` | multi-tag, controlled vocab | Yes | humans-as-saviours, locals-as-actors, scientists-as-actors, indigenous-as-actors, the-species-itself, no-agency-attribution, multi-actor. |
| `solution_framing` | controlled vocab | Yes | none, individual-action, donation, policy, restoration, structural-change, ambiguous, no-solution-suggested. |
| `complicity_framing` | controlled vocab | Yes | viewer-implicated, viewer-spared, structural-implication-without-personal, no-complicity-frame. |
| `named_threats` | list, free text | No | Specific threats named (palm-oil, fisheries, climate, etc.). |
| `named_solutions` | list, free text | No | Specific solutions advocated. |

**Coding guidance.** `agency_attribution` is the most analytically
loaded sub-field. Many conservation artefacts, particularly from
Global North producers about Global South ecosystems, attribute
agency primarily to external scientists or to the species itself
while local human actors appear only as background presence or
threat. This pattern is a coding fact, regardless of whether it
matches reality.

### 1.8 Audience relationship type

Operationalises the form classification from
`audience-effects-framework.md`.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `form_classification` | controlled vocab, single | Yes | One of the 12 forms in PR #20: nature-documentary, streaming-platform-production, youtube-ecology, tiktok-virality, instagram-aesthetics, conservation-campaign, environmental-journalism, interactive-documentary, serious-game, non-commercial-game, vr-immersive, citizen-science. |
| `spectator_position` | controlled vocab | Yes | passive-viewer, scrolling-feed-viewer, browser, subscriber, explorer, contributor, player, witness. |
| `parasocial_potential` | controlled vocab | Yes | none, creator-led, animal-led, institution-led, narrator-led. |
| `access_model` | controlled vocab | Yes | free, ad-supported, subscription, paywalled, donation, freemium, educational-license, pay-once. |
| `expected_session_length` | controlled vocab | Yes | seconds, low-minutes, high-minutes, hour-plus, multi-session, ongoing. |

### 1.9 Spectacle vs ecological-understanding balance

This is the most analytically loaded field. The two scales are
**independent**, not endpoints of a single continuum. Both are
required, both are 1–5, with explicit coding anchors.

| Sub-field | Type | Required | Anchor scale |
|---|---|---|---|
| `spectacle_intensity` | numeric 1–5 | Yes | 1 = no spectacle (e.g., naturalist field-observation video). 2 = restrained production with limited dramatic technique. 3 = moderate production values, regular dramatic moments. 4 = high production values, frequent peak moments. 5 = saturated spectacle, near-constant peak (e.g., trailer-density drama). |
| `structural_content` | numeric 1–5 | Yes | 1 = no causal or systemic content. 2 = isolated facts without structural context. 3 = some structural explanation, partial causation. 4 = sustained structural explanation, multiple causal links. 5 = systemic, mechanism-rich, transferable models. |
| `balance_classification` | derived | Yes | spectacle-dominant (S>U+1), understanding-dominant (U>S+1), balanced (|S−U|≤1), both-low (S≤2 ∧ U≤2), both-high (S≥4 ∧ U≥4). |
| `coding_notes` | free text | Yes | Justification per scale, with anchors referenced. |

**Coding guidance.** Inter-coder reliability on this pair of scales
is achievable but requires training against shared exemplars. Pilot
the codebook with at least three coders on a 50-artefact pilot set
before scaling. Anchors should be operationalised with named
exemplar artefacts in the corpus's coder-training documentation.

### 1.10 Interaction type

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `interaction_mode` | controlled vocab | Yes | passive-viewing, browse, scroll, play, explore, contribute, record, annotate, share, discuss. Multi-tag where multiple modes are present. |
| `agency_level` | controlled vocab | Yes | none, selection-only, pathway-choice, parameter-control, co-creation, data-contribution, content-creation. |
| `repetition_potential` | controlled vocab | Yes | one-time, occasional-revisit, ritual (e.g., daily-cam-watching), continuous-engagement, replayable, never-revisited. |
| `social_dimension` | controlled vocab | Yes | solo, comments-only, community, collaborative, competitive, none-mediated. |

### 1.11 Behavioural-change claims or evidence

The most reliability-critical field. Most artefacts make implicit
or explicit behavioural-change claims; few are accompanied by
evidence meeting research-grade standards. This field documents
both rigorously.

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `claims_made` | list, free text | Yes | Behavioural-change claims made by the artefact's producers, sponsors, or principal commentators. |
| `claim_specificity` | controlled vocab | Yes | none, vague-aspirational, specific-with-target, measurable-outcome-claimed. |
| `evidence_offered` | controlled vocab | Yes | none, anecdote, case-study, observational, quasi-experimental, experimental, longitudinal, multi-source-triangulated. |
| `evidence_independence` | controlled vocab | Yes | producer-internal, producer-commissioned-third-party, independent-research, independent-peer-reviewed, none. |
| `effect_durability_claimed` | controlled vocab | Yes | not-claimed, immediate-only, short-term (≤30d), medium-term (1–6m), long-term (>6m), permanent-claimed. |
| `counter_evidence_known` | list, free text | No | Documented critiques, contradictory findings, retraction notes. |
| `four_construct_classification` | structured | Yes | For each of awareness, emotional-engagement, ecological-understanding, behavioural-change (per PR #20): `claimed?` (Y/N) and `evidenced?` (Y/N/partial). |

**Coding guidance.** This field is the corpus's primary defence
against the inflated impact-claim pattern documented in
`audience-effects-framework.md`. Be especially careful with
producer-internal evidence and producer-commissioned third-party
evaluations; classify them honestly in `evidence_independence`.

### 1.12 Research usefulness

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `research_questions_supported` | list, free text | Yes | Specific research questions this artefact can support evidence for; cross-referenced where possible to the *Research opportunities* sections of PR #19 and PR #20. |
| `methodological_fit` | multi-tag, controlled vocab | Yes | corpus-comparison, case-study, longitudinal, culturomics, content-coding, discourse-analysis, audience-reception (when paired with audience study), mixed-methods. |
| `corpus_role` | controlled vocab | Yes | representative, outlier, canonical, exemplar-of-pattern, counterexample-of-pattern, pilot-only. |
| `limitations` | list, free text | Yes | What this artefact cannot help answer; what additional evidence types would be needed. |
| `linked_artefacts` | list of artefact_ids | No | Other corpus artefacts this one is meaningfully connected to (same producer, same species, same campaign, paired comparison, etc.). |
| `citation_form` | structured | Yes | Citation in researcher-chosen format; minimum: creator, title, platform, date_published, URL, date_captured. |

---

## §2 — Inclusion criteria

An artefact is eligible for the corpus if **all** of the following
are satisfied:

1. **Substantive biodiversity content.** The artefact has
   biodiversity, an identifiable species, an ecosystem, or
   conservation/ecological communication as substantive content,
   not as decorative background. Operational threshold: ≥30% of
   duration, words, or frame-area focused on the subject; or
   designed pedagogical or narrative function organised around
   the subject regardless of duration ratio.
2. **Public accessibility at capture.** The artefact was publicly
   accessible (open, free, ad-supported, subscription-paywalled,
   or login-walled) at the moment of capture. Private content
   accessed only with subject consent for research is permitted
   but flagged separately.
3. **Identifiable producer.** Authorship is attributable to a
   named individual, organisation, or coalition; anonymous /
   unattributed content is excluded except where anonymity is
   itself the analytical subject.
4. **Captureable for archive.** The artefact can be archived in a
   form that supports later research access (Wayback, internal
   capture, or comparable). Metadata-only entries are permitted
   for content that cannot be fully archived but whose presence
   in the corpus is analytically necessary.
5. **One of the twelve form-categories** named in
   `audience-effects-framework.md`.
6. **Sufficient metadata.** All "Required" fields in §1 can be
   filled with confidence; "I don't know" is not a permitted
   value for required fields.
7. **Ethics and licence-compatibility.** Inclusion does not
   violate platform terms in a way that exposes the corpus to
   takedown risk, and does not violate copyright in
   non-research-defensible ways under the corpus's operating
   jurisdiction.

### Tiered inclusion

To support both representativeness and analytical depth, the
corpus uses three tiers:

- **Tier 1 — Canonical.** High-priority, frequently-cited,
  field-shaping artefacts. Each form gets a deliberately
  curated Tier 1 set, capped to keep canonical bias visible.
  Example candidates (illustrative only): *Planet Earth*,
  *Blue Planet II*, *My Octopus Teacher*, *March of the
  Penguins*, *Sea of Shadows*, *iNaturalist app*, *Beyond Blue*,
  *The Great Animal Orchestra*, the WWF Tigers campaign, etc.
- **Tier 2 — Representative.** Stratified sample across forms,
  species typology categories, and regions; the analytical core
  of the corpus.
- **Tier 3 — Outliers and counterexamples.** Deliberately
  selected to test the corpus's analytical categories: works
  that break form expectations, neglected-biodiversity coverage
  (per PR #19), Global-South productions about Global-North
  ecosystems, and similar deliberate counters to mainstream
  pattern.

Each artefact is tagged with its tier in `corpus_role`.

---

## §3 — Exclusion criteria

An artefact is excluded if **any** of the following apply:

1. **Pornographic content.** Without exception.
2. **Animal-cruelty content presented for entertainment.** Edge
   cases (predation footage in legitimate documentary;
   wildlife-killing footage in journalistic exposé; ritual
   slaughter in ethnographic context) are admissible but must
   be flagged in `coding_notes` and reviewed by at least two
   researchers before inclusion.
3. **Decorative or incidental biodiversity.** A film with brief
   wildlife footage as visual texture, an Instagram lifestyle
   account that occasionally posts wildlife images, a game
   where animals are background atmosphere — excluded unless a
   specific research design justifies inclusion.
4. **Spam, SEO-bait, or content-farm output.** Bulk-generated
   content with no substantive editorial intent. Edge case:
   such content is itself a research subject (algorithmic
   biodiversity content as a phenomenon); a separate sub-corpus
   may be designed for it, but it is excluded from the seed
   corpus.
5. **Content produced under conditions that violate the corpus's
   ethical baseline.** Footage filmed without proper Indigenous
   community consent, footage of identifiable individuals
   without consent in non-public contexts, content procured by
   means the corpus would not endorse.
6. **Producer opt-out.** Producers, particularly small / individual
   creators, who explicitly request exclusion from the research
   corpus. Such requests are honoured without negotiation.
7. **Unrecoverable provenance.** Content that cannot be reliably
   attributed to a producer, dated, or located.
8. **Unverifiable taxonomy.** Content whose biological subject
   cannot be identified with reasonable confidence at species or
   higher-rank level.

---

## §4 — Sampling strategies

A corpus is always a sample. The seed corpus uses a *combined*
strategy because no single sampling logic supports the full set of
research questions in PR #19 and PR #20. The combined strategy is
explicit; alternative strategies are documented for downstream
researchers who may construct study-specific sub-corpora.

### 4.1 Stratified sampling by form (primary)

Equal cells across the 12 forms named in
`audience-effects-framework.md`. Target seed-corpus size: 25–40
artefacts per cell, totalling 300–480 artefacts. Cell quotas
ensure no single form dominates the corpus by virtue of
ease-of-collection.

### 4.2 Stratified sampling by species typology category

Within each form-cell, sample to cover the 17 species categories
from `species-coverage-typology.md`. Where coverage of a category
is impossible (e.g., neglected biodiversity in TikTok virality is
empirically rare), the absence is itself recorded as a
research-relevant fact.

### 4.3 Stratified sampling by region

Across the corpus, both `subject_region` and `producer_region`
are tracked, with explicit quota targets to avoid Anglophone-
producer dominance. Targets:

- Producer regions: at minimum 30% non-Anglophone production.
- Subject regions: at minimum 20% Global South subjects.
- These targets are floors, not ceilings; deliberate
  oversampling of under-represented regions is encouraged in
  Tier 3.

### 4.4 Probability-proportional-to-visibility sampling (with caveats)

For studies of cultural salience, weight sampling by reach
metrics (views, downloads, subscribers, audience-size estimates).
This strategy is appropriate for some questions but reproduces
existing visibility biases; do not use it as the corpus's
primary sampling logic. Document explicitly when a sub-corpus is
PPVS-sampled.

### 4.5 Theoretical / purposive sampling

For case-study work, select artefacts because they exemplify or
challenge a theoretical category. Purposive sampling produces
non-representative sub-corpora; this is a feature, not a flaw,
provided the sampling rationale is documented.

### 4.6 Time-bounded sampling

Default seed-corpus window: **2015–2025**. Rationale: the post-2015
period covers the consolidation of streaming-as-primary-distribution,
the rise of TikTok, the Cecil-effect moment, and the post-Blue-
Planet-II conservation-communication landscape. Earlier material
may be included as Tier 1 canonical (Planet Earth 2006, etc.).

### 4.7 Event-bounded sampling

For specific research questions, sub-corpora can be assembled
around events: COP coverage windows, post-Cecil weeks, post-Blue-
Planet-II weeks, the early-COVID pangolin moment, named campaign
launches. Event-bounded samples produce high-density data over
narrow windows.

### 4.8 Comparative paired sampling

For cross-form or cross-region comparisons, deliberately pair
artefacts that hold variables constant. Paired examples:

- Same species across forms (tiger in BBC, tiger on TikTok, tiger
  in a serious game).
- Same form across species (a documentary about a tiger, a
  documentary about a soil ecosystem).
- Same region across producers (Sundarbans by Indian production
  vs Sundarbans by BBC Natural History Unit).

Paired sampling is the highest-value strategy for testing the
analytical claims of the audience-effects framework and the
species coverage typology.

### 4.9 Counter-bias sampling

Deliberate oversampling of categories that mainstream conservation
media under-covers: neglected biodiversity, "ugly" species, Global
South productions, freshwater systems, fungal subjects, deep-ocean
material. Tier 3 is the natural home for counter-bias artefacts.

---

## §5 — Comparative analysis designs

The corpus is built to support the following comparative designs.
Each is sketched at the level of corpus-design requirements, not
implementation.

### 5.1 Within-form, across-species

Holding form constant, varying species typology category. Example
question: "How does TikTok handle flagship megafauna versus
neglected biodiversity?" Requires the form-cell to contain
coverage of multiple species categories; PR #19's cross-tagging
makes this analysable.

### 5.2 Across-form, holding species constant

Same species, varying form. Example question: "How does the same
species (tiger) differ in spectacle-intensity, structural-content,
and conservation-framing across documentary, TikTok, journalism,
and serious game?" Comparative paired sampling (§4.8) is the
construction strategy.

### 5.3 Producer-controlled comparison

Same producer, varying subject. Example question: "Does BBC
Natural History Unit treat Global South subjects differently from
Global North subjects?" Requires producer-name resolution (the
`creator` sub-field) to be precise and consistent.

### 5.4 Audience-relationship comparison

Holding species and region constant, varying audience-relationship
type. Example question: "Does the same tiger story produce
different conservation framings in passive vs participatory forms?"

### 5.5 Spectacle-understanding regression

Across the full corpus, regression of `spectacle_intensity` and
`structural_content` against `four_construct_classification`
fields and against form, species category, and region. Tests the
core analytical claim of `audience-effects-framework.md` that
spectacle and understanding are independent dimensions and that
forms differ structurally on both.

### 5.6 Absence analysis

Across the corpus, analysis of `notable_absences` patterns. Example
question: "Which ecosystems and human actors are systematically
absent from BBC-style documentary about Global South subjects?"
The `notable_absences` field exists specifically to make this
tractable.

---

## §6 — Longitudinal study designs

The corpus supports time-series work, with caveats about
preservation and platform churn.

### 6.1 Symbol-cycling studies

Track which species occupy specific typology categories
(particularly extinction-symbol, climate-symbol, internet-viral)
over time. Predicts: turnover within these categories is
substantial; entry and exit are themselves cultural events.

### 6.2 Campaign-effect tracking

Pre/during/post sampling around named campaigns. Example: TX2 tiger
campaign coverage from 2010–2022; vaquita coverage from 2014
onwards. The corpus must capture pre-campaign baseline material to
support such designs.

### 6.3 Algorithmic-amplification cycles

For platform-native forms (TikTok, Instagram, YouTube), repeated
sampling of the same query terms over time, to track how
algorithmic surfacing of biodiversity content shifts. Requires
methodologically careful access design (§8.5 below).

### 6.4 Generational coverage shifts

Long-window studies (decades, where Tier 1 canonical material
extends earlier) of how the same species' coverage evolves: which
categories accrue, which fall away, how production conventions
change. The Attenborough corpus alone supports a substantial
generational-shift sub-study.

### 6.5 Caveats: preservation gaps

Most digital media corpora suffer severe preservation gaps. The
seed corpus's mitigation strategy is:

- Wayback Machine integration at capture.
- Internal capture where licence permits.
- Metadata-only entries for unrecoverable content, with explicit
  marker.
- Periodic re-capture of unstable URLs (every six months for
  Tier 2 and Tier 3 artefacts).

Even with these measures, longitudinal claims must include
estimated preservation rates and acknowledge survival bias.

---

## §7 — Culturomics applications

Following Ladle, Correia, Jaric et al., the corpus supports
culturomics work — the use of digital cultural data to measure the
salience of biological subjects in human discourse.

### 7.1 Cross-platform salience tracking

Mapping species or campaign salience across the corpus's twelve
forms and across platforms within each form. Multi-source
salience indices avoid the single-platform pitfalls (Google
Books-only studies; Wikipedia-only studies).

### 7.2 Wikipedia integration

Wikipedia article view counts and edit time series, paired with
the corpus, provide an external reference signal. Wikipedia is
not in the corpus per se but is a parallel data source.

### 7.3 Search-volume integration

Google Trends, Bing search data, and platform search APIs (where
ethically and legally usable) provide salience signal
complementary to the corpus's content-side data.

### 7.4 Multilingual extension

Culturomics in conservation has historically over-relied on
English. The corpus's multilingual quotas (§4.3) and the
`languages` field support multilingual culturomics work, with
the caveat that translation availability and platform reach
differ across languages and confound cross-language comparison.

### 7.5 Symbol and emoji-equivalent tracking

Where research questions require it, parallel collection of
species-related emoji and sticker usage on platforms that publish
such data. Specialised sub-corpus, not part of seed corpus.

### 7.6 Hashtag corpus assembly

For platform-native forms, hashtag aggregation as a complement to
content sampling. Hashtag corpora are noisy but support
event-bounded and longitudinal designs.

### 7.7 Caveats

Culturomics inherits the biases of its source platforms. Search
volume reflects what is *searched for*, not what *should* be
searched for; Wikipedia article length reflects editor effort,
not biological importance. The corpus's integration with
culturomics signal must be interpreted accordingly.

---

## §8 — Ethical concerns

### 8.1 Copyright and fair use

Most artefacts in the corpus are under copyright. Research-use
exceptions (fair use, fair dealing, research-and-private-study
provisions) vary by jurisdiction and by content type. Operating
rules for the seed corpus:

- Metadata is universally collectable.
- Internal copies of full artefacts are made only where
  fair-use / fair-dealing covers the planned research use, and
  retained only as long as the research requires.
- Excerpts in published research are kept within the limits of
  the applicable copyright exception.
- Where the corpus operates under an institutional research
  agreement (university IRB, library, archive), follow that
  institution's compliance framework.
- Corpus distribution to other researchers requires verification
  of the recipient's research-use status.

### 8.2 Platform terms of service

Major platforms restrict automated and bulk collection in
ways that affect research feasibility. Key constraints:

- TikTok: research API exists with restricted access; manual
  collection of public videos is generally permitted; bulk
  scraping is prohibited.
- Instagram: API access for research is restricted; manual
  collection of public content is generally permitted.
- YouTube: research-friendly API; collection within published
  rate limits is permitted.
- Streaming platforms: APIs are not research-friendly; corpus
  inclusion typically requires manual collection of metadata.

The corpus complies with platform terms; where research questions
require non-compliant collection, alternative methods (e.g.,
working with platform-published research datasets, partnering
with the platform under a research agreement) are preferred over
non-compliance.

### 8.3 Producer consent

For institutional producers (broadcasters, NGOs), the corpus does
not require individual consent; their publication of public
content constitutes the licence to be analysed academically. For
individual creators, particularly small accounts, the corpus
practice is:

- Tier 1 canonical creators: research-use is academically
  conventional; no individual consent required.
- Tier 2/3 with substantial audiences (≥10,000 followers /
  subscribers): research-use is academically conventional;
  consent not required but opt-out is honoured.
- Small individual creators (<10,000): consent-or-opt-out
  approach where feasible; exclude from sub-corpora where
  ethical concerns arise.

### 8.4 Subject consent

For content featuring identifiable Indigenous communities, local
non-public actors, or other identifiable individuals where
consent for research use is unclear:

- Such content may not be included in the corpus solely because
  the producer published it. The corpus enforces a more
  restrictive standard than the producer used.
- Where Indigenous communities are subjects, Indigenous data
  sovereignty principles (CARE; OCAP) apply; community
  governance over re-use of community-related material is
  respected.
- Identifying details may be redacted in corpus storage where
  the artefact's content can be analysed without them.

### 8.5 Algorithmic data sourcing

For studies that require algorithmically-mediated content
(e.g., what TikTok surfaces in response to a wildlife query):

- Use ethically-cleaned account profiles, not personal accounts.
- Document the account state at sampling time (location,
  history, watched content) — these confound results.
- Disclose the sampling method in any publication.

### 8.6 Animal-welfare content

Content depicting animal harm — predation, cruelty, scientific
sampling, hunting, fisheries, pest-control — is admissible if
it serves the research purpose and meets the ethics review.
Content procured *through* animal harm (staged or induced) is
not admissible under any circumstances; coding the harm as
present is required.

### 8.7 Researcher safety

Some content (extreme cruelty, exploitation imagery) may cause
researcher harm. The corpus's coder-care practices include:

- Voluntary opt-in for coders working on harm-flagged content.
- Rotation schedules to limit cumulative exposure.
- Access to support resources for vicarious-trauma support.

### 8.8 Data minimisation

The corpus collects only what serves stated research questions.
Unused fields are not added "in case." Field additions require
research-question justification, not anticipated convenience.

### 8.9 IRB / ethics-board review

Any corpus-based study involving human subjects (audience
research, creator interviews, qualitative reception studies)
requires institutional ethics review. Corpus construction itself,
where it remains within publicly-available content and
research-use exceptions, may be exempt at some institutions but
should still be reviewed for consistency with institutional
research-data-management policy.

---

## §9 — Bias risks

The corpus inherits and produces biases. Acknowledging them is
mandatory. Mitigating them is partial.

### 9.1 Anglophone bias

The most easily-corpus-able material is English. The §4.3
multilingual quotas mitigate but do not eliminate this. Coders'
language competencies further constrain the corpus.

### 9.2 Mainstream-platform bias

The corpus excludes Discord, BeReal, regional-only platforms,
WeChat, smaller TikTok-equivalents in non-English-speaking
markets. This is a deliberate seed-corpus simplification with
acknowledged cost.

### 9.3 Search-discoverability bias

The corpus contains what its compilers can find. Compilers'
search habits, language competencies, and platform familiarities
shape the corpus's edge.

### 9.4 Algorithmic-mediation bias

What platforms surface to research-account searchers is itself
shaped by algorithmic choices. Two researchers in different
locations or with different platform histories will surface
different artefacts when searching identical terms.

### 9.5 Survival bias

Deleted, removed, taken-down, or DMCA-stripped content is
invisible to the corpus. The §6.5 mitigation reduces but does
not eliminate this.

### 9.6 Producer-visibility bias

Well-known producers' work is easier to find, archive, and tag.
Small producers, regional producers, and producers in non-
mainstream platforms are systematically under-sampled despite
quota targets.

### 9.7 Self-reporting bias

Producers' claims about reach, effect, and impact (the
`claims_made` field) are systematically biased upward. The
corpus codes this honestly via `evidence_independence`.

### 9.8 Sampling-frame bias

Anything the corpus did not sample for is invisible to
analyses based on the corpus. The corpus version explicitly
documents its sampling frame.

### 9.9 Coder bias

Human coders bring systematic biases. Inter-coder reliability
checks expose some but not all. Diverse coder teams reduce but
do not eliminate. Coding decisions are themselves a research
artefact.

### 9.10 Researcher-positionality bias

The team building the corpus has commitments, priors, and
investments. Positionality should be disclosed in any
publication using the corpus.

---

## §10 — Interpretive limitations

What the corpus *cannot* tell us, even in principle:

1. **Audience reception.** The corpus contains artefacts, not
   reception. Reception requires audience research, which is a
   distinct research design.
2. **Producer intention.** Coding observable techniques does not
   recover what the producer aimed to achieve. Intention can be
   inferred from production contexts but not confirmed without
   producer interviews.
3. **Causation between corpus features and outcomes.** Even
   strong correlations between media features and audience
   outcomes do not establish causation; experimental and
   longitudinal designs are needed for causal claims.
4. **Effects.** The corpus describes the supply side of
   biodiversity-media communication. Effects on viewers require
   matched audience-research.
5. **Counterfactuals.** What biodiversity media is *not* being
   made — the absences at the production level — cannot be
   read off the corpus. Industry-side research is required.
6. **Quality.** The corpus tags techniques present and
   structural-content present; it does not adjudicate quality.
   Whether a particular use of awe-cinematography is *effective*
   is an empirical question the corpus alone cannot answer.
7. **Generalisation.** Claims based on the corpus generalise
   only to the sampling frame. Statements about "biodiversity
   media in general" require triangulation with other corpora
   and research designs.

---

## §11 — Recommendations for the seed corpus

### 11.1 Size and scope

- **Total artefacts:** 300–480, distributed evenly across the 12
  forms.
- **Time window:** primarily 2015–2025, with Tier 1 canonical
  inclusions extending earlier where appropriate.
- **Languages:** at minimum English plus three others; quota
  floor of 30% non-Anglophone production.
- **Subject regions:** at minimum 20% Global South subjects.

### 11.2 Tiering

- **Tier 1 (canonical):** ~3 artefacts per form (~36 total);
  curated, justified individually; deliberately limited so
  canonical-bias is visible.
- **Tier 2 (representative):** ~20–30 per form (~240–360 total);
  the analytical core.
- **Tier 3 (outliers / counterexamples):** ~5–10 per form
  (~60–120 total); deliberately constructed to test analytical
  categories.

### 11.3 Coding pilot

Before scaling, run a pilot coding pass on 50 artefacts (~4 per
form) with at least three coders working independently. Compute
inter-coder reliability (Krippendorff's alpha or comparable) for
each field. Refine codebook with anchored exemplars before
scaling.

### 11.4 Versioning

- Corpus versions are tagged: `v0.1` for the pilot, `v1.0` for
  the first complete seed corpus, semantic versioning thereafter.
- Each artefact records `corpus_version_added` and
  `corpus_version_last_recoded`.
- Corpus state at each version is citable and downloadable
  (within copyright constraints — metadata always; full content
  per licence).

### 11.5 Documentation

The corpus is not just data; it includes:

- This methodology document.
- The codebook with anchored exemplars.
- Inter-coder reliability reports per version.
- Coder positionality statements.
- Decision logs for contested coding cases.
- Per-version release notes.

### 11.6 Open research practice

Where copyright and ethics permit:

- Metadata is openly published.
- Codebook is openly published.
- Coding decisions are documented sufficiently to support
  replication.

Where they do not permit:

- The constraints are documented.
- A "minimum useful subset" of metadata is published openly even
  when the full corpus cannot be.

### 11.7 Storage

- Corpus metadata: structured (JSON, CSV, RDF, or comparable),
  in a versioned repository.
- Captured content: separate storage with access controls
  matching licence and ethics constraints.
- Metadata and content separately accessible — researchers may
  reasonably need metadata-only access.

### 11.8 Access control

- Open to qualified researchers under a usage agreement
  specifying:
  - Research purpose only;
  - No re-distribution of full content;
  - Citation of the corpus version used;
  - Reporting of derived findings to the corpus maintainers.

---

## §12 — Maintenance discipline

### 12.1 Schema stability

The twelve top-level fields in §1 are stable. New sub-fields may
be added under existing fields; the field count and meaning are
preserved across versions.

### 12.2 Vocabulary maintenance

Controlled vocabularies (platforms, biomes, forms, framing modes,
etc.) are maintained per corpus version. New entries require:

- A definition.
- An example artefact.
- A rationale for not folding into an existing entry.

Deprecating a vocabulary entry requires re-coding affected
artefacts in the next corpus version.

### 12.3 Re-coding cycles

Re-coding is required when:

- The narrative-technique taxonomy is authored (re-coding §1.5).
- A controlled vocabulary changes substantively.
- An inter-coder reliability audit reveals systematic drift.
- A field is subdivided.

Re-coding is documented per artefact; previous codings are
preserved for historical analysis.

### 12.4 Lifecycle

The seed corpus has a finite life. Within 2–3 years of the seed
corpus, expect:

- A v2 corpus expansion, larger and more methodologically
  sophisticated.
- Spinoff sub-corpora for specific studies.
- Companion frameworks (narrative-technique taxonomy, habitat-
  coverage typology, bias-measurement framework) authored,
  triggering re-coding.

The seed corpus's success is not its longevity but its capacity
to support good methodological learning that scales into
subsequent corpora.

---

## Closing note

The seed corpus is designed against three failure modes:

1. **Becoming a database that nobody analyses.** Mitigated by
   keeping the corpus small, methodologically clean, and
   genuinely useful for the comparative designs in §5.
2. **Becoming a corpus that reproduces the very biases it should
   make visible.** Mitigated by the counter-bias sampling in §4.9,
   the bias-risks documentation in §9, and the multilingual /
   region quotas in §4.3.
3. **Becoming a vehicle for impact-claim laundering.** Mitigated
   by the rigorous handling of behavioural-change claims in §1.11,
   the four-construct distinction inherited from PR #20, and the
   explicit interpretive limitations in §10.

A seed corpus is a learning instrument. Its first run will reveal
where the schema is too coarse, where the categories are too
fine, where coder agreement is impossible, and where the analyses
the corpus is supposed to support are obstructed by something the
methodology did not anticipate. These are not failures of the
seed; they are its purpose.
