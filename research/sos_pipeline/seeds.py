"""
The sampling frame: where the queries come from.

The frame is not invented here. `scripts/ingest/landscapes.json` already holds
24 priority landscapes with their realm, biome, region, countries and — for the
news layer — a hand-written `newsQuery`. `scripts/ingest/places.config.json`
holds the per-place actor lists with scientific names and IUCN categories.
Both are existing, curated, committed artefacts. Reusing them means the media
corpus is sampled against the same places the Observatory already covers,
rather than against a second list that would drift from the first.

`corpus-seed-framework.md` §4 asks for the sampling frame to be named
explicitly and its biases documented as part of the corpus. `describe()` is
that naming: it emits the frame in full, so a run manifest carries the exact
set of landscapes and taxa the queries were built from.
"""

from __future__ import annotations

import json
from pathlib import Path

from .sources.base import HarvestPlan


class SeedError(RuntimeError):
    """The seed files are missing or malformed."""


def load_landscapes(path: Path, only: list[str] | None = None) -> list[dict]:
    if not path.exists():
        raise SeedError(f"landscape registry not found at {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SeedError(f"{path} is not valid JSON: {exc}") from exc

    landscapes = data.get("landscapes") or []
    if not landscapes:
        raise SeedError(f"{path} carries no landscapes")

    if only:
        wanted = set(only)
        selected = [item for item in landscapes if item.get("id") in wanted]
        missing = wanted - {item.get("id") for item in selected}
        if missing:
            raise SeedError(
                f"landscape ids not in the registry: {', '.join(sorted(missing))}. "
                f"Available: {', '.join(sorted(item.get('id', '') for item in landscapes))}"
            )
        return selected
    return list(landscapes)


def load_taxa(path: Path, landscape_ids: list[str] | None = None) -> list[dict]:
    """
    Actors from the place configuration, as taxon records.

    Only places that have a field record carry actors, so this is a subset of
    the landscape registry by construction. That asymmetry is deliberate in the
    source data and is preserved rather than papered over.
    """
    if not path.exists():
        raise SeedError(f"place configuration not found at {path}")
    data = json.loads(path.read_text(encoding="utf-8"))

    taxa: list[dict] = []
    for place_id, place in data.items():
        if place_id.startswith("_"):
            continue
        if landscape_ids and place_id not in landscape_ids:
            continue
        for actor in place.get("actors", []):
            taxa.append(
                {
                    "place": place_id,
                    "scientificName": actor.get("sci", ""),
                    "commonName": actor.get("vern", ""),
                    "role": actor.get("role", ""),
                    "iucn": actor.get("iucn", ""),
                    "bbox": place.get("bbox"),
                }
            )
    return taxa


def load_interactions(path: Path, landscape_ids: list[str] | None = None) -> list[dict]:
    """Editorial interaction pairs, for the GloBI evidence pass."""
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    interactions: list[dict] = []
    for place_id, place in data.items():
        if place_id.startswith("_"):
            continue
        if landscape_ids and place_id not in landscape_ids:
            continue
        for interaction in place.get("interactions", []):
            interactions.append(
                {
                    "place": place_id,
                    "from": interaction.get("from", ""),
                    "to": interaction.get("to", ""),
                    "type": interaction.get("type", "interactsWith"),
                }
            )
    return interactions


def build_queries(config, landscapes: list[dict], taxa: list[dict]) -> list[str]:
    """
    Expand the configured templates against the frame.

    Deterministic and order-stable: the same config and the same seed files
    produce the same query list, which is what makes a run reproducible from
    the manifest alone.
    """
    seed = config.seed
    queries: list[str] = []

    for landscape in landscapes:
        values = {
            "landscape": landscape.get("name", ""),
            "biome": landscape.get("biome", ""),
            "realm": landscape.get("realm", ""),
            "region": landscape.get("region", ""),
            "protected_area": landscape.get("protectedArea", ""),
            "taxon_common": "",
            "taxon_scientific": "",
        }
        for template in seed.get("query_templates", []):
            if "{taxon_common}" in template or "{taxon_scientific}" in template:
                continue
            rendered = _render(template, values)
            if rendered:
                queries.append(rendered)

    for taxon in taxa:
        place_name = next(
            (item.get("name", "") for item in landscapes if item.get("id") == taxon.get("place")),
            taxon.get("place", ""),
        )
        values = {
            "landscape": place_name,
            "biome": "",
            "realm": "",
            "region": "",
            "protected_area": "",
            "taxon_common": taxon.get("commonName", ""),
            "taxon_scientific": taxon.get("scientificName", ""),
        }
        for template in list(seed.get("query_templates", [])) + list(seed.get("taxon_query_templates", [])):
            if "{taxon_common}" not in template and "{taxon_scientific}" not in template:
                continue
            rendered = _render(template, values)
            if rendered:
                queries.append(rendered)

    seen: list[str] = []
    for query in queries:
        if query not in seen:
            seen.append(query)
    return seen


def _render(template: str, values: dict) -> str:
    try:
        rendered = template.format(**values)
    except KeyError:
        return ""
    collapsed = " ".join(rendered.split())
    # A template whose variables were all empty renders to nothing useful.
    return collapsed if len(collapsed) > 2 else ""


def build_plan(
    config,
    *,
    landscape_ids: list[str] | None = None,
    limit: int | None = None,
    since: str = "",
    until: str = "",
    dry_run: bool = False,
    extra_queries: list[str] | None = None,
) -> HarvestPlan:
    """Assemble the full plan from the seed files and the configuration."""
    configured = landscape_ids or list(config.seed.get("landscape_ids") or [])
    landscapes = load_landscapes(config.seed_path("landscapes_file"), configured or None)
    ids = [item.get("id", "") for item in landscapes]
    taxa = load_taxa(config.seed_path("places_file"), ids)
    interactions = load_interactions(config.seed_path("places_file"), ids)

    queries = build_queries(config, landscapes, taxa)
    if extra_queries:
        queries = list(dict.fromkeys(queries + extra_queries))

    return HarvestPlan(
        landscapes=landscapes,
        taxa=taxa,
        queries=queries,
        limit=limit,
        since=since,
        until=until,
        dry_run=dry_run,
        extra={"interactions": interactions, "urls": []},
    )


def describe_frame(plan: HarvestPlan) -> dict:
    """
    The sampling frame, stated explicitly.

    §4 of the corpus framework: every corpus is a sample, the frame is named,
    and its biases are documented as part of the corpus rather than as an
    apologetic appendix.
    """
    regions: dict[str, int] = {}
    countries: dict[str, int] = {}
    realms: dict[str, int] = {}
    for landscape in plan.landscapes:
        region = landscape.get("region", "unspecified")
        regions[region] = regions.get(region, 0) + 1
        realms[landscape.get("realm", "unspecified")] = realms.get(landscape.get("realm", "unspecified"), 0) + 1
        for country in landscape.get("countries", []):
            countries[country] = countries.get(country, 0) + 1

    return {
        "landscape_count": len(plan.landscapes),
        "landscape_ids": [item.get("id") for item in plan.landscapes],
        "taxon_count": len(plan.taxa),
        "query_count": len(plan.queries),
        "interaction_count": len(plan.extra.get("interactions", [])),
        "regions": dict(sorted(regions.items())),
        "realms": dict(sorted(realms.items())),
        "countries": dict(sorted(countries.items())),
        "queries": list(plan.queries),
    }
