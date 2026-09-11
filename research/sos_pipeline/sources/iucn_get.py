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

Matching is lexical and conservative: a landscape binds to an EFG only on an
unambiguous name match, and an ambiguous match is reported rather than
arbitrated.
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


def _tokens(text: str) -> set[str]:
    words = re.split(r"[^a-z]+", (text or "").lower())
    return {w for w in words if w and w not in STOPWORDS and len(w) > 2}


class IucnGetSource(Source):
    name = "iucn_get"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = REQUIRED_COLUMNS + ("match_score", "match_basis")

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
        """Bind one landscape to an EFG. Unambiguous matches only."""
        rows = self._load() if table is None else table
        subject = landscape.get("id", "") or landscape.get("name", "")

        if not rows:
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[
                    Unresolved(
                        field="biome_primary",
                        reason="typology-table-not-provided",
                        attempted=str(self.typology_path()),
                    )
                ],
            )

        description = " ".join(
            str(landscape.get(key, "")) for key in ("biome", "realm", "name", "type", "habitat")
        )
        wanted = _tokens(description)
        if not wanted:
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", "landscape-has-no-description", subject)],
            )

        scored: list[tuple[float, dict]] = []
        for row in rows:
            candidate = _tokens(f"{row.get('efg_name', '')} {row.get('biome_name', '')}")
            if not candidate:
                continue
            overlap = wanted & candidate
            if not overlap:
                continue
            score = len(overlap) / len(candidate | wanted)
            scored.append((score, row))

        if not scored:
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", "no-lexical-match-in-typology", description.strip())],
            )

        scored.sort(key=lambda pair: pair[0], reverse=True)
        best_score, best_row = scored[0]
        runner_up = scored[1][0] if len(scored) > 1 else 0.0

        # An ambiguous match is reported, not arbitrated. Two EFGs within a
        # hair of each other is exactly the case a human should settle.
        if best_score < 0.34 or (runner_up and best_score - runner_up < 0.05):
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={
                    "candidates": [
                        {"efg_code": row.get("efg_code"), "efg_name": row.get("efg_name"), "score": round(score, 3)}
                        for score, row in scored[:4]
                    ]
                },
                unresolved=[
                    Unresolved(
                        field="biome_primary",
                        reason="ambiguous-match-needs-human-decision",
                        attempted=description.strip(),
                    )
                ],
            )

        payload = {column: best_row.get(column, "") for column in REQUIRED_COLUMNS}
        payload["match_score"] = round(best_score, 3)
        payload["match_basis"] = "lexical-overlap-on-efg-and-biome-name"
        self.manifest.count("iucn_get.bound")

        return EnrichmentRecord(
            source=self.name,
            subject=subject,
            kind="ecosystem-binding",
            payload=payload,
        )
