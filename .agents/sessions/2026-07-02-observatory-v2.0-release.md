# Release preparation & blocker remediation — Observatory v2.0

**Date:** 2026-07-02
**Role:** Independent Release Reviewer → Release preparation
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**Feature-complete commit:** `361d8cb`
**Result:** PASS WITH WARNINGS · **0 release blockers** · no code changed this pass

---

## 1. Session protocol

- `git status`: clean working tree.
- `git log`: HEAD `361d8cb` (M20), unchanged since the Independent Release Review.
- `npm run build`: green (`check-narratives` passes via prebuild).

## 2. Blocker-remediation outcome

The latest Independent Release Review returned **PASS WITH WARNINGS** with a
**release-blocker list of NONE**. The directive for this pass was to implement
only release blockers and not to fix warnings. There were therefore **no code
changes**: nothing qualifies as a blocker, and every open item is a Major/Minor
warning that is deliberately left untouched per the constraint. No architecture,
refactor, or feature change was made.

## 3. What Observatory v2.0 delivers (since v1.0 at `e61e898` / R1)

The **East Pacific Rise release** — the third cinematic place brought to full
three-surface parity, plus one Observatory-wide correctness fix.

| Milestone | Delivery |
|---|---|
| M15 | Chief Architect ruling: East Pacific Rise selected as the third cinematic place. |
| M16 | EPR cinematic surface — `places/epr-vents.html` (Canvas 2D scroll descent to the vent field). |
| M17 | EPR cinematic UX corrections (warmth-beat alignment, Article XVII compositing, depth gradient). |
| M18 | Observatory cinematic coherence review; Principle XVII fix across all three cinematic surfaces (render loops pause on tab-hidden + ~400 ms resumption Hold). |
| M19 | EPR Darwin Core Archive — `public/dwca/epr-vents/` (9 occurrences, 10 OBO-RO-typed interactions; the Observatory's only chemosynthetic web). |
| M20 | EPR atlas surface — `atlas/epr-vents.html`, registered in `public/dwca/index.json`; Cinematic↔Atlas↔Research navigation wired. |

## 4. Product inventory at v2.0

- **Cinematic (3):** `places/sundarbans.html`, `places/crossing.html`, `places/epr-vents.html`.
- **Atlas (6):** `atlas/index.html`, `sundarbans`, `amazon-varzea`, `crossing`, `coral-triangle`, `epr-vents`.
- **Research:** 13 narratives, **13/13 `verified`**, full `notes/` archive.
- **Data:** 4 Darwin Core archives (sundarbans, amazon-varzea, coral-triangle, epr-vents), consistent with `public/dwca/index.json`.
- Build green; working tree clean; no broken cross-surface links (all hrefs verified against the filesystem in the release review).

## 5. Independent Release Review verdict

**PASS WITH WARNINGS.**

- **Release blockers:** none.
- **Major warnings (not fixed this pass):** EPR cinematic surface is not reachable from the homepage (planetary entry) — a tracked, intentional deferral (backlog: "EPR homepage nav"); EPR remains reachable via Research and Atlas.
- **Minor warnings (not fixed this pass):** homepage→Research/Atlas has no direct JS-on path (intentional two-surface architecture); EPR atlas uses the generic `default` biome backdrop; EPR DwC-A interaction DOIs unverified (audit pending); release commits unpushed / not merged to `main`; standard >500 kB bundle warning (`three.module`).

None of the warnings is a broken link or a build failure; all are documented in `PROJECT_STATUS.md` backlog.

## 6. Recommended Git tag

Tag the release-preparation commit (the docs commit that lands this summary) as:

```
git tag -a observatory-v2.0 -m "Observatory v2.0 — East Pacific Rise release (third cinematic place, full three-surface parity; Principle XVII fix)"
```

Recommended, **not applied** in this pass (release preparation stops before the
tag/merge/push acts). `observatory-v1.0` remains at `e61e898`.

## 7. Post-release note

Per instruction, no new milestone is begun. When release work resumes, the
highest-value first item is the sole Major warning — **EPR homepage nav**
(add EPR to the planetary entry) — which would close the last product-completeness
gap for the three-place set.
