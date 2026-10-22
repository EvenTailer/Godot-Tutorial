import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode
  /** Показывать галочку внутри квадрата (по умолчанию true). */
  showMark?: boolean
}

/**
 * Чекбокс на нативном input[type=checkbox].
 *
 * Нативный элемент даёт бесплатно клавиатурное управление, focus-visible
 * и работу со скринридерами, поэтому Radix-обёртка не нужна (DECISIONS.md, D-002).
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, showMark = true, id, ...props }, ref) => {
    // useId вызывается безусловно: условный вызов ломает правило хуков.
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    return (
      <label htmlFor={inputId} className={cn('flex min-h-11 items-start gap-3', className)}>
        <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded-xs border border-input bg-background transition-colors duration-150',
              'checked:border-primary checked:bg-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            {...props}
          />
          {showMark && (
            <Check
              aria-hidden="true"
              className="pointer-events-none absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
              strokeWidth={3}
            />
          )}
        </span>
        {label ? <span className="cursor-pointer text-small leading-relaxed">{label}</span> : null}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
