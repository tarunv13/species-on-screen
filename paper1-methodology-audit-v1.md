# Paper 1 — Methodological Audit
## Version 1.0 | Pre–Training Set B Review

**Scope:** Full workflow audit against standards from qualitative research, evidence synthesis, content analysis, and human–AI coding studies.
**Basis:** 380-paper corpus, Coding Handbook v1.0, Training Set A calibration log, IRR package design, and corpus execution protocol.
**Purpose:** Identify threats to publishability before full coding begins. Not a coding exercise.

---

## Executive Summary

The Paper 1 workflow is **publishable in humanities venues with targeted revisions** and **requires major restructuring for quantitative or evidence-synthesis venues**. The most serious threat is not inter-rater reliability or coding scheme precision — it is the undisclosed role of AI in scheme development and calibration, which is currently invisible in every protocol document and would be a live methodological issue at peer review in every listed venue. The second most serious threat is the absence of any operationalized confidence rules for KF, and the absence of any worked examples for ER-3, ER-4, NC-2, or NC-3 — which means 380 papers will be coded against untested handbook territory.

**Overall risk profile:** Low for Environmental Humanities / Digital Humanities. Moderate for Qualitative Research. High for Conservation Biology / Evidence Synthesis journals.

---

## Part A: Methodological Weaknesses That Could Threaten Publication

### A.1 Reproducibility

**Definition:** Given the same materials and protocol, another researcher applying the scheme independently produces the same codes.

**Weaknesses:**

**A.1.1 — Operational underdetermination of Q0b.**
The Step 0 checklist asks "Does this game have a biological ecosystem?" but provides no decision tree for answering this question. The handbook provides examples (The Sims, SimCity, FarmVille = No; hunting simulations, wildlife parks = Yes) but these examples do not cover the large middle ground: games like Stardew Valley (farming mechanics, some real crop/animal names, no ecological modeling); Eco (explicitly models an ecosystem with pollution and extinction cascades — almost certainly Yes, but is a biome class or named place involved?); Shelter (player is a badger mother in a forest — biological ecosystem? Yes? But the forest is unnamed). Anywhere Q0b judgment is required, reproducibility fails if the judgment rule is not specified.

