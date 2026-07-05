# M11 Session Diary — Dinaric olm Track A verification
**Date:** 2026-06-27  
**Baseline:** `observatory-v1.0` / `e61e898`  
**Commit:** `c25fd30`  
**Role:** Research Curator (Track A narrative promotion)

---

## Session protocol

| Check | Result |
|---|---|
| AI-OS.md | Read from `.agents/AI-OS.md` |
| PROJECT_STATUS.md | Read; backlog item 1 = draft elevations |
| `git status` | Clean |
| `git log --oneline -10` | `3009ae3` is HEAD |
| Research Curator invocation criteria | Met: EcologicalNarrative promoted beyond draft |

---

## Draft narrative audit

All four draft narratives read and ranked by Track A readiness:

| Rank | Narrative | Key issue |
|---|---|---|
| 1 | **dinaric-olm-century-lifespan** | `order: 'Urodela'` → `'Caudata'`; all other criteria pass |
| 2 | hudson-river-tomcod-pcb-resistance | Year start 1989 not directly traced to listed sources |
| 3 | east-pacific-rise-tubeworm-chemosynthesis | Year end 2011 has no 2011 source (latest source 1991) |
| 4 | amazon-varzea-arapaima-flood-pulse | Created M10 (same day); no DOIs on peer-reviewed sources |

**Selected:** `dinaric-olm-century-lifespan` — fewest corrections, best-anchored sources.

---

## Research Curator Track A — Full Checklist

| # | Criterion | Verdict | Detail |
|---|---|---|---|
| 1 | Summary supportability | PASS | Voituron et al. (2011) reports 68.5 yr mean life expectancy and >100 yr modelled maximum for captive Pyrenees colony |
| 2 | Year range accuracy | PASS | 1958: Moulis (Ariège) cave lab colony established; 2010: data cutoff for Voituron paper submitted 2010, published 2011 |
| 3 | Taxonomy currency | **CORRECTED** | `order: 'Urodela'` → `'Caudata'`; GBIF backbone and CoL both use Caudata as accepted order name |
| 4 | IUCN currency | PASS | *Proteus anguinus* = Vulnerable; last assessed 2009, reconfirmed 2022 |
| 5 | Place precision | PASS | Postojna karst, Slovenia; coordinates 45.7833°N 14.2039°E are the cave system, not a country centroid |
| 6 | Body consistency | PASS | Pyrenees lab, 50+ yr study, survival curve → ~70 yr mean, cave guide cultural history; all traceable to sources |
| 7 | Fragment quality | PASS | "a vertebrate kept at the speed of stone" — 8 words, no proper nouns, no conservation register, self-standing |
| 8 | Source independence | PASS | Voituron 2011 (population biology/survival analysis), Sket 1997 (biogeography), oral account (contextual/cultural) |
| 9 | metadata.status | PASS | Set from `draft` → `verified` |
| 10 | editorialPlaceLine | PASS | "A river that runs in the dark, in a country of limestone." — 13 words; factual; place not journey |

**Curator verdict: PROMOTED**

---

## Corrections applied

1. `taxonomy.order: 'Urodela'` → `'Caudata'` — GBIF backbone uses Caudata (Catalogue of Life precedent); Urodela is a synonym retained in some older literature but not the GBIF accepted name.
2. `metadata.updated: '2026-05-25'` → `'2026-06-27'`
3. `metadata.status: 'draft'` → `'verified'`
4. `notes/index.html` — added Dinaric olm entry to Verified section, alphabetically after Coral Triangle hawksbill

---

## Files changed

| File | Change |
|---|---|
| `cinematic-language/narratives/dinaric-olm-century-lifespan.ts` | order correction + status → verified + updated date |
| `notes/index.html` | +1 li entry in Verified section |

---

## Validation

- `npm run check-narratives` → `ok (13 narratives, all invariants pass)`
- `npm run build` → ✓ built in 358ms
- Git diff: exactly 2 files, 13 insertions / 3 deletions
- `git status` post-commit → clean

---

## Repository state post-M11

- 13 narratives total
- **10 verified** (was 9): added dinaric-olm-century-lifespan
- 4 in_review: atacama-tamarugo, delaware-bay-horseshoe-crab, santa-barbara-channel-giant-kelp, sendai-carrion-crow (unchanged)
- **3 draft**: amazon-varzea-arapaima-flood-pulse, east-pacific-rise-tubeworm-chemosynthesis, hudson-river-tomcod-pcb-resistance

---

## Remaining draft elevation notes

| Narrative | Next blocker to resolve |
|---|---|
| east-pacific-rise-tubeworm-chemosynthesis | Year end 2011: no 2011 source listed; should be [1981, 1991] or add a 2011 source |
| hudson-river-tomcod-pcb-resistance | Year start 1989: earliest listed source is 2006; Wirgin 1989 precursor study should be cited or year adjusted |
| amazon-varzea-arapaima-flood-pulse | Peer-reviewed sources (Castello 2008, 2009) need DOIs before promotion |
