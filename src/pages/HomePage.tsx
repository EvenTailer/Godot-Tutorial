import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, Code2, Compass, GitBranch, Layers } from 'lucide-react'
import { stages, totalCodeExamples, totalHours, totalTasks } from '@/content/stages'
import { plan24Weeks } from '@/content/plan-24-weeks'
import { diagramIds } from '@/content/diagrams'
import { ProgressRing } from '@/components/content/ProgressRing'
import { StageCard } from '@/components/content/StageCard'
import { Callout } from '@/components/content/Callout'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/layout/PageHeader'
import { useStageProgress } from '@/hooks/useStageProgress'
import { useProgress } from '@/hooks/useProgress'

export function HomePage() {
  const { countFor, overall } = useStageProgress()
  const { doneSet } = useProgress()
  const progress = overall()
  const firstStage = stages[0]
  const previewStages = stages.slice(0, 3)

  const stats = [
    { icon: Layers, value: String(stages.length), label: 'этапов курса' },
    { icon: CalendarDays, value: String(plan24Weeks.length), label: 'недель плана' },
    { icon: Code2, value: String(totalCodeExamples), label: 'примеров кода' },
    { icon: BookOpen, value: String(totalTasks), label: 'практических заданий' },
    { icon: Compass, value: String(diagramIds.length), label: 'векторных диаграмм' },
    { icon: GitBranch, value: `${totalHours} ч`, label: 'общая оценка времени' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto grid max-w-content gap-10 px-gutter py-section lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-tiny font-medium text-primary">
              Godot 4.3 / 4.4 · GDScript 2.0
            </p>

            <h1 className="text-display font-bold tracking-tight">
              Godot 4 — пошаговое руководство
            </h1>

            <p className="mt-5 max-w-prose text-body text-muted-foreground">
              24 недели от первого запуска редактора до релиза собственной игры. Не список фич, а
              последовательность шагов: каждый этап заканчивается работающим результатом, а каждое
              действие объясняет не только <span className="text-foreground">что</span> нажать, но и{' '}
              <span className="text-foreground">почему</span> так устроено.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={`/stage/${firstStage.slug}`}>
                  Начать с первого этапа
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/roadmap">Дорожная карта</Link>
              </Button>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-start gap-3">
                  <stat.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-h3 font-semibold tabular-nums">{stat.value}</p>
                    <p className="text-tiny text-muted-foreground">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-5">
            <ProgressRing value={progress.percent} size={168} thickness={14} />
            <p className="max-w-xs text-center text-small text-muted-foreground">
              {progress.done === 0
                ? 'Прогресс сохраняется в браузере — отмечайте темы и шаги, и он переживёт перезагрузку.'
                : `Отмечено ${progress.done} из ${progress.total} пунктов. Продолжайте с того места, где остановились.`}
            </p>
            {doneSet.size > 0 ? (
              <p className="text-tiny text-muted-foreground">Данные хранятся только в этом браузере.</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-gutter py-section">
        {/* Как устроен */}
        <Section
          title="Как здесь учиться"
          description="Курс устроен как лестница: каждый следующий этап опирается на предыдущий и добавляет ровно одну-две новых идеи."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              number="1"
              title="Читаете этап"
              text="Цели → темы с объяснением «зачем» → пошаговые инструкции → код → практика → мини-проект → критерий «знаю тему»."
            />
            <Card
              number="2"
              title="Делаете руками"
              text="Каждый шаг — это клик в реальном редакторе Godot с точным названием пункта меню. Не «где-то в настройках», а «File → Project Settings»."
            />
            <Card
              number="3"
              title="Отмечаете прогресс"
              text="Чекбоксы сохраняются в браузере. Кольцо на главной показывает, сколько курса пройдено, — видно, что движок не брошен на середине."
            />
          </div>
        </Section>

        <Callout variant="tip" title="Если вы никогда не открывали Godot">
          Начните с этапа 00 — он рассчитан на полного нуля: установка, панели редактора, первая
          сцена и первый коммит в Git. Дальше каждый этап опирается только на то, что дано раньше.
        </Callout>

        {/* Первые этапы */}
        <Section
          title="С чего начинается путь"
          description="Первые три этапа задают базу: среда и редактор, язык, сцены и сигналы. Дальше — физика, графика и релиз."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {previewStages.map((stage) => {
              const counts = countFor(stage)
              return (
                <StageCard key={stage.id} stage={stage} done={counts.done} total={counts.total} />
              )
            })}
          </div>

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/roadmap">
                Все {stages.length} этапов
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Section>

        {/* Что внутри */}
        <Section
          title="Что внутри курса"
          description="Материал рассчитан на три уровня подготовки: новичок, джун из Unity или Unreal и опытный разработчик, которому нужен справочник."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Проверенные примеры кода"
              text={`${totalCodeExamples} примеров GDScript. Каждый проверяется настоящим движком Godot headless: ошибка в имени метода ломает сборку, а не текст.`}
              to="/stage/03-2d-dvizhenie-i-fizika"
              linkText="Посмотреть пример"
            />
            <FeatureCard
              title="Календарный план на 24 недели"
              text="Что делать каждую неделю, сколько это занимает и какой результат должен получиться. С отметкой «неделя 3 — темы этапа 01»."
              to="/plan"
              linkText="Открыть план"
            />
            <FeatureCard
              title="Лестница проектов"
              text="От «мяч отскакивает» до собственной игры. Каждая ступень — законченный проект, который можно взять отдельно от курса."
              to="/ladder"
              linkText="Посмотреть лестницу"
            />
            <FeatureCard
              title="Шпаргалки"
              text="Синтаксис GDScript, карта узлов, частые ошибки и их сообщения, хоткеи редактора. Сделано так, чтобы открыть и сразу найти нужное."
              to="/cheatsheets"
              linkText="Открыть шпаргалки"
            />
            <FeatureCard
              title="Векторные диаграммы"
              text={`${diagramIds.length} схем: дерево сцены, жизненный цикл узла, поток сигналов, слои коллизий, пайплайн шейдера. Только SVG, без растровых картинок.`}
              to="/stage/02-sceny-uzly-signaly-resursy"
              linkText="Пример диаграммы"
            />
            <FeatureCard
              title="Глоссарий и FAQ"
              text="Все термины Godot с переводом и ссылкой на этап, где он разбирается. И ответы на частые вопросы новичка."
              to="/glossary"
              linkText="Открыть глоссарий"
            />
          </div>
        </Section>
      </div>
    </>
  )
}

function Card({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 font-mono text-small font-semibold text-primary"
      >
        {number}
      </span>
      <h3 className="mt-3 text-h4 font-semibold">{title}</h3>
      <p className="mt-2 text-small text-muted-foreground">{text}</p>
    </div>
  )
}

function FeatureCard({
  title,
  text,
  to,
  linkText,
}: {
  title: string
  text: string
  to: string
  linkText: string
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-xs transition-colors duration-150 hover:border-primary/40">
      <h3 className="text-h4 font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-small text-muted-foreground">{text}</p>
      <Link
        to={to}
        className="mt-4 inline-flex min-h-9 items-center gap-1 self-start rounded-sm text-small font-medium text-primary underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {linkText}
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
