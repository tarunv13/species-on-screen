# M13 Session Diary — Hudson River tomcod Track A verification
**Date:** 2026-06-27  
**Baseline:** `observatory-v1.0` / `e61e898`  
**Commit:** `f2710cc`  
**Role:** Research Curator (Track A narrative promotion)

---

## Session protocol

| Check | Result |
|---|---|
| AI-OS.md | Read |
| PROJECT_STATUS.md | Read; backlog item 1 = remaining draft elevations (hudson tomcod, amazon várzea arapaima) |
| `git status` | Clean at `2c7a060` |
| `git log --oneline -5` | Head confirmed |
| Research Curator invocation criteria | Met: EcologicalNarrative promoted beyond draft |

---

## Year 1989 — source assessment

The session instruction required a genuine literature search before defaulting to [2006, 2011].

**Wirgin 1989 paper:** Wirgin, I., Currie, D., Garte, S.J. (1989). "Activation of the K-ras oncogene in liver tumors of Hudson River tomcod." *Carcinogenesis* 10(11):2311–2315. doi:10.1093/carcin/10.11.2311. — This paper documents oncogene activation in contaminant-induced tumours. It is about carcinogenesis, not the AHR2/PCB-resistance phenotype. It does not support the observation as written.

**Pre-2006 AHR pathway work:** Papers by Courtenay et al. (1999) and Roy et al. (2001) documented CYP1A induction differences between Hudson tomcod and reference populations, indicating AHR pathway divergence. However, these papers do not establish the specific six-base-pair AHR2 deletion or quantify PCB binding-affinity reduction — the specific claims in the observation summary.

**Conclusion:** No peer-reviewed source before Yuan 2006 supports the stated observation. Year corrected to [2006, 2011].

---

## Research Curator Track A — Full Checklist

| # | Criterion | Verdict | Detail |
|---|---|---|---|
| 1 | Summary supportability | PASS | "AHR2 deletion...near-fixation" → Wirgin 2011; "rare in...Atlantic seaboard" → Yuan 2006; "fifty years of sustained industrial discharge" → EPA 2019 (discharge 1947–1977 documented) |
| 2 | Year range accuracy | **CORRECTED** | `[1989, 2011]` → `[2006, 2011]`; Wirgin 1989 is K-ras/tumour biology, not AHR2 resistance; Yuan 2006 EHP is earliest source for the PCB-resistance claim |
| 3 | Taxonomy currency | PASS | Gadidae / Gadiformes / Actinopterygii — GBIF backbone correct for *Microgadus tomcod* |
| 4 | IUCN currency | PASS | `least_concern` — current IUCN status |
| 5 | Place precision | PASS | 41.50°N 73.96°W — Hudson River near Hyde Park/Poughkeepsie, NY; within tidal estuary study zone; named river, not country centroid |
| 6 | Body consistency | PASS | Body cites Wirgin 2011 Science explicitly; GE discharge 1947–1977 documented; EPA remediation 2009 noted; no 1989 claim present in the body text |
| 7 | Fragment quality | PASS | "the receptor changed before the river did" — 7 words, no proper nouns, no conservation register, self-standing |
| 8 | Source independence | PASS | Wirgin 2011 (Science, molecular genetics); Yuan 2006 (EHP, population genetics, different primary authors); EPA 2019 (regulatory field report, fully independent) |
| 9 | Status field | PASS | `draft` → `verified` |
| 10 | editorialPlaceLine | PASS | "A river whose chemistry was rewritten in living memory." — 9 words; factual; place not journey |

**Curator verdict: PROMOTED**

---

## Corrections applied

1. `observation.year: [1989, 2011]` → `[2006, 2011]` — 1989 traces to a different biological claim (K-ras oncogene in tomcod tumours); Yuan et al. (2006) is the earliest source for AHR2/PCB resistance.
2. `metadata.updated: '2026-05-25'` → `'2026-06-27'`
3. `metadata.status: 'draft'` → `'verified'`
4. `notes/index.html` — added Hudson River tomcod entry to Verified section, alphabetically between East Pacific Rise tubeworm and Pando aspen.

---

## Files changed

| File | Change |
|---|---|
| `cinematic-language/narratives/hudson-river-tomcod-pcb-resistance.ts` | year range + status → verified + updated date |
| `notes/index.html` | +1 li entry in Verified section; footer updated to M13 |

---

## Validation

- `npm run check-narratives` → `ok (13 narratives, all invariants pass)`
- `npm run build` → ✓ built in 424ms
- `git diff --stat HEAD` (pre-commit): exactly 2 files, 14 insertions / 4 deletions
- `git status` post-commit → clean

---

## Repository state post-M13

- 13 narratives total
- **12 verified** (was 11): added hudson-river-tomcod-pcb-resistance
- 4 in_review: atacama-tamarugo, delaware-bay-horseshoe-crab, santa-barbara-channel-giant-kelp, sendai-carrion-crow (unchanged)
- **1 draft**: amazon-varzea-arapaima-flood-pulse

---

## Remaining draft note

`amazon-varzea-arapaima-flood-pulse`: peer-reviewed sources (Castello 2008, Castello et al. 2009) currently lack DOIs. Promotion should wait until DOIs are confirmed. Wirgin/Amazon-Varzea issue is different from the Hoey & Bellwood (2008) situation in M9C — the papers are real and traceable, but DOIs should be verified before the narrative is elevated.
