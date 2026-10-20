import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages has no SPA fallback, so give the search pages and the cart page their own index.html
const searchPageRoutes = () => ({
  name: 'search-page-routes',
  // Dev server: serve the accessible version's search and cart pages from its own index.html
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (/\/tillganglig\/(sok|varukorg)\/?(\?|$)/.test(req.url)) {
        req.url = req.url.replace(/tillganglig\/(sok|varukorg)\/?/, 'tillganglig/');
      }
      next();
    });
  },
  closeBundle() {
    const dist = resolve(__dirname, 'dist');
    mkdirSync(resolve(dist, 'sok'), { recursive: true });
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, 'sok/index.html'));
    mkdirSync(resolve(dist, 'tillganglig/sok'), { recursive: true });
    copyFileSync(resolve(dist, 'tillganglig/index.html'), resolve(dist, 'tillganglig/sok/index.html'));
    mkdirSync(resolve(dist, 'tillganglig/varukorg'), { recursive: true });
    copyFileSync(resolve(dist, 'tillganglig/index.html'), resolve(dist, 'tillganglig/varukorg/index.html'));
  },
});

export default defineConfig({
  // Set BASE_PATH=/a11y-demo/ when building for GitHub Pages
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), searchPageRoutes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accessible: resolve(__dirname, 'tillganglig/index.html'),
        errors: resolve(__dirname, 'fel/index.html'),
        qr: resolve(__dirname, 'qr/index.html'),
      },
    },
  },
});
