"""
Meta Content Library adapter: the extract contract and the enclave boundary.

These tests do no network work and need no enclave. They check the part that
can go wrong on the research machine: an extract arriving without a vetting
record, an unapproved export, user content that should never have left, and
accounts below the widely-known threshold.
"""

from __future__ import annotations

import csv
import json
import tempfile
import unittest
from pathlib import Path

from ..config import Config
from ..ethics import EthicsGate
from ..provenance import RunManifest
from ..ratelimit import QuotaLedger
from ..sources.base import EnclaveOnlyError, HarvestPlan
from ..sources.meta_content_library import (
    ExtractContractError,
    MetaContentLibrarySource,
    SURFACE_EXTRACT_COLUMNS,
)


def _vetting(**overrides) -> dict:
    record = {
        "exported_by": "researcher-001",
        "exported_at": "2026-09-11T10:00:00Z",
        "enclave": "meta-sre",
        "dataset_id": "1119037145491882",
        "api_version": "v6.0",
        "query_id": "q-123",
        "record_count": 1,
        "unit_of_analysis": "surface",
        "contains_user_content": False,
        "export_approved": True,
    }
    record.update(overrides)
    return record


def _surface_row(**overrides) -> dict:
    row = {
        "surface_id": "1234567890",
        "surface_type": "page",
        "surface_name": "Sundarbans Conservation Trust",
        "surface_followers": "48000",
        "surface_verified": "true",
        "surface_country": "BD",
        "surface_url": "https://www.facebook.com/example",
        "post_count": "142",
        "first_post_date": "2020-03-04",
        "last_post_date": "2025-11-20",
        "languages_observed": "bn,en",
        "query_label": "sundarbans",
    }
    row.update(overrides)
    return row


class MclTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.imports = self.root / "var" / "mcl-imports"
        self.imports.mkdir(parents=True)

        config_dir = self.root / "config"
        config_dir.mkdir()
        config_path = config_dir / "pipeline.config.json"
        config_path.write_text(
            json.dumps(
                {
                    "corpus": {
                        "corpus_version": "pilot",
                        "schema_version": "v0.1",
                        "vocab_version": "v0.1",
                        "coder_id": "TV",
                        "workspace_root": "workspace",
                        "var_root": "var",
                    },
                    "seed": {"landscapes_file": "seed.json", "places_file": "places.json"},
                    "ethics": {"min_creator_audience": 10000},
                    "sources": {
                        "meta_content_library": {
                            "enabled": True,
                            "mode": "import",
                            "dataset_id": "1119037145491882",
                            "import_dir": "var/mcl-imports",
                        }
                    },
                    "http": {},
                }
            ),
            encoding="utf-8",
        )
        self.config = Config.load(config_path)
        self.manifest = RunManifest.start("test", self.config)
        self.ledger = QuotaLedger(self.root / "var" / "quota.json")
        self.ethics = EthicsGate.from_config(self.config)

    def tearDown(self):
        self.tmp.cleanup()

    def _source(self) -> MetaContentLibrarySource:
        return MetaContentLibrarySource(
            self.config,
            self.config.source("meta_content_library"),
            http=None,
            ledger=self.ledger,
            manifest=self.manifest,
            ethics=self.ethics,
        )

    def _write_extract(self, rows, vetting, name="extract") -> Path:
        csv_path = self.imports / f"{name}.csv"
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(SURFACE_EXTRACT_COLUMNS))
            writer.writeheader()
            writer.writerows(rows)
        if vetting is not None:
            csv_path.with_suffix(".vetting.json").write_text(json.dumps(vetting), encoding="utf-8")
        return csv_path


class TestEnclaveBoundary(MclTestCase):
    def test_enclave_mode_refuses_to_run_on_this_machine(self):
        self.config.raw["sources"]["meta_content_library"]["mode"] = "enclave"
        source = self._source()
        with self.assertRaises(EnclaveOnlyError) as caught:
            list(source.harvest(HarvestPlan()))
        message = str(caught.exception)
        self.assertIn("Secure Research Environment", message)
        self.assertIn("mcl_enclave_harvest.py", message)

    def test_preflight_explains_the_missing_client_in_enclave_mode(self):
        self.config.raw["sources"]["meta_content_library"]["mode"] = "enclave"
        problems = self._source().preflight()
        self.assertTrue(any("metacontentlibraryapi" in problem for problem in problems))

    def test_import_mode_makes_no_network_calls(self):
        # http is None throughout this test module; a network call would raise.
        self._write_extract([_surface_row()], _vetting())
        records = list(self._source().harvest(HarvestPlan()))
        self.assertEqual(len(records), 1)


