# Architecture Decision Record — WP8: Sundarbans↔Canvas Interaction-Model Divergence

**Status:** RATIFIED (2026-07-05) — Option A selected by the Chief Architect. Sections 1–8 remain the factual/analytical record; Section 9 is the engineering recommendation that was accepted as written; Section 10 records the ratification.

---

## 1. Architectural question

Should the Observatory's cinematic places share one interaction model for how the viewer moves through a descent and its subsequent scene, or is a permanent split between two models acceptable — and if convergence is chosen, which model becomes the standard?

Concretely: Sundarbans drives its entire experience through an authored, time-based sequence the viewer watches; Crossing and East Pacific Rise drive theirs through a live, scroll-scrubbed camera the viewer directly controls. This is a difference in the viewer's basic relationship to the work — watching versus driving — not a stylistic implementation detail.

---

## 2. Verified facts from the repository

Confirmed by direct code inspection this session (not inferred from documentation):

- `src/places/sundarbans.js` builds its Movements (M1–M5) via `gsap.timeline({ paused: true, ... })`, with fixed per-tween `duration` values in seconds. The file contains **no scroll listener anywhere** (verified by search for `scrollY`, `addEventListener('scroll')`, `ScrollTrigger`). Once triggered, the sequence runs on its own clock.
- `src/places/crossing.js` computes its entire camera/composition through `camera(p)`, where `p` derives directly from `window.scrollY / max`, recomputed live on every native `scroll` event (`window.addEventListener('scroll', readScroll, { passive: true })`).
- `src/places/epr-vents.js` has the identical `camera(p)` structure and pattern as Crossing, independently built.
- `PROJECT_STATE.md` names Sundarbans *"the canonical place... currently the only canonical place."* It was the first cinematic place built; Crossing and East Pacific Rise were built after it and both independently converged on the scroll-driven model.
- `PROJECT_STATUS.md` backlog item 3(a) names this "the Observatory's central coherence tension" and states it is "architectural, needs a Chief Architect ruling before any work" — flagged during the M18 cross-surface review (2026-07-02), which audited all three cinematic places together.
- No ruling on this question existed anywhere in `.agents/decisions/` prior to this record (confirmed by search).
- `OBSERVATORY_V2_IMPLEMENTATION.md` (the Observatory v2 Roadmap) and `IMPLEMENTATION_BLUEPRINT.md` do not reference or depend on this question anywhere — the Observatory v2 grammar (D1–D10) governs the research/evidential/analytical surfaces and does not touch cinematic camera mechanics. This ADR and its resulting work are therefore a distinct architectural thread from the D1–D10 roadmap, not a part of it.

---

## 3. Constraints imposed by existing doctrine

- **Principle III** (`pacing-principles.md`) specifies the canonical Descent's timing in exact milliseconds ("~3.0 s from click to first text"), stated as non-negotiable outside named, narrow exceptions (reduced motion, slow network, warm re-entry). No exception is named for a scroll-driven mechanism.
- **Principle VIII and the cadence table** (§4, §10) specify `Scroll governor: reading-time` for every listed safari-scene beat type, with no stated exception for Sundarbans or any other named place.
- **Principle IX** requires per-scene Lenis specifically "because the cadence depends on a controllable scroll velocity" — phrased as a general safari-scene requirement, not scoped to exclude any place.
- **`PROJECT_OPERATING_MANUAL.md` §5** — "no redesign, no architectural change... standards reuse over invention... no new vocabulary or schema without a ruling." This is why no option below was implemented ad hoc, and why a genuinely new pattern (Option D, §4) carried the heaviest governance weight of the four.
- The **Creative Direction Constitution**'s Motion Philosophy and Spatial Philosophy (frozen, referenced only) describe *qualities* motion must have — decelerating, composed, never fighting itself — but name no specific mechanism (time-driven vs. scroll-driven) as mandatory, so neither model was disqualified by that document.
- The **Constitution**'s permanence-vs-revision and human-judgment-boundary Articles (frozen, referenced only, per memory) placed this architectural ruling explicitly outside AI authority — the basis for the ratification in Section 10.

---

## 4. Available options

