import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: React.ReactNode
  content: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  /** Подпись-объяснение для скринридера. */
  label: string
}

/**
 * Вкладки на нативных кнопках с ролью tab.
 * Управление стрелками вверх/вниз/влево/вправо по WAI-ARIA.
 */
export function Tabs({ items, value, defaultValue, onValueChange, className, label }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id)
  const current = value ?? internal
  const listRef = React.useRef<HTMLDivElement>(null)

  const select = (next: string) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const index = items.findIndex((item) => item.id === current)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % items.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      nextIndex = (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1
    const next = items[nextIndex]
    if (!next) return
    select(next.id)
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[nextIndex]?.focus()
  }

  const active = items.find((item) => item.id === current) ?? items[0]

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
      >
        {items.map((item) => {
          const isActive = item.id === current
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={cn(
                'min-h-11 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {active ? (
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          {active.content}
        </div>
      ) : null}
    </div>
  )
}
