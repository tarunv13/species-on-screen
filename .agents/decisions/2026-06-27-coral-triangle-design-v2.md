# Coral Triangle Interaction Web — Design Specification v2
## M9A Research Curator Output — Revision 1

**Date:** 2026-06-27
**Revision date:** 2026-06-27
**Curator role:** Research Curator (AI-OS v1.0 Tier 1)
**Status:** Revision 1 — resolves Scientific Review findings C1–C4, M1–M8. Ready for M9B pending acceptance.
**Supersedes:** `2026-06-27-coral-triangle-design.md` (v1)
**Purpose:** Authoritative ecological design for `public/dwca/coral-triangle/` and `atlas/coral-triangle.html`

---

## 1. System Overview

**Place:** Coral Triangle — the maritime zone of maritime Southeast Asia spanning the Philippines, Indonesia, Malaysia, Papua New Guinea, Solomon Islands, and Timor-Leste. Centre approximately 0°N, 130°E.

**Ecological character:** The Coral Triangle contains 76% of the world's coral species (Veron et al. 2009) and 37% of its coral reef fish species (Allen 2008). It is the global centre of marine biodiversity and the focal region for the Observatory's hawksbill natal-homing narrative.

**Focal species:** *Eretmochelys imbricata* (hawksbill sea turtle). Adults are obligate spongivores on coral reefs. The natal-homing behaviour documented in the Observatory's narrative describes adults returning to their natal beaches after foraging in reef habitats across the Coral Triangle. The interaction web must represent the reef-system ecology in which adult hawksbills operate, with the life-history context of juvenile seagrass use included.

**Relationship to existing Observatory pages:**
- Cinematic place: `places/crossing.html` (hawksbill natal-homing journey)
- Research companion: `atlas/crossing.html` (narrative + threat data, existing)
- This DwC-A provides a third, distinct research asset: the ecological interaction network of the reef system itself

---

## 2. Actor Inventory

Actor count is **9**, determined by the following evidence-based inclusion criteria:

> **Inclusion rule:** An actor is included if it (a) has a documented direct ecological interaction with the focal species *Eretmochelys imbricata* OR (b) plays a documented functional role in maintaining or degrading the reef-system habitat on which the focal species depends, AND a peer-reviewed citation exists for that role.

> **Exclusion rule:** Actors with only indirect or circumstantial connections, actors whose interactions are adequately represented by another included taxon, or actors whose identification below genus level is unsupported by gut-content or field observation data are excluded.

---

### Actor 1 — *Eretmochelys imbricata* (Hawksbill sea turtle)

| Field | Value |
|---|---|
| OCC identifier | **OCC:1** |
| Scientific name | *Eretmochelys imbricata* (Linnaeus, 1766) |
| Vernacular name | Hawksbill sea turtle |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Reptilia / Testudines / Cheloniidae |
| IUCN category | CR (Critically Endangered) |
| GBIF taxon key | **5220228** ✓ CONFIRMED |
| Trophic role | `consumer` |
| Cascade fail order | 4 |
| Locality | Coral Triangle reef systems (feeding grounds); Philippines, Indonesia, Solomon Islands (nesting documented) |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** Adult hawksbills are year-round reef foragers across the Coral Triangle (Mortimer & Donnelly 2008). Nesting seasonality (peaks May–October for most Coral Triangle populations) occurs at nesting beaches — a different habitat from the foraging reef grounds represented here. The DwC-A records the foraging-ground interaction network; seasonal presence on foraging reefs is year-round.

**Scene position (provisional, editorial):** sceneX: 0.18, sceneY: 0.30

---

### Actor 2 — Demospongiae (Reef sponges — hawksbill prey guild)

| Field | Value |
|---|---|
| OCC identifier | **OCC:2** |
| Scientific name | Demospongiae |
| Vernacular name | Reef sponges |
| Taxon rank | class |
| Kingdom / Phylum / Class | Animalia / Porifera / Demospongiae |
| IUCN category | NE (not evaluated at class level) |
| GBIF taxon key | ~2481800 — VERIFY before M9B |
| Trophic role | `consumer` (suspension feeder; filter-feeds dissolved organics) |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** Sponges are sessile benthic invertebrates with no seasonal migration or disappearance. Year-round presence is the default for tropical reef sponge communities.

**Inclusion justification:** Meylan (1988) analysed stomach contents of 61 hawksbills from the Caribbean and found sponges comprising approximately 95% of gut content volume (geographic extrapolation caveat: see Section 8, Curation Limitation 2 and INT:1 remarks), across at least 17 families. Indo-Pacific hawksbills show analogous spongivory patterns (Meylan & Meylan 2000; León & Bjorndal 2002 confirm reef sponge dominance across ocean basins). Prey families include Ancorinidae, Geodiidae, Tetillidae, Suberitidae, Spirastrellidae, Agelasidae, and Callyspongiidae. Class-level Demospongiae accurately represents this multi-family prey guild.

**Scene position (provisional):** sceneX: 0.38, sceneY: 0.62

---

### Actor 3 — *Acropora* spp. (Staghorn coral)

| Field | Value |
|---|---|
| OCC identifier | **OCC:3** |
| Scientific name | *Acropora* Oken, 1815 |
| Vernacular name | Staghorn coral |
| Taxon rank | genus |
| Kingdom / Phylum / Class / Order / Family | Animalia / Cnidaria / Anthozoa / Scleractinia / Acroporidae |
| IUCN category | Various by species; collectively Near Threatened to Critically Endangered |
| GBIF taxon key | ~2262047 (genus-level key) — VERIFY before M9B |
| Trophic role | `primary_producer` (photosynthetic via zooxanthellae endosymbionts) |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** *Acropora* colonies are perennial reef structures. Mass spawning occurs in certain months (typically following full moons in April–June for many Coral Triangle populations), but colony presence and the structural habitat function are year-round.

**Inclusion justification:** *Acropora* is the most species-rich coral genus in the Coral Triangle, with more than 150 species documented (Veron et al. 2009). It is the primary structural architect of the shallow-water reef matrix. Hawksbills use the structural complexity of coral reef for shelter, prey-search substrate, and navigation (Mortimer & Donnelly 2008). Crown-of-thorns preferentially prey on *Acropora* (Pratchett 2001; Pratchett et al. 2014). *Acropora* bleaching under thermal stress is the primary driver of reef-wide habitat loss across the Coral Triangle (Hughes et al. 2017). Genus-level is used because no single *Acropora* species is the exclusive structural foundation.

**Scene position (provisional):** sceneX: 0.50, sceneY: 0.52

---

### Actor 4 — *Lobophora variegata* (Reef macroalgae)

> **v2 taxonomic correction:** Kingdom changed from `Plantae` to `Chromista`. See Change Log entry C2.

| Field | Value |
|---|---|
| OCC identifier | **OCC:4** |
| Scientific name | *Lobophora variegata* (J.V. Lamouroux) Womersley ex E.C. Oliveira |
| Vernacular name | Reef brown alga |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | **Chromista** / Ochrophyta / Phaeophyceae / Dictyotales / Dictyotaceae |
| IUCN category | NE |
| GBIF taxon key | ~5420688 — VERIFY before M9B (high risk: active taxonomic revision in Dictyotales; see Section 8) |
| Trophic role | `primary_producer` |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems (particularly in degraded zones) |
| seasonalPresence | `{"wet": 1.0, "dry": 0.75}` |

**seasonalPresence basis:** *Lobophora variegata* is present year-round on coral reefs but proliferates during and following the wet season, when terrestrial nutrient runoff increases dissolved inorganic nitrogen availability (general principle from macroalgae nutrient-response literature; see Fabricius et al. 2005 *Marine Pollution Bulletin* 51:36 for GBR context — Coral Triangle-specific data not confirmed in cited literature; this estimate is a Research Curator approximation from nutrient dynamics analogues). The dry = 0.75 value reflects relative macroalgal coverage, not absence.

**Inclusion justification:** *Lobophora variegata* is the dominant macroalga recorded overgrowing and displacing coral colonies on degraded Indo-Pacific reefs (Barott et al. 2012; Vermeij et al. 2010; Bellwood et al. 2004). Parrotfish and sea urchins control macroalgal expansion; when these grazers are removed, *Lobophora* overgrowing coral and prevents recruitment (Bellwood et al. 2004 *Nature*). Including this actor makes the herbivore-reef dynamic mechanistically explicit.

