import { Link } from 'react-router-dom'
import { ChevronRight, Clock, Layers } from 'lucide-react'
import type { LadderItem } from '@/content/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ProjectLadderProps {
  items: LadderItem[]
  /** Ссылка на этап, откуда берётся проект. */
  hrefForStage: (stageId: string) => string
  className?: string
}

/**
 * Лестница проектов.
 * Каждая ступень — отдельный законченный проект: от мяча до своей игры.
 */
export function ProjectLadder({ items, hrefForStage, className }: ProjectLadderProps) {
  return (
    <ol className={cn('flex flex-col gap-4', className)}>
      {items.map((item) => (
        <li key={item.id} className="relative">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-xs transition-colors duration-150 hover:border-primary/40 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex shrink-0 items-center gap-3 sm:w-40 sm:flex-col sm:items-start">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 font-mono text-small font-semibold text-primary"
              >
                {item.level}
              </span>
              <div className="sm:mt-1">
                <p className="text-tiny uppercase tracking-wide text-muted-foreground">Уровень</p>
                <p className="text-small font-medium text-foreground">{item.title}</p>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-small text-muted-foreground">{item.goal}</p>

              <ul className="mt-3 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="accent">{skill}</Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-tiny text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5" />≈ {item.hours} ч
                </span>
                <span className="inline-flex items-center gap-1">
                  <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                  <Link
                    to={hrefForStage(item.fromStage)}
                    className="inline-flex min-h-11 items-center rounded-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    этап {item.fromStage}
                  </Link>
                </span>
              </div>
            </div>

            <ChevronRight
              aria-hidden="true"
              className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block"
            />
          </div>
        </li>
      ))}
    </ol>
  )
}
