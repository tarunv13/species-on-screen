# Eco-Cinema Observatory + Paper 1 — Project Status

**Last updated:** 2026-06-27
**Current git commit:** `63a8db9` (pre-Crossing; commit pending user approval)
**Branch:** `feat/exploration-prototypes-and-data-pipelines`
**AI Operating System:** operative as of 2026-06-27. See `.agents/AI-OS.md` (to be filed).

---

## Observatory — current state

**Architecture validated.** The Crossing canonicalization confirms that the Observatory supports heterogeneous cinematic rendering models (Canvas 2D scroll-governed + DOM/GSAP click-triggered) without shared base classes, without config changes, without any modification to existing pages.

### Completed since last session

| Milestone | Files | Status |
|---|---|---|
| Crossing canonicalization (cinematic) | `places/crossing.html`, `src/places/crossing.{js,css}` | Complete — uncommitted |
| Hawksbill natal-homing narrative record | `cinematic-language/narratives/coral-triangle-hawksbill-natal-homing.ts` | Draft — uncommitted |
| Research surface shell | `notes/coral-triangle-hawksbill-natal-homing.html` | Complete — uncommitted |
| check-narratives | 12 narratives, all invariants pass | ✓ |
| Production build | dist/places/crossing.html emitted | ✓ |

### Open Observatory tasks (ordered)

| # | Task | Notes |
|---|---|---|
| O-1 | Commit Crossing canonicalization | Awaiting user approval of commit |
| O-2 | Elevate narrative to `verified` | After second editorial review of hawksbill record; add link to notes/index.html |
| O-3 | File `.agents/AI-OS.md` | AI Operating System document from 2026-06-27 session |
| O-4 | Migration Atlas Phase 2 | `atlas/migration.html` + `src/atlas/migration.{js,css}` — glassmorphic research-surface companion to Crossing |
| O-5 | Species hover face-card in living-place.js | TODO from field-record session |

---

---

## Current project state

Paper 1 is a scoping review of a 380-paper corpus examining the representation of biological ecosystems and conservation knowledge in digital games. The three-variable coding scheme (ER / KF / NC) has been designed, audited, calibrated through two training sets, and validated through a 10-paper failure report. The coding manual is at v1.1 and two targeted amendments have been defined (v1.2) but not yet written into a final document.

**Methodology status:** Frozen pending two minor rule additions (HB-8 extension; new HB-9). No structural changes are open or warranted.

**Coding status:** Not yet begun. All pre-coding validation work is complete.

---

## Completed milestones

| Milestone | Artifact | Status |
|---|---|---|
| Coding scheme design (ER / KF / NC variables) | `paper1-coding-manual-v1.0.md` | Complete |
| Methodology audit (rule gap analysis) | `paper1-methodology-audit-v1.md` | Complete |
| Coding manual v1.1 (post-audit revisions) | `paper1-coding-manual-v1.1.md` | Complete |
| Corpus-level distribution forecast (380 papers) | `paper1-corpus-forecast.md` | Complete |
| Training Set A (initial calibration) | Session record | Complete |
| Training Set B (stress-test calibration, 10 papers) | `paper1-training-set-b-coder.md` / `paper1-training-set-b-answer-key.md` | Complete |
| Training Set B failure report + Outcome recommendation | This document / session record | Complete |
| v1.2 amendment definitions | Session record (not yet written to file) | Defined, not filed |

### Training Set B results summary

- **Code accuracy:** 27/30 (90%) — ER 7/10, KF 10/10, NC 10/10
- **Confidence accuracy:** 21/30 (70%) — ER-conf 9/10, KF-conf 6/10, NC-conf 6/10
- **Outcome verdict:** Outcome 2 — Minor revision required
- **HB-V4 (highest-risk rule):** Passed on all three Indigenous-paper tests
- **All intended stress tests:** Passed (HB-V4, HB-R4, NC-2/3 boundary, AR Q4, coding-unit identification)
- **All code errors:** Traceable to single HB-8 gap (category-level ER procedure)

---

## Open tasks

### Blocking — must complete before pilot

