"""
The invariants that must not regress.

Each test here corresponds to a governance rule rather than to a function.
If one fails, the pipeline has crossed a line the pilot drew, and the fix is
not to relax the test.
"""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from ..ethics import EthicsGate
from ..ids import ArtefactIdAllocator, slugify
from ..normalize import (
    duration_seconds,
    global_classification,
    iso_date,
    language_code,
    licence_or_rights,
    mismatch_flag,
)
from ..provenance import RunManifest, Unresolved, redact, sha256_json
from ..ratelimit import QuotaBucket, QuotaExhausted, QuotaLedger, TokenBucket
from ..schema import (
    CODER_OWNED,
    CORPUS_COLUMNS,
    HARVEST_OWNED,
    SchemaError,
    blank_corpus_row,
    join_list,
    split_list,
    validate_row,
    validate_species_row,
)
from ..store import CorpusStore


class TestSchemaBoundary(unittest.TestCase):
    """coding-workspace-spec.md §17: interpretive fields belong to a human."""

    def _minimal_row(self) -> dict:
        row = blank_corpus_row()
        row["artefact_id"] = "pilot-001"
        row["title"] = "A film"
        row["platform_primary"] = "youtube"
        row["format"] = "video"
        row["coding_status"] = "candidate"
        return row

    def test_harvest_owned_and_coder_owned_partition_the_schema(self):
        self.assertEqual(set(HARVEST_OWNED) | set(CODER_OWNED), set(CORPUS_COLUMNS))
        self.assertEqual(set(HARVEST_OWNED) & set(CODER_OWNED), set())

    def test_a_clean_harvest_row_validates(self):
        validate_row(self._minimal_row(), harvest_only=True)

    def test_writing_any_coder_owned_column_is_refused(self):
        for column in ("spectacle_intensity", "framing_mode", "dominant_register", "corpus_role"):
            with self.subTest(column=column):
                row = self._minimal_row()
                row[column] = "3"
                with self.assertRaises(SchemaError) as caught:
                    validate_row(row, harvest_only=True)
                self.assertIn("§17", str(caught.exception))

    def test_an_unaccepted_platform_term_is_refused_with_the_amendment_route(self):
        row = self._minimal_row()
        row["platform_primary"] = "facebook"
        with self.assertRaises(SchemaError) as caught:
            validate_row(row, harvest_only=True)
        self.assertIn("§12.2", str(caught.exception))

    def test_a_row_without_an_artefact_id_is_refused(self):
        row = self._minimal_row()
        row["artefact_id"] = ""
        with self.assertRaises(SchemaError):
            validate_row(row)

    def test_unknown_columns_are_refused(self):
        row = self._minimal_row()
        row["invented_column"] = "x"
        with self.assertRaises(SchemaError):
            validate_row(row)

    def test_species_row_rejects_an_out_of_vocabulary_category(self):
        row = {"artefact_id": "pilot-001", "iucn_status_at_publication": "ENDANGERED"}
        with self.assertRaises(SchemaError):
            validate_species_row(row)

    def test_list_round_trip(self):
        self.assertEqual(split_list(join_list(["en", "bn", "en"])), ["en", "bn"])
        self.assertEqual(join_list([]), "")
        self.assertEqual(split_list(""), [])


