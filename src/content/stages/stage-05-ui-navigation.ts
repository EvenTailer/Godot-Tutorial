import type { Stage } from '../types'

/**
 * Этап 05 — UI и навигация.
 * Цель этапа: интерфейс, который не мешает игре и работает на мыши, клавиатуре и телефоне.
 */
export const stage05: Stage = {
  id: '05',
  number: 5,
  slug: '05-ui-i-navigaciya',
  title: 'UI и навигация',
  shortTitle: 'UI и навигация',
  subtitle: 'Control-узлы, якоря, экраны меню и переходы между сценами',
  weeks: '11–12',
  hours: 12,
  goal: 'Научиться строить интерфейс на Control-узлах, управлять экранами и переключать сцены.',
  outcome:
    'В игре есть HUD со счётом, экран паузы с кнопкой «Продолжить», главное меню и переход между сценами.',
  topics: [
    {
      id: 'control-nodes',
      title: 'Control-узлы: Label, Button, Panel',
      term: 'Control',
      summary:
        'Control — базовый узел интерфейса. Label — текст, Button — кнопка, Panel/PanelContainer — фон, TextureRect — картинка.',
      why:
        'Интерфейс — это 30% восприятия качества игры. Плюс в Godot интерфейс отделён от игрового мира: он живёт в CanvasLayer и не двигается вместе с камерой.',
      details: [
        'CanvasLayer — слой поверх всего; в нём живёт HUD.',
        'Control работает с «якорями» (anchors) и «отступами» (offsets).',
        'PanelContainer и MarginContainer автоматически подстраивают размер под содержимое — не надо считать пиксели.',
        'Label умеет авторазмер: autowrap_mode = TextServer.AUTOWRAP_WORD_SMART (значение 3). Значение 2 — это AUTOWRAP_WORD, он переносит по словам без учёта длинных слов.',
        'Theme — общая тема оформления, задаётся на корневом Control и наследуется вниз.',
      ],
      diagramRef: 'ui-anchors',
    },
    {
      id: 'anchors',
      title: 'Якоря и раскладка',
      term: 'Anchor',
      summary:
        'Якорь задаёт, к какой точке родителя привязан элемент. offsets задают смещение от якоря.',
      why:
        'Жёсткие координаты ломаются при изменении размера окна. Якоря — единственный способ сделать интерфейс, который одинаково выглядит на 360px и на 1920px.',
      details: [
        'Якоря задаются в Inspector: Anchor Left/Right/Top/Bottom (0..1).',
        'Пресеты: set_anchors_preset(Control.PRESET_FULL_RECT) — растянуть по родителю.',
        'PRESET_CENTER — по центру. PRESET_TOP_WIDE — по ширине сверху.',
        'Для центрированного окна: PRESET_CENTER + PRESET_MODE_KEEP_SIZE.',
        'Контейнеры (VBoxContainer, HBoxContainer, GridContainer) раскладывают детей сами.',
      ],
      diagramRef: 'ui-anchors',
    },
    {
      id: 'screens',
      title: 'Экраны и переходы между сценами',
      term: 'SceneTree.change_scene_to_file',
      summary:
        'Главное меню, игровой уровень и экран паузы — разные сцены. Переключение: get_tree().change_scene_to_file(path).',
      why:
        'Отдельные сцены для экранов дают чистую структуру и позволяют перезапускать уровень одной командой, а не «пересоздавать всё вручную».',
      details: [
        'change_scene_to_file("res://scenes/level_1.tscn") — ставит новую сцену главной.',
        'change_scene_to_packed(preload(...)) — вариант без повторной загрузки с диска.',
        'Старая сцена удаляется, новая создаётся заново — состояние не сохраняется.',
        'Пауза: get_tree().paused = true. Узлы с process_mode = PROCESS_MODE_WHEN_PAUSED продолжают работать (так делают меню паузы).',
        'Свою сцену можно показывать поверх: add_child поверх текущей, не трогая SceneTree.',
      ],
      diagramRef: 'scene-instancing',
    },
    {
      id: 'hud',
      title: 'HUD и связь с игрой',
      term: 'HUD',
      summary:
        'HUD — постоянный интерфейс поверх игры: здоровье, очки, миникарта.',
      why:
        'HUD обязан обновляться мгновенно при любом изменении состояния. Прямое обращение из HUD к игроку создаёт жёсткую связь — правильнее сигнал.',
      details: [
        'HUD — отдельная сцена (hud.tscn) с корнем CanvasLayer.',
        'Связь с игрой — через сигналы: игрок испускает health_changed, HUD на него подписан.',
        'ProgressBar для полоски здоровья, Label для чисел.',
        'CanvasLayer с layer = 10 рисуется поверх игрового мира.',
        'Чтобы HUD не перехватывал клики, поставьте его элементам mouse_filter = MOUSE_FILTER_IGNORE (кроме интерактивных).',
      ],
    },
    {
      id: 'input-ui',
      title: 'Управление интерфейсом и ввод',
      term: 'Control focus',
      summary:
        'Control-узлы умеют получать фокус с клавиатуры: стрелки переключают фокус, Enter нажимает кнопку.',
      why:
        'Интерфейс без клавиатурной навигации недоступен. Это и требование доступности, и просто удобство: в 90% игр меню открывают не трогая мышь.',
      details: [
        'Управление фокусом: ui_up, ui_down, ui_left, ui_right — стандартные действия.',
        'focus_mode = Control.FOCUS_ALL, чтобы узел мог получить фокус.',
        'Соседние узлы: focus_neighbor_top / focus_next.',
        ' grab_focus() — метод, который передаёт фокус нужному узлу (например, resume_button.grab_focus()). Свойства grabbed_focus в Godot нет.',
        'Скрытые и disabled-узлы пропускаются при переборе фокуса.',
      ],
      diagramRef: 'input-order',
    },
  ],
  steps: [
    {
      id: 's5-1',
      title: 'Создать сцену интерфейса',
      where: 'Scene → New Scene → Control Scene',
      action:
        'Создайте сцену hud.tscn с корнем CanvasLayer. Добавьте в него PanelContainer, а в него — Label и ProgressBar.',
      result: 'В сцене HUD есть контейнер с текстом и полоской.',
      note: 'CanvasLayer — правильный корень для HUD: он не зависит от камеры и рисуется поверх мира.',
      diagramRef: 'ui-anchors',
    },
    {
      id: 's5-2',
      title: 'Задать якоря',
      where: 'Inspector → Layout → Anchors Preset',
      action:
        'Для панели здоровья выберите пресет «Top Left», для центрального текста — «Center». Растягивающиеся элементы (фон на весь экран) — «Full Rect».',
      result: 'Элементы закреплены в нужных углах и не «уезжают» при изменении окна.',
      diagramRef: 'ui-anchors',
    },
    {
      id: 's5-3',
      title: 'Подключить HUD к игре',
      where: 'Скрипт player.gd и скрипт hud.gd',
      action:
        'В игроке уже есть сигнал health_changed. В HUD подпишитесь на него: найдите узел игрока и подключите сигнал к функции, которая ставит значение в ProgressBar и Label.',
      result: 'Полоска здоровья меняется при уроне.',
      note:
        'Связь «HUD → игрок» — слабая: HUD знает, где игрок, но игрок не знает про HUD. Так слои остаются независимыми.',
    },
    {
      id: 's5-4',
      title: 'Сделать экран паузы',
      where: 'Отдельная сцена pause_menu.tscn',
      action:
        'Создайте сцену с корнем Control (Full Rect) и кнопками «Продолжить», «Заново», «В меню». Прозрачный фон — ColorRect с alpha 0.6.',
      result: 'Готовый экран с тремя кнопками.',
      note: 'Включайте узлы ввода в режим «работает и на паузе»: Inspector → Process → Mode = When Paused.',
    },
    {
      id: 's5-5',
      title: 'Управление паузой',
      where: 'Скрипт main.gd',
      action:
        'Сначала создайте действие ввода "pause" в Project → Project Settings → Input Map (из коробки есть только ui_cancel) и привяжите к Escape. По нажатию действия "pause" переключайте get_tree().paused. В обработчике кнопки «Продолжить» — то же самое. Кнопка «Заново» вызывает get_tree().reload_current_scene().',
      result: 'Esc останавливает игру и открывает меню; «Продолжить» возвращает управление.',
      note: 'reload_current_scene() — самый чистый способ перезапустить уровень.',
    },
    {
      id: 's5-6',
      title: 'Главное меню',
      where: 'Project → Project Settings → Application → Run → Main Scene',
      action:
        'Создайте сцену main_menu.tscn, сделайте её главной в Project Settings. Кнопка «Играть» вызывает change_scene_to_file("res://scenes/level_1.tscn").',
      result: 'При запуске открывается меню, из которого можно попасть в игру.',
      note: 'Главная сцена одна на проект. Возврат в меню — change_scene_to_file("res://scenes/main_menu.tscn").',
      diagramRef: 'scene-instancing',
    },
    {
      id: 's5-7',
      title: 'Проверить фокус с клавиатуры',
      where: 'Клавиатура',
      action:
        'Запустите игру, нажмите Tab и стрелки. Убедитесь, что фокус обходит кнопки и что Enter нажимает активную кнопку.',
      result: 'Меню полностью управляется с клавиатуры.',
      note: 'Если фокус не двигается — у корневого Control проверьте focus_mode = All.',
    },
  ],
  code: [
    {
      id: 'hud',
      title: 'HUD, связанный с игроком через сигнал',
      file: 'res://hud.gd',
      language: 'gdscript',
      code: `extends CanvasLayer

@onready var health_bar: ProgressBar = $HealthPanel/HealthBar
@onready var health_label: Label = $HealthPanel/HealthLabel
@onready var score_label: Label = $ScoreLabel

var _player: Node = null

func bind(player: Node) -> void:
	_player = player
	player.health_changed.connect(_on_health_changed)
	player.score_changed.connect(_on_score_changed)
	_on_health_changed(player.health)
	_on_score_changed(player.score)

func _on_health_changed(value: int) -> void:
	health_bar.max_value = 100
	health_bar.value = value
	health_label.text = "HP: %d" % value

func _on_score_changed(value: int) -> void:
	score_label.text = "Очки: %d" % value
`,
      explanation:
        'HUD ничего не знает о физике и о том, как устроен игрок — он знает только про сигналы. Метод `bind()` вызывается из игрового узла один раз при старте. `max_value` задаётся перед `value`: иначе ProgressBar покажет неправильный процент. Разметка «HP: %d» собирается через оператор `%`, который не интерпретирует символы как код.',
      versionNote:
        'Строка "%d" в Godot 4 поддерживает целые числа; для дробных используйте "%f".',
    },
    {
      id: 'pause-menu',
      title: 'Меню паузы и перезапуск',
      file: 'res://pause_menu.gd',
      language: 'gdscript',
      code: `extends Control

@onready var resume_button: Button = %ResumeButton
@onready var restart_button: Button = %RestartButton
@onready var menu_button: Button = %MenuButton

func _ready() -> void:
	visible = false
	resume_button.pressed.connect(_on_resume)
	restart_button.pressed.connect(_on_restart)
	menu_button.pressed.connect(_on_to_menu)
	resume_button.grab_focus()

func _on_resume() -> void:
	get_tree().paused = false
	visible = false

func _on_restart() -> void:
	get_tree().paused = false
	get_tree().reload_current_scene()

func _on_to_menu() -> void:
	get_tree().paused = false
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

func open() -> void:
	visible = true
	resume_button.grab_focus()
`,
      explanation:
        'Два приёма, которые стоит запомнить. Первый: `grab_focus()` — сразу после открытия фокус встаёт на первую кнопку, иначе пользователю пришлось бы нажимать Tab. Второй: перед любым переходом снимается пауза — иначе следующая сцена загрузится «замороженной». Обратите внимание: `reload_current_scene()` пересоздаёт текущую сцену, сбрасывая её состояние.',
      versionNote:
        'Узлы с %-именем (Unique Name) доступны через get_node("%Name") — начиная с Godot 4.',
    },
    {
      id: 'main-menu',
      title: 'Главное меню с переходом между сценами',
      file: 'res://main_menu.gd',
      language: 'gdscript',
      code: `extends Control

const LEVEL_PATH := "res://scenes/level_1.tscn"

@onready var play_button: Button = %PlayButton
@onready var quit_button: Button = %QuitButton
@onready var title_label: Label = %TitleLabel

func _ready() -> void:
	play_button.pressed.connect(_on_play)
	quit_button.pressed.connect(_on_quit)
	play_button.grab_focus()
	title_label.pivot_offset = title_label.size / 2.0

func _on_play() -> void:
	get_tree().change_scene_to_file(LEVEL_PATH)

func _on_quit() -> void:
	get_tree().quit()

func _process(delta: float) -> void:
	title_label.rotation = sin(Time.get_ticks_msec() / 700.0) * 0.05
	title_label.pivot_offset = title_label.size / 2.0
`,
      explanation:
        'Меню — это отдельная сцена, которая просто меняется местами с игровой. Константа LEVEL_PATH вверху файла: поменяли путь — поменялось в одном месте. `pivot_offset` нужен, чтобы вращение шло вокруг центра текста, а не вокруг его левого верхнего угла. Обратите внимание: `Time.get_ticks_msec()` — это время с запуска игры, а не кадр.',
      versionNote:
        'get_tree().quit() корректно завершает и в редакторе (в экспортированной игре).',
    },
    {
      id: 'responsive-ui',
      title: 'Интерфейс, который тянется под разные экраны',
      file: 'res://responsive.gd',
      language: 'gdscript',
      code: `extends Control

@onready var panel: PanelContainer = %Panel
@onready var title: Label = %Title

func _ready() -> void:
	resized.connect(_on_resized)
	_on_resized()

func _on_resized() -> void:
	var compact := size.x < 640.0
	panel.offset_left = 16.0 if compact else 64.0
	panel.offset_right = -16.0 if compact else -64.0
	title.add_theme_font_size_override("font_size", 24 if compact else 36)
	title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_SIZE_CHANGED:
		_on_resized()
`,
      explanation:
        'Адаптивный интерфейс в Godot делается на трёх уровнях: (1) якоря растягивают элементы, (2) контейнеры умеют подстраивать размер, (3) для грубых различий (телефон против десктопа) добавляют собственную логику. Здесь при ширине меньше 640px панель прижимается к краям, а заголовок становится мельче и переносится по словам. `resized` — сигнал Control, который срабатывает при изменении размера.',
      versionNote:
        'Сигнал resized у Control и Window появился в Godot 4.0 (в Godot 3 был только сигнал size_changed у Window).',
    },
  ],
  tasks: [
    {
      id: 't5-1',
      title: 'Экран настроек',
      description:
        'Сделайте экран с громкостью (HSlider) и переключателем «полный экран» (CheckButton). Значения сохраняются в ConfigFile в user://settings.cfg.',
      level: 2,
      hint: 'ConfigFile — встроенный формат настроек Godot: load() и save() в user://.',
    },
    {
      id: 't5-2',
      title: 'HUD без жёстких координат',
      description:
        'Соберите HUD только на якорях и контейнерах. Потом измените размер окна игры в Project Settings и проверьте, что элементы не «поехали».',
      level: 1,
      hint: 'Если элемент сместился — у него не задан якорь или он лежит напрямую в Control без контейнера.',
    },
    {
      id: 't5-3',
      title: 'Клавиатурная навигация',
      description:
        'Добавьте в меню focus_neighbor у кнопок, чтобы стрелки двигали фокус в нужную сторону, а не по кругу.',
      level: 2,
      hint: 'Свойства focus_neighbor_top, focus_neighbor_bottom, focus_neighbor_left, focus_neighbor_right.',
    },
    {
      id: 't5-4',
      title: 'Экран загрузки',
      description:
        'Сделайте простой экран загрузки: при старте показывается Label «Загрузка…», затем через await timer сцена меняется на игровую.',
      level: 3,
      hint: 'Сначала покажите экран, потом await get_tree().process_frame, потом меняйте сцену — иначе экран не успеет отрисоваться.',
    },
  ],
  project: {
    title: 'Игра с полным интерфейсом',
    brief:
      'К играбельному уровню добавьте HUD, главное меню, экран паузы и экран конца игры. Переходы между ними — через смену сцен.',
    requirements: [
      'Главное меню: «Играть», «Настройки», «Выход».',
      'HUD: здоровье, очки, подсказка по управлению.',
      'Экран паузы: «Продолжить», «Заново», «В меню».',
      'Экран конца игры с итоговым счётом и кнопкой «Ещё раз».',
      'Всё управление с клавиатуры, всё читается на 360px ширины.',
    ],
    stretch: [
      'Добавьте экран настроек с сохранением в ConfigFile.',
      'Сделайте анимацию появления панелей через Tween.',
      'Добавьте локализацию: подписи вынесите в словарь и переключайте язык кнопкой.',
    ],
  },
  criteria: [
    {
      id: 'c5-1',
      text: 'Знаю, зачем интерфейс живёт в CanvasLayer',
      check: 'Объясняю, что произойдёт, если положить Label прямо в сцену уровня без CanvasLayer.',
    },
    {
      id: 'c5-2',
      text: 'Умею задавать якоря и рассчитывать раскладку',
      check:
        'Собираю экран из якорей и контейнеров и объясняю, что произойдёт при изменении размера окна.',
    },
    {
      id: 'c5-3',
      text: 'Умею переключать сцены и перезапускать уровень',
      check:
        'Пишу обработчик кнопки «Заново» и знаю разницу между reload_current_scene() и ручным удалением узлов.',
    },
    {
      id: 'c5-4',
      text: 'Умею ставить игру на паузу и делать так, чтобы меню работало',
      check: 'Объясняю, зачем узлу меню нужен process_mode = When Paused.',
    },
    {
      id: 'c5-5',
      text: 'Связываю интерфейс с игрой через сигналы, а не прямыми ссылками',
      check: 'Показываю, что HUD не обращается к полям игрока напрямую, а слушает сигналы.',
    },
    {
      id: 'c5-6',
      text: 'Могу пройти всё меню с клавиатуры',
      check: 'Запускаю игру и прохожу все экраны, не касаясь мыши.',
    },
  ],
  resources: [
    {
      title: 'GUI — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/ui/index.html',
      kind: 'docs',
    },
    {
      title: 'Control (справочник)',
      url: 'https://docs.godotengine.org/en/stable/classes/class_control.html',
      kind: 'reference',
    },
    {
      title: 'CanvasLayer (справочник)',
      url: 'https://docs.godotengine.org/en/stable/classes/class_canvaslayer.html',
      kind: 'reference',
    },
    {
      title: 'Несколько сцен в одном проекте',
      url: 'https://docs.godotengine.org/en/stable/tutorials/best_practices/scene_organization.html',
      kind: 'docs',
    },
  ],
  diagrams: ['ui-anchors', 'scene-instancing', 'input-order'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Control получил сигнал resized и методы set_anchors_preset / set_offsets_preset с пресетами.',
    },
    {
      version: '4.0',
      text: 'В Godot 4 у узлов Control появились уникальные имена (%Name) — они удобнее путей $Path.',
    },
  ],
}
