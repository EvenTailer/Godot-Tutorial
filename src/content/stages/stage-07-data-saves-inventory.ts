import type { Stage } from '../types'

/**
 * Этап 07 — Данные, сохранения, инвентарь.
 * Цель этапа: игра помнит прогресс и умеет считать предметы.
 */
export const stage07: Stage = {
  id: '07',
  number: 7,
  slug: '07-dannye-sohraneniya-inventar',
  title: 'Данные, сохранения, инвентарь',
  shortTitle: 'Данные и сохранения',
  subtitle: 'JSON, user://, Resource и модель инвентаря — игра, которая помнит игрока',
  weeks: '15–16',
  hours: 12,
  goal: 'Научиться сохранять и загружать данные, проектировать модель данных и строить инвентарь.',
  outcome:
    'Игра сохраняет прогресс в файл, загружает его при запуске, а инвентарь корректно складывает, тратит и отображает предметы.',
  topics: [
    {
      id: 'paths',
      title: 'res:// и user://',
      term: 'user://',
      summary:
        'res:// — папка проекта (только чтение в экспортированной игре). user:// — папка игрока, куда можно писать.',
      why:
        'Это самая частая ошибка новичков: попытаться записать файл в res://. В редакторе это работает, а в экспортированной игре — нет: папка игры может быть только для чтения.',
      details: [
        'user:// на Windows: C:\\Users\\<Имя>\\AppData\\Roaming\\Godot\\app_userdata\\<ИмяПроекта>.',
        'user:// на Linux: ~/.local/share/godot/app_userdata/<ИмяПроекта>.',
        'user:// на macOS: ~/Library/Application Support/Godot/app_userdata/<ИмяПроекта>.',
        'Точный путь можно узнать в рантайме: OS.get_user_data_dir().',
        'Папку можно создать: DirAccess.make_dir_recursive_absolute("user://saves").',
      ],
      diagramRef: 'project-structure',
    },
    {
      id: 'json',
      title: 'JSON: сохранение данных',
      term: 'JSON',
      summary:
        'JSON — простой текстовый формат. В Godot есть JSON.stringify() и JSON.parse_string().',
      why:
        'JSON — самый практичный способ сохранить состояние игры: его понимает любой другой инструмент, его можно открыть в блокноте и починить руками, его легко отправить на сервер.',
      details: [
        'JSON.stringify(data, "\\t") — превращает словарь или массив в строку.',
        'JSON.parse_string(text) — разбирает строку обратно; при ошибке возвращает null.',
        'В JSON попадают только «простые» типы: int, float, String, bool, Array, Dictionary.',
        'Объекты Resource и Node не сериализуются напрямую — сохраняйте их как идентификаторы (id, name).',
        'Проверяйте результат parse: если вернулся null, а ожидался словарь — сообщите об ошибке игроку, а не падайте.',
      ],
      diagramRef: 'save-system',
    },
    {
      id: 'file-access',
      title: 'Работа с файлами',
      term: 'FileAccess',
      summary:
        'FileAccess.open(path, mode) открывает файл: READ, WRITE, READ_WRITE. У файла есть get_as_text(), store_string(), get_line().',
      why:
        'Один файл — одна операция «записать всё». Это проще и надёжнее, чем дописывать куски: не нужно думать, что будет, если игра выключили в момент записи.',
      details: [
        'FileAccess.open("user://save.json", FileAccess.WRITE) — открыть на запись (перезапишет файл).',
        'WRITE — перезапись, WRITE_READ — перезапись с возможностью чтения, READ — чтение.',
        'FileAccess.file_exists("user://save.json") — проверка существования.',
        'После open() проверяйте file.get_open_error() — файл мог не открыться.',
        'Всегда закрывайте файл: в GDScript это происходит автоматически, когда объект уничтожается, но явный close() надёжнее.',
      ],
    },
    {
      id: 'config-file',
      title: 'ConfigFile: настройки',
      term: 'ConfigFile',
      summary:
        'Встроенный формат Godot для настроек: секции и ключи-значения. Умеет читать и писать.',
      why:
        'Настройки (громкость, имя игрока, язык) — это не игровое состояние. Их не надо хранить в JSON: у ConfigFile есть комментарии, он читается человеком и не ломается от случайной правки.',
      details: [
        'var config := ConfigFile.new(); config.load("user://settings.cfg").',
        'config.set_value("audio", "music_volume", 0.8); config.save("user://settings.cfg").',
        'Чтение: config.get_value("audio", "music_volume", 0.8) — третьим аргументом значение по умолчанию.',
        'Файл в текстовом виде, его можно открыть и отредактировать руками.',
        'Тот же формат используется для ConfigFile внутри .cfg проекта.',
      ],
    },
    {
      id: 'data-model',
      title: 'Проектирование модели данных',
      term: 'Data Model',
      summary:
        'Сначала придумываем структуру данных, потом пишем код. Инвентарь — это словарь id → количество, а предмет — Resource.',
      why:
        'Самая частая ошибка в больших проектах — хранить игровые объекты там, где нужны «данные о них». Модель данных решает, что сохранять, что генерировать и что вообще не нужно хранить.',
      details: [
        'Справочник предметов (id → Resource) — статичен, лежит в проекте.',
        'Инвентарь игрока (id → количество) — динамичен, сохраняется.',
        'Экземпляры предметов с разными параметрами (заточенный меч) — отдельный слой.',
        'Никогда не сохраняйте позиции объектов сцены: они восстанавливаются из уровня.',
        'Сохраняйте минимально необходимое: id, количество, характеристики, отличающиеся от дефолта.',
      ],
      diagramRef: 'inventory-data',
    },
    {
      id: 'inventory',
      title: 'Инвентарь: правила и данные',
      term: 'Inventory',
      summary:
        'Инвентарь — структура данных плюс правила: можно ли положить предмет, сколько максимум, что происходит при использовании.',
      why:
        'Инвентарь — первая система, где «логика» и «данные» путаются. Если правила зашиты в интерфейс, добавление нового типа предмета ломает всё. Правила должны быть в модели.',
      details: [
        'Структура: Dictionary[String, int] — id предмета и количество.',
        'Правила: максимум предметов, максимум веса, ограничения по типу.',
        'События: сигнал inventory_changed — UI перерисовывается только при изменении данных.',
        'Операции: add_item, remove_item, count_of, has_space_for.',
        'Инвентарь не должен знать про интерфейс: только данные и сигнал.',
      ],
      diagramRef: 'inventory-data',
    },
  ],
  steps: [
    {
      id: 's7-1',
      title: 'Проверить, куда пишет user://',
      where: 'Скрипт → print(OS.get_user_data_dir())',
      action:
        'Добавьте в _ready() функцию, которая печатает OS.get_user_data_dir(), и запустите проект. Откройте указанную папку в проводнике.',
      result: 'Вы знаете точное место, где лежат сохранения вашей игры.',
      note: 'Это полезно и для отладки: если файл не появился, вы сразу видите, куда смотреть.',
      diagramRef: 'project-structure',
    },
    {
      id: 's7-2',
      title: 'Записать и прочитать JSON',
      where: 'Новый скрипт save_manager.gd',
      action:
        'Соберите словарь с данными игрока, преобразуйте его через JSON.stringify(data, "\\t"), запишите в user://save.json через FileAccess. Затем прочитайте файл и разберите через JSON.parse_string().',
      result: 'Файл save.json создан и прочитан обратно без ошибок.',
      note: 'Отступ "\\t" делает JSON читаемым глазами — для отладки это стоит делать всегда.',
      diagramRef: 'save-system',
    },
    {
      id: 's7-3',
      title: 'Обработать битое сохранение',
      where: 'Загрузка сохранения',
      action:
        'Измените файл save.json вручную (напишите мусор), запустите игру и убедитесь, что она не падает, а сообщает об ошибке и начинает с нуля.',
      result: 'Игра не падает на повреждённом сохранении.',
      note:
        'Это обязательный сценарий: у пользователя обязательно окажется битый файл. Проверяйте тип результата: если JSON.parse_string вернул не Dictionary — считайте файл сломанным.',
      diagramRef: 'save-system',
    },
    {
      id: 's7-4',
      title: 'Настроить ConfigFile',
      where: 'Скрипт settings.gd',
      action:
        'Создайте ConfigFile, запишите в секцию "audio" громкость музыки, сохраните в user://settings.cfg. Перезапустите игру и убедитесь, что настройка сохранилась.',
      result: 'Настройка переживает перезапуск.',
      note: 'Файл .cfg — обычный текст, его можно открыть в блокноте и исправить руками.',
    },
    {
      id: 's7-5',
      title: 'Собрать модель предметов',
      where: 'Скрипт item_data.gd (Resource) + данные',
      action:
        'Создайте Resource с полями id, item_name, description, max_stack, weight. Сделайте три .tres-файла: potion, sword, shield.',
      result: 'Три предмета как отдельные ресурсы.',
      diagramRef: 'inventory-data',
    },
    {
      id: 's7-6',
      title: 'Сделать модель инвентаря',
      where: 'Новый скрипт inventory.gd (Resource или RefCounted)',
      action:
        'Реализуйте add_item(id, count), remove_item(id, count), count_of(id), total_weight(). Сигнал inventory_changed объявляйте при каждом изменении.',
      result: 'Модель инвентаря работает и сообщает об изменениях.',
      diagramRef: 'inventory-data',
    },
    {
      id: 's7-7',
      title: 'Связать инвентарь с интерфейсом',
      where: 'Сцена инвентаря',
      action:
        'Сделайте панель, где для каждого предмета есть Label с названием и SpinBox с количеством. UI подписывается на inventory_changed и перерисовывается.',
      result: 'Инвентарь показывает предметы и их количество.',
      note: 'UI перерисовывается по сигналу, а не каждый кадр — иначе это лишняя нагрузка.',
    },
  ],
  code: [
    {
      id: 'save-system',
      title: 'Менеджер сохранений',
      file: 'res://save_manager.gd',
      language: 'gdscript',
      code: `class_name SaveManager
extends RefCounted

const SAVE_PATH := "user://save.json"
const SAVE_VERSION := 1

signal save_completed()
signal save_failed(reason: String)

func save_game(state: Dictionary) -> bool:
	var payload := {
		"version": SAVE_VERSION,
		"saved_at": Time.get_datetime_string_from_system(),
		"state": state,
	}
	var text := JSON.stringify(payload, "\t")
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		save_failed.emit("Не удалось открыть файл для записи")
		return false
	file.store_string(text)
	file.close()
	save_completed.emit()
	return true

func load_game() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return {}
	var text := file.get_as_text()
	file.close()

	var parsed: Variant = JSON.parse_string(text)
	if not (parsed is Dictionary):
		push_error("Сохранение повреждено: это не JSON-объект")
		return {}

	var payload := parsed as Dictionary
	var version := int(payload.get("version", 0))
	if version != SAVE_VERSION:
		return _migrate(payload, version)

	var state: Variant = payload.get("state", {})
	return state if state is Dictionary else {}

func _migrate(payload: Dictionary, from_version: int) -> Dictionary:
	push_warning("Миграция сохранения с версии ", from_version, " не реализована")
	return {}

func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH)

func delete_save() -> void:
	if has_save():
		DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))
`,
      explanation:
        'Сохраняется не просто игровое состояние, а «конверт» с версией — так вы сможете менять формат в будущем. При загрузке проверяется три вещи: файл существует, файл открылся, внутри Dictionary (а не мусор). Версия сравнивается с текущей; если она другая — вызывается миграция. Пока миграций нет, но сама точка расширения уже есть — и это главное.',
      versionNote:
        'Time.get_datetime_string_from_system() возвращает строку в формате ISO-подобного вида; в Godot 4.2 появился также get_datetime_string_from_system(true) для UTC.',
    },
    {
      id: 'inventory-model',
      title: 'Модель инвентаря',
      file: 'res://inventory.gd',
      language: 'gdscript',
      code: `class_name Inventory
extends Resource

signal inventory_changed()
signal item_added(item_id: String, count: int)
signal item_removed(item_id: String, count: int)

@export var capacity: int = 20

var _items: Dictionary[String, int] = {}

func add_item(item_id: String, count: int = 1) -> bool:
	if count <= 0:
		return false
	if not _items.has(item_id) and _items.size() >= capacity:
		return false
	var current: int = _items.get(item_id, 0)
	var total := current + count
	_items[item_id] = total
	item_added.emit(item_id, count)
	inventory_changed.emit()
	return true

func remove_item(item_id: String, count: int = 1) -> bool:
	if not _items.has(item_id):
		return false
	var current := _items[item_id]
	if count > current:
		return false
	if count == current:
		_items.erase(item_id)
	else:
		_items[item_id] = current - count
	item_removed.emit(item_id, count)
	inventory_changed.emit()
	return true

func count_of(item_id: String) -> int:
	return _items.get(item_id, 0)

func has_item(item_id: String, count: int = 1) -> bool:
	return count_of(item_id) >= count

func is_empty() -> bool:
	return _items.is_empty()

func to_dictionary() -> Dictionary:
	return _items.duplicate()

func load_from(data: Dictionary) -> void:
	_items.clear()
	for key in data.keys():
		_items[String(key)] = int(data[key])
	inventory_changed.emit()
`,
      explanation:
        'Модель — это чистые данные плюс правила, без единого упоминания интерфейса. Ключевые решения: `add_item` возвращает bool (интерфейс может показать «нет места»), `remove_item` не даёт списать больше, чем есть, а `to_dictionary`/`load_from` — единственное место, где знание о формате сохранения. Типизированный `Dictionary[String, int]` защищает от случайной ошибки типа.',
      versionNote:
        'Типизированные словари (Dictionary[String, int]) доступны с Godot 4.0.',
    },
    {
      id: 'item-resource',
      title: 'Предмет как ресурс',
      file: 'res://data/item_data.gd',
      language: 'gdscript',
      code: `class_name ItemData
extends Resource

enum Kind {
	CONSUMABLE,
	WEAPON,
	ARMOR,
	KEY,
}

@export var id: String = ""
@export var item_name: String = "Предмет"
@export_multiline var description: String = ""
@export var kind: Kind = Kind.CONSUMABLE
@export var max_stack: int = 10
@export var weight: float = 0.5
@export var value: int = 10
@export var effect_amount: int = 0

static func create(p_id: String, p_name: String, p_kind: Kind, p_value: int) -> ItemData:
	var item := ItemData.new()
	item.id = p_id
	item.item_name = p_name
	item.kind = p_kind
	item.value = p_value
	return item

func kind_name() -> String:
	match kind:
		Kind.CONSUMABLE:
			return "Расходник"
		Kind.WEAPON:
			return "Оружие"
		Kind.ARMOR:
			return "Броня"
		_:
			return "Ключ"

func stack_limit_reached(count: int) -> bool:
	return count >= max_stack
`,
      explanation:
        'Предмет — это данные: идентификатор, имя, тип, вес, цена. Поведение (что делает зелье) в ресурсе хранить не нужно — его лучше описать в коде использования, зависящем от kind. `static func create` — фабричный метод: он создаёт ресурс и заполняет поля, чтобы не повторять один и тот же код в десяти местах. Идентификатор `id` — то, что попадёт в сохранение; само название в файл не пишется.',
      versionNote:
        '@export_multiline и @export_range доступны с Godot 4.0.',
    },
    {
      id: 'settings-config',
      title: 'Настройки через ConfigFile',
      file: 'res://settings.gd',
      language: 'gdscript',
      code: `extends Node

const PATH := "user://settings.cfg"
const SECTION := "audio"

signal settings_changed()

var music_volume: float = 0.8:
	set(value):
		music_volume = clampf(value, 0.0, 1.0)
		_save()
		settings_changed.emit()

var sfx_volume: float = 1.0:
	set(value):
		sfx_volume = clampf(value, 0.0, 1.0)
		_save()
		settings_changed.emit()

var fullscreen: bool = false:
	set(value):
		fullscreen = value
		_save()
		settings_changed.emit()

func _ready() -> void:
	_load()

func _load() -> void:
	var config := ConfigFile.new()
	if config.load(PATH) != OK:
		return
	music_volume = float(config.get_value(SECTION, "music_volume", music_volume))
	sfx_volume = float(config.get_value(SECTION, "sfx_volume", sfx_volume))
	fullscreen = bool(config.get_value(SECTION, "fullscreen", fullscreen))

func _save() -> void:
	var config := ConfigFile.new()
	config.set_value(SECTION, "music_volume", music_volume)
	config.set_value(SECTION, "sfx_volume", sfx_volume)
	config.set_value(SECTION, "fullscreen", fullscreen)
	config.save(PATH)
`,
      explanation:
        'Сеттеры в GDScript 4 (property с `set(value)`) позволяют реактивно реагировать на изменение: любое присваивание проходит через проверку, сохранение и сигнал. Секрет: во время `_load()` присваивание полей вызывает `_save()` — это лишняя запись, но безвредная. Если это мешает, добавьте флаг `_loading` и пропускайте сохранение при нём.',
      versionNote:
        'Сеттеры свойств (set(value)) с внутренним значением появились в Godot 4.0.',
    },
  ],
  tasks: [
    {
      id: 't7-1',
      title: 'Три слота хранения',
      description:
        'Реализуйте сохранение в три слота: save_1.json, save_2.json, save_3.json, и меню выбора слота с удалением записи.',
      level: 2,
      hint: 'Имя файла собирается из номера слота — не дублируйте код три раза.',
    },
    {
      id: 't7-2',
      title: 'Версия формата',
      description:
        'Добавьте в сохранение версию. Затем измените формат (например, переименуйте поле score в points) и напишите миграцию со старой версии.',
      level: 3,
      hint: 'Миграция — обычная функция, которая берёт старый словарь и возвращает новый.',
    },
    {
      id: 't7-3',
      title: 'Инвентарь с лимитом',
      description:
        'Добавьте ограничение по общему числу предметов и по весу. Сделайте так, чтобы при переполнении add_item возвращал false и UI показывал сообщение.',
      level: 2,
      hint: 'Проверка места — в модели, а не в UI.',
    },
    {
      id: 't7-4',
      title: 'Автосохранение',
      description:
        'Сохраняйте игру автоматически: при выходе из уровня, при получении уровня и раз в минуту. Покажите игроку, когда было последнее сохранение.',
      level: 3,
      hint: 'Для выхода из игры подпишитесь на сигнал NOTIFICATION_WM_CLOSE_REQUEST или на tree_exiting.',
    },
  ],
  project: {
    title: 'Инвентарь с сохранением',
    brief:
      'Работающий инвентарь: игрок собирает предметы в игре, видит их список, тратит и может сохранить прогресс и загрузить его обратно.',
    requirements: [
      'Модель инвентаря с добавлением, удалением и ограничениями.',
      'Три предмета как Resource, размещённые в игровом мире для подбора.',
      'UI-панель инвентаря, которая перерисовывается по сигналу inventory_changed.',
      'Сохранение и загрузка состояния (предметы + очки + уровень) в JSON.',
      'Обработка повреждённого сохранения без падения.',
    ],
    stretch: [
      'Добавьте три слота сохранения и меню выбора.',
      'Сделайте версионирование формата с миграцией.',
      'Добавьте предметы с разным весом и ограничение по весу рюкзака.',
    ],
  },
  criteria: [
    {
      id: 'c7-1',
      text: 'Знаю разницу между res:// и user:// и могу назвать путь к папке сохранений',
      check: 'Печатаю OS.get_user_data_dir() и открываю эту папку, нахожу свой файл.',
    },
    {
      id: 'c7-2',
      text: 'Умею сохранять и загружать состояние через JSON',
      check:
        'Пишу функцию save и load, разбираю результат JSON.parse_string и проверяю, что это Dictionary, а не null.',
    },
    {
      id: 'c7-3',
      text: 'Не падаю на повреждённом сохранении',
      check: 'Порчу файл вручную, запускаю игру — она сообщает об ошибке и стартует с нуля.',
    },
    {
      id: 'c7-4',
      text: 'Понимаю, что сохранять, а что — нет',
      check:
        'Объясняю, почему позиции врагов в сохранении быть не должно, а количество зелий — должно.',
    },
    {
      id: 'c7-5',
      text: 'Модель данных отделена от интерфейса',
      check:
        'В файле модели нет ни одного упоминания Label, Button или сцены — только данные, правила и сигнал.',
    },
    {
      id: 'c7-6',
      text: 'Умею отличить настройки от игрового состояния и храню их в ConfigFile',
      check:
        'Объясняю, почему громкость music_volume — это настройка, а очки — это состояние, и где каждое лежит.',
    },
  ],
  resources: [
    {
      title: 'Работа с файлами — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html',
      kind: 'docs',
    },
    {
      title: 'Сохранение данных — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html',
      kind: 'docs',
    },
    {
      title: 'Справочник JSON',
      url: 'https://docs.godotengine.org/en/stable/classes/class_json.html',
      kind: 'reference',
    },
    {
      title: 'Справочник ConfigFile',
      url: 'https://docs.godotengine.org/en/stable/classes/class_configfile.html',
      kind: 'reference',
    },
    {
      title: 'Справочник FileAccess',
      url: 'https://docs.godotengine.org/en/stable/classes/class_fileaccess.html',
      kind: 'reference',
    },
  ],
  diagrams: ['save-system', 'inventory-data', 'project-structure'],
  versionNotes: [
    {
      version: '4.0',
      text: 'JSON.stringify и JSON.parse_string доступны с Godot 4.0; в Godot 3 был только JSON.parse (с ручной проверкой ошибок).',
    },
    {
      version: '4.0',
      text: 'Появились типизированные словари Dictionary[String, int] — они ловят ошибки типов на этапе компиляции.',
    },
  ],
}
