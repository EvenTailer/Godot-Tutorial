#!/usr/bin/env node
/**
 * Проверка внутренних ссылок и якорей.
 *
 * Читает контент и вёрстку как текст, собирает все внутренние ссылки
 * (/stage/…, /errors#…, /faq#…) и проверяет, что цель существует.
 *
 * Ловит типовую ошибку: якорь ведёт на несуществующий раздел — после
 * правки контента ссылка молча перестаёт работать, и заметить это
 * вручную почти невозможно.
 *
 * Использование: node scripts/verify-links.mjs
 * Код возврата: 0 — все ссылки живы, 1 — есть битые.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const srcDir = join(root, 'src')

/* ------------------------------------------------------------------ */
/* Чтение исходников                                                    */
/* ------------------------------------------------------------------ */

function walk(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full)
  }
  return out
}

const files = walk(srcDir)

function readAll() {
  const map = new Map()
  for (const file of files) {
    map.set(relative(root, file).replace(/\\/g, '/'), readFileSync(file, 'utf8'))
  }
  return map
}

const sources = readAll()
const allText = [...sources.values()].join('\n')

/* ------------------------------------------------------------------ */
/* Факты о содержимом                                                    */
/* ------------------------------------------------------------------ */

/** Слаги этапов: slug: '…' из файлов этапов. */
function stageSlugs() {
  const slugs = new Set()
  for (const [name, text] of sources) {
    if (!name.includes('content/stages/stage-')) continue
    const match = text.match(/slug:\s*'([^']+)'/)
    if (match) slugs.add(match[1])
  }
  return slugs
}

/** Идентификаторы записей контента: id: '…' в нужном модуле. */
function idsFrom(file, prefix = '') {
  const text = sources.get(file)
  if (!text) return new Set()
  const ids = new Set()
  const pattern = /id:\s*'([^']+)'/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (!prefix || match[1].startsWith(prefix)) ids.add(match[1])
  }
  return ids
}

/** Якоря страницы этапа: topic-*, step-*, task-*, criterion-*, code-*. */
function stageAnchors() {
  const anchors = new Set()
  for (const [name, text] of sources) {
    if (!name.includes('content/stages/stage-')) continue
    const pattern = /\bid:\s*'([^']+)'/g
    let match
    while ((match = pattern.exec(text)) !== null) {
      anchors.add(`topic-${match[1]}`)
      anchors.add(`step-${match[1]}`)
      anchors.add(`task-${match[1]}`)
      anchors.add(`criterion-${match[1]}`)
      anchors.add(`code-${match[1]}`)
    }
  }
  return anchors
}

const slugs = stageSlugs()
const faqIds = idsFrom('src/content/faq.ts')
const glossaryIds = idsFrom('src/content/glossary.ts')
const errorIds = idsFrom('src/content/errors.ts')
const cheatSheetIds = idsFrom('src/content/cheatsheets.ts')
const stageAnchorsSet = stageAnchors()

/** Известные маршруты (без параметров). */
const ROUTES = new Set([
  '/',
  '/roadmap',
  '/plan',
  '/ladder',
  '/cheatsheets',
  '/errors',
  '/versions',
  '/resources',
  '/glossary',
  '/faq',
  '/404',
])

/* ------------------------------------------------------------------ */
/* Сбор ссылок                                                          */
/* ------------------------------------------------------------------ */

const problems = []
const seen = new Set()

function report(file, line, text, reason) {
  problems.push({ file, line, text, reason })
}

/** Внутренние ссылки вида to="/…", href="/…", href="#…", to="#…". */
const LINK_PATTERN = /(?:to|href)=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g

for (const [file, text] of sources) {
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    // Комментарии не содержат рабочих ссылок.
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return
    LINK_PATTERN.lastIndex = 0
    let match
    while ((match = LINK_PATTERN.exec(line)) !== null) {
      const raw = (match[1] ?? match[2] ?? match[3] ?? '').trim()
      if (!raw || raw.startsWith('http') || raw.startsWith('mailto:')) continue
      // Динамические ссылки собираются из данных — их нельзя проверить статически.
      if (raw.includes('${')) continue
      if (raw.startsWith('/')) {
        // Внутренний маршрут.
        const [path, hash] = raw.split('#')
        if (path.startsWith('/stage/')) {
          const slug = path.slice('/stage/'.length)
          if (!slugs.has(slug)) {
            report(file, index + 1, raw, `нет этапа со слагом «${slug}»`)
          }
        } else if (!ROUTES.has(path)) {
          report(file, index + 1, raw, `нет такого маршрута`)
        } else if (hash) {
          checkAnchor(file, index + 1, raw, path, hash)
        }
      } else if (raw.startsWith('#')) {
        const hash = raw.slice(1)
        if (hash && hash !== 'main') checkAnchor(file, index + 1, raw, '', hash)
      }
    }
  })
}

