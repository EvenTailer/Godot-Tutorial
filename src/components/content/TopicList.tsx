import { ChevronRight } from 'lucide-react'
import type { Topic } from '@/content/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Diagram } from '@/components/content/Diagram'
import { cn } from '@/lib/utils'

export interface TopicListProps {
  stageId: string
  topics: Topic[]
  isDone: (stageId: string, itemId: string, kind: 'topic') => boolean
  onToggle: (stageId: string, itemId: string, kind: 'topic') => void
  className?: string
}

/** Список тем этапа: чекбокс «понял» + раскрываемая подробность. */
export function TopicList({ stageId, topics, isDone, onToggle, className }: TopicListProps) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {topics.map((topic) => {
        const done = isDone(stageId, topic.id, 'topic')
        return (
          <li
            key={topic.id}
            id={`topic-${topic.id}`}
            className={cn(
              'scroll-mt-24 rounded-lg border bg-card p-4 shadow-xs transition-colors duration-150',
              done ? 'border-success/40' : 'border-border',
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={done}
                onChange={() => onToggle(stageId, topic.id, 'topic')}
                label={
                  <span className="font-medium">
                    {topic.title}
                    {topic.term ? (
                      <span className="ml-2 font-mono text-tiny text-muted-foreground">
                        ({topic.term})
                      </span>
                    ) : null}
                  </span>
                }
                className="flex-1"
              />
            </div>

            <div className="mt-3 flex flex-col gap-2 pl-8 text-small">
              <p className="text-muted-foreground">{topic.summary}</p>
              <p>
                <span className="font-medium text-primary">Зачем: </span>
                {topic.why}
              </p>

              {topic.details.length > 0 ? (
                <details className="group">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-small font-medium text-primary transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                    <ChevronRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-150 group-open:rotate-90 motion-reduce:transition-none"
                    />
                    Подробности ({topic.details.length})
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground marker:text-primary">
                    {topic.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </details>
              ) : null}

              {topic.diagramRef ? <Diagram id={topic.diagramRef} /> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
