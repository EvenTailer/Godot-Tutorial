import { readFileSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { gzipSync } from 'node:zlib'

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

const files = walk('dist')
let total = 0
const byExt = {}
for (const file of files) {
  const size = gzipSync(readFileSync(file)).length
  total += size
  const ext = extname(file) || '.html'
  byExt[ext] = (byExt[ext] ?? 0) + size
}

const html = readFileSync('dist/index.html', 'utf8')
const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1])
const styles = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1])
// Важно: браузер грузит и <link rel="modulepreload"> из index.html.
// Без их учёта «первая загрузка» занижена в разы (см. DECISIONS.md, D-037).
const preloads = [...html.matchAll(/rel="modulepreload"[^>]*href="([^"]+\.js)"/g)].map((m) => m[1])
let critical = gzipSync(html).length
for (const asset of [...scripts, ...styles, ...preloads]) {
  critical += gzipSync(readFileSync(join('dist', asset.replace('./', '')))).length
}

// Бюджеты:
//   сумма   — весь dist (важно, когда читатель проходит курс целиком);
//   первая  — до первого рендера (важно для каждого визита);
//   модуль  — самый тяжёлый чанк без react (важно для страницы этапа).
const TOTAL_BUDGET_KB = 310
const FIRST_LOAD_BUDGET_KB = 130
const CHUNK_BUDGET_KB = 40

console.log('файлов в dist:', files.length)
console.log('gzip всего:', (total / 1024).toFixed(1), 'KB', `(бюджет ${TOTAL_BUDGET_KB} KB)`)
console.log(
  Object.entries(byExt)
    .map(([ext, size]) => `${ext}: ${(size / 1024).toFixed(1)} KB`)
    .join(', '),
)
console.log(
  'первая загрузка (html + css + entry + modulepreload):',
  (critical / 1024).toFixed(1),
  'KB gzip',
  `(бюджет ${FIRST_LOAD_BUDGET_KB} KB)`,
)

if (total / 1024 > TOTAL_BUDGET_KB) {
  console.error(
    `\nПРЕВЫШЕН БЮДЖЕТ: сборка ${(total / 1024).toFixed(1)} KB gzip при лимите ${TOTAL_BUDGET_KB} KB`,
  )
  process.exitCode = 1
}

if (critical / 1024 > FIRST_LOAD_BUDGET_KB) {
  console.error(
    `\nПРЕВЫШЕНА ПЕРВАЯ ЗАГРУЗКА: ${(critical / 1024).toFixed(1)} KB gzip при лимите ${FIRST_LOAD_BUDGET_KB} KB`,
  )
  process.exitCode = 1
}

// Самый тяжёлый модуль без react: react общий для всех страниц и не грузится дважды.
let biggest = { name: '', size: 0 }
for (const file of files) {
  if (!file.endsWith('.js')) continue
  const name = file.split(/[\\/]/).pop()
  if (name.startsWith('react-')) continue
  const size = gzipSync(readFileSync(file)).length
  if (size > biggest.size) biggest = { name, size }
}
console.log(
  'самый тяжёлый модуль:',
  biggest.name,
  (biggest.size / 1024).toFixed(1),
  'KB gzip',
  `(бюджет ${CHUNK_BUDGET_KB} KB)`,
)

if (biggest.size / 1024 > CHUNK_BUDGET_KB) {
  console.error(
    `\nСЛИШКОМ ТЯЖЁЛЫЙ МОДУЛЬ: ${biggest.name} ${(biggest.size / 1024).toFixed(1)} KB gzip при лимите ${CHUNK_BUDGET_KB} KB`,
  )
  process.exitCode = 1
}
