"""
Meta Content Library harvest — the enclave half.

RUN THIS INSIDE THE SECURE RESEARCH ENVIRONMENT, NOT ON YOUR LAPTOP.

Paste this file into a Python notebook cell inside Meta's Secure Research
Environment or the ICPSR SOMAR Virtual Data Enclave, set the CONFIG block, and
run. It produces two files in the enclave:

    <label>.csv           the extract
    <label>.vetting.json  the record of who exported what, from where, under
                          which query, and that the export was approved

Download that pair through the approved export channel and drop both into
`research/var/mcl-imports/` on your own machine. Then:

    python -m sos_pipeline import-mcl

The importer refuses any extract whose vetting record is missing, incomplete,
or marks the export unapproved, so the pair travels together or not at all.

What this script deliberately does not collect
---------------------------------------------
Post text, comment text, reactions by individual, or any other user content.
The extract is surface-level metadata plus counts. Two reasons, and they are
independent:

  The corpus does not need it. `corpus-seed-framework.md` §8.8 admits only what
  serves a stated research question, and the questions this corpus asks are
  about how biodiversity is *represented across platforms* — which needs the
  account, the volume and the dates, not the wording of any one post.

  The export rules do not permit it in general. CSV export from the Content
  Library covers widely-known accounts: Facebook Pages with at least 15,000
  followers, and public profiles with at least 25,000 followers or a verified
  status. This script applies those thresholds itself, so an ineligible row
  never reaches the export queue.

Limits, as documented
---------------------
  synchronous search      60 per minute, 1,000 results per query, 10 per page
  asynchronous jobs       1 per minute, 100,000 results per job
  retrieval cap           500,000 records per rolling 7 days, per researcher,
                          combining API pulls and CSV downloads from the UI
"""

from __future__ import annotations

import csv
import json
import time
from datetime import datetime, timezone

# ============================================================
# CONFIG — edit this block, then run the cell
# ============================================================

CONFIG = {
    # A short label; becomes the filenames.
    "label": "sundarbans-mangrove-2020-2025",
    # Who is running this, for the vetting record. Your ICPSR/Meta researcher id.
    "exported_by": "",
    # "meta-sre" or "icpsr-somar"
    "enclave": "meta-sre",
    # The Content Library dataset you were granted.
    "dataset_id": "1119037145491882",
    # Query. `q` searches post text.
    "query": "Sundarbans mangrove",
    "since": "2020-01-01",
    "until": "2025-12-31",
    # ISO 639-1 codes, comma separated, or "" for all.
    "lang": "",
    # Which surfaces to include: page, profile, group, event.
    "surface_types": ["page", "group"],
    # "surface" aggregates to one row per account. "post" keeps one row per post
    # with no text. Prefer "surface".
    "unit_of_analysis": "surface",
    # "sync" is capped at 1,000 results. "async" submits a job, up to 100,000.
    "mode": "sync",
    # Safety valve for a synchronous run.
    "max_results": 1000,
}

PAGE_FOLLOWER_THRESHOLD = 15000
PROFILE_FOLLOWER_THRESHOLD = 25000

SURFACE_COLUMNS = [
    "surface_id",
    "surface_type",
    "surface_name",
    "surface_followers",
    "surface_verified",
    "surface_country",
    "surface_url",
    "post_count",
    "first_post_date",
    "last_post_date",
    "languages_observed",
    "query_label",
]

POST_COLUMNS = [
    "post_id",
    "surface_id",
    "surface_type",
    "surface_name",
    "surface_followers",
    "creation_time",
    "post_url",
    "lang",
    "country",
]

# Fields requested from the API. Nothing here is post text, by construction.
REQUESTED_FIELDS = [
    "id",
    "surface.id",
    "surface.name",
    "surface.type",
    "surface.followers_count",
    "surface.verified_status",
    "surface.country",
    "surface.url",
    "creation_time",
    "lang",
    "post_url",
]


# ============================================================
# Harvest
# ============================================================


def _client():
    """Import the enclave client. Fails loudly and usefully outside the enclave."""
    try:
        from metacontentlibraryapi import MetaContentLibraryAPIClient as client
    except ImportError as exc:  # pragma: no cover - only reachable outside the enclave
        raise SystemExit(
            "metacontentlibraryapi is not importable. This script runs inside Meta's Secure "
            "Research Environment or the ICPSR SOMAR Virtual Data Enclave, in a notebook. "
            "It cannot run on a personal machine."
        ) from exc
    client.set_default_version(client.LATEST_VERSION)
    return client