class TestVocabularyAmendment(unittest.TestCase):
    """corpus-seed-framework.md §12.2: a new term is in force only once accepted."""

    def setUp(self):
        from ..schema import reset_accepted_terms

        reset_accepted_terms()
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "vocabulary-amendments.json"

    def tearDown(self):
        from ..schema import reset_accepted_terms

        reset_accepted_terms()
        self.tmp.cleanup()

    def _write(self, status: str, accepted_by: str = "") -> None:
        self.path.write_text(
            json.dumps(
                {
                    "amendments": [
                        {
                            "vocabulary": "platform",
                            "term": "facebook-page",
                            "definition": "d",
                            "example": "e",
                            "rationale": "r",
                            "status": status,
                            "accepted_by": accepted_by,
                            "accepted_date": "2026-09-11" if accepted_by else "",
                        }
                    ]
                }
            ),
            encoding="utf-8",
        )

    def _row(self) -> dict:
        row = blank_corpus_row()
        row["artefact_id"] = "pilot-001"
        row["platform_primary"] = "facebook-page"
        row["format"] = "mixed"
        return row

    def test_a_proposed_term_is_refused(self):
        from ..schema import load_amendments

        self._write("proposed")
        summary = load_amendments(self.path)
        self.assertEqual(summary["accepted"], 0)
        self.assertEqual(summary["proposed"], 1)
        with self.assertRaises(SchemaError) as caught:
            validate_row(self._row())
        self.assertIn("vocabulary-amendments.json", str(caught.exception))

    def test_an_accepted_term_is_admitted(self):
        from ..schema import load_amendments

        self._write("accepted", accepted_by="TV")
        summary = load_amendments(self.path)
        self.assertEqual(summary["accepted"], 1)
        validate_row(self._row())

    def test_acceptance_without_a_named_accepter_does_not_count(self):
        from ..schema import load_amendments

        self._write("accepted", accepted_by="")
        load_amendments(self.path)
        with self.assertRaises(SchemaError):
            validate_row(self._row())

    def test_a_missing_amendment_file_is_not_an_error(self):
        from ..schema import load_amendments

        summary = load_amendments(Path(self.tmp.name) / "absent.json")
        self.assertFalse(summary["present"])

    def test_the_shipped_amendment_file_is_well_formed_and_not_yet_in_force(self):
        shipped = Path(__file__).resolve().parents[2] / "config" / "vocabulary-amendments.json"
        if not shipped.exists():
            self.skipTest("amendment file not present in this checkout")
        data = json.loads(shipped.read_text(encoding="utf-8"))
        self.assertTrue(data["amendments"])
        for entry in data["amendments"]:
            for required in ("vocabulary", "term", "definition", "example", "rationale", "status"):
                self.assertTrue(entry.get(required), f"{entry.get('term')} is missing {required}")
            self.assertEqual(
                entry["status"],
                "proposed",
                "the shipped file must not accept a term on the researcher's behalf",
            )


