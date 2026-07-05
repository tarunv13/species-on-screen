# Paper 1 — Master Coding Manual
## Version 1.1 | Post-Audit Revision

**Changes from v1.0:** AI role declaration (§1.0); reflexivity statement (§1.1); Q1 criterion revised to remove "intended" (§1.3); Q0b decision criteria operationalized (§1.2); KF confidence rules added (§1.4); ER-3/ER-4 confidence rules added (§1.3); geographic anchor glossary added (§1.3); KF-A/KF-E boundary sharpened (§1.4); NC "explicit vs. implied" distinction added (§1.5); scope gate (apps/gamification) added (§1.2); considered-and-rejected record added (§2.4); anchor-coding protocol added (§4.4); drift log requirement added (§4.4); pre-registration requirement added (§4.1); IRR weight matrix pre-specified (§3.4); second-coder contingency added (§3.4).

**Audit basis:** `paper1-methodology-audit-v1.md` — read that document for full rationale behind every change.

---

# PART 1: MASTER CODING HANDBOOK

---

## 1.0 Human–AI Collaboration Statement

The coding scheme documented in this handbook was developed through structured human–AI dialogue. The three-variable ER/KF/NC framework, all decision tree structures, scale definitions, and handbook rules (HB-1 through HB-9, HB-R1 through HB-R5, and additions in v1.1) were developed iteratively between the lead researcher and an AI language model (Claude Sonnet 4.6, Anthropic, 2025–2026). The AI acted as a methodological interlocutor during coder calibration (Training Set A): it challenged codes, identified rule failures, proposed handbook amendments, and confirmed revised codes. The AI's role is best described as co-methodologist at the scheme development stage and calibration supervisor at the training stage.

All final coding decisions in the 380-paper corpus are made by human coders. The AI did not code any corpus paper and does not participate in the formal inter-rater reliability assessment.

The full dialogue log documenting scheme development is archived as supplementary material. Researchers wishing to replicate or adapt this scheme should consult that log alongside this handbook.

---

## 1.1 Reflexivity Statement

The lead researcher is both the coding scheme designer and Coder 1. This structural overlap is acknowledged rather than concealed. The lead researcher's theoretical investment in the "ecological grounding" construct — the primary analytical contribution of Paper 1 — creates a structural interest in demonstrating that the corpus is poorly ecologically grounded. This is mitigated by the mechanical decision tree structure, which constrains code assignment to binary and triadic decisions rather than holistic judgment, and by the blind double-coding IRR design. Both mitigations are imperfect. This limitation is disclosed in the published methods section.

---

## 1.2 What You Are Coding

For each paper in the corpus, assign three codes:

- **ER** — the relationship between the paper's primary game object and documented real-world biodiversity
- **KF** — the epistemological tradition governing the paper's stated research question
- **NC** — the highest level of real-world consequence the paper explicitly claims for its findings

**Coding unit:** the paper's primary game object — the game or game world the paper is primarily analyzing. Not the paper's method. Not the paper's theoretical framework. The game.

**Scope: digital games only.** This study codes papers that primarily analyze digital games: video games, computer games, mobile games, serious games, game-like interactive narratives, and educational game software.

**Out of scope:** Papers primarily analyzing gamification of non-game platforms where the primary contribution is the platform, not game mechanics (e.g., eBird as a citizen-science tool without foregrounded game mechanics); nature apps without goal structures or player agency; interactive simulations without games.

**Borderline:** Papers analyzing both a game and a non-game platform — code for the game component; note in coder_notes.

**Source hierarchy:** Title first. Abstract if title is insufficient. Full text only if abstract is unavailable or still insufficient. Document which source was used in `abstract_accessed`.

**Coding order:** Always ER → KF → NC. Never reverse.

---

## 1.3 Step 0 Checklist (mandatory before any decision tree)

Before entering Q1 of the ER tree, complete both steps:

**Q0a: Can I name the primary game?**

- If YES: proceed to Q0b with that game as the coding unit.
- If NO: STOP. Abstract required before proceeding. Do not assign an ER code against an unknown coding unit. (HB-2)

**Q0b: Does this game have a biological ecosystem?**

A biological ecosystem is present (Q0b = YES) when the game world contains at least one of:
- Species-level organisms (real or fictional) that eat, are eaten, reproduce, or die in response to ecological conditions
- Explicitly modeled ecological processes (population dynamics, nutrient cycles, predation, habitat dependency)
- A food web with more than one trophic level in the game's represented world

A biological ecosystem is NOT present (Q0b = NO) when the game world contains only:
- Humans, human-equivalent NPCs, and inorganic objects (The Sims, most social simulations)
- Animals or plants as decorative or resource-yielding elements without ecological modeling
- "Ecology" used in the paper as a theoretical metaphor (media ecology, cultural ecology, organizational ecology) with no reference to biological organisms in the game

**Borderline cases requiring abstract review:** games with farming mechanics (Stardew Valley, Harvest Moon); games with wildlife but no ecological modeling (most open-world games with ambient fauna); games with environmental collapse as backdrop but no represented ecosystem.

- If Q0b = YES: proceed to Q1.
- If Q0b = NO: the game has no biological ecosystem. Assign ER-0 directly. Do not enter Q1. (HB-6)

