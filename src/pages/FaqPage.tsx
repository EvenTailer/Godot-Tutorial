import { faq } from '@/content/faq'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { PageHeader } from '@/components/layout/PageHeader'
import { usePageMeta } from '@/hooks/usePageMeta'

export function FaqPage() {
  usePageMeta(
    'Частые вопросы о Godot',
    'Ответы новичка: переход из Unity и Unreal, сколько времени учиться, как читать ошибки и стоит ли писать тесты.',
  )

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="FAQ"
        title="Частые вопросы"
        description="Вопросы, которые задают чаще всего: про переход из других движков, про сроки, про то, сколько кода писать и что делать, когда игра падает."
      />

      <Accordion className="mt-8 max-w-3xl">
        {faq.map((item) => (
          <AccordionItem key={item.id} id={item.id} title={item.question} titleTag="h2">
            <p className="text-small leading-relaxed text-muted-foreground">{item.answer}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
