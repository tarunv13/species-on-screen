import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Dynamically find all species HTML files
const speciesPages = {};
const speciesDir = resolve(__dirname, 'species');
if (fs.existsSync(speciesDir)) {
  fs.readdirSync(speciesDir)
    .filter(f => f.endsWith('.html'))
    .forEach(f => {
      const name = f.replace('.html', '');
      speciesPages[`species-${name}`] = resolve(speciesDir, f);
    });
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
