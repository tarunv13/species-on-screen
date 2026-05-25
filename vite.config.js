import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Collect species HTML pages
const speciesPages = {};
try {
  const files = readdirSync(resolve(__dirname, 'species'));
  files.filter(f => f.endsWith('.html')).forEach(f => {
    const name = f.replace('.html', '');
    speciesPages[`species-${name}`] = resolve(__dirname, 'species', f);
  });
} catch (e) {
  // species/ directory may not exist yet during initial setup
}

// Collect canonical cinematic place pages.
// Platform architecture §7: cinematic and research live under distinct
// route groups. Places are the published canonical cinematic surface;
// each entry is bound to one verified narrative record. Prototypes
// live separately (see prototypePages) and are not promoted into this
// group without an explicit canonicalization pass.
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

// Collect prototype HTML pages
const prototypePages = {};
try {
  const files = readdirSync(resolve(__dirname, 'prototypes'));
  files.filter(f => f.endsWith('.html')).forEach(f => {
    const name = f.replace('.html', '');
    prototypePages[`prototype-${name}`] = resolve(__dirname, 'prototypes', f);
  });
} catch (e) {
  // prototypes/ directory may not exist yet
}

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
        ...speciesPages,
        ...placePages,
        ...prototypePages,
        ...notesPages
      }
    }
  }
});
