import { defineConfig } from 'vitest/config';
import path from 'path';

// Use dynamic import for ESM-only package
async function loadConfig() {
  const react = (await import('@vitejs/plugin-react')).default;
  return defineConfig({
    plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mocks/**',
        '.next/',
        'coverage/',
        'supabase/',
        'specs/',
        '.specstory/',
      ],
      // Target 80% coverage
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
}

export default loadConfig();