**Scene position (provisional):** sceneX: 0.64, sceneY: 0.60

---

### Actor 5 — *Thalassia hemprichii* (Tropical seagrass)

| Field | Value |
|---|---|
| OCC identifier | **OCC:5** |
| Scientific name | *Thalassia hemprichii* (Ehrenberg) Ascherson |
| Vernacular name | Tropical seagrass |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Plantae / Tracheophyta / Liliopsida / Alismatales / Hydrocharitaceae |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~2869027 — VERIFY before M9B |
| Trophic role | `primary_producer` |
| Cascade fail order | 1 |
| Locality | Coral Triangle shallow-water seagrass beds, adjacent to reefs |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** Seagrass meadows in the tropical Indo-Pacific are perennial (Waycott et al. 2009). *T. hemprichii* does not show seasonal disappearance in Coral Triangle conditions; its biomass may fluctuate but is treated as year-round present for the purposes of this interaction web.

**Inclusion justification:** Juvenile *E. imbricata* in the Indo-Pacific are omnivorous, with seagrass comprising a significant dietary component before recruitment to reef habitats (Bjorndal 1997; see INT:2 citation notes regarding evidence quality; Limpus 2009 for Pacific hawksbills). *Thalassia hemprichii* is the dominant seagrass species of the tropical Indo-Pacific (Waycott et al. 2009).

**Scene position (provisional):** sceneX: 0.80, sceneY: 0.55

---

### Actor 6 — *Diadema setosum* (Long-spined sea urchin)

| Field | Value |
|---|---|
| OCC identifier | **OCC:6** |
| Scientific name | *Diadema setosum* (Leske, 1778) |
| Vernacular name | Long-spined sea urchin |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Echinodermata / Echinoidea / Diadematoida / Diadematidae |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~7675143 — VERIFY before M9B |
| Trophic role | `herbivore` |
| Cascade fail order | 2 |
| Locality | Coral Triangle reef systems |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** *Diadema setosum* is a permanent reef resident in tropical Indo-Pacific systems. Year-round presence is documented across the Coral Triangle.

**Inclusion justification:** *Diadema setosum* is the dominant long-spined sea urchin of the Indo-Pacific and the functional analogue of *D. antillarum* in the Caribbean system. Bellwood et al. (2004) identify sea urchins alongside parrotfish as the two principal macroalgae-control functional groups on coral reefs. *Diadema* grazing maintains the bare-rock substrate required for coral larval settlement; their removal results in macroalgae proliferation and coral recruitment failure (Hughes 1994 *Science*; Bellwood et al. 2004). McClanahan & Shafir (1990) document *D. setosum* as the dominant urchin herbivore in the Indian Ocean (Kenya); their grazing role in Indo-Pacific systems is the direct Indo-Pacific analogue of the mechanism documented in Hughes (1994).

**Scene position (provisional):** sceneX: 0.54, sceneY: 0.74

---

### Actor 7 — *Chlorurus microrhinos* (Steephead parrotfish)

> **v2 taxonomic correction:** Family changed from `Scaridae` to `Labridae`. See Change Log entry C3.

| Field | Value |
|---|---|
| OCC identifier | **OCC:7** |
| Scientific name | *Chlorurus microrhinos* (Bleeker, 1854) |
| Vernacular name | Steephead parrotfish |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Actinopterygii / Labriformes / **Labridae** |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~2382006 — VERIFY before M9B (verify accepted family in GBIF backbone: if key resolves to Labridae, Family field is confirmed; if Scaridae, document discrepancy) |
| Trophic role | `herbivore` |
| Cascade fail order | 2 |
| Locality | Coral Triangle reef systems |
| seasonalPresence | `{"wet": 1.0, "dry": 1.0}` |

**seasonalPresence basis:** *Chlorurus microrhinos* is a resident reef fish across the Coral Triangle with no seasonal absence documented. Year-round presence applies.

**Inclusion justification:** *Chlorurus microrhinos* is identified in Bellwood et al. (2006) as the critical functional group among parrotfish for reef recovery — specifically as a "scraper" whose bioerosion removes algae and dead coral, creating settlement substrate. Species-level selection: *C. microrhinos* is the dominant large scraper/excavator on Indo-Pacific reefs (Hoey & Bellwood 2008).

**Taxonomic clarification (v2):** Order: Labriformes reflects the current molecular-phylogenetics-based classification (Near et al. 2012 and subsequent GBIF backbone revisions). Under Labriformes, parrotfishes are assigned to Family Labridae (with Scarinae as a subfamily), not Family Scaridae. The v1 spec correctly adopted Order: Labriformes but retained the pre-revision Family: Scaridae; this version corrects the inconsistency. M9B must verify the accepted family for GBIF key ~2382006 at implementation time.

**Scene position (provisional):** sceneX: 0.70, sceneY: 0.40

---

### Actor 8 — *Acanthaster planci* (Crown-of-thorns starfish)

| Field | Value |
|---|---|
| OCC identifier | **OCC:8** |
| Scientific name | *Acanthaster planci* (Linnaeus, 1758) |
| Vernacular name | Crown-of-thorns starfish |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Echinodermata / Asteroidea / Valvatida / Acanthasteridae |
| IUCN category | NE |
| GBIF taxon key | ~2278376 — VERIFY before M9B |
| Trophic role | `consumer` (corallivore) |
| Cascade fail order | 3 |
| Locality | Coral Triangle reef systems |
| seasonalPresence | `{"wet": 0.9, "dry": 1.0}` |

**seasonalPresence basis:** *A. planci* is present year-round on Coral Triangle reefs. Outbreak aggregations show some documented association with the dry season in southern Indo-Pacific populations (GBR spawning studies; Pratchett et al. 2014). For the equatorial Coral Triangle, seasonality is less pronounced; dry: 1.0 and wet: 0.9 reflects a marginal dry-season aggregation signal, not absence.

**Inclusion justification:** *A. planci* sensu lato is the dominant coral predator in the Indo-Pacific, and recurrent outbreaks cause documented mass mortality of *Acropora* and other scleractinian corals across the Coral Triangle (Pratchett et al. 2014; Pratchett 2001). Crown-of-thorns predation on *Acropora* is one of the most extensively documented ecological interactions in coral reef science.

**Taxonomic note:** The Indo-Pacific *Acanthaster* complex was revised by Vogler et al. (2008) and Kamya et al. (2018), distinguishing *A. cf. solaris* (Pacific clade) from *A. planci* sensu stricto (Indian Ocean). M9B must verify GBIF key ~2278376 and use the accepted scientific name the backbone assigns to this key. If the backbone has adopted *A. cf. solaris* for the Coral Triangle region, update the `scientificName` field accordingly and note the revision in `associatedReferences`.

**Scene position (provisional):** sceneX: 0.26, sceneY: 0.70

---

### Actor 9 — *Homo sapiens* (Fishing and coastal communities)

| Field | Value |
|---|---|
| OCC identifier | **OCC:9** |
| Scientific name | *Homo sapiens* Linnaeus, 1758 |
| Vernacular name | Fishing and coastal communities |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Mammalia / Primates / Hominidae |
| IUCN category | LC |
| GBIF taxon key | **2436436** ✓ CONFIRMED |
| Trophic role | `human_community` |
| Cascade fail order | 0 |
| Locality | Coral Triangle coastal communities (Philippines, Indonesia, Solomon Islands, Papua New Guinea) |
| seasonalPresence | `{"wet": 0.7, "dry": 1.0}` |

**seasonalPresence basis:** Artisanal fishing and egg harvesting activities are documented year-round but peak in the dry season when seas are calmer and hawksbill nesting — and therefore egg-harvesting opportunity — peaks (May–October for most Coral Triangle nesting beaches; Mortimer & Donnelly 2008). The wet: 0.7 value reflects reduced but ongoing human pressure in the wet (monsoon) season, consistent with the analogous assignment in the Amazon várzea DwC-A ({wet: 0.8, dry: 1.0}).

---

