# Paper 1 — Master Coding Manual
## Version 1.0 | Operational Reference for Primary and Secondary Coders

**Study:** Objects and aims in environmental games scholarship: a scoping review of ecological engagement and stated contributions, 2001–2025
**Corpus:** 380 papers
**Variables:** ER (Ecosystem Register), KF (Knowledge Framework), NC (Normative Claim Level)
**Version history:** v1.0 issued after Training Set A calibration (10 papers, 30 decisions, 93.3% first-attempt code accuracy)

---

# PART 1: MASTER CODING HANDBOOK

---

## 1.1 What you are coding

For each paper in the corpus, you assign three codes:

- **ER** — the relationship between the paper's primary game object and documented real-world biodiversity
- **KF** — the epistemological tradition governing the paper's stated research question
- **NC** — the highest level of real-world consequence the paper explicitly claims for its findings

**Coding unit:** the paper's primary game object — the game or game world the paper is primarily analyzing. Not the paper's method. Not the paper's theoretical framework. The game.

**Source hierarchy:** Title first. Abstract if title is insufficient. Full text only if abstract is unavailable or still insufficient. Document which source was used in the `abstract_accessed` field.

**Coding order:** Always ER → KF → NC. Never reverse this order.

---

## 1.2 Step 0 Checklist (mandatory before any decision tree)

Before entering Q1 of the ER tree, answer both questions:

**Q0a: Can I name the primary game?**

- If YES: proceed to Q1 with that game as the coding unit.
- If NO: STOP. Abstract required before proceeding. Do not assign an ER code against an unknown coding unit. (HB-2)

**Q0b: Does this game have a biological ecosystem — species communities, food webs, habitats, or biodiversity-relevant ecological processes?**

- If YES: proceed to Q1.
- If NO: the game has no biological ecosystem. Assign ER-0 directly. Do not enter Q1. (HB-6)

Games that typically trigger Q0b=No: The Sims, Civilization, SimCity, FarmVille, social simulations, management games where "ecology" appears in the paper as a theoretical metaphor rather than a reference to in-game biodiversity.

---

## 1.3 Variable 1: Ecosystem Register (ER)

### Operational definition

The degree to which the paper's primary game object is connected to verifiable, place-specific, documented biodiversity. Codes 0–4, ordered from least to most ecologically grounded. **Code the game, not the paper's method.**

| Code | Label | Core criterion |
|---|---|---|
| ER-0 | Fully fictional | Invented creatures and worlds; no real biological ecosystem analog intended |
| ER-1 | Fictional with real echoes | Fictional creatures or worlds derived from or mapped to real taxa or ecological types |
| ER-2 | Real species, no place | Real species named in the game, but no specific geographic location |
| ER-3 | Real species, biome class | Real species in a named biome type, not a specific named place |
| ER-4 | Real species, real place | Real species in a named, geolocatable, documented ecosystem |

### ER Decision Tree

```
STEP 0 — Complete checklist above before entering Q1.

Q1 — Does the game's ecosystem consist ENTIRELY of invented species
     in invented worlds, with no intended biological analog?

     YES → CODE: ER-0  ← STOP HERE

     NO  → Continue to Q2

Q2 — Are the game's creatures or environments fictional
     but derived from or mapped to real taxonomic groups,
     ecological types, or real landscape categories?

     YES → CODE: ER-1  ← STOP HERE

     NO  → Continue to Q3

Q3 — Does the paper name at least one real species
     (by common or scientific name) as an actual organism
     in the game's represented world?

     NO  → CODE: ER-1  ← STOP HERE

     YES → Continue to Q4

Q4 — Does the paper identify a specific real-world location
     where these species exist?

     NO  → CODE: ER-2  ← STOP HERE. DO NOT PROCEED TO Q5.

     YES → Continue to Q5

Q5 — Is that location a biome CLASS
     (e.g., "coral reef", "tropical rainforest", "boreal forest")
     rather than a named specific place?

     BIOME CLASS    → CODE: ER-3  ← STOP HERE
     NAMED PLACE    → CODE: ER-4  ← STOP HERE
```

**Critical branch rule:** Q4=No exits at ER-2. Q5 does not exist on a Q4=No path. This is the most common path-overrun error. After answering Q4=No, write the code and stop. (HB-5)

**Terminal branch check:** After reaching any code, verify: (a) the current branch is terminal, (b) you have not stopped before the stated exit, (c) you have not continued past the exit. (HB-4)

### ER Confidence Rules

| Level | Condition |
|---|---|
| High | Game named in title; ER path clear without abstract |
| Medium | Abstract required; named game identified from abstract; ER path clear |
| Low | Coding unit is a category after abstract review; OR ambiguous after abstract; flag for joint discussion |

