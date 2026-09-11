"""
GloBI — aggregated biotic interaction evidence.

Mirrors `scripts/ingest/globi.mjs`, including its interaction-type vocabulary,
which aligns with the OBO Relations Ontology terms the Darwin Core archives
already use in `resource-relationship.txt`. Keeping the same terms means an
interaction claim in the research corpus and the same claim in the archive
resolve to the same ontology term rather than to two synonyms.

For the media corpus this is a secondary source. It answers a question the
media metadata cannot: when an artefact says a tiger depends on a mangrove,
is there aggregated interaction evidence for that dependency, and what study
reported it. The answer is attached as enrichment, not written into a corpus
cell, because whether the artefact *depicts* the interaction is a coding
judgement.
"""

from __future__ import annotations

from typing import Iterator

from ..provenance import Unresolved
from .base import EnrichmentRecord, HarvestPlan, Source

# Editorial interaction types to OBO Relations Ontology identifiers, copied
# from scripts/ingest/globi.mjs so the two ingests cannot drift.
RO = {
    "pollinates": "http://purl.obolibrary.org/obo/RO_0002455",
    "eats": "http://purl.obolibrary.org/obo/RO_0002470",
    "preysOn": "http://purl.obolibrary.org/obo/RO_0002439",
    "interactsWith": "http://purl.obolibrary.org/obo/RO_0002437",
}


def binomial(name: str) -> str:
    """GloBI and GBIF both match best on the binomial; drop subspecies."""
    return " ".join((name or "").split()[:2])


class GlobiSource(Source):
    name = "globi"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = ("source_taxon", "target_taxon", "interaction_type", "study_citation", "record_count")

    def preflight(self) -> list[str]:
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        pairs = plan.extra.get("interactions", [])
        return {"source": self.name, "calls": len(pairs), "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        for interaction in plan.extra.get("interactions", []):
            yield self.evidence(
                interaction.get("from", ""),
                interaction.get("to", ""),
                interaction.get("type", "interactsWith"),
            )

    def evidence(self, source_taxon: str, target_taxon: str, interaction_type: str) -> EnrichmentRecord:
        """Look for GloBI evidence of `source` `type` `target`."""
        base = self.cfg.require("base_url")
        subject = f"{source_taxon} {interaction_type} {target_taxon}"

        payload, receipt = self.http.get(
            f"{base}/interaction",
            source=self.name,
            rate_per_second=self.rate(),
            params={
                "sourceTaxon": binomial(source_taxon),
                "targetTaxon": binomial(target_taxon),
                "interactionType": interaction_type,
                "field": "study_citation",
                "limit": 50,
            },
        )
        payload = payload or {}
        rows = payload.get("data") or []

        if not rows:
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="interaction",
                payload={
                    "source_taxon": source_taxon,
                    "target_taxon": target_taxon,
                    "interaction_type": interaction_type,
                    "record_count": 0,
                },
                receipt=receipt,
                unresolved=[
                    Unresolved(
                        field="interaction_evidence",
                        reason="no-globi-record-for-pair",
                        attempted=subject,
                    )
                ],
            )

        columns = payload.get("columns") or []
        index = columns.index("study_citation") if "study_citation" in columns else 0
        citation = ""
        for row in rows:
            candidate = str(row[index] if index < len(row) else "").strip()
            if candidate and not candidate.lower().startswith("http"):
                citation = candidate
                break
        if not citation:
            citation = "Global Biotic Interactions (GloBI)"
        if len(citation) > 300:
            citation = citation[:297].rsplit(" ", 1)[0] + "…"

        return EnrichmentRecord(
            source=self.name,
            subject=subject,
            kind="interaction",
            payload={
                "source_taxon": source_taxon,
                "target_taxon": target_taxon,
                "interaction_type": interaction_type,
                "study_citation": citation,
                "record_count": len(rows),
                "ro_term": RO.get(interaction_type, ""),
            },
            receipt=receipt,
        )
