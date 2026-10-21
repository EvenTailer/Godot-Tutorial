import { Link } from 'react-router-dom'
import { projectLadder } from '@/content/project-ladder'
import { stages } from '@/content/stages'
import { ProjectLadder } from '@/components/content/ProjectLadder'
import { Badge } from '@/components/ui/badge'
import { PageHeader, Section } from '@/components/layout/PageHeader'

const stageById = new Map(stages.map((stage) => [stage.id, stage]))

export function LadderPage() {
  const hrefForStage = (stageId: string) => {
    const stage = stageById.get(stageId)
    return stage ? `/stage/${stage.slug}` : '/roadmap'
  }

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Лестница проектов"
        title="От «мяч отскакивает» до своей игры"
        description="Проекты выстроены по навыкам: каждый следующий использует то, что вы уже умеете. Можно взять любой уровень как самостоятельный проект — даже не проходя курс целиком."
      />

      <Section title="Семь уровней" className="mt-section">
        <ProjectLadder items={projectLadder} hrefForStage={hrefForStage} />
      </Section>

      <Section
        title="Проекты внутри этапов"
        description="Быстрые проекты, которые закрываются за один вечер. Их удобно делать параллельно с теорией."
        className="mt-section"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => {
            return (
              <Link
                key={stage.id}
                to={`/stage/${stage.slug}`}
                className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs transition-colors duration-150 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="font-medium leading-snug">{stage.project.title}</span>
                <span className="mt-auto flex items-center gap-2">
                  <Badge variant="outline">этап {stage.id}</Badge>
                  <Badge variant="secondary">≈ {stage.hours} ч</Badge>
                </span>
              </Link>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
