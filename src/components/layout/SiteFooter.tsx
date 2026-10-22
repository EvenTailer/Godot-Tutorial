import { Link } from 'react-router-dom'
import { navItems } from '@/components/layout/nav'
import { ResetProgress } from '@/components/content/ResetProgress'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 print:hidden">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-gutter py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold">Godot 4 — пошаговое руководство</p>
          <p className="mt-2 text-small text-muted-foreground">
            13 этапов, 24 недели, от первого запуска редактора до релиза собственной игры.
            Весь контент — на русском, все примеры кода проверяются настоящим движком Godot.
          </p>
        </div>

        <nav aria-label="Навигация в подвале">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex min-h-11 items-center text-small text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-gutter py-4 text-tiny text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Сайт — статический, работает офлайн. Иллюстрации — векторные, скриншоты редактора —
            заглушки с пометкой. Godot — свободный движок с лицензией MIT.
          </p>
          <ResetProgress className="shrink-0" />
        </div>
      </div>
    </footer>
  )
}
