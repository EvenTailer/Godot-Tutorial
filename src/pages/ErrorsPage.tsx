import * as React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, X } from 'lucide-react'
import { godotErrors, errorKinds, type ErrorKind } from '@/content/errors'
import { courseTotals } from '@/content/stages/manifest'
import { ErrorCard, ErrorFilter } from '@/components/content/ErrorCard'
import { Callout } from '@/components/content/Callout'
import { Reveal } from '@/components/content/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'
import { PageHeader, Section } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

/**
 * Справочник ошибок Godot.
 *
 * Ключевой сценарий: читатель копирует текст сообщения из Output в поиск
 * и получает карточку с причиной и решением.
 */
export function ErrorsPage() {
  const [query, setQuery] = React.useState('')
  const [kind, setKind] = React.useState<ErrorKind | 'all'>('all')

  usePageMeta(
    'Ошибки Godot: справочник и решения',
    'Частые ошибки Godot 4: сообщение движка, причина, пошаговое решение и ссылка на этап курса.',
  )

  const counts = React.useMemo(() => {
    const result: Record<string, number> = { all: godotErrors.length }
    for (const entry of godotErrors) {
      result[entry.kind] = (result[entry.kind] ?? 0) + 1
    }
    return result
  }, [])

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return godotErrors.filter((entry) => {
      if (kind !== 'all' && entry.kind !== kind) return false
      if (normalized.length < 2) return true
      return (
        entry.message.toLowerCase().includes(normalized) ||
        entry.when.toLowerCase().includes(normalized) ||
        entry.cause.toLowerCase().includes(normalized) ||
        entry.fix.toLowerCase().includes(normalized) ||
        (entry.note ?? '').toLowerCase().includes(normalized)
      )
    })
  }, [query, kind])

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Справочник"
        title="Ошибки Godot и что с ними делать"
        description="Копируйте сообщение из Output в поиск — здесь собраны разборы типовых ошибок: что движок имел в виду, почему это произошло и что сделать, чтобы исправить."
      />

      {/* Поиск и фильтры */}
      <div className="sticky top-16 z-20 -mx-gutter border-y border-border bg-background/90 px-gutter py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden">
        <label
          htmlFor="errors-search"
          className="mb-1.5 block text-tiny font-medium text-muted-foreground"
        >
          Поиск по сообщениям ошибок
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="errors-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Текст ошибки: «Nil», «not declared», «Failed loading resource»…"
            className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-11 text-small transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
              className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <ErrorFilter
          className="mt-3"
          kinds={errorKinds.map((item) => item.id)}
          active={kind}
          onChange={setKind}
          counts={counts}
        />
      </div>

      <p className="mt-6 text-small text-muted-foreground" aria-live="polite">
        {filtered.length === godotErrors.length
          ? `Все ошибки: ${filtered.length}`
          : `Найдено: ${filtered.length} из ${godotErrors.length}`}
      </p>

      {filtered.length === 0 ? (
        <Callout variant="info" title="Такой ошибки пока нет в справочнике">
          Посмотрите{' '}
          <Link
            to="/cheatsheets#errors"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            вкладку «Ловушки и разборы»
          </Link>{' '}
          в шпаргалках или загляните в{' '}
          <Link to="/faq#faq-bugs" className="font-medium text-primary underline-offset-4 hover:underline">
            ответ про падение игры
          </Link>
          . Новые разборы добавляются по мере накопления.
        </Callout>
      ) : (
        <>
          <h2 className="mt-8 text-h3 font-semibold">Разборы ошибок</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {filtered.map((entry, index) => (
              <Reveal key={entry.id} delay={Math.min(index, 6) * 60} className="min-w-0">
                <ErrorCard entry={entry} className="h-full" />
              </Reveal>
            ))}
          </div>
        </>
      )}

      <Section title="Куда идти дальше" className="mt-section">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/cheatsheets"
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BookOpen aria-hidden="true" className="h-5 w-5 text-primary" />
            <span className="font-medium">Шпаргалка «Частые ошибки»</span>
            <span className="text-small text-muted-foreground">
              Короткие ответы по сообщениям парсера, ошибкам времени выполнения и логическим ловушкам.
            </span>
          </Link>
          <Link
            to="/stage/01-gdscript-yazyk"
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BookOpen aria-hidden="true" className="h-5 w-5 text-primary" />
            <span className="font-medium">Читать сообщения движка</span>
            <span className="text-small text-muted-foreground">
              Этап «GDScript: язык» объясняет, как устроены ошибки разбора и как их читать.
            </span>
          </Link>
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5">
            <span className="font-medium">Не нашли своё сообщение?</span>
            <span className="text-small text-muted-foreground">
              Текст ошибки почти всегда состоит из имени функции и типа объекта — ищите по этим словам в{' '}
              <Link to="/glossary" className="font-medium text-primary underline-offset-4 hover:underline">
                глоссарии
              </Link>
              . Всего в курсе {courseTotals.stages} этапов и {godotErrors.length} разборов ошибок.
            </span>
            <Button asChild variant="outline" size="sm" className="mt-auto self-start">
              <Link to="/roadmap">К дорожной карте</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
