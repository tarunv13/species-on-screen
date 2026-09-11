"""
Wayback Machine — availability check, and a worklist for the human.

`corpus-seed-framework.md` §3 makes archiving at capture an operating
principle: digital artefacts are deletable, so anything entering the corpus is
archived at the moment it enters. `coding-workspace-spec.md` §17 then puts
*Save Page Now clicks* on the manual list, alongside Zotero entry and CSV
export, for the duration of the pilot.

Those two are not in tension, and this adapter is the shape of the
reconciliation: it **reads** the availability API to find out whether a
snapshot already exists, and it **writes a worklist** of the URLs that still
need one. It never submits a save. `allow_save_page_now` exists in the config
so the decision is visible, and it is refused in code with the reason attached
rather than quietly honoured, because lifting a governance constraint is not a
configuration change.
"""

from __future__ import annotations

from typing import Iterator

from ..provenance import Unresolved
from .base import EnrichmentRecord, HarvestPlan, Source, SourceError


class WaybackSource(Source):
    name = "wayback"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = False
    field_allowlist = ("url", "timestamp", "status", "available", "archived_url")

    def preflight(self) -> list[str]:
        if self.cfg.get("allow_save_page_now"):
            return [
                "sources.wayback.allow_save_page_now is true, but this pipeline will not submit saves. "
                "coding-workspace-spec.md §17 keeps Wayback captures manual for the duration of the "
                "pilot. Set it back to false, or lift the constraint in the spec first — it is a "
                "governance decision, not a config toggle."
            ]
        return []

    def estimate(self, plan: HarvestPlan) -> dict:
        urls = plan.extra.get("urls", [])
        return {"source": self.name, "calls": len(urls), "quota_units": 0}

    def harvest(self, plan: HarvestPlan) -> Iterator[EnrichmentRecord]:
        for url in plan.extra.get("urls", []):
            yield self.availability(url)

    def save(self, url: str):
        """Refused by design. Present so the refusal is discoverable, not implicit."""
        raise SourceError(
            "Save Page Now is a manual step (coding-workspace-spec.md §17). The pipeline emits "
            f"{url} to data/capture-worklist.csv for a human to click."
        )

    def availability(self, url: str) -> EnrichmentRecord:
        """Ask whether a snapshot already exists. Read-only."""
        endpoint = self.cfg.require("availability_url")
        payload, receipt = self.http.get(
            endpoint,
            source=self.name,
            rate_per_second=self.rate(),
            params={"url": url},
        )
        snapshot = ((payload or {}).get("archived_snapshots") or {}).get("closest") or {}

        if not snapshot.get("available"):
            return EnrichmentRecord(
                source=self.name,
                subject=url,
                kind="archive-availability",
                payload={"url": url, "available": False, "archived_url": ""},
                receipt=receipt,
                unresolved=[
                    Unresolved(
                        field="wayback_url",
                        reason="no-snapshot-capture-manually",
                        attempted=url,
                    )
                ],
            )

        self.manifest.count("wayback.already_archived")
        return EnrichmentRecord(
            source=self.name,
            subject=url,
            kind="archive-availability",
            payload={
                "url": url,
                "available": True,
                "archived_url": snapshot.get("url", ""),
                "timestamp": snapshot.get("timestamp", ""),
                "status": snapshot.get("status", ""),
            },
            receipt=receipt,
        )


def worklist_row(artefact_id: str, title: str, url: str, record: EnrichmentRecord | None) -> dict:
    """One line of the manual capture worklist."""
    available = bool(record and record.payload.get("available"))
    return {
        "artefact_id": artefact_id,
        "title": title,
        "url_primary": url,
        "wayback_url": (record.payload.get("archived_url", "") if record else ""),
        "archive_status": "wayback-archived" if available else "metadata-only",
        "action": "none" if available else "run Save Page Now on url_primary, then paste the snapshot URL",
    }
