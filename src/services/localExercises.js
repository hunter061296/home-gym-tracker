import LIBRARY from '../data/exerciseLibrary'

export const YUHONAS_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

// Muscle/bodypart label used in search UI chips
export const MUSCLE_GROUPS = [
  { label: 'Chest',       muscles: ['chest'] },
  { label: 'Back',        muscles: ['middle back', 'lats', 'lower back', 'traps'] },
  { label: 'Shoulders',   muscles: ['shoulders', 'front deltoids', 'medial deltoids'] },
  { label: 'Biceps',      muscles: ['biceps'] },
  { label: 'Triceps',     muscles: ['triceps'] },
  { label: 'Core',        muscles: ['abdominals'] },
  { label: 'Glutes',      muscles: ['glutes'] },
  { label: 'Hamstrings',  muscles: ['hamstrings'] },
  { label: 'Quads',       muscles: ['quadriceps'] },
  { label: 'Calves',      muscles: ['calves'] },
]

export const EQUIPMENT_GROUPS = [
  { label: 'Dumbbell',    value: 'dumbbell' },
  { label: 'Bodyweight',  value: 'body weight' },
  { label: 'Bands',       value: 'bands' },
]

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

function matchesMuscle(ex, muscles) {
  return muscles.some(m =>
    ex.primaryMuscles.some(p => normalize(p).includes(normalize(m))) ||
    ex.secondaryMuscles.some(p => normalize(p).includes(normalize(m)))
  )
}

export function searchByName(query, limit = 30) {
  const q = normalize(query)
  if (!q) return []
  return LIBRARY
    .filter(ex => normalize(ex.name).includes(q))
    .slice(0, limit)
}

export function filterExercises({ query = '', muscleGroup = null, equipment = null } = {}, limit = 40) {
  let results = LIBRARY
  if (equipment) results = results.filter(ex => normalize(ex.equipment) === normalize(equipment))
  if (muscleGroup) {
    const muscles = MUSCLE_GROUPS.find(g => g.label === muscleGroup)?.muscles || []
    results = results.filter(ex => matchesMuscle(ex, muscles))
  }
  if (query) {
    const q = normalize(query)
    results = results.filter(ex => normalize(ex.name).includes(q))
  }
  return results.slice(0, limit)
}

export function findByName(name) {
  const q = normalize(name)
  return LIBRARY.find(ex => normalize(ex.name) === q) ||
         LIBRARY.find(ex => normalize(ex.name).includes(q)) ||
         null
}

// Build two image URLs for CSS 2-frame animation
export function getYuhonaImageUrls(images) {
  if (!images?.length) return null
  return images.map(p => YUHONAS_BASE + p)
}
