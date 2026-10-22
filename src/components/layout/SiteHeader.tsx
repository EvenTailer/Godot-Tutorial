import * as React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Printer } from 'lucide-react'
import { navItems } from '@/components/layout/nav'
import { SearchBar } from '@/components/content/SearchBar'
import { ThemeToggle } from '@/components/content/ThemeToggle'
import { Drawer } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-gutter">
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-md font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
              <path
                d="M16 6c-5 0-9 3.4-9 7.6 0 2.6 1.5 4.9 3.8 6.1l-.9 4.4a.4.4 0 0 0 .6.4l4-2.2c.5.1 1 .1 1.5.1 5 0 9-3.4 9-7.8S21 6 16 6Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="hidden text-sm sm:inline">Godot 4 — пошагово</span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems
              .filter((item) => item.inHeader !== false)
              .map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                      )
                    }
                  >
                    {item.shortLabel ?? item.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>

        {/* Поиск виден от lg: на ноутбуках 1024–1279px иначе его нет нигде. */}
        <div className="ml-auto hidden min-w-0 max-w-[12rem] flex-1 lg:block xl:max-w-xs">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.print()}
            aria-label="Печать или сохранение в PDF"
            title="Печать / PDF"
          >
            <Printer aria-hidden="true" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={drawerOpen}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Меню">
        <div className="mb-4">
          <SearchBar />
        </div>
        <nav aria-label="Мобильная навигация">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    )
                  }
                >
                  {item.shortLabel ?? item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </header>
  )
}
