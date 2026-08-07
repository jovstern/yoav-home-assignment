// Kept separate from vite.config.ts: vitest 3.x's nested vite dependency
// (^7) and this project's vite 8 produce structurally incompatible Plugin
// types, which breaks `tsc -b` if merged into one typechecked config. This
// file is intentionally outside the tsconfig project graph — vitest loads
// it directly and doesn't need it typechecked.
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
