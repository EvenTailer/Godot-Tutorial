/**
 * Клиентский индекс поиска.
 *
 * Объём контента — десятки тысяч символов, полный перебор в памяти занимает
 * меньше миллисекунды, поэтому внешние библиотеки не нужны (DECISIONS.md, D-007).
 *
 * Индекс грузится ЛЕНИВО: корпус курса (13 этапов) весит больше сотни
 * килобайт и не должен ехать вместе с каждой страницей. Пока читатель
 * не начал искать, корпус не грузится вовсе.
 */

/** Тела этапов — отдельными ленивыми чанками (те же, что и на странице этапа). */
const stageModules = import.meta.glob('../content/stages/stage-*.ts')

export type SearchKind = 'stage' | 'topic' | 'code' | 'cheat' | 'faq' | 'glossary' | 'error'

export interface SearchEntry {
  id: string
  kind: SearchKind
  title: string
  /** Короткое описание — попадает в выдачу. */
  summary: string
  /** Ссылка для перехода. */
  href: string
  /** Текст для поиска (пониженный регистр). */
  haystack: string
  /** Этап, к которому относится запись. */
  stageId?: string
}

export interface SearchResult extends SearchEntry {
  /** Совпадения в заголовке весят больше, чем в тексте. */
  score: number
  /** Фрагменты текста с подсветкой совпадений. */
  snippets: string[]
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е')
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let cachedIndex: SearchEntry[] | null = null
let pending: Promise<SearchEntry[]> | null = null

/**
 * Загружает корпус и строит индекс.
 *
 * Повторные вызовы возвращают тот же индекс: сборка идёт один раз.
 */
export function loadSearchIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex)
  if (!pending) {
    pending = (async () => {
      const [stageModulesList, cheatsheets, faq, glossary, errors] = await Promise.all([
        Promise.all(Object.values(stageModules).map((load) => load())),
        import('@/content/cheatsheets'),
        import('@/content/faq'),
        import('@/content/glossary'),
        import('@/content/errors'),
      ])

      const stages = stageModulesList.map((module) => {
        const values = Object.values(module as Record<string, unknown>)
        return values[0] as SearchStage
      })

      cachedIndex = buildIndex(stages, cheatsheets.cheatSheets, faq.faq, glossary.glossary, errors.godotErrors)
      return cachedIndex
    })()
  }
  return pending
}

/** Минимальный набор полей этапа, нужный индексу. */
interface SearchStage {
  id: string
  number: number
  slug: string
  title: string
  subtitle: string
  goal: string
  outcome: string
  topics: Array<{ id: string; title: string; summary: string }>
  code: Array<{ id: string; title: string; code: string; explanation: string }>
}

function buildIndex(
  stages: SearchStage[],
  cheatSheets: Array<{ id: string; title: string; groups: Array<{ title: string; rows: Array<{ left: string; right: string; note?: string }> }> }>,
  faq: Array<{ id: string; question: string; answer: string }>,
  glossary: Array<{ id: string; term: string; translation: string; meaning: string; stageId: string }>,
  godotErrors: Array<{
    id: string
    message: string
    kind: string
    when: string
    cause: string
    fix: string
    note?: string
    stageId?: string
  }>,
): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const stage of stages) {
    entries.push({
      id: `stage-${stage.id}`,
      kind: 'stage',
      title: `${stage.number}. ${stage.title}`,
      summary: stage.subtitle,
      href: `/stage/${stage.slug}`,
      haystack: normalize([stage.title, stage.subtitle, stage.goal, stage.outcome].join(' ')),
      stageId: stage.id,
    })

    for (const topic of stage.topics) {
      entries.push({
        id: `topic-${stage.id}-${topic.id}`,
        kind: 'topic',
        title: topic.title,
        summary: topic.summary,
        href: `/stage/${stage.slug}#topic-${topic.id}`,
        haystack: normalize([topic.title, topic.summary].join(' ')),
        stageId: stage.id,
      })
    }

    for (const code of stage.code) {
      entries.push({
        id: `code-${stage.id}-${code.id}`,
        kind: 'code',
        title: code.title,
        summary: code.explanation.slice(0, 160),
        href: `/stage/${stage.slug}#code-${code.id}`,
        haystack: normalize([code.title, code.explanation, code.code].join(' ')),
        stageId: stage.id,
      })
    }
  }

  for (const sheet of cheatSheets) {
    for (const group of sheet.groups) {
      entries.push({
        id: `cheat-${sheet.id}-${group.title}`,
        kind: 'cheat',
        title: `${sheet.title}: ${group.title}`,
        summary: group.rows
          .slice(0, 3)
          .map((row) => row.right)
          .join(' · '),
        href: `/cheatsheets#${sheet.id}`,
        haystack: normalize(
          [sheet.title, group.title, ...group.rows.map((row) => `${row.left} ${row.right}`)].join(' '),
        ),
      })
    }
  }

  for (const item of faq) {
    entries.push({
      id: `faq-${item.id}`,
      kind: 'faq',
      title: item.question,
      summary: item.answer.slice(0, 160),
      href: `/faq#${item.id}`,
      haystack: normalize([item.question, item.answer].join(' ')),
    })
  }

  for (const entry of glossary) {
    entries.push({
      id: `glossary-${entry.id}`,
      kind: 'glossary',
      title: `${entry.term} — ${entry.translation}`,
      summary: entry.meaning.slice(0, 160),
      href: `/glossary#${entry.id}`,
      haystack: normalize([entry.term, entry.translation, entry.meaning].join(' ')),
      stageId: entry.stageId,
    })
  }

  for (const entry of godotErrors) {
    entries.push({
      id: `error-${entry.id}`,
      kind: 'error',
      title: entry.message,
      summary: entry.cause.slice(0, 160),
      href: `/errors#${entry.id}`,
      haystack: normalize(
        [entry.message, entry.when, entry.cause, entry.fix, entry.kind].join(' '),
      ),
      stageId: entry.stageId,
    })
  }

  return entries
}

