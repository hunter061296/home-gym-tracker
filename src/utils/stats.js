// Strength stats derived from per-set history. See [[project-home-gym-set-logging]].
import { getSetEntries } from './sets'

// Epley estimated 1-rep max for a single set.
export function e1rm(weight, reps) {
  const w = parseFloat(weight)
  if (!w || w <= 0) return 0
  const r = parseFloat(reps)
  const reps2 = r > 0 ? r : 1
  return w * (1 + reps2 / 30)
}

// Best done set in a state by estimated 1RM → { weight, reps, e1rm } or null.
export function bestSet(state) {
  let best = null
  for (const s of getSetEntries(state)) {
    if (!s.done) continue
    const est = e1rm(s.weight, s.reps)
    if (est <= 0) continue
    if (!best || est > best.e1rm) {
      best = { weight: parseFloat(s.weight), reps: parseFloat(s.reps) || null, e1rm: est }
    }
  }
  return best
}

// Heaviest weight lifted (any reps) among done sets.
export function topWeight(state) {
  let max = 0
  for (const s of getSetEntries(state)) {
    if (!s.done) continue
    const w = parseFloat(s.weight)
    if (w > max) max = w
  }
  return max
}

// Total volume = Σ(weight × reps) over done sets.
export function volume(state) {
  let v = 0
  for (const s of getSetEntries(state)) {
    if (!s.done) continue
    const w = parseFloat(s.weight)
    const r = parseFloat(s.reps)
    if (w > 0 && r > 0) v += w * r
  }
  return v
}

// Chronological (oldest→newest) series of an exercise across history.
export function exerciseSeries(history, exerciseId) {
  const points = []
  for (const session of history || []) {
    const st = session.exerciseStates?.find(s => s.id === exerciseId)
    if (!st) continue
    const bs = bestSet(st)
    const tw = topWeight(st)
    points.push({
      date: session.date,
      sessionId: session.id,
      e1rm: bs?.e1rm || 0,
      topWeight: tw,
      volume: volume(st),
      best: bs,
      summary: st,
    })
  }
  return points.reverse() // history is newest-first
}

// Exercises that appear anywhere in history, newest-first, deduped by id.
export function exercisesInHistory(history) {
  const seen = new Map()
  for (const session of history || []) {
    for (const st of session.exerciseStates || []) {
      if (!seen.has(st.id)) seen.set(st.id, { id: st.id, name: st.name, lastDate: session.date })
    }
  }
  return [...seen.values()]
}

// Personal records set in a session vs all prior history (only counts beating an
// existing best — the first time you log weights just sets the baseline).
export function detectPRs(history, sessionId) {
  const current = (history || []).find(s => s.id === sessionId)
  if (!current) return []
  const prior = (history || []).filter(s => s.id !== sessionId)
  const prs = []
  for (const st of current.exerciseStates || []) {
    const curBest = bestSet(st)
    if (!curBest) continue
    let priorBest = 0
    for (const ps of prior) {
      const pst = ps.exerciseStates?.find(x => x.id === st.id)
      const pb = pst && bestSet(pst)
      if (pb && pb.e1rm > priorBest) priorBest = pb.e1rm
    }
    if (priorBest > 0 && curBest.e1rm > priorBest + 0.01) {
      prs.push({ id: st.id, name: st.name, weight: curBest.weight, reps: curBest.reps, e1rm: curBest.e1rm })
    }
  }
  return prs
}
