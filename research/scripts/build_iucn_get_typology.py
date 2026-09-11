"""
Build research/config/iucn-get-typology.csv from the authoritative OSF workbook.

WHY THIS SCRIPT EXISTS, AND WHY IT DOES NOT FILL EVERY COLUMN
-------------------------------------------------------------
sos_pipeline/sources/iucn_get.py requires six columns:

    realm_code, realm_name, biome_code, biome_name, efg_code, efg_name

The published workbook (IUCN Global Ecosystem Typology v2.1, Keith et al. 2022,
OSF https://osf.io/4dcea/download) authoritatively supplies only three of them.
Its "Short description" sheet carries 110 Level-3 units with `code`,
`biome code` and `name`. There is no realm name and no biome name anywhere in
the workbook, and global-ecosystems.org serves a JavaScript shell with no
machine-readable hierarchy behind it.

So this script fills four columns and leaves two empty:

    efg_code    <- workbook `code`          (authoritative)
    efg_name    <- workbook `name`          (authoritative)
    biome_code  <- workbook `biome code`    (authoritative)
    realm_code  <- PARSED from efg_code     (the alphabetic prefix)
    realm_name  <- EMPTY, by decision
    biome_name  <- EMPTY, by decision

`realm_code` is derived by parsing the identifier itself — "T3.2" is in realm
"T" because that is what the code says — which is reading the source, not
recalling it. `realm_name` and `biome_name` would have to be reconstructed from
memory, and that is exactly what iucn_get.py's own docstring forbids:

    "What it does not do is ship a hard-coded EFG table reconstructed from
     memory. An ecosystem code is an identifier; a plausible-looking wrong one
     propagates into every row that cites it and is very hard to detect later."

A wrong biome name is worse than a blank one: blank is visibly incomplete,
wrong is invisibly incorrect. The two columns stay empty until a machine-
readable hierarchy is sourced, and the run reports the gap rather than papering
over it.

The user-supplied version of this script read sheet 0 and expected columns
'Realm Code' / 'Realm' / 'Biome Code' / 'Biome' / 'EFG Code' / 'EFG Name'.
Sheet 0 is "About" (24x1) and none of those column names exist in the workbook,
so it could not have run; that is corrected here rather than transcribed.

Run:  python research/scripts/build_iucn_get_typology.py
"""

from __future__ import annotations

import hashlib
import io
import re
import sys
from pathlib import Path

import pandas as pd
import requests

OSF_URL = "https://osf.io/4dcea/download"
SHEET = "Short description"
OUT = Path(__file__).resolve().parents[1] / "config" / "iucn-get-typology.csv"
COLUMNS = ("realm_code", "realm_name", "biome_code", "biome_name", "efg_code", "efg_name")

CITATION = (
    "Keith, D.A., Ferrer-Paris, J.R., Nicholson, E. et al. (2022). A function-based typology "
    "for Earth's ecosystems. Nature 610, 513-518. doi:10.1038/s41586-022-05318-4"
)

# The realm portion of an EFG code is its leading alphabetic run: T3.2 -> T,
# MFT1.3 -> MFT. Parsed, never assumed.
REALM_RE = re.compile(r"^([A-Za-z]+)")


def main() -> int:
    resp = requests.get(OSF_URL, timeout=120, headers={"User-Agent": "species-on-screen/research"})
    resp.raise_for_status()
    digest = hashlib.sha256(resp.content).hexdigest()

    book = pd.ExcelFile(io.BytesIO(resp.content))
    if SHEET not in book.sheet_names:
        print(f"ERROR: sheet {SHEET!r} absent; workbook has {book.sheet_names}", file=sys.stderr)
        return 1
    src = book.parse(SHEET)

    for needed in ("code", "biome code", "name"):
        if needed not in src.columns:
            print(f"ERROR: column {needed!r} absent; got {list(src.columns)}", file=sys.stderr)
            return 1

    rows = []
    for _, r in src.iterrows():
        code = str(r["code"]).strip()
        if not code or code.lower() == "nan":
            continue
        m = REALM_RE.match(code)
        rows.append({
            "realm_code": m.group(1) if m else "",
            "realm_name": "",                                   # not in source — see module docstring
            "biome_code": str(r["biome code"]).strip(),
            "biome_name": "",                                   # not in source — see module docstring
            "efg_code": code,
            "efg_name": str(r["name"]).strip(),
        })

    out = pd.DataFrame(rows, columns=list(COLUMNS))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(OUT, index=False, encoding="utf-8")

    realms = sorted({x for x in out["realm_code"] if x})
    print(f"wrote {len(out)} rows -> {OUT}")
    print(f"source   : {OSF_URL}")
    print(f"sha256   : {digest}")
    print(f"citation : {CITATION}")
    print(f"realms   : {', '.join(realms)}")
    print(f"biomes   : {out['biome_code'].nunique()} distinct")
    print("GAP      : realm_name and biome_name are EMPTY — absent from the source workbook "
          "and deliberately not reconstructed from memory. Populate only from a machine-readable "
          "hierarchy, never by hand.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
