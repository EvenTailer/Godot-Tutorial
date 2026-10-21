import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Target } from 'lucide-react'
import { findStage, stages } from '@/content/stages'
import { CodeBlock } from '@/components/content/CodeBlock'
import { Callout } from '@/components/content/Callout'
import { CriteriaList, TaskList } from '@/components/content/TaskList'
import { Diagram } from '@/components/content/Diagram'
import { ResourceList } from '@/components/content/ResourceList'
import { StepList } from '@/components/content/StepList'
import { TopicList } from '@/components/content/TopicList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Section } from '@/components/layout/PageHeader'
import { useProgress } from '@/hooks/useProgress'
import { useStageProgress } from '@/hooks/useStageProgress'

export function StagePage() {
  const { slug } = useParams<{ slug: string }>()
  const stage = slug ? findStage(slug) : undefined
  const { is, toggle, mark } = useProgress()
  const { countFor } = useStageProgress()

  if (!stage) return <Navigate to="/404" replace />

  const index = stages.findIndex((item) => item.slug === stage.slug)
  const previous = index > 0 ? stages[index - 1] : null
  const next = index < stages.length - 1 ? stages[index + 1] : null
  const counts = countFor(stage)

  return (
    <article className="mx-auto max-w-content px-gutter py-section">
      {/* Заголовок этапа */}
      <header className="border-b border-border pb-8">
        <nav aria-label="Хлебные крошки" className="mb-4">
          <Link
            to="/roadmap"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-small text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Дорожная карта
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Этап {String(stage.number).padStart(2, '0')}</Badge>
          <Badge variant="secondary" className="gap-1">
            <CalendarDays aria-hidden="true" className="h-3 w-3" />
            Недели {stage.weeks}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock aria-hidden="true" className="h-3 w-3" />
            {stage.hours} ч
          </Badge>
        </div>

        <h1 className="mt-3 text-display font-bold tracking-tight">{stage.title}</h1>
        <p className="mt-3 max-w-prose text-body text-muted-foreground">{stage.subtitle}</p>

        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:gap-6">
          <div className="flex-1">
            <p className="flex items-start gap-2 text-small">
              <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Цель этапа: </span>
                {stage.goal}
              </span>
            </p>
            <p className="mt-2 flex items-start gap-2 text-small">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-tiny font-semibold text-success"
              >
                ✓
              </span>
              <span>
                <span className="font-medium">Что получится: </span>
                {stage.outcome}
              </span>
            </p>
          </div>
          <div className="sm:w-56">
            <Progress value={counts.done} max={counts.total} showLabel label="Прогресс этапа" />
            <p className="mt-1.5 text-tiny text-muted-foreground">
              {counts.done} из {counts.total} пунктов этапа
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-section pt-section">
        {/* Темы */}
        <Section
          title="Темы этапа"
          description="Для каждой темы объяснено, что это и зачем это нужно. Отметьте тему, когда она станет понятна."
        >
          <TopicList
            stageId={stage.id}
            topics={stage.topics}
            isDone={(stageId, itemId, kind) => is(stageId, itemId, kind)}
            onToggle={(stageId, itemId, kind) => toggle(stageId, itemId, kind)}
          />
        </Section>

        {/* Шаги */}
        <Section
          title="Пошаговые инструкции"
          description="Названия пунктов меню — настоящие, из редактора Godot 4. Пока вы не сделаете шаг, переходите к следующему."
        >
          <StepList
            stageId={stage.id}
            steps={stage.steps}
            isDone={(stageId, itemId, kind) => is(stageId, itemId, kind)}
            onToggle={(stageId, itemId, kind) => toggle(stageId, itemId, kind)}
          />
        </Section>

        {/* Код */}
        <Section
          title="Код"
          description="Примеры копируются в один клик и проверяются настоящим движком: каждый файл разбирается Godot без ошибок."
        >
          {stage.code.map((example) => (
            <section key={example.id} id={`code-${example.id}`} className="scroll-mt-24">
              <h3 className="mb-2 text-h3 font-semibold">{example.title}</h3>
              <CodeBlock
                code={example.code}
                language={example.language === 'gdshader' ? 'gdshader' : 'gdscript'}
                file={example.file}
              />
              <p className="max-w-prose text-small leading-relaxed text-muted-foreground">
                {example.explanation}
              </p>
              {example.versionNote ? (
                <Callout variant="info" title="Про версию Godot">
                  {example.versionNote}
                </Callout>
              ) : null}
            </section>
          ))}
        </Section>

        {/* Практика */}
        <Section
          title="Практика"
          description="Задания с возрастающей сложностью. Подсказка спрятана под «Подсказка» — сначала попробуйте сами."
        >
          <TaskList
            stageId={stage.id}
            tasks={stage.tasks}
            isDone={(stageId, itemId, kind) => is(stageId, itemId, kind)}
            onToggle={(stageId, itemId, kind) => toggle(stageId, itemId, kind)}
          />
        </Section>

        {/* Мини-проект */}
        <Section
          title="Мини-проект"
          description="Главный результат этапа. Он должен работать — иначе этап не закрыт."
        >
          <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-h3 font-semibold">{stage.project.title}</h3>
              <Badge variant="info">≈ {stage.hours} ч на этап</Badge>
            </div>

            <p className="mt-3 max-w-prose text-body text-muted-foreground">{stage.project.brief}</p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-h4 font-semibold">Обязательные требования</h4>
                <ul className="flex flex-col gap-2">
                  {stage.project.requirements.map((requirement) => (
                    <li key={requirement} className="flex items-start gap-2 text-small">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-h4 font-semibold">Если осталось время</h4>
                <ul className="flex flex-col gap-2">
                  {stage.project.stretch.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-small">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <Checkbox
                checked={is(stage.id, 'project', 'project')}
                onChange={() => toggle(stage.id, 'project', 'project')}
                label={<span className="font-medium">Мини-проект сделан и работает</span>}
              />
            </div>
          </div>
        </Section>

        {/* Критерий */}
        <Section
          title="Знаю тему"
          description="Самопроверка. Каждый критерий — действие: если его можно выполнить, значит тема действительно понята."
        >
          <CriteriaList
            stageId={stage.id}
            criteria={stage.criteria}
            isDone={(stageId, itemId, kind) => is(stageId, itemId, kind)}
            onToggle={(stageId, itemId, kind) => toggle(stageId, itemId, kind)}
          />
        </Section>

        {/* Диаграммы этапа */}
        {stage.diagrams.length > 0 ? (
          <Section title="Схемы этапа" description="Одна и та же палитра и стиль: сплошная стрелка — поток управления, пунктир — слабая связь.">
            {stage.diagrams.map((id) => (
              <Diagram key={id} id={id} />
            ))}
          </Section>
        ) : null}

        {/* Ресурсы */}
        <Section title="Ресурсы" description="Официальная документация — источник истины по API. Остальное — для контекста.">
          <ResourceList resources={stage.resources} />
        </Section>

        {/* Версии */}
        {stage.versionNotes.length > 0 ? (
          <Section title="Изменения между версиями" description="Отмечено только там, где API или поведение отличаются в Godot 4.0–4.4.">
            <ul className="flex flex-col gap-2">
              {stage.versionNotes.map((note) => (
                <li
                  key={`${note.version}-${note.text}`}
                  className="rounded-md border border-border bg-card px-4 py-3 text-small shadow-xs"
                >
                  <Badge variant="warning" className="mr-2">
                    Godot {note.version}
                  </Badge>
                  <span className="text-muted-foreground">{note.text}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>

      {/* Навигация по этапам */}
      <nav aria-label="Переход между этапами" className="mt-section border-t border-border pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
          {previous ? (
            <Button asChild variant="outline" className="justify-start sm:max-w-xs">
              <Link to={`/stage/${previous.slug}`}>
                <ArrowLeft aria-hidden="true" />
                <span className="text-left">
                  <span className="block text-tiny text-muted-foreground">Предыдущий этап</span>
                  {previous.title}
                </span>
              </Link>
            </Button>
          ) : (
            <span />
          )}

          {next ? (
            <Button asChild className="justify-end sm:ml-auto sm:max-w-xs">
              <Link to={`/stage/${next.slug}`}>
                <span className="text-left">
                  <span className="block text-tiny text-primary-foreground/80">Следующий этап</span>
                  {next.title}
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" className="justify-end sm:ml-auto sm:max-w-xs">
              <Link to="/plan">
                <span className="text-left">
                  <span className="block text-tiny opacity-80">Дальше</span>
                  Календарный план на 24 недели
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </nav>

      <p className="mt-6 text-tiny text-muted-foreground">
        Отметки сохраняются в этом браузере.{' '}
        <button
          type="button"
          onClick={() => mark(stage.id, 'project', 'project', !is(stage.id, 'project', 'project'))}
          className="inline-flex min-h-11 items-center rounded-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Сбросить отметку мини-проекта
        </button>
      </p>
    </article>
  )
}
