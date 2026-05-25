# species-on-screen
Cultromics in conservation project

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
