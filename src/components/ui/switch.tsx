import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode
}

/** Переключатель на нативном checkbox с ролью switch. */
const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    return (
      <div className={cn('flex min-h-11 items-center gap-3', className)}>
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          role="switch"
          className={cn(
            'peer relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-muted transition-colors duration-150',
            'checked:border-primary checked:bg-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            "before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-background before:shadow-sm before:transition-transform before:duration-150 before:content-[''] peer-checked:before:translate-x-5",
          )}
          {...props}
        />
        {label ? (
          <label htmlFor={inputId} className="cursor-pointer text-small">
            {label}
          </label>
        ) : null}
      </div>
    )
  },
)
Switch.displayName = 'Switch'

export { Switch }