def _params() -> dict:
    params = {
        "q": CONFIG["query"],
        "since": CONFIG["since"],
        "until": CONFIG["until"],
        "fields": REQUESTED_FIELDS,
        "search_scope": "post_text_only",
        "sort": "oldest_to_newest",
    }
    if CONFIG.get("lang"):
        params["lang"] = CONFIG["lang"]
    if CONFIG.get("surface_types"):
        params["surface_types"] = CONFIG["surface_types"]
    return params


def harvest_sync(client) -> list[dict]:
    """
    Paginated synchronous search.

    Ten results per page, one thousand per query. The sleep keeps the run inside
    the documented 60-searches-per-minute ceiling with room to spare; the API is
    shared infrastructure and the budget is the researcher's own.
    """
    params = _params()
    print(f"sync search: {json.dumps({k: v for k, v in params.items() if k != 'fields'})}")

    response = client.get(path="facebook/posts/preview", params=params)
    collected: list[dict] = []

    while True:
        body = response.json()
        page = body.get("data", []) or []
        collected.extend(page)
        print(f"  +{len(page)} (total {len(collected)})")

        if len(collected) >= int(CONFIG["max_results"]):
            print(f"  stopping at max_results={CONFIG['max_results']}")
            break
        if not client.has_next_page(response):
            break
        time.sleep(1.1)
        response = client.query_next_page(response)

    return collected


def harvest_async(client) -> list[dict]:
    """
    Submit a job, wait for it, read the result.

    One job per minute, up to 100,000 results. The poll interval is generous
    because a large job takes minutes to hours and a tight loop buys nothing.
    """
    params = dict(_params())
    params.update(
        {
            "mode": "SNAPSHOT",
            "name": CONFIG["label"],
            "description": f"Species on Screen corpus: {CONFIG['query']}",
        }
    )
    print(f"submitting async job: {CONFIG['label']}")
    response = client.post(path="facebook/posts/job", params=params)
    body = response.json()
    job_id = body.get("id") or body.get("data", {}).get("id")
    print(f"  job id: {job_id}")
    print(f"  query id: {body.get('query_id', '')}")

    job = client.get_async_job(job_id=job_id)
    while True:
        status = job.get_status()
        print(f"  status: {status}")
        if str(status).lower() in ("completed", "complete", "succeeded", "finished"):
            break
        if str(status).lower() in ("failed", "error", "cancelled"):
            raise SystemExit(f"job {job_id} ended as {status}")
        time.sleep(60)

    data = job.get_data()
    return list(data) if data else []


# ============================================================
# Reduce and vet
# ============================================================


def _followers(row: dict) -> int | None:
    surface = row.get("surface") or {}
    for key in ("followers_count", "follower_count", "likes"):
        value = surface.get(key)
        if value is not None:
            try:
                return int(value)
            except (TypeError, ValueError):
                continue
    return None


def _widely_known(surface_type: str, followers: int | None, verified: bool) -> bool:
    if followers is None:
        return bool(verified)
    if surface_type in ("profile", "user"):
        return verified or followers >= PROFILE_FOLLOWER_THRESHOLD
    return followers >= PAGE_FOLLOWER_THRESHOLD


def to_surface_rows(records: list[dict]) -> tuple[list[dict], dict]:
    """Aggregate posts to one row per account. No post text survives this step."""
    surfaces: dict[str, dict] = {}
    refused = {"below_threshold": 0, "no_surface": 0}

    for record in records:
        surface = record.get("surface") or {}
        surface_id = str(surface.get("id") or "")
        if not surface_id:
            refused["no_surface"] += 1
            continue

        surface_type = str(surface.get("type", "")).lower()
        followers = _followers(record)
        verified = bool(surface.get("verified_status"))

        if not _widely_known(surface_type, followers, verified):
            refused["below_threshold"] += 1
            continue

        entry = surfaces.setdefault(
            surface_id,
            {
                "surface_id": surface_id,
                "surface_type": surface_type,
                "surface_name": surface.get("name", ""),
                "surface_followers": followers if followers is not None else "",
                "surface_verified": str(verified).lower(),
                "surface_country": surface.get("country", ""),
                "surface_url": surface.get("url", ""),
                "post_count": 0,
                "first_post_date": "",
                "last_post_date": "",
                "_languages": set(),
                "query_label": CONFIG["label"],
            },
        )
        entry["post_count"] += 1

        created = str(record.get("creation_time", ""))[:10]
        if created:
            if not entry["first_post_date"] or created < entry["first_post_date"]:
                entry["first_post_date"] = created
            if not entry["last_post_date"] or created > entry["last_post_date"]:
                entry["last_post_date"] = created

        language = str(record.get("lang", "")).strip()
        if language:
            entry["_languages"].add(language)

    rows = []
    for entry in surfaces.values():
        entry["languages_observed"] = ",".join(sorted(entry.pop("_languages")))
        rows.append({column: entry.get(column, "") for column in SURFACE_COLUMNS})
    rows.sort(key=lambda row: (-int(row["post_count"] or 0), row["surface_name"]))
    return rows, refused


