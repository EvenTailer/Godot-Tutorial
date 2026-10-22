/**
 * Справочник ошибок Godot.
 *
 * Сообщения — дословные: их выводит настоящий движок. Это проверяется
 * автоматически скриптом `npm run verify:errors`: он запускает минимальный
 * пример в Godot headless и сверяет текст со строкой ниже.
 *
 * Не добавляйте сюда сообщение, которое движок не выводит.
 */

export type ErrorKind = 'parse' | 'runtime' | 'resource' | 'logic'

export interface GodotErrorEntry {
  id: string
  /** Сообщение движка — как его видно в Output. */
  message: string
  kind: ErrorKind
  /** Когда ошибка возникает. */
  when: string
  /** Почему она возникает. */
  cause: string
  /** Что делать, чтобы исправить. */
  fix: string
  /** Этап курса, где разбирается эта тема. */
  stageId?: string
  /** Уточнение по формулировке сообщения. */
  note?: string
  /**
   * Сообщение нельзя воспроизвести в headless-режиме — оно подтверждено
   * по исходникам движка. Такие записи автоматическая проверка пропускает.
   */
  sourceVerified?: boolean
}

export interface ErrorKindMeta {
  id: ErrorKind
  label: string
  summary: string
}

export const errorKinds: ErrorKindMeta[] = [
  {
    id: 'parse',
    label: 'Parse Error — разбор скрипта',
    summary: 'Движок не понял код и отказался запускать сцену. Правятся до запуска.',
  },
  {
    id: 'runtime',
    label: 'Runtime — во время выполнения',
    summary: 'Код запустился, но упал в процессе. Чаще всего виноват nil или неверный путь.',
  },
  {
    id: 'resource',
    label: 'Ресурсы и файлы',
    summary: 'Не нашёлся файл, сцена или ресурс. Проверяем путь и имя.',
  },
  {
    id: 'logic',
    label: 'Логика',
    summary: 'Ошибок нет — но результат не тот. Такие находят по симптомам.',
  },
]

