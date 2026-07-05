# Paper 1 — Corpus-Level Code Prevalence Forecast
## Pre-Pilot Estimate | Before Training Set B

**Basis:** Corpus metadata (380 titles, venues, years, franchise detection), venue-level classification (48 empirical-venue papers; 101 humanities-venue papers; 35 science/taxonomy-venue papers; 196 other/mixed papers), signal-count analysis by period, Training Set A answer key, Training Set B selection rationale, and methodology audit.

**Purpose:** Anticipate the full code distribution before any paper is formally coded. Informs IRR design decisions, reporting strategy, and coder preparation.

**This document does not code individual papers.**

---

## Part 1: Estimated Code Prevalence

### 1.1 Ecosystem Register (ER)

| Code | Label | Best estimate | Range | Approximate N | Confidence |
|---|---|---|---|---|---|
| ER-0 | No biological ecosystem | 5.3% | 4–7% | 15–27 | Low |
| ER-1 | Fictional with real echoes | 55.5% | 52–59% | 198–224 | **High** |
| ER-2 | Real species, no place | 22.4% | 19–26% | 72–99 | Medium |
| ER-3 | Real species, biome class | 5.3% | 4–7% | 15–27 | Low |
| ER-4 | Real species, named place | 7.9% | 6–10% | 23–38 | Medium |

**Total: 380. Residual ~9 papers (coded with Low confidence, distributed into ER-1 and ER-2).**

---

#### Evidence and reasoning for each ER level

**ER-0 (~5.3%)**

*Evidence:* Title-level ER-0 signals detected in 4 papers (Bianchi 2014 The Sims, Baker 2017 Civilization, Duncan 2018 Civilization, van Ooijen 2018 The Sims/Stardew Valley). Additional ER-0 papers expected from: papers using "ecology" as a media/systems metaphor; papers about city-builder, social simulation, and strategy games where Q0b=No; and papers whose game Q0b status is confirmed only by abstract.

*Calibration:* Training Set A returned 1/10 ER-0 (Bianchi 2014). The corpus has a natural ER-0 suppression: nearly all papers were included because they relate to ecology or nature in games, which biases toward games with at least some ecological content. Papers about purely social simulations are minority cases.

*Confidence: Low.* ER-0 assignment requires Q0b judgment, which is the most underspecified decision in the v1.0 handbook (partially resolved in v1.1). The range could shift upward if Q0b is applied broadly to games like Stardew Valley.

---

**ER-1 (~55.5%)**

*Evidence:* The largest category by far.

- **Pokémon cluster (35 papers):** All ER-1. Pokémon are fictional creatures with real taxonomic analogs. The JGS/A Bruxa/American Entomologist venue papers are all about Pokémon's real-species echoes → ER-1.
- **Additional Pokémon-title papers (26 beyond cluster, estimated):** ~24 are ER-1; ~2 might be KF-D2 with ER-1 (e.g., Pokémon Go conservation papers).
- **Minecraft papers (8 in title; ~10 total):** ER-1 (fictional world with real ecological echoes).
- **Horizon Zero Dawn papers (~8-10):** ER-1 (fictional robot-animals in a post-collapse world; not real species in real places).
- **The Last of Us papers (~5):** ER-1 (fictional cordyceps-evolved world).
- **Category-level papers (~80 papers without named games):** Most code ER-1 at Low confidence because the typical paper in this corpus analyzes games at ER-1 level; the category papers are concentrated in humanities venues where ER-1 games dominate.
- **Other single-game humanities papers (~35 papers):** Games like Firewatch, Spiritfarer, Night in the Woods, Outer Wilds, Endling, Flower, Journey, etc. = ER-1 (fictional/stylized worlds with real ecological echoes).

*Confidence: High.* ER-1 is the corpus default. The only papers that are NOT ER-1 are those with specific evidence of a different level. Training Set A confirmed 8/10 at ER-1 (and the remaining 2 were Bianchi ER-0 and Molloy ER-2 — both identifiable from title-level signals).

