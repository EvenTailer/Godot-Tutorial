import type { ResourceGroup } from './types'

/** Подборка внешних ресурсов. Только официальные и широко известные источники. */
export const resourceGroups: ResourceGroup[] = [
  {
    id: 'res-docs',
    title: 'Официальная документация',
    summary: 'Единственный источник истины по API. Справочник классов читайте при сомнениях, а не при поиске идеи.',
    items: [
      {
        title: 'Документация Godot 4',
        url: 'https://docs.godotengine.org/en/stable/',
        kind: 'docs',
        note: 'Версию переключают в правом верхнем углу сайта.',
      },
      {
        title: 'Справочник классов (Class Reference)',
        url: 'https://docs.godotengine.org/en/stable/classes/class_class.html',
        kind: 'reference',
        note: 'Поиск по имени класса: Node2D, CharacterBody2D, TileMapLayer.',
      },
      {
        title: 'Учебные материалы',
        url: 'https://docs.godotengine.org/en/stable/tutorials/index.html',
        kind: 'docs',
      },
      {
        title: 'Справочник GDScript',
        url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_reference.html',
        kind: 'reference',
      },
    ],
  },
  {
    id: 'res-community',
    title: 'Сообщество',
    summary: 'Вопросы, готовые решения, обзоры ошибок. Форум и Discord — место, где ищут ответ на нестандартную проблему.',
    items: [
      {
        title: 'Форум Godot',
        url: 'https://forum.godotengine.org/',
        kind: 'article',
        note: 'Поиск по форуму часто быстрее, чем чтение документации.',
      },
      {
        title: 'Discord-сервер Godot',
        url: 'https://discord.godotengine.org/',
        kind: 'tool',
        note: 'Канал #help — быстрые ответы на живые вопросы.',
      },
      {
        title: 'Reddit r/godot',
        url: 'https://www.reddit.com/r/godot/',
        kind: 'article',
      },
      {
        title: 'Демо-проекты Godot',
        url: 'https://github.com/godotengine/godot-demo-projects',
        kind: 'tool',
        note: 'Как устроены проекты, которые делала команда движка.',
      },
    ],
  },
  {
    id: 'res-assets',
    title: 'Графика, звук и ассеты',
    summary: 'Бесплатные наборы для учебных проектов. Главное — проверять лицензию каждого файла.',
    items: [
      {
        title: 'Kenney — наборы ассетов',
        url: 'https://kenney.nl/assets',
        kind: 'tool',
        note: 'Почти всё под CC0: можно использовать свободно.',
      },
      {
        title: 'OpenGameArt',
        url: 'https://opengameart.org/',
        kind: 'tool',
        note: 'Лицензии разные: смотрите поле License у каждого файла.',
      },
      {
        title: 'itch.io — бесплатные ассеты',
        url: 'https://itch.io/game-assets/free',
        kind: 'tool',
      },
      {
        title: 'Freesound — звуки',
        url: 'https://freesound.org/',
        kind: 'tool',
        note: 'Для учебных проектов достаточно звуков с лицензией CC0.',
      },
      {
        title: 'Google Fonts (шрифты)',
        url: 'https://fonts.google.com/',
        kind: 'tool',
        note: 'Для интерфейса игры лучше системные шрифты — они не тормозят загрузку.',
      },
    ],
  },
  {
    id: 'res-learning',
    title: 'Книги и видео',
    summary: 'Для тех, кто хочет системный курс целиком, а не только по этапам.',
    items: [
      {
        title: 'Godot 4 Game Development Cookbook (англ.)',
        url: 'https://www.packtpub.com/product/godot-4-game-development-cookbook/9781837635927',
        kind: 'article',
        note: 'Рецепты по конкретным задачам: физика, ИИ, UI, звук.',
      },
      {
        title: 'GDQuest — обучение Godot',
        url: 'https://gdquest.com/',
        kind: 'video',
        note: 'Бесплатные туториалы с текстовыми версиями.',
      },
      {
        title: 'Learn GDScript From Zero',
        url: 'https://gdscript.com/',
        kind: 'article',
        note: 'Интерактивный курс по языку — хорошо для этапа 01.',
      },
    ],
  },
  {
    id: 'res-tools',
    title: 'Инструменты',
    summary: 'То, что пригодится, когда проект перерастёт один файл скрипта.',
    items: [
      {
        title: 'GUT — тест-фреймворк для Godot',
        url: 'https://github.com/bitwes/Gut',
        kind: 'tool',
        note: 'Встроенного тест-раннера в движке нет.',
      },
      {
        title: 'gdUnit4 — альтернатива GUT',
        url: 'https://github.com/MikeSchulze/gdUnit4',
        kind: 'tool',
      },
      {
        title: 'Aseprite — пиксельная графика',
        url: 'https://www.aseprite.org/',
        kind: 'tool',
        note: 'Бесплатная версия для GitHub-аккаунтов разработчиков open source.',
      },
      {
        title: 'Godot Asset Library',
        url: 'https://godotengine.org/asset-library/asset',
        kind: 'tool',
        note: 'Плагины и шаблоны прямо в редакторе: Project → Project Settings → Plugins.',
      },
    ],
  },
]

export function findResourceGroup(id: string): ResourceGroup | undefined {
  return resourceGroups.find((group) => group.id === id)
}
