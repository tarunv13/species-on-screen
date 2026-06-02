/*
  Living Atlas — seasonal atmosphere model.
  -----------------------------------------
  A small, pure module. Given a habitat's latitude and the current
  date, it returns:

    - a climate band (polar | temperate | tropical)
    - a season key + human label for that band and hemisphere
    - a dreamy colour palette (as CSS custom properties) used to tint
      the mesh-gradient background and the glass surfaces
    - an *atmospheric* framing line about the place

  Integrity note (this is a research project): the framing line is
  deliberately atmospheric and makes NO ecological claim. It describes
  light and season over a place ("Northern summer lies over the
  Sundarbans"), never the behaviour or status of a species. All
  species facts shown in the UI come from the attested narrative
  record and its sources — never from this file.

  No dependencies, no DOM, no network. Trivially testable.
*/

/* ---------- Climate band ---------- */

/** Coarse band from absolute latitude. Tropics ~|lat|<23.5°,
 *  polar ~|lat|>=66.5°, temperate in between. */
export function climateBand(latitude) {
  const a = Math.abs(latitude);
  if (a >= 66.5) return 'polar';
  if (a < 23.5) return 'tropical';
  return 'temperate';
}

/** 'northern' | 'southern' | 'equatorial' (within ~3° of the line). */
export function hemisphere(latitude) {
  if (latitude > 3) return 'northern';
  if (latitude < -3) return 'southern';
  return 'equatorial';
}

/* ---------- Season resolution ---------- */

// Temperate season by calendar month (0=Jan) for the NORTHERN
// hemisphere; the southern hemisphere is the inversion below.
const NORTH_TEMPERATE = [
  'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
  'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
];
const TEMPERATE_INVERT = {
  winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring',
};

function temperateSeason(month, north) {
  const n = NORTH_TEMPERATE[month];
  return north ? n : TEMPERATE_INVERT[n];
}

// Tropical: a single wet/dry approximation. Wet season tends to track
// the high-sun half of the year. This is a coarse, honest
// approximation (many tropical regions are bimodal); it drives
// atmosphere only, never a stated fact.
function tropicalSeason(month, north) {
  const highSunNorth = month >= 4 && month <= 9; // May–Oct
  const wet = north ? highSunNorth : !highSunNorth;
  return wet ? 'wet' : 'dry';
}

// Polar: midnight-sun band, polar night, or low-sun shoulder.
function polarSeason(month, north) {
  const summer = north ? (month >= 4 && month <= 7) : (month <= 1 || month >= 10);
  const winter = north ? (month <= 1 || month >= 10) : (month >= 4 && month <= 7);
  if (summer) return 'polar-day';
  if (winter) return 'polar-night';
  return 'polar-low';
}

/* ---------- Palettes ---------- */

// Each style: four mesh-gradient stops (a–d), a glass tint, and ink
// colours. Chosen to be calm and dreamy rather than saturated.
const STYLES = {
  spring: {
    label: 'Spring',
    mesh: ['#9ed8b4', '#7fb7d6', '#f3cdd6', '#cfe8c6'],
    glass: '180, 220, 200', ink: '#f3f7f2', inkSoft: 'rgba(243,247,242,0.66)',
  },
  summer: {
    label: 'Summer',
    mesh: ['#6fc3b8', '#3f8fb0', '#ecd29a', '#bfe0c8'],
    glass: '150, 210, 200', ink: '#f6f4ea', inkSoft: 'rgba(246,244,234,0.66)',
  },
  autumn: {
    label: 'Autumn',
    mesh: ['#dca268', '#b5654a', '#eccea0', '#8fa9a0'],
    glass: '220, 180, 140', ink: '#f7efe4', inkSoft: 'rgba(247,239,228,0.66)',
  },
  winter: {
    label: 'Winter',
    mesh: ['#9fb8dd', '#5b6fae', '#d2c9ea', '#aebfe0'],
    glass: '180, 196, 224', ink: '#eef1f8', inkSoft: 'rgba(238,241,248,0.66)',
  },
  wet: {
    label: 'Wet season',
    mesh: ['#4fb39a', '#2f7d7a', '#9fe0c4', '#6fc7d6'],
    glass: '120, 200, 184', ink: '#eef8f2', inkSoft: 'rgba(238,248,242,0.66)',
  },
  dry: {
    label: 'Dry season',
    mesh: ['#cdb07a', '#a98b5b', '#dcc79a', '#93b08f'],
    glass: '214, 190, 150', ink: '#f6f1e6', inkSoft: 'rgba(246,241,230,0.66)',
  },
  'polar-day': {
    label: 'Polar day',
    mesh: ['#bcd6e6', '#9fc3dd', '#e6d4dd', '#cfe0ea'],
    glass: '198, 216, 230', ink: '#f4f8fb', inkSoft: 'rgba(244,248,251,0.66)',
  },
  'polar-night': {
    label: 'Polar night',
    mesh: ['#2a3a6a', '#16314f', '#3f6f8a', '#5a4a8a'],
    glass: '90, 116, 168', ink: '#eaf0fb', inkSoft: 'rgba(234,240,251,0.62)',
  },
  'polar-low': {
    label: 'Low sun',
    mesh: ['#9fb0c2', '#6f8296', '#d8b89a', '#aebac6'],
    glass: '170, 186, 202', ink: '#eef2f7', inkSoft: 'rgba(238,242,247,0.66)',
  },
};

