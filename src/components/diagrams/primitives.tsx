import * as React from 'react'
import { diagramColor, diagramFont, diagramRadius } from './tokens'

export interface NodeProps {
  x: number
  y: number
  width: number
  height?: number
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** node — обычный блок, accent — важный блок, strong — данные. */
  variant?: 'node' | 'accent' | 'strong'
  /** Подпись на рамке (например, «layer 2»). */
  tag?: string
  dashed?: boolean
  titleSize?: number
}

export function DiagramNode({
  x,
  y,
  width,
  height = 40,
  title,
  subtitle,
  variant = 'node',
  tag,
  dashed = false,
  titleSize,
}: NodeProps) {
  const fill =
    variant === 'accent' ? diagramColor.accentSoft : variant === 'strong' ? diagramColor.nodeStrong : diagramColor.node
  const stroke = variant === 'accent' ? diagramColor.accent : diagramColor.stroke
  const textColor = variant === 'accent' ? diagramColor.accent : diagramColor.text

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={diagramRadius}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '5 4' : undefined}
        style={{ fill, stroke }}
      />
      <text
        x={x + width / 2}
        y={subtitle ? y + height / 2 - 4 : y + height / 2 + 4}
        textAnchor="middle"
        fontSize={titleSize ?? diagramFont.size}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        fontWeight={variant === 'accent' ? 600 : 500}
        style={{ fill: textColor }}
      >
        {title}
      </text>
      {subtitle ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          fontSize={diagramFont.small}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          style={{ fill: diagramColor.muted }}
        >
          {subtitle}
        </text>
      ) : null}
      {tag ? (
        <text
          x={x + width - 6}
          y={y + 12}
          textAnchor="end"
          fontSize={diagramFont.small}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          style={{ fill: diagramColor.muted }}
        >
          {tag}
        </text>
      ) : null}
    </g>
  )
}

export interface EdgeProps {
  from: [number, number]
  to: [number, number]
  kind?: 'flow' | 'weak'
  label?: string
  /** Рисовать линию по ломаной (для обхода блоков). */
  path?: string
  markerId: string
  labelOffset?: number
}

export function DiagramEdge({
  from,
  to,
  kind = 'flow',
  label,
  path,
  markerId,
  labelOffset = -6,
}: EdgeProps) {
  const color = kind === 'flow' ? diagramColor.flow : diagramColor.weak
  const d = path ?? `M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`

  return (
    <g>
      <path
        d={d}
        strokeWidth={kind === 'flow' ? 1.8 : 1.4}
        strokeDasharray={kind === 'weak' ? '6 5' : undefined}
        markerEnd={`url(#${markerId})`}
        style={{ fill: 'none', stroke: color }}
      />
      {label ? (
        <text
          x={(from[0] + to[0]) / 2}
          y={(from[1] + to[1]) / 2 + labelOffset}
          textAnchor="middle"
          fontSize={diagramFont.small}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          style={{ fill: diagramColor.muted }}
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

export interface EdgeLabelProps {
  x: number
  y: number
  children: React.ReactNode
}

export function EdgeLabel({ x, y, children }: EdgeLabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={diagramFont.small}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      style={{ fill: diagramColor.muted }}
    >
      {children}
    </text>
  )
}

export interface ArrowDefsProps {
  id: string
}

/** Маркеры стрелок: сплошной — поток управления, пунктирный — слабая связь. */
export function ArrowDefs({ id }: ArrowDefsProps) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z"  style={{ fill: diagramColor.flow }} />
      </marker>
      <marker
        id={`${id}-weak`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z"  style={{ fill: diagramColor.weak }} />
      </marker>
    </defs>
  )
}

/** Прямоугольная область-рамка (например, «дерево сцены» или «слой интерфейса»). */
export function DiagramFrame({
  x,
  y,
  width,
  height,
  title,
  dashed = true,
}: {
  x: number
  y: number
  width: number
  height: number
  title?: string
  dashed?: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={diagramRadius}
        fill="none"
        strokeWidth={1.2}
        strokeDasharray={dashed ? '6 5' : undefined}
        style={{ stroke: diagramColor.weak }}
      />
      {title ? (
        <text
          x={x + 10}
          y={y + 16}
          fontSize={diagramFont.small}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          style={{ fill: diagramColor.muted }}
        >
          {title}
        </text>
      ) : null}
    </g>
  )
}

/** Подпись-плашка (например, «$Main/Player/Sprite2D»). */
export function DiagramChip({
  x,
  y,
  text,
  width,
}: {
  x: number
  y: number
  text: string
  width?: number
}) {
  const w = width ?? Math.max(70, text.length * 6.6 + 18)
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={22}
        rx={11}
        strokeWidth={1}
        style={{ fill: diagramColor.accentSoft, stroke: diagramColor.accent }}
      />
      <text
        x={x + w / 2}
        y={y + 15}
        textAnchor="middle"
        fontSize={diagramFont.small}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        style={{ fill: diagramColor.accent }}
      >
        {text}
      </text>
    </g>
  )
}
