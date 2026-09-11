"""
Meta Content Library — the two-machine adapter.

The single fact that shapes this module: **the Content Library API cannot be
reached from a personal machine.** It is served only inside Meta's Secure
Research Environment or the ICPSR SOMAR Virtual Data Enclave, through Amazon
WorkSpaces Secure Browser, and all interaction happens in a Jupyter notebook
there. A pipeline that pretends otherwise will produce a module that never
runs, and worse, a methods section that describes a collection route the
researcher does not have.

So the adapter is split across two machines:

  enclave mode   Runs *inside* the secure environment, where
                 `metacontentlibraryapi` is importable. Queries, paginates,
                 submits asynchronous jobs, and writes a **vetted extract**:
                 surface-level metadata plus aggregate counts, never raw user
                 content. The runnable form of this lives in
                 `research/enclave/mcl_enclave_harvest.py`, which is pasted into
                 a notebook in the enclave.

  import mode    Runs on the researcher's own machine. Reads the vetted extract
                 that a human carried out of the enclave, checks it against the
                 extract contract below, and turns it into corpus rows.

Import mode is the default, because that is where this repository lives.

Limits confirmed against current documentation: 60 synchronous searches per
minute, 1 asynchronous job per minute, 1,000 results per synchronous search
(10 per page), 100,000 results per asynchronous job, and a combined UI + API
retrieval cap of 500,000 records per rolling seven days per researcher — CSV
downloads from the Content Library UI count against that same cap.

Export eligibility is Meta's rule, not ours: CSV export covers widely-known
accounts — Facebook Pages with at least 15,000 followers, and public profiles
with at least 25,000 followers or a verified status. This adapter enforces the
same thresholds on the way in, so an extract that should not have left the
enclave cannot quietly enter the corpus.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Iterator

from ..normalize import clean_text, country_code, global_classification, iso_date, language_code, licence_or_rights
from ..provenance import Receipt, Unresolved, sha256_bytes, utc_now
from ..schema import PLATFORM_VOCAB_PROPOSED, blank_corpus_row, join_list
from ..store import notes_path_for
from .base import EnclaveOnlyError, HarvestPlan, HarvestRecord, Source, SourceError

# --- the extract contract ----------------------------------------------
# What a vetted export must carry for this pipeline to accept it. Named here so
# the enclave-side script and the importer cannot drift apart.

SURFACE_EXTRACT_COLUMNS = (
    "surface_id",
    "surface_type",
    "surface_name",
    "surface_followers",
    "surface_verified",
    "surface_country",
    "surface_url",
    "post_count",
    "first_post_date",
    "last_post_date",
    "languages_observed",
    "query_label",
)

POST_EXTRACT_COLUMNS = (
    "post_id",
    "surface_id",
    "surface_type",
    "surface_name",
    "surface_followers",
    "creation_time",
    "post_url",
    "lang",
    "country",
)

VETTING_FIELDS = (
    "exported_by",
    "exported_at",
    "enclave",
    "dataset_id",
    "api_version",
    "query_id",
    "record_count",
    "unit_of_analysis",
    "contains_user_content",
    "export_approved",
)

ACCEPTED_ENCLAVES = {"meta-sre", "icpsr-somar"}

# Meta's widely-known-account thresholds, applied as an admission gate.
PAGE_FOLLOWER_THRESHOLD = 15000
PROFILE_FOLLOWER_THRESHOLD = 25000


class ExtractContractError(SourceError):
    """A vetted extract does not satisfy the contract and is refused."""


class MetaContentLibrarySource(Source):
    name = "meta_content_library"
    tos_posture = "vetted-export"
    produces_corpus_rows = True
    field_allowlist = tuple(sorted(set(SURFACE_EXTRACT_COLUMNS) | set(POST_EXTRACT_COLUMNS)))

    # --- lifecycle ----------------------------------------------------

    def mode(self) -> str:
        return str(self.cfg.get("mode", "import")).lower()

    def preflight(self) -> list[str]:
        problems: list[str] = []
        mode = self.mode()
        if mode not in ("import", "enclave"):
            problems.append(f"mode '{mode}' is not one of: import, enclave")
            return problems

        if mode == "enclave":
            try:
                import metacontentlibraryapi  # noqa: F401
            except ImportError:
                problems.append(
                    "mode is 'enclave' but metacontentlibraryapi is not importable. That library exists "
                    "only inside Meta's Secure Research Environment or the ICPSR SOMAR Virtual Data "
                    "Enclave. Run research/enclave/mcl_enclave_harvest.py there and use mode 'import' here."
                )
            return problems

        import_dir = self._import_dir()
        if not import_dir.exists():
            problems.append(f"import_dir {import_dir} does not exist; create it and place vetted extracts there")
        elif not self._extract_paths():
            problems.append(
                f"no vetted extracts found in {import_dir}. Each extract is a .csv beside a "
                "matching .vetting.json (see research/enclave/README.md)."
            )

        from ..schema import accepted

        unaccepted = [term for term in PLATFORM_VOCAB_PROPOSED if not accepted("platform", term)]
        if unaccepted:
            problems.append(
                "platform vocabulary: "
                + ", ".join(f"'{term}'" for term in unaccepted)
                + " are proposed but not yet accepted, so rows carrying them will be refused. The "
                "framework seed list predates Content Library access. Definitions, examples and "
                "rationales are already written in config/vocabulary-amendments.json; set status to "
                "'accepted' with accepted_by and accepted_date to put them in force "
                "(corpus-seed-framework §12.2)."
            )
        return problems

    def estimate(self, plan: HarvestPlan) -> dict:
        if self.mode() == "enclave":
            return {"source": self.name, "calls": "see enclave script", "quota_units": "enclave budget"}
        paths = self._extract_paths()
        return {
            "source": self.name,
            "calls": 0,
            "quota_units": 0,
            "extracts": len(paths),
            "note": "import mode reads files; it makes no network calls",
        }

    # --- harvest ------------------------------------------------------

    def harvest(self, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        mode = self.mode()
        if mode == "enclave":
            raise EnclaveOnlyError(
                "The Content Library API is reachable only from inside Meta's Secure Research "
                "Environment or the ICPSR SOMAR Virtual Data Enclave. Run "
                "research/enclave/mcl_enclave_harvest.py in a notebook there, carry the vetted "
                "extract out, and harvest it here with mode 'import'."
            )
        if mode != "import":
            raise SourceError(f"unknown meta_content_library mode '{mode}'")

        for csv_path in self._extract_paths():
            vetting = self._load_vetting(csv_path)
            yield from self._rows_from_extract(csv_path, vetting, plan)

    # --- import-mode internals ----------------------------------------

    def _import_dir(self) -> Path:
        configured = str(self.cfg.get("import_dir", "var/mcl-imports"))
        path = Path(configured)
        return path if path.is_absolute() else (self.config.root / configured).resolve()

    def _extract_paths(self) -> list[Path]:
        directory = self._import_dir()
        if not directory.exists():
            return []
        return sorted(p for p in directory.glob("*.csv") if not p.name.endswith(".vetting.csv"))

    def _load_vetting(self, csv_path: Path) -> dict:
        sidecar = csv_path.with_suffix(".vetting.json")
        if not sidecar.exists():
            raise ExtractContractError(
                f"{csv_path.name} has no {sidecar.name} beside it. An extract without a vetting record "
                "cannot be admitted: the record is what states who carried the data out, from which "
                "enclave, under which query, and that the export was approved."
            )
        try:
            vetting = json.loads(sidecar.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise ExtractContractError(f"{sidecar.name} is not valid JSON: {exc}") from exc

        missing = [field for field in VETTING_FIELDS if field not in vetting]
        if missing:
            raise ExtractContractError(f"{sidecar.name} is missing required fields: {', '.join(missing)}")

        if not vetting.get("export_approved"):
            raise ExtractContractError(
                f"{sidecar.name} records export_approved=false. An extract that was not approved for "
                "export is not admitted to the corpus."
            )

        enclave = str(vetting.get("enclave", "")).lower()
        if enclave not in ACCEPTED_ENCLAVES:
            raise ExtractContractError(
                f"{sidecar.name} names enclave '{enclave}'; expected one of {', '.join(sorted(ACCEPTED_ENCLAVES))}"
            )

        unit = str(vetting.get("unit_of_analysis", "")).lower()
        if unit not in ("surface", "post"):
            raise ExtractContractError(f"{sidecar.name} unit_of_analysis must be 'surface' or 'post', not '{unit}'")

        if unit == "post" and vetting.get("contains_user_content"):
            raise ExtractContractError(
                f"{sidecar.name} declares contains_user_content=true. This pipeline does not carry post "
                "text or any other user content into the repository. Re-export with content columns "
                "removed (corpus-seed-framework §8.8)."
            )

        declared_dataset = str(vetting.get("dataset_id", ""))
        configured_dataset = str(self.cfg.get("dataset_id", ""))
        if configured_dataset and declared_dataset and declared_dataset != configured_dataset:
            self.manifest.warn(
                f"{sidecar.name} was exported from dataset {declared_dataset}, but the config names "
                f"{configured_dataset}. The extract is admitted and the difference recorded."
            )

        vetting["_sidecar_path"] = str(sidecar)
        vetting["_sidecar_sha256"] = sha256_bytes(sidecar.read_bytes())
        return vetting

    def _rows_from_extract(self, csv_path: Path, vetting: dict, plan: HarvestPlan) -> Iterator[HarvestRecord]:
        unit = str(vetting["unit_of_analysis"]).lower()
        required = SURFACE_EXTRACT_COLUMNS if unit == "surface" else POST_EXTRACT_COLUMNS

        payload_sha = sha256_bytes(csv_path.read_bytes())
        with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            header = reader.fieldnames or []
            missing = [column for column in required if column not in header]
            if missing:
                raise ExtractContractError(
                    f"{csv_path.name} is missing contract columns for unit '{unit}': {', '.join(missing)}"
                )

            emitted = 0
            for raw in reader:
                if plan.limit is not None and emitted >= plan.limit:
                    return
                record = self._record_from_row(raw, unit, vetting, csv_path, payload_sha)
                if record is None:
                    continue
                emitted += 1
                yield record

    def _record_from_row(
        self, raw: dict, unit: str, vetting: dict, csv_path: Path, payload_sha: str
    ) -> HarvestRecord | None:
        unresolved: list[Unresolved] = []

        surface_type = (raw.get("surface_type") or "").strip().lower()
        followers = self._int(raw.get("surface_followers"))
        verified = str(raw.get("surface_verified", "")).strip().lower() in ("true", "1", "yes")

        if not self._widely_known(surface_type, followers, verified):
            self.manifest.exclude("mcl-surface-below-widely-known-threshold")
            self.ethics.exclusions["mcl-surface-below-widely-known-threshold"] = (
                self.ethics.exclusions.get("mcl-surface-below-widely-known-threshold", 0) + 1
            )
            return None

        external_id = (raw.get("surface_id") if unit == "surface" else raw.get("post_id")) or ""
        if not external_id:
            self.manifest.exclude("mcl-row-without-identifier")
            return None

        payload, dropped = self.minimise(raw)

        row = blank_corpus_row()
        row["title"] = clean_text(raw.get("surface_name") or raw.get("query_label") or external_id, limit=300)
        row["creator"] = clean_text(raw.get("surface_name"), limit=300)
        row["producer_country"] = country_code(raw.get("surface_country"))
        row["platform_primary"] = self._platform_term(surface_type)
        row["url_primary"] = (raw.get("surface_url") or raw.get("post_url") or "").strip()
        row["format"] = "mixed" if unit == "surface" else "text-article"
        row["date_captured"] = iso_date(vetting.get("exported_at")) or utc_now()[:10]
        row["access_state_at_capture"] = "open"
        row["license_or_rights"] = licence_or_rights("")
        row["archive_status"] = "metadata-only"

        published = iso_date(raw.get("first_post_date") or raw.get("creation_time"))
        if published:
            row["date_published"] = published
        else:
            unresolved.append(Unresolved("date_published", "absent-from-extract", external_id))

        languages = raw.get("languages_observed") or raw.get("lang") or ""
        codes = [language_code(part) for part in str(languages).replace("|", ",").split(",")]
        row["languages"] = join_list([c for c in codes if c])
        if not row["languages"]:
            unresolved.append(Unresolved("languages", "absent-from-extract", external_id))

        subject_country = country_code(raw.get("country")) or row["producer_country"]
        if subject_country:
            row["subject_country"] = subject_country
            row["subject_global_classification"] = global_classification(countries=[subject_country])
            row["mismatch_flag"] = "FALSE" if subject_country == row["producer_country"] else "TRUE"

        if unit == "surface":
            row["duration_or_length"] = str(self._int(raw.get("post_count")) or "")

        receipt = Receipt.make(
            source=self.name,
            endpoint=f"vetted-extract:{csv_path.name}",
            params={
                "unit_of_analysis": unit,
                "query_id": vetting.get("query_id"),
                "enclave": vetting.get("enclave"),
                "dataset_id": vetting.get("dataset_id"),
            },
            status=200,
            payload=payload,
            method="FILE",
            api_version=str(vetting.get("api_version", "")),
        )
        receipt.payload_sha256 = payload_sha

        return HarvestRecord(
            source=self.name,
            external_id=str(external_id),
            payload=payload,
            corpus_row=row,
            receipt=receipt,
            unresolved=unresolved,
            audience_size=followers,
            dropped_fields=dropped,
        )

    # --- helpers ------------------------------------------------------

    @staticmethod
    def _int(value) -> int | None:
        try:
            return int(str(value).replace(",", "").strip())
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _widely_known(surface_type: str, followers: int | None, verified: bool) -> bool:
        """
        Meta's own export-eligibility rule, applied as an admission gate.

        A group or event has no follower count of the same kind; those are
        admitted on the page threshold when a count is present, and refused when
        it is absent, which keeps the unknown case on the conservative side.
        """
        if followers is None:
            return bool(verified)
        if surface_type in ("profile", "user"):
            return verified or followers >= PROFILE_FOLLOWER_THRESHOLD
        return followers >= PAGE_FOLLOWER_THRESHOLD

    @staticmethod
    def _platform_term(surface_type: str) -> str:
        """
        Map a Content Library surface onto the platform vocabulary.

        Every term this returns is currently in `PLATFORM_VOCAB_PROPOSED`, not
        in the accepted list. `schema.validate_row` will refuse the row until
        the vocabulary is amended. That refusal is the correct behaviour: it
        forces the vocabulary decision to be made deliberately rather than
        inherited from whatever the first import happened to contain.
        """
        return {
            "page": "facebook-page",
            "group": "facebook-group",
            "profile": "facebook",
            "event": "facebook",
        }.get(surface_type, "facebook")