/**
 * Фрагмент текста вокруг совпадения.
 *
 * Ищется по каждому слову запроса: иначе двухсловный запрос («сигнал await»)
 * находит запись, но показывает обрывок без единой подсветки.
 */
function makeSnippet(text: string, query: string): string {
  const normalized = normalize(text)
  const terms = normalize(query)
    .split(/\s+/)
    .map((term) => term.replace(/^"|"$/g, ''))
    .filter(Boolean)

  let position = -1
  let hitLength = 0
  for (const term of terms) {
    const index = normalized.indexOf(term)
    if (index >= 0 && (position < 0 || index < position)) {
      position = index
      hitLength = term.length
    }
  }

  if (position < 0) return text.slice(0, 140)
  const start = Math.max(0, position - 50)
  const end = Math.min(text.length, position + hitLength + 90)
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

/**
 * Ищет по индексу. Пустая строка — пустой результат.
 *
 * Совпадение по всем словам весит больше, чем по части: если запрос
 * «ошибка движка» не нашёлся целиком, показываем записи, где есть хотя бы
 * одно из слов, но с пониженным весом — так выдача не пустеет.
 */
export function search(
  index: SearchEntry[],
  query: string,
  limit = 30,
): SearchResult[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const normalizedQuery = normalize(trimmed)
  const terms = normalizedQuery
    .split(/\s+/)
    .map((term) => term.replace(/^"|"$/g, ''))
    .filter(Boolean)
  if (terms.length === 0) return []

  const results: SearchResult[] = []
  for (const entry of index) {
    let score = 0
    let matched = 0

    for (const term of terms) {
      const inTitle = normalize(entry.title).includes(term)
      const inHaystack = entry.haystack.includes(term)
      if (!inTitle && !inHaystack) continue
      matched += 1
      score += inTitle ? 12 : 3
    }

    // Ни одного слова не совпало — запись не подходит.
    if (matched === 0) continue
    // Совпало не всё — вес понижаем, но запись оставляем.
    if (matched < terms.length) score = (score * matched) / terms.length

    const kindBoost: Record<SearchKind, number> = {
      stage: 8,
      topic: 6,
      code: 5,
      error: 5,
      cheat: 4,
      glossary: 3,
      faq: 2,
    }
    results.push({
      ...entry,
      score: score + kindBoost[entry.kind],
      snippets: [makeSnippet(entry.summary, trimmed)],
    })
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  return results.slice(0, limit)
}

/**
 * Подсветка совпадения в тексте: возвращает части строки.
 *
 * Подсвечиваются все слова запроса по отдельности, а не только точная фраза:
 * иначе запрос из двух слов («сигнал await») находит результаты, но не показывает,
 * что именно совпало.
 */
export function splitHighlight(text: string, query: string): Array<{ text: string; match: boolean }> {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
  if (terms.length === 0) return [{ text, match: false }]

  // Учитываем вариант без «ё»: поиск нормализует «ёлку» к «елке»,
  // и подсветка должна срабатывать на том же тексте в обе стороны.
  const variants = new Set<string>()
  for (const term of terms) {
    variants.add(term)
    variants.add(normalize(term))
    // Обратное написание: «ее» в запросе против «ёё» в тексте.
    variants.add(term.replace(/е/g, 'ё'))
  }

  const pattern = new RegExp(`(${Array.from(variants).map(escapeRegExp).join('|')})`, 'ig')
  const normalizedTerms = new Set(Array.from(variants).map(normalize))
  const parts = text.split(pattern)

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, match: normalizedTerms.has(normalize(part)) }))
}

/** Подпись типа записи — показывается в выдаче поиска. */
export const searchKindLabel: Record<SearchKind, string> = {
  stage: 'Этап',
  topic: 'Тема',
  code: 'Пример',
  error: 'Ошибка',
  cheat: 'Шпаргалка',
  glossary: 'Термин',
  faq: 'Вопрос',
}
