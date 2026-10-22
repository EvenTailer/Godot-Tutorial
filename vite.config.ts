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
        // Мелкие чанки-иконки склеиваются: так меньше HTTP-запросов на первой загрузке.
        experimentalMinChunkSize: 12000,
        manualChunks: {
          // react-dom/client — отдельная точка входа: без неё 64 KB gzip
          // остаются в entry-чанке и инвалидируют кэш при любой правке кода.
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          // Справочные модули: приходят вместе, когда читатель открывает
          // соответствующую страницу.
          content: [
            './src/content/cheatsheets.ts',
            './src/content/faq.ts',
            './src/content/glossary.ts',
            './src/content/resources.ts',
            './src/content/plan-24-weeks.ts',
            './src/content/project-ladder.ts',
            './src/content/diagrams.ts',
            './src/content/versions.ts',
          ],
          // Справочник ошибок — отдельным чанком: он нужен главной (счётчик)
          // и странице /errors, но не должен тащить за собой остальные модули.
          errors: ['./src/content/errors.ts'],
          // Этапы намеренно НЕ объединены: каждый грузится своим чанком
          // (import.meta.glob в StagePage), поэтому корпус курса не едет
          // вместе с любой страницей.
        },
      },
    },
  },
})
