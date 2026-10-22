import type { Stage } from '../types'

/**
 * Этап 01 — GDScript: язык.
 * Цель этапа: писать на GDScript без страха и понимать, как данные
 * двигаются по программе: переменные, типы, функции, условия, циклы.
 */
export const stage01: Stage = {
  id: '01',
  number: 1,
  slug: '01-gdscript-yazyk',
  title: 'GDScript: язык',
  shortTitle: 'GDScript',
  subtitle: 'Переменные, условия, циклы, функции — на языке, который вы будете писать 24 недели',
  weeks: '3–4',
  hours: 12,
  goal: 'Научиться писать на GDScript: типы, переменные, условия, циклы, функции и работу с ошибками.',
  outcome:
    'У вас есть скрипт, который считает очки, реагирует на числа и не падает при неверном вводе — и вы можете объяснить каждую строку.',
  topics: [
    {
      id: 'variables-types',
      title: 'Переменные и типы',
      term: 'Variable / Type',
      summary:
        'Переменная — именованное хранилище значения. Тип определяет, что туда можно положить: int, float, String, bool, Vector2.',
      why:
        'Статическая типизация в GDScript — не формальность. Она ловит опечатки до запуска: если положить строку в int, редактор подсветит строку с ошибкой ещё до нажатия F5.',
      details: [
        '`:=` — вывод типа автоматически: `var hp := 10` (int).',
        '`:` — тип задан явно: `var hp: int = 10`.',
        'Без подсказки типа переменная получает тип Variant — с ним работать медленнее и опаснее.',
        'Константа `const` не меняется после объявления: `const MAX_HP := 100`.',
        'Строки в GDScript — «String», кавычки двойные. Экранирование: \\n для переноса строки.',
      ],
      diagramRef: 'gdscript-typing',
    },
    {
      id: 'operators',
      title: 'Операторы и приведение типов',
      term: 'Operator',
      summary:
        'Арифметика, сравнения, логика. Отдельно — приведение типов: int и float не смешиваются молча.',
      why:
        'Ошибка `int + float` в GDScript не «сложится как в Python» — она требует явного решения. Именно на этом новички спотыкаются в первом же расчёте урона.',
      details: [
        '`7 / 2` в GDScript — это 3 (целочисленное деление!). Для дробного пишите `7.0 / 2` — это 3.5.',
        '`%` — остаток от деления, удобно для «каждый третий».',
        '`float(7) / 2` — явное приведение.',
        'Сравнения: `==`, `!=`, `<`, `>`, `<=`, `>=`.',
        'Логика: `and`, `or`, `not`. В GDScript `and`/`or` работают с логикой, `&`/`|` — с битами и строками.',
      ],
    },
    {
      id: 'conditions',
      title: 'Условия',
      term: 'if / elif / else',
      summary:
        'Ветвление: выполнить блок кода, только если условие истинно. `match` — аналог switch.',
      why:
        'Условия — это «правила игры». Игра = правила. Всё, что отличает одну игру от другой, в итоге сводится к ветвлениям.',
      details: [
        'Отступы — табы. Смешение табов и пробелов — ошибка парсинга.',
        'Условие без фигурных скобок пишется так: `if hp <= 0:` и тело с отступом.',
        '`elif` — «иначе если», `else` — «иначе».',
        '`match` удобен для состояний: `match state: State.IDLE: ... State.RUN: ...`.',
        'Тернарный оператор: `var label := "win" if score > 10 else "lose"`.',
      ],
    },
    {
      id: 'loops',
      title: 'Циклы',
      term: 'for / while',
      summary:
        '`for` перебирает диапазон или массив, `while` повторяет, пока условие истинно. Есть `break` и `continue`.',
      why:
        'Без циклов любая игра — это сотни одинаковых строк. Цикл экономит код и делает поведение «настраиваемым»: изменил диапазон — изменилось поведение.',
      details: [
        '`for i in range(3):` — три раза, i = 0, 1, 2.',
        '`for i in range(1, 6):` — от 1 до 5.',
        '`for i in range(0, 10, 2):` — с шагом 2.',
        '`for item in array:` — по элементам массива.',
        '`while` безусловно опасен: если условие не меняется — бесконечный цикл и «зависший» Godot. Всегда проверяйте, что цикл завершается.',
      ],
    },
    {
      id: 'functions',
      title: 'Функции',
      term: 'Function',
      summary:
        'Функция — именованный блок кода с аргументами и возвращаемым значением. `void` означает «ничего не возвращает».',
      why:
        'Функции — это границы ответственности. Когда в функции 30 строк, в ней можно найти ошибку глазами. Когда в файле 800 строк — нельзя.',
      details: [
        'Сигнатура: `func имя(аргумент: Тип) -> Тип:`.',
        'Значение по умолчанию: `func damage(amount: int = 10) -> void:`.',
        'Возврат: `return значение`. Для void — просто `return`.',
        'Вызов: `имя_функции(аргумент)`. Результат: `var hp := calculate_hp(3)`.',
        'Статические функции `static func` не требуют экземпляра — удобны для чистых вычислений.',
      ],
    },
    {
      id: 'errors',
      title: 'Ошибки: как их читать',
      term: 'Error',
      summary:
        'Parse Error — ошибка синтаксиса, игра не запустится. Runtime Error — ошибка во время выполнения, игра упадёт в этот момент.',
      why:
        'Умение прочитать сообщение об ошибке экономит больше времени, чем знание синтаксиса. Сообщение Godot почти всегда указывает файл и строку.',
      details: [
        'Parse Error: «Expected closing ")" after call arguments» — не закрыта скобка.',
        '«Identifier "Player" not declared in the current scope» — опечатка в имени или не создан class_name.',
        '«Invalid access to property or key \'velocity\' on a base object of type \'Nil\'» — обращение к свойству у null. Обычно это «объект ещё не создан в _ready()».',
        '«Invalid call. Nonexistent function \'play\' in base \'Nil\'» — то же самое: вызвали метод у несуществующего объекта.',
        '«Cannot infer the type of "x" variable because the value doesn\'t have a set type» — оператор := не смог вывести тип. Чаще всего это `load()`: он возвращает Variant. Берите скрипт через `preload("res://путь.gd")` — тип известен сразу.',
        'Ошибка в GDScript останавливает выполнение функции, но не всю игру, если это не критичный участок.',
      ],
    },
  ],
  steps: [
    {
      id: 's1-1',
      title: 'Создать скрипт с данными игрока',
      where: 'Scene → Attach Script… на узле Player',
      action:
        'Добавьте узел: в панели Scene (слева) нажмите «+» (Add Child Node) → в поиске наберите CharacterBody2D → Create. Переименуйте узел в Player (поле Name над сценой). Правой кнопкой по узлу → Attach Script… → player.gd. Объявите переменные: display_name, здоровье, очки, скорость.',
      result: 'В Inspector узла Player появились поля Display Name и Speed — только те, что объявлены с @export. Переменные health и score живут в коде: обычные var в Inspector не появляются.',
      note: 'В Inspector видны только переменные с @export — обычные var там не появляются. Тип переменной виден под именем: «int», «float». Это подсказка движка, а не ваша подпись.',
      diagramRef: 'gdscript-typing',
    },
    {
      id: 's1-2',
      title: 'Написать функцию расчёта урона',
      where: 'Редактор скрипта player.gd',
      action:
        'Добавьте функцию `take_damage(amount: int) -> int`, которая уменьшает здоровье и возвращает оставшееся здоровье. Вызовите её из `_ready()` и напечатайте результат.',
      result: 'В Output видно число — оставшееся здоровье.',
      diagramRef: 'ready-process-order',
    },
    {
      id: 's1-3',
      title: 'Сделать ввод с проверкой',
      where: 'Тот же скрипт, функция _process',
      action:
        'Считайте нажатие клавиши через `Input.is_action_just_pressed("jump")`. Внутри проверьте, что здоровье больше нуля, и только тогда меняйте счётчик прыжков.',
      result: 'Счётчик растёт только при нажатии Space и только пока здоровье не нулевое.',
      note:
        'Вложенный `if` — нормально, но если условий три и больше, вынесите их в отдельную функцию `can_jump() -> bool`.',
    },
    {
      id: 's1-4',
      title: 'Намеренно сломать и починить',
      where: 'Редактор скрипта',
      action:
        'Уберите закрывающую скобку в вызове print(). Посмотрите сообщение внизу редактора, запомните номер строки. Верните скобку.',
      result: 'Вы увидели Parse Error с точным указанием строки.',
      note: 'Это упражнение важнее, чем кажется: умение читать ошибку — навык, который окупается сотни раз.',
    },
    {
      id: 's1-5',
      title: 'Проверить типы в Inspector',
      where: 'Inspector узла Player',
      action:
        'Попробуйте вписать в числовое поле Speed значение «сто» — текст вместо числа. Числовое поле текст не примет: значение не изменится, а в Output может появиться сообщение о типе. Верните 220.',
      result: 'Поле снова принимает число, ошибка исчезла.',
    },
    {
      id: 's1-6',
      title: 'Собрать игровое состояние',
      where: 'Новый скрипт ranks.gd (как в примере ниже)',
      action:
        'Создайте отдельный скрипт ranks.gd с enum-состояниями и функцией, которая по количеству очков возвращает строку «новичок» / «опытный» / «легенда». Это «библиотека» функций: файл не привязан к узлу, поэтому вызовите его из любого узла — var ranks = load("res://ranks.gd").new(), а дальше ranks.rank_title(500).',
      result: 'Функция возвращает разные строки в зависимости от очков.',
      note:
        'enum — это именованный набор целых чисел: `enum Rank { NEWBIE, VETERAN, LEGEND }`. Обращение: `Rank.VETERAN`.',
    },
  ],
  code: [
    {
      id: 'player-stats',
      title: 'Данные игрока с типами',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `class_name PlayerStats
extends CharacterBody2D

const MAX_HEALTH := 100

@export var display_name: String = "Игрок"
@export var speed: float = 220.0

var health: int = MAX_HEALTH
var score: int = 0
var is_alive: bool = true

func take_damage(amount: int) -> int:
	if amount < 0:
		push_warning("Урон не может быть отрицательным")
		return health
	health = max(health - amount, 0)
	is_alive = health > 0
	return health

func add_score(points: int) -> void:
	score += points
	print("Очки: ", score, " | Здоровье: ", health)
`,
      explanation:
        'Три уровня объявления. `const` — константа, вычисляется один раз. `@export` — переменная, которую видно и можно менять в Inspector (экспорт в инспектор). Обычная `var` — только в коде. Строковый тип `String` пишется с большой буквы, `int`, `float`, `bool` — со строчной. Функция `take_damage` возвращает новое здоровье, чтобы вызывающий код мог сразу его использовать.',
      versionNote:
        'Строка `push_warning` удобнее `print` для подозрительных ситуаций: в Output она выделяется жёлтым.',
    },
    {
      id: 'conditions-and-match',
      title: 'Ветвления: if, elif, match',
      file: 'res://ranks.gd',
      language: 'gdscript',
      code: `enum Rank {
	NEWBIE,
	VETERAN,
	LEGEND,
}

func rank_for_score(score: int) -> Rank:
	if score < 100:
		return Rank.NEWBIE
	elif score < 1000:
		return Rank.VETERAN
	return Rank.LEGEND

func rank_title(score: int) -> String:
	match rank_for_score(score):
		Rank.NEWBIE:
			return "Новичок"
		Rank.VETERAN:
			return "Опытный игрок"
		_:
			return "Легенда"

func describe(score: int) -> String:
	var title := rank_title(score)
	if score >= 1000:
		return title + " — вы прошли половину пути!"
	return title
`,
      explanation:
        '`enum` даёт именованные константы вместо магических чисел: код `Rank.LEGEND` читается лучше, чем `2`. Функция `rank_for_score` возвращает enum-значение, `rank_title` превращает его в строку через `match`. В `match` ветка `_` — это «всё остальное», по умолчанию. Важно: `return` в первой же подходящей ветке прекращает проверку.',
      versionNote:
        'В Godot 4 `enum` объявляется на верхнем уровне скрипта, а `match` поддерживает несколько значений через запятую: `Rank.A, Rank.B:`.',
    },
    {
      id: 'loops-and-arrays',
      title: 'Циклы, массивы и словари',
      file: 'res://loops_demo.gd',
      language: 'gdscript',
      code: `func total_damage(hits: Array[int]) -> int:
	var sum := 0
	for amount in hits:
		sum += amount
	return sum

func every_third_index(size: int) -> Array[int]:
	var result: Array[int] = []
	for i in range(0, size, 3):
		result.append(i)
	return result

func price_table() -> Dictionary:
	return {
		"меч": 100,
		"щит": 150,
		"зелье": 25,
	}

func most_expensive() -> String:
	var best_name := ""
	var best_price := -1
	for item_name in price_table():
		var price: int = price_table()[item_name]
		if price > best_price:
			best_price = price
			best_name = item_name
	return best_name
`,
      explanation:
        'Типизированные массивы (`Array[int]`) защищают от ошибок вроде положить в массив строку. `for i in range(0, size, 3)` — цикл с шагом: 0, 3, 6… `for key in dictionary:` перебирает ключи, значение достаётся обращением `dictionary[key]`. Обратите внимание: в последнем примере это неэффективно — так выглядит типичная «первая версия», её разбираем на этапе 08.',
      versionNote:
        'Типизированные массивы (`Array[int]`) доступны с Godot 4.0, типизированные словари (`Dictionary[String, int]`) — с 4.4.',
    },
    {
      id: 'safe-input',
      title: 'Разбор строки без падений',
      file: 'res://save_parser.gd',
      language: 'gdscript',
      code: `func parse_int_or(text: String, fallback: int = 0) -> int:
	var cleaned := text.strip_edges()
	if cleaned.is_empty():
		return fallback
	if not cleaned.is_valid_int():
		push_warning("Не число: " + text)
		return fallback
	return int(cleaned)

func split_csv(line: String) -> Array[String]:
	var parts: Array[String] = []
	for chunk in line.split(",", false):
		parts.append(chunk.strip_edges())
	return parts
`,
      explanation:
        'Пользовательский ввод — главный источник «неожиданных» данных. `is_valid_int()` проверяет, что строка действительно число, до того как вы начнёте её конвертировать: `int("abc")` вернёт 0 молча, и вы не узнаете, что ошиблись. `strip_edges()` убирает пробелы по краям. Второй аргумент `split(",", false)` — «пустые части не считать», иначе «a,,b» даст лишний элемент.',
      versionNote:
        'Метод `is_valid_int()` существует с Godot 4.0. В Godot 3 аналогом был `is_valid_number()`.',
    },
  ],
  tasks: [
    {
      id: 't1-1',
      title: 'Калькулятор урона',
      description:
        'Напишите функцию `damage_after_armor(raw: int, armor: int) -> int`, которая вычитает броню и не даёт урону стать отрицательным. Проверьте на наборе: (10, 3) → 7, (5, 10) → 0, (0, 0) → 0.',
      level: 1,
      hint: 'Отрицательный результат обрезается через max(value, 0).',
    },
    {
      id: 't1-2',
      title: 'Классификация врагов',
      description:
        'Функция `enemy_tier(hp: int) -> String` возвращает «слабый» (до 30), «средний» (31–70), «сильный» (больше 70). Напишите тест-цикл, который перебирает hp от 0 до 100 и печатает результат — так вы увидите границы своими глазами.',
      level: 2,
      hint: 'Цикл по range(0, 101) и print() внутри покажут, где проходит граница.',
    },
    {
      id: 't1-3',
      title: 'Парсер результатов',
      description:
        'Введите строку вида «10;20;30» и напишите функцию, возвращающую массив чисел. Если в строке есть мусор — сообщите об этом через push_warning и пропустите его.',
      level: 2,
      hint: 'split(";") даст строки; каждую проверите через is_valid_int().',
    },
    {
      id: 't1-4',
      title: 'Найди три ошибки',
      description:
        'Возьмите любой свой скрипт с прошлого этапа и намеренно внесите три ошибки: забытая скобка, опечатка в имени переменной, деление int на int в ожидании дробного результата. Для каждой запишите, как выглядело сообщение об ошибке.',
      level: 3,
      hint: 'Ошибка деления не выдаёт исключение — 7 / 2 просто равно 3. Это самая коварная из трёх.',
    },
  ],
  project: {
    title: 'Симулятор боя',
    brief:
      'Консольная симуляция одного боя: два бойца, у каждого здоровье и урон. Игрок выбирает действие, противник отвечает по простому правилу. Считается раунд и итог.',
    requirements: [
      'Данные бойца — отдельный скрипт с классом (class_name Fighter) и полями hp, damage, armor.',
      'Функция расчёта удара и функция применения урона.',
      'Состояние боя: раунд, чей ход, завершён ли бой.',
      'Определение победителя и печать итога.',
    ],
    stretch: [
      'Добавьте шанс крит-удара (например, 20%).',
      'Добавьте лечение, которое нельзя применить выше максимального здоровья.',
      'Сделайте второго противника с другой стратегией через наследование от Fighter.',
    ],
  },
  criteria: [
    {
      id: 'c1-1',
      text: 'Различаю int, float, String и bool и знаю, когда тип выводится, а когда задаётся',
      check:
        'Могу объяснить, почему `var x := 7 / 2` даёт 3, а `var x := 7.0 / 2` даёт 3.5, и написать оба варианта.',
    },
    {
      id: 'c1-2',
      text: 'Пишу функции с аргументами, значениями по умолчанию и возвратом',
      check: 'Могу написать функцию с тремя аргументами, одним значением по умолчанию и возвратом типизированного значения.',
    },
    {
      id: 'c1-3',
      text: 'Выбираю между if/elif и match осознанно',
      check: 'Объясняю, когда match читается лучше цепочки if, и привожу пример с тремя состояниями.',
    },
    {
      id: 'c1-4',
      text: 'Читаю сообщения об ошибках и нахожу строку с ошибкой',
      check: 'Могу за 30 секунд найти причину Parse Error и Runtime Error по тексту сообщения.',
    },
    {
      id: 'c1-5',
      text: 'Защищаю код от плохих данных',
      check:
        'Могу показать функцию, которая принимает строку и не падает на мусоре: использую is_valid_int() и push_warning().',
    },
    {
      id: 'c1-6',
      text: 'Не оставляю бесконечный while без выхода',
      check: 'Проверяю каждый свой цикл: есть ли в нём изменение переменной условия и гарантированный break.',
    },
  ],
  resources: [
    {
      title: 'GDScript basics — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html',
      kind: 'docs',
      note: 'Тот же материал, но с примерами от разработчиков движка.',
    },
    {
      title: 'Справочник языка GDScript',
      url: 'https://docs.godotengine.org/en/stable/classes/class_%40gdscript.html',
      kind: 'reference',
    },
    {
      title: 'Style guide для GDScript',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html',
      kind: 'docs',
      note: 'Правила форматирования от самого Godot. Стоит прочитать до этапа 08.',
    },
    {
      title: 'Статическая типизация в GDScript',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html',
      kind: 'docs',
    },
  ],
  diagrams: ['gdscript-typing', 'ready-process-order'],
  versionNotes: [
    {
      version: '4.0',
      text: 'В GDScript 4 появилась статическая типизация, оператор := и типизированные массивы (Array[int]). Типизированные словари (Dictionary[String, int]) появились позже — в Godot 4.4.',
    },
    {
      version: '4.0',
      text: 'Целочисленное деление по-прежнему целочисленное: 7 / 2 == 3. Менять это не планируется — меняйте тип операнда явно.',
    },
  ],
}
