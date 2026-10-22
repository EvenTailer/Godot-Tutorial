import { RotateCcw } from 'lucide-react'
import { clearProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

export interface ResetProgressProps {
  className?: string
}

/**
 * Полный сброс отметок.
 *
 * Подтверждение обязательно: отметки не восстановить, а кнопка стоит
 * рядом с обычными ссылками в подвале.
 */
export function ResetProgress({ className }: ResetProgressProps) {
  const reset = () => {
    const confirmed = window.confirm(
      'Сбросить весь прогресс обучения? Все отметки тем, шагов и заданий будут удалены.',
    )
    if (!confirmed) return
    clearProgress()
  }

  return (
    <button
      type="button"
      onClick={reset}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-sm text-tiny text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50',
        className,
      )}
    >
      <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
      Сбросить прогресс
    </button>
  )
}
