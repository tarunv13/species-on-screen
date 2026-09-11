"""
Tests for the YouTube adapter. Offline: no network, no API key, no quota spent.

The assertion that matters most is `test_writes_no_coder_owned_column`. Every
other test checks that a field is mapped correctly; that one checks the
pipeline stays on the correct side of coding-workspace-spec §17, which is the
boundary the whole harvest plane exists to respect.
"""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from .. import schema
from ..config import Config
from ..ethics import EthicsGate
from ..provenance import Receipt, RunManifest
from ..ratelimit import QuotaLedger
from ..sources.base import HarvestPlan
from ..sources.youtube import YouTubeSource, parse_duration, uploads_playlist_id

REPO_ROOT = Path(__file__).resolve().parents[3]
CONFIG_PATH = REPO_ROOT / "research" / "config" / "pipeline.config.json"

CHANNEL = "UCtestchannel0000000001"

# A fully-declared video and a sparse one. The sparse record is the interesting
# case: it exercises every path where the adapter must leave a cell empty and
# name the gap rather than invent a value.
VIDEOS = {
    "vid_full": {
        "id": "vid_full",
        "snippet": {
            "title": "Sundarbans: Tigers of the Mangrove",
            "description": "A film.",
            "channelId": CHANNEL,
            "channelTitle": "Test Films",
            "publishedAt": "2023-04-01T10:00:00Z",
            "categoryId": "15",
            "defaultAudioLanguage": "en",
            "liveBroadcastContent": "none",
            "tags": ["tiger", "mangrove"],
            "thumbnails": {"high": {"url": "http://example/y.jpg", "width": 480}},
        },
        "contentDetails": {"duration": "PT48M12S", "definition": "hd", "caption": "true"},
        "status": {"privacyStatus": "public", "license": "creativeCommon", "uploadStatus": "processed"},
        "statistics": {"viewCount": "120000", "likeCount": "4200", "commentCount": "310"},
        "topicDetails": {"topicCategories": ["https://en.wikipedia.org/wiki/Nature"]},
    },
    "vid_sparse": {
        "id": "vid_sparse",
        "snippet": {
            "title": "untitled upload",
            "channelId": CHANNEL,
            "channelTitle": "Test Films",
            "publishedAt": "2024-01-02T00:00:00Z",
            "liveBroadcastContent": "live",
        },
        "contentDetails": {"duration": "P0D", "regionRestriction": {"blocked": ["DE", "FR"]}},
        "status": {"privacyStatus": "public"},
        "statistics": {"viewCount": "12"},
    },
}


class FakeHttp:
    """Stands in for HttpClient. Records calls; asserts the key is attached."""

    def __init__(self) -> None:
        self.calls: list[tuple[str, dict, str]] = []

    def get(self, url, **kwargs):
        params = kwargs.get("params", {})
        endpoint = url.rsplit("/", 1)[-1]
        self.calls.append((endpoint, params, kwargs.get("quota_bucket", "")))
        assert "key" in params, "the adapter must attach the API key to every call"

        if endpoint == "playlistItems":
            payload = {"items": [{"contentDetails": {"videoId": v}} for v in VIDEOS]}
        elif endpoint == "videos":
            wanted = params["id"].split(",")
            payload = {"items": [VIDEOS[i] for i in wanted if i in VIDEOS]}
        elif endpoint == "channels":
            payload = {
                "items": [
                    {
                        "id": CHANNEL,
                        "snippet": {"title": "Test Films", "country": "GB"},
                        "statistics": {"subscriberCount": "45300", "hiddenSubscriberCount": False},
                    }
                ]
            }
        elif endpoint == "search":
            payload = {"items": [{"id": {"videoId": "vid_full"}}]}
        else:
            payload = {"items": []}

        return payload, Receipt.make("youtube", url, params, 200, payload)

    def endpoints(self) -> list[str]:
        return [endpoint for endpoint, _, _ in self.calls]

    def buckets(self) -> list[str]:
        return [bucket for _, _, bucket in self.calls]


