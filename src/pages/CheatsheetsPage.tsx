import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bug } from 'lucide-react'
import { cheatSheets } from '@/content/cheatsheets'
import { godotErrors } from '@/content/errors'
import { CheatSheetTabs } from '@/components/content/CheatSheetTabs'
import { Callout } from '@/components/content/Callout'
import { PageHeader } from '@/components/layout/PageHeader'
import { usePageMeta } from '@/hooks/usePageMeta'

export function CheatsheetsPage() {
  usePageMeta(
    'Шпаргалки по Godot',
    'Синтаксис GDScript, карта узлов, частые ошибки и хоткеи редактора Godot — короткие ответы под рукой.',
  )

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Шпаргалки"
        title="Короткие ответы под рукой"
        description="Четыре тетрадки: синтаксис языка, карта узлов, частые ошибки с разбором сообщений и хоткеи редактора. Сделано так, чтобы открыть нужную вкладку и сразу найти ответ."
      />

      <Callout variant="info" title="Как читать шпаргалки">
        Это не замена этапам, а памятка. Если в шпаргалке встретилось то, чего вы ещё не видели —
        вернитесь к этапу, где это разбирается: в глоссарии у каждого термина есть ссылка.
      </Callout>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/errors"
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="inline-flex items-center gap-2 text-tiny font-semibold uppercase tracking-wider text-primary">
            <Bug aria-hidden="true" className="h-3.5 w-3.5" />
            Справочник
          </span>
          <span className="font-medium">Сообщения ошибок Godot</span>
          <span className="text-small text-muted-foreground">
            {godotErrors.length} разборов: текст ошибки, причина, решение и этап, где тема
            разбирается. Скопируйте сообщение из Output в поиск.
          </span>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1 text-small font-medium text-primary">
            Открыть справочник ошибок
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </Link>

        <Link
          to="/versions"
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="inline-flex items-center gap-2 text-tiny font-semibold uppercase tracking-wider text-primary">
            <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Миграция
          </span>
          <span className="font-medium">Что изменилось в 4.5–4.7</span>
          <span className="text-small text-muted-foreground">
            Новые возможности движка и что делать при переходе на Godot 4.7: шейдер-бейкер, Jolt,
            уникальные ID узлов, односторонние коллизии.
          </span>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1 text-small font-medium text-primary">
            Открыть список изменений
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </Link>
      </div>

      <div className="mt-section">
        <CheatSheetTabs sheets={cheatSheets} />
      </div>
    </div>
  )
}
