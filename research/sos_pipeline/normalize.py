"""
Normalisation shared by every media adapter.

Dates to ISO 8601, durations to seconds, languages to ISO 639-1, countries to
ISO 3166-1 alpha-2, and the two geography fields of §1.4 kept separate because
their mismatch is the research variable.

Where a value cannot be normalised it comes back empty with an `Unresolved`
beside it. Nothing here infers: a language tag that is not a language tag stays
unresolved rather than becoming "en".
"""

from __future__ import annotations

import re
from datetime import datetime, timezone

from .provenance import Unresolved

ISO_DURATION = re.compile(
    r"^P(?:(?P<days>\d+)D)?T?(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?$"
)

# Regions as the landscape registry writes them (scripts/ingest/landscapes.json),
# mapped to the §1.4 vocabulary. The registry is the authority for the region
# names; this table only classifies them.
REGION_TO_GLOBAL_CLASS = {
    "South Asia": "global-south",
    "Southeast Asia": "global-south",
    "East Africa": "global-south",
    "Central Africa": "global-south",
    "Southern Africa": "global-south",
    "Africa (island)": "global-south",
    "South America": "global-south",
    "North America": "global-north",
    "Europe": "global-north",
    "Oceania": "global-north",
    "Arctic": "polar",
    "Antarctica": "polar",
}

# Operational rule for producer countries, applied only when the region is not
# available. §1.4 is explicit that this classification is imperfect and
# politically contested; it is kept coarse deliberately and anything outside
# the list resolves to "ambiguous" rather than to a guess.
GLOBAL_NORTH_COUNTRIES = {
    "AT", "AU", "BE", "CA", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR",
    "HR", "HU", "IE", "IS", "IL", "IT", "JP", "KR", "LT", "LU", "LV", "MT", "NL", "NO", "NZ",
    "PL", "PT", "RO", "SE", "SG", "SI", "SK", "US",
}
POLAR_COUNTRIES = {"AQ"}


def iso_date(value: str | None) -> str:
    """Normalise a date-ish string to ISO 8601. Returns empty when it cannot be read."""
    if not value:
        return ""
    text = str(value).strip()
    for pattern in ("%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d", "%d %b %Y", "%Y"):
        try:
            parsed = datetime.strptime(text.replace("Z", "+0000") if pattern.endswith("%z") else text, pattern)
        except ValueError:
            continue
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.date().isoformat() if pattern != "%Y" else f"{parsed.year:04d}"
    match = re.match(r"^(\d{4})-(\d{2})-(\d{2})", text)
    return match.group(0) if match else ""


def duration_seconds(value: str | int | None) -> tuple[str, list[Unresolved]]:
    """
    Normalise a duration to whole seconds as a string.

    Accepts the ISO 8601 form YouTube returns (`PT14M3S`), a plain integer of
    seconds, and the `H:MM:SS` form some registries use.
    """
    if value in (None, "", 0):
        return "", []
    if isinstance(value, (int, float)):
        return str(int(value)), []

    text = str(value).strip()
    if text.isdigit():
        return text, []

    match = ISO_DURATION.match(text)
    if match and any(match.groupdict().values()):
        parts = {k: int(v) if v else 0 for k, v in match.groupdict().items()}
        total = parts["days"] * 86400 + parts["hours"] * 3600 + parts["minutes"] * 60 + parts["seconds"]
        return str(total), []

    clock = re.match(r"^(?:(\d+):)?(\d{1,2}):(\d{2})$", text)
    if clock:
        hours = int(clock.group(1) or 0)
        return str(hours * 3600 + int(clock.group(2)) * 60 + int(clock.group(3))), []

    minutes = re.match(r"^(\d+)\s*min", text, re.IGNORECASE)
    if minutes:
        return str(int(minutes.group(1)) * 60), []

    return "", [Unresolved(field="duration_or_length", reason="unparseable-duration", attempted=text)]


