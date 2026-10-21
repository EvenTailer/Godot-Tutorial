import * as React from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { search, splitHighlight, type SearchResult } from '@/lib/search'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  className?: string
  /** Ограничить поиск определёнными разделам (например, только этапы). */
  kinds?: SearchResult['kind'][]
  placeholder?: string
}

/**
 * Поиск по этапам, темам, шпаргалкам, FAQ и глоссарию.
 * Индекс клиентский, поэтому поиск работает офлайн и мгновенно.
 */
export function SearchBar({ className, kinds, placeholder }: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const allResults = React.useMemo(() => search(query), [query])
  const results = React.useMemo(
    () => (kinds ? allResults.filter((result) => kinds.includes(result.kind)) : allResults),
    [allResults, kinds],
  )

  React.useEffect(() => {
    setActiveIndex(0)
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

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (index + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
    }
    if (event.key === 'Enter' && open) {
      const target = results[activeIndex]
      if (target) {
        window.location.hash = `#${target.href}`
        setOpen(false)
        setQuery('')
      }
    }
  }

  const showPanel = open && query.trim().length >= 2

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <label htmlFor="site-search" className="sr-only">
        Поиск по курсу
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="site-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Поиск: тема, ошибка, API…'}
          autoComplete="off"
          aria-describedby="site-search-hint"
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Очистить поиск"
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <span id="site-search-hint" className="sr-only">
        Введите минимум два символа. Стрелки вверх и вниз перебирают результаты, Enter открывает
        выбранный.
      </span>

      {showPanel ? (
        <ul
          id="site-search-results"
          aria-label="Результаты поиска"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-small text-muted-foreground">
              Ничего не найдено. Попробуйте другое слово — например, «сигнал», «delta» или «сохранение».
            </li>
          ) : (
            <>
              {results.map((result, index) => (
                <li key={result.id}>
                  <Link
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
                    <span className="block text-small font-medium">
                      <Highlighted text={result.title} query={query} />
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
        {showPanel ? `Найдено результатов: ${results.length}` : ''}
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
