import { DEFAULT_PROGRAM } from '../data/defaultProgram'

export function loadProgram() {
  try {
    const s = localStorage.getItem('workout_program')
    if (s) return JSON.parse(s)
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
