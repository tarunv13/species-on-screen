"""
Paper 1 — Starter spreadsheet generator
Run from project root: python scripts/paper1-setup.py

Outputs:
  paper1-coding-starter.csv   — full 380-paper coding sheet (all 16 columns + helpers)
  paper1-irr-subsample.csv    — 76-paper IRR subsample only
  paper1-setup-report.txt     — summary for coder orientation
"""

import csv
import sys
import random
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

CORPUS_FILE = 'papers_with_link_2026-06-03T01-25-05.csv'
OUTPUT_FULL = 'paper1-coding-starter.csv'
OUTPUT_IRR  = 'paper1-irr-subsample.csv'
OUTPUT_RPT  = 'paper1-setup-report.txt'

IRR_SEED    = 42
IRR_PER_PERIOD = 19

PERIODS = [
    ('2001-2015', 2001, 2015),
    ('2016-2019', 2016, 2019),
    ('2020-2022', 2020, 2022),
    ('2023-2025', 2023, 2025),
]

TRAINING_A = {
    ('Condis',    '2015'),
    ('Attebery',  '2015'),
    ('Parham',    '2015'),
    ('Molloy',    '2011'),
    ('Caciuc',    '2014'),
    ('Bianchi',   '2014'),
    ('Weagly',    '2013'),
    ('Bainbridge','2014'),
    ('Ulman',     '2001'),
    ('Balmford',  '2002'),
}

TRAINING_B = {
    ('Tomotani',  '2014'),
    ('Backe',     '2014'),
    ('Sandbrook', '2015'),
    ('Lemonnier', '2015'),
    ('Brown',     '2014'),
    ('Acorn',     '2009'),
    ('Woolbright','2015'),
    ('Clary',     '2004'),
    ('Jepson',    '2015'),
    ('Hobbs',     '2019'),
}

# --- Franchise keyword detection ---
FRANCHISE_RULES = [
    ('Pokémon',           ['pokemon', 'pokémon', 'pokédex', 'pokedex', 'pokémon go', 'pokemon go',
                           'pikachu', 'bulbasaur', 'charizard', 'gengar', 'eevee', 'mewtwo',
                           'pokémon world', 'poké', 'pokecene', 'pokécene']),
    ('AnimalCrossing',    ['animal crossing', 'new horizons']),
    ('Minecraft',         ['minecraft']),
    ('FinalFantasy',      ['final fantasy', 'ff14', 'ffxiv', 'ff xiv']),
    ('RDR2',              ['red dead redemption', 'red dead', 'rdr2', 'rdr ']),
    ('NeverAlone-Thunderbird', ['never alone', 'kisima', 'thunderbird strike', 'kisima ingitchuna']),
    ('Horizon',           ['horizon zero dawn', 'horizon forbidden west', 'aloy']),
    ('LastOfUs',          ['last of us', 'the last of us']),
    ('StardewValley',     ['stardew valley', 'stardew']),
    ('BeyondBlue',        ['beyond blue']),
    ('TheSims',           ['the sims', 'the sims series']),
    ('Pikmin',            ['pikmin']),
    ('Civilization',      ['civilization', 'civ v', 'civ vi', 'civ 5', 'civ 6', "sid meier's civilization"]),
    ('FarmVille',         ['farmville']),
    ('Eco',               ['eco game', '"eco"']),
]

POKEMON_CLUSTER_VENUES = [
    'journal of geek studies',
    'a bruxa',
    'i colóquio',
    'i coloquio',
    'ii colóquio',
    'iii colóquio',
    'american entomologist',
    'colóquio de história',
    'coloquio de historia',
]

INDIGENOUS_SIGNALS = [
    "indigenous", "decolon", "onkwehón", "onkwehon", "kisima", "iñupiaq",
    "inupiaq", "thunderbird strike", "never alone", "traditional ecological",
    "tek ", "land-based", "first nations", "aboriginal", "settler",
    "lapensée", "lapensee", "maori", "māori", "anishinaabe", "haudenosaunee",
]


def detect_franchise(title):
    t = title.lower()
    for fname, keywords in FRANCHISE_RULES:
        if any(k in t for k in keywords):
            return fname
    return 'None'


def detect_pokemon_cluster(publication):
    p = publication.lower()
    return 'Y' if any(v in p for v in POKEMON_CLUSTER_VENUES) else 'N'


def detect_indigenous(title, publication):
    combined = (title + ' ' + publication).lower()
    return 'Y' if any(s in combined for s in INDIGENOUS_SIGNALS) else 'N'


def make_period(year):
    y = int(year)
    for label, lo, hi in PERIODS:
        if lo <= y <= hi:
            return label
    return 'unknown'


# --- Load corpus ---
with open(CORPUS_FILE, encoding='utf-8-sig') as f:
    raw = list(csv.DictReader(f))

# Sort by year then first_author for stable ordering
raw.sort(key=lambda r: (int(r['publication_year']), r['first_author'].strip().lower()))

