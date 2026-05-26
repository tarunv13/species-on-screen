# Part I — Foundations: source package (9 pages)

> Status: working artifact, not doctrine, not auto-loaded.
> Class: per-Part source register.
> Companion: `private-book/architecture/book-architecture.md` Part I (§5 of architecture).
> Generated: 2026-05-26.

---

## 1 · Section breakdown (architecture-frozen)

| § | Title | Pages | Purpose |
|---|---|---:|---|
| §1 | Subject | 1 | What is being investigated: species on screen, in habitat, with sources |
| §2 | The constitutional layer | 2 | Four canonical steering files as perceptual / editorial / temporal / intuitional authority |
| §3 | The operational layer | 1 | `platform-architecture.md`; the three surfaces |
| §4 | The archival layer | 1 | What `cinematic-principles.md` was, became, why it remains |
| §5 | Doctrine fracture and consolidation | 2 | Two parallel doctrine sets → audit → proposal → consolidation |
| §6 | Citation as architecture | 1 | Articles / Canons / Principles / References as stable identifiers |
| §7 | Restraint as identity | 1 | Single make-the-case section; later Parts presume |

## 2 · Source dependencies

| § | Primary source | Secondary source(s) |
|---|---|---|
| §1 | `cinematic-language/platform-architecture.md` §1, §4; `narrative-ingestion-workflow.md` §1 | `ecological-narrative.example.ts` (schema rationale only) |
| §2 | `2026-05-25-doctrine-resolution-proposal.md` §1 (the four-line authority summaries) | The four `.kiro/steering/*.md` status banners (post-consolidation form) |
| §3 | `platform-architecture.md` §1, §6, §7 | — |
| §4 | `cinematic-language/cinematic-principles.md` archival header block; PR #61 commit message | `2026-05-25-doctrine-resolution-proposal.md` §3 (archival decision) |
| §5 | `2026-05-25-repository-audit.md` §§1–2; `2026-05-25-doctrine-resolution-proposal.md` (full); PR #61 commit message | PR #50 / #51 / #61 PR-bodies (paraphrase only) |
| §6 | The four steering files' "How to cite" sections | `experiential-references.md` §5 (Reference token); architecture §0.3 voice rule |
| §7 | `editorial-voice.md` Canons I, II, V, XII; `cinematic-principles.md` archival §6 (single phrase, "withheld is louder than present") | `pacing-principles.md` Principle XIX; `experiential-references.md` §3 |

## 3 · Quotation candidates (Tier 1; reproduce verbatim)

| § | Excerpt | Provenance | Length |
|---|---|---|---|
| §2 | The four-line authority summaries — one line each for cinematic-vocabulary, editorial-voice, pacing-principles, experiential-references | `2026-05-25-doctrine-resolution-proposal.md` §1 | 4 lines |
| §2 | The post-consolidation status banner of one steering file (canonical, not provisional) | `.kiro/steering/cinematic-vocabulary.md` header | 5–8 lines |
| §3 | The three-surface declaration | `platform-architecture.md` §1 (heading + first paragraph) | 1 sentence + 1 paragraph |
| §4 | The archival header of `cinematic-principles.md` (Status / Superseded-by / pointer) | `cinematic-language/cinematic-principles.md` post-#61 header | ≤10 lines |
| §6 | The citation-token list (Article / Canon / Principle / Reference) | Synthesised from the four steering files' "How to cite" sections | One inline list |
| §7 | "Withheld is louder than present." | `cinematic-principles.md` archival §6 | One sentence; the only quotation in §7 |

No Article, Canon, or Principle is reproduced *in full* in Part I. Full reproduction is reserved for Parts II / III / IV.

## 4 · Concepts to summarise, not quote, in Part I

