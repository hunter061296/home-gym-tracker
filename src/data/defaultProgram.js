export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const TYPE_CONFIG = {
  upper: { label: 'Upper', color: '#185FA5', bg: 'rgba(24,95,165,0.12)', border: 'rgba(24,95,165,0.35)', text: '#60a5fa' },
  lower: { label: 'Lower', color: '#0F6E56', bg: 'rgba(15,110,86,0.12)', border: 'rgba(15,110,86,0.35)', text: '#34d399' },
  rest:  { label: 'Rest',  color: '#888780', bg: 'rgba(136,135,128,0.08)', border: 'rgba(136,135,128,0.2)', text: '#888780' },
}

export const DEFAULT_OVERLOAD = {
  enabled: false,
  type: 'weight',
  incrementWeight: 2.5,
  incrementReps: 1,
  lastIncreasedWeek: null,
}

// Helper to add default progressive overload field to any exercise
const applyOverload = (ex) => ({ ...ex, progressiveOverload: { ...DEFAULT_OVERLOAD } })

const UPPER_EXERCISES = [
  { id: 'u1', name: 'Dumbbell Bench Press', search: 'dumbbell bench press',
    sets: 4, reps: '8–12', tip: '3-sec lowering when 12 reps feels easy', notes: '',
    svgKey: 'benchPress',
    yImages: ['Dumbbell_Bench_Press/0.jpg', 'Dumbbell_Bench_Press/1.jpg'],
    target: 'chest', secondaryMuscles: ['triceps', 'shoulders'],
    instructions: [
      'Lie flat on a bench holding a dumbbell in each hand at chest level, palms facing forward.',
      'Press the dumbbells up and slightly together until arms are fully extended.',
      'Hold briefly at the top — squeeze the chest.',
      'Lower slowly over 2–3 seconds back to chest level. Keep elbows at roughly 45°.',
      'Repeat for the target reps without bouncing at the bottom.',
    ],
  },
  {
    id: 'u2', name: 'Dumbbell Floor Press', search: 'dumbbell floor press',
    sets: 3, reps: '12–15', tip: 'Swap with bench press every few weeks', notes: '',
    svgKey: 'floorPress',
    yImages: ['Dumbbell_Floor_Press/0.jpg', 'Dumbbell_Floor_Press/1.jpg'],
    target: 'chest', secondaryMuscles: ['triceps'],
    instructions: [
      'Lie on the floor with knees bent, feet flat. Hold a dumbbell in each hand at chest level.',
      'Upper arms rest on the floor — this limits range and takes the shoulder joint out of the bottom.',
      'Press the dumbbells up until arms are fully extended.',
      'Lower slowly until upper arms touch the floor again.',
      'Pause 1 second on the floor (dead stop) before the next rep to keep tension honest.',
    ],
  },
  {
    id: 'u3', name: 'Single-Arm Dumbbell Row', search: 'dumbbell one arm row',
    sets: 4, reps: '10–15', tip: 'Pause 2 sec at the top of each rep', notes: '',
    svgKey: 'singleArmRow',
    yImages: ['One-Arm_Dumbbell_Row/0.jpg', 'One-Arm_Dumbbell_Row/1.jpg'],
    target: 'lats', secondaryMuscles: ['middle back', 'biceps'],
    instructions: [
      'Place one knee and the same-side hand on a bench for support. Back should be flat and parallel to the floor.',
      'Hold a dumbbell in the free hand, arm hanging straight down.',
      'Row the dumbbell up toward your hip — lead with your elbow, not your hand.',
      'Hold 2 seconds at the top. Feel the squeeze in your back.',
      'Lower slowly under control. Complete all reps then switch sides.',
    ],
  },
  {
    id: 'u4', name: 'Band Pull-Apart', search: 'band pull apart',
    sets: 3, reps: '20', tip: 'Pull to a full T — rear delts and traps', notes: '',
    svgKey: 'bandPullApart',
    yImages: ['Band_Pull_Apart/0.jpg', 'Band_Pull_Apart/1.jpg'],
    target: 'shoulders', secondaryMuscles: ['traps'],
    instructions: [
      'Stand and hold the band with both hands shoulder-width apart, arms extended in front.',
      'Keep arms straight throughout — no bending elbows.',
      'Pull the band apart, squeezing shoulder blades together until arms form a T.',
      'Hold the stretch for 1 second at full range.',
      'Slowly return to start, controlling the band. No snap-back.',
    ],
  },
  {
    id: 'u5', name: 'Seated Shoulder Press', search: 'dumbbell seated shoulder press',
    sets: 3, reps: '10–15', tip: 'Lower to ear level — full range every rep', notes: '',
    svgKey: 'shoulderPress',
    yImages: ['Dumbbell_Shoulder_Press/0.jpg', 'Dumbbell_Shoulder_Press/1.jpg'],
    target: 'shoulders', secondaryMuscles: ['triceps', 'traps'],
    instructions: [
      'Sit upright on the bench with a dumbbell in each hand at shoulder height, palms forward.',
      'Press both dumbbells overhead until arms are fully extended. Do not lock elbows aggressively.',
      'Lower back to shoulder height — elbows should reach ear level at the bottom.',
      'Keep your core braced throughout. Avoid arching the lower back.',
      'Repeat for the target reps with controlled speed on the way down.',
    ],
  },
  {
    id: 'u6', name: 'Lateral Raises', search: 'dumbbell lateral raise',
    sets: 4, reps: '15–20', tip: '1-sec pause at top, 3-sec lowering', notes: '',
    svgKey: 'lateralRaises',
    yImages: ['Lateral_Raise_-_With_Bands/0.jpg', 'Lateral_Raise_-_With_Bands/1.jpg'],
    target: 'shoulders', secondaryMuscles: [],
    instructions: [
      'Stand holding a dumbbell in each hand at your sides, palms facing in.',
      'With a slight bend in the elbows, raise both arms out to the sides.',
      'Lift until arms are parallel to the floor — no higher. Lead with the elbows, not the hands.',
      'Hold 1 second at the top.',
      'Lower slowly over 3 seconds. Resist the urge to swing the weight.',
    ],
  },
  {
    id: 'u7', name: 'Alternating Bicep Curl', search: 'dumbbell alternate bicep curl',
    sets: 3, reps: '10–15', tip: 'Twist palm up at the top every rep', notes: '',
    svgKey: 'bicepCurl',
    yImages: ['Dumbbell_Alternate_Bicep_Curl/0.jpg', 'Dumbbell_Alternate_Bicep_Curl/1.jpg'],
    target: 'biceps', secondaryMuscles: ['forearms'],
    instructions: [
      'Stand holding a dumbbell in each hand at your sides, palms facing in (neutral grip).',
      'Keeping your upper arm stationary, curl one dumbbell up while rotating the palm to face your shoulder.',
      'Squeeze the bicep hard at the top.',
      'Lower slowly to the starting position. Alternate arms each rep.',
      'Avoid swinging — if you are, the weight is too heavy.',
    ],
  },
  {
    id: 'u8', name: 'Overhead Tricep Extension', search: 'dumbbell triceps extension',
    sets: 3, reps: '12–15', tip: "Elbows stay pointing up — don't flare", notes: '',
    svgKey: 'tricepExtension',
    target: 'triceps', secondaryMuscles: [],
    instructions: [
      'Sit or stand holding one dumbbell with both hands, gripping the inner plate.',
      'Raise the dumbbell overhead with arms fully extended.',
      'Keeping upper arms vertical and close to your head, lower the dumbbell behind your head.',
      'Stop when forearms are roughly parallel to the floor. Elbows point up — do not let them flare.',
      'Press back up to full extension. Squeeze the triceps at the top.',
    ],
  },
]

