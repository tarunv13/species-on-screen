#!/usr/bin/env node
/*
  scripts/check-grammar.js
  ------------------------
  The SINGLE composite grammar gate (M38 / D10): one command that rejects any
  change violating any of the four Observatory v2 grammar constraints. It
  COMPOSES the M37 predicates (cinematic-grammar.mjs) and the two additional
  ones (grammar-constraints.mjs) — it does not re-implement their logic.

    1. affordance placement (D3)  cinematic runtime hosts no depth affordance
    2. subject morph        (D9)  every depth-transition surface carries eke-subject
    3. subject invariant    (D1)  eke-subject is the ONLY subject identity anywhere
    4. depth discreteness   (D2)  no programmatic cross-depth navigation (scroll
                                  never crosses depth; movement is declarative)

  A violation of ANY constraint fails the gate. Dependency-free (Node stdlib).
  Wired into prebuild, verify, and the CI workflow. Exit 0 iff all four hold.
*/
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import {
  findCinematicJsAffordances,
  findCinematicCssTransitions,
  findHtmlCrossDepthLinks,
  findMissingSubjectMorph,
} from './cinematic-grammar.mjs';
import { findForeignSubjectNames, findScrollDepthCrossing } from './grammar-constraints.mjs';

// Pure evaluation over provided file contents, so the composite is unit-testable
// with fixtures for each constraint. Each input is a list of { name, src }.
export function evaluateGrammar(inputs) {
  const list = (k) => (inputs[k] || []);
  const groups = [
    {
      constraint: 'affordance placement (D3)',
      violations: [
        ...list('cinematicJs').flatMap((f) => findCinematicJsAffordances(f.name, f.src)),
        ...list('cinematicCss').flatMap((f) => findCinematicCssTransitions(f.name, f.src)),
        ...list('cinematicHtml').flatMap((f) => findHtmlCrossDepthLinks(f.name, f.src)),
      ],
    },
    {
      constraint: 'subject morph (D9)',
      violations: list('subjectSurfaces').flatMap((f) => findMissingSubjectMorph(f.name, f.src)),
    },
    {
      constraint: 'subject invariant (D1)',
      violations: list('allCss').flatMap((f) => findForeignSubjectNames(f.name, f.src)),
    },
    {
      constraint: 'depth discreteness (D2)',
      violations: list('allJs').flatMap((f) => findScrollDepthCrossing(f.name, f.src)),
    },
  ];
  return { groups, ok: groups.every((g) => g.violations.length === 0) };
}

// ---- CLI: read the real surfaces and evaluate --------------------------------
function main() {
  const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const rel = (p) => path.relative(REPO_ROOT, p);
  const load = (p) => ({ name: rel(p), src: readFileSync(p, 'utf8') });
  const dir = (d, ext) => (existsSync(path.join(REPO_ROOT, d))
    ? readdirSync(path.join(REPO_ROOT, d)).filter((f) => f.endsWith(ext)).map((f) => path.join(REPO_ROOT, d, f))
    : []);
  const exists = (p) => existsSync(p);

  const cinematicJs = [path.join(REPO_ROOT, 'src', 'main.js'), ...dir('src/places', '.js')].filter(exists).map(load);
  const cinematicCss = [path.join(REPO_ROOT, 'src', 'style.css'), ...dir('src/places', '.css')].filter(exists).map(load);
  const cinematicHtml = dir('places', '.html').map(load);
  const subjectSurfaces = [
    path.join(REPO_ROOT, 'src', 'notes', 'research-article.css'),
    path.join(REPO_ROOT, 'src', 'atlas', 'field-record.css'),
    path.join(REPO_ROOT, 'scripts', 'build-evidence.mjs'),
  ].filter(exists).map(load);
  // Every production stylesheet (+ the ledger generator) for the single-subject
  // invariant — test fixtures under scripts/*.test.mjs are deliberately excluded.
  const allCss = [
    ...dir('src', '.css'), ...dir('src/places', '.css'), ...dir('src/atlas', '.css'), ...dir('src/notes', '.css'),
    path.join(REPO_ROOT, 'scripts', 'build-evidence.mjs'),
  ].filter(exists).map(load);
  // Every surface runtime for depth-discreteness.
  const allJs = [
    path.join(REPO_ROOT, 'src', 'main.js'),
    ...dir('src/places', '.js'), ...dir('src/atlas', '.js'), ...dir('src/notes', '.js'),
  ].filter(exists).map(load);

  const { groups, ok } = evaluateGrammar({ cinematicJs, cinematicCss, cinematicHtml, subjectSurfaces, allCss, allJs });

  if (!ok) {
    const total = groups.reduce((n, g) => n + g.violations.length, 0);
    console.error(`\ncheck-grammar: ${total} grammar violation(s) across ${groups.filter((g) => g.violations.length).length} constraint(s).\n`);
    for (const g of groups) {
      if (!g.violations.length) continue;
      console.error(`  ✗ ${g.constraint}`);
      for (const v of g.violations) console.error(`      - [${v.kind}] ${v.file}${v.match ? `  ⟶  ${v.match}` : ''}`);
    }
    console.error('');
    process.exit(1);
  }

  console.log(
    'check-grammar: ok — all four grammar constraints hold ' +
    '(affordance placement D3 · subject morph D9 · subject invariant D1 · depth discreteness D2)'
  );
}

// Run main() only when invoked as a script (not when imported by the test).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
