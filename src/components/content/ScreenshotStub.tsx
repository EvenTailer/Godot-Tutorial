import { Image as ImageIcon } from 'lucide-react'
import type { ScreenshotStub } from '@/content/types'
import { cn } from '@/lib/utils'

export interface ScreenshotStubProps {
  stub: ScreenshotStub
  className?: string
}

/**
 * Заглушка скриншота редактора.
 *
 * Это НЕ скриншот. По требованию проекта выдавать сгенерированные картинки
 * за реальные снимки нельзя, поэтому здесь — векторная схема области
 * редактора с точной инструкцией, куда нажимать.
 */
export function ScreenshotStub({ stub, className }: ScreenshotStubProps) {
  return (
    <figure
      className={cn(
        'my-4 overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 print-avoid-break',
        className,
      )}
    >
      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-label={`Схема области редактора: ${stub.caption}`}
        className="w-full bg-[hsl(var(--diagram-surface))]"
      >
        <rect
          x="1"
          y="1"
          width="318"
          height="178"
          rx="6"
          fill="none"
          strokeWidth="1.2"
          style={{ stroke: 'hsl(var(--diagram-stroke))' }}
        />

        {/* Панель меню */}
        <rect
          x="1"
          y="1"
          width="318"
          height="16"
          rx="6"
          style={{ fill: 'hsl(var(--diagram-node-strong))' }}
        />
        <rect x="1" y="12" width="318" height="5"  style={{ fill: 'hsl(var(--diagram-node-strong))' }} />
        <text
          x="12"
          y="12"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          Файл Правка Сцена Отладка Редактор Окно Справка
        </text>

        {/* Дерево сцены */}
        <rect x="1" y="17" width="84" height="120"  style={{ fill: 'hsl(var(--diagram-node))' }} />
        <text
          x="8"
          y="28"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          Сцена
        </text>
        <rect
          x="10"
          y="34"
          width="52"
          height="8"
          rx="2"
          opacity="0.35"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />
        <rect
          x="18"
          y="48"
          width="44"
          height="8"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />
        <rect
          x="26"
          y="62"
          width="40"
          height="8"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />

        {/* Файловая система */}
        <rect x="1" y="137" width="160" height="42"  style={{ fill: 'hsl(var(--diagram-node))' }} />
        <text
          x="8"
          y="148"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          Файловая система
        </text>
        <rect
          x="8"
          y="154"
          width="60"
          height="7"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />
        <rect
          x="76"
          y="154"
          width="48"
          height="7"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />

        {/* Область просмотра */}
        <rect
          x="85"
          y="17"
          width="150"
          height="120"
          strokeDasharray="4 3"
          style={{ fill: 'hsl(var(--diagram-surface))', stroke: 'hsl(var(--diagram-weak))' }}
        />
        <text
          x="160"
          y="80"
          fontSize="8"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          2D / 3D вид
        </text>

        {/* Инспектор */}
        <rect x="235" y="17" width="84" height="120"  style={{ fill: 'hsl(var(--diagram-node))' }} />
        <text
          x="242"
          y="28"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          Инспектор
        </text>
        <rect
          x="242"
          y="34"
          width="70"
          height="8"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />
        <rect
          x="242"
          y="48"
          width="70"
          height="8"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />

        {/* Нижняя панель */}
        <rect x="85" y="137" width="234" height="42"  style={{ fill: 'hsl(var(--diagram-node))' }} />
        <text
          x="92"
          y="148"
          fontSize="7"
          fontFamily="ui-monospace, monospace"
          style={{ fill: 'hsl(var(--diagram-muted))' }}
        >
          Вывод / Ошибки
        </text>
        <rect
          x="92"
          y="154"
          width="120"
          height="7"
          rx="2"
          opacity="0.25"
          style={{ fill: 'hsl(var(--diagram-stroke))' }}
        />

        {/* Подсветка целевой области */}
        <Highlight area={stub.area} />
      </svg>

      <figcaption className="flex flex-col gap-1 border-t border-border bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-tiny font-medium text-muted-foreground">
          <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />
          Заглушка скриншота — реального снимка редактора пока нет
        </span>
        <span className="text-small font-medium text-foreground">{stub.caption}</span>
        <span className="text-small text-muted-foreground">→ {stub.hint}</span>
      </figcaption>
    </figure>
  )
}

function Highlight({ area }: { area: ScreenshotStub['area'] }) {
  const common = {
    fill: 'hsl(var(--diagram-accent-soft))',
    stroke: 'hsl(var(--diagram-accent))',
    strokeWidth: 2,
  }
  switch (area) {
    case 'toolbar':
      return <rect x="1" y="1" width="318" height="16" rx="6" {...common} />
    case 'menu':
      return <rect x="1" y="1" width="120" height="16" rx="6" {...common} />
    case 'filesystem':
      return <rect x="1" y="137" width="160" height="42" {...common} />
    case 'inspector':
      return <rect x="235" y="17" width="84" height="120" {...common} />
    case 'viewport':
    default:
      return <rect x="85" y="17" width="150" height="120" {...common} />
  }
}
