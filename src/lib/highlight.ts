/**
 * Минимальный подсветщик GDScript и шейдеров.
 *
 * Собственная реализация вместо Prism/highlight.js: экономит ~40 KB gzip,
 * а нам нужен только GDScript и .gdshader (см. DECISIONS.md, D-006).
 *
 * Разметка не собирается строками с HTML: токены рендерится React-ом,
 * поэтому содержимое примера кода никогда не интерпретируется как разметка.
 */

export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'type'
  | 'number'
  | 'annotation'
  | 'builtin'
  | 'operator'

export interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set([
  'if',
  'elif',
  'else',
  'for',
  'while',
  'match',
  'break',
  'continue',
  'return',
  'pass',
  'func',
  'var',
  'const',
  'enum',
  'class',
  'class_name',
  'extends',
  'signal',
  'static',
  'await',
  'yield',
  'in',
  'as',
  'is',
  'not',
  'and',
  'or',
  'true',
  'false',
  'null',
  'self',
  'super',
  'breakpoint',
  'void',
  'export',
])

const TYPES = new Set([
  'int',
  'float',
  'bool',
  'String',
  'Vector2',
  'Vector2i',
  'Vector3',
  'Vector3i',
  'Color',
  'Node',
  'Node2D',
  'Node3D',
  'Control',
  'CanvasItem',
  'Resource',
  'RefCounted',
  'Object',
  'Array',
  'Dictionary',
  'PackedScene',
  'Callable',
  'Signal',
  'RID',
  'Texture2D',
  'AudioStream',
  'TileMapLayer',
  'TileSet',
  'CharacterBody2D',
  'CharacterBody3D',
  'Area2D',
  'Area3D',
  'StaticBody2D',
  'RigidBody2D',
  'CollisionShape2D',
  'CollisionShape3D',
  'Sprite2D',
  'AnimatedSprite2D',
  'AnimationPlayer',
  'Camera2D',
  'Camera3D',
  'MeshInstance3D',
  'Environment',
  'WorldEnvironment',
  'GPUParticles2D',
  'CPUParticles2D',
  'AudioStreamPlayer',
  'AudioStreamPlayer2D',
  'AudioStreamPlayer3D',
  'AudioServer',
  'Engine',
  'Time',
  'OS',
  'ProjectSettings',
  'FileAccess',
  'DirAccess',
  'JSON',
  'ConfigFile',
  'ResourceLoader',
  'ResourceSaver',
  'RandomNumberGenerator',
  'Tween',
  'SceneTree',
  'Image',
  'ShaderMaterial',
  'StandardMaterial3D',
  'BoxMesh',
  'SphereMesh',
  'CapsuleMesh',
  'RayCast2D',
  'RayCast3D',
  'SpringArm3D',
])

const BUILTINS = new Set([
  'print',
  'printerr',
  'push_warning',
  'push_error',
  'assert',
  'range',
  'len',
  'str',
  'int',
  'float',
  'bool',
  'min',
  'max',
  'clamp',
  'clampf',
  'clampi',
  'absf',
  'sign',
  'roundi',
  'move_toward',
  'randi',
  'randf',
  'randi_range',
  'randf_range',
  'randomize',
  'is_instance_valid',
  'typeof',
  'deg_to_rad',
  'linear_to_db',
  'db_to_linear',
  'load',
  'preload',
  'instantiate',
  'connect',
  'disconnect',
  'is_connected',
  'get_node',
  'get_tree',
  'add_child',
  'remove_child',
  'queue_free',
  'duplicate',
  'has_node',
  'get',
  'create_tween',
  'set_shader_parameter',
  'set_anchors_preset',
  'set_offsets_preset',
  'grab_focus',
  'set_process',
  'set_physics_process',
  'change_scene_to_file',
  'reload_current_scene',
  'add_to_group',
  'remove_from_group',
  'get_nodes_in_group',
  'get_first_node_in_group',
  'get_ticks_msec',
  'get_ticks_usec',
  'get_datetime_string_from_system',
  'get_user_data_dir',
  'globalize_path',
  'localize_path',
  'open',
  'store_string',
  'get_as_text',
  'get_line',
  'file_exists',
  'dir_exists_absolute',
  'make_dir_recursive_absolute',
  'remove_absolute',
  'get_open_error',
  'get_base_dir',
  'path_join',
  'stringify',
  'parse_string',
])