---

**ER-2 (~22.4%)**

*Evidence:* The second-largest category, substantially underrepresented in Training Set A (1/10 papers).

- **Animal Crossing papers (11):** All ER-2. ACNH has hundreds of real species named by real names, but the island setting is fictional with no named real-world location.
- **Red Dead Redemption 2 papers (5–7):** ER-2. Real American wildlife species (bison, wolves, bears, cougars, eagles, white-tailed deer) named in the game; but the game's geographic setting is fictional (New Hanover, West Elizabeth, etc.) — not a specific named real-world place. Q4=No → ER-2.
- **Hunting/fishing simulation game papers (~8):** ER-2 (real species, no named specific place).
- **Wildlife/zoo simulation papers (~5):** ER-2 (real species in zoo or unnamed habitat contexts).
- **Abzû papers (3–4):** ER-2 (real-inspired marine species, generic ocean, no named place).
- **Subnautica papers (1–2):** ER-2 (real-inspired deep sea ecology, fictional ocean planet).
- **Science education papers using games with real species but no named place (~12):** ER-2.
- **Other games with named real species but fictional settings (~20 papers):** ER-2.

*Confidence: Medium.* ER-2 is the primary underestimated category. Coders are likely to stop at Q2=Yes (ER-1) for games like Animal Crossing or RDR2, rather than continuing to Q3 and finding named real species. The HB-R2 "STOP HERE" marker at Q4=No is the risk point: coders reaching Q3=Yes may continue to Q5 incorrectly (ER-3 or ER-4) rather than stopping at Q4=No.

---

**ER-3 (~5.3%)**

*Evidence:* This is the hardest category to estimate from metadata alone.

- ER-3 requires: real species + biome class identifier + no specific named place.
- Candidate games: games set explicitly in "coral reef" (generic), "tropical rainforest" (generic), "boreal forest" (generic), "savanna" (generic).
- **Hobbs 2020 "Exploring Coral Reef Conservation in Minecraft":** This is an ER-3 candidate if the paper treats Minecraft's coral reef biome as real species (coral, tropical fish) in a named biome class. Provisional ER-3.
- **Fisher 2025 "Minecraft, Mangroves, and Dialogic Potential":** ER-3 if the paper treats Minecraft's mangrove biome as real species (mangrove trees, frogs) in the mangrove swamp biome class.
- **Some Planet Zoo papers (~2–3):** Real species in zoo settings with named habitat types (savanna, rainforest) → ER-3.
- **Some Beyond Blue papers (~1–2):** If the paper refers to a generic coral reef ecosystem without naming the Great Barrier Reef specifically → ER-3. If the GBR is named → ER-4.
- **Other wildlife/conservation games set in named biome types (~10–12 papers).**

*Critical uncertainty:* ER-3 vs. ER-2 is determined by Q4. Papers that identify a biome class (coral reef, tropical rainforest) are ER-3. Papers that describe real species without a location context are ER-2. The Q3/Q4 interrogation of game content — not the paper's surrounding conservation discussion — determines the code. Many papers about games like Minecraft's coral reef are actually coding the paper's conservation framing, not the game's represented ecosystem location. This may inflate ER-3 relative to the true value.

*Confidence: Low.* ER-3 is the least stable category in the distribution. It could be anywhere from 3% to 9%.

---

**ER-4 (~7.9%)**

*Evidence:*

- **Never Alone / Kisima Ingitchuna papers (~5):** ER-4. Real arctic species (arctic fox, polar bear) in named Iñupiaq homelands / Alaska.
- **Thunderbird Strike papers (~4–5):** ER-4. Real migratory birds (eagles, herons) in Great Lakes watershed (named specific place per Q5 glossary).
- **Beyond Blue papers (~3):** ER-4 if the Great Barrier Reef is named. The game features real named deep-sea species in the GBR context.
- **Other Indigenous game papers in named territories (~5–6):** ER-4 depending on species documentation.
- **Papers about games explicitly set in documented real ecosystems with named species (~8–10):** Some titles from 2020–2025 engage with real-place games (Eco, some serious conservation games).
- **Possibly some Pokémon Go papers:** PokéGo places fictional creatures in real-world locations, but Pokémon are not real species → ER-1, not ER-4. (Real location ≠ ER-4 when Q3=No.)

