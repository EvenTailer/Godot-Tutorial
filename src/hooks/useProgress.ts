import * as React from 'react'
import { useCallback, useSyncExternalStore } from 'react'
import {
  getSnapshot,
  isDone,
  progressKey,
  setDone,
  subscribe,
  type ProgressKind,
} from '@/lib/progress'

/**
 * Хук прогресса обучения.
 * Возвращает набор отмеченных пунктов и функции отметки.
 */
export function useProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // Set мемоизируется: иначе каждый рендер создавал бы новый объект
  // и все useMemo по нему пересчитывались бы заново.
  const doneSet = React.useMemo(
    () => new Set(snapshot ? snapshot.split('|') : []),
    [snapshot],
  )

  const toggle = useCallback((stageId: string, itemId: string, kind: ProgressKind) => {
    const key = progressKey(stageId, itemId, kind)
    setDone(key, !isDone(key))
  }, [])

  const mark = useCallback((stageId: string, itemId: string, kind: ProgressKind, value: boolean) => {
    setDone(progressKey(stageId, itemId, kind), value)
  }, [])

  const is = useCallback(
    (stageId: string, itemId: string, kind: ProgressKind) => {
      return doneSet.has(progressKey(stageId, itemId, kind))
    },
    [doneSet],
  )

  return { doneSet, toggle, mark, is }
}