**Confidence ceiling rule (HB-8):** When the coding unit remains a category of games (not a named game) after abstract review, ER confidence cannot exceed Low. This applies to papers studying "online games," "green games," "hunting games," "video games generally," or any unspecified game category.

**Confidence rule for multi-game papers (HB-9):** In papers studying multiple named games, confidence reflects the weakest individual game evaluation among those games, not the degree of emphasis on any one game.

### Multi-game rule

If the paper studies multiple games:
1. Evaluate ER for each named game independently.
2. Assign the **highest ER level present** across all games.
3. Record all game titles in `coder_notes`.
4. Set confidence to the weakest individual confidence level.

Emphasis on one game does not change the ER assignment. The rule codes highest level present, regardless of which game receives more analysis.

### ER Worked Examples

| Paper | Game | Q path | Code | Conf | Rationale |
|---|---|---|---|---|---|
| Ulman2001 | Early online virtual worlds | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | Medium | Abstract required; fictional online worlds echoing real landscapes |
| Balmford2002 | Pokémon | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | High | Title names game; fictional creatures with real taxon echoes |
| Molloy2011 | Hunting simulation games | Q0b=Yes; Q1=No; Q2=No; Q3=Yes; Q4=No | ER-2 | Medium | Real animal species; no named geographic location |
| Weagly2013 | Minecraft | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | High | Fictional world echoing real ecological types |
| Bainbridge2014 | Pokémon | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | High | Established precedent |
| Bianchi2014 | The Sims | Q0b=No | ER-0 | High | No biological ecosystem in The Sims; "ecology" is metaphorical |
| Caciuc2014 | Online games (MMORPGs) | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | Low | Category coding unit remains after abstract review |
| Attebery2015 | Pikmin + Pokémon | Q0b=Yes; Q1=No; Q2=Yes (both) | ER-1 | Medium | Multi-game; both ER-1; confidence from weaker Pikmin evaluation |
| Condis2015 | Multiple games (category) | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | Low | Category coding unit after abstract review |
| Parham2015 | Green games (category) | Q0b=Yes; Q1=No; Q2=Yes | ER-1 | Low | Category coding unit after abstract review |

**ER-0 additional examples:** The Sims series · SimCity · Civilization (uses real geography but no biodiversity) · FarmVille · Papers using "ecology" as systems/media metaphor

**ER-4 examples:** Never Alone / Kisima Ingitchuna (Alaskan tundra, Iñupiaq territory) · Thunderbird Strike (Great Lakes watershed, documented pipeline corridor) · Any paper naming a geolocatable ecosystem with real documented species

---

## 1.4 Variable 2: Knowledge Framework (KF)

### Operational definition

The primary epistemological tradition governing the paper's stated research question — the framework that determines what the paper counts as evidence for its central claim. Code the framework governing the research question, not the framework cited most in the literature review.

**Primary KF rule:** Read the abstract's stated aim or research question. Ask: *what kind of evidence would confirm or disconfirm this claim?* That identifies the primary framework.

**Co-primary flag:** When two frameworks govern the research question with genuinely equal weight, record `kf_primary` as the dominant code and add `kf_coprimary` as the secondary. Document reasoning in `coder_notes`.

| Code | Label | Governing question type | Typical evidence |
|---|---|---|---|
| KF-A | Ecocritical / literary | How does this game text represent ecology/nature? | Textual analysis, narrative theory, close reading, posthumanism, ecocriticism |
| KF-B | Scientific / STEM | What taxonomy/species does this game contain, or how does it serve science learning? | Classification, taxonomic comparison, scientific accuracy assessment |
| KF-C | Indigenous / TEK | How does this game engage Indigenous ecological knowledge or land relationships? | ILK, decolonial theory, community-grounded analysis |
| KF-D1 | Theoretical conservation | Can/should games support conservation outcomes? | Argument, theoretical synthesis, no participant data |
| KF-D2 | Empirical conservation | Do games produce conservation outcomes? | Human-participant surveys, experiments, observations |
| KF-E | Design / systems | How do game mechanics produce ecological meaning? | Procedural analysis, systems design |
| KF-F | Other / unclear | Cannot be determined from available metadata | — |

### KF Decision Tree

