import type { Stage } from '../types'

/**
 * Этап 10 — Шейдеры и производительность.
 * Цель этапа: добавить собственные эффекты и научиться находить «тормоза» до того,
 * как их заметит игрок.
 */
export const stage10: Stage = {
  id: '10',
  number: 10,
  slug: '10-shejdery-i-proizvoditelnost',
  title: 'Шейдеры и производительность',
  shortTitle: 'Шейдеры и производительность',
  subtitle: 'Свой визуал на GLSL-подобном языке и способы найти узкое место в игре',
  weeks: '21–22',
  hours: 14,
  goal: 'Научиться писать простые шейдеры и находить и устранять причины «тормозов».',
  outcome:
    'У игры есть собственный шейдер (вспышка при уроне, вода), а тормоза в сцене найдены профилировщиком и устранены.',
  topics: [
    {
      id: 'shader-basics',
      title: 'Что такое шейдер',
      term: 'Shader',
      summary:
        'Шейдер — маленькая программа, которая работает на видеокарте и определяет, как выглядит пиксель или вершина.',
      why:
        'Шейдер даёт эффекты, которые невозможно собрать из готовых узлов: вода, искажение, растворение, 2D-туман, размытие. Это самый «дешёвый» способ сделать игру красивой.',
      details: [
        'Файлы шейдеров имеют расширение .gdshader.',
        'Первая строка: shader_type canvas_item; (для 2D) или shader_type spatial; (для 3D).',
        'Для 2D есть fragment() (цвет пикселя) и vertex() (положение вершины).',
        'Встроенные переменные 2D: TEXTURE (текстура), UV (координаты 0..1), COLOR (выходной цвет).',
        'В 3D: ALBEDO (цвет поверхности), ROUGHNESS, METALLIC, EMISSION.',
        'Шейдер можно написать прямо в редакторе: New Shader в свойстве Material.',
      ],
      diagramRef: 'shader-pipeline',
    },
    {
      id: 'uniforms',
      title: 'Параметры шейдера',
      term: 'uniform',
      summary:
        'uniform — значение, задаваемое снаружи шейдера. Его можно менять в любой момент через set_shader_parameter() — и шейдер увидит новое значение уже в следующем кадре. Именно поэтому один шейдер заменяет десятки разных.',
      why:
        'Один шейдер с параметрами заменяет десятки разных шейдеров. Вспышка, сила искажения, цвет тумана — всё это параметры.',
      details: [
        '`uniform float amount : hint_range(0.0, 1.0) = 0.5;` — подсказка показывает ползунок в инспекторе.',
        '`uniform vec4 color : source_color;` — подсказка source_color включает выбор цвета.',
        '`uniform sampler2D noise_tex;` — текстура.',
        'Передача значения: material.set_shader_parameter("amount", 0.8).',
        'Имя параметра должно совпадать с именем в шейдере — иначе значение просто не применится.',
      ],
      diagramRef: 'shader-pipeline',
    },
    {
      id: 'shader-material',
      title: 'ShaderMaterial',
      term: 'ShaderMaterial',
      summary:
        'ShaderMaterial — ресурс, который применяет шейдер к узлу. Создаётся через New → ShaderMaterial в поле Material.',
      why:
        'Материал можно сохранить как .tres и переиспользовать; в инспекторе сразу видны все параметры шейдера.',
      details: [
        'Создайте ShaderMaterial, в свойстве Shader выберите файл .gdshader.',
        'Параметры шейдера появятся прямо в инспекторе материала.',
        'Если параметр не появился — проверьте, что он объявлен с ключевым словом uniform.',
        'Один материал на много узлов — как и с обычными материалами.',
        'Чтобы параметр менялся из кода, держите ссылку на материал: $Sprite2D.material as ShaderMaterial.',
      ],
    },
    {
      id: 'profiling',
      title: 'Профилирование: где тормозит',
      term: 'Profiler',
      summary:
        'В редакторе есть профилировщик (вкладка Debug), монитор FPS и визуализация физики. Ими измеряют, а не угадывают.',
      why:
        '«Оптимизирую, потому что медленно» — путь в никуда. Реальные тормоза почти всегда вызваны одним из пяти причин, и их видно в цифрах.',
      details: [
        'Debug → Profiler показывает время кадра, физику, отрисовку и скрипты.',
        'Вкладка мониторов (Monitors) с FPS и памятью находится в нижней панели редактора → Debugger → Monitors.',
        'Чтобы увидеть коллизии: Debug → Visible Collision Shapes — одна галочка включает показ форм и в 2D, и в 3D во время запуска игры.',
        'Частые причины тормозов: _process с тяжёлой работой, создание объектов каждый кадр, слишком много узлов, дорогая отрисовка, отсутствие кэша.',
        'Время кадра в 60 FPS = 16.6 мс. Всё, что вы делаете за кадр, должно укладываться в этот бюджет.',
      ],
      diagramRef: 'perf-profiling',
    },
    {
      id: 'optimization',
      title: 'Основные приёмы оптимизации',
      term: 'Optimization',
      summary:
        'Не вызывать лишнего, не создавать объекты в цикле, не рисовать то, что не видно, не считать то, что не менялось.',
      why:
        'Большинство «тормозов» лечится не микрооптимизацией кода, а отказом от лишней работы. Это проще и даёт больше эффекта.',
      details: [
        'Не создавайте узлы и объекты в _process — используйте пул (object pooling).',
        'Не вызывайте get_node() каждый кадр — сохраняйте ссылку в @onready.',
        'Не пересчитывайте то, что не изменилось: обновляйте лейбл по событию, а не каждый кадр.',
        'Отключайте невидимые части сцены: visible = false у CanvasItem, process_mode = DISABLED у неактивных узлов.',
        'Объединяйте спрайты в атлас, чтобы уменьшить число вызовов отрисовки.',
        'Оптимизируйте после того, как профилировщик показал проблему, а не раньше.',
      ],
      diagramRef: 'perf-profiling',
    },
    {
      id: 'process-modes',
      title: 'Режимы обработки узлов',
      term: 'process_mode',
      summary:
        'Свойство process_mode управляет тем, вызывается ли _process у узла: всегда, только на паузе, только когда видим, или никогда.',
      why:
        'Узлов в игре сотни, а кадров — 60 в секунду. Отключение ненужных узлов даёт больше, чем любая микрооптимизация.',
      details: [
        'PROCESS_MODE_INHERIT — по умолчанию, как у родителя.',
        'PROCESS_MODE_PAUSABLE — работает, пока игра не на паузе.',
        'PROCESS_MODE_WHEN_PAUSED — работает только на паузе (меню).',
        'PROCESS_MODE_ALWAYS — работает всегда (счётчик FPS в меню).',
        'PROCESS_MODE_DISABLED — не работает никогда (спящий враг).',
      ],
    },
  ],
  steps: [
    {
      id: 's10-1',
      title: 'Создать первый шейдер',
      where: 'Inspector → Material → New → Shader',
      action:
        'Выберите спрайт, в поле Material нажмите New → Shader. В открывшемся редакторе напишите: shader_type canvas_item; и в fragment() задайте COLOR = texture(TEXTURE, UV);',
      result: 'Спрайт выглядит как раньше, но теперь у него свой шейдер.',
      note: 'Если написать shader_type неверно, шейдер не применится — редактор покажет ошибку внизу.',
      diagramRef: 'shader-pipeline',
    },
    {
      id: 's10-2',
      title: 'Сделать обесцвечивание',
      where: 'Редактор шейдера → fragment()',
      action:
        'Добавьте uniform float amount : hint_range(0.0, 1.0) = 0.0; и в fragment() посчитайте серый цвет через dot() и смешайте с исходным через mix().',
      result: 'Появился ползунок «amount» в инспекторе материала.',
      note: 'Проверяйте, что uniform объявлен до fragment(), а имя параметра совпадает с тем, что вы задаёте из кода.',
      diagramRef: 'shader-pipeline',
    },
    {
      id: 's10-3',
      title: 'Управлять параметром из кода',
      where: 'Скрипт узла',
      action:
        'Получите материал: var mat := $Sprite2D.material as ShaderMaterial и вызовите mat.set_shader_parameter("amount", 0.8).',
      result: 'Персонаж становится серым при получении урона и возвращает цвет.',
    },
    {
      id: 's10-4',
      title: 'Включить профилировщик',
      where: 'Debug → Profiler (в редакторе), запустите игру',
      action:
        'Откройте вкладку Debug → Profiler, запустите проект (F5). Смотрите на столбцы: Frame Time, Physics, Process, Navigation, Rendering.',
      result: 'Вы видите, сколько миллисекунд занимает каждая часть кадра.',
      note: 'Если игра запущена не из редактора, профилировщик не подключится — запускайте всегда через F5.',
      diagramRef: 'perf-profiling',
    },
    {
      id: 's10-5',
      title: 'Найти узкое место',
      where: 'Профилировщик → столбец Process',
      action:
        'Если в столбце Process много времени — найдите функцию, которая вызывается чаще всего. Временно добавьте в неё замер через Time.get_ticks_usec().',
      result: 'Вы нашли функцию, которая съедает кадр.',
      note:
        'Осторожно: сам замер времени тоже стоит микросекунды. Замеряйте крупные блоки, а не каждую строку.',
      diagramRef: 'perf-profiling',
    },
    {
      id: 's10-6',
      title: 'Сделать пул объектов',
      where: 'Скрипт спавнера',
      action:
        'Вместо instantiate() и queue_free() заведите массив готовых объектов: при спавне берите свободный из массива, при освобождении — возвращайте туда.',
      result: 'Спавн больше не вызывает скачков памяти и сборщик мусора.',
      diagramRef: 'perf-profiling',
    },
    {
      id: 's10-7',
      title: 'Отключить лишнюю обработку',
      where: 'Inspector → Process → Mode',
      action:
        'У неактивных врагов поставьте process_mode = Disabled, а у видимых, но неподвижных объектов отключите _process, если он им не нужен.',
      result: 'Нагрузка на кадр заметно падает.',
    },
  ],
  code: [
    {
      id: 'shader-flash',
      title: 'Шейдер вспышки при уроне',
      file: 'res://shaders/flash.gdshader',
      language: 'gdshader',
      code: `shader_type canvas_item;

uniform float amount : hint_range(0.0, 1.0) = 0.0;
uniform vec4 flash_color : source_color = vec4(1.0, 0.25, 0.25, 1.0);

void fragment() {
	vec4 base = texture(TEXTURE, UV);
	vec3 gray = vec3(dot(base.rgb, vec3(0.299, 0.587, 0.114)));
	vec3 desaturated = mix(base.rgb, vec3(gray), amount);
	COLOR = vec4(mix(desaturated, flash_color.rgb, amount * 0.6), base.a);
}
`,
      explanation:
        'Структура 2D-шейдера всегда одинакова: тип, параметры, функция fragment. `texture(TEXTURE, UV)` берёт цвет пикселя из текстуры. `dot` с вектором (0.299, 0.587, 0.114) — стандартная формула яркости, дающая серый оттенок. `mix` плавно смешивает два цвета: первый — при amount = 0, второй — при amount = 1. Подсказка `hint_range` показывает ползунок в инспекторе, `source_color` — цветовую пипетку.',
      versionNote:
        'Подсказка source_color для uniform-цветов доступна с Godot 4.0.',
    },
    {
      id: 'shader-scrolling',
      title: 'Шейдер бегущей воды',
      file: 'res://shaders/water.gdshader',
      language: 'gdshader',
      code: `shader_type canvas_item;

uniform float scroll_speed = 0.2;
uniform vec2 wave_strength = vec2(0.02, 0.01);
uniform float wave_time_scale = 1.0;
uniform sampler2D noise_texture;

void fragment() {
	float time = TIME * wave_time_scale;
	vec2 offset = vec2(
		sin((UV.y + time * scroll_speed) * 12.0) * wave_strength.x,
		cos((UV.x + time * scroll_speed) * 9.0) * wave_strength.y
	);
	vec4 base = texture(TEXTURE, UV + offset);
	COLOR = base;
}
`,
      explanation:
        '`TIME` — встроенная переменная шейдера, время с запуска. Она растёт сама, поэтому анимация не требует кода. Искажение UV — приём, из которого вырастает вода, огонь и жар: вы как бы «сдвигаете» координаты выборки текстуры. Текстура шума (noise_texture) добавляет нерегулярность: без неё волны выглядят слишком механическими.',
      versionNote:
        'Встроенная переменная TIME доступна во всех шейдерах Godot 4.',
    },
    {
      id: 'shader-control',
      title: 'Управление шейдером из кода',
      file: 'res://flash_controller.gd',
      language: 'gdscript',
      code: `extends Sprite2D

const FLASH_SHADER := preload("res://shaders/flash.gdshader")

@export var flash_duration: float = 0.25

var _material: ShaderMaterial
var _flash_amount := 0.0

func _ready() -> void:
	_material = ShaderMaterial.new()
	_material.shader = FLASH_SHADER
	material = _material
	set_shader_param("amount", 0.0)

func flash(color: Color = Color(1.0, 0.25, 0.25)) -> void:
	set_shader_param("flash_color", color)
	var tween := create_tween()
	tween.tween_method(_set_amount, 1.0, 0.0, flash_duration)

func _set_amount(value: float) -> void:
	_flash_amount = value
	set_shader_param("amount", value)

func set_shader_param(param: StringName, value: Variant) -> void:
	if _material == null:
		return
	_material.set_shader_parameter(param, value)
`,
      explanation:
        'Материал создаётся в коде, чтобы не зависеть от того, что читатель расставил в инспекторе. `tween_method` вызывает функцию каждый кадр анимации с промежуточным значением — это «плавно погасить вспышку» без ручного счётчика. Имя параметра в set_shader_parameter должно точно совпадать с тем, что объявлено в шейдере.',
      versionNote:
        'Shader.set_code() появился в Godot 4.0 — шейдер можно создавать прямо из строки.',
    },
    {
      id: 'object-pool',
      title: 'Пул объектов',
      file: 'res://pool.gd',
      language: 'gdscript',
      code: `class_name ObjectPool
extends Node

@export var scene: PackedScene
@export var prewarm_count: int = 16

var _available: Array[Node] = []
var _in_use: Array[Node] = []

func _ready() -> void:
	for i in range(prewarm_count):
		_available.append(_create())

func _create() -> Node:
	var instance := scene.instantiate()
	add_child(instance)
	instance.set_process(false)
	instance.process_mode = Node.PROCESS_MODE_DISABLED
	return instance

func acquire() -> Node:
	var instance: Node
	if _available.is_empty():
		instance = _create()
	else:
		instance = _available.pop_back()
	_in_use.append(instance)
	instance.process_mode = Node.PROCESS_MODE_INHERIT
	instance.set_process(true)
	return instance

func release(instance: Node) -> void:
	_in_use.erase(instance)
	_available.append(instance)
	instance.set_process(false)
	instance.process_mode = Node.PROCESS_MODE_DISABLED

func active_count() -> int:
	return _in_use.size()
`,
      explanation:
        'Пул заменяет постоянные `instantiate()` и `queue_free()`. Выигрыш не в скорости, а в стабильности: нет скачков памяти и пауз сборщика мусора — а именно они обычно и вызывают «микрофризы». Созданные заранее объекты отключены: `set_process(false)` и PROCESS_MODE_DISABLED, чтобы «спящие» объекты не тратили ресурсы.',
      versionNote:
        'PROCESS_MODE_DISABLED и PROCESS_MODE_INHERIT доступны в Godot 4.0+ (в Godot 3 был PROCESS_MODE_DISABLED в похожем смысле).',
    },
  ],
  tasks: [
    {
      id: 't10-1',
      title: 'Обесцвечивание при смерти',
      description:
        'Сделайте шейдер, который постепенно обесцвечивает врага, когда тот умирает. Параметр amount должен уходить от 1 к 0.',
      level: 2,
      hint: 'Используйте tween_method по той же схеме, что и во вспышке.',
    },
    {
      id: 't10-2',
      title: 'Пуль для врагов',
      description:
        'Переведите спавнер врагов на пул: 20 врагов создаются при старте и переиспользуются. Проверьте, что при 50 убийствах подряд память не растёт.',
      level: 3,
      hint: 'Считайте активные объекты и выводите их количество в HUD.',
    },
    {
      id: 't10-3',
      title: 'Профилирование своего проекта',
      description:
        'Запустите профилировщик, найдите самую тяжёлую функцию и оптимизируйте её. Запишите, сколько миллисекунд кадра вы выиграли.',
      level: 2,
      hint: 'Сравнивайте столбец Process до и после изменения.',
    },
    {
      id: 't10-4',
      title: 'Оптимизация по подсказке',
      description:
        'Найдите в своём коде вызовы get_node() внутри _process и вынесите их в @onready. Замерьте разницу в профилировщике.',
      level: 3,
      hint: 'Поиск: Ctrl+Shift+F по «get_node(».',
    },
    {
      id: 't10-5',
      title: 'Бюджет кадра',
      description:
        'Сформулируйте для своей игры бюджет: «в _process не больше 1 мс», «не более 200 узлов в сцене». Запишите цифры и проверяйте их профилировщиком.',
      level: 3,
      hint: 'Бюджет — это конкретное число, а не «должно быть быстро».',
    },
  ],
  project: {
    title: 'Эффекты и бюджет кадра',
    brief:
        'Добавьте в свою игру два шейдерных эффекта и наведите порядок в производительности: профилировщик, пул объектов, отключение лишних узлов.',
    requirements: [
      'Минимум два шейдера: эффект при уроне и эффект окружения (туман, вода, параллакс-ползунок).',
      'Параметры шейдера управляются из кода.',
      'Спавнер врагов переведён на пул объектов.',
      'Профилирование до и после: записано, сколько миллисекунд кадра выиграли.',
      'Записан бюджет кадра для вашей игры.',
    ],
    stretch: [
      'Сделайте шейдер, который принимает текстуру шума и искажает картинку.',
      'Добавьте простой «дешёвый» пост-эффект на весь экран через CanvasLayer с шейдером.',
      'Сравните FPS при 100 и 500 объектах на сцене — объясните, что именно стало узким местом.',
    ],
  },
  criteria: [
    {
      id: 'c10-1',
      text: 'Знаю структуру шейдера и умею написать fragment()',
      check:
        'Напишу шейдер, который меняет цвет пикселя, и объясню, что такое TEXTURE, UV и COLOR.',
    },
    {
      id: 'c10-2',
      text: 'Умею объявлять uniform и передавать значения из кода',
      check:
        'Объявлю uniform с подсказкой hint_range, задам значение через set_shader_parameter и увижу результат.',
    },
    {
      id: 'c10-3',
      text: 'Пользуюсь профилировщиком и умею читать его столбцы',
      check:
        'Запущу игру с профилировщиком и назову, что означают Frame Time, Physics, Process и Draw.',
    },
    {
      id: 'c10-4',
      text: 'Знаю пять главных причин тормозов и умею их устранять',
      check:
        'Найду в своём проекте хотя бы три из них и запишу, что изменилось после правки.',
    },
    {
      id: 'c10-5',
      text: 'Умею использовать пул объектов вместо постоянного создания',
      check:
        'Реализую acquire/release и покажу, что количество созданных объектов не растёт со временем.',
    },
    {
      id: 'c10-6',
      text: 'Оптимизирую после измерения, а не вместо него',
      check:
        'Приведу пример правки, сделанной по данным профилировщика, с цифрами до и после.',
    },
  ],
  resources: [
    {
      title: 'Шейдеры — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/shaders/index.html',
      kind: 'docs',
    },
    {
      title: 'Справочник языка шейдеров Godot',
      url: 'https://docs.godotengine.org/en/stable/tutorials/shaders/shader_reference/shading_language.html',
      kind: 'reference',
    },
    {
      title: 'Оптимизация 2D — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/performance/general_optimization.html',
      kind: 'docs',
    },
    {
      title: 'Профилирование — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/debug/the_profiler.html',
      kind: 'docs',
    },
  ],
  diagrams: ['shader-pipeline', 'perf-profiling'],
  versionNotes: [
    {
      version: '4.0',
      text: 'В шейдерах появились подсказки source_color и hint_range, а также global uniform — общие для всех материалов.',
    },
    {
      version: '4.0',
      text: 'Переработан профилировщик: добавлены отдельные счётчики для физики, отрисовки и скриптов.',
    },
  ],
}
