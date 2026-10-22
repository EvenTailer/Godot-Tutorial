#!/usr/bin/env node
/**
 * Сверка справочника ошибок с настоящим движком Godot.
 *
 * Справочник (src/content/errors.ts) учит читателя узнавать сообщения движка.
 * Значит, сообщения должны быть дословными — иначе справка врёт читателю.
 *
 * Скрипт для каждой записи запускает минимальный пример в Godot headless,
 * ловит реальный текст ошибки и сравнивает его с указанным в справочнике.
 *
 * Использование:
 *   node scripts/verify-error-messages.mjs
 *   GODOT_BIN="D:\...\godot.exe" node scripts/verify-error-messages.mjs
 *
 * Код возврата: 0 — все сообщения совпали, 1 — есть расхождения, 2 — нет Godot.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const workDir = join(tmpdir(), 'godot-guide-errors')
const projectDir = join(workDir, 'project')

/* ------------------------------------------------------------------ */
/* Поиск бинаря Godot                                                   */
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
/* Сценарии: минимальный код, который вызывает ошибку                  */
/* ------------------------------------------------------------------ */

/**
 * mode:
 *   parse   — ошибка разбора, ловится через --check-only
 *   runtime — ошибка во время выполнения, ловится через --script
 */
const CASES = [
  {
    id: 'err-identifier',
    mode: 'parse',
    code: `extends SceneTree

func _init():
	print(velocty)
`,
  },
  {
    id: 'err-indent',
    mode: 'parse',
    code: `extends SceneTree

func _init():
	print(1)
		print(2)
`,
  },
  {
    id: 'err-member',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var node: Node = Node.new()
	node.move_and_slide()
`,
  },
  {
    id: 'err-infer',
    mode: 'parse',
    code: `extends SceneTree

func _init():
	var data = {}
	var damage := data["damage"]
	print(damage)
`,
  },
  {
    id: 'err-nil-access',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var node = null
	print(node.velocity)
`,
  },
  {
    id: 'err-nonexistent-call',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var scene = null
	print(scene.instantiate())
`,
  },
  {
    id: 'err-null-instance',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var node = null
	node.get_node("Player")
`,
  },
  {
    id: 'err-operands',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var items = {}
	print(items.get("hp") + 1)
`,
  },
  {
    id: 'err-signal-call',
    mode: 'parse',
    code: `extends SceneTree

func _init():
	var button := Button.new()
	button.pressed()
`,
  },
  {
    id: 'err-assert',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	assert(1 > 2)
`,
  },
  {
    id: 'err-node-not-found',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var node := Node.new()
	root.add_child(node)
	node.get_node("Player/Sprite2D")
`,
  },
  {
    id: 'err-resource-missing',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	print(load("res://scenes/enemy.tscn"))
`,
  },
  {
    id: 'err-preload-missing',
    mode: 'parse',
    code: `extends SceneTree

func _init():
	print(preload("res://scenes/enemy.tscn"))
`,
  },
  {
    id: 'err-json',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	print(JSON.parse_string("abc"))
`,
  },
  {
    id: 'err-call-null',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var player: Node2D = null
	player.queue_free()
`,
  },
  {
    id: 'err-flush',
    mode: 'runtime',
    code: `extends SceneTree

func _init():
	var area := Area2D.new()
	root.add_child(area)
	var shape := CollisionShape2D.new()
	shape.shape = RectangleShape2D.new()
	area.add_child(shape)
	area.area_entered.connect(_on_area_entered)

func _on_area_entered(_other: Area2D) -> void:
	var area := get_root().get_node("Area2D")
	area.set_monitoring(false)
`,
  },
]

/* ------------------------------------------------------------------ */
/* Извлечение ожидаемых сообщений из справочника                       */
/* ------------------------------------------------------------------ */

function expectedMessages() {
  const source = readFileSync(join(root, 'src', 'content', 'errors.ts'), 'utf8')
  const result = new Map()

  // Каждая запись справочника начинается с id: 'err-…'.
  const positions = [...source.matchAll(/id:\s*'(err-[a-z0-9-]+)'/g)]
  positions.forEach((match, index) => {
    const start = match.index + match[0].length
    const end = index + 1 < positions.length ? positions[index + 1].index : source.length
    const block = source.slice(start, end)

    const message = block.match(/message:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/)
    if (!message) return
    const sourceVerified = /sourceVerified:\s*true/.test(block)
    const text = (message[1] ?? message[2]).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')

    result.set(match[1], {
      message: text,
      sourceVerified,
    })
  })

  return result
}