```
Q1 — Does the research question primarily ask an interpretive,
     aesthetic, narrative, or ethical question about the game
     as a CULTURAL TEXT?

     YES → CODE: KF-A  ← STOP HERE

     NO  → Continue to Q2

Q2 — Does the research question primarily ask a SCIENTIFIC
     or TAXONOMIC question, or use games as a vehicle for
     STEM literacy or science education?

     YES → CODE: KF-B  ← STOP HERE

     NO  → Continue to Q3

Q3 — Does the research question primarily engage INDIGENOUS
     knowledge systems, Traditional Ecological Knowledge,
     decolonial ecology, or specific Indigenous community
     ecological practices?

     YES → CODE: KF-C  ← STOP HERE

     NO  → Continue to Q4

Q4 — Does the research question primarily ask whether games
     produce, can produce, or should produce real-world
     CONSERVATION, BEHAVIORAL, or ATTITUDINAL outcomes?

     NO  → Continue to Q5

     YES → Q4a: Does the paper collect data from REAL HUMAN
                 PARTICIPANTS? (surveys, experiments, interviews,
                 field observation of behavior)

                 YES → CODE: KF-D2  ← STOP HERE
                 NO  → CODE: KF-D1  ← STOP HERE

Q5 — Does the research question primarily analyze GAME DESIGN,
     PROCEDURAL MECHANICS, or SYSTEMS as meaning-production?

     YES → CODE: KF-E  ← STOP HERE

     NO  → CODE: KF-F  ← STOP HERE
```

### KF-D1 vs KF-D2 Trigger-Word Check (HB-R4)

Before assigning KF-D1, scan the abstract for these words: **survey · participants · respondents · n= · measured · experiment · sample · questionnaire · data collected · interviews.**

If any are present, KF-D2 is a candidate. Confirm participant data before assigning D2. Do not upgrade on journal prestige alone — but a paper in *Science*, *Ecosphere*, *CHI*, or *PLOS ONE* making conservation claims warrants abstract review.

### KF Worked Examples

| Paper | Code | Rationale |
|---|---|---|
| Ulman2001 | KF-A | Ecocritical comparative media analysis; interpretive question about how nature is represented |
| Balmford2002 | KF-D2 | Conservation question + child survey data (n=109); trigger words present in abstract |
| Molloy2011 | KF-A | Ethical/aesthetic analysis of hunting representation in cultural texts |
| Weagly2013 | KF-B | Scientific comparison of game element (Minecraft dirt) to real soil science |
| Bainbridge2014 | KF-A | Cultural studies analysis of Pokémon franchise and environment |
| Bianchi2014 | KF-A | Theoretical/rhetorical analysis of game ecologies using cultural systems framework |
| Caciuc2014 | KF-A | Philosophical and ethical reflection on ecological ethics in online games |
| Attebery2015 | KF-A | Posthumanist analysis; companion species (Haraway), biopower (Foucault) |
| Condis2015 | KF-A | Environmental humanities disciplinary argument; interpretive claim about games as environmental texts |
| Parham2015 | KF-A | Ecocritical concept of inhabitation applied to green games |

---

## 1.5 Variable 3: Normative Claim Level (NC)

### Operational definition

The highest level of real-world consequence the paper **explicitly states** for its findings in the abstract's contribution statement or conclusion. Code from the contribution, not the framing.

| Code | Label | Defining criterion | Signal phrases |
|---|---|---|---|
| NC-1 | Descriptive | Describes, analyzes, or interprets game content | "this paper analyzes / examines / argues that [game] represents" |
| NC-2 | Behavioral / pedagogical | Explicitly claims games can, do, or should produce ecological learning or changed attitudes | "games can build awareness / this game serves as a vehicle for learning / we demonstrate improved outcomes" |
| NC-3 | Conservationist / policy | Explicitly claims games can, do, or should produce conservation outcomes or policy change | "lessons for conservation / games support biodiversity goals / implications for environmental policy" |

**Scale:** NC-1, NC-2, NC-3 only. NC-0 does not exist. NC-1 is the floor code. (HB-3)

### NC Decision Tree

```
Q1 — Does the paper EXPLICITLY STATE that games can, do, or
     should produce any real-world effect on players or audiences?
     (behavioral change, attitude change, learning, awareness)

     NO  → CODE: NC-1  ← STOP HERE (floor rule applies)

     YES → Continue to Q2

Q2 — Does that claim operate at POPULATION / CONSERVATION-PRACTICE /
     POLICY level — beyond individual attitudes, toward societal,
     institutional, or conservation-sector outcomes?

     YES → CODE: NC-3  ← STOP HERE

     NO  → CODE: NC-2  ← STOP HERE
```

### NC Floor Rule (HB-3)

When in doubt, code NC-1. The burden of evidence is on upgrading. NC-1 is not a positive assertion that the paper claims to be descriptive — it is assigned when no explicit audience-effect claim is present.

### NC Confidence Rules (HB-R3)

| Level | Condition |
|---|---|
| High | Abstract reviewed AND closing claim type confirmed in abstract as clearly NC-1 |
| Medium | Title-only coding; OR abstract reviewed but closing claim type not confirmed; OR ethical genre creates residual NC-2 risk |
| Low | Ambiguous after abstract; flag for joint discussion |

