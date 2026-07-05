#!/usr/bin/env node
/*
  scripts/check-bindings.test.mjs
  -------------------------------
  Black-box conformance harness for the reference validator. It runs
  scripts/check-bindings.js against the versioned conformance corpus
  (test/conformance/) at EACH conformance level in the contract and asserts that
  the emitted per-binding verdicts and reason-code sets exactly match
  test/conformance/expected.json.

  This is the reference implementation's self-test AND the definition of what it
  means to conform: any independent implementation is conformant at a level iff,
  run over the same corpus at that level, it produces the same verdict and the
  same reason-code set for every binding (founding spec §4/§5).

  Dependency-free (Node stdlib). Exit 0 iff every verdict matches at every level.
*/
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const CORPUS = path.join(REPO_ROOT, 'test', 'conformance');

const contract = JSON.parse(readFileSync(path.join(CORPUS, 'expected.json'), 'utf8')).levels;

const sameSet = (a, b) => {
  const x = [...a].sort();
  const y = [...b].sort();
  return x.length === y.length && x.every((v, i) => v === y[i]);
};

const env = {
  ...process.env,
  EKE_MANIFEST: path.join(CORPUS, 'manifest.json'),
  EKE_DWCA_ROOT: path.join(CORPUS, 'dwca'),
};

const failures = [];
let totalChecked = 0;

for (const [level, expected] of Object.entries(contract)) {
  const run = spawnSync('node', ['scripts/check-bindings.js', '--json', `--level=${level}`], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: { ...env, EKE_LEVEL: level },
  });

  if (run.error) {
    failures.push(`${level}: could not run validator — ${run.error.message}`);
    continue;
  }
  let records;
  try {
    records = JSON.parse(run.stdout);
  } catch {
    failures.push(`${level}: validator did not emit valid JSON — ${(run.stderr || run.stdout || '').trim()}`);
    continue;
  }

  const seen = new Set();
  for (const r of records) {
    const key = `${r.archive}/${r.id}`;
    seen.add(key);
    totalChecked++;
    const exp = expected[key];
    if (!exp) { failures.push(`${level} ${key}: unexpected binding (not in contract)`); continue; }
    if (r.verdict !== exp.verdict) {
      failures.push(`${level} ${key}: verdict ${r.verdict} != expected ${exp.verdict}`);
    } else if (!sameSet(r.reasons, exp.reasons)) {
      failures.push(`${level} ${key}: reasons [${r.reasons.join(', ')}] != expected [${exp.reasons.join(', ')}]`);
    }
  }
  for (const key of Object.keys(expected)) {
    if (!seen.has(key)) failures.push(`${level} ${key}: missing (expected by contract, not emitted)`);
  }
}

if (failures.length) {
  console.error(`\ncheck-bindings.test: FAIL — ${failures.length} mismatch(es).\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-bindings.test: PASS (${totalChecked} binding-checks across ${Object.keys(contract).length} ` +
  `conformance level${Object.keys(contract).length === 1 ? '' : 's'} match the contract)`
);
