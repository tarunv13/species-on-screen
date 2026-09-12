/*
  The media citation bar — V1.6.

  A media record enters the archive ONLY with a stable, re-pullable identifier.
  No identifier, no row. This is citation-or-skip applied to depictions, and it
  is enforced here rather than trusted to whoever writes a harvester next.

  The bar is a pure function so it can be unit-tested and so every harvester
  must pass through the same gate. A source adapter cannot admit a record by
  being careless; it has to satisfy this module.

  WHY A BARE URL IS NOT AN IDENTIFIER

  A URL names a location, not a thing. It rots: the page moves, the site
  reorganises, the host lapses. An accession number, a TMDB id, a DOI and a
  YouTube video id all name the *record*, survive the site being redesigned,
  and let a later reader re-pull the same item. The archive already refuses a
  guessed DOI (Bates et al. 2005, M31/M32); this refuses a guessed permanence.

  WHY NFTs ARE REFUSED OUTRIGHT

  Not on taste. A token's "provenance" is a ledger entry pointing at a URL or
  an IPFS hash that nobody is obliged to keep pinned; the artwork can vanish
  while the token persists, which is the exact inversion of what an identifier
  is for. They would be the first uncited thing in this archive.

  THE TWO SENSITIVE CLASSES ARE GATED ON ABSENCE, NOT ONLY ON PRESENCE

  For illegal wildlife trade, the bar rejects any record that CARRIES a
  locality, route, price or market field at all — it does not merely decline to
  render them. A trafficking geography is as dangerous as a camera-trap
  coordinate (SENSITIVE-DATA-POLICY rule 1), and a field that never enters the
  file cannot leak from it later when some future renderer iterates over keys
  it did not anticipate.

  For zoonosis, the bar rejects risk scores, probabilities and prediction
  framing for the same structural reason: this is the easiest place in the
  whole project to over-claim, and "documented host association" is a fact
  while "spillover risk 0.7" is a model output wearing a fact's clothes.
*/

/** Identifier schemes admissible for each media class. */
export const ACCEPTED = {
  film:         ['tmdb', 'imdb'],
  series:       ['tmdb', 'imdb'],
  documentary:  ['tmdb', 'imdb'],
  game:         ['steam_appid', 'igdb', 'publisher_catalogue'],
  video:        ['platform_id'],
  artwork:      ['accession'],
  illustration: ['bhl_page', 'plate_citation'],
  trade_listing:['cites_appendix', 'traffic_report', 'unodc_report'],
  zoonosis:     ['doi', 'pmid', 'who', 'woah'],
};

/** Never admissible, whatever else is supplied. */
export const REFUSED_SCHEMES = ['nft', 'token_id', 'contract_address', 'url', 'bare_url', 'link'];

/** Fields a trade record must not carry, at all. */
export const TRADE_FORBIDDEN_FIELDS = [
  'locality', 'location', 'route', 'routes', 'price', 'prices', 'value',
  'market', 'markets', 'vendor', 'seller', 'coordinates', 'lat', 'lng', 'port',
];

/** Fields a zoonosis record must not carry, at all. */
export const ZOONOSIS_FORBIDDEN_FIELDS = [
  'risk', 'risk_score', 'probability', 'likelihood', 'forecast', 'prediction',
  'predicted', 'spillover_risk', 'pandemic_potential', 'threat_level',
];

const URLISH = /^(https?:\/\/|www\.)/i;

/**
 * Decide whether a record may enter the archive.
 * @returns {{ok: true} | {ok: false, reason: string}}
 */
export function admit(rec) {
  if (!rec || typeof rec !== 'object') return { ok: false, reason: 'NOT_A_RECORD' };

  const cls = rec.class;
  if (!cls || !Object.prototype.hasOwnProperty.call(ACCEPTED, cls)) {
    return { ok: false, reason: 'UNKNOWN_CLASS' };
  }

  const id = rec.identifier;
  if (!id || typeof id !== 'object') return { ok: false, reason: 'NO_IDENTIFIER' };

  const scheme = String(id.scheme || '').toLowerCase();
  const value = id.value == null ? '' : String(id.value).trim();

  if (!scheme) return { ok: false, reason: 'NO_IDENTIFIER_SCHEME' };
  if (REFUSED_SCHEMES.includes(scheme)) {
    return { ok: false, reason: scheme === 'nft' || scheme === 'token_id' || scheme === 'contract_address'
      ? 'REFUSED_NFT' : 'REFUSED_BARE_URL' };
  }
  if (!value) return { ok: false, reason: 'EMPTY_IDENTIFIER' };
  if (URLISH.test(value)) return { ok: false, reason: 'REFUSED_BARE_URL' };
  if (!ACCEPTED[cls].includes(scheme)) return { ok: false, reason: 'SCHEME_NOT_VALID_FOR_CLASS' };

  // A video id alone is not re-pullable in practice: the same id means nothing
  // without the platform, and the channel + date are what let a reader confirm
  // they are looking at the same upload after a re-upload.
  if (cls === 'video') {
    if (!rec.platform) return { ok: false, reason: 'VIDEO_MISSING_PLATFORM' };
    if (!rec.channel) return { ok: false, reason: 'VIDEO_MISSING_CHANNEL' };
    if (!rec.uploaded) return { ok: false, reason: 'VIDEO_MISSING_UPLOAD_DATE' };
  }

  // An accession number is only an identifier inside a named collection.
  if (cls === 'artwork' && !rec.institution) {
    return { ok: false, reason: 'ARTWORK_MISSING_INSTITUTION' };
  }

  const keys = Object.keys(rec).map((k) => k.toLowerCase());
  if (cls === 'trade_listing') {
    const bad = keys.find((k) => TRADE_FORBIDDEN_FIELDS.includes(k));
    if (bad) return { ok: false, reason: `TRADE_CARRIES_SENSITIVE_FIELD:${bad}` };
  }
  if (cls === 'zoonosis') {
    const bad = keys.find((k) => ZOONOSIS_FORBIDDEN_FIELDS.includes(k));
    if (bad) return { ok: false, reason: `ZOONOSIS_CARRIES_PREDICTION_FIELD:${bad}` };
  }

  return { ok: true };
}

/** Partition a batch, keeping every refusal and its reason — the refusals are
 *  the evidence the bar works, so they are returned, never dropped. */
export function screen(records) {
  const admitted = [];
  const refused = [];
  for (const r of records || []) {
    const v = admit(r);
    if (v.ok) admitted.push(r);
    else refused.push({ reason: v.reason, title: (r && r.title) || '(untitled)', taxon: (r && r.taxon) || '', class: (r && r.class) || '' });
  }
  return { admitted, refused };
}
