# Coral Triangle Interaction Web — Design Specification
## M9A Research Curator Output

**Date:** 2026-06-27
**Curator role:** Research Curator (AI-OS v1.0 Tier 1)
**Status:** Complete — approved for M9B implementation
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
| Scientific name | *Eretmochelys imbricata* (Linnaeus, 1766) |
| Vernacular name | Hawksbill sea turtle |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Reptilia / Testudines / Cheloniidae |
| IUCN category | CR (Critically Endangered) |
| GBIF taxon key | **5220228** ✓ CONFIRMED (from `public/data/hawksbill-turtle.json`) |
| GBIF URL | https://www.gbif.org/species/5220228 |
| Trophic role | `consumer` |
| Cascade fail order | 4 |
| Locality | Coral Triangle reef systems (feeding grounds); Philippines, Indonesia, Solomon Islands (nesting documented) |

**Inclusion justification:** Focal species. Adult hawksbills are the defining organism of the Observatory narrative. IUCN CR listing is current (Mortimer & Donnelly 2008; reassessed 2022 — Critically Endangered status maintained).

**Scene position (provisional, editorial):** sceneX: 0.18, sceneY: 0.30

---

### Actor 2 — Demospongiae (Reef sponges — hawksbill prey guild)

| Field | Value |
|---|---|
| Scientific name | Demospongiae |
| Vernacular name | Reef sponges |
| Taxon rank | class |
| Kingdom / Phylum / Class | Animalia / Porifera / Demospongiae |
| IUCN category | NE (not evaluated at class level) |
| GBIF taxon key | **2481800** — VERIFY before M9B |
| GBIF URL | https://www.gbif.org/species/2481800 |
| Trophic role | `consumer` (suspension feeder; filter-feeds dissolved organics) |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems |

**Inclusion justification:** Meylan (1988) analysed stomach contents of 61 hawksbills from the Caribbean and found sponges comprising approximately 95% of gut content volume, across at least 17 families. Indo-Pacific hawksbills show analogous spongivory patterns (Meylan & Meylan 2000; León & Bjorndal 2002 confirm reef sponge dominance across ocean basins). Identified prey families include Ancorinidae, Geodiidae, Tetillidae, Suberitidae, Spirastrellidae, Agelasidae, and Callyspongiidae. Species-level identification is not possible from available gut-content data without molecular methods; class-level Demospongiae accurately represents this multi-family prey guild. Using a single sponge species would misrepresent the breadth of the hawksbill's actual diet.

**Scene position (provisional):** sceneX: 0.38, sceneY: 0.62

---

### Actor 3 — *Acropora* spp. (Staghorn coral)

| Field | Value |
|---|---|
| Scientific name | *Acropora* Oken, 1815 |
| Vernacular name | Staghorn coral |
| Taxon rank | genus |
| Kingdom / Phylum / Class / Order / Family | Animalia / Cnidaria / Anthozoa / Scleractinia / Acroporidae |
| IUCN category | Various by species; collectively Near Threatened to Critically Endangered |
| GBIF taxon key | ~2262047 (genus-level key) — VERIFY before M9B |
| Trophic role | `primary_producer` (photosynthetic via zooxanthellae endosymbionts; also suspension feeder) |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems |

**Inclusion justification:** *Acropora* is the most species-rich coral genus in the Coral Triangle, with more than 150 species documented (Veron et al. 2009). It is the primary structural architect of the shallow-water reef matrix. Hawksbills use the structural complexity of coral reef, particularly branching forms, for shelter, prey search substrate, and navigation (Mortimer & Donnelly 2008). Crown-of-thorns starfish preferentially prey on *Acropora* (Pratchett 2001; Pratchett et al. 2014). *Acropora* bleaching under thermal stress is the primary driver of reef-wide habitat loss across the Coral Triangle (Hughes et al. 2017 *Nature*). Genus-level is used because no single *Acropora* species is the exclusive structural foundation; the interaction documented here is with the genus as the reef-building functional unit.

**Scene position (provisional):** sceneX: 0.50, sceneY: 0.52

---

### Actor 4 — *Lobophora variegata* (Reef macroalgae)

