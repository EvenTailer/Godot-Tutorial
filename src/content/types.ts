/**
 * Модель данных контента сайта.
 *
 * Весь текст живёт здесь, в типизированных модулях — компоненты только рендерят данные.
 * Godot-команда правит контент, не трогая вёрстку.
 *
 * Правило: если поле не используется компонентом — удалить его, а не оставлять «на будущее».
 */

/* ------------------------------------------------------------------ */
/*  Общие примитивы                                                     */
/* ------------------------------------------------------------------ */

/** Тип языка для подсветки кода. */
export type CodeLanguage = 'gdscript' | 'gdshader' | 'json' | 'ini' | 'shell'

/** Тип внешней ссылки. */
export type ResourceKind = 'docs' | 'reference' | 'video' | 'tool' | 'article'

/** Уровень сложности практического задания. */
export type TaskLevel = 1 | 2 | 3

/* ------------------------------------------------------------------ */
/*  Этап                                                                 */
/* ------------------------------------------------------------------ */

/**
 * Заметка о версии Godot.
 * Ставится только там, где API или поведение менялись между 4.0 и 4.4.
 */
export interface VersionNote {
  /** Например «4.3». */
  version: string
  /** Что именно изменилось и что делать читателю. */
  text: string
}

/** Тема этапа: одна «единица знания». */
export interface Topic {
  id: string
  /** Заголовок темы на русском. */
  title: string
  /** Английский термин в скобках при первом упоминании (опционально). */
  term?: string
  /** «Что это» — одно-два предложения. */
  summary: string
  /** «Зачем это нужно» — главная ценность темы. */
  why: string
  /** Разбор: детали, нюансы, типичные ошибки. */
  details: string[]
  /** Идентификатор примера кода из `stage.code`, если тема на него ссылается. */
  codeRef?: string
  /** Идентификатор диаграммы (см. src/content/diagrams.ts). */
  diagramRef?: string
}

/** Заглушка скриншота редактора. Никогда не выдаётся за реальный скриншот. */
export interface ScreenshotStub {
  /** Какая часть редактора изображена. */
  area: 'viewport' | 'filesystem' | 'inspector' | 'toolbar' | 'menu'
  /** Точная подпись: что на ней изображено. */
  caption: string
  /** Подсказка вида «сюда нажми». */
  hint: string
}

/** Один практический шаг в редакторе. */
export interface Step {
  id: string
  /** Что делаем. */
  title: string
  /** Где именно нажимать — реальные названия пунктов меню Godot. */
  where: string
  /** Подробное действие. */
  action: string
  /** Как понять, что получилось. */
  result: string
  /** Важная оговорка, если без неё можно сломать проект. */
  note?: string
  /** Заглушка скриншота. */
  screenshot?: ScreenshotStub
  /** Идентификатор диаграммы. */
  diagramRef?: string
}

/** Пример кода внутри этапа. */
export interface CodeExample {
  id: string
  title: string
  /** Путь файла в проекте Godot, если это целый файл. */
  file?: string
  language: CodeLanguage
  code: string
  /** Разбор: что делает код и почему так. */
  explanation: string
  /** Отдельно — про версию Godot. */
  versionNote?: string
}

/** Практическое задание. */
export interface Task {
  id: string
  title: string
  description: string
  level: TaskLevel
  /** Подсказка, если читатель застрял. */
  hint: string
}

/** Мини-проект этапа — главный практический результат. */
export interface MiniProject {
  title: string
  /** Постановка задачи. */
  brief: string
  /** Обязательные требования (критерии «сделано»). */
  requirements: string[]
  /** Что делать, если осталось время. */
  stretch: string[]
}

/** Критерий «знаю тему» — самопроверка. */
export interface Criterion {
  id: string
  /** Утверждение от первого лица — умею / понимаю. */
  text: string
  /** Как проверить, что утверждение правда. */
  check: string
}

/** Внешний ресурс. */
export interface Resource {
  title: string
  url: string
  kind: ResourceKind
  note?: string
}

/** Этап обучения. */
export interface Stage {
  /** Стабильный идентификатор, используется в ключах localStorage. */
  id: string
  /** Порядковый номер 0..12. */
  number: number
  /** URL-сегмент: /stage/01-gdscript */
  slug: string
  title: string
  /** Короткое имя для таймлайна. */
  shortTitle: string
  /** Подзаголовок-обещание результата. */
  subtitle: string
  /** Недельный диапазон, например «1–2». */
  weeks: string
  /** Оценка времени в часах. */
  hours: number
  /** Главная цель этапа. */
  goal: string
  /** Что буквально работает в конце этапа. */
  outcome: string
  topics: Topic[]
  steps: Step[]
  code: CodeExample[]
  tasks: Task[]
  project: MiniProject
  criteria: Criterion[]
  resources: Resource[]
  /** Идентификаторы диаграмм этапа. */
  diagrams: string[]
  /** Заметки о версиях Godot. */
  versionNotes: VersionNote[]
}

/* ------------------------------------------------------------------ */
/*  Календарный план                                                    */
/* ------------------------------------------------------------------ */

export interface PlanWeek {
  week: number
  /** Заголовок недели. */
  title: string
  /** Что делаем. */
  focus: string
  /** Этапы, которые закрываем на этой неделе. */
  stages: string[]
  /** Что должно получиться к концу недели. */
  deliverable: string
  hours: number
}

/* ------------------------------------------------------------------ */
/*  Лестница проектов                                                   */
/* ------------------------------------------------------------------ */

export interface LadderItem {
  id: string
  /** Уровень 1 — самый простой. */
  level: number
  title: string
  /** Условие перехода на следующий уровень. */
  goal: string
  /** Что изучаем на этом уровне. */
  skills: string[]
  /** Сколько примеров кода этапов используется. */
  fromStage: string
  /** Оценка времени. */
  hours: number
}

/* ------------------------------------------------------------------ */
/*  Шпаргалки                                                            */
/* ------------------------------------------------------------------ */

export interface CheatSheet {
  id: string
  title: string
  /** Короткое описание. */
  summary: string
  /** Одна колонка. */
  groups: CheatGroup[]
}

export interface CheatGroup {
  title: string
  /** Строка «что → как». */
  rows: Array<{ left: string; right: string; note?: string }>
}

/* ------------------------------------------------------------------ */
/*  FAQ, глоссарий, ресурсы                                              */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface GlossaryEntry {
  id: string
  term: string
  translation: string
  /** Что это значит в Godot на практике. */
  meaning: string
  /** На каком этапе разбираем. */
  stageId: string
}

export interface ResourceGroup {
  id: string
  title: string
  summary: string
  items: Resource[]
}

/* ------------------------------------------------------------------ */
/*  Диаграммы                                                            */
/* ------------------------------------------------------------------ */

/** Тип связи на диаграмме. Сплошная стрелка — поток управления, пунктир — слабая связь. */
export type LinkKind = 'flow' | 'weak'

export interface DiagramLegendItem {
  label: string
  kind: LinkKind | 'node' | 'accent'
}

export interface DiagramMeta {
  id: string
  title: string
  /** Подпись под диаграммой — дублирует смысл словами. */
  caption: string
  legend: DiagramLegendItem[]
  /** Минимальная ширина в px: ниже диаграмма нечитаема, поэтому включается горизонтальный скролл. */
  minWidth: number
}
