import type { Stage } from '../types'

/**
 * Этап 03 — 2D: движение и физика.
 * Цель этапа: герой ходит, прыгает, сталкивается с миром и не проходит сквозь стены.
 */
export const stage03: Stage = {
  id: '03',
  number: 3,
  slug: '03-2d-dvizhenie-i-fizika',
  title: '2D: движение и физика',
  shortTitle: 'Движение и физика',
  subtitle: 'CharacterBody2D, коллизии, слои, гравитация — герой, который чувствует мир',
  weeks: '7–8',
  hours: 14,
  goal: 'Научиться двигать персонажа, настраивать коллизии и понимать, кто с кем сталкивается.',
  outcome:
    'Герой ходит и прыгает по платформе, не проходит сквозь стены, а враг умеет замечать край платформы.',
  topics: [
    {
      id: 'body-types',
      title: 'Какие бывают физические тела',
      term: 'Physics Body',
      summary:
        'CharacterBody2D — управляемый кодом, StaticBody2D — неподвижный, RigidBody2D — на физике, Area2D — зона без физического отклика.',
      why:
        'Выбор типа тела определяет всю дальнейшую логику. Ошибка «поставил RigidBody2D туда, где нужен CharacterBody2D» даёт персонажа, который отскакивает от стен и проходит сквозь пол.',
      details: [
        'CharacterBody2D: двигаете сами через velocity и move_and_slide(). Подходит для игроков.',
        'StaticBody2D: неподвижные стены, полы, платформы. Для них не нужна ни одна строка кода.',
        'RigidBody2D: полностью на физике — мячи, бочки, обломки.',
        'Area2D: не останавливает, а сообщает: кто-то зашёл, кто-то вышел. Подходит для урона и подборов.',
        'CollisionShape2D обязателен для любого из них: это «форма» тела.',
      ],
      diagramRef: 'collision-layers',
    },
    {
      id: 'move-and-slide',
      title: 'velocity и move_and_slide()',
      term: 'move_and_slide()',
      summary:
        'Метод двигает тело по вектору velocity, учитывая столкновения и останавливает движение вдоль скользящих поверхностей.',
      why:
        'Прямое изменение position игнорирует физику: персонаж проходит сквозь стены. move_and_slide() решает это за вас — и заодно даёт информацию о том, куда вы врезались.',
      details: [
        'velocity — это скорость в пикселях в секунду.',
        'move_and_slide() использует velocity, поэтому сначала задайте velocity, потом вызывайте метод.',
        '`is_on_floor()` — стоим ли мы на земле. `is_on_wall()` — врезались ли в стену.',
        '`get_slide_collision_count()` и `get_slide_collision(i)` — с чем именно столкнулись.',
        'Физика 2D считается с фиксированной частотой (по умолчанию 60 Гц), а отрисовка — каждый кадр. Движение в _physics_process, анимация — в _process.',
      ],
      diagramRef: 'state-machine',
    },
    {
      id: 'delta',
      title: 'delta: почему скорость не зависит от FPS',
      term: 'delta',
      summary:
        'delta — время в секундах с прошлого кадра. Умножение скорости на delta делает движение одинаковым при 30 и 144 FPS.',
      why:
        'Без delta персонаж на быстром мониторе летает, на медленном — еле ползёт. Это один из самых заметных багов в самодельных играх и одна строка в коде.',
      details: [
        'delta = 0.016 при 60 FPS, 0.008 при 120 FPS.',
        'Правило: расстояние = скорость × delta.',
        'В _process(delta) delta всегда положителен. В _physics_process(delta) — фиксированный (1/60 по умолчанию).',
        'Для движения персонажа используйте _physics_process: он вызывается с постоянной частотой независимо от FPS.',
        'Никогда не делайте «ручной» счётчик времени в _process для физики.',
      ],
    },
    {
      id: 'gravity-jump',
      title: 'Гравитация и прыжок',
      term: 'gravity',
      summary:
        'Гравитация — это ускорение вниз, накапливаемое каждый кадр. Прыжок — кратковременная отрицательная вертикальная скорость.',
      why:
        'Понимание гравитации как «скорость накапливается» объясняет, почему персонаж не может мгновенно остановиться в воздухе и почему двойной прыжок возможен, а мгновенный — нет.',
      details: [
        'Каждый кадр: velocity.y += gravity * delta.',
        'Прыжок: velocity.y = jump_velocity (отрицательное значение — вверх).',
        'Отпускание кнопки поднимает прыжок: обрезайте velocity.y, если кнопка уже не нажата.',
        'У CharacterBody2D есть свойство up_direction — направление «вверх» (по умолчанию (0, -1)).',
        'Для платформ, проходимых снизу, используйте one_way_collision у Area2D или отдельный слой.',
      ],
      diagramRef: 'state-machine',
    },
    {
      id: 'collision-layers',
      title: 'Слои и маски коллизий',
      term: 'collision_layer / collision_mask',
      summary:
        'У каждого тела есть collision_layer (на каком слое я нахожусь) и collision_mask (с какими слоями я сталкиваюсь).',
      why:
        'Слои — это «правила мира». Без них игрок сталкивается с каждым пикселем, а пуля — с игроком. Слои позволяют задать правила одной строкой и не ломать их при добавлении новых объектов.',
      details: [
        'Слои — битовые флаги: 1, 2, 4, 8, 16… Значение 3 означает «слой 1 И слой 2».',
        'Совпадение коллизии: (слой A И маска B) ИЛИ (слой B И маска A) — должно быть непустым.',
        'Слои задаются в Inspector → Collision → Layer / Mask, и в Project Settings → Layer Names есть понятные названия.',
        'Типовой набор: 1 — мир, 2 — игрок, 3 — враги, 4 — подбираемое, 5 — опасное.',
        'Area2D по умолчанию не «толкает» тела, а только сообщает о пересечении.',
      ],
      diagramRef: 'collision-layers',
    },
    {
      id: 'rays',
      title: 'RayCast2D: «вижу ли я землю»',
      term: 'RayCast',
      summary:
        'RayCast2D — невидимый луч из узла в заданном направлении. Он сообщает, что и на каком расстоянии пересёк.',
      why:
        'Это «глаза» персонажа. Ими реализуют проверку «есть ли земля впереди» (чтобы враг не свалился с края) и выстрелы. Один луч — дешевле, чем десятки Area2D.',
      details: [
        'Свойства: target_position (Vector2), enabled, collide_with_areas, collide_with_bodies.',
        '`is_colliding()` — что-то нашлось. `get_collider()` — что именно. `get_collision_point()` — где.',
        'Луч обновляется в _physics_process.',
        'Чтобы луч смотрел вниз, направление — target_position вниз от длины луча, а сам узел поворачивается вниз.',
        'Для обнаружения стены смотрите лучом горизонтально в сторону движения.',
      ],
      diagramRef: 'collision-layers',
    },
  ],
  steps: [
    {
      id: 's3-1',
      title: 'Собрать сцену игрока',
      where: 'Scene → New Scene → 2D Scene',
      action:
        'Создайте корневой узел CharacterBody2D с именем Player. Добавьте дочерний Sprite2D (нарисуйте ColorRect или импортируйте картинку) и CollisionShape2D с RectangleShape2D.',
      result: 'В сцене три узла, у Player есть форма столкновений.',
      note:
        'CollisionShape2D должен быть ПОСЛЕДНИМ в списке детей? Нет — порядок не важен, но в Godot 3 первым ребёнком был CollisionShape2D. В Godot 4 ограничений нет.',
      diagramRef: 'collision-layers',
    },
    {
      id: 's3-2',
      title: 'Задать форму столкновений',
      where: 'Inspector → CollisionShape2D → Shape',
      action:
        'Выберите узел CollisionShape2D, в поле Shape нажмите «<empty>» и выберите New RectangleShape2D. Задайте Size: 32×48.',
      result: 'В 2D-редакторе видна зелёная рамка столкновений.',
      note:
        'Размер формы задаётся в пикселях и не зависит от размера спрайта. Если спрайт 64×64, а форма 32×48 — персонаж будет «проскальзывать» мимо узких щелей.',
    },
    {
      id: 's3-3',
      title: 'Настроить слои',
      where: 'Inspector → Collision → Layer / Mask; Project Settings → Layer Names',
      action:
        'Установите Player: Layer = «Игрок» (слой 2), Mask = «Мир» (слой 1). Для пола (StaticBody2D): Layer = «Мир», Mask = 0.',
      result: 'Игрок сталкивается с миром, а мир ни с кем.',
      note: 'Mask у статичного мира можно оставить пустым: он неподвижен, ему нечего отталкивать.',
    },
    {
      id: 's3-4',
      title: 'Написать движение',
      where: 'Скрипт player.gd',
      action:
        'Добавьте @export-переменные speed и jump_velocity. В _physics_process считайте направление через Input.get_vector() и пишите в velocity, затем вызывайте move_and_slide().',
      result: 'Герой двигается по стрелкам и не проходит сквозь пол.',
      note:
        'Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") возвращает Vector2 с длиной не больше 1 — она уже учтена в скорости.',
      diagramRef: 'input-order',
    },
    {
      id: 's3-5',
      title: 'Добавить прыжок',
      where: 'Тот же скрипт',
      action:
        'Накапливайте гравитацию в velocity.y. При нажатии «jump» и is_on_floor() присваивайте velocity.y = -jump_velocity.',
      result: 'Герой прыгает и приземляется ровно на пол.',
      note: 'Без проверки is_on_floor() герой будет «прыгать» в воздухе бесконечно.',
    },
    {
      id: 's3-6',
      title: 'Враг с лучом',
      where: 'Сцена enemy.tscn',
      action:
        'Добавьте к врагу узел RayCast2D, направьте его вниз (target_position = Vector2(0, 40)) и включите enabled. Если is_colliding() — враг продолжает идти, иначе разворачивается.',
      result: 'Враг разворачивается у края платформы и не падает.',
      diagramRef: 'collision-layers',
    },
    {
      id: 's3-7',
      title: 'Проверить слои',
      where: 'Project Settings → Layer Names',
      action:
        'Переименуйте слои 1..5 в «Мир», «Игрок», «Враги», «Подбираемое», «Опасное». Включите отображение коллизий: View → Collision Shapes.',
      result: 'Названия слоёв видны в инспекторе — их невозможно перепутать.',
    },
  ],
  code: [
    {
      id: 'player-controller',
      title: 'Полный контроллер игрока',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `class_name PlayerController
extends CharacterBody2D

signal health_changed(value: int)

const GRAVITY := 1400.0
const MAX_FALL_SPEED := 900.0

@export var speed: float = 260.0
@export var jump_velocity: float = 480.0
@export var air_control: float = 0.6
@export var coyote_time: float = 0.12

var health: int = 100
var _coyote := 0.0
var _was_on_floor := false

func _physics_process(delta: float) -> void:
	var direction := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	var on_floor := is_on_floor()
	if on_floor:
		_coyote = coyote_time
	else:
		_coyote = max(_coyote - delta, 0.0)

	var control := 1.0 if on_floor else air_control
	velocity.x = direction.x * speed * control
	velocity.y = min(velocity.y + GRAVITY * delta, MAX_FALL_SPEED)

	if _coyote > 0.0 and Input.is_action_just_pressed("jump"):
		velocity.y = -jump_velocity
		_coyote = 0.0

	move_and_slide()

	if is_on_floor() and not _was_on_floor:
		health_changed.emit(health)
	_was_on_floor = is_on_floor()

func take_damage(amount: int) -> void:
	health = max(health - amount, 0)
	health_changed.emit(health)
`,
      explanation:
        'Полный контроллер, из которого можно вырасти любой платформер. Три приёма, которые стоит запомнить: (1) вход читается через `Input.get_vector`, чтобы движение диагональным не было быстрее прямого; (2) гравитация добавляется каждый кадр и ограничивается сверху `MAX_FALL_SPEED`, иначе при долгом падении скорость вырастет до абсурда; (3) `coyote_time` — короткая «подушка» после схода с платформы: если игрок нажал прыжок на 2 кадра позже, прыжок засчитывается. Это не баг, а стандартный приём в платформерах.',
      versionNote:
        'В Godot 4 `Input.get_vector` живёт в классе Input, а не в экземпляре. Названия действий по умолчанию: ui_left, ui_right, ui_up, ui_down.',
    },
    {
      id: 'enemy-patrol',
      title: 'Враг-патруль с проверкой края',
      file: 'res://enemy.gd',
      language: 'gdscript',
      code: `class_name PatrolEnemy
extends CharacterBody2D

signal died(enemy: PatrolEnemy)

@export var speed: float = 90.0
@export var gravity: float = 1200.0

@onready var ground_ray: RayCast2D = $GroundRay
@onready var wall_ray: RayCast2D = $WallRay

var direction := 1

func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y += gravity * delta
	else:
		velocity.y = 0.0

	var blocked := wall_ray.is_colliding()
	var edge_ahead := not ground_ray.is_colliding()
	if blocked or edge_ahead:
		direction = -direction
		wall_ray.target_position.x = abs(wall_ray.target_position.x) * direction
		ground_ray.target_position.x = abs(ground_ray.target_position.x) * direction

	velocity.x = speed * direction
	move_and_slide()

func die() -> void:
	died.emit(self)
	queue_free()
`,
      explanation:
        'Патруль из двух лучей: «стена впереди» и «земля впереди». Если стена или нет земли — разворачиваемся. Лучи задаются в сцене как дочерние узлы и тянутся через `@onready`. Обратите внимание на `queue_free()` вместо `free()`: `free()` удаляет узел немедленно, прямо во время его же обработки — это причина крашей «object was freed» в Godot. `queue_free()` откладывает удаление до конца кадра.',
      versionNote:
        '`queue_free()` и `free()` доступны с Godot 3.x и не менялись в 4.x.',
    },
    {
      id: 'pickup-area',
      title: 'Зона подбора и её сигналы',
      file: 'res://pickup.gd',
      language: 'gdscript',
      code: `extends Area2D

signal picked_up(item_id: String, by: Node2D)

@export var item_id: String = "coin"
@export var auto_collect: bool = true

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

func _on_body_entered(body: Node2D) -> void:
	if not body.is_in_group("player"):
		return
	_collect(body)

func _on_area_entered(area: Area2D) -> void:
	if not auto_collect:
		return
	if area.is_in_group("player"):
		_collect(area)

func _collect(who: Node2D) -> void:
	picked_up.emit(item_id, who)
	queue_free()
`,
      explanation:
        'Area2D — «зона, которая не мешает, но сообщает». Два сигнала: `body_entered` (вошло физическое тело) и `area_entered` (вошла другая зона). Проверка группы `is_in_group("player")` отсекает лишние срабатывания: в зону может зайти что угодно. `queue_free()` убирает предмет, чтобы нельзя было собрать его дважды.',
      versionNote:
        'Сигналы `body_entered` и `area_entered` у Area2D принимают аргумент в Godot 4 (в Godot 3 — без аргументов).',
    },
  ],
  tasks: [
    {
      id: 't3-1',
      title: 'Диагональное движение',
      description:
        'Проверьте, что герой при нажатии «вправо+вверх» двигается с той же скоростью, что и при нажатии только «вправо». Если быстрее — вы задаёте скорость по осям, а не по вектору.',
      level: 1,
      hint: 'Input.get_vector уже нормализует длину вектора.',
    },
    {
      id: 't3-2',
      title: 'Лазерный луч',
      description:
        'Сделайте Area2D с CollisionShape2D в виде ThinRectangleShape2D, который «режет» врагов. При попадании во врага он получает урон и лазер гаснет на 0.5 секунды.',
      level: 2,
      hint: 'Таймер удобно сделать через get_tree().create_timer() и await.',
    },
    {
      id: 't3-3',
      title: 'Прыжок с coyote time',
      description:
        'Добавьте в контроллер игрока «jump buffer»: если игрок нажал прыжок за 0.1 секунды до приземления, прыжок засчитывается сразу после касания земли.',
      level: 3,
      hint: 'Храните флаг нажатия и проверяйте его в момент приземления.',
    },
    {
      id: 't3-4',
      title: 'Разобраться со слоями',
      description:
        'Сделайте так, чтобы пуля (Area2D) проходила сквозь стены, но попадала во врага. Это правится только маской: пуля не должна видеть слой «Мир».',
      level: 3,
      hint: 'Collision Mask пули = «Враги» + «Игрок», без «Мир».',
    },
  ],
  project: {
    title: 'Платформер «Кот на крыше»',
    brief:
      'Герой ходит, прыгает и собирает монеты. Враги ходят по платформам туда-сюда и не падают с края. Касание врага отнимает здоровье.',
    requirements: [
      'Player на CharacterBody2D: ходьба, прыжок, гравитация, здоровье.',
      'Платформы — StaticBody2D на слое «Мир», с нарисованной текстурой.',
      'Enemy на CharacterBody2D с двумя RayCast2D, патрулирующий платформу.',
      'Монеты — Area2D на слое «Подбираемое», при подборе исчезают и дают очки.',
      'Счётчик очков и здоровья выводится текстом в углу.',
    ],
    stretch: [
      'Добавьте двойной прыжок.',
      'Сделайте шипы (Area2D), которые отнимают здоровье при касании.',
      'Добавьте «монетку в сундуке», который открывается только после сбора трёх обычных.',
    ],
  },
  criteria: [
    {
      id: 'c3-1',
      text: 'Различаю CharacterBody2D, StaticBody2D, RigidBody2D и Area2D',
      check:
        'Для каждого типа называю, кто двигается и нужно ли мне писать физику вручную, и привожу пример из своей игры.',
    },
    {
      id: 'c3-2',
      text: 'Умею двигать персонажа через velocity и move_and_slide()',
      check:
        'Пишу функцию _physics_process, где сначала задаю velocity, потом вызываю move_and_slide(), и объясняю, почему порядок важен.',
    },
    {
      id: 'c3-3',
      text: 'Понимаю, зачем нужен delta и где его применять',
      check:
        'Объясняю, что будет, если умножить скорость на 60 вместо delta, и как это выглядит на 144-герцевом мониторе.',
    },
    {
      id: 'c3-4',
      text: 'Задаю слои и маски так, чтобы объекты сталкивались ровно так, как задумано',
      check:
        'Показываю на схеме, какие слои видят друг друга, и проверяю это в игре: пуля проходит сквозь стену, но попадает во врага.',
    },
    {
      id: 'c3-5',
      text: 'Отличаю queue_free() от free() и знаю, почему это важно',
      check:
        'Объясняю, что происходит, если вызвать free() внутри обработчика сигнала самого удаляемого узла.',
    },
    {
      id: 'c3-6',
      text: 'Умею использовать RayCast2D для проверки края и стен',
      check:
        'Объясняю, что вернут is_colliding(), get_collider() и get_collision_point(), и покажу работающий патруль.',
    },
  ],
  resources: [
    {
      title: 'Физика 2D — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/physics/physics_2d.html',
      kind: 'docs',
    },
    {
      title: 'Использование TileMaps (слои) — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html',
      kind: 'docs',
    },
    {
      title: 'Справочник CharacterBody2D',
      url: 'https://docs.godotengine.org/en/stable/classes/class_characterbody2d.html',
      kind: 'reference',
    },
    {
      title: 'Справочник Area2D',
      url: 'https://docs.godotengine.org/en/stable/classes/class_area2d.html',
      kind: 'reference',
    },
  ],
  diagrams: ['collision-layers', 'input-order', 'state-machine'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Input.get_vector стал возвращать нормализованный Vector2 (длина ≤ 1). В Godot 3 длина вектора могла быть больше — отсюда разница в ощущении управления.',
    },
    {
      version: '4.0',
      text: 'Сигналы body_entered и area_entered теперь передают вошедший узел аргументом.',
    },
  ],
}
