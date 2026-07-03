# East Pacific Rise field record — credits & provenance

Assembled under M19 Research Curator protocol on 2026-07-02.
Ecological design: `.agents/decisions/2026-07-02-epr-dwca-design.md`.
Selection ruling: `.agents/decisions/2026-06-27-third-cinematic-place-epr.md`.
Research surface (verified narrative): `notes/east-pacific-rise-tubeworm-chemosynthesis.html`.

This is an **attested, illustrative** interaction dataset — a representative
reconstruction of the East Pacific Rise 9°50′N vent community from the cited
literature, following the Coral Triangle precedent. It is not a download of
primary occurrence records: deep-sea hydrothermal-vent taxa have negligible
georeferenced GBIF occurrence coverage and no automatable GloBI interaction
records at these coordinates, so the archive is hand-assembled and every
taxon is verified individually against the GBIF backbone.

## Data

- **Taxonomy:** GBIF Backbone Taxonomy, verified per-occurrence against the
  GBIF species-match API on 2026-07-02. Keys: Riftia pachyptila **2329590**,
  Bathymodiolus thermophilus **4374612**, Alvinella pompejana **2324365**,
  Lepetodrilus elevatus **5859967**, Bythograea thermydron **5863760**,
  Thermarces cerberus **2381131**, Beggiatoa (genus) **5426405**,
  Homo sapiens **2436436**, Endoriftia (genus) **10685420**. All species-rank
  keys returned `matchType: EXACT`, `status: ACCEPTED`, confidence 99.
- **Coordinates:** representative of the East Pacific Rise 9°50′N vent field
  (~9.83°N, 104.29°W); `coordinateUncertaintyInMeters: 5000` reflects the
  spatial extent of the 9–10°N vent segment rather than a single chimney.
- **Country code:** empty (null). The East Pacific Rise 9–10°N segment lies in
  **areas beyond national jurisdiction** (the high seas; the seabed is "the
  Area" under UNCLOS Part XI, administered by the International Seabed
  Authority). No single ISO 3166-1 code correctly represents an ABNJ
  occurrence. (Coral Triangle leaves this empty for a different reason —
  multinational maritime extent.)
- **Observational evidence (`basisOfRecord`):** metazoa and the human presence
  are `HumanObservation` — the community is documented through crewed
  deep-submergence (DSV *Alvin*) and ROV dives. The two microbial taxa
  (*Candidatus* Endoriftia persephone, *Beggiatoa*) are `MaterialSample`:
  they are identified from collected physical/molecular samples, not visual
  field observation.
- **Interactions:** typed with OBO Relations Ontology terms —
  `interactsWith` (RO_0002437), `eats` (RO_0002470), `preysOn` (RO_0002439),
  and `hasHost` (RO_0002454) for the chemosynthetic endosymbiosis. Terms and
  IRIs follow the GloBI → RO mapping used across the Observatory's archives.

## The abiotic driver (vent chemistry)

The energy base of this ecosystem is abiotic: hydrogen-sulfide- and
CO₂-laden vent fluid heated against the magma chamber. Darwin Core's
Occurrence core is a **taxon**-occurrence standard, so vent chemistry is not
recorded as a fake taxon occurrence (that would corrupt taxonomic validity).
Instead it is captured as: the `habitat` string on every occurrence; a
`dynamicProperties.energySource: "hydrogen_sulfide_oxidation"` flag on the two
chemoautotroph occurrences (OCC:1, OCC:2); and the `relationshipRemarks` of
the endosymbiosis and grazing relationships (REL:1–REL:3). This satisfies the
M15 decision's "vent chemistry as abiotic actor" requirement without breaking
the biological Occurrence core.

## Interaction literature

