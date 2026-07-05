# Curator worksheet — lifting the archives from L1 to L2/L3

**Generated** by `scripts/curator-worksheet.mjs` from the reference validator at L3.
Nothing here is fabricated — it is the real gap inventory. **Rule: never invent a DOI,
backbone-version, or date. If a value cannot be verified, leave the gap.** Regenerate after
any archive edit. See `.agents/decisions/2026-07-03-l3-conformance-data-model.md`.

## L2 — verify a persistent identifier for each source

There are **35 distinct source citations** that currently lack a DOI/URL in
`relationshipAccordingTo`. Find and confirm a resolving DOI (or stable URL) for each, then
replace the citation string in the relevant `resource-relationship.txt` rows. A wrong DOI is
worse than a citation string.

| Source citation (to verify) | Used by (archive/binding) |
|---|---|
| Bellwood et al. (2004); Hughes (1994); McClanahan & Shafir (1990) | coral-triangle/CORAL-TRIANGLE:REL:6 |
| Bellwood et al. (2006); Hoey & Bellwood (2008) | coral-triangle/CORAL-TRIANGLE:REL:5 |
| BirdLife International | sundarbans/SUNDARBANS:REL:6 |
| Bjorndal (1997); Limpus (2009) | coral-triangle/CORAL-TRIANGLE:REL:2 |
| Carter & Rosas (1997), giant otter ecology | amazon-varzea/AMAZON-VARZEA:REL:4 |
| Castello (2008), arapaima ecology | amazon-varzea/AMAZON-VARZEA:REL:3 |
| Castello et al. (2009), community pirarucu fishery | amazon-varzea/AMAZON-VARZEA:REL:7 |
| Cavanaugh et al. (1981); Felbeck (1981); Robidart et al. (2008) | epr-vents/EPR-VENTS:REL:1 |
| Cavanaugh et al. (1981); Lutz et al. (1994); Van Dover (2000) | epr-vents/EPR-VENTS:REL:9 |
| Chand & Dey (2008) | sundarbans/SUNDARBANS:REL:3 |
| Desbruyeres et al. (1998); Van Dover (2000) | epr-vents/EPR-VENTS:REL:3 |
| Gani (2003) | sundarbans/SUNDARBANS:REL:1 |
| Gani (2003); Jalais (2010) | sundarbans/SUNDARBANS:REL:9 |
| Gilman et al. (2010); Hamann et al. (2010) | coral-triangle/CORAL-TRIANGLE:REL:8 |
| Goulding (1980), The Fishes and the Forest | amazon-varzea/AMAZON-VARZEA:REL:2 |
| Hossain et al. (2019) | sundarbans/SUNDARBANS:REL:8 |
| Jalais (2010) | sundarbans/SUNDARBANS:REL:10 |
| Khan (2012) | sundarbans/SUNDARBANS:REL:2 |
| Khan (2012); Jhala et al. (2020) | sundarbans/SUNDARBANS:REL:7 |
| Loch et al. (2009), dolphin bycatch & folklore | amazon-varzea/AMAZON-VARZEA:REL:8 |
| Meylan (1988); Meylan & Meylan (2000) | coral-triangle/CORAL-TRIANGLE:REL:1 |
| Micheli et al. (2002) | epr-vents/EPR-VENTS:REL:4, epr-vents/EPR-VENTS:REL:5 |
| Micheli et al. (2002); Sancho et al. (2005) | epr-vents/EPR-VENTS:REL:6 |
| Mortimer & Donnelly (2008) | coral-triangle/CORAL-TRIANGLE:REL:10 |
| Mortimer & Donnelly (2008); León & Bjorndal (2002) | coral-triangle/CORAL-TRIANGLE:REL:3 |
| Mukherjee et al. (2012) | sundarbans/SUNDARBANS:REL:4, sundarbans/SUNDARBANS:REL:5 |
| Pratchett (2001); Pratchett et al. (2014) | coral-triangle/CORAL-TRIANGLE:REL:4 |
| Ramalho (2012), jaguar fishing behaviour | amazon-varzea/AMAZON-VARZEA:REL:6 |
| Rasher & Hay (2010); Barott et al. (2012); Bellwood et al. (2004) | coral-triangle/CORAL-TRIANGLE:REL:7 |
| Renton (2006), macaw foraging ecology | amazon-varzea/AMAZON-VARZEA:REL:1 |
| Sancho et al. (2005) | epr-vents/EPR-VENTS:REL:7, epr-vents/EPR-VENTS:REL:8 |
| TRAFFIC (2019); Mortimer & Donnelly (2008) | coral-triangle/CORAL-TRIANGLE:REL:9 |
| Van Dover (2000); Bates et al. (2005) | epr-vents/EPR-VENTS:REL:2 |
| Van Dover et al. (2018); Boschen et al. (2013) | epr-vents/EPR-VENTS:REL:10 |
| da Silva (2009), Inia ecology | amazon-varzea/AMAZON-VARZEA:REL:5 |

## L3 — pin the backbone version and date each binding

| Archive | bindings | need `dynamicProperties.backboneVersion` | need `relationshipEstablishedDate` |
|---|--:|--:|--:|
| amazon-varzea | 8 | 8 | 8 |
| coral-triangle | 10 | 10 | 10 |
| epr-vents | 10 | 10 | 10 |
| sundarbans | 10 | 10 | 10 |

- **Backbone version:** add the GBIF Backbone Taxonomy version/DOI **actually used at ingest**
  to each occurrence's `dynamicProperties` (`"backboneVersion": "…"`). Do not guess the snapshot.
- **Establishment date:** decide the semantic (source publication date vs record-assembly date),
  apply it consistently, and populate `relationshipEstablishedDate`.

## Verify progress

```sh
node scripts/check-bindings.js public/dwca/<slug> --level=L2   # 0 gaps when L2 done
node scripts/check-bindings.js public/dwca/<slug> --level=L3   # 0 gaps when L3 done
npm run build:evidence                                        # refresh the ledgers
```