**Title-only NC confidence maximum: Medium.** NC confidence can only reach High when: (a) abstract has been reviewed AND (b) the closing claim type is explicitly identifiable from the abstract.

### Genre Traps for NC

**Ecocritical/environmental humanities trap:** Papers in this genre frequently open with NC-3 framing ("in an era of biodiversity crisis, games matter") but contribute at NC-1 (a close reading of one game). Code from the stated **contribution**, not the opening framing. The contribution is typically in the final paragraph of the abstract or the paper's conclusion.

**Posthumanist/theoretical trap:** "Coshaping," "entanglement," "more-than-human" language implies mutual constitution of game and biology. This is an ontological/theoretical claim, not an audience-effects claim. Mutual constitution ≠ games producing measurable effects on players.

**Disciplinary-call-to-arms trap:** "Scholars should take games seriously as environmental texts" is a meta-scholarly claim directed at academics, not an audience-effects claim. This does not trigger NC-2.

**Ethics-of-killing trap:** Ethical analyses of hunting or killing in games may argue that representations normalize violence toward animals. If this normalization argument includes an explicit statement about measurable audience outcomes (desensitization, attitude change), code NC-2. If it is a theoretical observation about representation, code NC-1.

### NC Worked Examples

| Paper | Code | Conf | Rationale |
|---|---|---|---|
| Ulman2001 | NC-1 | Medium | Comparative media analysis; no explicit audience-effect claim |
| Balmford2002 | NC-3 | High | Explicit conservation-sector recommendation: "conservationists should heed" — directed at institutions |
| Molloy2011 | NC-1 | Medium | Ethical critique of hunting representation; no explicit audience-effects statement in abstract |
| Weagly2013 | NC-1 | Medium | Scientific comparison; no educational recommendation in abstract |
| Bainbridge2014 | NC-1 | Medium | Cultural studies analysis; no explicit audience-effects claim |
| Bianchi2014 | NC-1 | High | Abstract explicitly shows closing claim is theoretical/systemic; not audience-oriented |
| Caciuc2014 | NC-1 | Medium | Ethical reflection; no explicit audience-effects claim in abstract |
| Attebery2015 | NC-1 | Medium | Posthumanist ontological argument; no measurable audience-effects claim |
| Condis2015 | NC-1 | High | Abstract explicitly shows closing claim is directed at environmental humanities scholars |
| Parham2015 | NC-1 | Medium | Phenomenological claim about inhabitation; "coming to understand" near boundary but no explicit audience-effect |

---

## 1.6 Complete Handbook Rules

| # | Rule | Source |
|---|---|---|
| HB-1 | Q1 of the ER tree tests whether the ecosystem is entirely fictional with no biological analog — not the degree of ecological documentation. Documentation level is determined by Q3–Q5, not Q1. | Training Set A |
| HB-2 | If the primary game is not identifiable from the title, flag the coding unit as unknown and require abstract review before traversing any decision tree. Do not assign an ER code against an unknown object. | Training Set A |
| HB-3 | NC-1 is the floor code. It is not a positive assertion. It is assigned when no explicit audience-effect claim is present. NC-0 does not exist. NC codes are 1, 2, 3 only. | Training Set A |
| HB-4 | After reaching any code, verify: (a) the branch is terminal at that question, (b) you have not stopped before the exit, (c) you have not continued past the exit. | Training Set A |
| HB-5 | Q4=No exits at ER-2. Q5 is only traversed when Q4=Yes. Q5 tests biome class vs. named specific place — it does not test documentation level or data infrastructure. | Training Set A |
| HB-6 | If a game contains no biological ecosystem — no species communities, no food webs, no biodiversity-relevant ecological processes — then Q1=Yes → ER-0. The absence of a biological ecosystem is the reason to answer Yes, not No. | Training Set A |
| HB-7 | Do not invent decision tree questions. Every code must be reached via a path that exists in this handbook. Inventing an additional Q3 or Q5 produces systematic errors across the corpus. | Training Set A |
| HB-8 | When the coding unit remains a category of games after abstract review, ER confidence cannot exceed Low. A named game resolved from the abstract supports Medium. A genre or platform category does not. | Training Set A |
| HB-9 | In multi-game papers: code the highest ER level present across all studied games. Confidence reflects the weakest individual game evaluation. The degree of emphasis on any one game does not change the ER assignment or confidence level. | Training Set A |
| HB-R1 | Step 0 checklist before every ER tree entry: (a) Can I name the primary game? (b) Does this game have a biological ecosystem? If (a)=No → abstract required. If (b)=No → ER-0 directly. | Training Set A |
| HB-R2 | Q4=No is a terminal branch. Mark "STOP HERE" explicitly after writing the ER-2 code to prevent path overrun. | Training Set A |
| HB-R3 | NC confidence can only reach High when: (a) abstract has been reviewed AND (b) the closing claim type is explicitly identifiable from the abstract. Title-only NC coding is maximum Medium confidence. | Training Set A |
| HB-R4 | Before assigning KF-D1, scan the abstract for: survey · participants · respondents · n= · measured · experiment · sample · questionnaire. If any are present, KF-D2 is a candidate — confirm before committing D1. | Training Set A |
| HB-R5 | ER-0 is not limited to fantasy/action games. Social simulations (The Sims, SimCity, Civilization, FarmVille) and games where "ecology" appears as a theoretical metaphor also receive ER-0 when the game contains no biological ecosystem. | Training Set A |

