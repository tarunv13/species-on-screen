/**
 * Sendai \u00b7 Corvus corone, road-vehicle nut-cracking at signalised
 * pedestrian crossings.
 *
 * Temperate East Asian urban-fringe environment in northeastern
 * Honshu. Carrion crows on the campus of Tohoku University and at
 * adjacent intersections place walnuts on the road surface at
 * signalised pedestrian crossings, walk off, and recover the broken
 * kernels after passing vehicles crack the shells. Yoshiaki Nihei
 * recorded the behavior in the Sendai population in 1995; a 2001
 * follow-up with Hiroyoshi Higuchi placed the local origin of the
 * behavior at no later than 1990 and described its spatial spread
 * across the campus crossings.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'sendai-carrion-crow-traffic-nutcracking',
  place: {
    id: 'sendai-japan',
    name: 'Sendai',
    type: 'temperate East Asian urban-fringe',
    countries: ['Japan'],
    coordinates: { latitude: 38.26, longitude: 140.84 },
    editorialPlaceLine:
      'A river-basin city where the forest comes down to the streets.'
  },
  species: {
    id: 'corvus-corone',
    commonName: 'carrion crow',
    scientificName: 'Corvus corone',
    taxonomy: {
      family: 'Corvidae',
      order: 'Passeriformes',
      class: 'Aves'
    },
    iucnStatus: 'least_concern'
  },
  observation: {
    summary:
      'Carrion crows in Sendai have been observed placing walnuts ' +
      'on the road surface at signalised pedestrian crossings, ' +
      'allowing passing vehicles to crack the shells, and recovering ' +
      'the kernels during stopped traffic phases \u2014 a behavior ' +
      'first reported in this urban population in the early 1990s ' +
      'and tied to specific intersections on and near the campus of ' +
      'Tohoku University.',
    type: 'behavioral_adaptation',
    year: [1990, 2001]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Variations of behaviour of carrion crows Corvus corone ' +
        'using automobiles as nutcrackers',
      authors: ['Nihei, Y.'],
      journal: 'Japanese Journal of Ornithology',
      year: 1995
    },
    {
      kind: 'peer_reviewed',
      title:
        'When and where did crows learn to use automobiles as ' +
        'nutcrackers?',
      authors: ['Nihei, Y.', 'Higuchi, H.'],
      journal: 'Tohoku Psychologica Folia',
      year: 2001
    }
  ],
  editorial: {
    fragment: 'the wheel does what the beak does not',
    body:
      'Sendai is a city of roughly a million people in northeastern ' +
      'Honshu, threaded by the Hirose River and bordered to the west ' +
      'by forested foothills. Walnut trees grow in parks and on river ' +
      'terraces; carrion crows winter and breed across the city.\n\n' +
      'A walnut shell is harder than a carrion crow\u2019s beak. To ' +
      'eat the kernel, a crow must crack the shell \u2014 typically ' +
      'by carrying the nut to height and dropping it onto stone, ' +
      'repeatedly. The yield, per attempt, is poor.\n\n' +
      'Yoshiaki Nihei, working at the Sendai campus of Tohoku ' +
      'University in the early 1990s, recorded a different behavior. ' +
      'Carrion crows on the campus placed walnuts on the road ' +
      'surface at signalised pedestrian crossings, walked off, and ' +
      'waited. When the next pass of vehicles ran over the nut, the ' +
      'shell broke. The crow returned during the next stopped phase ' +
      'to recover the kernel. Nihei published the observation in ' +
      '1995; a follow-up with Hiroyoshi Higuchi in 2001 placed the ' +
      'start of the behavior in the local population at no later ' +
      'than 1990 and traced its spread to specific crossings.\n\n' +
      'The cars run on a schedule the crow can use.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: 'tarunv13',
    created: '2026-05-25',
    updated: '2026-05-25',
    status: 'verified'
  }
};

export default narrative;
