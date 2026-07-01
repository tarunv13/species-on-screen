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
- Robidart, J.C. et al. (2008). Metabolic versatility of the *Riftia pachyptila* endosymbiont, *Candidatus* Endoriftia persephone. *Environmental Microbiology* 10:727–737. [DOI unverified — pending an M9C-style audit]
- Lutz, R.A. et al. (1994). Rapid growth at deep-sea vents. *Nature* 371:663–664. [DOI unverified]
- Desbruyères, D. et al. (1998). Biology and ecology of the "Pompeii worm" (*Alvinella pompejana*). *Deep-Sea Research II* 45:383–422. [DOI unverified]
- Micheli, F. et al. (2002). Predation structures communities at deep-sea hydrothermal vents. *Ecological Monographs* 72:365–382. [DOI unverified]
- Sancho, G. et al. (2005). Selective predation by the zoarcid fish *Thermarces cerberus* at hydrothermal vents. *Deep-Sea Research I* 52:837–844. [DOI unverified]
- Bates, A.E. et al. (2005). Grazing and microhabitat of the vent limpet *Lepetodrilus*. [DOI unverified]
- Van Dover, C.L. (2000). *The Ecology of Deep-Sea Hydrothermal Vents*. Princeton University Press. (Community trophic synthesis.)
- Van Dover, C.L. et al. (2018). Scientific rationale and international obligations for protection of active hydrothermal vent ecosystems from deep-sea mining. *Marine Policy* 90:20–28. [DOI unverified]
- Boschen, R.E. et al. (2013). Mining of deep-sea seafloor massive sulfides: environmental impacts. *Ocean & Coastal Management* 84:54–67. [DOI unverified]

DOI status: the two 1981 *Science* papers are DOI-anchored (carried from the
verified narrative record). Remaining citations are recorded as author-year-
journal and flagged for a dedicated DOI/reference audit (the M9C-equivalent
validation step), consistent with the Observatory's assemble-then-audit
discipline.

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