def language_code(value: str | None) -> str:
    """
    Reduce a BCP 47 language tag to its primary subtag: `en-GB` -> `en`.

    Two- and three-letter primaries are both accepted. Three letters matter: a
    language with no ISO 639-1 code has only its 639-3 code, and those are
    disproportionately the Indigenous and minority languages this corpus is
    least able to afford to drop (§7.4, §9.1).

    The whole tag is shape-checked before the primary is taken, because taking
    the primary first turns any hyphenated string into a plausible code —
    "not-a-language" would yield "not", which is both wrong and believable. A
    tag carrying a single-letter subtag is not a language tag, and is refused.

    Shape only. This does not verify membership in the ISO register; a
    well-formed tag for a language that does not exist passes through, and the
    corpus records it as declared by the source.
    """
    if not value:
        return ""
    subtags = re.split(r"[-_]", str(value).strip())
    if not re.fullmatch(r"[A-Za-z]{2,3}", subtags[0]):
        return ""
    if any(not re.fullmatch(r"[A-Za-z0-9]{2,8}", subtag) for subtag in subtags[1:]):
        return ""
    return subtags[0].lower()


def country_code(value: str | None) -> str:
    """ISO 3166-1 alpha-2, uppercased. Longer names are not guessed at."""
    if not value:
        return ""
    text = str(value).strip().upper()
    return text if re.fullmatch(r"[A-Z]{2}", text) else ""


def global_classification(region: str = "", countries: list[str] | None = None) -> str:
    """
    §1.4 `subject_global_classification`.

    Region first, because the landscape registry states it; country list as a
    fallback; `transboundary` when subjects span classifications; `ambiguous`
    when the rule does not decide. Never blank-guessed to a hemisphere.
    """
    if region and region in REGION_TO_GLOBAL_CLASS:
        return REGION_TO_GLOBAL_CLASS[region]

    codes = [country_code(c) for c in (countries or [])]
    codes = [c for c in codes if c]
    if not codes:
        return "ambiguous"
    if any(c in POLAR_COUNTRIES for c in codes):
        return "polar"
    classes = {"global-north" if c in GLOBAL_NORTH_COUNTRIES else "global-south" for c in codes}
    if len(classes) > 1:
        return "transboundary"
    return classes.pop()


def mismatch_flag(producer_country: str, subject_countries: list[str] | None) -> str:
    """
    §1.4 `mismatch_flag`: true where the producer country is not among the
    subject countries. Left empty when either side is unknown, because an
    unknown producer is not evidence of a match.
    """
    producer = country_code(producer_country)
    subjects = [country_code(c) for c in (subject_countries or [])]
    subjects = [c for c in subjects if c]
    if not producer or not subjects:
        return ""
    return "FALSE" if producer in subjects else "TRUE"


def access_state(*, is_public: bool = True, requires_login: bool = False, paywalled: bool = False,
                 geo_blocked: bool = False, removed: bool = False, archived: bool = False) -> str:
    """Map a source's access signals onto the §1.1 vocabulary in priority order."""
    if removed:
        return "removed-but-archived" if archived else "private"
    if not is_public:
        return "private"
    if paywalled:
        return "paywalled"
    if requires_login:
        return "login-required"
    if geo_blocked:
        return "geo-restricted"
    return "open"


def clean_text(value: str | None, limit: int = 500) -> str:
    """Collapse whitespace and bound the length. Titles are data, not prose."""
    if not value:
        return ""
    collapsed = re.sub(r"\s+", " ", str(value)).strip()
    return collapsed if len(collapsed) <= limit else collapsed[: limit - 1] + "…"


def licence_or_rights(declared: str | None) -> str:
    """
    §1.1 `license_or_rights`.

    A source that declares a licence gets it verbatim. A source that declares
    nothing gets "all rights reserved", which is what the framework specifies
    for the unstated case, not an empty cell.
    """
    text = (declared or "").strip()
    return text if text else "all rights reserved"
