"""
TMDB — film and television metadata for the documentary and streaming forms.

The repository already has a TMDB harvester (`scripts/fetch-tmdb-data.js`),
written for the cinematic surface. This adapter is not a port of it. Two
differences are deliberate:

  The key comes from the environment. The existing script carries a live API
  key on line 8 of a committed file; nothing here repeats that.

  Genre keywords do not classify an artefact. The old script decides whether a
  film is about nature by matching a keyword list against its overview. That is
  a coding judgement — `form_classification` under §1.8 — and it belongs to a
  human. This adapter uses keywords only to *find* candidates, and records the
  query that surfaced each one so the sampling frame is reconstructible. What
  the artefact is remains an empty cell.
"""

from __future__ import annotations

from typing import Iterator

from ..normalize import clean_text, country_code, iso_date, language_code, licence_or_rights
from ..provenance import Unresolved
from ..schema import blank_corpus_row, join_list
from .base import HarvestPlan, HarvestRecord, Source


class TmdbSource(Source):
    name = "tmdb"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = True
    institutional_producer = True
    field_allowlist = (
        "id",
        "title",
        "name",
        "original_title",
        "original_name",
        "original_language",
        "release_date",
        "first_air_date",
        "overview",
        "popularity",
        "vote_count",
        "adult",
        "genre_ids",
        "origin_country",
        "media_type",
    )

    def preflight(self) -> list[str]:
        if not self.cfg.credential():
            return ["TMDB_API_KEY is unset. Create a key at https://www.themoviedb.org/settings/api."]
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        pages = max(1, (plan.limit or 20) // 20)
        return {"source": self.name, "calls": len(plan.queries) * pages, "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        base = self.cfg.require("base_url")
        key = self.cfg.require_credential()
        language = str(self.cfg.get("language", "en-US"))
        include_adult = bool(self.cfg.get("include_adult", False))

        emitted = 0
        for query in plan.queries:
            page = 1
            while True:
                if plan.limit is not None and emitted >= plan.limit:
                    return
                params = {
                    "api_key": key,
                    "query": query,
                    "language": language,
                    "include_adult": str(include_adult).lower(),
                    "page": page,
                }
                self.manifest.note_query(self.name, "search/multi", {**params, "api_key": "<redacted>"})
                payload, receipt = self.http.get(
                    f"{base}/search/multi",
                    source=self.name,
                    rate_per_second=self.rate(),
                    params=params,
                )
                payload = payload or {}
                results = [r for r in (payload.get("results") or []) if r.get("media_type") in ("movie", "tv")]
                if not results:
                    break

                for result in results:
                    if plan.limit is not None and emitted >= plan.limit:
                        return
                    record = self._to_record(result, query, receipt)
                    if record is None:
                        continue
                    emitted += 1
                    yield record

                if page >= int(payload.get("total_pages", 1)) or page >= 5:
                    break
                page += 1

    # --- projection ----------------------------------------------------

    def _to_record(self, result: dict, query: str, receipt) -> HarvestRecord | None:
        external_id = str(result.get("id") or "")
        if not external_id:
            return None

        payload, dropped = self.minimise(result)
        payload["_query"] = query
        unresolved: list[Unresolved] = []

        media_type = result.get("media_type", "movie")
        title = clean_text(result.get("title") or result.get("name"), limit=300)
        published = iso_date(result.get("release_date") or result.get("first_air_date"))
        if not published:
            unresolved.append(Unresolved("date_published", "absent-from-tmdb", external_id))

        origin = [country_code(c) for c in (result.get("origin_country") or [])]
        origin = [c for c in origin if c]

        row = blank_corpus_row()
        row["title"] = title
        row["producer_country"] = origin[0] if origin else ""
        if not origin:
            unresolved.append(Unresolved("producer_country", "absent-from-tmdb", external_id))
        # TMDB does not name a distributing platform; the corpus does not guess one.
        row["platform_primary"] = "mixed-platform"
        row["url_primary"] = f"https://www.themoviedb.org/{'movie' if media_type == 'movie' else 'tv'}/{external_id}"
        row["date_published"] = published
        row["format"] = "video"
        row["languages"] = join_list([language_code(result.get("original_language"))])
        row["access_state_at_capture"] = "open"
        row["license_or_rights"] = licence_or_rights("")
        row["archive_status"] = "metadata-only"
        unresolved.append(
            Unresolved("creator", "tmdb-search-does-not-return-credits", external_id)
        )
        unresolved.append(
            Unresolved("duration_or_length", "tmdb-search-does-not-return-runtime", external_id)
        )

        if dropped:
            self.manifest.count("tmdb.fields_dropped", dropped)

        return HarvestRecord(
            source=self.name,
            external_id=external_id,
            payload=payload,
            corpus_row=row,
            receipt=receipt,
            unresolved=unresolved,
            audience_size=None,
            dropped_fields=dropped,
        )
