import { YUHONAS_BASE } from '../services/localExercises'

// Default program exercises → local GIFs in /public/gifs/ (zero network calls)
const LOCAL_GIFS = {
  u1: '0289', // Dumbbell Bench Press
  u3: '0292', // Dumbbell One Arm Bent-over Row
  u5: '0360', // Dumbbell One Arm Shoulder Press
  u6: '0334', // Dumbbell Lateral Raise
  u7: '0285', // Dumbbell Alternate Biceps Curl
  u8: '0092', // Barbell Seated Overhead Triceps Extension
  l1: '3236', // Resistance Band Hip Thrusts
  l2: '1409', // Barbell Glute Bridge
  l3: '1684', // Dumbbell Step Up
  l4: '3007', // Resistance Band Leg Extension (closest to Terminal Knee Extension)
  l5: '0496', // Inverse Leg Curl
  l6: '0417', // Dumbbell Standing Calf Raise
  l7: '0276', // Dead Bug
  l8: '3006', // Resistance Band Seated Hip Abduction
  // u2 (Floor Press) and u4 (Band Pull-Apart) — no match, SVG fallback
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
