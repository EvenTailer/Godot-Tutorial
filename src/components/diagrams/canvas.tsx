import * as React from 'react'
import { ArrowDefs } from './primitives'

export interface DiagramSvgProps {
  viewBox: string
  children: (markerId: string) => React.ReactNode
  /** Текстовое описание для скринридера. */
  title: string
  desc?: string
  className?: string
}

/**
 * Холст диаграммы.
 *
 * viewBox позволяет масштабировать рисунок под ширину контейнера,
 * а markerId генерируется уникально — чтобы маркеры разных диаграмм не конфликтовали.
 */
export function DiagramSvg({ viewBox, children, title, desc, className }: DiagramSvgProps) {
  const rawId = React.useId()
  const markerId = `arrow-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-labelledby={`${markerId}-title ${markerId}-desc`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={`${markerId}-title`}>{title}</title>
      {desc ? <desc id={`${markerId}-desc`}>{desc}</desc> : null}
      <ArrowDefs id={markerId} />
      {children(markerId)}
    </svg>
  )
}
