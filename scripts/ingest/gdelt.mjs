/*
  GDELT news for the field-record "current coverage" layer.
  ---------------------------------------------------------
  Queries the public GDELT 2.0 DOC API for recent English-language news
  about a landscape, so the scrollytelling can surface dated, sourced
  coverage (the "media as the joint" between the pristine record and the
  present). GDELT monitors ~100k sources worldwide in near-real-time.

  No key required. Rate limit: one request / ~5s (the runner throttles).
  GDELT DOC API: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
*/

const DOC = 'https://api.gdeltproject.org/api/v2/doc/doc';

function fmtDate(seen) {
  // "20260620T161500Z" -> "2026-06-20"
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(seen || '');
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}

/**
 * Fetch recent English news for a GDELT query.
 * Returns { ok, articles:[{title,url,domain,date,country}] }.
 */
export async function fetchNews(query, max = 8) {
  const url = `${DOC}?query=${encodeURIComponent(query)}`
    + `&mode=ArtList&maxrecords=${Math.min(max * 3, 40)}&format=json&sort=DateDesc&timespan=12months`;
  let json = null;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'species-on-screen/ingest (research, non-commercial)' } });
    const text = await res.text();
    if (/please limit requests/i.test(text)) return { ok: false, rateLimited: true, articles: [] };
    json = JSON.parse(text);
  } catch (e) { return { ok: false, articles: [] }; }
  const seenDomains = new Set();
  const articles = [];
  for (const a of (json.articles || [])) {
    if ((a.language || '').toLowerCase() !== 'english') continue;
    const key = a.domain + '|' + (a.title || '').slice(0, 40);
    if (seenDomains.has(key)) continue;
    seenDomains.add(key);
    articles.push({
      title: (a.title || '').trim(),
      url: a.url,
      domain: a.domain,
      date: fmtDate(a.seendate),
      country: a.sourcecountry || '',
    });
    if (articles.length >= max) break;
  }
  return { ok: true, articles };
}
