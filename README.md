# Godot 4 — пошаговое руководство

Одностраничный сайт-руководство по Godot 4 на русском языке: 13 этапов, 24 недели,
от первого запуска редактора до релиза собственной игры.

Что есть: курс из 13 этапов, календарный план на 24 недели, лестница из 7 проектов,
4 шпаргалки, справочник ошибок движка, таблица изменений 4.4 → 4.7, глоссарий и FAQ.
Все примеры кода проверяются настоящим движком Godot в headless-режиме.

Сайт статический: работает офлайн, без внешних CDN и без запросов к API.
Весь контент лежит в типизированных TS-модулях, иллюстрации — только вектор (inline SVG).

---

## Команды

```bash
npm install          # установка зависимостей
npm run dev          # локальная разработка (http://localhost:5173)
npm run build        # проверка типов + продакшн-сборка в dist/
npm run preview      # локальный просмотр собранной версии
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit по проекту
npm run verify:godot # проверка всех примеров кода настоящим Godot
```

`npm run verify:godot` требует установленного Godot 4. Путь можно задать явно:

```bash
GODOT_BIN="D:\SteamLibrary\steamapps\common\Godot Engine\godot.windows.opt.tools.64.exe" npm run verify:godot
```

Скрипт собирает временный проект Godot, создаёт заглушки для упомянутых `res://`-файлов
и прогоняет каждый пример через `godot --headless --check-only`. Отдельно проверяются
отступы (в GDScript — табы) и связка «шейдер ↔ параметры».

---

## Структура

```
tutorial fo Godot/
├── DECISIONS.md            архитектурные решения и их причины
├── ISSUES.md               ревью: замечания, приоритеты, статус
├── QA-CHECKLIST.md         чек-лист ручной проверки перед релизом
├── scripts/
│   ├── verify-godot-examples.mjs  проверка примеров кода в Godot
│   ├── verify-error-messages.mjs  сверка справочника ошибок с движком
│   ├── verify-links.mjs           проверка внутренних ссылок и якорей
│   └── measure-bundle.mjs         замер размера сборки в gzip
├── public/                 favicon.svg, robots.txt
└── src/
    ├── components/
    │   ├── content/        StageCard, TopicList, CodeBlock, Diagram, StepList,
    │   │                   Callout, RoadmapTimeline, ProgressRing, SearchBar,
    │   │                   ThemeToggle, CheatSheetTabs, ProjectLadder,
    │   │                   ContinueCard, StageToc, ErrorCard, Reveal, …
    │   ├── diagrams/       25 SVG-диаграмм + общие примитивы и токены
    │   ├── layout/         SiteHeader, SiteFooter, PageHeader, навигация
    │   └── ui/             button, card, badge, checkbox, switch, tabs,
    │                       accordion, drawer, input, progress, separator,
    │                       error-boundary
    ├── content/            ВЕСЬ КОНТЕНТ (типизированные TS-модули)
    │   ├── types.ts        модель данных: Stage, Topic, Step, Task, …
    │   ├── stages/         stage-00 … stage-12 (по файлу на этап)
    │   ├── plan-24-weeks.ts, project-ladder.ts, cheatsheets.ts,
    │   ├── faq.ts, glossary.ts, resources.ts, diagrams.ts,
    │   ├── errors.ts, versions.ts
    ├── hooks/              useProgress, useStageProgress, useTheme, useMediaQuery,
    │                       usePageMeta, useReveal, useCountUp, useNextUnfinished
    ├── lib/                progress (localStorage), search (индекс), highlight,
    │                       continue (следующий пункт), download (файлы)
    ├── pages/              Home, Roadmap, Stage, Plan, Ladder, Cheatsheets,
    │                       Resources, Glossary, Faq, Errors, Versions, NotFound
    ├── App.tsx             маршруты (HashRouter) и ленивая загрузка экранов
    └── index.css           дизайн-токены (светлая и тёмная темы)
```

---

## Как добавить новый этап

1. Создать `src/content/stages/stage-13-my-topic.ts` с объектом типа `Stage`
   (схема — в `src/content/types.ts`). Или скопировать заготовку существующего этапа.
2. Зарегистрировать этап в `src/content/stages/index.ts`: импорт + добавление в массив `stages`.
   ID должен идти по порядку (`00`…`12`), `slug` — kebab-case латиницей.
3. При необходимости добавить диаграмму:
   - компонент в `src/components/diagrams/` (использовать общие примитивы
     `DiagramNode`, `DiagramEdge`, `DiagramFrame` — так сохранится единый стиль);
   - запись в `src/content/diagrams.ts` (заголовок, подпись, легенда, `minWidth`);
   - ссылку в массив `diagramComponents` (`src/components/diagrams/index.ts`).
4. Проверить: `npm run typecheck && npm run lint && npm run verify:godot && npm run build`.

Контент не требует правок вёрстки: компоненты рендерят только поля данных.

---

## Как добавить шпаргалку, вопрос FAQ или термин

- Шпаргалка — новый объект в массиве `cheatSheets` (`src/content/cheatsheets.ts`).
- Вопрос — новый объект в `faq` (`src/content/faq.ts`).
- Термин — новый объект в `glossary` (`src/content/glossary.ts`), поле `stageId`
  указывает этап, где термин разбирается.

---

## Как добавить статью в поиск

Поиск строится автоматически в `src/lib/search.ts` из этапов, шпаргалок, FAQ, глоссария
и справочника ошибок. Новый тип записей добавляется в функцию `buildIndex()`, в `kindBoost`
и в `searchKindLabel` (подпись типа в выдаче).

---

## Прогресс обучения

Отметки хранятся в `localStorage` в формате `godot-plan:v1:<stageId>:<kind>-<itemId>`
(`kind` — `topic`, `step`, `task`, `criterion`, `project`). Ключ темы — `godot-plan:v1:theme`.
Данные не покидают браузер. Сбросить прогресс можно из консоли:

```js
Object.keys(localStorage)
  .filter(k => k.startsWith('godot-plan:v1'))
  .forEach(k => localStorage.removeItem(k))
```

---

## Проверено

| Что | Как | Результат |
|---|---|---|
| Примеры кода | `npm run verify:godot` (Godot 4.7.2 headless) | 45 GDScript-примеров из 49, 0 ошибок |
| Сообщения в справочнике ошибок | `npm run verify:errors` (Godot 4.7.2 headless) | 16 записей, 0 расхождений с движком |
| Внутренние ссылки и якоря | `npm run verify:links` | 92 файла, 1845 якорей, 68 внешних ссылок, 0 битых |
| Манифест этапов | `npm run verify:manifest` | 13 этапов, 322 пункта, 0 расхождений с контентом |
| Типы | `tsc -b` | без ошибок |
| Линтер | `eslint .` (включены правила react-hooks) | чисто |
| Доступность | Lighthouse (светлая и тёмная темы) | accessibility 1.0, best-practices 1.0, SEO 1.0 |
| Размер сборки | `npm run verify:size` | 306.2 KB gzip (весь `dist`, бюджет 310), первая загрузка 112.3 KB (бюджет 130), самый тяжёлый модуль 22.4 KB (бюджет 40) |
| Растровые картинки | `document.querySelectorAll('img')` | 0 |

Полный прогон одной командой: `npm run verify` (типы → линтер → примеры → справочник ошибок →
ссылки → сборка → бюджет). Ручные проверки — в [QA-CHECKLIST.md](./QA-CHECKLIST.md).

Подробности — в [DECISIONS.md](./DECISIONS.md) и [ISSUES.md](./ISSUES.md).
