import type { Stage } from '../types'

/**
 * Этап 02 — Сцены, узлы, сигналы, ресурсы.
 * Цель этапа: понять три механизма, на которых держится весь Godot:
 * композиция сцен, обмен сообщениями через сигналы и данные через ресурсы.
 */
export const stage02: Stage = {
  id: '02',
  number: 2,
  slug: '02-sceny-uzly-signaly-resursy',
  title: 'Сцены, узлы, сигналы, ресурсы',
  shortTitle: 'Сцены и сигналы',
  subtitle: 'Три кита, на которых стоит Godot: композиция, обмен сообщениями и данные',
  weeks: '5–6',
  hours: 14,
  goal: 'Научиться собирать игру из сцен, общаться узлам через сигналы и хранить данные в ресурсах.',
  outcome:
    'У вас есть сцена, которая спавнит врагов из отдельной сцены, общается с ними через сигналы и берёт параметры врага из Resource.',
  topics: [
    {
      id: 'composition',
      title: 'Композиция: одна сцена внутри другой',
      term: 'PackedScene',
      summary:
        'Сцена — это ресурс. Её можно загрузить, создать экземпляр (instantiate) и добавить в дерево через add_child().',
      why:
        'Разбивка игры на маленькие сцены — главный инструмент против «проект на 40 тысяч строк». Каждая сцена — отдельный кусок, который можно протестировать и переиспользовать.',
      details: [
        '`preload("res://enemy.tscn")` — сцена известна на этапе компиляции, быстрее и безопаснее.',
        '`load("res://enemy.tscn")` — сцена загружается в рантайме; путь может быть в переменной.',
        '`var enemy := ENEMY_SCENE.instantiate()` — создаёт узел из сцены.',
        '`add_child(enemy)` — вводит узел в дерево; только после этого начнут работать _ready() и обработка ввода.',
        'Порядок: instantiate → настроить свойства → add_child. Если задать свойства после add_child, узел уже прошёл _ready() — и логика в _ready() увидит значения по умолчанию, а не ваши.',
      ],
      diagramRef: 'scene-instancing',
    },
    {
      id: 'signals',
      title: 'Сигналы: как узлы разговаривают',
      term: 'Signal',
      summary:
        'Сигнал — сообщение без прямой ссылки на отправителя. Отправитель вызывает emit, получатель подписывается через connect.',
      why:
        'Прямые ссылки (node_a.do_something(node_b)) создают жёсткую связь: изменили одну сцену — сломал три. Сигналы развязывают узлы: враг не знает, кто его убил, он просто сообщает «я умер».',
      details: [
        'Свой сигнал: `signal health_changed(new_value: int)`.',
        'Отправка: `health_changed.emit(75)`.',
        'Подписка: `player.health_changed.connect(_on_health_changed)`.',
        'Отключение: `player.health_changed.disconnect(_on_health_changed)`.',
        'Одноразовая подписка: `connect(handler, CONNECT_ONE_SHOT)`.',
        'Передача аргумента: `button.pressed.connect(_on_pressed.bind(3))` — bind добавляет аргументы к аргументам сигнала.',
        'Встроенные сигналы Godot: `pressed`, `body_entered`, `area_entered`, `tree_exited`, `animation_finished`, `timeout`.',
      ],
      diagramRef: 'signals',
    },
    {
      id: 'await',
      title: 'Ожидание сигнала',
      term: 'await',
      summary:
        'Ключевое слово await приостанавливает функцию до момента, когда сигнал сработает, и возвращает его аргументы.',
      why:
        'Без await «пока не произойдёт» приходится писать колбэки и хранить состояние в переменных. await превращает асинхронность в последовательный код — читается как «сначала, потом».',
      details: [
        '`await timer.timeout` — ждёт, пока таймер истечёт.',
        '`await get_tree().create_timer(1.5).timeout` — пауза на 1.5 секунды.',
        '`await body_entered` — ждёт входа в область.',
        'Функция с await становится корутиной: вызывающий код должен использовать await, если ждёт результат.',
        'Если сигнал не придёт — функция «зависнет» навсегда. Для важных действий добавляйте таймаут.',
      ],
    },
    {
      id: 'resources',
      title: 'Ресурсы: данные отдельно от поведения',
      term: 'Resource',
      summary:
        'Resource — контейнер данных, который можно сохранить в файл .tres и переиспользовать во многих экземплярах.',
      why:
        'Смешивать данные и поведение в одном скрипте — путь к копипасту. Ресурс отделяет «что это за предмет» от «что предмет делает»: один ItemData с описанием зелья работает и в инвентаре, и в магазине.',
      details: [
        'Создать ресурс: в панели FileSystem (внизу слева) нажмите правую кнопку мыши → New Resource, или Inherit Resource в диалоге нового скрипта.',
        'Сохранение: ResourceSaver.save(item, "user://items/sword.tres").',
        'Загрузка: `var item: ItemData = load("res://items/sword.tres")`.',
        'Ссылка в инспекторе: `@export var item: ItemData`.',
        'Ресурс — общий объект: если два узла ссылаются на один Resource, изменение видно обоим. Для уникальных данных используйте `resource_local_to_scene = true` или `duplicate()`.',
      ],
      diagramRef: 'resource-vs-node',
    },
    {
      id: 'node-paths',
      title: 'Пути к узлам и группы',
      term: 'NodePath / Group',
      summary:
        'К узлу обращаются по пути $Player/Sprite2D, по уникальному имени %HealthBar или через группу.',
      why:
        'Жёсткий путь ломается при переименовании узла. Уникальное имя и группа переживают перестановку узлов и экономят время на отладке «Invalid get index».',
      details: [
        '`$Sprite2D` — прямой ребёнок.',
        '`$"Background/Sky/Clouds"` — вложенный путь; имя в кавычках, если есть пробелы.',
        '`%HealthBar` — узел с включённым Access as Unique Name (иконка в Inspector).',
        '`get_node("..")` — родитель; `get_node("../Sibling")` — сосед.',
        '`get_tree().get_nodes_in_group("enemies")` — все узлы группы.',
        'Группа задаётся в Inspector → вкладка Node → Groups, или кодом `add_to_group("enemies")`.',
      ],
      diagramRef: 'scene-tree',
    },
    {
      id: 'lifecycle',
      title: 'Жизненный цикл узла',
      term: 'Lifecycle',
      summary:
        'Узел проходит стадии: _enter_tree → _ready → _process/_physics_process → _exit_tree → _notification(NOTIFICATION_PREDELETE).',
      why:
        'Многие «зависания» и «не работает» — это неправильный момент вызова. Понять, когда узел в дереве, а когда ещё нет, — половина отладки в Godot.',
      details: [
        '_enter_tree — узел вошёл в дерево, родитель найден, но дети ещё не готовы.',
        '_ready — ребёнок готов раньше родителя: когда вызывается _ready родителя, все его дети уже готовы, поэтому можно брать ссылки на $Sibling.',
        '_process(delta) — каждый кадр. _physics_process(delta) — с фиксированной частотой (по умолчанию 60 Гц).',
        '_exit_tree — узел выходит из дерева. Здесь отключают сигналы, которые вели наружу.',
        'Порядок выхода обратный: дети выходят раньше родителя.',
      ],
      diagramRef: 'node-lifecycle',
    },
  ],
  steps: [
    {
      id: 's2-1',
      title: 'Создать сцену-шаблон',
      where: 'Scene → New Scene → 2D Scene',
      action:
        'Создайте сцену enemy.tscn: корень CharacterBody2D с именем Enemy, у корня — CollisionShape2D (форма самого врага), дочерний Sprite2D и Area2D с CollisionShape2D (зона вокруг него). Без CollisionShape2D у корня тело не участвует в столкновениях. Добавьте узлы через «+» (Add Child Node) в панели Scene. Папку scenes сначала создайте: правой кнопкой по res:// в панели FileSystem → New Folder → scenes. Сохраните сцену в res://scenes/enemy.tscn.',
      result: 'Файл enemy.tscn существует, в нём три узла.',
      note: 'Имя корневого узла совпадает с именем файла — так удобнее искать сцену в FileSystem.',
      diagramRef: 'scene-instancing',
    },
    {
      id: 's2-2',
      title: 'Спавнить сцену из кода',
      where: 'Скрипт main.gd',
      action:
        'Объявите `const ENEMY_SCENE := preload("res://scenes/enemy.tscn")`. В функции `_spawn_enemy(position: Vector2)` создайте экземпляр, добавьте его в дерево и только потом задайте позицию: `add_child(enemy)` → `enemy.global_position = position`. Позицию задают после add_child: пока узел не в дереве, его global_position не учитывает положение родителя. И вызовите функцию — например, из `_ready()`: `_spawn_enemy(Vector2(100, 100))`, иначе враг просто не появится.',
      result: 'Враг появился в сцене сразу при запуске (в панели Scene виден новый узел Enemy).',
      note:
        'Строка с `preload` — на уровне класса, а не внутри функции: так сцена загружается один раз при старте проекта, а не при каждом спавне.',
      diagramRef: 'scene-instancing',
    },
    {
      id: 's2-3',
      title: 'Связать узлы сигналом',
      where: 'Inspector → вкладка Node → Signals',
      action:
        'Сначала напишите в скрипте корневого узла пустой обработчик: `func _on_enemy_exited() -> void: print("Враг ушёл")`. Затем выделите узел Enemy, откройте вкладку Node → Signals (если раздел свёрнут — нажмите «…» справа), найдите сигнал tree_exited и нажмите «Connect…». Выберите корневой узел и метод-обработчик.',
      result: 'В коде появилась строка подключения, а в Godot — визуальная связь между узлами.',
      note:
        'Связи, созданные через редактор, сохраняются в сцене. Это надёжнее, чем подписка кодом: связь видна и не теряется при копировании сцены.',
      diagramRef: 'signals',
    },
    {
      id: 's2-4',
      title: 'Объявить свой сигнал',
      where: 'Редактор скрипта player.gd',
      action:
        'Добавьте в начало скрипта `signal died(reason: String)`. В месте, где герой погибает, вызовите `died.emit("fell")`. Подпишитесь: `player.died.connect(_on_player_died)`.',
      result: 'В момент смерти вызывается ваш обработчик с причиной.',
      diagramRef: 'signals',
    },
    {
      id: 's2-5',
      title: 'Создать свой ресурс',
      where: 'Панель FileSystem (внизу слева) → правая кнопка → New Resource',
      action:
        'Сделайте это в два шага. 1) Скрипт: в панели FileSystem правой кнопкой → New Script… → в поле «Inherits:» выберите Resource → имя item_data.gd → Create. Объявите в нём поля: item_name, price, description. 2) Ресурс: в FileSystem правой кнопкой → New Resource… → тип Resource → имя potion.tres, папка data (её тоже нужно создать: New Folder → data). В Inspector ресурса перетащите item_data.gd в свойство Script и сохраните (Ctrl+S).',
      result: 'Файл potion.tres создан и открывается как настройки предмета.',
      note:
        'Скрипт ресурса — обычный скрипт, просто с extends Resource. В нём нет _ready(): ресурс не узел и не входит в дерево.',
      diagramRef: 'resource-vs-node',
    },
    {
      id: 's2-6',
      title: 'Отдать ресурс узлу',
      where: 'Inspector → поле Resource',
      action:
        'В узле, который использует предмет, добавьте `@export var item: ItemData`. Перетащите potion.tres в это поле в Inspector.',
      result: 'Узел получил ссылку на ресурс; поле видно в инспекторе и редактируется без кода.',
      note: 'Так настраивают игровые объекты: код один, а предметы разные.',
      diagramRef: 'resource-vs-node',
    },
    {
      id: 's2-7',
      title: 'Проверить порядок вызовов',
      where: 'Панель Output',
      action:
        'Добавьте print() в _enter_tree(), _ready() и _exit_tree() у двух узлов — родителя и ребёнка. Запустите и посмотрите порядок в Output.',
      result: 'Видно: `_enter_tree` — сначала родитель, потом ребёнок; `_ready` — наоборот, сначала ребёнок, потом родитель; при выходе — сначала ребёнок, потом родитель.',
      diagramRef: 'node-lifecycle',
    },
  ],
  code: [
    {
      id: 'signals-basic',
      title: 'Сигнал: объявление, отправка, подписка',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `class_name SignalPlayer
extends CharacterBody2D

signal health_changed(new_value: int)
signal died(reason: String)

const MAX_HEALTH := 100

@export var health: int = MAX_HEALTH

func _ready() -> void:
	# Подписка на свой же сигнал — так игрок реагирует на собственные события.
	health_changed.connect(_on_health_changed)

func take_damage(amount: int) -> void:
	health = max(health - amount, 0)
	health_changed.emit(health)
	if health == 0:
		died.emit("damage")

func heal(amount: int) -> void:
	health = min(health + amount, MAX_HEALTH)
	health_changed.emit(health)

func _on_health_changed(new_value: int) -> void:
	print("Здоровье: ", new_value)
`,
      explanation:
        'Сигнал объявляется на уровне класса и не имеет тела — это «контракт», а не код. `emit` отправляет сообщение всем подписчикам. Важно: значение `health` меняется **до** `emit`, поэтому подписчик всегда видит актуальное состояние. Если отправлять до изменения — обработчик получит старое значение и решит, что ничего не произошло.',
      versionNote:
        'Типизированные сигналы (`signal died(reason: String)`) поддерживаются с Godot 4.0.',
    },
    {
      id: 'scene-instantiate',
      title: 'Спавн сцен и подписка на их сигналы',
      file: 'res://spawner.gd',
      language: 'gdscript',
      code: `class_name EnemySpawner
extends Node2D

const ENEMY_SCENE := preload("res://scenes/enemy.tscn")
const SPAWN_INTERVAL := 1.2

signal enemy_spawned(enemy: Node2D)

var _timer := 0.0
var _alive := 0

func _process(delta: float) -> void:
	_timer -= delta
	if _timer <= 0.0:
		_timer = SPAWN_INTERVAL
		_spawn()

func _ready() -> void:
	# Свой сигнал тоже нужно подписать — объявление и emit ничего не делают,
	# пока никто не подключился.
	enemy_spawned.connect(_on_enemy_spawned)

func _spawn() -> void:
	var enemy := ENEMY_SCENE.instantiate()
	# Подписка до добавления в дерево: сигнал может сработать уже в _ready врага.
	enemy.tree_exited.connect(_on_enemy_left)
	add_child(enemy)
	# Позицию задаём ПОСЛЕ add_child: пока узел не в дереве, он не знает
	# о родителе, и global_position превратится в position.
	enemy.global_position = global_position
	_alive += 1
	enemy_spawned.emit(enemy)

func _on_enemy_left() -> void:
	_alive = max(_alive - 1, 0)

func _on_enemy_spawned(enemy: Node2D) -> void:
	print("Враг на позиции: ", enemy.position)
`,
      explanation:
        'Порядок в `_spawn` важнее, чем кажется. Сначала создаём узел, потом подписываемся, и только потом добавляем в дерево — так мы точно не пропустим сигнал. После `add_child` у врага вызовется `_ready()`. Позицию задаём **после** `add_child`: пока узел не в дереве, `global_position` ещё не учитывает положение родителя, и враг появился бы в удвоенной точке. Обратите внимание на `tree_exited`: он срабатывает, когда узел покидает дерево, — это надёжный способ узнать, что враг ушёл, независимо от того, кто его удалил. Но сигнал сработает, только если врага кто-то удалит: например, по нажатию «shoot» вызовите `enemy.queue_free()` — тогда `_alive` уменьшится.',
      versionNote:
        'Сигнал `tree_exited` существует в Godot 4.x. `tree_entered` — парный к нему.',
    },
    {
      id: 'custom-resource',
      title: 'Свой ресурс с настройками персонажа',
      file: 'res://data/stats_data.gd',
      language: 'gdscript',
      code: `class_name StatsData
extends Resource

@export var max_health: int = 100
@export var move_speed: float = 220.0
@export var accent_color: Color = Color.WHITE

func summary() -> String:
	return "HP %d, скорость %.0f" % [max_health, move_speed]

func is_alive(health: int) -> bool:
	return health > 0
`,
      explanation:
        'Ресурс — это «синью таблица»: данные отделены от поведения. Один и тот же StatsData можно повесить на игрока и на моба, изменив значения в инспекторе. Формат `%d` в GDScript — подстановка значений в строку, аналог printf. Строка не интерпретируется как код: это обычная сборка текста. Сам ресурс — данные; правило «жив ли персонаж» живёт в ресурсе только потому, что оно нужно в нескольких местах.',
      versionNote:
        'В Godot 4.0 появился оператор `%` для форматирования строк (в Godot 3 использовался `String.format`).',
    },
    {
      id: 'await-patterns',
      title: 'await: пауза и ожидание событий',
      file: 'res://pickup.gd',
      language: 'gdscript',
      code: `extends Area2D

@export var delay: float = 0.5

func _on_body_entered(body: Node2D) -> void:
	if not body.is_in_group("player"):
		return
	body_entered.disconnect(_on_body_entered)
	await get_tree().create_timer(delay).timeout
	queue_free()

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	print("Предмет ждёт игрока: игрок должен быть в группе «player»")
`,
      explanation:
        '`await` превращает обработчик события в «последовательность шагов». Пока таймер идёт, функция приостановлена, а движок продолжает работать. Важная деталь — отключение подписки `disconnect` перед ожиданием: иначе, если игрок быстро входит в область дважды, обработчик запустится дважды и таймер будет создан дважды. Проверка `is_in_group("player")` не сработает, пока игрок не добавлен в группу: в Inspector у узла игрока — вкладка Node → Groups → Add → «player». Без этого предмет просто молча не исчезнет, ошибок не будет. И у самого тела должен быть CollisionShape2D — без формы Area2D его не увидит.',
      versionNote:
        '`get_tree().create_timer(seconds).timeout` — стандартный способ паузы в Godot 4. `await get_tree().process_frame` ждёт один кадр.',
    },
  ],
  tasks: [
    {
      id: 't2-1',
      title: 'Сигнал с данными',
      description:
        'Создайте сигнал `item_picked(item_name: String, count: int)`. Отправляйте его из функции подбора, подпишитесь в другом узле и печатайте «Подобрано: X × Y».',
      level: 1,
      hint: 'Сигнал объявляется на уровне класса, до первой функции.',
    },
    {
      id: 't2-2',
      title: 'Фабрика сцен',
      description:
        'Сделайте функцию `spawn_at(scene: PackedScene, pos: Vector2) -> Node`, которая создаёт узел, ставит его в позицию и добавляет в дерево. Вызовите её для двух разных сцен.',
      level: 2,
      hint: 'Тип PackedScene в сигнатуре подсказывает, что передавать: готовую сцену, а не путь.',
    },
    {
      id: 't2-3',
      title: 'Словарь предметов на ресурсах',
      description:
        'Создайте три ресурса: зелье, меч, щит. Заведите в инвентаре словарь Dictionary[String, ItemData] и функцию `total_value() -> int`, считающую суммарную стоимость.',
      level: 2,
      hint: 'Словарь хранит ссылку на ресурс — суммируйте item.price.',
    },
    {
      id: 't2-4',
      title: 'Ловушка null',
      description:
        'В функции `_ready()` попробуйте обратиться к `$Player/Sprite2D.texture`, когда узла Player нет. Прочитайте ошибку. Потом сделайте проверку `if has_node("Player")` и исправьте код.',
      level: 3,
      hint: 'Ошибка «Invalid access to property or key \'…\' on a base object of type \'Nil\'» почти всегда означает: «объект ещё не создан в момент обращения».',
    },
    {
      id: 't2-5',
      title: 'Сравните ресурс и узел',
      description:
        'Создайте Resource и Node с одинаковыми полями. Измените поле в ресурсе, на который ссылаются два узла, и посмотрите, изменится ли оно у обоих. Объясните результат.',
      level: 3,
      hint: 'Ресурс — общий объект. Для уникальных данных есть resource_local_to_scene и duplicate().',
    },
  ],
  project: {
    title: 'Поле боя с волнами врагов',
    brief:
      'Сцена, где спавнер создаёт врагов из отдельной сцены, каждый враг живёт по своим правилам, а игрок получает очки за убийства. Связь — только через сигналы.',
    requirements: [
      'Отдельная сцена enemy.tscn со своим скриптом и полем здоровья.',
      'Спавнер создаёт врагов по таймеру и следит за их количеством.',
      'Враг сообщает о своей смерти сигналом — спавнер или игрок начисляет очки.',
      'Поле настраивается через @export: сколько врагов, с какой частотой, сколько очков за врага.',
    ],
    stretch: [
      'Сделайте волны: каждые 10 секунд врагов больше, а у них больше здоровья.',
      'Добавьте Resource с характеристиками типа врага (слабый/быстрый/толстый) и берите их из сцены через @export.',
      'Переведите связь на await: враг «падает» через полсекунды после смерти, а очки начисляются после падения.',
    ],
  },
  criteria: [
    {
      id: 'c2-1',
      text: 'Могу объяснить, чем сцена отличается от узла и от ресурса',
      check:
        'Называю три вопроса: «это поведение?», «это данные?» и «это набор узлов?» — и раскладываю знакомые узлы по этим категориям.',
    },
    {
      id: 'c2-2',
      text: 'Знаю правильный порядок: instantiate → настроить → add_child',
      check:
        'Объясняю, что произойдёт, если настроить узел после add_child, и почему подписку на сигнал делают до добавления в дерево.',
    },
    {
      id: 'c2-3',
      text: 'Умею объявить, отправить и принять сигнал — и знаю, когда отписаться',
      check:
        'Написал сигнал с аргументом, отправил его с emit, принял в другом узле и отключил подписку через disconnect.',
    },
    {
      id: 'c2-4',
      text: 'Различаю await и колбэк-подписку и знаю, когда что уместнее',
      check: 'Привожу пример задачи, где await читается лучше, и задачи, где колбэк лучше.',
    },
    {
      id: 'c2-5',
      text: 'Понимаю разницу между общим ресурсом и уникальными данными',
      check:
        'Объясняю, почему два узла, ссылающиеся на один Resource, видят одинаковые данные, и знаю, как это исправить.',
    },
    {
      id: 'c2-6',
      text: 'Знаю порядок вызовов _enter_tree, _ready и _exit_tree',
      check: 'Запускаю проект с print() в этих трёх функциях у родителя и ребёнка и записываю фактический порядок.',
    },
  ],
  resources: [
    {
      title: 'Using signals — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html',
      kind: 'docs',
    },
    {
      title: 'Scene composition — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/instancing.html',
      kind: 'docs',
    },
    {
      title: 'Справочник Resource',
      url: 'https://docs.godotengine.org/en/stable/classes/class_resource.html',
      kind: 'reference',
    },
    {
      title: 'Справочник Signal',
      url: 'https://docs.godotengine.org/en/stable/classes/class_signal.html',
      kind: 'reference',
    },
    {
      title: 'Using signals / await в GDScript',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#signals',
      kind: 'docs',
    },
  ],
  diagrams: ['signals', 'scene-instancing', 'resource-vs-node', 'node-lifecycle', 'scene-tree'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Сигналы можно типизировать: signal died(reason: String). В Godot 3 типы сигналов не указывались.',
    },
    {
      version: '4.0',
      text: 'Ресурсы получили resource_local_to_scene — удобный способ сделать ресурс уникальным для каждого экземпляра сцены.',
    },
  ],
}