export const godotErrors: GodotErrorEntry[] = [
  {
    id: 'err-identifier',
    message: 'Identifier "velocty" not declared in the current scope.',
    kind: 'parse',
    when: 'В скрипте используется переменная, которую никто не объявил.',
    cause:
      'Опечатка в имени (velocty вместо velocity) или переменная объявлена ниже по коду, чем используется. В GDScript порядок объявлений важен: сначала переменная, потом её использование.',
    fix:
      'Объявите переменную до первого обращения: `var velocity := Vector2.ZERO`. Если это опечатка — сверьте имена с соседними строками: движок подсвечивает неизвестный идентификатор и может подсказать похожее имя.',
    stageId: '01',
  },
  {
    id: 'err-indent',
    message: 'Expected statement, found "Indent" instead.',
    kind: 'parse',
    when: 'Строка сдвинута вправо без причины — лишний отступ.',
    cause:
      'В GDScript отступ задаёт блок, а не оформление. Лишний таб перед строкой, которая должна быть на уровне выше, ломает разбор.',
    fix:
      'Уберите лишний отступ: блок отделяется одной дополнительной табуляцией, а не четырьмя пробелами. Если табы и пробелы смешаны, движок напишет отдельно: "Used space character for indentation instead of tab as used before in the file."',
    stageId: '01',
  },
  {
    id: 'err-member',
    message: "Invalid call. Nonexistent function 'move_and_slide' in base 'Node'.",
    kind: 'runtime',
    when: 'Метод вызывается у узла, который его не поддерживает.',
    cause:
      'move_and_slide() есть только у CharacterBody2D и CharacterBody3D. У обычного Node2D такого метода нет — а вызвать его на нём нельзя.',
    fix:
      'Смените корень сцены на подходящий тип узла (Node2D → CharacterBody2D) либо уберите вызов. У RigidBody2D move_and_slide() тоже нет: у него своя физика.',
    stageId: '03',
  },
  {
    id: 'err-infer',
    message: 'Cannot infer the type of "damage" variable because the value doesn\'t have a set type.',
    kind: 'parse',
    when: 'Оператор := пытается вывести тип из значения, у которого тип не определён.',
    cause:
      'Значение пришло из Dictionary, из нетипизированного Array или из вызова, возвращающего Variant. Для := нужен конкретный тип.',
    fix:
      'Укажите тип явно: `var damage: int = data["damage"]`. Если значение Variant, сначала приведите его: `var damage: int = int(data["damage"])`. Отдельный частый случай — скрипт без class_name: `load()` возвращает Variant, поэтому берите его через preload: `var s := preload("res://scripts/helper.gd").new()`.',
    stageId: '01',
  },
  {
    id: 'err-nil-access',
    message: "Invalid access to property or key 'velocity' on a base object of type 'Nil'.",
    kind: 'runtime',
    when: 'Обращение к свойству у того, чего нет.',
    cause:
      'Ссылка на узел равна null: get_node() вернул пустое значение, сигнал пришёл до add_child, или объект уже queue_free(). Частая причина — порядок вызовов: _ready() родителя выполняется раньше _ready() ребёнка.',
    fix:
      'Проверьте, что узел существует: `if player:` и только потом обращайтесь к свойствам. Если это порядок вызовов — получите узел в _ready(), а не в _init().',
    stageId: '02',
    note: 'Формулировка менялась в 4.3: в 4.0–4.2 было "Invalid get index \'velocity\' (on base: \'Nil\')."',
  },
  {
    id: 'err-nonexistent-call',
    message: "Invalid call. Nonexistent function 'instantiate' in base 'Nil'.",
    kind: 'runtime',
    when: 'Метод вызывается у null или у объекта без такого метода.',
    cause:
      'В переменной оказалось null: load() вернул пустое значение, если файл сцены не найден, либо сцена ещё не загружена. Вызов метода у null — это и есть ошибка.',
    fix:
      'Проверьте путь: `res://scenes/enemy.tscn` — всегда от res://, с расширением и прямым слэшем. Добавьте проверку: `if scene == null: return`. Для сцены, которая точно есть, удобнее preload().',
    stageId: '02',
  },
  {
    id: 'err-null-instance',
    message: "Invalid call. Nonexistent function 'get_node' in base 'Nil'.",
    kind: 'runtime',
    when: 'Метод вызывается на ссылке, которая сама равна null.',
    cause:
      'В переменной нет ссылки: @onready var player: Node2D = get_node("Player") не нашёл узел и вернул null — а следующая строка уже работает с этой переменной.',
    fix:
      'Добавьте проверку `if player == null: return`. Убедитесь, что путь совпадает с деревом сцены, и что узел не переименован при переносе. Для мягкой проверки есть get_node_or_null().',
    stageId: '02',
  },
  {
    id: 'err-operands',
    message: "Invalid operands 'Nil' and 'int' in operator '+'.",
    kind: 'runtime',
    when: 'Складываются значения разных типов, одно из них — nil.',
    cause:
      'Dictionary.get() без второго аргумента возвращает null, если ключа нет. Потом null складывается с числом.',
    fix:
      'Всегда задавайте значение по умолчанию: `var total: int = items.get(id, 0)`. Либо проверяйте наличие ключа: `if items.has(id):`.',
    stageId: '07',
  },
  {
    id: 'err-signal-call',
    message: 'Name "pressed" called as a function but is a "Signal".',
    kind: 'parse',
    when: 'Сигнал вызывают как обычную функцию: `button.pressed()`.',
    cause:
      'Сигнал — не метод. Кнопка не «вызывает» pressed(), а отправляет его сама. Собственный сигнал тоже нужно объявить и отправлять через emit().',
    fix:
      'Чтобы отреагировать на сигнал: `button.pressed.connect(_on_button_pressed)`. Чтобы отправить свой сигнал: `hit.emit()` после объявления `signal hit`.',
    stageId: '02',
  },
  {
    id: 'err-assert',
    message: 'Assertion failed.',
    kind: 'runtime',
    when: 'Условие в assert() оказалось ложным.',
    cause:
      'Это не поломка движка, а ваша собственная проверка. assert() останавливает выполнение, когда условие неверно — так ловят регрессии при рефакторинге.',
    fix:
      'В сообщении нет самого условия — его надо помнить: `assert(inventory.size() > 0, "инвентарь пуст")`. Учтите, что assert() работает только в отладочной сборке: в релизной она ничего не проверяет.',
    stageId: '08',
  },
  {
    id: 'err-node-not-found',
    message: 'Node not found: "Player/Sprite2D" (relative to "Main").',
    kind: 'runtime',
    when: 'Путь к узлу не совпадает с деревом сцены.',
    cause:
      'Узел переименован, удалён или лежит не по этому пути. Регистр и подчёркивания важны: "Player" и "player" — разные узлы.',
    fix:
      'Откройте сцену и проверьте путь по дереву слева; в сообщении движок пишет, относительно какого узла искать. Вместо строкового пути используйте %-ссылки (Unique Name): узел с галочкой «Access as Unique Node» доступен как %Sprite2D.',
    stageId: '02',
  },
  {
    id: 'err-resource-missing',
    message: 'Failed loading resource: res://scenes/enemy.tscn.',
    kind: 'resource',
    when: 'Движок не смог открыть сцену или ресурс.',
    cause:
      'Файла нет по этому пути или он переименован при перемещении. Движок сначала пишет "Cannot open file \'res://scenes/enemy.tscn\'." — это первая и точная причина.',
    fix:
      'Проверьте путь в панели FileSystem: он всегда от res://, с расширением и прямым слэшем. Проверить заранее можно так: `ResourceLoader.exists("res://scenes/enemy.tscn")`.',
    stageId: '02',
  },
  {
    id: 'err-preload-missing',
    message: 'Preload file "res://scenes/enemy.tscn" does not exist.',
    kind: 'parse',
    when: 'preload() указывает на несуществующий файл.',
    cause:
      'Опечатка в пути или файл ещё не создан. Ошибка ловится на этапе разбора — сцена даже не запускается, поэтому заметнее, чем ошибка в load().',
    fix:
      'Проверьте путь по панели FileSystem. Помните: preload() требует, чтобы файл существовал уже сейчас, а load() ищет файл в момент вызова.',
    stageId: '02',
  },
  {
    id: 'err-json',
    message: "Parse JSON failed. Error at line 0: Expected 'true', 'false', or 'null', got 'abc'",
    kind: 'resource',
    when: 'Файл с JSON не читается.',
    cause:
      'Файл пустой, обрезан при записи или содержит не-JSON. Частая причина — записать данные до JSON.stringify() и потом прочитать сырой текст.',
    fix:
      'Проверьте, что записываете JSON.stringify(data), а читаете JSON.parse_string(text). Если в файле пусто — при загрузке проверяйте text.is_empty() и не падайте, а начинайте игру заново. Номер строки движок считает с нуля.',
    stageId: '07',
  },
  {
    id: 'err-call-null',
    message: "Cannot call method 'queue_free' on a null value.",
    kind: 'runtime',
    when: 'Метод вызывают у переменной, которая оказалась пустой.',
    cause:
      'Переменная объявлена с типом (например, var player: Node2D), но ссылка в ней — null: узел не найден, не добавлен в сцену или уже удалён. Тип переменной не мешает подставить null, но вызов метода на нём падает.',
    fix:
      'Проверьте значение перед вызовом: `if player == null: return`. И найдите место, где переменная осталась пустой: обычно это get_node() с неверным путём или сигнал, пришедший раньше, чем узел появился в дереве.',
    stageId: '02',
  },
  {
    id: 'err-flush',
    message:
      "Can't change this state while flushing queries. Use call_deferred() or set_deferred() to change monitoring state instead.",
    kind: 'runtime',
    when: 'В обработчике входа или выхода Area2D/Area3D вы меняете состояние мониторинга.',
    cause:
      'Физический сервер в этот момент сбрасывает очередь запросов и меняет состояние мониторинга запрещено: сначала приходят события area_entered, потом сервер обновляет состояние.',
    fix:
      'Отложите изменение: `set_deferred("monitorable", false)` или `call_deferred("set_monitoring", false)`. Так состояние изменится после того, как сервер закончит сброс.',
    stageId: '03',
    sourceVerified: true,
  },
]
