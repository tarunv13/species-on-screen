"""
Artefact identifier allocation.

Authority: `.agents/tasks/task-pilot-execution/coding-workspace-spec.md` §14.

  Format      `pilot-NNN`, three-digit zero-padded, sequential.
  Allocation  First-come-first-served at candidate -> included.
  Never       reassigned. A retired artefact keeps its id and the gap stays
              visible.

Two properties matter for a machine allocator that a human allocator gets for
free:

  Idempotence   Re-running a harvest must not mint a second id for a video it
                has already seen. A ledger maps (source, external_id) to the id
                that was issued, so the second run recognises the artefact.

  Monotonicity  The next id is one past the highest ever issued, not one past
                the highest currently present. Reading only the live corpus
                would recycle the id of a retired row, which §14 forbids.
"""

from __future__ import annotations

import json
import re
import threading
from dataclasses import dataclass
from pathlib import Path

ID_PATTERN = re.compile(r"^(?P<prefix>[a-z0-9][a-z0-9-]*)-(?P<number>\d{3,})$")


class IdError(RuntimeError):
    """The allocator cannot issue an identifier safely."""


def parse_id(value: str) -> tuple[str, int] | None:
    match = ID_PATTERN.match((value or "").strip())
    if not match:
        return None
    return match.group("prefix"), int(match.group("number"))


def slugify(text: str, limit: int = 40) -> str:
    """
    Human-readable handle for filenames, per §14.

    Lowercase, hyphenated, at most `limit` characters. The slug is not the
    identifier and nothing joins on it.
    """
    lowered = (text or "").lower()
    cleaned = re.sub(r"[^a-z0-9]+", "-", lowered).strip("-")
    if len(cleaned) <= limit:
        return cleaned
    trimmed = cleaned[:limit]
    # Do not end on a half word if a hyphen is close to the cut.
    if "-" in trimmed[-12:]:
        trimmed = trimmed[: trimmed.rfind("-")]
    return trimmed.strip("-")


@dataclass
class Allocation:
    artefact_id: str
    minted: bool  # False when the ledger already knew this artefact


class ArtefactIdAllocator:
    """
    Persistent, monotonic, idempotent allocator.

    The ledger is the source of truth for the high-water mark; the existing
    corpus CSV is read once at construction to absorb ids allocated by hand
    before the pipeline existed.
    """

    def __init__(self, ledger_path: Path, prefix: str = "pilot") -> None:
        self.path = ledger_path
        self.prefix = prefix
        self._lock = threading.Lock()
        self._issued: dict[str, str] = {}
        self._high_water = 0
        self._load()

    # --- persistence --------------------------------------------------

    def _load(self) -> None:
        if not self.path.exists():
            return
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            raise IdError(f"artefact id ledger at {self.path} is unreadable: {exc}") from exc
        if data.get("prefix", self.prefix) != self.prefix:
            raise IdError(
                f"ledger at {self.path} was written for corpus version "
                f"'{data.get('prefix')}', not '{self.prefix}'. A new corpus version starts a new sequence (§14)."
            )
        self._issued = dict(data.get("issued", {}))
        self._high_water = int(data.get("high_water", 0))

    def _flush(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "prefix": self.prefix,
            "high_water": self._high_water,
            "issued": self._issued,
            "_note": (
                "Maps source:external_id to the artefact_id issued for it. Append-only. "
                "Deleting an entry re-mints an id for content that already has one, which "
                "coding-workspace-spec.md §14 forbids."
            ),
        }
        self.path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")

    # --- seeding ------------------------------------------------------

    def absorb_existing(self, artefact_ids) -> int:
        """
        Raise the high-water mark to cover ids already in the corpus.

        Called with every id on the corpus tab, including retired rows, so the
        allocator never reissues one.
        """
        raised = 0
        with self._lock:
            for value in artefact_ids:
                parsed = parse_id(str(value))
                if not parsed:
                    continue
                prefix, number = parsed
                if prefix != self.prefix:
                    continue
                if number > self._high_water:
                    self._high_water = number
                    raised += 1
            if raised:
                self._flush()
        return raised

    # --- allocation ---------------------------------------------------

    def key(self, source: str, external_id: str) -> str:
        return f"{source}:{external_id}"

    def known(self, source: str, external_id: str) -> str | None:
        return self._issued.get(self.key(source, external_id))

    def allocate(self, source: str, external_id: str) -> Allocation:
        """Return the id for this artefact, minting one only if it has none."""
        if not external_id:
            raise IdError(f"source '{source}' supplied an empty external_id; cannot allocate an artefact id")
        ledger_key = self.key(source, external_id)
        with self._lock:
            existing = self._issued.get(ledger_key)
            if existing:
                return Allocation(existing, minted=False)
            self._high_water += 1
            artefact_id = f"{self.prefix}-{self._high_water:03d}"
            self._issued[ledger_key] = artefact_id
            self._flush()
            return Allocation(artefact_id, minted=True)

    @property
    def high_water(self) -> int:
        return self._high_water

    def summary(self) -> dict:
        return {"prefix": self.prefix, "high_water": self._high_water, "issued": len(self._issued)}