class YouTubeAdapterTestCase(unittest.TestCase):
    """Shared fixture: a fresh config, ledger and stub client per test."""

    def setUp(self) -> None:
        os.environ["YOUTUBE_API_KEY"] = "TEST-KEY-NOT-REAL"
        self.config = Config.load(CONFIG_PATH)
        self.ethics = EthicsGate.from_config(self.config)
        self.tmp = Path(tempfile.mkdtemp())
        self.ledger = QuotaLedger(self.tmp / "quota-ledger.json")
        self.manifest = RunManifest.start("test", self.config)
        self.source_config = self.config.source("youtube")
        self.source_config.raw["seed_channel_ids"] = [CHANNEL]
        self.http = FakeHttp()
        self.source = YouTubeSource(
            self.config, self.source_config, self.http, self.ledger, self.manifest, self.ethics
        )

    def harvest(self, **plan_kwargs):
        return list(self.source.harvest(HarvestPlan(**plan_kwargs)))

    @property
    def plan(self) -> HarvestPlan:
        return HarvestPlan(
            landscapes=[{"id": "sundarbans", "name": "Sundarbans", "biome": "Mangrove tidal forest"}],
            taxa=[{"vernacularName": "Bengal tiger", "scientificName": "Panthera tigris tigris"}],
        )


class TestDurationParsing(unittest.TestCase):
    def test_common_forms(self):
        self.assertEqual(parse_duration("PT4M13S"), 253)
        self.assertEqual(parse_duration("PT1H"), 3600)
        self.assertEqual(parse_duration("PT48M12S"), 2892)
        self.assertEqual(parse_duration("P1DT2H30M"), 95400)

    def test_zero_duration_is_falsy_not_none(self):
        # A livestream reports P0D. The adapter treats 0 as "no duration" and
        # records an Unresolved rather than writing "0" into the corpus.
        self.assertEqual(parse_duration("P0D"), 0)

    def test_unparseable_is_none_not_zero(self):
        self.assertIsNone(parse_duration("banana"))
        self.assertIsNone(parse_duration(""))
        self.assertIsNone(parse_duration("4:13"))


class TestUploadsPlaylistId(unittest.TestCase):
    def test_channel_id_maps_to_uploads_playlist(self):
        self.assertEqual(uploads_playlist_id("UCabc123"), "UUabc123")

    def test_handles_and_usernames_are_rejected(self):
        self.assertEqual(uploads_playlist_id("@natgeo"), "")
        self.assertEqual(uploads_playlist_id("natgeo"), "")
        self.assertEqual(uploads_playlist_id(""), "")


class TestPreflight(YouTubeAdapterTestCase):
    def test_clean_when_key_and_frame_present(self):
        self.assertEqual(self.source.preflight(), [])

    def test_missing_key_is_reported(self):
        os.environ.pop("YOUTUBE_API_KEY", None)
        self.assertTrue(any("YOUTUBE_API_KEY" in p for p in self.source.preflight()))

    def test_no_sampling_frame_is_reported(self):
        self.source_config.raw["seed_channel_ids"] = []
        self.assertTrue(any("no sampling frame" in p for p in self.source.preflight()))

    def test_handle_instead_of_channel_id_is_reported(self):
        self.source_config.raw["seed_channel_ids"] = ["@bbcearth"]
        self.assertTrue(any("must be channel ids" in p for p in self.source.preflight()))


class TestQueryStrategy(YouTubeAdapterTestCase):
    def test_templates_expand_over_landscapes_and_taxa(self):
        queries = self.source.build_queries(self.plan)
        self.assertIn("Sundarbans wildlife documentary", queries)
        self.assertIn("Sundarbans conservation", queries)
        self.assertIn("Sundarbans Mangrove tidal forest", queries)
        self.assertIn("Bengal tiger Sundarbans", queries)
        self.assertIn("Panthera tigris tigris", queries)

    def test_no_unfilled_placeholder_becomes_a_search_term(self):
        queries = self.source.build_queries(self.plan)
        self.assertFalse([q for q in queries if "{" in q])

    def test_template_needing_a_taxon_is_dropped_when_none_given(self):
        plan = HarvestPlan(landscapes=self.plan.landscapes)  # no taxa
        queries = self.source.build_queries(plan)
        self.assertFalse([q for q in queries if "{" in q])
        self.assertIn("Sundarbans wildlife documentary", queries)

    def test_explicit_queries_override_templates(self):
        self.assertEqual(self.source.build_queries(HarvestPlan(queries=["only this"])), ["only this"])

    def test_queries_are_deduplicated(self):
        queries = self.source.build_queries(self.plan)
        self.assertEqual(len(queries), len(set(queries)))


