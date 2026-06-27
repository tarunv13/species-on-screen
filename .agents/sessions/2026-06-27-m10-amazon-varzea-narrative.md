# M10 Session Diary — Amazon várzea narrative
**Date:** 2026-06-27  
**Baseline:** `observatory-v1.0` tagged at `e61e898`  
**Commit:** `5da7d9f`

---

## Session protocol verification

| Check | Result |
|---|---|
| `git status` | clean |
| `git log --oneline -5` | e61e898 is HEAD |
| `observatory-v1.0` tag | confirmed |
| AI-OS.md | read from `.agents/AI-OS.md` |
| PROJECT_STATUS.md | read; backlog item 1 is Amazon várzea narrative |

---

## Milestone selected

**Amazon várzea narrative** — highest-value executable item. DwC-A was a complete orphan: 8 actors, 8 interactions, atlas page, and index entry all existed, but no narrative `.ts` file and no notes shell. Creating the narrative activates the full 3-surface experience at zero infrastructure cost.

---

## Repository audit (pre-implementation)

| Asset | State |
|---|---|
| `public/dwca/amazon-varzea/occurrence.txt` | ✓ 8 actors |
| `public/dwca/amazon-varzea/resource-relationship.txt` | ✓ 8 interactions |
| `public/dwca/amazon-varzea/meta.xml` | ✓ |
| `public/dwca/amazon-varzea/eml.xml` | ✓ |
| `public/dwca/amazon-varzea/CREDITS.md` | ✓ |
| `public/dwca/index.json` amazon-varzea entry | ✓ |
| `atlas/amazon-varzea.html` | ✓ |
| Narrative `.ts` | ✗ missing |
| Notes `.html` shell | ✗ missing |
| `render-narrative.js` SURFACE_LINKS | ✗ missing |
| `atlas.js` species card block | ✗ missing |
| `field-record.js` nav branch | not needed (no cinematic place) |

---

## Design Agent gate

Not fired. No novel visual decision. Amazon várzea is research-surface only; atlas card follows the established sundarbans/coral-triangle pattern.

---

## Research Curator invocation

Not invoked. Narrative created at `status: 'draft'`; Research Curator fires on promotion beyond draft (Track A verification), not on creation.

---

## Implementation

### Focal species selection

Arapaima gigas (OCC:4 in DwC-A). Rationale: the most ecologically legible phenomenon in the várzea is the flood-pulse concentration — arapaima's obligate air-breathing both enables survival in hypoxic dry-season lakes and betrays their position to Ribeirinho fishers. This is the narrative paradox that makes the várzea story distinctive. Three direct literature sources already in CREDITS.md cover it (Goulding 1980, Castello 2008, Castello et al. 2009).

### Narrative record

**id:** `amazon-varzea-arapaima-flood-pulse`  
**place.id:** `amazon-varzea`  
**species:** *Arapaima gigas* (IUCN: data_deficient)  
**observation.type:** `seasonal_pattern`  
**observation.year:** [1980, 2024]  
**fragment:** "what the flood disperses, the dry season concentrates" (9 words; no proper nouns; no conservation register; self-standing)  
**editorialPlaceLine:** "A white-water floodplain forest drowned for months each year by the Amazon." (13 words)  
**status:** `draft`

### Sources

| # | Kind | Citation |
|---|---|---|
| 1 | field_report | Goulding, M. (1980). *The Fishes and the Forest*. UC Press. |
| 2 | peer_reviewed | Castello, L. (2008). Lateral migration of Arapaima gigas. *Ecology of Freshwater Fish* |
| 3 | peer_reviewed | Castello et al. (2009). Sustainability of arapaima fisheries. *Journal of Applied Ichthyology* |

All three match citations already in `public/dwca/amazon-varzea/CREDITS.md`.

### Files created

- `cinematic-language/narratives/amazon-varzea-arapaima-flood-pulse.ts`
- `notes/amazon-varzea-arapaima-flood-pulse.html`

### Files modified

- `src/notes/render-narrative.js` — added `'amazon-varzea': [{ href: '../atlas/amazon-varzea.html', label: 'Interaction web →' }]` to SURFACE_LINKS
- `src/atlas/atlas.js` — added `if (n.place.id === 'amazon-varzea')` block in `buildSpeciesCard()` linking to `atlas/amazon-varzea.html`

### Files not touched

`atlas/amazon-varzea.html` · `public/dwca/amazon-varzea/*` · `public/dwca/index.json` · `src/atlas/field-record.js` · all cinematic pages · `.kiro/steering/*`

---

## Validation

- `npm run check-narratives` → `ok (13 narratives, all invariants pass)`
- `npm run build` → ✓ built in 470ms (prebuild)
- `git status` post-commit → clean
- `atlas/amazon-varzea.html` confirmed present (SURFACE_LINKS target valid)
- `npm run build` → ✓ built in 336ms (post-commit gate)

---

## Cross-surface navigation (post-M10)

| Entry point | Reaches |
|---|---|
| `notes/amazon-varzea-arapaima-flood-pulse.html` | → `atlas/amazon-varzea.html` via "Interaction web →" |
| `atlas/index.html` species card | → `notes/amazon-varzea-arapaima-flood-pulse.html` via "Field note →" |
| `atlas/index.html` species card | → `atlas/amazon-varzea.html` via "Interaction web →" |
| `atlas/amazon-varzea.html` | → `atlas/index.html` via "← Living Atlas" (standard nav) |

No cinematic place exists for Amazon várzea; the 3-surface experience is notes ↔ atlas field record ↔ atlas index.

---

## Repository state post-M10

- 13 narratives registered (was 12)
- 9 verified, 4 draft (amazon várzea arapaima added to draft count)
- Amazon várzea DwC-A orphan resolved
- Backlog item 1 (Amazon várzea narrative) closed
