/*
  GloBI (Global Biotic Interactions) evidence for the field-record ingest.
  ------------------------------------------------------------------------
  For an editorial interaction (from -> type -> to), query GloBI for a
  matching record and capture its study citation, so the DwC-A
  ResourceRelationship row is sourced from real aggregated interaction
  data where it exists. Falls back to the literature citation in
  places.config.json when GloBI has no record for the pair (common for
  human-harvest and locally-specific interactions).

  GloBI API: https://github.com/globalbioticinteractions/globalbioticinteractions/wiki/API
  Interaction-type vocabulary aligns with OBO Relations Ontology (RO),
  the same terms used in the archive's resource-relationship.txt.
*/

const GLOBI = 'https://api.globalbioticinteractions.org';

// Our editorial types -> { GloBI interactionType, OBO RO id }.
export const RO = {
  pollinates: 'http://purl.obolibrary.org/obo/RO_0002455',
  eats: 'http://purl.obolibrary.org/obo/RO_0002470',
  preysOn: 'http://purl.obolibrary.org/obo/RO_0002439',
  interactsWith: 'http://purl.obolibrary.org/obo/RO_0002437',
};

/** GloBI/GBIF match best on the binomial; drop subspecies/infrasp. */
export const binomial = (name) => name.split(/\s+/).slice(0, 2).join(' ');

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

/**
 * Look for GloBI evidence of `from` `type` `to`.
 * The /interaction endpoint returns tabular JSON: { columns:[...], data:[[...],...] }.
 * Returns { found:boolean, citation:string|null, count:number }.
 */
export async function globiEvidence(fromName, toName, type) {
  const url = `${GLOBI}/interaction`
    + `?sourceTaxon=${encodeURIComponent(binomial(fromName))}`
    + `&targetTaxon=${encodeURIComponent(binomial(toName))}`
    + `&interactionType=${encodeURIComponent(type)}`
    + `&field=study_citation&limit=50`;
  const j = await getJSON(url);
  if (!j || !Array.isArray(j.data) || !j.data.length) return { found: false, citation: null, count: 0 };
  const col = Array.isArray(j.columns) ? j.columns.indexOf('study_citation') : 0;
  // Pick the first non-empty, human-readable citation.
  let cite = null;
  for (const row of j.data) {
    const c = (row[col >= 0 ? col : 0] || '').toString().trim();
    if (c && !/^https?:/i.test(c)) { cite = c; break; }
  }
  if (!cite) cite = 'Global Biotic Interactions (GloBI)';
  // Trim an over-long citation to its first sentence/author-year head.
  if (cite.length > 160) cite = cite.slice(0, 157).replace(/[\s,;]+\S*$/, '') + '…';
  return { found: true, citation: cite, count: j.data.length };
}
