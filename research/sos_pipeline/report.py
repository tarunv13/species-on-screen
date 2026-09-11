"""
The sampling-frame report.

`corpus-seed-framework.md` §9 requires the corpus to acknowledge the biases it
inherits and produces; §4 requires the sampling frame to be named; §11.1 sets
quota floors — at least 30% non-Anglophone production, at least 20% Global
South subjects, at minimum English plus three other languages.

This module measures the corpus against those numbers and writes the result
beside the run manifest. It reports shortfalls plainly and does not grade them:
the framework asks for documented bias, not for a score, and the Observatory's
own posture is that a metric becomes the thing optimised.

Nothing here is a dashboard. It is read at monthly synthesis, per
`coding-workspace-spec.md` §8.
"""

from __future__ import annotations

from collections import Counter
from pathlib import Path

from .provenance import utc_now
from .schema import split_list

ANGLOPHONE = {"en"}

QUOTA_NOTES = {
    "non_anglophone_share": (0.30, "corpus-seed-framework §11.1: quota floor of 30% non-Anglophone production"),
    "global_south_share": (0.20, "corpus-seed-framework §11.1: at minimum 20% Global South subjects"),
    "distinct_languages": (4, "corpus-seed-framework §11.1: at minimum English plus three others"),
}


def measure(rows: list[dict]) -> dict:
    """Distributional summary of the corpus as it stands."""
    total = len(rows)
    if not total:
        return {"artefact_count": 0}

    platforms = Counter(row.get("platform_primary", "") or "unrecorded" for row in rows)
    formats = Counter(row.get("format", "") or "unrecorded" for row in rows)
    statuses = Counter(row.get("coding_status", "") or "unrecorded" for row in rows)
    sources = Counter(row.get("harvest_source", "") or "hand-entered" for row in rows)
    producers = Counter(row.get("producer_country", "") or "unrecorded" for row in rows)
    classifications = Counter(row.get("subject_global_classification", "") or "unrecorded" for row in rows)

    languages: Counter = Counter()
    anglophone_only = 0
    language_known = 0
    for row in rows:
        codes = split_list(row.get("languages", ""))
        if not codes:
            continue
        language_known += 1
        languages.update(codes)
        if set(codes) <= ANGLOPHONE:
            anglophone_only += 1

    archived = sum(1 for row in rows if row.get("wayback_url") or row.get("archive_status") == "wayback-archived")
    unresolved = Counter()
    for row in rows:
        for token in split_list(row.get("harvest_unresolved", "")):
            unresolved[token] += 1

    global_south = classifications.get("global-south", 0)
    classification_known = sum(count for key, count in classifications.items() if key != "unrecorded")

    return {
        "artefact_count": total,
        "by_platform": dict(platforms.most_common()),
        "by_format": dict(formats.most_common()),
        "by_coding_status": dict(statuses.most_common()),
        "by_harvest_source": dict(sources.most_common()),
        "by_producer_country": dict(producers.most_common(20)),
        "by_global_classification": dict(classifications.most_common()),
        "languages": dict(languages.most_common()),
        "distinct_languages": len(languages),
        "language_declared_for": language_known,
        "anglophone_only": anglophone_only,
        "non_anglophone_share": round(1 - (anglophone_only / language_known), 3) if language_known else None,
        "global_south_share": round(global_south / classification_known, 3) if classification_known else None,
        "archived": archived,
        "archive_gap": total - archived,
        "unresolved_fields": dict(unresolved.most_common(25)),
    }


def check_quotas(measurements: dict) -> list[dict]:
    """Compare the corpus against the §11.1 floors. Reports, does not grade."""
    findings = []
    for key, (floor, note) in QUOTA_NOTES.items():
        value = measurements.get(key)
        if value is None:
            findings.append({"quota": key, "status": "not measurable yet", "floor": floor, "note": note})
            continue
        findings.append(
            {
                "quota": key,
                "value": value,
                "floor": floor,
                "status": "met" if value >= floor else "below floor",
                "note": note,
            }
        )
    return findings