class TestExtractContract(MclTestCase):
    def test_an_extract_without_a_vetting_record_is_refused(self):
        self._write_extract([_surface_row()], vetting=None)
        with self.assertRaises(ExtractContractError) as caught:
            list(self._source().harvest(HarvestPlan()))
        self.assertIn("vetting", str(caught.exception))

    def test_an_unapproved_export_is_refused(self):
        self._write_extract([_surface_row()], _vetting(export_approved=False))
        with self.assertRaises(ExtractContractError) as caught:
            list(self._source().harvest(HarvestPlan()))
        self.assertIn("export_approved", str(caught.exception))

    def test_user_content_is_refused(self):
        self._write_extract(
            [_surface_row()], _vetting(unit_of_analysis="post", contains_user_content=True)
        )
        with self.assertRaises(ExtractContractError) as caught:
            list(self._source().harvest(HarvestPlan()))
        self.assertIn("contains_user_content", str(caught.exception))

    def test_an_unknown_enclave_is_refused(self):
        self._write_extract([_surface_row()], _vetting(enclave="my-laptop"))
        with self.assertRaises(ExtractContractError):
            list(self._source().harvest(HarvestPlan()))

    def test_a_missing_vetting_field_is_refused(self):
        vetting = _vetting()
        del vetting["query_id"]
        self._write_extract([_surface_row()], vetting)
        with self.assertRaises(ExtractContractError) as caught:
            list(self._source().harvest(HarvestPlan()))
        self.assertIn("query_id", str(caught.exception))

    def test_a_missing_contract_column_is_refused(self):
        csv_path = self.imports / "broken.csv"
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=["surface_id", "surface_name"])
            writer.writeheader()
            writer.writerow({"surface_id": "1", "surface_name": "x"})
        csv_path.with_suffix(".vetting.json").write_text(json.dumps(_vetting()), encoding="utf-8")
        with self.assertRaises(ExtractContractError) as caught:
            list(self._source().harvest(HarvestPlan()))
        self.assertIn("contract columns", str(caught.exception))


class TestWidelyKnownThreshold(MclTestCase):
    def test_a_page_below_fifteen_thousand_is_excluded(self):
        self._write_extract(
            [_surface_row(surface_followers="900", surface_verified="false")], _vetting()
        )
        records = list(self._source().harvest(HarvestPlan()))
        self.assertEqual(records, [])
        self.assertIn("mcl-surface-below-widely-known-threshold", self.manifest.exclusions)

    def test_a_profile_needs_twenty_five_thousand_or_verification(self):
        self._write_extract(
            [
                _surface_row(
                    surface_id="p1", surface_type="profile", surface_followers="20000",
                    surface_verified="false",
                )
            ],
            _vetting(),
        )
        self.assertEqual(list(self._source().harvest(HarvestPlan())), [])

    def test_a_verified_profile_is_admitted_without_a_count(self):
        self._write_extract(
            [
                _surface_row(
                    surface_id="p2", surface_type="profile", surface_followers="",
                    surface_verified="true",
                )
            ],
            _vetting(),
        )
        self.assertEqual(len(list(self._source().harvest(HarvestPlan()))), 1)


class TestProjection(MclTestCase):
    def test_core_metadata_is_filled_and_nothing_else(self):
        self._write_extract([_surface_row()], _vetting())
        record = list(self._source().harvest(HarvestPlan()))[0]

        from ..schema import CODER_OWNED

        written = [column for column in CODER_OWNED if str(record.corpus_row.get(column, "")).strip()]
        self.assertEqual(written, [], f"coder-owned columns written: {written}")

        self.assertEqual(record.corpus_row["title"], "Sundarbans Conservation Trust")
        self.assertEqual(record.corpus_row["producer_country"], "BD")
        self.assertEqual(record.corpus_row["date_published"], "2020-03-04")
        self.assertEqual(record.corpus_row["languages"], "bn | en")
        self.assertEqual(record.corpus_row["archive_status"], "metadata-only")
        self.assertEqual(record.audience_size, 48000)

    def test_the_platform_term_is_proposed_not_accepted(self):
        from ..schema import PLATFORM_VOCAB, SchemaError, validate_row

        self._write_extract([_surface_row()], _vetting())
        record = list(self._source().harvest(HarvestPlan()))[0]

        self.assertNotIn(record.corpus_row["platform_primary"], PLATFORM_VOCAB)
        row = dict(record.corpus_row)
        row["artefact_id"] = "pilot-001"
        with self.assertRaises(SchemaError) as caught:
            validate_row(row)
        self.assertIn("§12.2", str(caught.exception))

    def test_the_receipt_records_the_query_and_enclave(self):
        self._write_extract([_surface_row()], _vetting())
        record = list(self._source().harvest(HarvestPlan()))[0]
        self.assertEqual(record.receipt.params["query_id"], "q-123")
        self.assertEqual(record.receipt.params["enclave"], "meta-sre")
        self.assertEqual(record.receipt.method, "FILE")

    def test_fields_outside_the_allowlist_are_dropped(self):
        row = _surface_row()
        csv_path = self.imports / "extra.csv"
        columns = list(SURFACE_EXTRACT_COLUMNS) + ["post_text"]
        row["post_text"] = "this should never survive"
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=columns)
            writer.writeheader()
            writer.writerow(row)
        csv_path.with_suffix(".vetting.json").write_text(json.dumps(_vetting()), encoding="utf-8")

        record = list(self._source().harvest(HarvestPlan()))[0]
        self.assertNotIn("post_text", record.payload)
        self.assertGreaterEqual(record.dropped_fields, 1)


if __name__ == "__main__":
    unittest.main()
