import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react'
import { useNextUnfinished } from '@/hooks/useNextUnfinished'
import { nextStepKindLabel } from '@/lib/continue'
import { useStageProgress } from '@/hooks/useStageProgress'
import { useProgress } from '@/hooks/useProgress'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ContinueCardProps {
  className?: string
}

/**
 * Карточка «продолжить с места остановки».
 *
 * Главная страница обещала «продолжайте с того места, где остановились» —
 * теперь эта кнопка действительно ведёт к первому незакрытому пункту,
 * а не всегда к первому этапу.
 */
export function ContinueCard({ className }: ContinueCardProps) {
  const next = useNextUnfinished()
  const { overall } = useStageProgress()
  const { doneSet } = useProgress()
  const progress = overall()
  const started = doneSet.size > 0

  if (!next) {
    return (
      <section
        aria-labelledby="continue-title"
        className={cn(
          'relative overflow-hidden rounded-2xl border border-success/40 bg-card p-6 shadow-xs sm:p-8',
          className,
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success"
            >
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <h2 id="continue-title" className="text-h3 font-semibold">
                Курс пройден
              </h2>
              <p className="mt-1 max-w-prose text-small text-muted-foreground">
                Отмечено {progress.done} из {progress.total} пунктов — все тринадцать этапов закрыты.
                Соберите финальный проект или вернитесь к любому этапу и повторите его на своём
                проекте.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/stage/12-finalnyy-proekt">
              Открыть финальный проект
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="continue-title"
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/25 bg-brand-soft p-6 shadow-brand sm:p-8',
        className,
      )}
    >
      {/* Мягкое пятно света — только украшение, никакой функциональной нагрузки. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl motion-safe:animate-aurora"
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-tiny font-semibold text-primary">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            {started ? 'Продолжить с места остановки' : 'С чего начать'}
          </span>
          <Badge variant="outline" className="bg-card/60">
            {progress.done} из {progress.total} пунктов
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          <h2 id="continue-title" className="text-h2 font-bold tracking-tight">
            {started ? `Этап ${next.stageId}: ${next.stageTitle}` : next.stageTitle}
          </h2>
          <p className="max-w-prose text-body text-muted-foreground">
            {started ? (
              <>
                Следующий незакрытый пункт —{' '}
                <span className="font-medium text-foreground">{next.label}</span>. Откройте его и
                продолжите с этого места.
              </>
            ) : (
              <>
                Начните с первого этапа: {next.label}. Это первый шаг курса — на нём вы разберётесь,
                как устроен редактор, и запустите свою первую сцену.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-sm">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-tiny text-muted-foreground">
              <span>Прогресс курса</span>
              <span className="tabular-nums">{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} label="Прогресс курса" />
          </div>

          <Button asChild size="lg" className="shrink-0 shadow-brand">
            <Link to={next.href}>
              <PlayCircle aria-hidden="true" />
              {started ? 'Продолжить' : 'Начать первый этап'}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <p className="text-tiny text-muted-foreground">
          Тип пункта: {nextStepKindLabel[next.kind]}. Отметки хранятся только в этом браузере.
        </p>
      </div>
    </section>
  )
}