def render_markdown(manifest, measurements: dict, findings: list[dict], frame: dict, extras: dict) -> str:
    """The written report. Prose, because this is read by a person once a month."""
    lines: list[str] = []
    add = lines.append

    add(f"# Sampling frame and bias report — run {manifest.run_id}")
    add("")
    add(f"Generated {utc_now()}. Configuration `{manifest.config_sha256[:12]}`, repository `{manifest.git_commit[:12]}`.")
    add("")
    add("Authority: `corpus-seed-framework.md` §4 (sampling frame), §9 (bias risks), §11.1 (quota floors).")
    add("This report documents the corpus as it stands. It is not a score, and nothing here is optimised against.")
    add("")

    add("## The frame")
    add("")
    add(f"- Landscapes in frame: **{frame.get('landscape_count', 0)}**")
    add(f"- Taxa in frame: **{frame.get('taxon_count', 0)}**")
    add(f"- Queries expanded: **{frame.get('query_count', 0)}**")
    if frame.get("regions"):
        add("- Regions: " + ", ".join(f"{k} ({v})" for k, v in frame["regions"].items()))
    add("")

    add("## The corpus")
    add("")
    total = measurements.get("artefact_count", 0)
    if not total:
        add("No artefacts yet. Every measurement below waits on a first harvest.")
        add("")
    else:
        add(f"- Artefacts: **{total}**")
        add(f"- Distinct languages declared: **{measurements.get('distinct_languages', 0)}**")
        add(f"- Archived at capture: **{measurements.get('archived', 0)}** "
            f"(gap: {measurements.get('archive_gap', 0)})")
        add("")
        add("| Distribution | Values |")
        add("|---|---|")
        for label, key in (
            ("Platform", "by_platform"),
            ("Format", "by_format"),
            ("Coding status", "by_coding_status"),
            ("Harvest source", "by_harvest_source"),
            ("Global classification", "by_global_classification"),
        ):
            values = measurements.get(key) or {}
            rendered = ", ".join(f"{k} ({v})" for k, v in values.items()) or "—"
            add(f"| {label} | {rendered} |")
        add("")

    add("## Quota floors")
    add("")
    add("| Quota | Value | Floor | Status |")
    add("|---|---|---|---|")
    for finding in findings:
        value = finding.get("value", "—")
        add(f"| {finding['quota']} | {value} | {finding['floor']} | {finding['status']} |")
    add("")
    for finding in findings:
        if finding["status"] == "below floor":
            add(f"- **{finding['quota']} is below the floor.** {finding['note']}")
    add("")

    add("## Known biases in this frame")
    add("")
    add("- **Anglophone bias (§9.1).** Query templates are English; a non-Anglophone artefact is reachable "
        "only where its metadata carries English text. The non-Anglophone share above measures the result, "
        "not the cause.")
    add("- **Mainstream-platform bias (§9.2).** The frame reaches the platforms with research APIs. "
        "Platforms without one are absent from the corpus and absent from this report, which is the more "
        "dangerous of the two absences.")
    add("- **Search-discoverability bias (§9.3).** Anything found by query is found on the platform's terms. "
        "Seed-channel enumeration is the partial mitigation and is the configured default for YouTube.")
    add("- **Producer-visibility bias (§9.6).** The consent gate excludes creators below the audience "
        "threshold, which systematically removes small creators from the corpus. This is an ethical choice "
        "(§8.3) with a methodological cost, and both are real.")
    add("")

    if extras.get("exclusions"):
        add("## What was excluded, and why")
        add("")
        add("| Reason | Count |")
        add("|---|---|")
        for reason, count in sorted(extras["exclusions"].items(), key=lambda kv: -kv[1]):
            add(f"| {reason} | {count} |")
        add("")

    unresolved = measurements.get("unresolved_fields") or {}
    if unresolved:
        add("## Unresolved fields")
        add("")
        add("Values the pipeline could not attest. They are written empty, never guessed.")
        add("")
        add("| Field and reason | Count |")
        add("|---|---|")
        for token, count in unresolved.items():
            add(f"| `{token}` | {count} |")
        add("")

    if manifest.warnings:
        add("## Warnings raised during the run")
        add("")
        for warning in manifest.warnings:
            add(f"- {warning}")
        add("")

    add("## Quota spent")
    add("")
    if manifest.quota_spent:
        add("| Bucket | Units |")
        add("|---|---|")
        for bucket, units in manifest.quota_spent.items():
            add(f"| `{bucket}` | {units} |")
    else:
        add("No metered quota was spent in this run.")
    add("")

    return "\n".join(lines) + "\n"


def write(config, manifest, rows: list[dict], frame: dict, extras: dict | None = None) -> Path:
    measurements = measure(rows)
    findings = check_quotas(measurements)
    text = render_markdown(manifest, measurements, findings, frame, extras or {})
    target = manifest.directory(config) / "sampling-frame.md"
    target.write_text(text, encoding="utf-8")
    return target
