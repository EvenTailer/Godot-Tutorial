import * as React from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, X } from 'lucide-react'
import { stageManifest } from '@/content/stages/manifest'
import { RoadmapTimeline } from '@/components/content/RoadmapTimeline'
import { StageCard } from '@/components/content/StageCard'
import { Callout } from '@/components/content/Callout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader, Section } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/content/Reveal'
import { useStageProgress } from '@/hooks/useStageProgress'
import { usePageMeta } from '@/hooks/usePageMeta'

export function RoadmapPage() {
  const { countFor, percentFor } = useStageProgress()
  const [query, setQuery] = React.useState('')

  usePageMeta(
    'Дорожная карта курса',
    '13 этапов обучения Godot 4 по порядку: от редактора до релиза игры. С прогрессом, неделями и результатом каждого этапа.',
  )

  const filtered = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length < 2) return stageManifest
    return stageManifest.filter((stage) => {
      const inTitle = stage.title.toLowerCase().includes(trimmed)
      const inSubtitle = stage.subtitle.toLowerCase().includes(trimmed)
      const inOutcome = stage.outcome.toLowerCase().includes(trimmed)
      return inTitle || inSubtitle || inOutcome
    })
  }, [query])

  const hasQuery = query.trim().length >= 2

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Дорожная карта"
        title="13 этапов: от редактора до релиза"
        description="Этапы идут строго по порядку: всё, что нужно знать на этапе N, дано на этапах до N. Каждый этап закрывается работающим результатом, а не «прочитал и понял»."
      />

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label
              htmlFor="roadmap-search"
              className="mb-1.5 block text-tiny font-medium text-muted-foreground"
            >
              Фильтр по этапам и темам
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="roadmap-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="сигнал, тайлы, сохранение…"
              className="pl-9"
            />
          </div>
          {query ? (
            <Button variant="ghost" onClick={() => setQuery('')}>
              <X aria-hidden="true" />
              Сбросить
            </Button>
          ) : null}
        </div>

        <p className="flex items-center gap-2 text-small text-muted-foreground">
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          {hasQuery
            ? `Найдено этапов: ${filtered.length} из ${stageManifest.length}`
            : `Всего этапов: ${stageManifest.length}`}
        </p>
      </div>

      {hasQuery && filtered.length === 0 ? (
        <Callout variant="info" title="Ничего не найдено">
          По запросу «{query.trim()}» нет ни одного этапа. Попробуйте другое слово — например,
          «сигнал», «delta», «тайлы», «сохранение» — или откройте{' '}
          <Link to="/cheatsheets" className="font-medium text-primary underline-offset-4 hover:underline">
            шпаргалки
          </Link>
          , где собраны короткие ответы.
        </Callout>
      ) : (
        <>
          <Section title="Таймлайн" className="mt-12">
            <RoadmapTimeline stages={filtered} progressOf={percentFor} />
          </Section>

          <Section title="Все этапы карточками" className="mt-section">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((stage, index) => {
                const counts = countFor(stage)
                return (
                  <Reveal key={stage.id} delay={Math.min(index, 8) * 50}>
                    <StageCard stage={stage} done={counts.done} total={counts.total} className="h-full" />
                  </Reveal>
                )
              })}
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