def to_post_rows(records: list[dict]) -> tuple[list[dict], dict]:
    """One row per post, carrying no text. Use only when the design needs post granularity."""
    rows = []
    refused = {"below_threshold": 0, "no_surface": 0}

    for record in records:
        surface = record.get("surface") or {}
        surface_id = str(surface.get("id") or "")
        if not surface_id:
            refused["no_surface"] += 1
            continue
        surface_type = str(surface.get("type", "")).lower()
        followers = _followers(record)
        if not _widely_known(surface_type, followers, bool(surface.get("verified_status"))):
            refused["below_threshold"] += 1
            continue
        rows.append(
            {
                "post_id": str(record.get("id", "")),
                "surface_id": surface_id,
                "surface_type": surface_type,
                "surface_name": surface.get("name", ""),
                "surface_followers": followers if followers is not None else "",
                "creation_time": str(record.get("creation_time", ""))[:10],
                "post_url": record.get("post_url", ""),
                "lang": record.get("lang", ""),
                "country": surface.get("country", ""),
            }
        )
    return rows, refused


def write_extract(rows: list[dict], columns: list[str], refused: dict) -> tuple[str, str]:
    label = CONFIG["label"]
    csv_name = f"{label}.csv"
    vetting_name = f"{label}.vetting.json"

    with open(csv_name, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

    vetting = {
        "exported_by": CONFIG["exported_by"],
        "exported_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "enclave": CONFIG["enclave"],
        "dataset_id": CONFIG["dataset_id"],
        "api_version": "v6.0",
        "query_id": CONFIG.get("_query_id", ""),
        "record_count": len(rows),
        "unit_of_analysis": CONFIG["unit_of_analysis"],
        "contains_user_content": False,
        "export_approved": False,
        "query": {
            "q": CONFIG["query"],
            "since": CONFIG["since"],
            "until": CONFIG["until"],
            "lang": CONFIG.get("lang", ""),
            "surface_types": CONFIG.get("surface_types", []),
            "mode": CONFIG["mode"],
        },
        "rows_refused_in_enclave": refused,
        "_note": (
            "export_approved is false until a human sets it to true. The importer on the research "
            "machine refuses an extract that was never approved. Set it only after checking the CSV "
            "carries no user content and every row clears the widely-known-account threshold."
        ),
    }
    with open(vetting_name, "w", encoding="utf-8") as handle:
        json.dump(vetting, handle, indent=2, sort_keys=True)

    return csv_name, vetting_name


def main() -> None:
    if not CONFIG["exported_by"]:
        raise SystemExit("Set CONFIG['exported_by'] to your researcher id before running.")

    client = _client()
    records = harvest_async(client) if CONFIG["mode"] == "async" else harvest_sync(client)
    print(f"\nretrieved {len(records)} records")

    if CONFIG["unit_of_analysis"] == "surface":
        rows, refused = to_surface_rows(records)
        columns = SURFACE_COLUMNS
    else:
        rows, refused = to_post_rows(records)
        columns = POST_COLUMNS

    csv_name, vetting_name = write_extract(rows, columns, refused)

    print(f"\nwrote {len(rows)} rows to {csv_name}")
    print(f"refused in enclave: {refused}")
    print(f"vetting record: {vetting_name}")
    print("\nBefore you export:")
    print("  1. open the CSV and confirm no column carries post, comment or profile text")
    print("  2. confirm every surface clears the widely-known-account threshold")
    print("  3. set export_approved to true in the vetting record")
    print("  4. download BOTH files and place them in research/var/mcl-imports/")
    print("  5. on your own machine: python -m sos_pipeline import-mcl")


if __name__ == "__main__":
    main()
