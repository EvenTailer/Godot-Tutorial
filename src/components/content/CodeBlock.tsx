import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { highlight, type TokenKind } from '@/lib/highlight'
import { cn } from '@/lib/utils'

export interface CodeBlockProps {
  code: string
  language?: 'gdscript' | 'gdshader'
  /** Имя файла — показывается в шапке блока. */
  file?: string
  /** Заголовок блока. */
  title?: string
  className?: string
  /** Показывать номера строк. */
  showLineNumbers?: boolean
}

const tokenClass: Record<TokenKind, string> = {
  plain: 'text-foreground',
  comment: 'text-muted-foreground italic',
  string: 'text-success',
  keyword: 'text-primary',
  type: 'text-info',
  number: 'text-warning',
  annotation: 'text-accent-foreground',
  builtin: 'text-accent-foreground',
  operator: 'text-muted-foreground',
}

/**
 * Блок кода с копированием в один клик.
 *
 * Код не вставляется через dangerouslySetInnerHTML: токены рендерятся React-ом,
 * поэтому содержимое примера никогда не интерпретируется как разметка.
 */
export function CodeBlock({
  code,
  language = 'gdscript',
  file,
  title,
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const lines = React.useMemo(() => highlight(code, language), [code, language])

  const copy = async () => {
    const ok = await copyToClipboard(code)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <figure
      className={cn(
        'my-5 overflow-hidden rounded-lg border border-border bg-muted shadow-xs print-avoid-break',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {file ? (
            <span className="truncate font-mono text-tiny text-muted-foreground">{file}</span>
          ) : null}
          {title ? (
            <span className="truncate text-tiny font-medium text-foreground">{title}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Код скопирован' : 'Скопировать код в буфер обмена'}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-tiny font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </figcaption>

      <div className="scroll-x">
        <pre className="min-w-full p-4 text-tiny leading-relaxed">
          <code className="font-mono">
            {lines.map((tokens, lineIndex) => (
              <span key={lineIndex} className="flex">
                {showLineNumbers ? (
                  <span
                    aria-hidden="true"
                    className="mr-4 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/60"
                  >
                    {lineIndex + 1}
                  </span>
                ) : null}
                <span className="whitespace-pre">
                  {tokens.length === 0 ? (
                    ' '
                  ) : (
                    tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={tokenClass[token.kind]}>
                        {token.text}
                      </span>
                    ))
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  )
}

/** Копирование с запасным вариантом для браузеров без Clipboard API. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* переходим к запасному варианту */
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
