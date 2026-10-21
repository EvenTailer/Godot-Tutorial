import type { Stage } from '../types'

/**
 * Этап 12 — Финальный проект.
 * Цель этапа: собрать всё вместе — маленькую, но законченную игру,
 * которую можно показать другим людям.
 */
export const stage12: Stage = {
  id: '12',
  number: 12,
  slug: '12-finalnyy-proekt',
  title: 'Финальный проект',
  shortTitle: 'Финальный проект',
  subtitle: 'Собрать законченную игру: от дизайн-замысла до публикации',
  weeks: '24',
  hours: 20,
  goal: 'Собрать небольшую законченную игру, используя всё, что вы прошли за 24 недели.',
  outcome:
    'Есть законченная игра: заставка, меню, игровой уровень, победа и поражение, сохранения, звук и опубликованная страница.',
  topics: [
    {
      id: 'design-doc',
      title: 'Дизайн-документ: одна страница',
      term: 'Design Document',
      summary:
        'Короткий документ: что за игра, как в неё играть, из чего состоит код, что точно будет, а что — нет.',
      why:
        'Без одной страницы текста проект расползается: появляются новые механики, и игра никогда не заканчивается. Документ — это способ сказать «стоп».',
      details: [
        'Одна страница. Если не влезает — вы ещё не определили игру.',
        'Разделы: идея, управление, правила, состав сцен, из чего НЕ делаем.',
        'Список «не делаем» — самый полезный раздел: он экономит недели.',
        'Пишется до кода и меняется только через решение в DECISIONS.',
        'Дайте прочитать кому-нибудь: непонимание читателя = проблема текста, а не читателя.',
      ],
      diagramRef: 'final-project-architecture',
    },
    {
      id: 'scope',
      title: 'Правило минимальной игры',
      term: 'Scope',
      summary:
        'Игра с одной механикой, доведённой до конца, лучше, чем игра с десятью механиками, доведёнными до половины.',
      why:
        'Финальный проект — не про количество, а про завершённость. Один прыгающий мяч, который можно пройти, обучает больше, чем десять недоделок.',
      details: [
        'Одна cores-механика: то, без чего игра не работает.',
        'Одна дополнительная: та, что делает её интересной.',
        'Один «фишка-вишенка»: то, что запомнится.',
        'Всё остальное — в списке «не делаем».',
        'Правило: если фича не работает за час, она уходит в «на потом».',
      ],
    },
    {
      id: 'plan',
      title: 'План работ по шагам',
      term: 'Milestone',
      summary:
        'Разбейте финальный проект на 5–7 шагов, каждый из которых заканчивается работающей версией.',
      why:
        '«Сделать игру» — это не задача, а мечта. Задача: «через два часа мяч прыгает по полу и есть кнопка Play».',
      details: [
        'Шаг = работающая версия, которую можно запустить и показать.',
        'Шаги: каркас → движение → взаимодействие → интерфейс → полировка → звук → релиз.',
        'После каждого шага — коммит в Git.',
        'Если шаг не работает — следующий шаг не начинается.',
        'Оценивайте шаг в часах: шаг на 4 часа — нормальный.',
      ],
      diagramRef: 'final-project-architecture',
    },
    {
      id: 'integration',
      title: 'Сборка всего вместе',
      term: 'Integration',
      summary:
        'Соедините модули: автолоад-сервисы, компоненты, ресурсы, сцены и интерфейс.',
      why:
        'Финальный проект проверяет не отдельные навыки, а умение собрать их вместе так, чтобы они не мешали друг другу.',
      details: [
        'Сервисы (счёт, сохранения, звук) — в автолоадах.',
        'Игровые сущности — компонентами внутри сцен.',
        'Данные (предметы, уровни) — ресурсами.',
        'Интерфейс — отдельные сцены поверх игровых.',
        'Переходы между сценами — только через сервис, а не напрямую.',
      ],
      diagramRef: 'autoload-architecture',
    },
    {
      id: 'polish',
      title: 'Полировка',
      term: 'Polish',
      summary:
        'Финальный проход: звук, анимации, обратная связь, текст, заставка, удобные настройки.',
      why:
        'Полировка поднимает восприятие сильнее, чем новые механики. Именно её замечают в отзывах.',
      details: [
        'Каждое действие имеет звук.',
        'Каждое действие имеет визуальную обратную связь.',
        'Тексты написаны без ошибок и без «текста ради текста».',
        'Есть заставка, меню, пауза и понятное управление.',
        'Есть настройки громкости и, желательно, переключатель эффектов.',
      ],
    },
    {
      id: 'retrospective',
      title: 'Разбор: что получилось',
      term: 'Retrospective',
      summary:
        'После релиза — короткий разбор: что было сложно, что оказалось ненужным, что вы теперь умеете.',
      why:
        'Без разбора опыт просто «пролетает». С разбором вы понимаете, почему стали лучше, — и это видно в следующем проекте.',
      details: [
        'Что было сложнее всего и почему.',
        'Какая функция/система оказалась лишней.',
        'Что я теперь делаю иначе.',
        'Что бы я убрал из проекта при следующей попытке.',
        'Куда я двигаюсь дальше: 2D, 3D, шейдеры, геймдизайн.',
      ],
    },
  ],
  steps: [
    {
      id: 's12-1',
      title: 'Написать дизайн-документ',
      where: 'Файл DESIGN.md в папке проекта',
      action:
        'Опишите игру: идея, управление, правила, состав сцен, список «не делаем». Ограничьте себя одной страницей.',
      result: 'Есть документ, по которому видно, что игра закончится.',
      diagramRef: 'final-project-architecture',
    },
    {
      id: 's12-2',
      title: 'Разбить на шаги',
      where: 'Файл PLAN.md или задачи в Git',
      action:
        'Составьте 5–7 шагов, каждый заканчивается работающей версией. Оцените каждый в часах.',
      result: 'План, по которому можно работать, не теряясь.',
      note: 'Первый шаг должен быть самым маленьким: пустая сцена с кнопкой Play.',
    },
    {
      id: 's12-3',
      title: 'Собрать каркас',
      where: 'Папка проекта',
      action:
        'Создайте структуру папок: scenes/, scripts/, resources/, ui/. Сделайте главное меню и заставку.',
      result: 'Проект запускается и показывает меню.',
      diagramRef: 'final-project-architecture',
    },
    {
      id: 's12-4',
      title: 'Реализовать cores-механику',
      where: 'Игровая сцена',
      action:
        'Сделайте одну главную механику игры: то, без чего она не имеет смысла. Проверьте, что она работает и приятна.',
      result: 'Основной игровой цикл работает.',
      note: 'Не добавляйте вторую механику, пока первая не приносит удовольствия.',
      diagramRef: 'state-machine',
    },
    {
      id: 's12-5',
      title: 'Подключить интерфейс',
      where: 'Сцены UI',
      action:
        'Добавьте HUD, меню паузы, экран победы и поражения. Свяжите их с сервисами через сигналы.',
      result: 'Игра сообщает игроку всё, что происходит.',
      diagramRef: 'ui-anchors',
    },
    {
      id: 's12-6',
      title: 'Добавить звук и обратную связь',
      where: 'Аудио-шины и Tween',
      action:
        'Звук на каждое действие, музыка на фон, тряска и вспышка на ключевых событиях.',
      result: 'Игра ощущается «живой».',
      diagramRef: 'audio-bus',
    },
    {
      id: 's12-7',
      title: 'Сделать сохранения',
      where: 'SaveManager',
      action:
        'Сохраняйте прогресс, уровень и рекорды. Проверьте, что сохранение переживает перезапуск.',
      result: 'Прогресс не теряется.',
      diagramRef: 'save-system',
    },
    {
      id: 's12-8',
      title: 'Провести полировку',
      where: 'Весь проект',
      action:
        'Пройдите игру целиком, выписывая всё, что «не так». Исправьте по одному пункту за раз.',
      result: 'Список замечаний превращается в пул задач.',
      note: 'Полировка — это 20% работы, но видно её в 80% впечатления.',
    },
    {
      id: 's12-9',
      title: 'Выпустить и разобрать',
      where: 'Сборка, страница проекта, файл RETRO.md',
      action:
        'Соберите игру, опубликуйте страницу, напишите разбор: что было сложно и что вы теперь умеете.',
      result: 'Игра выпущена, опыт зафиксирован.',
    },
  ],
  code: [
    {
      id: 'final-architecture',
      title: 'Архитектура финального проекта',
      file: 'res://autoload/game_director.gd',
      language: 'gdscript',
      code: `extends Node

signal level_loaded(level_id: String)
signal game_won(score: int)
signal game_lost(reason: String)

const LEVELS := {
	"forest": "res://scenes/levels/forest.tscn",
	"cave": "res://scenes/levels/cave.tscn",
}

var current_level: String = ""
var score: int = 0
var _loaded: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func start_game() -> void:
	score = 0
	_loaded = false
	_load_level("forest")

func _load_level(level_id: String) -> void:
	if not LEVELS.has(level_id):
		push_error("Неизвестный уровень: " + level_id)
		return
	var path := str(LEVELS[level_id])
	if not ResourceLoader.exists(path):
		push_error("Файл уровня не найден: " + path)
		return
	current_level = level_id
	get_tree().change_scene_to_file(path)
	level_loaded.emit(level_id)

func add_score(points: int) -> void:
	score += points

func win_level() -> void:
	game_won.emit(score)

func lose(reason: String) -> void:
	game_lost.emit(reason)

func restart_level() -> void:
	_load_level(current_level)

func to_menu() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

func save_path(slot: int) -> String:
	return "user://save_slot_%d.json" % slot
`,
      explanation:
        'Архитектура финального проекта в одном файле. Сервис-директор знает, какие уровни существуют (словарь путей), и умеет их загружать, перезапускать и выходить в меню. Он не знает, что происходит внутри уровня — только «победили» и «проиграли». Проверки `ResourceLoader.exists` и `LEVELS.has` превращают опечатку в понятное сообщение в консоли, а не в краш посреди игры. `PROCESS_MODE_ALWAYS` нужен, чтобы сервис работал и на паузе.',
      versionNote:
        'PROCESS_MODE_ALWAYS доступен в Godot 4.0+ (в Godot 3 пауза обрабатывалась через pause_mode).',
    },
    {
      id: 'final-game-loop',
      title: 'Игровой цикл состояний',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `class_name FinalPlayer
extends CharacterBody2D

enum State {
	IDLE,
	RUN,
	JUMP,
	FALL,
	HURT,
	DEAD,
}

signal state_changed(new_state: State)
signal health_changed(value: int)

const SPEED := 240.0
const JUMP_VELOCITY := 430.0
const GRAVITY := 1500.0

var state: State = State.IDLE:
	set(value):
		if value == state:
			return
		state = value
		state_changed.emit(value)

var health: int = 3
var _was_on_floor := false

func _physics_process(delta: float) -> void:
	match state:
		State.IDLE:
			_process_idle(delta)
		State.RUN:
			_process_run(delta)
		State.JUMP, State.FALL:
			_process_air(delta)
		State.HURT, State.DEAD:
			_process_dead(delta)
	move_and_slide()
	_update_air_state()

func _process_idle(_delta: float) -> void:
	velocity.x = move_toward(velocity.x, 0.0, SPEED * 4.0 * _delta)
	if Input.is_action_just_pressed("jump"):
		_jump()

func _process_run(delta: float) -> void:
	var direction := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	velocity.x = direction.x * SPEED
	if Input.is_action_just_pressed("jump"):
		_jump()

func _process_air(delta: float) -> void:
	velocity.y += GRAVITY * delta
	velocity.y = min(velocity.y, 800.0)

func _process_dead(delta: float) -> void:
	velocity.x = move_toward(velocity.x, 0.0, SPEED * 2.0 * delta)
	velocity.y += GRAVITY * delta

func _jump() -> void:
	velocity.y = -JUMP_VELOCITY
	state = State.JUMP

func _update_air_state() -> void:
	if is_on_floor():
		if state == State.JUMP or state == State.FALL:
			state = State.IDLE
		_was_on_floor = true
	else:
		if _was_on_floor:
			state = State.FALL
		_was_on_floor = false

func take_damage(amount: int = 1) -> void:
	if state == State.DEAD:
		return
	health = max(health - amount, 0)
	health_changed.emit(health)
	if health == 0:
		state = State.DEAD
	else:
		state = State.HURT
`,
      explanation:
        'Явная машина состояний вместо набора булевых флагов. Каждое состояние обрабатывается в своей ветке `match` — так видно, что происходит в игре, и невозможно случайно оказаться в двух состояниях сразу. Переходы выполняются через присваивание `state`, а сеттер сообщает об этом подписчикам: анимация, звук и HUD подписаны на `state_changed` и ничего не знают о внутренней логике. Обратите внимание на `_update_air_state()`: переход JUMP → FALL происходит по факту отрыва от земли, а не по таймеру.',
      versionNote:
        'Сеттер свойства с проверкой «если значение не изменилось — выходим» — стандартный приём Godot 4, в Godot 3 такого сеттера не было.',
    },
    {
      id: 'final-save',
      title: 'Сохранение и загрузка финальной игры',
      file: 'res://autoload/save_system.gd',
      language: 'gdscript',
      code: `extends Node

signal saved(slot: int)
signal loaded(slot: int)

const SAVE_VERSION := 2
const SLOT_COUNT := 3

var _slots: Dictionary[int, Dictionary] = {}

func _ready() -> void:
	_scan_slots()

func _scan_slots() -> void:
	_slots.clear()
	for slot in range(SLOT_COUNT):
		var data := _read_slot(slot)
		if not data.is_empty():
			_slots[slot] = data

func save_slot(slot: int, state: Dictionary) -> bool:
	if slot < 0 or slot >= SLOT_COUNT:
		return false
	var payload := {
		"version": SAVE_VERSION,
		"saved_at": Time.get_datetime_string_from_system(),
		"state": state,
	}
	var file := FileAccess.open(_path(slot), FileAccess.WRITE)
	if file == null:
		push_error("Не удалось сохранить слот %d" % slot)
		return false
	file.store_string(JSON.stringify(payload, "\t"))
	file.close()
	_slots[slot] = state
	saved.emit(slot)
	return true

func load_slot(slot: int) -> Dictionary:
	if not _slots.has(slot):
		return {}
	var data := _read_slot(slot)
	if data.is_empty():
		return {}
	loaded.emit(slot)
	return data

func has_slot(slot: int) -> bool:
	return _slots.has(slot)

func delete_slot(slot: int) -> void:
	var path := _path(slot)
	if FileAccess.file_exists(path):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(path))
	_slots.erase(slot)

func slot_info(slot: int) -> Dictionary:
	if not _slots.has(slot):
		return {}
	return {
		"score": int(_slots[slot].get("score", 0)),
		"level": str(_slots[slot].get("level", "")),
	}

func _path(slot: int) -> String:
	return "user://save_slot_%d.json" % slot

func _read_slot(slot: int) -> Dictionary:
	var path := _path(slot)
	if not FileAccess.file_exists(path):
		return {}
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return {}
	var text := file.get_as_text()
	file.close()
	var parsed: Variant = JSON.parse_string(text)
	if not (parsed is Dictionary):
		push_warning("Слот %d повреждён" % slot)
		return {}
	var payload := parsed as Dictionary
	if int(payload.get("version", 0)) != SAVE_VERSION:
		return {}
	var state: Variant = payload.get("state", {})
	return state if state is Dictionary else {}
`,
      explanation:
        'Финальная версия сохранений: три слота, версия формата, безопасная обработка повреждённых файлов. Слоты индексируются в словаре — состояние слота читается из файла только один раз при старте, дальше работа идёт с памятью. Каждая проверка возвращает пустой словарь вместо исключения: битый слот — это «слот пуст», а не падение игры.',
      versionNote:
        'Time.get_datetime_string_from_system() в Godot 4.2+ принимает необязательный параметр use_utc.',
    },
  ],
  tasks: [
    {
      id: 't12-1',
      title: 'Дизайн-документ на одну страницу',
      description:
        'Опишите игру: идея, управление, правила, состав сцен, список «не делаем». Покажите документ кому-нибудь и послушайте вопросы.',
      level: 2,
      hint: 'Вопросы читателя — это и есть список непонятных мест в документе.',
    },
    {
      id: 't12-2',
      title: 'План на 5 шагов',
      description:
        'Разбейте игру на 5 шагов с работающим результатом на каждом. Оцените шаги в часах и сравните с реальностью.',
      level: 2,
      hint: 'Первый шаг — «пустая сцена и кнопка Play».',
    },
    {
      id: 't12-3',
      title: 'Скелет архитектуры',
      description:
        'Создайте папку проекта и автолоады-сервисы: директор, сохранения, счёт. Проверьте, что они переживают смену сцены.',
      level: 2,
      hint: 'Регистрация автолоадов — Project Settings → Autoload.',
    },
    {
      id: 't12-4',
      title: 'Полировка по списку',
      description:
        'Пройдите игру и записывайте всё, что «не так». Исправьте 10 пунктов. Не начинайте новых механик, пока список не пуст.',
      level: 3,
      hint: 'Один пункт — один коммит.',
    },
    {
      id: 't12-5',
      title: 'Публикация и разбор',
      description:
        'Выпустите игру, опубликуйте страницу с описанием и скриншотами, напишите разбор на полстраницы.',
      level: 2,
      hint: 'Что было сложнее всего и что вы теперь делаете иначе?',
    },
  ],
  project: {
    title: 'Финальная игра',
    brief:
      'Маленькая законченная игра: одна cores-механика, доведённая до конца, с меню, HUD, звуком, сохранениями и публикацией.',
    requirements: [
      'Дизайн-документ на одну страницу и план работ на 5–7 шагов.',
      'Игра запускается с заставки, проходится до победы и до поражения.',
      'Автолоады-сервисы: директор, сохранения, счёт (или звук).',
      'Сохранения работают: сохранить, выйти, запустить, загрузить.',
      'Звук на ключевые события, музыка на фоне, настройка громкости.',
      'Собранный исполняемый файл и опубликованная страница проекта.',
      'Файл RETRO.md с разбором: что было сложно и что вы теперь умеете.',
    ],
    stretch: [
      'Добавьте вторую механику — только после того, как первая доведена.',
      'Сделайте редактор уровней прямо в игре (через сохранение сетки в JSON).',
      'Сделайте веб-версию и выложите её по ссылке.',
    ],
  },
  criteria: [
    {
      id: 'c12-1',
      text: 'Могу описать свою игру на одной странице и сказать, чего в ней не будет',
      check:
        'Покажу документ и назову три вещи, которые сознательно не делаю, и объясню почему.',
    },
    {
      id: 'c12-2',
      text: 'Умею разбивать большую задачу на шаги с работающим результатом',
      check:
        'Покажу план из 5–7 шагов и скажу, что запускается после каждого.',
    },
    {
      id: 'c12-3',
      text: 'Собрал проект из модулей: сервисы, компоненты, ресурсы, сцены',
      check:
        'Покажу структуру папок и объясню, где что лежит и почему.',
    },
    {
      id: 'c12-4',
      text: 'Игра доведена до конца: есть победа, поражение и сохранение',
      check:
        'Пройду игру от заставки до экрана победы и покажу, что прогресс переживает перезапуск.',
    },
    {
      id: 'c12-5',
      text: 'Провёл полировку по списку замечаний',
      check: 'Покажу список из 10 пунктов и 10 коммитов с исправлениями.',
    },
    {
      id: 'c12-6',
      text: 'Опубликовал игру и умею рассказать о ней за минуту',
      check:
        'Проведу «питч» вслух: что это, в чём фишка, за сколько минут проходится.',
    },
    {
      id: 'c12-7',
      text: 'Знаю, что я теперь умею и куда двигаюсь дальше',
      check:
        'Напишу разбор: три конкретных навыка, которые выросли, и следующий проект.',
    },
  ],
  resources: [
    {
      title: 'Туториал «Ваша первая 2D-игра» — эталон полного цикла',
      url: 'https://docs.godotengine.org/en/stable/tutorials/2d/2d_game.html',
      kind: 'docs',
      note: 'Пройдите его как проверку: увидите, какие шаги вы уже умеете.',
    },
    {
      title: 'Руководство по качеству кода Godot',
      url: 'https://docs.godotengine.org/en/stable/contributing/development_process/code_style.html',
      kind: 'docs',
    },
    {
      title: 'Демо-проекты Godot — готовые примеры',
      url: 'https://github.com/godotengine/godot-demo-projects',
      kind: 'tool',
      note: 'Смотрите, как устроены проекты, которые делала команда движка.',
    },
    {
      title: 'itch.io — как выложить игру',
      url: 'https://itch.io/docs/creators/getting-started',
      kind: 'tool',
    },
  ],
  diagrams: ['final-project-architecture', 'autoload-architecture', 'state-machine', 'save-system'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Финальные примеры используют типизированные словари и сеттеры свойств — возможности Godot 4.0.',
    },
  ],
}
