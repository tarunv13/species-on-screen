# Seed: Doctrine consolidation and the removal of dual authority

> Status: seed draft, not for publication.
> Class: Part I §5 chapter.
> Companion: `private-book/architecture/book-architecture.md` Part I §5; Part II §4.
> Generated: 2026-05-26.

---

The project's doctrine occupied two folders. `.kiro/steering/` carried four documents — `cinematic-vocabulary.md`, `editorial-voice.md`, `pacing-principles.md`, `experiential-references.md` — each with the front-matter directive `inclusion: always`. `cinematic-language/` carried five — `platform-architecture.md`, `ecological-narrative.example.ts`, `narrative-ingestion-workflow.md`, `cinematic-principles.md`, `depth-medium-findings.md` — loaded on demand. The overlap concentrated in `cinematic-principles.md`, whose §1, §3, §5, §6, §8, and §9 covered the same material — motion, atmosphere, restraint, transitions, sensory ethics — as Articles I–XVI of `cinematic-vocabulary.md` and as several Canons of `editorial-voice.md`. Both folders carried status banners. They disagreed.

The collision was named in the repository audit (PR #50, 2026-05-25), bound by the doctrine-resolution proposal (PR #51, same day), and executed in the consolidation PR (PR #61, late evening of the same day). All three artifacts landed within roughly six hours of `cinematic-principles.md` itself being introduced (PR #39, 2026-05-25 mid-afternoon). The chapter records why the work could not have been postponed.

## ~2,300 lines, both treated as doctrine

The audit reports the structural fact: two parallel doctrine folders, approximately 2,300 lines combined, both consulted in PR review, with conflicting status words — *provisional* on the steering quartet's headers, *canonical* on `cinematic-principles.md`'s — and no cross-references between them. It names five concrete duplications. The largest is *what cinematic motion is allowed to do*: Articles I–IV in `.kiro/steering/cinematic-vocabulary.md` covered the same territory as §1, §5, and §8 of `cinematic-language/cinematic-principles.md`. A reviewer adjudicating a motion violation could cite either set; the citations did not always agree.

The audit ranks eight files future contributors are most likely to misuse. The doctrine pair sits at the top.

The audit was observational. Its closing forbids the document from being cited in PR review, and its *suggested order of operations* section is labelled, in the document itself, *for a future cleanup PR, not this one*. The pattern matches `task-homepage-audit/2026-05-24-homepage-review.md`: `.agents/tasks/` is the home for observation; never for law.

## Why dual authority is operational, not stylistic

Both folders being load-bearing produced three concrete failure modes in PR review.

When an Article and a §-paragraph cover the same rule with different wording, a reviewer cites whichever fits the moment. Two PRs with identical violations can be adjudicated against different sources. The doctrine ceases to be predictive.

The citation layer fragments. A review comment that reads *violates §1.4 of cinematic-principles.md* is unambiguous to its author and ambiguous to its reader. A review comment that reads *violates Article III* is stable across reviewers because *Article III* is a token in a numbered series. The steering quartet's named-token system (Article / Canon / Principle / Reference) was already working; the §1.4-style numbering in `cinematic-principles.md` had not stabilized similarly.

The status banners invert the authority relation depending on which file is opened first. A contributor who reads `cinematic-principles.md` first treats the steering quartet as drafts. A contributor who reads the steering quartet first treats `cinematic-principles.md` as superseded. Neither reading is correct under the existing arrangement; each is a consequence of which file was loaded first.

The proposal names the operational reality directly: *auto-loading is the actual mechanism. Without `inclusion: always`, doctrine is just a file. Steering has it; cinematic-language doesn't.*

## Auto-load as the actual authority surface

The platform on which the doctrine runs treats `inclusion: always` as the directive that makes a document binding for every session. A document not so marked is loaded on demand by a contributor; it cannot affect a review session it is not loaded into. The four steering files were `inclusion: always`; the five `cinematic-language/` files were not.

This produced an asymmetry between *intended* authority and *operational* authority. `cinematic-principles.md` carried a *canonical* status banner and a *Final Authority* section (`§12`) but was not auto-loaded. The steering quartet carried a *provisional* banner and was auto-loaded. The system that runs reviews treated the provisional documents as binding and the canonical document as optional. Status words on a non-auto-loaded file are claims; the auto-load setting is the act.

The proposal codifies this: *the default agent context is exactly the four steering docs, nothing else. `cinematic-language/*` is loaded on demand. The auto-load slot is fixed at four — no fifth always-on file without retiring an existing one.*

The fix-the-banners option was rejected for the same reason the fix-the-status-words-only option was. Editing `cinematic-principles.md`'s banner from *canonical* to *provisional* would align the words but would not change which file the review system loads. The collision had to resolve at the auto-load layer, where authority is enforced.

## Why `cinematic-principles.md` became archival rather than canonical

Five reasons argued against promoting `cinematic-principles.md` and demoting the steering quartet.

`editorial-voice.md` has no full parallel in `cinematic-language/`. Demoting it would silently lose ~450 lines of the doctrine the project cites most often in review — the natural-history register example pair, the threat-sentence form, the prohibited-registers list, the microcopy treatment.

The named-token citation system already worked. *Article III: The Descent*, *Canon V: Quantitative restraint*, *Principle IV: Inertia is bounded* were stable identifiers and were how PR review had been writing for weeks.

The concrete numbers were in steering. Millisecond envelopes (Principle III's Descent timings), particle ceilings (Article V's ~1500), hover thresholds (Article 3's 1.04), reading-time → vh tables (Principle VIII): only the steering quartet carried them. `cinematic-principles.md` was philosophical without being parameter-bearing.

Symmetry favoured steering. Four sibling docs of equal weight in `.kiro/steering/` against five mixed-category files in `cinematic-language/` (one operational architecture, one schema, one workflow, one philosophical doctrine, one advisory findings document) produced a cleaner authority register on the steering side.

Auto-load is the platform-native enforcement, and it was already on the steering side.

The consolidation made `cinematic-principles.md` archival. Its header was replaced with a *Status / Superseded-by / pointer block*. The body (§0–§11) was preserved unchanged so prior PR-review citations that follow links still resolve. §12 *Final Authority* was preserved as a section anchor; its authority claim was retired and replaced with a redirect to the canonical layer. The trailing *Versioned governance* hook was removed; governance lives in the canonical layer.

## Bounded constitutional layers and the ten non-duplication rules

The proposal closes with ten rules pinning the consolidation against re-collision. They read as a fixed slot count: *one cinematic-vocabulary doc, one editorial-voice doc, one pacing doc, one experiential-references doc, one platform-architecture doc, one v1 schema, one ingestion workflow, no second authority claim, reviews/findings/audits are never doctrine, and no new auto-loaded file without retiring an existing one.*

The rules are operational. *No second authority claim* required renaming `platform-architecture.md`'s §9 from *Final Authority* to *Operational authority* — the proposal's own framing — leaving a single authority register, qualified, where the proposal locates it. *Reviews/findings/audits are never doctrine* keeps `prototypes/reviews/sundarbans-descent-review-v{1,2}.md`, `cinematic-language/depth-medium-findings.md`, and `.agents/tasks/*` documents observational regardless of how often their contents are quoted later. *No new auto-loaded file without retiring an existing one* fixes the slot at four; the next steering file requires evicting one of the present four.

The book's later chapters depend on these rules. Parts II, III, IV, V, and VI each correspond to one canonical doctrine source. The Part-by-Part structure of the book is the consolidation's structure.

## Article XVII: the single substantive amendment

The consolidation produced one amendment to the canonical doctrine. A close walk of `cinematic-principles.md` against the steering quartet identified §3 *Atmospheric Hierarchy* as the only genuinely uncovered material — the ordering rule (sound → atmosphere → mass → specificity → inhabitants), the species-during-transition prohibition, the periphery-fills-before-centre rule, and the body-relative-precedes-geographic rule. These were folded into `cinematic-vocabulary.md` as Article XVII, an insert under *Light and atmosphere*.

Other sections of `cinematic-principles.md` were either already covered operationally by the steering quartet (§4 UI Burial vs UI Removal; §6 Restraint Rules; §8 Transition Philosophy) or in active contradiction with it (§9 *Sensory Ethics*'s *no image assets* rule against Article IX's allowance for photographs). The non-amendments stayed in the archival body.

Article XVII is the only line of the present steering layer that originates outside it. Every other Article, Canon, and Principle was already in `.kiro/steering/` before the consolidation.

## Drift risk after consolidation

Three things changed about the future.

The auto-load slot is bounded. A future contributor cannot quietly add a fifth always-on file; the eviction requirement makes any expansion a deliberate act with a public counterpart in the steering folder.

The archival pointer is load-bearing. A contributor following a stale citation link to `cinematic-principles.md` lands on the *Status / Superseded-by* header and is redirected to the canonical layer. Stale links resolve; they do not silently re-introduce competing authority.

The non-duplication rules survive in the proposal document, not in code. Code does not enforce them. Part XIII §6 of this book records the residual risk: the *governance against future re-collision lives in the steering files' status headers, not in code*. The next architect inherits the rule, not its enforcement. Naming the inheritance is the project's posture toward governance: write the rule, name where it lives, refuse to invent a layer to enforce it.

The two folders survive. `.kiro/steering/` carries doctrine; `cinematic-language/` carries operational specifications and one archival record. The build is clean of cross-references; no active doctrine, source, surface, or build artifact references `cinematic-principles.md`. *npm run build* passes against the post-consolidation tree.

The doctrine layer is single. The operational authority is named. The archival record is preserved without authority.
