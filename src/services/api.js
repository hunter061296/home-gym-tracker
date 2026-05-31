const BASE_URL = 'https://exercisedb.p.rapidapi.com'
const HEADERS = {
  'X-RapidAPI-Key': '25cdd60019msh7111ba41590050ep1df2a5jsn62fef8488125',
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
}
const CACHE_TTL = 24 * 60 * 60 * 1000

function getCache() {
  try { return JSON.parse(localStorage.getItem('exercise_cache') || '{}') } catch { return {} }
}

function setCache(cache) {
  try { localStorage.setItem('exercise_cache', JSON.stringify(cache)) } catch {}
}

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS })
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

export const searchExercise = (query) =>
  withCache(`name1:${query.toLowerCase()}`, () =>
    apiFetch(`/exercises/name/${encodeURIComponent(query)}?limit=1`).then(r => r[0] || null)
  )

export const searchExercises = (query) =>
  withCache(`names:${query.toLowerCase()}`, () =>
    apiFetch(`/exercises/name/${encodeURIComponent(query)}?limit=20`)
  )

export const byBodyPart = (part) =>
  withCache(`bp:${part}`, () =>
    apiFetch(`/exercises/bodyPart/${part}?limit=30`)
  )

export const byEquipment = (eq) =>
  withCache(`eq:${eq}`, () =>
    apiFetch(`/exercises/equipment/${eq}?limit=30`)
  )

export const byMuscle = (muscle) =>
  withCache(`tm:${muscle}`, () =>
    apiFetch(`/exercises/target/${muscle}?limit=30`)
  )
