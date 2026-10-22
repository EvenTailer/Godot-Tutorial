import type { CheatSheet } from './types'

/**
 * Шпаргалки. Четыре вкладки: синтаксис, карта узлов, частые ошибки, хоткеи.
 * Каждая строка — «что → как», без длинных объяснений: за подробностями идём в этапы.
 */
export const cheatSheets: CheatSheet[] = [
  {
    id: 'syntax',
    title: 'Синтаксис GDScript',
    summary: 'Типы, операторы, ключевые слова и встроенные функции — то, что нужно помнить под рукой.',
    groups: [
      {
        title: 'Объявления',
        rows: [
          { left: 'Константа', right: 'const MAX_HP := 100' },
          { left: 'Переменная с выводом типа', right: 'var hp := 10' },
          { left: 'Переменная с явным типом', right: 'var hp: int = 10' },
          { left: 'Экспорт в инспектор', right: '@export var speed: float = 200.0' },
          { left: 'Ссылка на узел при старте', right: '@onready var sprite := $Sprite2D' },
          { left: 'Именованный класс', right: 'class_name Player' },
          { left: 'Наследование', right: 'extends CharacterBody2D' },
          { left: 'Свой сигнал', right: 'signal died(reason: String)' },
          { left: 'Перечисление', right: 'enum Rank { NEWBIE, VETERAN }' },
        ],
      },
      {
        title: 'Типы',
        rows: [
          { left: 'Целые и дробные', right: 'int, float' },
          { left: 'Строка', right: 'String' },
          { left: 'Логическое', right: 'bool' },
          { left: 'Вектор', right: 'Vector2, Vector3' },
          { left: 'Цвет', right: 'Color' },
          { left: 'Массив', right: 'Array[int] (типизированный)' },
          { left: 'Словарь', right: 'Dictionary[String, int]' },
          { left: 'Без типа', right: 'Variant (лучше избегать)' },
        ],
      },
      {
        title: 'Операторы',
        rows: [
          { left: 'Присваивание', right: '= , += , -= , *= , /=' },
          { left: 'Сравнение', right: '== , != , < , > , <= , >=' },
          { left: 'Логика', right: 'and , or , not' },
          { left: 'Целочисленное деление', right: '7 / 2 == 3 (!)' },
          { left: 'Дробное деление', right: '7.0 / 2 == 3.5' },
          { left: 'Остаток', right: '%' },
          { left: 'Приведение типа', right: 'float(7) , int("42")' },
          { left: 'Тернарный оператор', right: '"да" if условие else "нет"' },
        ],
      },
      {
        title: 'Ключевые слова',
        rows: [
          { left: 'Условие', right: 'if / elif / else' },
          { left: 'Ветвление по значению', right: 'match / _' },
          { left: 'Цикл по диапазону', right: 'for i in range(3):' },
          { left: 'Цикл по коллекции', right: 'for key in dictionary:' },
          { left: 'Цикл с условием', right: 'while условие:' },
          { left: 'Выход из цикла', right: 'break' },
          { left: 'Следующая итерация', right: 'continue' },
          { left: 'Возврат', right: 'return значение' },
          { left: 'Ожидание сигнала', right: 'await сигнал' },
        ],
      },
      {
        title: 'Встроенные функции',
        rows: [
          { left: 'Печать', right: 'print() , push_warning() , push_error()' },
          { left: 'Длина', right: 'arr.size() , str.length()' },
          { left: 'Проверка типа', right: 'value is Node2D' },
          { left: 'Диапазон', right: 'range(1, 6) , range(0, 10, 2)' },
          { left: 'Округление', right: 'roundi() , floorf() , ceilf()' },
          { left: 'Ограничение', right: 'clampi() , clampf() , min() , max()' },
          { left: 'Строка', right: '"текст".format() , "%s" % значение' },
          { left: 'Строка → число', right: '"42".is_valid_int() , int("42")' },
          { left: 'Случайность', right: 'randi_range() , randf_range()' },
          { left: 'Время', right: 'Time.get_ticks_msec()' },
        ],
      },
      {
        title: 'Строки',
        rows: [
          { left: 'Перенос строки', right: '"первая\\nвторая"' },
          { left: 'Соединить', right: '"a" + "b" , str(value)' },
          { left: 'Разделить', right: '"a,b".split(",")' },
          { left: 'Обрезать края', right: '"  x  ".strip_edges()' },
          { left: 'Заменить', right: '"a-b".replace("-", "+")' },
          { left: 'Найти', right: '"abc".find("b")' },
        ],
      },
    ],
  },
  {
    id: 'nodes',
    title: 'Карта узлов',
    summary: 'Какой узел взять под задачу. Ошибка в выборе узла — источник половины странных багов.',
    groups: [
      {
        title: 'Движение и физика (2D)',
        rows: [
          { left: 'Игрок, который двигается кодом', right: 'CharacterBody2D + CollisionShape2D' },
          { left: 'Стена, пол, платформа', right: 'StaticBody2D + CollisionShape2D' },
          { left: 'Бочка, мяч на физике', right: 'RigidBody2D' },
          { left: 'Зона урона, подбор, триггер', right: 'Area2D + CollisionShape2D' },
          { left: 'Видимая картинка', right: 'Sprite2D' },
          { left: 'Группа спрайтов', right: 'AnimatedSprite2D' },
        ],
      },
      {
        title: 'Мир и уровень',
        rows: [
          { left: 'Уровень из тайлов (Godot 4.3+)', right: 'TileMapLayer + TileSet' },
          { left: 'Слой UI поверх мира', right: 'CanvasLayer' },
          { left: 'Следование за игроком', right: 'Camera2D (position_smoothing)' },
          { left: 'Фон с параллаксом', right: 'Parallax2D (4.3+)' },
          { left: 'Проверка края и стен', right: 'RayCast2D' },
          { left: 'Эффект частиц', right: 'GPUParticles2D + ParticleProcessMaterial' },
        ],
      },
      {
        title: 'Интерфейс',
        rows: [
          { left: 'Текст', right: 'Label' },
          { left: 'Кнопка', right: 'Button' },
          { left: 'Картинка в интерфейсе', right: 'TextureRect' },
          { left: 'Панель с авторазмером', right: 'PanelContainer' },
          { left: 'Вертикальная раскладка', right: 'VBoxContainer' },
          { left: 'Горизонтальная раскладка', right: 'HBoxContainer' },
          { left: 'Поля от краёв', right: 'MarginContainer' },
          { left: 'Полоска прогресса', right: 'ProgressBar' },
        ],
      },
      {
        title: 'Звук',
        rows: [
          { left: 'Музыка, звуки интерфейса', right: 'AudioStreamPlayer' },
          { left: 'Звук в позиции (2D)', right: 'AudioStreamPlayer2D' },
          { left: 'Звук в пространстве (3D)', right: 'AudioStreamPlayer3D' },
          { left: 'Шина и её громкость', right: 'AudioServer + шины в настройках' },
        ],
      },
      {
        title: '3D',
        rows: [
          { left: 'Объект в пространстве', right: 'Node3D' },
          { left: 'Видимая геометрия', right: 'MeshInstance3D + BoxMesh' },
          { left: 'Коллизия в 3D', right: 'CollisionShape3D + BoxShape3D' },
          { left: 'Камера', right: 'Camera3D' },
          { left: 'Солнце', right: 'DirectionalLight3D' },
          { left: 'Небо и ambient', right: 'WorldEnvironment + Environment' },
          { left: 'Персонаж в 3D', right: 'CharacterBody3D' },
        ],
      },
      {
        title: 'Данные и логика',
        rows: [
          { left: 'Данные, сохраняемые в файл', right: 'Resource (.tres)' },
          { left: 'Глобальный сервис', right: 'Автолоад (Project → Project Settings → Autoload)' },
          { left: 'Общий доступ к узлам', right: 'Группа (Group)' },
          { left: 'Быстрый доступ к узлу', right: '%UniqueName или @onready' },
        ],
      },
    ],
  },
  {
    id: 'errors',
    title: 'Ловушки и разборы',
    summary:
      'Неочевидное поведение GDScript и типичные ошибки мышления. Сообщения движка разобраны отдельно — в справочнике ошибок.',
    groups: [
      {
        title: 'Логические ловушки',
        rows: [
          {
            left: '7 / 2 == 3',
            right: 'Целочисленное деление. Пишите 7.0 / 2',
          },
          {
            left: 'Объект исчезает при queue_free()',
            right: 'Обращайтесь к нему после этого только через is_instance_valid()',
          },
          {
            left: 'Сигнал не срабатывает',
            right: 'Подписка сделана после emit — или узел не в дереве',
          },
          {
            left: '_ready не вызывается',
            right: 'Узел не добавлен в сцену через add_child()',
          },
          {
            left: 'Движение дёргается',
            right: 'Не умножаете скорость на delta',
          },
          {
            left: 'Объект проходит сквозь стены',
            right: 'Нет CollisionShape2D или не совпали слои и маски',
          },
          {
            left: 'Звук не слышно',
            right: 'Проверьте шину, громкость и что узел вообще в сцене',
          },
        ],
      },
    ],
  },
  {
    id: 'shortcuts',
    title: 'Хоткеи редактора',
    summary: 'Горячие клавиши Godot 4 по умолчанию. Любую можно переназначить в Editor → Editor Settings → Shortcuts.',
    groups: [
      {
        title: 'Запуск и сохранение',
        rows: [
          { left: 'Запустить проект', right: 'F5' },
          { left: 'Запустить текущую сцену', right: 'F6' },
          { left: 'Остановить выполнение', right: 'F8' },
          { left: 'Сохранить сцену', right: 'Ctrl + S' },
          { left: 'Сохранить как', right: 'Ctrl + Shift + S' },
          { left: 'Экспорт проекта', right: 'Ctrl + Shift + E' },
        ],
      },
      {
        title: 'Навигация по проекту',
        rows: [
          { left: 'Быстрый поиск файла', right: 'Ctrl + P' },
          { left: 'Поиск по файлам', right: 'Ctrl + Shift + F' },
          { left: 'Список команд', right: 'Ctrl + Shift + P' },
        ],
      },
      {
        title: 'Дерево сцены',
        rows: [
          { left: 'Добавить дочерний узел', right: 'Ctrl + A' },
          { left: 'Переименовать узел', right: 'F2' },
          { left: 'Дублировать узел', right: 'Ctrl + D' },
          { left: 'Удалить узел', right: 'Del' },
          { left: 'Переместить вверх / вниз', right: 'Ctrl + Shift + ↑ / ↓' },
        ],
      },
      {
        title: 'Редактор кода',
        rows: [
          { left: 'Увеличить отступ', right: 'Tab' },
          { left: 'Уменьшить отступ', right: 'Shift + Tab' },
          { left: 'Закомментировать строку', right: 'Ctrl + K' },
          { left: 'Дублировать строку', right: 'Ctrl + Shift + D' },
          { left: 'Удалить строку', right: 'Ctrl + Shift + K' },
          { left: 'Переместить строку вверх / вниз', right: 'Alt + ↑ / ↓' },
          { left: 'Поиск по файлу', right: 'Ctrl + F' },
        ],
      },
      {
        title: '2D-редактор',
        rows: [
          { left: 'Панорама', right: 'Средняя кнопка мыши или Space + перетаскивание' },
          { left: 'Масштаб', right: 'Колесо мыши' },
          { left: 'Перемещение объектов', right: 'Перетаскивание или стрелки' },
          { left: 'Дублировать объект', right: 'Ctrl + D' },
        ],
      },
    ],
  },
]

export function findCheatSheet(id: string): CheatSheet | undefined {
  return cheatSheets.find((sheet) => sheet.id === id)
}
