#!/usr/bin/env node
/*
  scripts/biome-backdrop.test.mjs
  --------------------------------
  Unit test for the biome-classification routing in the shared painterly
  backdrop engine (src/prototypes/biome-backdrop.js), consumed by the
  production atlas field-record surface (src/atlas/field-record.js). Runs
  in Node with no DOM: `keyFor` is a pure string-classification function,
  never touching canvas. Exit 0 iff all assertions pass.
*/
import { makeBackdrop } from '../src/prototypes/biome-backdrop.js';

let failures = 0;
const check = (name, cond) => { if (!cond) { failures++; console.error(`  FAIL: ${name}`); } };

const { keyFor } = makeBackdrop('/');

check('mangrove tidal forest -> mangrove', keyFor('Mangrove tidal forest') === 'mangrove');
check('seasonally flooded forest -> varzea', keyFor('Seasonally flooded forest') === 'varzea');
check('tropical coral reef system -> reef', keyFor('Tropical coral reef system') === 'reef');
check('hydrothermal vent field -> abyssal', keyFor('Hydrothermal vent field') === 'abyssal');
check('case-insensitive: HYDROTHERMAL VENT FIELD -> abyssal', keyFor('HYDROTHERMAL VENT FIELD') === 'abyssal');
check('bare "vent" -> abyssal', keyFor('Cold seep and vent community') === 'abyssal');
check('savanna grassland -> savanna', keyFor('Savanna grassland') === 'savanna');
check('unrecognised type -> default', keyFor('Alpine tundra') === 'default');
check('empty/missing type -> default', keyFor(undefined) === 'default');

if (failures) {
  console.error(`\nbiome-backdrop.test: FAIL — ${failures} assertion(s).\n`);
  process.exit(1);
}
console.log('biome-backdrop.test: PASS (biome classification routes every place type, including the vent field, to a diagnostic recipe)');
