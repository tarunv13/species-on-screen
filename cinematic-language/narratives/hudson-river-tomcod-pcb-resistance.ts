/**
 * Hudson River \u00b7 Atlantic tomcod, PCB resistance via AHR2 deletion.
 *
 * Temperate Atlantic tidal estuary in eastern North America.
 * Between 1947 and 1977, two General Electric capacitor plants on
 * the upper Hudson at Hudson Falls and Fort Edward discharged an
 * estimated 600,000 kilograms of polychlorinated biphenyls into the
 * river; the contamination reached the tidal lower estuary and
 * persisted in the sediment. Wirgin and colleagues reported in
 * Science in 2011 that nearly every Hudson tomcod they sequenced
 * carries a six-base-pair deletion in the aryl hydrocarbon receptor 2
 * (AHR2) gene, lowering the receptor\u2019s binding affinity for PCBs
 * by roughly an order of magnitude. The variant is rare in tomcod
 * from cleaner reaches of the Atlantic seaboard and at near-fixation
 * in the Hudson \u2014 a genetic adaptation evolved within a single
 * documented industrial-exposure window.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'hudson-river-tomcod-pcb-resistance',
  place: {
    id: 'hudson-river',
    name: 'Hudson River',
    type: 'temperate Atlantic tidal estuary',
    countries: ['United States'],
    coordinates: { latitude: 41.50, longitude: -73.96 },
    editorialPlaceLine:
      'A river whose chemistry was rewritten in living memory.'
  },
  species: {
    id: 'microgadus-tomcod',
    commonName: 'Atlantic tomcod',
    scientificName: 'Microgadus tomcod',
    taxonomy: { family: 'Gadidae', order: 'Gadiformes', class: 'Actinopterygii' },
    iucnStatus: 'least_concern'
  },
  observation: {
    summary:
      'Atlantic tomcod from the Hudson River carry, at near-fixation ' +
      'in the population, a six-base-pair deletion in the aryl ' +
      'hydrocarbon receptor 2 (AHR2) gene that lowers the receptor\u2019s ' +
      'binding affinity for polychlorinated biphenyls and confers ' +
      'resistance to the developmental toxicity of PCBs \u2014 a ' +
      'genetic adaptation that arose during roughly fifty years of ' +
      'sustained industrial discharge into the river and is rare in ' +
      'tomcod from less contaminated waters of the Atlantic seaboard.',
    type: 'threat_dynamic',
    year: [1989, 2011]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Mechanistic basis of resistance to PCBs in Atlantic tomcod ' +
        'from the Hudson River',
      authors: [
        'Wirgin, I.', 'Roy, N. K.', 'Loftus, M.', 'Chambers, R. C.',
        'Franks, D. G.', 'Hahn, M. E.'
      ],
      journal: 'Science',
      year: 2011,
      doi: '10.1126/science.1197296'
    },
    {
      kind: 'peer_reviewed',
      title:
        'Evidence of spatially extensive resistance to PCBs in an ' +
        'anadromous fish of the Hudson River',
      authors: [
        'Yuan, Z.', 'Courtenay, S.', 'Chambers, R. C.', 'Wirgin, I.'
      ],
      journal: 'Environmental Health Perspectives',
      year: 2006,
      doi: '10.1289/ehp.8458'
    },
    {
      kind: 'field_report',
      title:
        'Second Five-Year Review Report for the Hudson River PCBs ' +
        'Superfund Site',
      authors: ['U.S. Environmental Protection Agency, Region 2'],
      organization: 'U.S. Environmental Protection Agency',
      year: 2019
    }
  ],
  editorial: {
    fragment: 'the receptor changed before the river did',
    body:
      'The Hudson River drains roughly 35,000 square kilometres of ' +
      'New York and New England before reaching the Atlantic past ' +
      'Manhattan. Between 1947 and 1977, two General Electric ' +
      'capacitor plants on the upper river \u2014 at Hudson Falls and ' +
      'Fort Edward \u2014 discharged an estimated 600,000 kilograms of ' +
      'polychlorinated biphenyls into the water. The lower river is ' +
      'tidal; the contamination reached the estuary and persisted in ' +
      'the sediment.\n\n' +
      'The Atlantic tomcod is a small, bottom-dwelling cod that ' +
      'spawns in the lower Hudson in late winter. PCBs at the ' +
      'levels measured in the river are acutely toxic to fish ' +
      'embryos: they bind the aryl hydrocarbon receptor and ' +
      'disrupt early development.\n\n' +
      'Wirgin and colleagues reported in Science in 2011 that ' +
      'almost every Hudson tomcod they sequenced carried a ' +
      'six-base-pair deletion in the AHR2 gene. The deletion ' +
      'lowers the receptor\u2019s binding affinity for PCBs by ' +
      'roughly an order of magnitude. In tomcod from cleaner ' +
      'reaches of the Atlantic seaboard the variant is rare; in ' +
      'the Hudson it is at near-fixation.\n\n' +
      'The exposure window \u2014 roughly fifty years of sustained ' +
      'discharge \u2014 overlaps the rise of the variant. The PCBs ' +
      'themselves remain. Sediment remediation of the upper Hudson ' +
      'began in 2009 and is ongoing.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: 'tarunv13',
    created: '2026-05-25',
    updated: '2026-05-25',
    status: 'draft'
  }
};

export default narrative;