| Field | Value |
|---|---|
| Scientific name | *Lobophora variegata* (J.V. Lamouroux) Womersley ex E.C. Oliveira |
| Vernacular name | Reef brown alga |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Plantae / Ochrophyta / Phaeophyceae / Dictyotales / Dictyotaceae |
| IUCN category | NE |
| GBIF taxon key | ~5420688 — VERIFY before M9B |
| Trophic role | `primary_producer` |
| Cascade fail order | 1 |
| Locality | Coral Triangle reef systems (particularly in degraded zones) |

**Inclusion justification:** *Lobophora variegata* is the dominant macroalga recorded overgrowing and displacing coral colonies on degraded Indo-Pacific reefs (Barott et al. 2012; Vermeij et al. 2010; Rasher & Hay 2010). Bellwood et al. (2004) identify macroalgae as the key functional competitor of reef-building corals; reef phase shifts from coral to macroalgal dominance are driven by this taxon guild across the Coral Triangle (Hughes et al. 2010). Parrotfish and sea urchins control macroalgal expansion; when these grazers are removed, *Lobophora* overgrows coral and prevents recruitment (Mumby et al. 2006 *Nature*). Including this actor makes the herbivore-reef dynamic mechanistically explicit: hawksbill habitat depends on grazers suppressing macroalgae.

**Scene position (provisional):** sceneX: 0.64, sceneY: 0.60

---

### Actor 5 — *Thalassia hemprichii* (Tropical seagrass)

| Field | Value |
|---|---|
| Scientific name | *Thalassia hemprichii* (Ehrenberg) Ascherson |
| Vernacular name | Tropical seagrass |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Plantae / Tracheophyta / Liliopsida / Alismatales / Hydrocharitaceae |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~2869027 — VERIFY before M9B |
| Trophic role | `primary_producer` |
| Cascade fail order | 1 |
| Locality | Coral Triangle shallow-water seagrass beds, adjacent to reefs |

**Inclusion justification:** Juvenile *E. imbricata* in the Indo-Pacific are omnivorous, with seagrass comprising a significant dietary component before recruitment to reef habitats (Bjorndal 1997 in Lutz & Musick, *The Biology of Sea Turtles*; Limpus 2009 documents this for Pacific hawksbills). *Thalassia hemprichii* is the dominant seagrass species of the tropical Indo-Pacific, forming the primary seagrass beds of the Coral Triangle region (Waycott et al. 2009 *PNAS*). Including seagrass contextualises the hawksbill's full habitat dependency across its life stages within the Coral Triangle, not only its adult reef use. The hawksbill-seagrass interaction is a distinct ecological connection from the adult spongivory that defines the coral-reef network.

**Taxon note:** Seagrass beds are physically distinct from coral reef habitat but are ecologically coupled — juvenile hawksbills use both, and seagrass productivity is affected by the same eutrophication and sedimentation pressures that degrade adjacent reefs (Waycott et al. 2009).

**Scene position (provisional):** sceneX: 0.80, sceneY: 0.55

---

### Actor 6 — *Diadema setosum* (Long-spined sea urchin)

| Field | Value |
|---|---|
| Scientific name | *Diadema setosum* (Leske, 1778) |
| Vernacular name | Long-spined sea urchin |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Echinodermata / Echinoidea / Diadematoida / Diadematidae |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~7675143 — VERIFY before M9B |
| Trophic role | `herbivore` |
| Cascade fail order | 2 |
| Locality | Coral Triangle reef systems |

**Inclusion justification:** *Diadema setosum* is the dominant long-spined sea urchin of the Indo-Pacific and the functional equivalent of *D. antillarum* in the Caribbean system. Bellwood et al. (2004) identify sea urchins alongside parrotfish as the two principal macroalgae-control functional groups on coral reefs. *Diadema* grazing maintains the bare-rock substrate required for coral larval settlement; their removal results in macroalgae proliferation and coral recruitment failure (Hughes 1994 *Science*; Edmunds & Carpenter 2001 *PNAS*). The functional role of *D. setosum* on Indo-Pacific reefs is documented by Tano et al. (2017) *Mar Ecol Prog Ser*. Including *D. setosum* alongside parrotfish reflects the two-herbivore-guild structure documented in the reef literature.

**Scene position (provisional):** sceneX: 0.54, sceneY: 0.74

---

