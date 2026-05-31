// Maps our exercise IDs → free-exercise-db IDs
// Source: https://github.com/yuhonas/free-exercise-db
// Each exercise has 2 images (start + end position) we animate between

const DB_IDS = {
  u1: 'Dumbbell_Bench_Press',
  u2: 'Dumbbell_Floor_Press',
  u3: 'One-Arm_Dumbbell_Row',
  u4: 'Band_Pull_Apart',
  u5: 'Dumbbell_Shoulder_Press',
  u6: 'Dumbbell_Lying_Rear_Lateral_Raise',
  u7: 'Dumbbell_Alternate_Bicep_Curl',
  u8: 'Overhead_Triceps',
  l1: 'Barbell_Hip_Thrust',
  l2: 'Barbell_Glute_Bridge',
  l3: 'Dumbbell_Step_Ups',
  // l4 Terminal Knee Extension — no match in db, falls back to SVG
  l5: 'Lying_Leg_Curls',
  l6: 'Standing_Dumbbell_Calf_Raise',
  l7: 'Dead_Bug',
  // l8 Side-Lying Hip Abduction — no match in db, falls back to SVG
}

const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

export function getExerciseImages(exerciseId) {
  const dbId = DB_IDS[exerciseId]
  if (!dbId) return null
  return {
    img0: `${BASE}/${dbId}/0.jpg`,
    img1: `${BASE}/${dbId}/1.jpg`,
  }
}
