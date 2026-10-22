import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react'
import { versionChanges, currentGodotVersion, baselineGodotVersion } from '@/content/versions'
import { stageManifestById } from '@/content/stages/manifest'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/content/Callout'
import { Reveal } from '@/components/content/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'
import { PageHeader, Section } from '@/components/layout/PageHeader'

/**
 * Что изменилось в движке между версиями.
 *
 * Таблица, а не карточки: здесь сравнение «было → стало», и построчное
 * сравнение читается быстрее, чем колонка карточек.
 */
export function VersionsPage() {
  usePageMeta(
    'Godot 4.4 → 4.7: что изменилось',
    'Изменения движка Godot между 4.4 и 4.7: новые возможности, ломающие изменения и что делать читателю курса.',
  )

  const grouped = ['4.5', '4.6', '4.7'].map((version) => ({
    version,
    items: versionChanges.filter((change) => change.version === version),
  }))

  return (
    <div className="mx-auto max-w-content px-gutter py-section">
      <PageHeader
        eyebrow="Версии движка"
        title="Godot 4.4 → 4.7: что изменилось"
        description={`Курс проверен на Godot ${currentGodotVersion}. Ниже — изменения, которые влияют на работу: новые возможности и то, что стоит сделать при переходе на новую версию.`}
      />

      {/* Версии */}
      <Reveal>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:gap-8">
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-h4 font-semibold text-muted-foreground">
              {baselineGodotVersion}
            </span>
            <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            <span className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-h4 font-semibold text-primary">
              {currentGodotVersion}
            </span>
          </div>
          <p className="flex items-start gap-2 text-small text-muted-foreground">
            <BadgeCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Все примеры кода курса разбираются настоящим движком {currentGodotVersion} — без ошибок.
          </p>
        </div>
      </Reveal>

      <Callout variant="info" title="Нужно ли обновляться?">
        Нет. Курс написан так, что код работает и на 4.4, и на 4.7: примеры используют
        стабильный API. Обновляйтесь, когда дочитываете текущий этап, — миграция занимает
        минуты, если знать, что изменилось.
      </Callout>

      {grouped.map((group) => (
        <Section
          key={group.version}
          title={`Godot ${group.version}`}
          description={`${group.items.length} изменений, которые могут повлиять на ваш проект.`}
          className="mt-section"
        >
          <Reveal>
            <div
              className="scroll-x rounded-xl border border-border"
              tabIndex={0}
              role="region"
              aria-label={`Изменения Godot ${group.version} — прокрутите вбок, чтобы увидеть все колонки`}
            >
              <table className="w-full min-w-[44rem] border-collapse text-left text-small">
                <caption className="sr-only">
                  Изменения Godot {group.version} и что делать читателю курса
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th scope="col" className="w-[38%] px-4 py-3 font-semibold">
                      Что изменилось
                    </th>
                    <th scope="col" className="w-[22%] px-4 py-3 font-semibold">
                      Что это значит
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Что делать
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((change) => {
                    const stage = change.stageId
                      ? stageManifestById.get(change.stageId)
                      : undefined
                    return (
                      <tr
                        key={`${change.version}-${change.title}`}
                        className="border-b border-border last:border-b-0 even:bg-muted/30"
                      >
                        <th scope="row" className="px-4 py-3 align-top font-medium">
                          <span className="block">{change.title}</span>
                          {change.api ? (
                            <code className="mt-1 block font-mono text-tiny text-primary">
                              {change.api}
                            </code>
                          ) : null}
                          {stage ? (
                            <Link
                              to={`/stage/${stage.slug}`}
                              className="mt-1.5 inline-flex min-h-11 items-center gap-1 rounded-sm text-tiny text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              этап {stage.number} · {stage.shortTitle}
                              <ArrowRight aria-hidden="true" className="h-3 w-3" />
                            </Link>
                          ) : null}
                        </th>
                        <td className="px-4 py-3 align-top leading-relaxed text-muted-foreground">
                          {change.summary}
                        </td>
                        <td className="px-4 py-3 align-top leading-relaxed">{change.action}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Section>
      ))}

      <Section title="Куда двигаться дальше" className="mt-section">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
              <span className="inline-flex items-center gap-2 text-tiny font-semibold uppercase tracking-wider text-primary">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                Новые возможности
              </span>
              <h3 className="text-h3 font-semibold">Что взять себе в проект</h3>
              <p className="text-small leading-relaxed text-muted-foreground">
                Шейдер-бейкер (4.5) убирает паузы при запуске, односторонние коллизии в любую
                сторону (4.7) упрощают платформер, а Asset Store (4.7) экономит время на поиск
                готовых наборов.
              </p>
              <div className="mt-auto pt-2">
                <Button asChild variant="outline">
                  <Link to="/stage/11-reliz-i-publikaciya">
                    Этап про релиз и платформы
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
              <span className="inline-flex items-center gap-2 text-tiny font-semibold uppercase tracking-wider text-primary">
                <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
                Должно быть в каждом проекте
              </span>
              <h3 className="text-h3 font-semibold">Три вещи, которые забывают сделать</h3>
              <ul className="flex flex-col gap-2 text-small text-muted-foreground">
                {[
                  'Сохранить сцены после перехода на 4.6 — иначе новые ID узлов не заработают.',
                  'Включить шейдер-бейкер в настройках экспорта — игра перестанет «зависать» при старте.',
                  'Включить Always Track Call Stacks — в ошибках появятся точные строки.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <Button asChild variant="outline">
                  <Link to="/stage/00-sreda-redaktor-git">
                    Этап про среду и редактор
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
        </div>
      </Section>
    </div>
  )
}
