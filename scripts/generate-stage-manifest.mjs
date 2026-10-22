#!/usr/bin/env node
/**
 * Генерация манифеста этапов.
 *
 * Зачем: корпус курса (13 этапов) — это ~104 KB gzip. Если страница импортирует
 * его статически, весь корпус едет вместе с ней. Манифест содержит только
 * «лёгкие» данные (заголовки, счётчики, идентификаторы и подписи пунктов) —
 * этого хватает главной, дорожной карте, плану, лестнице, глоссарию и прогрессу.
 * Тело этапа (темы, шаги, код, задания) грузится отдельным чанком, когда
 * читатель открывает этап.
 *
 * Файл манифеста ГЕНЕРИРУЕТСЯ и проверяется скриптом: `npm run verify:manifest`
 * пересобирает манифест и падает, если он разошёлся с контентом. Так данные
 * не могут разъехаться молча (правило D-030).
 *
 * Использование:
 *   node scripts/generate-stage-manifest.mjs          # перезаписать манифест
 *   node scripts/generate-stage-manifest.mjs --check  # только проверить
 */

import { build } from 'esbuild'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const stagesDir = join(root, 'src', 'content', 'stages')
const stagesEntry = join(stagesDir, 'index.ts')
const manifestPath = join(stagesDir, 'manifest.ts')

const CHECK_ONLY = process.argv.includes('--check')

/** Имя файла этапа: stage-03-2d-movement-physics.ts и подобные. */
function fileForStage(number) {
  const prefix = `stage-${String(number).padStart(2, '0')}-`
  const match = readdirSync(stagesDir).find((name) => name.startsWith(prefix))
  if (!match) throw new Error(`Не найден файл этапа ${prefix}*`)
  return match
}

/** Длинные тексты критериев обрезаем: в карточке «продолжить» хватает начала фразы. */
function shortLabel(text, limit = 80) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean
}