---

# PART 2: PRIMARY CODING SPREADSHEET SPECIFICATION

---

## 2.1 File naming

**Primary coder:** `paper1-coding-[initials]-[date].csv` (e.g., `paper1-coding-TV-2026-07-01.csv`)

**Second coder (IRR subsample only):** `paper1-coding-irr-[initials]-[date].csv`

**Encoding:** UTF-8 with BOM (Excel-compatible). Generated from `paper1-coding-starter.csv`.

---

## 2.2 Column specifications

| Column | Type | Allowed values | Notes |
|---|---|---|---|
| `paper_id` | Text | Pre-assigned | author+year, suffixed a/b/c for duplicates. Do not modify. |
| `first_author` | Text | Pre-assigned | As in corpus. Do not modify. |
| `publication_year` | Integer | Pre-assigned | Do not modify. |
| `title` | Text | Pre-assigned | Do not modify. |
| `publication` | Text | Pre-assigned | Venue name. Do not modify. |
| `period` | Categorical | 2001-2015 / 2016-2019 / 2020-2022 / 2023-2025 | Pre-assigned. Do not modify. |
| `game_primary` | Text | Free text | Name of the primary game studied. Leave blank only if abstract review was completed and no game is identifiable. |
| `franchise` | Categorical | Pokémon / AnimalCrossing / Minecraft / FinalFantasy / RDR2 / NeverAlone-Thunderbird / Horizon / LastOfUs / StardewValley / BeyondBlue / TheSims / Pikmin / Civilization / None / Other-named | Auto-detected; verify and correct. Use "Other-named" for any franchise not in this list. |
| `er_code` | Integer | 0 / 1 / 2 / 3 / 4 | Required. No blank cells after coding. |
| `er_confidence` | Categorical | High / Medium / Low | Required. See §1.3 confidence rules. |
| `kf_primary` | Categorical | A / B / C / D1 / D2 / E / F | Required. No blank cells after coding. |
| `kf_coprimary` | Categorical | A / B / C / D1 / D2 / E / F / — | Use "—" when not applicable. |
| `nc_level` | Integer | 1 / 2 / 3 | Required. No blank cells after coding. NC-0 is not valid. |
| `abstract_accessed` | Boolean | Y / N | Set to Y when you open the abstract. Default N. |
| `indigenous_paper` | Categorical | Y / N / Uncertain | Keyword-detected; verify manually. |
| `pokemon_cluster` | Boolean | Y / N | Venue-detected for JGS/A Bruxa/American Entomologist/I Colóquio. Verify. |
| `irr_sample` | Boolean | Y / — | Y = this paper is in the random 76-paper IRR subsample. Pre-assigned. Do not modify. |
| `training_set` | Categorical | A / B / — | A = Training Set A (10 papers). B = Training Set B (10 papers). Pre-assigned. |
| `coder_notes` | Text | Free text | Edge cases, secondary games, multi-game rule applications, uncertainty reasons, Low-confidence flags. Required for all Low-confidence papers. |

---

## 2.3 Validation rules

Apply these validation constraints in Excel or Google Sheets before beginning coding:

| Column | Validation rule |
|---|---|
| `er_code` | Integer in {0, 1, 2, 3, 4} — reject any other value |
| `er_confidence` | Text in {High, Medium, Low} — case-sensitive |
| `kf_primary` | Text in {A, B, C, D1, D2, E, F} |
| `kf_coprimary` | Text in {A, B, C, D1, D2, E, F, —} |
| `nc_level` | Integer in {1, 2, 3} — reject 0 and reject any value > 3 |
| `abstract_accessed` | Text in {Y, N} |
| `indigenous_paper` | Text in {Y, N, Uncertain} |
| `pokemon_cluster` | Text in {Y, N} |

**Quality gate:** Before submitting the spreadsheet for analysis, run a completeness check: every paper must have non-blank values in `er_code`, `er_confidence`, `kf_primary`, `nc_level`, and `abstract_accessed`.

---

## 2.4 Coder notes structure

