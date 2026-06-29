import { DEFAULT_PROGRAM, DEFAULT_OVERLOAD } from '../data/defaultProgram'

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

export function loadAclMode() {
  try {
    const v = localStorage.getItem('acl_mode')
    if (v !== null) return JSON.parse(v)
  } catch {}
  return true
}

export function saveAclMode(v) {
  localStorage.setItem('acl_mode', JSON.stringify(v))
}

// Fields we always sync from DEFAULT_PROGRAM for built-in exercises so they stay current.
const SYNC_FIELDS = ['instructions', 'target', 'secondaryMuscles', 'yImages', 'svgKey']

// Ensure every exercise has a progressiveOverload field (for migration from old data)
function ensureOverloadField(exercises) {
  return exercises.map(ex => {
    if (ex.progressiveOverload) return ex
    return { ...ex, progressiveOverload: { ...DEFAULT_OVERLOAD } }
  })
}

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
        result.routines['upper-a'].exercises = ensureOverloadField(syncExercises(saved.upper, defaultById))
      if (Array.isArray(saved.lower))
        result.routines['lower-a'].exercises = ensureOverloadField(syncExercises(saved.lower, defaultById))
      return result
    }

    // ── New format: sync built-in exercise fields in all routines ─────────────
    const syncedRoutines = {}
    for (const [id, routine] of Object.entries(saved.routines || {})) {
      syncedRoutines[id] = { ...routine, exercises: ensureOverloadField(syncExercises(routine.exercises || [], defaultById)) }
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

// ── Customizable weight quick-pick increments ────────────────────────────────
export const DEFAULT_PLATE_INCREMENTS = [2.5, 5, 7.5, 10, 12.5, 15]

export function loadPlateIncrements() {
  try {
    const s = localStorage.getItem('plate_increments')
    if (s) {
      const arr = JSON.parse(s)
      if (Array.isArray(arr)) return arr.filter(n => typeof n === 'number' && n > 0).sort((a, b) => a - b)
    }
  } catch {}
  return [...DEFAULT_PLATE_INCREMENTS]
}

export function savePlateIncrements(arr) {
  localStorage.setItem('plate_increments', JSON.stringify(arr))
}

// ── Bodyweight log: [{ date: 'YYYY-MM-DD', weight: number }] ──────────────────
export function loadBodyweight() {
  try { return JSON.parse(localStorage.getItem('bodyweight_log') || '[]') } catch { return [] }
}

export function saveBodyweight(arr) {
  localStorage.setItem('bodyweight_log', JSON.stringify(arr))
}

// ── Export / Import (full backup) ────────────────────────────────────────────
const EXPORT_KEYS = {
  program: 'workout_program',
  history: 'workout_history',
  timerSettings: 'timer_settings',
  aclMode: 'acl_mode',
  deloadDate: 'last_deload_date',
  bodyweight: 'bodyweight_log',
  plateIncrements: 'plate_increments',
}

export function exportAllData() {
  const data = { app: 'home-gym-tracker', version: 1, exportedAt: new Date().toISOString() }
  for (const [key, lsKey] of Object.entries(EXPORT_KEYS)) {
    const raw = localStorage.getItem(lsKey)
    if (raw == null) { data[key] = null; continue }
    try { data[key] = JSON.parse(raw) } catch { data[key] = raw }
  }
  return data
}

export function importAllData(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid file')
  const known = Object.keys(EXPORT_KEYS).some(k => k in data)
  if (!known) throw new Error('Unrecognized backup file')
  for (const [key, lsKey] of Object.entries(EXPORT_KEYS)) {
    if (!(key in data) || data[key] == null) continue
    const v = data[key]
    localStorage.setItem(lsKey, typeof v === 'string' ? v : JSON.stringify(v))
  }
}
