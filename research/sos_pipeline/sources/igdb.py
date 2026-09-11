"""
IGDB — commercial and independent games.

The games arm of the project has a literature anchor: Blake (2025), *How
commercial video games engage with biodiversity and conservation: a systematic
map of literature*, which is the same corpus the Paper 1 coding manual works
over. This adapter supplies the *artefact* side of that: the games themselves,
as registry records, so the media corpus can hold a game beside a documentary
and a Facebook page and compare them under one schema.

Auth is Twitch OAuth client credentials: a client id and secret exchanged for a
bearer token that both headers then carry. The token is cached in memory for
the run and never written to disk.

IGDB speaks APIcalypse, a small query language posted as the request body
rather than as query parameters. That is why this is the one adapter that
POSTs.
"""

from __future__ import annotations

import time
from typing import Iterator

from ..normalize import clean_text, iso_date, licence_or_rights
from ..provenance import Unresolved
from ..schema import blank_corpus_row, join_list
from .base import HarvestPlan, HarvestRecord, Source, SourceError

QUERY_FIELDS = (
    "id,name,slug,summary,first_release_date,url,category,game_type,"
    "involved_companies.company.name,involved_companies.developer,involved_companies.publisher,"
    "platforms.name,platforms.abbreviation,language_supports.language.native_name,"
    "language_supports.language.locale,total_rating_count,themes.name,genres.name"
)


