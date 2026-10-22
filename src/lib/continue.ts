import { stageManifest, type StageManifest } from '@/content/stages/manifest'
import { progressKey, type ProgressKind } from '@/lib/progress'

export interface NextStep {
  stageId: string
  stageSlug: string
  stageTitle: string
  kind: ProgressKind
  itemId: string
  /** Что именно предстоит сделать — показывается в карточке. */
  label: string
  /** Ссылка на конкретный пункт внутри этапа. */
  href: string
}

/**
 * Первый незакрытый пункт курса.
 *
 * Порядок повторяет порядок страницы этапа: темы → шаги → задания →
 * мини-проект → критерии. Благодаря этому кнопка «продолжить» всегда
 * ведёт туда, где читатель остановился, а не просто на первый этап.
 *
 * Данные берутся из манифеста: тело этапа для этого не нужно.
 */
export function findNextUnfinished(
  done: ReadonlySet<string>,
  manifest: StageManifest[] = stageManifest,
): NextStep | null {
  for (const stage of manifest) {
    for (const item of stage.items) {
      if (done.has(progressKey(stage.id, item.id, item.kind))) continue
      return {
        stageId: stage.id,
        stageSlug: stage.slug,
        stageTitle: stage.title,
        kind: item.kind,
        itemId: item.id,
        label: item.label,
        href: anchorFor(stage, item.kind, item.id),
      }
    }
  }

  return null
}

/** Якорь пункта внутри страницы этапа. */
function anchorFor(stage: StageManifest, kind: ProgressKind, itemId: string): string {
  if (kind === 'project') return `/stage/${stage.slug}#mini-project`
  return `/stage/${stage.slug}#${kind}-${itemId}`
}

/** Подпись типа пункта — для карточки «продолжить». */
export const nextStepKindLabel: Record<ProgressKind, string> = {
  topic: 'Тема',
  step: 'Шаг',
  task: 'Задание',
  criterion: 'Проверка знаний',
  project: 'Мини-проект',
}
