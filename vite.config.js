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

export default defineConfig({
  base: '/species-on-screen/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...speciesPages
      }
    }
  }
});
