import * as React from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Задержка появления в миллисекундах — для каскада карточек. */
  delay?: number
  /** Тег-обёртка. Нужен, чтобы не ломать структуру списков: `<Reveal as="li">`. */
  as?: 'div' | 'li' | 'article' | 'section'
}

/**
 * Контейнер, который появляется при прокрутке.
 *
 * Разметка и анимация живут в CSS (.reveal / .is-visible), поэтому
 * при отключённых анимациях или при печати блок виден сразу.
 */
export function Reveal({ children, className, delay = 0, style, as = 'div', ...props }: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>()
  const Tag = as as React.ElementType

  return (
    <Tag
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...props}
    >
      {children}
    </Tag>
  )
}
