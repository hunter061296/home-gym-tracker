const CATEGORY_KEYWORDS = {
  compound:  ['bench press', 'floor press', 'row', 'shoulder press', 'hip thrust', 'step up', 'romanian deadlift'],
  isolation: ['bicep curl', 'lateral raise', 'tricep', 'calf raise', 'glute bridge'],
  rehab:     ['terminal knee', 'pull apart', 'hip abduction', 'leg curl'],
  core:      ['dead bug', 'plank', 'hollow'],
}

export function getExerciseCategory(name) {
  const lower = name.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat
  }
  return 'compound'
}

export function getDefaultRestTime(exerciseName, restTimes) {
  const cat = getExerciseCategory(exerciseName)
  return restTimes[cat] ?? 90
}
