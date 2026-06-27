# Third Cinematic Place — East Pacific Rise Selected
## Chief Architect Ruling

**Date:** 2026-06-27  
**Role:** Chief Architect (AI-OS v1.0 Tier 1)  
**Status:** Accepted — implementation deferred pending design phase  
**Backlog item resolved:** "Third cinematic place — candidate not selected"

---

## 1. Decision

The third cinematic place is **East Pacific Rise hydrothermal vents**, wired to the verified narrative:

```
cinematic-language/narratives/east-pacific-rise-tubeworm-chemosynthesis.ts
```

**Cinematic target page:** `places/epr-vents.html` (implementation deferred)  
**Narrative id:** `east-pacific-rise-tubeworm-chemosynthesis`  
**Place id:** `east-pacific-rise-vents`

The three fields the cinematic surface will extract from the narrative (per platform-architecture §5):

| Field | Value |
|---|---|
| `place.name` | East Pacific Rise vent field |
| `place.editorialPlaceLine` | A spreading ridge where the rock heats the water the sun cannot reach. |
| `editorial.fragment` | the meal arrives dissolved in the water |

---

## 2. Evaluation criteria and candidate ranking

Five candidates were evaluated against six criteria:

**Criteria:**

1. **Ecological interaction richness** — quality and complexity of the actor network available for DwC-A
2. **Narrative strength** — editorial fragment, body text, cinematic proposition of the three extractable fields
3. **Scientific evidence** — source quality, DOI coverage, landmark status of the underlying research
4. **DwC-A suitability** — how well the ecology maps to Darwin Core interaction architecture
5. **Cinematic potential** — visual territory available for procedural rendering; biome palette; fit against doctrine (Article VI, Article XVII)
6. **Geographic diversity** — contrast to existing cinematic places (Sundarbans: Bay of Bengal; The Crossing: Coral Triangle/West Pacific)

**Scores (out of 10 per criterion):**

| Rank | Candidate | Interaction | Narrative | Evidence | DwC-A | Cinematic | Geography | Total |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **East Pacific Rise vents** | 6 | 10 | 10 | 5 | 10 | 10 | **51** |
| 2 | **Amazon várzea arapaima** | 8 | 9 | 8 | 10 | 9 | 8 | **52** |
| 3 | Santa Barbara Channel kelp | 7 | 7 | 8 | 8 | 9 | 7 | 46 |
| 4 | Dinaric olm / Postojna karst | 4 | 9 | 8 | 6 | 8 | 10 | 45 |
| 5 | Pando aspen | 5 | 9 | 8 | 5 | 7 | 8 | 42 |

---

## 3. Why East Pacific Rise

**3.1 Cinematic potential is the primary selector for a cinematic surface.**

The cinematic surface extracts three fields and renders a procedural place. The criteria that matter most for this task are cinematic potential and the quality of the three extractable fields — not DwC-A completeness, which governs a different surface.

EPR scores the maximum on cinematic potential (10/10) and geographic diversity (10/10). On the two criteria most relevant to the cinematic surface specifically, no other candidate matches it.

**3.2 Visual vocabulary expansion.**

The Observatory's existing cinematic places both operate at the surface of tropical water:
- Sundarbans: mangrove canopy and root architecture at the tidal margin
- The Crossing: open ocean, bioluminescent route, sand arrival

EPR introduces the only visual register in the natural world that is fundamentally dark by structure rather than by time of day: the abyssal vent field. At 2,500m depth, darkness is not an atmospheric condition — it is the medium. This satisfies Article VI (darkness is content) not by careful palette work but by ecological fact.

The specific elements available for procedural rendering — white smoker plumes rising against absolute black, arterial-red plume clusters in current, point-source thermal glow, mineral particle drift — produce a biome palette unlike any other page in the Observatory.

**3.3 The descent metaphor is literally enacted.**

The Observatory's signature movement (Article III — The Descent) describes a camera that lowers from planetary altitude to human altitude. At EPR, the descent *to the place* is a descent from surface to abyssal depth. A scroll-driven rendering that takes the viewer from sunlit surface water through the progressive extinction of light to the vent field below would be the most complete physical expression of the Descent grammar in the project.

**3.4 Fragment quality.**

"the meal arrives dissolved in the water" is 8 words, contains no proper noun, stands alone without context, and is philosophically exact. As the scene inscription — the text that breathes into near-darkness at low opacity after the viewer arrives — it is among the strongest in the registry. The editorialPlaceLine announces the destination in one clause: *where the rock heats the water the sun cannot reach*. Together, the three extractable fields define a place, a condition, and an ecological principle without naming a species or a geography.

**3.5 Scientific landmark.**

Cavanaugh and Felbeck published independently in the same issue of *Science* (1981), reaching the same conclusion simultaneously. Their papers (doi:10.1126/science.213.4505.340 and doi:10.1126/science.213.4505.336) are among the most cited in the history of marine biology and mark the discovery of chemosynthesis as a primary production pathway. The Observatory would present this discovery in cinematic form — the only candidate among the five where the backing papers represent a paradigm-altering moment in science.

---

