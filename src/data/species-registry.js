/**
 * Species Registry - Central registry of all flagship species
 * Each entry provides metadata for globe markers, navigation, and data fetching.
 */
export const SPECIES = [
  {
    id: 'tiger',
    commonName: 'Tiger',
    scientificName: 'Panthera tigris',
    iucnStatus: 'EN',
    ecosystem: 'Tropical Forest',
    coordinates: [
      { lat: 26.8, lng: 81.0, label: 'India - Terai Arc' },
      { lat: 2.5, lng: 102.5, label: 'Sumatra, Indonesia' },
      { lat: 45.0, lng: 135.0, label: 'Russian Far East' }
    ],
    accentColor: '#d4a574',
    gbifTaxonKey: 5219404,
    omdbSearchTerms: ['tiger wildlife', 'tiger documentary']
  },
  {
    id: 'snow-leopard',
    commonName: 'Snow Leopard',
    scientificName: 'Panthera uncia',
    iucnStatus: 'VU',
    ecosystem: 'Mountain',
    coordinates: [
      { lat: 35.0, lng: 75.0, label: 'Himalayas, Pakistan' },
      { lat: 42.5, lng: 78.0, label: 'Tien Shan, Kyrgyzstan' },
      { lat: 47.0, lng: 90.0, label: 'Altai Mountains, Mongolia' }
    ],
    accentColor: '#e8e4f0',
    gbifTaxonKey: 2435099,
    omdbSearchTerms: ['snow leopard', 'ghost cat']
  },
  {
    id: 'orangutan',
    commonName: 'Bornean Orangutan',
    scientificName: 'Pongo pygmaeus',
    iucnStatus: 'CR',
    ecosystem: 'Tropical Forest',
    coordinates: [
      { lat: 1.5, lng: 110.0, label: 'Borneo, Malaysia' },
      { lat: 0.5, lng: 117.0, label: 'East Kalimantan, Indonesia' },
      { lat: 2.0, lng: 113.0, label: 'Sarawak, Malaysia' }
    ],
    accentColor: '#d4a574',
    gbifTaxonKey: 5707396,
    omdbSearchTerms: ['orangutan', 'ape documentary']
  },
  {
    id: 'hawksbill-turtle',
    commonName: 'Hawksbill Turtle',
    scientificName: 'Eretmochelys imbricata',
    iucnStatus: 'CR',
    ecosystem: 'Ocean/Coral Reef',
    coordinates: [
      { lat: 16.7, lng: -88.5, label: 'Mesoamerican Reef, Belize' },
      { lat: -10.0, lng: 142.0, label: 'Great Barrier Reef, Australia' },
      { lat: 4.0, lng: 73.0, label: 'Maldives' }
    ],
    accentColor: '#8ecae6',
    gbifTaxonKey: 5220203,
    omdbSearchTerms: ['sea turtle', 'ocean documentary']
  },
  {
    id: 'blue-whale',
    commonName: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    iucnStatus: 'EN',
    ecosystem: 'Ocean',
    coordinates: [
      { lat: -35.0, lng: -72.0, label: 'Chilean Coast' },
      { lat: 34.0, lng: -120.0, label: 'California Coast, USA' },
      { lat: 8.0, lng: 80.0, label: 'Sri Lanka' },
      { lat: -55.0, lng: -60.0, label: 'Antarctic Peninsula' }
    ],
    accentColor: '#8ecae6',
    gbifTaxonKey: 2440290,
    omdbSearchTerms: ['blue whale', 'whale documentary']
  },
  {
    id: 'african-elephant',
    commonName: 'African Elephant',
    scientificName: 'Loxodonta africana',
    iucnStatus: 'EN',
    ecosystem: 'Savanna',
    coordinates: [
      { lat: -2.5, lng: 34.5, label: 'Serengeti, Tanzania' },
      { lat: -19.0, lng: 25.0, label: 'Chobe, Botswana' },
      { lat: -1.5, lng: 37.0, label: 'Amboseli, Kenya' }
    ],
    accentColor: '#d4a574',
    gbifTaxonKey: 5219426,
    omdbSearchTerms: ['elephant documentary', 'african elephant']
  },
  {
    id: 'polar-bear',
    commonName: 'Polar Bear',
    scientificName: 'Ursus maritimus',
    iucnStatus: 'VU',
    ecosystem: 'Arctic',
    coordinates: [
      { lat: 78.0, lng: 16.0, label: 'Svalbard, Norway' },
      { lat: 58.7, lng: -94.0, label: 'Churchill, Canada' },
      { lat: 71.0, lng: -156.0, label: 'Beaufort Sea, Alaska' }
    ],
    accentColor: '#e8e4f0',
    gbifTaxonKey: 5219441,
    omdbSearchTerms: ['polar bear', 'arctic documentary']
  },
  {
    id: 'giant-panda',
    commonName: 'Giant Panda',
    scientificName: 'Ailuropoda melanoleuca',
    iucnStatus: 'VU',
    ecosystem: 'Temperate Forest',
    coordinates: [
      { lat: 30.7, lng: 103.0, label: 'Sichuan, China' },
      { lat: 33.5, lng: 108.0, label: 'Qinling Mountains, China' },
      { lat: 29.5, lng: 103.5, label: 'Wolong Reserve, China' }
    ],
    accentColor: '#a8c5a0',
    gbifTaxonKey: 5219393,
    omdbSearchTerms: ['panda documentary', 'giant panda']
  },
  {
    id: 'coral-reef',
    commonName: 'Staghorn Coral',
    scientificName: 'Acropora cervicornis',
    iucnStatus: 'CR',
    ecosystem: 'Coral Reef',
    coordinates: [
      { lat: 24.5, lng: -81.8, label: 'Florida Keys, USA' },
      { lat: 18.0, lng: -87.5, label: 'Caribbean Sea' },
      { lat: -16.5, lng: 145.5, label: 'Great Barrier Reef, Australia' }
    ],
    accentColor: '#8ecae6',
    gbifTaxonKey: 2290576,
    omdbSearchTerms: ['coral reef', 'ocean documentary']
  },
  {
    id: 'amazon-river-dolphin',
    commonName: 'Amazon River Dolphin',
    scientificName: 'Inia geoffrensis',
    iucnStatus: 'EN',
    ecosystem: 'Freshwater',
    coordinates: [
      { lat: -3.1, lng: -60.0, label: 'Amazon River, Brazil' },
      { lat: -4.0, lng: -73.0, label: 'Peruvian Amazon' },
      { lat: 4.0, lng: -67.0, label: 'Orinoco Basin, Venezuela' }
    ],
    accentColor: '#e8a0c0',
    gbifTaxonKey: 2440727,
    omdbSearchTerms: ['river dolphin', 'amazon documentary']
  }
];
