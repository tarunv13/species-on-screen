"""
IUCN Global Ecosystem Typology — binding a landscape to an Ecosystem Functional Group.

The founding brief for this repository asks for media metadata bound to
localised IUCN Ecosystem Functional Groups. This adapter is that binding, and
it is deliberately the least clever module in the pipeline.

There is no public JSON API for the typology. The authoritative table is
published at https://global-ecosystems.org/explore (typology v2.1; Keith et
al. 2022, *Nature*, doi:10.1038/s41586-022-05318-4), and the researcher
downloads it once. This adapter reads that file and matches against it.

What it does **not** do is ship a hard-coded EFG table reconstructed from
memory. An ecosystem code is an identifier; a plausible-looking wrong one
propagates into every row that cites it and is very hard to detect later. When
the table is absent, every ecosystem binding resolves to unresolved and the
run says so. That is the same discipline the archive applies to an
unverifiable citation.

There is NO MATCHING. A landscape binds to an EFG only through the
hand-authored crosswalk in scripts/ingest/landscapes.json, where every bound
row cites the GET profile that justifies it. The lexical matcher that used to
live here was deleted on 2026-09-12; bind() records why no tuned version of it
is admissible.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path
from typing import Iterator

from ..provenance import Unresolved, sha256_bytes
from .base import EnrichmentRecord, HarvestPlan, Source

REQUIRED_COLUMNS = ("realm_code", "realm_name", "biome_code", "biome_name", "efg_code", "efg_name")

TYPOLOGY_CITATION = (
    "Keith, D.A., Ferrer-Paris, J.R., Nicholson, E. et al. (2022). A function-based typology for "
    "Earth's ecosystems. Nature 610, 513-518. doi:10.1038/s41586-022-05318-4"
)

TYPOLOGY_SOURCE_URL = "https://global-ecosystems.org/explore"

STOPWORDS = {"and", "or", "the", "of", "a", "an", "in", "on", "with", "systems", "system", "biome"}


class IucnGetSource(Source):
    name = "iucn_get"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = REQUIRED_COLUMNS + ("source", "assigned_by", "match_basis")

    # --- typology table -------------------------------------------------

    def typology_path(self) -> Path:
        configured = str(self.cfg.get("typology_file", "config/iucn-get-typology.csv"))
        path = Path(configured)
        return path if path.is_absolute() else (self.config.root / configured).resolve()

    def preflight(self) -> list[str]:
        path = self.typology_path()
        if not path.exists():
            return [
                f"typology table not found at {path}. Download the Ecosystem Functional Group table "
                f"from {TYPOLOGY_SOURCE_URL} and save it there with columns "
                f"{', '.join(REQUIRED_COLUMNS)}. Until then, ecosystem bindings stay unresolved — "
                "they are never guessed."
            ]
        try:
            rows = self._load()
        except ValueError as exc:
            return [str(exc)]
        if not rows:
            return [f"{path} has no rows"]
        return []

    def _load(self) -> list[dict]:
        path = self.typology_path()
        if not path.exists():
            return []
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            header = reader.fieldnames or []
            missing = [c for c in REQUIRED_COLUMNS if c not in header]
            if missing:
                raise ValueError(
                    f"{path.name} is missing columns {', '.join(missing)}. Expected: "
                    f"{', '.join(REQUIRED_COLUMNS)}"
                )
            return [dict(row) for row in reader]

    def provenance(self) -> dict:
        path = self.typology_path()
        if not path.exists():
            return {"available": False, "citation": TYPOLOGY_CITATION, "source_url": TYPOLOGY_SOURCE_URL}
        return {
            "available": True,
            "path": str(path),
            "sha256": sha256_bytes(path.read_bytes()),
            "citation": TYPOLOGY_CITATION,
            "source_url": TYPOLOGY_SOURCE_URL,
        }

    # --- matching -------------------------------------------------------

    def estimate(self, plan: HarvestPlan) -> dict:
        return {"source": self.name, "calls": 0, "quota_units": 0, "note": "local table lookup"}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        table = self._load()
        for landscape in plan.landscapes:
            yield self.bind(landscape, table)

    def bind(self, landscape: dict, table: list[dict] | None = None) -> EnrichmentRecord:
        """Read the hand-authored crosswalk. No matching of any kind happens here.

        Ruling 2026-09-12. The former implementation scored lexical overlap
        between a landscape's free-text description and each EFG name, took the
        best score above a threshold, and reported near-ties as ambiguous. It is
        DELETED, not disabled, and no tuned version of it is admissible.

        Two controlled vocabularies that share no terminology cannot be bridged
        by string similarity. "Mangrove tidal forest" and "Intertidal forests
        and shrublands" are the same ecosystem and share no content word;
        "Tropical savanna grassland" and "Tropical flooded forests" are
        different ecosystems and share two. The score is therefore uncorrelated
        with correctness, and the failure mode is silent: a near miss yields a
        wrong EFG code that misdescribes a biome while carrying the full
        authority of a controlled identifier. Lowering the threshold admits more
        wrong codes; raising it just returns fewer. No setting recovers a signal
        that was never present.

        The binding now lives in scripts/ingest/landscapes.json as an explicit
        `iucn_get` object per landscape, each citing the GET profile that
        justifies it. A landscape that cannot be bound with a citation carries
        `iucn_get: null` and a one-word reason in `iucn_get_unbound` — that is
        citation-or-skip applied to taxonomy, and an honest null is the correct
        output for a registry-only placeholder with no scene and no archive.

        The typology table remains the authority for EFG code -> name. This
        method does not consult it: the crosswalk already carries the name that
        was read from it when the row was authored.
        """
        subject = landscape.get("id", "") or landscape.get("name", "")
        binding = landscape.get("iucn_get")

        if not binding:
            reason = landscape.get("iucn_get_unbound") or "not-in-crosswalk"
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", reason, subject)],
            )

        if not binding.get("source"):
            # A binding without its citation is precisely what this ruling
            # removed. Refused rather than trusted.
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", "crosswalk-row-has-no-citation", subject)],
            )

        self.manifest.count("iucn_get.bound")
        return EnrichmentRecord(
            source=self.name,
            subject=subject,
            kind="ecosystem-binding",
            payload={
                "efg_code": binding.get("efg", ""),
                "efg_name": binding.get("name", ""),
                "realm_code": binding.get("realm_code", ""),
                "realm_name": binding.get("realm") or "",
                "biome_code": binding.get("biome_code", ""),
                "biome_name": binding.get("biome") or "",
                "source": binding.get("source", ""),
                "assigned_by": binding.get("assigned_by", ""),
                "match_basis": "hand-authored-crosswalk-cited-per-row",
            },
        )
