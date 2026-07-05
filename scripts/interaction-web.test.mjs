/*
  scripts/interaction-web.test.mjs
  --------------------------------
  Black-box test of the D4 interaction-web model (src/atlas/interaction-web.js):
  proves each "follow" edge is RO-typed from the controlled IRI, is lateral
  (points at an actor at the same depth), and is derived from the relationship
  records — never faked. Dependency-free (Node stdlib), no DOM.
  Run: npm run test:interaction-web.
*/
import assert from 'node:assert/strict';
import { interactionWebModel, isRoIri } from '../src/atlas/interaction-web.js';

let n = 0;
const ok = (label, cond) => { assert.ok(cond, label); n++; };

// --- controlled IRI recognition (mirrors the validator) ---------------------
ok('valid RO PURL is typed', isRoIri('http://purl.obolibrary.org/obo/RO_0002470'));
ok('https RO PURL is typed', isRoIri('https://purl.obolibrary.org/obo/RO_0002455'));
ok('RO PURL with surrounding space is typed', isRoIri('  http://purl.obolibrary.org/obo/RO_0002439  '));
ok('non-RO IRI is untyped', !isRoIri('http://example.org/eats'));
ok('bare term is untyped', !isRoIri('eats'));
ok('empty / null is untyped', !isRoIri('') && !isRoIri(null) && !isRoIri(undefined));

// --- the model ---------------------------------------------------------------
const actors = [
  { id: 'OCC:1', vern: 'Sundri', sci: 'Heritiera fomes' },
  { id: 'OCC:2', vern: 'Giant honey bee', sci: 'Apis dorsata' },
  { id: 'OCC:3', vern: 'Spotted deer', sci: 'Axis axis' },
];
const rels = [
  { from: 'OCC:2', to: 'OCC:1', type: 'pollinates', roid: 'http://purl.obolibrary.org/obo/RO_0002455', according: 'Gani (2003)' },
  { from: 'OCC:3', to: 'OCC:1', type: 'eats', roid: 'http://purl.obolibrary.org/obo/RO_0002470', according: 'Khan (2012)' },
  { from: 'OCC:3', to: 'OCC:2', type: 'interactsWith', roid: 'not-an-iri', according: '' },
];
const model = interactionWebModel(actors, rels);

ok('one node per actor', model.length === 3);

// Node OCC:1 (Sundri) is the object of two edges → both are incoming ('in').
const sundri = model.find((m) => m.id === 'OCC:1');
ok('Sundri has 2 edges', sundri.edges.length === 2);
ok('Sundri edges are all incoming', sundri.edges.every((e) => e.dir === 'in'));
ok('Sundri follow-targets are the subjects', sundri.edges.map((e) => e.otherId).sort().join() === 'OCC:2,OCC:3');

// A typed edge carries the exact controlled IRI (verbatim), never faked.
const pollinates = model.find((m) => m.id === 'OCC:2').edges.find((e) => e.otherId === 'OCC:1');
ok('honey-bee→sundri edge is outgoing', pollinates.dir === 'out');
ok('typed edge keeps its RO IRI verbatim', pollinates.typed === true && pollinates.iri === 'http://purl.obolibrary.org/obo/RO_0002455');
ok('typed edge names its relation', pollinates.relType === 'pollinates');
ok('typed edge follows to the object actor', pollinates.otherId === 'OCC:1' && pollinates.otherVern === 'Sundri');

// An edge whose relationshipOfResourceID is not a controlled IRI is UNTYPED —
// marked, never given a fabricated IRI.
const untyped = model.find((m) => m.id === 'OCC:3').edges.find((e) => e.otherId === 'OCC:2');
ok('non-RO edge is untyped', untyped.typed === false && untyped.iri === null);
ok('untyped edge still names its (uncontrolled) term', untyped.relType === 'interactsWith');

// Follow is lateral: every follow-target is a real actor id in the same set
// (same depth) — never a cross-depth reference.
const ids = new Set(actors.map((a) => a.id));
ok('every follow-target is an actor at the same depth', model.every((node) => node.edges.every((e) => ids.has(e.otherId))));

// Derived-only: an unknown neighbour id falls back to the id (no crash, no fake).
const orphan = interactionWebModel([{ id: 'X', vern: 'X' }], [{ from: 'X', to: 'GHOST', type: 'eats', roid: 'http://purl.obolibrary.org/obo/RO_0002470' }]);
ok('missing neighbour degrades to its id', orphan[0].edges[0].otherVern === 'GHOST');

// Defensive: bad input never throws.
ok('empty inputs → empty model', interactionWebModel(undefined, undefined).length === 0);

console.log(`interaction-web.test: PASS (${n} checks; follow edges are RO-typed, lateral, and derived from the records)`);
