# The enclave half

`mcl_enclave_harvest.py` runs **inside** the secure research environment. It is
the only file in this repository that cannot run on your own machine, and that
is not a limitation to work around — it is the shape of the access.

## Why this file is separate

The Meta Content Library API is served only from inside Meta's Secure Research
Environment or the ICPSR SOMAR Virtual Data Enclave, reached through Amazon
WorkSpaces Secure Browser, with all interaction happening in a Jupyter
notebook. `metacontentlibraryapi` is available there and nowhere else; it is
not on PyPI and is deliberately absent from `requirements.txt`.

A pipeline that pretended otherwise would produce a module that never runs and,
worse, a methods section describing a collection route the researcher does not
have.

## Getting access

Access is granted to vetted academic and non-profit researchers through the
Meta Transparency Center and ICPSR. You need an approved application, a
Facebook account, and the secure-environment credentials that come with the
grant. None of that is automatable and none of it is in this repository.

## The round trip

```
  enclave                                    your machine
  ───────                                    ────────────
  1. paste mcl_enclave_harvest.py
     into a notebook cell
  2. set CONFIG, run
  3. writes <label>.csv
            <label>.vetting.json
  4. read the CSV, confirm no
     user content
  5. set export_approved: true
  6. export both files  ─────────────────▶   research/var/mcl-imports/
                                             7. python -m sos_pipeline import-mcl
```

Both files travel together. The importer refuses an extract whose vetting
record is missing, incomplete, marked unapproved, or declares user content.

## What the script collects

Surface-level metadata and counts: account id, type, name, follower count,
verified status, country, URL, post count, first and last post dates, and the
set of languages observed. Optionally one row per post — with **no text**.

It does not collect post text, comment text, or reactions by individual. Two
independent reasons:

- The corpus does not need it. The questions this corpus asks are about how
  biodiversity is represented across platforms, which needs the account, the
  volume and the dates. Collecting more than the research question requires is
  exactly what `corpus-seed-framework.md` §8.8 rules out.
- The export rules do not generally permit it. CSV export covers widely-known
  accounts: Pages with at least 15,000 followers, public profiles with at least
  25,000 followers or verified status. The script applies those thresholds
  itself so an ineligible row never reaches the export queue.

## Limits

| Limit | Value |
|---|---|
| Synchronous searches | 60 per minute |
| Synchronous results | 1,000 per query, 10 per page |
| Asynchronous jobs | 1 per minute |
| Asynchronous results | 100,000 per job |
| Retrieval cap | 500,000 records per rolling 7 days, per researcher |

The retrieval cap is **combined**: CSV downloads you make from the Content
Library UI count against the same 500,000 as API pulls. Budget accordingly —
one careless 100,000-result job is a fifth of your week.

Use `mode: "sync"` while you are still shaping a query, and `mode: "async"` only
once the query is settled. A synchronous run of a few hundred results costs
almost nothing against the cap; a job does not.

## The API, as the script uses it

```python
from metacontentlibraryapi import MetaContentLibraryAPIClient as client
client.set_default_version(client.LATEST_VERSION)

# synchronous, paginated
response = client.get(path="facebook/posts/preview", params={"q": "Sundarbans mangrove"})
while client.has_next_page(response):
    response = client.query_next_page(response)

# asynchronous
response = client.post(path="facebook/posts/job", params={..., "mode": "SNAPSHOT"})
job = client.get_async_job(job_id=response.json()["id"])
job.get_status()
job.get_data()
job.write_data_to_file(directory=".", filename="extract")
```

Useful query parameters on the posts endpoints: `q`, `since`, `until`, `lang`,
`surface_ids` (max 250), `surface_types`, `content_types`, `fields`, `sort`,
`search_scope`. Searching image text is limited to roughly the trailing 180
days.

Collections group related queries and are worth setting up before a long study:

```python
client.post(path="async/collections", body={"name": "Species on Screen", "description": "..."})
client.post(path="async/queries/<query-id>", body={"collection_id": "<collection-id>"})
```

## Before you export

1. Open the CSV. Confirm no column carries post, comment or profile text.
2. Confirm every surface clears the widely-known-account threshold.
3. Set `export_approved` to `true` in the vetting record.
4. Download **both** files.

The vetting record is not paperwork. It is what lets a reader of the corpus a
year from now establish who carried which data out of which enclave under which
query, and that a person approved it. Without it the rows are unattributable,
and the importer treats unattributable rows as inadmissible.
