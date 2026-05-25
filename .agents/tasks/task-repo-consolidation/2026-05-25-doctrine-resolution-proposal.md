# Doctrine Resolution Proposal

**Date:** 2026-05-25
**Resolves:** §1 ("Duplicated concepts") and §2 ("Overlapping doctrine
files") of [`2026-05-25-repository-audit.md`](./2026-05-25-repository-audit.md)
**Output:** binding decisions for a future consolidation PR — no file
rewrites, no moves, no merges in this pass

This proposal answers a single question: when an agent or contributor
needs to know what the project's perceptual law is, where do they look?

Today, the answer is two places. After this proposal is accepted, the
answer is one.

---

## 1. Canonical layer

**`.kiro/steering/` becomes the single canonical doctrine layer.**

Reasoning:

1. **Platform-native auto-loading.** The `inclusion: always` frontmatter
   is the actual mechanism by which doctrine reaches the agent.
   Without it, a doctrine file is a file on disk; with it, it is loaded
   into every prompt. `cinematic-language/*` is loaded only when imported
   by a code file or referenced by name, which is the wrong default for
   doctrine.
2. **Editorial voice has no full parallel in `cinematic-language/`.**
   `editorial-voice.md` covers language, register, citation
   architecture, the threat sentence, and prohibited registers across
   ~450 lines. `cinematic-principles.md` §7 (Anti-Gamification) gestures
   at one thread; the rest is uncovered. Making `cinematic-language/`
   canonical would silently demote the most operationally useful of the
   four doctrine documents.
3. **The named-token citation system already works.** PR feedback uses
   *Article III: The Descent*, *Canon V: Quantitative restraint*,
   *Principle IV: Inertia is bounded*. The Articles / Canons / Principles
   vocabulary is a working citation system. `cinematic-principles.md`'s
   Arabic-numbered sections (§1, §2, §3) are harder to cite cleanly and
   collide with internal subheadings.
4. **Specificity.** The steering trio carries the project's only
   concrete numbers — millisecond envelopes, particle ceilings, hover
   thresholds, reading-time calibration. `cinematic-principles.md` is
   abstract; if it became canonical, those numbers would have to be
   re-imported.
5. **Symmetry.** The four steering docs are sibling documents of equal
   weight, with consistent headers, statuses, and structure.
   `cinematic-language/` mixes a perceptual-doctrine doc, an operational
   doc, an advisory findings doc, a code artifact, and now a workflow
   doc — five different categories in one folder.

`cinematic-language/` does not disappear. It holds operational
specifications and code. It is no longer perceptual doctrine.

---

## 2. Authoritative files

The single perceptual / editorial / temporal / intuitional doctrine set
is:

| File | Authority | Auto-load |
|---|---|---|
| `.kiro/steering/cinematic-vocabulary.md` | Articles, governing camera, light, motion, composition, globe, safari | yes |
| `.kiro/steering/editorial-voice.md` | Canons, governing language, voice, register, citation, the threat sentence | yes |
| `.kiro/steering/pacing-principles.md` | Principles, governing time, rhythm, cadence, the Hold, the Descent timing, reduced motion | yes |
| `.kiro/steering/experiential-references.md` | the works the project draws from — intuition layer | yes |

These four files, and only these four files, are doctrine. The "Status:
provisional" header word is dropped at the moment of consolidation; the
citation vocabulary they established (*Article* / *Canon* / *Principle*
/ *Reference*) is now the canonical citation system for the project.

A second tier exists for **operational specifications** — documents
about *how the project is structured*, not *how the project feels*:

| File | Authority | Auto-load |
|---|---|---|
| `cinematic-language/platform-architecture.md` | three-surface model, routing, runtime separation, deployment | no |
| `cinematic-language/ecological-narrative.example.ts` | v1 narrative schema (frozen) | no — code, imported by render path |
| `cinematic-language/narrative-ingestion-workflow.md` | how narratives are created, evidenced, edited, rejected | no |

These are loaded on demand by contributors and agents working on the
surfaces they govern.

---

## 3. Archival / reference-only

| File | New status | Action when consolidation begins |
|---|---|---|
| `cinematic-language/cinematic-principles.md` | archival; no longer cited in PR review | header rewritten to point readers to the canonical steering trio; content not re-asserted; file remains on disk as record |
| `cinematic-language/depth-medium-findings.md` | unchanged — already self-labeled "experimental findings, advisory" | no action |

`cinematic-principles.md` is **not deleted**. It remains as record of
the moment the project tried to write a single perceptual constitution.
After consolidation it is no longer load-bearing and must not be cited.

The `prototypes/reviews/sundarbans-descent-review-v{1,2}.md` files,
the `.agents/tasks/*` review documents, and any future findings docs
follow the same rule: observational, never doctrine, never cited in
review feedback as a binding rule.

---

## 4. What should be merged

Strictly, **nothing in this proposal**. No file is rewritten, moved, or
merged in this pass.

When the consolidation PR is opened, the merge work is small and
surgical:

1. **Walk `cinematic-principles.md` against the steering trio.** Most
   of its 12 sections duplicate content already in
   `cinematic-vocabulary.md` (§1, §5, §8), `pacing-principles.md` (§2),
   or `editorial-voice.md` (§7 Anti-Gamification, parts of §6 Restraint).
2. **Identify the genuinely uncovered sections.** Candidate list, before
   close reading: §3 Atmospheric Hierarchy, §4 UI Burial vs UI Removal,
   §9 Sensory Ethics. §11 Failure Modes is a meta-pattern that already
   has a parallel in `narrative-ingestion-workflow.md` §7 and should
   not be promoted to a third list.
3. **Where genuinely uncovered material exists, fold it into the
   appropriate steering doc as a small amendment.** Atmospheric
   Hierarchy and UI Burial belong in `cinematic-vocabulary.md`. Sensory
   Ethics may belong in `editorial-voice.md` or `cinematic-vocabulary.md`
   depending on its actual content.
4. **Drop everything else.** No summarising, no consolidating, no
   re-stating. The steering trio already says it.

The amendment principle: small inserts, not new sections; never a "v2"
of an existing doctrine. The doctrine doc's existing numbering is
preserved so prior PR-review citations remain valid.

---

## 5. What should remain separate

These remain distinct from the canonical doctrine and from each other:

- **`platform-architecture.md`** — operational, not perceptual. Defines
  surfaces and routing. Distinct in subject from anything in the
  steering trio. Stays in `cinematic-language/`.
- **`ecological-narrative.example.ts`** — code, not doctrine. The schema
  is enforced by TypeScript, not by review. Stays in
  `cinematic-language/`.
- **`narrative-ingestion-workflow.md`** — process, not doctrine.
  `editorial-voice.md` governs words; this workflow governs how words
  and sources become an attested narrative record. They intersect at
  fragment rules (§3) and that intersection is acceptable; no merge is
  appropriate. Stays in `cinematic-language/`.
- **`depth-medium-findings.md`** — record of one experiment. Not
  consulted as doctrine. Stays in `cinematic-language/`.

The audit's §4 question of where `narrative-ingestion-workflow.md`
should live is closed: it stays in `cinematic-language/` because the
schema lives there.

---

## 6. Default agent context

After consolidation, the auto-loaded context contains exactly:

- `.kiro/steering/cinematic-vocabulary.md`
- `.kiro/steering/editorial-voice.md`
- `.kiro/steering/pacing-principles.md`
- `.kiro/steering/experiential-references.md`

And nothing else. No `cinematic-language/*` is auto-loaded. No new
auto-loaded file is added. No fifth steering file is introduced.

When a PR touches a surface governed by `cinematic-language/*` (the
schema, the platform architecture, the narrative workflow), the agent
loads the relevant file by reference, not by always-on inclusion.

This keeps the always-on context budget bounded — a future contributor
or agent can read it from start to finish in one sitting. Doctrine that
cannot be read in full is doctrine that will be selectively cited.

---

## 7. The non-duplication rules

After consolidation, the following are binding:

1. **One cinematic-vocabulary doc.** New camera, light, motion, or
   composition rules are added as Articles inside
   `cinematic-vocabulary.md`. No second cinematic-doctrine file is
   created — not a `cinematic-principles-v2.md`, not a
   `motion-doctrine.md`, not a `light-doctrine.md`.
2. **One editorial-voice doc.** New language, register, or citation
   rules are added as Canons inside `editorial-voice.md`.
3. **One pacing doc.** New timing, cadence, or hold rules are added as
   Principles inside `pacing-principles.md`.
4. **One experiential-references doc.** New reference works are added
   inside `experiential-references.md`.
5. **One platform-architecture doc.** Routing, surface, and deployment
   rules go in `platform-architecture.md`.
6. **One narrative schema.** The schema is `ecological-narrative.example.ts`,
   frozen at v1. A v2 schema, when needed, replaces it through a
   separate, explicitly-versioned file. Two schema files do not
   coexist.
7. **One ingestion workflow.** Research-surface narrative process lives
   only in `narrative-ingestion-workflow.md`.
8. **No second authority claim.** The four steering files are the
   perceptual / editorial / temporal / intuitional authority. The
   platform architecture is the operational authority. There is no
   third "Final Authority" or "Authority" clause anywhere in the repo.
9. **Reviews and findings are not doctrine.** Anything in
   `prototypes/reviews/*`, `.agents/tasks/*`, or labeled "findings" is
   observational. If a finding becomes binding, it is folded into the
   appropriate canonical doc as a small amendment. The original
   observational document remains as record but no longer governs.
10. **No new auto-loaded file without retiring an existing one.** The
    auto-load slot is fixed at four documents. A fifth always-on
    doctrine file requires a written argument for why one of the four
    is being retired or split.

---

## What this proposal does not do

- Does not move any file.
- Does not rewrite any file's content.
- Does not change any auto-load setting (`inclusion: always` stays
  where it is).
- Does not retire `cinematic-principles.md` from disk.
- Does not amend any steering doc.
- Does not propose a fifth steering file.
- Does not collapse `.kiro/steering/` and `cinematic-language/` into a
  single folder.
- Does not introduce a new doctrine vocabulary (no new "Article" type,
  no new "Canon" type, no new "Principle" type).
- Does not address any other audit finding (folder drift, naming
  inconsistencies, prototype promotion, the legacy species directory,
  etc.). Those are out of scope for this pass.

It establishes only: which folder is the source of truth, what each
existing doctrine-adjacent file's status now is, and what must never
recur.

The consolidation PR that executes this proposal is a separate piece
of work, scoped narrowly: walk `cinematic-principles.md` against the
steering trio, fold any genuinely uncovered material into the
appropriate steering doc as small amendments, re-status
`cinematic-principles.md` as archival, and drop the "provisional" status
word from the steering trio's headers.
