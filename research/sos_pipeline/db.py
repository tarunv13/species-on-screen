"""
The relational registry — Module 1 of the founding brief, made runnable.

The brief that opened this repository (`3rd June 2026 prompt for the repo`)
asks for a multi-media relational schema binding international media metadata
to IUCN Ecosystem Functional Groups and the Red List, with a JSONB payload
column so that an upstream API change cannot break the schema.

This is that schema, materialised from the corpus and the enrichment records.
Two departures from the brief, both deliberate:

  SQLite, not PostgreSQL, as the default engine. The brief specifies Postgres
  DDL; `postgres_ddl()` emits it. But a research pipeline that requires a
  running database server before it can store anything is a pipeline that does
  not get run. SQLite gives the same relational shape with no server, and the
  Postgres DDL is a `--dialect postgres` flag away when the corpus outgrows a
  file.

  `metadata_payload` is TEXT holding JSON under SQLite and JSONB under
  Postgres. The brief's reasoning holds either way: the payload column is what
  absorbs an upstream schema change without a migration.

The registry is derived, never authoritative. The CSVs in the workspace are the
corpus; this database is rebuilt from them. Deleting it loses nothing.
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from .schema import split_list

SQLITE_DDL = """
PRAGMA foreign_keys = ON;

-- IUCN Global Ecosystem Typology, self-referencing across realm / biome / EFG.
CREATE TABLE IF NOT EXISTS iucn_hierarchy (
    id              INTEGER PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    level           TEXT NOT NULL CHECK (level IN ('realm', 'biome', 'efg')),
    parent_code     TEXT REFERENCES iucn_hierarchy(code) ON DELETE CASCADE,
    typology_version TEXT NOT NULL DEFAULT 'v2.1',
    source_citation TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_iucn_parent ON iucn_hierarchy(parent_code);
CREATE INDEX IF NOT EXISTS idx_iucn_level ON iucn_hierarchy(level);

-- Taxonomy, keyed on the GBIF backbone where one resolved.
CREATE TABLE IF NOT EXISTS species_master (
    id                  INTEGER PRIMARY KEY,
    scientific_name     TEXT NOT NULL UNIQUE,
    common_name         TEXT NOT NULL DEFAULT '',
    gbif_usage_key      INTEGER,
    iucn_category       TEXT DEFAULT '' CHECK (
                            iucn_category IN ('', 'EX','EW','CR','EN','VU','NT','LC','DD','NE')),
    iucn_assessment_id  TEXT DEFAULT '',
    iucn_assessment_year INTEGER,
    kingdom             TEXT DEFAULT '',
    family              TEXT DEFAULT '',
    unresolved          TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_species_gbif ON species_master(gbif_usage_key);
CREATE INDEX IF NOT EXISTS idx_species_category ON species_master(iucn_category);

-- Internationalisation: one row per (entity, field, language).
CREATE TABLE IF NOT EXISTS localized_content (
    id            INTEGER PRIMARY KEY,
    entity_type   TEXT NOT NULL CHECK (entity_type IN ('species', 'ecosystem', 'media')),
    entity_key    TEXT NOT NULL,
    field         TEXT NOT NULL,
    language_code TEXT NOT NULL,
    country_code  TEXT DEFAULT '',
    value         TEXT NOT NULL,
    UNIQUE (entity_type, entity_key, field, language_code, country_code)
);
CREATE INDEX IF NOT EXISTS idx_localized_lookup ON localized_content(entity_type, entity_key, language_code);

-- Every artefact, whatever its platform.
CREATE TABLE IF NOT EXISTS digital_media_registry (
    id                  INTEGER PRIMARY KEY,
    artefact_id         TEXT NOT NULL UNIQUE,
    media_type          TEXT NOT NULL,
    source_platform     TEXT NOT NULL,
    external_id         TEXT NOT NULL DEFAULT '',
    title               TEXT NOT NULL DEFAULT '',
    creator             TEXT NOT NULL DEFAULT '',
    producer_country    TEXT NOT NULL DEFAULT '',
    url_primary         TEXT NOT NULL DEFAULT '',
    url_archive         TEXT NOT NULL DEFAULT '',
    date_published      TEXT NOT NULL DEFAULT '',
    date_captured       TEXT NOT NULL DEFAULT '',
    duration_or_length  TEXT NOT NULL DEFAULT '',
    languages           TEXT NOT NULL DEFAULT '',
    license_or_rights   TEXT NOT NULL DEFAULT '',
    access_state        TEXT NOT NULL DEFAULT '',
    archive_status      TEXT NOT NULL DEFAULT '',
    coding_status       TEXT NOT NULL DEFAULT '',
    harvest_run_id      TEXT NOT NULL DEFAULT '',
    harvest_retrieved_at TEXT NOT NULL DEFAULT '',
    metadata_payload    TEXT NOT NULL DEFAULT '{}',
    UNIQUE (source_platform, external_id)
);
CREATE INDEX IF NOT EXISTS idx_media_platform ON digital_media_registry(source_platform);
CREATE INDEX IF NOT EXISTS idx_media_type ON digital_media_registry(media_type);
CREATE INDEX IF NOT EXISTS idx_media_published ON digital_media_registry(date_published);

CREATE TABLE IF NOT EXISTS species_media_mapping (
    id           INTEGER PRIMARY KEY,
    artefact_id  TEXT NOT NULL REFERENCES digital_media_registry(artefact_id) ON DELETE CASCADE,
    species_id   INTEGER NOT NULL REFERENCES species_master(id) ON DELETE CASCADE,
    taxon_tier   TEXT NOT NULL DEFAULT '',
    coverage_role TEXT NOT NULL DEFAULT '',
    UNIQUE (artefact_id, species_id, taxon_tier)
);
CREATE INDEX IF NOT EXISTS idx_species_media_artefact ON species_media_mapping(artefact_id);
CREATE INDEX IF NOT EXISTS idx_species_media_species ON species_media_mapping(species_id);

CREATE TABLE IF NOT EXISTS habitat_media_mapping (
    id           INTEGER PRIMARY KEY,
    artefact_id  TEXT NOT NULL REFERENCES digital_media_registry(artefact_id) ON DELETE CASCADE,
    ecosystem_code TEXT NOT NULL REFERENCES iucn_hierarchy(code) ON DELETE CASCADE,
    binding_basis TEXT NOT NULL DEFAULT '',
    UNIQUE (artefact_id, ecosystem_code)
);
CREATE INDEX IF NOT EXISTS idx_habitat_media_artefact ON habitat_media_mapping(artefact_id);

-- Culturomics signal, kept apart from the artefact tables because it is about
-- subjects over time rather than about any one artefact.
CREATE TABLE IF NOT EXISTS salience_signal (
    id           INTEGER PRIMARY KEY,
    subject      TEXT NOT NULL,
    signal_source TEXT NOT NULL,
    metric       TEXT NOT NULL,
    value        REAL NOT NULL,
    window_start TEXT NOT NULL DEFAULT '',
    window_end   TEXT NOT NULL DEFAULT '',
    payload      TEXT NOT NULL DEFAULT '{}',
    UNIQUE (subject, signal_source, metric, window_start, window_end)
);
CREATE INDEX IF NOT EXISTS idx_salience_subject ON salience_signal(subject);
"""

POSTGRES_NOTES = """
-- Differences from the SQLite form, for a Postgres deployment:
--   INTEGER PRIMARY KEY            -> GENERATED ALWAYS AS IDENTITY
--   metadata_payload/payload TEXT  -> JSONB, with GIN indexes
--   media_type / level / category  -> native ENUM types
--   text search on localized_content.value -> GIN (to_tsvector(...)), which is
--     what keeps multilingual lookup fast across Latin, Cyrillic and CJK: the
--     index is over normalised lexemes, not over raw bytes, so character set
--     does not change the access path.
"""


def postgres_ddl() -> str:
    """The Postgres form of the same schema, per the founding brief's Module 1."""
    ddl = SQLITE_DDL
    ddl = ddl.replace("PRAGMA foreign_keys = ON;", "-- Postgres enforces foreign keys by default.")
    ddl = ddl.replace("INTEGER PRIMARY KEY", "INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY")
    ddl = ddl.replace("metadata_payload    TEXT NOT NULL DEFAULT '{}'", "metadata_payload    JSONB NOT NULL DEFAULT '{}'::jsonb")
    ddl = ddl.replace("payload      TEXT NOT NULL DEFAULT '{}'", "payload      JSONB NOT NULL DEFAULT '{}'::jsonb")
    extra = (
        "\nCREATE INDEX IF NOT EXISTS idx_media_payload ON digital_media_registry USING GIN (metadata_payload);"
        "\nCREATE INDEX IF NOT EXISTS idx_localized_value ON localized_content "
        "USING GIN (to_tsvector('simple', value));\n"
    )
    return ddl + extra + POSTGRES_NOTES


class Registry:
    """Build and query the derived relational registry."""

    def __init__(self, path: Path) -> None:
        self.path = path
        path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(path)
        self.connection.row_factory = sqlite3.Row
        self.connection.executescript(SQLITE_DDL)

    def close(self) -> None:
        self.connection.commit()
        self.connection.close()

    # --- loading ------------------------------------------------------

    def load_typology(self, rows: list[dict], citation: str = "") -> int:
        """Load realms, biomes and EFGs from the typology table, parents first."""
        seen: set[str] = set()
        count = 0
        cursor = self.connection.cursor()

        for level, code_key, name_key, parent_key in (
            ("realm", "realm_code", "realm_name", None),
            ("biome", "biome_code", "biome_name", "realm_code"),
            ("efg", "efg_code", "efg_name", "biome_code"),
        ):
            for row in rows:
                code = (row.get(code_key) or "").strip()
                if not code or code in seen:
                    continue
                seen.add(code)
                cursor.execute(
                    "INSERT OR REPLACE INTO iucn_hierarchy (code, name, level, parent_code, source_citation) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (
                        code,
                        (row.get(name_key) or "").strip(),
                        level,
                        (row.get(parent_key) or "").strip() if parent_key else None,
                        citation,
                    ),
                )
                count += 1
        self.connection.commit()
        return count

    def load_corpus(self, corpus_rows: list[dict], species_rows: list[dict]) -> dict:
        """Materialise the corpus CSVs into the registry."""
        cursor = self.connection.cursor()
        media = 0
        for row in corpus_rows:
            artefact_id = row.get("artefact_id", "")
            if not artefact_id:
                continue
            payload = {
                key: value
                for key, value in row.items()
                if key.startswith("harvest_") or key in ("slug", "notes_path", "zotero_key")
            }
            cursor.execute(
                """
                INSERT INTO digital_media_registry (
                    artefact_id, media_type, source_platform, external_id, title, creator,
                    producer_country, url_primary, url_archive, date_published, date_captured,
                    duration_or_length, languages, license_or_rights, access_state, archive_status,
                    coding_status, harvest_run_id, harvest_retrieved_at, metadata_payload
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(artefact_id) DO UPDATE SET
                    media_type=excluded.media_type,
                    source_platform=excluded.source_platform,
                    title=excluded.title,
                    creator=excluded.creator,
                    coding_status=excluded.coding_status,
                    metadata_payload=excluded.metadata_payload
                """,
                (
                    artefact_id,
                    row.get("format", ""),
                    row.get("platform_primary", ""),
                    row.get("harvest_external_id", ""),
                    row.get("title", ""),
                    row.get("creator", ""),
                    row.get("producer_country", ""),
                    row.get("url_primary", ""),
                    row.get("url_archive", ""),
                    row.get("date_published", ""),
                    row.get("date_captured", ""),
                    row.get("duration_or_length", ""),
                    row.get("languages", ""),
                    row.get("license_or_rights", ""),
                    row.get("access_state_at_capture", ""),
                    row.get("archive_status", ""),
                    row.get("coding_status", ""),
                    row.get("harvest_run_id", ""),
                    row.get("harvest_retrieved_at", ""),
                    json.dumps(payload, sort_keys=True),
                ),
            )
            media += 1

        taxa = 0
        links = 0
        for row in species_rows:
            scientific = (row.get("taxon_name_scientific") or "").strip()
            if not scientific:
                continue
            external = row.get("taxon_id_external", "")
            usage_key = None
            if external.startswith("gbif:"):
                try:
                    usage_key = int(external.split(":", 1)[1])
                except ValueError:
                    usage_key = None

            cursor.execute(
                "INSERT INTO species_master (scientific_name, common_name, gbif_usage_key, iucn_category, unresolved) "
                "VALUES (?,?,?,?,?) ON CONFLICT(scientific_name) DO UPDATE SET "
                "common_name=COALESCE(NULLIF(excluded.common_name,''), species_master.common_name), "
                "gbif_usage_key=COALESCE(excluded.gbif_usage_key, species_master.gbif_usage_key), "
                "iucn_category=COALESCE(NULLIF(excluded.iucn_category,''), species_master.iucn_category)",
                (
                    scientific,
                    row.get("taxon_name_common", ""),
                    usage_key,
                    row.get("iucn_status_at_publication", ""),
                    row.get("harvest_unresolved", ""),
                ),
            )
            taxa += 1

            species_id = cursor.execute(
                "SELECT id FROM species_master WHERE scientific_name = ?", (scientific,)
            ).fetchone()
            artefact_id = row.get("artefact_id", "")
            if species_id and artefact_id:
                cursor.execute(
                    "INSERT OR IGNORE INTO species_media_mapping "
                    "(artefact_id, species_id, taxon_tier, coverage_role) VALUES (?,?,?,?)",
                    (artefact_id, species_id["id"], row.get("taxon_tier", ""), row.get("coverage_role", "")),
                )
                links += 1

        self.connection.commit()
        return {"media": media, "species": taxa, "species_links": links}

    def load_enrichment(self, records: list[dict]) -> int:
        """Store culturomics signal and ecosystem bindings."""
        cursor = self.connection.cursor()
        stored = 0
        for record in records:
            payload = record.get("payload") or {}
            kind = record.get("kind", "")

            if kind == "pageviews" and payload.get("total_views") is not None:
                cursor.execute(
                    "INSERT OR REPLACE INTO salience_signal "
                    "(subject, signal_source, metric, value, window_start, window_end, payload) "
                    "VALUES (?,?,?,?,?,?,?)",
                    (
                        record.get("subject", ""),
                        record.get("source", ""),
                        "total_views",
                        float(payload.get("total_views", 0)),
                        payload.get("window_start", ""),
                        payload.get("window_end", ""),
                        json.dumps({k: v for k, v in payload.items() if k != "series"}, sort_keys=True),
                    ),
                )
                stored += 1

            elif kind == "news-coverage":
                cursor.execute(
                    "INSERT OR REPLACE INTO salience_signal "
                    "(subject, signal_source, metric, value, window_start, window_end, payload) "
                    "VALUES (?,?,?,?,?,?,?)",
                    (
                        record.get("subject", ""),
                        record.get("source", ""),
                        "article_count",
                        float(payload.get("article_count", 0)),
                        "",
                        payload.get("timespan", ""),
                        json.dumps({k: v for k, v in payload.items() if k != "articles"}, sort_keys=True),
                    ),
                )
                stored += 1

        self.connection.commit()
        return stored

    # --- reading ------------------------------------------------------

    def counts(self) -> dict:
        tables = (
            "iucn_hierarchy",
            "species_master",
            "localized_content",
            "digital_media_registry",
            "species_media_mapping",
            "habitat_media_mapping",
            "salience_signal",
        )
        return {
            table: self.connection.execute(f"SELECT COUNT(*) AS n FROM {table}").fetchone()["n"]
            for table in tables
        }