/* ---------- Framing (atmospheric, non-factual) ---------- */

function framingLine(seasonKey, hemi, placeName) {
  const where = placeName || 'this place';
  switch (seasonKey) {
    case 'wet':
      return `The wet season has come to ${where}.`;
    case 'dry':
      return `It is the dry season in ${where}.`;
    case 'polar-day':
      return `The sun does not set over ${where}.`;
    case 'polar-night':
      return `Polar night holds ${where}.`;
    case 'polar-low':
      return `A low sun crosses ${where}.`;
    default: {
      const side =
        hemi === 'northern' ? 'Northern' :
        hemi === 'southern' ? 'Southern' : 'Equatorial';
      const label = STYLES[seasonKey] ? STYLES[seasonKey].label.toLowerCase() : 'season';
      return `${side} ${label} lies over ${where}.`;
    }
  }
}

/* ---------- Public API ---------- */

/**
 * Resolve the seasonal atmosphere for a habitat.
 *
 * @param {number} latitude   habitat latitude (degrees, -90..90)
 * @param {string} [placeName]
 * @param {Date}   [date]      defaults to now
 * @returns {{
 *   band: string, hemisphere: string, season: string, label: string,
 *   framing: string, cssVars: Record<string,string>
 * }}
 */
export function describeSeason(latitude, placeName, date = new Date()) {
  const lat = Number.isFinite(latitude) ? latitude : 0;
  const month = date.getMonth();
  const band = climateBand(lat);
  const hemi = hemisphere(lat);
  const north = hemi !== 'southern'; // equatorial treated as northern-ish

  let season;
  if (band === 'polar') season = polarSeason(month, north);
  else if (band === 'tropical') season = tropicalSeason(month, north);
  else season = temperateSeason(month, north);

  const style = STYLES[season] || STYLES.summer;

  return {
    band,
    hemisphere: hemi,
    season,
    label: style.label,
    framing: framingLine(season, hemi, placeName),
    cssVars: {
      '--mesh-a': style.mesh[0],
      '--mesh-b': style.mesh[1],
      '--mesh-c': style.mesh[2],
      '--mesh-d': style.mesh[3],
      '--glass-rgb': style.glass,
      '--ink': style.ink,
      '--ink-soft': style.inkSoft,
    },
  };
}

/** A calm, season-neutral palette for the overview (before a habitat
 *  is chosen). Twilight blues and a hint of dawn. */
export function overviewPalette() {
  return {
    '--mesh-a': '#3b5a86',
    '--mesh-b': '#243b63',
    '--mesh-c': '#6f8bb0',
    '--mesh-d': '#8a6f9e',
    '--glass-rgb': '150, 170, 210',
    '--ink': '#eef2fb',
    '--ink-soft': 'rgba(238,242,251,0.66)',
  };
}
