import { Tabs, type TabItem } from '@/components/ui/tabs'
import type { CheatSheet } from '@/content/types'
import { cn } from '@/lib/utils'

export interface CheatSheetTabsProps {
  sheets: CheatSheet[]
  className?: string
}

/** Шпаргалки: вкладка на каждую тетрадку, внутри — таблица «что → как». */
export function CheatSheetTabs({ sheets, className }: CheatSheetTabsProps) {
  const items: TabItem[] = sheets.map((sheet) => ({
    id: sheet.id,
    label: sheet.title,
    content: (
      <div className="flex flex-col gap-6">
        <p className="max-w-prose text-small text-muted-foreground">{sheet.summary}</p>
        {sheet.groups.map((group) => (
          <section key={group.title} id={group.title} className="scroll-mt-24">
            <h3 className="mb-3 text-h3 font-semibold">{group.title}</h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-small">
                <caption className="sr-only">{group.title}</caption>
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
    <Tabs items={items} label="Шпаргалки" className={cn(className)} />
  )
}
