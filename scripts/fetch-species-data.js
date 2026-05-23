#!/usr/bin/env node
/**
 * Species Data Fetch Script
 * Fetches taxonomy data from GBIF and media data from OMDb,
 * then writes JSON files to public/data/.
 * Includes comprehensive fallback data so it works without API keys.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'public/data');

// Dynamically import the species registry
const { SPECIES } = await import(resolve(ROOT, 'src/data/species-registry.js'));

const OMDB_API_KEY = process.env.OMDB_API_KEY || '';

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchGBIF(taxonKey) {
  try {
    const res = await fetch(`https://api.gbif.org/v1/species/${taxonKey}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchOMDb(searchTerms) {
  if (!OMDB_API_KEY) return null;
  try {
    const results = [];
    for (const term of searchTerms) {
      const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(term)}&type=movie`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.Search) results.push(...data.Search);
      }
    }
    return results.length > 0 ? results : null;
  } catch {
    return null;
  }
}

// Load pre-populated fallback data from existing JSON files if available
function loadFallback(id) {
  const filePath = resolve(DATA_DIR, `${id}.json`);
  if (existsSync(filePath)) {
    try {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

async function processSpecies(species) {
  console.log(`Processing: ${species.commonName} (${species.scientificName})...`);

  // Start with fallback data
  const fallback = loadFallback(species.id);

  // Try fetching from GBIF
  const gbifData = await fetchGBIF(species.gbifTaxonKey);

  // Try fetching from OMDb
  const omdbData = await fetchOMDb(species.omdbSearchTerms);

  // Build taxonomy from GBIF or use fallback
  let taxonomy = fallback?.taxonomy || {
    kingdom: 'Animalia',
    phylum: 'Chordata',
    class: '',
    order: '',
    family: '',
    genus: '',
    species: ''
  };

  if (gbifData) {
    taxonomy = {
      kingdom: gbifData.kingdom || taxonomy.kingdom,
      phylum: gbifData.phylum || taxonomy.phylum,
      class: gbifData.class || taxonomy.class,
      order: gbifData.order || taxonomy.order,
      family: gbifData.family || taxonomy.family,
      genus: gbifData.genus || taxonomy.genus,
      species: gbifData.species || taxonomy.species
    };
  }

  // Build media from OMDb or use fallback
  let media = fallback?.media || [];
  if (omdbData) {
    media = omdbData.slice(0, 5).map(item => ({
      title: item.Title,
      year: item.Year,
      type: 'movie',
      plot: '',
      imdbRating: '',
      poster: item.Poster !== 'N/A' ? item.Poster : ''
    }));
  }

  // Compose final data
  const output = {
    id: species.id,
    commonName: species.commonName,
    scientificName: species.scientificName,
    taxonomy,
    media,
    habitat: fallback?.habitat || { description: '', range: [], biome: species.ecosystem, keyLocations: [] },
    threats: fallback?.threats || [],
    conservationStatus: fallback?.conservationStatus || {
      iucnStatus: species.iucnStatus,
      population: '',
      trend: 'decreasing',
      keyPrograms: []
    },
    culturalSignificance: fallback?.culturalSignificance || { overview: '', cinema: [], literature: [], mythology: [], symbolism: '' },
    coordinates: species.coordinates,
    accentColor: species.accentColor,
    ecosystem: species.ecosystem
  };

  const outputPath = resolve(DATA_DIR, `${species.id}.json`);
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`  Written: ${outputPath}`);
}

// Main execution
console.log('Species Data Fetch Script');
console.log('=========================');
if (!OMDB_API_KEY) {
  console.log('Note: OMDB_API_KEY not set. Using fallback data for media entries.');
}
console.log(`Processing ${SPECIES.length} species...\n`);

for (const species of SPECIES) {
  await processSpecies(species);
}

console.log('\nDone! All species data files written to public/data/');

