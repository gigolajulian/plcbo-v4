import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* GitHub Pages serves a project site from /<repo>/, so the workflow sets VITE_BASE.
     Locally and on any host serving from the root it stays "/". */
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  /* host "localhost", not 127.0.0.1: the Adobe Fonts kit is domain-locked and the
     numeric host is not on the list, so fonts fall back silently there. */
  server: { host: 'localhost', port: 4175, strictPort: true },
});