class IgdbSource(Source):
    name = "igdb"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = True
    institutional_producer = True
    field_allowlist = (
        "id",
        "name",
        "slug",
        "url",
        "first_release_date",
        "category",
        "game_type",
        "total_rating_count",
        "platforms",
        "genres",
        "themes",
        "involved_companies",
        "language_supports",
    )

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._token: str | None = None
        self._token_expires_at: float = 0.0

    # --- auth -----------------------------------------------------------

    def preflight(self) -> list[str]:
        problems = []
        if not self.cfg.credential("client_id_env"):
            problems.append("IGDB_CLIENT_ID is unset. Register an app at https://dev.twitch.tv/console/apps.")
        if not self.cfg.credential("client_secret_env"):
            problems.append("IGDB_CLIENT_SECRET is unset.")
        return problems

    def _bearer(self) -> str:
        if self._token and time.time() < self._token_expires_at - 60:
            return self._token

        payload, _ = self.http.post(
            self.cfg.require("token_url"),
            source=self.name,
            rate_per_second=self.rate(),
            params={
                "client_id": self.cfg.require_credential("client_id_env"),
                "client_secret": self.cfg.require_credential("client_secret_env"),
                "grant_type": "client_credentials",
            },
        )
        payload = payload or {}
        token = payload.get("access_token")
        if not token:
            raise SourceError("IGDB token exchange returned no access_token")
        self._token = str(token)
        self._token_expires_at = time.time() + float(payload.get("expires_in", 3600))
        return self._token

    def _headers(self) -> dict:
        return {
            "Client-ID": self.cfg.require_credential("client_id_env"),
            "Authorization": f"Bearer {self._bearer()}",
            "Content-Type": "text/plain",
        }

    # --- harvest --------------------------------------------------------

    def estimate(self, plan: HarvestPlan) -> dict:
        return {"source": self.name, "calls": len(plan.queries) + 1, "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        base = self.cfg.require("base_url")
        limit = min(plan.limit or 50, 500)
        emitted = 0

        for query in plan.queries:
            if plan.limit is not None and emitted >= plan.limit:
                return
            body = f'search "{self._escape(query)}"; fields {QUERY_FIELDS}; limit {limit};'
            self.manifest.note_query(self.name, "games", {"apicalypse": body})

            payload, receipt = self._post_apicalypse(f"{base}/games", body)

            for game in payload or []:
                if plan.limit is not None and emitted >= plan.limit:
                    return
                record = self._to_record(game, query, receipt)
                if record is None:
                    continue
                emitted += 1
                yield record

    def _post_apicalypse(self, url: str, body: str):
        """
        IGDB takes a plain-text body, which the shared client sends as JSON.

        Rather than widen the client for one source, the body is passed through
        the session directly and the receipt is built by hand so the exchange is
        still recorded exactly like every other call.
        """
        from ..provenance import Receipt

        self.http.bucket_for(self.name, self.rate()).take()
        response = self.http.session.post(url, data=body.encode("utf-8"), headers=self._headers(), timeout=self.http.timeout)
        error = "" if response.ok else f"HTTP {response.status_code}: {response.text[:300]}"
        payload = response.json() if response.ok else None
        receipt = Receipt.make(
            source=self.name,
            endpoint=url,
            params={"apicalypse": body},
            status=response.status_code,
            payload=payload,
            method="POST",
            error=error,
        )
        if self.http.receipt_log:
            self.http.receipt_log.record(receipt)
        if error:
            raise SourceError(f"igdb {url} -> {error}")
        return payload, receipt

    # --- projection -----------------------------------------------------

    def _to_record(self, game: dict, query: str, receipt) -> HarvestRecord | None:
        external_id = str(game.get("id") or "")
        if not external_id:
            return None

        kept, dropped = self.minimise(game)
        kept["_query"] = query
        unresolved: list[Unresolved] = []

        developers = [
            company.get("company", {}).get("name", "")
            for company in (game.get("involved_companies") or [])
            if company.get("developer")
        ]
        publishers = [
            company.get("company", {}).get("name", "")
            for company in (game.get("involved_companies") or [])
            if company.get("publisher")
        ]
        creator = clean_text(" / ".join([c for c in developers + publishers if c]), limit=300)
        if not creator:
            unresolved.append(Unresolved("creator", "no-involved-company-returned", external_id))

        released = game.get("first_release_date")
        published = ""
        if released:
            from datetime import datetime, timezone

            published = datetime.fromtimestamp(int(released), tz=timezone.utc).date().isoformat()
        else:
            unresolved.append(Unresolved("date_published", "absent-from-igdb", external_id))

        locales = [
            support.get("language", {}).get("locale", "")
            for support in (game.get("language_supports") or [])
        ]
        from ..normalize import language_code

        languages = join_list([language_code(code) for code in locales if code])

        row = blank_corpus_row()
        row["title"] = clean_text(game.get("name"), limit=300)
        row["creator"] = creator
        row["platform_primary"] = self._platform_term(game)
        row["url_primary"] = game.get("url", "") or f"https://www.igdb.com/games/{game.get('slug', external_id)}"
        row["date_published"] = published
        row["format"] = "game"
        row["languages"] = languages
        row["access_state_at_capture"] = "open"
        row["license_or_rights"] = licence_or_rights("")
        row["archive_status"] = "metadata-only"
        unresolved.append(Unresolved("producer_country", "igdb-does-not-return-company-country", external_id))
        unresolved.append(
            Unresolved(
                "duration_or_length",
                "play-time-hours-median-is-not-in-igdb",
                "corpus-seed-framework §1.1 asks for median play-time for games",
            )
        )

        if dropped:
            self.manifest.count("igdb.fields_dropped", dropped)

        return HarvestRecord(
            source=self.name,
            external_id=external_id,
            payload=kept,
            corpus_row=row,
            receipt=receipt,
            unresolved=unresolved,
            dropped_fields=dropped,
        )

    @staticmethod
    def _platform_term(game: dict) -> str:
        """
        Map storefront platforms onto the corpus vocabulary.

        The vocabulary has `steam`, `itch-io`, `app-store-ios` and `google-play`
        but IGDB reports hardware platforms, not storefronts. Only an
        unambiguous single-storefront case is mapped; everything else is
        `mixed-platform`, which is a truthful answer rather than a guess.
        """
        names = {str(p.get("name", "")).lower() for p in (game.get("platforms") or [])}
        if names == {"ios"}:
            return "app-store-ios"
        if names == {"android"}:
            return "google-play"
        if names and names <= {"pc (microsoft windows)", "mac", "linux"}:
            return "steam"
        return "mixed-platform"

    @staticmethod
    def _escape(text: str) -> str:
        return text.replace('"', '\\"')
