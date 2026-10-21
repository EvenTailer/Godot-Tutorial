import * as React from 'react'
import type { Stage } from '@/content/types'
import { stages as stageList } from '@/content/stages'
import { progressKey } from '@/lib/progress'
import { useProgress } from './useProgress'

/**
 * Прогресс по этапам.
 * Считает отмеченные пункты по всем видам: темы, шаги, задания, критерии, мини-проект.
 */
export function useStageProgress() {
  const { doneSet } = useProgress()

  const countFor = React.useCallback(
    (stage: Stage) => {
      const total =
        stage.topics.length +
        stage.steps.length +
        stage.tasks.length +
        stage.criteria.length +
        1

      let done = 0
      for (const topic of stage.topics) {
        if (doneSet.has(progressKey(stage.id, topic.id, 'topic'))) done += 1
      }
      for (const step of stage.steps) {
        if (doneSet.has(progressKey(stage.id, step.id, 'step'))) done += 1
      }
      for (const task of stage.tasks) {
        if (doneSet.has(progressKey(stage.id, task.id, 'task'))) done += 1
      }
      for (const criterion of stage.criteria) {
        if (doneSet.has(progressKey(stage.id, criterion.id, 'criterion'))) done += 1
      }
      if (doneSet.has(progressKey(stage.id, 'project', 'project'))) done += 1

      return { done, total }
    },
    [doneSet],
  )

  const percentFor = React.useCallback(
    (stage: Stage) => {
      const { done, total } = countFor(stage)
      return total > 0 ? (done / total) * 100 : 0
    },
    [countFor],
  )

  const overall = React.useCallback(() => {
    let done = 0
    let total = 0
    for (const stage of stageList) {
      const counts = countFor(stage)
      done += counts.done
      total += counts.total
    }
    return { done, total, percent: total > 0 ? (done / total) * 100 : 0 }
  }, [countFor])

  return { countFor, percentFor, overall }
}
