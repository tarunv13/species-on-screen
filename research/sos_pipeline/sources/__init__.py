"""
The source registry.

Adding a platform is two steps: write the adapter module here, and add its
entry to `config/pipeline.config.json`. Nothing else in the pipeline changes.

Imports are lazy so that a broken or optional adapter cannot stop the whole
run from starting, and so `doctor` can report a source that fails to import as
one more diagnosable problem rather than a stack trace on startup.
"""

from __future__ import annotations

import importlib
from typing import Type

from .base import (
    EnclaveOnlyError,
    EnrichmentRecord,
    HarvestPlan,
    HarvestRecord,
    Source,
    SourceError,
    first_present,
    flatten,
)

#: config key -> "module:ClassName"
REGISTRY: dict[str, str] = {
    "youtube": "youtube:YouTubeSource",
    "meta_content_library": "meta_content_library:MetaContentLibrarySource",
    "tmdb": "tmdb:TmdbSource",
    "omdb": "omdb:OmdbSource",
    "igdb": "igdb:IgdbSource",
    "gbif": "gbif:GbifSource",
    "iucn_redlist": "iucn_redlist:IucnRedListSource",
    "iucn_get": "iucn_get:IucnGetSource",
    "globi": "globi:GlobiSource",
    "gdelt": "gdelt:GdeltSource",
    "wikipedia": "wikipedia:WikipediaSource",
    "wayback": "wayback:WaybackSource",
}

#: Sources that mint corpus artefacts, as opposed to enriching them.
ARTEFACT_SOURCES = ("youtube", "meta_content_library", "tmdb", "omdb", "igdb")

#: Sources that resolve identifiers or supply signal about a subject.
ENRICHMENT_SOURCES = ("gbif", "iucn_redlist", "iucn_get", "globi", "gdelt", "wikipedia", "wayback")


class UnknownSource(SourceError):
    """The name is not in the registry."""


def source_class(name: str) -> Type[Source]:
    if name not in REGISTRY:
        raise UnknownSource(f"unknown source '{name}'; known: {', '.join(sorted(REGISTRY))}")
    module_name, class_name = REGISTRY[name].split(":")
    module = importlib.import_module(f"{__name__}.{module_name}")
    return getattr(module, class_name)


def build(name: str, config, http, ledger, manifest, ethics) -> Source:
    """Instantiate one adapter against the shared plumbing."""
    return source_class(name)(config, config.source(name), http, ledger, manifest, ethics)


__all__ = [
    "ARTEFACT_SOURCES",
    "ENRICHMENT_SOURCES",
    "EnclaveOnlyError",
    "EnrichmentRecord",
    "HarvestPlan",
    "HarvestRecord",
    "REGISTRY",
    "Source",
    "SourceError",
    "UnknownSource",
    "build",
    "first_present",
    "flatten",
    "source_class",
]
