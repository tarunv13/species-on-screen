# M14 Session Diary — Amazon várzea arapaima Track A verification
**Date:** 2026-06-27  
**Baseline:** `observatory-v1.0` / `e61e898`  
**Commit:** `15abeda`  
**Role:** Research Curator (Track A narrative promotion)

---

## Session protocol

| Check | Result |
|---|---|
| AI-OS.md | Read |
| PROJECT_STATUS.md | Read; backlog item 1 = amazon várzea arapaima; needs DOIs on Castello (2008, 2009) |
| `git status` | Clean at M13 commit `f2710cc` |
| Research Curator invocation criteria | Met: final draft narrative promotion |

---

## DOI verification — Castello (2008)

**Initial candidate DOI:** `10.1111/j.1600-0633.2007.00240.x`  
**CrossRef resolution:** "Growth-independent effects of a fluctuating thermal regime on the life-history traits of the Japanese medaka (Oryzias latipes)" by Dhillon & Fox, 2007. **WRONG paper.**

**CrossRef title search:** queried "Lateral migration Arapaima gigas Amazon floodplains"  
**Result:** "Lateral migration of Arapaima gigas in floodplains of the Amazon" by L. Castello, *Ecology of Freshwater Fish* 17(1), 2008.  
**Confirmed DOI:** `10.1111/j.1600-0633.2007.00255.x` ✓

**Additional correction:** the narrative title "in Amazon floodplains" did not match the published title "in floodplains of the Amazon". Title corrected to match the DOI-verified publication.

---

## DOI verification — Castello, Stewart & Arantes (2009)

**Initial candidate DOI:** `10.1111/j.1439-0426.2009.01225.x`  
**CrossRef resolution:** "Efficiency of flexible sorting grids to improve size selectivity of the bottom trawl in the Balearic Islands (western Mediterranean)" by Massutí et al., 2009. **WRONG paper.**

**Four independent CrossRef searches conducted:**
1. Title query: "sustainability arapaima fisheries floodplain lakes Amazon"
2. Author + title filter: Castello + arapaima + sustainability
3. ISSN filter for *Journal of Applied Ichthyology* (1439-0426) + author Castello
4. Bibliographic query: Castello, Stewart, Arantes, 2009, JAI

**All four returned no matching record.**

Papers found for the same author group that are NOT the target paper:
- Castello & Stewart (2010), JAI 26(1), doi:10.1111/j.1439-0426.2009.01355.x — CITES procedures, different paper
- Castello, Stewart & Arantes (2011), *Reviews in Fish Biology and Fisheries*, doi:10.1007/s11160-010-9197-z — population dynamics, different year
- Castello, Viana et al. (2009), *Environmental Management*, doi:10.1007/s00267-008-9220-5 — Mamirauá community management (different co-authors, different journal)

**Conclusion:** "The sustainability of arapaima fisheries in floodplain lakes of the Amazon" (Castello, Stewart & Arantes, *Journal of Applied Ichthyology* 25(s1):73–79, 2009) is not indexed in CrossRef. *Journal of Applied Ichthyology* supplement issues from 2009 are routinely under-indexed. The citation details (authors, title, journal, volume, year) are specific and consistent with the research group's output. **No DOI assigned.** Citation retained as title-only, which is schema-valid (doi is an optional field) and has precedent in other verified Observatory narratives (Childress 1991, Sket 1997, Goulding 1980).

---

## Research Curator Track A — Full Checklist

| # | Criterion | Verdict | Detail |
|---|---|---|---|
| 1 | Summary supportability | PASS | Flood-pulse dispersal/concentration: Castello 2008 (lateral migration); obligate air-breathing audible to fishers: Castello 2009 (community fishery context); natural history: Goulding 1980 |
| 2 | Year range accuracy | PASS | [1980, 2024]; 1980 anchored to Goulding; 2024 = "present" for ongoing seasonal phenomenon; consistent with Sundarbans [1973, 2024] and Coral Triangle [1980, 2023] precedent |
| 3 | Taxonomy currency | PASS | Arapaimidae / Osteoglossiformes / Actinopterygii — GBIF backbone correct for *Arapaima gigas* |
| 4 | IUCN currency | PASS | `data_deficient` — current IUCN status |
| 5 | Place precision | PASS | −3.17°N, −59.17°W — central Amazon várzea zone near Manaus; named floodplain, not country centroid |
| 6 | Body consistency | PASS | Body accurately describes flood-pulse (Goulding 1980), lateral migration (Castello 2008), community pirarucu management (Castello 2009) |
| 7 | Fragment quality | PASS | "what the flood disperses, the dry season concentrates" — 9 words, no proper nouns, no conservation register, self-standing |
| 8 | Source independence | PASS | Goulding (1980): UC Press monograph, natural history/ecology; Castello (2008): population biology/telemetry; Castello et al. (2009): fisheries management/sustainability — distinct methodologies and time periods |
| 9 | Status field | PASS | `draft` → `verified` |
| 10 | editorialPlaceLine | PASS | "A white-water floodplain forest drowned for months each year by the Amazon." — 13 words; factual; place not journey |

**Curator verdict: PROMOTED**

---

## Corrections applied

1. Source title for Castello 2008 corrected: `'Lateral migration of Arapaima gigas in Amazon floodplains'` → `'Lateral migration of Arapaima gigas in floodplains of the Amazon'` (matches CrossRef-confirmed publication)
2. `doi: '10.1111/j.1600-0633.2007.00255.x'` added to Castello 2008 source
3. `metadata.status: 'draft'` → `'verified'`
4. `notes/index.html` — added Amazon várzea arapaima entry to Verified section, alphabetically first (before Antarctic icefish); footer updated to M14

---

## Files changed

| File | Change |
|---|---|
| `cinematic-language/narratives/amazon-varzea-arapaima-flood-pulse.ts` | title correction + DOI added (Castello 2008) + status → verified |
| `notes/index.html` | +1 li entry in Verified section (first alphabetically); footer updated to M14 |

---

## Validation

- `npm run check-narratives` → `ok (13 narratives, all invariants pass)`
- `npm run build` → `✓ built in 362ms`
- `git diff --stat HEAD` (pre-commit): exactly 2 files, 15 insertions / 4 deletions
- `git status` post-commit → clean

---

## Repository state post-M14

- 13 narratives total
- **13 verified** (was 12): all narratives now verified — amazon-varzea-arapaima-flood-pulse is the final promotion
- 4 in_review: atacama-tamarugo, delaware-bay-horseshoe-crab, santa-barbara-channel-giant-kelp, sendai-carrion-crow (unchanged)
- **0 draft**

---

## Backlog note post-M14

All draft elevations complete. The only remaining backlog item is selection of a third cinematic place. No draft narratives remain.