- Cavanaugh, C.M., Gardiner, S.L., Jones, M.L., Jannasch, H.W. & Waterbury, J.B. (1981). Prokaryotic cells in the hydrothermal vent tube worm *Riftia pachyptila*. *Science* 213:340–342. doi:10.1126/science.213.4505.340
- Felbeck, H. (1981). Chemoautotrophic potential of the hydrothermal vent tube worm *Riftia pachyptila*. *Science* 213:336–338. doi:10.1126/science.213.4505.336
- Childress, J.J., Fisher, C.R., Favuzzi, J.A. & Sanders, N.K. (1991). Sulfide and CO₂ uptake by *Riftia pachyptila* and its bacterial symbionts. *Physiological Zoology* 64:1444–1484.
- Robidart, J.C., Bench, S.R., Feldman, R.A., Novoradovsky, A., Podell, S.B., Gaasterland, T., Allen, E.E. & Felbeck, H. (2008). Metabolic versatility of the *Riftia pachyptila* endosymbiont revealed through metagenomics. *Environmental Microbiology* 10(3):727–737. doi:10.1111/j.1462-2920.2007.01496.x. (Title corrected during the 2026-07-03 audit — the archive previously paraphrased it as "...endosymbiont, *Candidatus* Endoriftia persephone".)
- Lutz, R.A., Shank, T.M., Fornari, D.J., Haymon, R.M., Lilley, M.D., Von Damm, K.L. & Desbruyères, D. (1994). Rapid growth at deep-sea vents. *Nature* 371:663–664. doi:10.1038/371663a0
- Desbruyères, D., Chevaldonné, P., Alayse, A.-M., Jollivet, D., Lallier, F.H., Jouin-Toulmond, C., Zal, F., Sarradin, P.-M., Cosson, R., Caprais, J.-C., Arndt, C., O'Brien, J., Guezennec, J., Hourdez, S., Riso, R., Gaill, F., Laubier, L. & Toulmond, A. (1998). Biology and ecology of the "Pompeii worm" (*Alvinella pompejana* Desbruyères and Laubier), a normal dweller of an extreme deep-sea environment: a synthesis of current knowledge and recent developments. *Deep-Sea Research II* 45(1–3):383–422. doi:10.1016/S0967-0645(97)00083-0
- Micheli, F., Peterson, C.H., Mullineaux, L.S., Fisher, C.R., Mills, S.W., Sancho, G., Johnson, G.A. & Lenihan, H.S. (2002). Predation structures communities at deep-sea hydrothermal vents. *Ecological Monographs* 72(3):365–382. doi:10.1890/0012-9615(2002)072[0365:PSCADS]2.0.CO;2
- Sancho, G., Fisher, C.R., Mills, S., Micheli, F., Johnson, G.A., Lenihan, H.S., Peterson, C.H. & Mullineaux, L.S. (2005). Selective predation by the zoarcid fish *Thermarces cerberus* at hydrothermal vents. *Deep-Sea Research I* 52(5):837–844. doi:10.1016/j.dsr.2004.12.002
- Bates, A.E. et al. (2005). Grazing and microhabitat of the vent limpet *Lepetodrilus*. [DOI still unresolved after a second, deeper audit (2026-07-04) — deliberately not guessed. Two named candidates were re-checked by resolving each DOI directly against CrossRef: (1) Bates, Tunnicliffe & Lee (2005), *Marine Ecology Progress Series* 305:1–15, doi:10.3354/meps305001, "Role of thermal conditions in habitat selection by hydrothermal vent gastropods" — matches the cited year and the multi-author "et al.", and its abstract does concern microhabitat (thermal-zone partitioning of vent gastropods including *Lepetodrilus fucensis*), but does not address grazing/diet. (2) Bates (2007), *Marine Ecology Progress Series* 347:87–99, doi:10.3354/meps07020, "Feeding strategy, morphological specialisation and presence of bacterial episymbionts in lepetodrilid gastropods from hydrothermal vents" — matches the grazing/feeding-strategy theme, but is sole-authored (no "et al.") and dated 2007, two years off. Neither cleanly fits both the byline and the subject. A third lead surfaced this audit: A.E. Bates's 2006 University of Victoria PhD dissertation, "Population and feeding characteristics of hydrothermal vent gastropods along environmental gradients with a focus on a bacterial symbiosis hosted by *Lepetodrilus fucensis*" — spanning both the feeding/grazing and environmental-gradient/microhabitat themes at once — raising the possibility this citation informally synthesizes Bates's PhD-era research program rather than naming one indexed paper; no persistent identifier for the thesis itself was found, and none is asserted here. Left unresolved rather than misattributed; see `PROJECT_STATUS.md` backlog item 4 for the decision a Research Curator still needs to make.]
- Van Dover, C.L. (2000). *The Ecology of Deep-Sea Hydrothermal Vents*. Princeton University Press. (Community trophic synthesis; a book — no DOI expected.)
- Van Dover, C.L., Arnaud-Haond, S., Gianni, M., Helmreich, S., Huber, J.A., Jaeckel, A.L., Metaxas, A., Pendleton, L.H., Petersen, S., Ramirez-Llodra, E., Steinberg, P.E., Tunnicliffe, V. & Yamamoto, H. (2018). Scientific rationale and international obligations for protection of active hydrothermal vent ecosystems from deep-sea mining. *Marine Policy* 90:20–28. doi:10.1016/j.marpol.2018.01.020
- Boschen, R.E., Rowden, A.A., Clark, M.R. & Gardner, J.P.A. (2013). Mining of deep-sea seafloor massive sulfides: a review of the deposits, their benthic communities, impacts from mining, regulatory frameworks and management strategies. *Ocean & Coastal Management* 84:54–67. doi:10.1016/j.ocecoaman.2013.07.005

