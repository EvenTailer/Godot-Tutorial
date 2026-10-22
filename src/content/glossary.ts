import type { GlossaryEntry } from './types'

/**
 * Глоссарий: термины Godot с переводом и указанием этапа, где они разбираются.
 * Английские термины в тексте курса намеренно не переводятся — здесь собраны значения.
 */
export const glossary: GlossaryEntry[] = [
  {
    id: 'gl-node',
    term: 'Node',
    translation: 'узел',
    meaning:
      'Базовый объект в дереве сцены. Всё в Godot — узел: спрайт, камера, скрипт, звук, интерфейс. Узел знает своего родителя и детей.',
    stageId: '02',
  },
  {
    id: 'gl-scene',
    term: 'Scene',
    translation: 'сцена',
    meaning:
      'Файл .tscn с деревом узлов. Сцена — это ресурс: её можно загрузить, продублировать, вставить в другую сцену и инстанцировать в рантайме.',
    stageId: '02',
  },
  {
    id: 'gl-root',
    term: 'Root node',
    translation: 'корневой узел',
    meaning: 'Верхний узел дерева сцены. У него нет родителя, и его нельзя удалить.',
    stageId: '02',
  },
  {
    id: 'gl-owner',
    term: 'Owner',
    translation: 'владелец',
    meaning:
      'Узел сцены, к которому принадлежит данный узел. Определяет, что сохранится вместе со сценой при её сохранении.',
    stageId: '02',
  },
  {
    id: 'gl-signal',
    term: 'Signal',
    translation: 'сигнал',
    meaning:
      'Сообщение без прямой ссылки на отправителя. Отправитель вызывает emit, получатель подписывается через connect. Основа слабой связи между узлами.',
    stageId: '02',
  },
  {
    id: 'gl-resource',
    term: 'Resource',
    translation: 'ресурс',
    meaning:
      'Контейнер данных, который можно сохранить в файл .tres и переиспользовать во многих экземплярах. В отличие от узла, не участвует в дереве сцены.',
    stageId: '02',
  },
  {
    id: 'gl-instancing',
    term: 'Instancing',
    translation: 'инстанцирование',
    meaning:
      'Создание экземпляра сцены в рантайме: scene.instantiate() создаёт узел, add_child() вводит его в дерево.',
    stageId: '02',
  },
  {
    id: 'gl-autoload',
    term: 'Autoload',
    translation: 'автозагрузка',
    meaning:
      'Скрипт, загружаемый один раз при старте проекта и доступный глобально по имени. Используется для сервисов: счёт, звук, сохранения.',
    stageId: '08',
  },
  {
    id: 'gl-ready',
    term: '_ready()',
    translation: 'готовность узла',
    meaning:
      'Колбэк, вызываемый один раз, когда узел и все его дети вошли в дерево. В нём безопасно обращаться к соседям по $Sibling.',
    stageId: '02',
  },
  {
    id: 'gl-process',
    term: '_process(delta)',
    translation: 'обработка кадра',
    meaning:
      'Колбэк, вызываемый каждый кадр. delta — время с прошлого кадра в секундах: умножайте на него скорость.',
    stageId: '03',
  },
  {
    id: 'gl-physics',
    term: '_physics_process(delta)',
    translation: 'физический шаг',
    meaning:
      'Колбэк с фиксированной частотой (по умолчанию 60 Гц). Движение персонажа и физика считаются здесь, а не в _process.',
    stageId: '03',
  },
  {
    id: 'gl-delta',
    term: 'delta',
    translation: 'дельта, шаг времени',
    meaning:
      'Время в секундах, прошедшее с прошлого кадра. Обеспечивает одинаковую скорость движения при разной частоте монитора.',
    stageId: '03',
  },
  {
    id: 'gl-velocity',
    term: 'velocity',
    translation: 'скорость',
    meaning:
      'Вектор скорости тела в пикселях (или метрах) в секунду. Задаётся перед вызовом move_and_slide().',
    stageId: '03',
  },
  {
    id: 'gl-characterbody',
    term: 'CharacterBody2D / CharacterBody3D',
    translation: 'персонаж',
    meaning:
      'Физическое тело, которое перемещает код. Главный выбор для игрока и NPC.',
    stageId: '03',
  },
  {
    id: 'gl-area',
    term: 'Area2D',
    translation: 'область',
    meaning:
      'Зона, которая не останавливает тела, а сообщает о пересечениях: урон, подбор, триггеры.',
    stageId: '03',
  },
  {
    id: 'gl-layer',
    term: 'collision_layer / collision_mask',
    translation: 'слой и маска коллизий',
    meaning:
      'Правила столкновений. Слой отвечает «на каком слое я нахожусь», маска — «с кем я сталкиваюсь».',
    stageId: '03',
  },
  {
    id: 'gl-raycast',
    term: 'RayCast2D / RayCast3D',
    translation: 'луч',
    meaning:
      'Невидимый луч из узла: проверяет, что и на каком расстоянии он пересёк. Основа проверок «есть ли земля» и выстрелов.',
    stageId: '03',
  },
  {
    id: 'gl-tilemap',
    term: 'TileSet / TileMapLayer',
    translation: 'набор тайлов / слой тайлов',
    meaning:
      'TileSet — ресурс с тайлами и их правилами. TileMapLayer — узел, в который рисуют уровень. TileMapLayer пришёл на смену TileMap в Godot 4.3.',
    stageId: '04',
  },
  {
    id: 'gl-animationplayer',
    term: 'AnimationPlayer',
    translation: 'плеер анимаций',
    meaning:
      'Узел, который проигрывает анимации любых свойств любых узлов сцены, включая звук и цвет.',
    stageId: '04',
  },
  {
    id: 'gl-spriteframes',
    term: 'SpriteFrames',
    translation: 'кадры анимации',
    meaning: 'Ресурс с наборами кадров для AnimatedSprite2D: одна анимация — один набор.',
    stageId: '04',
  },
  {
    id: 'gl-tween',
    term: 'Tween',
    translation: 'твин',
    meaning:
      'Объект, который плавно меняет свойства во времени. Основа «сочности»: вспышки, откаты, анимации интерфейса.',
    stageId: '04',
  },
  {
    id: 'gl-canvaslayer',
    term: 'CanvasLayer',
    translation: 'слой холста',
    meaning:
      'Слой поверх игрового мира, не зависящий от камеры. В нём живёт интерфейс.',
    stageId: '05',
  },
  {
    id: 'gl-anchor',
    term: 'Anchor',
    translation: 'якорь',
    meaning:
      'Привязка элемента интерфейса к точке родителя. Позволяет строить раскладку, не привязанную к размеру окна.',
    stageId: '05',
  },
  {
    id: 'gl-audiobus',
    term: 'Audio bus',
    translation: 'аудио-шина',
    meaning:
      'Именованный канал звука со своими эффектами и громкостью. По умолчанию: Master, Music, SFX.',
    stageId: '06',
  },
  {
    id: 'gl-json',
    term: 'JSON',
    translation: 'формат данных',
    meaning:
      'Текстовый формат данных. В Godot: JSON.stringify() и JSON.parse_string(). Удобен тем, что файл читается человеком.',
    stageId: '07',
  },
  {
    id: 'gl-userdir',
    term: 'user://',
    translation: 'папка пользователя',
    meaning:
      'Папка, куда игра может писать: сохранения, настройки. В отличие от res://, доступна для записи всегда.',
    stageId: '07',
  },
  {
    id: 'gl-configfile',
    term: 'ConfigFile',
    translation: 'файл настроек',
    meaning:
      'Встроенный формат Godot для настроек: секции и ключи. Файл читается человеком и переживает случайные правки.',
    stageId: '07',
  },
  {
    id: 'gl-group',
    term: 'Group',
    translation: 'группа',
    meaning:
      'Метка на узле, по которой можно искать все такие узлы в дереве. Заменяет хрупкие жёсткие пути.',
    stageId: '08',
  },
  {
    id: 'gl-component',
    term: 'Component',
    translation: 'компонент',
    meaning:
      'Узел с одной обязанностью, который добавляется в другой узел как ребёнок. Пример: компонент здоровья.',
    stageId: '08',
  },
  {
    id: 'gl-environments',
    term: 'Environment / WorldEnvironment',
    translation: 'окружение',
    meaning:
      'Настройки неба, ambient-освещения, тумана и пост-обработки. Без них 3D-сцена выглядит плоской или чёрной.',
    stageId: '09',
  },
  {
    id: 'gl-shader',
    term: 'Shader',
    translation: 'шейдер',
    meaning:
      'Программа на языке шейдеров, определяющая внешний вид пикселя или вершины. Файлы .gdshader.',
    stageId: '10',
  },
  {
    id: 'gl-uniform',
    term: 'uniform',
    translation: 'параметр шейдера',
    meaning:
      'Значение, передаваемое в шейдер снаружи. Меняется из кода через set_shader_parameter().',
    stageId: '10',
  },
  {
    id: 'gl-profiler',
    term: 'Profiler',
    translation: 'профилировщик',
    meaning:
      'Инструмент измерения: показывает, сколько миллисекунд кадра занимают физика, скрипты и отрисовка.',
    stageId: '10',
  },
  {
    id: 'gl-exportpreset',
    term: 'Export preset',
    translation: 'пресет экспорта',
    meaning:
      'Файл export_presets.cfg с настройками сборки под платформу. Хранится в проекте и коммитится в Git.',
    stageId: '11',
  },
  {
    id: 'gl-exporttemplates',
    term: 'Export templates',
    translation: 'шаблоны экспорта',
    meaning:
      'Заранее собранный движок под каждую платформу. Скачивается отдельно, версия должна совпадать с версией редактора.',
    stageId: '11',
  },
]

export function findGlossary(id: string): GlossaryEntry | undefined {
  return glossary.find((entry) => entry.id === id)
}
