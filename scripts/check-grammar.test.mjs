/*
  scripts/check-grammar.test.mjs
  ------------------------------
  Negative + positive tests for the M38 composite grammar gate (check-grammar.js):
  a single gate that only ever passes proves nothing, so EACH of the four
  constraints is violated in turn and the composite must reject it, and a fully
  clean input must pass. Also proves the composite composes (does not duplicate)
  the M37 predicates. Dependency-free (Node stdlib), no DOM.
  Run: npm run test:grammar.
*/
import assert from 'node:assert/strict';
import { evaluateGrammar } from './check-grammar.js';

let n = 0;
const failsOn = (label, inputs, constraintPart) => {
  const { groups, ok } = evaluateGrammar(inputs);
  assert.equal(ok, false, `${label}: composite should have rejected`);
  const hit = groups.find((g) => g.violations.length > 0);
  assert.ok(hit, `${label}: expected a failing constraint`);
  if (constraintPart) assert.ok(hit.constraint.includes(constraintPart), `${label}: expected constraint ~"${constraintPart}", got "${hit.constraint}"`);
  n++;
};

// A fully clean world — every constraint holds.
const CLEAN = {
  cinematicJs: [{ name: 'main.js', src: `import gsap from 'gsap';\nexport function arrive(){ /* enter place */ }` }],
  cinematicCss: [{ name: 'style.css', src: `.stage{position:fixed}h1{color:#fff}` }],
  cinematicHtml: [{ name: 'places/x.html', src: `<!-- research: notes/x.html -->\n<div class="stage"></div>` }],
  subjectSurfaces: [{ name: 'r.css', src: `@view-transition{navigation:auto}\nh1{view-transition-name:eke-subject}` }],
  allCss: [{ name: 'r.css', src: `h1{view-transition-name:eke-subject}` }, { name: 'atlas.css', src: `@view-transition{navigation:auto}` }],
  allJs: [{ name: 'field-record.js', src: `evidenceLink.href = BASE + 'evidence/' + slug + '.html'; // declarative anchor` }],
};

// Positive: the clean world passes, and the composite reports exactly 4 constraints.
{
  const { groups, ok } = evaluateGrammar(CLEAN);
  assert.equal(ok, true, `clean world should pass, got ${JSON.stringify(groups)}`);
  assert.equal(groups.length, 4, 'composite reports all four constraints');
  n += 2;
}

// 1. affordance placement (D3): a cross-depth import in the cinematic runtime.
failsOn('D3 cross-depth import', { ...CLEAN,
  cinematicJs: [{ name: 'main.js', src: `import { interactionWebModel } from '../atlas/interaction-web.js';` }],
}, 'affordance placement');

// 1b. affordance placement (D3): a real cross-depth <a> in a place shell.
failsOn('D3 shell cross-depth link', { ...CLEAN,
  cinematicHtml: [{ name: 'places/x.html', src: `<a href="evidence/x.html">ledger</a>` }],
}, 'affordance placement');

// 2. subject morph (D9): a transition surface missing eke-subject.
failsOn('D9 missing morph', { ...CLEAN,
  subjectSurfaces: [{ name: 'r.css', src: `@view-transition{navigation:auto}\nh1{color:#000}` }],
}, 'subject morph');

// 3. subject invariant (D1): a foreign view-transition-name somewhere in production.
failsOn('D1 foreign subject identity', { ...CLEAN,
  allCss: [{ name: 'atlas.css', src: `.hero{view-transition-name:not-the-subject}` }],
}, 'subject invariant');

// 4. depth discreteness (D2): programmatic cross-depth navigation.
failsOn('D2 programmatic cross-depth nav', { ...CLEAN,
  allJs: [{ name: 'field-record.js', src: `onScroll(() => { location.href = 'evidence/epr-vents.html'; });` }],
}, 'depth discreteness');

// D2 must NOT flag a declarative anchor .href assignment (the sanctioned form).
{
  const { ok } = evaluateGrammar({ ...CLEAN,
    allJs: [{ name: 'field-record.js', src: `const a = document.createElement('a'); a.href = BASE + 'evidence/' + slug + '.html';` }],
  });
  assert.equal(ok, true, 'declarative anchor href must not be flagged as depth crossing');
  n++;
}

// Cinematic same-depth arrival (index → places) must NOT be flagged by D2.
{
  const { ok } = evaluateGrammar({ ...CLEAN,
    allJs: [{ name: 'main.js', src: `location.href = 'places/crossing.html'; // cinematic arrival, same depth` }],
  });
  assert.equal(ok, true, 'same-depth cinematic arrival to places/ must not be a depth crossing');
  n++;
}

console.log(`check-grammar.test: PASS (${n} checks; the single composite gate rejects each of the four grammar constraints and passes a clean world)`);
