# Exemplar Coding Packets

> Three coded artefacts demonstrating how the corpus methodology
> (PR #21) and the pilot plan (PR #22) actually behave when applied
> to real media. Companion document to the four prior research-matrix
> artefacts.
>
> **Status.** Working draft. Coding decisions reflect a single
> coder's reading and explicitly surface uncertainty.
>
> **Not.** Not a validation that the methodology works. Not analytical
> findings about biodiversity media. The methodology is the subject;
> the artefacts are the test material.

---

## Preamble

### Purpose

The packets exist to expose methodological friction. Three artefacts
were chosen to stress-test the schema progressively:

1. **A canonical case** (Planet Earth II "Mountains"). The schema
   was largely built for this kind of artefact. It should code well
   here. Where it doesn't, the gap is significant.
2. **A documented-harm case** (slow loris "tickling" TikTok genre).
   The artefact's harm complicates inclusion ethics; the schema's
   conservation-framing assumes conservation framing exists; the
   provisional narrative-technique vocabulary lacks platform-native
   patterns.
3. **A boundary case** (*Mountain*, David O'Reilly, 2014). An art
   game with no conventional biodiversity content. Forces the
   question: does the corpus admit ecological-mood / biodiversity-
   adjacent artefacts at all? Most schema fields collapse.

The progression is intentional. Friction escalates from minor (#1)
through structural (#2) to fundamental (#3).

### Coding scope

Each packet uses the twelve fields the user specified, mapped onto
the underlying 12-field schema in `corpus-seed-framework.md` (PR #21
§1). Every field includes explicit uncertainty markers where the
coding is ambiguous. The packets do not pretend confidence the coder
does not have.

### Ethics notes

- **Slow loris artefact:** coded as a *genre exemplar* rather than
  a specific URL. The harm-amplification cost of citing a specific
  high-engagement instance outweighs the marginal analytical gain.
  This is itself a coding decision PR #21 §3 does not explicitly
  address.
- **Coder positionality:** single Anglophone researcher, with
  asymmetric prior knowledge (substantial on broadcast documentary
  and citizen-science platforms; thinner on platform-native short-
  form and on art-game traditions). Positionality affects which
  notable-absences and which counter-evidence the packets surface.

---

## Packet 1 — Planet Earth II, "Mountains"

### 1. Basic metadata

| Field | Value |
|---|---|
| `artefact_id` | pilot-v0.1-001 |
| `title` | "Mountains" (Planet Earth II, Episode 2) |
| `creator` | BBC Natural History Unit (exec. producer Mike Gunton; series producer Tom Hugh-Jones) |
| `producer_country` | GB |
| `platform_primary` | broadcast-bbc |
| `platform_others` | BBC iPlayer; subsequent Netflix/Amazon Prime distribution (varies by region) |
| `date_published` | 2016-11-13 |
| `duration` | ~58 minutes (multi-segment episode) |
| `format` | video |
| `languages` | en (with subtitle tracks) |
| `access_state_at_capture` | paywalled (varies by platform) |
| `archive_status` | metadata-stable; institutional capture for analysis |

### 2. Species categories represented

Primary editorial subject: **snow leopard** (*Panthera uncia*),
documented via multi-year camera-trap effort. Background and
secondary segment subjects: ibex, golden eagle, grizzly bear,
gelada baboon, others.

PR #19 typology cross-tags for the snow leopard segment alone:
**flagship-megafauna, charismatic-predator, documentary-icon,
conservation-campaign, climate-symbol** (montane-altitude shift, in
conservation literature though under-represented in the artefact
itself), **culturally-mythologised** (snow leopard mythology in
Himalayan, Tungusic, and Central Asian traditions). Six tags from
the typology. The episode as a whole stretches across more.

IUCN status note: snow leopard was **Endangered** at broadcast,
**Vulnerable** from late 2017. Coded against broadcast-date status
with note.

### 3. Ecosystem categories

`biome_primary`: alpine / montane.
`biome_others`: arid mountain, glacial.
`representation_state`: pristine-framed (near-no human presence).
`human_presence_in_frame`: none in-frame; narrator-mediated only.

### 4. Narrative techniques

`techniques_present`: **awe-cinematography, predator-prey-suspense,
scientific-authority-narration, intimacy-shot, naturalist-
observation, scarcity-framing, hope-framing**.

`techniques_dominant`: awe-cinematography, predator-prey-suspense.

The provisional vocabulary handles this artefact comfortably; the
artefact is in the canonical zone the vocabulary was designed for.
No vocabulary gap surfaced.

### 5. Emotional framing

`dominant_register`: **awe**.
`secondary_registers`: reverence, suspense, brief grief.
`valence`: positive-leaning-mixed.
`arousal`: high.
`intended_target`: awe + concerned stewardship.

### 6. Conservation framing

`framing_mode`: celebration-with-mention-of-threats.
`threat_visibility`: mentioned-briefly (not structurally explored).
`agency_attribution`: the-species-itself + scientists-as-actors
(via the camera-trap framing).
`solution_framing`: ambiguous — no explicit solution proposed.
`complicity_framing`: **no-complicity-frame** (audience positioned as
awed observer, not implicated).
`named_threats`: poaching, habitat loss (mentioned in passing).
`named_solutions`: none specific.

### 7. Spectacle score

**S = 5 / 5.** Saturated. Near-constant peak; landmark cinematography;
helicopter aerials, slow-motion intercut with intimate ground-level
camera-trap footage. The episode is on the spectacle-saturated end
even by blue-chip standards.

### 8. Ecological-understanding score

**U = 2 / 5.** Isolated facts ("snow leopards live only here";
"a few thousand remain"). No causal mechanism. No trophic context.
No climate-altitude relationship. No socio-ecological framing of
mountain communities or pastoralism.

`balance_classification`: **spectacle-dominant** (S − U = 3).

### 9. Four-construct classification

| Construct | Producer claims? | Independently evidenced? |
|---|---|---|
| Awareness | Implicit (institutional marketing) | Yes — awareness gains documented for major BBC broadcasts |
| Emotional engagement | Implicit | Yes — robustly evidenced |
| Ecological understanding | Not claimed | Not evidenced; the structural content of *this* episode would not support it even if claimed |
| Behavioural change | Not directly claimed | Not robustly evidenced. The "Blue Planet effect" is the related but distinct case; broadcast-documentary behavioural-change literature remains contested |

### 10. Notable absences

- Indigenous mountain communities (Himalayan, Andean, Tibetan).
- Pastoralism and the human-wildlife-conflict context that
  shapes contemporary snow leopard conservation.
- Climate change as cause of altitudinal habitat shift.
- The Pakistan / Afghanistan range (geopolitically inaccessible
  and therefore systematically absent from BBC production).
- The cinematic apparatus itself: the multi-year camera-trap effort
  that produced the snow leopard footage is namechecked in
  marketing but invisible in the artefact.
- Subsequent (2017) IUCN status reclassification.

### 11. Coding ambiguities encountered

- **Multi-segment unit-of-analysis.** The episode is ~5 segments
  (snow leopard, grizzly, gelada, eagles, etc.). Coded the
  snow-leopard segment in detail and the rest at episode-aggregate.
  PR #21 does not specify the rule.
- **IUCN status timing.** Endangered at broadcast; Vulnerable months
  later. Both recorded with timing.
- **Form classification.** Broadcast documentary AND streaming-
  platform production after Netflix licensing. Single classification
  field forces a choice; coded as nature-documentary, dual flagged.
- **Notable absences depend on coder knowledge.** The
  Pakistan/Afghan-range absence and the climate-altitude-shift
  absence required prior background knowledge to surface. A coder
  without that background would miss them. **F7 confirmed.**

### 12. What this reveals about weaknesses in the methodology

- The schema works on its **canonical case**, with minor caveats.
- **Multi-segment-episode unit problem** (new — not in PR #22 §9):
  the schema assumes a single coherent artefact. Episodic broadcast
  with 4–6 distinct segments breaks this assumption. Pilot
  recommends an explicit segment-vs-episode coding rule.
- **Form-classification single-tag insufficiency** (predicted,
  confirmed): broadcast-then-streaming artefacts are routinely dual.
- **Notable-absences coder-burden** confirmed: this single artefact
  required ~30 minutes of additional research to populate the
  field at adequate depth. Codebook will need anchored exemplars
  and explicit guidance on coder-knowledge requirements.

---

## Packet 2 — Slow loris "tickling" TikTok (genre exemplar)

### 1. Basic metadata

| Field | Value |
|---|---|
| `artefact_id` | pilot-v0.1-002 |
| `title` | [genre exemplar; specific instance recorded internally only] |
| `creator` | typically anonymous / pseudonymous; high re-upload rate |
| `producer_country` | undetermined (genre-typical) |
| `platform_primary` | tiktok (also instagram-reels, youtube-shorts) |
| `date_published` | genre spans 2010s onwards; specific instance undateable |
| `duration` | typically 8–30 seconds |
| `format` | video |
| `languages` | typically silent or with English overlay text |
| `access_state_at_capture` | open at capture; high subsequent removal rate |
| `archive_status` | internal capture only; Wayback rarely captures TikTok |

**Coding decision:** treated as a *genre exemplar* rather than a
specific URL. Including a high-engagement instance by URL would
amplify harm beyond research utility. This is a coding choice
PR #21 §3 does not explicitly address; pilot recommends adding
explicit guidance on harm-amplification handling.

### 2. Species categories represented

Primary subject: **slow loris** (genus *Nycticebus*; multiple species
typically conflated).

Confounding factor: the genre rarely names a specific species. The
artefact frequently shows pygmy slow loris (*Xanthonycticebus
pygmaeus*, EN), Sunda slow loris (*N. coucang*, EN), or Javan slow
loris (*N. javanicus*, CR). Conflation of conservation-status-
distinct species into a single "slow loris" identity is itself a
coding fact.

PR #19 typology cross-tags: **internet-viral-species**,
**conflict-species** (with conservation, via pet trade),
**conservation-campaign-species** (anti-trafficking campaigns
specifically reference this genre), and arguably **"ugly"-or-
unpopular-inverted** (genre re-frames a defensive primate as
charming).

### 3. Ecosystem categories

`biome_primary`: **domestic-and-pet-context** (NOT a native biome).
`biome_others`: native habitat (Southeast Asian rainforest) is
**absent**, not "secondary."
`representation_state`: domesticated-context.
`human_presence_in_frame`: pet-owner (typically hands or domestic
interior).

The schema's biome field implicitly assumes the artefact represents
a natural ecosystem. Pet-context artefacts strain this assumption.
Coded as such with explicit note.

### 4. Narrative techniques

`techniques_present`:
- **anthropomorphism** (heavy; arms-up posture coded as "tickling
  response").
- **intimacy-shot** (loris held in hand; near-camera).
- **audio-overdub-anthropomorphism** — **NOT IN PROVISIONAL
  VOCABULARY**. The genre frequently uses overlaid audio
  (cute music, clipped human dialogue, "voiceover" of the animal).
  **F1 confirmed.**
- **no-conservation-frame** (an absence-as-technique coding).

`techniques_dominant`: anthropomorphism, audio-overdub-
anthropomorphism.

**Vocabulary gap:** at least three platform-native techniques
(audio-overdub-anthropomorphism; comment-section-as-technique;
caption-meme-stacking) are not in the provisional vocabulary
and recur across this genre. Pilot recommends additions.

### 5. Emotional framing

`dominant_register`: **amusement / delight**.
`secondary_registers`: surprise; tenderness.
`valence`: positive in audience reception; **negative** in welfare-
aware reading. Schema does not currently support divergent producer-
intended vs welfare-aware valences in a single field.
`arousal`: moderate.
`intended_target`: amusement (producer); concern (welfare-aware
viewer).

### 6. Conservation framing

`framing_mode`: **no-conservation-frame**.
`threat_visibility`: none.
`agency_attribution`: no-agency-attribution.
`solution_framing`: no-solution-suggested.
`complicity_framing`: **no-complicity-frame** — and this is part of
the genre's harm: the audience is positioned as charmed observer,
not implicated in the trafficking pipeline.
`named_threats`: none.
`named_solutions`: none.

**F6 confirmed.** Five of seven sub-fields collapse to "no-X."
Coding produces dense null fields. The schema is structurally
asymmetric: it treats conservation-framing as the unmarked case,
when for a non-trivial portion of biodiversity content this
assumption is false.

### 7. Spectacle score

**S = 3 / 5.** Intense within its short format (peak-emotion micro-
dose); not high production value but high emotional density per
second. Coding the spectacle scale at short-form scale required
recalibration; the anchors in PR #21 §1.9 implicitly assume long-
form pacing. **Pilot recommends scale-anchor extension for short-
form.**

### 8. Ecological-understanding score

**U = 1 / 5.** No structural ecological content of any kind.
Species not named. Native habitat absent. Behaviour misinterpreted.
Conservation status absent. Trafficking pipeline absent.

`balance_classification`: **spectacle-dominant** (S − U = 2).

### 9. Four-construct classification

| Construct | Producer claims? | Independently evidenced? |
|---|---|---|
| Awareness | Not claimed | Implicit awareness produced (slow loris exists) — Google Trends spikes documented |
| Emotional engagement | Not claimed (just produced) | Yes — high engagement documented |
| Ecological understanding | Not claimed | **Negative** — the artefact teaches *incorrect* facts (defensive posture as play; species as pet-friendly) |
| Behavioural change | Not claimed | **Negative** — measurable pet-trade effects documented (Nekaris et al., multiple studies); slow loris seizure data correlates with viral cycles |

The schema's four-construct classification has **no explicit
"negative" value** — only claimed/not-claimed and evidenced/not-
evidenced. This artefact requires the negative case to be
representable. Pilot recommends extending the classification with
a `directional` sub-field: positive / negative / null.

### 10. Notable absences

- Species name(s).
- Conservation status.
- Native habitat (Southeast Asian rainforest).
- The trafficking pipeline (capture, dental removal, transport).
- The defensive-posture-vs-play behaviour fact.
- The producer's relationship to the animal (owner? renter? handler?
  trafficker? rescuer? rarely disclosed).
- The animal's prior history.

The notable-absences field is doing **most of the analytical work**
for this artefact. Without it, the artefact codes as benign.

### 11. Coding ambiguities encountered

- **Inclusion ethics.** Including specific URLs amplifies harm.
  Coded as genre exemplar; pilot recommends explicit harm-
  amplification handling protocol in PR #21 §3.
- **Specific instance vs genre.** The analytical unit is the genre,
  not any single TikTok. Schema codes individual artefacts; the
  genre-as-unit alternative is not specified. **Recurring problem
  (F4-adjacent).**
- **Producer attribution.** Re-uploads, anonymous accounts, deleted
  originals make `creator` underdetermined. The corpus needs an
  "anonymous re-uploader" controlled-vocab path.
- **Schema asymmetry on no-frame.** F6 catastrophic for this
  artefact. Half the conservation-framing sub-fields collapse.
- **Vocabulary gap.** F1 confirmed.
- **Negative-direction outcomes.** Four-construct classification
  has no representational pathway for negative ecological
  understanding or negative behavioural change.

### 12. What this reveals about weaknesses in the methodology

- The schema's **productive content** for documented-harm artefacts
  is the triangulation of *counter-evidence + four-construct
  classification + notable-absences*. These three fields do the
  analytical work; many of the others collapse.
- **F1, F3, F6 all confirmed** by this single artefact.
- **Negative outcomes** must be representable. Schema extension
  required.
- **Genre-as-unit-of-analysis** is a recurring problem (also visible
  in citizen-science platform coding).
- **Harm-amplification coding ethics** require explicit guidance.
  PR #21 §3 currently treats inclusion as a fairness problem
  (exclude under producer opt-out); the harm-amplification case is
  not the same and is unaddressed.

---

## Packet 3 — *Mountain* (David O'Reilly, 2014)

### 1. Basic metadata

| Field | Value |
|---|---|
| `artefact_id` | pilot-v0.1-003 |
| `title` | *Mountain* |
| `creator` | David O'Reilly |
| `producer_country` | IE / US |
| `platform_primary` | itch-io |
| `platform_others` | Steam, App Store, Google Play |
| `date_published` | 2014-07-01 (Steam) |
| `duration` | indefinite (designed as ambient long-session quasi-screensaver) |
| `format` | game |
| `languages` | en (minimal text) |
| `access_state_at_capture` | pay-once (~$1) |
| `archive_status` | stable (commercial product, multiple platforms) |

**Bounding decision:** coded after 60 minutes of observed play.
PR #21 does not specify bounding rules for ambient/infinite-form
artefacts. Pilot recommends a bounding-rules appendix.

### 2. Species categories represented

**None in any conventional sense.** *Mountain* is a procedurally
generated mountain object floating in space, slowly rotating, with
arbitrary objects (eyeballs, telephones, cones, skulls) periodically
appearing. No fauna. No flora.

PR #19 typology cross-tags: **none applicable.** All 17 categories
return null.

The species field collapses entirely. This is the artefact's first
catastrophic schema failure.

### 3. Ecosystem categories

`biome_primary`: **stylised / abstract / non-naturalistic** — not
in the controlled vocabulary; coded as "n/a (artefact represents
no ecosystem)".
`representation_state`: not coherently codable.
`human_presence_in_frame`: occasional human-made objects appear
arbitrarily without ecological context.

Ecosystem field also collapses. The artefact is **biodiversity-
adjacent** (the mountain *might* be ecological in feeling) without
being **biodiversity content** in any operational sense.

### 4. Narrative techniques

`techniques_present`:
- **personification-of-place** (the mountain occasionally "speaks"
  via cryptic on-screen text).
- **naturalist-observation** (the player is positioned as observer).
- **ambient-passive-witness** — **NOT IN PROVISIONAL VOCABULARY**.
  **F1 strongly confirmed.** The provisional vocabulary lacks
  language for the contemplative-ambient register that art games
  exemplify.

`techniques_dominant`: ambient-passive-witness.

### 5. Emotional framing

`dominant_register`: **contemplation**.
`secondary_registers`: melancholy, defamiliarisation.
`valence`: ambiguous.
`arousal`: low.
`intended_target`: contemplation (per creator interviews; not stated
in-artefact).

### 6. Conservation framing

`framing_mode`: **no-conservation-frame**.
`threat_visibility`: none.
`agency_attribution`: no-agency-attribution.
`solution_framing`: no-solution-suggested.
`complicity_framing`: no-complicity-frame.
`named_threats`: none.
`named_solutions`: none.

**All seven conservation-framing sub-fields collapse.** F6
catastrophically confirmed for the second time in three artefacts.

### 7. Spectacle score

**S = 1 / 5.** Deliberately minimalist; near-no cinematic technique;
single procedurally-rendered object on a static background.

### 8. Ecological-understanding score

**U = 1 / 5.** No ecological content of any kind. The mountain
"is."

`balance_classification`: **both-low** (S = U = 1).

This is a meaningful coding outcome — the both-low case validates
the dual-scale design at the floor of both scales — but it raises
the question: **why is this artefact in a biodiversity media
corpus at all?**

### 9. Four-construct classification

| Construct | Producer claims? | Independently evidenced? |
|---|---|---|
| Awareness | Not claimed | Not relevantly evidenced (no biodiversity referent) |
| Emotional engagement | Implicitly (the artefact aims at contemplation) | Partially evidenced via creator interviews and audience reception |
| Ecological understanding | Not claimed | Not evidenced (and could not be — the artefact has no biology) |
| Behavioural change | Not claimed | Not evidenced |

Three of four constructs return null. The fourth (emotional
engagement) is weakly populated.

### 10. Notable absences

The entire conservation-and-ecology vocabulary is absent. The
notable-absences field assumes the artefact represents an ecosystem
with omissions; *Mountain* does not represent an ecosystem, so the
field's underlying logic does not apply. The "absence" here is at a
different level: the artefact is *adjacent to* ecological content
without containing any.

### 11. Coding ambiguities encountered

- **Is this biodiversity media at all?** PR #21 §2 requires
  "substantive biodiversity content." *Mountain* fails this
  threshold by any reasonable reading. Coded as
  `corpus_role: counterexample-of-pattern` and included as a
  stress test, but pilot must decide whether to admit
  ecological-mood / biodiversity-adjacent artefacts at all.
- **Form classification.** "Non-commercial-game" doesn't fit
  (*Mountain* is commercial). "Art-game" is not in the controlled
  vocabulary. Coded under non-commercial-game with explicit note
  that the controlled vocabulary requires extension.
- **Bounding.** *Mountain* is "infinite." Coded after 60 minutes;
  PR #21 needs an explicit bounding rule.
- **All conservation-framing sub-fields null.** F6.
- **Most behavioural-change-claim sub-fields null.** F3 confirmed.
- **Vocabulary gap on technique.** F1 confirmed.
- **Notable-absences logic does not apply.** The field assumes
  representational content; this artefact has none.

### 12. What this reveals about weaknesses in the methodology

- **The schema strongly assumes biodiversity content with narrative
  form.** *Mountain* is neither, and the schema collapses across
  most fields in different ways than for the slow loris artefact.
- **F1, F3, F6 all strongly confirmed.** This artefact's failure
  pattern is dense.
- **The corpus's inclusion criterion needs a sharper edge.** Either
  the corpus admits ecological-mood/biodiversity-adjacent artefacts
  with an explicit `inclusion_basis` field, or it excludes them
  with a clearer rule than PR #21 §2 currently provides.
- **Form-classification controlled vocabulary needs at least one
  addition** ("art-game"). Possibly more.
- **Bounding rule needed** for ambient/infinite-form artefacts.
- **The both-low case validates the dual spectacle/understanding
  scales** — at both ends. This is genuine confirmation that the
  scales work, even when the artefact itself shouldn't be in the
  corpus.

---

## Synthesis: cross-cutting findings

### Failure modes from PR #22 §9 confirmed by this set of three

| Failure | #1 PE-II | #2 slow loris | #3 *Mountain* |
|---|:---:|:---:|:---:|
| F1 narrative-technique vocabulary gap | – | confirmed | confirmed |
| F2 spectacle/understanding scale drift | not tested at depth | scale-anchor short-form gap | both-low edge case validated |
| F3 claim-field over-specification | – | confirmed | confirmed |
| F4 unit-of-analysis | confirmed (multi-segment episode, new sub-case) | confirmed (genre-as-unit) | confirmed (ambient/infinite-form bounding) |
| F5 interactive-form bounding | – | – | confirmed |
| F6 conservation-framing asymmetry | – | confirmed | confirmed catastrophically |
| F7 notable-absences coder-burden | confirmed | confirmed | n/a (logic doesn't apply) |
| F8 effort overrun | not yet measured | not yet measured | not yet measured |
| F9 archive instability | – | confirmed (TikTok deletion rate) | – |
| F10 researcher positionality | confirmed (snow leopard range knowledge required) | confirmed (welfare literature knowledge required) | confirmed (art-game tradition knowledge required) |

Eight of ten predicted failure modes confirmed by three artefacts.
This is a successful pilot result against §10 success criterion S5
("at least three failure modes confirmed and documented") —
exceeded threefold.

### New failure modes surfaced (not in PR #22 §9)

- **F11. Form-classification single-tag insufficiency.** Broadcast-
  then-streaming artefacts and multi-functional platforms both push
  back on single-classification.
- **F12. Negative-direction outcomes unrepresentable.** The four-
  construct classification has no path for negative ecological
  understanding or negative behavioural change. Slow loris
  artefact requires this.
- **F13. Producer attribution model insufficient.** Channel-vs-
  individual-creator and anonymous-re-uploader cases both lack a
  clean controlled-vocab path.
- **F14. Genre-as-unit-of-analysis.** Distinct from F4. Some
  artefacts are most analytically meaningful at the genre level,
  not the instance level. PR #21 codes individual artefacts; the
  genre-as-unit alternative is unspecified.
- **F15. Harm-amplification inclusion ethics.** PR #21 §3 addresses
  fairness (producer opt-out) but not harm amplification.
  Documented-harm content needs explicit handling.
- **F16. Short-form vs long-form spectacle scale calibration.**
  The 1–5 anchors in PR #21 §1.9 implicitly assume long-form
  pacing. Short-form requires recalibrated anchors.
- **F17. Inclusion criterion edge.** PR #21 §2's "substantive
  biodiversity content" threshold is operationally vague at the
  ecological-mood / biodiversity-adjacent edge.

### Schema fields the packets validate

- **Spectacle vs ecological-understanding dual scales** (PR #21
  §1.9). Discriminates meaningfully across the three artefacts:
  PE-II "Mountains" (5/2, spectacle-dominant), slow loris (3/1,
  spectacle-dominant), *Mountain* (1/1, both-low). The scale's
  design produces analytically useful results.
- **Notable absences field** (PR #21 §1.3). For artefacts where
  it applies, this field carries substantial analytical weight —
  for the slow loris artefact, it carries *most* of the
  analytical weight.
- **Counter-evidence sub-field** (PR #21 §1.11). Critical for the
  slow loris artefact and for any documented-harm or contested-
  claim artefact. Without it, harm-positive artefacts code as
  benign.

### Schema amendments recommended for the next methodology revision

1. Vocabulary additions: `audio-overdub-anthropomorphism`,
   `caption-meme-stacking`, `comment-section-as-technique`,
   `ambient-passive-witness`, `non-anthropocentric-perspective`.
2. Form-classification controlled vocabulary additions:
   `art-game` distinct from `non-commercial-game`.
3. Multi-classification for broadcast-then-streaming artefacts.
4. Explicit segment-vs-episode coding rule for episodic broadcast.
5. Bounding-rules appendix for interactive / ambient / infinite-form
   artefacts.
6. Explicit "platform-form" schema branch (or extended fields) for
   citizen-science platforms, biodiversity databases, and
   interactive systems where narrative-form fields collapse.
7. Negative-direction sub-field on the four-construct classification.
8. "Anonymous re-uploader" path in the producer attribution model.
9. "Channel-vs-narrator" attribution distinction.
10. Harm-amplification handling protocol in §3 inclusion/exclusion.
11. Short-form scale anchors for spectacle/understanding.
12. Ecological-mood / biodiversity-adjacent inclusion criterion
    sharpened, or explicit refusal added.
13. Conservation-framing field structure: either symmetric
    (no-frame as equally weighted), or a single boolean
    short-circuit so eight sub-fields don't collapse to null.

### What three artefacts do not tell us

- Inter-coder reliability. Single coder; no agreement statistics.
- Effort distribution at scale. Three artefacts ≠ effort estimate.
- Whether amendments above are sufficient or whether further
  amendments are needed. Only a full pilot of ~30 artefacts can
  surface the rest.
- Whether the methodology is ready to scale. Three artefacts
  expose a substantial fraction of the predicted failure modes
  but do not exhaust the schema; the full pilot per PR #22 is
  still required.

### What three artefacts do tell us

The methodology is **operational but incomplete**. Of the schema's
twelve fields, four (spectacle/understanding dual scales; notable
absences; counter-evidence sub-field; four-construct classification
with the negative-direction extension) carry most of the analytical
weight across the three artefacts. Several others (conservation-
framing structure; producer attribution; form classification)
require structural revision before scaling.

The escalation pattern across the three artefacts — minor friction
on a canonical case, structural friction on a documented-harm case,
fundamental friction on a boundary case — is itself the most
informative finding. The methodology fails predictably and
asymmetrically; it fails *more* the further the artefact lies from
the long-form narrative-documentary form the schema was implicitly
built around.

---

## Closing note

These three packets are not the pilot. They are demonstrations that
the pilot is worth running. The full pilot per PR #22 will surface
failure modes these three did not exercise — and will surface
additional new failure modes not anticipated here. The packets'
purpose is fulfilled if they make the case that *executing* PR #22
is a more productive next step than *amending* PR #21 from the desk.

The schema needs amending. But the amendments should be derived
from coding evidence at corpus scale, not from three packets and
prior reasoning. Three packets justify the pilot. The pilot
justifies the amendments.
