/**
 * Токены диаграмм.
 *
 * Отдельный файл — чтобы в модуле с компонентами не смешивались
 * экспорты-константы и экспорты-компоненты (правило react-refresh).
 * Все цвета — CSS-переменные темы, поэтому диаграмма перекрашивается сама.
 */

export const diagramColor = {
  surface: 'hsl(var(--diagram-surface))',
  node: 'hsl(var(--diagram-node))',
  nodeStrong: 'hsl(var(--diagram-node-strong))',
  stroke: 'hsl(var(--diagram-stroke))',
  text: 'hsl(var(--diagram-text))',
  muted: 'hsl(var(--diagram-muted))',
  flow: 'hsl(var(--diagram-flow))',
  weak: 'hsl(var(--diagram-weak))',
  accent: 'hsl(var(--diagram-accent))',
  accentSoft: 'hsl(var(--diagram-accent-soft))',
} as const

export const diagramFont = {
  size: 12,
  small: 10,
} as const

export const diagramRadius = 8
