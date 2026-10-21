import { Link } from 'react-router-dom'
import { plan24Weeks, planTotalHours } from '@/content/plan-24-weeks'
import { stages } from '@/content/stages'
import { Badge } from '@/components/ui/badge'
import { Callout } from '@/components/content/Callout'
import { PageHeader, Section } from '@/components/layout/PageHeader'

const stageById = new Map(stages.map((stage) => [stage.id, stage]))

export function PlanPage() {
  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Календарный план"
        title="24 недели: что делать каждую неделю"
        description="Две недели на этап, затем релиз и финальный проект. План рассчитан на 8–10 часов в неделю — если времени меньше, просто растяните каждую неделю."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard value="24" label="недели" />
        <StatCard value={`${planTotalHours} ч`} label="целевая нагрузка" />
        <StatCard value="13" label="этапов курса" />
      </div>

      <Callout variant="tip" title="Как пользоваться планом">
        Не гонитесь за неделями — гонитесь за результатом. Если этап не закрыт, не переходите к
        следующему: в плане каждый этап опирается на предыдущий.
      </Callout>

      <Section title="Недели" className="mt-section">
        <div className="scroll-x rounded-lg border border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left text-small">
            <caption className="sr-only">Календарный план обучения на 24 недели</caption>
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th scope="col" className="w-16 px-4 py-3 font-semibold">
                  Неделя
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Что делаем
                </th>
                <th scope="col" className="w-32 px-4 py-3 font-semibold">
                  Этапы
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Результат недели
                </th>
                <th scope="col" className="w-20 px-4 py-3 text-right font-semibold">
                  Время
                </th>
              </tr>
            </thead>
            <tbody>
              {plan24Weeks.map((week) => (
                <tr key={week.week} className="border-b border-border last:border-b-0 even:bg-muted/30">
                  <th scope="row" className="px-4 py-3 align-top font-mono text-small font-semibold">
                    {week.week}
                  </th>
                  <td className="px-4 py-3 align-top">
                    <span className="block font-medium">{week.title}</span>
                    <span className="mt-0.5 block text-tiny text-muted-foreground">{week.focus}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1">
                      {week.stages.map((stageId) => {
                        const stage = stageById.get(stageId)
                        if (!stage) return null
                        return (
                          <Link
                            key={stageId}
                            to={`/stage/${stage.slug}`}
                            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <Badge variant="outline">{stageId}</Badge>
                          </Link>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground">{week.deliverable}</td>
                  <td className="px-4 py-3 text-right align-top tabular-nums text-muted-foreground">
                    {week.hours} ч
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Если времени меньше" className="mt-section">
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            title="4 часа в неделю"
            text="Курс растянется примерно на 45–50 недель. Это нормально: скорость важнее дедлайна."
          />
          <PlanCard
            title="Два вечера по 3 часа"
            text="Один вечер — теория и чтение кода, второй — практика в редакторе. Так код запоминается лучше."
          />
          <PlanCard
            title="Выходные по 6 часов"
            text="Один выходной закрывает неделю целиком, второй — повторение и полировка прошлой недели."
          />
        </div>
      </Section>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 text-center shadow-xs">
      <p className="text-h2 font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-small text-muted-foreground">{label}</p>
    </div>
  )
}

function PlanCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
      <h3 className="text-h4 font-semibold">{title}</h3>
      <p className="mt-2 text-small text-muted-foreground">{text}</p>
    </div>
  )
}
