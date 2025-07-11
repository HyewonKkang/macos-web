import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@apps': '/src/apps',
      '@kernel': '/src/kernel',
      '@platform': '/src/platform',
      '@system': '/src/system',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
