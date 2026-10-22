import type { Stage } from '../types'

/**
 * Этап 08 — Архитектура и рефакторинг.
 * Цель этапа: превратить работающий прототип в код, который можно расширять, не боясь его сломать.
 */
export const stage08: Stage = {
  id: '08',
  number: 8,
  slug: '08-arhitektura-i-refaktoring',
  title: 'Архитектура и рефакторинг',
  shortTitle: 'Архитектура',
  subtitle: 'Автолоады, разделение ответственности и безопасный рефакторинг без потери работоспособности',
  weeks: '17–18',
  hours: 14,
  goal: 'Научиться раскладывать большой проект на модули и переписывать его, не ломая.',
  outcome:
    'Проект разделён на модули с чёткими границами, глобальные сервисы вынесены в автолоады, а рефакторинг делается маленькими шагами с коммитом после каждого.',
  topics: [
    {
      id: 'autoload',
      title: 'Автолоады',
      term: 'Autoload',
      summary:
        'Автолоад — скрипт, который загружается один раз при старте проекта и доступен как глобальный синглтон по имени.',
      why:
        'Автолоады решают проблему «кто это вообще создал»: счётчик очков, менеджер сохранений, аудио, переходы между сценами. Без них эти вещи приходится искать по всей сцене.',
      details: [
        'Project → Project Settings → Autoload → Add Autoload: указываете путь к скрипту и имя.',
        'Доступ: по имени — `ScoreManager.add_points(10)`. Имя в snake_case становится именем узла.',
        'Автолоад — это обычный узел сextends Node. Он живёт всё время работы игры.',
        'Ссылаться на автолоады из сцен — нормально. Ссылаться на сцены из автолоадов — плохо.',
        'Автолоад не должен знать о конкретных сценах: только о сервисах.',
      ],
      diagramRef: 'autoload-architecture',
    },
    {
      id: 'responsibility',
      title: 'Разделение ответственности',
      term: 'Separation of Concerns',
      summary:
        'Один узел — одна задача. Данные отдельно, правила отдельно, интерфейс отдельно.',
      why:
        'Файл на 800 строк невозможно проверить. Файл на 80 строк — можно прочитать целиком и понять, что он делает, не запуская игру.',
      details: [
        'Правило: если в описании узла нужно слово «и» («двигает и анимирует и считает очки») — это три узла.',
        'Данные живут в Resource, поведение — в скриптах узлов, интерфейс — в Control-узлах.',
        'Обмен между модулями — через сигналы или через узлы-посредники.',
        'Не нужно абстракция ради абстракции: базовый класс имеет смысл, когда есть минимум два реальных наследника с общим поведением.',
        'Публичные методы узла — это его контракт. Внутренние детали начинаются с подчёркивания.',
      ],
      diagramRef: 'refactor-architecture',
    },
    {
      id: 'composition-vs-inheritance',
      title: 'Композиция вместо наследования',
      term: 'Composition over Inheritance',
      summary:
        'Вместо «враг наследуется от игрока» — «в игре есть компонент здоровья, который можно присоединить к любому узлу».',
      why:
        'Наследование создаёт жёсткую иерархию: изменив базовый класс, вы ломаете всех потомков. Композиция позволяет переиспользовать поведение как «деталь».',
      details: [
        'Компонент — узел с одной функцией, который добавляется в другой узел как ребёнок.',
        'Пример: узел HealthComponent с сигналом health_changed и методом take_damage().',
        'Игрок, враг и сундук получают здоровье одинаково — но это три разных узла с одним поведением.',
        'Если поведение нужно переопределить — сигнал или полиморфизм через параметры, а не через глубокую иерархию.',
        'Побочный плюс: компонент можно вытащить и переиспользовать в другом проекте.',
      ],
      diagramRef: 'refactor-architecture',
    },
    {
      id: 'refactoring',
      title: 'Безопасный рефакторинг',
      term: 'Refactoring',
      summary:
        'Рефакторинг меняет структуру кода, не меняя его поведение. Безопасный рефакторинг — маленькими шагами с проверкой после каждого.',
      why:
        'Попытка переписать половину проекта за вечер заканчивается тем, что проект перестаёт запускаться и откатываться приходится коммитами.',
      details: [
        'Шаг 1 — коммит (точка отката). Шаг 2 — маленькое изменение. Шаг 3 — запуск и проверка. Шаг 4 — коммит.',
        'Переименование: сначала переименуйте переменную во всех местах (IDE делает это за один раз), потом меняйте смысл.',
        'Выделение функции: сначала скопируйте код в новую функцию и убедитесь, что поведение не изменилось, потом замените старое место вызовом.',
        'Не смешивайте рефакторинг и новую функциональность в одном коммите.',
        'Тесты на Godot пишутся как обычные сцены со скриптом (встроенного тест-раннера в Godot нет — используют GUT или gdUnit4).',
      ],
    },
    {
      id: 'groups-and-lookup',
      title: 'Поиск узлов: группы, методы, интерфейсы',
      term: 'Group',
      summary:
        'Группа — метка на узле. Поиск по группе: get_tree().get_nodes_in_group("enemies").',
      why:
        'Поиск по жёстким путям ($Level/Enemies/Enemy3) ломается при любом перемещении узла. Группа переживает перестановки.',
      details: [
        'Группа задаётся в Inspector → Node → Groups или через add_to_group() в _ready().',
        'get_nodes_in_group() возвращает массив — с ним удобно работать циклом.',
        'Обратный поиск: get_tree().get_first_node_in_group("player").',
        'Фильтрация по типу: узлы из группы проверяются оператором node is Node2D, а не приведением типа.',
        'Не злоупотребляйте: группа — это «все враги», а не «всё в дереве».',
      ],
      diagramRef: 'scene-tree',
    },
    {
      id: 'signals-architecture',
      title: 'Слои и направление зависимостей',
      term: 'Layering',
      summary:
        'Хорошая архитектура: нижние слои (данные, логика) ничего не знают о верхних (интерфейс). Верхние могут знать о нижних.',
      why:
        'Если интерфейс знает о логике, а логика знает об интерфейсе — всё связано. Тест на архитектуру простой: может ли «движок игры» работать без единого Control-узла?',
      details: [
        'Слой данных: Resources, модели инвентаря, сохранения.',
        'Слой логики: узлы игровых сущностей, автолоады-сервисы.',
        'Слой представления: сцены, Control-узлы, HUD.',
        'Правило: представление читает логику и командует ей; логика никогда не дёргает представление напрямую.',
        'Автолоады-сервисы — «перекрёсток» между слоями: им можно пользоваться обоим.',
      ],
      diagramRef: 'autoload-architecture',
    },
  ],
  steps: [
    {
      id: 's8-1',
      title: 'Найти «жирный» скрипт',
      where: 'Ваш проект с этапов 03–07',
      action:
        'Откройте самый большой скрипт проекта и посчитайте, сколько в нём разных задач. Обычно это: движение, анимация, урон, звук, счёт.',
      result: 'Список из 4–6 задач в одном файле.',
      note: 'Это и есть точка рефакторинга. Не начинайте с красивого кода — начните с самого проблемного файла.',
      diagramRef: 'refactor-architecture',
    },
    {
      id: 's8-2',
      title: 'Сделать коммит перед рефакторингом',
      where: 'Терминал',
      action: 'git add . && git commit -m "До рефакторинга: рабочее состояние".',
      result: 'Есть точка отката, к которой можно вернуться в любой момент.',
      note: 'Правило: рефакторинг без точки отката — это не рефакторинг, а ставка.',
    },
    {
      id: 's8-3',
      title: 'Вынести счёт в автолоад',
      where: 'Project → Project Settings → Autoload',
      action:
        'Создайте скрипт score_manager.gd с единственной обязанностью: хранить очки и сообщать об изменении. Зарегистрируйте его как автолоад ScoreManager.',
      result: 'Счёт живёт в одном месте, HUD читает его через сигнал.',
      note: 'Автолоад живёт всё время работы игры и НЕ сбрасывается при смене сцены — это и есть его смысл. Если счётчик нужно сбросить — вызывайте reset() явно.',
      diagramRef: 'autoload-architecture',
    },
    {
      id: 's8-4',
      title: 'Сделать компонент здоровья',
      where: 'Новый узел health_component.gd',
      action:
        'Создайте узел HealthComponent с полем health и сигналом health_changed. Добавьте его ребёнком к игроку и врагу.',
      result: 'У игрока и врага одинаковое поведение здоровья, но код один.',
      note: 'После этого удалите дублирующий код здоровья из скриптов игрока и врага и убедитесь, что игра работает.',
      diagramRef: 'refactor-architecture',
    },
    {
      id: 's8-5',
      title: 'Заменить жёсткие пути на группы',
      where: 'Поиск по проекту',
      action:
        'Найдите все обращения вида $Level/Enemies/Enemy3 и замените их на get_tree().get_nodes_in_group("enemies").',
      result: 'Код переживает перестановку узлов в сцене.',
      note: 'Сначала добавьте узлы в группу, потом заменяйте обращения — иначе игра временно перестанет видеть врагов. Если берёте пример `enemy_manager.gd`, создайте в сцене узел `SpawnPoints` (Node2D): его дети — точки спавна, а рядом с ними — шаблон врага `Enemy`. Без этого узла менеджер просто ничего не spawn-ит (и не падает).',
    },
    {
      id: 's8-6',
      title: 'Проверить слои',
      where: 'Код проекта',
      action:
        'Посмотрите, ссылается ли какой-нибудь игровой узел на Label или Button. Если да — это нарушение: перенесите связь на сигнал.',
      result: 'Игровая логика не знает про интерфейс.',
      diagramRef: 'autoload-architecture',
    },
    {
      id: 's8-7',
      title: 'Откатить неудачный рефакторинг',
      where: 'Терминал',
      action:
        'Сделайте осмысленную ломку в коде, убедитесь, что игра сломалась, и откатитесь через git checkout -- . или git revert.',
      result: 'Вы лично убедились, что точка отката работает.',
      note: 'Лучше один раз откатить специально, чем однажды потерять три дня работы.',
    },
  ],
  code: [
    {
      id: 'autoload-score',
      title: 'Автолоад-сервис счёта',
      file: 'res://autoload/score_manager.gd',
      language: 'gdscript',
      code: `extends Node

signal score_changed(value: int)
signal combo_changed(value: int)

var score: int = 0:
	set(value):
		if value == score:
			return
		score = value
		score_changed.emit(score)

var combo: int = 0:
	set(value):
		combo = value
		combo_changed.emit(combo)

func add_points(amount: int) -> void:
	if amount < 0:
		push_warning("Очки не могут быть уменьшены напрямую")
		return
	score += amount

func reset() -> void:
	score = 0
	combo = 0
`,
      explanation:
        'Свойства с сеттерами дают «единую точку изменения»: любое присваивание `score` проходит через проверку и вызывает сигнал. Обратите внимание на проверку `if value == score: return` — она избавляет от лишних перерисовок интерфейса. Сервис ничего не знает ни о сценах, ни об интерфейсе: он только хранит и сообщает.',
      versionNote:
        'Сеттеры свойств в Godot 4.0+ пишутся как `var x: int = 0:` + блок `set(value):`.',
    },
    {
      id: 'health-component',
      title: 'Компонент здоровья',
      file: 'res://components/health_component.gd',
      language: 'gdscript',
      code: `class_name HealthComponent
extends Node

signal health_changed(current: int, maximum: int)
signal died
signal damaged(amount: int)

@export var max_health: int = 100
@export var invulnerable: bool = false

var current: int = 100:
	set(value):
		current = clampi(value, 0, max_health)
		health_changed.emit(current, max_health)

var alive: bool = true

func _ready() -> void:
	current = max_health

func take_damage(amount: int) -> void:
	if not alive or invulnerable or amount <= 0:
		return
	current -= amount
	damaged.emit(amount)
	if current == 0:
		alive = false
		died.emit()

func heal(amount: int) -> void:
	if not alive or amount <= 0:
		return
	current += amount

func reset() -> void:
	alive = true
	current = max_health
`,
      explanation:
        'Компонент — узел с одной задачей, который добавляется как ребёнок к любому объекту. `clampi` держит значение в допустимых границах, поэтому «лечение выше максимума» и «урон ниже нуля» невозможны по определению. Сигнал `died` не имеет аргументов — подписчику не нужно знать никаких деталей.',
      versionNote:
        'clampi и clampf доступны с Godot 4.0.',
    },
    {
      id: 'game-state',
      title: 'Игровое состояние как объект',
      file: 'res://autoload/game_state.gd',
      language: 'gdscript',
      code: `extends Node

signal level_started(level_id: String)
signal level_finished(level_id: String, success: bool)

var current_level: String = ""
var is_playing: bool = false
var elapsed_time: float = 0.0

func start_level(level_id: String) -> void:
	current_level = level_id
	is_playing = true
	elapsed_time = 0.0
	level_started.emit(level_id)

func finish_level(success: bool) -> void:
	if not is_playing:
		return
	is_playing = false
	level_finished.emit(current_level, success)

func _process(delta: float) -> void:
	if is_playing:
		elapsed_time += delta
`,
      explanation:
        'Сервис, который знает про состояние игры, но не про конкретные сцены: он не знает, как выглядит уровень, — только его идентификатор. Отсюда важное правило: переключение сцен делает код уровня, а не сервис. Сервис сообщает «уровень начался» — сцена на это реагирует. Так сервис остаётся пригодным, когда вы добавите второй тип уровня.',
      versionNote:
        'Строка current_level: String = "" — типизированная строка, а не Variant.',
    },
    {
      id: 'group-lookup',
      title: 'Работа с группами вместо жёстких путей',
      file: 'res://enemy_manager.gd',
      language: 'gdscript',
      code: `extends Node2D

const ENEMY_GROUP := "enemies"
const MAX_ALIVE := 8

var _spawn_timer := 0.0

func _ready() -> void:
	for child in get_children():
		if child is Node2D:
			(child as Node2D).add_to_group(ENEMY_GROUP)

func _process(delta: float) -> void:
	_spawn_timer -= delta
	if _spawn_timer <= 0.0:
		_spawn_timer = 2.0
		_try_spawn()

func alive_enemies() -> Array[Node2D]:
	var result: Array[Node2D] = []
	for node in get_tree().get_nodes_in_group(ENEMY_GROUP):
		if node is Node2D:
			result.append(node as Node2D)
	return result

func _try_spawn() -> void:
	if alive_enemies().size() >= MAX_ALIVE:
		return
	# Без узла SpawnPoints спавнить некуда — выходим, а не падаем.
	var spawn_root := get_node_or_null("SpawnPoints") as Node2D
	if spawn_root == null or spawn_root.get_child_count() == 0:
		return
	# Шаблон врага лежит рядом с точками спавна: SpawnPoints/Enemy.
	var template := spawn_root.get_node_or_null("Enemy") as Node2D
	if template == null:
		return
	var spawn_point := spawn_root.get_child(randi() % spawn_root.get_child_count()) as Node2D
	var enemy := template.duplicate() as Node2D
	enemy.global_position = spawn_point.global_position
	enemy.add_to_group(ENEMY_GROUP)
	add_child(enemy)
`,
      explanation:
        'Группа — это «все враги», где бы они ни находились в дереве. `alive_enemies()` фильтрует не только по группе, но и по типу: в группу теоретически может попасть что угодно. Проверка `node is Node2D` — это фильтрация вместо опасного каста: она безопасна и читается сразу. Обратите внимание на `get_node_or_null`: менеджер не падает, если в сцене нет узла `SpawnPoints`. Ожидаемая структура: `SpawnPoints` (Node2D) с дочерними точками спавна и шаблоном врага `Enemy` рядом с ними — тогда `duplicate()` создаёт копию врага и ставит её в точку спавна.',
      versionNote:
        'В Godot 4 теги в именах узлов (Node.tags) удалены — остались обычные группы и %-уникальные имена.',
    },
  ],
  tasks: [
    {
      id: 't8-1',
      title: 'Два автолоада',
      description:
        'Сделайте автолоады ScoreManager и AudioManager. Убедитесь, что оба переживают смену сцены и что счёт сбрасывается явно по вызову reset().',
      level: 1,
      hint: 'Автолоад — обычный узел; его методы доступны по имени из любого места.',
    },
    {
      id: 't8-2',
      title: 'Разбить на компоненты',
      description:
        'Вынесите из игрока логику здоровья в HealthComponent, а логику урона — в DamageComponent. Убедитесь, что поведение не изменилось: сравните с поведением до коммита.',
      level: 3,
      hint: 'Сравнивайте поведение, а не код: пройдите уровень до и после.',
    },
    {
      id: 't8-3',
      title: 'Убрать жёсткие пути',
      description:
        'Найдите все $Node/SubNode/DeepNode в проекте и замените минимум пять на группы или %-уникальные имена.',
      level: 2,
      hint: 'Ищите в редакторе: Ctrl+Shift+F (Find in Files) по символу $.',
    },
    {
      id: 't8-4',
      title: 'Рефакторинг с точками отката',
      description:
        'Сделайте три маленьких рефакторинга подряд: переименование переменной, выделение функции, замена магического числа на константу. После каждого — запуск и коммит.',
      level: 3,
      hint: 'Если после шага игра не работает — откатывайтесь и разбирайтесь, а не чините дальше.',
    },
    {
      id: 't8-5',
      title: 'Тест без тест-раннера',
      description:
        'Сделайте сцену-тест: скрипт, который создаёт HealthComponent, наносит урон и проверяет результат через assert(). Запустите сцену через F6.',
      level: 3,
      hint: 'assert() в Godot 4 останавливает выполнение при ошибке — это готовый минимальный тест.',
    },
  ],
  project: {
    title: 'Рефакторинг собственной игры',
    brief:
      'Возьмите игру, собранную на этапах 03–07, и разложите её по правилам: автолоады-сервисы, компоненты, сигналы вместо прямых ссылок, группы вместо путей.',
    requirements: [
      'Не менее двух автолоадов: счёт и сохранения (или звук).',
      'Здоровье вынесено в компонент, используемый игроком и врагом.',
      'Ни одной прямой ссылки игровой логики на узлы интерфейса.',
      'Все обращения к врагам — через группу, а не через путь $Level/Enemies/Enemy3.',
      'Каждый шаг рефакторинга — отдельный коммит; игра работает после каждого.',
    ],
    stretch: [
      'Сделайте модуль сцен: переход между уровнями через единый сервис.',
      'Напишите 5 assert-тестов на ключевые правила (урон, инвентарь, сохранение).',
      'Опишите правила проекта в файле CONTRIBUTING.md: как называть узлы, где что лежит.',
    ],
  },
  criteria: [
    {
      id: 'c8-1',
      text: 'Знаю, что такое автолоад и когда его применять',
      check:
        'Объясняю, какие сервисы выносят в автолоад, и показываю, что автолоад переживает смену сцены.',
    },
    {
      id: 'c8-2',
      text: 'Могу разделить узел на компоненты',
      check:
        'Беру свой игровой узел и делю его на 2–3 компонента, после чего игра работает как раньше.',
    },
    {
      id: 'c8-3',
      text: 'Понимаю правило зависимостей между слоями',
      check:
        'Объясняю, почему логика не должна знать про интерфейс, и привожу пример нарушения из своего кода (до или после исправления).',
    },
    {
      id: 'c8-4',
      text: 'Умею искать узлы по группе и знаю, когда это злоупотребление',
      check: 'Заменяю $Level/Enemies/Enemy3 на поиск по группе и объясняю, когда жёсткий путь всё же лучше.',
    },
    {
      id: 'c8-5',
      text: 'Рефакторю маленькими шагами с коммитами',
      check:
        'Показываю историю коммитов, где каждый коммит — одно изменение, и игра работает на каждом из них.',
    },
    {
      id: 'c8-6',
      text: 'Умею откатить изменения и знаю, зачем нужна точка отката',
      check: 'Откатываю неудачное изменение через git и комментирую, что предотвратило потерю работы.',
    },
  ],
  resources: [
    {
      title: 'Автолоады (singletons) — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/singletons_autoload.html',
      kind: 'docs',
    },
    {
      title: 'Система групп — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/groups.html',
      kind: 'docs',
    },
    {
      title: 'Руководство по стилю кода Godot',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html',
      kind: 'docs',
      note: 'Прочитайте до рефакторинга — там описаны именование, порядок функций и отступы.',
    },
    {
      title: 'GUT — фреймворк тестов для Godot',
      url: 'https://github.com/bitwes/Gut',
      kind: 'tool',
      note: 'Сторонний инструмент, в Godot встроенного тест-раннера нет.',
    },
  ],
  diagrams: ['autoload-architecture', 'refactor-architecture', 'scene-tree'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Автолоады в Godot 4 — это обычные узлы с доступом по имени; в Godot 3 был отдельный тип «Singleton» со своими правилами.',
    },
    {
      version: '4.0',
      text: 'Свойства с сеттерами (set(value)) — новая возможность 4.0, на ней построены сервисы с гарантированной сигнализацией об изменениях.',
    },
  ],
}
