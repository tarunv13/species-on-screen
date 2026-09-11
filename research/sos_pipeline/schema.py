"""
The corpus schema, flattened to columns.

Authority: `.agents/tasks/task-research-matrix/corpus-seed-framework.md` §1 for
the schema; `.agents/tasks/task-pilot-execution/coding-workspace-spec.md` §3 for
the flattening rules and §3.2 for the audit columns. Field names are preserved
verbatim from the framework, as §3 requires.

One collision the framework did not resolve
-------------------------------------------
`coding_notes` is specified twice, once under §1.5 (narrative techniques) and
once under §1.9 (spectacle/understanding balance). A flat table cannot carry
two columns of the same name. This module disambiguates them as
`coding_notes_techniques` and `coding_notes_balance` and records the choice as
an amendment candidate rather than making it silently: see
AMENDMENT_CANDIDATES below. Nothing else is renamed.

The harvest boundary
--------------------
`HARVEST_OWNED` names the only columns a machine may write. Everything in
`CODER_OWNED` is left empty for a human, per coding-workspace-spec §17, which
holds the coding workflow manual for the duration of the pilot. `validate_row`
enforces this, and a test asserts it.
"""

from __future__ import annotations

from typing import Iterable

SCHEMA_SOURCE = ".agents/tasks/task-research-matrix/corpus-seed-framework.md §1"
FLATTENING_SOURCE = ".agents/tasks/task-pilot-execution/coding-workspace-spec.md §3"

AMENDMENT_CANDIDATES = [
    {
        "scope": "schema",
        "field": "coding_notes",
        "observation": (
            "Specified under both §1.5 and §1.9. A flat corpus table cannot hold two "
            "columns of the same name."
        ),
        "provisional_decision": "Split to coding_notes_techniques and coding_notes_balance.",
        "raised_by": "research pipeline, schema.py",
    }
]

# --- §1.1 Core metadata -------------------------------------------------

CORE_METADATA_COLUMNS = [
    "artefact_id",
    "slug",
    "title",
    "creator",
    "producer_country",
    "platform_primary",
    "platform_others",
    "url_primary",
    "url_archive",
    "date_published",
    "date_captured",
    "duration_or_length",
    "format",
    "languages",
    "access_state_at_capture",
    "license_or_rights",
    "archive_status",
    "corpus_version_added",
    "corpus_version_last_recoded",
    "coder_id",
]

# --- §1.3 Ecosystem represented ----------------------------------------

ECOSYSTEM_COLUMNS = [
    "biome_primary",
    "biome_others",
    "habitat_specific",
    "representation_state",
    "notable_absences",
    "human_presence_in_frame",
]

# --- §1.4 Geographic region --------------------------------------------

GEOGRAPHY_COLUMNS = [
    "subject_country",
    "subject_region",
    "subject_global_classification",
    "specific_locations_named",
    "mismatch_flag",
]

# --- §1.5 Narrative techniques -----------------------------------------

NARRATIVE_COLUMNS = [
    "techniques_present",
    "techniques_dominant",
    "intensity_per_technique",
    "coding_notes_techniques",
]

# --- §1.6 Emotional framing --------------------------------------------

EMOTION_COLUMNS = [
    "dominant_register",
    "secondary_registers",
    "valence",
    "arousal",
    "intended_target",
]

# --- §1.7 Conservation framing -----------------------------------------

CONSERVATION_COLUMNS = [
    "framing_mode",
    "threat_visibility",
    "agency_attribution",
    "solution_framing",
    "complicity_framing",
    "named_threats",
    "named_solutions",
]

# --- §1.8 Audience relationship type -----------------------------------

AUDIENCE_COLUMNS = [
    "form_classification",
    "spectator_position",
    "parasocial_potential",
    "access_model",
    "expected_session_length",
]

# --- §1.9 Spectacle vs understanding -----------------------------------

BALANCE_COLUMNS = [
    "spectacle_intensity",
    "structural_content",
    "balance_classification",
    "coding_notes_balance",
]

# --- §1.10 Interaction type --------------------------------------------

