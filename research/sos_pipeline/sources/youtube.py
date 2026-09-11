"""
YouTube Data API v3 — the video sampling frame.

Authority: `corpus-seed-framework.md` §1.1 for the columns this adapter fills,
§4 for the sampling strategies it implements, §8.2/§8.3/§8.8 for what it may
collect; `coding-workspace-spec.md` §17 for the line it does not cross.

Two frames, and the choice between them is methodological, not technical
------------------------------------------------------------------------
`seed_channels`  A channel's uploads playlist (UC... -> UU...) enumerated with
                 playlistItems.list. The frame is *complete* (every upload, in
                 upload order), *reproducible* (the same playlist returns the
                 same items), and *unranked* (no model decides what a researcher
                 sees). Costs 1 unit per page of 50 against the 10,000/day pool.

`discovery`      search.list against explicit query strings. Capped by Google at
                 100 calls/day in its own quota bucket — a hard ceiling of about
                 5,000 results per day however much of the unit pool is
                 untouched. Results are ranked, so the frame drifts between runs.

The config disables discovery by default and says to prefer seed channels. This
adapter agrees and enforces it: seed channels are exhausted before a single
search call is spent, discovery runs only when explicitly enabled, and the run
manifest records that it was used.

Why the default ordering is `date`, not `relevance`
---------------------------------------------------
Operating principle 1 of the corpus framework is reproducibility over
exhaustiveness. `order=relevance` is YouTube's ranking model; re-running the
same query next month returns a different set, and the sampling frame is then
un-restatable in a methods section. `order=date` is a total order over a
declared time window and re-runs identically. Relevance stays available, but it
must be asked for, and asking leaves a warning in the manifest.

This is a reproducibility argument first. §8.5 (algorithmic data sourcing)
concerns *personalised*, recommendation-mediated sampling, which an
unauthenticated API key does not do — so this adapter does not claim §8.5
forbids relevance ordering. It claims the frame should be one another
researcher can rebuild.

What this adapter never does
----------------------------
- Downloads a content file. (§8.1 — no flag turns this on.)
- Calls `commentThreads.list`. Audience comments are human-subject data (§8.4);
  there is no code path here that requests them.
- Filters on creator audience size. It *reports* `audience_size` so the shared
  ethics gate applies §8.3 once, in one place, across every source.
- Writes an interpretive column. `schema.validate_row` would reject the row,
  and that rejection is the point (coding-workspace-spec §17).
- Guesses. A field it cannot attest is written empty and named in `unresolved`.
"""

from __future__ import annotations

import re
from typing import Iterable, Iterator

from .. import schema
from ..ids import slugify
from ..provenance import Unresolved, today_iso
from ..ratelimit import QuotaBucket, QuotaExhausted, TransportError
from .base import HarvestPlan, HarvestRecord, Source, SourceError, first_present, flatten

WATCH_URL = "https://www.youtube.com/watch?v={video_id}"

# videos.list and channels.list accept up to 50 ids per call; playlistItems and
# search return at most 50 per page. One constant, because every batching
# decision in this module is the same decision.
MAX_IDS_PER_CALL = 50
MAX_RESULTS_PER_PAGE = 50

# search.list sits in its own daily bucket at 1 unit per call, 100 calls/day.
# Every other list method costs 1 unit against the separate 10,000/day pool.
# Confirmed against developers.google.com/youtube/v3/docs/search/list.
SEARCH_BUCKET = "search"
UNITS_BUCKET = "units"

DEFAULT_DISCOVERY_ORDER = "date"
RANKED_ORDERS = {"relevance", "rating", "viewCount"}

# YouTube's licence values -> the §1.1 `license_or_rights` string.
LICENSE_TEXT = {
    "creativeCommon": "CC BY 3.0 (YouTube Creative Commons)",
    "youtube": "Standard YouTube License (all rights reserved)",
}

# ISO 8601 durations as YouTube emits them: PT4M13S, P1DT2H, P0D for a live
# broadcast that has no duration yet.
_DURATION = re.compile(
    r"^P(?:(?P<weeks>\d+)W)?(?:(?P<days>\d+)D)?"
    r"(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)?$"
)

_PLACEHOLDER = re.compile(r"\{[a-z_]+\}")


