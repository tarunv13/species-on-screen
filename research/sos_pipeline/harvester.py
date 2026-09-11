"""
The harvester: the one place that turns adapter output into corpus rows.

Adapters know their API. The harvester knows the rules, and applies them in a
fixed order so that every source is treated identically:

  1. Terms-of-service gate       — may this source run at all
  2. Consent gate                — may this artefact be collected
  3. Central normalisation       — dates and language codes, one convention
  4. Identifier allocation       — pilot-NNN, minted once, never reused
  5. Schema validation           — including the harvest/coder boundary
  6. Raw store                   — the payload, with provenance
  7. Corpus merge                — harvest-owned columns only

Any adapter that tries to skip a step fails validation at step 5, which is why
that step exists in a shared place rather than inside each adapter.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Iterable

from . import sources as source_registry
from .ethics import EthicsGate, EthicsRefusal, MinimisationReport
from .ids import ArtefactIdAllocator, slugify
from .normalize import iso_date, language_code
from .provenance import RunManifest, today_iso
from .ratelimit import QuotaExhausted
from .schema import SchemaError, join_list, split_list, validate_row, validate_species_row
from .sources.base import EnclaveOnlyError, EnrichmentRecord, HarvestPlan, HarvestRecord, SourceError
from .store import CorpusStore, RawStore, notes_path_for


class Harvester:
    """Runs one or more sources against a plan and writes the results."""

    def __init__(self, config, http, ledger, manifest: RunManifest) -> None:
        self.config = config
        self.http = http
        self.ledger = ledger
        self.manifest = manifest
        self.ethics = EthicsGate.from_config(config)
        self.minimisation = MinimisationReport()
        self.raw_store = RawStore(config.raw_dir)
        self.corpus_store = CorpusStore(config.data_dir)
        self.allocator = ArtefactIdAllocator(
            config.id_ledger_path,
            prefix=str(config.corpus.get("corpus_version", "pilot")),
        )
        self.allocator.absorb_existing(self.corpus_store.existing_ids())
        self.enrichment: list[EnrichmentRecord] = []

    # --- public API ---------------------------------------------------

    def run(self, source_names: Iterable[str], plan: HarvestPlan, *, refresh: bool = False) -> dict:
        corpus_rows: list[dict] = []
        species_rows: list[dict] = []
        results: dict[str, dict] = {}

        for name in source_names:
            results[name] = self._run_one(name, plan, corpus_rows, species_rows)

        merge_stats = {"appended": 0, "updated": 0, "unchanged": 0, "protected_cells": 0}
        species_stats = dict(merge_stats)

        if not plan.dry_run:
            if corpus_rows:
                merge_stats = self.corpus_store.merge(corpus_rows, refresh_harvest_fields=refresh)
            if species_rows:
                species_stats = self.corpus_store.merge_species(species_rows, refresh_harvest_fields=refresh)
            self.corpus_store.write_vocabularies(str(self.config.corpus.get("vocab_version", "v0.1")))
            self._write_enrichment()

        self.manifest.sources = results
        self.manifest.quota_spent = self.ledger.summary()
        self.manifest.exclusions.update(self.ethics.report())
        self.manifest.counts["corpus_rows_prepared"] = len(corpus_rows)
        self.manifest.counts["species_rows_prepared"] = len(species_rows)

        return {
            "sources": results,
            "corpus": merge_stats,
            "species": species_stats,
            "minimisation": self.minimisation.report(),
            "exclusions": self.ethics.report(),
            "enrichment_records": len(self.enrichment),
        }

    # --- per-source ---------------------------------------------------

    def _run_one(self, name: str, plan: HarvestPlan, corpus_rows: list, species_rows: list) -> dict:
        outcome = {"records": 0, "admitted": 0, "refused": 0, "errors": []}

        try:
            source = source_registry.build(name, self.config, self.http, self.ledger, self.manifest, self.ethics)
        except SourceError as exc:
            outcome["errors"].append(str(exc))
            return outcome

        try:
            self.ethics.check_source(source)
        except EthicsRefusal as exc:
            outcome["errors"].append(str(exc))
            self.manifest.warn(f"{name}: {exc}")
            return outcome

        problems = source.preflight()
        if problems:
            outcome["errors"].extend(problems)
            for problem in problems:
                self.manifest.warn(f"{name}: {problem}")
            return outcome

        if plan.dry_run:
            outcome["estimate"] = source.estimate(plan)
            return outcome

        raw_batch: list[dict] = []
        try:
            for record in source.harvest(plan):
                outcome["records"] += 1

                if isinstance(record, EnrichmentRecord):
                    self.enrichment.append(record)
                    self.manifest.note_unresolved(record.unresolved)
                    outcome["admitted"] += 1
                    continue

                admitted = self._admit(source, record, corpus_rows, species_rows)
                if admitted:
                    outcome["admitted"] += 1
                    raw_batch.append(self.raw_store.append_record(record, self.manifest.run_id))
                else:
                    outcome["refused"] += 1

        except QuotaExhausted as exc:
            outcome["errors"].append(str(exc))
            self.manifest.warn(f"{name}: {exc}")
        except EnclaveOnlyError as exc:
            outcome["errors"].append(str(exc))
            self.manifest.warn(f"{name}: {exc}")
        except SourceError as exc:
            outcome["errors"].append(str(exc))
            self.manifest.warn(f"{name}: {exc}")
        except Exception as exc:  # a transport failure should not lose the rows already gathered
            outcome["errors"].append(f"{type(exc).__name__}: {exc}")
            self.manifest.warn(f"{name}: {type(exc).__name__}: {exc}")

        outcome["raw_records_written"] = len(raw_batch)
        return outcome

    # --- per-record ---------------------------------------------------

    def _admit(self, source, record: HarvestRecord, corpus_rows: list, species_rows: list) -> bool:
        decision = self.ethics.admits_creator(
            record.audience_size, institutional=source.institutional_producer
        )
        if not decision:
            self.manifest.exclude(decision.reason)
            return False

        self.minimisation.note(source.name, len(record.payload), record.dropped_fields)

        row = self._finalise_row(source, record)
        try:
            validate_row(row, harvest_only=True)
        except SchemaError as exc:
            self.manifest.warn(f"{source.name}: row for {record.external_id} rejected — {exc}")
            self.manifest.exclude("schema-validation-failed")
            return False

        corpus_rows.append(row)

        for species_row in record.species_rows:
            species_row.setdefault("artefact_id", row["artefact_id"])
            species_row.setdefault("harvest_run_id", self.manifest.run_id)
            try:
                validate_species_row(species_row, harvest_only=True)
            except SchemaError as exc:
                self.manifest.warn(f"{source.name}: species row rejected — {exc}")
                continue
            species_rows.append(species_row)

        self.manifest.note_unresolved(record.unresolved)
        return True

    def _finalise_row(self, source, record: HarvestRecord) -> dict:
        """
        Stamp the identifier, apply one date/language convention, fill the
        workspace bookkeeping columns.

        Adapters deliberately do not mint identifiers. §14 requires ids to be
        issued once, in sequence, at the candidate-to-included transition; an
        adapter that minted its own would produce a second sequence the moment
        two sources ran in parallel.
        """
        row = dict(record.corpus_row)
        allocation = self.allocator.allocate(source.name, record.external_id)
        row["artefact_id"] = allocation.artefact_id

        if not row.get("slug"):
            row["slug"] = slugify(row.get("title", "") or allocation.artefact_id)

        row["date_published"] = iso_date(row.get("date_published")) or row.get("date_published", "")
        row["date_captured"] = iso_date(row.get("date_captured")) or today_iso()

        codes = [language_code(part) for part in split_list(row.get("languages", ""))]
        row["languages"] = join_list([code for code in codes if code])

        row.setdefault("coding_status", "candidate")
        if not row.get("coding_status"):
            row["coding_status"] = "candidate"
        row["notes_path"] = notes_path_for(allocation.artefact_id)
        row["corpus_version_added"] = row.get("corpus_version_added") or str(
            self.config.corpus.get("corpus_version", "")
        )
        row["coder_id"] = row.get("coder_id") or str(self.config.corpus.get("coder_id", ""))
        row["schema_version_at_coding"] = row.get("schema_version_at_coding") or str(
            self.config.corpus.get("schema_version", "")
        )
        row["vocab_version_at_coding"] = row.get("vocab_version_at_coding") or str(
            self.config.corpus.get("vocab_version", "")
        )

        row["harvest_source"] = source.name
        row["harvest_external_id"] = record.external_id
        row["harvest_run_id"] = self.manifest.run_id
        if record.receipt:
            row["harvest_receipt_id"] = record.receipt.receipt_id
            row["harvest_retrieved_at"] = record.receipt.retrieved_at
            row["harvest_payload_sha256"] = record.receipt.payload_sha256
        row["harvest_unresolved"] = record.unresolved_tokens()

        # `included_date` stays empty. A harvested row is a `candidate`; the
        # transition to `included` happens when a human confirms the §1.1 fields
        # and captures the artefact (coding-workspace-spec §16 steps 2-3).
        return row

    # --- enrichment output --------------------------------------------

    def _write_enrichment(self) -> Path | None:
        if not self.enrichment:
            return None
        target = self.manifest.directory(self.config) / "enrichment.jsonl"
        with target.open("a", encoding="utf-8") as handle:
            for record in self.enrichment:
                handle.write(
                    json.dumps(
                        {
                            "source": record.source,
                            "subject": record.subject,
                            "kind": record.kind,
                            "payload": record.payload,
                            "unresolved": [asdict(item) for item in record.unresolved],
                            "receipt_id": record.receipt.receipt_id if record.receipt else "",
                        },
                        ensure_ascii=False,
                        default=str,
                    )
                    + "\n"
                )
        return target

    # --- capture worklist ---------------------------------------------

    def write_capture_worklist(self) -> Path:
        """
        The manual Save Page Now list (§17).

        Built from the corpus rather than from this run, so it always reflects
        every artefact still lacking an archive, not only the ones just added.
        """
        rows = []
        for row in self.corpus_store.read_corpus():
            if row.get("wayback_url") or row.get("archive_status") == "wayback-archived":
                continue
            if not row.get("url_primary"):
                continue
            rows.append(
                {
                    "artefact_id": row["artefact_id"],
                    "title": row.get("title", ""),
                    "url_primary": row.get("url_primary", ""),
                    "wayback_url": "",
                    "archive_status": row.get("archive_status", "metadata-only"),
                    "action": "run Save Page Now, then paste the snapshot URL into wayback_url",
                }
            )
        return self.corpus_store.write_capture_worklist(rows)
