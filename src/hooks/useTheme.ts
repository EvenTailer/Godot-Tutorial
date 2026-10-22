import { useCallback, useEffect, useState } from 'react'
import { THEME_KEY } from '@/lib/progress'

export type Theme = 'light' | 'dark'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* localStorage недоступен */
  }
  return null
}

function systemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

/**
 * Тема оформления.
 *
 * Значение хранится в localStorage, но ТОЛЬКО если читатель выбрал тему
 * сам. Иначе сайт следует системной теме: если сохранять её при первом
 * рендере, ключ появляется в хранилище и системная тема перестаёт
 * отслеживаться (нарушение D-011).
 *
 * Инлайн-скрипт в index.html уже выставил класс до первой отрисовки —
 * здесь мы только синхронизируем состояние React с DOM.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme() ?? systemTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      // Реагируем на системную тему, только если читатель не выбирал свою.
      if (!readStoredTheme()) setThemeState(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(THEME_KEY, next)
    } catch {
      /* квота исчерпана */
    }
  }, [])

  const toggle = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
    try {
      const next = theme === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(THEME_KEY, next)
    } catch {
      /* квота исчерпана */
    }
  }, [theme])

  return { theme, setTheme, toggle }
}