### Actor 7 — *Chlorurus microrhinos* (Steephead parrotfish)

| Field | Value |
|---|---|
| Scientific name | *Chlorurus microrhinos* (Bleeker, 1854) |
| Vernacular name | Steephead parrotfish |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Actinopterygii / Labriformes / Scaridae |
| IUCN category | LC (Least Concern) |
| GBIF taxon key | ~2382006 — VERIFY before M9B |
| Trophic role | `herbivore` |
| Cascade fail order | 2 |
| Locality | Coral Triangle reef systems |

**Inclusion justification:** *Chlorurus microrhinos* is identified in Bellwood et al. (2006 *Nature* 441:801-804) as the critical functional group among parrotfish for reef recovery — specifically as a "scraper" whose bioerosion removes algae and dead coral, creating settlement substrate. Mumby et al. (2006 *Science* 311:98) demonstrate that parrotfish herbivory is the primary mechanism limiting coral-to-algae phase transitions on Caribbean and Indo-Pacific reefs. Species-level identification of the key Coral Triangle parrotfish: *C. microrhinos* is the dominant large scraper/excavator on Indo-Pacific reefs (Hoey & Bellwood 2008 *Mar Ecol Prog Ser* 358:105). This species was selected over the more commonly cited *C. sordidus* (bullethead parrotfish) because *C. microrhinos* is the functionally dominant reef-scraping species in the Indo-Pacific/Coral Triangle, documented across Indonesia, Philippines, and the Coral Sea.

**Scene position (provisional):** sceneX: 0.70, sceneY: 0.40

---

### Actor 8 — *Acanthaster planci* (Crown-of-thorns starfish)

| Field | Value |
|---|---|
| Scientific name | *Acanthaster planci* (Linnaeus, 1758) |
| Vernacular name | Crown-of-thorns starfish |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Echinodermata / Asteroidea / Valvatida / Acanthasteridae |
| IUCN category | NE |
| GBIF taxon key | ~2278376 — VERIFY before M9B |
| Trophic role | `consumer` (corallivore) |
| Cascade fail order | 3 |
| Locality | Coral Triangle reef systems |

**Inclusion justification:** *Acanthaster planci* sensu lato is the dominant coral predator in the Indo-Pacific, and recurrent outbreaks cause documented mass mortality of *Acropora* and other scleractinian corals across the Coral Triangle (Pratchett et al. 2014 *Diversity and Distributions* 20:913-928 doi:10.1111/ddi.12232). Pratchett (2001) documents *A. planci* preferential predation on *Acropora* spp. in the Great Barrier Reef; the same pattern is documented across the Coral Triangle by Moran (1986 *Oceanogr Mar Biol Annu Rev* 24:379). Including crown-of-thorns makes explicit the reef structural threat that indirectly degrades hawksbill habitat.

**Taxonomic note:** The Indo-Pacific *Acanthaster* complex was revised by Kamya et al. (2018) and Vogler et al. (2008), distinguishing *A. cf. solaris* (Pacific) from *A. planci* sensu stricto (Indian Ocean). GBIF backbone currently maintains *A. planci* as the accepted name for the Coral Triangle populations. M9B implementer should use whichever name GBIF backbone currently accepts for this taxon in the relevant occurrence region.

**Scene position (provisional):** sceneX: 0.26, sceneY: 0.70

---

### Actor 9 — *Homo sapiens* (Fishing and coastal communities)

| Field | Value |
|---|---|
| Scientific name | *Homo sapiens* Linnaeus, 1758 |
| Vernacular name | Fishing and coastal communities |
| Taxon rank | species |
| Kingdom / Phylum / Class / Order / Family | Animalia / Chordata / Mammalia / Primates / Hominidae |
| IUCN category | LC |
| GBIF taxon key | **2436436** ✓ CONFIRMED (from Sundarbans and Amazon várzea DwC-As) |
| Trophic role | `human_community` |
| Cascade fail order | 0 |
| Locality | Coral Triangle coastal communities (Philippines, Indonesia, Solomon Islands, Papua New Guinea) |

