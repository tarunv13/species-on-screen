# Release Patch R1 — Session Log
**Date:** 2026-06-27  
**Patch:** R1 (post-M9C release blocker resolution)  
**Trigger:** Independent Release Review finding two Major defects (F1, W2) blocking reference certification

---

## Scope

Two changes only. No ecological redesign. No new features. No architecture changes.

---

## R1.1 — Navigation (resolves F1)

**Finding:** `src/notes/render-narrative.js` `SURFACE_LINKS['coral-triangle']` was missing the "Interaction web →" entry pointing to `atlas/coral-triangle.html`. The notes page could reach the research companion and cinematic place, but not the DwC-A interaction web field record. The three-surface flow documented in PROJECT_STATUS.md was not navigable from the notes entry point.

**Fix:** Added `{ href: '../atlas/coral-triangle.html', label: 'Interaction web →' }` as the first entry in the coral-triangle SURFACE_LINKS array, mirroring the sundarbans pattern exactly.

**Before:**
```javascript
'coral-triangle': [
  { href: '../atlas/crossing.html', label: 'Research companion →' },
  { href: '../places/crossing.html', label: 'Enter the crossing →' },
],
```

**After:**
```javascript
'coral-triangle': [
  { href: '../atlas/coral-triangle.html', label: 'Interaction web →' },
  { href: '../atlas/crossing.html', label: 'Research companion →' },
  { href: '../places/crossing.html', label: 'Enter the crossing →' },
],
```

**Dead-link verification:** All three target files confirmed present:
- `atlas/coral-triangle.html` ✓
- `atlas/crossing.html` ✓
- `places/crossing.html` ✓

---

## R1.2 — Provenance (resolves W2)

**Finding:** REL:7 remarks in `resource-relationship.txt` invoke "Hughes et al. (2007)" as evidence for Indo-Pacific applicability of the Lobophora phase-shift mechanism. This citation was absent from `CREDITS.md`. The dataset's provenance record was incomplete.

**Fix:** Added Hughes et al. (2007) to the interaction literature section of CREDITS.md, placed after Hughes (1994) to group author entries.

**Entry added:**
```
- Hughes, T.P. et al. (2007). Phase shifts, herbivory, and the resilience of coral reefs to climate change. *Current Biology* 17(5):360–365. doi:10.1016/j.cub.2006.12.049
```

**DOI status:** Confirmed valid in M9C session (CrossRef, 2026-06-27).

**Citation coverage audit (post-R1):** Every author-year citation appearing in `resource-relationship.txt` (in `relationshipAccordingTo` fields and `relationshipRemarks` text) is now documented in CREDITS.md. All 19 distinct publications covered.

---

## Validation

- `npm run build` → ✓ green, 77 modules, no new warnings
- `check-narratives` → ok (12 narratives, all invariants pass)
- Navigation links: three coral-triangle SURFACE_LINKS entries verified; all target pages confirmed present
- CREDITS.md citation coverage: complete

---

## Files changed

| File | Change |
|------|--------|
| `src/notes/render-narrative.js` | +1 line: "Interaction web →" entry in SURFACE_LINKS |
| `public/dwca/coral-triangle/CREDITS.md` | +1 line: Hughes et al. (2007) citation |
| `PROJECT_STATUS.md` | R1 and M9C added to completed milestones; backlog item 4 removed |
| `.agents/sessions/2026-06-27-r1-release-patch.md` | This file |
