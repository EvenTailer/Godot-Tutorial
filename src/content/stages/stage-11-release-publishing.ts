import type { Stage } from '../types'

/**
 * Этап 11 — Релиз и публикация.
 * Цель этапа: превратить проект в игру, которую можно запустить у другого человека.
 */
export const stage11: Stage = {
  id: '11',
  number: 11,
  slug: '11-reliz-i-publikaciya',
  title: 'Релиз и публикация',
  shortTitle: 'Релиз и публикация',
  subtitle: 'Экспорт, сборка, распространение и чек-лист перед выпуском',
  weeks: '23',
  hours: 12,
  goal: 'Научиться собирать игру в исполняемый файл и выпускать её так, чтобы у другого человека она запустилась с первого раза.',
  outcome:
    'У вас есть собранная игра, установочные шаблоны под целевую платформу, работающая сборка и опубликованная страница проекта.',
  topics: [
    {
      id: 'export-basics',
      title: 'Экспорт: как это работает',
      term: 'Export Preset',
      summary:
        'Экспорт превращает проект в исполняемый файл. Пресет (preset) описывает настройки для одной платформы.',
      why:
        'Экспорт — это не «ещё одна кнопка». Здесь задаются размер окна, иконка, версия, подпись — то, что делает игру готовым продуктом, а не запуском из редактора.',
      details: [
        'Project → Export… («Проект → Экспорт…») открывает окно пресетов.',
        'Сначала нужны шаблоны экспорта: File → Manage Export Templates… и скачать их через интерфейс.',
        'Файлы шаблонов лежат в ~/.local/share/godot/export_templates/<версия>/ на Linux/macOS и в %APPDATA%\\Godot\\export_templates\\<версия>\\ на Windows.',
        'Экспортированная игра не содержит редактора — только игру и данные.',
        'Файлы пользователя (сохранения) лежат отдельно, в user://, и не попадают в сборку.',
      ],
      diagramRef: 'export-presets',
    },
    {
      id: 'release-settings',
      title: 'Настройки релиза',
      term: 'Project Settings',
      summary:
        'Перед экспортом: размер окна, имя приложения, версия, иконка, описание.',
      why:
        'Забытый размер окна или имя проекта «MyGame» — самая заметная ошибка на первой странице магазина.',
      details: [
        'Display → Window → Size: ширина и высота окна.',
        'Stretch → Mode: canvas_items (для 2D), viewport (для пиксель-арта), disabled.',
        'Application → Config → Name — имя игры в списке приложений.',
        'Application → Config → Version — строка версии, её читает get_setting("application/config/version").',
        'Application → Boot Splash → Image — заставка при запуске.',
        'Иконка проекта: Application → Config → Icon.',
      ],
    },
    {
      id: 'export-templates',
      title: 'Шаблоны экспорта',
      term: 'Export Templates',
      summary:
        'Шаблоны — это заранее собранный движок под каждую платформу. Без них экспорт не работает.',
      why:
        'Самый частый вопрос новичка: «я нажал Export, а он пишет, что нет шаблонов». Ответ всегда один — шаблоны нужно скачать.',
      details: [
        'Шаблоны — отдельная загрузка (~1 ГБ со всеми платформами), версия должна совпадать с версией движка.',
        'File → Manage Export Templates… → Download and Install.',
        'Версию движка видно в правом верхнем углу редактора.',
        'Если обновили движок — шаблоны тоже нужно обновить.',
        'Шаблоны можно положить в папку проекта в .godot/export_templates, чтобы версия была у всех в команде.',
      ],
      diagramRef: 'export-presets',
    },
    {
      id: 'platforms',
      title: 'Платформы: что реально сделать новичку',
      term: 'Platform',
      summary:
        'Windows, Linux, macOS экспортируются без дополнительных инструментов. Android и iOS требуют SDK.',
      why:
        'Реалистичные ожидания экономят недели: мобильный экспорт — это отдельная профессия, а десктопный — один файл.',
      details: [
        'Windows: .exe + .pck (или один .exe через Embed PCK).',
        'Linux: .x86_64 бинарник, chmod +x для запуска.',
        'macOS: .app или .dmg, нужен значок .icns.',
        'Web: HTML5-экспорт, работает в браузере. Ограничения: нет потоков в один поток, другие правила загрузки ресурсов.',
        'Android: нужен Android SDK, JDK и ключ подписи. iOS: нужна macOS с Xcode.',
        'Для учебного проекта достаточно Windows + Linux.',
      ],
    },
    {
      id: 'distribution',
      title: 'Куда выпускать',
      term: 'Distribution',
      summary:
        'itch.io — простой хостинг игр. Steam — магазин с требованиями к качеству. Свой сайт — полный контроль.',
      why:
        'Выпустить игру — часть обучения. Опубликованный проект — это портфолио, которое работает лучше любого резюме.',
      details: [
        'itch.io: загрузили zip — игра доступна по ссылке. Есть бесплатный тариф.',
        'Свой хостинг: положите файлы на любой статический хостинг, сделайте страницу с описанием.',
        'Steam: нужен пакет с метаданными, трейлерами, обложкой и страницей. Подача проходит модерацию.',
        'Снапшоты: itch.io и Steam позволяют выложить демо-версию до релиза.',
        'Пишите в описании, что это за игра и на что уйдёт 10 минут — это повышает конверсию в запуск.',
      ],
    },
    {
      id: 'release-checklist',
      title: 'Чек-лист перед выпуском',
      term: 'Release Checklist',
      summary:
        'Список проверок, который проходят перед каждой публикацией: от запуска на чужом компьютере до сохранений.',
      why:
        'Опытные разработчики публикуют не потому, что всё идеально, а потому, что у них есть чек-лист. Без него каждый релиз — лотерея.',
      details: [
        'Игра запускается на компьютере без Godot.',
        'Управление работает с клавиатуры и мыши, окно не меньше 1280×720.',
        'Сохранения работают: сохранить, выйти, запустить, загрузить.',
        'Нет ошибок в Output за обычный проход уровня.',
        'Есть меню паузы, выход в меню и понятное управление.',
        'Звук не оглушает, музыка играет, громкость настраивается.',
        'Игра выдерживает 10 минут без потери кадров.',
      ],
    },
  ],
  steps: [
    {
      id: 's11-1',
      title: 'Проверить настройки релиза',
      where: 'File → Project Settings → Display / Application',
      action:
        'Задайте размер окна 1280×720, имя приложения, версию 1.0.0, включите заставку и поставьте иконку.',
      result: 'В настройках проекта заполнены имя, версия, размер окна и иконка.',
      note: 'Размер окна — это то, что увидит покупатель в магазине. Подберите под своё разрешение.',
      diagramRef: 'export-presets',
    },
    {
      id: 's11-2',
      title: 'Скачать шаблоны экспорта',
      where: 'File → Manage Export Templates…',
      action:
        'Откройте окно, нажмите «Download and Install». Дождитесь загрузки (около гигабайта).',
      result: 'В окне появилась отметка о том, что шаблоны установлены.',
      note: 'Если версия движка обновилась — шаблоны нужно переустановить, иначе экспорт не запустится.',
      diagramRef: 'export-presets',
    },
    {
      id: 's11-3',
      title: 'Создать пресет',
      where: 'Project → Export… → Add… → Windows Desktop',
      action:
        'Добавьте пресет Windows Desktop. В настройках пресета укажите путь экспорта, включите «Export Project» для режима, задайте иконку и версию.',
      result: 'В списке появился пресет с настроенными параметрами.',
      note: 'Файл export_presets.cfg сохраняется в проекте — его нужно коммитить в Git, тогда у всей команды одинаковые настройки сборки.',
    },
    {
      id: 's11-4',
      title: 'Собрать игру',
      where: 'Project → Export… → Export Project',
      action:
        'Нажмите «Export Project», выберите папку и дождитесь сборки. В папке появятся .exe и .pck.',
      result: 'Появилась папка с игрой.',
      note: 'Файл .pck содержит все ресурсы. Если запускать без него — игра не найдёт данные.',
      diagramRef: 'export-presets',
    },
    {
      id: 's11-5',
      title: 'Проверить на чужом компьютере',
      where: 'Другой компьютер без Godot',
      action:
        'Скопируйте папку с игрой на другой компьютер (или в виртуальную машину) и запустите .exe.',
      result: 'Игра запустилась без Godot.',
      note: 'Это главная проверка релиза. Если игра требует Godot — значит, вы запускали проект из редактора, а не сборку.',
    },
    {
      id: 's11-6',
      title: 'Проверить сохранения в сборке',
      where: 'Папка user:// на другом компьютере',
      action:
        'В собранной игре сохраните прогресс, закройте игру, запустите снова и загрузите сохранение.',
      result: 'Сохранение читается из сборки.',
      note:
        'Помните: у каждого пользователя своя папка user://. Сохранение из вашей машины не попадёт на чужую.',
      diagramRef: 'project-structure',
    },
    {
      id: 's11-7',
      title: 'Сделать страницу проекта',
      where: 'Страница проекта на itch.io или своём хостинге',
      action:
        'Опишите игру: скриншот, короткое описание, управление, ссылка на скачивание. Загрузите zip с игрой.',
      result: 'Страница опубликована, по ссылке игра скачивается.',
      note: 'Скриншоты — единственное место, где допустимы растровые изображения. В интерфейсе самого сайта-гайда — только вектор.',
    },
    {
      id: 's11-8',
      title: 'Пройти чек-лист',
      where: 'Файл CHECKLIST.md в проекте',
      action:
        'Пройдите все пункты чек-листа и отметьте каждый. Непроверенный пункт — не отправляйте релиз.',
      result: 'Чек-лист пройден полностью, релиз готов.',
      note: 'Пункты, которые не прошли, — это ваш план на следующую неделю.',
    },
  ],
  code: [
    {
      id: 'export-preset',
      title: 'Файл пресетов экспорта',
      file: 'export_presets.cfg',
      language: 'ini',
      code: `[preset.0]

name="Windows Desktop"
platform="Windows Desktop"
runnable=true
advanced_options=false
dedicated_server=false
custom_features=""
export_filter="all_resources"
include_filter=""
exclude_filter="*.md, *.import"
export_path="build/windows/MyGame.exe"
patches=PackedStringArray()
encryption_include_filters=""
encryption_exclude_filters=""
seed=0
encrypt_pck=false
encrypt_directory=false
script_export_mode=2

[preset.0.options]

custom_template/debug=""
custom_template/release=""
debug/export_console_wrapper=0
binary_format/embed_pck=false
texture_format/s3tc_bptc=true
texture_format/etc2_astc=false
binary_format/architecture="x86_64"
`,
      explanation:
        'Файл export_presets.cfg — текстовый, его можно держать в Git: у всей команды одинаковые настройки сборки, включая путь экспорта и параметры сжатия текстур. Ключевые для новичка строки: export_path (куда собирать), export_filter (что включать — all_resources), embed_pck (встроить данные в .exe, чтобы был один файл) и script_export_mode (что делать со скриптами).',
      versionNote:
        'Содержимое файла зависит от версии движка: при обновлении Godot записи для старой версии подставляются заново.',
    },
    {
      id: 'build-info',
      title: 'Информация о сборке из настроек проекта',
      file: 'res://build_info.gd',
      language: 'gdscript',
      code: `extends RefCounted

static func version() -> String:
	return str(ProjectSettings.get_setting("application/config/version", "0.0.0"))

static func app_name() -> String:
	return str(ProjectSettings.get_setting("application/config/name", "Unnamed"))

static func is_debug_build() -> bool:
	return OS.is_debug_build()

static func describe() -> String:
	return "%s %s (%s)" % [
		app_name(),
		version(),
		"debug" if is_debug_build() else "release",
	]

static func window_size() -> Vector2i:
	var width: int = int(ProjectSettings.get_setting("display/window/size/viewport_width", 1280))
	var height: int = int(ProjectSettings.get_setting("display/window/size/viewport_height", 720))
	return Vector2i(width, height)

static func save_file_path(file_name: String) -> String:
	return "user://" + file_name
`,
      explanation:
        'Значения из Project Settings доступны и в рантайме — их читают через `ProjectSettings.get_setting`, а второй аргумент задаёт значение по умолчанию. `OS.is_debug_build()` различает отладочный и релизный запуск: в релизной сборке можно отключать дорогую отладку. Такой блок удобно повесить на экран «О программе» в меню.',
      versionNote:
        'ProjectSettings.get_setting возвращает Variant, поэтому значения приводятся к нужному типу через str() и int().',
    },
    {
      id: 'release-gate',
      title: 'Проверки перед релизом',
      file: 'res://release_check.gd',
      language: 'gdscript',
      code: `extends RefCounted

const SAVE_PATH := "user://save.json"

var problems: Array[String] = []

func run_all() -> bool:
	problems.clear()
	_check_save_path()
	_check_main_scene()
	_check_window_size()
	_check_no_debug_print()
	return problems.is_empty()

func _check_save_path() -> void:
	var dir := SAVE_PATH.get_base_dir()
	if not DirAccess.dir_exists_absolute(dir):
		problems.append("Нет папки сохранений: " + dir)

func _check_main_scene() -> void:
	var main_scene := str(ProjectSettings.get_setting("application/run/main_scene", ""))
	if main_scene.is_empty():
		problems.append("Не задана главная сцена")
	elif not ResourceLoader.exists(main_scene):
		problems.append("Главная сцена не найдена: " + main_scene)

func _check_window_size() -> void:
	var size := Vector2i(
		int(ProjectSettings.get_setting("display/window/size/viewport_width", 0)),
		int(ProjectSettings.get_setting("display/window/size/viewport_height", 0))
	)
	if size.x < 640 or size.y < 360:
		problems.append("Слишком маленькое окно: %dx%d" % [size.x, size.y])

func _check_no_debug_print() -> void:
	if OS.is_debug_build():
		return
	print("Проверки завершены, проблем: ", problems.size())
`,
      explanation:
        'Автоматические проверки перед релизом — это дешёвый способ поймать забытые мелочи: не задана главная сцена, окно меньше минимума, папка сохранений недоступна. Такой список можно запускать из меню «О программе» и показывать разработчику, а не игроку. В релизной сборке (OS.is_debug_build() == false) отладочный вывод не мешает.',
      versionNote:
        'ProjectSettings.get_setting с ключом application/run/main_scene работает во всех версиях Godot 4.x.',
    },
    {
      id: 'clean-release-folder',
      title: 'Сборка в отдельную папку',
      file: 'res://build_helper.gd',
      language: 'gdscript',
      code: `extends RefCounted

const BUILD_DIR := "user://build"

func prepare_build_dir() -> Error:
	if DirAccess.dir_exists_absolute(BUILD_DIR):
		var error := DirAccess.remove_absolute(ProjectSettings.globalize_path(BUILD_DIR))
		if error != OK:
			return error
	return DirAccess.make_dir_recursive_absolute(BUILD_DIR)

func write_readme(lines: PackedStringArray) -> Error:
	var file := FileAccess.open(BUILD_DIR.path_join("README.txt"), FileAccess.WRITE)
	if file == null:
		return FileAccess.get_open_error()
	for line in lines:
		file.store_line(line)
	file.close()
	return OK

func export_log_path() -> String:
	return BUILD_DIR.path_join("crash.log")
`,
      explanation:
        'Утилита, которая готовит папку сборки: очищает старую, создаёт новую и кладёт рядом README с управлением и подсказкой «куда писать отчёты об ошибках». Готовый отчёт об ошибке (crash log) — то, что вы будете благодарны получить от игрока, который столкнулся с багом.',
      versionNote:
        'DirAccess.make_dir_recursive_absolute и remove_absolute доступны в Godot 4.x.',
    },
  ],
  tasks: [
    {
      id: 't11-1',
      title: 'Сборка под две платформы',
      description:
        'Соберите игру под Windows и Linux. Запустите на Linux в виртуальной машине или через WSL.',
      level: 2,
      hint: 'Для Linux после сборки нужно выставить правый запуск: chmod +x имя_файла.',
    },
    {
      id: 't11-2',
      title: 'Один файл вместо двух',
      description:
        'Включите embed_pck и соберите игру одним .exe файлом. Проверьте, что размер вырос, а запуск не изменился.',
      level: 1,
      hint: 'Опция называется Embed PCK в настройках пресета.',
    },
    {
      id: 't11-3',
      title: 'Страница проекта',
      description:
        'Сделайте страницу с описанием игры, скриншотами и управлением. Опубликуйте на itch.io или своём хостинге.',
      level: 2,
      hint: 'Опишите игру в 2–3 предложениях: что это и на что уйдёт 10 минут.',
    },
    {
      id: 't11-4',
      title: 'Ловушка сохранений',
      description:
        'Проверьте, что сохранение не пишется рядом с .exe, а в user://. Найдите папку и покажите её путь.',
      level: 2,
      hint: 'Папка Program Files может быть доступна только для чтения — поэтому user:// и не лежит рядом.',
    },
    {
      id: 't11-5',
      title: 'Проверка на «чистом» компьютере',
      description:
        'Попросите друга запустить вашу сборку и запишите, что он понял из интерфейса игры без ваших пояснений.',
      level: 3,
      hint: 'Это самый честный тест интерфейса. Догадайтесь ли человек, что нажать?',
    },
  ],
  project: {
    title: 'Релиз собственной игры',
    brief:
      'Соберите игру в исполняемый файл, опубликуйте страницу проекта и проведите релиз по чек-листу.',
    requirements: [
      'Настроенные параметры релиза: имя, версия, размер окна, иконка, заставка.',
      'Установленные шаблоны экспорта и сохранённый в Git пресет.',
      'Сборка под Windows (и Linux, если получится).',
      'Проверка на компьютере без Godot: запуск, сохранение, звук, управление.',
      'Опубликованная страница проекта со скриншотами и описанием.',
    ],
    stretch: [
      'Сделайте демо-версию: ограничьте игру первым уровнем и выложите отдельно.',
      'Соберите версию с отладочным оверлеем FPS и номера сборки — только для себя.',
      'Напишите пост о разработке и выложите его рядом с игрой.',
    ],
  },
  criteria: [
    {
      id: 'c11-1',
      text: 'Понимаю, как устроен экспорт и зачем нужны шаблоны',
      check:
        'Объясняю роль export_presets.cfg, шаблонов экспорта и папки .godot, и собираю игру без ошибок.',
    },
    {
      id: 'c11-2',
      text: 'Задал параметры релиза: имя, версия, окно, иконка',
      check:
        'Покажу скриншот Project Settings, где заполнены все пять полей.',
    },
    {
      id: 'c11-3',
      text: 'Игра запускается на компьютере без Godot',
      check:
        'Проверю на чужой машине или в виртуальной и покажу скриншот запуска.',
    },
    {
      id: 'c11-4',
      text: 'Знаю, где лежат сохранения пользователя и почему не рядом с игрой',
      check: 'Найду папку user:// на своём компьютере и объясню, почему она там.',
    },
    {
      id: 'c11-5',
      text: 'Прошёл чек-лист релиза целиком',
      check: 'Отмечу каждый пункт списка и напишу, что исправил по итогам.',
    },
    {
      id: 'c11-6',
      text: 'Опубликовал игру и умею описать её за 10 секунд',
      check:
        'Покажу страницу проекта и скажу вслух описание, которое прочитает новый посетитель.',
    },
  ],
  resources: [
    {
      title: 'Экспорт — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/export/index.html',
      kind: 'docs',
    },
    {
      title: 'Экспорт для веба — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html',
      kind: 'docs',
    },
    {
      title: 'itch.io — хостинг игр',
      url: 'https://itch.io/docs/creators/getting-started',
      kind: 'tool',
    },
    {
      title: 'Справочник ProjectSettings',
      url: 'https://docs.godotengine.org/en/stable/classes/class_projectsettings.html',
      kind: 'reference',
    },
  ],
  diagrams: ['export-presets', 'project-structure'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Формат export_presets.cfg в Godot 4 отличается от Godot 3: часть опций переехала, часть переименована.',
    },
    {
      version: '4.0',
      text: 'Веб-экспорт требует наличия потоков в браузере; для старых браузеров есть отдельный пресет без потоков.',
    },
  ],
}
