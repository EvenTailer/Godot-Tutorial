import * as React from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ErrorBoundary } from '@/components/ui/error-boundary'

/**
 * Экраны загружаются по требованию: так первый экран остаётся лёгким,
 * а тяжёлый контент этапов попадает в бандд только вместе со своим маршрутом.
 */
const HomePage = React.lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const RoadmapPage = React.lazy(() =>
  import('@/pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })),
)
const StagePage = React.lazy(() => import('@/pages/StagePage').then((m) => ({ default: m.StagePage })))
const PlanPage = React.lazy(() => import('@/pages/PlanPage').then((m) => ({ default: m.PlanPage })))
const LadderPage = React.lazy(() =>
  import('@/pages/LadderPage').then((m) => ({ default: m.LadderPage })),
)
const CheatsheetsPage = React.lazy(() =>
  import('@/pages/CheatsheetsPage').then((m) => ({ default: m.CheatsheetsPage })),
)
const ResourcesPage = React.lazy(() =>
  import('@/pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })),
)
const GlossaryPage = React.lazy(() =>
  import('@/pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })),
)
const FaqPage = React.lazy(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const ErrorsPage = React.lazy(() =>
  import('@/pages/ErrorsPage').then((m) => ({ default: m.ErrorsPage })),
)
const VersionsPage = React.lazy(() =>
  import('@/pages/VersionsPage').then((m) => ({ default: m.VersionsPage })),
)
const NotFoundPage = React.lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

/**
 * Прокрутка наверх при смене маршрута.
 *
 * Если в адресе есть якорь, ждём его появления: страница этапа грузится
 * ленивым чанком, и в момент смены маршрута нужного элемента ещё нет в DOM.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const rawId = hash.slice(1)
    let id = rawId
    try {
      id = decodeURIComponent(rawId)
    } catch {
      // Некорректная escape-последовательность: ищем как есть.
      id = rawId
    }
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let attempts = 0
    let timer = 0

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        window.clearTimeout(timer)
        return
      }
      // Элемент ещё не отрисован — пробуем ещё (до 2 секунд).
      if (attempts < 40) {
        attempts += 1
        timer = window.setTimeout(scrollToTarget, 50)
      }
    }

    scrollToTarget()
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}

function PageFallback() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section" aria-busy="true" aria-live="polite">
      <p className="text-small text-muted-foreground">Загрузка…</p>
      <div className="mt-6 flex flex-col gap-3">
        <div className="h-8 w-2/3 rounded-md bg-muted" />
        <div className="h-4 w-full rounded-md bg-muted" />
        <div className="h-4 w-5/6 rounded-md bg-muted" />
      </div>
    </div>
  )
}

export function App() {
  return (
    <HashRouter>
      {/* Внешняя граница ловит ошибки вне main (например, в ScrollToTop):
          без неё такое исключение оставило бы весь экран пустым. */}
      <ErrorBoundary>
        <ScrollToTop />
        <AppShell />
      </ErrorBoundary>
    </HashRouter>
  )
}

/**
 * Оболочка приложения.
 *
 * Граница ошибок пересоздаётся при смене маршрута (key по pathname):
 * иначе после сбоя на одной странице весь сайт остался бы в экране ошибки.
 */
function AppShell() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="skip-link"
        // В HashRouter обычный якорь ломает маршрут, поэтому переход делаем вручную.
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('main')
          main?.scrollIntoView({ behavior: 'auto' })
          main?.focus()
        }}
      >
        Перейти к содержимому
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary key={location.pathname}>
          <React.Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/stage/:slug" element={<StagePage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/ladder" element={<LadderPage />} />
              <Route path="/cheatsheets" element={<CheatsheetsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/errors" element={<ErrorsPage />} />
              <Route path="/versions" element={<VersionsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  )
}