`coder_notes` should record, where applicable:

- **Multiple games:** "Multi-game: [game1] ER-[x], [game2] ER-[y]. Highest applied."
- **Low confidence:** "Low-conf: coding unit = [category]. Abstract does not identify primary game."
- **Edge cases:** "Edge: [description of the ambiguity and which handbook rule was applied]"
- **Co-primary KF:** "Co-primary: kf_primary=[X] governing research question; kf_coprimary=[Y] governing literature framework"
- **Abstract required:** "Abstract accessed [date]. Source: [Semantic Scholar / Google Scholar / full text]"

Minimum coder_notes requirement: any paper coded Low confidence for any variable must have a coder_notes entry explaining the source of uncertainty.

---

# PART 3: IRR PACKAGE

---

## 3.1 Second-coder instructions

You are a second coder for a scoping review of 380 scholarly works on biodiversity and digital games. Your role is to code an independent subsample of 76 papers on three variables (ER, KF, NC) using the decision trees in this manual.

**What you are NOT doing:**
- Reading full papers. Title and abstract are your primary sources.
- Making judgment calls about paper quality. You are applying a defined coding scheme.
- Consulting with the primary coder during coding. Independence is required for IRR validity.

**What you ARE doing:**
- Applying three decision trees to each paper in sequence (ER → KF → NC)
- Assigning confidence levels per the rules in §1.3, §1.4, §1.5
- Documenting edge cases in coder_notes
- Returning your completed sheet by **July 19, 2026**

**Time estimate:** 6–8 hours total. Recommended: two 3–4 hour sessions.

---

## 3.2 Training protocol

Complete both training stages before beginning the IRR subsample.

### Stage 1 — Answer-key coding (Training Set A, ~45 minutes)

Code the following 10 papers independently using this manual. Record all three codes and confidence levels before consulting the answer key.

| Paper | Venue |
|---|---|
| Ulman (2001) "Beyond Nature/Writing: Virtual Landscapes Online, in Print, and on the Land" | Beyond Nature Writing |
| Balmford (2002) "Why Conservationists Should Heed Pokémon" | Science |
| Molloy (2011) "Hunted: Recreational Killing" | Popular Media and Animals |
| Weagly (2013) "Dirt, not soil: A unit analysis of 'Minecraft' dirt blocks and their relationship to natural soil" | Dissertation |
| Bainbridge (2014) "'It is a Pokémon world': The Pokémon franchise and the environment" | International Journal of Cultural Studies |
| Bianchi (2014) "Rhetoric and recapture: Theorising digital game ecologies through EA's The Sims series" | Green Letters |
| Caciuc (2014) "Reflections on the Ecologic Ethics in Online Games" | International Journal of Social and Human Sciences |
| Attebery (2015) "Coshaping Digital and Biological Animals: Companion Species Encounters and Biopower in the Video Games Pikmin and Pokémon" | Humanimalia |
| Condis (2015) '"Live in Your World, Play in Ours": Video Games, Critical Play, and the Environmental Humanities' | Resilience |
| Parham (2015) "Green Computer Games: To Play is to Inhabit" | Green Media and Popular Culture |

**Training Set A answer key:**

| Paper | ER | KF | NC | ER-conf | KF-conf | NC-conf |
|---|---|---|---|---|---|---|
| Ulman2001 | 1 | A | 1 | Medium | High | Medium |
| Balmford2002 | 1 | D2 | 3 | High | High | High |
| Molloy2011 | 2 | A | 1 | Medium | High | Medium |
| Weagly2013 | 1 | B | 1 | High | High | Medium |
| Bainbridge2014 | 1 | A | 1 | High | High | Medium |
| Bianchi2014 | 0 | A | 1 | High | High | High |
| Caciuc2014 | 1 | A | 1 | Low | High | Medium |
| Attebery2015 | 1 | A | 1 | Medium | High | Medium |
| Condis2015 | 1 | A | 1 | Low | High | High |
| Parham2015 | 1 | A | 1 | Low | High | Medium |

**Acceptable performance:** 8/10 papers with all three codes correct. One full disagreement on ER is acceptable if the adjacent level was coded (ER-0/ER-1 or ER-1/ER-2). If fewer than 8 are correct, identify which handbook rule you misapplied, re-read that section, and code 5 additional targeted papers before proceeding to Stage 2.

### Stage 2 — Pilot coding (Training Set B, ~45 minutes)

Code these 10 papers independently, then discuss with the primary coder before proceeding to the IRR subsample.

