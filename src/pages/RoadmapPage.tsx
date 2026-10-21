import * as React from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, X } from 'lucide-react'
import { stages } from '@/content/stages'
import { RoadmapTimeline } from '@/components/content/RoadmapTimeline'
import { StageCard } from '@/components/content/StageCard'
import { Callout } from '@/components/content/Callout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader, Section } from '@/components/layout/PageHeader'
import { useStageProgress } from '@/hooks/useStageProgress'

export function RoadmapPage() {
  const { countFor, percentFor } = useStageProgress()
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length < 2) return stages
    return stages.filter((stage) => {
      const inTitle = stage.title.toLowerCase().includes(trimmed)
      const inSubtitle = stage.subtitle.toLowerCase().includes(trimmed)
      const inTopic = stage.topics.some(
        (topic) =>
          topic.title.toLowerCase().includes(trimmed) ||
          topic.summary.toLowerCase().includes(trimmed),
      )
      return inTitle || inSubtitle || inTopic
    })
  }, [query])

  const hasQuery = query.trim().length >= 2

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Дорожная карта"
        title="12 этапов: от редактора до релиза"
        description="Этапы идут строго по порядку: всё, что нужно знать на этапе N, дано на этапах до N. Каждый этап закрывается работающим результатом, а не «прочитал и понял»."
      />

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Фильтр по этапам и темам: «сигнал», «тайлы», «сохранение»…"
              aria-label="Фильтр дорожной карты"
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
            ? `Найдено этапов: ${filtered.length} из ${stages.length}`
            : `Всего этапов: ${stages.length}`}
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
              {filtered.map((stage) => {
                const counts = countFor(stage)
                return (
                  <StageCard key={stage.id} stage={stage} done={counts.done} total={counts.total} />
                )
              })}
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
