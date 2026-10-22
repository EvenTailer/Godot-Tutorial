import { cn } from '@/lib/utils'

export interface ProgressRingProps {
  /** Процент 0..100. */
  value: number
  size?: number
  thickness?: number
  label?: string
  className?: string
}

/**
 * Кольцо прогресса.
 *
 * SVG-окружность вместо готовой библиотеки: нужна одна окружность,
 * а весила бы она больше, чем весь остальной компонент.
 * При prefers-reduced-motion анимация отключена в index.css.
 */
export function ProgressRing({
  value,
  size = 140,
  thickness = 12,
  label = 'Прогресс обучения',
  className,
}: ProgressRingProps) {
  const percent = Math.min(100, Math.max(0, value))
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="img"
      aria-label={`${label}: ${Math.round(percent)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          style={{ stroke: 'hsl(var(--muted))' }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-700 ease-standard motion-reduce:transition-none"
          style={{ stroke: 'hsl(var(--primary))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-h2 font-semibold tabular-nums">{Math.round(percent)}%</span>
        <span className="text-tiny text-muted-foreground">пройдено</span>
      </div>
    </div>
  )
}
