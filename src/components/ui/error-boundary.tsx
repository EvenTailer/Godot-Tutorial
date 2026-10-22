import * as React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/** Ошибка загрузки ленивого чанка: лечится только перезагрузкой страницы. */
function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false
  const message = error.message.toLowerCase()
  return (
    message.includes('dynamically imported module') ||
    message.includes('importing a module script failed') ||
    message.includes('failed to fetch dynamically imported')
  )
}

/**
 * Граница ошибок.
 *
 * Без неё любая ошибка рендера оставляет пустой экран: читатель не понимает,
 * что произошло, и не может вернуться к курсу. Здесь — понятное сообщение
 * и две кнопки: повторить и вернуться на главную.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Ошибка рендера:', error, info)
  }

  private reset = () => {
    // Ошибка загрузки чанка не лечится повторным рендером: React кэширует
    // отклонённый промис React.lazy. Единственный выход — перезагрузка.
    if (isChunkLoadError(this.state.error)) {
      window.location.reload()
      return
    }
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-gutter py-section">
        <div className="flex items-start gap-4 rounded-xl border border-destructive/40 bg-destructive/10 p-6 shadow-xs">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive"
          >
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-h2 font-bold tracking-tight">Что-то сломалось</h1>
            <p className="mt-2 max-w-prose text-body text-muted-foreground">
              Страница не смогла отрисоваться. Прогресс не потерян — он хранится в этом браузере.
              Попробуйте перезагрузить страницу или вернитесь на главную.
            </p>
            {import.meta.env.DEV ? (
              <pre className="scroll-x mt-4 max-w-full rounded-lg border border-border bg-muted p-4 text-tiny text-muted-foreground">
                {error.message}
              </pre>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={this.reset}>
            <RotateCcw aria-hidden="true" />
            Попробовать снова
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home aria-hidden="true" />
              На главную
            </Link>
          </Button>
        </div>
      </div>
    )
  }
}
