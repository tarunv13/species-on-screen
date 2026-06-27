/**
 * Amazon várzea · Arapaima, flood-pulse concentration.
 *
 * The Amazon várzea is one of the most productive freshwater ecosystems
 * on Earth, governed by an annual flood pulse that drowns the forest for
 * four to six months. Arapaima gigas — the largest scaled freshwater fish
 * in the world — disperse across the floodplain at high water and
 * concentrate in drying oxbow lakes as water retreats. Their obligate
 * air-breathing, which allows survival in hypoxic low-water conditions,
 * also announces their position to Ribeirinho fishers at dawn.
 *
 * Schema: cinematic-language/ecological-narrative.example.ts
 * Registry: cinematic-language/narrative-registry.ts
 * DwC-A: public/dwca/amazon-varzea/ (OCC:4, REL:3, REL:7)
 */

import type { EcologicalNarrative } from '../ecological-narrative.example';

const narrative: EcologicalNarrative = {
  id: 'amazon-varzea-arapaima-flood-pulse',
  place: {
    id: 'amazon-varzea',
    name: 'Amazon várzea',
    type: 'seasonally flooded forest',
    countries: ['Brazil', 'Peru', 'Colombia'],
    coordinates: { latitude: -3.17, longitude: -59.17 },
    editorialPlaceLine:
      'A white-water floodplain forest drowned for months each year by the Amazon.'
  },
  species: {
    id: 'arapaima-gigas',
    commonName: 'arapaima',
    scientificName: 'Arapaima gigas',
    taxonomy: { family: 'Arapaimidae', order: 'Osteoglossiformes', class: 'Actinopterygii' },
    iucnStatus: 'data_deficient'
  },
  observation: {
    summary:
      'Arapaima gigas, obligate air-breathers, disperse across the várzea at high ' +
      'water and concentrate in shrinking oxbow lakes as the dry season contracts ' +
      'the floodplain — each surface breath audible to Ribeirinho fishers by canoe ' +
      'at dawn.',
    type: 'seasonal_pattern',
    year: [1980, 2024]
  },
  sources: [
    {
      kind: 'field_report',
      title: 'The Fishes and the Forest: Explorations in Amazonian Natural History',
      authors: ['Goulding, M.'],
      organization: 'University of California Press',
      year: 1980
    },
    {
      kind: 'peer_reviewed',
      title: 'Lateral migration of Arapaima gigas in Amazon floodplains',
      authors: ['Castello, L.'],
      journal: 'Ecology of Freshwater Fish',
      year: 2008
    },
    {
      kind: 'peer_reviewed',
      title:
        'The sustainability of arapaima fisheries in floodplain lakes of the Amazon',
      authors: ['Castello, L.', 'Stewart, D.J.', 'Arantes, C.C.'],
      journal: 'Journal of Applied Ichthyology',
      year: 2009
    }
  ],
  editorial: {
    fragment: 'what the flood disperses, the dry season concentrates',
    body:
      'The Amazon rises six to ten metres between January and July, drowning ' +
      'the forest floor and pushing fish into what was once canopy. Arapaima gigas ' +
      '— reaching three metres and the largest scaled freshwater fish in the world ' +
      '— follow the flood outward across the várzea. Ceiba trees stand root-deep ' +
      'in warm brown water; fruit falls directly into the current; tambaqui gather ' +
      'at the margins to feed on seeds. This is Goulding\'s "fishes and the forest": ' +
      'a growing season conducted underwater.\n\n' +
      'As water retreats, arapaima concentrate in oxbow lakes and contracting ' +
      'channels. They breathe air obligately, surfacing every five to fifteen ' +
      'minutes; in the hypoxic black water of a shrinking lake, that capacity is ' +
      'the only reason they survive. But each breath announces their position. ' +
      'Ribeirinho communities working by canoe at dawn learn to read that sound. ' +
      'The community-managed pirarucu fisheries of the central Amazon — among ' +
      'the earliest co-managed freshwater fisheries in South America — are built ' +
      'on this predictability: a megafish driven to the surface by physiology, ' +
      'concentrated by geography, and counted by voice.',
    voice: 'editorial team'
  },
  metadata: {
    schemaVersion: '1',
    contributor: 'tarunv13',
    created: '2026-06-27',
    updated: '2026-06-27',
    status: 'draft'
  }
};

export default narrative;
