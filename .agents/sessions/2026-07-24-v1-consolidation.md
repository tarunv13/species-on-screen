# Session diary — V1 consolidation and rest

**Date:** 2026-07-24 (arc spanning 2026-07-23 → 2026-07-24)
**Type:** Launch, writing pass, governance, data-layer, and session close. Mixed application + governance.
**Role:** Release Manager → Creative Technical Lead → Repository steward.
**Branch:** `feat/exploration-prototypes-and-data-pipelines` → `main`.

---

## The arc

1. **V1.0 launched** (`110306df`, tag `v1.0.0`). Sprint 1 product decisions D1–D3 (threshold invites entry not selection; the world keeps breathing through commitment; truthful "three inhabited places" description) implemented, editorially certified on both tracks (structural — live-site + `__descent` C1–C5; and the human live-browser felt pass), and deployed. The deployment required first fixing a GitHub Pages misconfiguration (source was serving the stale `gh-pages` branch, not the Actions artifact), then recovering a `gh-pages-write` concurrency collision by re-dispatching once the group freed — a pattern that recurred on every subsequent merge and was handled the same way each time.

2. **V1.1 writing pass** (`cfe1beae`). W1 — the Sundarbans field-record end-line ("The record ends here. The place does not. Enter the place →") as a plain italic footer line, research→cinematic only. W3 — a `## Rulings` entry (one-fragment allowance attaches to inhabitation only). W4 — the sound design note (breath-rate ambience; does not unreserve Article XVI). W2/W5 omitted per the order.

3. **Delegated Ratification Framework** (`e87300cd`, PR #78). Docs-only governance: the ratification *mechanism* for the Q1–Q5 gate — adjudication-only boundary (never witnessing/amendment/fabrication), Steward-Proxy + separate Adversarial Questioner, AUTO/ESCALATE/NEVER scope table, the ACCORD-record loop, and `.agents/decisions/ratification-records/`. No tooling built.

4. **Citation pipeline — Option A** (`cdf7db70`, PR #79). Structured the four habitats' interaction bibliographies into `references.json` and rendered full APA + identifier in the atlas — with **no** automated DOI resolution. EPR + Coral parsed verbatim from their human-audited CREDITS.md (DOIs preserved, books/reports as legitimate no-DOI, the flagged-unresolved Bates 2005 and Hoey & Bellwood 2008 kept `verified:false`); Sundarbans + Amazon (bare author-year, no titles) routed to the existing curator worksheet. Zero DOI leaks; the human audits are untouched.

## Three specs corrected against ratified governance (the STOP-and-report discipline working)

Each of these was a supplied instruction that conflicted with ratified repository governance; in each case the conflict was surfaced and the spec corrected, rather than coded around:

1. **PRODUCT_DECISIONS location.** A DoD item asked for a root-level `PRODUCT_DECISIONS.md`; that collides with `PROJECT_OPERATING_MANUAL.md` §1's canonical governance map (fixed by `.agents/decisions/2026-07-21-product-decisions-log.md`). Flagged; the canonical `docs/PRODUCT_DECISIONS.md` was updated instead; the ruling was accepted and the DoD amended.

2. **Bates / EPR audit.** An automated Crossref resolver would have "resolved" Bates et al. (2005) to a year-matching but wrong-subject DOI and stamped it verified — undoing the deliberate M31/M32 decision to leave it unresolved. Flagged; the ratified contract became strict corroboration + don't-overwrite-human-audits + Bates stays `verified:false`. The discovery that Coral was *also* already human-audited (M9C) — not part of the "author-year gap" — corrected the fill-set to Sundarbans + Amazon only.

3. **L3 human-curator model.** The requested "resolve against Crossref and write back DOIs" contradicts the ratified L3 conformance data model (`.agents/decisions/2026-07-03-l3-conformance-data-model.md`), which deliberately assigns DOI confirmation to a human Research Curator, with `scripts/curator-worksheet.mjs` already the backlog. Flagged; Option A (structure + render only, reuse the worksheet) was chosen; the auto-resolver was not built.

These three are evidence that verifying a supplied spec against the repository *before* implementing — and correcting the spec when it conflicts with ratified doctrine — is load-bearing, not ceremonial.

## Housekeeping

The LOW items from the journey audit (dead `#safari-container` + `return-to-globe` markup and orphaned CSS; the dead `.lens--quiet` tween; the stale scroll-track comment) were already closed in the post-V1.0 housekeeping commit `7588a1e` (PR #75). Confirmed present-as-removed this session; no new housekeeping commit needed. The `.lens--quiet` **CSS** rules in `sundarbans.css` remain, deliberately out of that scope (dead-but-harmless), noted for a future pass. Zombie `npm run dev` processes on ports 5173–5181 were killed.

## Status and the open gate

`PROJECT_STATUS.md` records V1 shipped and at rest. **D4–D6 remain `Proposed`, gated behind the eight moderated validation sessions → a Q1–Q5 ratification record (`docs/RATIFICATION_FRAMEWORK.md`) → status change.** No next-loop work (D4–D6, Q1–Q5 answers, session scaffolding, moderator kit) may begin until a ratification record exists — the moderator's kit is a design-side print artifact, never repo-generated.

## Thought Review (AI-OS session-close step)

**No new Thought captured.** The durable pattern this session demonstrated — *a chat-supplied spec can conflict with ratified repo governance; verify against the repo first, and correct the spec rather than code around it* — is already codified (`PROJECT_OPERATING_MANUAL.md` §6's canonicalization procedure; `AI-OS.md`; the governance-map discipline). This session produced three worked *applications* of that resolved principle, recorded above, not new pre-resolution reasoning. Per the Thought System's "never create speculatively" discipline, no Thought is opened; this diary is the record.

## Verify / build status

`npm run verify` 12/12 and `npm run build` green throughout. Production live at `https://tarunv13.github.io/species-on-screen/` at `cdf7db70` (V1.0 + V1.1 + ratification framework + citation pipeline). Tag `v1.0.0` → `110306df`.

## Conclusion

V1 is shipped, live, and at rest. Governance for the next loop (the ratification framework) is landed but dormant. The data layer honestly reflects what is confirmed and what awaits a human curator. The repository is clean and reconstructible for the long pause before the human validation sessions. D4–D6 untouched.
