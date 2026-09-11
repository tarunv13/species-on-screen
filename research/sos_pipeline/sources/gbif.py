"""
GBIF — authoritative taxonomy and the backbone key.

Mirrors what `scripts/ingest/gbif.mjs` already does for the Darwin Core build,
so the research corpus and the Observatory archive resolve names against the
same backbone and can be joined on `usageKey`.

Two things this adapter will not do:

  It will not accept a fuzzy match as an identifier. `matchType` of FUZZY or
  HIGHERRANK resolves to an unresolved identifier with the attempted name
  recorded. A wrong taxon key is worse than a missing one, and the repository
  has standing precedent for leaving an identifier unresolved rather than
  guessing it.

  It will not write a precise occurrence coordinate. Coordinates pass through
  the locality gate, which generalises them and withholds them entirely for
  threatened taxa.
"""

from __future__ import annotations

from typing import Iterator

from ..provenance import Unresolved
from ..schema import blank_species_row, join_list
from .base import EnrichmentRecord, HarvestPlan, Source

ACCEPTED_MATCH_TYPES = {"EXACT"}


class GbifSource(Source):
    name = "gbif"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = (
        "usageKey",
        "scientificName",
        "canonicalName",
        "rank",
        "status",
        "matchType",
        "confidence",
        "kingdom",
        "phylum",
        "class",
        "order",
        "family",
        "genus",
        "species",
        "kingdomKey",
        "familyKey",
        "genusKey",
        "speciesKey",
    )

    def preflight(self) -> list[str]:
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        return {"source": self.name, "calls": len(plan.taxa), "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        for taxon in plan.taxa:
            name = (taxon.get("scientificName") or taxon.get("sci") or "").strip()
            if not name:
                continue
            yield self.match(name)

    # --- the one call that matters -------------------------------------

    def match(self, scientific_name: str) -> EnrichmentRecord:
        base = self.cfg.require("base_url")
        binomial = " ".join(scientific_name.split()[:2])
        unresolved: list[Unresolved] = []

        payload, receipt = self.http.get(
            f"{base}/species/match",
            source=self.name,
            rate_per_second=self.rate(),
            params={"name": binomial, "strict": "false"},
        )
        payload = payload or {}
        match_type = str(payload.get("matchType", "NONE")).upper()

        if match_type not in ACCEPTED_MATCH_TYPES:
            unresolved.append(
                Unresolved(
                    field="taxon_id_external",
                    reason=f"gbif-match-{match_type.lower()}",
                    attempted=scientific_name,
                )
            )
            kept: dict = {"matchType": match_type}
        else:
            kept, dropped = self.minimise(payload)
            self.manifest.count("gbif.matched")
            if dropped:
                self.manifest.count("gbif.fields_dropped", dropped)

        return EnrichmentRecord(
            source=self.name,
            subject=scientific_name,
            kind="taxon-match",
            payload=kept,
            receipt=receipt,
            unresolved=unresolved,
        )

    def occurrence_in_bbox(self, taxon_key: int | str, bbox: list[float]) -> EnrichmentRecord:
        """
        A representative georeferenced occurrence inside a bounding box.

        Returns the count always and the coordinate only through the locality
        gate. For a threatened taxon the gate withholds the coordinate and the
        record carries the withholding as an unresolved value, which is the
        honest form of "we know and are not publishing it".
        """
        base = self.cfg.require("base_url")
        west, south, east, north = bbox
        payload, receipt = self.http.get(
            f"{base}/occurrence/search",
            source=self.name,
            rate_per_second=self.rate(),
            params={
                "taxonKey": taxon_key,
                "hasCoordinate": "true",
                "hasGeospatialIssue": "false",
                "decimalLatitude": f"{south},{north}",
                "decimalLongitude": f"{west},{east}",
                "limit": 1,
            },
        )
        payload = payload or {}
        results = payload.get("results") or []
        count = int(payload.get("count", 0))

        if not results:
            return EnrichmentRecord(
                source=self.name,
                subject=str(taxon_key),
                kind="occurrence",
                payload={"count": count},
                receipt=receipt,
            )

        first = results[0]
        latitude, longitude, uncertainty, unresolved = self.ethics.generalise_coordinate(
            first.get("decimalLatitude"),
            first.get("decimalLongitude"),
            taxon=first.get("scientificName", ""),
            iucn_category=str(first.get("iucnRedListCategory", "")),
        )
        return EnrichmentRecord(
            source=self.name,
            subject=str(taxon_key),
            kind="occurrence",
            payload={
                "count": count,
                "decimalLatitude": latitude,
                "decimalLongitude": longitude,
                "coordinateUncertaintyInMeters": uncertainty,
                "basisOfRecord": first.get("basisOfRecord", ""),
                "generalised": True,
            },
            receipt=receipt,
            unresolved=unresolved,
        )


def species_row_from_match(
    artefact_id: str,
    common_name: str,
    scientific_name: str,
    record: EnrichmentRecord,
    *,
    tier: str = "primary_subject_taxa",
    run_id: str = "",
) -> dict:
    """Project a GBIF match onto a species-tab row. Identifier columns only."""
    row = blank_species_row()
    row["artefact_id"] = artefact_id
    row["taxon_tier"] = tier
    row["taxon_name_common"] = common_name
    row["taxon_name_scientific"] = scientific_name
    row["harvest_source"] = record.source
    row["harvest_run_id"] = run_id

    usage_key = record.payload.get("usageKey")
    if usage_key:
        row["taxon_id_external"] = f"gbif:{usage_key}"
    row["harvest_unresolved"] = join_list(item.as_token() for item in record.unresolved)
    return row