---

## 1.4 Variable 1: Ecosystem Register (ER)

### Operational definition

The degree to which the paper's primary game object is connected to verifiable, place-specific, documented biodiversity. Codes 0–4, ordered from least to most ecologically grounded. **Code the game, not the paper's method.**

| Code | Label | Core criterion |
|---|---|---|
| ER-0 | No biological ecosystem | The game contains no biological ecosystem (Q0b = No) |
| ER-1 | Fictional with real echoes | Fictional creatures or worlds derived from or mapped to real taxonomic groups, ecological types, or real landscape categories |
| ER-2 | Real species, no place | Real species named in the game, but no specific geographic location |
| ER-3 | Real species, biome class | Real species in a named biome type, not a specific named place |
| ER-4 | Real species, real place | Real species in a named, geolocatable, documented ecosystem |

### ER Decision Tree

```
STEP 0 — Complete checklist in §1.3 before entering Q1.

Q1 — Does the game's represented world consist entirely of organisms
     and environments with NO COMMONLY RECOGNIZED real-world taxonomic
     or geographic referent in the scientific literature?

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
     (a generic descriptor for a type of ecosystem)
     rather than a named specific place?

     BIOME CLASS    → CODE: ER-3  ← STOP HERE
     NAMED PLACE    → CODE: ER-4  ← STOP HERE
```

**Critical branch rule:** Q4=No exits at ER-2. Q5 does not exist on a Q4=No path. (HB-5)

**Terminal branch check:** After reaching any code, verify: (a) the branch is terminal, (b) you did not stop before the exit, (c) you did not continue past it. (HB-4)

### Q5 Geographic Anchor Glossary

Use this glossary to resolve Q5 when a location name is ambiguous between biome class and named place:

| Reference in paper | Ruling | Code |
|---|---|---|
| "coral reef" | Biome class | ER-3 |
| "tropical rainforest" | Biome class | ER-3 |
| "boreal forest" | Biome class | ER-3 |
| "the Arctic" / "Arctic tundra" | Biome class | ER-3 |
| "northern Canada" | Insufficiently specific — treat as biome class | ER-3 |
| "the Amazon" / "Amazonia" / "Amazon basin" | Named place | ER-4 |
| "the Amazon rainforest" | Named place (geographic qualifier present) | ER-4 |
| "the Great Barrier Reef" | Named place (UNESCO) | ER-4 |
| "Alaska" / "Alaskan tundra" | Named place (state) | ER-4 |
| "the Sundarbans" | Named place (UNESCO biosphere reserve) | ER-4 |
| "Yellowstone" | Named place (national park) | ER-4 |
| "Borneo" | Named place (island) | ER-4 |
| "the Congo Basin" | Named place | ER-4 |
| "the Pacific" / "Pacific Ocean" | Insufficiently specific — treat as biome class | ER-3 |

For locations not listed: ask whether a scientist could locate a specific study site from this description alone. If yes, ER-4. If no, ER-3.

### ER Confidence Rules

| Level | Condition |
|---|---|
| High | Game named in title; ER path clear without abstract |
| Medium | Abstract required; named game identified from abstract; ER path clear |
| Low | Coding unit remains a category after abstract review; OR ambiguous after abstract |

**ER-3/ER-4 confidence:**

| Code | High requires | Medium |
|---|---|---|
| ER-3 | Abstract confirms real named species AND named biome class | Title implies biome setting; abstract not yet accessed |
| ER-4 | Abstract confirms real named species AND geolocatable place; record both in coder_notes | Abstract mentions named place; species confirmation pending |

**ER-4 coder_notes requirement:** Record (a) the specific place name as it appears in the paper; (b) at least one real species name cited in the paper as occurring in that place.

**Confidence ceiling rule (HB-8):** Category coding unit after abstract review → ER confidence cannot exceed Low.

**Multi-game confidence rule (HB-9):** Confidence reflects weakest individual game evaluation, not emphasis.

### Multi-game rule

If the paper studies multiple games:
1. Evaluate ER for each named game independently.
2. Assign the **highest ER level present** across all games.
3. Record all game titles in coder_notes.
4. Set confidence to the weakest individual confidence level.
5. For `game_primary`: enter the game with the highest ER level. If two games tie at the highest level, enter the game that receives more analysis; note in coder_notes.

### ER Worked Examples

| Paper | Game | Path | Code | Conf | Notes |
|---|---|---|---|---|---|
| Ulman2001 | Early online virtual worlds | Q0b=Y; Q1=N; Q2=Y | ER-1 | Medium | Abstract required; fictional worlds echoing real landscapes |
| Balmford2002 | Pokémon | Q0b=Y; Q1=N; Q2=Y | ER-1 | High | Fictional creatures with real taxon echoes |
| Molloy2011 | Hunting simulation games | Q0b=Y; Q1=N; Q2=N; Q3=Y; Q4=N | ER-2 | Medium | Real animal species; no named geographic location; STOP at Q4=No |
| Weagly2013 | Minecraft | Q0b=Y; Q1=N; Q2=Y | ER-1 | High | Fictional world echoing real ecological types |
| Bainbridge2014 | Pokémon | Q0b=Y; Q1=N; Q2=Y | ER-1 | High | Established franchise precedent |
| Bianchi2014 | The Sims | Q0b=N | ER-0 | High | No biological ecosystem; "ecology" is theoretical metaphor |
| Caciuc2014 | Online games | Q0b=Y; Q1=N; Q2=Y | ER-1 | Low | Category coding unit after abstract review |
| Attebery2015 | Pikmin + Pokémon | Q0b=Y; Q1=N; Q2=Y (both) | ER-1 | Medium | Multi-game; both ER-1; game_primary = Pikmin (equal ER; Pikmin receives more analysis) |
| Condis2015 | Multiple games (category) | Q0b=Y; Q1=N; Q2=Y | ER-1 | Low | Category coding unit after abstract review |
| Parham2015 | Green games (category) | Q0b=Y; Q1=N; Q2=Y | ER-1 | Low | Category coding unit after abstract review |

