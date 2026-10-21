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
let critical = gzipSync(html).length
for (const asset of [...scripts, ...styles]) {
  critical += gzipSync(readFileSync(join('dist', asset.replace('./', '')))).length
}

console.log('файлов в dist:', files.length)
console.log('gzip всего:', (total / 1024).toFixed(1), 'KB')
console.log(
  Object.entries(byExt)
    .map(([ext, size]) => `${ext}: ${(size / 1024).toFixed(1)} KB`)
    .join(', '),
)
console.log('критический путь (html + css + entry js):', (critical / 1024).toFixed(1), 'KB gzip')
