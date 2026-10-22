import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePageMeta } from '@/hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta('Страница не найдена')

  return (
    <div className="mx-auto flex max-w-content flex-col items-start gap-4 px-gutter py-section">
      <p className="font-mono text-tiny text-muted-foreground">404</p>
      <h1 className="text-display font-bold tracking-tight">Такой страницы нет</h1>
      <p className="max-w-prose text-body text-muted-foreground">
        Возможно, ссылка устарела или в адресе опечатка. Начните с дорожной карты — там все 13
        этапов.
      </p>
      <Button asChild>
        <Link to="/roadmap">К дорожной карте</Link>
      </Button>
    </div>
  )
}