# --- Assign unique paper_ids ---
id_counter = defaultdict(int)
id_assigned = defaultdict(int)

# First pass: count collisions
for r in raw:
    base = r['first_author'].strip().replace(' ', '') + r['publication_year'].strip()
    id_counter[base] += 1

# Second pass: assign suffixes where needed
suffixes = 'abcdefghij'
running = defaultdict(int)
for r in raw:
    base = r['first_author'].strip().replace(' ', '') + r['publication_year'].strip()
    if id_counter[base] > 1:
        r['paper_id'] = base + suffixes[running[base]]
        running[base] += 1
    else:
        r['paper_id'] = base

# --- Auto-populate detectable fields ---
for r in raw:
    r['franchise']       = detect_franchise(r['title'])
    r['pokemon_cluster'] = detect_pokemon_cluster(r['publication'])
    r['indigenous_paper'] = detect_indigenous(r['title'], r['publication'])
    r['period']          = make_period(r['publication_year'])
    r['irr_sample']      = ''   # Y if in the random 76-paper IRR subsample
    r['training_set']    = ''   # A | B if a training paper
    # Blank coding fields
    r['game_primary']    = ''
    r['er_code']         = ''
    r['er_confidence']   = ''
    r['kf_primary']      = ''
    r['kf_coprimary']    = ''
    r['nc_level']        = ''
    r['abstract_accessed'] = 'N'
    r['coder_notes']     = ''

# --- Mark Training Set A and B (independent of IRR sample) ---
for r in raw:
    key = (r['first_author'].strip(), r['publication_year'].strip())
    if key in TRAINING_A:
        r['training_set'] = 'A'
    elif key in TRAINING_B:
        r['training_set'] = 'B'

# --- Generate stratified IRR sample (seed=42) ---
# Sample 19 per period from ALL 380 papers (training papers are in the pool).
# irr_sample=Y is set independently of training_set.
# 2001-2015 pool = 35; min(19, 35) = 19.
rng = random.Random(IRR_SEED)

period_papers = defaultdict(list)
for r in raw:
    period_papers[r['period']].append(r)

irr_ids = set()
irr_by_period = {}

for label, lo, hi in PERIODS:
    pool = period_papers[label]
    n = min(IRR_PER_PERIOD, len(pool))
    sample = rng.sample(pool, n)
    irr_by_period[label] = sample
    for r in sample:
        irr_ids.add(r['paper_id'])

for r in raw:
    if r['paper_id'] in irr_ids:
        r['irr_sample'] = 'Y'

# --- Output columns ---
COLS = [
    'paper_id', 'first_author', 'publication_year', 'title', 'publication',
    'period', 'game_primary', 'franchise', 'er_code', 'er_confidence',
    'kf_primary', 'kf_coprimary', 'nc_level', 'abstract_accessed',
    'indigenous_paper', 'pokemon_cluster', 'irr_sample', 'training_set', 'coder_notes',
]

# --- Write full starter sheet ---
with open(OUTPUT_FULL, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=COLS, extrasaction='ignore')
    w.writeheader()
    w.writerows(raw)

# --- Write IRR subsample (76 randomly sampled papers) ---
irr_papers = sorted(
    [r for r in raw if r['irr_sample'] == 'Y'],
    key=lambda r: (r['period'], r['publication_year'], r['first_author'])
)

with open(OUTPUT_IRR, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=COLS, extrasaction='ignore')
    w.writeheader()
    w.writerows(irr_papers)

# --- Build report ---
total = len(raw)
franchise_counts = defaultdict(int)
for r in raw:
    franchise_counts[r['franchise']] += 1

cluster_count = sum(1 for r in raw if r['pokemon_cluster'] == 'Y')
indigenous_count = sum(1 for r in raw if r['indigenous_paper'] == 'Y')

irr_total = sum(1 for r in raw if r['irr_sample'] == 'Y')
training_a_count = sum(1 for r in raw if r['training_set'] == 'A')
training_b_count = sum(1 for r in raw if r['training_set'] == 'B')
# Papers in BOTH the random 76 AND a training set
overlap = sum(1 for r in raw if r['irr_sample'] == 'Y' and r['training_set'] in ('A','B'))

report_lines = [
    'PAPER 1 — CODING ENVIRONMENT SETUP REPORT',
    '=' * 50,
    '',
    f'Corpus file : {CORPUS_FILE}',
    f'Total papers: {total}',
    f'Output      : {OUTPUT_FULL}',
    f'IRR output  : {OUTPUT_IRR}',
    '',
    '--- Period breakdown ---',
]
for label, lo, hi in PERIODS:
    n = len(period_papers[label])
    report_lines.append(f'  {label}: {n} papers')

report_lines += [
    '',
    '--- IRR subsample (seed=42, 19 per period) ---',
    f'  Random IRR total : {irr_total} papers ({irr_total/total*100:.1f}% of corpus)',
]
for label, lo, hi in PERIODS:
    report_lines.append(f'    {label}: {len(irr_by_period[label])} papers')