*Confidence: Medium.* The Indigenous game corpus is well-documented and identifiable from titles/venues; these papers are almost all ER-4. The uncertainty is in the broader set of "real ecosystem" papers where ER-4 vs. ER-3 depends on Q5 resolution.

---

### 1.2 Knowledge Framework (KF)

| Code | Label | Best estimate | Range | Approximate N | Confidence |
|---|---|---|---|---|---|
| KF-A | Ecocritical / literary | 47.1% | 43–52% | 163–197 | **High** |
| KF-B | Scientific / STEM | 11.1% | 9–13% | 34–49 | **High** |
| KF-C | Indigenous / TEK | 2.4% | 2–4% | 8–15 | Medium |
| KF-D1 | Theoretical conservation | 15.8% | 13–19% | 49–72 | Medium |
| KF-D2 | Empirical conservation | 11.1% | 9–14% | 34–53 | Medium |
| KF-E | Design / systems | 5.0% | 3–7% | 11–27 | Low |
| KF-F | Other / unclear | 2.9% | 2–5% | 8–19 | Low |

**KF is the most heterogeneous variable and the one where coder judgment has the greatest influence on the distribution.**

---

#### Evidence and reasoning for each KF level

**KF-A (~47.1%)**

*Evidence:* This is the dominant framework by a large margin.

- 101 humanities-venue papers (26.6% of corpus): essentially all KF-A.
- Most of the 196 mixed-venue papers (book chapters, edited volumes, interdisciplinary journals): the majority of edited volumes in this corpus (Playing Nature, Mediating Nature, Green Media and Popular Culture, Ecomedia: Key Issues, Environmental Humanities approaches) are ecocritical.
- Training Set A: 8/10 = KF-A; only the Weagly (KF-B) and Balmford (KF-D2) exceptions emerged.
- Papers in Games and Culture, Game Studies, Game & Culture, DiGRA proceedings, cultural studies journals = predominantly KF-A.
- Period trend: KF-A proportion decreasing over time (2001–2015 ~80%; 2023–2025 estimated ~35–40%) but remains plurality.

*Confidence: High.* The humanities-analytical tradition founded this field and continues to dominate. KF-A is the safest default for papers from humanities venues without strong D1/D2/B signals.

**The KF-A/KF-D1 boundary is the most consequential unresolved split.** Many papers about games and ecology in humanities venues are not purely descriptive (NC-1/KF-A) — they argue that games matter for environmental engagement. Whether they are KF-A (interpretive argument about cultural meaning) or KF-D1 (theoretical claim about conservation outcomes) depends on the governing question. In the 2023–2025 period, where climate urgency rhetoric pervades papers, this boundary will be contested frequently.

---

**KF-B (~11.1%)**

*Evidence:*

