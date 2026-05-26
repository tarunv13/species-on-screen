# Prose-governance layer for the Species on Screen private book

> Status: writing-discipline record, not doctrine, not auto-loaded.
> Class: book-wide governance.
> Companion: `private-book/architecture/book-architecture.md` §0.3 (voice); §11 (what stays out); §12 (soft-maximum table).
> Generated: 2026-05-26. Frozen. Binding on every chapter. A draft passage failing any rule is returned to source, not edited.

---

## 1 · Prose rules (sentence-level)

| Rule | Enforcement |
|---|---|
| Documentary register | Third-person about the system; the system is described, not advocated for |
| Tense | Present tense for what is; present-perfect for what has happened to it |
| First person | None. No `I`, no `we`, no `our`, no `us` |
| Second person | None. No `you`, no `your`, no `imagine`, no `picture`, no `suppose` |
| Mood | Declarative. Imperative only inside doctrine quotations. No rhetorical questions |
| Exclamation | None except inside quoted source code or string literals |
| Modality | No `should`, `must`, `ought` outside doctrine quotation. No `might`, `perhaps`, `possibly` outside hedged historical recall |
| Sentence length | Shorter than the topic appears to invite. Mean ≈ 18 words; cap ≈ 35 |
| Adjective count | ≤ 2 adjectives per noun; quantitative or attributive, not evaluative |
| Adverb count | ≤ 1 evaluative adverb per paragraph; zero is preferred |

## 2 · Paragraph-density rules

| Rule | Enforcement |
|---|---|
| Default size | 3–7 sentences; ≤ 150 words |
| One claim per paragraph | Supporting claims must trace inside the same paragraph |
| Single-sentence paragraphs | Reserved for chapter / section boundary statements; ≤ 1 per section |
| Operational-anchor cadence | At least one operational anchor (file path, PR number, doctrine identifier, or numeric parameter) per ~150 words |
| Paragraph closing | Resolves to operational consequence or hands it to the next paragraph; never trails into reflection |

## 3 · Quotation rules

| Tier | Material | Reproduction |
|---|---|---|
| 1 | Articles I–IV; Article XVII; forbidden-gestures list; Descent timing envelope; `EcologicalNarrative` schema; surface-compatibility matrix; lifecycle table; architectural never-rules | Reproduced in full once each, in the chapter the architecture assigns |
| 2 | v1 / v2 prototype reviews; homepage audit; repo audit; doctrine-resolution proposal; publication-readiness commit message; mangrove canonical descent spec | Quoted operatively; ≤ 30 consecutive words per excerpt; cited inline by file path or PR number |
| 3 | Everything else | Referenced by name; not quoted |

Additional:

