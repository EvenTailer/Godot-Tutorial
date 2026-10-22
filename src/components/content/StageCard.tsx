import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Box,
  Boxes,
  Clock,
  Code2,
  Database,
  Gauge,
  Layers,
  Monitor,
  Package,
  Palette,
  Rocket,
  Trophy,
  Volume2,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { StageManifest } from '@/content/stages/manifest'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface StageCardProps {
  stage: StageManifest
  /** Отметок выполнено из общего количества пунктов этапа. */
  done: number
  total: number
  /** Плотный вариант для сетки дорожной карты. */
  dense?: boolean
  className?: string
}

/** Иконка этапа — чтобы карточки различались взглядом, а не только цифрой. */
const stageIcons: Record<number, LucideIcon> = {
  0: Wrench,
  1: Code2,
  2: Boxes,
  3: Rocket,
  4: Palette,
  5: Monitor,
  6: Volume2,
  7: Database,
  8: Layers,
  9: Box,
  10: Gauge,
  11: Package,
  12: Trophy,
}

/** Карточка этапа — используется на главной странице и в дорожной карте. */
export function StageCard({ stage, done, total, dense = false, className }: StageCardProps) {
  const Icon = stageIcons[stage.number] ?? Layers
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const finished = percent >= 100

  return (
    <Link
      to={`/stage/${stage.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 ease-standard',
        'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'print:break-inside-avoid print:shadow-none print:hover:transform-none',
        finished && 'border-success/40',
        className,
      )}
    >
      {/* Полоса прогресса этапа. */}
      {!dense ? (
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-standard motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}

      <div className={cn('flex flex-1 flex-col gap-4', dense ? 'p-4 pt-5' : 'p-5 pt-6')}>
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-200',
              dense ? 'h-8 w-8' : 'h-10 w-10',
            )}
          >
            <Icon className={dense ? 'h-4 w-4' : 'h-5 w-5'} />
          </span>
          <span className="font-mono text-tiny tabular-nums text-muted-foreground">
            {String(stage.number).padStart(2, '0')}
          </span>
        </div>

        <div>
          <h3 className="text-h3 font-semibold leading-tight">{stage.title}</h3>
          <p className="mt-1.5 text-small leading-relaxed text-muted-foreground">{stage.subtitle}</p>
        </div>

        <p className="text-small leading-relaxed">
          <span className="font-medium text-primary">Что получится: </span>
          {stage.outcome}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          {dense ? null : (
            <Progress value={done} max={total} showLabel label={`Прогресс этапа ${stage.title}`} />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Недели {stage.weeks}</Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock aria-hidden="true" className="h-3 w-3" />
              {stage.hours} ч
            </Badge>
            <Badge variant="secondary">
              {stage.counts.topics} тем · {stage.counts.code} примеров
            </Badge>
            {finished ? <Badge variant="success">Пройден</Badge> : null}
          </div>
          <span className="inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-primary">
            {done > 0 ? 'Продолжить этап' : 'Открыть этап'}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