- **Option A** — Converge on scroll-scrubbed Canvas2D; retrofit Sundarbans to match Crossing/East Pacific Rise. **[SELECTED]**
- **Option B** — Converge on click-triggered GSAP timelines; retrofit Crossing and East Pacific Rise to match Sundarbans.
- **Option C** — Formalize the split as a permanent, principled bifurcation; no place's code changes; a rule is recorded naming which future places use which model.
- **Option D** — A hybrid pattern (scroll governs macro-progress; an authored timeline governs motion within each scroll-triggered beat, e.g. GSAP ScrollTrigger); all three places eventually converge on this new pattern. This was the highest-uncertainty option of the four: unlike A and B, which each have working, shipped precedent already in this repository, no code anywhere in the Observatory currently validates that the hybrid pattern would deliver its theoretical benefit — it would have been adopted on projected merit alone, with no repository evidence behind it.

---

## 5. Engineering trade-offs

| | Implementation cost | Risk | New dependencies |
|---|---|---|---|
| A | Retrofit 1 file (the most mature, most complex, least-touched-successfully-so-far) | Highest single-file risk; hardest to re-verify Principle III's exact envelope under viewer-controlled scroll speed | None — reuses the pattern already proven in 2 of 3 places |
| B | Retrofit 2 files | Two files instead of one, but each is structurally simpler than Sundarbans' timeline; matches an existing, proven-in-production pattern | None |
| C | Effectively zero — a documentation/decision-record change only | Lowest technical risk; risk is entirely reputational/experiential (see §6) | None |
| D | Build new shared infrastructure, then retrofit all 3 places | Highest total engineering cost; introduces a dependency (ScrollTrigger or equivalent) not currently in the project | New — the only option requiring a new library/pattern |

Maintenance-simplicity signal: **two of the three places already independently converged on the scroll-driven model** when built after Sundarbans. That is real evidence about which pattern this project's own later engineering practice found workable, independent of any doctrine reading.

---

## 6. Experience trade-offs

- **Option A** gives the viewer direct, reversible control over pace — consistent with Principle I's "not in a hurry" ethos taken literally, and with the References documents' repeated preference for viewer-paced discovery over authored sequence (Stalker's "distance is felt as duration"; Outer Wilds' "discovery is the only mechanic"). Cost: the precise, authored "camera lowering, light softening" quality Article III describes as the Descent's signature becomes harder to guarantee identically on every visit, since the viewer's own scroll behavior now shapes it.
- **Option B** preserves the Descent's exact, repeatable authored timing on every visit — the same held beats, the same precise atmospheric build, regardless of viewer behavior. Cost: removes the scrubbable, reversible agency the viewer currently has in two of the three places; a viewer who has visited Crossing or East Pacific Rise before this change would experience a real loss of control on revisiting.
- **Option C** preserves each existing place's experience exactly as it is today for every current visitor. Cost: a visitor who moves between places in one session experiences a real, felt inconsistency in what "arriving somewhere" means each time — the most experientially visible cost of any option, and the one the M18 review already flagged as a coherence problem rather than a neutral variation.
- **Option D**, if executed well, could deliver both the authored precision of B and the viewer agency of A simultaneously. Cost: it is unproven in this codebase, and a poorly-tuned hybrid could deliver neither quality cleanly — the riskiest experiential bet of the four, in exchange for the highest theoretical ceiling.

---

## 7. Long-term maintenance implications

- **A or B** leave the project with **one** interaction model to document, test, and onboard every future cinematic place against — the lowest long-term cognitive and review overhead. Every future PR reviewer, every future contributor, and every future doctrine amendment only needs to reason about one mechanism.
- **C** leaves the project with two models indefinitely, each requiring its own understanding, its own review checklist, and its own doctrine cross-references — a standing maintenance tax that compounds with every additional place, and a standing risk that a third model quietly appears if the "principle" governing the split is ever ambiguous in a future case.
- **D** leaves the project with one model, but one that is more complex than either A or B individually (it must express both time-based and scroll-based logic simultaneously) — lower long-term *proliferation* risk than C, but higher long-term *comprehension* cost than A or B.

---

## 8. Research implications

This question intersects the doctoral research programme in a way none of the other work packages have:

