# Curator worksheet — the media archive

**Generated** by `scripts/curator-media-worksheet.mjs` from each place's media archive.
Regenerate after any harvest: `npm run media-archive && npm run curator-media-worksheet`.

> Every row below was refused by the citation bar or the stated relevance rule.
> **The bar is not to be loosened to clear this list.** Each row carries the identifier
> it would have used, so admitting one is a human judgement plus a known id — not a
> re-search. A refusal that is genuinely correct should simply be left here.


## sundarbans

Built 2026-09-12T06:15:18.348Z — **7 admitted**, **20 refused**.

### RELEVANCE_NOT_ESTABLISHED:name_absent_from_synopsis — 6

The title matched but the synopsis does not repeat the name. Often a title collision (a film called "Mud Crab" about an assault), sometimes just a terse synopsis. Read the synopsis before admitting.

| Year | Title | Taxon | Identifier | Admit? |
|---|---|---|---|---|
| 1936 | Bengal Tiger | _Panthera tigris tigris_ | `tmdb:371921` | ☐ |
| 2001 | Bengal tiger | _Panthera tigris tigris_ | `tmdb:571294` | ☐ |
| 2008 | Discovery :A Bengal Tiger's Motherly Love | _Panthera tigris tigris_ | `tmdb:1564047` | ☐ |
| 2014 | The Royal Bengal Tiger | _Panthera tigris tigris_ | `tmdb:262918` | ☐ |
| 2015 | Bengal Tiger | _Panthera tigris tigris_ | `tmdb:363152` | ☐ |
| 2022 | Mud Crab | _Scylla serrata_ | `tmdb:990762` | ☐ |

### RELEVANCE_NOT_ESTABLISHED:no_disease_term_in_title — 2

The taxon is in the title but no disease term is. Usually correct — a genome assembly is not zoonosis literature. Admit only if the paper really is about infection or host association.

| Year | Title | Taxon | Identifier | Admit? |
|---|---|---|---|---|
| 2019 | First draft genome assembly and identification of SNPs from hilsa shad ( Tenualosa ilisha) of the Bay of Bengal | _Tenualosa ilisha_ | `pmid:31602298` | ☐ |
| 2022 | Predicting multi-enzyme inhibition in the arachidonic acid metabolic network by Heritiera fomes extracts | _Heritiera fomes_ | `pmid:33283657` | ☐ |

### RELEVANCE_NOT_ESTABLISHED:taxon_absent_from_title — 12

The taxon name is not in the title. Frequently a TRUE POSITIVE — a documentary called "Tiger" is about tigers. Admit if the work is genuinely about this taxon.

| Year | Title | Taxon | Identifier | Admit? |
|---|---|---|---|---|
| 2004 | Tiger Cruise | _Panthera tigris tigris_ | `tmdb:51909` | ☐ |
| 2008 | Development of a management program for a mixed species wildlife park following an occurrence of malignant catarrhal fever | _Axis axis_ | `pmid:18817000` | ☐ |
| 2021 | Zoonotic diseases appeared to be a major hurdle to successful deer farming in Bangladesh | _Axis axis_ | `pmid:34840467` | ☐ |
| 2021 | Evaluation of haemoparasite and Sarcocystis infections in Australian wild deer | _Axis axis_ | `pmid:34277336` | ☐ |
| 2021 | The Conservation Game | _Panthera tigris tigris_ | `tmdb:833064` | ☐ |
| 2022 | Tuberculosis caused by Mycobacterium orygis in wild ungulates in Chennai, South India | _Axis axis_ | `pmid:35678472` | ☐ |
| 2022 | High Seroprevalence of SARS-CoV-2 in White-Tailed Deer (Odocoileus virginianus) at One of Three Captive Cervid Facilities in Texas | _Axis axis_ | `pmid:35319276` | ☐ |
| 2022 | The first molecular identification and phylogenetic analysis of tick-borne pathogens in captive wild animals from Lohi Bher zoo, Pakistan | _Panthera tigris tigris_ | `pmid:36114837` | ☐ |
| 2022 | The Tiger Rising | _Panthera tigris tigris_ | `tmdb:793269` | ☐ |
| 2024 | Tiger | _Panthera tigris tigris_ | `tmdb:1259918` | ☐ |
| 2025 | Tiger | _Panthera tigris tigris_ | `tmdb:1463564` | ☐ |
| 2026 | Hepatitis E Virus Exposure Across Multiple Host Species in a Shared Ecosystem in Argentina | _Axis axis_ | `pmid:41745973` | ☐ |

### Blocked on a credential, not on evidence

These classes are **absent, not empty**. Nothing was searched and found wanting; the
source could not be queried at all. Do not read an empty class as "no such records exist".

- games — IGDB needs Twitch OAuth (IGDB_CLIENT_ID/SECRET unset); Steam has no topical search
- illegal wildlife trade — CITES Species+ returns 401 without a token (none held). Appendix listings are NOT written from memory: a guessed appendix is the Bates et al. 2005 error with higher stakes.
- scientific illustration — BHL API returns 401 without a key (BHL_API_KEY unset)
- artworks beyond the Met — Smithsonian returns 403 without an api.data.gov key
- YouTube — credential failed: API key expired. Please renew the API key.. The video class is empty for a CREDENTIAL reason, not an evidential one.


---

**Standing refusal, not a backlog item:** CITES appendix listings are not to be written
from memory while Species+ is unavailable. The listings are well known, which is exactly
what makes it tempting; a guessed appendix is the Bates et al. 2005 error with higher
stakes, because a wrong protection status is a claim about what is legal.