| # | Task | Owner | Notes |
|---|---|---|---|
| B-1 | Write v1.2 handbook (HB-8 extension + new HB-9) | Primary coder | HB-8: add ER-1 default for category papers, no Q3/Q4 traversal on examples. HB-9: define High/Medium/Low confidence criteria explicitly. |
| B-2 | Pre-register v1.2 handbook on OSF | Primary coder | Register v1.2 directly — do not register v1.1 and amend mid-pilot. Must be timestamped before Day 1 of pilot. |
| B-3 | Update `paper1-coding-starter.csv` schema | Primary coder | Add columns: `er_confidence`, `kf_confidence`, `nc_confidence`, `in_scope`. Currently missing all four. |
| B-4 | Identify and onboard second coder | Primary coder | Second coder must complete calibration on Training Set A + Training Set B Papers 2, 6, 9 before subsample. Papers 2, 6, 9 are the mandatory calibration papers for v1.2 rule coverage. |
| B-5 | Second-coder calibration session | Both coders | Focus: HB-V4 (Papers 1–3 triplet), HB-8 extended (Papers 6, 8, 9), HB-9 confidence calibration. Do not begin 76-paper subsample until Papers 2, 6, and 9 code correctly under v1.2. |
| B-6 | Resolve Jepson (2015) scope gate | Primary coder | One paper with an unresolved §1.2 scope determination. Must be resolved before pilot assignment. |

### Non-blocking — complete before or during pilot

| # | Task | Notes |
|---|---|---|
| N-1 | Add 2 ER-3 calibration papers to second-coder session | ER-3 (biome class, no named place) was never traversed in training. Corpus forecast estimates ~20 ER-3 papers. Identify candidates and add to calibration before subsample. |
| N-2 | Create `scripts/paper1-fetch-abstracts.py` | Abstract access will be required for a significant share of corpus papers (HB-2 triggers). Pre-fetching avoids per-paper interruptions during coding. |
| N-3 | Confirm IRR subsample composition | `paper1-irr-subsample.csv` exists. Verify 76-paper subsample is drawn correctly and both coders have access to the same paper set. |
| N-4 | File Training Set B failure report as a permanent document | Current failure report exists only in session record. Write to `paper1-training-set-b-failure-report.md` for audit trail. |

---

## Next recommended actions (ordered)

1. **Write v1.2 handbook** — HB-8 extension and HB-9 are fully specified from the Training Set B failure report. This is a direct transcription task, not a design task. File as `paper1-coding-manual-v1.2.md`.

2. **Update `paper1-coding-starter.csv`** — Add the four missing columns. This is a five-minute schema change that blocks all pilot data entry.

3. **Pre-register on OSF** — Upload `paper1-coding-manual-v1.2.md` with a brief pre-registration note (coding scheme, variables, IRR plan, threshold targets: ER κ≥0.75, KF α≥0.70, NC α≥0.75).

4. **Identify second coder** — Do not begin the pilot until this is resolved. The 76-paper subsample requires simultaneous independent coding.

5. **Run second-coder calibration** — Minimum session: Training Set A papers + Training Set B Papers 2, 6, 9. Paper 2 tests HB-V4 (most likely failure point); Papers 6 and 9 test HB-8 extended and HB-9 together.

6. **Resolve Jepson (2015) and add ER-3 calibration papers** — Both can be done in the same session before pilot Day 1.

7. **Begin 20-paper pilot** — Once B-1 through B-6 are complete.

---

## Current methodological risks

| Risk | Severity | Status |
|---|---|---|
| Second coder not identified | High | Open |
| v1.2 not yet written to file | High | Open (defined in session; not filed) |
| `paper1-coding-starter.csv` missing confidence columns | High (blocks data entry) | Open |
| OSF pre-registration pending | Procedural blocker | Open |
| ER-3 branch never tested in training | Medium | Open — mitigate before pilot |
| KF-A/KF-E boundary untested at scale | Medium | Monitor in pilot; no action now |
| Jepson (2015) scope unresolved | Low–Medium | Open |

---

## File inventory

| File | Description | State |
|---|---|---|
| `paper1-coding-manual-v1.0.md` | Original coding manual | Superseded by v1.1 |
| `paper1-coding-manual-v1.1.md` | Current active handbook | Active; two amendments pending |
| `paper1-coding-manual-v1.2.md` | v1.2 with HB-8 + HB-9 | **Does not yet exist** |
| `paper1-methodology-audit-v1.md` | Rule gap analysis | Complete |
| `paper1-corpus-forecast.md` | Distribution estimates, 380 papers | Complete |
| `paper1-training-set-b-coder.md` | Coder-facing Training Set B | Complete |
| `paper1-training-set-b-answer-key.md` | Restricted answer key | Complete |
| `paper1-training-set-b-failure-report.md` | Permanent failure report | **Does not yet exist** |
| `paper1-coding-starter.csv` | Production coding data file | Schema incomplete (missing confidence + in_scope columns) |
| `paper1-irr-subsample.csv` | 76-paper IRR subsample | Exists; composition unverified |

---

## IRR thresholds (reference)

| Variable | Statistic | Threshold | Subsample |
|---|---|---|---|
| ER | Weighted Cohen's κ (quadratic) | ≥ 0.75 | 76 papers |
| KF | Krippendorff's α | ≥ 0.70 | 76 papers |
| NC | Krippendorff's α | ≥ 0.75 | 76 papers |
