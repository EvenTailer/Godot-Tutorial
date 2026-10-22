import { Link } from 'react-router-dom'
import { ArrowRight, Bug, FileQuestion, PackageOpen, Terminal } from 'lucide-react'
import type { GodotErrorEntry, ErrorKind } from '@/content/errors'
import { errorKinds } from '@/content/errors'
import { stageManifestById } from '@/content/stages/manifest'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ErrorCardProps {
  entry: GodotErrorEntry
  className?: string
}

const kindStyle: Record<
  ErrorKind,
  { label: string; icon: typeof Bug; tone: 'destructive' | 'warning' | 'info' | 'primary' }
> = {
  parse: { label: 'Parse Error — разбор скрипта', icon: FileQuestion, tone: 'warning' },
  runtime: { label: 'Runtime — во время выполнения', icon: Bug, tone: 'destructive' },
  resource: { label: 'Ресурсы и файлы', icon: PackageOpen, tone: 'info' },
  logic: { label: 'Логика', icon: Terminal, tone: 'primary' },
}

const toneClass: Record<string, string> = {
  destructive: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
  primary: 'bg-primary/10 text-primary',
}

/** Карточка ошибки: сообщение движка, причина и пошаговое решение. */
export function ErrorCard({ entry, className }: ErrorCardProps) {
  const style = kindStyle[entry.kind]
  const Icon = style.icon
  const stage = entry.stageId ? stageManifestById.get(entry.stageId) : undefined
  const summary = errorKinds.find((kind) => kind.id === entry.kind)?.summary

  return (
    <article
      id={entry.id}
      className={cn(
        'group flex scroll-mt-24 flex-col gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 ease-standard',
        'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover print:break-inside-avoid print:shadow-none print:hover:transform-none',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
              toneClass[style.tone],
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            {/* Заголовок карточки — само сообщение: оно и есть суть записи.
                Путь res://… неразрывен — без переносов он распирает карточку. */}
            <h3 className="font-mono text-small font-semibold leading-snug [overflow-wrap:anywhere]">
              {entry.message}
            </h3>
            <p className="mt-1 text-tiny text-muted-foreground">
              {style.label}
              {summary ? ` — ${summary}` : ''}
            </p>
          </div>
        </div>
        {stage ? (
          <Link
            to={`/stage/${stage.slug}`}
            aria-label={`Этап ${String(stage.number).padStart(2, '0')}: ${stage.title}`}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Badge variant="outline">этап {String(stage.number).padStart(2, '0')}</Badge>
          </Link>
        ) : null}
      </div>

      <dl className="flex flex-col gap-3 text-small">
        <div>
          <dt className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            Когда возникает
          </dt>
          <dd className="mt-1 leading-relaxed [overflow-wrap:anywhere]">{entry.when}</dd>
        </div>
        <div>
          <dt className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            Почему
          </dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
            {entry.cause}
          </dd>
        </div>
        <div>
          <dt className="text-tiny font-semibold uppercase tracking-wide text-primary">
            Что делать
          </dt>
          <dd className="mt-1 leading-relaxed [overflow-wrap:anywhere]">{entry.fix}</dd>
        </div>
      </dl>

      {entry.note ? (
        <p className="rounded-md border-l-4 border-warning/60 bg-warning/10 px-3 py-2 text-tiny text-muted-foreground">
          {entry.note}
        </p>
      ) : null}

      {stage ? (
        <Link
          to={`/stage/${stage.slug}`}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start rounded-sm text-small font-medium text-primary underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Разобрано на этапе {String(stage.number).padStart(2, '0')} — {stage.shortTitle}
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      ) : null}
    </article>
  )
}

export interface ErrorFilterProps {
  kinds: ErrorKind[]
  active: ErrorKind | 'all'
  onChange: (kind: ErrorKind | 'all') => void
  counts: Record<string, number>
  className?: string
}

/** Переключатель типа ошибок — чипы вместо выпадающего списка. */
export function ErrorFilter({ kinds, active, onChange, counts, className }: ErrorFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Фильтр по типу ошибки">
      <FilterChip active={active === 'all'} onClick={() => onChange('all')} count={counts.all ?? 0}>
        Все
      </FilterChip>
      {kinds.map((kind) => {
        // Тип без записей не показываем: чип со счётчиком 0 — мёртвый фильтр.
        if (!counts[kind]) return null
        return (
          <FilterChip
            key={kind}
            active={active === kind}
            onClick={() => onChange(kind)}
            count={counts[kind]}
          >
            {kind === 'parse'
              ? 'Parse Error'
              : kind === 'runtime'
                ? 'Runtime'
                : kind === 'resource'
                  ? 'Ресурсы'
                  : 'Логика'}
          </FilterChip>
        )
      })}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-small font-medium transition-all duration-150 ease-standard',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'border-transparent bg-primary text-primary-foreground shadow-xs'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
      <span
        className={cn(
          'rounded-full px-1.5 text-tiny tabular-nums',
          active
            ? 'bg-primary-foreground text-primary'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  )
}