**A.1.2 — "Intended biological analog" is not operationally defined.**
Q1 asks whether the game "consists entirely of invented species with no intended biological analog." The word "intended" is unverifiable from a paper title or abstract. For Spore: was the evolutionary simulation "intended" to have biological analogs? For Horizon Zero Dawn: the robot animals mimic real megafauna (GAIA's restoration project is central to the narrative) — is the intent biological? For most papers in the corpus, neither the paper nor the abstract will answer this question about designer intent. The Q1 criterion needs to shift from intent to textual evidence.

**A.1.3 — KF confidence rules are absent.**
The handbook specifies ER confidence rules (High/Medium/Low) and NC confidence rules (HB-R3) but has no operationalized confidence rules for KF. Since KF requires abstract review for D1/D2 distinction and abstract access correlates with confidence, the absence of KF confidence rules means different coders will apply different implicit standards. This produces a ghost reliability problem: official KF codes may agree while confidence levels systematically diverge.

**A.1.4 — ER confidence rules stop at ER-2.**
All 10 Training Set A papers were ER-0 or ER-1 (9 papers) or ER-2 (1 paper, Molloy2011). The handbook's ER confidence worked examples therefore provide no guidance for papers coded ER-3 or ER-4. Given that ER-4 papers likely include some of the most important papers in the corpus (specific ecosystem-anchored games like Never Alone, Beyond Blue, Thunderbird Strike), this is a meaningful gap.

**A.1.5 — Multi-game rule creates reproducibility failure at the primary-game level.**
HB-9 assigns the highest ER level present across all games. This is reproducible at the ER level. But the `game_primary` field, which records the primary game, has no rule governing which game to enter when the highest-ER game is not the most-analyzed game. Two coders applying HB-9 will agree on `er_code` but produce different `game_primary` entries, and franchise detection then propagates the disagreement.

---

### A.2 Replicability

**Definition:** A different research team applying the same protocol to the same corpus reaches convergent conclusions.

**Weaknesses:**

**A.2.1 — Coding scheme was developed post-hoc, through iterative calibration, without pre-registration.**
The ER/KF/NC framework was refined through 11 pre-coding revisions before Training Set A began, and then through 14 handbook amendments (HB-1 through HB-9, HB-R1 through HB-R5) generated during Training Set A calibration. This is standard in grounded theory but creates a replicability problem in content analysis: the rules that govern the corpus were partly induced from the training papers, which are also in the corpus. A different team would likely develop different rules or encounter different failure modes.

**Mitigation available:** Pre-registration of the v1.0 handbook on OSF before full coding begins. The current date (June 2026) is before full coding; this is still possible. Pre-registration also resolves the post-hoc revision concern if it documents all amendments to date.

**A.2.2 — The "franchise detection" pre-population biases coder attention.**
The `franchise` column is auto-populated before coding. Cognitive science research on coding reliability (Intercoder Reliability, Campbell et al. 2013; MacPhail et al. 2016) consistently shows that pre-loaded categorical cues produce anchoring bias. A coder who sees `franchise = Pokémon` before reading the title may attend differently to the paper's ecosystem claims than a coder who reads the title cold.

**A.2.3 — Training Set A answer keys were co-produced with an AI, not independently derived.**
See A.9 (Human–AI role separation) for full treatment. The consequence for replicability: a second team's Training Set A calibration would use different training materials, reach different initial calibration states, and might develop different handbook rules. The published paper cannot describe Training Set A as an "independent answer key" because it was not independent.

---

### A.3 Dependability

**Definition (Lincoln & Guba):** The process of inquiry is consistent and reasonably stable over time and across coders.

**Weaknesses:**

**A.3.1 — No anchor-coding checkpoints scheduled.**
The corpus execution protocol mandates quality-control checks after 35 papers and after 174 papers (end of Period 2), but these checks examine distribution patterns, not coder self-consistency. There is no protocol for re-coding previously coded papers at regular intervals to detect personal drift. Krippendorff (2004, p. 219) recommends re-coding 10% of already-coded units at 100-paper intervals; the current protocol has no equivalent mechanism.

**A.3.2 — Coding sessions are long (90-minute sprints) without within-session quality gates.**
Research on content-analytic coder performance (Lombard, Snyder-Duch, & Bracken, 2002) demonstrates systematic within-session drift: coders apply more liberal thresholds near the end of long sessions and assign fewer Low-confidence flags when fatigued. The current protocol sets no within-sprint target, no mandatory pause at 15 papers, and no self-consistency check before the session closes. In a 25-paper daily target coded across two 90-minute sprints, the 23rd–25th papers will systematically receive less rigorous scrutiny than the first five.

**A.3.3 — The second coder operates on a single, fixed pass.**
The IRR protocol specifies a 76-paper pass by the second coder by July 19, with one resolution session afterward. This design does not detect second-coder drift within their own 76-paper pass. If the second coder codes papers 1–25 on a different day from papers 26–76, within-coder reliability is never tested.

---

### A.4 Transferability

**Definition (Lincoln & Guba):** The degree to which findings can be applied to other contexts; requires thick enough description that readers can assess fit.

**Weaknesses:**

**A.4.1 — The Pokémon cluster treatment is not transferable.**
The `pokemon_cluster=Y` coding and its analysis as a "Pokémon taxonomy sub-corpus" is specific to this corpus. This is not a weakness for Paper 1, but any future researcher attempting to apply the coding scheme to a different literature corpus would not know to expect it. The v1.0 handbook makes no mention of why the Pokémon cluster exists or how to detect analogous clusters in other corpora (e.g., a corpus of climate games might have a Civilization VI cluster).

**A.4.2 — KF-C (Indigenous/TEK) is operationalized at a level of generality that would not transfer to corpora with more Indigenous scholarship.**
KF-C is described as applying when the research question "primarily engages Indigenous knowledge systems, Traditional Ecological Knowledge, decolonial ecology, or specific Indigenous community ecological practices." This definition is adequate for a corpus where only 12 of 380 papers (3.2%) were keyword-detected as Indigenous, but it would be systematically underdetermined for a corpus where Indigenous scholarship is more central. The decision tree does not distinguish between: (a) papers that analyze Indigenous games from an outside perspective; (b) papers that center Indigenous knowledge systems in their methodology; (c) papers authored by Indigenous scholars using ILK frameworks. These require different treatment.

**A.4.3 — The ER scale is calibrated to games and would not transfer without revision to other media (film, documentary, fiction).**
This is expected — Paper 1 is a games corpus. But the v1.0 handbook should explicitly state that the ER scale was developed for and validated on games scholarship only, to prevent misapplication.

---

### A.5 Reflexivity

**Definition:** Explicit acknowledgment of the researcher's positionality and its influence on data collection, analysis, and interpretation.

**Weaknesses:**

**A.5.1 — No reflexivity statement exists anywhere in the protocol documents.**
The protocol documents (handbook, spreadsheet specification, IRR package, execution protocol) contain no reflexivity statement. For Qualitative Research journal, this is a rejection criterion. For Environmental Humanities, it is a strong expectation. The statement does not need to be lengthy, but it must address: (a) the researcher's relationship to game studies; (b) whether the researcher has preferences about particular games or genres that could bias ER/KF/NC coding; (c) the novel position of being both scheme designer and Coder 1.

**A.5.2 — Researcher-as-Coder-1 is the most significant reflexivity concern and is not addressed.**
Standard content analysis practice either (a) uses two independent coders where neither designed the scheme, or (b) uses the scheme designer as one coder and documents this asymmetry explicitly. In this study, the scheme designer is Coder 1 and designed both the scheme AND the training data AND the answer key. This triple overlap means Coder 1 is more likely to code in line with the handbook's implicit rules (they authored those rules) than Coder 2, which produces a systematic bias in the IRR that will never be detected by the Kappa calculation alone.

**A.5.3 — The "ecological grounding" construct was named by the researcher and will be analyzed by the researcher.**
If "ecological grounding" is the core theoretical construct (which the doctoral roadmap confirms), then Coder 1 has a vested theoretical interest in demonstrating that the corpus is poorly ecologically grounded. This is not a criticism of the researcher's integrity — it is a structural feature of researcher-designed coding schemes that must be declared.

---

### A.6 Transparency

**Definition:** Every methodological decision is visible and documented in a retrievable form.

**Weaknesses:**

**A.6.1 — The 11 pre-coding revisions are not documented.**
The summary notes that the coding scheme underwent "11 pre-coding revisions" before Training Set A. None of these revisions are documented anywhere in the published protocol materials. A reviewer cannot reconstruct what the coding scheme looked like before revision 1, what triggered each revision, or whether any revisions were reversed. This is an audit trail gap.

**A.6.2 — The human–AI dialogue that produced the handbook rules is not citable.**
Every handbook rule (HB-1 through HB-9, HB-R1 through HB-R5) was generated through a structured dialogue between the researcher and an AI assistant. The dialogue exists in a JSONL file but is not structured as a citable methodological document. A methods section that says "the coding scheme was refined iteratively through Training Set A calibration" without disclosing the AI's constitutive role is incomplete.

**A.6.3 — The coding handbook does not record when each amendment was triggered.**
HB-1 through HB-9 appear in a numbered list with "Training Set A" as the source citation for all nine. But the audit log from Training Set A shows these rules were triggered by specific papers (HB-3 by Ulman2001, HB-5 by Molloy2011, HB-6 by Bianchi2014, etc.). The published handbook does not preserve this causal chain.

---

### A.7 Auditability

**Definition:** An independent auditor can reconstruct the reasoning behind each coding decision.

**Weaknesses:**

**A.7.1 — Coder_notes are required only for Low-confidence papers.**
The protocol requires coder_notes for all Low-confidence papers but makes no specification for High or Medium confidence papers. An auditor reviewing the completed spreadsheet cannot reconstruct the reasoning for the majority of coding decisions unless the coder voluntarily added notes. This is an audit trail insufficiency.

**A.7.2 — No "considered-and-rejected" record exists.**
When a coder applies Q1 and considers ER-0 before committing to ER-1, this deliberation leaves no trace. Krippendorff (2018, p. 141) recommends that coding protocols include a mechanism for recording "seriously considered alternatives," particularly for papers where the coder's initial tentative code differed from the final code. This is especially important for multi-step decision trees where branches 3–4 are traversed before a code is reached.

**A.7.3 — The pilot Training Set B session has no structured output format.**
The IRR package specifies that Training Set B disagreements will be discussed "before proceeding to the IRR subsample" but does not specify what documentation is produced. If the pilot session surfaces a new handbook rule, there is no mandatory amendment-logging procedure equivalent to the HB amendment system.

---

### A.8 Coder-Drift Resistance

**Definition:** The coding scheme, protocols, and workflow prevent systematic changes in coder behavior over the duration of the coding task.

**Weaknesses:**

**A.8.1 — No anchor papers are scheduled.**
The most robust defense against coder drift in long content analysis tasks is the anchor paper protocol: 5–10 previously coded papers are re-coded without access to original codes at regular intervals (every 50–100 papers). The current protocol has quality checks (distribution audits) but no anchor re-coding.

**A.8.2 — Period order creates anchoring drift risk.**
The recommended coding order begins with 2001–2015 (35 papers). This period has the highest proportion of ecocritical/literary papers (KF-A), the lowest proportion of empirical papers (KF-D2), and is dominated by ER-1 papers. Coding this period first anchors the coder to a "typical paper looks like ER-1/KF-A/NC-1" heuristic that may be incorrect for the 2023–2025 period, which likely contains more KF-D2, more NC-2/NC-3, and more ER-3/4 papers. This creates systematic underestimation of ER level and NC level in later papers.

**A.8.3 — No procedure for when the coder catches themselves applying a rule differently than earlier.**
This happens in every long coding project. The protocol says nothing about how to handle the realization "I think I've been coding KF-D1 papers as KF-A for the last 20 papers." Without a protocol, coders either ignore the retrospective insight or retroactively recode without documentation — both are methodological problems.

---

### A.9 Human–AI Role Separation

**Definition:** In studies where AI tools contributed to methodology, the specific role of each is documented, and no AI contribution is misrepresented as independent human judgment.

This is the most significant gap in the current protocol. It requires extended treatment.

**The AI's actual role in this study:**

The AI assistant (Claude Sonnet 4.6) performed the following functions:
1. **Scheme co-development:** All three variables (ER, KF, NC), their scale definitions, and decision tree structure were developed through iterative human-AI dialogue.
2. **Answer key co-authorship:** The Training Set A answer key was produced collaboratively. The "ground truth" was reached through AI challenge, human revision, and AI confirmation — it was not independently derived by a methodologist.
3. **Handbook rule generation:** Every HB and HB-R rule was either proposed by the AI or confirmed by the AI after being triggered by a coder error. The AI acted as a de facto methodologist.
4. **Second-coder simulation:** During Training Set A, the AI acted as a simulated second coder, challenging human codes and identifying procedural errors. This is not IRR in any conventional sense — it is AI-mediated calibration.
5. **Coder training:** The AI administered the training protocol and gave feedback on each code. This is unprecedented in qualitative research literature.

**Why this matters for publication:**

| Venue | Risk |
|---|---|
| Environmental Humanities | AI authorship norms emerging; disclosure expected; not likely a rejection criterion if disclosed |
| Conservation Biology | Would scrutinize the lack of independent ground truth; the AI "answer key" may not be acceptable as an IRR baseline |
| Digital Humanities | Could be framed as a methodological contribution if documented transparently |
| Qualitative Research | Would question whether the AI constitutes a "method" or an undocumented influence on the researcher |
| Evidence Synthesis | Would require specification of which coding decisions were AI-assisted vs. human-only |

**The publication-safe framing:**
The study should be described as employing **AI-assisted scheme development and coder calibration**, with explicit documentation of the AI's role at each stage. This is currently a methodologically novel contribution, not a flaw — but only if disclosed. Undisclosed, it is a methodological misrepresentation.

**Minimum disclosure required:**
> "The coding scheme was developed through structured human–AI dialogue using [Claude Sonnet 4.6]. Decision tree rules and handbook amendments were generated iteratively across a 10-paper calibration sequence. The AI acted as a methodological interlocutor rather than an independent coder; all final coding decisions were made by [Coder 1]. The AI's constitutive role in scheme development is documented in the study's open supplementary materials [OSF link]."

---

### A.10 Inter-Rater Reliability Robustness

**Definition:** The IRR design produces statistics that are defensible against reviewer scrutiny and appropriately report both agreement and disagreement.

**Weaknesses:**

**A.10.1 — ER-4 base-rate instability.**
If ER-4 applies to ~5% of the corpus (~19 papers), and 5 of these appear in the 76-paper IRR subsample, Kappa will be highly unstable for ER-4 alone. The current protocol notes this but defers to percent agreement as a secondary statistic. Reviewers in conservation journals will note that Kappa's known paradoxes (Feinstein & Cicchetti 1990; Cicchetti & Feinstein 1990) are not resolved by reporting percent agreement alongside Kappa — they require a prevalence-corrected statistic (Byrt, Bishop & Carlin 1993) or reporting per-class agreement with confidence intervals.

**A.10.2 — Weighted Kappa weight scheme is not specified.**
The IRR package specifies "weighted Cohen's Kappa for ER (ordinal, 5-level)" but does not specify the weight matrix. Linear weights assume equal conceptual distance between consecutive ER levels (ER-0→ER-1 = same distance as ER-3→ER-4). This is implausible: the conceptual gap between ER-0 and ER-1 (fictional vs. fictional with real echoes) is arguably smaller than the gap between ER-2 and ER-3 (real species without place vs. real species in a named biome) because the latter involves a qualitative shift in geographic anchoring. Quadratic weights may be more defensible. This needs to be pre-specified and justified.

**A.10.3 — The 2001–2015 IRR stratum draws from a pool of only 35 papers.**
With 19 papers sampled from 35, the 2001–2015 stratum is 54.3% exhausted. This is not a random sample in any conventional sense — it is closer to a census. The methods section cannot describe this as "stratified random sampling with equal allocation" without acknowledging that the earliest period is near-exhaustive. This affects the variance estimate for the period-level agreement statistics.

**A.10.4 — No plan for partial submission (second coder drops below 76 papers).**
The IRR package specifies a return deadline of July 19 but has no contingency if the second coder returns 60 of 76 papers, or returns them after the deadline. Missing papers in stratified IRR create unbalanced cells; there is no pre-specified plan for how to handle this.

**A.10.5 — No plan for below-threshold statistics.**
If ER Kappa returns 0.72 (below the 0.75 threshold), the protocol says "identify failing boundary; revise that decision-tree node; recode." This is a reasonable recovery procedure but it is not specified: How many papers are re-coded? Does the revised tree require a new IRR assessment? Does the methods section report the initial Kappa or only the post-revision Kappa? Without pre-specification, reviewers may question whether the reported statistics reflect a post-hoc optimized scheme.

---

## Part B: Disagreement Prediction by Variable

### B.1 Coding-Unit Identification — **Highest risk zone**

Estimated rate of ambiguous coding units: **~30% of corpus** (title alone insufficient).

Specific patterns:
- Category titles (any title with "video games," "digital games," "online games," "computer games," "ecological games" without a specific title) — estimated 25%
- Multi-game survey papers that name many games but have no single "primary" game
- Papers analyzing game franchises where the specific installment matters for ER (Pokémon Silver vs. Pokémon Scarlet have different species pools)
- Papers analyzing game mechanics abstractly, where the game is named only in examples
- Papers about gamification of conservation (Foldit, eBird as gamified) — is this in scope?

The handbook's Step 0 and HB-2 address this, but the `game_primary` field has no rule for franchise-vs-installment specificity.

### B.2 ER Classification — **High risk at two specific boundaries**

**ER-0/ER-1 boundary (predicted disagreement rate: ~8%):**
Games where "biological ecosystem" is ambiguous (Q0b). Stardew Valley is the most likely contested case: it has real crop species, real animals, seasons, but the farming mechanics are not ecological modeling. Is there a "biological ecosystem"? Two coders will disagree.

**ER-1/ER-2 boundary (predicted disagreement rate: ~5%):**
The question "does the paper name at least one real species as an actual organism in the game?" is ambiguous for games where species are real but renamed/redesigned. In games like Beyond Blue, real species (sperm whales, giant squid) appear under real names. In Abzû, stylized fish that resemble real species appear without names. The "common or scientific name" criterion in Q3 is clear, but papers may mention real animals without explicitly confirming they appear "in the game's represented world" as opposed to in the paper's discussion.

**ER-3/ER-4 boundary (predicted disagreement rate: ~12% of papers reaching Q5):**
The Q5 decision requires distinguishing biome class from named specific place. "The Amazon" is simultaneously a named place (the Amazon River basin) and a biome shorthand (Amazonian tropical rainforest). "Coral reef" is a biome class. "The Great Barrier Reef" is a named place. But what about: "the Everglades"? "The taiga"? "Boreal forest in Canada"? The handbook provides no geographic lookup procedure and no worked examples for ER-3 or ER-4.

### B.3 KF Classification — **High risk at two specific boundaries**

**KF-A/KF-B boundary (predicted disagreement rate: ~10%):**
Papers that perform both cultural analysis AND taxonomic comparison. The Pokémon taxonomy cluster is almost entirely KF-B, but papers in the cluster sometimes frame their taxonomic analysis within a cultural studies lens. Tomotani-type papers (real ornithology + game representation) are structurally ambiguous: is the governing question "what does this game say about robins as a cultural text?" (KF-A) or "how accurate is this game's robin representation?" (KF-B)?

**KF-A/KF-E boundary (predicted disagreement rate: ~8%):**
Papers in the procedural rhetoric tradition (Bogost, Sicart) analyze game mechanics as meaning-producing. The governing question is interpretive (what does the procedural argument mean?) but the evidence is game-systematic (how do the mechanics work?). The handbook currently places interpretive analysis of mechanics under KF-A but a case can be made for KF-E. The Bianchi2014 paper (ER-0, KF-A) is the only Training Set A example that touches this boundary, and it was classified KF-A. A more mechanistic paper would be harder to place.

**KF-D1/KF-D2 boundary (predicted disagreement rate: ~15%):**
Already identified as a training failure mode. The HB-R4 trigger-word check reduces this, but the abstract is required for reliable D1/D2 classification. Papers from conservation and environmental education journals (Conservation Letters, Ambio, Environmental Education Research, Journal of Environmental Psychology) systematically produce D2 papers. Coders unfamiliar with these venues will code them D1 by default.

### B.4 NC Classification — **Moderate risk concentrated at one boundary**

**NC-1/NC-2 boundary (predicted disagreement rate: ~12%):**
This is the primary NC failure mode. Papers that make phenomenological claims about inhabitation, embodied cognition, or player-environment relationships sit near this boundary. The handbook's NC floor rule and the opening-framing trap are well-specified, but the criterion "explicitly states that games can, do, or should produce any real-world effect on players" requires judgment about what counts as "explicit." Parham2015 was coded NC-1 ("to play is to inhabit" = phenomenological, not audience-effect) — a slightly stronger version of the same paper would require NC-2.

**NC-2/NC-3 boundary (predicted disagreement rate: ~7% of papers reaching NC-2):**
The handbook defines NC-3 as claims operating at "population / conservation-practice / policy level." Papers that argue games "contribute to conservation literacy" or "serve as gateway experiences for conservation" are genuinely ambiguous: these are population-level claims but they don't name specific conservation outcomes. The Balmford2002 paper ("conservationists should heed Pokémon") was correctly coded NC-3 because it was explicitly addressed to the conservation sector. Papers that mix individual (NC-2) and sectoral (NC-3) claims in the same abstract are under-specified in the handbook.

### B.5 Confidence Assignment — **Highest systematic risk**

The confidence fields are the most likely source of systematic disagreement because:
1. KF confidence rules are entirely absent from the handbook
2. ER confidence rules only cover ER-0/1/2 cases
3. NC confidence rules (HB-R3) are adequate but have not been tested on NC-2/NC-3 papers
4. No procedure exists for confidence disagreement in the IRR resolution session (the disagreement protocol focuses on code disagreement, not confidence disagreement)

Predicted confidence disagreement rate: **~25% of papers** (coders using implicit confidence standards rather than explicit rules).

---

## Part C: Handbook Rules Most Vulnerable to Inconsistent Interpretation

**Ranked by estimated inconsistency rate across coders:**

### C.1 — Q0b ("biological ecosystem") — **Critical**
No decision tree. No worked examples beyond the ER-0 set. Judgment required. Stardew Valley, Farm Together, Harvest Moon, games with animals but no ecology = borderline. Two coders with different ecological training will systematically diverge here.

**Fix required:** Explicit Q0b decision criteria with positive and negative examples from across the ER range.

### C.2 — Q1 ("intended biological analog") — **Critical**
"Intended" is unverifiable from paper text. The Q1 criterion should be revised to: "Does the game's represented world consist entirely of organisms with no commonly recognized real-world taxonomic referent?" This tests textual evidence rather than designer intent.

### C.3 — KF-A/KF-E boundary — **High**
The handbook distinguishes "interpretive question about the game as a cultural text" (KF-A) from "primary analysis of game design, procedural mechanics, or systems as meaning-production" (KF-E). But these descriptions are not mutually exclusive — all KF-E papers interpret mechanics as meaning-production, which is an interpretive cultural question. The distinguishing criterion should be: does the paper's evidence consist primarily of (a) textual/narrative/aesthetic elements (KF-A) or (b) rule systems and procedural logic (KF-E)?

### C.4 — NC "explicitly states" qualifier — **High**
The NC-1 floor rule requires that the paper "explicitly states" an audience-effect claim for NC ≥ 2. But "explicit" is a spectrum. Papers sometimes frame audience effects as obvious implications without stating them outright ("these games clearly have the potential to..."). The handbook needs to specify: implied effects = NC-1; stated effects = NC-2/3.

### C.5 — Multi-game "primary game" identification — **Moderate**
HB-9 assigns highest ER but does not specify what to put in `game_primary` when the highest-ER game is not the paper's primary focus. This creates a documented field inconsistency.

### C.6 — ER-3/ER-4 at "the Amazon" / "the Arctic" — **Moderate**
These major named ecosystems are both biome classes and named specific places in common scientific usage. The handbook needs explicit rulings for the 6–8 major ecosystems most likely to appear in the corpus (Amazon, Arctic, Great Barrier Reef, Sundarbans, Yellowstone, Boreal Forest, Coral Triangle).

---

## Part D & E: Training Set B — Construction and Stress-Test Analysis

### Design rationale

Training Set A tested: ER-0, ER-1, ER-2; KF-A (8 papers), KF-B (1), KF-D2 (1); NC-1 (9 papers), NC-3 (1); Medium/High/Low confidence.

**Training Set B must test: ER-3/4; KF-C, KF-E; NC-2, NC-3; Q0b ambiguity; KF-A/KF-B boundary; KF-A/KF-E boundary; coding-unit category problems; multi-game highest-ER rule.**

### Assessment of existing Training Set B papers

| Paper | Stress-test value | Specific rule tested | Predicted disagreement |
|---|---|---|---|
| Tomotani 2014 | Medium | KF-A/B boundary | KF-B vs. KF-A (ornithological vs. cultural analysis of robin game representations) |
| Backe 2014 | HIGH | Coding unit; KF meta-theory | What is the primary game? May be KF-F (no specific game analyzed); ER uncodeable without game |
| Sandbrook 2015 | HIGH | KF-D1/D2; NC-3 | Abstract required; D1 vs. D2; whether conservation advocacy = NC-3 |
| Lemonnier 2015 | Medium | Non-English abstract; KF-A | French abstract access; "écofiction" as KF-A concept |
| Brown 2014 | HIGH | Coding unit; KF-A title ambiguity | "The Garden in the Machine" — what game? Likely abstract required |
| Acorn 2009 | Medium | KF-A/B boundary | Pokémon cluster; "paradox" framing = argument (KF-A or KF-B?) |
| Woolbright 2015 | Medium | Category coding unit | "Wild games" = category; ER confidence = Low by HB-8 |
| Clary 2004 | Low | Standard KF-A; ER-1 | Similar to Training Set A; limited new stress |
| Jepson 2015 | CRITICAL — scope threat | In-scope/out-of-scope | "Nature apps" — are apps games? Handbook does not answer. If in scope, KF unclear |
| Hobbs 2019 | HIGH | KF-B/D2; NC-2 | Science education; participant data likely; NC-2 (learning outcomes) |

### Gap analysis and recommended substitutions or supplements

**Gap 1 — KF-C (Indigenous/TEK) — not tested**
Recommended addition: **LaPensée (any year), "Thunderbird Strike" paper** or any paper analyzing Never Alone / Kisima Ingitchuna from an Indigenous knowledge framework. These test: Q0b (real Alaskan ecosystem = Yes), ER-4 (Iñupiaq territory, named place), KF-C vs. KF-A (is the framework Indigenous knowledge or ecocritical?), NC-1 or NC-2.

**Gap 2 — KF-E (design/systems) — not tested**
Recommended addition: any paper applying procedural rhetoric (Bogost) or game design analysis to an ecological game. The Eco game (if in corpus) or a paper analyzing ecological game mechanics. These test: KF-A/KF-E boundary; ER-2/3 depending on game.

**Gap 3 — ER-3 or ER-4 — not tested**
Recommended addition: Beyond Blue paper (if in corpus) — real species in the Great Barrier Reef (ER-4). Or any paper explicitly naming a geolocatable ecosystem. Tests Q4=Yes → Q5 branch, which has never been traversed in training.

**Gap 4 — NC-2 — only 0/10 Training Set A papers**
Hobbs 2019 is likely NC-2. This is the only Training Set B paper likely to produce this code. Consider adding a second NC-2 candidate.

**Gap 5 — Jepson 2015 scope ambiguity**
"Nature apps: Waiting for the revolution" in Ambio. If this paper is in the corpus, it represents a critical edge case: the corpus was designed for games, but "nature apps" (eBird, iNaturalist, Seek) may or may not qualify. The handbook provides no guidance. Before Training Set B, this scope question must be resolved:
- **Option A:** Apps that gamify nature observation (citizen science apps with game mechanics) are in scope. Jepson stays.
- **Option B:** Apps are out of scope. Jepson = exclude from corpus, note in methods.
- **Option C:** Jepson is in scope as a paper about gamification that references both apps and games.

**This scope decision must be made before Training Set B begins, not during it.**

### Recommended Training Set B (revised with supplements)

| # | Paper | Primary stress test | Secondary test |
|---|---|---|---|
| 1 | Tomotani 2014 | KF-A/B boundary | ER-1; pokemon_cluster |
| 2 | Backe 2014 | Coding-unit absent; KF-F candidate | ER uncodeable without game |
| 3 | Sandbrook 2015 | KF-D1/D2 with abstract | NC-3; Conservation Letters venue |
| 4 | Acorn 2009 | KF-A/B boundary (scientific argument) | pokemon_cluster; ER-1 |
| 5 | Woolbright 2015 | Category coding unit → Low ER conf | HB-8; KF-A |
| 6 | Hobbs 2019 | KF-B/D2; NC-2 | Learning outcomes framing |
| 7 | Jepson 2015 | SCOPE GATE — resolve before coding | Apps vs. games |
| 8 | Brown 2014 | Coding-unit absent; KF-A title only | Abstract required |
| 9 | **[KF-C paper — identify from corpus]** | KF-C; ER-4 (if Never Alone) | HB-9 if multi-game |
| 10 | **[NC-2/NC-3 boundary paper — identify from corpus]** | NC-2/NC-3 boundary | KF-D1/D2 |

**Action required before Training Set B begins:** Search corpus for: (a) a paper primarily analyzing Never Alone or Thunderbird Strike; (b) a paper in Environmental Education Research or Journal of Environmental Psychology that makes an individual attitude-change claim (NC-2); (c) resolve the Jepson scope question.

---

## Part F: Publication Venue Assessment

### F.1 Environmental Humanities (Duke UP / MIT Press)

**Strengths:** Humanities epistemology; researcher-as-coder is standard; ecocritical framing is central; qualitative trustworthiness framework accepted.

**Gaps:**
- Reflexivity section required (none exists in current documents)
- AI role disclosure expected; emerging norm since 2024
- IRR statistics less central; dependability argument (audit trail, peer consultation) more important

**Verdict: Publishable with targeted revisions.** Key action: add reflexivity section; add AI disclosure statement; frame IRR as triangulation rather than reliability.

---

### F.2 Human Dimensions of Wildlife (Taylor & Francis)

**Strengths:** Accepts content analysis; mixed methods; values operationalized coding with IRR statistics.

**Gaps:**
- Kappa threshold expectation is typically ≥ 0.80 (not the current 0.75 target); check journal-specific standard
- Author-as-coder with partial IRR design will receive scrutiny; blinding protocol should be documented
- Corpus sampling (purposive, 54% book chapters) requires explicit justification against probability sampling norms

**Verdict: Publishable with moderate revisions.** Key action: document blinding of second coder; consider increasing IRR threshold to 0.80; justify purposive sampling against Arksey & O'Malley's rationale.

---

### F.3 Conservation Biology (Society for Conservation Biology)

**Strengths:** High-impact venue; the franchise selection effect finding has conservation relevance.

**Gaps — MAJOR:**
- PRISMA 2020 compliance required for systematic or scoping reviews; current corpus design (purposive, book chapters included, no database search string documented) may not meet PRISMA criteria
- A purposive corpus assembled by one researcher from "known literature" does not constitute a systematic search strategy; CB reviewers will scrutinize the search documentation
- Quantitative journals are skeptical of AI-assisted scheme development without independent ground truth
- Author-as-coder is a significant concern; will likely require a third coder for a subset

**Verdict: High-risk. Requires major additional work.** If submitting here: document a full systematic search string; audit whether the 380-paper corpus can be reconstructed from a documented database search; consider commissioning an independent methodologist to audit the coding scheme.

---

### F.4 Digital Humanities (various venues)

**Strengths:** DH accepts computational and mixed-method approaches; human-AI collaboration is a live methodological conversation; the study's open materials (scripts, handbook, versioned rules) align with DH data transparency norms.

**Gaps:**
- DH venues expect open data and replicable workflows (GitHub repo, versioned datasets)
- AI role should be framed as a methodological contribution, not just disclosed
- The `paper1-coding-starter.csv` and `paper1-setup.py` should be published as supplementary data

**Verdict: Strong fit with targeted revisions.** Key action: publish all materials on GitHub/OSF before submission; write a DH-specific methods section that positions the AI-assisted scheme development as a novel contribution.

---

### F.5 Qualitative Research (SAGE)

**Strengths:** Accepts diverse epistemological frameworks; trustworthiness approach is native.

**Gaps:**
- Reflexivity section is not optional; it is a structural requirement
- Negative case analysis required: which papers in the corpus most challenge the ecological grounding construct? These must be discussed, not just coded
- Member checking is not applicable here (papers don't have "members"), but the equivalent — expert consultation on the coding scheme — is expected
- Credibility (Lincoln & Guba's equivalent of internal validity) requires prolonged engagement; a 380-paper corpus coded in 14 days may not satisfy this for QR

**Verdict: Requires substantial additions.** This venue is higher effort than the research design was built for; not recommended unless the methodological contribution (AI-assisted qualitative coding) is the primary contribution.

---

### F.6 Evidence Synthesis journals (Campbell Systematic Reviews, Evidence & Policy, Research Synthesis Methods)

**Strengths:** Scoping review framing (Arksey & O'Malley 2005) is explicitly accepted at these venues; the 5-stage protocol is established.

**Gaps:**
- PRISMA-ScR (PRISMA Extension for Scoping Reviews, Tricco et al. 2018) required; this is a specific checklist that must be completed before submission
- Stage 2 (identifying relevant studies) requires a documented search strategy with search strings across multiple databases; the current corpus has no documented search string
- Stage 4 (charting the data) is the current coding scheme — acceptable if clearly framed as data extraction
- Stage 5 (collating, summarizing, reporting) should include a consultation exercise with stakeholders if the study claims policy relevance

**Verdict: Requires significant additional documentation.** Key action: complete PRISMA-ScR checklist now (before full coding begins); document the corpus assembly strategy as a retrospective scoping search.

---

## Part G: Protocol v1.1 — Revised for Reproducibility, Transferability, and Human–AI Transparency

The revisions below are additions to and amendments of the v1.0 handbook and protocols. They do not replace v1.0 — they update it.

---

### G.1 New: AI Role Declaration (mandatory for all publications)

**Add as Section 1.0 of the Master Coding Handbook:**

> **Human–AI Collaboration Statement**
>
> The coding scheme documented in this handbook was developed through structured human–AI dialogue. Specifically: the three-variable ER/KF/NC framework, all decision tree structures, scale definitions, and handbook rules (HB-1 through HB-9, HB-R1 through HB-R5) were developed through iterative dialogue between the lead researcher and an AI language model (Claude Sonnet 4.6, Anthropic, 2025). The AI acted as a methodological interlocutor during coder calibration (Training Set A): it challenged codes, identified rule failures, proposed handbook amendments, and confirmed revised codes. The AI's role is best described as **co-methodologist** at the scheme development stage and **calibration supervisor** at the training stage.
>
> All final coding decisions in the 380-paper corpus are made by human coders. The AI did not code any corpus paper and does not participate in the formal inter-rater reliability assessment.
>
> The full dialogue log documenting scheme development is archived at [OSF link] as supplementary material. Researchers wishing to replicate or adapt this scheme should consult that log alongside this handbook.

---

### G.2 New: Reflexivity Statement (mandatory for humanities venues)

**Add as Section 1.1:**

> **Coder Positionality**
>
> The lead researcher is both the coding scheme designer and Coder 1. This structural overlap — standard in researcher-designed qualitative content analysis — requires explicit acknowledgment. The lead researcher approaches this corpus with background in [field] and has prior familiarity with many of the franchises and scholars represented. This familiarity is both an asset (enabling more accurate coding-unit identification) and a risk (potential for expectation-confirmation bias in ER level assignment, particularly for well-known games). The IRR design addresses this risk by requiring blind double-coding on 20% of the corpus by an independent second coder who is not involved in the study's theoretical development.
>
> The lead researcher's theoretical investment in the "ecological grounding" construct (the primary analytical contribution of Paper 1) creates a structural interest in demonstrating that the corpus is poorly ecologically grounded. This is acknowledged and cannot be fully resolved by design — it is mitigated by the mechanical decision tree structure, which constrains code assignment to binary and triadic decisions rather than holistic judgment.

---

### G.3 Revised: Q1 criterion — Remove "intended"

**Current Q1:** "Does the game's ecosystem consist ENTIRELY of invented species in invented worlds, with no intended biological analog?"

**Revised Q1:** "Does the game's represented world consist entirely of organisms and environments with no commonly recognized real-world taxonomic or geographic referent in the scientific literature?"

**Rationale:** "Intended" is unverifiable from paper text. "Commonly recognized referent" tests textual evidence rather than designer intent, and the phrase "in the scientific literature" grounds the criterion in verifiable knowledge systems rather than cultural recognition (which is more variable between coders).

---

### G.4 New: Q0b Decision Criteria

**Add to Step 0 between Q0a and Q1:**

> **Q0b decision criteria (biological ecosystem defined):**
>
> A game has a **biological ecosystem** (Q0b = YES) if the game world contains at least one of:
> - Species-level organisms (real or fictional) that eat, are eaten, reproduce, or die in response to ecological conditions
> - Explicitly modeled ecological processes (population dynamics, nutrient cycles, predation, habitat dependency)
> - A food web with more than one trophic level in the game's represented world
>
> A game does NOT have a biological ecosystem (Q0b = NO) if the game world contains:
> - Only humans, human-equivalent NPCs, and inorganic objects (The Sims, most RPGs)
> - Animals/plants present as decorative, non-ecological elements (animals as mounts, crops as resources without ecological modeling)
> - "Ecology" appears in the paper as a theoretical metaphor (media ecology, cultural ecology, organizational ecology) with no reference to biological organisms in the game
>
> **Borderline cases requiring abstract review:** Games with farming mechanics (Stardew Valley, Harvest Moon); games with wildlife but no ecological modeling (most open-world games); games with environmental collapse as a backdrop but no represented ecosystem.

---

### G.5 New: KF Confidence Rules

**Add to §1.4:**

| Level | Condition |
|---|---|
| High | Research question clearly assignable from abstract; no competing KF framework visible; D1/D2 confirmed by trigger-word check |
| Medium | Abstract accessed; research question assignable but a competing framework is plausible (e.g., KF-A/KF-E ambiguity, KF-A/KF-B ambiguity) |
| Low | Abstract accessed but research question remains unclear; or kf_primary is KF-F (unclassifiable) |

**KF title-only maximum: Medium.** Do not assign KF High from title alone; the research question requires the abstract.

---

### G.6 New: ER confidence rules for ER-3 and ER-4

**Add to §1.3:**

| Code | Confidence High condition | Confidence Medium condition |
|---|---|---|
| ER-3 | Abstract confirms both: real named species AND a specific biome class named in the game | Title names the game and implies biome setting; abstract not yet accessed |
| ER-4 | Abstract confirms both: real named species AND a geolocatable named place in the game | Abstract mentions real place name but species identification requires further review |

**ER-4 note:** For ER-4 papers, record in coder_notes: (a) the specific place name from the paper; (b) at least one real species name cited in the paper as occurring in that place. If both cannot be recorded, reconsider whether ER-3 is more appropriate.

---

### G.7 New: Geographic anchor glossary for Q5

**Add to §1.3 as Q5 worked examples:**

| Reference | Q5 ruling | Rationale |
|---|---|---|
| "coral reef" | Biome class → ER-3 | Generic biome descriptor |
| "tropical rainforest" | Biome class → ER-3 | Generic biome descriptor |
| "the Amazon" / "Amazonia" | Named place → ER-4 | Named river basin with specific documented biodiversity |
| "the Amazon rainforest" | Named place → ER-4 | Specific geographic qualifier overrides biome type |
| "the Great Barrier Reef" | Named place → ER-4 | Named UNESCO site with documented species registry |
| "Alaska" / "Alaskan tundra" | Named place → ER-4 | Named state with specific species assemblage |
| "the Sundarbans" | Named place → ER-4 | Named UNESCO biosphere reserve |
| "boreal forest" | Biome class → ER-3 | Biome descriptor without geographic specificity |
| "northern Canada" | Biome class → ER-3 | Insufficiently specific; document in coder_notes |
| "Yellowstone" | Named place → ER-4 | Named national park with documented species |

---

### G.8 New: Anchor-coding protocol

**Add to §4.4 (Quality Control Checkpoints):**

**Anchor-coding schedule (mandatory):**

After every 75 papers coded, stop and re-code 5 papers from Training Set A and 5 papers from the already-coded corpus (selected randomly) without looking at original codes.

- If all 5 Training Set A re-codes match the answer key: proceed.
- If 1–2 Training Set A re-codes diverge: review the relevant handbook section and note the divergence in a **Drift Log** (see below).
- If 3+ Training Set A re-codes diverge: **STOP.** Do not proceed until the divergence is diagnosed. Contact second coder to discuss whether a handbook amendment is needed.

**Drift Log format (new required document):**
`paper1-drift-log.csv` — columns: `date`, `anchor_paper_id`, `original_code`, `re_code`, `variable`, `drift_type` (expansion/contraction/shift), `rule_reviewed`.

---

### G.9 New: Scope gate — apps and gamification

**Add to §1.2 (Coding Unit):**

> **Scope: games only**
>
> This study codes papers that primarily analyze digital games. "Digital games" includes: video games, computer games, mobile games, serious games, game-like interactive narratives, and educational game software.
>
> **Out of scope:** Papers primarily analyzing gamification of non-game platforms (e.g., eBird as a gamified citizen science tool where the primary contribution is the observation platform, not the game mechanics); nature apps without game mechanics; interactive simulations without goal structures or player agency.
>
> **Borderline:** Papers that analyze both a game and a non-game platform should be coded for the game component; note in coder_notes.

---

### G.10 New: Considered-and-rejected record for audit trail

**Add to §2.4 (coder_notes structure):**

> **Near-miss codes:** For any paper where you seriously considered a different code before reaching your final code, add: "Near miss: [considered code] at [Q-step]; ruled out because [rule applied]."
>
> This is required for: (a) any paper where the coding path reached Q3 or deeper in the ER tree; (b) any paper with co-primary KF; (c) any paper where NC confidence is Low.

---

### G.11 New: Pre-registration action

**Add to §4.1 (Daily Workflow) as Step 0:**

Before beginning full corpus coding:
1. Register the v1.0 handbook on OSF with a timestamped preregistration.
2. Record the date of pre-registration in the published methods section.
3. Any handbook amendments made after the pre-registration date must be logged as "post-registration amendments" and reported in the limitations section.

This converts the iterative handbook development from a potential weakness into a documented, disclosed protocol evolution.

---

### G.12 New: IRR robustness additions

**Add to §3.4:**

**Pre-specified weight matrix for Kappa:**
Use quadratic weights for ER Kappa. Quadratic weights penalize larger disagreements more heavily than linear weights and are more defensible when scale intervals are non-equal. Specify the weight matrix in the methods section before analysis.

**Minimum per-class reporting for ER:**
Report Kappa both overall AND separately for each ER level that appears in ≥ 5 IRR papers. If ER-4 appears in fewer than 5 IRR papers, report percent agreement with a note about base-rate instability rather than class-specific Kappa.

**Second-coder contingency:**
If the second coder returns fewer than 70 of 76 papers by July 19, proceed with available papers; report actual subsample size in the methods section with a note that stratification was compromised for the affected period.

---

### G.13 Revised: NC scale clarification — "explicitly"

**Add to §1.5 NC Decision Tree as a note after Q1:**

> **Explicit vs. implied effects:**
>
> **Explicit (upgrades from NC-1):** The paper directly states that games produce, can produce, should produce, or have been measured to produce an effect on player behavior, attitudes, knowledge, or conservation outcomes. The claim uses active language directed at audiences, players, or conservation sectors.
>
> **Implied (stays at NC-1):** The paper's argument implies that games matter, or opens with ecological crisis framing to motivate the analysis, or suggests in passing that better game design would have positive effects. If the implication is never stated directly as a claim about games affecting people, NC-1 applies.
>
> **Test:** Would a reviewer reasonably say "this paper claims games change behavior / attitudes / outcomes"? If yes, consider NC ≥ 2. If the reviewer would say "this paper argues games represent nature in X way," NC-1.

---

*Paper 1 — Methodology Audit v1.0*
*Completed: June 2026 | Before Training Set B | Before full corpus coding*
*Basis: Training Set A calibration record (10 papers, 30 decisions, 14 handbook amendments)*