class TestHarvestBoundary(YouTubeAdapterTestCase):
    """coding-workspace-spec §17. The boundary the harvest plane exists to keep."""

    def test_writes_no_coder_owned_column(self):
        for record in self.harvest():
            trespass = [c for c in schema.CODER_OWNED if str(record.corpus_row.get(c, "")).strip()]
            self.assertEqual(trespass, [], f"{record.external_id} wrote coder-owned columns: {trespass}")

    def test_row_validates_once_the_harvester_stamps_an_artefact_id(self):
        for record in self.harvest():
            row = dict(record.corpus_row)
            row["artefact_id"] = "pilot-001"  # harvester._finalise_row does this
            schema.validate_row(row, harvest_only=True)

    def test_artefact_id_and_notes_path_are_left_to_the_allocator(self):
        for record in self.harvest():
            self.assertEqual(record.corpus_row["artefact_id"], "")
            self.assertEqual(record.corpus_row["notes_path"], "")

    def test_species_rows_are_left_to_the_taxonomic_pass(self):
        for record in self.harvest():
            self.assertEqual(record.species_rows, [])


class TestCoreMetadata(YouTubeAdapterTestCase):
    def setUp(self):
        super().setUp()
        self.records = {r.external_id: r for r in self.harvest()}
        self.full = self.records["vid_full"].corpus_row

    def test_maps_declared_fields(self):
        self.assertEqual(self.full["title"], "Sundarbans: Tigers of the Mangrove")
        self.assertEqual(self.full["slug"], "sundarbans-tigers-of-the-mangrove")
        self.assertEqual(self.full["creator"], "Test Films")
        self.assertEqual(self.full["platform_primary"], "youtube")
        self.assertEqual(self.full["format"], "video")
        self.assertEqual(self.full["url_primary"], "https://www.youtube.com/watch?v=vid_full")
        self.assertEqual(self.full["duration_or_length"], "2892")
        self.assertEqual(self.full["languages"], "en")
        self.assertEqual(self.full["access_state_at_capture"], "open")
        self.assertTrue(self.full["license_or_rights"].startswith("CC BY"))
        self.assertEqual(self.full["archive_status"], "metadata-only")
        self.assertEqual(self.full["coding_status"], "candidate")

    def test_producer_country_comes_from_the_channel(self):
        self.assertEqual(self.full["producer_country"], "GB")

    def test_corpus_identity_comes_from_config(self):
        self.assertEqual(self.full["corpus_version_added"], self.config.corpus["corpus_version"])
        self.assertEqual(self.full["coder_id"], self.config.corpus["coder_id"])

    def test_provenance_columns_are_populated(self):
        self.assertTrue(self.full["harvest_receipt_id"])
        self.assertTrue(self.full["harvest_payload_sha256"])
        self.assertTrue(self.full["harvest_retrieved_at"])
        self.assertEqual(self.full["harvest_source"], "youtube")
        self.assertEqual(self.full["harvest_external_id"], "vid_full")


class TestGapsAreNamedNotGuessed(YouTubeAdapterTestCase):
    def setUp(self):
        super().setUp()
        records = {r.external_id: r for r in self.harvest()}
        self.record = records["vid_sparse"]
        self.row = self.record.corpus_row

    def test_undeclared_fields_are_left_empty(self):
        self.assertEqual(self.row["duration_or_length"], "")
        self.assertEqual(self.row["languages"], "")
        self.assertEqual(self.row["license_or_rights"], "")

    def test_region_restriction_is_read_as_geo_restricted(self):
        self.assertEqual(self.row["access_state_at_capture"], "geo-restricted")

    def test_every_gap_is_named_in_unresolved(self):
        tokens = self.row["harvest_unresolved"]
        for field in ("duration_or_length", "languages", "license_or_rights"):
            self.assertIn(field, tokens)

    def test_subject_geography_is_never_seeded_from_the_query(self):
        # §1.4 is harvest-owned, but YouTube declares only production geography.
        # Seeding it from the landscape that produced the query would be a guess.
        self.assertEqual(self.row["subject_country"], "")
        self.assertEqual(self.row["subject_region"], "")
        self.assertEqual(self.row["mismatch_flag"], "")
        self.assertIn("subject_country", self.row["harvest_unresolved"])


