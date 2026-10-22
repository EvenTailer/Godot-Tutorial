import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, type TabItem } from '@/components/ui/tabs'
import type { CheatSheet } from '@/content/types'
import { cn } from '@/lib/utils'

export interface CheatSheetTabsProps {
  sheets: CheatSheet[]
  className?: string
}

/**
 * Шпаргалки: вкладка на каждую тетрадку, внутри — таблица «что → как».
 *
 * Активная вкладка живёт в адресе: ссылка /cheatsheets#errors открывает
 * нужную тетрадку, поэтому на неё можно попасть из поиска.
 */
export function CheatSheetTabs({ sheets, className }: CheatSheetTabsProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const hash = location.hash.replace(/^#/, '')
  const activeId = sheets.some((sheet) => sheet.id === hash) ? hash : sheets[0]?.id

  const items: TabItem[] = sheets.map((sheet) => ({
    id: sheet.id,
    anchorId: sheet.id,
    label: sheet.title,
    content: (
      <div className="flex flex-col gap-6">
        <p className="max-w-prose text-small text-muted-foreground">{sheet.summary}</p>
        {sheet.groups.map((group) => (
          <section key={group.title} id={group.title} className="scroll-mt-24">
            <h2 className="mb-3 text-h3 font-semibold">{group.title}</h2>
            <div
              className="scroll-x rounded-lg border border-border"
              tabIndex={0}
              role="region"
              aria-label={`Таблица «${group.title}» — прокрутите вбок, чтобы увидеть всё`}
            >
              <table className="w-full min-w-[34rem] border-collapse text-left text-small">
                <caption className="sr-only">{group.title}</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Что
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Как
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, index) => (
                    <tr
                      key={`${row.left}-${index}`}
                      className="border-b border-border last:border-b-0 even:bg-muted/40"
                    >
                      <th
                        scope="row"
                        className="w-2/5 px-4 py-2.5 align-top font-medium text-foreground"
                      >
                        {row.left}
                      </th>
                      <td className="px-4 py-2.5 align-top">
                        <code className="font-mono text-tiny text-primary">{row.right}</code>
                        {row.note ? (
                          <span className="mt-1 block text-tiny text-muted-foreground">{row.note}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    ),
  }))

  return (
    <Tabs
      items={items}
      value={activeId}
      onValueChange={(id) => navigate(`/cheatsheets#${id}`)}
      label="Шпаргалки"
      className={cn(className)}
    />
  )
}
