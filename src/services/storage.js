import { DEFAULT_PROGRAM } from '../data/defaultProgram'

export const DEFAULT_TIMER_SETTINGS = {
  autoStart: true,
  vibration: true,
  audioBeep: true,
  restTimes: { compound: 90, isolation: 60, rehab: 45, core: 45 },
}

export function loadTimerSettings() {
  try {
    const s = localStorage.getItem('timer_settings')
    if (s) {
      const parsed = JSON.parse(s)
      return { ...DEFAULT_TIMER_SETTINGS, ...parsed, restTimes: { ...DEFAULT_TIMER_SETTINGS.restTimes, ...parsed.restTimes } }
    }
  } catch {}
  return { ...DEFAULT_TIMER_SETTINGS, restTimes: { ...DEFAULT_TIMER_SETTINGS.restTimes } }
}

export function saveTimerSettings(s) {
  localStorage.setItem('timer_settings', JSON.stringify(s))
}

// Fields we always sync from DEFAULT_PROGRAM for built-in exercises so they stay current.
const SYNC_FIELDS = ['instructions', 'target', 'secondaryMuscles', 'yImages', 'svgKey']

function buildDefaultById() {
  const map = {}
  for (const routine of Object.values(DEFAULT_PROGRAM.routines)) {
    for (const ex of routine.exercises) map[ex.id] = ex
  }
  return map
}

function syncExercises(exercises, defaultById) {
  return exercises.map(ex => {
    const def = defaultById[ex.id]
    if (!def) return ex
    const synced = { ...ex }
    for (const field of SYNC_FIELDS) {
      if (def[field] !== undefined) synced[field] = def[field]
      else delete synced[field]
    }
    return synced
  })
}

export function loadProgram() {
  try {
    const raw = localStorage.getItem('workout_program')
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PROGRAM))

    const saved = JSON.parse(raw)
    const defaultById = buildDefaultById()

    // ── Migrate old flat format (has upper/lower arrays) ──────────────────────
    if (Array.isArray(saved.upper) || Array.isArray(saved.lower)) {
      const result = JSON.parse(JSON.stringify(DEFAULT_PROGRAM))
      if (Array.isArray(saved.upper))
        result.routines['upper-a'].exercises = syncExercises(saved.upper, defaultById)
      if (Array.isArray(saved.lower))
        result.routines['lower-a'].exercises = syncExercises(saved.lower, defaultById)
      return result
    }

    // ── New format: sync built-in exercise fields in all routines ─────────────
    const syncedRoutines = {}
    for (const [id, routine] of Object.entries(saved.routines || {})) {
      syncedRoutines[id] = { ...routine, exercises: syncExercises(routine.exercises || [], defaultById) }
    }

    return {
      routines: syncedRoutines,
      schedule: saved.schedule || JSON.parse(JSON.stringify(DEFAULT_PROGRAM.schedule)),
    }
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_PROGRAM))
  }
}

export function saveProgram(p) {
  localStorage.setItem('workout_program', JSON.stringify(p))
}

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem('workout_history') || '[]') } catch { return [] }
}

export function saveHistory(h) {
  localStorage.setItem('workout_history', JSON.stringify(h))
}

export function loadDeloadDate() {
  return localStorage.getItem('last_deload_date')
}

export function saveDeloadDate(d) {
  localStorage.setItem('last_deload_date', d)
}

export function resetToDefault() {
  localStorage.removeItem('workout_program')
  return JSON.parse(JSON.stringify(DEFAULT_PROGRAM))
}
