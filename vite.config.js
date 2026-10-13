import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages has no SPA fallback, so give the search page its own index.html
const searchPageRoute = () => ({
  name: 'search-page-route',
  apply: 'build',
  closeBundle() {
    const dist = resolve(__dirname, 'dist');
    mkdirSync(resolve(dist, 'sok'), { recursive: true });
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, 'sok/index.html'));
  },
});

export default defineConfig({
  // Set BASE_PATH=/a11y-demo/ when building for GitHub Pages
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), searchPageRoute()],
});
