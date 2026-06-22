/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // The deterministic core (pure layout fn + SVG markup) needs no DOM.
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
