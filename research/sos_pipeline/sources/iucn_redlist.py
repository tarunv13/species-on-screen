"""
IUCN Red List — assessment category for a taxon, with the assessment named.

API v4 (`https://api.iucnredlist.org/api/v4`), Bearer token. The v3 host is
retired; a pipeline written against `apiv3.iucnredlist.org` will fail silently
against an empty result rather than loudly against a 404, which is why the
version is pinned in config rather than assumed here.

The field the corpus wants is `iucn_status_at_publication` (§1.2), and the
phrase carries the method: the status *at the time the artefact was published*,
not today's. A 2016 documentary about a species uplisted in 2021 is coded
against the 2016 assessment. This adapter therefore returns the full assessment
history and selects by date, rather than returning the latest category and
letting the corpus quietly drift into anachronism.
"""

from __future__ import annotations

from typing import Iterator

from ..provenance import Unresolved
from ..schema import IUCN_CATEGORIES
from .base import EnrichmentRecord, HarvestPlan, Source, SourceError


class IucnRedListSource(Source):
    name = "iucn_redlist"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = (
        "assessment_id",
        "year_published",
        "latest",
        "scopes",
        "red_list_category_code",
        "red_list_category",
        "sis_taxon_id",
        "url",
        "citation",
    )

    def preflight(self) -> list[str]:
        if not self.cfg.credential():
            return [
                "IUCN_REDLIST_TOKEN is unset. Request a token at https://api.iucnredlist.org/ and "
                "accept the Red List Terms of Use; the pipeline will not query without one."
            ]
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        return {"source": self.name, "calls": len(plan.taxa) * 2, "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        for taxon in plan.taxa:
            name = (taxon.get("scientificName") or taxon.get("sci") or "").strip()
            if not name:
                continue
            yield self.assessment_for(name, as_of=taxon.get("as_of", ""))

    # --- lookup --------------------------------------------------------

    def _headers(self) -> dict:
        token = self.cfg.credential()
        if not token:
            raise SourceError("iucn_redlist has no token; run `doctor` before harvesting")
        return {"Authorization": f"Bearer {token}"}

    def assessment_for(self, scientific_name: str, as_of: str = "") -> EnrichmentRecord:
        """
        Resolve a scientific name to the assessment in force at `as_of`.

        `as_of` is an ISO date or year. Empty means the latest assessment, and
        the record says so, so a coder can see which convention produced the
        value in front of them.
        """
        base = self.cfg.require("base_url")
        parts = scientific_name.split()
        unresolved: list[Unresolved] = []

        if len(parts) < 2:
            return EnrichmentRecord(
                source=self.name,
                subject=scientific_name,
                kind="assessment",
                payload={},
                unresolved=[Unresolved("iucn_status_at_publication", "name-not-binomial", scientific_name)],
            )

        genus, species = parts[0], parts[1]
        payload, receipt = self.http.get(
            f"{base}/taxa/scientific_name",
            source=self.name,
            rate_per_second=self.rate(),
            params={"genus_name": genus, "species_name": species},
            headers=self._headers(),
            api_version="v4",
        )
        payload = payload or {}
        assessments = payload.get("assessments") or []
        if not assessments:
            return EnrichmentRecord(
                source=self.name,
                subject=scientific_name,
                kind="assessment",
                payload={},
                receipt=receipt,
                unresolved=[Unresolved("iucn_status_at_publication", "no-assessment-found", scientific_name)],
            )

        chosen = self._select(assessments, as_of)
        if chosen is None:
            unresolved.append(
                Unresolved(
                    field="iucn_status_at_publication",
                    reason="no-assessment-at-publication-date",
                    attempted=f"{scientific_name} as of {as_of}",
                )
            )
            chosen = next((a for a in assessments if a.get("latest")), assessments[0])

        detail, detail_receipt = self.http.get(
            f"{base}/assessment/{chosen.get('assessment_id')}",
            source=self.name,
            rate_per_second=self.rate(),
            headers=self._headers(),
            api_version="v4",
        )
        detail = detail or {}

        category = self._category_code(detail, chosen)
        if category and category not in IUCN_CATEGORIES:
            unresolved.append(Unresolved("iucn_status_at_publication", "category-outside-vocabulary", category))
            category = ""

        merged = dict(chosen)
        merged["red_list_category_code"] = category
        merged["red_list_category"] = self._category_name(detail)
        merged["citation"] = detail.get("citation", "") if isinstance(detail, dict) else ""
        kept, dropped = self.minimise(merged)
        kept["selection_basis"] = f"as-of:{as_of}" if as_of else "latest"
        if dropped:
            self.manifest.count("iucn.fields_dropped", dropped)

        return EnrichmentRecord(
            source=self.name,
            subject=scientific_name,
            kind="assessment",
            payload=kept,
            receipt=detail_receipt or receipt,
            unresolved=unresolved,
        )

    # --- selection -----------------------------------------------------

    @staticmethod
    def _select(assessments: list[dict], as_of: str) -> dict | None:
        """The most recent assessment published at or before `as_of`."""
        if not as_of:
            return next((a for a in assessments if a.get("latest")), assessments[0])
        try:
            target_year = int(str(as_of)[:4])
        except (TypeError, ValueError):
            return next((a for a in assessments if a.get("latest")), assessments[0])

        eligible = []
        for assessment in assessments:
            year = assessment.get("year_published")
            try:
                year_value = int(str(year)[:4])
            except (TypeError, ValueError):
                continue
            if year_value <= target_year:
                eligible.append((year_value, assessment))
        if not eligible:
            return None
        eligible.sort(key=lambda pair: pair[0])
        return eligible[-1][1]

    @staticmethod
    def _category_code(detail: dict, fallback: dict) -> str:
        for candidate in (
            detail.get("red_list_category", {}) if isinstance(detail.get("red_list_category"), dict) else {},
            detail,
            fallback,
        ):
            if not isinstance(candidate, dict):
                continue
            value = candidate.get("code") or candidate.get("red_list_category_code")
            if value:
                return str(value).upper()
        return ""

    @staticmethod
    def _category_name(detail: dict) -> str:
        node = detail.get("red_list_category")
        if isinstance(node, dict):
            return str(node.get("description", {}).get("en", "") or node.get("name", ""))
        return str(node or "")
