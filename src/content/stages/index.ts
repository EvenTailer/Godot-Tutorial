import type { Stage } from '../types'
import { stage00 } from './stage-00-environment'
import { stage01 } from './stage-01-language'
import { stage02 } from './stage-02-scenes-signals-resources'
import { stage03 } from './stage-03-2d-movement-physics'
import { stage04 } from './stage-04-2d-graphics-animation'
import { stage05 } from './stage-05-ui-navigation'
import { stage06 } from './stage-06-audio-juice'
import { stage07 } from './stage-07-data-saves-inventory'
import { stage08 } from './stage-08-architecture-refactoring'
import { stage09 } from './stage-09-3d'
import { stage10 } from './stage-10-shaders-performance'
import { stage11 } from './stage-11-release-publishing'
import { stage12 } from './stage-12-final-project'

/** Все 13 этапов в порядке прохождения. */
export const stages: Stage[] = [
  stage00,
  stage01,
  stage02,
  stage03,
  stage04,
  stage05,
  stage06,
  stage07,
  stage08,
  stage09,
  stage10,
  stage11,
  stage12,
]

export const stageById = new Map(stages.map((stage) => [stage.id, stage]))

export function findStage(slug: string): Stage | undefined {
  return stages.find((stage) => stage.slug === slug)
}

/** Суммарная оценка времени по всем этапам, в часах. */
export const totalHours = stages.reduce((sum, stage) => sum + stage.hours, 0)

/** Количество примеров кода во всём курсе. */
export const totalCodeExamples = stages.reduce((sum, stage) => sum + stage.code.length, 0)

/** Количество практических заданий. */
export const totalTasks = stages.reduce((sum, stage) => sum + stage.tasks.length, 0)

export {
  stage00,
  stage01,
  stage02,
  stage03,
  stage04,
  stage05,
  stage06,
  stage07,
  stage08,
  stage09,
  stage10,
  stage11,
  stage12,
}
