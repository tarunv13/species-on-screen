/* Unit test for the media citation bar. Negative-tested per refusal reason:
   a gate that only ever says yes is not a gate. */
import { admit, screen } from './media-citation-bar.mjs';

let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { console.error('FAIL:', msg); process.exit(1); } };
const refuses = (rec, reason, msg) => {
  const v = admit(rec);
  ok(!v.ok && v.reason === reason, `${msg} (got ${v.ok ? 'ADMITTED' : v.reason})`);
};

// --- admits well-formed records, one per class -----------------------------
ok(admit({ class: 'film', identifier: { scheme: 'tmdb', value: '12345' }, title: 'x' }).ok, 'film + tmdb admitted');
ok(admit({ class: 'documentary', identifier: { scheme: 'imdb', value: 'tt0123456' } }).ok, 'doc + imdb admitted');
ok(admit({ class: 'game', identifier: { scheme: 'steam_appid', value: '440' } }).ok, 'game + steam admitted');
ok(admit({ class: 'artwork', identifier: { scheme: 'accession', value: '36.100.45' }, institution: 'The Met' }).ok, 'artwork + accession + institution admitted');
ok(admit({ class: 'video', identifier: { scheme: 'platform_id', value: 'abc' }, platform: 'YouTube', channel: 'c', uploaded: '2020-01-01' }).ok, 'video with platform+channel+date admitted');
ok(admit({ class: 'illustration', identifier: { scheme: 'bhl_page', value: '99' } }).ok, 'illustration + bhl admitted');
ok(admit({ class: 'trade_listing', identifier: { scheme: 'cites_appendix', value: 'Appendix I' }, listing: 'x' }).ok, 'trade + CITES admitted');
ok(admit({ class: 'zoonosis', identifier: { scheme: 'doi', value: '10.1000/x' }, host: 'y' }).ok, 'zoonosis + doi admitted');

// --- the identifier bar ----------------------------------------------------
refuses({ class: 'film', title: 'x' }, 'NO_IDENTIFIER', 'no identifier refused');
refuses({ class: 'film', identifier: { scheme: '', value: '1' } }, 'NO_IDENTIFIER_SCHEME', 'empty scheme refused');
refuses({ class: 'film', identifier: { scheme: 'tmdb', value: '  ' } }, 'EMPTY_IDENTIFIER', 'blank value refused');
refuses({ class: 'nope', identifier: { scheme: 'tmdb', value: '1' } }, 'UNKNOWN_CLASS', 'unknown class refused');
refuses({ class: 'film', identifier: { scheme: 'accession', value: '1' } }, 'SCHEME_NOT_VALID_FOR_CLASS', 'scheme/class mismatch refused');

// --- bare URLs and NFTs ----------------------------------------------------
refuses({ class: 'film', identifier: { scheme: 'url', value: 'x' } }, 'REFUSED_BARE_URL', 'url scheme refused');
refuses({ class: 'film', identifier: { scheme: 'tmdb', value: 'https://example.com/a' } }, 'REFUSED_BARE_URL', 'url-shaped value refused');
refuses({ class: 'artwork', identifier: { scheme: 'nft', value: '0xabc' }, institution: 'i' }, 'REFUSED_NFT', 'nft refused');
refuses({ class: 'artwork', identifier: { scheme: 'token_id', value: '7' }, institution: 'i' }, 'REFUSED_NFT', 'token id refused');
refuses({ class: 'artwork', identifier: { scheme: 'contract_address', value: '0x1' }, institution: 'i' }, 'REFUSED_NFT', 'contract address refused');

// --- video completeness ----------------------------------------------------
refuses({ class: 'video', identifier: { scheme: 'platform_id', value: 'a' }, channel: 'c', uploaded: '2020-01-01' }, 'VIDEO_MISSING_PLATFORM', 'video without platform refused');
refuses({ class: 'video', identifier: { scheme: 'platform_id', value: 'a' }, platform: 'YouTube', uploaded: '2020-01-01' }, 'VIDEO_MISSING_CHANNEL', 'video without channel refused');
refuses({ class: 'video', identifier: { scheme: 'platform_id', value: 'a' }, platform: 'YouTube', channel: 'c' }, 'VIDEO_MISSING_UPLOAD_DATE', 'video without upload date refused');
refuses({ class: 'artwork', identifier: { scheme: 'accession', value: '1' } }, 'ARTWORK_MISSING_INSTITUTION', 'artwork without institution refused');

// --- the sensitive classes are gated on ABSENCE ----------------------------
for (const f of ['locality', 'route', 'price', 'market', 'vendor', 'lat']) {
  const rec = { class: 'trade_listing', identifier: { scheme: 'cites_appendix', value: 'Appendix I' } };
  rec[f] = 'anything';
  refuses(rec, `TRADE_CARRIES_SENSITIVE_FIELD:${f}`, `trade record carrying ${f} refused`);
}
for (const f of ['risk', 'probability', 'prediction', 'spillover_risk', 'threat_level']) {
  const rec = { class: 'zoonosis', identifier: { scheme: 'doi', value: '10.1/x' } };
  rec[f] = 0.7;
  refuses(rec, `ZOONOSIS_CARRIES_PREDICTION_FIELD:${f}`, `zoonosis record carrying ${f} refused`);
}

// --- screen() keeps refusals, never drops them -----------------------------
const { admitted, refused } = screen([
  { class: 'film', identifier: { scheme: 'tmdb', value: '1' }, title: 'keeper' },
  { class: 'film', title: 'no id' },
  { class: 'artwork', identifier: { scheme: 'nft', value: '0x' }, institution: 'i', title: 'token' },
]);
ok(admitted.length === 1, 'screen admits exactly the valid record');
ok(refused.length === 2, 'screen keeps both refusals');
ok(refused.every((r) => r.reason && r.title), 'each refusal carries a reason and a title');

console.log(`media-citation-bar.test: PASS (${checks} checks; every refusal reason discriminates, and the two sensitive classes reject on field presence)`);
