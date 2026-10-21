import { faq } from '@/content/faq'
import { AccordionItem } from '@/components/ui/accordion'
import { PageHeader } from '@/components/layout/PageHeader'

export function FaqPage() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="FAQ"
        title="Частые вопросы"
        description="Вопросы, которые задают чаще всего: про переход из других движков, про сроки, про то, сколько кода писать и что делать, когда игра падает."
      />

      <div className="mt-8 flex max-w-3xl flex-col gap-3">
        {faq.map((item) => (
          <AccordionItem key={item.id} id={item.id} title={item.question}>
            <p className="text-small leading-relaxed text-muted-foreground">{item.answer}</p>
          </AccordionItem>
        ))}
      </div>
    </div>
  )
}
