"""
The source adapter contract.

Every source — media platform or biodiversity register — implements `Source`.
The harvester knows nothing about any particular API; it knows this interface,
the ethics gates, and the schema. Adding a platform means adding one module
here and one entry to the config, never touching the harvester.

Three rules bind every adapter:

1. Metadata only. No adapter downloads content files. (§8.1)
2. Declared fields only. Anything outside `field_allowlist` is dropped before
   it is written, and the drop is counted. (§8.8, data minimisation)
3. Core metadata only. An adapter fills the §1.1 columns and the taxon
   identifier columns. It never fills an interpretive field, and `schema.validate_row`
   rejects it if it tries. (coding-workspace-spec §17)
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Iterator

from ..provenance import Receipt, Unresolved


class SourceError(RuntimeError):
    """The adapter cannot run. Distinct from a transport failure."""


class EnclaveOnlyError(SourceError):
    """
    The adapter cannot run on this machine by design.

    Raised by the Meta Content Library adapter outside the secure research
    environment. Not a configuration problem to work around: the API is only
    reachable from inside Meta's Secure Research Environment or the ICPSR SOMAR
    Virtual Data Enclave.
    """


@dataclass
class HarvestPlan:
    """What a single harvest run intends to do, decided before any call is made."""

    landscapes: list[dict] = field(default_factory=list)
    taxa: list[dict] = field(default_factory=list)
    queries: list[str] = field(default_factory=list)
    limit: int | None = None
    since: str = ""
    until: str = ""
    dry_run: bool = False
    extra: dict = field(default_factory=dict)

    def describe(self) -> dict:
        return {
            "landscapes": [item.get("id") for item in self.landscapes],
            "taxa": [item.get("scientificName") for item in self.taxa],
            "queries": list(self.queries),
            "limit": self.limit,
            "since": self.since,
            "until": self.until,
            "dry_run": self.dry_run,
            "extra": dict(self.extra),
        }


@dataclass
class HarvestRecord:
    """
    One artefact as the harvest plane sees it.

    `payload` is the minimised source record kept for the raw store.
    `corpus_row` and `species_rows` are the corpus-plane projection, carrying
    core metadata only. `unresolved` names what could not be attested; those
    fields are written empty, never guessed.
    """

    source: str
    external_id: str
    payload: dict
    corpus_row: dict
    species_rows: list[dict] = field(default_factory=list)
    receipt: Receipt | None = None
    unresolved: list[Unresolved] = field(default_factory=list)
    audience_size: int | None = None
    dropped_fields: int = 0

    def unresolved_tokens(self) -> str:
        from ..schema import join_list

        return join_list(item.as_token() for item in self.unresolved)


@dataclass
class EnrichmentRecord:
    """
    A biodiversity or culturomics lookup keyed by a subject, not an artefact.

    GBIF, IUCN, GloBI, GDELT and Wikipedia produce these. They do not create
    corpus rows; they resolve identifiers and supply signal that a coder or an
    analysis reads alongside the corpus.
    """

    source: str
    subject: str
    kind: str
    payload: dict
    receipt: Receipt | None = None
    unresolved: list[Unresolved] = field(default_factory=list)


class Source(ABC):
    """Base class for every adapter."""

    #: config key and raw-store folder name
    name: str = ""

    #: what this adapter is permitted to collect, asserted against the ethics gate
    tos_posture: str = "metadata-only"

    #: §8.8 data minimisation. Only these keys survive into the raw store.
    field_allowlist: tuple[str, ...] = ()

    #: whether this adapter produces corpus rows or only enrichment
    produces_corpus_rows: bool = True

    #: §8.3. True where the source catalogues institutional producers — studios,
    #: broadcasters, publishers, registries — whose publication of public work is
    #: itself the licence to be analysed academically. The audience-size gate does
    #: not apply to them. False for platforms that mix institutional and individual
    #: creators, where the threshold is the whole point.
    institutional_producer: bool = False

    def __init__(self, config, source_config, http, ledger, manifest, ethics) -> None:
        self.config = config
        self.cfg = source_config
        self.http = http
        self.ledger = ledger
        self.manifest = manifest
        self.ethics = ethics

    # --- lifecycle ----------------------------------------------------

    def preflight(self) -> list[str]:
        """
        Check credentials and configuration without spending a call.

        Returns a list of human-readable problems. An empty list means ready.
        Never raises: `doctor` calls this across every source at once.
        """
        return []

    @abstractmethod
    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord | EnrichmentRecord]:
        """Yield records for the plan. Implementations are generators."""

    def estimate(self, plan: HarvestPlan) -> dict:
        """Quota and call estimate for `plan`, for the `plan` command. No network."""
        return {"source": self.name, "calls": "unknown", "quota_units": "unknown"}

    def describe(self) -> dict:
        return {
            "name": self.name,
            "tos_posture": self.tos_posture,
            "produces_corpus_rows": self.produces_corpus_rows,
            "allowlisted_fields": len(self.field_allowlist),
        }

    # --- helpers shared by adapters -----------------------------------

    def minimise(self, payload: dict) -> tuple[dict, int]:
        """
        Keep only allowlisted keys. Returns (kept, dropped_count).

        An empty allowlist means the adapter has not declared its fields, which
        is a programming error rather than permission to keep everything.
        """
        if not self.field_allowlist:
            raise SourceError(f"source '{self.name}' declares no field_allowlist; §8.8 requires one")
        kept = {key: payload[key] for key in self.field_allowlist if key in payload}
        return kept, max(0, len(payload) - len(kept))

    def rate(self) -> float:
        return float(self.cfg.get("requests_per_second", 5))

    def api_version(self) -> str:
        return str(self.cfg.get("api_version", ""))


def flatten(payload: dict, prefix: str = "", out: dict | None = None) -> dict:
    """
    Flatten a nested API payload to dotted keys so an allowlist can name a
    nested field directly (`snippet.title`) without every adapter writing its
    own walker.
    """
    out = {} if out is None else out
    for key, value in payload.items():
        path = f"{prefix}{key}"
        if isinstance(value, dict):
            flatten(value, f"{path}.", out)
        else:
            out[path] = value
    return out


def first_present(payload: dict, *paths: str, default: Any = "") -> Any:
    """Return the first non-empty value among dotted paths. No guessing beyond order."""
    for path in paths:
        node: Any = payload
        for part in path.split("."):
            if isinstance(node, dict) and part in node:
                node = node[part]
            else:
                node = None
                break
        if node not in (None, "", [], {}):
            return node
    return default