class TestEthicsIntegration(YouTubeAdapterTestCase):
    def test_audience_size_is_reported_not_filtered(self):
        records = {r.external_id: r for r in self.harvest()}
        self.assertEqual(records["vid_full"].audience_size, 45300)

    def test_the_shared_gate_applies_the_threshold(self):
        self.assertTrue(self.ethics.admits_creator(45300))
        self.assertFalse(self.ethics.admits_creator(500))
        self.assertFalse(self.ethics.admits_creator(None))

    def test_youtube_is_not_declared_an_institutional_producer(self):
        # The platform carries broadcasters and lone creators alike; declaring
        # it institutional would exempt all of them from §8.3.
        self.assertFalse(self.source.institutional_producer)

    def test_posture_is_accepted_by_the_gate(self):
        self.ethics.check_source(self.source)  # raises if refused

    def test_comments_are_never_requested(self):
        self.harvest()
        self.assertNotIn("commentThreads", self.http.endpoints())


class TestDataMinimisation(YouTubeAdapterTestCase):
    def setUp(self):
        super().setUp()
        records = {r.external_id: r for r in self.harvest()}
        self.record = records["vid_full"]

    def test_unallowlisted_fields_are_dropped(self):
        self.assertFalse([k for k in self.record.payload if "thumbnail" in k])

    def test_drops_are_counted(self):
        self.assertGreater(self.record.dropped_fields, 0)

    def test_allowlisted_fields_survive(self):
        self.assertEqual(self.record.payload["snippet.title"], "Sundarbans: Tigers of the Mangrove")

    def test_no_comment_text_is_retained(self):
        leaked = [k for k in self.record.payload if "comment" in k.lower() and "count" not in k.lower()]
        self.assertEqual(leaked, [])


class TestQuotaAccounting(YouTubeAdapterTestCase):
    def test_seed_channels_never_touch_the_search_bucket(self):
        self.harvest()
        self.assertNotIn("search", self.http.buckets())
        self.assertEqual(self.ledger.spent(self.source.search_bucket()), 0)

    def test_every_call_is_spent_against_the_units_pool(self):
        self.harvest()
        self.assertEqual(self.ledger.spent(self.source.units_bucket()), len(self.http.calls))

    def test_discovery_spends_the_search_bucket(self):
        self.source_config.raw["seed_channel_ids"] = []
        discovery = dict(self.source_config.raw.get("discovery", {}))
        discovery["enabled"] = True
        self.source_config.raw["discovery"] = discovery
        self.harvest(landscapes=self.plan.landscapes, taxa=self.plan.taxa, limit=1)
        self.assertIn("search", self.http.buckets())
        self.assertGreater(self.ledger.spent(self.source.search_bucket()), 0)

    def test_an_exhausted_search_bucket_stops_the_run(self):
        self.source_config.raw["seed_channel_ids"] = []
        discovery = dict(self.source_config.raw.get("discovery", {}))
        discovery["enabled"] = True
        self.source_config.raw["discovery"] = discovery
        self.ledger._data[self.source.search_bucket().ledger_key()] = 100
        with self.assertRaises(Exception):
            self.harvest(landscapes=self.plan.landscapes, taxa=self.plan.taxa)

    def test_limit_is_respected(self):
        self.assertEqual(len(self.harvest(limit=1)), 1)


class TestEstimate(YouTubeAdapterTestCase):
    def test_makes_no_network_call(self):
        self.source.estimate(self.plan)
        self.assertEqual(self.http.calls, [])

    def test_names_the_frame_in_use(self):
        self.assertEqual(self.source.estimate(self.plan)["frame"], "seed-channels")

    def test_reports_remaining_quota_for_both_buckets(self):
        remaining = self.source.estimate(self.plan)["remaining_today"]
        self.assertIn("search", remaining)
        self.assertIn("units", remaining)


class TestDryRun(YouTubeAdapterTestCase):
    def test_dry_run_spends_nothing(self):
        self.assertEqual(self.harvest(dry_run=True), [])
        self.assertEqual(self.http.calls, [])


if __name__ == "__main__":
    unittest.main()
