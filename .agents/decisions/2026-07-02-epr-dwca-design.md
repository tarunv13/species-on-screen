# East Pacific Rise DwC-A — Research Curator design & rulings

**Date:** 2026-07-02
**Milestone:** M19
**Role:** Research Curator (AI-OS v1.0 Tier 1) + assembly
**Status:** Accepted — archive assembled and validated
**Backlog item resolved:** "EPR vents DwC-A design" (item 1)
**Prerequisite ruling:** `.agents/decisions/2026-06-27-third-cinematic-place-epr.md` (M15)

---

## 0. Scope

Design and assemble the complete Darwin Core Archive for the East Pacific Rise
vent field, delivered at `public/dwca/epr-vents/`: `occurrence.txt`,
`resource-relationship.txt`, `meta.xml`, `eml.xml`, `CREDITS.md`. Column schema
reused verbatim from the Coral Triangle reference implementation. No cinematic
surface, UI, or architecture change. The archive is **not** wired into
`public/dwca/index.json` this milestone (see §7).

The M15 ruling flagged two challenges this session had to resolve within
Research Curator evidence standards — **international-waters jurisdiction** and
**deepwater observational access** — plus the definition of **vent chemistry as
an abiotic actor**. All three are resolved below (§4, §5, §3). The M15
amendment path (fall back to Amazon várzea if these could not be met) is **not**
triggered: the EPR ecology maps cleanly onto the existing DwC-A pattern.

## 1. What makes EPR different

It is the Observatory's only **chemosynthetic** trophic web: primary production
runs on hydrogen-sulfide oxidation, not photosynthesis. There is no sunlight in
the chain. The design had to represent (a) a producer tier of bacteria — one
intracellular endosymbiont, one free-living mat — rather than plants; (b) an
abiotic chemical energy base; and (c) a human relationship that is primarily
*observational* (the ecology is known only through submersibles) with an
*emerging extractive* pressure (seabed mining), under a non-national
jurisdiction.

## 2. Occurrence model — actor inventory (9 taxa)

GBIF backbone verified per-taxon on 2026-07-02 (species-match API; all
species EXACT / ACCEPTED / conf 99).

| OCC | Taxon | Vernacular | Rank | trophicRole | fail | GBIF key |
|---|---|---|---|---|---:|---:|
| 1 | *Candidatus* Endoriftia persephone | Riftia endosymbiont | species | primary_producer | 1 | 10685420 (genus) |
| 2 | *Beggiatoa* | Sulfur bacterial mat | genus | primary_producer | 1 | 5426405 |
| 3 | *Riftia pachyptila* | Giant tubeworm (focal) | species | consumer | 2 | 2329590 |
| 4 | *Bathymodiolus thermophilus* | Vent mussel | species | consumer | 2 | 4374612 |
| 5 | *Alvinella pompejana* | Pompeii worm | species | herbivore | 2 | 2324365 |
| 6 | *Lepetodrilus elevatus* | Vent limpet | species | herbivore | 2 | 5859967 |
| 7 | *Bythograea thermydron* | Vent crab | species | predator | 3 | 5863760 |
| 8 | *Thermarces cerberus* | Pink vent fish | species | apex_predator | 4 | 2381131 |
| 9 | *Homo sapiens* | Researchers / prospective miners | species | human_community | 0 | 2436436 |

`trophicRole` values are drawn from the vocabulary already in use across
`places.config.json` (primary_producer, consumer, herbivore, predator,
apex_predator, human_community). At a vent "herbivore" denotes microbial-mat
grazers — there are no plants; this reuse keeps the field-record trophic
colouring consistent without inventing an enum value. `cascadeFailOrder` runs
from the producer base (1) to the apex fish (4); human is 0 (the existing
convention).

## 3. Ruling — the abiotic actor (vent chemistry)

Darwin Core's Occurrence core is a **taxon**-occurrence standard. Fabricating a
`scientificName` for "hydrogen sulfide" would violate taxonomic validity
(taxonomy = GBIF backbone). Ruling: vent chemistry is represented **not** as an
occurrence row but as environmental context —

