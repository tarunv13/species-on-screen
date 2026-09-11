"""
OMDb — a second film/TV register, used to cross-check TMDB rather than to duplicate it.

Two registers disagreeing about a release date or a runtime is a data-quality
signal worth having; two registers agreeing is a weak corroboration. The
adapter therefore keeps both values rather than merging them, and the corpus
records which register supplied the cell it used.

The free tier is 1,000 calls per day. The quota ledger tracks it, so a day
spent on TMDB backfill does not silently exhaust tomorrow's OMDb budget.
"""

from __future__ import annotations

from typing import Iterator

from ..normalize import clean_text, country_code, duration_seconds, iso_date, language_code, licence_or_rights
from ..provenance import Unresolved
from ..ratelimit import QuotaBucket
from ..schema import blank_corpus_row, join_list
from .base import HarvestPlan, HarvestRecord, Source


class OmdbSource(Source):
    name = "omdb"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = True
    institutional_producer = True
    field_allowlist = (
        "imdbID",
        "Title",
        "Year",
        "Released",
        "Runtime",
        "Genre",
        "Director",
        "Writer",
        "Production",
        "Country",
        "Language",
        "Type",
        "totalSeasons",
        "imdbVotes",
    )

    def bucket(self) -> QuotaBucket:
        return QuotaBucket(
            source=self.name,
            bucket="calls",
            limit=int(self.cfg.get("calls_per_day", 1000)),
            reset_timezone="UTC",
        )

    def preflight(self) -> list[str]:
        problems = []
        if not self.cfg.credential():
            problems.append("OMDB_API_KEY is unset. Request a key at https://www.omdbapi.com/apikey.aspx.")
        remaining = self.ledger.remaining(self.bucket())
        if remaining == 0:
            problems.append(f"OMDb daily budget is spent; it resets at {self.bucket().resets_at()}")
        return problems

    def estimate(self, plan: HarvestPlan) -> dict:
        calls = len(plan.queries)
        return {
            "source": self.name,
            "calls": calls,
            "quota_units": calls,
            "remaining_today": self.ledger.remaining(self.bucket()),
        }

    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        base = self.cfg.require("base_url")
        key = self.cfg.require_credential()
        bucket = self.bucket()

        emitted = 0
        for query in plan.queries:
            if plan.limit is not None and emitted >= plan.limit:
                return
            self.ledger.check(bucket, 1)
            params = {"apikey": key, "t": query, "plot": "short", "r": "json"}
            self.manifest.note_query(self.name, "by-title", {**params, "apikey": "<redacted>"})
            payload, receipt = self.http.get(
                f"{base}",
                source=self.name,
                rate_per_second=self.rate(),
                params=params,
                quota_units=1,
                quota_bucket="calls",
            )
            self.ledger.spend(bucket, 1)

            payload = payload or {}
            if str(payload.get("Response", "False")) != "True":
                self.manifest.exclude("omdb-title-not-found")
                continue

            record = self._to_record(payload, query, receipt)
            if record is None:
                continue
            emitted += 1
            yield record

    # --- projection ----------------------------------------------------

    def _to_record(self, payload: dict, query: str, receipt) -> HarvestRecord | None:
        external_id = str(payload.get("imdbID") or "")
        if not external_id:
            return None

        kept, dropped = self.minimise(payload)
        kept["_query"] = query
        unresolved: list[Unresolved] = []

        # OMDb writes country and language *names*, not ISO codes. Truncating
        # "United Kingdom" to "UN" would produce a code that is both wrong and
        # plausible, so both fields stay empty and are reported as unresolved.
        producer_country = ""
        if payload.get("Country"):
            unresolved.append(
                Unresolved("producer_country", "omdb-returns-country-names-not-iso-codes", str(payload.get("Country")))
            )

        duration, duration_unresolved = duration_seconds(payload.get("Runtime"))
        unresolved.extend(duration_unresolved)

        if payload.get("Language"):
            unresolved.append(
                Unresolved("languages", "omdb-returns-language-names-not-iso-codes", str(payload.get("Language")))
            )

        row = blank_corpus_row()
        row["title"] = clean_text(payload.get("Title"), limit=300)
        row["creator"] = clean_text(payload.get("Production") or payload.get("Director"), limit=300)
        row["producer_country"] = producer_country
        row["platform_primary"] = "mixed-platform"
        row["url_primary"] = f"https://www.imdb.com/title/{external_id}/"
        row["date_published"] = iso_date(payload.get("Released")) or iso_date(payload.get("Year"))
        row["duration_or_length"] = duration
        row["format"] = "video"
        row["languages"] = ""
        row["access_state_at_capture"] = "open"
        row["license_or_rights"] = licence_or_rights("")
        row["archive_status"] = "metadata-only"

        if dropped:
            self.manifest.count("omdb.fields_dropped", dropped)

        return HarvestRecord(
            source=self.name,
            external_id=external_id,
            payload=kept,
            corpus_row=row,
            receipt=receipt,
            unresolved=unresolved,
            dropped_fields=dropped,
        )
