import { Link } from 'react-router-dom'
import { glossary } from '@/content/glossary'
import { stages } from '@/content/stages'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'

const stageById = new Map(stages.map((stage) => [stage.id, stage]))

export function GlossaryPage() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Глоссарий"
        title="Словарь терминов Godot"
        description="Английские термины в курсе намеренно не переводятся — так вы будете узнавать их в документации. Здесь собраны значения и указано, на каком этапе термин разбирается."
      />

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {glossary.map((entry) => {
          const stage = stageById.get(entry.stageId)
          return (
            <article
              key={entry.id}
              id={entry.id}
              className="scroll-mt-24 rounded-lg border border-border bg-card p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h2 className="font-mono text-h4 font-semibold">{entry.term}</h2>
                <span className="text-small text-muted-foreground">— {entry.translation}</span>
              </div>
              <p className="mt-2 text-small leading-relaxed text-muted-foreground">{entry.meaning}</p>
              {stage ? (
                <Link
                  to={`/stage/${stage.slug}`}
                  className="mt-3 inline-flex min-h-9 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Badge variant="outline">этап {stage.number} · {stage.shortTitle}</Badge>
                </Link>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