### Actors considered and excluded

| Taxon | Reason excluded |
|---|---|
| *Chelonia mydas* (Green sea turtle) | Competes with juvenile hawksbills for seagrass beds; however, this competitive interaction is not direct and occurs at the habitat-use level. The seagrass actor (*T. hemprichii*) already represents the juvenile hawksbill habitat; adding a second turtle species as a competitor would require an actor-to-actor interaction not documented for the Coral Triangle with sufficient specificity. Exclusion is consistent with the inclusion rule requiring documented direct ecological interaction. |
| Zooxanthellae / *Symbiodinium* spp. | Ecologically foundational (coral bleaching) but too small/abstract for the interaction-web model; bleaching effect on *Acropora* is captured implicitly through the *Acropora* actor and its cascade role. |
| *Pterois* spp. (Lionfish) | Native to Coral Triangle; predatory but not primarily relevant to hawksbill ecology or reef structural integrity. |
| Specific sponge species | Hawksbill prey sponge identification below family level is not possible from existing gut-content literature without molecular methods; class-level Demospongiae is more accurate than any single species proxy. |

---

## 3. Interaction Graph

Interaction count is **10**, determined by the following evidence-based inclusion criteria:

> **Inclusion rule:** An interaction is included if it (a) is documented in peer-reviewed literature or an authoritative organisational report, (b) has a `relationshipAccordingTo` citation that identifies the publication or report, and (c) is ecologically significant in the Coral Triangle context.

All interactions use Resource Ontology (RO) identifiers from the OBO Foundry.

---

### Interaction 1 — Hawksbill preysOn reef sponges

> **v2 change:** OCC identifier corrected from OCC:7 to OCC:1. Remarks expanded to flag geographic provenance of 95% figure. See Change Log C1 and M1.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:1 |
| resourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:2 (Demospongiae) |
| relationshipOfResource | `preysOn` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002439 |
| relationshipAccordingTo | Meylan (1988); Meylan & Meylan (2000) |
| remarks | Adult hawksbills: sponge constitutes approximately 95% of gut content volume (figure from Caribbean populations, Meylan 1988; Indo-Pacific corroboration in Meylan & Meylan 2000 and León & Bjorndal 2002 confirms sponge dominance across ocean basins; Coral Triangle prey family proportions not directly measured — see Curation Limitation 2). Prey span at least 17 sponge families. seasonal:all (year-round reef forager). |

**Primary citation:** Meylan, A.B. (1988). Spongivory in hawksbill turtles: a diet of glass. *Science* 239(4838):393–395. doi:10.1126/science.239.4838.393

**Supporting:** Meylan, A.B. & Meylan, P.A. (2000). Introduction to the evolution, life history, and biology of sea turtles. In: Eckert, K.L. et al. (eds), *Research and Management Techniques for the Conservation of Sea Turtles*. IUCN/SSC Marine Turtle Specialist Group.

**Confidence:** Very high for spongivory as the primary adult foraging mode. Moderate for the 95% figure as a Coral Triangle-specific proportion.

---

### Interaction 2 — Hawksbill eats seagrass (juvenile stage)

