import type { Step } from '@/content/types'
import { Diagram } from '@/components/content/Diagram'
import { ScreenshotStub } from '@/components/content/ScreenshotStub'
import { cn } from '@/lib/utils'

export interface StepListProps {
  stageId: string
  steps: Step[]
  isDone: (stageId: string, itemId: string, kind: 'step') => boolean
  onToggle: (stageId: string, itemId: string, kind: 'step') => void
  className?: string
}

/** Пошаговые инструкции: где нажать, что сделать, как проверить результат. */
export function StepList({ stageId, steps, isDone, onToggle, className }: StepListProps) {
  return (
    <ol className={cn('flex flex-col gap-4', className)}>
      {steps.map((step, index) => {
        const done = isDone(stageId, step.id, 'step')
        return (
          <li
            key={step.id}
            id={`step-${step.id}`}
            className={cn(
              'scroll-mt-24 rounded-lg border bg-card p-4 shadow-xs transition-colors duration-150',
              done ? 'border-success/40' : 'border-border',
            )}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-small font-semibold tabular-nums',
                  done
                    ? 'border-success/50 bg-success/15 text-success'
                    : 'border-primary/40 bg-primary/10 text-primary',
                )}
              >
                {done ? '✓' : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-h4 font-semibold">{step.title}</h3>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-tiny text-accent-foreground">
                    {step.where}
                  </span>
                </div>

                <p className="mt-2 text-small leading-relaxed">{step.action}</p>

                <p className="mt-2 flex items-start gap-2 text-small text-muted-foreground">
                  <span className="mt-0.5 shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-tiny font-medium text-success">
                    Результат
                  </span>
                  <span>{step.result}</span>
                </p>

                {step.note ? (
                  <p className="mt-2 rounded-md border-l-4 border-warning/60 bg-warning/8 px-3 py-2 text-small text-muted-foreground">
                    <span className="font-medium text-warning">Обратите внимание: </span>
                    {step.note}
                  </p>
                ) : null}

                {step.screenshot ? <ScreenshotStub stub={step.screenshot} /> : null}
                {step.diagramRef ? <Diagram id={step.diagramRef} /> : null}

                <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 text-small text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onToggle(stageId, step.id, 'step')}
                    className="h-4 w-4 cursor-pointer rounded-xs border border-input accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  Шаг выполнен
                </label>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