| Paper | Venue |
|---|---|
| Tomotani (2014) "Robins, robins, robins" | Journal of Geek Studies |
| Backe (2014) "Greenshifting Game Studies: Arguments for an Ecocritical Approach to Digital Games" | First Person Scholar |
| Sandbrook (2015) "Digital Games and Biodiversity Conservation" | Conservation Letters |
| Lemonnier (2015) "Écofiction au sein de l'univers Pokémon" | Jeunes et Médias |
| Brown (2014) "The Garden in the Machine" | Philological Quarterly |
| Acorn (2009) "The Pokémon Paradox" | American Entomologist |
| Woolbright (2015) "Where the wild games are" | Ecomedia: Key Issues |
| Clary (2004) "Digital Nature: Uru and the Representation of Wilderness" | Works and Days |
| Jepson (2015) "Nature apps: Waiting for the revolution" | Ambio |
| Hobbs (2019) "Science Hunters: Teaching Science Concepts in Schools" | ARISE |

**Pilot session goal:** For every disagreement, both coders apply the relevant decision tree question by question. The first question that produced different answers is the resolution point. The handbook rule governs — not seniority. If the handbook does not resolve the case, document it as a new edge case and the primary coder assigns a provisional code.

**Proceed to main IRR if:** ER agreement ≥ 80% (8/10). If below, identify the failing boundary, re-read the relevant handbook section, and code 5 more targeted papers before proceeding.

---

## 3.3 IRR subsample

The 76-paper subsample is identified in `paper1-irr-subsample.csv` (column `irr_sample=Y`). This file contains the same columns as the primary coding spreadsheet, with all coding fields blank.

**Independence requirement:** The second coder must not discuss codes with the primary coder between receiving the subsample file and submitting completed codes. If a question arises about handbook application, contact the primary coder to ask about the rule, not about the specific paper.

**Return deadline:** July 19, 2026, by end of day.

---

## 3.4 Disagreement resolution protocol

After both coders submit their 76-paper sheets:

**Step 1 — Calculate statistics:**
```python
from sklearn.metrics import cohen_kappa_score
import krippendorff

kappa_er = cohen_kappa_score(coder1_er, coder2_er, weights='linear')
alpha_kf = krippendorff.alpha(reliability_data_kf, level_of_measurement='nominal')
alpha_nc = krippendorff.alpha(reliability_data_nc, level_of_measurement='ordinal')
```

**Thresholds:**

| Variable | Statistic | Minimum | Action if below |
|---|---|---|---|
| ER | Weighted Kappa | 0.75 | Identify failing boundary; revise that decision-tree node; recode |
| ER-4 cells | Percent agreement | 80% | Report alongside Kappa with base-rate note |
| KF | Krippendorff's α | 0.70 | Identify failing KF boundary; revise tree |
| NC | Krippendorff's α | 0.75 | Identify genre-trap cases; add to decision tree |

**Step 2 — Resolution session (60 minutes maximum):**

For each disagreement:
1. Identify the specific decision tree question that produced different answers.
2. Read the relevant handbook rule aloud.
3. Apply the rule to the paper.
4. If the rule resolves the disagreement: apply the ruling and move on.
5. If the rule does not resolve it: document as a new edge case. Primary coder assigns a provisional code. Update the handbook.

**Resolution session rule:** The handbook governs — not seniority, not intuition, not the paper's apparent importance. If you disagree with a handbook rule, flag it for revision after the session, not during it.

**Step 3 — Methods reporting text:**
> "Inter-rater reliability was assessed on a stratified random subsample of 76 papers (20.0% of corpus; 19 papers per publication period, seed=42). Weighted Cohen's Kappa for Ecosystem Register was κ = [X] (95% CI: [X]–[X]). Krippendorff's alpha for Knowledge Framework was α = [X] and for Normative Claim Level was α = [X]. For ER-4, which represents approximately [X]% of the corpus, we additionally report percent agreement ([X]%) due to base-rate instability in Kappa on rare categories (Feinstein & Cicchetti 1990). All disagreements were resolved through joint application of the decision tree documented in the coding handbook."

---

# PART 4: CORPUS EXECUTION PROTOCOL

---

## 4.1 Daily workflow

**Session structure:** 90-minute coding sprints. No interruptions during a sprint. Two sprints per day minimum during active coding weeks.

**Daily target:** 25 papers per day minimum. At 25/day over 14 coding days (Weeks 2–3) = 350 papers. The remaining 30 papers are coded in the final sessions of Week 3.

**Daily tracking:**
- Record papers coded at end of each session.
- Running total vs. target: if you fall below 120 papers by July 7, flag immediately and increase sprint frequency.
- Do not reschedule coding sessions — treat them as fixed appointments.

**Sprint procedure:**
1. Open `paper1-coding-starter.csv` filtered to the current period.
2. Open Semantic Scholar abstract lookup tab.
3. For each paper: Step 0 → ER → KF → NC → coder_notes if needed → next paper.
4. Do not leave blank cells. If uncertain, assign Low confidence and flag in coder_notes — do not leave the row incomplete.
5. Save the spreadsheet at the end of every sprint.