const LOWER_EXERCISES = [
  {
    id: 'l1', name: 'Hip Thrust', search: 'hip thrust',
    sets: 4, reps: '15–20', tip: '2-sec hold at top, squeeze glutes hard', notes: '',
    svgKey: 'hipThrust',
    yImages: ['Barbell_Hip_Thrust/0.jpg', 'Barbell_Hip_Thrust/1.jpg'],
    target: 'glutes', secondaryMuscles: ['hamstrings'],
    instructions: [
      'Sit on the floor with your upper back against a bench. Loop the resistance band across your hips.',
      'Plant feet flat on the floor, hip-width apart, knees bent at roughly 90°.',
      'Drive through your heels and thrust your hips upward until your body is in a straight line from shoulders to knees.',
      'Hold 2 seconds at the top. Squeeze your glutes as hard as possible.',
      'Lower slowly — hips do not touch the floor between reps. Keep tension throughout.',
    ],
  },
  {
    id: 'l2', name: 'Glute Bridge', search: 'glute bridge',
    sets: 3, reps: '20–25', tip: 'Feet flat, drive through heels', notes: '',
    svgKey: 'gluteBridge',
    yImages: ['Barbell_Glute_Bridge/0.jpg', 'Barbell_Glute_Bridge/1.jpg'],
    target: 'glutes', secondaryMuscles: ['hamstrings'],
    instructions: [
      'Lie on your back with knees bent, feet flat on the floor hip-width apart.',
      'Place arms at your sides, palms down for stability.',
      'Drive through your heels and squeeze your glutes to lift your hips off the floor.',
      'Lift until your body forms a straight line from shoulders to knees.',
      'Hold 1 second at the top, then lower slowly. For added resistance, place a dumbbell across your hips.',
    ],
  },
  {
    id: 'l3', name: 'Low Box Step Up', search: 'step up',
    sets: 3, reps: '12', tip: '20–25cm box max — no deep knee bend', notes: '',
    svgKey: 'lowBoxStepUp',
    yImages: ['Dumbbell_Step_Ups/0.jpg', 'Dumbbell_Step_Ups/1.jpg'],
    target: 'glutes', secondaryMuscles: ['quadriceps', 'hamstrings'],
    instructions: [
      'Stand in front of a low box or step (20–25cm). Hold a dumbbell in each hand at your sides.',
      'Step up with one foot, placing it fully on the box.',
      'Drive through the heel of the elevated foot to stand up — do not push off the back foot.',
      'Bring the back foot up to meet the front foot. Stand tall on the box.',
      'Step back down with control. Alternate the leading leg each rep.',
    ],
  },
  {
    id: 'l4', name: 'Terminal Knee Extension', search: 'terminal knee extension',
    sets: 3, reps: '15–20', tip: 'Rebuilds VMO — critical for ACL recovery', notes: '',
    svgKey: 'terminalKneeExt',
    target: 'quadriceps', secondaryMuscles: [],
    instructions: [
      'Attach a resistance band at knee height to a fixed point behind you.',
      'Stand facing away, loop the band behind your knee, and step forward to create tension.',
      'Stand on one leg with a slight bend. Keep your foot flat.',
      'Straighten the knee fully, squeezing your quad hard at full extension.',
      'Slowly return to the slight bend. Keep movement controlled — this is a small range exercise.',
      'Complete all reps, then switch legs.',
    ],
  },
  {
    id: 'l5', name: 'Seated Band Leg Curl', search: 'leg curl',
    sets: 3, reps: '15–20', tip: 'Hamstring work with zero knee shear', notes: '',
    svgKey: 'seatedLegCurl',
    target: 'hamstrings', secondaryMuscles: [],
    instructions: [
      'Sit at the edge of a bench or chair with a resistance band looped around your ankle.',
      'Anchor the band low in front of you (to a table leg or door anchor at floor level).',
      'Start with your leg extended, tension in the band.',
      'Curl your heel back toward the bench, bending the knee to ~90°.',
      'Squeeze your hamstring at full contraction. Hold 1 second.',
      'Slowly extend back to start. Complete all reps, then switch legs.',
    ],
  },
  {
    id: 'l6', name: 'Standing Calf Raise', search: 'calf raise',
    sets: 4, reps: '20–25', tip: 'Use a step for extra range of motion', notes: '',
    svgKey: 'calfRaise',
    yImages: ['Calf_Raises_-_With_Bands/0.jpg', 'Calf_Raises_-_With_Bands/1.jpg'],
    target: 'calves', secondaryMuscles: [],
    instructions: [
      'Stand on the edge of a step with heels hanging off. Hold dumbbells for added resistance.',
      'Let your heels drop below the step level to get a full stretch in the calves.',
      'Rise up onto your toes as high as possible.',
      'Hold 1 second at the top — squeeze the calves.',
      'Lower slowly back to the stretched position. Do not bounce at the bottom.',
    ],
  },
  {
    id: 'l7', name: 'Dead Bug', search: 'dead bug',
    sets: 3, reps: '10 each side', tip: 'Core stability protects the knee', notes: '',
    svgKey: 'coreFinisher',
    yImages: ['Dead_Bug/0.jpg', 'Dead_Bug/1.jpg'],
    target: 'abdominals', secondaryMuscles: [],
    instructions: [
      'Lie on your back with arms pointing straight up toward the ceiling.',
      'Lift both legs so hips and knees are bent at 90° — table-top position.',
      'Press your lower back firmly into the floor. This position must be maintained throughout.',
      'Slowly lower your right arm overhead and your left leg toward the floor simultaneously.',
      'Stop just before either touches the floor, then return to start. Switch sides.',
      'If your lower back lifts off the floor, reduce your range of motion.',
    ],
  },
  {
    id: 'l8', name: 'Seated Hip Abduction', search: 'hip abduction',
    sets: 3, reps: '20', tip: 'Strengthens hip abductors — supports knee', notes: '',
    svgKey: 'hipAbduction',
    target: 'glutes', secondaryMuscles: [],
    instructions: [
      'Sit on a bench or chair with the resistance band looped just above your knees.',
      'Sit tall with feet hip-width apart and flat on the floor.',
      'Push both knees outward against the band as far as comfortable.',
      'Hold 1 second at full abduction. Feel the squeeze in the outer glutes and hips.',
      'Return slowly to the starting position — do not let the band snap your knees in.',
      'Keep your torso upright throughout. Do not lean to one side.',
    ],
  },
]

export const DEFAULT_PROGRAM = {
  routines: {
    'upper-a': { id: 'upper-a', name: 'Upper A', type: 'upper', exercises: UPPER_EXERCISES.map(applyOverload) },
    'lower-a': { id: 'lower-a', name: 'Lower A', type: 'lower', exercises: LOWER_EXERCISES.map(applyOverload) },
  },
  schedule: {
    0: 'lower-a',  // Sun
    1: 'upper-a',  // Mon
    2: 'rest',     // Tue
    3: 'lower-a',  // Wed
    4: 'rest',     // Thu
    5: 'upper-a',  // Fri
    6: 'rest',     // Sat
  },
}
