import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import {
  loadSearchIndex,
  search,
  searchKindLabel,
  splitHighlight,
  type SearchEntry,
  type SearchResult,
} from '@/lib/search'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  className?: string
  /** Ограничить поиск определёнными разделам (например, только этапы). */
  kinds?: SearchResult['kind'][]
  placeholder?: string
}

/**
 * Поиск по этапам, темам, шпаргалкам, FAQ и глоссарию.
 *
 * Индекс клиентский, поэтому поиск работает офлайн и мгновенно. Но сам
 * индекс грузится по первому обращению: корпус курса не должен ехать вместе
 * с каждой страницей.
 */
export function SearchBar({ className, kinds, placeholder }: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [index, setIndex] = React.useState<SearchEntry[] | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([])
  const navigate = useNavigate()
  // Поиск отрисован в двух местах (шапка и мобильный drawer) — id должны быть разными.
  const uid = React.useId()
  const inputId = `${uid}-input`
  const hintId = `${uid}-hint`
  const resultsId = `${uid}-results`

  /** Подгружает индекс корпуса — один раз за сессию. */
  const ensureIndex = React.useCallback(() => {
    if (index) return
    loadSearchIndex().then((loaded) => setIndex(loaded))
  }, [index])

  const allResults = React.useMemo(
    () => (index ? search(index, query) : []),
    [index, query],
  )
  const results = React.useMemo(
    () => (kinds ? allResults.filter((result) => kinds.includes(result.kind)) : allResults),
    [allResults, kinds],
  )

  React.useEffect(() => {
    setActiveIndex(0)
    // Массив refs не очищаем: колбэки ref заполняют его при каждом коммите,
    // а очистка здесь стирала бы их уже после commit — и первое нажатие стрелки
    // не переводило бы фокус на результат.
  }, [query])

  React.useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  /** Фокус на результат по индексу: так работают и стрелки, и скринридер. */
  const focusResult = (index: number) => {
    setOpen(true)
    setActiveIndex(index)
    linkRefs.current[index]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusResult((activeIndex + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusResult((activeIndex - 1 + results.length) % results.length)
    }
    if (event.key === 'Enter' && open) {
      const target = results[activeIndex]
      if (target) {
        navigate(target.href)
        setOpen(false)
        setQuery('')
        inputRef.current?.focus()
      }
    }
  }

  /**
   * Клавиши внутри списка результатов.
   *
   * Обработчик висит на списке, а не на поле: после первого шага фокус
   * уходит на ссылку, и поле больше не получает события.
   */
  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusResult((activeIndex + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusResult((activeIndex - 1 + results.length) % results.length)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusResult(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusResult(results.length - 1)
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      inputRef.current?.focus()
    }
  }

  const showPanel = open && query.trim().length >= 2

  // Счётчик для скринридера обновляется не на каждый символ, а с задержкой:
  // иначе он проговаривает количество вслух на каждом нажатии.
  const [announced, setAnnounced] = React.useState('')
  React.useEffect(() => {
    if (!showPanel) {
      setAnnounced('')
      return
    }
    const timer = window.setTimeout(() => {
      setAnnounced(`Найдено результатов: ${results.length}`)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [showPanel, results.length])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <label htmlFor={inputId} className="sr-only">
        Поиск по курсу
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            ensureIndex()
          }}
          onFocus={() => {
            setOpen(true)
            ensureIndex()
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Поиск: тема, ошибка, API…'}
          autoComplete="off"
          aria-describedby={hintId}
          aria-controls={showPanel ? resultsId : undefined}
          aria-expanded={showPanel}
          className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-11 text-sm transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Очистить поиск"
            className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <span id={hintId} className="sr-only">
        Введите минимум два символа. Стрелки вверх и вниз перебирают результаты, Enter открывает
        выбранный.
      </span>

      {showPanel ? (
        <ul
          id={resultsId}
          onKeyDown={onListKeyDown}
          aria-label="Результаты поиска"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-small text-muted-foreground">
              {index === null ? (
                <>
                  <span className="block font-medium text-foreground">Загружаем индекс поиска…</span>
                  <span className="mt-1 block">
                    Он собирается один раз — весь корпус курса в памяти браузера.
                  </span>
                </>
              ) : (
                'Ничего не найдено. Попробуйте другое слово — например, «сигнал», «delta» или «сохранение».'
              )}
            </li>
          ) : (
            <>
              {results.map((result, index) => (
                <li key={result.id}>
                  <Link
                    ref={(element) => {
                      linkRefs.current[index] = element
                    }}
                    to={result.href}
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'block rounded-md px-3 py-2 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      index === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="block text-small font-medium">
                        <Highlighted text={result.title} query={query} />
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-tiny text-muted-foreground">
                        {searchKindLabel[result.kind]}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-tiny text-muted-foreground">
                      <Highlighted text={result.snippets[0] ?? result.summary} query={query} />
                    </span>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {announced}
      </p>
    </div>
  )
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = splitHighlight(text, query)
  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark key={index} className="rounded-xs bg-warning/30 px-0.5 text-foreground">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  )
}