**ER-0 additional examples:** The Sims series · SimCity · Civilization · FarmVille · Papers using "ecology" as a systems/media metaphor with no biological organisms in the game

**ER-4 examples:** Never Alone / Kisima Ingitchuna (Alaskan tundra, Iñupiaq territory) · Beyond Blue (Great Barrier Reef, named place) · Thunderbird Strike (Great Lakes watershed) · Any paper naming a geolocatable ecosystem with real documented species

---

## 1.5 Variable 2: Knowledge Framework (KF)

### Operational definition

The primary epistemological tradition governing the paper's stated research question — the framework that determines what the paper counts as evidence for its central claim. Code the framework governing the research question, not the framework cited most in the literature review.

| Code | Label | Governing question type | Primary evidence type |
|---|---|---|---|
| KF-A | Ecocritical / literary | How does this game text represent ecology, nature, or species as cultural meaning? | Textual analysis, narrative theory, close reading, posthumanism, ecocriticism |
| KF-B | Scientific / STEM | What taxonomy or species does this game contain, or how does it serve science learning or accuracy? | Species classification, taxonomic comparison, scientific accuracy assessment |
| KF-C | Indigenous / TEK | How does this game engage Indigenous ecological knowledge, land relationships, or decolonial ecology? | ILK frameworks, decolonial theory, community-grounded analysis |
| KF-D1 | Theoretical conservation | Can/should games support conservation outcomes? | Argument, theoretical synthesis, no participant data |
| KF-D2 | Empirical conservation | Do games produce conservation outcomes? | Human-participant surveys, experiments, observations |
| KF-E | Design / systems | How do game mechanics, procedural systems, or design architecture produce ecological meaning? | Rule systems, procedural logic, game design analysis |
| KF-F | Other / unclear | Cannot be determined from available metadata | — |

