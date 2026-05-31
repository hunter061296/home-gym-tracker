// Default exercises use locally bundled GIFs (no API call, no quota used).
// Custom exercises added via search still reference the WorkoutX API.

const API_KEY = 'wx_419d7e78264b999296d35cf96668bd7494ddf9f97b2998c295e17771'
const API_GIF_BASE = 'https://api.workoutxapp.com/v1/gifs'

// Maps our program exercise ID → local GIF filename in /public/gifs/
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
  l5: '0496', // Inverse Leg Curl
  l6: '0417', // Dumbbell Standing Calf Raise
  l7: '0276', // Dead Bug
  l8: '3006', // Resistance Band Seated Hip Abduction
  // u2, u4, l4 have no match — fall back to SVG illustrations
}

export function getGifUrl(exercise) {
  // Default exercises → serve from local bundle (zero API calls)
  const localId = LOCAL_GIFS[exercise.id]
  if (localId) return `/gifs/${localId}.gif`

  // Custom exercises added via search → WorkoutX API (with api-key query param)
  if (exercise.wxId) return `${API_GIF_BASE}/${exercise.wxId}.gif?api-key=${API_KEY}`

  return null
}
