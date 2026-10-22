import * as React from 'react'
import { BookOpen, ExternalLink, FileText, Video, Wrench } from 'lucide-react'
import type { Resource, ResourceKind } from '@/content/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const kindIcon: Record<ResourceKind, React.ComponentType<{ className?: string }>> = {
  docs: BookOpen,
  reference: FileText,
  video: Video,
  tool: Wrench,
  article: FileText,
}

const kindLabel: Record<ResourceKind, string> = {
  docs: 'туториал',
  reference: 'справочник',
  video: 'видео',
  tool: 'инструмент',
  article: 'статья',
}

export interface ResourceListProps {
  resources: Resource[]
  className?: string
}

/** Список внешних ресурсов. Все ссылки открываются в новой вкладке с безопасными атрибутами. */
export function ResourceList({ resources, className }: ResourceListProps) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {resources.map((resource) => {
        const Icon = kindIcon[resource.kind]
        return (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs transition-all duration-150 hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2 font-medium leading-snug">
                  <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {resource.title}
                </span>
                <ExternalLink
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                />
                <span className="sr-only">(откроется в новой вкладке)</span>
              </div>
              {resource.note ? (
                <p className="text-small text-muted-foreground">{resource.note}</p>
              ) : null}
              <Badge variant="secondary" className="self-start">
                {kindLabel[resource.kind]}
              </Badge>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
