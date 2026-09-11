"""
Configuration loading and credential resolution.

Secrets are never read from the config file and never written to any output.
They live in the environment; the config names the variable, nothing more.
The one hard-coded API key already in this repository
(`scripts/fetch-tmdb-data.js`) is a mistake this module does not repeat.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "pipeline.config.json"
REPO_ROOT = Path(__file__).resolve().parents[2]


class ConfigError(RuntimeError):
    """The configuration is unusable and the run must not start."""


def load_dotenv(paths: list[Path] | None = None) -> list[Path]:
    """
    Read `.env` into the environment without a dependency.

    A real shell variable always wins: an operator who exported a key for one
    command should not have it silently replaced by a stale file. Returns the
    files that were read, for the record.

    Values may be quoted; `export` prefixes are tolerated; comments and blank
    lines are skipped. Nothing read here is ever echoed.
    """
    candidates = paths or [REPO_ROOT / ".env", DEFAULT_CONFIG_PATH.parent.parent / ".env"]
    seen: list[Path] = []
    for path in candidates:
        if not path.exists() or path in seen:
            continue
        seen.append(path)
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            if line.startswith("export "):
                line = line[len("export "):]
            name, _, value = line.partition("=")
            name = name.strip()
            value = value.strip().strip('"').strip("'")
            if name and value and name not in os.environ:
                os.environ[name] = value
    return seen


def _strip_comments(node: Any) -> Any:
    """Drop the `_comment` / `_note` keys the repo uses for in-file prose."""
    if isinstance(node, dict):
        return {k: _strip_comments(v) for k, v in node.items() if not k.startswith("_")}
    if isinstance(node, list):
        return [_strip_comments(v) for v in node]
    return node


@dataclass(frozen=True)
class SourceConfig:
    name: str
    raw: dict

    @property
    def enabled(self) -> bool:
        return bool(self.raw.get("enabled", False))

    def get(self, key: str, default: Any = None) -> Any:
        return self.raw.get(key, default)

    def require(self, key: str) -> Any:
        if key not in self.raw:
            raise ConfigError(f"source '{self.name}' is missing required key '{key}'")
        return self.raw[key]

    def credential(self, key: str = "api_key_env") -> str | None:
        """Resolve a credential named by the config. Returns None when unset."""
        env_name = self.raw.get(key)
        if not env_name:
            return None
        value = os.environ.get(env_name)
        return value.strip() if value else None

    def require_credential(self, key: str = "api_key_env") -> str:
        env_name = self.raw.get(key)
        value = self.credential(key)
        if not value:
            raise ConfigError(
                f"source '{self.name}' needs the {env_name} environment variable; "
                f"it is unset or empty. Set it in your shell, not in the config file."
            )
        return value


@dataclass
class Config:
    path: Path
    root: Path
    raw: dict = field(repr=False)
    sha256: str = ""
    amendments: dict = field(default_factory=dict)

    # --- construction -------------------------------------------------

    @classmethod
    def load(cls, path: str | os.PathLike | None = None, *, read_dotenv: bool = True) -> "Config":
        if read_dotenv:
            load_dotenv()
        cfg_path = Path(path) if path else DEFAULT_CONFIG_PATH
        if not cfg_path.exists():
            raise ConfigError(f"configuration not found at {cfg_path}")
        text = cfg_path.read_text(encoding="utf-8")
        try:
            raw = json.loads(text)
        except json.JSONDecodeError as exc:
            raise ConfigError(f"{cfg_path} is not valid JSON: {exc}") from exc

        import hashlib

        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        config = cls(path=cfg_path, root=cfg_path.resolve().parent.parent, raw=_strip_comments(raw), sha256=digest)

        # Vocabulary amendments that a human has accepted come into force here,
        # once, at load. A proposed term stays refused (corpus-seed-framework §12.2).
        from . import schema

        config.amendments = schema.load_amendments(config.root / "config" / "vocabulary-amendments.json")
        return config

    # --- resolved paths -----------------------------------------------

    def _abs(self, value: str) -> Path:
        candidate = Path(value)
        return candidate if candidate.is_absolute() else (self.root / candidate).resolve()

    @property
    def var_root(self) -> Path:
        return self._abs(self.raw["corpus"].get("var_root", "var"))

    @property
    def workspace_root(self) -> Path:
        """
        Where the corpus lives.

        The corpus and the Paper 1 instrument are held in a separate private
        repository; this code repository is public. The path to that checkout is
        machine-specific, so it comes from the environment rather than from a
        committed config file: `SOS_WORKSPACE_ROOT` wins over
        `corpus.workspace_root` whenever it is set.

        A missing workspace is not an error here. `doctor` reports it, and the
        read-only commands still run — a public clone with no corpus access can
        plan a harvest and inspect the schema, which is most of what a reader
        would want from it.
        """
        override = os.environ.get("SOS_WORKSPACE_ROOT")
        if override:
            return Path(override).expanduser().resolve()
        return self._abs(self.raw["corpus"]["workspace_root"])

    @property
    def workspace_available(self) -> bool:
        return self.workspace_root.exists()

    @property
    def data_dir(self) -> Path:
        return self.workspace_root / "data"

    @property
    def snapshots_dir(self) -> Path:
        return self.data_dir / "snapshots"

    @property
    def raw_dir(self) -> Path:
        return self.var_root / "raw"

    @property
    def runs_dir(self) -> Path:
        return self.var_root / "runs"

    @property
    def cache_dir(self) -> Path:
        return self.var_root / "cache"

    @property
    def quota_ledger_path(self) -> Path:
        return self.var_root / "quota-ledger.json"

    @property
    def id_ledger_path(self) -> Path:
        return self.var_root / "artefact-id-ledger.json"

    def seed_path(self, key: str) -> Path:
        return self._abs(self.raw["seed"][key])

    # --- sections -----------------------------------------------------

    @property
    def corpus(self) -> dict:
        return self.raw["corpus"]

    @property
    def seed(self) -> dict:
        return self.raw["seed"]

    @property
    def ethics(self) -> dict:
        return self.raw["ethics"]

    @property
    def http(self) -> dict:
        return self.raw.get("http", {})

    def source(self, name: str) -> SourceConfig:
        sources = self.raw.get("sources", {})
        if name not in sources:
            raise ConfigError(f"unknown source '{name}'; configured sources: {', '.join(sorted(sources))}")
        return SourceConfig(name=name, raw=sources[name])

    def source_names(self, enabled_only: bool = False) -> list[str]:
        names = sorted(self.raw.get("sources", {}))
        if not enabled_only:
            return names
        return [n for n in names if self.source(n).enabled]

    def ensure_dirs(self, *, require_workspace: bool = False) -> None:
        """
        Create the working directories.

        The corpus directories are created only when the workspace root already
        exists. That condition is the whole point: `workspace_root` now points
        into a separate private repository, and creating it on demand would
        mint a plausible empty tree beside the code repo and harvest a corpus
        into somewhere that is not under version control at all. A missing
        checkout must look missing.
        """
        directories = [self.var_root, self.raw_dir, self.runs_dir, self.cache_dir]
        mcl = self.raw.get("sources", {}).get("meta_content_library", {}).get("import_dir")
        if mcl:
            directories.append(self._abs(mcl))

        if self.workspace_available:
            directories.extend([self.data_dir, self.snapshots_dir])
        elif require_workspace:
            raise ConfigError(
                f"the corpus workspace is not at {self.workspace_root}.\n"
                "  The corpus and the Paper 1 instrument live in the private repository\n"
                "  tarunv13/species-on-screen-research; this repository holds only the code.\n"
                "  Clone that repo beside this one, or set SOS_WORKSPACE_ROOT in .env to point\n"
                "  at your checkout. Refusing to create the directory: an invented workspace\n"
                "  would take a harvest and put it outside version control."
            )

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
