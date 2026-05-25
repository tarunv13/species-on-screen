#!/usr/bin/env node
/*
  scripts/new-narrative.js
  ------------------------
  Scaffold a new EcologicalNarrative draft: one `.ts` file under
  `cinematic-language/narratives/` and one matching research-surface
  HTML shell under `notes/`.

  Prompts only for the four fields that drive identity:

    1. narrative id      (kebab-case slug; also becomes both filenames
                          and the URL slug — the basename of the HTML
                          file is what `render-narrative.js` reads from
                          location.pathname)
    2. place name        (e.g. "Sundarbans")
    3. species common    (e.g. "Bengal tiger")
    4. species scientific (e.g. "Panthera tigris tigris")

  Everything else is a safe default. Most are intentional TODO
  placeholders so the contributor must edit before promoting from
  metadata.status: 'draft'. Defaults that ARE meaningful:

    - metadata.schemaVersion = '1'           (schema is frozen)
    - metadata.status        = 'draft'       (the only valid start state)
    - metadata.contributor   = git user.name (falls back to 'TODO')
    - metadata.created/updated = today
    - species.iucnStatus     = 'data_deficient'
                                (semantically correct unknown; forces
                                 the contributor to look up the actual
                                 IUCN listing)
    - observation.type       = 'habitat_dependency'
                                (most generic enum value; forces edit)

  Conventions enforced at scaffold time:
    - id is kebab-case lowercase
    - id == narratives/<id>.ts == notes/<id>.html
      (the registry keys off filename; mismatched id and filename
       would render a 404 from a page that exists)
    - id must not collide with an existing narrative or shell

  Out of scope: opening an editor, running the build, staging in git,
  validating sources, contacting any external service. The scaffolder
  writes two files and prints next steps.

  Node stdlib only. No package dependencies.

  Usage:
    npm run new-narrative
*/

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/* ---------- Paths ---------- */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const NARRATIVES_DIR = path.join(
  REPO_ROOT, 'cinematic-language', 'narratives'
);
const NOTES_DIR = path.join(REPO_ROOT, 'notes');

/* ---------- Constants ---------- */

const SLUG_REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const SLUG_MIN = 6;
const SLUG_MAX = 80;
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const CURRENT_YEAR = new Date().getFullYear();
const MAX_PROMPT_RETRIES = 3;

/* ---------- Validation ---------- */

function validateSlug(slug) {
  if (!slug) return 'id cannot be empty';
  if (slug.length < SLUG_MIN) {
    return `id must be at least ${SLUG_MIN} characters`;
  }
  if (slug.length > SLUG_MAX) {
    return `id must be at most ${SLUG_MAX} characters`;
  }
  if (!SLUG_REGEX.test(slug)) {
    return (
      'id must be kebab-case lowercase ' +
      '(e.g. "sundarbans-bengal-tiger-saline-swimmer")'
    );
  }
  return null;
}

function validateNonEmpty(label) {
  return (v) => (v && v.length > 0 ? null : `${label} cannot be empty`);
}

/* ---------- CLI args ---------- */

/**
 * Parse a small set of named flags. Anything missing falls through to
 * the interactive prompts. Supports --key=value and --key value forms.
 *
 * Recognized flags:
 *   --id=<slug>
 *   --place=<name>
 *   --common=<name>
 *   --scientific=<name>
 *   --help
 */
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    if (arg === '--help' || arg === '-h') { out.help = true; continue; }
    let key, value;
    const eq = arg.indexOf('=');
    if (eq > -1) {
      key = arg.slice(2, eq);
      value = arg.slice(eq + 1);
    } else {
      key = arg.slice(2);
      value = argv[i + 1];
      i++;
    }
    if (key === 'id') out.id = value;
    else if (key === 'place') out.placeName = value;
    else if (key === 'common') out.commonName = value;
    else if (key === 'scientific') out.scientificName = value;
  }
  return out;
}

