/*
  GBIF enrichment for the field-record ingest.
  --------------------------------------------
  Given a scientific name, returns authoritative taxonomy (the GBIF
  backbone) and, where available, a real occurrence coordinate inside the
  place's bounding box. Pure HTTP against the public GBIF API
  (https://www.gbif.org/developer/summary) — no key required.

  Used by build-dwca.mjs to fill the Occurrence-core taxonomy columns and
  the decimalLatitude/Longitude with attested values rather than guesses.
*/

const GBIF = 'https://api.gbif.org/v1';

async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'species-on-screen/ingest (research, non-commercial)' } });
      if (res.ok) return await res.json();
    } catch (e) { /* retry */ }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return null;
}

/** Authoritative taxonomy from the GBIF backbone. */
export async function gbifMatch(name) {
  const m = await getJSON(`${GBIF}/species/match?name=${encodeURIComponent(name)}`);
  if (!m || m.matchType === 'NONE') return null;
  return {
    usageKey: m.usageKey || null,
    canonicalName: m.canonicalName || m.scientificName || name,
    taxonRank: (m.rank || 'SPECIES').toLowerCase(),
    kingdom: m.kingdom || '',
    phylum: m.phylum || '',
    class: m.class || '',
    order: m.order || '',
    family: m.family || '',
    matchType: m.matchType,
  };
}

/**
 * A representative georeferenced occurrence inside [west,south,east,north].
 * Returns { lat, lng, count } or null. Uses GBIF's coordinate range filters.
 */
export async function gbifOccurrenceInBbox(taxonKey, bbox) {
  if (!taxonKey) return null;
  const [w, s, e, n] = bbox;
  const url = `${GBIF}/occurrence/search?taxonKey=${taxonKey}`
    + `&hasCoordinate=true&hasGeospatialIssue=false`
    + `&decimalLatitude=${s},${n}&decimalLongitude=${w},${e}&limit=1`;
  const r = await getJSON(url);
  if (!r || !r.results || !r.results.length) return { lat: null, lng: null, count: r ? r.count : 0 };
  const o = r.results[0];
  return { lat: o.decimalLatitude, lng: o.decimalLongitude, count: r.count };
}

export const gbifSpeciesUrl = (key) => (key ? `https://www.gbif.org/species/${key}` : '');
