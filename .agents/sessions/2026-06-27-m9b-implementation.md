# M9B Implementation Diary — Coral Triangle Field Record
**Date:** 2026-06-27  
**Role:** Technical Lead  
**Milestone:** M9B — Coral Triangle DwC-A and field-record page  
**Design basis:** `.agents/decisions/2026-06-27-coral-triangle-design-v2.md` (M9A Revision 1, accepted)

---

## Scope

Create `public/dwca/coral-triangle/` (5 files), `atlas/coral-triangle.html`, and update `public/dwca/index.json`, `src/atlas/field-record.js`, `src/atlas/atlas.js`.

---

## Verification log

### GBIF backbone keys — all 7 design-spec estimates replaced

Design spec v1 provided GBIF key estimates for 7 of 9 actors. Every estimate was incorrect; all were replaced with verified backbone keys obtained via the GBIF species/match and species/search APIs on 2026-06-27.

| Actor | Estimated key (v1) | Reason wrong | Verified key | Method |
|---|---|---|---|---|
| Acropora (genus) | 2262047 | Resolved to Acropora synonym entry, not accepted | 7673664 | `/v1/species/match?name=Acropora&rank=GENUS` |
| Lobophora variegata | 5420688 | Resolved to plant synonym | 3200482 | `/v1/species/match` + backbone search |
| Thalassia hemprichii | 2869027 | HTTP 404 | 5329593 | `/v1/species/match?name=Thalassia+hemprichii` |
| Diadema setosum | 7675143 | Resolved to a beetle | 5721108 | `/v1/species/match?name=Diadema+setosum` |
| Chlorurus microrhinos | 2382006 | Resolved to a perch | 5211130 | `/v1/species/match?name=Chlorurus+microrhinos` |
| Acanthaster planci | 2278376 | Resolved to brittle star | 2271208 | `/v1/species/match?name=Acanthaster+planci` |
| Homo sapiens | 2481800 | Resolved to a sandpiper bird | 2436436 | `/v1/species/match?name=Homo+sapiens` |

Eretmochelys imbricata (key 5220228) and Demospongiae (key 199) were provided correctly in v2 spec and confirmed.

### Literature candidates — INT:2 and INT:5/6/7

**Hughes et al. (2007)** DOI 10.1016/j.cub.2006.12.049  
CrossRef confirmed: "Phase shifts, herbivory, and the resilience of coral reefs to climate change" — Current Biology 17(5):360–365. ADOPTED. Supports REL:7 algal-phase-shift synthesis.

**McClanahan & Shafir (1990)** DOI 10.1007/BF00317564  
CrossRef returned: Anholt (1990) "Size-biased dispersal in a damselfly" — completely different paper. DOI is invalid for this citation. DECISION: Citation retained as text reference (author, year, journal, volume) without a DOI field in resource-relationship.txt.

**Meylan (1984)** *Bulletin of Marine Science* 34(3):456–464  
Verification: Found as a monograph in the Biodiversity Heritage Library (DOI 10.5962/bhl.title.49069), not a *Bulletin of Marine Science* journal article. The volume/page numbers do not correspond to BMS content. DECISION: Not adopted for INT:2. Bjorndal (1997) and Limpus (2009) remain per v2 spec fallback.

---

## Implementation decisions

### C3 backbone discrepancy — Chlorurus microrhinos

Design spec v2 C3 correction specifies Labriformes/Labridae (following Near et al. 2012; CoL 2024; FishBase). GBIF backbone key 5211130 still shows Order Perciformes / Family Scaridae as of 2026-06-27.

**Decision:** DwC-A uses GBIF backbone values (Perciformes/Scaridae) for interoperability. Labriformes/Labridae is documented in the `associatedReferences` field of the occurrence record and in `CREDITS.md`. Backbone revision expected; DwC-A will be updated when backbone catches up.

### countryCode — left empty

The Coral Triangle spans six sovereign nations. No single ISO 3166-1 alpha-2 code correctly represents the occurrence records. countryCode field left empty (null) for all 9 actors per Darwin Core compliance.

### Acanthaster planci — backbone retained

Kamya et al. (2018) distinguish *A. cf. solaris* for the Pacific clade; backbone key 2271208 retains *A. planci*. DwC-A uses backbone value; taxonomic note in CREDITS.md.

### OCC:1 identifier — hawksbill is OCC:1

v1 design spec had both hawksbill and parrotfish labelled OCC:7 (collision). v2 spec resolved: hawksbill = OCC:1. All 10 resource relationships reference OCC:1 for hawksbill throughout.

---

## Files created / modified

| File | Action |
|---|---|
| `public/dwca/coral-triangle/occurrence.txt` | CREATED — 9 actors, verified GBIF keys |
| `public/dwca/coral-triangle/resource-relationship.txt` | CREATED — 10 interactions |
| `public/dwca/coral-triangle/meta.xml` | CREATED — identical schema to sundarbans |
| `public/dwca/coral-triangle/eml.xml` | CREATED — dataset metadata |
| `public/dwca/coral-triangle/CREDITS.md` | CREATED — literature, taxonomic notes |
| `atlas/coral-triangle.html` | CREATED — field-record page, same structure as sundarbans.html |
| `public/dwca/index.json` | UPDATED — coral-triangle entry added |
| `src/atlas/field-record.js` | UPDATED — coral-triangle nav branch in init() |
| `src/atlas/atlas.js` | UPDATED — "Interaction web →" link added to coral-triangle card |
| `.agents/decisions/2026-06-27-coral-triangle-design-v2.md` | CREATED — M9A Revision 1 ecological design |

---

## Build verification

`npm run build` — ✓ green. 77 modules transformed. `dist/atlas/coral-triangle.html` present in output.  
Pre-existing chunk-size warning (three.js, 516 kB) — not introduced by M9B.

---

## Outstanding issues (carried from M9A Revision 1 Appendix B)

These are Research Curator concerns, not Technical Lead blockers:

- **INT:1 geography:** Meylan (1988) spongivory data is Caribbean; Indo-Pacific corroboration is indirect. An Indo-Pacific primary source would strengthen OCC:1→OCC:2.
- **INT:2 citation quality:** Bjorndal (1997) is a book chapter; Limpus (2009) is grey literature. No primary journal article confirms hawksbill seagrass feeding in the Coral Triangle specifically.
- **INT:3 evidence basis:** hawksbill→Acropora (REL:3) is INFERRED HABITAT DEPENDENCY, flagged in remarks.
- **Meylan (1984):** Still unresolved — monograph in BHL does not match the journal citation format in v2 spec. Research Curator to confirm if Meylan (1988) Science supersedes this reference entirely.
- **C3 backbone:** Chlorurus microrhinos backbone revision pending upstream GBIF update.
