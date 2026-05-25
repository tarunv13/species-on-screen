import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// `species/*.html` is the legacy product-register species directory.
// Excluded from production: the canonical research surface is
// `notes/*.html` (registry-backed), and the canonical cinematic
// surface is `places/*.html`. The species/ files remain on disk for
// historical reference but are not bundled, not routed, not
// reachable in dist/. See platform-architecture.md §7.

// Collect canonical cinematic place pages.
// Platform architecture §7: cinematic and research live under distinct
// route groups. Places are the published canonical cinematic surface;
// each entry is bound to one verified narrative record. Prototypes
// live separately (see policy note above on prototypes) and are not
// promoted into this group without an explicit canonicalization pass.
const placePages = {};
try {
  const files = readdirSync(resolve(__dirname, 'places'));
  files.filter(f => f.endsWith('.html')).forEach(f => {
    const name = f.replace('.html', '');
    placePages[`places-${name}`] = resolve(__dirname, 'places', f);
  });
} catch (e) {
  // places/ directory may not exist yet
}

// `prototypes/*.html` is the technical-stress-test directory.
// Excluded from production: prototypes are stress-tests, peer-tests,
// and counter-tests, not target product surfaces. They remain
// reachable under `npm run dev` (Vite's dev server serves files at
// rest from the project root) for active prototype work; they do
// not ship in dist/. Promotion path is an explicit canonicalization
// pass into `places/` (cinematic) or `notes/` (research), never an
// implicit listing here. See platform-architecture.md §7 and the
// 2026-05-25 repository audit §6.

// Collect research-surface notes pages.
// Platform architecture §7: cinematic and research live under distinct
// route groups. Notes are the research surface; their pages are bundled
// independently of the prototypes' pages.
const notesPages = {};
try {
  const files = readdirSync(resolve(__dirname, 'notes'));
  files.filter(f => f.endsWith('.html')).forEach(f => {
    const name = f.replace('.html', '');
    notesPages[`notes-${name}`] = resolve(__dirname, 'notes', f);
  });
} catch (e) {
  // notes/ directory may not exist yet
}

export default defineConfig({
  base: '/species-on-screen/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...placePages,
        ...notesPages
      }
    }
  }
});
