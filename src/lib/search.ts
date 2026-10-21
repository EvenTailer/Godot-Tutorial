import { stages } from '@/content/stages'
import { cheatSheets } from '@/content/cheatsheets'
import { faq } from '@/content/faq'
import { glossary } from '@/content/glossary'

/**
 * Клиентский индекс поиска.
 *
 * Объём контента — десятки тысяч символов, полный перебор в памяти занимает
 * меньше миллисекунды, поэтому внешние библиотеки не нужны (DECISIONS.md, D-007).
 */

export type SearchKind = 'stage' | 'topic' | 'code' | 'cheat' | 'faq' | 'glossary'

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
  /** Совпадения в заголовке веси�� больше, чем в тексте. */
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

function buildIndex(): SearchEntry[] {
  if (cachedIndex) return cachedIndex
  const entries: SearchEntry[] = []

  for (const stage of stages) {
    entries.push({
      id: `stage-${stage.id}`,
      kind: 'stage',
      title: `${stage.number}. ${stage.title}`,
      summary: stage.subtitle,
      href: `/stage/${stage.slug}`,
      haystack: normalize(
        [stage.title, stage.subtitle, stage.goal, stage.outcome, ...stage.topics.map((t) => `${t.title} ${t.summary}`)].join(
          ' ',
        ),
      ),
      stageId: stage.id,
    })

    for (const topic of stage.topics) {
      entries.push({
        id: `topic-${stage.id}-${topic.id}`,
        kind: 'topic',
        title: topic.title,
        summary: topic.summary,
        href: `/stage/${stage.slug}#topic-${topic.id}`,
        haystack: normalize([topic.title, topic.summary, topic.why, ...topic.details].join(' ')),
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

  cachedIndex = entries
  return entries
}

function makeSnippet(text: string, query: string): string {
  const normalized = normalize(text)
  const position = normalized.indexOf(normalize(query))
  if (position < 0) return text.slice(0, 140)
  const start = Math.max(0, position - 50)
  const end = Math.min(text.length, position + query.length + 90)
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

/** Ищет по индексу. Пустая строка — пустой результат. */
export function search(query: string, limit = 30): SearchResult[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const normalizedQuery = normalize(trimmed)
  const terms = normalizedQuery.split(/\s+/).filter(Boolean)
  const index = buildIndex()

  const results: SearchResult[] = []
  for (const entry of index) {
    let score = 0
    let matchedAll = true

    for (const term of terms) {
      const inTitle = normalize(entry.title).includes(term)
      const inHaystack = entry.haystack.includes(term)
      if (!inTitle && !inHaystack) {
        matchedAll = false
        break
      }
      score += inTitle ? 12 : 3
    }

    if (!matchedAll) continue

    const kindBoost: Record<SearchKind, number> = {
      stage: 8,
      topic: 6,
      code: 5,
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

/** Подсветка совпадения в тексте: возвращает части строки. */
export function splitHighlight(text: string, query: string): Array<{ text: string; match: boolean }> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return [{ text, match: false }]

  const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, 'ig')
  const parts = text.split(pattern)
  const normalizedPattern = new RegExp(`^${escapeRegExp(normalize(trimmed))}$`, 'i')

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, match: normalizedPattern.test(normalize(part)) }))
}

export const searchIndexSize = (): number => buildIndex().length
