/*
  Pure derivation of cross-surface + cross-depth navigation from a Place
  Manifest place object (ADR-001). Extracted from render-narrative.js so it can
  be unit-tested in Node with plain fixtures — no DOM, no TypeScript imports.

  Order is the epistemic-depth axis from analytical to experiential to
  evidential, reproducing the historical output and then descending one stratum
  deeper: each field-record atlas ("Interaction web →"), each companion atlas
  ("Research companion →"), the cinematic place (its editorial enter label), and
  finally — the cross-depth descent — the evidence ledger ("Evidence ledger →"),
  present only when the place has a Darwin Core archive. A place with no manifest
  entry (research-only) yields no links.

  The generic labels are a research-surface convention (not per-place data), so
  they live here; only the place-specific cinematic label (`enterLabel`) comes
  from the manifest.
*/
export function surfaceLinksForPlace(place) {
  if (!place) return [];
  const s = place.surfaces || {};
  const atlas = s.atlas || [];
  const links = [];
  for (const a of atlas) {
    if (a.kind === 'field-record') links.push({ href: `../atlas/${a.slug}.html`, label: 'Interaction web →' });
  }
  for (const a of atlas) {
    if (a.kind === 'companion') links.push({ href: `../atlas/${a.slug}.html`, label: 'Research companion →' });
  }
  if (s.cinematic) {
    links.push({ href: `../places/${s.cinematic.slug}.html`, label: s.cinematic.enterLabel });
  }
  // Cross-depth descent to the evidential record: the evidence ledger, where
  // every interaction claim is traced to the Darwin Core records that license
  // it (traceability, not truth). Present only when the place has an archive.
  if (s.dwca && s.dwca.slug) {
    links.push({ href: `../evidence/${s.dwca.slug}.html`, label: 'Evidence ledger →' });
  }
  return links;
}
