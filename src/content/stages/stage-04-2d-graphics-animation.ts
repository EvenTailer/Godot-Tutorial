import type { Stage } from '../types'

/**
 * Этап 04 — 2D: графика, анимация, тайлы, эффекты.
 * Цель этапа: уровень выглядит как игра, а не как набор цветных квадратов.
 */
export const stage04: Stage = {
  id: '04',
  number: 4,
  slug: '04-2d-grafika-animaciya-tayly',
  title: '2D: графика, анимация, тайлы, эффекты',
  shortTitle: 'Графика и анимация',
  subtitle: 'Спрайты, анимации, тайловые карты, частицы и камера — уровень начинает выглядеть как игра',
  weeks: '9–10',
  hours: 14,
  goal: 'Научиться работать с визуалом: спрайты, анимации, тайловые карты, частицы, камера и порядок отрисовки.',
  outcome:
    'Уровень с тайловой картой, анимированным героем, частицами при прыжке и плавной камерой, которая следует за игроком.',
  topics: [
    {
      id: 'sprites',
      title: 'Спрайты и импорт ресурсов',
      term: 'Sprite2D / Texture',
      summary:
        'Спрайт — это изображение, натянутое на узел Sprite2D. Импортированная текстура в Godot 4 настраивается через вкладку Import.',
      why:
        'Настройки импорта определяют, будет ли игра выглядеть «пиксель-артом» или «мылом». Правильный фильтр и масштаб — разница между красивой игрой и размытой кашей.',
      details: [
        'Фильтрация: Project → Project Settings → Rendering → Textures → Canvas Textures → Default Texture Filter. Для пиксель-арта — Nearest.',
        'Mipmaps выключают для пиксель-арта — иначе тайлы «мылятся» при уменьшении.',
        'У Sprite2D есть свойства centered, offset, flip_h, flip_v, region_enabled.',
        'Для одной картинки из общего атласа используйте AtlasTexture — это не новая картинка, а «окно» в большой.',
        'Import → у каждого ресурса есть свои настройки: Lossless, Compress, Mipmaps, Detect 3D.',
      ],
    },
    {
      id: 'animation',
      title: 'Анимации: AnimatedSprite2D и AnimationPlayer',
      term: 'AnimationPlayer',
      summary:
        'AnimatedSprite2D прост: список кадров в SpriteFrames. AnimationPlayer мощнее: анимирует любое свойство любого узла, включая звук.',
      why:
        'Анимация делает игру «живой» — и это самый дешёвый способ поднять качество. Плюс AnimationPlayer умеет проигрывать звук и двигать узлы, что экономит отдельный код.',
      details: [
        'AnimatedSprite2D: свойство sprite_frames (ресурс SpriteFrames) и метод play("walk").',
        'Сигнал animation_finished у обоих — удобно для «после прыжка вернуться в idle».',
        'AnimationPlayer: анимации — треки (tracks) по свойствам узлов. Ключи задаются в панели Animation внизу.',
        'В AnimationPlayer можно анимировать: position, modulate, rotation, modulate:self_modulate, и даже звук (AudioStreamPlayer).',
        'Анимации живут в ресурсе Animation, который хранится в сцене — их можно переиспользовать.',
      ],
      diagramRef: 'animation-state',
    },
    {
      id: 'tilemaps',
      title: 'Тайловые карты',
      term: 'TileSet / TileMapLayer',
      summary:
        'TileSet — набор тайлов (изображение + правила). TileMapLayer — узел, в который вы «рисуете» уровень тайлами.',
      why:
        'Ставить тысячи спрайтов вручную невозможно. Тайловая карта даёт уровень, который рисуется мышью, и экономит память: движок рисует только видимую часть.',
      details: [
        'С 4.3 используйте TileMapLayer. Старый узел TileMap устарел и оставлен только для совместимости.',
        'TileSet — отдельный ресурс .tres, его переиспользуют несколько уровней.',
        'В TileSet у тайла есть физическая форма: можно задать CollisionShape2D прямо в TileSet.',
        'Несколько TileMapLayer — правильный способ: «земля», «декор», «декор впереди».',
        'Инструменты Paint, Line, Rectangle, Bucket Fill, Picker, Eraser — в нижней панели.',
      ],
      diagramRef: 'tilemap-layers',
    },
    {
      id: 'particles',
      title: 'Частицы',
      term: 'GPUParticles2D',
      summary:
        'GPUParticles2D разлетает частицы по правилам из ParticleProcessMaterial: направление, скорость, гравитация, цвет, жизнь.',
      why:
        'Частицы дают «объём» эффекту за несколько секунд работы. Пыль, искры, брызги, взрыв — всё это один узел с настройками, а не сотня строк кода.',
      details: [
        'GPUParticles2D (GPU) и CPUParticles2D (CPU) — почти одинаковый интерфейс. GPU быстрее, CPU — для очень малого количества частиц и для веб-экспорта без поддержки.',
        'ParticleProcessMaterial — «правила» частиц: direction, spread, initial_velocity, gravity, scale, color.',
        'Restart — перезапустить систему с нуля. one_shot — вспышка, а не постоянный поток.',
        'Amount (количество) — 8 для снега, 100–300 для пыли, 1000+ для взрыва.',
        'Для простых эффектов хватает AnimationPlayer на прозрачность, но частицы выглядят живее.',
      ],
    },
    {
      id: 'camera',
      title: 'Камера и порядок отрисовки',
      term: 'Camera2D',
      summary:
        'Camera2D показывает часть мира. Порядок отрисовки задаётся индексом z, а «кто ближе к низу экрана» — сортировкой по Y.',
      why:
        'Без камеры уровень больше экрана не покажется. А порядок отрисовки — самая частая причина «персонаж проваливается за дерево».',
      details: [
        'Camera2D: make_current(), position_smoothing_enabled, position_smoothing_speed, zoom.',
        'z_index управляет порядком отрисовки: больше — ближе к зрителю.',
        'y_sort_enabled у CanvasItem — сортировка по вертикали: персонаж заходит за дерево и выходит из-за него.',
        'Для фона — Parallax2D (с 4.3) или отдельный слой с большим z.',
        'CanvasModulate затемняет весь мир — используется для «ночи» или зала света.',
      ],
      diagramRef: 'scene-3d',
    },
    {
      id: 'juice-tween',
      title: 'Tween: анимация из кода',
      term: 'Tween',
      summary:
        'Tween плавно меняет свойства узла по времени. Создаётся через create_tween() и живёт, пока не отработает.',
      why:
        'Tween — самый дешёвый способ сделать игру «сочной»: вспышка при получении урона, подпрыгивание при нажатии, плавное открытие панели. Плюс это читаемый код вместо ручного счётчика в _process.',
      details: [
        '`create_tween()` создаёт твин, `tween_property(node, "modulate:a", 0.0, 0.3)` — что, куда, за сколько.',
        '`tween_callback(func(): ...)` — действие в момент времени.',
        '`tween_interval(0.2)` — пауза.',
        '`set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)` — «отскок».',
        'Твин работает в процессе (не в физике). Если узел удалён — твин умирает.',
      ],
    },
  ],
  steps: [
    {
      id: 's4-1',
      title: 'Настроить импорт пиксель-арта',
      where: 'Выберите текстуру → вкладка Import',
      action:
        'Выберите PNG в FileSystem и откройте вкладку Import. Поставьте Filter = Nearest (в Project Settings → Rendering → Textures → Default Texture Filter), Mipmaps выключите.',
      result: 'Текстура в игре не размывается, пиксели чёткие.',
      note: 'Если картинка «пиксель-арт», но выглядит мыльно — почти всегда виноват фильтр по умолчанию.',
      diagramRef: 'tilemap-layers',
    },
    {
      id: 's4-2',
      title: 'Собрать TileSet',
      where: 'File → New → TileSet, или в TileMapLayer → TileSet → New TileSet',
      action:
        'Создайте TileSet, добавьте в него источник тайлов (Texture2D), нарежьте на тайлы 16×16 или 32×32. Для земли задайте физическую форму в TileSet.',
      result: 'В TileSet видны тайлы, у одного из них есть коллизия.',
      note:
        'Физика в тайлах задаётся прямо в TileSet: это один коллайдер на все земли — быстрее, чем тысяча отдельных StaticBody2D.',
      diagramRef: 'tilemap-layers',
    },
    {
      id: 's4-3',
      title: 'Нарисовать уровень',
      where: 'TileMapLayer → нижняя панель TileMap',
      action:
        'Добавьте в сцену узел TileMapLayer, назначьте TileSet. В нижней панели выберите тайл и рисуйте инструментом Paint. Зажмите Ctrl для прямой линии, Shift+Ctrl — прямоугольник.',
      result: 'На 2D-редакторе виден нарисованный уровень.',
      note: 'Клавиша E включает режим Eraser, P — Paint, F — Bucket Fill. Это запоминается быстро, если пользоваться.',
      diagramRef: 'tilemap-layers',
    },
    {
      id: 's4-4',
      title: 'Разделить слои',
      where: 'Scene → Add Child Node → TileMapLayer',
      action:
        'Добавьте второй TileMapLayer «Декор» и третий «Декор впереди». В Inspector у первого оставьте Enabled = true, у третьего — тоже, но задайте ему z_index выше, чтобы он перекрывал игрока.',
      result: 'Дерево игрока перед игроком, но игрок может пройти за ним.',
    },
    {
      id: 's4-5',
      title: 'Сделать анимацию героя',
      where: 'AnimatedSprite2D → SpriteFrames → New SpriteFrames',
      action:
        'Добавьте к игроку AnimatedSprite2D. В Inspector у него нажмите «New SpriteFrames», вставьте кадры и назовите анимацию «idle» и «run». В коде вызывайте sprite.play("run") и sprite.play("idle").',
      result: 'Герой переключает анимации по движению.',
      note:
        'В Godot 4 у AnimatedSprite2D по умолчанию 60 кадров в секунду. Если анимация «ускорилась» — проверьте Animation Speed в SpriteFrames.',
      diagramRef: 'animation-state',
    },
    {
      id: 's4-6',
      title: 'Анимация через AnimationPlayer',
      where: 'Выберите узел → вкладка Animation внизу → New',
      action:
        'Выберите узел, откройте нижнюю панель Animation, нажмите «New», назовите анимацию «hit». Добавьте трек по свойству modulate:self_modulate и ключи: белый → красный → белый. Запустите через anim.play("hit").',
      result: 'При получении урона спрайт коротко краснеет.',
      diagramRef: 'animation-state',
    },
    {
      id: 's4-7',
      title: 'Частицы прыжка',
      where: 'Add Child Node → GPUParticles2D',
      action:
        'Добавьте GPUParticles2D под игроком, задайте Amount = 16, one_shot = true, explosiveness = 1.0. В Process Material укажите direction вверх, spread = 45, initial_velocity = 80.',
      result: 'При прыжке из-под ног вылетает пыль.',
      note: 'Чтобы частицы сыпались вниз, задайте gravity в Process Material — они «упадут» на землю.',
    },
    {
      id: 's4-8',
      title: 'Камера следует за игроком',
      where: 'Add Child Node → Camera2D',
      action:
        'Добавьте Camera2D в сцену игрока (как дочерний узел), включите position_smoothing_enabled и задайте speed = 5. Ограничьте границы камеры в Inspector: Limit Left / Right / Top / Bottom.',
      result: 'Камера плавно следует за героем и не показывает пустоту за уровнем.',
      note: 'Границы камеры — то, что отличает «играбельный» уровень от «камера улетает в пустоту».',
      diagramRef: 'scene-3d',
    },
  ],
  code: [
    {
      id: 'animated-player',
      title: 'Переключение анимаций по состоянию',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `class_name AnimatedPlayer
extends CharacterBody2D

@onready var sprite: AnimatedSprite2D = $Sprite2D

var _current_animation := ""

func _physics_process(_delta: float) -> void:
	if is_on_floor():
		if absf(velocity.x) > 10.0:
			_play("run")
		else:
			_play("idle")
	else:
		_play("jump")

func _play(name: String) -> void:
	if name == _current_animation:
		return
	_current_animation = name
	sprite.play(name)

func on_landed() -> void:
	_play("idle")
`,
      explanation:
        'Классический приём: состояние определяется не вручную, а вычисляется из движения. `_play` с защитой от повтора избавляет от лишних вызовов `play()` — иначе анимация начиналась бы заново каждый кадр и «дёргалась». Имя `_current_animation` хранится в отдельной переменной, а не читается из спрайта.',
      versionNote:
        'Свойство sprite_frames у AnimatedSprite2D появилось в Godot 4.0 (в Godot 3 был frames: SpriteFrames).',
    },
    {
      id: 'camera-follow',
      title: 'Камера с плавным следованием',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `extends CharacterBody2D

@onready var camera: Camera2D = $Camera2D

func _ready() -> void:
	camera.make_current()
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 6.0
	camera.limit_left = 0
	camera.limit_right = 3200
	camera.limit_top = -512
	camera.limit_bottom = 512

func _physics_process(_delta: float) -> void:
	var direction := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	velocity.x = direction.x * 220.0
	velocity.y += 1400.0 * get_physics_process_delta_time()
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = -420.0
	move_and_slide()
`,
      explanation:
        'Камера — дочерний узел игрока: она всегда в его координатах, поэтому «сама» следует за ним. `make_current()` переключает активную камеру (в сцене их может быть несколько). Сглаживание (`position_smoothing`) убирает рывки, но не отстаёт слишком сильно — это баланс между «липкостью» и «задержкой». Лимиты не дают камере показать пустоту за пределами уровня.',
      versionNote:
        'Свойства limit_left / limit_right / limit_top / limit_bottom есть и в Godot 3.x — в 4.x их поведение не менялось.',
    },
    {
      id: 'burst-particles',
      title: 'Вспышка частиц по событию',
      file: 'res://effects.gd',
      language: 'gdscript',
      code: `extends Node2D

@onready var burst: GPUParticles2D = $Burst
@onready var trail: GPUParticles2D = $Trail

func _ready() -> void:
	burst.one_shot = true
	burst.emitting = false
	trail.emitting = true

func play_burst(at_position: Vector2) -> void:
	burst.global_position = at_position
	burst.restart()
	burst.emitting = true

func set_trail_active(active: bool) -> void:
	trail.emitting = active
`,
      explanation:
        'Одноразовая «вспышка» (one_shot + explosiveness = 1) перезапускается через `restart()`: без него частицы второй раз не полетят. Постоянный поток (след, дождь) просто включается и выключается через `emitting`. `global_position` нужен, потому что узел эффекта может быть не в той точке мира, где происходит событие.',
      versionNote:
        'GPUParticles2D в Godot 4 заменил старую систему частиц: у частиц есть процесс-материал, а не «параметры частиц» внутри узла.',
    },
    {
      id: 'tilemap-code',
      title: 'Уровень из кода на TileMapLayer',
      file: 'res://level_builder.gd',
      language: 'gdscript',
      code: `extends Node2D

const GROUND_SOURCE_ID := 0

@onready var ground: TileMapLayer = $Ground
@onready var platform: TileMapLayer = $Platform

func _ready() -> void:
	_build_ground()
	_build_platforms()

func _build_ground() -> void:
	for x in range(0, 40):
		for y in range(0, 3):
			ground.set_cell(Vector2i(x, y), GROUND_SOURCE_ID, Vector2i(0, 0))

func _build_platforms() -> void:
	var spots := [
		Vector2i(8, -2),
		Vector2i(14, -4),
		Vector2i(22, -3),
	]
	for spot in spots:
		for x in range(3):
			platform.set_cell(spot + Vector2i(x, 0), GROUND_SOURCE_ID, Vector2i(1, 0))
`,
      explanation:
        'Иногда уровень удобнее строить кодом, а не рисовать: уровни генерируются, или их нужно менять по параметрам. `set_cell(coords, source_id, atlas_coords)` — координаты тайла, id источника в TileSet и координаты картинки внутри атласа. Координаты в TileMapLayer — целые: Vector2i.',
      versionNote:
        'Метод set_cell в TileMapLayer имеет сигнатуру set_cell(coords, source_id, atlas_coords, alternative_tile). TileMapLayer появился в Godot 4.3.',
    },
  ],
  tasks: [
    {
      id: 't4-1',
      title: 'Анимация из двух состояний',
      description:
        'Сделайте две анимации героя: idle и run. Переключайте их в зависимости от того, двигается ли персонаж. Проверьте, что анимация не дёргается.',
      level: 1,
      hint: 'Сравнивайте текущее имя анимации с желаемым перед вызовом play().',
    },
    {
      id: 't4-2',
      title: 'Три слоя тайлов',
      description:
        'Соберите уровень из трёх TileMapLayer: земля (с коллизией), декор позади, декор впереди. Проверьте, что игрок корректно перекрывается декором.',
      level: 2,
      hint: 'z_index задаётся на узле, а не на тайле.',
    },
    {
      id: 't4-3',
      title: 'След и вспышка',
      description:
        'Сделайте две системы частиц: постоянный след за игроком и одноразовую вспышку при приземлении. Свяжите вспышку с сигналом о приземлении.',
      level: 2,
      hint: 'one_shot = true и explosiveness = 1.0 — эффект-вспышка.',
    },
    {
      id: 't4-4',
      title: 'Отдача при попадании',
      description:
        'При получении урона запустите Tween, который увеличивает modulate:self_modulate к красному и возвращает обратно. Добавьте небольшое отталкивание персонажа.',
      level: 3,
      hint: 'tween_property(sprite, "modulate", Color.RED, 0.1) — а затем обратный твин через tween_callback.',
    },
    {
      id: 't4-5',
      title: 'Масштабирование без потери качества',
      description:
        'Включите для текстур фильтр Nearest и отключите мипмапы. Сравните вид на 1× и на 4× (Project Settings → Display → Window → Stretch → Scale).',
      level: 2,
      hint: 'Для «пиксель-арта» используйте режим viewport, а не canvas_items.',
    },
  ],
  project: {
    title: 'Уровень «Лесная опушка»',
    brief:
      'Красивый игровой уровень: тайловая земля, три слоя декора, анимированный герой, камера с границами и частицы пыли при беге.',
    requirements: [
      'TileMapLayer «Земля» с коллизией в TileSet и минимум 3 тайлами.',
      'Слои «Декор» и «Декор впереди» с правильным z_index.',
      'Герой с анимациями idle/run и камерой, ограниченной размерами уровня.',
      'Частицы пыли при беге и вспышка при приземлении.',
      'Уровень длиннее экрана минимум в 3 раза — чтобы была видна работа камеры.',
    ],
    stretch: [
      'Добавьте Parallax2D с фоновым слоем, который двигается медленнее камеры.',
      'Сделайте ночной вариант уровня через CanvasModulate и подсветку от фонаря.',
      'Соберите уровень кодом (как в примере выше) и сравните с нарисованным вручную.',
    ],
  },
  criteria: [
    {
      id: 'c4-1',
      text: 'Знаю, когда включать Nearest-фильтр и почему мыло появляется',
      check:
        'Могу воспроизвести: включаю фильтр Linear для пиксель-арта, вижу мыло, возвращаю Nearest и вижу чёткие пиксели.',
    },
    {
      id: 'c4-2',
      text: 'Различаю AnimatedSprite2D и AnimationPlayer и знаю, что выбрать',
      check:
        'Объясняю: «если кадры одного спрайта — AnimatedSprite2D, если анимирую что угодно — AnimationPlayer», и привожу пример из своего проекта.',
    },
    {
      id: 'c4-3',
      text: 'Умею собрать TileSet и нарисовать уровень тайлами',
      check:
        'Создаю TileSet, нарезаю текстуру, рисую уровень инструментом Paint и включаю Bucket Fill.',
    },
    {
      id: 'c4-4',
      text: 'Знаю, зачем нужны несколько TileMapLayer',
      check: 'Объясняю разницу между слоями «земля», «декор», «декор впереди» и значением z_index.',
    },
    {
      id: 'c4-5',
      text: 'Умею настроить частицы и отличить вспышку от потока',
      check: 'Создаю систему пыли (постоянную) и систему взрыва (one_shot) и знаю, зачем нужен restart().',
    },
    {
      id: 'c4-6',
      text: 'Умелю сделать «сочность» через Tween',
      check:
        'Пишу твин, который меняет modulate за 0.15 секунды, и объясняю, почему твин нельзя завязать на _physics_process.',
    },
  ],
  resources: [
    {
      title: 'Использование тайловых карт — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html',
      kind: 'docs',
    },
    {
      title: 'Использование TileSet — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/2d/using_tilesets.html',
      kind: 'docs',
    },
    {
      title: '2D-материалы, освещение и тени',
      url: 'https://docs.godotengine.org/en/stable/tutorials/2d/2d_lights_and_shadows.html',
      kind: 'docs',
    },
    {
      title: 'Справочник Tween',
      url: 'https://docs.godotengine.org/en/stable/classes/class_tween.html',
      kind: 'reference',
    },
    {
      title: 'Справочник TileMapLayer',
      url: 'https://docs.godotengine.org/en/stable/classes/class_tilemaplayer.html',
      kind: 'reference',
    },
  ],
  diagrams: ['tilemap-layers', 'animation-state', 'scene-3d'],
  versionNotes: [
    {
      version: '4.3',
      text: 'TileMapLayer пришёл на смену TileMap. Старый узел устарел, но работает — если открываете проект из Godot 3, сначала конвертируйте сцены.',
    },
    {
      version: '4.3',
      text: 'Появился узел Parallax2D — простая замена связке ParallaxBackground + ParallaxLayer.',
    },
    {
      version: '4.0',
      text: 'Система частиц переписана: появились GPUParticles2D и CPUParticles2D с отдельным ресурсом ParticleProcessMaterial.',
    },
  ],
}
