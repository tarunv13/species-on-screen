/**
 * Santa Barbara Channel \u00b7 Macrocystis pyrifera, multi-decadal
 * canopy response to warm-water forcing.
 *
 * Eastern Pacific shelf system between the southern California
 * mainland and the northern Channel Islands. Giant kelp anchors on
 * shallow rock and forms canopies up to roughly thirty metres tall
 * where surface water stays cool and nutrient-rich. Tegner and
 * colleagues documented in 1995 that urchin grazing of holdfasts is
 * sufficient to convert large California forests into urchin
 * barrens; Edwards and Estes, in 2006, traced reduced Macrocystis
 * canopy across the northeast Pacific for years after warm-water
 * events; Cavanaugh and colleagues, working from the 1984-onward
 * Landsat record, showed giant-kelp biomass in the channel tracking
 * sea-surface temperature on inter-annual scales \u2014 long warm
 * intervals coincide with long low-canopy intervals.
 *
 * This file is one record. The schema is in
 * `../ecological-narrative.example.ts`. The runtime registry that
 * discovers this file is in `../narrative-registry.ts`.
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'santa-barbara-channel-giant-kelp-decline',
  place: {
    id: 'santa-barbara-channel',
    name: 'Santa Barbara Channel',
    type: 'temperate eastern Pacific kelp shelf',
    countries: ['United States'],
    protectedArea: 'Channel Islands National Marine Sanctuary',
    coordinates: { latitude: 34.05, longitude: -119.75 },
    editorialPlaceLine:
      'An island channel where the seaweed grows as tall as trees.'
  },
  species: {
    id: 'macrocystis-pyrifera',
    commonName: 'giant kelp',
    scientificName: 'Macrocystis pyrifera',
    taxonomy: {
      family: 'Laminariaceae',
      order: 'Laminariales',
      class: 'Phaeophyceae'
    },
    iucnStatus: 'not_evaluated'
  },
  observation: {
    summary:
      'Across the satellite-imagery record of the Santa Barbara ' +
      'Channel, canopy biomass of giant kelp Macrocystis pyrifera ' +
      'tracks sea-surface temperature on inter-annual scales \u2014 ' +
      'prolonged warm intervals coincide with prolonged low-canopy ' +
      'intervals \u2014 and recovery from warm-water events is ' +
      'further slowed where sea-urchin grazing of holdfasts has ' +
      'converted forest to barren.',
    type: 'population_trend',
    year: [1984, 2011]
  },
  sources: [
    {
      kind: 'peer_reviewed',
      title:
        'Sea urchin cavitation of giant kelp (Macrocystis pyrifera ' +
        'C. Agardh) holdfasts and its effects on kelp mortality ' +
        'across a large California forest',
      authors: [
        'Tegner, M. J.', 'Dayton, P. K.', 'Edwards, P. B.', 'Riser, K. L.'
      ],
      journal: 'Marine Biology',
      year: 1995
    },
    {
      kind: 'peer_reviewed',
      title:
        'Catastrophe, recovery and range limitation in NE Pacific ' +
        'kelp forests: a large-scale perspective',
      authors: ['Edwards, M. S.', 'Estes, J. A.'],
      journal: 'Marine Ecology Progress Series',
      year: 2006,
      doi: '10.3354/meps320079'
    },
    {
      kind: 'peer_reviewed',
      title:
        'Environmental controls of giant-kelp biomass in the Santa ' +
        'Barbara Channel, California',
      authors: [
        'Cavanaugh, K. C.', 'Siegel, D. A.', 'Reed, D. C.',
        'Dennison, P. E.'
      ],
      journal: 'Marine Ecology Progress Series',
      year: 2011,
      doi: '10.3354/meps09141'
    }
  ],
  editorial: {
    fragment: 'the rock is bare where the canopy was',
    body:
      'The Santa Barbara Channel runs about a hundred kilometres ' +
      'along the southern California coast, between the mainland ' +
      'and the northern Channel Islands. Where the rock comes within ' +
      'roughly thirty metres of the surface and the water stays ' +
      'cool, the giant kelp Macrocystis pyrifera anchors with a ' +
      'holdfast and grows a stipe upward at up to half a metre a ' +
      'day. The canopy, when it forms, can stand thirty metres tall.\n\n' +
      'The forest does not stand on rock alone. It stands on cold ' +
      'water, on nutrients delivered by upwelling, and on the ' +
      'absence of unchecked grazers. Tegner and colleagues reported ' +
      'in 1995 that sea-urchin grazing of Macrocystis holdfasts was ' +
      'by itself sufficient to convert a large California forest ' +
      'into a barren \u2014 the same rock, with no canopy on it.\n\n' +
      'Edwards and Estes documented in 2006 that across the ' +
      'northeast Pacific, Macrocystis canopy is reduced for years ' +
      'after warm-water events, and that recovery is not always to ' +
      'previous extent. Satellite monitoring of the Santa Barbara ' +
      'Channel from 1984 onward (Cavanaugh and colleagues, 2011) ' +
      'shows giant-kelp biomass tracking sea-surface temperature on ' +
      'inter-annual scales: long warm intervals coincide with long ' +
      'low-canopy intervals.\n\n' +
      'The eastern Pacific has warmed across the satellite era. ' +
      'The forests built on cold water track the change.',
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