---

## 4.2 Abstract retrieval workflow

Run `scripts/paper1-fetch-abstracts.py` before Day 1 of coding. This script queries the Semantic Scholar API for abstracts by paper title and saves them to `paper1-abstracts.json`.

For papers not retrieved automatically:
1. Search Google Scholar for the title in quotes.
2. If found: copy the abstract text, set `abstract_accessed=Y`.
3. If not found: set `abstract_accessed=N`, assign all variables at Low confidence, note "abstract unavailable" in `coder_notes`.

**Abstract requirement for ER:** Any paper where the game is not identifiable from the title requires the abstract. Do not assign ER without the coding unit.

**Abstract requirement for KF-D1/D2:** Any paper making conservation claims where participant data cannot be ruled out from the title requires the abstract.

---

## 4.3 Coding order

Code periods in this sequence to manage cognitive load and data density:

| Order | Period | N papers | Rationale |
|---|---|---|---|
| 1st | 2001–2015 | 35 | Small pool; calibrates the scheme on early, typically simpler papers |
| 2nd | 2023–2025 | 139 | Largest period; code while the scheme is fresh and energy is high |
| 3rd | 2016–2019 | 87 | Medium density; consolidates scheme |
| 4th | 2020–2022 | 119 | Completes corpus |

**Do not code 2023–2025 last.** It is the densest period (139 papers, many multi-game, many empirical audience studies) and the most prone to time-pressure errors. Code it second when scheme calibration is solid.

**Pokémon taxonomy cluster:** The 35 papers from Journal of Geek Studies, A Bruxa, I Colóquio, and American Entomologist (`pokemon_cluster=Y`) should be coded as a discrete block within whichever period they fall. They are nearly all KF-B, NC-1. Flag them all in `coder_notes` and analyze separately.

---

## 4.4 Quality control checkpoints

**After 2001–2015 (35 papers):**
- Check: no more than 3 papers assigned ER-3 or ER-4. If more, review your Q4 application.
- Check: ER-0 papers — do they all have a legitimate HB-6 justification in coder_notes?
- Check: KF-D2 papers — do they all have a participant-data note in coder_notes?

**After 2023–2025 (139 papers):**
- Check coding rate: are you on target (≥120 papers by July 7)?
- Check: does the period-level ER distribution look plausible? (Expect majority ER-0/1, few ER-3/4)
- Self-test: re-code 3 Low-confidence papers from the set without looking at your original codes. If you get the same codes, scheme is stable. If different, flag the discrepancy and review.

**Before submitting to second coder:**
- Completeness check: all 380 rows have non-blank ER, KF, NC, abstract_accessed.
- Validation check: run the spreadsheet validation rules (§2.3). Fix any invalid values.
- Low-confidence audit: every Low-confidence entry has a coder_notes explanation.

---

## 4.5 Stop conditions

Stop coding immediately and schedule a joint decision-point if any of the following occur:

| Condition | Action |
|---|---|
| More than 15 Low-confidence flags in the first 50 papers | Abstract fetch has not run, or a decision tree node is systematically failing. Diagnose before continuing. |
| You find a paper that clearly requires ER-4 but have been coding similar papers as ER-3 | Re-review all Q4/Q5 boundary papers already coded before continuing. |
| You discover a paper type not covered by any worked example in §1.3 and §1.4 | Do not invent a code. Flag with coder_notes, assign provisional Low-confidence code, bring to IRR resolution session. |
| Coding rate falls below 15 papers/day for two consecutive days | Reassess schedule. If Week 3 deadline is at risk, reduce coder_notes detail on non-IRR papers (keep all codes). |
| The second coder requests clarification on a tree boundary before July 19 | Respond within 24 hours with the relevant handbook rule. Document the question and your response as a potential handbook amendment. |

---

## 4.6 File checklist before analysis

At the end of coding, you should have:

- [ ] `paper1-coding-[initials]-[final date].csv` — 380 rows, all coding fields complete
- [ ] `paper1-coding-irr-[second coder initials]-[date].csv` — 76 rows, returned by July 19
- [ ] `paper1-abstracts.json` — abstract cache from Semantic Scholar fetch
- [ ] `paper1-setup-report.txt` — setup documentation
- [ ] `paper1-coding-manual-v1.0.md` — this document

After IRR resolution: `paper1-final-coded.csv` — merged, resolved dataset, 380 rows, ready for analysis.

---

*Paper 1 — Master Coding Manual v1.0*
*Issued: June 2026 | Based on Training Set A calibration (10 papers, 30 decisions)*
*Next review: after Training Set B pilot session*
