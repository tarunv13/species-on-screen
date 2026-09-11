"""
Storage: the raw plane, the corpus plane, and the weekly snapshot.

The single most destructive thing this pipeline could do is overwrite a cell a
human coded. `CorpusStore.merge` therefore has one unbreakable rule:

    A harvest may write a harvest-owned column. It may never write, blank, or
    reorder a coder-owned column on a row that already exists.

Re-running a harvest is consequently safe at any time: known artefacts are
refreshed in their metadata columns only, and rows in `in-progress` or `coded`
state keep every judgement the coder made. Rows are never deleted; a retired
artefact keeps its row and its id (coding-workspace-spec §14).

Layout follows coding-workspace-spec §13. Two roots:

  workspace/data/   corpus-latest.csv, species-latest.csv, snapshots/  (committed)
  research/var/     raw payloads, receipts, manifests, ledgers         (git-ignored)
"""

from __future__ import annotations

import csv
import json
from dataclasses import asdict
from datetime import date
from pathlib import Path
from typing import Iterable

from .provenance import today_iso, utc_now
from .schema import (
    CODER_OWNED,
    CORPUS_COLUMNS,
    HARVEST_OWNED,
    HARVEST_OWNED_SPECIES,
    SPECIES_COLUMNS,
    VOCABULARIES,
    VOCABULARY_COLUMNS,
    WRITE_ONCE,
    blank_corpus_row,
    blank_species_row,
)


class StoreError(RuntimeError):
    """Storage refused an operation that would lose data."""


# --- raw plane ----------------------------------------------------------


class RawStore:
    """
    Append-only JSONL, one file per source per day.

    The raw store exists so that a coding decision made six months from now can
    be checked against exactly what the API returned, without re-querying an API
    whose results will have drifted. §6.5 of the framework calls preservation
    gaps a standing methodological hazard; this is the cheap part of the answer.
    """

    def __init__(self, root: Path) -> None:
        self.root = root

    def path_for(self, source: str, run_id: str) -> Path:
        folder = self.root / source / today_iso()
        folder.mkdir(parents=True, exist_ok=True)
        return folder / f"{source}-{run_id}.jsonl"

    def append(self, source: str, run_id: str, records: Iterable[dict]) -> tuple[Path, int]:
        target = self.path_for(source, run_id)
        written = 0
        with target.open("a", encoding="utf-8") as handle:
            for record in records:
                handle.write(json.dumps(record, ensure_ascii=False, sort_keys=True, default=str) + "\n")
                written += 1
        return target, written

    def append_record(self, record, run_id: str) -> dict:
        """Wrap one HarvestRecord with its provenance and persist it."""
        envelope = {
            "source": record.source,
            "external_id": record.external_id,
            "artefact_id": record.corpus_row.get("artefact_id", ""),
            "harvested_at": utc_now(),
            "run_id": run_id,
            "receipt_id": record.receipt.receipt_id if record.receipt else "",
            "payload_sha256": record.receipt.payload_sha256 if record.receipt else "",
            "unresolved": [asdict(item) for item in record.unresolved],
            "payload": record.payload,
        }
        self.append(record.source, run_id, [envelope])
        return envelope


# --- corpus plane -------------------------------------------------------