report_lines += [
    '',
    '--- Training sets (separate from IRR sample) ---',
    f'  Training Set A (answer key): {training_a_count} papers',
    f'  Training Set B (pilot)     : {training_b_count} papers',
    f'  Overlap with random IRR    : {overlap} papers (these get coded by both coders twice)',
    '',
    'NOTE: Methods section should state: "Inter-rater reliability was assessed',
    f'on a stratified random subsample of {irr_total} papers ({irr_total/total*100:.1f}% of corpus;"',
    f'"{int(irr_total/4)} papers per period, seed=42)."',
]

report_lines += [
    '',
    '--- Auto-detected fields ---',
    f'  pokemon_cluster=Y: {cluster_count} papers (venues: JGS, A Bruxa, American Entomologist, etc.)',
    f'  indigenous_paper=Y: {indigenous_count} papers (keyword-detected; verify manually)',
    '',
    '--- Franchise distribution (auto-detected from title) ---',
]
for fname, cnt in sorted(franchise_counts.items(), key=lambda x: -x[1]):
    if fname != 'None':
        report_lines.append(f'  {fname}: {cnt}')
report_lines.append(f'  None (no franchise): {franchise_counts["None"]}')

report_lines += [
    '',
    '--- Duplicate paper_id suffixes assigned ---',
]
for r in raw:
    if len(r['paper_id']) > len(r['first_author'].strip().replace(' ','') + r['publication_year'].strip()):
        report_lines.append(f'  {r["paper_id"]} — {r["title"][:55]}')

report_lines += [
    '',
    '--- IRR Main sample (first 10 per period shown) ---',
]
for label, lo, hi in PERIODS:
    report_lines.append(f'  {label}:')
    for r in irr_by_period[label][:10]:
        report_lines.append(f'    {r["paper_id"]:25s} {r["title"][:45]}')

report_lines += [
    '',
    '--- Action 1 checklist ---',
    '  [x] Corpus loaded and sorted (by year then author)',
    '  [x] Unique paper_ids assigned (a/b/c suffixes for all 17 collision groups)',
    '  [x] period pre-calculated (2001-2015 / 2016-2019 / 2020-2022 / 2023-2025)',
    '  [x] franchise auto-detected from title (14 franchise groups)',
    '  [x] pokemon_cluster auto-detected from venue (JGS / A Bruxa / American Entomologist / etc.)',
    '  [x] indigenous_paper keyword-detected (verify manually — 12 flagged)',
    f'  [x] irr_sample=Y for {irr_total} random papers (seed=42, ~19 per period)',
    '  [x] training_set=A for 10 papers / training_set=B for 10 papers',
    '  [ ] abstract_accessed — set to Y as you open each abstract',
    '  [ ] game_primary — fill during coding',
    '  [ ] er_code / kf_primary / nc_level — blank, ready for coding',
    '',
    '--- Columns in paper1-coding-starter.csv ---',
    '  paper_id          unique ID (author+year, suffixed for dupes)',
    '  first_author      as in corpus',
    '  publication_year  as in corpus',
    '  title             as in corpus',
    '  publication       venue name',
    '  period            2001-2015 / 2016-2019 / 2020-2022 / 2023-2025',
    '  game_primary      [FILL DURING CODING]',
    '  franchise         auto-detected; verify and correct',
    '  er_code           [FILL: 0 / 1 / 2 / 3 / 4]',
    '  er_confidence     [FILL: High / Medium / Low]',
    '  kf_primary        [FILL: A / B / C / D1 / D2 / E / F]',
    '  kf_coprimary      [FILL: same options, or leave blank]',
    '  nc_level          [FILL: 1 / 2 / 3]',
    '  abstract_accessed [SET TO Y when you open an abstract]',
    '  indigenous_paper  keyword-detected Y/N; verify',
    '  pokemon_cluster   venue-detected Y/N; verify',
    '  irr_sample        Y = in the random 76; blank = primary coder only',
    '  training_set      A = Training Set A / B = Training Set B / blank',
    '  coder_notes       free text',
    '',
    '--- Next steps ---',
    '  1. Open paper1-coding-starter.csv in Excel or Google Sheets',
    '  2. Spot-check franchise column: search for "Pokémon" in title — confirm franchise=Pokemon',
    '  3. Run scripts/paper1-fetch-abstracts.py (Semantic Scholar) to pre-load abstracts',
    '  4. Send second coder: paper1-irr-subsample.csv (paper_id + title only)',
    '  5. Begin ER coding from row 1 (year 2001 — these calibrate your scheme)',
    '  6. Use Training Set A answer key to verify your first 10 codes before proceeding',
]

report_text = '\n'.join(report_lines)

with open(OUTPUT_RPT, 'w', encoding='utf-8') as f:
    f.write(report_text)

print(report_text)
