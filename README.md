# species-on-screen
Cultromics in conservation project

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