class TestIdAllocation(unittest.TestCase):
    """coding-workspace-spec.md §14: sequential, never reassigned, gaps stay visible."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "ledger.json"

    def tearDown(self):
        self.tmp.cleanup()

    def test_ids_are_sequential_and_zero_padded(self):
        allocator = ArtefactIdAllocator(self.path)
        self.assertEqual(allocator.allocate("youtube", "a").artefact_id, "pilot-001")
        self.assertEqual(allocator.allocate("youtube", "b").artefact_id, "pilot-002")

    def test_the_same_artefact_never_gets_a_second_id(self):
        allocator = ArtefactIdAllocator(self.path)
        first = allocator.allocate("youtube", "abc")
        second = allocator.allocate("youtube", "abc")
        self.assertEqual(first.artefact_id, second.artefact_id)
        self.assertTrue(first.minted)
        self.assertFalse(second.minted)

    def test_the_same_external_id_on_two_platforms_is_two_artefacts(self):
        allocator = ArtefactIdAllocator(self.path)
        self.assertNotEqual(
            allocator.allocate("youtube", "123").artefact_id,
            allocator.allocate("tmdb", "123").artefact_id,
        )

    def test_allocation_survives_a_restart(self):
        first = ArtefactIdAllocator(self.path)
        first.allocate("youtube", "a")
        second = ArtefactIdAllocator(self.path)
        self.assertEqual(second.allocate("youtube", "b").artefact_id, "pilot-002")
        self.assertEqual(second.allocate("youtube", "a").artefact_id, "pilot-001")

    def test_a_retired_id_is_not_recycled(self):
        allocator = ArtefactIdAllocator(self.path)
        allocator.absorb_existing(["pilot-001", "pilot-002", "pilot-003"])
        self.assertEqual(allocator.allocate("youtube", "new").artefact_id, "pilot-004")

    def test_a_ledger_from_another_corpus_version_is_refused(self):
        self.path.write_text(json.dumps({"prefix": "v1", "high_water": 5, "issued": {}}), encoding="utf-8")
        with self.assertRaises(Exception):
            ArtefactIdAllocator(self.path, prefix="pilot")

    def test_slug_is_bounded_and_does_not_end_mid_word(self):
        slug = slugify("The Sundarbans mangrove forest and the tigers that live inside it")
        self.assertLessEqual(len(slug), 40)
        self.assertFalse(slug.endswith("-"))


class TestMergeProtectsCoding(unittest.TestCase):
    """Re-running a harvest must never destroy a coder's work."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = CorpusStore(Path(self.tmp.name))

    def tearDown(self):
        self.tmp.cleanup()

    def _row(self, artefact_id: str, title: str) -> dict:
        row = blank_corpus_row()
        row["artefact_id"] = artefact_id
        row["title"] = title
        row["platform_primary"] = "youtube"
        row["format"] = "video"
        row["coding_status"] = "candidate"
        return row

    def test_a_new_row_is_appended(self):
        stats = self.store.merge([self._row("pilot-001", "A")])
        self.assertEqual(stats["appended"], 1)
        self.assertEqual(len(self.store.read_corpus()), 1)

    def test_a_coded_cell_survives_a_second_harvest(self):
        self.store.merge([self._row("pilot-001", "A")])

        rows = self.store.read_corpus()
        rows[0]["spectacle_intensity"] = "4"
        rows[0]["framing_mode"] = "urgency"
        rows[0]["coding_status"] = "coded"
        self.store._write(self.store.corpus_path, CORPUS_COLUMNS, rows)

        incoming = self._row("pilot-001", "A")
        incoming["spectacle_intensity"] = "1"
        incoming["framing_mode"] = "observation"
        stats = self.store.merge([incoming])

        after = self.store.read_corpus()[0]
        self.assertEqual(after["spectacle_intensity"], "4")
        self.assertEqual(after["framing_mode"], "urgency")
        self.assertEqual(after["coding_status"], "coded")
        # Two coder-owned cells, plus coding_status, which is write-once.
        self.assertEqual(stats["protected_cells"], 3)

    def test_a_harvest_field_is_not_overwritten_without_refresh(self):
        self.store.merge([self._row("pilot-001", "Original title")])
        self.store.merge([self._row("pilot-001", "Changed title")])
        self.assertEqual(self.store.read_corpus()[0]["title"], "Original title")

    def test_refresh_updates_harvest_fields_only(self):
        self.store.merge([self._row("pilot-001", "Original title")])
        rows = self.store.read_corpus()
        rows[0]["corpus_role"] = "canonical"
        self.store._write(self.store.corpus_path, CORPUS_COLUMNS, rows)

        incoming = self._row("pilot-001", "Changed title")
        incoming["corpus_role"] = "outlier"
        self.store.merge([incoming], refresh_harvest_fields=True)

        after = self.store.read_corpus()[0]
        self.assertEqual(after["title"], "Changed title")
        self.assertEqual(after["corpus_role"], "canonical")

    def test_coding_status_is_not_reverted_by_a_refresh(self):
        """The regression this test exists for: --refresh undoing a coding session."""
        self.store.merge([self._row("pilot-001", "A")])
        rows = self.store.read_corpus()
        self.assertEqual(rows[0]["coding_status"], "candidate")

        rows[0]["coding_status"] = "coded"
        rows[0]["confidence_overall"] = "high"
        rows[0]["coded_date"] = "2026-09-11"
        self.store._write(self.store.corpus_path, CORPUS_COLUMNS, rows)

        self.store.merge([self._row("pilot-001", "A")], refresh_harvest_fields=True)

        after = self.store.read_corpus()[0]
        self.assertEqual(after["coding_status"], "coded")
        self.assertEqual(after["confidence_overall"], "high")
        self.assertEqual(after["coded_date"], "2026-09-11")

    def test_write_once_columns_are_set_at_creation_then_frozen(self):
        from ..schema import WRITE_ONCE

        first = self._row("pilot-001", "A")
        first["date_captured"] = "2026-01-01"
        first["notes_path"] = "notes/pilot-001.md"
        self.store.merge([first])

        second = self._row("pilot-001", "A")
        second["date_captured"] = "2026-09-11"
        second["notes_path"] = "notes/elsewhere.md"
        stats = self.store.merge([second], refresh_harvest_fields=True)

        after = self.store.read_corpus()[0]
        self.assertEqual(after["date_captured"], "2026-01-01")
        self.assertEqual(after["notes_path"], "notes/pilot-001.md")
        self.assertGreaterEqual(stats["protected_cells"], 2)
        self.assertTrue(WRITE_ONCE <= set(HARVEST_OWNED))

    def test_rows_are_never_dropped(self):
        self.store.merge([self._row("pilot-001", "A"), self._row("pilot-002", "B")])
        self.store.merge([self._row("pilot-001", "A")])
        self.assertEqual(len(self.store.read_corpus()), 2)

    def test_an_unknown_column_on_disk_stops_the_run(self):
        self.store.merge([self._row("pilot-001", "A")])
        text = self.store.corpus_path.read_text(encoding="utf-8").splitlines()
        text[0] = text[0] + ",surprise_column"
        text[1] = text[1] + ",value"
        self.store.corpus_path.write_text("\n".join(text), encoding="utf-8")
        with self.assertRaises(Exception):
            self.store.read_corpus()


