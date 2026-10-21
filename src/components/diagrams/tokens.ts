/**
 * Токены диаграмм.
 *
 * Отдельный файл — чтобы в модуле с компонентами не смешивались
 * экспорты-константы и экспорты-компоненты (правило react-refresh).
 * Все цвета — CSS-переменные темы, поэтому диаграмма перекрашивается сама.
 */

export const diagramColor = {
  surface: 'var(--diagram-surface)',
  node: 'var(--diagram-node)',
  nodeStrong: 'var(--diagram-node-strong)',
  stroke: 'var(--diagram-stroke)',
  text: 'var(--diagram-text)',
  muted: 'var(--diagram-muted)',
  flow: 'var(--diagram-flow)',
  weak: 'var(--diagram-weak)',
  accent: 'var(--diagram-accent)',
  accentSoft: 'var(--diagram-accent-soft)',
} as const

export const diagramFont = {
  size: 12,
  small: 10,
} as const

export const diagramRadius = 8
