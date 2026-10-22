/**
 * Скачивание файлов на клиенте.
 *
 * Без библиотек: Blob + object URL + <a download>. Файл собирается
 * в памяти и уходит в загрузки браузера — сервер не нужен.
 */

/** Скачивает текст как файл. */
export function downloadText(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  // Ссылку нельзя удалять в том же кадре, что и клик: Firefox и Safari
  // успевают отменить загрузку. Ссылка должна пожить чуть дольше клика.
  window.setTimeout(() => document.body.removeChild(link), 0)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Расширение файла по языку примера. */
const extensionByLanguage: Record<string, string> = {
  gdscript: 'gd',
  gdshader: 'gdshader',
  json: 'json',
  ini: 'ini',
  shell: 'sh',
}

/**
 * Имя файла для примера кода.
 *
 * Путь вида `res://player.gd` превращается в `player.gd`. Если пути нет,
 * имя собирается из заголовка примера: кириллица заменяется на транслит
 * не полностью — допускаем любые буквы и цифры, остальное заменяем дефисом.
 */
export function filenameForExample(file: string | undefined, title: string, language: string): string {
  const extension = extensionByLanguage[language] ?? 'txt'

  if (file) {
    const name = file.replace(/^res:\/\//, '').split('/').pop() ?? file
    return name.includes('.') ? name : `${name}.${extension}`
  }

  const slug = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return `${slug || 'example'}.${extension}`
}

/** Собирает все примеры этапа в один markdown-файл. */
export function buildStageNotes(
  stageTitle: string,
  examples: Array<{
    title: string
    file?: string
    code: string
    explanation: string
    language?: string
  }>,
): string {
  const lines: string[] = [`# ${stageTitle}`, '', 'Примеры кода из курса «Godot 4 — пошагово».', '']

  for (const example of examples) {
    lines.push(`## ${example.title}`, '')
    if (example.file) {
      lines.push(`Файл: \`${example.file}\``, '')
    }
    // Язык определяет подсветку в markdown — у шейдеров и ini свой.
    const fence =
      example.language === 'gdshader'
        ? 'gdshader'
        : example.language === 'ini'
          ? 'ini'
          : example.language === 'json'
            ? 'json'
            : 'gdscript'
    lines.push(`\`\`\`${fence}`, example.code.trimEnd(), '```', '')
    lines.push(example.explanation.trim(), '')
  }

  return lines.join('\n')
}