- The planned Paper 3 ("Hoppers") design compares a Species-on-Screen field record against a franchise-game control condition, measuring species knowledge accuracy, ecological systems understanding, conservation behavioral intention, and nature connectedness. Whichever cinematic place (and, downstream, whichever field record) is used as the experimental stimulus will carry **whichever interaction model that place uses at the time of data collection** as an uncontrolled property of the treatment — not something Paper 3's design currently isolates or discusses.
- Now that Option A is ratified, once Sundarbans is retrofitted, **all three cinematic places will share one interaction model**, removing this as a confound for any future Paper 3 stimulus regardless of which place is used — a direct, practical benefit of this ratification for the research programme, though the retrofit work itself is not part of this governance action.
- If Paper 3's stimulus is built and data are collected **before** the retrofit lands, the stimulus as administered must still be archived and versioned exactly as used (the Knowledge Lifecycle's *preserve* step, referenced only), independent of this ADR.
- The possibility noted in the draft ADR — treating the pre-retrofit divergence as a natural comparison for a distinct HCI/behavior-change research question — is now foreclosed as an *ongoing* condition once the retrofit lands, though it remains available as a *retrospective* comparison if ever relevant, since the current shipped behavior of all three places is preserved in git history.

---

## 9. Recommended option (engineering recommendation only — accepted)

This section was engineering judgment, not an architectural decision; it carried no authority to select an option. The Chief Architect has reviewed it and ratified the recommendation as written.

**Recommendation (accepted): Option A** — converge on the scroll-scrubbed Canvas2D model, retrofitting Sundarbans to match Crossing and East Pacific Rise.

Reasoning, in order of weight (unchanged from the draft):

1. **Doctrine's own default is scroll-governance.** The safari-scene cadence table (Principle VIII) specifies `reading-time` scroll governance for every beat type with no carve-out, and Principle IX justifies per-scene Lenis on the same basis. Nothing in the frozen doctrine names Sundarbans' authored-timeline approach as the standard to defend.
2. **The project's own later engineering practice already chose this twice.** Crossing and East Pacific Rise were each built after Sundarbans and each independently arrived at the scroll-driven model. Absent a documented reason Sundarbans' original approach was deliberately different, two independent later convergences are meaningful evidence about which pattern actually served the project better in practice.
3. **It yields exactly one interaction model going forward**, at the lowest total engineering cost among the three options that actually resolve the divergence (A, B, D) — one file retrofitted rather than two (B) or new infrastructure built (D).
4. **Principle III's timing table is not fundamentally incompatible with a scroll-driven mechanism** — Crossing and East Pacific Rise already phase their compositions through smoothstep-gated stages as `p` increases; retrofitting Sundarbans will require tuning its scrollable extent so a typical scroll speed approximates the existing envelope, which is additional verification work, not an architectural blocker.

---

## Implication for Future Cinematic Places

Option A is now the governing interaction model for every future cinematic place. Any future place that departs from the scroll-scrubbed Canvas2D model would not be a routine implementation choice made within that place's own milestone work — it would require its own Architecture Decision Record, following the same protocol this document followed.

---

## 10. Ratification

**Ratified by:** Chief Architect
**Date:** 2026-07-05
**Decision:** Option A — converge on scroll-scrubbed Canvas2D; retrofit Sundarbans to match Crossing and East Pacific Rise.

WP8's own acceptance criterion — *"a ruling is recorded naming which interaction model governs future places"* — is satisfied by this record. WP8 is closed as a governance item.

**Next genuine implementation milestone (not part of this governance action; not implemented here):** retrofit `src/places/sundarbans.js` so its Movements (M1–M5) are driven by live scroll position (`camera(p)`-style, matching `src/places/crossing.js` and `src/places/epr-vents.js`) rather than an autoplaying `gsap.timeline()`. Per Section 6 of this ADR, this requires: re-authoring every tuned `duration`/`ease` value as a function of scroll position instead of elapsed time; full visual re-verification of all five Movements; re-verification that the reduced-motion path still holds Principle XV's contract under the new mechanism; and tuning Sundarbans' scrollable extent so a typical scroll speed approximates the existing Principle III timing envelope. This is cinematic-surface engineering work, tracked separately from the Observatory v2 (D1–D10) roadmap, and is not scoped or sequenced by this governance record.