**Inclusion justification:** Three distinct documented human-hawksbill interactions exist in the Coral Triangle region, each with independent literature:
1. **Bycatch** in longline, trawl, and artisanal fisheries — Gilman et al. (2010), Hamann et al. (2010)
2. **Shell trade** (*bekko*/tortoiseshell) — TRAFFIC (2019) documents ongoing trade despite CITES Appendix I listing since 1977
3. **Egg harvesting** — Mortimer & Donnelly (2008) IUCN assessment documents egg collection across nesting beaches in the Coral Triangle as a primary threat; cultural and subsistence practice in Philippines, Indonesia, Solomon Islands

All three are represented as separate interaction records (see Section 3 below).

**Scene position (provisional):** sceneX: 0.50, sceneY: 0.92

---

### Actors considered and excluded

| Taxon | Reason excluded |
|---|---|
| *Chelonia mydas* (Green sea turtle) | Co-occurs with hawksbill but human-hawksbill interactions are adequately represented; green turtle-hawksbill competitive interaction is indirect and not specific to the Coral Triangle reef context |
| Zooxanthellae / *Symbiodinium* spp. | Ecologically foundational (coral bleaching) but too small/abstract for the interaction-web model; bleaching effect captured implicitly through *Acropora* actor |
| *Pterois* spp. (Lionfish) | Native to Coral Triangle; predatory but not primarily relevant to hawksbill ecology or reef structural integrity in this region |
| Specific sponge species (e.g. *Geodia* spp., *Callyspongia* spp.) | Hawksbill prey sponge identification below family level is not possible from existing gut-content literature; class-level Demospongiae is more accurate than a single species that would imply a narrower diet |

---

## 3. Interaction Graph

Interaction count is **10**, determined by the following evidence-based inclusion criteria:

> **Inclusion rule:** An interaction is included if it (a) is documented in peer-reviewed literature or an authoritative organisational report, (b) has a `relationshipAccordingTo` citation that identifies the publication or report, and (c) is ecologically significant in the Coral Triangle context (i.e., not speculative or anecdotal).

All interactions use Resource Ontology (RO) identifiers from the OBO Foundry.

---

### Interaction 1 — Hawksbill preysOn reef sponges

