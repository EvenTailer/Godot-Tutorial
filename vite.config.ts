import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Статический SPA. Никаких внешних CDN и рантайм-запросов к API:
// весь контент лежит в src/content и попадает в бандл на этапе сборки.
export default defineConfig({
  plugins: [react()],
  // Относительные пути: сборка работает на любом статическом хостинге
  // и даже открытием dist/index.html напрямую с диска (DECISIONS.md, D-003).
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          content: [
            './src/content/stages/index.ts',
            './src/content/cheatsheets.ts',
            './src/content/faq.ts',
            './src/content/glossary.ts',
            './src/content/resources.ts',
            './src/content/plan-24-weeks.ts',
            './src/content/project-ladder.ts',
            './src/content/diagrams.ts',
          ],
        },
      },
    },
  },
})
