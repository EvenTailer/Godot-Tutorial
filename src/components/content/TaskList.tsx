import { ChevronRight, Lightbulb } from 'lucide-react'
import type { Criterion, Task } from '@/content/types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface TaskListProps {
  stageId: string
  tasks: Task[]
  isDone: (stageId: string, itemId: string, kind: 'task') => boolean
  onToggle: (stageId: string, itemId: string, kind: 'task') => void
  className?: string
}

const levelLabels: Record<Task['level'], string> = {
  1: 'простое',
  2: 'среднее',
  3: 'сложное',
}

/** Практические задания с подсказкой, спрятанной под «спойлером». */
export function TaskList({ stageId, tasks, isDone, onToggle, className }: TaskListProps) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {tasks.map((task) => {
        const done = isDone(stageId, task.id, 'task')
        return (
          <li
            key={task.id}
            className={cn(
              'flex flex-col rounded-lg border bg-card p-4 shadow-xs transition-colors duration-150',
              done ? 'border-success/40' : 'border-border',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Checkbox
                checked={done}
                onChange={() => onToggle(stageId, task.id, 'task')}
                label={<span className="font-medium">{task.title}</span>}
                className="flex-1"
              />
              <Badge variant={task.level === 3 ? 'warning' : task.level === 2 ? 'info' : 'secondary'}>
                {levelLabels[task.level]}
              </Badge>
            </div>

            <p className="mt-2 pl-8 text-small text-muted-foreground">{task.description}</p>

            <details className="group mt-3 pl-8">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-small font-medium text-primary transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-150 group-open:rotate-90 motion-reduce:transition-none"
                />
                <Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />
                Подсказка
              </summary>
              <p className="mt-1.5 text-small text-muted-foreground">{task.hint}</p>
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export interface CriteriaListProps {
  stageId: string
  criteria: Criterion[]
  isDone: (stageId: string, itemId: string, kind: 'criterion') => boolean
  onToggle: (stageId: string, itemId: string, kind: 'criterion') => void
  className?: string
}

/** Критерии «знаю тему»: утверждение + способ проверить. */
export function CriteriaList({
  stageId,
  criteria,
  isDone,
  onToggle,
  className,
}: CriteriaListProps) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {criteria.map((criterion) => {
        const done = isDone(stageId, criterion.id, 'criterion')
        return (
          <li
            key={criterion.id}
            className={cn(
              'rounded-lg border bg-card p-4 shadow-xs transition-colors duration-150',
              done ? 'border-success/40' : 'border-border',
            )}
          >
            <Checkbox
              checked={done}
              onChange={() => onToggle(stageId, criterion.id, 'criterion')}
              label={<span className="font-medium">{criterion.text}</span>}
            />
            <p className="mt-2 pl-8 text-small text-muted-foreground">
              <span className="font-medium text-foreground">Проверка: </span>
              {criterion.check}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
