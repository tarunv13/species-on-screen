# species-on-screen

An ecological observatory built around two surfaces. The repository
name is historical; the system name is **Eco-Cinema Observatory**
(see `package.json`, `index.html`).

The system is single-author and experimental. It is not a platform,
not a CMS, and not currently open to external contribution. The
repository is public so that the artifacts it produces &mdash;
narrative records, place prototypes, doctrine &mdash; can be read.

## What is here

By architectural rule the observatory has only two surfaces, and a
URL convention between them.

- **Cinematic surface.** `index.html` is the editorial entrance: one
  place, one editorial caption, no chrome, no catalog. The first
  canonical inhabited place is `places/sundarbans.html`. The
  cinematic surface contains no citations, lists, search, or
  comparison; those live on the other surface.
- **Research surface.** `notes/` holds an archive of attested
  ecological observations &mdash; one place, one species, one
  observation, sources. `notes/index.html` is the archive index;
  each `notes/<slug>.html` is the research-surface page for one
  record. Records are typed under `cinematic-language/narratives/`.

The two surfaces share design tokens and nothing else. There is no
"immersive mode" toggle, no global navigation between them, and no
hybrid page. Research may end with a single editorial line that
leads into cinematic; cinematic has no in-page exit. This asymmetry
is intentional and load-bearing &mdash; see
[`cinematic-language/platform-architecture.md`](./cinematic-language/platform-architecture.md).

## Repository layout

| Path | Contents |
|---|---|
| `index.html`, `src/` | Cinematic homepage and runtime |
| `places/` | Canonical cinematic place pages |
| `notes/` | Research-surface archive (HTML pages) |
| `cinematic-language/` | Schema, registry, ingestion workflow, lifecycle, platform architecture |
| `cinematic-language/narratives/` | Narrative records (one TypeScript file per record) |
| `.kiro/steering/` | Canonical doctrine: cinematic vocabulary, editorial voice, pacing, references |
| `prototypes/` | Stress-tests and counter-tests; not bundled, not routed in production |
| `species/` | Archival residue of an earlier product register; not bundled, not routed |
| `private-book/` | Working artifacts for a future writing pass; not doctrine, not auto-loaded |
| `.agents/` | Internal task records and reviews; not part of the public surface |
| `scripts/` | Build-time tooling (narrative scaffolder, integrity check) |
| `.github/` | CI workflows and the preview-deployment guide |

## Local development

```sh
npm install
npm run dev
```

`npm run build` runs the narrative integrity check first via the
`prebuild` hook, then writes a static bundle to `dist/`.
`npm run preview` serves the built bundle.

## Adding a narrative

Narratives are individual TypeScript files under
`cinematic-language/narratives/`. Each file default-exports one
`EcologicalNarrative` and is auto-discovered at build time by
`cinematic-language/narrative-registry.ts`. The matching
research-surface page is an empty HTML shell under `notes/` whose
basename is the narrative id.

To scaffold a new narrative draft (one `.ts` record file plus its
matching `.html` shell):

```sh
npm run new-narrative
```

You will be prompted for four fields:

- narrative **id** (kebab-case slug; becomes both filenames and the URL
  slug)
- **place name**
- species **common name**
- species **scientific name**

Everything else is generated as TODO placeholders, with safe defaults
where required by the schema (`metadata.schemaVersion: '1'`,
`metadata.status: 'draft'`, `species.iucnStatus: 'data_deficient'`,
`observation.type: 'habitat_dependency'`). After editing the file,
run `npm run build` to verify the registry picks it up.

The schema is in
[`cinematic-language/ecological-narrative.example.ts`](./cinematic-language/ecological-narrative.example.ts).
Editorial rules, evidence threshold, and rejection criteria are in
[`cinematic-language/narrative-ingestion-workflow.md`](./cinematic-language/narrative-ingestion-workflow.md).

## Checking narrative integrity

Run a build-time integrity check over every narrative file under
`cinematic-language/narratives/`:

```sh
npm run check-narratives
```

It fails on any of: id-filename mismatch, duplicate ids,
schemaVersion drift, missing or invalid `metadata.status`, empty
`sources`, missing `export default`, or a missing matching research
shell at `notes/<id>.html`. Output names the file and the exact rule
violated.

The check runs automatically before `npm run build` (via the
`prebuild` hook), so a build cannot ship narrative drift.