**KF-A / KF-E distinction:** Both frameworks analyze games interpretively, but they differ in primary evidence. If the paper's evidence is primarily **textual, narrative, or aesthetic** (story, imagery, dialogue, representation) → KF-A. If the paper's evidence is primarily **rule systems, procedural logic, or game mechanics** (how the game's systems work, what they computationally model) → KF-E. Papers in the Bogost/procedural rhetoric tradition that analyze mechanics as arguments are KF-E. Papers that interpret game worlds through posthumanism or ecocriticism are KF-A even when they mention mechanics.

### KF Decision Tree

```
Q1 — Does the research question primarily ask an interpretive,
     aesthetic, narrative, or ethical question about the game
     as a CULTURAL TEXT, where the primary evidence is textual,
     narrative, or representational?

     YES → CODE: KF-A  ← STOP HERE

     NO  → Continue to Q2

Q2 — Does the research question primarily ask a SCIENTIFIC
     or TAXONOMIC question, or use games as a vehicle for
     STEM literacy, species accuracy, or science education?

     YES → CODE: KF-B  ← STOP HERE

     NO  → Continue to Q3

Q3 — Does the research question primarily engage INDIGENOUS
     knowledge systems, Traditional Ecological Knowledge,
     decolonial ecology, or specific Indigenous community
     ecological practices AS THE GOVERNING METHODOLOGY?

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

Q5 — Does the research question primarily analyze GAME MECHANICS,
     PROCEDURAL SYSTEMS, or DESIGN ARCHITECTURE as meaning-
     production, where the primary evidence is the game's
     rule systems rather than its narrative/textual content?

     YES → CODE: KF-E  ← STOP HERE

     NO  → CODE: KF-F  ← STOP HERE
```

### KF-C note
KF-C requires that Indigenous knowledge systems function as the governing methodology, not merely as content. A paper that describes how a game represents Indigenous peoples, from an outside ecocritical perspective, codes KF-A. A paper that uses ILK or decolonial frameworks as its primary analytical method codes KF-C.

### KF-D1 vs KF-D2 Trigger-Word Check (HB-R4)

Before assigning KF-D1, scan the abstract for: **survey · participants · respondents · n= · measured · experiment · sample · questionnaire · data collected · interviews · observations.**

If any are present, KF-D2 is a candidate. Confirm participant data before assigning D2.

**Venue signals for D2:** Conservation Letters, Ambio, Journal of Environmental Psychology, Environmental Education Research, CHI, PLOS ONE making conservation claims — all warrant abstract review before D1 assignment.

### KF Confidence Rules

| Level | Condition |
|---|---|
| High | Research question clearly assignable from abstract; no competing KF framework visible; D1/D2 confirmed by trigger-word check |
| Medium | Abstract accessed; research question assignable but one competing framework is plausible |
| Low | Abstract accessed but research question ambiguous; or kf_primary = KF-F |

**KF title-only maximum: Medium.** Abstract required for High confidence.

**Co-primary flag:** When two frameworks govern the research question with genuinely equal weight, record `kf_primary` as dominant code and `kf_coprimary` as secondary. Document reasoning in coder_notes.

### KF Worked Examples

| Paper | Code | Rationale |
|---|---|---|
| Ulman2001 | KF-A | Ecocritical comparative media analysis of online worlds |
| Balmford2002 | KF-D2 | Conservation question + child survey data (n=109) |
| Molloy2011 | KF-A | Ethical/aesthetic analysis of hunting as cultural representation |
| Weagly2013 | KF-B | Scientific comparison of Minecraft dirt to real soil science |
| Bainbridge2014 | KF-A | Cultural studies analysis of Pokémon franchise and environment |
| Bianchi2014 | KF-A | Theoretical/rhetorical analysis of game ecologies as cultural systems |
| Caciuc2014 | KF-A | Philosophical reflection on ecological ethics in games |
| Attebery2015 | KF-A | Posthumanist analysis; companion species (Haraway), biopower (Foucault) |
| Condis2015 | KF-A | Environmental humanities disciplinary argument |
| Parham2015 | KF-A | Ecocritical inhabitation concept applied to green games |

---

## 1.6 Variable 3: Normative Claim Level (NC)

### Operational definition

The highest level of real-world consequence the paper **explicitly states** for its findings. Code from the stated contribution, not the opening framing. NC-1 is the floor.

| Code | Label | Defining criterion | Signal phrases |
|---|---|---|---|
| NC-1 | Descriptive | Describes, analyzes, or interprets game content; no explicit real-world effect claim | "this paper analyzes / examines / argues that [game] represents..." |
| NC-2 | Behavioral / pedagogical | Explicitly claims games can, do, or should produce ecological learning or changed attitudes in players or audiences | "games can build awareness / serve as a vehicle for learning / we demonstrate improved outcomes" |
| NC-3 | Conservationist / policy | Explicitly claims games can, do, or should produce conservation outcomes or policy change at institutional or population level | "lessons for conservation / games support biodiversity goals / conservationists should heed / implications for environmental policy" |

**Scale:** NC-1, NC-2, NC-3 only. NC-0 does not exist. NC-1 is the floor code. (HB-3)

### Explicit vs. Implied Effects

**Explicit (required to upgrade from NC-1):** The paper directly states that games produce, can produce, should produce, or have been measured to produce an effect on player behavior, attitudes, knowledge, or conservation outcomes. The claim uses active language directed at audiences, players, or conservation sectors.

**Implied (stays at NC-1):** The paper's argument implies that games matter, or opens with ecological crisis framing to motivate the analysis, or suggests in passing that better game design would have positive effects. If no direct claim about games affecting people is stated, NC-1 applies.

**Test:** Would a reasonable reviewer say "this paper claims games change behavior / attitudes / outcomes"? If yes, consider NC ≥ 2. If the reviewer would say "this paper argues games represent nature in X way," NC-1.

### NC Decision Tree

```
Q1 — Does the paper EXPLICITLY STATE that games can, do, or
     should produce any real-world effect on players or audiences?
     (behavioral change, attitude change, learning, awareness)
     [See "Explicit vs. Implied" above before answering Yes]

     NO  → CODE: NC-1  ← STOP HERE (floor rule applies)

     YES → Continue to Q2

Q2 — Does that claim operate at POPULATION / CONSERVATION-PRACTICE /
     POLICY level — beyond individual attitudes, toward societal,
     institutional, or conservation-sector outcomes?

     YES → CODE: NC-3  ← STOP HERE

     NO  → CODE: NC-2  ← STOP HERE
```

### NC Confidence Rules (HB-R3)

| Level | Condition |
|---|---|
| High | Abstract reviewed AND closing claim type confirmed in abstract as clearly one NC level |
| Medium | Title-only coding; OR abstract reviewed but closing claim type not confirmed; OR genre creates residual boundary risk |
| Low | Ambiguous after abstract; flag for joint discussion |

**Title-only maximum: Medium.** NC confidence can only reach High when abstract has been reviewed AND closing claim type is explicitly identifiable.

### Genre Traps

**Ecocritical/environmental humanities trap:** Papers frequently open with NC-3 framing ("in an era of biodiversity crisis, games matter") but contribute at NC-1 (close reading of one game). Code from contribution, not opening framing.

**Posthumanist/theoretical trap:** "Coshaping," "entanglement," "more-than-human" language implies mutual constitution. This is an ontological/theoretical claim, not an audience-effects claim. Mutual constitution ≠ measurable effects on players → NC-1.

**Disciplinary-call-to-arms trap:** "Scholars should take games seriously as environmental texts" is a meta-scholarly claim directed at academics, not an audience-effects claim → NC-1.

**NC-2/NC-3 boundary:** Individual attitude change in players → NC-2. Conservation-sector, institutional, or population-level claims → NC-3. The distinction is the level of social organization at which the claim operates, not the strength of the language.

### NC Worked Examples

| Paper | Code | Conf | Rationale |
|---|---|---|---|
| Ulman2001 | NC-1 | Medium | No explicit audience-effect claim |
| Balmford2002 | NC-3 | High | "Conservationists should heed" — directed at conservation sector |
| Molloy2011 | NC-1 | Medium | Ethical critique; no explicit audience-effects statement in abstract |
| Weagly2013 | NC-1 | Medium | Scientific comparison; no educational recommendation in abstract |
| Bainbridge2014 | NC-1 | Medium | Cultural studies analysis; no explicit audience-effects claim |
| Bianchi2014 | NC-1 | High | Abstract confirms closing claim is theoretical/systemic |
| Caciuc2014 | NC-1 | Medium | Ethical reflection; no explicit audience-effects claim |
| Attebery2015 | NC-1 | Medium | Posthumanist ontological argument; no audience-effects claim |
| Condis2015 | NC-1 | High | Abstract confirms claim is directed at environmental humanities scholars |
| Parham2015 | NC-1 | Medium | "Coming to understand" near boundary but no explicit audience-effect |

---

## 1.7 Complete Handbook Rules

| # | Rule | Source |
|---|---|---|
| HB-1 | Q1 of the ER tree tests whether the ecosystem has no recognized real-world referent — not the degree of ecological documentation. Documentation level is determined by Q3–Q5. | Training Set A |
| HB-2 | If the primary game is not identifiable from the title, flag the coding unit as unknown and require abstract review before traversing any decision tree. Do not assign an ER code against an unknown object. | Training Set A |
| HB-3 | NC-1 is the floor code. It is assigned when no explicit audience-effect claim is present. NC-0 does not exist. NC codes are 1, 2, 3 only. | Training Set A |
| HB-4 | After reaching any code, verify: (a) the branch is terminal at that question, (b) you have not stopped before the exit, (c) you have not continued past the exit. | Training Set A |
| HB-5 | Q4=No exits at ER-2. Q5 is only traversed when Q4=Yes. Q5 tests biome class vs. named specific place — it does not test documentation level or data infrastructure. | Training Set A |
| HB-6 | If a game contains no biological ecosystem, Q1=Yes → ER-0. The absence of a biological ecosystem means Q0b=No; ER-0 is assigned directly without entering Q1. (See §1.3 for Q0b criteria.) | Training Set A |
| HB-7 | Do not invent decision tree questions. Every code must be reached via a path that exists in this handbook. | Training Set A |
| HB-8 | When the coding unit remains a category of games after abstract review, ER confidence cannot exceed Low. | Training Set A |
| HB-9 | In multi-game papers: code the highest ER level present. Confidence reflects weakest individual evaluation. game_primary = highest-ER game; if tied, the most-analyzed game. | Training Set A |
| HB-R1 | Step 0 checklist before every ER tree entry. See §1.3. | Training Set A |
| HB-R2 | Q4=No is a terminal branch. Write "STOP HERE" explicitly after writing ER-2 in your notes. | Training Set A |
| HB-R3 | NC confidence can only reach High when abstract reviewed AND closing claim type explicitly confirmed. Title-only = maximum Medium. | Training Set A |
| HB-R4 | Before assigning KF-D1, scan abstract for trigger words. See §1.5. | Training Set A |
| HB-R5 | ER-0 is not limited to fantasy/action games. Social simulations and games where "ecology" is a theoretical metaphor also receive ER-0 when Q0b=No. | Training Set A |
| HB-V1 | Q1 tests for commonly recognized real-world taxonomic or geographic referents, not designer intent. "Intended" is not a criterion. (v1.1) | Audit |
| HB-V2 | KF-A applies when the primary evidence is textual/narrative/aesthetic. KF-E applies when the primary evidence is rule systems and procedural logic. A paper can interpret mechanics culturally (KF-A) or analyze mechanics procedurally (KF-E); the evidence type distinguishes them. (v1.1) | Audit |
| HB-V3 | NC requires explicit statement of an audience-effect claim. Implied effects, opening-crisis framing, and disciplinary calls-to-arms do not upgrade NC. See §1.6 "Explicit vs. Implied." (v1.1) | Audit |
| HB-V4 | KF-C requires Indigenous knowledge systems as the governing methodology, not merely as content analyzed from an outside perspective. An ecocritical analysis of an Indigenous game = KF-A. An analysis using ILK as its primary analytical framework = KF-C. (v1.1) | Audit |

---

# PART 2: PRIMARY CODING SPREADSHEET SPECIFICATION

*(Unchanged from v1.0, with additions to §2.4)*

## 2.1 File naming

**Primary coder:** `paper1-coding-[initials]-[date].csv`
**Second coder (IRR subsample):** `paper1-coding-irr-[initials]-[date].csv`
**Encoding:** UTF-8 with BOM.

## 2.2 Column specifications

| Column | Type | Allowed values | Notes |
|---|---|---|---|
| `paper_id` | Text | Pre-assigned | Do not modify. |
| `first_author` | Text | Pre-assigned | Do not modify. |
| `publication_year` | Integer | Pre-assigned | Do not modify. |
| `title` | Text | Pre-assigned | Do not modify. |
| `publication` | Text | Pre-assigned | Do not modify. |
| `period` | Categorical | 2001-2015 / 2016-2019 / 2020-2022 / 2023-2025 | Do not modify. |
| `game_primary` | Text | Free text | Name of primary game. HB-9: highest-ER game in multi-game papers. |
| `franchise` | Categorical | [14 franchise values] / None / Other-named | Verify auto-detected value. |
| `er_code` | Integer | 0 / 1 / 2 / 3 / 4 | Required. |
| `er_confidence` | Categorical | High / Medium / Low | Required. |
| `kf_primary` | Categorical | A / B / C / D1 / D2 / E / F | Required. |
| `kf_coprimary` | Categorical | A / B / C / D1 / D2 / E / F / — | Use "—" when not applicable. |
| `kf_confidence` | Categorical | High / Medium / Low | Required. (Added v1.1) |
| `nc_level` | Integer | 1 / 2 / 3 | Required. |
| `nc_confidence` | Categorical | High / Medium / Low | Required. (Added v1.1) |
| `abstract_accessed` | Boolean | Y / N | Set to Y when abstract opened. |
| `indigenous_paper` | Categorical | Y / N / Uncertain | Verify keyword detection. |
| `pokemon_cluster` | Boolean | Y / N | Verify venue detection. |
| `irr_sample` | Boolean | Y / — | Pre-assigned. Do not modify. |
| `training_set` | Categorical | A / B / — | Pre-assigned. Do not modify. |
| `in_scope` | Categorical | Y / N / Uncertain | NEW v1.1: confirm paper is about a digital game per §1.2 scope definition. |
| `coder_notes` | Text | Free text | Required for Low-confidence papers and near-miss codes. |

**Note:** `er_confidence`, `kf_confidence`, `nc_confidence` are now separate columns (v1.1 adds `kf_confidence` and `nc_confidence` as mandatory fields; v1.0 had `er_confidence` only in the code list but confidence for KF and NC was recorded in coder_notes). Update the `paper1-coding-starter.csv` column structure before beginning full coding.

## 2.3 Validation rules

| Column | Validation |
|---|---|
| `er_code` | Integer in {0, 1, 2, 3, 4} |
| `er_confidence` | Text in {High, Medium, Low} |
| `kf_primary` | Text in {A, B, C, D1, D2, E, F} |
| `kf_coprimary` | Text in {A, B, C, D1, D2, E, F, —} |
| `kf_confidence` | Text in {High, Medium, Low} |
| `nc_level` | Integer in {1, 2, 3} — reject 0 and >3 |
| `nc_confidence` | Text in {High, Medium, Low} |
| `abstract_accessed` | Text in {Y, N} |
| `in_scope` | Text in {Y, N, Uncertain} |

## 2.4 Coder notes structure

**Required for:**
- Any paper coded Low confidence on any variable
- Any paper applying the multi-game rule
- Any paper where Q0b judgment required abstract review
- Any ER-4 paper (record place name and species name)
- Any paper coded in_scope = N or Uncertain

**Near-miss codes (new in v1.1):** For any paper where you seriously considered a different code before reaching the final code, add: "Near miss: [considered code] at [Q-step]; ruled out by [rule]."

Required near-miss recording: (a) any paper where ER path reached Q3 or deeper; (b) any paper with co-primary KF; (c) any paper where NC confidence = Low.

**Standard note formats:**
- Multi-game: "Multi-game: [game1] ER-[x], [game2] ER-[y]. Highest applied. game_primary = [game]."
- Low confidence: "Low-conf: coding unit = [category/reason]. Abstract [accessed/not accessible]."
- ER-4: "ER-4: place = [name]; species cited = [name(s)]."
- Near miss: "Near miss: ER-[x] at Q[n]; ruled out because [rule]."
- Scope: "in_scope=Uncertain: [reason — apps/gamification/unclear game content]."

---

# PART 3: IRR PACKAGE

## 3.1 Second-coder instructions

*(Unchanged from v1.0)*

You are coding an independent subsample of 76 papers on three variables (ER, KF, NC) using the decision trees in this manual. Independence is required — do not discuss codes with the primary coder during coding. Return completed spreadsheet by July 19, 2026.

## 3.2 Training protocol

### Stage 1 — Training Set A answer key (45 minutes)

| Paper | Title | Venue |
|---|---|---|
| Ulman (2001) | "Beyond Nature/Writing: Virtual Landscapes Online..." | Beyond Nature Writing |
| Balmford (2002) | "Why Conservationists Should Heed Pokémon" | Science |
| Molloy (2011) | "Hunted: Recreational Killing" | Popular Media and Animals |
| Weagly (2013) | "Dirt, not soil: A unit analysis of 'Minecraft'..." | Dissertation |
| Bainbridge (2014) | "'It is a Pokémon world': The Pokémon franchise and the environment" | IJCS |
| Bianchi (2014) | "Rhetoric and recapture: Theorising digital game ecologies through EA's The Sims series" | Green Letters |
| Caciuc (2014) | "Reflections on the Ecologic Ethics in Online Games" | IJSHS |
| Attebery (2015) | "Coshaping Digital and Biological Animals..." | Humanimalia |
| Condis (2015) | "'Live in Your World, Play in Ours': Video Games, Critical Play..." | Resilience |
| Parham (2015) | "Green Computer Games: To Play is to Inhabit" | Green Media and Popular Culture |

**Answer key:**

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

Acceptable performance: 8/10 correct all three variables. Fewer than 8: identify which rule was misapplied, re-read that section, and code 5 additional targeted papers before Stage 2.

### Stage 2 — Training Set B pilot (45 minutes + 30-minute discussion)

| # | Paper | Primary stress test |
|---|---|---|
| 1 | Tomotani (2014) "Robins, robins, robins" — JGS | KF-A/B boundary |
| 2 | Backe (2014) "Greenshifting Game Studies" — First Person Scholar | Coding unit; no primary game in title |
| 3 | Sandbrook (2015) "Digital Games and Biodiversity Conservation" — Conservation Letters | KF-D1/D2; NC-3 |
| 4 | Acorn (2009) "The Pokémon Paradox" — American Entomologist | KF-A/B; scientific argument framing |
| 5 | Woolbright (2015) "Where the wild games are" — Ecomedia | Category coding unit; HB-8 |
| 6 | Hobbs (2019) "Science Hunters: Teaching Science Concepts in Schools" — ARISE | KF-B/D2; NC-2 |
| 7 | Jepson (2015) "Nature apps: Waiting for the revolution" — Ambio | **SCOPE GATE** — resolve in_scope before coding |
| 8 | Brown (2014) "The Garden in the Machine" — Philological Quarterly | Coding unit absent; KF-A |
| 9 | [KF-C paper from corpus — identify before Training Set B] | KF-C; ER-3/4 |
| 10 | [NC-2/3 boundary paper from corpus — identify before Training Set B] | NC-2/NC-3 boundary |

**Before Training Set B begins:** (a) confirm in_scope ruling for Jepson 2015; (b) identify one paper analyzing Never Alone, Thunderbird Strike, or an equivalent Indigenous game in the corpus for paper 9; (c) identify one paper making an individual attitude-change claim (NC-2) in the corpus for paper 10.

**Pilot discussion protocol:**
For each disagreement, identify the specific Q-step that produced different answers. Apply the handbook rule. If the rule resolves the disagreement, record the ruling. If not, document as a new edge case and record a provisional code + proposed handbook amendment.

**Proceed to IRR subsample if:** ER agreement ≥ 80% (8/10) on Training Set B. Below 80%: re-read failing section, code 5 more targeted papers.

## 3.3 IRR subsample

76-paper file: `paper1-irr-subsample.csv`. Independence required. Return by July 19, 2026.

## 3.4 Disagreement resolution protocol

### IRR Statistics

```python
from sklearn.metrics import cohen_kappa_score
import krippendorff
import numpy as np

# ER: weighted Kappa with quadratic weights
# Quadratic weight matrix for ER (5 levels, 0–4):
# w[i,j] = 1 - ((i-j)^2 / (n-1)^2) where n=5
def quadratic_weights(n):
    w = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            w[i,j] = 1 - ((i-j)**2 / (n-1)**2)
    return w

kappa_er = cohen_kappa_score(coder1_er, coder2_er, weights='quadratic')

# KF: Krippendorff's alpha, nominal
alpha_kf = krippendorff.alpha(reliability_data_kf, level_of_measurement='nominal')

# NC: Krippendorff's alpha, ordinal
alpha_nc = krippendorff.alpha(reliability_data_nc, level_of_measurement='ordinal')
```

**Pre-specified weight rationale (required for methods section):** Quadratic weights are used for ER Kappa because the conceptual distance between ER levels is non-linear: the shift from ER-2 (real species, no place) to ER-3 (real species, biome class) involves a qualitative shift in geographic anchoring that exceeds the shift from ER-0 to ER-1.

**Thresholds:**

| Variable | Statistic | Minimum |
|---|---|---|
| ER overall | Weighted Kappa (quadratic) | 0.75 |
| ER per class | Percent agreement | Report for each class with ≥5 IRR papers |
| KF | Krippendorff's α | 0.70 |
| NC | Krippendorff's α | 0.75 |

**Per-class ER reporting:** If ER-4 appears in fewer than 5 IRR papers, do not report per-class Kappa for ER-4. Report percent agreement with a note: "Per-class Kappa is not reported for ER-4 due to base-rate instability (n=[x] IRR papers); Feinstein & Cicchetti 1990."

**Below-threshold procedure (pre-specified):**
1. Identify the specific Q-step generating most disagreements.
2. Document the Q-step in the published methods section as the "primary disagreement zone."
3. Revise the relevant decision tree node.
4. Re-code the failing papers and recalculate.
5. Report BOTH the initial Kappa AND the post-revision Kappa; explain the revision in the methods section. Do not report only the post-revision value.

**Second-coder contingency:** If fewer than 70 papers are returned by July 19, proceed with available papers; report actual subsample size in methods. If fewer than 60 papers are returned, extend the deadline by one week before proceeding to analysis.

### Resolution session

For each disagreement: identify Q-step → apply handbook rule → rule governs, not seniority. Document edge cases. Primary coder assigns provisional code if rule does not resolve.

### Methods section boilerplate

> "Inter-rater reliability was assessed on a stratified random subsample of 76 papers (20.0% of corpus; 19 papers per publication period, seed=42). Quadratic weighted Cohen's Kappa for Ecosystem Register was κ = [X] (95% CI: [X]–[X]). Krippendorff's alpha for Knowledge Framework was α = [X] and for Normative Claim Level was α = [X]. For categories appearing in fewer than 5 IRR papers, percent agreement is reported in lieu of class-specific Kappa due to base-rate instability (Feinstein & Cicchetti 1990). All disagreements were resolved through joint application of the decision tree documented in the coding handbook [OSF link]. The coding scheme was developed through structured human–AI dialogue (see §AI Collaboration Statement); all IRR coding decisions were made independently by human coders."

---

# PART 4: CORPUS EXECUTION PROTOCOL

## 4.1 Pre-coding requirements (new in v1.1)

Complete these actions before beginning full corpus coding:

1. **Pre-register the v1.0/v1.1 handbook on OSF.** Record the pre-registration date. Any handbook amendments after this date = "post-registration amendments" and must be reported in the limitations section.
2. **Update spreadsheet columns.** Add `kf_confidence`, `nc_confidence`, and `in_scope` columns to `paper1-coding-starter.csv` before coding begins.
3. **Run abstract fetch script** (`scripts/paper1-fetch-abstracts.py`).
4. **Resolve Jepson 2015 scope question.** Assign `in_scope = Y/N/Uncertain` and document the ruling in the drift log.
5. **Identify Training Set B papers 9 and 10.** Search corpus for one KF-C paper and one NC-2 paper.
6. **Initialize `paper1-drift-log.csv`** with columns: `date`, `anchor_paper_id`, `original_code`, `re_code`, `variable`, `drift_type`, `rule_reviewed`.

## 4.2 Daily workflow

**Sprint:** 90 minutes. Target: 12–13 papers per sprint, two sprints per day, 25 papers per day total.

**Sprint procedure:**
1. Open `paper1-coding-starter.csv` filtered to current period.
2. For each paper: Step 0 → ER → KF → NC → coder_notes (if required) → next paper.
3. No blank cells. Uncertain = Low confidence + coder_notes entry.
4. Save at end of every sprint.
5. At end of day: log papers coded in daily tracking sheet.

## 4.3 Coding order

| Order | Period | N papers |
|---|---|---|
| 1st | 2001–2015 | 35 |
| 2nd | 2023–2025 | 139 |
| 3rd | 2016–2019 | 87 |
| 4th | 2020–2022 | 119 |

Do not code 2023–2025 last. Pokémon cluster papers: code as a discrete block.

## 4.4 Quality control checkpoints

**After 2001–2015 (35 papers):** Distribution checks per v1.0 §4.4.

**Anchor-coding protocol (new in v1.1):**

After every 75 papers coded, re-code 5 Training Set A papers without looking at original codes.

- 5/5 match answer key → proceed.
- 1–2 diverge → enter divergence in drift log; review relevant handbook section.
- 3+ diverge → STOP. Do not proceed. Diagnose and contact second coder.

**Drift log maintenance:** Record every anchor divergence. At the end of coding, attach the drift log as a supplementary file. This documents the stability of code application across the corpus.

**Self-catch protocol (new in v1.1):** If, during coding, you realize you have been applying a rule differently than intended for a sequence of papers, stop immediately. Re-code the affected sequence. Record in drift log: `drift_type = "retrospective-correction"`, the papers affected, and the rule misapplied. Do not continue coding without correcting the sequence.

## 4.5 Abstract retrieval workflow

*(Unchanged from v1.0)*

## 4.6 Stop conditions

*(Unchanged from v1.0, with addition)*

| Condition | Action |
|---|---|
| Anchor-coding produces 3+ divergences from answer key | Stop; diagnose; contact second coder |
| More than 15 Low-confidence flags in first 50 papers | Abstract fetch incomplete or decision tree node failing |
| New paper type encountered with no handbook coverage | Flag; assign provisional Low-confidence code; log as edge case |
| Coding rate below 15/day for two consecutive days | Reassess schedule |
| Second coder requests clarification | Respond within 24 hours with the handbook rule; log the question as a potential amendment |

## 4.7 File checklist before analysis

- [ ] `paper1-coding-[initials]-[date].csv` — 380 rows, all coding fields complete including `kf_confidence`, `nc_confidence`, `in_scope`
- [ ] `paper1-coding-irr-[second coder initials]-[date].csv` — ≥70 rows returned
- [ ] `paper1-drift-log.csv` — all anchor-coding sessions recorded
- [ ] `paper1-abstracts.json` — abstract cache
- [ ] `paper1-setup-report.txt` — setup documentation
- [ ] `paper1-coding-manual-v1.1.md` — this document
- [ ] OSF pre-registration link recorded in methods section

After IRR resolution: `paper1-final-coded.csv` — merged, resolved, 380 rows, ready for analysis.

---

*Paper 1 — Master Coding Manual v1.1*
*Issued: June 2026 | Post-audit revision | Before Training Set B*
*Supersedes: v1.0 (June 2026)*
*See also: `paper1-methodology-audit-v1.md` for full audit rationale*
