import { getDiagram } from '@/content/diagrams'
import { diagramComponents } from '@/components/diagrams'
import { cn } from '@/lib/utils'

export interface DiagramProps {
  id: string
  className?: string
}

/**
 * Обёртка диаграммы: заголовок, сам рисунок, легенда и подпись словами.
 *
 * Подпись обязательна: если читатель не видит рисунок (например, при печати
 * или на узком экране), смысл всё равно передаётся текстом.
 */
export function Diagram({ id, className }: DiagramProps) {
  const meta = getDiagram(id)
  const Component = diagramComponents[id]

  if (!meta || !Component) return null

  return (
    <figure
      className={cn(
        'my-6 overflow-hidden rounded-lg border border-border bg-card shadow-xs print-avoid-break',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="text-h4 font-semibold">{meta.title}</h3>
        <span className="shrink-0 text-tiny text-muted-foreground sm:hidden">→ прокрутите</span>
      </figcaption>

      <div className="scroll-x bg-[hsl(var(--diagram-surface))] px-3 py-4">
        <div style={{ minWidth: meta.minWidth }} className="w-full">
          <Component />
        </div>
      </div>

      <div className="border-t border-border px-4 py-3">
        <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
          {meta.legend.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-tiny text-muted-foreground">
              <LegendMark kind={item.kind} />
              {item.label}
            </li>
          ))}
        </ul>
        <p className="text-small text-muted-foreground">{meta.caption}</p>
      </div>
    </figure>
  )
}

function LegendMark({ kind }: { kind: 'flow' | 'weak' | 'node' | 'accent' }) {
  if (kind === 'flow') {
    return (
      <svg aria-hidden="true" width="26" height="10" viewBox="0 0 26 10">
        <line x1="1" y1="5" x2="20" y2="5" stroke="var(--diagram-flow)" strokeWidth="1.8" />
        <path d="M 19 1 L 25 5 L 19 9 z" fill="var(--diagram-flow)" />
      </svg>
    )
  }
  if (kind === 'weak') {
    return (
      <svg aria-hidden="true" width="26" height="10" viewBox="0 0 26 10">
        <line
          x1="1"
          y1="5"
          x2="20"
          y2="5"
          stroke="var(--diagram-weak)"
          strokeWidth="1.4"
          strokeDasharray="6 5"
        />
        <path d="M 19 1 L 25 5 L 19 9 z" fill="var(--diagram-weak)" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" width="16" height="12" viewBox="0 0 16 12">
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="11"
        rx="3"
        fill={kind === 'accent' ? 'var(--diagram-accent-soft)' : 'var(--diagram-node)'}
        stroke={kind === 'accent' ? 'var(--diagram-accent)' : 'var(--diagram-stroke)'}
        strokeWidth="1.4"
      />
    </svg>
  )
}