class CorpusStore:
    """Reads, merges and writes the corpus and species tables."""

    def __init__(self, data_dir: Path) -> None:
        self.data_dir = data_dir
        self.corpus_path = data_dir / "corpus-latest.csv"
        self.species_path = data_dir / "species-latest.csv"
        self.vocabularies_path = data_dir / "vocabularies-latest.csv"
        self.capture_worklist_path = data_dir / "capture-worklist.csv"

    # --- reading ------------------------------------------------------

    @staticmethod
    def _read(path: Path, columns: list[str]) -> list[dict]:
        if not path.exists():
            return []
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        normalised = []
        for row in rows:
            record = {column: (row.get(column) or "") for column in columns}
            extras = {k: v for k, v in row.items() if k and k not in columns}
            if extras:
                raise StoreError(
                    f"{path.name} carries columns this schema version does not know: "
                    f"{', '.join(sorted(extras))}. Reconcile the schema before harvesting "
                    "(coding-workspace-spec §12)."
                )
            normalised.append(record)
        return normalised

    def read_corpus(self) -> list[dict]:
        return self._read(self.corpus_path, CORPUS_COLUMNS)

    def read_species(self) -> list[dict]:
        return self._read(self.species_path, SPECIES_COLUMNS)

    def existing_ids(self) -> list[str]:
        return [row["artefact_id"] for row in self.read_corpus() if row.get("artefact_id")]

    # --- merging ------------------------------------------------------

    def merge(self, new_rows: list[dict], *, refresh_harvest_fields: bool = False) -> dict:
        """
        Merge harvested rows into the corpus.

        New artefacts are appended. Known artefacts are updated only in
        harvest-owned columns, and only where the existing cell is empty unless
        `refresh_harvest_fields` is set. Coder-owned columns are never touched
        under any flag.
        """
        existing = self.read_corpus()
        by_id = {row["artefact_id"]: row for row in existing}
        order = [row["artefact_id"] for row in existing]

        stats = {"appended": 0, "updated": 0, "unchanged": 0, "protected_cells": 0}

        for incoming in new_rows:
            artefact_id = incoming.get("artefact_id", "")
            if not artefact_id:
                raise StoreError("a harvested row arrived without an artefact_id")

            if artefact_id not in by_id:
                row = blank_corpus_row()
                row.update({k: v for k, v in incoming.items() if k in CORPUS_COLUMNS})
                by_id[artefact_id] = row
                order.append(artefact_id)
                stats["appended"] += 1
                continue

            current = by_id[artefact_id]
            changed = False
            for column, value in incoming.items():
                if column not in CORPUS_COLUMNS or not str(value).strip():
                    continue
                if column in CODER_OWNED:
                    if str(current.get(column, "")).strip() != str(value).strip():
                        stats["protected_cells"] += 1
                    continue
                if column not in HARVEST_OWNED:
                    continue
                held = str(current.get(column, "")).strip()
                if column in WRITE_ONCE and held:
                    # Set at creation, owned by the workflow thereafter. `--refresh`
                    # does not reach these; rewriting coding_status here would undo
                    # a finished coding session and report it as a refresh.
                    if held != str(value).strip():
                        stats["protected_cells"] += 1
                    continue
                if held and not refresh_harvest_fields:
                    continue
                if held != str(value).strip():
                    current[column] = value
                    changed = True
            stats["updated" if changed else "unchanged"] += 1

        self._write(self.corpus_path, CORPUS_COLUMNS, [by_id[i] for i in order])
        return stats

    def merge_species(self, new_rows: list[dict], *, refresh_harvest_fields: bool = False) -> dict:
        """Same discipline for the species tab, keyed by (artefact_id, scientific name, tier)."""
        existing = self.read_species()

        def key_of(row: dict) -> tuple:
            return (
                row.get("artefact_id", ""),
                row.get("taxon_name_scientific", "").strip().lower(),
                row.get("taxon_tier", ""),
            )

        by_key = {key_of(row): row for row in existing}
        order = [key_of(row) for row in existing]
        stats = {"appended": 0, "updated": 0, "unchanged": 0, "protected_cells": 0}

        for incoming in new_rows:
            key = key_of(incoming)
            if not key[0]:
                raise StoreError("a harvested species row arrived without an artefact_id")
            if key not in by_key:
                row = blank_species_row()
                row.update({k: v for k, v in incoming.items() if k in SPECIES_COLUMNS})
                by_key[key] = row
                order.append(key)
                stats["appended"] += 1
                continue

            current = by_key[key]
            changed = False
            for column, value in incoming.items():
                if column not in SPECIES_COLUMNS or not str(value).strip():
                    continue
                if column not in HARVEST_OWNED_SPECIES:
                    if str(current.get(column, "")).strip() != str(value).strip():
                        stats["protected_cells"] += 1
                    continue
                held = str(current.get(column, "")).strip()
                if held and not refresh_harvest_fields:
                    continue
                if held != str(value).strip():
                    current[column] = value
                    changed = True
            stats["updated" if changed else "unchanged"] += 1

        self._write(self.species_path, SPECIES_COLUMNS, [by_key[k] for k in order])
        return stats

    # --- writing ------------------------------------------------------

    @staticmethod
    def _write(path: Path, columns: list[str], rows: list[dict]) -> Path:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(path.suffix + ".tmp")
        with temporary.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
            writer.writeheader()
            for row in rows:
                writer.writerow({column: row.get(column, "") for column in columns})
        temporary.replace(path)
        return path

    def write_vocabularies(self, vocab_version: str) -> Path:
        rows = [
            {"vocabulary": name, "term": term, "definition": "", "vocab_version": vocab_version}
            for name, terms in VOCABULARIES.items()
            for term in terms
        ]
        return self._write(self.vocabularies_path, VOCABULARY_COLUMNS, rows)

    def write_capture_worklist(self, rows: list[dict]) -> Path:
        """
        The Save Page Now worklist.

        coding-workspace-spec §17 keeps Wayback captures manual. The pipeline
        therefore produces the list of URLs to click, and clicks nothing.
        """
        columns = ["artefact_id", "title", "url_primary", "wayback_url", "archive_status", "action"]
        return self._write(self.capture_worklist_path, columns, rows)

    # --- snapshots ----------------------------------------------------

    def snapshot(self, snapshots_dir: Path, when: str | None = None) -> Path:
        """
        Weekly CSV snapshot, per coding-workspace-spec §12.

        The git history is the revision log; this just puts a dated copy beside
        it. Existing snapshot folders are never overwritten silently.
        """
        stamp = when or date.today().isoformat()
        folder = snapshots_dir / stamp
        folder.mkdir(parents=True, exist_ok=True)
        for source_path in (self.corpus_path, self.species_path, self.vocabularies_path):
            if not source_path.exists():
                continue
            target = folder / source_path.name.replace("-latest", "")
            target.write_text(source_path.read_text(encoding="utf-8"), encoding="utf-8")
        return folder


def notes_path_for(artefact_id: str) -> str:
    """
    The conventional per-artefact notes path (§3.2 `notes_path`).

    The path is recorded; the file is not created. Notes-file front-matter
    authoring is on the manual list in §17, and a machine-stubbed notes file
    would be a coding surface nobody chose to open.
    """
    return f"notes/{artefact_id}.md"
