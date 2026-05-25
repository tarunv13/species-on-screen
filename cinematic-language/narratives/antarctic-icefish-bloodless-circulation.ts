/**
 * Antarctic Peninsula shelf · blackfin icefish, bloodless circulation.
 *
 * Channichthyidae — the family of Antarctic icefishes — are the only
 * known vertebrates without functional haemoglobin or circulating
 * red blood cells. Oxygen moves through the body dissolved directly
 * in plasma. The trait is viable only because Antarctic shelf water
 * is unusually rich in dissolved oxygen and consistently near
 * freezing, paired with extensive cardiovascular and metabolic
 * compensations in the fishes themselves. Outside that envelope,
 * the same body cannot deliver enough oxygen to live.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'antarctic-icefish-bloodless-circulation',
  place: {
    id: 'antarctic-peninsula-shelf',
    name: 'Antarctic Peninsula shelf',
    type: 'polar continental shelf',
    countries: ['Antarctica'],
    protectedArea: 'Antarctic Treaty area',
    coordinates: { latitude: -64.5, longitude: -64.0 },
    editorialPlaceLine:
      'A continental shelf where cold became part of the body plan.'
  },
  species: {
    id: 'chaenocephalus-aceratus',
    commonName: 'blackfin icefish',
    scientificName: 'Chaenocephalus aceratus',
    taxonomy: { family: 'Channichthyidae', order: 'Perciformes', class: 'Actinopterygii' },
    iucnStatus: 'data_deficient'
  },
  observation: {
    summary:
      'The blackfin icefish, like every member of family ' +
      'Channichthyidae, has lost functional haemoglobin and ' +
      'circulating red blood cells; oxygen moves through its body ' +
      'dissolved directly in plasma — a vertebrate trait recorded ' +
      'in no other family, viable only in the cold, oxygen-rich ' +
      'water of the Antarctic continental shelf.',
    type: 'habitat_dependency',
    year: [1954, 2006]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title: 'Vertebrates without erythrocytes and blood pigment',
      authors: ['Ruud, J. T.'],
      journal: 'Nature',
      year: 1954
    },
    {
      kind: 'peer_reviewed',
      title:
        'When bad things happen to good fish: the loss of ' +
        'hemoglobin and myoglobin expression in Antarctic icefishes',
      authors: ['Sidell, B. D.', 'O\u2019Brien, K. M.'],
      journal: 'Journal of Experimental Biology',
      year: 2006
    },
    {
      kind: 'peer_reviewed',
      title:
        'A genomic fossil reveals key steps in hemoglobin loss by ' +
        'the Antarctic icefishes',
      authors: ['Near, T. J.', 'Parker, S. K.', 'Detrich, H. W. III'],
      journal: 'Molecular Biology and Evolution',
      year: 2006
    }
  ],
  editorial: {
    fragment: 'blood that runs without red',
    body:
      'The blackfin icefish is taken from the Antarctic continental ' +
      'shelf at depths of roughly 200 metres, in seas that hold ' +
      'close to freezing for the entire year.\n\n' +
      'In 1954, Johan Ruud reported in Nature that its blood ' +
      'contained no haemoglobin and no functioning red blood ' +
      'cells: oxygen moved through the body dissolved directly in ' +
      'plasma. No other vertebrate family has been found with the ' +
      'same trait.\n\n' +
      'The fish manages because the surrounding water is unusually ' +
      'rich in dissolved oxygen, because its metabolism is slow, ' +
      'because its heart is enlarged, and because its blood is ' +
      'unusually voluminous. Move it into warmer water, and the ' +
      'same body cannot carry enough oxygen to live. The trait is ' +
      'local to the cold.',
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
