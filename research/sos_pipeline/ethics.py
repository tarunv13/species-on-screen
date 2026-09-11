"""
The ethics gates, as code rather than as a paragraph in a methods section.

Authority: `corpus-seed-framework.md` §8 (ethical concerns) and §9 (bias
risks); `SENSITIVE-DATA-POLICY.md` for locality generalisation.

Four gates, each doing one job:

  ToSGate                What a source is permitted to collect at all. (§8.2)
  ConsentGate            Whose content may be collected without asking. (§8.3)
  MinimisationGate       How much of a record is kept. (§8.8)
  SensitiveLocalityGate  How precisely a place may be written down.

Every refusal is counted, and the counts appear in the run report. An
exclusion that leaves no trace is a silent bias; a counted one is a documented
sampling-frame decision, which is what §9.8 asks for.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .provenance import Unresolved

# §8.2. A source may only run if its declared posture is one this project
# accepts. `content-download` is deliberately absent: the pipeline collects
# metadata, and no flag turns that off.
ACCEPTED_POSTURES = {
    "metadata-only",
    "metadata-only-public-api",
    "vetted-export",  # Meta Content Library: data vetted and carried out of the enclave by a human
}

REFUSED_POSTURES = {
    "content-download",
    "scrape",
    "authenticated-scrape",
    "algorithmic-feed-sampling",
}


class EthicsRefusal(RuntimeError):
    """A source or record may not be collected. Not recoverable by retrying."""


@dataclass
class Decision:
    admitted: bool
    reason: str = ""

    def __bool__(self) -> bool:
        return self.admitted


@dataclass
class EthicsGate:
    """The four gates, held together so a source only receives one object."""

    min_creator_audience: int = 10000
    collect_comments: bool = False
    collect_content_files: bool = False
    algorithmic_sampling: bool = False
    coordinate_decimal_places: int = 1
    coordinate_uncertainty_m: int = 25000
    locality_blocked_iucn_categories: tuple[str, ...] = ("CR", "EN", "VU")
    locality_blocked_taxa: tuple[str, ...] = ()
    exclusions: dict = field(default_factory=dict)

    @classmethod
    def from_config(cls, config) -> "EthicsGate":
        ethics = config.ethics
        return cls(
            min_creator_audience=int(ethics.get("min_creator_audience", 10000)),
            collect_comments=bool(ethics.get("collect_comments", False)),
            collect_content_files=bool(ethics.get("collect_content_files", False)),
            algorithmic_sampling=bool(ethics.get("algorithmic_sampling", False)),
            coordinate_decimal_places=int(ethics.get("coordinate_decimal_places", 1)),
            coordinate_uncertainty_m=int(ethics.get("coordinate_uncertainty_m", 25000)),
            locality_blocked_iucn_categories=tuple(ethics.get("locality_blocked_iucn_categories", ["CR", "EN", "VU"])),
            locality_blocked_taxa=tuple(ethics.get("locality_blocked_taxa", [])),
        )

    # --- counting -----------------------------------------------------

    def _refuse(self, reason: str) -> Decision:
        self.exclusions[reason] = self.exclusions.get(reason, 0) + 1
        return Decision(False, reason)

    def report(self) -> dict:
        return dict(sorted(self.exclusions.items()))

    # --- §8.2 terms of service ----------------------------------------

    def check_source(self, source) -> None:
        """Called once per source before any request. Raises rather than skipping quietly."""
        posture = getattr(source, "tos_posture", "")
        if posture in REFUSED_POSTURES:
            raise EthicsRefusal(
                f"source '{source.name}' declares posture '{posture}', which this pipeline refuses "
                "(corpus-seed-framework §8.2)"
            )
        if posture not in ACCEPTED_POSTURES:
            raise EthicsRefusal(
                f"source '{source.name}' declares an unrecognised posture '{posture}'. "
                f"Accepted: {', '.join(sorted(ACCEPTED_POSTURES))}"
            )
        if self.collect_content_files:
            raise EthicsRefusal(
                "ethics.collect_content_files is true. This pipeline collects metadata only "
                "(corpus-seed-framework §8.1); content capture is a manual, rights-checked act."
            )
        if self.algorithmic_sampling and not getattr(source, "supports_declared_queries", True):
            raise EthicsRefusal(f"source '{source.name}' cannot sample without algorithmic mediation (§8.5)")

    # --- §8.3 producer consent ----------------------------------------

    def admits_creator(self, audience_size: int | None, *, institutional: bool = False) -> Decision:
        """
        Institutional producers publish to be read; individual creators below the
        threshold are consent-or-opt-out territory and are excluded by default.

        An unknown audience size is excluded, not admitted. The framework does
        not offer a default, and admitting on ignorance would quietly load the
        corpus with exactly the small creators §8.3 protects.
        """
        if institutional:
            return Decision(True, "institutional-producer")
        if audience_size is None:
            return self._refuse("creator-audience-unknown")
        if audience_size < self.min_creator_audience:
            return self._refuse("creator-below-audience-threshold")
        return Decision(True, "audience-above-threshold")

    # --- §8.4 / §8.8 comments -----------------------------------------

    def admits_comments(self) -> Decision:
        if not self.collect_comments:
            return self._refuse("comments-disabled-by-policy")
        return Decision(True, "comments-enabled")

    # --- SENSITIVE-DATA-POLICY.md -------------------------------------

    def generalise_coordinate(
        self,
        latitude: float | None,
        longitude: float | None,
        *,
        taxon: str = "",
        iucn_category: str = "",
    ) -> tuple[str, str, str, list[Unresolved]]:
        """
        Return (lat, lng, uncertainty_m, unresolved) with locality generalised.

        A precise locality for a threatened or listed taxon is not generalised
        but withheld: the policy calls publishing one a blocking condition, and
        the safe machine behaviour at that boundary is to write nothing.
        """
        unresolved: list[Unresolved] = []
        blocked_taxon = taxon and any(taxon.lower().startswith(t.lower()) for t in self.locality_blocked_taxa)
        blocked_status = iucn_category.upper() in self.locality_blocked_iucn_categories

        if blocked_taxon or blocked_status:
            reason = "sensitive-taxon" if blocked_taxon else f"iucn-{iucn_category.lower()}"
            self._refuse(f"locality-withheld-{reason}")
            unresolved.append(
                Unresolved(
                    field="decimalLatitude/decimalLongitude",
                    reason=f"locality-withheld:{reason}",
                    attempted="SENSITIVE-DATA-POLICY.md review gate",
                )
            )
            return "", "", "", unresolved

        if latitude is None or longitude is None:
            return "", "", "", unresolved

        places = self.coordinate_decimal_places
        return (
            f"{round(float(latitude), places):.{places}f}",
            f"{round(float(longitude), places):.{places}f}",
            str(self.coordinate_uncertainty_m),
            unresolved,
        )


class MinimisationReport:
    """Counts what data minimisation removed, so the removal is visible."""

    def __init__(self) -> None:
        self.dropped_by_source: dict[str, int] = {}
        self.kept_by_source: dict[str, int] = {}

    def note(self, source: str, kept: int, dropped: int) -> None:
        self.kept_by_source[source] = self.kept_by_source.get(source, 0) + kept
        self.dropped_by_source[source] = self.dropped_by_source.get(source, 0) + dropped

    def report(self) -> dict:
        return {
            "fields_kept": dict(sorted(self.kept_by_source.items())),
            "fields_dropped": dict(sorted(self.dropped_by_source.items())),
        }