def parse_duration(value: str) -> int | None:
    """
    ISO 8601 duration -> whole seconds.

    Returns None when absent or unparseable, so the caller writes an empty cell
    and an `Unresolved` rather than a zero that would later be read as a real
    measurement.
    """
    match = _DURATION.match((value or "").strip())
    if not match:
        return None
    parts = {key: int(val) for key, val in match.groupdict(default="0").items()}
    return (
        parts["weeks"] * 604800
        + parts["days"] * 86400
        + parts["hours"] * 3600
        + parts["minutes"] * 60
        + parts["seconds"]
    )


def batched(items: Iterable[str], size: int) -> Iterator[list[str]]:
    batch: list[str] = []
    for item in items:
        batch.append(item)
        if len(batch) >= size:
            yield batch
            batch = []
    if batch:
        yield batch


def uploads_playlist_id(channel_id: str) -> str:
    """
    A channel's uploads playlist is its id with the second character changed:
    UC... -> UU.... Documented, stable, and it saves a channels.list call.

    Returns "" for anything that is not a channel id, so the caller reports it
    rather than constructing a playlist id that cannot exist.
    """
    cid = (channel_id or "").strip()
    return "UU" + cid[2:] if cid.startswith("UC") and len(cid) > 2 else ""


class YouTubeSource(Source):
    """The YouTube adapter. Core metadata only; every judgement left to a coder."""

    name = "youtube"
    tos_posture = "metadata-only-public-api"
    produces_corpus_rows = True
    supports_declared_queries = True

    #: §8.3. YouTube carries broadcasters and lone creators on the same surface
    #: and its metadata does not distinguish them, so the audience-size threshold
    #: is exactly the instrument that should apply. Declaring this True would
    #: exempt the whole platform from the gate.
    institutional_producer = False

    #: §8.8. Dotted paths against `base.flatten`. Everything outside this tuple
    #: is dropped before the payload reaches the raw store, and the drop is
    #: counted. Comment bodies are absent by construction, not by filter.
    field_allowlist = (
        "id",
        "snippet.title",
        "snippet.description",
        "snippet.channelId",
        "snippet.channelTitle",
        "snippet.publishedAt",
        "snippet.categoryId",
        "snippet.defaultLanguage",
        "snippet.defaultAudioLanguage",
        "snippet.liveBroadcastContent",
        "snippet.tags",
        "contentDetails.duration",
        "contentDetails.definition",
        "contentDetails.dimension",
        "contentDetails.caption",
        "contentDetails.licensedContent",
        "contentDetails.projection",
        "contentDetails.regionRestriction.allowed",
        "contentDetails.regionRestriction.blocked",
        "status.uploadStatus",
        "status.privacyStatus",
        "status.license",
        "status.embeddable",
        "status.madeForKids",
        # Visibility counts only. These serve §4.4 probability-proportional-to-
        # visibility sampling. `commentCount` is a count; no comment text is
        # requested anywhere in this module.
        "statistics.viewCount",
        "statistics.likeCount",
        "statistics.commentCount",
        "topicDetails.topicCategories",
    )

    # --- configuration accessors --------------------------------------

    @property
    def base_url(self) -> str:
        return str(self.cfg.get("base_url", "https://www.googleapis.com/youtube/v3")).rstrip("/")

    @property
    def discovery_cfg(self) -> dict:
        return dict(self.cfg.get("discovery", {}) or {})

    @property
    def seed_channel_ids(self) -> list[str]:
        return [str(c).strip() for c in (self.cfg.get("seed_channel_ids") or []) if str(c).strip()]

    @property
    def discovery_enabled(self) -> bool:
        return bool(self.discovery_cfg.get("enabled", False))

    @property
    def discovery_order(self) -> str:
        return str(self.discovery_cfg.get("order", DEFAULT_DISCOVERY_ORDER))

    def _quota_cfg(self) -> dict:
        return dict(self.cfg.get("quota", {}) or {})

    def search_bucket(self) -> QuotaBucket:
        quota = self._quota_cfg()
        return QuotaBucket(
            source=self.name,
            bucket=SEARCH_BUCKET,
            limit=int(quota.get("search_calls_per_day", 100)),
            reset_timezone=str(quota.get("reset_timezone", "America/Los_Angeles")),
        )

    def units_bucket(self) -> QuotaBucket:
        quota = self._quota_cfg()
        return QuotaBucket(
            source=self.name,
            bucket=UNITS_BUCKET,
            limit=int(quota.get("units_per_day", 10000)),
            reset_timezone=str(quota.get("reset_timezone", "America/Los_Angeles")),
        )

    @property
    def _channel_cache(self) -> dict:
        """Constructor is inherited, so per-run caches are created on first use."""
        if not hasattr(self, "_channels_seen"):
            self._channels_seen: dict[str, dict] = {}
        return self._channels_seen

    # --- lifecycle ----------------------------------------------------

    def preflight(self) -> list[str]:
        """Everything checkable without spending a call. Never raises."""
        problems: list[str] = []

        if not self.cfg.enabled:
            problems.append("youtube is disabled in the configuration")

        env_name = self.cfg.get("api_key_env", "YOUTUBE_API_KEY")
        if not self.cfg.credential():
            problems.append(
                f"{env_name} is unset or empty. Put it in your environment or a gitignored .env, "
                "never in the config file."
            )

        if not self.seed_channel_ids and not self.discovery_enabled:
            problems.append(
                "no sampling frame: sources.youtube.seed_channel_ids is empty and discovery.enabled is "
                "false, so this adapter has nothing to enumerate. Add channel ids (preferred) or enable "
                "discovery."
            )

        malformed = [c for c in self.seed_channel_ids if not c.startswith("UC")]
        if malformed:
            problems.append(
                "seed_channel_ids must be channel ids beginning 'UC', not handles or usernames: "
                + ", ".join(malformed[:5])
            )

        if self.discovery_enabled and self.discovery_order in RANKED_ORDERS:
            problems.append(
                f"discovery.order='{self.discovery_order}' is a ranked order; the frame will not reproduce "
                f"on a re-run, where '{DEFAULT_DISCOVERY_ORDER}' will. Set it deliberately or leave it unset."
            )

        if self.ethics.collect_comments:
            problems.append(
                "ethics.collect_comments is true, but this adapter collects no comments under any setting "
                "(§8.4). Enabling it has no effect on YouTube."
            )

        try:
            if self.discovery_enabled and self.ledger.remaining(self.search_bucket()) <= 0:
                problems.append("the search bucket is spent for today; discovery cannot run until it resets")
            if self.ledger.remaining(self.units_bucket()) <= 0:
                problems.append("the 10,000-unit pool is spent for today; no enumeration can run until it resets")
        except Exception as exc:  # a doctor command must survive a broken ledger
            problems.append(f"quota ledger unreadable: {exc}")

        return problems

    def estimate(self, plan: HarvestPlan) -> dict:
        """Quota arithmetic for the `plan` command. Makes no network call."""
        queries = self.build_queries(plan)
        per_call = min(int(self.discovery_cfg.get("results_per_call", MAX_RESULTS_PER_PAGE)), MAX_RESULTS_PER_PAGE)
        max_search = int(self.discovery_cfg.get("max_search_calls", 0)) if self.discovery_enabled else 0
        search_calls = min(len(queries), max_search) if self.discovery_enabled else 0

        channels = len(self.seed_channel_ids)
        limit = plan.limit or 0
        playlist_pages = (limit + MAX_RESULTS_PER_PAGE - 1) // MAX_RESULTS_PER_PAGE if limit else None

        expected_videos = limit or search_calls * per_call
        hydrate_calls = (expected_videos + MAX_IDS_PER_CALL - 1) // MAX_IDS_PER_CALL if expected_videos else 0
        channel_calls = (channels + MAX_IDS_PER_CALL - 1) // MAX_IDS_PER_CALL if channels else 0

        return {
            "source": self.name,
            "frame": "seed-channels" if channels else ("discovery" if self.discovery_enabled else "none"),
            "queries": len(queries),
            "calls": {
                "search.list": search_calls,
                "playlistItems.list": playlist_pages if playlist_pages is not None else "unbounded",
                "videos.list": hydrate_calls,
                "channels.list": channel_calls + hydrate_calls,
            },
            "quota_units": {
                SEARCH_BUCKET: search_calls,
                UNITS_BUCKET: (
                    f"{hydrate_calls * 2 + channel_calls}"
                    + ("" if playlist_pages is None else f" + {playlist_pages}")
                ),
            },
            "remaining_today": {
                SEARCH_BUCKET: self.ledger.remaining(self.search_bucket()),
                UNITS_BUCKET: self.ledger.remaining(self.units_bucket()),
            },
        }

    # --- the search strategy ------------------------------------------

    def build_queries(self, plan: HarvestPlan) -> list[str]:
        """
        Expand the configured templates over the run's landscapes and taxa.

        `seed.query_templates` carries {landscape}, {biome} and {taxon_common};
        `seed.taxon_query_templates` carries {taxon_common} and
        {taxon_scientific}. An explicit `plan.queries` overrides both — a
        hand-written query is a declared sampling decision and this method does
        not second-guess it.

        Every query produced here is written to the run manifest, which is what
        makes the frame restatable in a methods section.
        """
        if plan.queries:
            return list(dict.fromkeys(q.strip() for q in plan.queries if q and q.strip()))

        seed = self.config.seed
        landscape_templates = list(seed.get("query_templates", []) or [])
        taxon_templates = list(seed.get("taxon_query_templates", []) or [])

        taxa = plan.taxa or []
        common_names = [self._common(t) for t in taxa]
        common_names = [n for n in dict.fromkeys(common_names) if n]

        queries: list[str] = []

        for landscape in plan.landscapes or []:
            name = str(landscape.get("name", "")).strip()
            biome = str(landscape.get("biome", "")).strip()
            if not name:
                continue
            for template in landscape_templates:
                if "{taxon_common}" in template:
                    # A taxon-crossed template needs a taxon. Without one it
                    # would collapse to a bare landscape query that another
                    # template already covers.
                    for common in common_names:
                        queries.append(self._fill(template, landscape=name, biome=biome, taxon_common=common))
                else:
                    queries.append(self._fill(template, landscape=name, biome=biome))

        for taxon in taxa:
            for template in taxon_templates:
                queries.append(
                    self._fill(
                        template,
                        taxon_common=self._common(taxon),
                        taxon_scientific=self._scientific(taxon),
                    )
                )

        cleaned = [re.sub(r"\s+", " ", q).strip() for q in queries]
        return list(dict.fromkeys(q for q in cleaned if q))

    @staticmethod
    def _common(taxon: dict) -> str:
        return str(taxon.get("vernacularName") or taxon.get("common") or "").strip()

    @staticmethod
    def _scientific(taxon: dict) -> str:
        return str(taxon.get("scientificName") or taxon.get("scientific") or "").strip()

    @staticmethod
    def _fill(template: str, **values: str) -> str:
        out = template
        for key, value in values.items():
            out = out.replace("{" + key + "}", value)
        # An unfilled placeholder would become a literal search term. Drop the
        # query rather than searching for the word "taxon_scientific".
        return "" if _PLACEHOLDER.search(out) else out

    # --- transport ----------------------------------------------------

    def _call(self, endpoint: str, params: dict, *, bucket_name: str) -> tuple[dict, object]:
        """
        One quota-accounted API call.

        The budget is checked before the request and spent only after it
        succeeds, so a transport failure does not consume a day's allowance and
        a crash mid-run leaves the ledger honest.
        """
        bucket = self.search_bucket() if bucket_name == SEARCH_BUCKET else self.units_bucket()
        self.ledger.check(bucket, 1)

        query = dict(params)
        query["key"] = self.cfg.require_credential()

        self.manifest.note_query(self.name, endpoint, params)

        payload, receipt = self.http.get(
            f"{self.base_url}/{endpoint}",
            source=self.name,
            rate_per_second=self.rate(),
            params=query,
            quota_units=1,
            quota_bucket=bucket_name,
        )
        self.ledger.spend(bucket, 1)
        self.manifest.count(f"youtube.{endpoint}.calls")
        return payload or {}, receipt

    def _paged(
        self, endpoint: str, params: dict, *, bucket_name: str, limit: int | None
    ) -> Iterator[tuple[dict, object]]:
        """Follow nextPageToken until the limit is met or the pages run out."""
        seen = 0
        token = ""
        while True:
            page_params = dict(params)
            if token:
                page_params["pageToken"] = token
            payload, receipt = self._call(endpoint, page_params, bucket_name=bucket_name)
            items = payload.get("items", []) or []
            for item in items:
                yield item, receipt
                seen += 1
                if limit and seen >= limit:
                    return
            token = payload.get("nextPageToken") or ""
            if not token or not items:
                return

    # --- frames -------------------------------------------------------

    def _ids_from_seed_channels(self, plan: HarvestPlan) -> Iterator[str]:
        """The preferred frame: every upload of every named channel, in order."""
        for channel_id in self.seed_channel_ids:
            playlist_id = uploads_playlist_id(channel_id)
            if not playlist_id:
                self.manifest.warn(f"youtube: '{channel_id}' is not a UC... channel id; skipped")
                self.manifest.exclude("youtube-bad-seed-channel-id")
                continue
            params = {
                "part": "contentDetails",
                "playlistId": playlist_id,
                "maxResults": MAX_RESULTS_PER_PAGE,
            }
            try:
                for item, _ in self._paged("playlistItems", params, bucket_name=UNITS_BUCKET, limit=plan.limit):
                    video_id = first_present(item, "contentDetails.videoId")
                    if video_id:
                        yield str(video_id)
            except TransportError as exc:
                # A private or deleted uploads playlist must not end the run.
                self.manifest.warn(f"youtube: uploads playlist {playlist_id} unreadable ({exc})")
                self.manifest.exclude("youtube-uploads-playlist-unreadable")

    def _ids_from_discovery(self, plan: HarvestPlan) -> Iterator[str]:
        """The capped frame: explicit queries against search.list."""
        queries = self.build_queries(plan)
        if not queries:
            self.manifest.warn("youtube: discovery is enabled but the plan produced no queries")
            return

        cfg = self.discovery_cfg
        max_calls = int(cfg.get("max_search_calls", 20))
        per_call = min(int(cfg.get("results_per_call", MAX_RESULTS_PER_PAGE)), MAX_RESULTS_PER_PAGE)
        order = self.discovery_order

        if order in RANKED_ORDERS:
            self.manifest.warn(
                f"youtube discovery used order='{order}'. The sampling frame is model-ranked and will not "
                "reproduce on a re-run; record this in the methods section."
            )

        region_codes = [str(r).strip() for r in (cfg.get("region_codes") or []) if str(r).strip()]
        spent = 0

        for query in queries:
            for region in region_codes or [""]:
                if spent >= max_calls:
                    self.manifest.warn(
                        f"youtube discovery stopped at its configured ceiling of {max_calls} search calls; "
                        f"{len(queries)} queries were planned. The frame is partial."
                    )
                    return

                params = {
                    "part": "id",
                    "type": "video",
                    "q": query,
                    "order": order,
                    "maxResults": per_call,
                    "safeSearch": "none",
                }
                published_after = plan.since or cfg.get("published_after")
                if published_after:
                    params["publishedAfter"] = published_after
                if plan.until:
                    params["publishedBefore"] = plan.until
                if cfg.get("relevance_language"):
                    params["relevanceLanguage"] = cfg["relevance_language"]
                if region:
                    params["regionCode"] = region

                try:
                    payload, _ = self._call("search", params, bucket_name=SEARCH_BUCKET)
                except QuotaExhausted:
                    # Not retryable and not this adapter's to absorb.
                    raise
                except TransportError as exc:
                    self.manifest.warn(f"youtube: search '{query}' failed ({exc})")
                    self.manifest.exclude("youtube-search-call-failed")
                    spent += 1
                    continue

                spent += 1
                for item in payload.get("items", []) or []:
                    video_id = first_present(item, "id.videoId")
                    if video_id:
                        yield str(video_id)

    # --- hydration ----------------------------------------------------

    def _hydrate_videos(self, video_ids: list[str]) -> Iterator[tuple[dict, object]]:
        for batch in batched(video_ids, MAX_IDS_PER_CALL):
            params = {
                "part": "snippet,contentDetails,status,statistics,topicDetails",
                "id": ",".join(batch),
                "maxResults": MAX_IDS_PER_CALL,
            }
            try:
                payload, receipt = self._call("videos", params, bucket_name=UNITS_BUCKET)
            except TransportError as exc:
                self.manifest.warn(f"youtube: videos.list failed for {len(batch)} ids ({exc})")
                self.manifest.exclude("youtube-hydration-call-failed", len(batch))
                continue

            items = payload.get("items", []) or []
            returned = {str(item.get("id")) for item in items}
            missing = len(set(batch) - returned)
            if missing:
                # Requested and not returned: private, deleted, or region-blocked
                # between listing and hydration. Counted, never silently dropped.
                self.manifest.exclude("youtube-video-unavailable-at-hydration", missing)
            for item in items:
                yield item, receipt

    def _resolve_channels(self, channel_ids: list[str]) -> dict:
        """
        Subscriber count and producer country per channel.

        `audience_size` exists so the shared ethics gate can apply §8.3. This
        adapter deliberately does not filter on it: one gate, applied in one
        place, across every source.
        """
        wanted = [c for c in dict.fromkeys(channel_ids) if c and c not in self._channel_cache]
        for batch in batched(wanted, MAX_IDS_PER_CALL):
            params = {"part": "snippet,statistics", "id": ",".join(batch), "maxResults": MAX_IDS_PER_CALL}
            try:
                payload, _ = self._call("channels", params, bucket_name=UNITS_BUCKET)
            except TransportError as exc:
                self.manifest.warn(f"youtube: channels.list failed for {len(batch)} ids ({exc})")
                continue
            for item in payload.get("items", []) or []:
                flat = flatten(item)
                hidden = str(flat.get("statistics.hiddenSubscriberCount", "")).lower() == "true"
                raw_count = flat.get("statistics.subscriberCount")
                try:
                    subscribers = None if hidden or raw_count in (None, "") else int(raw_count)
                except (TypeError, ValueError):
                    subscribers = None
                self._channel_cache[str(item.get("id", ""))] = {
                    "title": flat.get("snippet.title", ""),
                    "country": flat.get("snippet.country", ""),
                    "subscribers": subscribers,
                    "hidden_subscribers": hidden,
                }
        return self._channel_cache

    # --- harvest ------------------------------------------------------

    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        problems = self.preflight()
        # Advisory findings are reported by `doctor`; they do not block a run.
        blocking = [p for p in problems if "has no effect" not in p and "ranked order" not in p]
        if blocking:
            raise SourceError("youtube cannot run: " + "; ".join(blocking))

        if plan.dry_run:
            self.manifest.count("youtube.dry-run")
            return

        video_ids: list[str] = []
        seen: set[str] = set()

        def absorb(source: Iterable[str]) -> None:
            for vid in source:
                if vid in seen:
                    continue
                seen.add(vid)
                video_ids.append(vid)
                if plan.limit and len(video_ids) >= plan.limit:
                    return

        # The cheap, reproducible frame is exhausted before a search call is spent.
        absorb(self._ids_from_seed_channels(plan))
        if self.discovery_enabled and not (plan.limit and len(video_ids) >= plan.limit):
            absorb(self._ids_from_discovery(plan))

        if plan.limit:
            video_ids = video_ids[: plan.limit]

        self.manifest.count("youtube.video-ids-listed", len(video_ids))
        if not video_ids:
            return

        hydrated = list(self._hydrate_videos(video_ids))
        channel_ids = [str(first_present(video, "snippet.channelId")) for video, _ in hydrated]
        channels = self._resolve_channels([c for c in channel_ids if c])

        for video, receipt in hydrated:
            record = self._to_record(video, receipt, channels)
            if record is not None:
                self.manifest.count("youtube.records")
                yield record

    # --- projection ---------------------------------------------------

    def _to_record(self, video: dict, receipt, channels: dict) -> HarvestRecord | None:
        flat = flatten(video)
        kept, dropped = self.minimise(flat)

        video_id = str(video.get("id") or "")
        if not video_id:
            self.manifest.exclude("youtube-video-without-id")
            return None

        unresolved: list[Unresolved] = []
        channel_id = str(flat.get("snippet.channelId", ""))
        channel = channels.get(channel_id, {})

        row = schema.blank_corpus_row()

        # --- §1.1 core metadata: the only columns a machine may fill ---
        title = str(flat.get("snippet.title", "")).strip()
        row["title"] = title
        row["slug"] = slugify(title)
        row["creator"] = str(flat.get("snippet.channelTitle", "") or channel.get("title", "")).strip()
        row["platform_primary"] = "youtube"
        row["format"] = "video"
        row["url_primary"] = WATCH_URL.format(video_id=video_id)
        row["date_published"] = str(flat.get("snippet.publishedAt", ""))
        row["date_captured"] = today_iso()
        row["archive_status"] = "metadata-only"
        row["coding_status"] = "candidate"
        row["corpus_version_added"] = str(self.config.corpus.get("corpus_version", ""))
        row["coder_id"] = str(self.config.corpus.get("coder_id", ""))
        row["schema_version_at_coding"] = str(self.config.corpus.get("schema_version", ""))
        row["vocab_version_at_coding"] = str(self.config.corpus.get("vocab_version", ""))

        # producer_country comes from the channel, the only place YouTube
        # declares one. Many channels leave it unset.
        country = str(channel.get("country", "")).strip()
        if country:
            row["producer_country"] = country
        else:
            unresolved.append(
                Unresolved(
                    field="producer_country",
                    reason="channel-country-not-declared",
                    attempted=f"channels.list snippet.country for {channel_id}",
                )
            )

        seconds = parse_duration(str(flat.get("contentDetails.duration", "")))
        live = str(flat.get("snippet.liveBroadcastContent", "none"))
        if seconds:
            row["duration_or_length"] = str(seconds)
        else:
            unresolved.append(
                Unresolved(
                    field="duration_or_length",
                    reason="live-or-zero-duration" if live != "none" else "duration-unparseable",
                    attempted=str(flat.get("contentDetails.duration", "")),
                )
            )

        # Declared languages only. An undeclared language is not inferred from
        # the title, which would be a guess dressed as data.
        languages = [
            str(flat.get("snippet.defaultLanguage", "")).strip(),
            str(flat.get("snippet.defaultAudioLanguage", "")).strip(),
        ]
        languages = [lang for lang in dict.fromkeys(languages) if lang]
        if languages:
            row["languages"] = schema.join_list(languages)
        else:
            unresolved.append(
                Unresolved(
                    field="languages",
                    reason="not-declared-by-uploader",
                    attempted="snippet.defaultLanguage, snippet.defaultAudioLanguage",
                )
            )

        privacy = str(flat.get("status.privacyStatus", "")).strip()
        restricted = flat.get("contentDetails.regionRestriction.blocked") or flat.get(
            "contentDetails.regionRestriction.allowed"
        )
        if privacy == "private":
            row["access_state_at_capture"] = "private"
        elif restricted:
            row["access_state_at_capture"] = "geo-restricted"
        elif privacy == "public":
            row["access_state_at_capture"] = "open"
        else:
            unresolved.append(
                Unresolved(
                    field="access_state_at_capture",
                    reason=f"privacy-status-{privacy or 'absent'}-has-no-vocabulary-term",
                    attempted="status.privacyStatus",
                )
            )

        licence = str(flat.get("status.license", "")).strip()
        if licence in LICENSE_TEXT:
            row["license_or_rights"] = LICENSE_TEXT[licence]
        else:
            unresolved.append(
                Unresolved(
                    field="license_or_rights",
                    reason="license-not-declared",
                    attempted="status.license",
                )
            )

        # §1.4 geography. HARVEST_OWNED permits these columns, but YouTube
        # declares only where a video was *produced*, never where its biological
        # subject occurs. Seeding subject_country from the query that found the
        # video would be a guess, so the cells stay empty and the gap is named.
        unresolved.append(
            Unresolved(
                field="subject_country/subject_region",
                reason="not-declared-in-platform-metadata",
                attempted="requires a coder to watch the artefact (corpus-seed-framework §1.4)",
            )
        )

        subscribers = channel.get("subscribers")
        if subscribers is None:
            unresolved.append(
                Unresolved(
                    field="audience_size",
                    reason="subscriber-count-hidden" if channel.get("hidden_subscribers") else "channel-not-resolved",
                    attempted=f"channels.list statistics.subscriberCount for {channel_id}",
                )
            )

        # --- provenance -------------------------------------------------
        row["harvest_source"] = self.name
        row["harvest_external_id"] = video_id
        row["harvest_run_id"] = getattr(self.manifest, "run_id", "")
        row["harvest_receipt_id"] = getattr(receipt, "receipt_id", "")
        row["harvest_retrieved_at"] = getattr(receipt, "retrieved_at", "")
        row["harvest_payload_sha256"] = getattr(receipt, "payload_sha256", "")
        row["harvest_unresolved"] = schema.join_list(item.as_token() for item in unresolved)

        # `artefact_id` and `notes_path` are deliberately left empty: the
        # allocator is not in this adapter's constructor, and coding-workspace-spec
        # §14 requires ids to be minted once, centrally, at candidate -> included.
        # The harvester stamps them and then calls schema.validate_row.

        self.manifest.note_unresolved(unresolved)

        return HarvestRecord(
            source=self.name,
            external_id=video_id,
            payload=kept,
            corpus_row=row,
            species_rows=[],
            receipt=receipt,
            unresolved=unresolved,
            audience_size=subscribers,
            dropped_fields=dropped,
        )
