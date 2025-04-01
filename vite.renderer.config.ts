import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(__dirname, 'dist/berkeliumlabs/browser'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, '.vite/renderer/main_window'),
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: path.resolve('dist/berkeliumlabs/browser/index.html'),
      },
    },
  },
});