- No epigraphs at chapter heads.
- No back-of-book quotation pages.
- Every Tier-1 reproduction must be referenced again later in the book; otherwise reproduce in an appendix, not the body.
- Quoted material always carries its source inline (`platform-architecture.md` §5; PR #60).

## 4 · Operational-detail rules

1. A generalization without a paired specific in the same paragraph is invalid.
2. Numbers override narration. A specific millisecond, particle count, line count, depth coefficient, or px threshold wins against any abstract claim it touches.
3. File paths reproduced verbatim; never paraphrased. *"the platform architecture document"* is wrong; ``cinematic-language/platform-architecture.md`` is right.
4. Doctrine cited by stable identifier only (Article III, Canon XI, Principle VIII, Reference). Never by topic alone.
5. Historical events cited by date and PR number where available.
6. Build-output statements cited by `dist/` path, asset-chunk size, or `vite build` outcome where available.
7. The schema's frozen status is named whenever the schema is referenced.

## 5 · Abstraction limits

- One sentence of generalization per finding or claim, maximum. Subsequent sentences in the paragraph must be specific to this project.
- Banned generalization frames: *in general, essentially, in some sense, fundamentally, ultimately, what X is, the nature of X, the essence of X.*
- Banned mythological vocabulary unless paired with operational consequence in the same sentence: *presence, absence, essence, the void, the gaze, phenomenology, ontology, attention itself, being-with, unfolding.*
- No second-order observations about the project's own register without an anchoring example in the same paragraph.
- The book does not theorise *cinema* in the singular abstract; references to specific film traditions live only in `experiential-references.md` (Appendix G), never surfaced in body prose.

## 6 · Acceptable vs forbidden rhetorical patterns

| Acceptable | Forbidden |
|---|---|
| `X because Y, where Y is [identifier]` | `Imagine X` / `Picture X` / `Suppose X` |
| `X was reached by elimination` | `What if X` |
| `The record is that X` | `Some might say X` / `One could argue X` |
| `The point is not X. The point is Y` (≤ once per chapter) | `Of course X` / `Naturally X` / `Inevitably X` |
| Three-fact closing rhythm (cf. asymmetry chapter) | Three-part lists for emphasis |
| Tables for matrix-shaped claims | Anaphoric emphasis (`It is X. It is Y. It is Z.`) |
| Numbered / bulleted lists for enumerable claims | Rhetorical inversion (`Not a tool. A tool.`) |
| `Per Canon V, …` (cross-reference replaces repetition) | `It is no accident that X` |
| `The seam shows.` / `The cut depends on no surviving UI.` (operational closing) | `There is something X about Y` |

Banned evaluative adjectives applied to the project: *beautiful, elegant, powerful, magical, stunning, breathtaking, luminous, resonant, profound, deep, important, crafted, curated.*

Banned verbs of intention applied to the system: *wants, desires, invites, beckons, rewards, punishes, knows, understands, feels, longs, awaits.*

Banned framing: *vision, philosophy, approach, journey, mission* applied to the project itself. Tokens *Article*, *Canon*, *Principle*, *Reference*, *Descent*, *Hold*, *Drift*, *Reveal*, *Crossing*, *Settle*, *Bridge* are doctrine and may be used.

## 7 · Chapter-structure constraints

| Constraint | Enforcement |
|---|---|
| Section count | ≤ 7 per chapter; roughly 1 section per 1.5–2 pages |
| Section headings | Descriptive, not interrogative or evocative |
| Chapter opening | 2–4 sentence framing paragraph naming the operational claim of the chapter |
| Chapter closing | 1–3 sentence operational summary; never a peroration |
| `Conclusion` section | None permitted |
| `Introduction` paragraph at chapter head | ≤ 2 paragraphs |
| Cross-references | By Article / Canon / Principle / Reference number; never by chapter title alone |
| Epigraphs | None |

## 8 · Repetition controls

The architecture's §10 redundancy table is binding; doctrinal material has one home per the table.

| Concept | Sole home | Elsewhere |
|---|---|---|
| Argument for restraint | Part I §7 (one page) | Assumed; never re-argued |
| `Withheld is louder than present` | Part I §7 (one paragraph) | Never elaborated; never quoted again |
| Forbidden registers list | Part III §6 (editorial formulation) | Cross-reference only (`Part II §2`, `Part IV §7`, `Part IX`) |
| `Place precedes name` | Article XVII reproductions in Part II §4; perceptual root in Part X §3 | Never asserted in prose elsewhere |
| Descent anatomy | Part II §6 | Part IV §2 (timing) and Part VII (history) own different facets |
| Anti-pattern register | Part IX | Other Parts cross-reference |

A reader hitting the same material twice in the book is a sign the structure has slipped. The chapter is returned to source.

Concept-count rule: a concept introduced in the book may not be re-defined twice in the same Part.

## 9 · Figure / caption rules

| Rule | Enforcement |
|---|---|
| Figure budget | 5 total; allocated to Descent timing, three-surfaces, narrative pipeline, v1/v2 comparison, reading-order graph |
| Additional figures | None without architecture amendment |
| Screenshots | None |
| Photographs | None |
| Captions | Describe what is shown; cite source artifact (file path, PR, doctrine identifier); do not editorialize |
| Screenshot reels | None — the cinematic surface is documented in word; the visual artifact is the live system |

## 10 · Narrative-tone boundaries (per architecture's class system)

| Class | Permits | Refuses |
|---|---|---|
| Foundational (Parts I, II, III, IV) | Establishing the framework; reproducing Tier-1 doctrine | Reflecting on the framework's significance |
| Operational (Parts II–VI, XI) | Stating rules; reproducing doctrine; recording technical decisions | Reflecting on rules; advocating for them |
| Archival (Parts I §4, XI, XII) | Recording what happened, what was retired, what remains on disk | Justifying; rehabilitating; relitigating |
| Reflective (Parts X, XIII) | Distilling findings as claims; naming unresolved tensions | Arguing for findings; resolving tensions |
| Reference-only (Appendices) | Enumerating; tabulating | Narrating |

A draft sentence's tone is correct if it could survive being moved into its corresponding doctrine file without becoming wrong. If it cannot — because it is too narrative, too reflective, or too defensive — the tone is off.

## 11 · What made the asymmetry chapter succeed (model criteria)

1. Every generalization paired with a specific in the same paragraph (file path, PR number, doctrine identifier, parameter).
2. Causation traced: *X because Y, where Y is named*. Not implied.
3. Documentary distance throughout. Zero `we`, zero `you`, zero exclamation, zero rhetorical questions.
4. Short declarative sentences as the load-bearing form.
5. Section headings descriptive (`The two registers do not negotiate`, `Family C and the contradiction made visible`, `The bridge is not a UI element`).
6. Closing three-sentence operational summary; no peroration. *The single source of place truth holds. The two surfaces do not converge. The bridge is not a UI element.*
7. Doctrine cited by token (Article XV, Canon XII, Article III's Crossing); never by paraphrase.
8. Historical events located by PR number (#35–#37, #60) and by audit date.
9. The chapter never described its own register or named its own restraint.

## 12 · What future chapters must preserve

- The operational-anchor cadence (≥ 1 anchor per ~150 words).
- The traceable-causation pattern.
- Documentary distance.
- The short-declarative load-bearing form.
- The forbidden-construction discipline (no `we`, no `you`, no exclamation, no rhetorical questions, no verbs of intention).
- The closing-summary form (1–3 short sentences; no flourish).
- Headings descriptive, never evocative.

## 13 · Sentences that immediately weaken the book

Any single sentence containing one of the following triggers a return to source:

- A verb of intention applied to the system.
- The pronouns *we*, *our*, *us*, *you*, *your*.
- An exclamation mark outside a quotation.
- A rhetorical question.
- An evaluative adjective from §6's banned list applied to the project.
- The words *presence*, *absence*, *essence*, *the void*, *the gaze*, *phenomenology*, *ontology*, *attention itself* without operational consequence in the same paragraph.
- A comparison framing the project favorably against *most websites*, *typical platforms*, or unnamed others.
- A claim of *vision*, *philosophy*, *approach*, *mission* attributed to the project itself.
- A capitalised concept word in body prose (other than the project's official doctrine tokens).
- An ellipsis or em-dash used for dramatic effect.
- A three-adjective stack on a single noun.
- A sentence beginning *There is something*.
- A doctrine reference without identifier (`the doctrine says…` without Article/Canon/Principle number).
- A file path paraphrased rather than named.
- A finding stated without parameter, file, or doctrine pointer.

## 14 · When implementation detail overrides interpretation

- Always, in operational sections (Parts II–VI, XI).
- Always, in reflective sections when the finding is mechanism-rooted (Part X §1, §2, §6).
- Always, in archival sections (Parts XI §1, XII) where the operational record is the substance.
- The override is one-way. An interpretation cannot replace a parameter.
- Conflict resolution: where a draft sentence and a parameter disagree, the parameter stands and the sentence is rewritten.

## 15 · How restraint appears in prose itself

- The book does not use the word *restraint* except in Part I §7 (the single argument for it).
- Sentences are shorter than the topic appears to invite.
- Adjectives are quantitative or attributive, never evaluative.
- Closing summaries are shorter than the section they close.
- Topics in the architecture's §12 soft-maximum table (the Descent, *withheld is louder than present*, the forbidden lists, fragment construction, biome palette, Settle finding) are held to their soft maxima; over-run is structural failure, not stylistic preference.
- The book never describes its own register or names its own discipline. The discipline is shown in what is not said.

## 16 · Top stylistic drift risks

1. Reflective passages drift toward essay.
2. Quotations drift toward over-quotation.
3. Generalizations drift toward universal claims.
4. Closings drift toward peroration.
5. Headings drift toward questions or evocative phrases.
6. Accounts of turning points drift toward narrative (`at this moment…`).
7. Cross-references drift toward duplication.
8. Figure captions drift toward commentary.
9. *What survives the threshold* passages drift toward poetry.
10. Passages about Article III drift toward animation cookbook.
11. Passages about Settle drift toward attention theory.
12. Passages about photographs drift toward *presence / absence*.
13. Passages about the bridge drift toward elaboration of the asymmetry's *meaning*.
14. Passages about the doctrine consolidation drift toward retrospective narrative.
15. Passages about the schema drift toward CMS-architecture register.

## 17 · Signs the book is becoming —

*Literary*

- Sentences run longer than the operational content requires.
- Tone shifts within a paragraph.
- Adjectives accumulate before nouns.
- Words *luminous*, *spare*, *quiet*, *patient*, *resonant* applied to the project's outputs.
- Ellipses or em-dashes for dramatic effect.
- Single-sentence paragraphs without operational anchor.

*Mythologizing*

- Verbs of intention applied to the system.
- Capitalised concept words in body prose.
- Phrases such as *the system understands*, *the page knows*.
- Vocabulary from §5's mythological list without paired operational consequence.
- Origin frames: *X was born from Y*, *X grew out of Y*. Replace with *X was decided in Y* or *X resulted from Y*.

*Self-important*

- *This book…*, *this project…*, *this work…* appearing more than once per chapter.
- Comparisons to named external systems.
- *Rare to find…*, *unprecedented…*, *few platforms…*; superlatives of any kind.
- *Why this matters* / *what this means* framing.
- A section explicitly framing the project's importance.
- *Vision*, *philosophy*, *approach* applied to the project's own outputs.

*Repetitive*

- Restraint argued more than once.
- Forbidden registers listed more than once.
- The Descent described more than twice.
- *Place precedes name* stated outside of Article XVII reproductions.
- Cross-reference replaced by re-statement.
- A concept re-defined within the same Part.

*Operationally vague*

- A generalization without a paired specific in the same paragraph.
- Doctrine cited without identifier.
- File paths paraphrased.
- A historical event referenced without date or PR number.
- A finding stated without parameter, file, or doctrine pointer.
- Phrases *in some sense*, *to a large degree*, *for the most part*.

## 18 · Validation procedure for a draft chapter

A chapter passes review iff:

1. Every paragraph contains at least one operational anchor.
2. No banned construction (§1, §5, §6, §13) appears in any sentence.
3. No concept defined elsewhere in the book is re-defined in this chapter.
4. The closing summary is ≤ 3 sentences.
5. Section headings are descriptive.
6. Quotation footprint stays inside the Tier rules of §3.
7. Figure / screenshot count is 0 unless the chapter holds an architecture-allocated figure.
8. The chapter does not describe its own register.
9. Cross-references use stable doctrine identifiers.
10. Repetition controls (§8) hold.

A failed item returns the chapter to source, not to copy-edit.

The asymmetry chapter is the model. Future chapters that match its discipline are admissible. Future chapters that exceed it stylistically are returned regardless of their content.
