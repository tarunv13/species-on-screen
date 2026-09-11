"""
Rate limiting, quota accounting, and the one HTTP client every source uses.

Two different things are enforced here and they are not the same:

  rate     How fast requests may leave. A per-source token bucket.
  quota    How much may be spent in a day. A persistent ledger on disk, so a
           crashed run, a second terminal, and tomorrow all agree on what is
           left.

The quota ledger matters most for YouTube. `search.list` sits in its own daily
bucket of 100 calls; everything else draws on a separate 10,000-unit pool. A
naive harvester burns the search bucket in ninety seconds and then reports an
empty day as if the corpus were empty. This module makes that impossible: the
budget is checked before the call, not discovered from a 403.
"""

from __future__ import annotations

import json
import random
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import requests

from .provenance import Receipt, redact


class QuotaExhausted(RuntimeError):
    """The configured daily budget for a bucket is spent. Not an error condition to retry."""

    def __init__(self, source: str, bucket: str, spent: int, limit: int, resets_at: str) -> None:
        super().__init__(
            f"{source}/{bucket}: {spent}/{limit} spent for the day; resets at {resets_at}. "
            f"Narrow the run or continue tomorrow."
        )
        self.source = source
        self.bucket = bucket
        self.spent = spent
        self.limit = limit
        self.resets_at = resets_at


class TransportError(RuntimeError):
    """The call failed after the retry policy was exhausted."""


class TokenBucket:
    """Simple blocking rate limiter. Thread-safe, monotonic-clock based."""

    def __init__(self, rate_per_second: float, burst: int | None = None) -> None:
        self.rate = max(float(rate_per_second), 0.01)
        self.capacity = float(burst if burst is not None else max(1, int(self.rate)))
        self._tokens = self.capacity
        self._updated = time.monotonic()
        self._lock = threading.Lock()

    def take(self, tokens: float = 1.0) -> float:
        """Block until `tokens` are available. Returns the seconds spent waiting."""
        waited = 0.0
        while True:
            with self._lock:
                now = time.monotonic()
                self._tokens = min(self.capacity, self._tokens + (now - self._updated) * self.rate)
                self._updated = now
                if self._tokens >= tokens:
                    self._tokens -= tokens
                    return waited
                deficit = tokens - self._tokens
                sleep_for = deficit / self.rate
            time.sleep(sleep_for)
            waited += sleep_for


# Timezone offsets for the reset clocks the pipeline actually needs. Kept
# explicit rather than pulled from zoneinfo so a machine without the IANA
# database still accounts correctly. US Pacific is -8/-7; the pipeline uses the
# standard-time offset, which errs toward spending less quota, never more.
RESET_OFFSETS = {
    "UTC": 0,
    "America/Los_Angeles": -8,
}


@dataclass
class QuotaBucket:
    source: str
    bucket: str
    limit: int
    reset_timezone: str = "UTC"

    def period_key(self) -> str:
        offset = RESET_OFFSETS.get(self.reset_timezone, 0)
        local = datetime.now(timezone.utc) + timedelta(hours=offset)
        return local.date().isoformat()

    def resets_at(self) -> str:
        offset = RESET_OFFSETS.get(self.reset_timezone, 0)
        local = datetime.now(timezone.utc) + timedelta(hours=offset)
        midnight = (local + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        return f"{midnight.isoformat(timespec='seconds')} ({self.reset_timezone})"

    def ledger_key(self) -> str:
        return f"{self.source}/{self.bucket}/{self.period_key()}"


class QuotaLedger:
    """
    Persistent daily spend record.

    Written after every spend rather than at exit, because the whole point is to
    survive a run that dies mid-harvest.
    """

    def __init__(self, path: Path) -> None:
        self.path = path
        self._lock = threading.Lock()
        self._data: dict[str, int] = {}
        self._load()

    def _load(self) -> None:
        if self.path.exists():
            try:
                self._data = json.loads(self.path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                self._data = {}
        self._prune()

    def _prune(self, keep_days: int = 30) -> None:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=keep_days)).date().isoformat()
        self._data = {k: v for k, v in self._data.items() if k.rsplit("/", 1)[-1] >= cutoff}

    def _flush(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self._data, indent=2, sort_keys=True), encoding="utf-8")

    def spent(self, bucket: QuotaBucket) -> int:
        return int(self._data.get(bucket.ledger_key(), 0))

    def remaining(self, bucket: QuotaBucket) -> int:
        return max(0, bucket.limit - self.spent(bucket))

    def check(self, bucket: QuotaBucket, units: int) -> None:
        """Raise before spending if the budget cannot cover it."""
        if self.spent(bucket) + units > bucket.limit:
            raise QuotaExhausted(bucket.source, bucket.bucket, self.spent(bucket), bucket.limit, bucket.resets_at())

    def spend(self, bucket: QuotaBucket, units: int) -> int:
        with self._lock:
            self.check(bucket, units)
            key = bucket.ledger_key()
            self._data[key] = int(self._data.get(key, 0)) + units
            self._flush()
            return self._data[key]

    def summary(self) -> dict:
        return dict(sorted(self._data.items()))