/* ------------------------------------------------------------------ */
/* Запуск Godot и разбор вывода                                         */
/* ------------------------------------------------------------------ */

function writeProject() {
  mkdirSync(projectDir, { recursive: true })
  writeFileSync(
    join(projectDir, 'project.godot'),
    'config_version=5\n\n[application]\n\nconfig/name="errors-verify"\n\n[rendering]\n\nrenderer/rendering_method="gl_compatibility"\n',
    'utf8',
  )
}

function runCase(godot, testCase) {
  const fileName = `case_${testCase.id}.gd`
  writeFileSync(join(projectDir, fileName), testCase.code, 'utf8')

  const args =
    testCase.mode === 'parse'
      ? ['--headless', '--path', projectDir, '--check-only', '--script', `res://${fileName}`]
      : [
          '--headless',
          '--path',
          projectDir,
          // Без --quit-after движок продолжает крутить главный цикл после ошибки
          // и процесс не завершится.
          '--quit-after',
          '2',
          '--script',
          `res://${fileName}`,
        ]

  const result = spawnSync(godot, args, { encoding: 'utf8', timeout: 60000 })
  const output = `${result.stdout || ''}\n${result.stderr || ''}`

  const messages = []
  for (const line of output.split('\n')) {
    const trimmed = line.trim()
    let message = null
    if (trimmed.includes('SCRIPT ERROR:')) {
      message = trimmed.replace(/^.*SCRIPT ERROR:\s*/, '')
    } else if (trimmed.startsWith('ERROR:')) {
      message = trimmed.replace(/^ERROR:\s*/, '')
    }
    if (!message) continue
    message = message.replace(/\s*at:\s.*$/, '').trim()
    message = message.replace(/^Parse Error:\s*/, '').trim()
    if (message) messages.push(message)
  }
  return messages
}

/* ------------------------------------------------------------------ */
/* main                                                                 */
/* ------------------------------------------------------------------ */

const godot = findGodot()
if (!godot) {
  console.error(
    'Godot не найден. Укажите путь через переменную окружения GODOT_BIN\n' +
      'Пример:  GODOT_BIN="D:\\SteamLibrary\\steamapps\\common\\Godot Engine\\godot.windows.opt.tools.64.exe" node scripts/verify-error-messages.mjs',
  )
  process.exit(2)
}

rmSync(workDir, { recursive: true, force: true })
writeProject()

const expected = expectedMessages()
let failed = 0
const report = []

for (const testCase of CASES) {
  const entry = expected.get(testCase.id)
  process.stdout.write(`· ${testCase.id} … `)

  if (!entry) {
    failed++
    report.push(`✗ ${testCase.id}: в справочнике нет записи с таким id`)
    continue
  }

  if (entry.sourceVerified) {
    report.push(`— ${testCase.id}: подтверждено по исходникам движка, автопроверка пропущена`)
    continue
  }

  const messages = runCase(godot, testCase)
  const found = messages.find((message) => normalize(message) === normalize(entry.message))

  if (found) {
    report.push(`✓ ${testCase.id}`)
    continue
  }

  failed++
  report.push(
    `✗ ${testCase.id}: сообщение движка не совпало со справочником\n` +
      `      в справочнике: ${entry.message}\n` +
      `      в движке:     ${messages[0] ?? '(сообщения нет — движок молчит)'}`,
  )
}

/** Пробелы, типы кавычек и имя узла в хвосте сообщения не важны. */
function normalize(message) {
  return message
    .replace(/\(relative to "[^"]*"\)/g, '(relative to "…")')
    .replace(/\(absolute path attempted from "[^"]*"\)/g, '(absolute path attempted from "…")')
    .replace(/["“”]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

rmSync(workDir, { recursive: true, force: true })

console.log(report.join('\n'))
console.log(`\nПроверено записей справочника: ${CASES.length}`)
console.log(`Расхождений с движком: ${failed}`)
console.log(`Godot: ${godot}`)

if (failed > 0) {
  console.error('\nПровалено. Справочник должен дословно совпадать с сообщениями движка.')
  process.exit(1)
}

console.log('\nСообщения справочника совпадают с сообщениями Godot.')