> **v2 change:** OCC identifier corrected from OCC:7 to OCC:1. Remarks expanded to disclose secondary literature status of primary citation and flag candidate primary source requiring verification. See Change Log C1 and M7.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:2 |
| resourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:5 (*Thalassia hemprichii*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bjorndal (1997); Limpus (2009) |
| remarks | Juvenile hawksbills in Indo-Pacific seagrass beds prior to recruitment to reef habitat. Adult hawksbills may feed on seagrass opportunistically but primarily in reef habitat. seasonal:all. CITATION NOTE: Bjorndal (1997) is a book chapter (secondary literature); Limpus (2009) is grey literature (government report). Both are well-established authorities but neither is a peer-reviewed primary paper specifically documenting juvenile E. imbricata feeding on T. hemprichii in the Coral Triangle. Candidate primary source for verification: Meylan, A.B. (1984) Bulletin of Marine Science 34(3):456–464 — requires confirmation of content before M9B adopts it. The juvenile seagrass-feeding interaction is ecologically established across the Indo-Pacific literature but lacks a strong single primary citation for this specific place and species pair. |

**Primary citation:** Bjorndal, K.A. (1997). Foraging ecology and nutrition of sea turtles. In: Lutz, P.L. & Musick, J.A. (eds), *The Biology of Sea Turtles*. CRC Press. [book chapter — secondary literature; see remarks]

**Supporting:** Limpus, C.J. (2009). A biological review of Australian marine turtle species. 6. Hawksbill turtle, *Eretmochelys imbricata* (Linnaeus). Queensland Environmental Protection Agency. [grey literature — government technical report]

**Candidate primary source (unverified):** Meylan, A.B. (1984). Feeding ecology of the hawksbill turtle (*Eretmochelys imbricata*): prey diversity and abundance. *Bulletin of Marine Science* 34(3):456–464. — Verify content at M9B: if this paper documents juvenile ontogenetic diet including seagrass, promote to primary citation.

**Confidence:** High for juvenile seagrass feeding as an established life-history fact; moderate for the specific Coral Triangle context; weak for the citation-level evidence quality of the primary sources.

---

### Interaction 3 — Hawksbill interactsWith staghorn coral (reef habitat dependency)

> **v2 change:** OCC identifier corrected from OCC:7 to OCC:1. Remarks expanded to declare "inferred habitat dependency" and flag citation quality. See Change Log C1 and M2.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:3 |
| resourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Mortimer & Donnelly (2008); León & Bjorndal (2002) |
| remarks | INFERRED HABITAT DEPENDENCY: hawksbill depends on structurally complex reef for shelter, prey-search substrate, and navigation. Acropora-dominated reefs support highest sponge biomass density. This interaction is inferred from general reef-habitat use patterns documented across hawksbill populations (Mortimer & Donnelly 2008); no direct species-pair field study specifically quantifying hawksbill use of Acropora habitat in the Coral Triangle has been confirmed in the cited literature. León & Bjorndal (2002) document hawksbill as a reef-structure-discriminating predator (sponge prey selection by reef architecture), providing the closest primary-literature basis for a reef-structure dependency. The `interactsWith` RO term is appropriate for an inferred habitat association; no primary RO term for "usesHabitat" is standardly used in GloBI/DwC-A records. seasonal:all. |

**Primary citation:** Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. The IUCN Red List of Threatened Species 2008. doi:10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en [synthesis document, not primary field data; used for reef-habitat dependency as the authoritative conservation assessment]

**Supporting:** León, Y.M. & Bjorndal, K.A. (2002). Selective feeding in the hawksbill turtle, an important predator in coral reef ecosystems. *Marine Ecology Progress Series* 245:249–258. doi:10.3354/meps245249

**Confidence:** Moderate. Reef-structure dependence is ecologically well-founded; the specific hawksbill–*Acropora* pairing as a documented interaction lacks a dedicated field study at this specificity.

---

### Interaction 4 — Crown-of-thorns starfish preysOn staghorn coral

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:4 |
| resourceID | OCC:8 (*Acanthaster planci*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `preysOn` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002439 |
| relationshipAccordingTo | Pratchett (2001); Pratchett et al. (2014) |
| remarks | Outbreak populations of A. planci consume Acropora preferentially; documented to remove 50–90% of live coral cover in outbreak years across Coral Triangle reef systems. seasonal:all. |

**Primary citation:** Pratchett, M.S., Caballes, C.F., Rivera-Posada, J.A. & Sweatman, H.P.A. (2014). Limits to understanding and managing outbreaks of crown-of-thorns starfish (*Acanthaster* spp.). *Oceanography and Marine Biology: An Annual Review* 52:133–200.

**Supporting:** Pratchett, M.S. (2001). Dynamics of outbreak populations of crown-of-thorns starfish (*Acanthaster planci* L.), and their impact on coral reef ecosystems. PhD thesis, James Cook University.

**Confidence:** Very high.

---

### Interaction 5 — Steephead parrotfish eats reef macroalgae

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:5 |
| resourceID | OCC:7 (*Chlorurus microrhinos*) |
| relatedResourceID | OCC:4 (*Lobophora variegata*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bellwood et al. (2006); Hoey & Bellwood (2008) |
| remarks | Scraper/excavator functional role: removes macroalgae and erodes dead coral substrate, creating settlement surface for coral recruits. Critical for reef recovery post-bleaching or post-COTS outbreak. seasonal:all. |

**Primary citation:** Bellwood, D.R., Hughes, T.P. & Hoey, A.S. (2006). Sleeping functional group drives coral-reef recovery. *Current Biology* 16(24):2434–2439. doi:10.1016/j.cub.2006.10.030

**Supporting:** Hoey, A.S. & Bellwood, D.R. (2008). Cross-shelf variation in the role of parrotfishes on the Great Barrier Reef. *Marine Ecology Progress Series* 358:105–117. doi:10.3354/meps07336

**Confidence:** High.

---

### Interaction 6 — Long-spined sea urchin eats reef macroalgae

> **v2 citation correction:** Tano et al. (2017) removed (citation inversion — that paper documents algal chemical defense against grazing, opposite of what INT:6 claims). Bellwood et al. (2004) promoted to primary; Hughes (1994) and McClanahan & Shafir (1990) added as supporting. See Change Log C4.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:6 |
| resourceID | OCC:6 (*Diadema setosum*) |
| relatedResourceID | OCC:4 (*Lobophora variegata*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bellwood et al. (2004); Hughes (1994); McClanahan & Shafir (1990) |
| remarks | Sea urchin grazing complements parrotfish herbivory in controlling macroalgae. On Indo-Pacific reefs, Diadema setosum is the principal urchin herbivore maintaining reef open-substrate patches for coral recruitment (Bellwood et al. 2004). Hughes (1994) documents the catastrophic consequence of urchin loss (D. antillarum die-off, Caribbean 1983): macroalgae proliferated within months, demonstrating the causal grazing mechanism. D. setosum is the direct Indo-Pacific functional analogue. McClanahan & Shafir (1990) document D. setosum as the dominant urchin herbivore in Kenyan Indo-Pacific reef systems. seasonal:all. |

**Primary citation:** Bellwood, D.R., Hughes, T.P., Folke, C. & Nyström, M. (2004). Confronting the coral reef crisis. *Nature* 429:827–833. doi:10.1038/nature02691

**Supporting:** Hughes, T.P. (1994). Catastrophes, phase shifts, and large-scale degradation of a Caribbean coral reef. *Science* 265:1547–1551. doi:10.1126/science.265.5178.1547

**Supporting:** McClanahan, T.R. & Shafir, S.H. (1990). Causes and consequences of sea urchin abundance and diversity in Kenyan coral reef lagoons. *Oecologia* 83(3):362–370. doi:10.1007/BF00317564 [Indo-Pacific *D. setosum* primary field study — **verify journal/DOI before M9B adoption**]

**Confidence:** High. The urchin-herbivory mechanism is foundational to reef ecology. Citations now correctly support the claimed interaction.

---

### Interaction 7 — Reef macroalgae interactsWith staghorn coral (competitive displacement)

> **v2 change:** Remarks expanded to acknowledge geographic limitation of primary citations. Candidate Indo-Pacific citation added. See Change Log M3.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:7 |
| resourceID | OCC:4 (*Lobophora variegata*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Rasher & Hay (2010); Barott et al. (2012); Bellwood et al. (2004) |
| remarks | Lobophora variegata overgrowing and chemically inhibiting Acropora recruitment; causes phase-shift from coral to algal dominance when herbivores are depleted. seasonal:all. GEOGRAPHIC NOTE: Rasher & Hay (2010) was conducted in the US Virgin Islands (Caribbean); Barott et al. (2012) in the Line Islands (Central Pacific). Neither is Coral Triangle primary data. The coral-macroalgae phase-shift mechanism is treated as applicable to the Indo-Pacific based on Bellwood et al. (2004) (Indo-Pacific synthesis) and Hughes et al. (2007) (Indo-Pacific phase-shift dynamics; see candidate citation below). The allelopathic mechanism (Rasher & Hay 2010) is chemical and is not geographically restricted by the review's authors. See Curation Limitation 2. |

**Primary citation:** Rasher, D.B. & Hay, M.E. (2010). Chemically rich seaweeds poison corals when not controlled by herbivores. *PNAS* 107(21):9683–9688. doi:10.1073/pnas.0912095107 [Caribbean system; allelopathic mechanism applicable to Indo-Pacific]

**Supporting:** Barott, K.L. et al. (2012). Natural history of coral-algae competition across a gradient of human activity in the Line Islands. *Marine Ecology Progress Series* 460:1–12. doi:10.3354/meps09787 [Central Pacific system]

**Supporting:** Bellwood, D.R., Hughes, T.P., Folke, C. & Nyström, M. (2004). Confronting the coral reef crisis. *Nature* 429:827–833. doi:10.1038/nature02691 [Indo-Pacific synthesis including Coral Triangle context]

**Candidate supporting (unverified — verify before M9B adoption):** Hughes, T.P., Rodrigues, M.J., Bellwood, D.R. et al. (2007). Phase shifts, herbivory, and the resilience of coral reefs to climate change. *Current Biology* 17(4):360–365. doi:10.1016/j.cub.2006.12.049 — if this paper specifically documents *Lobophora*-coral phase shifts in Indo-Pacific systems, promote to supporting citation.

**Confidence:** High for the mechanism; moderate for Coral Triangle-specific geographic documentation.

---

### Interaction 8 — Humans interactsWith hawksbill (bycatch in fisheries)

> **v2 change:** relatedResourceID corrected from OCC:7 to OCC:1. Note added regarding duplicate triple risk. See Change Log C1 and M6.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:8 |
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Gilman et al. (2010); Hamann et al. (2010) |
| remarks | Incidental capture in longline, trawl, and artisanal fisheries across the Coral Triangle. Hawksbill drowning in gillnets documented in Philippines, Indonesia, Papua New Guinea. seasonal:all. IMPLEMENTATION NOTE: REL:8, REL:9, and REL:10 share the same (resourceID, relatedResourceID, relationshipOfResource) triple. They are distinct records by their unique resourceRelationshipID values (REL:8 / REL:9 / REL:10). M9B must ensure all three records appear in resource-relationship.txt with their distinct IDs. GloBI downstream processing may aggregate these interactions if it deduplicates on the triple rather than the ID; this risk is documented here and in Curation Limitation 5 but does not constitute a Darwin Core compliance error. |

**Primary citation:** Gilman, E. et al. (2010). Mitigating sea turtle by-catch in coastal passive net fisheries. *Fish and Fisheries* 11(1):57–88. doi:10.1111/j.1467-2979.2009.00342.x

**Supporting:** Hamann, M. et al. (2010). Global research priorities for sea turtles. *Endangered Species Research* 11:245–269. doi:10.3354/esr00279

**Confidence:** High.

---

### Interaction 9 — Humans interactsWith hawksbill (shell trade)

> **v2 change:** relatedResourceID corrected from OCC:7 to OCC:1. See Change Log C1.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:9 |
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | TRAFFIC (2019); Mortimer & Donnelly (2008) |
| remarks | Directed take for bekko (tortoiseshell) products; ongoing despite CITES Appendix I listing since 1977. Trade primarily routes through East Asian markets. seasonal:all. See REL:8 for implementation note on shared triple. |

**Primary citation:** TRAFFIC (2019). *Shell Shocked: The Continuing Trade in Hawksbill Turtle Products*. TRAFFIC, Cambridge. [organisational report — grey literature; authoritative on trade volumes]

**Supporting:** Mortimer & Donnelly (2008) IUCN Red List assessment. doi:10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en

**Confidence:** High.

---

### Interaction 10 — Humans interactsWith hawksbill (egg harvesting)

> **v2 change:** relatedResourceID corrected from OCC:7 to OCC:1. See Change Log C1.

| Field | Value |
|---|---|
| resourceRelationshipID | CORAL-TRIANGLE:REL:10 |
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | **OCC:1** (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Mortimer & Donnelly (2008) |
| remarks | Subsistence and commercial collection of hawksbill eggs from nesting beaches across the Coral Triangle; documented in Philippines (Palawan), Indonesia (Kalimantan, Papua), and Solomon Islands. Harvesting rates vary widely by site. seasonal:dry (nesting season, May–October). See REL:8 for implementation note on shared triple. |

**Primary citation:** Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. The IUCN Red List of Threatened Species 2008. doi:10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en

**Confidence:** High for Coral Triangle-specific geographic documentation.

---

## 4. Literature Inventory

All citations used in this design specification. M9B must not add interactions without corresponding additions here.

> **v2 change:** Tano et al. (2017) removed (citation inversion — see Change Log C4). McClanahan & Shafir (1990) and León & Bjorndal (2002) added. Candidate unverified citations listed separately.

| Short ref | Full citation | DOI | Used in |
|---|---|---|---|
| Meylan (1988) | Meylan, A.B. (1988). Spongivory in hawksbill turtles: a diet of glass. *Science* 239(4838):393–395. | 10.1126/science.239.4838.393 | INT:1 |
| Meylan & Meylan (2000) | Meylan, A.B. & Meylan, P.A. (2000). Introduction to the evolution, life history, and biology of sea turtles. In Eckert et al. (eds) *Research and Management Techniques*. IUCN/SSC MTSG. | — | INT:1 |
| León & Bjorndal (2002) | León, Y.M. & Bjorndal, K.A. (2002). Selective feeding in the hawksbill turtle, an important predator in coral reef ecosystems. *Marine Ecology Progress Series* 245:249–258. | 10.3354/meps245249 | INT:3 |
| Mortimer & Donnelly (2008) | Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. IUCN Red List 2008. | 10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en | INT:3, INT:9, INT:10 |
| Bjorndal (1997) | Bjorndal, K.A. (1997). Foraging ecology and nutrition of sea turtles. In Lutz & Musick (eds) *The Biology of Sea Turtles*. CRC Press. | — | INT:2 |
| Limpus (2009) | Limpus, C.J. (2009). A biological review of Australian marine turtle species. 6. Hawksbill turtle. Queensland EPA. | — | INT:2 |
| Pratchett et al. (2014) | Pratchett, M.S., Caballes, C.F., Rivera-Posada, J.A. & Sweatman, H.P.A. (2014). Limits to understanding and managing outbreaks of crown-of-thorns starfish. *Oceanography and Marine Biology* 52:133–200. | — | INT:4 |
| Bellwood et al. (2006) | Bellwood, D.R., Hughes, T.P. & Hoey, A.S. (2006). Sleeping functional group drives coral-reef recovery. *Current Biology* 16:2434–2439. | 10.1016/j.cub.2006.10.030 | INT:5 |
| Hoey & Bellwood (2008) | Hoey, A.S. & Bellwood, D.R. (2008). Cross-shelf variation in the role of parrotfishes on the GBR. *MEPS* 358:105–117. | 10.3354/meps07336 | INT:5 |
| Bellwood et al. (2004) | Bellwood, D.R., Hughes, T.P., Folke, C. & Nyström, M. (2004). Confronting the coral reef crisis. *Nature* 429:827–833. | 10.1038/nature02691 | INT:6 (primary); INT:7 (supporting) |
| Hughes (1994) | Hughes, T.P. (1994). Catastrophes, phase shifts, and large-scale degradation of a Caribbean coral reef. *Science* 265:1547–1551. | 10.1126/science.265.5178.1547 | INT:6 (supporting) |
| McClanahan & Shafir (1990) | McClanahan, T.R. & Shafir, S.H. (1990). Causes and consequences of sea urchin abundance and diversity in Kenyan coral reef lagoons. *Oecologia* 83(3):362–370. | 10.1007/BF00317564 | INT:6 (supporting — verify DOI before M9B) |
| Rasher & Hay (2010) | Rasher, D.B. & Hay, M.E. (2010). Chemically rich seaweeds poison corals when not controlled by herbivores. *PNAS* 107:9683–9688. | 10.1073/pnas.0912095107 | INT:7 |
| Barott et al. (2012) | Barott, K.L. et al. (2012). Natural history of coral-algae competition across the Line Islands. *MEPS* 460:1–12. | 10.3354/meps09787 | INT:7 |
| Gilman et al. (2010) | Gilman, E. et al. (2010). Mitigating sea turtle by-catch in coastal passive net fisheries. *Fish and Fisheries* 11:57–88. | 10.1111/j.1467-2979.2009.00342.x | INT:8 |
| Hamann et al. (2010) | Hamann, M. et al. (2010). Global research priorities for sea turtles. *Endangered Species Research* 11:245–269. | 10.3354/esr00279 | INT:8 |
| TRAFFIC (2019) | TRAFFIC (2019). *Shell Shocked: The Continuing Trade in Hawksbill Turtle Products*. TRAFFIC, Cambridge. | — | INT:9 |
| Veron et al. (2009) | Veron, J.E.N. et al. (2009). Delineating the Coral Triangle. *Galaxea* 11:91–100. | — | Actor context |
| Waycott et al. (2009) | Waycott, M. et al. (2009). Accelerating loss of seagrasses across the globe threatens coastal ecosystems. *PNAS* 106:12377–12381. | 10.1073/pnas.0905620106 | Actor 5 context |
| Mumby et al. (2006) | Mumby, P.J. et al. (2006). Fishing, trophic cascades, and the process of grazing on coral reefs. *Science* 311:98–101. | 10.1126/science.1121129 | Actor 4 context |

**Candidate citations — unverified; verify before M9B adopts:**

| Candidate | Recommended for | Reason |
|---|---|---|
| Meylan, A.B. (1984). Feeding ecology of the hawksbill turtle. *Bulletin of Marine Science* 34(3):456–464. | INT:2 (potential primary) | If confirmed to document juvenile ontogenetic diet including seagrass, promote to primary for INT:2 |
| Hughes, T.P. et al. (2007). Phase shifts, herbivory, and the resilience of coral reefs to climate change. *Current Biology* 17(4):360–365. doi:10.1016/j.cub.2006.12.049 | INT:7 (potential Indo-Pacific supporting) | If confirmed to document *Lobophora*-coral phase shifts in Indo-Pacific systems, add as supporting for INT:7 |

---

## 5. GBIF Identifier Summary

| # | Scientific name | OCC ID | GBIF key | Status |
|---|---|---|---|---|
| 1 | *Eretmochelys imbricata* | OCC:1 | **5220228** | ✓ CONFIRMED |
| 2 | Demospongiae (class) | OCC:2 | ~2481800 | VERIFY |
| 3 | *Acropora* (genus) | OCC:3 | ~2262047 | VERIFY |
| 4 | *Lobophora variegata* | OCC:4 | ~5420688 | VERIFY — HIGH RISK (see Section 8.3) |
| 5 | *Thalassia hemprichii* | OCC:5 | ~2869027 | VERIFY |
| 6 | *Diadema setosum* | OCC:6 | ~7675143 | VERIFY |
| 7 | *Chlorurus microrhinos* | OCC:7 | ~2382006 | VERIFY — confirm accepted family (expect Labridae) |
| 8 | *Acanthaster planci* | OCC:8 | ~2278376 | VERIFY — confirm accepted name (*A. planci* vs. *A. cf. solaris*) |
| 9 | *Homo sapiens* | OCC:9 | **2436436** | ✓ CONFIRMED |

**Verification instruction for M9B:** For each VERIFY key, open `https://www.gbif.org/species/<key>` and confirm: (1) page loads (not 404), (2) scientific name matches, (3) taxonomic rank matches. For GBIF key ~2382006, confirm the accepted family — if Labridae, this confirms C3 correction; if Scaridae is still shown, document the discrepancy in the occurrence record's remarks field. For GBIF key ~2278376, record the backbone's currently accepted species name for the Coral Triangle occurrence.

---

## 6. Editorial Framing for `atlas/coral-triangle.html`

**`#fr-title`:** `Coral Triangle reef`
**`#fr-sub`:** `A reef system at the centre of marine biodiversity, where the hawksbill forages between sponge and stone.`

---

## 7. DwC-A Format Notes for M9B

> **v2 change:** `countryCode` instruction corrected from `ID` (Darwin Core compliance violation) to null/empty. `seasonalPresence` table added. See Change Log M4 and M5.

The occurrence.txt and resource-relationship.txt must follow the Sundarbans DwC-A column schema exactly. Key points:

- `occurrenceID` format: `CORAL-TRIANGLE:OCC:N` (N = 1 through 9)
- `resourceRelationshipID` format: `CORAL-TRIANGLE:REL:N` (N = 1 through 10)
- `eventDate` for all occurrences: `1985/2024`
- **`countryCode`: LEAVE EMPTY (null) for all records.** The Coral Triangle spans six sovereign nations (Philippines, Indonesia, Malaysia, Papua New Guinea, Solomon Islands, Timor-Leste). Darwin Core defines `countryCode` as the country where the specific occurrence was recorded; there is no single country code that correctly represents a multi-national maritime occurrence. The locality field (below) carries the geographic context. Do not use `ID` (Indonesia) as a proxy — this would assert that all occurrences were recorded in Indonesia, which is false.
- `locality` for all records: `Coral Triangle (Philippines, Indonesia, Malaysia, Papua New Guinea, Solomon Islands, Timor-Leste)`
- `coordinateUncertaintyInMeters`: `50000` for all
- Central coordinates: `decimalLatitude: 0.83`, `decimalLongitude: 127.63` (Banda Sea centre of Coral Triangle)
- `habitat` for all records: `Tropical coral reef system (Coral Triangle)`
- `basisOfRecord`: `HumanObservation` for all (derived from field surveys and published literature)

### seasonalPresence values for dynamicProperties

| Actor | OCC | wet | dry | Basis |
|---|---|---|---|---|
| *E. imbricata* | OCC:1 | 1.0 | 1.0 | Year-round reef forager; nesting seasonality at nesting beaches not modelled here (Mortimer & Donnelly 2008) |
| Demospongiae | OCC:2 | 1.0 | 1.0 | Sessile benthic; perennial tropical reef presence |
| *Acropora* spp. | OCC:3 | 1.0 | 1.0 | Perennial reef-builder; spawning seasonal but colony structure year-round |
| *Lobophora variegata* | OCC:4 | 1.0 | 0.75 | Wet-season proliferation under elevated nutrient loading; year-round present but seasonally variable in coverage (Research Curator estimate from nutrient-macroalgae dynamics; not confirmed by Coral Triangle-specific observation data) |
| *T. hemprichii* | OCC:5 | 1.0 | 1.0 | Perennial tropical seagrass (Waycott et al. 2009) |
| *D. setosum* | OCC:6 | 1.0 | 1.0 | Perennial reef resident; year-round documented |
| *C. microrhinos* | OCC:7 | 1.0 | 1.0 | Perennial reef fish; year-round documented |
| *A. planci* | OCC:8 | 0.9 | 1.0 | Year-round present; marginal dry-season aggregation signal from Indo-Pacific spawning studies (Pratchett et al. 2014); distinction is weak at equatorial latitudes |
| *H. sapiens* | OCC:9 | 0.7 | 1.0 | Fishing and harvesting peak in dry season (calmer seas; coincides with hawksbill nesting season); wet: 0.7 consistent with analogous Amazon várzea assignment |

---

## 8. Curation Limitations

1. **Sponge species resolution:** The prey guild is documented at family level in Meylan (1988). No single species-level identification can represent the breadth of hawksbill sponge prey. Class-level Demospongiae is more accurate than any single-species proxy.

2. **Caribbean and non-Coral Triangle evidence:** Multiple citations derive from the Caribbean (Meylan 1988 for spongivory proportions; Rasher & Hay 2010 for allelopathic mechanism; Hughes 1994 for urchin-herbivory mechanism) or adjacent Pacific (Barott et al. 2012). These mechanisms are accepted as applicable to the Indo-Pacific Coral Triangle by the corresponding authors and by Indo-Pacific synthesis literature (Bellwood et al. 2004), but direct Coral Triangle primary data for INT:1 gut proportions, INT:7 allelopathic mechanism, and INT:6 urchin herbivory efficacy are not available from the cited literature. Each affected interaction record flags this in its remarks field.

3. **GBIF key instability:** GBIF taxon keys are stable identifiers but backbone taxonomy is periodically revised. The *Lobophora variegata* key is HIGH RISK due to active taxonomic revision in Dictyotales; *Acanthaster planci* is HIGH RISK due to the unresolved species-complex revision. All seven non-confirmed keys must be verified at implementation time.

4. **Scene positions:** All `sceneX`, `sceneY` values in Section 2 are provisional editorial decisions for the field-record visualisation, not scientific data. M9B may adjust for visual clarity without returning to M9A. M9B should calibrate against the Sundarbans field-record rendering output to understand the y-axis convention before assigning final positions.

5. **Duplicate relationship-type triples (REL:8, REL:9, REL:10):** Three interaction records share the same (resourceID, relatedResourceID, relationshipOfResource) triple. They are distinct Darwin Core records by their unique `resourceRelationshipID` values. GloBI downstream aggregation may conflate them if it deduplicates on the triple. This is a downstream data-consumer risk, not a Darwin Core compliance defect. The distinct `resourceRelationshipID` values and detailed `remarks` fields preserve the record-level distinction.

6. **INT:2 citation quality:** The primary citation (Bjorndal 1997) is a book chapter; the supporting citation (Limpus 2009) is grey literature. Juvenile hawksbill seagrass feeding is ecologically well-established but lacks a confirmed Coral Triangle-specific peer-reviewed primary citation. The candidate Meylan (1984) *Bulletin of Marine Science* should be verified at M9B; if confirmed, it should be added to the literature inventory and promoted to primary for INT:2.

7. **INT:3 inferred status:** The hawksbill–*Acropora* habitat dependency is an inferred ecological relationship, not a directly documented species-pair interaction in the Coral Triangle. The interaction is included because it is the mechanistic link between *Acropora* reef structure and hawksbill habitat viability. It is correctly coded as `interactsWith` with the inferred nature disclosed in remarks.

8. **seasonalPresence for *Lobophora* (OCC:4) is a Research Curator estimate:** No Coral Triangle-specific observation data for *L. variegata* seasonal coverage variation was confirmed in the cited literature. The {wet: 1.0, dry: 0.75} value is derived from general macroalgae nutrient-response dynamics and should be treated as provisional. M9B may retain this value; if Coral Triangle-specific seasonal macroalgal coverage data is found during implementation, update with source.

---

## Appendix A — Revision 1 Change Log

### C1 — OCC identifier collision

**Classification:** Documentation correction (schema integrity)

**Original specification (v1):** Interaction records INT:1, INT:2, INT:3, INT:8, INT:9, INT:10 all used `OCC:7` to identify *Eretmochelys imbricata*. INT:5 correctly used `OCC:7` to identify *Chlorurus microrhinos* (Actor 7). Both usages existed simultaneously in the same document.

**Revised specification (v2):** All references to *E. imbricata* in Section 3 now use `OCC:1` (Actor 1 = OCC:1). The OCC identifier table has been added to each actor's table in Section 2 to make the mapping explicit and unambiguous. OCC:7 refers exclusively to *Chlorurus microrhinos* throughout the document.

**Reason:** The OCC numbering must correspond to actor position in the inventory (Actor 1 = OCC:1, …, Actor 9 = OCC:9). A literal TSV implementation of the v1 interaction records would produce malformed resource-relationship.txt content where the hawksbill is replaced by the parrotfish in DwC-A join operations. This is a critical schema integrity defect.

**Supporting citation:** Darwin Core standard for `resourceID`/`relatedResourceID`: these values must match `occurrenceID` values in the associated occurrence file. No content citation is required; the correction derives from the DwC-A column-join contract.

**Downstream implementation impact:** M9B must use OCC:1 for all hawksbill resource and relatedResource entries. No ecological model change.

---

### C2 — *Lobophora variegata* kingdom: Plantae → Chromista

**Classification:** Taxonomic correction

**Original specification (v1):** `Kingdom / Phylum: Plantae / Ochrophyta`

**Revised specification (v2):** `Kingdom / Phylum: Chromista / Ochrophyta`

**Reason:** Ochrophyta (which contains Phaeophyceae, the class of brown algae including *Lobophora*) belongs to Kingdom Chromista (Cavalier-Smith 1981, revised 2004), not Kingdom Plantae. Chromista was established specifically to accommodate the Stramenopiles/Ochrophyta lineage, which is phylogenetically distinct from green plants and red algae. The GBIF backbone classifies *Lobophora variegata* under Kingdom Chromista. The v1 specification produced an internally contradictory taxonomy — Ochrophyta cannot be in Plantae under any accepted classification system. The lower ranks (Phaeophyceae, Dictyotales, Dictyotaceae) were correct in v1 and are retained.

**Repository corroboration:** The Observatory's `santa-barbara-channel-giant-kelp-decline.ts` narrative assigns *Macrocystis pyrifera* to `class: 'Phaeophyceae'` — the same class as *Lobophora*. Both are brown algae (Chromista: Ochrophyta: Phaeophyceae). The coral-triangle DwC-A must be consistent with the Observatory's existing taxonomic assignments.

**Supporting citation:** Cavalier-Smith, T. (2004). Only six kingdoms of life. *Proceedings of the Royal Society B* 271(1545):1251–1262. doi:10.1098/rspb.2004.2705

**Downstream implementation impact:** M9B writes `kingdom: Chromista` in Actor 4's occurrence row. GBIF key verification (Step: open species/5420688) will confirm whether the backbone uses `Chromista` or a more recent equivalent.

---

### C3 — *Chlorurus microrhinos* family: Scaridae → Labridae

**Classification:** Taxonomic correction

**Original specification (v1):** `Order / Family: Labriformes / Scaridae`

**Revised specification (v2):** `Order / Family: Labriformes / Labridae`

**Reason:** The v1 spec adopted the current molecular-phylogenetics-based Order: Labriformes, which was established following Near et al. (2012) and others. Under Labriformes, parrotfishes are placed in Family Labridae (with Scarinae as a subfamily). Family Scaridae is not a valid family under Labriformes in the current GBIF backbone or in FishBase (which also follows the revised classification). The v1 spec was internally inconsistent: the order was updated but the family was not. Using both Labriformes and Scaridae simultaneously produces a parent-child relationship that does not exist in any accepted classification system.

**Supporting citation:** Near, T.J. et al. (2012). Resolution of ray-finned fish phylogeny and timing of diversification. *PNAS* 109(34):13698–13703. doi:10.1073/pnas.1206625109 — establishes Labriformes and the placement of Scarinae within Labridae.

**Downstream implementation impact:** M9B writes `family: Labridae` in Actor 7's occurrence row. The GBIF key verification (species/2382006) should confirm; if the backbone still shows Scaridae for this key, document the discrepancy in `associatedReferences` rather than overriding the specification.

---

### C4 — Tano et al. (2017) citation inversion in INT:6

**Classification:** Evidence correction

**Original specification (v1):** Tano et al. (2017) *MEPS* 579:1–15 ("Temperate brown algae chemically defend against grazing and biofouling") listed as supporting citation for INT:6 (*Diadema setosum* eats *Lobophora variegata*).

**Revised specification (v2):** Tano et al. (2017) removed from the literature inventory entirely. INT:6 primary citation is now Bellwood et al. (2004) *Nature*. Hughes (1994) and McClanahan & Shafir (1990) added as supporting citations.

**Reason:** The Tano et al. (2017) paper documents *macroalgal chemical defense against grazing* — the finding is that temperate brown algae produce phlorotannins and other secondary metabolites that deter herbivory by urchins and fish. This finding directly contradicts the claim of INT:6 (that *D. setosum* successfully grazes *L. variegata*). A paper demonstrating that macroalgae resist urchin herbivory cannot serve as supporting evidence that urchins control macroalgae. The citation was not merely weak — it was directionally inverted, and would mislead any reader who checked the source.

**Replacement rationale:**
- Bellwood et al. (2004) *Nature* explicitly identifies sea urchins alongside parrotfish as the two functional groups controlling macroalgae on Indo-Pacific reefs — directly supporting INT:6.
- Hughes (1994) *Science* documents the catastrophic consequence of urchin removal (*D. antillarum* mass mortality 1983–84): macroalgae proliferated within months on Caribbean reefs. This demonstrates the causal herbivory mechanism by its absence, applicable by functional analogy to *D. setosum* in the Indo-Pacific.
- McClanahan & Shafir (1990) provides direct Indo-Pacific (*D. setosum*, Kenya) field data on urchin abundance and herbivore function — the closest primary citation for the species claimed in INT:6.

**Downstream implementation impact:** Tano et al. (2017) is removed from resource-relationship.txt `relationshipAccordingTo` field for REL:6. McClanahan & Shafir (1990) DOI must be verified before M9B writes it.

---

### M1 — Geographic extrapolation flagged at interaction level (INT:1 remarks)

**Classification:** Representation correction

**Original specification (v1):** INT:1 remarks stated "approximately 95% of gut content volume" without flagging that this figure derives from Caribbean populations.

**Revised specification (v2):** INT:1 remarks now specify: *"figure from Caribbean populations (Meylan 1988); Indo-Pacific corroboration in Meylan & Meylan (2000) and León & Bjorndal (2002) confirms sponge dominance across ocean basins; Coral Triangle prey family proportions not directly measured."*

**Reason:** The remarks field is the only point where a reader of the TSV file itself (without the design spec) would encounter geographic context. Flagging the Caribbean origin of the 95% figure at the interaction-record level, not only in Section 8, is necessary for scientific transparency. The ecological fact (spongivory dominance) is supported across ocean basins; the specific proportion is not confirmed for the Coral Triangle.

**Supporting citation:** León & Bjorndal (2002) confirms cross-ocean-basin spongivory dominance, providing the Indo-Pacific bridge.

**Downstream implementation impact:** Remarks field in resource-relationship.txt REL:1 must include the geographic provenance note.

---

### M2 — Inferred habitat dependency flagged in INT:3

**Classification:** Representation correction

**Original specification (v1):** INT:3 described a hawksbill–*Acropora* interaction without disclosing that the relationship is inferred from general reef habitat use, not from a direct species-pair field study.

**Revised specification (v2):** INT:3 remarks now open with `INFERRED HABITAT DEPENDENCY:` and specify that the interaction is inferred from reef-habitat use patterns, with no direct Coral Triangle species-pair field study confirmed. León & Bjorndal (2002) added as a supporting citation for reef-structure discrimination.

**Reason:** Distinguishing inferred from observed interactions is scientifically mandatory. The INT:3 relationship is ecologically sound but the evidence base is a conservation synthesis document (IUCN assessment), not primary field observation of hawksbill–*Acropora* co-use. Disclosing the inferred status prevents the DwC-A from being read as claiming a directly documented species-pair interaction for which no primary data exists.

**Supporting citation:** León & Bjorndal (2002) — hawksbill as reef-structure-discriminating predator (sponge selection by reef architecture) provides the closest available primary-literature basis.

**Downstream implementation impact:** Remarks field in resource-relationship.txt REL:3 must include the inferred-status declaration.

---

### M3 — Geographic limitation of INT:7 citations flagged at interaction level

**Classification:** Representation correction

**Original specification (v1):** INT:7 (macroalgae–coral competitive displacement) cited Rasher & Hay (2010) (Caribbean) and Barott et al. (2012) (Line Islands) without flagging the geographic limitation at the interaction level. Section 8.2 acknowledged it only in the curation limitations.

**Revised specification (v2):** INT:7 remarks now include a `GEOGRAPHIC NOTE:` explicitly stating that primary citations derive from Caribbean and Central Pacific systems, and that Indo-Pacific applicability is inferred via Bellwood et al. (2004) synthesis and the proposed-but-unverified Hughes et al. (2007) candidate. Bellwood et al. (2004) added as a supporting citation for INT:7 to anchor the Indo-Pacific applicability claim.

**Reason for not rejecting the interaction:** The macroalgae–coral competitive mechanism is not geographically restricted in the primary literature — Rasher & Hay (2010) do not present their findings as Caribbean-specific, and the allelopathic mechanism is chemical. The Scientific Review correctly identified the geographic limitation; the correction is to flag it transparently rather than remove a well-founded interaction.

**Recommendation not yet adopted (unverified):** Hughes et al. (2007) *Current Biology* 17:360–365 is listed as a candidate supporting citation requiring verification. If confirmed to document *Lobophora*-coral phase shifts in Indo-Pacific systems, it should be added to the literature inventory.

**Downstream implementation impact:** Remarks field in resource-relationship.txt REL:7 must include the GEOGRAPHIC NOTE.

---

### M4 — `countryCode` corrected to null for multi-national records

**Classification:** Darwin Core correction

**Original specification (v1):** `countryCode: ID` (Indonesia) recommended for all actors "for geographic consistency."

**Revised specification (v2):** `countryCode` is null/empty for all nine actors. Geographic context recorded in `locality` field: `Coral Triangle (Philippines, Indonesia, Malaysia, Papua New Guinea, Solomon Islands, Timor-Leste)`.

**Reason:** Darwin Core `countryCode` (ISO 3166-1 alpha-2) specifies the country where the occurrence was recorded. Using `ID` (Indonesia) for species whose documented occurrence spans six sovereign nations and international waters is a Darwin Core compliance violation — it would falsely assert that all occurrences were recorded in Indonesia. Null/empty `countryCode` is the correct Darwin Core practice for multinational or international-waters records. Geographic context is preserved in the `locality` field, which is free text.

**Repository corroboration:** The Sundarbans DwC-A uses `countryCode: BD` (Bangladesh) because all Sundarbans occurrences are recorded in Bangladesh — a single-country locality. The Coral Triangle is not analogous.

**Downstream implementation impact:** M9B removes `countryCode` from all occurrence records or sets to empty string. The `locality` field carries the geographic extent.

---

### M5 — `seasonalPresence` values specified by Research Curator

**Classification:** Documentation addition (ecological data)

**Original specification (v1):** No `seasonalPresence` wet/dry values specified for any of the nine actors.

**Revised specification (v2):** `seasonalPresence` values specified for all nine actors in Section 2 (per-actor) and consolidated in the Section 7 DwC-A format notes table.

**Reason:** The `seasonalPresence` field in `dynamicProperties` is ecological data used by the field-record renderer. Both existing DwC-As (Sundarbans and Amazon várzea) include it. Delegating these values to M9B would require the Technical Lead to make ecological judgments without Research Curator authority. The values derived here are based on: documented year-round reef residence (most taxa), nesting seasonality exclusion for hawksbill foraging habitat (Actor 1), monsoon-season macroalgal proliferation patterns (Actor 4 — noted as a Research Curator estimate from nutrient dynamics literature, not confirmed by Coral Triangle-specific data), and dry-season activity peaks for human communities (Actor 9).

**Downstream implementation impact:** M9B reads the `seasonalPresence` table in Section 7 and writes values directly into each actor's `dynamicProperties` JSON in occurrence.txt.

---

### M6 — Duplicate interaction triples documented and mitigated

**Classification:** Darwin Core correction (compliance documentation)

**Original specification (v1):** Three interaction records (INT:8, INT:9, INT:10) shared the same (resourceID, relatedResourceID, relationshipOfResource) triple with no documentation of this fact.

**Revised specification (v2):** INT:8 remarks now contain an `IMPLEMENTATION NOTE` explaining that the three records are distinct by their unique `resourceRelationshipID` values, that Darwin Core does not deduplicate on the triple, and that GloBI downstream aggregation may conflate them. The limitation is formally documented in Section 8, Curation Limitation 5.

**Reason:** Darwin Core's uniqueness constraint is on `resourceRelationshipID`, not on the (resourceID, relatedResourceID, relationshipOfResource) triple. The three records are valid Darwin Core records with distinct IDs. The risk is downstream, not structural. The correction is to document this explicitly so M9B is aware of the GloBI behaviour and ensures distinct IDs in the TSV.

**Why not use different RO terms:** No standard RO terms exist for `harvestsEggsOf`, `killsForTrade`, or `incidentallyCaptures`. GloBI uses `interactsWith` for the full range of human-wildlife interaction types. Introducing non-standard relationship terms would reduce interoperability.

**Downstream implementation impact:** M9B ensures CORAL-TRIANGLE:REL:8, REL:9, REL:10 are written as three distinct rows in resource-relationship.txt.

---

### M7 — INT:2 citation quality disclosed; candidate primary source identified

**Classification:** Documentation clarification (evidence quality)

**Original specification (v1):** Bjorndal (1997) listed as primary citation without disclosing its book-chapter status; Limpus (2009) listed as supporting without disclosing its grey-literature status.

**Revised specification (v2):** Both citations now carry in-line disclosure notes. A candidate primary peer-reviewed source — Meylan (1984) *Bulletin of Marine Science* 34(3):456–464 — is identified and added to the candidate citations table with verification instructions.

**Reason:** Track A verification requires disclosure of citation type. Book chapters and government reports are acceptable supporting evidence for ecologically well-established interactions, but must be disclosed so future curators can assess evidence quality. The juvenile seagrass feeding interaction is not scientifically contested; the weakness is documentation quality, not ecological validity.

**What is missing:** A peer-reviewed primary paper specifically documenting juvenile *E. imbricata* feeding on *T. hemprichii* in the Indo-Pacific (ideally the Coral Triangle). Meylan (1984) is the strongest candidate in the sea turtle feeding ecology literature but requires verification of its content regarding juvenile diet.

**Downstream implementation impact:** M9B verifies Meylan (1984) before implementation. If confirmed, it is added to the literature inventory and adopts primary citation status for INT:2. If not confirmed, the current citations are retained with their disclosed limitations.

---

### M8 — Mortimer & Donnelly (2008) over-citation reduced

**Classification:** Documentation clarification (source independence)

**Original specification (v1):** Mortimer & Donnelly (2008) was the sole or primary citation for INT:3, INT:9, and INT:10 — three interactions.

**Revised specification (v2):** 
- INT:3: León & Bjorndal (2002) added as a supporting citation providing primary field data on reef-structure discrimination, reducing dependence on the IUCN synthesis alone.
- INT:9: TRAFFIC (2019) remains primary; Mortimer & Donnelly (2008) is supporting. Citation hierarchy clarified.
- INT:10: Mortimer & Donnelly (2008) remains primary (it is the most specific Coral Triangle source for egg harvesting documentation). This is an acknowledged limitation pending identification of a Coral Triangle-specific peer-reviewed paper on egg harvesting. No suitable verified alternative exists in the current literature inventory; this is noted in Section 8.

**Reason:** Source independence does not require that each interaction have a completely distinct primary source — it requires that evidence is not monolithically derived from a single document across the network. The addition of León & Bjorndal (2002) for INT:3 and the clarification of TRAFFIC (2019) as primary for INT:9 reduce the degree of concentration while remaining honest about what the literature actually provides for INT:10.

**Downstream implementation impact:** No change to INT:10's `relationshipAccordingTo` field. León & Bjorndal (2002) is added to the literature inventory (verified DOI: 10.3354/meps245249).

---

## Appendix B — Outstanding Issues After Revision 1

### Unresolved (accepted as known limitations, not blockers)

| ID | Issue | Status |
|---|---|---|
| INT:2 primary citation | No peer-reviewed primary paper confirmed for juvenile hawksbill seagrass feeding in Indo-Pacific | Meylan (1984) candidate identified; verify at M9B |
| INT:3 evidence basis | Habitat dependency inferred, not directly observed | Disclosed in remarks; accepted pending future literature |
| INT:7 Indo-Pacific citation | No confirmed Coral Triangle primary paper for *Lobophora*-coral competition | Hughes et al. (2007) candidate identified; verify at M9B |
| INT:8–10 triple duplication | GloBI may aggregate the three human-hawksbill interactions | Documented in remarks and Section 8; not a Darwin Core defect |
| OCC:4 *Lobophora* GBIF key | Taxonomic revision in Dictyotales makes key verification high-risk | VERIFY flagged with HIGH RISK note |
| McClanahan & Shafir (1990) DOI | DOI 10.1007/BF00317564 listed but not confirmed | VERIFY before M9B adopts |

### Not adopted (reviewer recommendation rejected with justification)

None. All Scientific Review recommendations were adopted or accepted as known limitations. No recommendation required rejection.