/** Куда указывает якорь — проверяем, что цель существует. */
function checkAnchor(file, line, raw, path, hash) {
  if (path === '/faq' || (!path && hash.startsWith('faq-'))) {
    if (!faqIds.has(hash)) report(file, line, raw, `в FAQ нет записи «${hash}»`)
    return
  }
  if (path === '/glossary' || (!path && hash.startsWith('glossary-'))) {
    const id = hash.replace(/^glossary-/, '')
    if (!glossaryIds.has(id)) report(file, line, raw, `в глоссарии нет записи «${id}»`)
    return
  }
  if (path === '/errors' || (!path && hash.startsWith('err-'))) {
    const id = hash.replace(/^err-/, '')
    if (!errorIds.has(id)) report(file, line, raw, `в справочнике ошибок нет записи «${id}»`)
    return
  }
  if (path === '/cheatsheets' || (!path && hash.startsWith('cheat-'))) {
    if (!cheatSheetIds.has(hash)) report(file, line, raw, `в шпаргалках нет «${hash}»`)
    return
  }
  if (hash.startsWith('topic-') || hash.startsWith('step-') || hash.startsWith('task-') || hash.startsWith('criterion-') || hash.startsWith('code-')) {
    if (!stageAnchorsSet.has(hash)) report(file, line, raw, `в этапах нет якоря «${hash}»`)
    return
  }
  if (path === '/stage/') {
    report(file, line, raw, 'якорь без указания этапа')
    return
  }
  // Прочие якоря (например, mini-project) проверяем по разметке.
  const markup = [...sources.values()].join('\n')
  if (!markup.includes(`id="${hash}"`)) {
    report(file, line, raw, `в разметке нет элемента с id="${hash}"`)
  }
}

/* ------------------------------------------------------------------ */
/* Внешние ссылки                                                       */
/* ------------------------------------------------------------------ */

const external = new Map()
const URL_PATTERN = /https?:\/\/[^\s'"`)]+/g
for (const [file, text] of sources) {
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    URL_PATTERN.lastIndex = 0
    let match
    while ((match = URL_PATTERN.exec(line)) !== null) {
      const url = match[0]
      if (!external.has(url)) external.set(url, [])
      external.get(url).push(`${file}:${index + 1}`)
    }
  })
}

const allowedHosts = new Set([
  'docs.godotengine.org',
  'godotengine.org',
  'discord.godotengine.org',
  'forum.godotengine.org',
  'github.com',
  'raw.githubusercontent.com',
  'kenney.nl',
  'opengameart.org',
  'itch.io',
  'godotengine.itch.io',
  'discord.gg',
  'gdscript.dev',
  'gdscript.com',
  'gdquest.com',
  'freesound.org',
  'fonts.google.com',
  'www.aseprite.org',
  'www.packtpub.com',
  'www.reddit.com',
  'git-scm.com',
  'www.w3.org',
])

for (const [url, places] of external) {
  let host = ''
  try {
    host = new URL(url).host
  } catch {
    report(places[0], 0, url, 'некорректный URL')
    continue
  }
  if (!allowedHosts.has(host)) {
    report(places[0], 0, url, `хост «${host}» не в списке проверенных`)
  }
}

/* ------------------------------------------------------------------ */
/* Уникальность навигации и якорей страниц                             */
/* ------------------------------------------------------------------ */

const navText = sources.get('src/components/layout/nav.ts') ?? ''
const navTargets = [...navText.matchAll(/to:\s*'([^']+)'/g)].map((m) => m[1])
const duplicates = navTargets.filter((target, index) => navTargets.indexOf(target) !== index)
for (const target of duplicates) {
  report('src/components/layout/nav.ts', 0, target, 'дубль маршрута в навигации')
}

/* ------------------------------------------------------------------ */
/* Итог                                                                 */
/* ------------------------------------------------------------------ */

console.log(`Проверено файлов: ${sources.size}`)
console.log(`Этапов: ${slugs.size}, якорей этапов: ${stageAnchorsSet.size}`)
console.log(`Внешних ссылок: ${external.size}`)
console.log(`Битых ссылок: ${problems.length}`)

if (problems.length > 0) {
  console.error('\n✗ БИТЫЕ ССЫЛКИ')
  for (const problem of problems) {
    console.error(`  ${problem.file}${problem.line ? `:${problem.line}` : ''} — ${problem.reason}\n    ${problem.text}`)
  }
  process.exit(1)
}

console.log('\nВсе внутренние ссылки и якоря ведут на существующие места.')
