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

// Fields we always sync from DEFAULT_PROGRAM for default exercises,
// so they stay current even if the user has an older saved program.
const SYNC_FIELDS = ['instructions', 'target', 'secondaryMuscles', 'yImages', 'svgKey']

export function loadProgram() {
  try {
    const s = localStorage.getItem('workout_program')
    if (s) {
      const saved = JSON.parse(s)
      const defaultById = {}
      for (const ex of [...DEFAULT_PROGRAM.upper, ...DEFAULT_PROGRAM.lower]) {
        defaultById[ex.id] = ex
      }
      const merge = exercises => exercises.map(ex => {
        const def = defaultById[ex.id]
        if (!def) return ex // custom exercise — leave untouched
        const synced = { ...ex }
        for (const field of SYNC_FIELDS) {
          if (def[field] !== undefined) synced[field] = def[field]
          else delete synced[field]
        }
        return synced
      })
      return { ...saved, upper: merge(saved.upper || []), lower: merge(saved.lower || []) }
    }
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_PROGRAM))
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