DOI status: **M9C-equivalent audit complete (2026-07-03; re-examined
2026-07-04)** — closes backlog item 1. 9 of 11 citations are now DOI-anchored:
the two 1981 *Science* papers (carried from the verified narrative record)
plus 7 confirmed during the first audit pass (Lutz 1994, Desbruyères 1998,
Micheli 2002, Sancho 2005, Van Dover 2018, Boschen 2013, and Robidart 2008 —
whose title was also corrected to match the publication, the same class of
fix M9C/M11/M13 made elsewhere in the Observatory). Every DOI above was
independently confirmed against CrossRef's own record
(`api.crossref.org/works/<doi>`), not taken from a single search result. Two
citations remain without a DOI, both for a documented reason rather than an
unfinished audit: Van Dover (2000) is a book (no DOI expected), and Bates et
al. (2005) remains a genuine ambiguity after a second, deeper look — now
between *three* candidates (two named papers plus a PhD dissertation), none
of which cleanly matches both the cited byline and the cited subject —
recorded above rather than guessed — consistent with the Observatory's
assemble-then-audit discipline: **a wrong DOI is worse than a citation
string.**

## Taxonomic notes

- ***Candidatus* Endoriftia persephone**: the validly-described *Candidatus*
  name of the *Riftia* endosymbiont (Robidart et al. 2008) is not present in
  the GBIF backbone, which carries the genus *Endoriftia* (key 10685420,
  Bacteria / Proteobacteria / Gammaproteobacteria / Chromatiales /
  Sedimenticolaceae). The occurrence records the species-rank name and anchors
  `gbifTaxonKey` to the accepted genus, with the note stated in
  `associatedReferences`.
- **Alvinella pompejana** (2324365): the GBIF backbone assigns no `order` rank
  for family Alvinellidae as of 2026-07-02; `order` is left empty to match the
  backbone rather than fabricated.
- **Thermarces cerberus** (2381131): the GBIF backbone assigns no `class` rank
  for this taxon as of 2026-07-02 (hierarchy: Animalia → Chordata → Perciformes
  → Zoarcidae); `class` is left empty to match the backbone. The backbone
  places Zoarcidae in Perciformes.
- **Beggiatoa** (5426405): recorded at genus rank; represents the free-living
  sulfur-oxidising bacterial mat grazed by the limpet and Pompeii worm, distinct
  from the intracellular *Endoriftia* endosymbiont.
- **seasonalPresence**: EPR at 2,500 m is aphotic and aseasonal; there is no
  surface photoperiod signal at depth. All occurrences carry
  `seasonalPresence {wet:1.0, dry:1.0}` (constant) and all relationships are
  `seasonal:all`. The schema keys are retained for cross-place consistency.

## Atlas wiring (deferred)

This archive is **not** registered in `public/dwca/index.json` in this
milestone. The atlas overview builds a field-record chip linking to
`atlas/<id>.html` for every index entry, and `atlas/epr-vents.html` does not
yet exist. Registering the archive is bundled with building the EPR atlas
field record (a separate backlog item) so the discovery chip never points at a
missing page.

## Sound

Procedural biome bed generated in the browser; openly-licensed field
recordings credited here as added.
