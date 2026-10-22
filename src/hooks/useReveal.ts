import * as React from 'react'

export interface RevealOptions {
  /** Доля элемента, которую нужно увидеть, чтобы сработало появление. */
  threshold?: number
  /** Показывать один раз (по умолчанию) или при каждом появлении. */
  once?: boolean
}

/**
 * Появление блока при прокрутке.
 *
 * Начальное скрытие задаётся CSS-классом `.reveal` только внутри
 * `@media (prefers-reduced-motion: no-preference)` — при отключённых анимациях
 * и при печати контент виден сразу (см. index.css).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: RevealOptions) {
  const ref = React.useRef<T | null>(null)
  const [visible, setVisible] = React.useState(false)
  const threshold = options?.threshold ?? 0.15
  const once = options?.once ?? true

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        fired = true
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -32px 0px' },
    )

    observer.observe(element)

    // Страховка только на случай, если наблюдатель вообще не сработал.
    // Иначе она показывала бы все блоки страницы сразу и появление
    // при прокрутке не работало бы вовсе.
    const fallback = window.setTimeout(() => {
      if (!fired) setVisible(true)
    }, 1200)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [threshold, once])

  return { ref, visible }
}
