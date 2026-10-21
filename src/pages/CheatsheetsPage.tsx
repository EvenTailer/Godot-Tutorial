import { cheatSheets } from '@/content/cheatsheets'
import { CheatSheetTabs } from '@/components/content/CheatSheetTabs'
import { Callout } from '@/components/content/Callout'
import { PageHeader } from '@/components/layout/PageHeader'

export function CheatsheetsPage() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Шпаргалки"
        title="Короткие ответы под рукой"
        description="Четыре тетрадки: синтаксис языка, карта узлов, частые ошибки с разбором сообщений и хоткеи редактора. Сделано так, чтобы открыть нужную вкладку и сразу найти ответ."
      />

      <Callout variant="info" title="Как читать шпаргалки">
        Это не замена этапам, а памятка. Если в шпаргалке встретилось то, чего вы ещё не видели —
        вернитесь к этапу, где это разбирается: в глоссарии у каждого термина есть ссылка.
      </Callout>

      <div className="mt-section">
        <CheatSheetTabs sheets={cheatSheets} />
      </div>
    </div>
  )
}
