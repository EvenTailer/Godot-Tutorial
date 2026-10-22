import * as React from 'react'
import { stageManifest } from '@/content/stages/manifest'
import { progressKey } from '@/lib/progress'
import { useProgress } from './useProgress'

/**
 * Прогресс по этапам.
 *
 * Считает отмеченные пункты по всем видам: темы, шаги, задания, критерии, мини-проект.
 * Данные берутся из манифеста — тело этапа для этого не нужно.
 */
export function useStageProgress() {
  const { doneSet } = useProgress()

  const countFor = React.useCallback(
    (stage: { id: string; counts: { total: number } }) => {      const total = stage.counts.total
      let done = 0
      const items = stageManifest.find((entry) => entry.id === stage.id)?.items ?? []
      for (const item of items) {
        if (doneSet.has(progressKey(stage.id, item.id, item.kind))) done += 1
      }
      return { done, total }
    },
    [doneSet],
  )

  const percentFor = React.useCallback(
    (stage: { id: string; counts: { total: number } }) => {
      const { done, total } = countFor(stage)
      return total > 0 ? (done / total) * 100 : 0
    },
    [countFor],
  )

  const overall = React.useCallback(() => {
    let done = 0
    let total = 0
    for (const stage of stageManifest) {
      const counts = countFor(stage)
      done += counts.done
      total += counts.total
    }
    return { done, total, percent: total > 0 ? (done / total) * 100 : 0 }
  }, [countFor])

  return { countFor, percentFor, overall }
}
