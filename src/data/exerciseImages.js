import { YUHONAS_BASE } from '../services/localExercises'

// Only exercises with NO accurate yuhonas match keep local GIFs.
// All other default exercises use yImages (yuhonas animated JPGs).
const LOCAL_GIFS = {
  u8: '0092', // Barbell Seated Overhead Triceps Extension — overhead motion, no yuhonas dumbbell match
  l4: '3007', // Resistance Band Leg Extension — closest to Terminal Knee Extension
  l5: '0496', // Inverse Leg Curl — closest to Seated Band Leg Curl
  l8: '3006', // Resistance Band Seated Hip Abduction — no yuhonas match
}

// Returns a local GIF path, or null (for yuhonas images or SVG fallback)
export function getGifUrl(exercise) {
  const localId = LOCAL_GIFS[exercise.id]
  if (localId) return `/gifs/${localId}.gif`
  return null
}

// Returns [url0, url1] for yuhonas 2-frame CSS animation, or null
export function getYuhonaImages(exercise) {
  if (!exercise.yImages?.length) return null
  return exercise.yImages.map(p => YUHONAS_BASE + p)
}
