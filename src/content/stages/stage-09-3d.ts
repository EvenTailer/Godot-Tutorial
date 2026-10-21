import type { Stage } from '../types'

/**
 * Этап 09 — 3D.
 * Цель этапа: собрать простую 3D-сцену и понять, как устроены узлы, камера, свет и материалы.
 */
export const stage09: Stage = {
  id: '09',
  number: 9,
  slug: '09-3d',
  title: '3D',
  shortTitle: '3D',
  subtitle: 'Node3D, камера, свет, материалы и движение в пространстве',
  weeks: '19–20',
  hours: 16,
  goal: 'Научиться строить 3D-сцену: геометрия, камера, освещение, материалы, движение и столкновения.',
  outcome:
    'Стоит 3D-арена с полом, стенами, источниками света, управляемым персонажем от первого лица и выстрелами по Raycast.',
  topics: [
    {
      id: 'node3d',
      title: 'Node3D и система координат',
      term: 'Node3D',
      summary:
        'Node3D — узел в пространстве. У него есть position (позиция), rotation (поворот) и scale (масштаб).',
      why:
        '3D в Godot — это те же узлы и та же логика, что и в 2D, только с тремя координатами. Если вы поняли дерево сцены в 2D, 3D вы поймёте быстро.',
      details: [
        'Правая рука: X — вправо, Y — вверх, Z — из экрана (назад). Вперёд — отрицательный Z.',
        'rotation задаётся в радианах, порядок — по умолчанию YXZ (сначала поворот вокруг Y).',
        'Глобальные координаты — мировые, локальные — относительно родителя.',
        'basis — матрица 3×3, из неё берутся направления: -global_transform.basis.z — «вперёд» для камеры.',
        'Масштаб в 3D не должен быть нулевым иначе узел «схлопнется».',
      ],
      diagramRef: 'scene-3d',
    },
    {
      id: 'meshes',
      title: 'Геометрия: MeshInstance3D',
      term: 'MeshInstance3D',
      summary:
        'MeshInstance3D показывает меш (геометрию): BoxMesh, SphereMesh, CapsuleMesh, CylinderMesh, PlaneMesh и другие.',
      why:
        'В 3D вы не рисуете объекты — вы берёте готовую геометрию и настраиваете её. Это быстрее и проще, чем моделирование, и для прототипа достаточно.',
      details: [
        'BoxMesh с size = Vector3(2, 1, 2) — коробка.',
        'MeshInstance3D должен быть в сцене рядом с CollisionShape3D — это два разных узла.',
        'Для «мягких» форм — SphereShape3D и CapsuleShape3D.',
        'Собственную геометрию можно построить через SurfaceTool или ArrayMesh.',
        'Встроенный редактор позволяет импортировать .glb и .obj.',
      ],
      diagramRef: 'scene-3d',
    },
    {
      id: 'camera-light',
      title: 'Камера и освещение',
      term: 'Camera3D / Light3D',
      summary:
        'Camera3D — точка обзора. DirectionalLight3D — солнце. OmniLight3D — лампа. WorldEnvironment — фон, туман, небо.',
      why:
        'Сцена без света — чёрный экран. Это самая частая причина «у меня ничего не видно» при первом запуске 3D в Godot.',
      details: [
        'Без источника света объекты видны только благодаря ambient-окружению — по умолчанию её почти нет.',
        'DirectionalLight3D: один источник на всю сцену, тени от него.',
        'OmniLight3D: точечный, с затуханием (omni_range).',
        'WorldEnvironment с ресурсом Environment: background_mode = BG_SKY и ProceduralSkyMaterial дают небо и ambient.',
        'Camera3D: current = true или Camera3D.make_current().',
      ],
      diagramRef: 'scene-3d',
    },
    {
      id: 'materials',
      title: 'Материалы',
      term: 'StandardMaterial3D',
      summary:
        'Материал задаёт внешний вид: цвет (albedo), шероховатость (roughness), металличность (metallic), свечение (emission).',
      why:
        'Один материал на десять объектов — и сцена выглядит цельной. Создавать материал для каждого объекта — верный признак неопытного проекта.',
      details: [
        'Создайте ресурс StandardMaterial3D и переиспользуйте его: перетащите в поле Material нескольких узлов.',
        'roughness 0 — зеркало, 1 — матовое. metallic 1 — металл.',
        'emission + emission_energy — собственное свечение, не зависит от света.',
        'Для «мультяшного» вида есть preset Toon (есть в 4.x как отдельный шейдерный материал).',
        'Стандартный материал физически-корректный: без HDR-окружения металл будет чёрным.',
      ],
    },
    {
      id: 'movement3d',
      title: 'Движение в 3D',
      term: 'CharacterBody3D',
      summary:
        'Тот же принцип, что в 2D: CharacterBody3D, velocity и move_and_slide(), но в трёх измерениях.',
      why:
        'Перенос 2D-контроллера в 3D — самый быстрый способ понять, что 3D-логика не сложнее. Разница только в том, по какой плоскости вы двигаетесь.',
      details: [
        'Горизонтальное движение: velocity.x и velocity.z, вертикаль — velocity.y.',
        'Направление «вперёд» для персонажа: -transform.basis.z.',
        'Для персонажа от первого лица камера — отдельный узел (или SpringArm3D).',
        'Вращение мышью: InputEventMouseMotion.relative — движение мыши в пикселях за кадр.',
        'Поворот тела по горизонтали, наклон камеры по вертикали — так управление не «переворачивается».',
      ],
      diagramRef: 'scene-3d',
    },
    {
      id: 'raycast3d',
      title: 'Raycast3D: выстрелы и «взгляд»',
      term: 'RayCast3D',
      summary:
        'Луч из узла в направлении target_position. Сообщает, что пересёк и где.',
      why:
        'Это основа интерактивности в 3D: выстрел, наведение курсора, проверка «видит ли враг игрока».',
      details: [
        'Луч обновляется в _physics_process.',
        'is_colliding(), get_collider(), get_collision_point(), get_collision_normal().',
        'Чтобы луч смотрел по направлению камеры, направьте его вдоль -camera.global_transform.basis.z.',
        'Длина луча — это target_position по умолчанию (100 — метров в Godot, не пикселей).',
        'В 3D один «метр» — условная единица. Масштаб сцены вы выбираете сами.',
      ],
    },
  ],
  steps: [
    {
      id: 's9-1',
      title: 'Создать 3D-сцену',
      where: 'Scene → New Scene → 3D Scene',
      action:
        'Создайте сцену с корнем Node3D. Добавьте Camera3D, DirectionalLight3D и WorldEnvironment.',
      result: 'В 3D-редакторе виден серый фон и пустое пространство.',
      note: 'С корнем Node3D, а не CharacterBody3D: сначала соберите мир, потом добавляйте игрока.',
      diagramRef: 'scene-3d',
    },
    {
      id: 's9-2',
      title: 'Собрать пол и стены',
      where: 'Add Child Node → MeshInstance3D',
      action:
        'Добавьте MeshInstance3D, в свойстве Mesh выберите BoxMesh, задайте Size = Vector3(20, 1, 20). Затем рядом добавьте StaticBody3D с CollisionShape3D (BoxShape3D того же размера).',
      result: 'В сцене видны пол и объёмные стены.',
      note:
        'Меш и коллизия — два отдельных узла. Забыть CollisionShape3D — самая частая ошибка: объект виден, но сквозь него можно пройти.',
    },
    {
      id: 's9-3',
      title: 'Включить свет и небо',
      where: 'DirectionalLight3D + WorldEnvironment',
      action:
        'У DirectionalLight3D поверните наклон на -45° по X. В WorldEnvironment создайте ресурс Environment: Background → Sky, а в Sky — ProceduralSkyMaterial.',
      result: 'Сцена освещена, видно небо и тени.',
      note: 'Если сцена чёрная — проверьте, что у DirectionalLight3D включено Shadows, а у WorldEnvironment задан ресурс Environment.',
    },
    {
      id: 's9-4',
      title: 'Сделать материал',
      where: 'Inspector → Material → New StandardMaterial3D',
      action:
        'Создайте материал, задайте Albedo Color. Сохраните его как отдельный ресурс (в поле внизу выберите New → StandardMaterial3D) и переиспользуйте на всех объектах.',
      result: 'Объекты имеют общий материал и выглядят одинаково.',
    },
    {
      id: 's9-5',
      title: 'Управление камерой мышью',
      where: 'Скрипт игрока, функция _unhandled_input',
      action:
        'Ловите InputEventMouseMotion и поворачивайте камеру: rotation.y по горизонтали, rotation.x по вертикали (ограничьте сверху и снизу).',
      result: 'Камера поворачивается за мышью.',
      note:
        'Ограничивайте наклон по X: без ограничения игрок «переворачивает» камеру вверх ногами.',
      diagramRef: 'scene-3d',
    },
    {
      id: 's9-6',
      title: 'Захват мыши',
      where: 'Project Settings → Display → Input → Mouse',
      action:
        'В Input Map добавьте действие "toggle_mouse" (Escape). При входе в игру ставьте Input.mouse_mode = Input.MOUSE_MODE_CAPTURED, по Escape — возвращайте MOUSE_MODE_VISIBLE.',
      result: 'Мышь не вылетает из окна, Escape работает.',
      note: 'В веб-экспорте захват мыши не поддерживается — это ограничение платформы, а не ошибка.',
    },
    {
      id: 's9-7',
      title: 'Выстрел лучом',
      where: 'RayCast3D',
      action:
        'Добавьте RayCast3D в камеру, задайте target_position = Vector3(0, 0, -50). По нажатию «fire» проверяйте is_colliding() и печатайте имя цели.',
      result: 'Луч находит объект и печатает его имя.',
    },
    {
      id: 's9-8',
      title: 'Проверить гравитацию',
      where: 'CharacterBody3D',
      action:
        'Добавьте CharacterBody3D с CollisionShape3D (CapsuleShape3D). В _physics_process добавляйте velocity.y -= 9.8 * delta, затем move_and_slide().',
      result: 'Персонаж падает на пол и стоит на нём.',
      note: 'В 3D принято ускорение 9.8, а не «пиксели в секунду» — но в Godot это просто число, задайте удобную вам скорость.',
    },
  ],
  code: [
    {
      id: 'fps-controller',
      title: 'Контроллер от первого лица',
      file: 'res://player_3d.gd',
      language: 'gdscript',
      code: `class_name Player3D
extends CharacterBody3D

const SPEED := 6.0
const JUMP_VELOCITY := 5.0
const GRAVITY := 18.0
const MOUSE_SENSITIVITY := 0.0025

@onready var camera: Camera3D = $Camera3D

var _gravity: float = GRAVITY

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		var motion := event as InputEventMouseMotion
		rotate_y(-motion.relative.x * MOUSE_SENSITIVITY)
		camera.rotation.x = clampf(
			camera.rotation.x - motion.relative.y * MOUSE_SENSITIVITY,
			-PI / 2.0 + 0.05,
			PI / 2.0 - 0.05
		)

func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= _gravity * delta
	else:
		velocity.y = 0.0

	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = JUMP_VELOCITY

	var input := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	var direction := (transform.basis * Vector3(input.x, 0.0, input.y)).normalized()
	if direction.length() > 1.0:
		direction = direction.normalized()
	velocity.x = direction.x * SPEED
	velocity.z = direction.z * SPEED
	move_and_slide()
`,
      explanation:
        'Ключевая деталь 3D-контроллера: направление движения считается в локальных координатах персонажа. `transform.basis * Vector3(...)` превращает «вправо-вперёд» в мировые координаты с учётом того, куда развёрнут игрок. Поворот разделён: тело вращается по горизонтали (`rotate_y`), а камера наклоняется по вертикали — так «вверх» всегда остаётся вверх. Гравитация — простое ускорение вниз, которое накапливается каждый кадр.',
      versionNote:
        'Input.MOUSE_MODE_CAPTURED и InputEventMouseMotion.relative доступны с Godot 4.x без изменений.',
    },
    {
      id: 'raycast-shoot',
      title: 'Выстрел лучом и попадание',
      file: 'res://shooter.gd',
      language: 'gdscript',
      code: `extends Node3D

@onready var camera: Camera3D = $Camera3D
@onready var ray: RayCast3D = $Camera3D/RayCast3D
@onready var muzzle: Marker3D = $Camera3D/Muzzle

signal target_hit(target: Node, point: Vector3)

func _ready() -> void:
	ray.target_position = Vector3(0.0, 0.0, -100.0)
	ray.collide_with_areas = true

func _process(_delta: float) -> void:
	# Луч всегда смотрит туда же, куда смотрит камера.
	ray.global_position = camera.global_position
	ray.global_basis = camera.global_basis

func shoot() -> bool:
	if not ray.is_colliding():
		return false
	var collider := ray.get_collider()
	var point := ray.get_collision_point()
	target_hit.emit(collider, point)
	return true

func muzzle_position() -> Vector3:
	return muzzle.global_position
`,
      explanation:
        'Луч — это объект с собственным положением и поворотом, поэтому каждый кадр мы синхронизируем его с камерой: позиция и базис. `target_hit` отдаёт и объект, и точку попадания — этого хватает и для визуального эффекта, и для расчёта урона. Marker3D используется как «точка вылета» снаряда: это узел без визуализации, который просто задаёт координату.',
      versionNote:
        'RayCast3D имеет свойство collide_with_areas — в Godot 4 оно включено по умолчанию, в Godot 3 было наоборот.',
    },
    {
      id: 'environment',
      title: 'Окружение, небо и материалы',
      file: 'res://world.gd',
      language: 'gdscript',
      code: `extends Node3D

@onready var world_environment: WorldEnvironment = $WorldEnvironment
@onready var sun: DirectionalLight3D = $DirectionalLight3D

func _ready() -> void:
	_setup_sky()
	_setup_light()
	_apply_ground_material()

func _setup_sky() -> void:
	var environment := Environment.new()
	environment.background_mode = Environment.BG_SKY
	var sky := Sky.new()
	var sky_material := ProceduralSkyMaterial.new()
	sky_material.sky_top_color = Color(0.25, 0.45, 0.85)
	sky_material.ground_bottom_color = Color(0.35, 0.32, 0.28)
	sky_material.ground_horizon_color = Color(0.6, 0.6, 0.65)
	sky.sky_material = sky_material
	environment.sky = sky
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	environment.ambient_light_energy = 0.6
	environment.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	world_environment.environment = environment

func _setup_light() -> void:
	sun.rotation_degrees = Vector3(-45.0, -30.0, 0.0)
	sun.light_energy = 1.2
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 80.0

func _apply_ground_material() -> void:
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.28, 0.32, 0.25)
	material.roughness = 0.9
	material.metallic = 0.0
	var ground := $Ground as MeshInstance3D
	ground.material_override = material
`,
      explanation:
        'Окружение настраивается кодом, когда вы хотите, чтобы сцена выглядела одинаково при разных настройках проекта. Связка Environment → Sky → ProceduralSkyMaterial даёт небо, и ambient-освещение берётся из него же (`AMBIENT_SOURCE_SKY`). Тонмаппинг FILMIC смягчает пересветы. Материал земли задаётся через `material_override` — так он применится ко всем поверхностям узла.',
      versionNote:
        'Environment.tonemap_mode и AMBIENT_SOURCE_SKY существуют в Godot 4.x; в Godot 3 ambient настраивался иначе.',
    },
    {
      id: 'spring-arm',
      title: 'Камера с автоматическим отходом',
      file: 'res://orbit_camera.gd',
      language: 'gdscript',
      code: `extends Node3D

@onready var spring_arm: SpringArm3D = $SpringArm3D
@onready var camera: Camera3D = $SpringArm3D/Camera3D

@export var orbit_speed: float = 120.0
@export var zoom_speed: float = 2.0
@export var min_zoom: float = 2.0
@export var max_zoom: float = 12.0

var _angle := 0.0
var _distance := 6.0

func _process(delta: float) -> void:
	if Input.is_action_pressed("ui_right"):
		_angle -= orbit_speed * delta
	if Input.is_action_pressed("ui_left"):
		_angle += orbit_speed * delta
	if Input.is_action_pressed("ui_up"):
		_distance = max(_distance - zoom_speed * delta, min_zoom)
	if Input.is_action_pressed("ui_down"):
		_distance = min(_distance + zoom_speed * delta, max_zoom)

	spring_arm.rotation.y = deg_to_rad(_angle)
	spring_arm.spring_length = _distance
`,
      explanation:
        'SpringArm3D — «плечо», на котором висит камера. Оно само отодвигает камеру назад, если между ней и точкой крепления оказалась стена: длина пружины подстраивается автоматически. Это избавляет от классической проблемы «камера проваливается в стену». Здесь же реализовано орбитальное управление камерой — типичный режим для стратегий и симуляторов.',
      versionNote:
        'SpringArm3D появился в Godot 3.1 и доступен в Godot 4.x без изменений.',
    },
  ],
  tasks: [
    {
      id: 't9-1',
      title: 'Арена с препятствиями',
      description:
        'Соберите арену: пол, четыре стены, несколько кубов. Проверьте, что персонаж не проходит сквозь них.',
      level: 1,
      hint: 'Если проходит — у StaticBody3D нет CollisionShape3D.',
    },
    {
      id: 't9-2',
      title: 'Прыгающие кубы',
      description:
        'Сделайте 5 кубов, которые двигаются по кругу и прыгают. Используйте AnimationPlayer или Tween.',
      level: 2,
      hint: 'Tween с repeat и easing — проще, чем анимация для циклического движения.',
    },
    {
      id: 't9-3',
      title: 'Луч и метка',
      description:
        'По клику ставьте в точку попадания луча метку (MeshInstance3D с SphereMesh). Метка должна исчезать через 2 секунды.',
      level: 2,
      hint: 'Для исчезновения используйте await get_tree().create_timer(2.0).timeout, затем queue_free().',
    },
    {
      id: 't9-4',
      title: 'Несколько источников света',
      description:
        'Добавьте OmniLight3D с оранжевым цветом в углу арены и посмотрите, как меняется картинка. Затем включите тени у OmniLight3D и сравните.',
      level: 3,
      hint: 'У OmniLight3D есть свойство omni_range — радиус влияния.',
    },
    {
      id: 't9-5',
      title: 'От первого лица к виду сверху',
      description:
        'Сделайте переключение камеры по Tab: от первого лица к камере сверху, которая следует за игроком с задержкой.',
      level: 3,
      hint: 'Держите две камеры и переключайте current у нужной.',
    },
  ],
  project: {
    title: '3D-арена',
    brief:
      'Простая 3D-арена с видом от первого лица: пол, стены, коробки, освещение, небо, управление мышью и WASD, выстрелы лучом.',
    requirements: [
      'Сцена с полом, стенами и несколькими кубами (меш + коллизия у каждого).',
      'WorldEnvironment с небом и ambient, DirectionalLight3D с тенями.',
      'Персонаж от первого лица: WASD + мышь, гравитация, прыжок.',
      'Raycast3D по клику: попадание подсвечивает цель и печатает её имя.',
      'Общий материал для нескольких объектов — не создавайте материал на каждый куб.',
    ],
    stretch: [
      'Добавьте вторую камеру (вид сверху) с переключением по Tab.',
      'Сделайте интерактивные кубы: клик по кубу меняет его цвет (меняйте material_override).',
      'Добавьте простую навигацию: Sphere3D-враг преследует игрока, ориентируясь по вектору направления.',
    ],
  },
  criteria: [
    {
      id: 'c9-1',
      text: 'Знаю оси Godot и умею поворачивать узлы',
      check:
        'Объясняю, куда смотрит «вперёд» у Node3D, и могу повернуть узел на 90° вокруг Y и объяснить результат.',
    },
    {
      id: 'c9-2',
      text: 'Понимаю разницу между мешем и коллизией',
      check:
        'Объясняю, почему для каждого MeshInstance3D нужен отдельный CollisionShape3D, и показываю случай, когда объект виден, но не solid.',
    },
    {
      id: 'c9-3',
      text: 'Умею настроить свет и небо',
      check:
        'Объясняю, почему без DirectionalLight3D и WorldEnvironment сцена чёрная, и создаю Environment с небом.',
    },
    {
      id: 'c9-4',
      text: 'Умею двигать персонажа в 3D и поворачивать камеру мышью',
      check:
        'Пишу контроллер, где направление считается через transform.basis, и объясняю, зачем нужен этот множитель.',
    },
    {
      id: 'c9-5',
      text: 'Умею стрелять лучом и получать точку попадания',
      check:
        'Настраиваю RayCast3D, синхронизирую его с камерой и получаю collider и точку попадания.',
    },
    {
      id: 'c9-6',
      text: 'Переиспользую материалы и не создаю лишние ресурсы',
      check:
        'Показываю один ресурс StandardMaterial3D, назначенный нескольким узлам, и объясняю выигрыш.',
    },
  ],
  resources: [
    {
      title: '3D — официальный туториал (раздел 3D в документации)',
      url: 'https://docs.godotengine.org/en/stable/tutorials/3d/index.html',
      kind: 'docs',
    },
    {
      title: 'Справочник CharacterBody3D',
      url: 'https://docs.godotengine.org/en/stable/classes/class_characterbody3d.html',
      kind: 'reference',
    },
    {
      title: 'Справочник SpringArm3D',
      url: 'https://docs.godotengine.org/en/stable/classes/class_springarm3d.html',
      kind: 'reference',
    },
    {
      title: 'Справочник Environment',
      url: 'https://docs.godotengine.org/en/stable/classes/class_environment.html',
      kind: 'reference',
    },
  ],
  diagrams: ['scene-3d', 'collision-layers'],
  versionNotes: [
    {
      version: '4.0',
      text: 'RayCast3D по умолчанию collide_with_areas = true — в Godot 3 было наоборот. Это ломает скрипты, перенесённые из Godot 3.',
    },
    {
      version: '4.0',
      text: 'Процедурное небо и ambient в Godot 4 настраиваются через Environment и ProceduralSkyMaterial; в Godot 3 был Sky + PanoramaSkyMaterial.',
    },
  ],
}
