import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItemProps
  extends Omit<
    React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>,
    'title'
  > {
  title: React.ReactNode
  /** Показывать плюс/минус вместо стрелки. */
  icon?: 'chevron' | 'plus'
}

/**
 * Раскрывающийся блок на нативном <details>/<summary>.
 *
 * Нативный элемент бесплатно даёт клавиатурное управление (Enter/Space),
 * aria-expanded и возможность печати — плюс при печати все секции раскрываются
 * через @media print в index.css.
 */
export function AccordionItem({
  title,
  icon = 'chevron',
  className,
  children,
  ...props
}: AccordionItemProps) {
  const Icon = icon === 'plus' ? null : ChevronRight
  return (
    <details
      className={cn(
        'group rounded-lg border border-border bg-card shadow-xs transition-shadow duration-150 ease-standard open:shadow-sm',
        className,
      )}
      {...props}
    >
      <summary
        className={cn(
          'flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-h4 font-medium',
          'transition-colors duration-150 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <span>{title}</span>
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-90 motion-reduce:transition-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-muted-foreground before:content-['+'] group-open:before:content-['−']"
          />
        )}
      </summary>
      <div className="border-t border-border px-4 py-4">{children}</div>
    </details>
  )
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Открывать только один раздел за раз. */
  single?: boolean
}

export function Accordion({ className, single = false, children, ...props }: AccordionProps) {
  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      data-single={single ? 'true' : 'false'}
      {...props}
    >
      {single
        ? React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
                  name: 'accordion-group',
                })
              : child,
          )
        : children}
    </div>
  )
}
