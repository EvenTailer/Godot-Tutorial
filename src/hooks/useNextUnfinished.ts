import * as React from 'react'
import { findNextUnfinished, type NextStep } from '@/lib/continue'
import { useProgress } from '@/hooks/useProgress'

/**
 * Следующий незакрытый пункт курса.
 *
 * Пересчитывается на каждое изменение отметок, поэтому карточка
 * «продолжить» всегда показывает актуальное состояние.
 */
export function useNextUnfinished(): NextStep | null {
  const { doneSet } = useProgress()
  return React.useMemo(() => findNextUnfinished(doneSet), [doneSet])
}
