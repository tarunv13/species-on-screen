"""
Provenance: what was asked, what came back, and when.

The Observatory's evidential surface reports how far a warrant *reaches*, never
whether it is true (`PRODUCT.md`, "Evidence posture"). This module gives the
research pipeline the same posture. Every HTTP call leaves a receipt; every
record carries the receipt id; every run leaves a manifest that names its
configuration by hash and its inputs by query string.

Unresolved identifiers stay unresolved. `Unresolved` is a first-class value
here for the same reason Bates et al. 2005 was left unresolved in the archive:
a guessed identifier is worse than a missing one.
"""

from __future__ import annotations

import hashlib
import json
import os
import platform
import subprocess
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

SECRET_HINTS = ("key", "token", "secret", "password", "access", "auth", "bearer", "client_secret")


def utc_now() -> str:
    """ISO 8601, UTC, second precision. One timestamp format for the whole pipeline."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def today_iso() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_json(obj: Any) -> str:
    encoded = json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str).encode("utf-8")
    return sha256_bytes(encoded)


JSON_SAFE = (str, int, float, bool, type(None))


def redact(params: dict | None) -> dict:
    """
    Strip credential-shaped values from anything that will be written down, and
    coerce whatever is left to something JSON can hold.

    The coercion is not cosmetic. Command arguments arrive carrying the argparse
    callback, and a manifest that raises while being written loses the record of
    the run that produced it — the one file whose whole job is to survive.
    """
    if not params:
        return {}
    out: dict[str, Any] = {}
    for key, value in params.items():
        lowered = str(key).lower()
        if any(hint in lowered for hint in SECRET_HINTS):
            out[key] = "<redacted>"
        elif isinstance(value, JSON_SAFE):
            out[key] = value
        elif isinstance(value, (list, tuple)):
            out[key] = [item if isinstance(item, JSON_SAFE) else repr(item) for item in value]
        elif isinstance(value, dict):
            out[key] = redact(value)
        elif callable(value):
            out[key] = getattr(value, "__name__", repr(value))
        else:
            out[key] = repr(value)
    return out


def git_commit(repo_root: Path) -> str:
    """Best-effort commit id for the manifest. Absence is recorded, not faked."""
    try:
        result = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except (OSError, subprocess.SubprocessError):
        pass
    return "unavailable"


@dataclass
class Unresolved:
    """A value the pipeline could not attest. Written as empty, reported as unresolved."""

    field: str
    reason: str
    attempted: str = ""

    def as_token(self) -> str:
        return f"{self.field}:{self.reason}"


@dataclass
class Receipt:
    """One HTTP exchange, recorded whether it succeeded or not."""

    receipt_id: str
    source: str
    endpoint: str
    method: str
    params: dict
    status: int | None
    retrieved_at: str
    payload_sha256: str
    api_version: str = ""
    quota_units: int = 0
    quota_bucket: str = ""
    error: str = ""

    @classmethod
    def make(
        cls,
        source: str,
        endpoint: str,
        params: dict | None,
        status: int | None,
        payload: Any,
        method: str = "GET",
        api_version: str = "",
        quota_units: int = 0,
        quota_bucket: str = "",
        error: str = "",
    ) -> "Receipt":
        return cls(
            receipt_id=uuid.uuid4().hex[:16],
            source=source,
            endpoint=endpoint,
            method=method,
            params=redact(params),
            status=status,
            retrieved_at=utc_now(),
            payload_sha256=sha256_json(payload) if payload is not None else "",
            api_version=api_version,
            quota_units=quota_units,
            quota_bucket=quota_bucket,
            error=error,
        )


@dataclass
class RunManifest:
    """
    The reproducibility record for one invocation.

    Operating principle 1 of the corpus framework is reproducibility over
    exhaustiveness: a small corpus another researcher could rebuild beats a
    large one they could not. The manifest is what makes the rebuild possible.
    """

    run_id: str
    started_at: str
    command: str
    config_path: str
    config_sha256: str
    git_commit: str
    python_version: str
    platform: str
    args: dict = field(default_factory=dict)
    sources: dict = field(default_factory=dict)
    queries: list = field(default_factory=list)
    quota_spent: dict = field(default_factory=dict)
    counts: dict = field(default_factory=dict)
    unresolved: list = field(default_factory=list)
    exclusions: dict = field(default_factory=dict)
    warnings: list = field(default_factory=list)
    finished_at: str = ""

    @classmethod
    def start(cls, command: str, config, args: dict | None = None) -> "RunManifest":
        return cls(
            run_id=f"{today_iso()}-{uuid.uuid4().hex[:8]}",
            started_at=utc_now(),
            command=command,
            config_path=str(config.path),
            config_sha256=config.sha256,
            git_commit=git_commit(config.root.parent),
            python_version=platform.python_version(),
            platform=f"{platform.system()} {platform.release()}",
            args=redact(args or {}),
        )

    # --- accumulation -------------------------------------------------

    def note_query(self, source: str, endpoint: str, params: dict) -> None:
        self.queries.append({"source": source, "endpoint": endpoint, "params": redact(params)})

    def count(self, key: str, delta: int = 1) -> None:
        self.counts[key] = self.counts.get(key, 0) + delta

    def exclude(self, reason: str, delta: int = 1) -> None:
        self.exclusions[reason] = self.exclusions.get(reason, 0) + delta

    def note_unresolved(self, items: Iterable[Unresolved]) -> None:
        for item in items:
            self.unresolved.append(asdict(item))

    def warn(self, message: str) -> None:
        if message not in self.warnings:
            self.warnings.append(message)

    # --- persistence --------------------------------------------------

    def directory(self, config) -> Path:
        path = config.runs_dir / self.run_id
        path.mkdir(parents=True, exist_ok=True)
        return path

    def write(self, config) -> Path:
        self.finished_at = utc_now()
        target = self.directory(config) / "run-manifest.json"
        target.write_text(json.dumps(asdict(self), indent=2, sort_keys=False), encoding="utf-8")
        return target


class ReceiptLog:
    """Append-only JSONL of every exchange in a run."""

    def __init__(self, config, manifest: RunManifest) -> None:
        self.path = manifest.directory(config) / "receipts.jsonl"
        self._handle = None

    def __enter__(self) -> "ReceiptLog":
        self._handle = self.path.open("a", encoding="utf-8")
        return self

    def __exit__(self, *exc_info) -> None:
        if self._handle:
            self._handle.close()
            self._handle = None

    def record(self, receipt: Receipt) -> Receipt:
        line = json.dumps(asdict(receipt), sort_keys=True, default=str)
        if self._handle:
            self._handle.write(line + "\n")
            self._handle.flush()
        else:
            with self.path.open("a", encoding="utf-8") as handle:
                handle.write(line + "\n")
        return receipt


def environment_report() -> dict:
    """What the run could see. Credentials are reported as present/absent only."""
    names = [
        "YOUTUBE_API_KEY",
        "TMDB_API_KEY",
        "OMDB_API_KEY",
        "IGDB_CLIENT_ID",
        "IGDB_CLIENT_SECRET",
        "IUCN_REDLIST_TOKEN",
    ]
    return {name: ("set" if os.environ.get(name) else "unset") for name in names}
