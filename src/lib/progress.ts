/**
 * Хранилище прогресса обучения в localStorage.
 *
 * Формат ключа (требование проекта): godot-plan:v1:<stageId>:<itemId>
 * itemId состоит из вида пункта и его идентификатора: topic-ready, step-install,
 * task-t0-1, criterion-c0-1, project.
 *
 * Запись идёт по событию, а не эффектом на каждое изменение состояния.
 * Все обращения обёрнуты в try/catch: в приватном режиме браузера
 * localStorage может бросить исключение.
 */

export const PROGRESS_PREFIX = 'godot-plan:v1'
export const THEME_KEY = `${PROGRESS_PREFIX}:theme`
export const META_KEY = `${PROGRESS_PREFIX}:meta`

export type ProgressKind = 'topic' | 'step' | 'task' | 'criterion' | 'project'

export function progressKey(stageId: string, itemId: string, kind: ProgressKind): string {
  return `${PROGRESS_PREFIX}:${stageId}:${kind}-${itemId}`
}

function safeStorage(): Storage | null {
  try {
    const probe = '__godot_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

let storage: Storage | null | undefined

function getStorage(): Storage | null {
  if (storage === undefined) storage = safeStorage()
  return storage
}

/** Читает весь набор отмеченных пунктов. */
export function readProgress(): Set<string> {
  const store = getStorage()
  const result = new Set<string>()
  if (!store) return result
  try {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i)
      if (key && key.startsWith(`${PROGRESS_PREFIX}:`) && key !== THEME_KEY && key !== META_KEY) {
        result.add(key)
      }
    }
  } catch {
    return result
  }
  return result
}

export function isDone(key: string): boolean {
  const store = getStorage()
  if (!store) return false
  try {
    return store.getItem(key) === '1'
  } catch {
    return false
  }
}

export function setDone(key: string, done: boolean): void {
  const store = getStorage()
  if (!store) return
  try {
    if (done) store.setItem(key, '1')
    else store.removeItem(key)
  } catch {
    /* квота исчерпана — просто не сохраняем */
  }
  notify()
}

export function clearProgress(): void {
  const store = getStorage()
  if (!store) return
  try {
    const keys: string[] = []
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i)
      if (key && key.startsWith(`${PROGRESS_PREFIX}:`)) keys.push(key)
    }
    for (const key of keys) store.removeItem(key)
  } catch {
    /* игнорируем */
  }
  notify()
}

/* ------------------------------------------------------------------ */
/* Подписка на изменения                                               */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key.startsWith(PROGRESS_PREFIX)) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Снимок состояния для useSyncExternalStore. */
export function getSnapshot(): string {
  return [...readProgress()].sort().join('|')
}