const SHADER_KEYWORDS = new Set([
  'shader_type',
  'render_mode',
  'uniform',
  'varying',
  'const',
  'void',
  'return',
  'if',
  'else',
  'for',
  'while',
  'break',
  'continue',
  'in',
  'inout',
  'out',
  'true',
  'false',
])

const SHADER_TYPES = new Set([
  'float',
  'int',
  'bool',
  'vec2',
  'vec3',
  'vec4',
  'ivec2',
  'ivec3',
  'ivec4',
  'bvec2',
  'bvec3',
  'bvec4',
  'mat2',
  'mat3',
  'mat4',
  'sampler2D',
  'sampler2DArray',
  'sampler3D',
  'samplerCube',
  'sampler2DHint',
])

const OPERATORS = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '==',
  '!=',
  '<',
  '>',
  '<=',
  '>=',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '&&',
  '||',
  '!',
  '->',
  ':=',
  '..',
])

function isWordStart(ch: string) {
  return /[A-Za-z_]/.test(ch)
}

function isWordPart(ch: string) {
  return /[A-Za-z0-9_]/.test(ch)
}

function pushWord(text: string, kind: TokenKind, out: Token[]) {
  if (!text) return
  out.push({ kind, text })
}

/** Разбирает одну строку GDScript на токены. */
function tokenizeGdscriptLine(line: string): Token[] {
  const out: Token[] = []
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    // Комментарий до конца строки
    if (ch === '#') {
      pushWord(line.slice(i), 'comment', out)
      return out
    }

    // Строки в двойных или одинарных кавычках
    if (ch === '"' || ch === "'") {
      const quote = ch
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === quote) {
          j += 1
          break
        }
        j += 1
      }
      pushWord(line.slice(i, Math.min(j, line.length)), 'string', out)
      i = j
      continue
    }

    // Аннотации
    if (ch === '@' && i + 1 < line.length && isWordStart(line[i + 1])) {
      let j = i + 1
      while (j < line.length && isWordPart(line[j])) j += 1
      pushWord(line.slice(i, j), 'annotation', out)
      i = j
      continue
    }

    // Числа
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(line[i + 1] ?? ''))) {
      let j = i
      while (j < line.length && /[0-9._]/.test(line[j])) j += 1
      pushWord(line.slice(i, j), 'number', out)
      i = j
      continue
    }

    // Слова
    if (isWordStart(ch)) {
      let j = i
      while (j < line.length && isWordPart(line[j])) j += 1
      const word = line.slice(i, j)
      if (KEYWORDS.has(word)) pushWord(word, 'keyword', out)
      else if (TYPES.has(word)) pushWord(word, 'type', out)
      else if (BUILTINS.has(word)) pushWord(word, 'builtin', out)
      else pushWord(word, 'plain', out)
      i = j
      continue
    }

    // Операторы
    if (OPERATORS.has(ch)) {
      let j = i
      const two = line.slice(i, i + 2)
      if (OPERATORS.has(two)) j = i + 2
      else j = i + 1
      pushWord(line.slice(i, j), 'operator', out)
      i = j
      continue
    }

    pushWord(ch, 'plain', out)
    i += 1
  }

  return out
}

/** Разбирает одну строку шейдера. */
function tokenizeShaderLine(line: string): Token[] {
  const out: Token[] = []
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    if (ch === '#') {
      pushWord(line.slice(i), 'comment', out)
      return out
    }

    if (ch === '"' || ch === "'") {
      const quote = ch
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === quote) {
          j += 1
          break
        }
        j += 1
      }
      pushWord(line.slice(i, Math.min(j, line.length)), 'string', out)
      i = j
      continue
    }

    if (isWordStart(ch)) {
      let j = i
      while (j < line.length && isWordPart(line[j])) j += 1
      const word = line.slice(i, j)
      if (SHADER_KEYWORDS.has(word)) pushWord(word, 'keyword', out)
      else if (SHADER_TYPES.has(word)) pushWord(word, 'type', out)
      else if (word === 'TEXTURE' || word === 'UV' || word === 'COLOR' || word === 'TIME') {
        pushWord(word, 'annotation', out)
      } else pushWord(word, 'plain', out)
      i = j
      continue
    }

    pushWord(ch, 'plain', out)
    i += 1
  }

  return out
}

/** Возвращает строки кода как массив массивов токенов. */
export function highlight(code: string, language: 'gdscript' | 'gdshader' = 'gdscript'): Token[][] {
  return code.split('\n').map((line) =>
    language === 'gdshader' ? tokenizeShaderLine(line) : tokenizeGdscriptLine(line),
  )
}
