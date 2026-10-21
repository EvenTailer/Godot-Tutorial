import type { DiagramMeta } from './types'

/**
 * Реестр диаграмм.
 *
 * Метаданные нужны компоненту <Diagram>: заголовок, подпись словами, легенда
 * и минимальная ширина (ниже неё подписи в SVG нечитаемы — включается скролл).
 *
 * Сами рисунки — React-компоненты в src/components/diagrams/.
 * Идентификаторы здесь и там должны совпадать.
 */
export const diagrams: Record<string, DiagramMeta> = {
  'scene-tree': {
    id: 'scene-tree',
    title: 'Дерево сцены и путь к узлу',
    caption:
      'Сцена — это дерево узлов. Путь к узлу записывается сверху вниз через косую черту: $Level/Player/Sprite2D. Имя в квадратных скобках нужно, если в имени есть пробел или спецсимвол.',
    legend: [
      { label: 'Сцена (корень)', kind: 'accent' },
      { label: 'Узел', kind: 'node' },
      { label: 'Путь к узлу', kind: 'weak' },
    ],
    minWidth: 520,
  },
  'project-structure': {
    id: 'project-structure',
    title: 'Структура проекта на диске',
    caption:
      'В папке проекта лежат исходники. Папка .godot — кэш движка (её не коммитим), папка export — результаты сборки. Данные игрока во время работы лежат в user://, а не в проекте.',
    legend: [
      { label: 'Исходники (коммитим)', kind: 'node' },
      { label: 'Кэш движка (не коммитим)', kind: 'accent' },
      { label: 'Пользовательские данные', kind: 'weak' },
    ],
    minWidth: 560,
  },
  'git-workflow': {
    id: 'git-workflow',
    title: 'Git: рабочее дерево, индекс, коммит',
    caption:
      'Вы правите файлы в рабочем дереве. Команда git add отправляет изменения в индекс, git commit фиксирует их как точку отката. Всё это можно вернуть: git checkout -- файл.',
    legend: [
      { label: 'Рабочее дерево', kind: 'node' },
      { label: 'Индекс (staging)', kind: 'accent' },
      { label: 'Коммит', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'gdscript-typing': {
    id: 'gdscript-typing',
    title: 'Типы данных в GDScript',
    caption:
      'Тип переменной определяется при объявлении. := выводит тип автоматически, : задаёт его явно. Смешивать int и float нельзя без явного приведения.',
    legend: [
      { label: 'Значение', kind: 'node' },
      { label: 'Тип', kind: 'accent' },
      { label: 'Преобразование', kind: 'weak' },
    ],
    minWidth: 560,
  },
  'ready-process-order': {
    id: 'ready-process-order',
    title: 'Порядок вызовов _ready и _process',
    caption:
      'При добавлении узла в дерево сначала вызывается _enter_tree, потом _ready (от родителя к детям). Каждый кадр затем вызывается _process, а для физики — _physics_process с фиксированной частотой.',
    legend: [
      { label: 'Один раз', kind: 'accent' },
      { label: 'Каждый кадр', kind: 'flow' },
      { label: 'Каждый физический шаг', kind: 'weak' },
    ],
    minWidth: 600,
  },
  'node-lifecycle': {
    id: 'node-lifecycle',
    title: 'Жизненный цикл узла',
    caption:
      'Узел входит в дерево, зреет, работает и выходит. Порядок выхода обратный: сначала дети, потом родитель. В _ready дети уже готовы — можно брать ссылки на соседей.',
    legend: [
      { label: 'Событие', kind: 'node' },
      { label: 'Порядок', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'signals': {
    id: 'signals',
    title: 'Поток сигналов: emit и connect',
    caption:
      'Отправитель вызывает emit, получатель заранее подписался через connect. Связь односторонняя: отправитель не знает, кто его слушает. Отписаться нужно через disconnect.',
    legend: [
      { label: 'Отправитель', kind: 'accent' },
      { label: 'Получатель', kind: 'node' },
      { label: 'Сигнал', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'scene-instancing': {
    id: 'scene-instancing',
    title: 'Инстанцирование сцены',
    caption:
      'Сцена — ресурс. instantiate() создаёт узел, add_child() вводит его в дерево. Порядок важен: настройте узел и подпишитесь на сигналы до добавления в дерево.',
    legend: [
      { label: 'Сцена-шаблон', kind: 'accent' },
      { label: 'Созданный узел', kind: 'node' },
      { label: 'Шаг', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'resource-vs-node': {
    id: 'resource-vs-node',
    title: 'Ресурс или узел?',
    caption:
      'Узел — поведение в дереве сцены, у него есть _ready и он участвует в обработке ввода. Ресурс — данные: у него нет жизненного цикла, зато его можно сохранить в файл и переиспользовать.',
    legend: [
      { label: 'Узел (Node)', kind: 'accent' },
      { label: 'Ресурс (Resource)', kind: 'node' },
      { label: 'Данные', kind: 'weak' },
    ],
    minWidth: 560,
  },
  'collision-layers': {
    id: 'collision-layers',
    title: 'Слои и маски коллизий',
    caption:
      'У каждого тела есть слой (на чём я нахожусь) и маска (с кем я сталкиваюсь). Столкновение происходит, если слои пересеклись хотя бы в одной стороне.',
    legend: [
      { label: 'Слой', kind: 'accent' },
      { label: 'Маска', kind: 'node' },
      { label: 'Совпадение', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'input-order': {
    id: 'input-order',
    title: 'Порядок обработки ввода',
    caption:
      'Событие ввода идёт по цепочке: _input → GUI → _unhandled_input → _shortcut_input → _unhandled_key_input. Если узел обработал событие через accept_event(), дальше оно не пойдёт.',
    legend: [
      { label: 'Шаг', kind: 'flow' },
      { label: 'Узел', kind: 'node' },
    ],
    minWidth: 600,
  },
  'state-machine': {
    id: 'state-machine',
    title: 'Машина состояний игрока',
    caption:
      'Состояние определяет, какой набор правил применяется. Переходы происходят по событиям, а не по флагам: одно состояние в один момент — поведение всегда предсказуемо.',
    legend: [
      { label: 'Состояние', kind: 'accent' },
      { label: 'Переход', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'tilemap-layers': {
    id: 'tilemap-layers',
    title: 'Слои тайловой карты',
    caption:
      'Уровень собирается из нескольких TileMapLayer: земля, декор позади, декор впереди. Каждый слой рисуется отдельно, а порядок определяется z_index и Y-сортировкой.',
    legend: [
      { label: 'Слой тайлов', kind: 'node' },
      { label: 'Активный слой', kind: 'accent' },
      { label: 'Порядок отрисовки', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'animation-state': {
    id: 'animation-state',
    title: 'Анимации и состояния',
    caption:
      'Анимация подбирается под состояние: idle, run, jump. Переключение делается один раз, а не каждый кадр, иначе анимация начнётся заново и будет дёргаться.',
    legend: [
      { label: 'Состояние', kind: 'accent' },
      { label: 'Анимация', kind: 'node' },
      { label: 'Переход', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'ui-anchors': {
    id: 'ui-anchors',
    title: 'Якоря и раскладка интерфейса',
    caption:
      'Якорь задаёт, к какой точке родителя привязан элемент. Контейнеры раскладывают детей сами. Вместе это даёт интерфейс, который одинаково выглядит на 360px и на 1920px.',
    legend: [
      { label: 'Контейнер', kind: 'node' },
      { label: 'Якорь', kind: 'accent' },
      { label: 'Раскладка', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'audio-bus': {
    id: 'audio-bus',
    title: 'Аудио-шины',
    caption:
      'Звуки идут в шины: Music, SFX. Шины сливаются в Master, где задаётся общая громкость. Игрок может менять громкость Music отдельно от SFX.',
    legend: [
      { label: 'Источник звука', kind: 'node' },
      { label: 'Шина', kind: 'accent' },
      { label: 'Поток сигнала', kind: 'flow' },
    ],
    minWidth: 560,
  },
  'save-system': {
    id: 'save-system',
    title: 'Сохранение и загрузка',
    caption:
      'Состояние превращается в JSON, JSON записывается в user://. При загрузке файл читается и разбирается; если он повреждён, игра не падает, а начинает с нуля.',
    legend: [
      { label: 'Состояние', kind: 'node' },
      { label: 'Файл в user://', kind: 'accent' },
      { label: 'Поток данных', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'inventory-data': {
    id: 'inventory-data',
    title: 'Модель данных инвентаря',
    caption:
      'Справочник предметов (ресурсы) отделён от инвентаря игрока (id и количество). В сохранение попадает только инвентарь — ресурсы лежат в проекте.',
    legend: [
      { label: 'Ресурс предмета', kind: 'node' },
      { label: 'Данные игрока', kind: 'accent' },
      { label: 'Ссылка по id', kind: 'weak' },
    ],
    minWidth: 600,
  },
  'autoload-architecture': {
    id: 'autoload-architecture',
    title: 'Архитектура: автолоад, ресурс, сцена',
    caption:
      'Автолоад — сервис, доступный всегда. Ресурс — данные. Сцена — поведение. Слои не должны знать друг о друге напрямую: общаются через сигналы.',
    legend: [
      { label: 'Сервис (автолоад)', kind: 'accent' },
      { label: 'Данные (ресурс)', kind: 'node' },
      { label: 'Поведение (сцена)', kind: 'flow' },
    ],
    minWidth: 620,
  },
  'refactor-architecture': {
    id: 'refactor-architecture',
    title: 'Рефакторинг: из «жирного» узла в компоненты',
    caption:
      'Было: один узел со всеми задачами. Стало: узел-контейнер и компоненты с одной обязанностью каждый. Поведение не изменилось — изменилась структура.',
    legend: [
      { label: 'Компонент', kind: 'node' },
      { label: 'Контейнер', kind: 'accent' },
      { label: 'Связь', kind: 'flow' },
    ],
    minWidth: 600,
  },
  'scene-3d': {
    id: 'scene-3d',
    title: 'Устройство 3D-сцены',
    caption:
      'В 3D нужен источник света, иначе сцена чёрная. Окружение задаёт фон и ambient. Камера определяет точку обзора, а у каждого видимого объекта есть отдельный узел коллизии.',
    legend: [
      { label: 'Объект', kind: 'node' },
      { label: 'Свет и камера', kind: 'accent' },
      { label: 'Взгляд', kind: 'flow' },
    ],
    minWidth: 620,
  },
  'shader-pipeline': {
    id: 'shader-pipeline',
    title: 'Пайплайн шейдера',
    caption:
      'Шейдер получает текстуру и координаты пикселя, считает новый цвет и отдаёт результат. Параметры (uniform) задаются снаружи и не меняются внутри шейдера.',
    legend: [
      { label: 'Вход', kind: 'node' },
      { label: 'Параметр (uniform)', kind: 'accent' },
      { label: 'Поток данных', kind: 'flow' },
    ],
    minWidth: 620,
  },
  'perf-profiling': {
    id: 'perf-profiling',
    title: 'Бюджет кадра: куда уходит время',
    caption:
      'Кадр при 60 FPS должен уложиться в 16.6 мс. Профилировщик показывает, сколько занимает физика, скрипты и отрисовка. Оптимизировать нужно то, что видно в цифрах.',
    legend: [
      { label: 'Часть кадра', kind: 'node' },
      { label: 'Бюджет', kind: 'accent' },
      { label: 'Время', kind: 'flow' },
    ],
    minWidth: 620,
  },
  'export-presets': {
    id: 'export-presets',
    title: 'Экспорт: от проекта к игре',
    caption:
      'Пресет экспорта описывает настройки сборки для платформы. Шаблоны экспорта — заранее собранный движок под каждую платформу. Без них экспорт не запустится.',
    legend: [
      { label: 'Проект', kind: 'node' },
      { label: 'Шаблон и пресет', kind: 'accent' },
      { label: 'Сборка', kind: 'flow' },
    ],
    minWidth: 620,
  },
  'final-project-architecture': {
    id: 'final-project-architecture',
    title: 'Архитектура финального проекта',
    caption:
      'Директор игры управляет уровнями и переходами, сервис сохранений — файлами, счёт — числами. Игровые сцены знают только о сервисах, а не друг о друге.',
    legend: [
      { label: 'Сервис', kind: 'accent' },
      { label: 'Игровой модуль', kind: 'node' },
      { label: 'Сигнал', kind: 'flow' },
    ],
    minWidth: 620,
  },
}

/** Список идентификаторов в порядке появления — для проверки целостности. */
export const diagramIds = Object.keys(diagrams)

export function getDiagram(id: string): DiagramMeta | undefined {
  return diagrams[id]
}
