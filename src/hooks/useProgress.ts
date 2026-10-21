import { useCallback, useSyncExternalStore } from 'react'
import {
  getSnapshot,
  isDone,
  progressKey,
  readProgress,
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
  const done = useCallback(() => new Set(snapshot ? snapshot.split('|') : []), [snapshot])

  const toggle = useCallback((stageId: string, itemId: string, kind: ProgressKind) => {
    const key = progressKey(stageId, itemId, kind)
    setDone(key, !isDone(key))
  }, [])

  const mark = useCallback((stageId: string, itemId: string, kind: ProgressKind, value: boolean) => {
    setDone(progressKey(stageId, itemId, kind), value)
  }, [])

  const is = useCallback(
    (stageId: string, itemId: string, kind: ProgressKind) => {
      return done().has(progressKey(stageId, itemId, kind))
    },
    [done],
  )

  return { doneSet: done(), toggle, mark, is, readProgress }
}
