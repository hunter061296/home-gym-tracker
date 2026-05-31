// Maps our exercise IDs → WorkoutX exercise IDs for animated GIFs
// GIF URL: https://api.workoutxapp.com/v1/gifs/{workoutxId}.gif?api-key=...
// Auth via query param so <img> tags work directly in the browser

const API_KEY = 'wx_419d7e78264b999296d35cf96668bd7494ddf9f97b2998c295e17771'
const GIF_BASE = 'https://api.workoutxapp.com/v1/gifs'

// Exercises without a WorkoutX match fall back to SVG illustrations
const WORKOUTX_IDS = {
  u1: '0289', // Dumbbell Bench Press
  // u2 Dumbbell Floor Press — no match, SVG fallback
  u3: '0292', // Dumbbell One Arm Bent-over Row
  // u4 Band Pull-Apart — no match, SVG fallback
  u5: '0360', // Dumbbell One Arm Shoulder Press
  u6: '0334', // Dumbbell Lateral Raise
  u7: '0285', // Dumbbell Alternate Biceps Curl
  u8: '0092', // Barbell Seated Overhead Triceps Extension (same movement)
  l1: '3236', // Resistance Band Hip Thrusts
  l2: '1409', // Barbell Glute Bridge
  l3: '1684', // Dumbbell Step Up
  // l4 Terminal Knee Extension — no match, SVG fallback
  l5: '0496', // Inverse Leg Curl (bench support)
  l6: '0417', // Dumbbell Standing Calf Raise
  l7: '0276', // Dead Bug
  l8: '3006', // Resistance Band Seated Hip Abduction
}

export function getGifUrl(exerciseId) {
  const wxId = WORKOUTX_IDS[exerciseId]
  if (!wxId) return null
  return `${GIF_BASE}/${wxId}.gif?api-key=${API_KEY}`
}