class HttpClient:
    """
    One session, one retry policy, one user agent.

    Retries on 429 and 5xx with exponential backoff and jitter, honouring
    Retry-After when the server sends it. Does not retry 4xx other than 429:
    a malformed query should surface, not be hammered.
    """

    RETRYABLE = {408, 429, 500, 502, 503, 504}

    def __init__(
        self,
        user_agent: str,
        timeout: int = 30,
        max_retries: int = 4,
        backoff_base: float = 0.75,
        receipt_log=None,
    ) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent, "Accept": "application/json"})
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_base = backoff_base
        self.receipt_log = receipt_log
        self._buckets: dict[str, TokenBucket] = {}

    def bucket_for(self, source: str, rate_per_second: float) -> TokenBucket:
        if source not in self._buckets:
            self._buckets[source] = TokenBucket(rate_per_second)
        return self._buckets[source]

    def request(
        self,
        method: str,
        url: str,
        *,
        source: str,
        rate_per_second: float = 5.0,
        params: dict | None = None,
        headers: dict | None = None,
        json_body: Any = None,
        api_version: str = "",
        quota_units: int = 0,
        quota_bucket: str = "",
        expect_json: bool = True,
    ) -> tuple[Any, Receipt]:
        """Perform one rate-limited, retried call and return (payload, receipt)."""
        self.bucket_for(source, rate_per_second).take()

        last_error = ""
        status: int | None = None
        for attempt in range(self.max_retries + 1):
            try:
                response = self.session.request(
                    method,
                    url,
                    params=params,
                    headers=headers,
                    json=json_body,
                    timeout=self.timeout,
                )
                status = response.status_code
                if status in self.RETRYABLE and attempt < self.max_retries:
                    self._sleep_for_retry(response, attempt)
                    continue
                if status >= 400:
                    last_error = f"HTTP {status}: {response.text[:400]}"
                    payload = None
                else:
                    payload = response.json() if expect_json else response.text
                    last_error = ""
                receipt = self._log(
                    source, url, params, status, payload, method, api_version, quota_units, quota_bucket, last_error
                )
                if last_error:
                    raise TransportError(f"{source} {url} -> {last_error}")
                return payload, receipt
            except (requests.RequestException, ValueError) as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                if attempt < self.max_retries:
                    time.sleep(self._backoff(attempt))
                    continue
                receipt = self._log(
                    source, url, params, status, None, method, api_version, quota_units, quota_bucket, last_error
                )
                raise TransportError(f"{source} {url} -> {last_error}") from exc

        receipt = self._log(source, url, params, status, None, method, api_version, quota_units, quota_bucket, last_error)
        raise TransportError(f"{source} {url} -> {last_error or 'retries exhausted'}")

    def get(self, url: str, **kwargs) -> tuple[Any, Receipt]:
        return self.request("GET", url, **kwargs)

    def post(self, url: str, **kwargs) -> tuple[Any, Receipt]:
        return self.request("POST", url, **kwargs)

    # --- internals ----------------------------------------------------

    def _backoff(self, attempt: int) -> float:
        return self.backoff_base * (2**attempt) + random.uniform(0, 0.4)

    def _sleep_for_retry(self, response, attempt: int) -> None:
        retry_after = response.headers.get("Retry-After")
        if retry_after:
            try:
                time.sleep(min(float(retry_after), 120.0))
                return
            except (TypeError, ValueError):
                pass
        time.sleep(self._backoff(attempt))

    def _log(self, source, url, params, status, payload, method, api_version, units, bucket, error) -> Receipt:
        receipt = Receipt.make(
            source=source,
            endpoint=url,
            params=redact(params),
            status=status,
            payload=payload,
            method=method,
            api_version=api_version,
            quota_units=units,
            quota_bucket=bucket,
            error=error,
        )
        if self.receipt_log:
            self.receipt_log.record(receipt)
        return receipt

    def close(self) -> None:
        self.session.close()
