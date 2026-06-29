// Per-set logging helpers.
// Tolerant of both formats:
//   • new: state.sets = [{ weight, reps, done }]
//   • old: state.completedSets = [bool], state.weight = "12.5kg each"
// so historical workouts logged before per-set tracking still render.

// Get the ISO week string (e.g. "2026-W26") for a given date.
export function getIsoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

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

// Apply progressive overload to an exercise, given its definition and last performance.
// Returns { lastIncreasedWeek } if overload was applied, or null if it wasn't.
export function computeOverload(exercise, lastPerf) {
  const po = exercise?.progressiveOverload
  if (!po || !po.enabled) return null
  const currentWeek = getIsoWeek()
  if (po.lastIncreasedWeek === currentWeek) return null

  // Need at least some data to track the week
  if (po.type === 'weight' && (!lastPerf || !hasWeight(lastPerf.sets))) return null
  return { lastIncreasedWeek: currentWeek }
}

// Always compute the per-set overload targets for display, without week-gating.
// Returns an array of { weight: string, reps: string } — one per set — or null.
// Each set's value is derived from the matching set in lastPerf, increased by the increment.
export function getOverloadTarget(exercise, lastPerf) {
  const po = exercise?.progressiveOverload
  if (!po || !po.enabled) return null

  // How many sets to produce? Use the exercise's set count.
  const setCount = exercise.sets || 1
  const result = Array.from({ length: setCount }, (_, i) => ({
    weight: '',
    reps: '',
  }))

  if (po.type === 'weight') {
    if (!lastPerf) return null
    for (let i = 0; i < setCount; i++) {
      const prevSet = lastPerf.sets?.[i]
      const prevW = prevSet ? parseFloat(prevSet.weight) : NaN
      if (isNaN(prevW) || prevW <= 0) return null // bail — need real data
      result[i].weight = roundToOne(prevW + po.incrementWeight)
    }
    return result
  }

  if (po.type === 'reps') {
    if (!lastPerf) return null
    for (let i = 0; i < setCount; i++) {
      const prevSet = lastPerf.sets?.[i]
      const prevR = prevSet ? parseInt(prevSet.reps, 10) : NaN
      if (isNaN(prevR) || prevR <= 0) return null // bail — need real data
      result[i].reps = String(prevR + po.incrementReps)
    }
    return result
  }

  return null
}

function roundToOne(v) { return Math.round(v * 10) / 10 }

function hasWeight(sets) {
  for (const s of sets || []) {
    const w = parseFloat(s.weight)
    if (!isNaN(w) && w > 0) return true
  }
  return false
}
