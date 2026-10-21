#!/usr/bin/env node
/**
 * Проверка всех GDScript-примеров сайта настоящим движком Godot.
 *
 * 1. Достаёт код из типизированных контент-модулей в папке src/content.
 * 2. Проверяет отступы (Godot style: табы, не пробелы).
 * 3. Собирает временный проект Godot, создаёт заглушки для упомянутых res://-файлов.
 * 4. Прогоняет каждый пример через `godot --headless --check-only --script`.
 *
 * Использование:
 *   node scripts/verify-godot-examples.mjs
 *   GODOT_BIN="D:\...\godot.exe" node scripts/verify-godot-examples.mjs
 *
 * Если Godot не найден — скрипт завершается с кодом 2 и понятным сообщением.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const contentDir = join(root, 'src', 'content')
const workDir = join(tmpdir(), 'godot-guide-verify')

/* ------------------------------------------------------------------ */
/* Поиск бинаря Godot                                                  */
/* ------------------------------------------------------------------ */

const CANDIDATES = [
  process.env.GODOT_BIN,
  'D:\\SteamLibrary\\steamapps\\common\\Godot Engine\\godot.windows.opt.tools.64.exe',
  'C:\\Program Files\\Godot\\godot.windows.opt.tools.64.exe',
  'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Godot Engine\\godot.windows.opt.tools.64.exe',
  'C:\\Program Files\\Steam\\steamapps\\common\\Godot Engine\\godot.windows.opt.tools.64.exe',
].filter(Boolean)

function findGodot() {
  for (const candidate of CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Извлечение примеров                                                  */
/* ------------------------------------------------------------------ */

function walk(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name.endsWith('.ts')) out.push(full)
  }
  return out
}

const CODE_BLOCK = /code:\s*`([\s\S]*?)`/g
const LANGUAGE = /language:\s*'(\w+)'/g

/** В модуле поля language и code идут парами в одном порядке. */
function extractExamples() {
  const examples = []
  let globalIndex = 0
  for (const file of walk(contentDir)) {
    const source = readFileSync(file, 'utf8')
    const codes = []
    let match
    CODE_BLOCK.lastIndex = 0
    while ((match = CODE_BLOCK.exec(source)) !== null) {
      codes.push({ index: match.index, code: match[1] })
    }
    const languages = []
    LANGUAGE.lastIndex = 0
    while ((match = LANGUAGE.exec(source)) !== null) {
      languages.push({ index: match.index, language: match[1] })
    }
    codes.forEach((entry, i) => {
      const previous = languages.filter((l) => l.index < entry.index).pop()
      examples.push({
        file: file.slice(root.length + 1),
        index: globalIndex++,
        localIndex: i,
        language: previous ? previous.language : 'gdscript',
        code: entry.code,
      })
    })
  }
  return examples
}

/* ------------------------------------------------------------------ */
/* Проверка отступов                                                     */
/* ------------------------------------------------------------------ */

function checkIndentation(example) {
  const problems = []
  example.code.split('\n').forEach((line, i) => {
    const indent = line.match(/^[ \t]*/)[0]
    if (indent.includes(' ')) {
      problems.push(`строка ${i + 1}: пробелы в отступе (в GDScript используются табы)`)
    }
  })
  return problems
}

/* ------------------------------------------------------------------ */
/* Временный проект и заглушки                                          */
/* ------------------------------------------------------------------ */

// Порядок расширений важен: 'gdshader' должен проверяться раньше 'gd'.
const RES_REF = /res:\/\/[A-Za-z0-9_\-./]+\.(tscn|tres|gdshader|gd|png|ogg|wav|res)\b/g

function stubFor(path) {
  if (path.endsWith('.tscn')) {
    return '[gd_scene format=3]\n\n[node name="Stub" type="Node2D"]\n'
  }
  if (path.endsWith('.tres')) {
    return '[gd_resource type="Resource" format=3]\n'
  }
  if (path.endsWith('.gd')) {
    return 'extends RefCounted\n'
  }
  if (path.endsWith('.gdshader')) {
    return 'shader_type canvas_item;\n\nvoid fragment() {\n\tCOLOR = texture(TEXTURE, UV);\n}\n'
  }
  return ''
}

function ensureStub(projectDir, resPath) {
  const relative = resPath.replace('res://', '')
  const target = join(projectDir, relative)
  if (existsSync(target)) return
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, stubFor(relative), 'utf8')
}

function writeProject(projectDir) {
  mkdirSync(projectDir, { recursive: true })
  writeFileSync(
    join(projectDir, 'project.godot'),
    'config_version=5\n\n[application]\n\nconfig/name="verify"\n\n[rendering]\n\nrenderer/rendering_method="gl_compatibility"\n',
    'utf8',
  )
}

/* ------------------------------------------------------------------ */
/* Импорт проекта: строит кэш глобальных классов (class_name)          */
/* ------------------------------------------------------------------ */

function importProject(godot, projectDir) {
	const result = spawnSync(godot, ['--headless', '--path', projectDir, '--import'], {
		encoding: 'utf8',
	})
	if (result.status === 0) return true
	const fallback = spawnSync(godot, ['--headless', '--path', projectDir, '--editor', '--quit'], {
		encoding: 'utf8',
	})
	return fallback.status === 0
}

