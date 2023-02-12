import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Common',
      fileName: 'common',
      formats: ['es', 'cjs', 'iife', 'umd'],
    },
  },
});