class TestEthicsGates(unittest.TestCase):
    """corpus-seed-framework.md §8 and SENSITIVE-DATA-POLICY.md."""

    def setUp(self):
        self.gate = EthicsGate(min_creator_audience=10000)

    def test_a_small_creator_is_excluded_and_counted(self):
        self.assertFalse(self.gate.admits_creator(500))
        self.assertEqual(self.gate.report()["creator-below-audience-threshold"], 1)

    def test_an_unknown_audience_is_excluded_not_admitted(self):
        self.assertFalse(self.gate.admits_creator(None))
        self.assertIn("creator-audience-unknown", self.gate.report())

    def test_an_institutional_producer_bypasses_the_threshold(self):
        self.assertTrue(self.gate.admits_creator(None, institutional=True))

    def test_comments_are_off_unless_enabled(self):
        self.assertFalse(self.gate.admits_comments())
        self.assertTrue(EthicsGate(collect_comments=True).admits_comments())

    def test_coordinates_are_generalised(self):
        lat, lng, uncertainty, unresolved = self.gate.generalise_coordinate(21.949321, 89.183422)
        self.assertEqual(lat, "21.9")
        self.assertEqual(lng, "89.2")
        self.assertEqual(uncertainty, "25000")
        self.assertEqual(unresolved, [])

    def test_a_threatened_taxon_locality_is_withheld_entirely(self):
        lat, lng, uncertainty, unresolved = self.gate.generalise_coordinate(
            21.949321, 89.183422, taxon="Panthera tigris tigris", iucn_category="EN"
        )
        self.assertEqual((lat, lng, uncertainty), ("", "", ""))
        self.assertEqual(len(unresolved), 1)
        self.assertIn("locality-withheld", unresolved[0].reason)

    def test_a_content_download_posture_is_refused(self):
        class Fake:
            name = "bad"
            tos_posture = "scrape"

        from ..ethics import EthicsRefusal

        with self.assertRaises(EthicsRefusal):
            self.gate.check_source(Fake())


