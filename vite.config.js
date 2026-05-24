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

export default defineConfig({
  base: '/species-on-screen/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...speciesPages,
        ...prototypePages
      }
    }
  }
});
