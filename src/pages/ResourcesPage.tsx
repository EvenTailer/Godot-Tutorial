import { Link } from 'react-router-dom'
import { resourceGroups } from '@/content/resources'
import { ResourceList } from '@/components/content/ResourceList'
import { Badge } from '@/components/ui/badge'
import { PageHeader, Section } from '@/components/layout/PageHeader'

export function ResourcesPage() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Ресурсы"
        title="Где брать документацию, ассеты и инструменты"
        description="Только официальные и широко известные источники. Главное правило: проверяйте лицензию каждого файла — CC0 можно везде, CC-BY требует указания автора, CC-BY-SA распространяется и на производные работы."
      />

      <div className="mt-section flex flex-col gap-section">
        {resourceGroups.map((group) => (
          <Section key={group.id} title={group.title} description={group.summary}>
            <ResourceList resources={group.items} />
          </Section>
        ))}
      </div>

      <Section title="Смотрите также" className="mt-section">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/glossary"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-4 text-sm font-medium shadow-xs transition-colors duration-150 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Глоссарий терминов
          </Link>
          <Link
            to="/cheatsheets"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-4 text-sm font-medium shadow-xs transition-colors duration-150 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Шпаргалки
          </Link>
          <Badge variant="secondary" className="min-h-11 px-4 py-2">
            Сайт работает офлайн
          </Badge>
        </div>
      </Section>
    </div>
  )
}