- The four lawful camera behaviours (Hold / Drift / Descent / Reveal) — named by token only; full text in Part II §1.
- The forbidden-gestures list — referenced as existing; reproduced in Part II §2.
- The Descent's anatomy or timing envelope — out of scope for Part I; Part II §6 + Part IV §2.
- The Canons of editorial voice — token only; full treatment Part III.
- The Pacing Principles — token only; full treatment Part IV.
- The surface-compatibility matrix — names existence; reproduces in Part V §2.
- The `EcologicalNarrative` schema — named only; Appendix D + Part VI.
- The narrative pipeline (ingestion → review → lifecycle) — named only; Part VI.
- The seven turning points — only #5 and #7 enter Part I; the rest are deferred to their owning Parts.

## 5 · Required artifact references (named, not reproduced)

| Reference | Form |
|---|---|
| `.kiro/steering/{cinematic-vocabulary,editorial-voice,pacing-principles,experiential-references}.md` | §2 |
| `cinematic-language/platform-architecture.md` | §3 |
| `cinematic-language/cinematic-principles.md` | §4 |
| `.agents/tasks/task-repo-consolidation/2026-05-25-repository-audit.md` | §5 |
| `.agents/tasks/task-repo-consolidation/2026-05-25-doctrine-resolution-proposal.md` | §5 |
| Doctrine-consolidation commit (PR #61, dated 2026-05-25) | §5 |
| The doctrine-layer dependency diagram (book-original; reproduced as a figure in §2) | §2 |

## 6 · Required cross-references

Forward (Part I → later):
- §2 → Part II (Articles), Part III (Canons), Part IV (Principles).
- §3 → Part V (full architecture treatment); Part V §2 owns the matrix.
- §4 → Part VIII §3 *if* a Reversals section addresses cinematic-principles.md's demotion (otherwise no forward).
- §5 → Part II §4 (Article XVII as the only consolidation amendment).
- §6 → Appendix A (citation conventions); Appendix B (token index).
- §7 → every later Part presumes; explicitly cited from Part III §6 and Part IX preamble.

Backward (later → Part I):
- Part II §4 cites §5 (consolidation is why Article XVII exists).
- Parts II / III / IV all cite §6 for the token system.
- Part IX preamble cites §7 (restraint as the floor under the anti-pattern catalogue).
- Part XIII §6 cites §5 (consolidation closed the present collision; future risk inherited).

## 7 · Redundancy risks

Within Part I:

| Risk | Where | Resolution |
|---|---|---|
| Re-listing the four steering files in §2 and §6 | functional vs grammatical | §2 = what each governs; §6 = how each is cited |
| `cinematic-principles.md` discussed in both §4 and §5 | archival status vs consolidation history | §4 = what it became; §5 = how it became that |
| Paraphrasing the audit and the proposal as if they were one document | §5 only | Treat as paired but distinct: the audit names; the proposal binds |

Across the book:

| Risk | Owned by | Cross-reference rule |
|---|---|---|
| The forbidden-registers list | Part III §6 | Part I never lists; only refers to its existence |
| "Place precedes name" | Part III §1 + Part II §6 + Part X §3 | Part I never asserts; §7 may gesture only as posture |
| The Descent | Part II §6 + Part IV §2 + Part VII | Part I never describes shape or timing |
| Restraint as posture | Part I §7 (sole argument home) | every later Part assumes; flagged repetition is structural slip |
| "Withheld is louder than present" | Part I §7 (one paragraph) | not elaborated anywhere else |

## 8 · Unresolved structural gaps

1. **Sequencing tension between architecture order and reader-comprehension order.** The architecture places §7 (Restraint) last; the user-stated comprehension order requires restraint *before* implementation history. §5 is the first historical beat, and it lands before §7 in the frozen order. → Two options: (a) keep architecture; rely on §1–§3 to establish posture implicitly so §5 reads as consequence rather than narrative; (b) propose an architecture amendment relocating §7 to §1 ½ position. Recommendation: (a). §5 is two pages of operational record, not a story; readers do not need restraint pre-argued to absorb it. Flag for explicit ratification before drafting.
2. **§4's authority register.** `cinematic-principles.md` is archival yet still on disk; quoting its archival header risks reading as quoting active doctrine. Resolution: every §4 quotation is preceded by the word "archival" inline; no §4 sentence may be cited in a later Part as authority.
3. **§7's tone budget.** The architecture's prohibition on "any 'philosophy of design'" and "any 'we believe'" leaves §7 the narrowest writing window in the book. Risk: §7 either underperforms (sounds clerical) or breaks the constraint (sounds manifesto-like). Resolution: §7 is built around the single quotation in §3 above; everything else in §7 is one operational consequence per paragraph, no exhortation.
4. **Diagram source for §2's dependency diagram.** No existing artifact carries it. The book originates it. → Treat as a book-native figure; reproduce in Appendix B by reference.
5. **§1 page-budget pressure.** One page must establish: subject, scope, what an *attested ecological narrative* is (a schema preview), and why "with sources" is structural. The schema cannot be reproduced in §1 (Appendix D owns it). Resolution: §1 names the schema's existence and points to Appendix D; the page is descriptive, not enumerative.

## 9 · Appendix dependencies

| § | Appendix |
|---|---|
| §1 | D (`EcologicalNarrative` schema named) |
| §2 | B (Articles / Canons / Principles / References index) |
| §3 | E (surface-compatibility matrix named) |
| §6 | A (citation conventions); B (token index) |
| §7 | F (glossary entries: *restraint*, *withheld is louder than present*, *posture*) |

Part I writes nothing into the appendices; it only depends on them. Appendix A and Appendix B must be drafted before §6 is written.

## 10 · Foundational items quotable directly in Part I

Only those listed in §3 above. Specifically, *no individual Article, Canon, or Principle is foundational enough to quote in full inside Part I.* Part I introduces the system; it does not exemplify it. The single in-full doctrinal excerpt in Part I is the four-line authority summary of §2.

## 11 · Historical turning points required in Part I

| # | Turning point | Section |
|---|---|---|
| 5 | Repository audit + doctrine-resolution proposal (2026-05-25) | §5 |
| 7 | Doctrine consolidation (2026-05-25) | §5 |

All five other turning points are *forbidden* from Part I:

- #1 First descent prototype → Part VII §1.
- #2 v1 → v2 depth-of-medium pivot → Part VII §2 / Part X §1.
- #3 Narrative-registry pipeline → Part VI §1 / Part XI §2.
- #4 Homepage audit (2026-05-24) → Part VIII §1 / Part XII §1.
- #6 Publication-readiness remediation → Part XII §2.

## 12 · Material that belongs later (excluded from Part I)

- Any prose narrating *the v1 → v2 pivot*, *settle as continuance*, or *luminance-dip discipline* — Part X.
- Any reproduction of the Descent's four phases or its timing envelope — Parts II / IV / VII.
- Any anti-pattern enumeration beyond mention in §7's posture argument — Part IX.
- Any Family-C / publication-readiness narration — Part XII.
- Any reflection on the book itself as a failure mode — Part XIII §7.
- Any per-narrative example, fragment example, or COM-B trace — Part III §5 + Part VI.

## 13 · Sequencing recommendation

Keep the architecture order. Read order:

§1 Subject (ontology) → §2 Constitutional layer (doctrine ontology) → §3 Operational layer (cinematic ecology + asymmetric revelation, via the three surfaces and the bridge asymmetry) → §4 Archival layer (closed past) → §5 Fracture and consolidation (first historical beat) → §6 Citation (apparatus) → §7 Restraint (posture).

Reader-comprehension mapping:

- **ontology** absorbed by end of §2.
- **cinematic ecology** named by end of §3; *asymmetric revelation* is named explicitly inside §3 as the bridge layer's defining property.
- **restraint** explicitly argued at §7; implicitly carried since §1 by the writing register itself.
- **implementation history** begins at §5 and is contained to two pages.

Validation outcome: structurally sound on the architecture's terms. Single open item is gap (1) above — keep the order, accept that §5's history is short enough to land before §7's posture argument without breaking comprehension. **Recommend: ratify Part I as-frozen; proceed.**
