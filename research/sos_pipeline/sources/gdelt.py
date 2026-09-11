"""
GDELT — news coverage of a landscape, as a culturomics signal.

Mirrors `scripts/ingest/gdelt.mjs`, which already drives the Observatory news
layer from the `newsQuery` field in `scripts/ingest/landscapes.json`. Reusing
the same query strings means the research corpus and the published news layer
are looking at the same coverage, not two differently-worded approximations of
it.

GDELT is an enrichment source, not an artefact source. An environmental
journalism piece *can* be a corpus artefact, but deciding that is an inclusion
judgement under §2, and GDELT's monitoring of roughly a hundred thousand
outlets is the wrong instrument for it: it would flood the corpus with
syndicated wire copy. So this adapter measures coverage volume and surfaces
candidate articles; it does not mint artefacts.

The public endpoint asks for about one request every five seconds and answers
an over-eager client with a plain-text scolding rather than an HTTP error, so
the rate is configured low and that response is detected explicitly.
"""

from __future__ import annotations

import json
import re
from typing import Iterator

from ..provenance import Unresolved
from .base import EnrichmentRecord, HarvestPlan, Source

RATE_LIMIT_HINT = re.compile(r"please limit requests", re.IGNORECASE)


def _format_date(seen: str) -> str:
    """GDELT stamps look like 20260620T161500Z."""
    match = re.match(r"^(\d{4})(\d{2})(\d{2})", seen or "")
    return f"{match.group(1)}-{match.group(2)}-{match.group(3)}" if match else ""


class GdeltSource(Source):
    name = "gdelt"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = ("title", "url", "domain", "date", "country", "language")

    def preflight(self) -> list[str]:
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        return {
            "source": self.name,
            "calls": len(plan.landscapes),
            "quota_units": 0,
            "note": f"throttled to {self.rate()} req/s by configuration",
        }

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        for landscape in plan.landscapes:
            query = landscape.get("newsQuery") or landscape.get("name", "")
            if not query:
                continue
            yield self.coverage(landscape.get("id", query), query)

    def coverage(self, subject: str, query: str) -> EnrichmentRecord:
        base = self.cfg.require("base_url")
        max_records = int(self.cfg.get("max_records", 40))
        timespan = str(self.cfg.get("timespan", "12months"))

        params = {
            "query": query,
            "mode": "ArtList",
            "maxrecords": max_records,
            "format": "json",
            "sort": "DateDesc",
            "timespan": timespan,
        }
        self.manifest.note_query(self.name, "doc", params)

        text, receipt = self.http.get(
            base,
            source=self.name,
            rate_per_second=self.rate(),
            params=params,
            expect_json=False,
        )

        if RATE_LIMIT_HINT.search(text or ""):
            self.manifest.warn("GDELT asked the client to slow down; lower sources.gdelt.requests_per_second")
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="news-coverage",
                payload={"article_count": 0},
                receipt=receipt,
                unresolved=[Unresolved("news_coverage", "gdelt-rate-limited", query)],
            )

        try:
            payload = json.loads(text) if text else {}
        except json.JSONDecodeError:
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="news-coverage",
                payload={"article_count": 0},
                receipt=receipt,
                unresolved=[Unresolved("news_coverage", "gdelt-returned-non-json", query)],
            )

        seen: set[str] = set()
        articles = []
        domains: dict[str, int] = {}
        countries: dict[str, int] = {}

        for article in payload.get("articles") or []:
            key = f"{article.get('domain', '')}|{(article.get('title') or '')[:40]}"
            if key in seen:
                continue
            seen.add(key)
            record = {
                "title": (article.get("title") or "").strip(),
                "url": article.get("url", ""),
                "domain": article.get("domain", ""),
                "date": _format_date(article.get("seendate", "")),
                "country": article.get("sourcecountry", ""),
                "language": article.get("language", ""),
            }
            kept, _ = self.minimise(record)
            articles.append(kept)
            domains[record["domain"]] = domains.get(record["domain"], 0) + 1
            if record["country"]:
                countries[record["country"]] = countries.get(record["country"], 0) + 1

        self.manifest.count("gdelt.articles", len(articles))

        return EnrichmentRecord(
            source=self.name,
            subject=subject,
            kind="news-coverage",
            payload={
                "query": query,
                "timespan": timespan,
                "article_count": len(articles),
                "distinct_domains": len(domains),
                "source_countries": dict(sorted(countries.items(), key=lambda kv: -kv[1])),
                "articles": articles,
            },
            receipt=receipt,
        )
