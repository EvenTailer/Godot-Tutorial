import * as React from 'react'
import { AlertTriangle, Info, Lightbulb, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'danger'

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant
  title?: string
}

const variants: Record<
  CalloutVariant,
  { icon: React.ComponentType<{ className?: string }>; className: string; label: string }
> = {
  info: { icon: Info, className: 'border-info/40 bg-info/10', label: 'Заметка' },
  tip: { icon: Lightbulb, className: 'border-success/40 bg-success/10', label: 'Совет' },
  warning: { icon: AlertTriangle, className: 'border-warning/45 bg-warning/10', label: 'Осторожно' },
  danger: { icon: ShieldAlert, className: 'border-destructive/45 bg-destructive/10', label: 'Ловушка' },
}

/** Врезка с важным замечанием. Используется, чтобы текст не превращался в стену. */
export function Callout({ variant = 'info', title, className, children, ...props }: CalloutProps) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      role="note"
      className={cn(
        'my-5 flex gap-3 rounded-lg border-l-4 border-y border-r p-4 text-small leading-relaxed print-avoid-break',
        config.className,
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-semibold">
          <span className="sr-only">{config.label}: </span>
          {title ?? config.label}
        </p>
        <div className="text-muted-foreground [&_code]:text-foreground">{children}</div>
      </div>
    </div>
  )
}