- `habitat` on every occurrence ("...chemosynthetic ecosystem");
- `dynamicProperties.energySource: "hydrogen_sulfide_oxidation"` on the two
  chemoautotroph occurrences (OCC:1, OCC:2);
- `relationshipRemarks` on the endosymbiosis and grazing relationships.

This satisfies the M15 "vent chemistry as abiotic actor" requirement while
keeping the biological Occurrence core taxonomically valid.

## 4. Ruling — jurisdiction (international waters)

The 9–10°N EPR segment lies in **areas beyond national jurisdiction**: the high
seas, with the seabed constituting "the Area" under UNCLOS Part XI (International
Seabed Authority competence for mineral activity). Resolution:

- `countryCode` is **empty** — no ISO 3166-1 code represents an ABNJ record.
- `eml.xml` `geographicDescription` states the ABNJ / ISA status explicitly.
- The human interaction (REL:10) is framed through the ISA / UNCLOS regime
  rather than a national fishery or protected area.

## 5. Ruling — observational access (2,500 m depth)

The community is known only through crewed deep-submergence (DSV *Alvin*) and
ROV dives; the chemosynthetic symbiosis itself was discovered from
Alvin-collected specimens in 1979–1981. Resolution:

- `basisOfRecord = HumanObservation` for the metazoa and the human presence.
- `basisOfRecord = MaterialSample` for the two microbial taxa (identified from
  collected physical/molecular samples, not visual observation).
- REL:9 records the observational relationship itself (Homo sapiens
  *interactsWith* Riftia — deep-submergence documentation), making the evidence
  basis explicit in the interaction web.

## 6. Interaction model (10 relationships, OBO RO typed)

`interactsWith` RO_0002437 · `eats` RO_0002470 · `preysOn` RO_0002439 ·
`hasHost` RO_0002454 (chemosynthetic endosymbiosis).

| REL | From → To | Type | Source |
|---|---|---|---|
| 1 | Endoriftia → Riftia | hasHost | Cavanaugh 1981; Felbeck 1981; Robidart 2008 |
| 2 | Lepetodrilus → Beggiatoa | eats | Van Dover 2000; Bates 2005 |
| 3 | Alvinella → Beggiatoa | eats | Desbruyères 1998; Van Dover 2000 |
| 4 | Bythograea → Lepetodrilus | preysOn | Micheli 2002 |
| 5 | Bythograea → Bathymodiolus | preysOn | Micheli 2002 |
| 6 | Bythograea → Riftia | eats (plume cropping) | Micheli 2002; Sancho 2005 |
| 7 | Thermarces → Lepetodrilus | preysOn | Sancho 2005 |
| 8 | Thermarces → Bythograea | preysOn | Sancho 2005 |
| 9 | Homo sapiens → Riftia | interactsWith (observation) | Cavanaugh 1981; Lutz 1994; Van Dover 2000 |
| 10 | Homo sapiens → Bathymodiolus | interactsWith (mining/ISA) | Van Dover 2018; Boschen 2013 |

Every one of the 9 actors participates in ≥1 relationship; all `resourceID` /
`relatedResourceID` values reference existing OCC ids (validated, §8).

## 7. Deferred — atlas registration

`public/dwca/index.json` is **not** modified. `src/atlas/atlas.js` builds a
field-record chip linking to `atlas/<id>.html` for each index entry;
`atlas/epr-vents.html` does not yet exist. Registration is bundled with the EPR
atlas field-record build (backlog) so no chip points at a missing page.

## 8. Validation

- TSV: 20 columns/row (occurrence, 9 rows + header), 8 columns/row
  (resource-relationship, 10 rows + header).
- Referential integrity: all REL resource/relatedResource ids ∈ OCC:1–9.
- `dynamicProperties` cells parse as JSON.
- `meta.xml` / `eml.xml` well-formed.
- `npm run build` green.

## 9. Recommended follow-ups

1. **DOI/reference audit** (M9C-equivalent): confirm DOIs for the non-1981
   citations flagged in `CREDITS.md`.
2. **EPR atlas field record** (`atlas/epr-vents.html`) + `index.json`
   registration — completes the EPR three-surface experience.
