import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  /** Сторона, из которой выезжает панель. */
  side?: 'left' | 'right'
}

/**
 * Мобильная навигация на нативном <dialog>.
 *
 * showModal() даёт модальный режим: блокирует прокрутку фона,
 * перехватывает Esc и возвращает фокус — всё без сторонних библиотек.
 */
export function Drawer({ open, onClose, title, children, side = 'left' }: DrawerProps) {
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => dialog.removeEventListener('cancel', onCancel)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={cn(
        'm-0 h-full max-h-none w-[85vw] max-w-sm border-0 bg-card p-0 text-card-foreground shadow-lg backdrop:bg-background/70',
        side === 'left' ? 'mr-auto' : 'ml-auto',
        'open:animate-fade-in motion-reduce:open:animate-none',
      )}
      onClick={(event) => {
        // Клик по подложке (сам dialog) закрывает панель.
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="text-h4 font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </dialog>
  )
}
