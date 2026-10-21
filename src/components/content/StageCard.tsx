import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { Stage } from '@/content/types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface StageCardProps {
  stage: Stage
  /** Отметок выполнено из общего количества пунктов этапа. */
  done: number
  total: number
  className?: string
}

/** Карточка этапа — используется на главной странице и в дорожной карте. */
export function StageCard({ stage, done, total, className }: StageCardProps) {
  return (
    <Link
      to={`/stage/${stage.slug}`}
      className={cn(
        'group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-xs transition-all duration-150',
        'hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-tiny text-muted-foreground">{String(stage.number).padStart(2, '0')}</span>
          <h3 className="text-h3 font-semibold leading-tight">{stage.title}</h3>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>

      <p className="text-small text-muted-foreground">{stage.subtitle}</p>

      <p className="text-small">
        <span className="font-medium text-primary">Что получится: </span>
        {stage.outcome}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <Progress value={done} max={total} showLabel label={`Прогресс этапа ${stage.title}`} />
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Недели {stage.weeks}</Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock aria-hidden="true" className="h-3 w-3" />
            {stage.hours} ч
          </Badge>
          <Badge variant="secondary">
            {stage.topics.length} тем · {stage.code.length} примеров
          </Badge>
        </div>
      </div>
    </Link>
  )
}
