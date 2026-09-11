"""
The command surface.

Eight commands, matching the workflow the pilot already runs by hand:

  doctor      What is configured, what is missing, what would refuse to run.
  plan        The sampling frame and the quota estimate. No network calls.
  harvest     Collect, gate, allocate, validate, merge.
  resolve     Bind taxa to GBIF and the Red List; bind landscapes to the typology.
  signal      Culturomics pass: pageviews and news coverage.
  import-mcl  Ingest a vetted Content Library extract carried out of the enclave.
  snapshot    The weekly CSV snapshot and the manual capture worklist.
  registry    Rebuild the derived relational database.

Every command that touches the network writes a run manifest and receipts. A
command that changes the corpus prints what it changed and where it wrote it,
because a pipeline whose effects are invisible is one nobody trusts.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from . import __version__, seeds
from .config import Config, ConfigError
from .harvester import Harvester
from .provenance import RunManifest, environment_report
from .ratelimit import HttpClient, QuotaLedger
from .report import measure, write as write_report
from .sources import ARTEFACT_SOURCES, ENRICHMENT_SOURCES, REGISTRY, build as build_source
from .sources.base import HarvestPlan
from .store import CorpusStore


def _client(config, manifest, *, require_workspace: bool = False) -> tuple[HttpClient, QuotaLedger, object]:
    from .provenance import ReceiptLog

    config.ensure_dirs(require_workspace=require_workspace)
    receipt_log = ReceiptLog(config, manifest)
    http = HttpClient(
        user_agent=str(config.http.get("user_agent", "species-on-screen/research-pipeline")),
        timeout=int(config.http.get("timeout_seconds", 30)),
        max_retries=int(config.http.get("max_retries", 4)),
        backoff_base=float(config.http.get("backoff_base_seconds", 0.75)),
        receipt_log=receipt_log,
    )
    ledger = QuotaLedger(config.quota_ledger_path)
    return http, ledger, receipt_log


def _resolve_sources(config, requested: list[str] | None, default: tuple[str, ...]) -> list[str]:
    if requested:
        unknown = [name for name in requested if name not in REGISTRY]
        if unknown:
            raise ConfigError(f"unknown source(s): {', '.join(unknown)}. Known: {', '.join(sorted(REGISTRY))}")
        return requested
    return [name for name in default if config.source(name).enabled]


# --- commands -----------------------------------------------------------


def cmd_doctor(args, config) -> int:
    manifest = RunManifest.start("doctor", config, vars(args))
    http, ledger, _ = _client(config, manifest)

    print(f"species-on-screen research pipeline {__version__}")
    print(f"config      {config.path}")
    print(f"config hash {config.sha256[:16]}")
    reachable = "reachable" if config.workspace_available else "NOT FOUND"
    print(f"workspace   {config.workspace_root}  [{reachable}]")
    if not config.workspace_available:
        print("            the corpus lives in the private repo tarunv13/species-on-screen-research;")
        print("            clone it beside this one or set SOS_WORKSPACE_ROOT in .env")
    print(f"var         {config.var_root}")
    print()

    print("credentials")
    for name, state in environment_report().items():
        print(f"  {'OK ' if state == 'set' else '-- '} {name}: {state}")
    print()

    print("seed files")
    for key in ("landscapes_file", "places_file"):
        path = config.seed_path(key)
        print(f"  {'OK ' if path.exists() else '-- '} {key}: {path}")
    print()

    amendments = config.amendments or {}
    if amendments.get("present"):
        print(
            f"vocabulary  {amendments.get('accepted', 0)} accepted, "
            f"{amendments.get('proposed', 0)} proposed and not in force"
        )
        if amendments.get("proposed"):
            print("            a proposed term is refused on write; accept it in "
                  "config/vocabulary-amendments.json")
        print()

    print("sources")
    problems_total = 0
    from .ethics import EthicsGate, EthicsRefusal

    ethics = EthicsGate.from_config(config)
    for name in sorted(REGISTRY):
        cfg = config.source(name)
        if not cfg.enabled:
            print(f"  -- {name}: disabled in config")
            continue
        try:
            source = build_source(name, config, http, ledger, manifest, ethics)
        except Exception as exc:
            print(f"  !! {name}: will not load — {type(exc).__name__}: {exc}")
            problems_total += 1
            continue
        try:
            ethics.check_source(source)
        except EthicsRefusal as exc:
            print(f"  !! {name}: refused — {exc}")
            problems_total += 1
            continue
        problems = source.preflight()
        if not problems:
            print(f"  OK {name}")
            continue
        problems_total += len(problems)
        print(f"  !! {name}")
        for problem in problems:
            print(f"       {problem}")
    print()

    store = CorpusStore(config.data_dir)
    rows = store.read_corpus()
    print(f"corpus      {len(rows)} artefacts at {store.corpus_path}")
    print(f"quota today {json.dumps(ledger.summary(), indent=None) if ledger.summary() else 'nothing spent'}")

    http.close()
    manifest.write(config)
    return 0 if problems_total == 0 else 1


def cmd_plan(args, config) -> int:
    manifest = RunManifest.start("plan", config, vars(args))
    plan = seeds.build_plan(
        config,
        landscape_ids=args.landscape,
        limit=args.limit,
        dry_run=True,
    )
    frame = seeds.describe_frame(plan)

    print(f"sampling frame: {frame['landscape_count']} landscapes, {frame['taxon_count']} taxa, "
          f"{frame['query_count']} queries")
    print()
    print("regions in frame")
    for region, count in frame["regions"].items():
        print(f"  {count:>3}  {region}")
    print()

    http, ledger, _ = _client(config, manifest)
    from .ethics import EthicsGate

    ethics = EthicsGate.from_config(config)
    names = _resolve_sources(config, args.source, ARTEFACT_SOURCES + ENRICHMENT_SOURCES)

    print("estimates (no calls made)")
    for name in names:
        try:
            source = build_source(name, config, http, ledger, manifest, ethics)
            print(f"  {name:<22} {json.dumps(source.estimate(plan), default=str)}")
        except Exception as exc:
            print(f"  {name:<22} unavailable — {type(exc).__name__}: {exc}")
    print()

    if args.show_queries:
        print("queries")
        for query in frame["queries"]:
            print(f"  {query}")

    http.close()
    manifest.counts["queries"] = frame["query_count"]
    manifest.write(config)
    return 0


def cmd_harvest(args, config) -> int:
    manifest = RunManifest.start("harvest", config, vars(args))
    http, ledger, receipt_log = _client(config, manifest, require_workspace=True)

    plan = seeds.build_plan(
        config,
        landscape_ids=args.landscape,
        limit=args.limit,
        since=args.since or "",
        until=args.until or "",
        dry_run=args.dry_run,
        extra_queries=args.query or None,
    )
    names = _resolve_sources(config, args.source, ARTEFACT_SOURCES)

    with receipt_log:
        harvester = Harvester(config, http, ledger, manifest)
        result = harvester.run(names, plan, refresh=args.refresh)
        if not args.dry_run:
            worklist = harvester.write_capture_worklist()

    http.close()

    print(f"run {manifest.run_id}")
    for name, outcome in result["sources"].items():
        line = f"  {name:<22} records={outcome.get('records', 0)} admitted={outcome.get('admitted', 0)} " \
               f"refused={outcome.get('refused', 0)}"
        print(line)
        for error in outcome.get("errors", []):
            print(f"       ! {error}")
        if "estimate" in outcome:
            print(f"       estimate: {json.dumps(outcome['estimate'], default=str)}")
    print()

    if args.dry_run:
        print("dry run: nothing written")
    else:
        corpus = result["corpus"]
        print(f"corpus   +{corpus['appended']} new, {corpus['updated']} refreshed, "
              f"{corpus['unchanged']} unchanged, {corpus['protected_cells']} coder cells protected")
        species = result["species"]
        print(f"species  +{species['appended']} new, {species['updated']} refreshed")
        print(f"worklist {worklist}")

    frame = seeds.describe_frame(plan)
    store = CorpusStore(config.data_dir)
    report_path = write_report(
        config, manifest, store.read_corpus(), frame, {"exclusions": result["exclusions"]}
    )
    manifest_path = manifest.write(config)
    print(f"report   {report_path}")
    print(f"manifest {manifest_path}")

    failed = any(outcome.get("errors") for outcome in result["sources"].values())
    return 1 if failed else 0


def cmd_resolve(args, config) -> int:
    """Identifier-binding pass: GBIF taxonomy, Red List category, typology EFG."""
    manifest = RunManifest.start("resolve", config, vars(args))
    http, ledger, receipt_log = _client(config, manifest, require_workspace=True)
    plan = seeds.build_plan(config, landscape_ids=args.landscape, limit=args.limit)

    names = _resolve_sources(config, args.source, ("gbif", "iucn_redlist", "iucn_get", "globi"))
    with receipt_log:
        harvester = Harvester(config, http, ledger, manifest)
        result = harvester.run(names, plan)

    http.close()
    print(f"run {manifest.run_id}")
    for name, outcome in result["sources"].items():
        print(f"  {name:<22} records={outcome.get('records', 0)}")
        for error in outcome.get("errors", []):
            print(f"       ! {error}")
    print(f"enrichment records: {result['enrichment_records']}")
    print(f"manifest {manifest.write(config)}")
    return 0


def cmd_signal(args, config) -> int:
    """Culturomics pass: Wikipedia pageviews and GDELT coverage."""
    manifest = RunManifest.start("signal", config, vars(args))
    http, ledger, receipt_log = _client(config, manifest, require_workspace=True)
    plan = seeds.build_plan(config, landscape_ids=args.landscape, limit=args.limit)

    names = _resolve_sources(config, args.source, ("wikipedia", "gdelt"))
    with receipt_log:
        harvester = Harvester(config, http, ledger, manifest)
        result = harvester.run(names, plan)

    http.close()
    print(f"run {manifest.run_id}")
    for name, outcome in result["sources"].items():
        print(f"  {name:<22} records={outcome.get('records', 0)}")
        for error in outcome.get("errors", []):
            print(f"       ! {error}")
    print(f"manifest {manifest.write(config)}")
    return 0


def cmd_import_mcl(args, config) -> int:
    manifest = RunManifest.start("import-mcl", config, vars(args))
    http, ledger, receipt_log = _client(config, manifest, require_workspace=True)
    plan = HarvestPlan(limit=args.limit)

    with receipt_log:
        harvester = Harvester(config, http, ledger, manifest)
        result = harvester.run(["meta_content_library"], plan, refresh=args.refresh)

    http.close()
    outcome = result["sources"]["meta_content_library"]
    print(f"run {manifest.run_id}")
    print(f"  records={outcome.get('records', 0)} admitted={outcome.get('admitted', 0)} "
          f"refused={outcome.get('refused', 0)}")
    for error in outcome.get("errors", []):
        print(f"  ! {error}")
    corpus = result["corpus"]
    print(f"corpus +{corpus['appended']} new, {corpus['updated']} refreshed, "
          f"{corpus['protected_cells']} coder cells protected")
    print(f"manifest {manifest.write(config)}")
    return 1 if outcome.get("errors") else 0


def cmd_snapshot(args, config) -> int:
    config.ensure_dirs(require_workspace=True)
    store = CorpusStore(config.data_dir)
    store.write_vocabularies(str(config.corpus.get("vocab_version", "v0.1")))
    folder = store.snapshot(config.snapshots_dir, when=args.date)
    rows = store.read_corpus()
    print(f"snapshot {folder}  ({len(rows)} artefacts)")

    summary = measure(rows)
    print(f"  languages: {summary.get('distinct_languages', 0)} distinct")
    print(f"  archive gap: {summary.get('archive_gap', 0)} artefacts without a Wayback snapshot")
    print()
    print("Remaining manual steps for the weekly close (coding-workspace-spec §16 step 7):")
    print("  1. export the spreadsheet tabs the pipeline does not own (failure-log, amendments, effort-log)")
    print("  2. run Save Page Now on anything in data/capture-worklist.csv")
    print("  3. commit on the week's pilot/coding-week-N branch")
    return 0


def cmd_registry(args, config) -> int:
    from .db import Registry, postgres_ddl

    if args.print_postgres_ddl:
        print(postgres_ddl())
        return 0

    config.ensure_dirs()
    store = CorpusStore(config.data_dir)
    target = config.var_root / "registry.sqlite3"
    registry = Registry(target)

    manifest = RunManifest.start("registry", config, vars(args))
    http, ledger, _ = _client(config, manifest)
    from .ethics import EthicsGate

    typology_rows: list[dict] = []
    citation = ""
    get_source = build_source("iucn_get", config, http, ledger, manifest, EthicsGate.from_config(config))
    try:
        typology_rows = get_source._load()
        citation = get_source.provenance().get("citation", "")
    except ValueError as exc:
        print(f"  ! typology not loaded: {exc}")
    http.close()

    if typology_rows:
        loaded = registry.load_typology(typology_rows, citation)
        print(f"typology {loaded} nodes")
    else:
        print("typology not available — ecosystem bindings stay unresolved rather than guessed")

    counts = registry.load_corpus(store.read_corpus(), store.read_species())
    print(f"corpus   {counts['media']} media, {counts['species']} taxa, {counts['species_links']} links")

    enrichment_files = sorted(config.runs_dir.glob("*/enrichment.jsonl"))
    records = []
    for path in enrichment_files:
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                records.append(json.loads(line))
    if records:
        print(f"signal   {registry.load_enrichment(records)} rows from {len(enrichment_files)} run(s)")

    print()
    for table, count in registry.counts().items():
        print(f"  {table:<26} {count}")
    registry.close()
    print()
    print(f"registry {target}")
    print("This database is derived. The CSVs in the workspace remain the corpus.")
    return 0


# --- argument parsing ---------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="sos-pipeline",
        description="Species on Screen — media and biodiversity collection pipeline.",
        epilog=(
            "The harvester fills core metadata only. Every interpretive field is left "
            "empty for a human coder (coding-workspace-spec.md §17)."
        ),
    )
    parser.add_argument("--config", help="path to pipeline.config.json")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)

    def add_common(target, *, with_limit: bool = True) -> None:
        target.add_argument("--landscape", action="append", help="landscape id; repeatable. Default: all.")
        target.add_argument("--source", action="append", help="source name; repeatable. Default: all enabled.")
        if with_limit:
            target.add_argument("--limit", type=int, help="maximum records per source")

    doctor = sub.add_parser("doctor", help="check configuration, credentials and source readiness")
    doctor.set_defaults(func=cmd_doctor)

    plan = sub.add_parser("plan", help="show the sampling frame and quota estimate; makes no calls")
    add_common(plan)
    plan.add_argument("--show-queries", action="store_true", help="print every expanded query")
    plan.set_defaults(func=cmd_plan)

    harvest = sub.add_parser("harvest", help="collect artefact metadata into the corpus")
    add_common(harvest)
    harvest.add_argument("--query", action="append", help="extra query string; repeatable")
    harvest.add_argument("--since", help="ISO date lower bound where the source supports one")
    harvest.add_argument("--until", help="ISO date upper bound where the source supports one")
    harvest.add_argument("--dry-run", action="store_true", help="estimate only; write nothing")
    harvest.add_argument(
        "--refresh",
        action="store_true",
        help="overwrite non-empty harvest-owned cells. Coder-owned cells are never touched.",
    )
    harvest.set_defaults(func=cmd_harvest)

    resolve = sub.add_parser("resolve", help="bind taxa to GBIF and the Red List, landscapes to the typology")
    add_common(resolve)
    resolve.set_defaults(func=cmd_resolve)

    signal = sub.add_parser("signal", help="culturomics pass: Wikipedia pageviews and GDELT coverage")
    add_common(signal)
    signal.set_defaults(func=cmd_signal)

    mcl = sub.add_parser("import-mcl", help="ingest a vetted Content Library extract from the enclave")
    mcl.add_argument("--limit", type=int, help="maximum rows to admit")
    mcl.add_argument("--refresh", action="store_true", help="overwrite non-empty harvest-owned cells")
    mcl.set_defaults(func=cmd_import_mcl)

    snapshot = sub.add_parser("snapshot", help="write the weekly CSV snapshot")
    snapshot.add_argument("--date", help="ISO date for the snapshot folder. Default: today.")
    snapshot.set_defaults(func=cmd_snapshot)

    registry = sub.add_parser("registry", help="rebuild the derived relational database")
    registry.add_argument("--print-postgres-ddl", action="store_true", help="print the Postgres DDL and exit")
    registry.set_defaults(func=cmd_registry)

    return parser


def main(argv: list[str] | None = None) -> int:
    # The governance sources are cited by section sign throughout, and a
    # Windows console defaults to a codepage that cannot render it. Matching
    # what scripts/paper1-setup.py already does in this repository.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass

    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        config = Config.load(args.config)
    except ConfigError as exc:
        print(f"configuration error: {exc}", file=sys.stderr)
        return 2
    try:
        return int(args.func(args, config) or 0)
    except ConfigError as exc:
        print(f"configuration error: {exc}", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print("\ninterrupted; the quota ledger and anything already written are intact", file=sys.stderr)
        return 130