- **Pokémon cluster (35 papers):** ~25 are KF-B (JGS taxonomy papers comparing Pokémon to real insects, birds, amphibians; American Entomologist paradox papers; A Bruxa Brazilian taxonomy papers). ~8 are KF-A (ecocritical analysis of Pokémon's ecological framing). ~2 are KF-D2 (empirical engagement studies).
- **Additional science/taxonomy papers (~7–10 beyond cluster):** Weagly 2013 (Minecraft/soil science), Lupton 2017 (Pokémon citizen science), Alcott 2025 (Anthro-Pokécene environmental impact), Rangel 2024 (Pokémon ecology teaching).
- **Science education papers using game content for science learning (~5–7):** Papers where the governing question is what real science is in the game (KF-B) rather than whether the game improves learning (KF-D2).

*Confidence: High.* The cluster is well-defined. The KF-B count is anchored by the Pokémon taxonomy cluster, which is identifiable from venue alone. The upper bound depends on how many non-cluster papers also take a scientific/taxonomic approach.

---

**KF-C (~2.4%)**

*Evidence:*

- 12 Indigenous-signal papers identified by keyword detection.
- Of these 12: ~8–9 are likely KF-C (LaPensée 2018, Meloche 2017, Barnes 2021, Lohne 2020, Kinder 2021, Miner 2022, one or two Galloway).
- ~3–4 are KF-A (Attebery 2020 using Western posthumanism on Indigenous game, Silva 2023, possibly Bledstein 2017).
- Additional KF-C papers may exist from the 2023–2025 period where Indigenous game studies is growing; estimate 1–3 more beyond keyword detection.

*Confidence: Medium.* The keyword detection captures the main cluster. The HB-V4 distinction (Indigenous methodology vs. Indigenous content) means that some keyword-detected papers will be re-coded KF-A upon abstract review. The true KF-C count may be as low as 6 or as high as 15 depending on how widely the Indigenous gaming literature has grown in 2023–2025.

---

**KF-D1 (~15.8%)**

*Evidence:*

- Papers in Conservation Letters, Ambio (non-empirical), book chapters about games and conservation potential: ~15–18 papers from identifiable venues.
- Pokémon Go wave (2016–2018): many papers arguing theoretically about PokéGo's conservation potential (~6–8 papers).
- Mixed-venue papers with "conservation," "biodiversity," "potential of games" title signals (~20 papers).
- Papers in games-for-good, serious games, and gamification literature arguing theoretically about conservation outcomes (~15 papers).
- Total KF-D1 from these sources: ~55–65 papers.

*Key uncertainty:* The KF-A/KF-D1 boundary is the most contested partition in the entire scheme. Papers that analyze games and then argue in their conclusion that games "could foster ecological awareness" may be KF-A (if the governing question is interpretive) or KF-D1 (if the governing question is about ecological outcomes). This boundary alone could shift the KF-D1 count by ±15 papers.

*Confidence: Medium.*

---

**KF-D2 (~11.1%)**

*Evidence:*

- Empirical-venue papers with strong D2 signals: ~30 papers from People and Nature, CHI, Ecosphere, ARISE, Journal of Environmental Psychology, Future Internet, Entertainment Computing.
- Additional D2 papers from mixed venues with explicit participant data: ~10–12 papers.
- Period trend: KF-D2 almost nonexistent pre-2016, rising sharply in 2020–2025. The 2023–2025 period alone likely contains 15–20 KF-D2 papers.

*Confidence: Medium.* KF-D2 is well-identifiable from venue signals. The HB-R4 trigger-word check will correctly classify most D1/D2 boundary papers upon abstract review. The range (34–53 papers) reflects uncertainty about the unclassified mixed-venue papers in 2023–2025.

---

**KF-E (~5.0%)**

*Evidence:*

- Design-signal papers in title: 20 papers (but many of these are KF-A using design vocabulary, not primary design analysis).
- Clear KF-E candidates: Chang 2019/2020 manifestos, Whittle 2022 Environmental Game Design Playbook, Jayaraman 2023 design principles, Daiiani 2024 eco-game design lessons, Martin 2024 (from superficial skins to deep ecology), Abraham 2022 (What Is an Ecological Game?).
- Estimated actual KF-E count: 15–22 papers.

*Confidence: Low.* KF-E is the least recoverable category from title/venue metadata. The KF-A/KF-E distinction requires reading whether the paper's evidence is textual/narrative (KF-A) or rule-system/procedural (KF-E). Many papers that appear to be KF-E from their titles (e.g., "ecological game design") are actually KF-A papers that discuss design within an interpretive framework.

---

**KF-F (~2.9%)**

*Evidence:*

- Papers using frameworks that don't fit the KF taxonomy: game theory, neuroeconomics, computational linguistics approaches to game text, GIS analysis.
- Papers where the governing question is genuinely unclear from available metadata.
- Estimated: 8–15 papers.

*Confidence: Low.* KF-F should be the last resort. Under the v1.1 scheme, a paper assigned KF-F during the coder's pass should trigger abstract access and a second attempt at classification. KF-F papers in the final dataset represent genuine ambiguity, not failure to look.

---

### 1.3 Normative Claim Level (NC)

| Code | Label | Best estimate | Range | Approximate N | Confidence |
|---|---|---|---|---|---|
| NC-1 | Descriptive | 58.4% | 55–63% | 209–239 | **High** |
| NC-2 | Behavioral / pedagogical | 19.7% | 16–23% | 61–87 | Medium |
| NC-3 | Conservationist / policy | 19.5% | 16–23% | 61–87 | Medium |

**NC is the most balanced variable — the only one with no single category below 15%.**

---

#### Evidence and reasoning for each NC level

**NC-1 (~58.4%)**

*Evidence:*

- All KF-B papers (~42): taxonomic/scientific descriptions make no audience-effects claims → NC-1.
- All KF-C papers (~9): cultural/spiritual documentation → NC-1.
- Most KF-A papers (~145–155): ecocritical analyses describe game representation without making explicit behavioral claims. The NC-1 floor rule absorbs papers with opening ecological-crisis framing but descriptive contributions.
- Some KF-E papers (~12): design analysis without conservation claims → NC-1.
- Some KF-D1 papers (~20): theoretical papers that argue games "should" support conservation make NC-3 claims, but some KF-D1 papers only argue games "could" = implied, not explicit → NC-1.

*Confidence: High.* NC-1 is driven by KF-A/B/C dominance. The NC floor rule (HB-3) means that ambiguous papers default to NC-1. The challenge is that the NC-1 count will be inflated if coders apply the "explicit" threshold correctly — and deflated if they over-code as NC-2.

---

**NC-2 (~19.7%)**

*Evidence:*

- KF-D2 papers (~42): most measure individual-level outcomes (attitude change, behavior change, knowledge change). These are NC-2 unless framed at conservation-sector scale.
- KF-D1 papers (~15–20): papers arguing games "can" produce individual awareness → NC-2.
- Some KF-A papers (~10–15) making explicit awareness/empathy claims: papers using phrases like "games can foster environmental empathy," "foster biophilic connection" = NC-2.
- Title-signal count: 35 papers with NC-2-only title signals (learning, attitude, behavior, empathy, awareness). This is a lower bound; actual NC-2 count from abstracts is higher.

*Confidence: Medium.* NC-2 is the boundary category. It requires: (a) an explicit claim about effects on people, AND (b) those effects being at individual (not conservation-sector) level. The "explicit vs. implied" distinction (HB-V3) will determine whether many KF-A papers with awareness language are NC-1 or NC-2.

---

**NC-3 (~19.5%)**

*Evidence:*

- KF-D1 papers arguing for conservation-sector outcomes (~35 papers): "games can/should support conservation," "implications for conservation practice," "lessons for conservation."
- Papers in Conservation Letters, Ambio, Ecosphere, People and Nature framing at population/sector level (~15 papers).
- Some KF-D2 papers (~8–10) framing individual outcomes within conservation-sector implications.
- Title-signal count: 19 papers with NC-3-only title signals (conservation, biodiversity conservation, rewilding). Lower bound.
- Additional ~20–25 papers with conservation-sector framing in abstract but not title.

*Confidence: Medium.* NC-3 is well-defined at the extremes (Balmford 2002, Dorward 2016, Salvador 2017 Tentacle) but the interior is contested. The NC-2/NC-3 boundary (individual vs. population/sector level) is the third most predicted disagreement in Training Set B.

---

## Part 2: Categories Below 5% Threshold

| Category | Best estimate | Issue |
|---|---|---|
| ER-0 | ~5.3% (borderline) | Q0b judgment-dependence; could shift ±5 papers |
| ER-3 | ~5.3% (borderline) | Least stable; Q3/Q4 boundary confusion |
| KF-C | ~2.4% | Too small for per-class IRR statistics |
| KF-F | ~2.9% | By design small; residual category |
| KF-E | ~5.0% (borderline) | KF-A/KF-E boundary unstable |

**Strictly below 5% (<19 papers): KF-C (~9), KF-F (~11), KF-E (~19 borderline)**

**Borderline 4–6% (<24 papers): ER-0 (~20), ER-3 (~20), KF-E (~19)**

---

## Part 3: Implications

### 3.1 Weighted Kappa

**ER Kappa — prevalence paradox warning:**

With ER-1 at ~55.5%, the expected-agreement probability under Kappa is high even if coders code randomly within ER-1. Cohen's Kappa is notoriously depressed when one category strongly dominates — this is the Feinstein-Cicchetti paradox (1990). At ~55.5% ER-1, a Kappa of 0.70 might represent genuinely good agreement (most papers are agreed ER-1, few edge cases), while a Kappa of 0.80 achieved only on low-ambiguity papers may be inflated by the ER-1 anchor.

**Recommended mitigation:** Pre-specify and report:
1. Overall weighted Kappa (quadratic) per §3.4 of the v1.1 handbook
2. Per-class percent agreement with confidence intervals for each ER level
3. A separate analysis of the ER-2/ER-3/ER-4 subsample only (papers where the coder traversed Q3 or deeper), where the real diagnostic information lives

**ER-3/ER-4 base-rate concern:**

ER-3 (~5.3%) and ER-4 (~7.9%) combined = ~13.2% of corpus = ~50 papers. In the 76-paper IRR subsample, expect roughly 5–7 ER-3 papers and 6–8 ER-4 papers. Per-class Kappa for ER-3 with 5–7 papers will be highly unstable; report percent agreement instead.

**KF Alpha — seven-category challenge:**

Krippendorff's alpha for a 7-category nominal scheme on 76 papers will be harder to achieve than for a 3-category scheme. The threshold of α ≥ 0.70 for a scheme with 47% in one category (KF-A), 2.4% in a rare category (KF-C), and genuine boundary uncertainty (KF-A/D1, KF-D1/D2) is ambitious. Consider reporting alpha at three levels of aggregation:
1. Full 7-category scheme (α₇)
2. Collapsed 4-category scheme: {A+E+C = interpretive} vs {B = scientific} vs {D1+D2 = conservation} vs {F = other} (α₄)
3. The specific D1 vs D2 split within conservation papers only

If α₄ meets threshold but α₇ does not, the disagreement is localized to specific boundary pairs, not the full scheme.

**NC Alpha — most stable:**

NC's 3-level ordinal scale with near-symmetric distribution (58/20/20) is the most Kappa-friendly structure in the study. Alpha should meet threshold if the NC-1/2 boundary is well-trained (which Training Set B addresses directly).

---

### 3.2 Category Stability

**Stable (no concern):**
- ER-1: very large, well-defined, anchors the distribution
- KF-A: very large, well-defined
- KF-B: well-defined through Pokémon cluster; stable
- NC-1: very large, anchors the distribution

**Potentially unstable — monitor during pilot:**

**ER-3 (borderline):** The Q5 biome-class branch has never been traversed in training. If coders systematically answer Q4=No for games with biome-class locations (treating "coral reef" as "no specific place" → ER-2 instead of ER-3), the ER-3 count will be depressed. If coders over-extend Q5 to games where Q4 should be No (continuing past the ER-2 terminal branch), ER-3 will be inflated. Either error is plausible; ER-3 could realistically range from 2% to 9%.

**KF-E (borderline):** The KF-A/KF-E boundary is defined by evidence type (textual vs. rule-system), but many papers use both types of evidence. If coders default KF-A for all interpretive-sounding papers, KF-E will collapse to near-zero. If coders over-extend KF-E to any paper mentioning game mechanics, it will inflate to ~10%.

**KF-C (small but theoretically protected):** Do not collapse KF-C with KF-A for analytic convenience. The Indigenous gaming literature is a theoretically significant subfield. Report KF-C separately even if n=8–9 prevents per-class statistics.

**KF-F (residual):** Should shrink during coding as abstract review resolves ambiguous papers. If KF-F exceeds 20 papers in the final dataset, it indicates a systematic failure of the KF classification scheme for a type of paper not anticipated in the handbook.

---

### 3.3 Reviewer Interpretation

**The ER-1 dominance finding (~55%) is the primary empirical contribution of Paper 1.**

This number validates the "ecological grounding" construct. A field that calls itself about "biodiversity and digital games" should, if ecologically grounded, produce papers about games with documented species in specific places (ER-3 or ER-4). Instead, ~55% of papers are about games with purely fictional-ecological connections and ~22% are about games with real species but no documented place. Combined, ~78% of papers sit at ER-1 or ER-2 — fictional or place-unmoored. Only ~13% of papers examine games that situate real species in identified biomes or documented places.

This is the franchise selection effect made measurable.

**The KF-A dominance finding (~47%) confirms the humanities monoculture hypothesis.**

Nearly half of all papers deploy interpretive/aesthetic methods. The epistemological plurality of the field — its capacity to produce empirical or Indigenous or design-led knowledge — is limited. KF-D2 at ~11% and KF-C at ~2.4% will frame the "what is missing" argument.

**The NC-3 at ~20% finding is the claim-reality gap.**

One in five papers makes conservation-sector claims. Combined with the ER-1/ER-2 dominance finding (most papers study ecologically unmoored games), this produces the key internal-consistency result: papers claiming conservation-sector relevance are predominantly studying games that cannot provide documented species information. The claims are normatively ahead of the objects of study.

**Reviewers in quantitative venues will check:**
- Whether ER-3+ER-4 Kappa is reported separately (base-rate instability)
- Whether the KF-C count is robust (small n, theoretically meaningful)
- Whether NC-2 vs NC-3 boundary decisions were made independently

**Reviewers in humanities venues will ask:**
- Whether ER-1 is being unfairly penalized (most ecocritical games intentionally use fictional creatures)
- Whether KF-A's dominance is analytically significant or just reflects who publishes in this area
- Whether NC-3 papers have been read uncharitably

Pre-empt the humanities reviewer concern: ER-1 is not a negative code. The finding is about the distribution across levels, not the value of any level. The paper should explicitly state this.

---

### 3.4 Reporting Strategy

**ER reporting:**
- Report all five levels in the main results table
- Flag that ER-3 and ER-4 combined represent ~13% of the corpus; per-class Kappa should not be reported for ER-3 alone if n < 15 in the IRR subsample
- Visualize the ER distribution as a stacked bar by period to show temporal trends (ER-4 likely increasing 2017–present as Indigenous game studies grows)
- Explicitly state the franchise selection interpretation of the ER-1 dominance

**KF reporting:**
- Report all seven levels in the main results table
- Supplement with a 4-category collapsed version {Interpretive, Scientific, Conservation-theoretical, Conservation-empirical} for readability
- Report KF-C separately and prominently; its small size does not diminish its theoretical significance
- Note that the KF-A/KF-D1 boundary was the most contested classification decision and report disagreement rate for that specific boundary

**NC reporting:**
- Report all three levels
- The near-symmetric distribution (58/20/20) supports a simple visual (stacked bar or three-segment pie)
- Cross-tabulate NC against KF: the KF-D2 × NC-2 and KF-D1 × NC-3 cells are the diagnostic cells for the claim-reality analysis
- Cross-tabulate NC against ER: the NC-3 × ER-1 cell is the claim-reality gap finding

**Recommended tables for the paper:**
1. Table 1: Corpus overview by period (N, % by ER level, % by KF level, % by NC level)
2. Table 2: IRR statistics (Kappa for ER, α for KF and NC, per-class agreement for small categories)
3. Table 3: Cross-tabulation ER × KF (3-category KF collapse for readability)
4. Supplementary table: Full ER × KF × NC joint distribution for reproducibility

---

## Part 4: Categories to Monitor During Pilot Coding

| Category | Monitor for | Stop condition |
|---|---|---|
| **ER-3** | Systematic undercount (coders stopping at ER-2 without traversing Q4=Yes/Q5) OR systematic overcount (coders extending to Q5 from Q4=No) | If ER-3 count is 0 after 75 papers: Q3/Q4 branch is failing |
| **KF-E** | Collapse into KF-A (coders defaulting A for all interpretive-sounding design papers) | If KF-E count is <5 after 100 papers: consider whether the KF-A/KF-E distinction is operationally maintainable |
| **KF-C** | Inflated by HB-V4 failure (coders assigning C to papers with Indigenous content but Western methodology) | If KF-C count exceeds 20 papers, audit the KF-C papers: how many are Indigenous methodology vs. Indigenous content analyzed through Western theory? |
| **KF-F** | Slow to converge to zero (papers stuck as unclassifiable) | If KF-F count exceeds 15 after 200 papers: the KF scheme has a systematic gap |
| **ER-0** | Over-applied (coders using Q0b too broadly, including games with minimal ecological content) | If ER-0 count exceeds 25 papers: review all ER-0 assignments for Q0b criterion consistency |
| **NC-2/NC-3 ratio** | Systematic upward drift (coders upgrading to NC-3 from NC-2 in later sessions — coder drift toward conservation-sector framing) | If NC-3 > NC-2 by >15 percentage points after 150 papers: anchor-coding session with Balmford vs. Dunn (NC-3 vs. NC-2) |

### Collapse/merger recommendations if monitoring triggers

**If KF-E < 10 papers total after full coding:** Merge KF-E into KF-A for the published typology but maintain the separate code in the dataset for transparency. Report the merger decision and the number of KF-E papers absorbed.

**If KF-F > 20 papers:** Extract the KF-F papers, examine them for a common framework, and either create a KF-G (emerging empirical/computational approaches) or add worked examples to the handbook for that paper type.

**Do not collapse KF-C into KF-A** regardless of count. KF-C is theoretically and ethically distinct. It should be maintained as a separate category and its small size should be reported as an empirical finding about the field's engagement with Indigenous knowledge systems.

**Do not collapse ER-3 into ER-2** if the count is low. A small ER-3 count is itself a finding: it means game developers and scholars rarely anchor real species to biome classes without also naming a specific place. Collapsing would erase this.

---

## Summary — Pre-Pilot Forecast

| Variable | Most likely distribution | Primary risk |
|---|---|---|
| ER | 55% ER-1 anchored; ER-2 second (~22%); ER-3/4 small (~13% combined) | ER-3 instability; ER-1 Kappa paradox |
| KF | KF-A plurality (~47%); KF-D1/D2 together second (~27%); KF-B third (~11%) | KF-A/D1 boundary; KF-C inflation via HB-V4 failure |
| NC | NC-1 plurality (~58%); NC-2/NC-3 near-symmetric (~20% each) | NC-1/2 upgrade inflation; NC-2/3 under-discrimination |

The most important pre-pilot finding: **the corpus is structurally simpler than the handbook**. Most papers will be straightforward ER-1/KF-A/NC-1. The handbook's complexity — the Q3-through-Q5 path, KF-C, NC-3, multi-game rules — is designed for a minority of papers (~25%) that sit at genuine boundaries. If the handbook survives Training Set B, it will code 75% of the corpus on autopilot. The question is whether it handles the 25% correctly.

---

*Paper 1 — Corpus-Level Code Prevalence Forecast*
*Issued: June 2026 | Before Training Set B | Before pilot coding*
*Evidence base: 380-paper corpus metadata, venue analysis, signal-count cross-tabulation by period*
