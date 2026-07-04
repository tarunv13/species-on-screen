#!/usr/bin/env node
/*
  scripts/check-cinematic-grammar.js
  ----------------------------------
  Build gate for two Observatory v2 invariants (M37):

    D3  cinematic purity — the cinematic runtime (JS + CSS) and place shells host
        NO depth affordance (no cross-depth import / navigation / interrogate, no
        cross-document view-transition). The one-way bridge / affordance-sink.

    D9  the held-subject morph (view-transition-name: eke-subject) is present on
        every depth-transition surface, and is the only view-transition-name used.

  Reads the real surfaces and runs the pure predicates in cinematic-grammar.mjs.
  Dependency-free (Node stdlib). Exit 0 iff both invariants hold. Wired into
  prebuild (a build invariant) and verify.
*/
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  findCinematicJsAffordances,
  findCinematicCssTransitions,
  findHtmlCrossDepthLinks,
  findMissingSubjectMorph,
  SUBJECT_MORPH,
} from './cinematic-grammar.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => path.relative(REPO_ROOT, p);
const read = (p) => readFileSync(p, 'utf8');
const inDir = (dir, ext) => (existsSync(path.join(REPO_ROOT, dir))
  ? readdirSync(path.join(REPO_ROOT, dir)).filter((f) => f.endsWith(ext)).map((f) => path.join(REPO_ROOT, dir, f))
  : []);

// The cinematic surface (D3): the homepage + place canvas runtimes, their
// stylesheets, and the place HTML shells. index.html (the hub) is deliberately
// exempt from the shell-link check: its caption anchors are intentional no-JS
// fallbacks the runtime intercepts (documented in cinematic-grammar.mjs).
const cinematicJs = [path.join(REPO_ROOT, 'src', 'main.js'), ...inDir('src/places', '.js')];
const cinematicCss = [path.join(REPO_ROOT, 'src', 'style.css'), ...inDir('src/places', '.css')];
const cinematicHtml = inDir('places', '.html');

// The depth-transition surfaces that carry the held subject (D9). The evidence
// ledger's CSS lives inside its generator; it is read as text.
const subjectSurfaces = [
  path.join(REPO_ROOT, 'src', 'notes', 'research-article.css'),
  path.join(REPO_ROOT, 'src', 'atlas', 'field-record.css'),
  path.join(REPO_ROOT, 'scripts', 'build-evidence.mjs'),
];

const violations = [];

// D3
for (const f of cinematicJs) if (existsSync(f)) violations.push(...findCinematicJsAffordances(rel(f), read(f)));
for (const f of cinematicCss) if (existsSync(f)) violations.push(...findCinematicCssTransitions(rel(f), read(f)));
for (const f of cinematicHtml) if (existsSync(f)) violations.push(...findHtmlCrossDepthLinks(rel(f), read(f)));

// D9
for (const f of subjectSurfaces) {
  if (!existsSync(f)) { violations.push({ file: rel(f), kind: 'depth-transition subject surface is missing' }); continue; }
  violations.push(...findMissingSubjectMorph(rel(f), read(f)));
}

if (violations.length) {
  console.error(`\ncheck-cinematic-grammar: ${violations.length} grammar violation(s).\n`);
  for (const v of violations) console.error(`  - [${v.kind}] ${v.file}${v.match ? `  ⟶  ${v.match}` : ''}`);
  console.error('\n  D3: cinematic surfaces host no depth affordance. D9: every depth-transition surface carries the eke-subject morph.\n');
  process.exit(1);
}

console.log(
  `check-cinematic-grammar: ok (D3 cinematic purity across ${cinematicJs.length} js + ${cinematicCss.length} css + ${cinematicHtml.length} shells; ` +
  `D9 ${SUBJECT_MORPH} morph on ${subjectSurfaces.length} depth-transition surfaces)`
);
