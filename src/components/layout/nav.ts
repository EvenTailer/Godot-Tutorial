/**
 * Пункты основной навигации сайта.
 *
 * `label` — полное название (подвал, заголовки страниц).
 * `shortLabel` — короткая форма для верхней панели: на 1024px
 * восемь пунктов с полными названиями не помещаются рядом с логотипом.
 */
export const navItems = [
  { to: '/', label: 'Главная', shortLabel: 'Главная', end: true },
  { to: '/roadmap', label: 'Дорожная карта', shortLabel: 'Карта' },
  { to: '/plan', label: 'План 24 недели', shortLabel: 'План' },
  { to: '/ladder', label: 'Лестница проектов', shortLabel: 'Лестница' },
  { to: '/cheatsheets', label: 'Шпаргалки', shortLabel: 'Шпаргалки' },
  { to: '/errors', label: 'Ошибки Godot', shortLabel: 'Ошибки' },
  { to: '/resources', label: 'Ресурсы', shortLabel: 'Ресурсы' },
  { to: '/faq', label: 'FAQ', shortLabel: 'FAQ' },
  // Справочный раздел: в шапке восемь пунктов уже не помещаются на 1024px,
  // поэтому в верхней панели его нет, а в подвале — есть.
  { to: '/versions', label: 'Версии движка', inHeader: false },
]