function printHelp() {
  console.log(
    'Usage:\n' +
    '  npm run new-narrative\n' +
    '  node scripts/new-narrative.js --id=<slug> --place="<name>" \\\n' +
    '       --common="<common>" --scientific="<scientific name>"\n\n' +
    'Any missing flag is prompted for interactively. Run with no\n' +
    'arguments for the fully interactive form.'
  );
}

/* ---------- Helpers ---------- */

function fail(reason) {
  console.error(`\nnew-narrative: ${reason}`);
  process.exit(1);
}

function getGitContributor() {
  try {
    const name = execSync(
      'git config user.name',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return name || 'TODO';
  } catch {
    return 'TODO';
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function prompt(rl, question, validator) {
  for (let i = 0; i < MAX_PROMPT_RETRIES; i++) {
    const value = (await rl.question(question)).trim();
    const err = validator ? validator(value) : null;
    if (!err) return value;
    console.error(`  ${err}`);
  }
  fail(`too many invalid attempts (${MAX_PROMPT_RETRIES})`);
}

/* ---------- Templates ---------- */

function buildNarrativeFile({
  id, placeName, commonName, scientificName, contributor
}) {
  const placeId = slugify(placeName) || 'TODO-place-id';
  const speciesId = slugify(scientificName) || 'TODO-species-id';

  return `/**
 * ${placeName} \u00b7 ${commonName}.
 *
 * TODO: one-paragraph orientation. What is the place, what is the
 * species, what is the single attested observation that binds them?
 * The narrative-ingestion-workflow rules apply; see
 * cinematic-language/narrative-ingestion-workflow.md.
 *
 * This file is one record. The schema is in
 * \`../ecological-narrative.example.ts\`. The runtime registry that
 * discovers this file is in \`../narrative-registry.ts\`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: '${id}',
  place: {
    id: '${placeId}',
    name: '${placeName}',
    type: 'TODO place type, e.g. "mangrove tidal forest"',
    countries: ['TODO'],
    // protectedArea: 'TODO',
    // coordinates: { latitude: 0, longitude: 0 },
    editorialPlaceLine:
      'TODO: one literary line about the place. ' +
      'Cinematic-extractable. Observational, not interpretive.'
  },
  species: {
    id: '${speciesId}',
    commonName: '${commonName}',
    scientificName: '${scientificName}',
    taxonomy: { family: 'TODO', order: 'TODO', class: 'TODO' },
    iucnStatus: 'data_deficient'
  },
  observation: {
    summary:
      'TODO: a single sourced factual claim, editorially worded. ' +
      'One observation per narrative. If the summary uses "and" to ' +
      'join two findings, it is two narratives.',
    type: 'habitat_dependency',
    year: ${CURRENT_YEAR}
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title: 'TODO citation title',
      authors: ['TODO'],
      journal: 'TODO journal',
      year: ${CURRENT_YEAR}
      // doi: '10.xxxx/yyyy',
      // url: 'https://...'
    }
  ],
  editorial: {
    fragment:
      'TODO under twelve words; observational; no species or place ' +
      'name; no conservation register',
    body:
      'TODO: editorial body. Markdown paragraph splits on blank ' +
      'lines. Aim for restraint over length; the body should not ' +
      'duplicate observation.summary.\\n\\n' +
      'See narrative-ingestion-workflow.md \u00a73 for the fragment ' +
      'rules and \u00a75 for the seven-item check before promoting ' +
      'from draft.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: '${contributor}',
    created: '${TODAY}',
    updated: '${TODAY}',
    status: 'draft'
  }
};

export default narrative;
`;
}

function buildHtmlShell({ id, placeName }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes &middot; ${placeName}</title>
  <script type="module" src="/src/notes/render-narrative.js"></script>
</head>
<body>
  <!--
    Research-surface page. Empty by design. The render path
    (src/notes/render-narrative.js) reads the narrative id from the
    URL pathname (the basename of this file: ${id}), looks it up in
    the registry, and populates #narrative below.

    No cinematic engine is loaded here (platform-architecture \u00a77).
  -->
  <main id="narrative" class="narrative" aria-label="Ecological narrative"></main>
</body>
</html>
`;
}

/* ---------- Main ---------- */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  console.log('new-narrative: scaffold one EcologicalNarrative draft.\n');

  // If a field came in via CLI, validate it now and fail clearly on
  // bad input. Prompt only for whatever is missing.
  if (args.id !== undefined) {
    const err = validateSlug(args.id);
    if (err) fail(`--id: ${err}`);
  }
  if (args.placeName !== undefined) {
    const err = validateNonEmpty('place name')(args.placeName);
    if (err) fail(`--place: ${err}`);
  }
  if (args.commonName !== undefined) {
    const err = validateNonEmpty('common name')(args.commonName);
    if (err) fail(`--common: ${err}`);
  }
  if (args.scientificName !== undefined) {
    const err = validateNonEmpty('scientific name')(args.scientificName);
    if (err) fail(`--scientific: ${err}`);
  }

  let id = args.id;
  let placeName = args.placeName;
  let commonName = args.commonName;
  let scientificName = args.scientificName;

  const needsInteractive =
    id === undefined ||
    placeName === undefined ||
    commonName === undefined ||
    scientificName === undefined;

  let rl = null;
  try {
    if (needsInteractive) {
      rl = readline.createInterface({ input, output });
    }

    if (id === undefined) {
      id = await prompt(
        rl,
        'narrative id (kebab-case, e.g. sundarbans-bengal-tiger-saline-swimmer): ',
        validateSlug
      );
    }

    const narrativePath = path.join(NARRATIVES_DIR, `${id}.ts`);
    const notesPath = path.join(NOTES_DIR, `${id}.html`);

    if (existsSync(narrativePath)) {
      fail(
        `narrative file already exists: ` +
        path.relative(REPO_ROOT, narrativePath)
      );
    }
    if (existsSync(notesPath)) {
      fail(
        `notes shell already exists: ` +
        path.relative(REPO_ROOT, notesPath)
      );
    }

    if (placeName === undefined) {
      placeName = await prompt(
        rl,
        'place name (e.g. Sundarbans): ',
        validateNonEmpty('place name')
      );
    }
    if (commonName === undefined) {
      commonName = await prompt(
        rl,
        'species common name (e.g. Bengal tiger): ',
        validateNonEmpty('common name')
      );
    }
    if (scientificName === undefined) {
      scientificName = await prompt(
        rl,
        'species scientific name (e.g. Panthera tigris tigris): ',
        validateNonEmpty('scientific name')
      );
    }
  } finally {
    if (rl) rl.close();
  }

  const contributor = getGitContributor();

  const narrativePath = path.join(NARRATIVES_DIR, `${id}.ts`);
  const notesPath = path.join(NOTES_DIR, `${id}.html`);

  await mkdir(NARRATIVES_DIR, { recursive: true });
  await mkdir(NOTES_DIR, { recursive: true });

  await writeFile(
    narrativePath,
    buildNarrativeFile({
      id, placeName, commonName, scientificName, contributor
    }),
    'utf8'
  );
  await writeFile(
    notesPath,
    buildHtmlShell({ id, placeName }),
    'utf8'
  );

  console.log('\nWrote:');
  console.log(`  ${path.relative(REPO_ROOT, narrativePath)}`);
  console.log(`  ${path.relative(REPO_ROOT, notesPath)}`);
  console.log(
    "\nThe narrative is at metadata.status: 'draft' and contains TODO\n" +
    'placeholders. Fill them in, then run `npm run build` to verify the\n' +
    'registry picks it up and the research page renders. The schema and\n' +
    'evidence rules are in:'
  );
  console.log('  cinematic-language/narrative-ingestion-workflow.md');
}

main().catch((err) => fail(err && err.message ? err.message : String(err)));