class TestQuotaLedger(unittest.TestCase):
    """A budget checked before the call, not discovered from a 403."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.ledger = QuotaLedger(Path(self.tmp.name) / "quota.json")
        self.bucket = QuotaBucket(source="youtube", bucket="search", limit=3)

    def tearDown(self):
        self.tmp.cleanup()

    def test_spending_accumulates(self):
        self.ledger.spend(self.bucket, 1)
        self.ledger.spend(self.bucket, 1)
        self.assertEqual(self.ledger.spent(self.bucket), 2)
        self.assertEqual(self.ledger.remaining(self.bucket), 1)

    def test_exceeding_the_budget_raises_before_the_call(self):
        self.ledger.spend(self.bucket, 3)
        with self.assertRaises(QuotaExhausted):
            self.ledger.check(self.bucket, 1)

    def test_the_ledger_survives_a_restart(self):
        self.ledger.spend(self.bucket, 2)
        reopened = QuotaLedger(self.ledger.path)
        self.assertEqual(reopened.spent(self.bucket), 2)

    def test_the_two_youtube_buckets_are_independent(self):
        units = QuotaBucket(source="youtube", bucket="units", limit=10000)
        self.ledger.spend(self.bucket, 3)
        self.assertEqual(self.ledger.spent(units), 0)
        self.assertEqual(self.ledger.remaining(units), 10000)

    def test_token_bucket_admits_its_burst_without_blocking(self):
        bucket = TokenBucket(rate_per_second=100, burst=5)
        for _ in range(5):
            self.assertEqual(bucket.take(), 0.0)


class TestNormalisation(unittest.TestCase):
    """One convention, applied once, and never a guess."""

    def test_iso_dates(self):
        self.assertEqual(iso_date("2026-05-01T12:30:00Z"), "2026-05-01")
        self.assertEqual(iso_date("2026-05-01"), "2026-05-01")
        self.assertEqual(iso_date("not a date"), "")
        self.assertEqual(iso_date(None), "")

    def test_durations(self):
        self.assertEqual(duration_seconds("PT14M3S")[0], "843")
        self.assertEqual(duration_seconds("PT1H2M")[0], "3720")
        self.assertEqual(duration_seconds(843)[0], "843")
        self.assertEqual(duration_seconds("1:02:03")[0], "3723")
        value, unresolved = duration_seconds("about an hour")
        self.assertEqual(value, "")
        self.assertEqual(len(unresolved), 1)

    def test_language_codes_reduce_to_the_primary_subtag(self):
        self.assertEqual(language_code("en-GB"), "en")
        self.assertEqual(language_code("BN"), "bn")
        self.assertEqual(language_code("not-a-language"), "")

    def test_global_classification_prefers_the_registry_region(self):
        self.assertEqual(global_classification(region="South Asia"), "global-south")
        self.assertEqual(global_classification(region="Antarctica"), "polar")
        self.assertEqual(global_classification(countries=["GB"]), "global-north")
        self.assertEqual(global_classification(countries=["GB", "IN"]), "transboundary")
        self.assertEqual(global_classification(), "ambiguous")

    def test_mismatch_flag_is_empty_when_either_side_is_unknown(self):
        self.assertEqual(mismatch_flag("GB", ["IN"]), "TRUE")
        self.assertEqual(mismatch_flag("IN", ["IN", "BD"]), "FALSE")
        self.assertEqual(mismatch_flag("", ["IN"]), "")
        self.assertEqual(mismatch_flag("GB", []), "")

    def test_unstated_rights_default_to_all_rights_reserved(self):
        self.assertEqual(licence_or_rights(""), "all rights reserved")
        self.assertEqual(licence_or_rights("CC BY 4.0"), "CC BY 4.0")


class TestProvenance(unittest.TestCase):
    """Credentials never reach an output file."""

    def test_secrets_are_redacted(self):
        redacted = redact({"key": "SECRET", "api_key": "SECRET", "q": "tiger", "access_token": "SECRET"})
        self.assertEqual(redacted["key"], "<redacted>")
        self.assertEqual(redacted["api_key"], "<redacted>")
        self.assertEqual(redacted["access_token"], "<redacted>")
        self.assertEqual(redacted["q"], "tiger")

    def test_payload_hashes_are_order_independent(self):
        self.assertEqual(sha256_json({"a": 1, "b": 2}), sha256_json({"b": 2, "a": 1}))

    def test_unresolved_renders_as_a_token(self):
        self.assertEqual(
            Unresolved("date_published", "absent-from-source").as_token(),
            "date_published:absent-from-source",
        )


class TestSeedFrame(unittest.TestCase):
    """The frame comes from committed artefacts, not from an invented list."""

    def test_the_landscape_registry_is_readable_and_populated(self):
        from ..seeds import load_landscapes

        registry = Path(__file__).resolve().parents[3] / "scripts" / "ingest" / "landscapes.json"
        if not registry.exists():
            self.skipTest("landscape registry not present in this checkout")
        landscapes = load_landscapes(registry)
        self.assertGreater(len(landscapes), 0)
        for landscape in landscapes:
            self.assertTrue(landscape.get("id"))
            self.assertTrue(landscape.get("name"))


if __name__ == "__main__":
    unittest.main()
