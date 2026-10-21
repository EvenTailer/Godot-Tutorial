import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/** Единая шапка страницы: надзаголовок, заголовок, описание, действия. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('border-b border-border pb-8', className)}>
      {eyebrow ? (
        <p className="mb-2 text-tiny font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="text-display font-bold tracking-tight">{title}</h1>
      {description ? (
        <div className="mt-4 max-w-prose text-body text-muted-foreground">{description}</div>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  )
}

export interface SectionProps {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  id?: string
  className?: string
}

/** Секция страницы с заголовком — разделяет длинные страницы на блоки. */
export function Section({ title, description, children, id, className }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <div className="mb-6">
        <h2 className="text-h2 font-semibold">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-prose text-body text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
