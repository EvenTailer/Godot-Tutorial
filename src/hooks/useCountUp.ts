import * as React from 'react'

/**
 * Плавный счётчик: число растёт от 0 до целевого.
 *
 * При отключённых анимациях (prefers-reduced-motion) значение показывается
 * сразу — без мигания цифр.
 */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    let frame = 0
    const started = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    // Страховка: если кадры не идут (вкладка не рисуется), число всё равно
    // должно показать правильное значение, а не ноль.
    const fallback = window.setTimeout(() => setValue(target), duration + 150)

    return () => {
      window.clearTimeout(fallback)
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return value
}
