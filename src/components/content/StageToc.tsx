import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, ListTree } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface TocSection {
  id: string
  label: string
}

export interface StageTocProps {
  sections: TocSection[]
  /** `inline` — сворачиваемый блок для узкого экрана, `sidebar` — липкая колонка. */
  variant?: 'inline' | 'sidebar'
  /** Прогресс этапа: отмечено и всего пунктов. */
  progress?: { done: number; total: number }
  className?: string
}

/**
 * Оглавление этапа.
 *
 * На широком экране — липкая колонка с подсветкой активной секции,
 * на узком — сворачиваемый блок. В печати не выводится: там есть
 * последовательный текст со всеми разделами.
 */
export function StageToc({ sections, variant = 'sidebar', progress, className }: StageTocProps) {
  const [active, setActive] = React.useState(sections[0]?.id ?? '')
  const listId = React.useId()
  const location = useLocation()

  // HashRouter: обычный <a href="#id"> ломает маршрут (hash становится путём).
  // Поэтому якорь ведёт через Link с сохранением текущего pathname.
  const anchorFor = (id: string) => ({ pathname: location.pathname, hash: `#${id}` })

  React.useEffect(() => {
    // Наблюдатель нужен только в липкой колонке: мобильный вариант скрыт на
    // широких экранах, и второй наблюдатель просто дублировал бы работу.
    if (variant !== 'sidebar') return
    if (sections.length === 0) return
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        fired = true
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
          return
        }
        // Ничего не видно — берём последнюю секцию, которая уже проскроллена.
        const passed = elements
          .filter((element) => element.getBoundingClientRect().top <= 140)
          .pop()
        if (passed) setActive(passed.id)
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    )

    for (const element of elements) observer.observe(element)

    // Страховка только на случай, если наблюдатель не сработал ни разу.
    const fallback = window.setTimeout(() => {
      if (!fired) setActive(sections[0]?.id ?? '')
    }, 1200)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [sections, variant])

  const links = (
    <ul className="flex flex-col gap-0.5">
      {sections.map((section) => {
        const isActive = active === section.id
        return (
          <li key={section.id}>
            <Link
              to={anchorFor(section.id)}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-2 rounded-md px-3 py-1.5 text-small transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-150',
                  isActive ? 'bg-primary' : 'bg-border',
                )}
              />
              {section.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className={cn('print:hidden', className)}>
      {/* Узкий экран: сворачиваемый блок */}
      {variant === 'inline' ? (
        <details className="group rounded-xl border border-border bg-card p-4 shadow-xs">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-small font-medium text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
            <ListTree aria-hidden="true" className="h-4 w-4 text-primary" />
            Содержание этапа
          </summary>
          <div id={listId} className="mt-3">
            {links}
          </div>
        </details>
      ) : null}

      {/* Широкий экран: липкая колонка */}
      {variant === 'sidebar' ? (
        <nav aria-label="Содержание этапа">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4 shadow-xs">
            <p className="mb-2 flex items-center gap-2 text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
              <ListTree aria-hidden="true" className="h-3.5 w-3.5" />
              Содержание этапа
            </p>
            {links}
            {progress ? (
              <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-baseline justify-between gap-2 text-tiny">
                  <span className="text-muted-foreground">Прогресс этапа</span>
                  <span className="font-semibold tabular-nums">
                    {progress.done} / {progress.total}
                  </span>
                </div>
                <Progress
                  value={progress.done}
                  max={progress.total}
                  label="Прогресс этапа в оглавлении"
                  className="mt-2"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                const reduce =
                  typeof window.matchMedia === 'function' &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
              }}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-tiny text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
              Наверх
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  )
}
