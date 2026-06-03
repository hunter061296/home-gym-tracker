// Per-set logging helpers.
// Tolerant of both formats:
//   • new: state.sets = [{ weight, reps, done }]
//   • old: state.completedSets = [bool], state.weight = "12.5kg each"
// so historical workouts logged before per-set tracking still render.

export function getSetEntries(state) {
  if (!state) return []
  if (Array.isArray(state.sets)) return state.sets
  if (Array.isArray(state.completedSets)) {
    return state.completedSets.map(done => ({ weight: '', reps: '', done: !!done }))
  }
  return []
}

export function doneCount(state) {
  return getSetEntries(state).filter(s => s.done).length
}

export function totalSets(state) {
  return getSetEntries(state).length
}

export function isExerciseComplete(state) {
  const sets = getSetEntries(state)
  return sets.length > 0 && sets.every(s => s.done)
}

// Compact label for a single set, e.g. "12.5×10" / "12.5kg" / "10".
export function fmtSetShort(s) {
  if (!s) return '—'
  const w = s.weight !== '' && s.weight != null ? String(s.weight) : ''
  const r = s.reps !== '' && s.reps != null ? String(s.reps) : ''
  if (w && r) return `${w}×${r}`
  if (w) return `${w}kg`
  if (r) return `${r} reps`
  return s.done ? '✓' : '—'
}

// One-line summary of the sets actually performed, e.g. "12.5kg×10, 12.5kg×10, 12.5kg×8".
// Falls back to the old free-text weight string for legacy entries.
export function formatSetsSummary(state) {
  if (state && Array.isArray(state.sets)) {
    const done = state.sets.filter(s => s.done)
    if (!done.length) return ''
    // If no weight/reps were logged (pure checkmarks), show nothing rather than "✓, ✓, ✓".
    const hasNumbers = done.some(s => (s.weight !== '' && s.weight != null) || (s.reps !== '' && s.reps != null))
    if (!hasNumbers) return ''
    return done.map(s => {
      const w = s.weight !== '' && s.weight != null ? `${s.weight}kg` : ''
      const r = s.reps !== '' && s.reps != null ? `${s.reps}` : ''
      if (w && r) return `${w}×${r}`
      if (w) return w
      if (r) return `${r} reps`
      return '✓'
    }).join(', ')
  }
  return state?.weight || ''
}

// Most recent logged performance of an exercise, scanning newest-first history.
// Returns { date, state, sets } or null.
export function getLastPerformance(history, exerciseId) {
  for (const session of history || []) {
    const st = session.exerciseStates?.find(s => s.id === exerciseId)
    if (!st) continue
    const sets = getSetEntries(st)
    const hasData = sets.some(s => s.done || s.weight || s.reps) || st.weight
    if (hasData) return { date: session.date, state: st, sets }
  }
  return null
}