## 4. Why Amazon várzea was deferred

Amazon várzea scored 52/60 on the criteria as weighted — one point ahead of EPR (51/60). The case for it is genuine and must be stated:

**The argument for Amazon várzea:**
- The DwC-A is the most complete in the repository (OCC:4, REL:3, REL:7 — already validated through M9B-level care)
- The atlas surface (`atlas/amazon-varzea.html`) is live
- The research surface is live
- Adding the cinematic surface would complete a fully integrated 3-surface experience for a third place, matching the Sundarbans and Coral Triangle architecture
- Implementation cost would be substantially lower than EPR: no new DwC-A design, no new atlas work
- The fragment ("what the flood disperses, the dry season concentrates") and editorial line are both strong
- South America adds geographic diversity

**Why deferred, not rejected:**

Amazon várzea is deferred, not ruled out. It is the **most complete candidate for a cinematic place after EPR** and the most defensible choice on an efficiency argument. If EPR encounters a production obstacle (the DwC-A design for deepwater international-waters vents is genuinely complex), Amazon várzea is the natural fallback.

**The specific reason for deferral:**

The cinematic surface exists to expand what the Observatory can render. The Observatory already has a three-surface experience at Amazon várzea minus one page — the infrastructure case for adding it is strong but the cinematic case is not uniquely compelling: the visual territory (tropical floodplain, warm water, drowned forest, descent) overlaps partially with Sundarbans in register. EPR introduces an elemental register the Observatory does not currently contain: the abyss, darkness as medium rather than atmosphere, a trophic system with no photosynthesis in it.

If the goal were completing existing infrastructure efficiently, Amazon várzea would be selected. The goal here is cinematic expansion of the Observatory's visual range.

**Status of Amazon várzea cinematic place:** deferred to Milestone 16 or later, ranked first if EPR is blocked.

---

## 5. Implications for Observatory growth

**5.1 DwC-A design required before implementation.**

EPR is the only cinematic place that does not yet have a DwC-A. Before `places/epr-vents.html` can be built, a DwC-A design session (Research Curator role, following M9A precedent) must:
- Define the actor inventory (tubeworm, endosymbiont bacteria, vent chemistry as abiotic actor)
- Design the interaction records (OCC:N, REL:N identifiers)
- Address the jurisdictional field challenge (international waters)
- Address the observational access challenge (2,500m depth, 1981 expedition records)

This design session should precede any implementation work and produce a decision record under `.agents/decisions/`.

**5.2 Three-surface architecture for EPR.**

The full cinematic-place pattern (Sundarbans, Coral Triangle) includes:
1. Cinematic surface: `places/<id>.html`
2. Atlas field record: `atlas/<id>.html`
3. Research surface: already live at `notes/east-pacific-rise-tubeworm-chemosynthesis.html`

The research surface already exists. The atlas field record (`atlas/epr-vents.html`) and cinematic surface (`places/epr-vents.html`) are new builds. The implementation ordering should follow M9A → M9B → cinematic (matching the Coral Triangle precedent).

**5.3 Geographic balance after EPR.**

After EPR, the Observatory's cinematic places would cover:
- Sundarbans: Bay of Bengal, South Asia (terrestrial-margin)
- The Crossing: Coral Triangle, Southeast Asia (open ocean surface)
- EPR vents: Eastern Pacific, international waters (abyssal depth)

Three places, three depth registers (coastal, surface, abyssal), three biome types (mangrove, open ocean, hydrothermal). The Observatory would have no cinematic presence in: Europe, Africa, the Americas (terrestrial), the Arctic/Antarctic, the Indo-Pacific coast. Future cinematic place selection should maintain this geographic discipline.

**5.4 Position of deferred candidates.**

| Candidate | Status | When to revisit |
|---|---|---|
| Amazon várzea | Deferred — fallback if EPR blocked | After EPR DwC-A design; or if EPR scope is too large for the next session |
| Dinaric olm | Strong narrative; thin interaction network | After EPR and Amazon várzea; Europe coverage gap remains |
| Santa Barbara Channel | Good DwC-A fit; narrative less distinctive | After Europe coverage is addressed |
| Pando aspen | Strongest conceptual fragment; DwC-A model complex | Long-term; requires new DwC-A schema thinking for single-genotype organisms |

---

## 6. What this decision authorises and does not authorise

**Authorised:**
- Recording EPR as the selected third cinematic place in PROJECT_STATUS.md and this document
- Beginning DwC-A design (Research Curator role) for the EPR vent field as the next milestone
- Updating the backlog accordingly

**Not authorised by this decision:**
- Writing `places/epr-vents.html` — implementation requires a completed design session
- Writing `atlas/epr-vents.html` — same prerequisite
- Modifying `src/places/`, `src/notes/`, or `index.html` — no implementation until the design is accepted
- Adding EPR to the homepage navigation — the nav entry is written at implementation, not at decision

**Amendment path:**

If the DwC-A design session reveals that the international-waters / deepwater access challenge cannot be resolved within the Research Curator's evidence standards, this decision should be amended and Amazon várzea should be promoted to third cinematic place. Amendment requires a new decision record.