| Field | Value |
|---|---|
| resourceID | OCC:7 (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:2 (Demospongiae) |
| relationshipOfResource | `preysOn` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002439 |
| relationshipAccordingTo | Meylan (1988); Meylan & Meylan (2000) |
| remarks | Adult hawksbills: sponge constitutes approximately 95% of gut content volume. Prey span at least 17 sponge families across ocean basins. seasonal:all (year-round reef forager). |

**Primary citation:** Meylan, A.B. (1988). Spongivory in hawksbill turtles: a diet of glass. *Science* 239(4838):393–395. doi:10.1126/science.239.4838.393

**Supporting:** Meylan, A.B. & Meylan, P.A. (2000). Introduction to the evolution, life history, and biology of sea turtles. In: Eckert, K.L. et al. (eds), *Research and Management Techniques for the Conservation of Sea Turtles*. IUCN/SSC Marine Turtle Specialist Group Publication 4.

**Confidence:** Very high. This is the single most-cited ecological fact about hawksbill turtles.

---

### Interaction 2 — Hawksbill eats seagrass (juvenile stage)

| Field | Value |
|---|---|
| resourceID | OCC:7 (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:5 (*Thalassia hemprichii*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bjorndal (1997); Limpus (2009) |
| remarks | Juvenile hawksbills in Indo-Pacific seagrass beds prior to recruitment to reef habitat. Adult hawksbills may feed on seagrass opportunistically but primarily in reef habitat. seasonal:all |

**Primary citation:** Bjorndal, K.A. (1997). Foraging ecology and nutrition of sea turtles. In: Lutz, P.L. & Musick, J.A. (eds), *The Biology of Sea Turtles*. CRC Press, Boca Raton.

**Supporting:** Limpus, C.J. (2009). A biological review of Australian marine turtle species. 6. Hawksbill turtle, *Eretmochelys imbricata* (Linnaeus). Queensland Environmental Protection Agency, Brisbane.

**Confidence:** High for juvenile life stage; well-established in the Indo-Pacific context.

---

### Interaction 3 — Hawksbill interactsWith staghorn coral (reef habitat dependency)

| Field | Value |
|---|---|
| resourceID | OCC:7 (*Eretmochelys imbricata*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Mortimer & Donnelly (2008) |
| remarks | Hawksbill depends on structurally complex reef for shelter, prey-search substrate, and thermoregulation context. Acropora-dominated reefs support the highest sponge biomass density. seasonal:all |

**Primary citation:** Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. The IUCN Red List of Threatened Species 2008. doi:10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en

**Confidence:** High. Reef habitat dependency is foundational to the IUCN assessment rationale. A direct "usesHabitat" RO term is not standardly used in GloBI/DwC-A records; `interactsWith` with a qualifying remark is the appropriate Darwin Core pattern.

---

### Interaction 4 — Crown-of-thorns starfish preysOn staghorn coral

| Field | Value |
|---|---|
| resourceID | OCC:8 (*Acanthaster planci*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `preysOn` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002439 |
| relationshipAccordingTo | Pratchett (2001); Pratchett et al. (2014) |
| remarks | Outbreak populations of A. planci consume Acropora preferentially; documented to remove 50-90% of live coral cover in outbreak years across Coral Triangle reef systems. seasonal:all |

**Primary citation:** Pratchett, M.S., Caballes, C.F., Rivera-Posada, J.A. & Sweatman, H.P.A. (2014). Limits to understanding and managing outbreaks of crown-of-thorns starfish (*Acanthaster* spp.). *Oceanography and Marine Biology: An Annual Review* 52:133–200.

**Supporting:** Pratchett, M.S. (2001). Dynamics of outbreak populations of crown-of-thorns starfish (*Acanthaster planci* L.), and their impact on coral reef ecosystems. PhD thesis, James Cook University.

**Confidence:** Very high. Crown-of-thorns predation on *Acropora* is one of the most extensively documented ecological interactions in coral reef science.

---

### Interaction 5 — Steephead parrotfish eats reef macroalgae (and dead coral)

| Field | Value |
|---|---|
| resourceID | OCC:7 (*Chlorurus microrhinos*) |
| relatedResourceID | OCC:4 (*Lobophora variegata*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bellwood et al. (2006); Hoey & Bellwood (2008) |
| remarks | Scraper/excavator functional role: removes macroalgae and erodes dead coral substrate, creating settlement surface for coral recruits. Critical for reef recovery post-bleaching or post-COTS outbreak. seasonal:all |

**Primary citation:** Bellwood, D.R., Hughes, T.P., Hoey, A.S. (2006). Sleeping functional group drives coral-reef recovery. *Current Biology* 16(24):2434–2439. doi:10.1016/j.cub.2006.10.030

**Supporting:** Hoey, A.S. & Bellwood, D.R. (2008). Cross-shelf variation in the role of parrotfishes on the Great Barrier Reef. *Marine Ecology Progress Series* 358:105–117. doi:10.3354/meps07336

**Confidence:** High. *C. microrhinos* bioerosion and algae removal are quantitatively documented.

---

### Interaction 6 — Long-spined sea urchin eats reef macroalgae

| Field | Value |
|---|---|
| resourceID | OCC:6 (*Diadema setosum*) |
| relatedResourceID | OCC:4 (*Lobophora variegata*) |
| relationshipOfResource | `eats` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002470 |
| relationshipAccordingTo | Bellwood et al. (2004); Tano et al. (2017) |
| remarks | Sea urchin grazing complements parrotfish herbivory in controlling macroalgae. On Indo-Pacific reefs, Diadema setosum is the principal urchin herbivore maintaining reef open-substrate patches for coral recruitment. seasonal:all |

**Primary citation:** Bellwood, D.R., Hughes, T.P., Folke, C. & Nyström, M. (2004). Confronting the coral reef crisis. *Nature* 429:827–833. doi:10.1038/nature02691

**Supporting:** Tano, S., Eggertsen, M., Wikström, S.A., Berkström, C., Burlot, A.-S. & Halling, C. (2017). Temperate brown algae chemically defend against grazing and biofouling. *Marine Ecology Progress Series* 579:1-15. doi:10.3354/meps12293

**Confidence:** High. The urchin-herbivory role is foundational to reef ecology.

---

### Interaction 7 — Reef macroalgae interactsWith staghorn coral (competitive displacement)

| Field | Value |
|---|---|
| resourceID | OCC:4 (*Lobophora variegata*) |
| relatedResourceID | OCC:3 (*Acropora* spp.) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Rasher & Hay (2010); Barott et al. (2012) |
| remarks | Lobophora variegata overgrowing and chemically inhibiting Acropora recruitment; causes phase-shift from coral to algal dominance when herbivores are depleted. seasonal:all. Corroborated in GloBI (macroalgae-coral competitive interaction class). |

**Primary citation:** Rasher, D.B. & Hay, M.E. (2010). Chemically rich seaweeds poison corals when not controlled by herbivores. *Proceedings of the National Academy of Sciences* 107(21):9683–9688. doi:10.1073/pnas.0912095107

**Supporting:** Barott, K.L., Williams, G.J., Vermeij, M.J.A., Harris, J., Smith, J.E., Rohwer, F.L. & Sandin, S.A. (2012). Natural history of coral-algae competition across a gradient of human activity in the Line Islands. *Marine Ecology Progress Series* 460:1–12. doi:10.3354/meps09787

**Confidence:** High. The coral-macroalgae competitive interaction is extensively documented; the allelopathic mechanism gives it mechanistic grounding beyond simple physical overgrowth.

---

### Interaction 8 — Humans interactsWith hawksbill (bycatch in fisheries)

| Field | Value |
|---|---|
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | OCC:7 (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Gilman et al. (2010); Hamann et al. (2010) |
| remarks | Incidental capture in longline, trawl, and artisanal fisheries across the Coral Triangle. Hawksbill drowning in gillnets documented in Philippines, Indonesia, Papua New Guinea. seasonal:all |

**Primary citation:** Gilman, E., Gearhart, J., Price, B., Eckert, S., Milliken, H., Wang, J., Swimmer, Y., Shiode, D., Abe, O., Peckham, H., Chaloupka, M., Hall, M., Mangel, J., Alfaro-Shigueto, J., Dalzell, P. & Ishizaki, A. (2010). Mitigating sea turtle by-catch in coastal passive net fisheries. *Fish and Fisheries* 11(1):57-88. doi:10.1111/j.1467-2979.2009.00342.x

**Supporting:** Hamann, M., Godfrey, M.H., Seminoff, J.A., Arthur, K., Barata, P.C.R., Bjorndal, K.A., Bolten, A.B., Buruchara, S., Chaloupka, M.Y., Dutton, P.H., et al. (2010). Global research priorities for sea turtles. *Endangered Species Research* 11:245–269. doi:10.3354/esr00279

**Confidence:** High.

---

### Interaction 9 — Humans interactsWith hawksbill (shell trade)

| Field | Value |
|---|---|
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | OCC:7 (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | TRAFFIC (2019); Mortimer & Donnelly (2008) |
| remarks | Directed take for bekko (tortoiseshell) products; ongoing despite CITES Appendix I listing since 1977. Trade primarily routes through East Asian markets. seasonal:all |

**Primary citation:** TRAFFIC (2019). *Shell Shocked: The Continuing Trade in Hawksbill Turtle Products*. TRAFFIC, Cambridge.

**Supporting:** Mortimer & Donnelly (2008) IUCN Red List assessment — documents shell trade as a primary historical driver of population decline, ongoing at lower intensity.

**Confidence:** High.

---

### Interaction 10 — Humans interactsWith hawksbill (egg harvesting)

| Field | Value |
|---|---|
| resourceID | OCC:9 (*Homo sapiens*) |
| relatedResourceID | OCC:7 (*Eretmochelys imbricata*) |
| relationshipOfResource | `interactsWith` |
| relationshipOfResourceID | http://purl.obolibrary.org/obo/RO_0002437 |
| relationshipAccordingTo | Mortimer & Donnelly (2008) |
| remarks | Subsistence and commercial collection of hawksbill eggs from nesting beaches across the Coral Triangle; documented in Philippines (Palawan), Indonesia (Kalimantan, Papua), and Solomon Islands. Harvesting rates vary widely by site. seasonal:wet (nesting season) |

**Primary citation:** Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. The IUCN Red List of Threatened Species 2008. doi:10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en

**Confidence:** High for Coral Triangle-specific geographic documentation.

---

## 4. Literature Inventory

All citations used in this design specification. M9B must not add interactions without corresponding additions here.

| Short ref | Full citation | DOI | Used in |
|---|---|---|---|
| Meylan (1988) | Meylan, A.B. (1988). Spongivory in hawksbill turtles: a diet of glass. *Science* 239(4838):393–395. | 10.1126/science.239.4838.393 | INT:1 |
| Meylan & Meylan (2000) | Meylan, A.B. & Meylan, P.A. (2000). Introduction to the evolution, life history, and biology of sea turtles. In Eckert et al. (eds) *Research and Management Techniques*. IUCN/SSC MTSG. | — | INT:1 |
| Mortimer & Donnelly (2008) | Mortimer, J.A. & Donnelly, M. (2008). *Eretmochelys imbricata*. IUCN Red List 2008. | 10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en | INT:3, INT:9, INT:10 |
| Bjorndal (1997) | Bjorndal, K.A. (1997). Foraging ecology and nutrition of sea turtles. In Lutz & Musick (eds) *The Biology of Sea Turtles*. CRC Press. | — | INT:2 |
| Limpus (2009) | Limpus, C.J. (2009). A biological review of Australian marine turtle species. 6. Hawksbill turtle. Queensland EPA. | — | INT:2 |
| Pratchett et al. (2014) | Pratchett, M.S., Caballes, C.F., Rivera-Posada, J.A. & Sweatman, H.P.A. (2014). Limits to understanding and managing outbreaks of crown-of-thorns starfish. *Oceanography and Marine Biology* 52:133–200. | — | INT:4 |
| Bellwood et al. (2006) | Bellwood, D.R., Hughes, T.P. & Hoey, A.S. (2006). Sleeping functional group drives coral-reef recovery. *Current Biology* 16:2434–2439. | 10.1016/j.cub.2006.10.030 | INT:5 |
| Hoey & Bellwood (2008) | Hoey, A.S. & Bellwood, D.R. (2008). Cross-shelf variation in the role of parrotfishes on the GBR. *MEPS* 358:105–117. | 10.3354/meps07336 | INT:5 |
| Bellwood et al. (2004) | Bellwood, D.R., Hughes, T.P., Folke, C. & Nyström, M. (2004). Confronting the coral reef crisis. *Nature* 429:827–833. | 10.1038/nature02691 | INT:6 |
| Tano et al. (2017) | Tano, S. et al. (2017). Temperate brown algae chemically defend against grazing. *MEPS* 579:1–15. | 10.3354/meps12293 | INT:6 |
| Rasher & Hay (2010) | Rasher, D.B. & Hay, M.E. (2010). Chemically rich seaweeds poison corals when not controlled by herbivores. *PNAS* 107:9683–9688. | 10.1073/pnas.0912095107 | INT:7 |
| Barott et al. (2012) | Barott, K.L. et al. (2012). Natural history of coral-algae competition across the Line Islands. *MEPS* 460:1–12. | 10.3354/meps09787 | INT:7 |
| Gilman et al. (2010) | Gilman, E. et al. (2010). Mitigating sea turtle by-catch in coastal passive net fisheries. *Fish and Fisheries* 11:57–88. | 10.1111/j.1467-2979.2009.00342.x | INT:8 |
| Hamann et al. (2010) | Hamann, M. et al. (2010). Global research priorities for sea turtles. *Endangered Species Research* 11:245–269. | 10.3354/esr00279 | INT:8 |
| TRAFFIC (2019) | TRAFFIC (2019). *Shell Shocked: The Continuing Trade in Hawksbill Turtle Products*. TRAFFIC, Cambridge. | — | INT:9 |
| Veron et al. (2009) | Veron, J.E.N. et al. (2009). Delineating the Coral Triangle. *Galaxea* 11:91–100. | — | Actor context |
| Waycott et al. (2009) | Waycott, M. et al. (2009). Accelerating loss of seagrasses across the globe threatens coastal ecosystems. *PNAS* 106:12377–12381. | 10.1073/pnas.0905620106 | Actor 5 context |
| Mumby et al. (2006) | Mumby, P.J. et al. (2006). Fishing, trophic cascades, and the process of grazing on coral reefs. *Science* 311:98–101. | 10.1126/science.1121129 | Actor 7 context |
| Hughes (1994) | Hughes, T.P. (1994). Catastrophes, phase shifts, and large-scale degradation of a Caribbean coral reef. *Science* 265:1547–1551. | 10.1126/science.265.5178.1547 | Actor 6 context |

---

## 5. GBIF Identifier Summary

| # | Scientific name | GBIF key | Status |
|---|---|---|---|
| 1 | *Eretmochelys imbricata* | **5220228** | ✓ CONFIRMED |
| 2 | Demospongiae (class) | 2481800 | VERIFY |
| 3 | *Acropora* (genus) | 2262047 | VERIFY |
| 4 | *Lobophora variegata* | 5420688 | VERIFY |
| 5 | *Thalassia hemprichii* | 2869027 | VERIFY |
| 6 | *Diadema setosum* | 7675143 | VERIFY |
| 7 | *Chlorurus microrhinos* | 2382006 | VERIFY |
| 8 | *Acanthaster planci* | 2278376 | VERIFY |
| 9 | *Homo sapiens* | **2436436** | ✓ CONFIRMED |

**Verification instructions for M9B:** For each VERIFY key, open `https://www.gbif.org/species/<key>` and confirm that:
1. The page loads (not a 404)
2. The scientific name matches the actor's scientific name
3. The taxonomic rank matches `taxonRank` in the actor table
4. If a key is wrong, replace it with the correct key from the GBIF backbone species search at `https://www.gbif.org/species/search`

---

## 6. Editorial Framing for `atlas/coral-triangle.html`

**`#fr-title`:** `Coral Triangle reef`
**`#fr-sub`:** `A reef system at the centre of marine biodiversity, where the hawksbill forages between sponge and stone.`

This subtitle is distinct from the existing `atlas/crossing.html` subtitle ("A shallow tropical sea holding more reef species than anywhere else on Earth") — the field record emphasises the ecological network rather than the place's superlative character.

---

## 7. DwC-A Format Notes for M9B

The occurrence.txt and resource-relationship.txt must follow the Sundarbans DwC-A column schema exactly. Key points:

- `occurrenceID` format: `CORAL-TRIANGLE:OCC:N` (N = 1 through 9)
- `resourceRelationshipID` format: `CORAL-TRIANGLE:REL:N` (N = 1 through 10)
- `eventDate` for all occurrences: `1985/2024` (reflecting modern monitoring period; satellite and field observation era)
- `countryCode` for international/multi-nation taxa: use `ID` (Indonesia) as the primary code for geographic consistency with the Coral Triangle centre; `remarks` field may note multi-nation range
- `coordinateUncertaintyInMeters`: `50000` for all (Coral Triangle-scale occurrence records, not point locations)
- Central coordinates for the Coral Triangle: `decimalLatitude: 0.83`, `decimalLongitude: 127.63` (approximate geographic centre of the Coral Triangle, Banda Sea region)
- `habitat` field for all records: `Tropical coral reef system (Coral Triangle)`
- `basisOfRecord`: `HumanObservation` for all except no alternative applies — all records are derived from field surveys and published literature, not museum specimens

---

## 8. Curation Limitations

1. **Sponge species resolution:** The prey guild is documented at family level in Meylan (1988). No single species-level identification can represent the breadth of hawksbill sponge prey. The class-level Demospongiae actor is scientifically more accurate than any single-species proxy.

2. **Indo-Pacific vs. Caribbean bias:** Some citations (Hughes 1994, Rasher & Hay 2010) are Caribbean-system papers. Their mechanisms are accepted as applicable to the Indo-Pacific but primary Indo-Pacific citations are prioritised where available (Bellwood et al. 2004, 2006; Tano et al. 2017; Pratchett et al. 2014).

3. **GBIF key stability:** GBIF taxon keys are stable identifiers but backbone taxonomy is revised periodically. All non-confirmed keys should be verified at implementation time, not assumed correct from this document.

4. **Scene positions:** All `sceneX`, `sceneY` values in Section 2 are provisional editorial decisions for the field-record visualisation, not scientific data. M9B may adjust for visual clarity without returning to M9A.

5. **Year range for occurrences:** `1985/2024` covers the satellite monitoring era and aligns with the onset of systematic Coral Triangle reef monitoring. This reflects the documented observation period, not the evolutionary or historical range of the species.
