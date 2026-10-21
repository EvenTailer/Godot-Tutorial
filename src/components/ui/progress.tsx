import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Значение от 0 до max. */
  value: number
  max?: number
  /** Показывать процент текстом рядом с полосой. */
  showLabel?: boolean
  label?: string
}

/** Полоска прогресса с ролью progressbar. */
export function Progress({ value, max = 100, showLabel = false, label, className, ...props }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-standard motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel ? (
        <span className="w-10 shrink-0 text-right text-tiny tabular-nums text-muted-foreground">
          {Math.round(percent)}%
        </span>
      ) : null}
    </div>
  )
}