INTERACTION_COLUMNS = [
    "interaction_mode",
    "agency_level",
    "repetition_potential",
    "social_dimension",
]

# --- §1.11 Behavioural-change claims -----------------------------------

BEHAVIOUR_COLUMNS = [
    "claims_made",
    "claim_specificity",
    "evidence_offered",
    "evidence_independence",
    "effect_durability_claimed",
    "counter_evidence_known",
    # four_construct_classification, flattened to eight per workspace-spec §3.1
    "claim_awareness",
    "evid_awareness",
    "claim_emotional",
    "evid_emotional",
    "claim_understanding",
    "evid_understanding",
    "claim_behavioural",
    "evid_behavioural",
]

# --- §1.12 Research usefulness -----------------------------------------

USEFULNESS_COLUMNS = [
    "research_questions_supported",
    "methodological_fit",
    "corpus_role",
    "limitations",
    "linked_artefacts",
    "citation_form",
]

# --- workspace-spec §3.2 pilot audit columns ---------------------------

AUDIT_COLUMNS = [
    "coding_status",
    "confidence_overall",
    "ambiguity_count",
    "notes_path",
    "zotero_key",
    "wayback_url",
    "local_capture_path",
    "included_date",
    "coded_date",
    "schema_version_at_coding",
    "vocab_version_at_coding",
    "recoded_under",
]

# --- provenance columns added by this pipeline -------------------------
# Not part of the framework schema. Additive, harvest-owned, and named with a
# `harvest_` prefix so they can never be confused with a coded field.

PROVENANCE_COLUMNS = [
    "harvest_source",
    "harvest_external_id",
    "harvest_run_id",
    "harvest_receipt_id",
    "harvest_retrieved_at",
    "harvest_payload_sha256",
    "harvest_unresolved",
]

CORPUS_COLUMNS = (
    CORE_METADATA_COLUMNS
    + ECOSYSTEM_COLUMNS
    + GEOGRAPHY_COLUMNS
    + NARRATIVE_COLUMNS
    + EMOTION_COLUMNS
    + CONSERVATION_COLUMNS
    + AUDIENCE_COLUMNS
    + BALANCE_COLUMNS
    + INTERACTION_COLUMNS
    + BEHAVIOUR_COLUMNS
    + USEFULNESS_COLUMNS
    + AUDIT_COLUMNS
    + PROVENANCE_COLUMNS
)

# --- §1.2 Species represented, lifted to its own tab --------------------

SPECIES_COLUMNS = [
    "artefact_id",
    "taxon_tier",  # primary_subject_taxa | background_taxa
    "taxon_name_common",
    "taxon_name_scientific",
    "taxon_id_external",
    "coverage_proportion",
    "coverage_role",
    "iucn_status_at_publication",
    "typology_categories",
    "harvest_source",
    "harvest_run_id",
    "harvest_unresolved",
]

VOCABULARY_COLUMNS = ["vocabulary", "term", "definition", "vocab_version"]

# --- The harvest boundary ----------------------------------------------

HARVEST_OWNED = set(
    CORE_METADATA_COLUMNS
    + PROVENANCE_COLUMNS
    + [
        "coding_status",
        "notes_path",
        "wayback_url",
        "included_date",
        "schema_version_at_coding",
        "vocab_version_at_coding",
        # §1.4 geography is derivable from declared production/subject metadata,
        # not from watching the artefact, so the harvester may seed it.
        "subject_country",
        "subject_region",
        "subject_global_classification",
        "mismatch_flag",
    ]
)

CODER_OWNED = [c for c in CORPUS_COLUMNS if c not in HARVEST_OWNED]

# Harvest-owned, but only at the moment the row is created. After that they
# belong to the workflow and the harvester must not touch them again, under any
# flag. `coding_status` is the reason this set exists: the harvester stamps
# `candidate` on a new row, and a coder then moves it through the §7 state
# machine to `coded`. A refresh pass that rewrote it to `candidate` would
# silently undo a completed coding session while reporting success.
WRITE_ONCE = {
    "coding_status",
    "notes_path",
    "date_captured",
    "included_date",
    "coder_id",
    "corpus_version_added",
    "schema_version_at_coding",
    "vocab_version_at_coding",
}

