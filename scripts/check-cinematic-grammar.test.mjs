/*
  scripts/check-cinematic-grammar.test.mjs
  ----------------------------------------
  Negative + positive tests for the M37 grammar gate (cinematic-grammar.mjs):
  a gate that only ever passes proves nothing, so every failure mode is exercised
  with a deliberately-broken fixture, and every clean shape is asserted to pass.
  Dependency-free (Node stdlib), no DOM. Run: npm run test:cinematic-grammar.
*/
import assert from 'node:assert/strict';
import {
  stripJsComments,
  findCinematicJsAffordances,
  findCinematicCssTransitions,
  findHtmlCrossDepthLinks,
  findMissingSubjectMorph,
} from './cinematic-grammar.mjs';

let n = 0;
const clean = (label, arr) => { assert.equal(arr.length, 0, `${label}: expected clean, got ${JSON.stringify(arr)}`); n++; };
const caught = (label, arr, kindPart) => {
  assert.ok(arr.length > 0, `${label}: expected a violation, got none`);
  if (kindPart) assert.ok(arr.some((v) => v.kind.includes(kindPart)), `${label}: expected kind ~"${kindPart}", got ${JSON.stringify(arr.map((v) => v.kind))}`);
  n++;
};

// --- comment stripping: prose references must not count -----------------------
clean('block comment naming notes/ is stripped',
  findCinematicJsAffordances('c.js', `/*\n  Research surface: notes/foo.html — not referenced.\n*/\nconst x = 1;`));
clean('line comment naming evidence/ is stripped',
  findCinematicJsAffordances('c.js', `// see evidence/foo.html\nexport const y = 2;`));
assert.ok(stripJsComments(`const u = 'http://purl.obolibrary.org/obo/RO_1';`).includes('http://'), 'string URLs survive stripping');
n++;

// --- D3: cinematic JS affordances (each failure mode) ------------------------
caught('cross-depth import caught',
  findCinematicJsAffordances('c.js', `import { interrogationChain } from '../../scripts/evidence-interrogate.mjs';`), 'import');
caught('atlas module import caught',
  findCinematicJsAffordances('c.js', `import { interactionWebModel } from '../atlas/interaction-web.js';`), 'import');
caught('evidential logic identifier caught',
  findCinematicJsAffordances('c.js', `const s = classifyReach(v, codes);`), 'logic');
caught('cross-depth navigation string caught',
  findCinematicJsAffordances('c.js', `a.href = 'evidence/epr-vents.html';`), 'navigation');
caught('interrogate affordance caught',
  findCinematicJsAffordances('c.js', `el.classList.add('interrogate');`), 'interrogate');
clean('clean cinematic JS passes',
  findCinematicJsAffordances('c.js', `import gsap from 'gsap';\nconst caption = document.querySelector('.page-caption');\nexport function arrive(){}`));

// --- D3: cinematic CSS must have no view transition --------------------------
caught('@view-transition in cinematic css caught',
  findCinematicCssTransitions('p.css', `@view-transition{navigation:auto}\n.stage{color:#000}`), 'view-transition');
caught('eke-subject in cinematic css caught',
  findCinematicCssTransitions('p.css', `h1{view-transition-name:eke-subject}`), 'eke-subject');
clean('clean cinematic css passes',
  findCinematicCssTransitions('p.css', `.stage{position:fixed}h1{color:#fff}`));

// --- D3: place-shell HTML cross-depth links ----------------------------------
caught('real cross-depth <a> in shell caught',
  findHtmlCrossDepthLinks('s.html', `<body><a href="evidence/epr-vents.html">ledger</a></body>`), 'cross-depth link');
clean('commented cross-depth ref in shell is ignored',
  findHtmlCrossDepthLinks('s.html', `<!-- Research surface: notes/foo.html -->\n<body><div class="stage"></div></body>`));
clean('non-cross-depth links in shell pass',
  findHtmlCrossDepthLinks('s.html', `<a href="places/crossing.html">enter</a>`));

// --- D9: subject morph on depth-transition surfaces --------------------------
clean('surface with opt-in + eke-subject passes',
  findMissingSubjectMorph('r.css', `@view-transition{navigation:auto}\n#narrative header h1{view-transition-name:eke-subject}`));
caught('missing @view-transition caught',
  findMissingSubjectMorph('r.css', `h1{view-transition-name:eke-subject}`), 'missing @view-transition');
caught('missing eke-subject caught',
  findMissingSubjectMorph('r.css', `@view-transition{navigation:auto}\nh1{color:#000}`), 'missing view-transition-name');
caught('foreign view-transition-name caught',
  findMissingSubjectMorph('r.css', `@view-transition{navigation:auto}\nh1{view-transition-name:eke-subject}\n.x{view-transition-name:something-else}`), 'foreign view-transition-name');

console.log(`cinematic-grammar.test: PASS (${n} checks; D3 affordance-sink + D9 subject-morph invariants both discriminate)`);
