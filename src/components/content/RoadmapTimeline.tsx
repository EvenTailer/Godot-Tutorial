import { Link } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import type { Stage } from '@/content/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface RoadmapTimelineProps {
  stages: Stage[]
  /** Доля выполненных пунктов этапа, 0..1. */
  progressOf: (stage: Stage) => number
  className?: string
}

/**
 * Вертикальная дорожная карта.
 * Слева — линия прогресса, справа — карточки этапов.
 */
export function RoadmapTimeline({ stages, progressOf, className }: RoadmapTimelineProps) {
  return (
    <ol className={cn('relative flex flex-col gap-8', className)}>
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-2 bottom-2 w-px bg-border sm:left-[19px]"
      />
      {stages.map((stage) => {
        const percent = progressOf(stage)
        const complete = percent >= 100
        return (
          <li key={stage.id} className="relative flex gap-4 sm:gap-6">
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background sm:h-10 sm:w-10',
                complete
                  ? 'border-success text-success'
                  : percent > 0
                    ? 'border-primary text-primary'
                    : 'border-border text-muted-foreground',
              )}
            >
              {complete ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </span>

            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-tiny text-muted-foreground">
                  {String(stage.number).padStart(2, '0')}
                </span>
                <Badge variant="outline">Недели {stage.weeks}</Badge>
                <Badge variant="secondary">{stage.hours} ч</Badge>
              </div>

              <h3 className="mt-2 text-h2 font-semibold leading-tight">
                <Link
                  to={`/stage/${stage.slug}`}
                  className="rounded-sm transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {stage.title}
                </Link>
              </h3>

              <p className="mt-1.5 max-w-prose text-body text-muted-foreground">{stage.subtitle}</p>

              <p className="mt-3 flex items-center gap-2 text-small">
                <span className="font-medium text-primary">Результат этапа: </span>
                <span className="text-muted-foreground">{stage.outcome}</span>
              </p>

              {percent > 0 ? (
                <p className="mt-3 text-small text-muted-foreground">Пройдено: {Math.round(percent)}%</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