HARVEST_OWNED_SPECIES = {
    "artefact_id",
    "taxon_tier",
    "taxon_name_common",
    "taxon_name_scientific",
    "taxon_id_external",
    "iucn_status_at_publication",
    "harvest_source",
    "harvest_run_id",
    "harvest_unresolved",
}

# --- Controlled vocabularies -------------------------------------------
# Seeded verbatim from corpus-seed-framework §1. Maintained per corpus version
# (§12.2): a new term needs a definition, an example, and a reason it is not an
# existing term. The pipeline never invents a term; an unmatched value is left
# empty and reported as unresolved.

PLATFORM_VOCAB = [
    "youtube", "tiktok", "instagram", "broadcast-bbc", "broadcast-pbs", "broadcast-other",
    "netflix", "disney-plus", "apple-tv-plus", "amazon-prime", "vimeo", "twitch", "kick",
    "itch-io", "steam", "app-store-ios", "google-play", "museum-website", "ngo-website",
    "journalism-outlet", "citizen-science-platform", "inaturalist", "ebird", "zooniverse",
    "vr-headset-store", "mixed-platform",
]

# Facebook and the other Meta surfaces are absent from the framework seed list,
# which predates Content Library access. They are proposed here, not assumed:
# the pipeline refuses to write them until they are accepted into the vocabulary
# file, exactly as §12.2 requires.
PLATFORM_VOCAB_PROPOSED = ["facebook", "facebook-group", "facebook-page", "threads"]

FORMAT_VOCAB = [
    "video", "image", "image-set", "text-article", "podcast", "game",
    "vr-experience", "interactive-doc", "livestream", "mixed",
]

ACCESS_STATE_VOCAB = [
    "open", "paywalled", "geo-restricted", "login-required", "removed-but-archived", "private",
]

ARCHIVE_STATUS_VOCAB = ["wayback-archived", "internal-capture", "metadata-only", "unrecoverable"]

CODING_STATUS_VOCAB = ["candidate", "included", "in-progress", "coded", "retired"]

FORM_VOCAB = [
    "nature-documentary", "streaming-platform-production", "youtube-ecology", "tiktok-virality",
    "instagram-aesthetics", "conservation-campaign", "environmental-journalism",
    "interactive-documentary", "serious-game", "non-commercial-game", "vr-immersive",
    "citizen-science",
]

GLOBAL_CLASSIFICATION_VOCAB = [
    "global-north", "global-south", "transboundary", "polar", "marine-international", "ambiguous",
]

IUCN_CATEGORIES = ["EX", "EW", "CR", "EN", "VU", "NT", "LC", "DD", "NE"]

VOCABULARIES = {
    "platform": PLATFORM_VOCAB,
    "format": FORMAT_VOCAB,
    "access_state": ACCESS_STATE_VOCAB,
    "archive_status": ARCHIVE_STATUS_VOCAB,
    "coding_status": CODING_STATUS_VOCAB,
    "form_classification": FORM_VOCAB,
    "subject_global_classification": GLOBAL_CLASSIFICATION_VOCAB,
    "iucn_status": IUCN_CATEGORIES,
}

# Terms accepted by amendment after this module was written. Populated from
# `config/vocabulary-amendments.json` at config load, per §12.2: a term is in
# force only once a human has accepted it, and acceptance is recorded.
ACCEPTED_AMENDMENTS: dict[str, set] = {}


def register_accepted_terms(vocabulary: str, terms) -> None:
    ACCEPTED_AMENDMENTS.setdefault(vocabulary, set()).update(terms)


def reset_accepted_terms() -> None:
    ACCEPTED_AMENDMENTS.clear()


def accepted(vocabulary: str, term: str) -> bool:
    base = VOCABULARIES.get(vocabulary, [])
    return term in base or term in ACCEPTED_AMENDMENTS.get(vocabulary, set())


