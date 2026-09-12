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
    field_allowlist = REQUIRED_COLUMNS + ("bindings", "binding_count", "source", "assigned_by", "match_basis", "partial")

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
        and shrublands" are the SAME ecosystem and share no content word;
        "Tropical savanna grassland" and "Tropical flooded forests" are
        DIFFERENT ecosystems and share two. The score is uncorrelated with
        correctness, and the failure is silent: a near miss yields a wrong EFG
        code that misdescribes a biome while carrying the full authority of a
        controlled identifier. Lowering the threshold admits more wrong codes;
        raising it merely returns fewer.

        `iucn_get` IS AN ARRAY, because a place can genuinely be more than one
        Ecosystem Functional Group and a single field silently drops the second.
        The Sundarbans is both MFT1.2 (the mangrove forest) and MFT1.1 (the
        delta mosaic it is embedded in), and the MFT1.1 profile says so itself.

        EVERY ELEMENT IS VALIDATED SEPARATELY and must carry its own citation.
        An uncited element is refused while its cited siblings are kept, and the
        refusal is reported — the array must never become a place to park a
        guess beside a good row and inherit its credibility.

        NULL IS NOT AN EMPTY ARRAY. `iucn_get: null` means NOT EXAMINED, and
        carries a one-word reason in `iucn_get_unbound`. An empty array would
        assert that the place was examined and nothing fitted, which is a
        stronger claim than the registry can support for an unbuilt placeholder.

        The typology table remains the authority for EFG code -> name. This
        method does not consult it: each element already carries the name that
        was read from it when the row was authored.
        """
        subject = landscape.get("id", "") or landscape.get("name", "")
        crosswalk = landscape.get("iucn_get")

        if crosswalk is None:
            reason = landscape.get("iucn_get_unbound") or "not-in-crosswalk"
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", reason, subject)],
            )

        if not isinstance(crosswalk, list):
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", "crosswalk-not-an-array", subject)],
            )

        if not crosswalk:
            # An empty array is a schema error, not a finding: a place examined
            # and found to fit nothing would be null with a recorded reason.
            return EnrichmentRecord(
                source=self.name,
                subject=subject,
                kind="ecosystem-binding",
                payload={},
                unresolved=[Unresolved("biome_primary", "crosswalk-array-is-empty", subject)],
            )

        bindings: list[dict] = []
        unresolved: list[Unresolved] = []
        for index, element in enumerate(crosswalk):
            if not isinstance(element, dict):
                unresolved.append(Unresolved("biome_primary", "crosswalk-element-not-an-object", f"{subject}[{index}]"))
                continue
            code = element.get("efg", "")
            if not code:
                unresolved.append(Unresolved("biome_primary", "crosswalk-element-has-no-efg", f"{subject}[{index}]"))
                continue
            # Per-element citation gate. An element without its source, or
            # without the quoted profile text that justifies it, is exactly what
            # this ruling removed and is refused on its own terms.
            if not element.get("source"):
                unresolved.append(Unresolved("biome_primary", "crosswalk-element-has-no-citation", f"{subject}[{index}] {code}"))
                continue
            if not element.get("justification"):
                unresolved.append(Unresolved("biome_primary", "crosswalk-element-has-no-justification", f"{subject}[{index}] {code}"))
                continue
            bindings.append({
                "efg_code": code,
                "efg_name": element.get("name", ""),
                "realm_code": element.get("realm_code", ""),
                "realm_name": element.get("realm") or "",
                "biome_code": element.get("biome_code", ""),
                "biome_name": element.get("biome") or "",
                "source": element.get("source", ""),
                "assigned_by": element.get("assigned_by", ""),
            })
            self.manifest.count("iucn_get.bound")

        # A place whose examined-and-rejected second ecosystem was recorded says
        # so, so a later reader does not repeat the search.
        partial = landscape.get("iucn_get_partial")

        payload: dict = {}
        if bindings:
            payload = {
                "bindings": bindings,
                "binding_count": len(bindings),
                "match_basis": "hand-authored-crosswalk-cited-per-element",
            }
            if partial:
                payload["partial"] = partial

        return EnrichmentRecord(
            source=self.name,
            subject=subject,
            kind="ecosystem-binding",
            payload=payload,
            unresolved=unresolved,
        )
