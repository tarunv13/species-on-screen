"""
Wikipedia pageviews — the cultural-salience signal.

Authority: `corpus-seed-framework.md` §7.2, which names Wikipedia integration
as a culturomics application, and §7.7, which says what the signal is worth.
That caveat is worth restating in code because it is so easy to forget once the
numbers are in a chart: **pageviews measure attention, not biological
importance.** A species trending because a film was released is exactly the
phenomenon this project studies; it is not evidence about the species.

Multilingual by construction (§7.4). The default project list is English only,
which is a known Anglophone bias (§9.1) rather than a neutral default, and the
run report says so whenever fewer than two projects are configured.
"""

from __future__ import annotations

import urllib.parse
from datetime import date, timedelta
from typing import Iterator

from ..provenance import Unresolved
from .base import EnrichmentRecord, HarvestPlan, Source


class WikipediaSource(Source):
    name = "wikipedia"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = ("project", "article", "granularity", "timestamp", "views")

    def preflight(self) -> list[str]:
        projects = list(self.cfg.get("projects", []))
        if not projects:
            return ["sources.wikipedia.projects is empty; name at least one project, e.g. en.wikipedia"]
        if len(projects) < 2:
            self.manifest.warn(
                "Wikipedia pageviews are configured for a single project. Single-language culturomics "
                "carries the Anglophone bias named in corpus-seed-framework §9.1; the framework asks "
                "for at least English plus three others (§11.1)."
            )
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        projects = list(self.cfg.get("projects", []))
        return {"source": self.name, "calls": len(plan.taxa) * len(projects), "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        days = int(self.cfg.get("days", 365))
        for taxon in plan.taxa:
            article = taxon.get("wikipediaTitle") or taxon.get("commonName") or taxon.get("scientificName", "")
            if not article:
                continue
            for project in self.cfg.get("projects", []):
                yield self.pageviews(article, project, days)

    def pageviews(self, article: str, project: str = "en.wikipedia", days: int = 365) -> EnrichmentRecord:
        """
        Daily pageviews for one article over the trailing `days`.

        Returns the series plus a small summary. The series is what supports
        the before/after designs in §6.2 (campaign-effect tracking); the summary
        is what a coder glances at.
        """
        base = self.cfg.require("base_url")
        end = date.today() - timedelta(days=1)
        start = end - timedelta(days=days)
        title = urllib.parse.quote(article.replace(" ", "_"), safe="")

        url = (
            f"{base}/metrics/pageviews/per-article/{project}/all-access/user/"
            f"{title}/daily/{start.strftime('%Y%m%d')}/{end.strftime('%Y%m%d')}"
        )

        try:
            payload, receipt = self.http.get(url, source=self.name, rate_per_second=self.rate())
        except Exception as exc:  # a missing article is a 404, which is information, not a failure
            return EnrichmentRecord(
                source=self.name,
                subject=f"{project}:{article}",
                kind="pageviews",
                payload={"project": project, "article": article, "total_views": 0},
                unresolved=[
                    Unresolved(
                        field="wikipedia_pageviews",
                        reason="article-not-found-or-unavailable",
                        attempted=f"{project}:{article} ({type(exc).__name__})",
                    )
                ],
            )

        items = (payload or {}).get("items") or []
        series = [{"timestamp": item.get("timestamp", ""), "views": int(item.get("views", 0))} for item in items]
        total = sum(point["views"] for point in series)
        peak = max(series, key=lambda point: point["views"], default={"timestamp": "", "views": 0})

        self.manifest.count("wikipedia.articles")

        return EnrichmentRecord(
            source=self.name,
            subject=f"{project}:{article}",
            kind="pageviews",
            payload={
                "project": project,
                "article": article,
                "granularity": "daily",
                "window_start": start.isoformat(),
                "window_end": end.isoformat(),
                "total_views": total,
                "mean_daily_views": round(total / len(series), 2) if series else 0,
                "peak_day": peak.get("timestamp", ""),
                "peak_views": peak.get("views", 0),
                "series": series,
                "_caveat": (
                    "Attention, not biological importance. corpus-seed-framework §7.7 governs "
                    "interpretation of this value."
                ),
            },
            receipt=receipt,
        )
