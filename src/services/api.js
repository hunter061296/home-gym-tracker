const BASE = 'https://api.workoutxapp.com/v1'
const KEY = 'wx_419d7e78264b999296d35cf96668bd7494ddf9f97b2998c295e17771'
const HEADERS = { 'X-WorkoutX-Key': KEY }
const CACHE_TTL = 24 * 60 * 60 * 1000

function getCache() {
  try { return JSON.parse(localStorage.getItem('exercise_cache') || '{}') } catch { return {} }
}

function setCache(cache) {
  try { localStorage.setItem('exercise_cache', JSON.stringify(cache)) } catch {}
}

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

function withCache(key, fetcher) {
  const cache = getCache()
  const hit = cache[key]
  if (hit && Date.now() - hit.at < CACHE_TTL) return Promise.resolve(hit.data)
  return fetcher().then(data => {
    cache[key] = { data, at: Date.now() }
    setCache(cache)
    return data
  })
}

// Returns first match — used to fetch instructions/target muscle on workout start
export const searchExercise = (query) =>
  withCache(`name1:${query.toLowerCase()}`, () =>
    apiFetch(`/exercises/name/${encodeURIComponent(query)}?limit=1`).then(r => (r.data || [])[0] || null)
  )

export const searchExercises = (query) =>
  withCache(`names:${query.toLowerCase()}`, () =>
    apiFetch(`/exercises/name/${encodeURIComponent(query)}?limit=20`).then(r => r.data || [])
  )

export const byBodyPart = (part) =>
  withCache(`bp:${part.toLowerCase()}`, () =>
    apiFetch(`/exercises/bodyPart/${encodeURIComponent(part)}?limit=30`).then(r => r.data || [])
  )

export const byEquipment = (eq) =>
  withCache(`eq:${eq.toLowerCase()}`, () =>
    apiFetch(`/exercises/equipment/${encodeURIComponent(eq)}?limit=30`).then(r => r.data || [])
  )

export const byMuscle = (muscle) =>
  withCache(`tm:${muscle.toLowerCase()}`, () =>
    apiFetch(`/exercises/target/${encodeURIComponent(muscle)}?limit=30`).then(r => r.data || [])
  )

export const getExerciseById = (id) =>
  withCache(`id:${id}`, () => apiFetch(`/exercises/${id}`))