def load_amendments(path) -> dict:
    """
    Read the amendment file and register anything marked accepted.

    An entry that is merely proposed is deliberately not registered. The
    refusal a proposed term produces downstream is the mechanism that forces
    the vocabulary decision to be made once, by a person, and written down.
    """
    import json as _json
    from pathlib import Path as _Path

    target = _Path(path)
    if not target.exists():
        return {"accepted": 0, "proposed": 0, "path": str(target), "present": False}

    data = _json.loads(target.read_text(encoding="utf-8"))
    accepted_count = 0
    proposed_count = 0
    for entry in data.get("amendments", []):
        if str(entry.get("status", "")).lower() == "accepted" and entry.get("accepted_by"):
            register_accepted_terms(entry.get("vocabulary", ""), [entry.get("term", "")])
            accepted_count += 1
        else:
            proposed_count += 1
    return {
        "accepted": accepted_count,
        "proposed": proposed_count,
        "path": str(target),
        "present": True,
        "vocab_version": data.get("vocab_version", ""),
    }


LIST_DELIMITER = " | "


def join_list(values: Iterable[str] | None) -> str:
    """Pipe-delimited, per workspace-spec §3.1. Empty stays empty, never a placeholder."""
    if not values:
        return ""
    seen: list[str] = []
    for value in values:
        text = str(value).strip()
        if text and text not in seen:
            seen.append(text)
    return LIST_DELIMITER.join(seen)


def split_list(value: str | None) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in str(value).split("|") if part.strip()]


def blank_corpus_row() -> dict:
    return {column: "" for column in CORPUS_COLUMNS}


def blank_species_row() -> dict:
    return {column: "" for column in SPECIES_COLUMNS}


class SchemaError(ValueError):
    """A row does not conform. The run stops rather than writing a malformed corpus."""


def validate_row(row: dict, *, harvest_only: bool = True) -> dict:
    """
    Check a harvested row before it reaches the corpus.

    `harvest_only` asserts the boundary: a machine-produced row must leave every
    coder-owned column empty. This is the check that keeps the pipeline on the
    correct side of coding-workspace-spec §17.
    """
    unknown = set(row) - set(CORPUS_COLUMNS)
    if unknown:
        raise SchemaError(f"unknown corpus columns: {', '.join(sorted(unknown))}")

    if not row.get("artefact_id"):
        raise SchemaError("artefact_id is required on every corpus row")

    if harvest_only:
        trespass = [c for c in CODER_OWNED if str(row.get(c, "")).strip()]
        if trespass:
            raise SchemaError(
                "harvested row writes coder-owned columns "
                f"({', '.join(sorted(trespass))}); coding-workspace-spec §17 reserves these for a human"
            )

    status = row.get("coding_status", "")
    if status and status not in CODING_STATUS_VOCAB:
        raise SchemaError(f"coding_status '{status}' is not in the vocabulary")

    platform = row.get("platform_primary", "")
    if platform and not accepted("platform", platform):
        raise SchemaError(
            f"platform_primary '{platform}' is not in the accepted vocabulary. "
            "config/vocabulary-amendments.json carries it as proposed, with a definition, an "
            "example and a rationale. Set its status to 'accepted' and fill accepted_by/"
            "accepted_date to put it in force (corpus-seed-framework §12.2), and record the "
            "decision in amendments-log.md."
        )

    fmt = row.get("format", "")
    if fmt and fmt not in FORMAT_VOCAB:
        raise SchemaError(f"format '{fmt}' is not in the vocabulary")

    return row


def validate_species_row(row: dict, *, harvest_only: bool = True) -> dict:
    unknown = set(row) - set(SPECIES_COLUMNS)
    if unknown:
        raise SchemaError(f"unknown species columns: {', '.join(sorted(unknown))}")
    if not row.get("artefact_id"):
        raise SchemaError("artefact_id is required on every species row")
    if harvest_only:
        trespass = [c for c in SPECIES_COLUMNS if c not in HARVEST_OWNED_SPECIES and str(row.get(c, "")).strip()]
        if trespass:
            raise SchemaError(f"harvested species row writes coder-owned columns: {', '.join(sorted(trespass))}")
    status = row.get("iucn_status_at_publication", "")
    if status and status not in IUCN_CATEGORIES:
        raise SchemaError(f"iucn_status_at_publication '{status}' is not an IUCN category")
    return row