/* ------------------------------------------------------------------ */
/* Проверка синтаксиса                                                  */
/* ------------------------------------------------------------------ */

function checkSyntax(godot, projectDir, example) {
  const fileName = `example_${example.index}.gd`
  writeFileSync(join(projectDir, fileName), example.code, 'utf8')
  const result = spawnSync(
    godot,
    ['--headless', '--path', projectDir, '--check-only', '--script', `res://${fileName}`],
    { encoding: 'utf8' },
  )
  const output = `${result.stdout || ''}\n${result.stderr || ''}`
  if (result.status === 0) return null
  const lines = output
    .split('\n')
    .filter((l) => /Parse Error|SCRIPT ERROR|Compile Error/i.test(l))
    .slice(0, 6)
    .map((l) => l.trim())
  return lines.length ? lines.join('\n      ') : `код возврата ${result.status}`
}

/* ------------------------------------------------------------------ */
/* Связка шейдера и параметров                                          */
/* ------------------------------------------------------------------ */

/**
 * Headless-режим не компилирует шейдеры (задача рендерера отключена),
 * поэтому проверяем их вручную: объявленные uniform должны совпадать
 * с именами, которые код передаёт через set_shader_parameter().
 */
function checkShaderParameters(examples) {
  const byFile = new Map()
  for (const example of examples) {
    const list = byFile.get(example.file) ?? []
    list.push(example)
    byFile.set(example.file, list)
  }

  const problems = []
  for (const [file, list] of byFile) {
    const uniforms = new Set()
    for (const example of list) {
      if (example.language !== 'gdshader') continue
      for (const match of example.code.matchAll(/uniform\s+\w+\s+(\w+)/g)) {
        uniforms.add(match[1])
      }
    }
    if (uniforms.size === 0) continue

    for (const example of list) {
      if (example.language !== 'gdscript') continue
      for (const match of example.code.matchAll(/set_shader_parameter\(\s*"([^"]+)"/g)) {
        const name = match[1]
        if (!uniforms.has(name)) {
          problems.push(`${file} [${example.index}]: параметр "${name}" не объявлен ни в одном шейдере файла`)
        }
      }
    }
  }
  return problems
}

/* ------------------------------------------------------------------ */
/* main                                                                 */
/* ------------------------------------------------------------------ */

const godot = findGodot()
if (!godot) {
  console.error(
    'Godot не найден. Укажите путь через переменную окружения GODOT_BIN\n' +
      'Пример:  GODOT_BIN="D:\\SteamLibrary\\steamapps\\common\\Godot Engine\\godot.windows.opt.tools.64.exe" node scripts/verify-godot-examples.mjs',
  )
  process.exit(2)
}

rmSync(workDir, { recursive: true, force: true })
const projectDir = join(workDir, 'project')
writeProject(projectDir)

const allExamples = extractExamples()
const examples = allExamples.filter((e) => e.language === 'gdscript')
const skipped = allExamples.length - examples.length

if (examples.length === 0) {
  console.error('Не найдено ни одного GDScript-примера в src/content')
  process.exit(2)
}

let failed = 0

// Сначала раскладываем все примеры по проекту и импортируем его:
// это регистрирует class_name в кэше глобальных классов,
// поэтому self-reference (ItemData.new() внутри item_data.gd) разрешается.
for (const example of examples) {
  writeFileSync(join(projectDir, `example_${example.index}.gd`), example.code, 'utf8')
  for (const ref of example.code.match(RES_REF) ?? []) {
    ensureStub(projectDir, ref)
  }
}

const imported = importProject(godot, projectDir)
if (!imported) {
  console.warn('⚠ Не удалось импортировать временный проект: self-reference на class_name может не разрешиться.')
}

for (const example of examples) {
  const label = `${example.file} [${example.index}]`
  const indentProblems = checkIndentation(example)
  if (indentProblems.length) {
    failed++
    console.error(`\n✗ ОТСТУПЫ ${label}\n      ${indentProblems.join('\n      ')}`)
  }
  const syntaxError = checkSyntax(godot, projectDir, example)
  if (syntaxError) {
    failed++
    console.error(`\n✗ СИНТАКСИС ${label}\n      ${syntaxError}`)
  }
}

rmSync(workDir, { recursive: true, force: true })

const shaderProblems = checkShaderParameters(examples)
if (shaderProblems.length) {
  failed += shaderProblems.length
  console.error('\n✗ ШЕЙДЕРЫ')
  for (const problem of shaderProblems) console.error(`      ${problem}`)
}

console.log(`\nПроверено GDScript-примеров: ${examples.length} (пропущено не-GDScript блоков: ${skipped})`)
console.log(`Ошибок синтаксиса/отступов: ${failed}`)
console.log(`Godot: ${godot}`)

if (failed > 0) {
  console.error('\nПровалено. Исправьте примеры и запустите проверку снова.')
  process.exit(1)
}

console.log('\nВсе примеры разбираются Godot без ошибок.')