async function loadStages() {
  const result = await build({
    entryPoints: [stagesEntry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  )
  return module.stages
}

function buildManifest(stages) {
  return stages.map((stage) => {
    const items = [
      ...stage.topics.map((t) => ({ kind: 'topic', id: t.id, label: shortLabel(t.title, 60) })),
      ...stage.steps.map((s) => ({ kind: 'step', id: s.id, label: shortLabel(s.title, 60) })),
      ...stage.tasks.map((t) => ({ kind: 'task', id: t.id, label: shortLabel(t.title, 60) })),
      { kind: 'project', id: 'project', label: shortLabel(stage.project.title, 60) },
      ...stage.criteria.map((c) => ({ kind: 'criterion', id: c.id, label: shortLabel(c.text, 80) })),
    ]

    return {
      id: stage.id,
      number: stage.number,
      slug: stage.slug,
      file: fileForStage(stage.number),
      title: stage.title,
      shortTitle: stage.shortTitle,
      subtitle: stage.subtitle,
      weeks: stage.weeks,
      hours: stage.hours,
      goal: stage.goal,
      outcome: stage.outcome,
      projectTitle: stage.project.title,
      counts: {
        topics: stage.topics.length,
        steps: stage.steps.length,
        tasks: stage.tasks.length,
        criteria: stage.criteria.length,
        code: stage.code.length,
        gdscript: stage.code.filter((example) => example.language === 'gdscript').length,
        total:
          stage.topics.length +
          stage.steps.length +
          stage.tasks.length +
          stage.criteria.length +
          1,
      },
      items,
    }
  })
}

function renderManifest(manifest) {
  const header = `/**
 * МАНИФЕСТ ЭТАПОВ — ФАЙЛ СГЕНЕРИРОВАН.
 *
 * Не редактируйте вручную: правьте этапы в src/content/stages/stage-*.ts
 * и пересобирайте манифест: npm run verify:manifest
 *
 * Что здесь: «лёгкие» данные этапа — заголовки, счётчики, идентификаторы
 * и подписи отмечаемых пунктов. Этого хватает всем страницам, кроме самой
 * страницы этапа: тело этапа (темы, шаги, код, задания) грузится отдельным
 * ленивым чанком и в первую загрузку не попадает.
 *
 * Сгенерировано: scripts/generate-stage-manifest.mjs
 */

export interface ManifestItem {
  kind: 'topic' | 'step' | 'task' | 'criterion' | 'project'
  id: string
  label: string
}

export interface StageManifest {
  id: string
  number: number
  slug: string
  /** Файл этапа в src/content/stages — по нему грузится тело этапа. */
  file: string
  title: string
  shortTitle: string
  subtitle: string
  weeks: string
  hours: number
  goal: string
  outcome: string
  projectTitle: string
  counts: {
    topics: number
    steps: number
    tasks: number
    criteria: number
    code: number
    gdscript: number
    total: number
  }
  /** Отмечаемые пункты в порядке страницы этапа. */
  items: ManifestItem[]
}

`

  const body = manifest
    .map(
      (entry) => `  {
    id: ${JSON.stringify(entry.id)},
    number: ${entry.number},
    slug: ${JSON.stringify(entry.slug)},
    file: ${JSON.stringify(entry.file)},
    title: ${JSON.stringify(entry.title)},
    shortTitle: ${JSON.stringify(entry.shortTitle)},
    subtitle: ${JSON.stringify(entry.subtitle)},
    weeks: ${JSON.stringify(entry.weeks)},
    hours: ${entry.hours},
    goal: ${JSON.stringify(entry.goal)},
    outcome: ${JSON.stringify(entry.outcome)},
    projectTitle: ${JSON.stringify(entry.projectTitle)},
    counts: ${JSON.stringify(entry.counts)},
    items: [
${entry.items.map((item) => `      { kind: ${JSON.stringify(item.kind)}, id: ${JSON.stringify(item.id)}, label: ${JSON.stringify(item.label)} },`).join('\n')}
    ],
  },`,
    )
    .join('\n')

  return `${header}export const stageManifest: StageManifest[] = [\n${body}\n]\n\n/** Манифест по id этапа. */\nexport const stageManifestById = new Map(stageManifest.map((stage) => [stage.id, stage]))\n\n/** Манифест по slug этапа. */\nexport const stageManifestBySlug = new Map(stageManifest.map((stage) => [stage.slug, stage]))\n\n/** Итоги по курсу — считаются по манифесту, чтобы не тянуть корпус. */\nexport const courseTotals = {\n  stages: stageManifest.length,\n  hours: ${manifest.reduce((sum, s) => sum + s.hours, 0)},\n  code: ${manifest.reduce((sum, s) => sum + s.counts.code, 0)},\n  gdscript: ${manifest.reduce((sum, s) => sum + s.counts.gdscript, 0)},\n  tasks: ${manifest.reduce((sum, s) => sum + s.counts.tasks, 0)},\n  items: ${manifest.reduce((sum, s) => sum + s.items.length, 0)},\n}\n`
}

const stages = await loadStages()
const manifest = buildManifest(stages)
const content = renderManifest(manifest)

if (CHECK_ONLY) {
  const current = readFileSync(manifestPath, 'utf8')
  if (current !== content) {
    console.error(
      'Манифест этапов разошёлся с контентом.\n' +
        'Запустите: node scripts/generate-stage-manifest.mjs',
    )
    process.exit(1)
  }
  console.log(`Манифест в порядке: ${manifest.length} этапов, ${manifest.reduce((sum, s) => sum + s.items.length, 0)} пунктов.`)
} else {
  writeFileSync(manifestPath, content, 'utf8')
  console.log(
    `Манифест записан: ${manifest.length} этапов, ${manifest.reduce((sum, s) => sum + s.items.length, 0)} пунктов, ${(content.length / 1024).toFixed(1)} KB.`,
  )
}
