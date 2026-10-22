import * as React from 'react'

const SITE_NAME = 'Godot 4 — пошагово'

/**
 * Заголовок вкладки и meta description под текущую страницу.
 *
 * Без react-helmet: нужен всего один title и один description,
 * а зависимость ради этого — лишний вес (DECISIONS.md, D-024).
 */
export function usePageMeta(title: string, description?: string) {
  React.useEffect(() => {
    // Если в заголовке уже есть название сайта, не добавляем его второй раз.
    document.title = title.includes('Godot 4') ? title : title ? `${title} — ${SITE_NAME}` : SITE_NAME

    if (!description) return
    const meta = document.querySelector('meta[name="description"]')
    if (!meta) return
    // Описание не восстанавливаем при уходе со страницы: между размонтированием
    // старой страницы и монтированием новой мета-тег «мигал» стоковым значением.
    // Новая страница перезапишет его своим описанием, а страница без описания
    // оставит предыдущее — это лучше, чем откат на seconds.
    meta.setAttribute('content', description)
  }, [title, description])
}
