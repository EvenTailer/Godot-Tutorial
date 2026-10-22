import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bug,
  CalendarDays,
  Code2,
  Compass,
  GitBranch,
  Layers,
  Sparkles,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import { courseTotals, stageManifest } from '@/content/stages/manifest'
import { plan24Weeks } from '@/content/plan-24-weeks'
import { diagramIds } from '@/content/diagrams'
import { godotErrors } from '@/content/errors'
import { ProgressRing } from '@/components/content/ProgressRing'
import { StageCard } from '@/components/content/StageCard'
import { Callout } from '@/components/content/Callout'
import { ContinueCard } from '@/components/content/ContinueCard'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/content/Reveal'
import { useCountUp } from '@/hooks/useCountUp'
import { useStageProgress } from '@/hooks/useStageProgress'
import { useProgress } from '@/hooks/useProgress'
import { usePageMeta } from '@/hooks/usePageMeta'

export function HomePage() {
  const { countFor, overall } = useStageProgress()
  const { doneSet } = useProgress()
  const progress = overall()
  const firstStage = stageManifest[0]
  const previewStages = stageManifest.slice(0, 3)

  usePageMeta(
    'Godot 4 — пошаговое руководство',
    '13 этапов, 24 недели: от первого запуска редактора до релиза собственной игры. Все примеры кода проверяются настоящим движком Godot.',
  )

  const stats = [
    { icon: Layers, value: courseTotals.stages, label: 'этапов курса' },
    { icon: CalendarDays, value: plan24Weeks.length, label: 'недель плана' },
    { icon: Code2, value: courseTotals.code, label: 'примеров кода' },
    { icon: BookOpen, value: courseTotals.tasks, label: 'практических заданий' },
    { icon: Compass, value: diagramIds.length, label: 'векторных диаграмм' },
    { icon: GitBranch, value: courseTotals.hours, label: 'часов по этапам', suffix: ' ч' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 to-background">
        {/* Медленно плывущие пятна света — только фон, текст поверх. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl motion-safe:animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-info/10 blur-3xl motion-safe:animate-aurora [animation-delay:-8s]"
        />

        <div className="relative mx-auto grid max-w-content gap-10 px-gutter py-section lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-tiny font-medium text-primary">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Godot 4.7.2 · GDScript 2.0 · примеры проверены движком
            </p>
            <p className="-mt-1 mb-3 text-tiny text-muted-foreground">
              Актуальная версия на{' '}
              <Link
                to="/versions"
                className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                что изменилось в 4.4 → 4.7
              </Link>
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
              <Button asChild size="lg" className="shadow-brand">
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
              {stats.map((stat, index) => (
                <Reveal as="li" key={stat.label} delay={index * 50}>
                  <div className="flex items-start gap-3">
                    <stat.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-h3 font-semibold tabular-nums">
                        <CountUpStat value={stat.value} suffix={stat.suffix ?? ''} />
                      </p>
                      <p className="text-tiny text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Reveal>
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
        {/* Продолжить */}
        <Reveal>
          <ContinueCard />
        </Reveal>

        {/* Как устроен */}
        <Section
          title="Как здесь учиться"
          description="Курс устроен как лестница: каждый следующий этап опирается на предыдущий и добавляет ровно одну-две новых идеи."
          className="mt-section"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                number: '1',
                icon: BookOpen,
                title: 'Читаете этап',
                text: 'Цели → темы с объяснением «зачем» → пошаговые инструкции → код → практика → мини-проект → критерий «знаю тему».',
              },
              {
                number: '2',
                icon: Terminal,
                title: 'Делаете руками',
                text: 'Каждый шаг — это клик в реальном редакторе Godot с точным названием пункта меню. Не «где-то в настройках», а «File → Project Settings».',
              },
              {
                number: '3',
                icon: Sparkles,
                title: 'Отмечаете прогресс',
                text: 'Чекбоксы сохраняются в браузере. Кольцо на главной показывает, сколько курса пройдено, — видно, что движок не брошен на середине.',
              },
            ].map((card, index) => (
              <Reveal key={card.number} delay={index * 80}>
                <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-mono text-small font-semibold text-primary transition-transform duration-200 group-hover:scale-105"
                    >
                      {card.number}
                    </span>
                    <card.icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-h4 font-semibold">{card.title}</h3>
                  <p className="mt-2 text-small leading-relaxed text-muted-foreground">{card.text}</p>
                </article>
              </Reveal>
            ))}
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
            {previewStages.map((stage, index) => {
              const counts = countFor(stage)
              return (
                <Reveal key={stage.id} delay={index * 80}>
                  <StageCard stage={stage} done={counts.done} total={counts.total} className="h-full" />
                </Reveal>
              )
            })}
          </div>

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/roadmap">
                Все {courseTotals.stages} этапов
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
              icon={Code2}
              title="Проверенные примеры кода"
              text={`${courseTotals.code} примеров кода, из них ${courseTotals.gdscript} на GDScript. Каждый проверяется настоящим движком Godot headless: ошибка в имени метода ломает сборку, а не текст.`}
              to="/stage/03-2d-dvizhenie-i-fizika"
              linkText="Посмотреть пример"
            />
            <FeatureCard
              icon={CalendarDays}
              title="Календарный план на 24 недели"
              text="Что делать каждую неделю, сколько это занимает и какой результат должен получиться. С отметкой «неделя 3 — темы этапа 01»."
              to="/plan"
              linkText="Открыть план"
            />
            <FeatureCard
              icon={Layers}
              title="Лестница проектов"
              text="От «мяч отскакивает» до собственной игры. Каждая ступень — законченный проект, который можно взять отдельно от курса."
              to="/ladder"
              linkText="Посмотреть лестницу"
            />
            <FeatureCard
              icon={BookOpen}
              title="Шпаргалки"
              text="Синтаксис GDScript, карта узлов, частые ошибки и их сообщения, хоткеи редактора. Сделано так, чтобы открыть и сразу найти нужное."
              to="/cheatsheets"
              linkText="Открыть шпаргалки"
            />
            <FeatureCard
              icon={Bug}
              title="Справочник ошибок"
              text={`${godotErrors.length} разборов сообщений Godot: что движок имел в виду, почему ошибка возникла и что сделать, чтобы исправить.`}
              to="/errors"
              linkText="Открыть справочник"
            />
            <FeatureCard
              icon={Compass}
              title="Глоссарий и FAQ"
              text="Все термины Godot с переводом и ссылкой на этап, где он разбирается. И ответы на частые вопросы новичка."
              to="/glossary"
              linkText="Открыть глоссарий"
            />
          </div>
        </Section>

        {/* Свежее */}
        <Section
          title="Свежее"
          description="Курс идёт по актуальной версии движка и пополняется."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h3 font-semibold">Godot 4.7.2</h3>
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-tiny font-medium text-success">
                    актуальная стабильная
                  </span>
                </div>
                <p className="text-small leading-relaxed text-muted-foreground">
                  Примеры кода проверяются на Godot 4.7.2. Версии 4.5–4.7 принесли заметные
                  изменения — они отмечены в этапах, где API менялся.
                </p>
                <ul className="flex flex-col gap-1.5 text-small text-muted-foreground">
                  {[
                    'AreaLight3D — прямоугольный свет в 3D',
                    'offset_transform у Control — анимация интерфейса без разрывов',
                    'one_way_collision_direction — односторонние коллизии',
                    'DrawableTexture2D — рисование по текстуре без Viewport',
                    'Asset Store и standalone-экспорт для Android',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <Button asChild variant="outline">
                    <Link to="/versions">
                      Что изменилось в 4.4 → 4.7
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            </Reveal>

            <Reveal delay={80}>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h3 font-semibold">Когда ошибка непонятна</h3>
                  <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-tiny font-medium text-warning">
                    {godotErrors.length} разборов
                  </span>
                </div>
                <p className="text-small leading-relaxed text-muted-foreground">
                  Скопируйте сообщение из Output в поиск справочника — получите разбор: когда
                  возникает, почему и что делать. Все ошибки привязаны к этапам, где тема разбирается.
                </p>
                <ul className="flex flex-col gap-1.5 text-small text-muted-foreground">
                  {[
                    'Identifier not declared — опечатка или порядок объявлений',
                    'Nil вместо узла — get_node() ничего не нашёл',
                    'Invalid operands — Dictionary.get() без значения по умолчанию',
                    'Failed loading resource — неверный путь или не импортированный файл',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <Button asChild variant="outline">
                    <Link to="/errors">
                      Открыть справочник ошибок
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  )
}

/** Число, которое плавно растёт до значения. */
function CountUpStat({ value, suffix }: { value: number; suffix: string }) {
  const animated = useCountUp(value)
  return (
    <>
      <span aria-hidden="true">
        {animated}
        {suffix}
      </span>
      {/* Скринридеру отдаём итоговое значение, а не промежуточные кадры анимации. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  text,
  to,
  linkText,
}: {
  icon: LucideIcon
  title: string
  text: string
  to: string
  linkText: string
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
      {/* Мягкий градиентный край появляется при наведении. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 ease-standard group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 ease-standard group-hover:scale-105"
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-h4 font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-small leading-relaxed text-muted-foreground">{text}</p>
      <Link
        to={to}
        className="mt-4 inline-flex min-h-11 items-center gap-1 self-start rounded-sm text-small font-medium text-primary underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {linkText}
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </article>
  )
}
