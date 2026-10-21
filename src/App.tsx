import * as React from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

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
const NotFoundPage = React.lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

/** Прокрутка наверх при смене маршрута. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  React.useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
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
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </main>
        <SiteFooter />
      </div>
    </HashRouter>
  )
}
