export const SCHEDULE = {
  0: 'lower',
  1: 'upper',
  2: 'rest',
  3: 'lower',
  4: 'rest',
  5: 'upper',
  6: 'rest',
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const DEFAULT_PROGRAM = {
  upper: [
    {
      id: 'u1', name: 'Dumbbell Bench Press', search: 'dumbbell bench press',
      sets: 4, reps: '8–12', tip: '3-sec lowering when 12 reps feels easy', notes: '',
      svgKey: 'benchPress',
    },
    {
      id: 'u2', name: 'Dumbbell Floor Press', search: 'dumbbell floor press',
      sets: 3, reps: '12–15', tip: 'Swap with bench press every few weeks', notes: '',
      svgKey: 'floorPress',
    },
    {
      id: 'u3', name: 'Single-Arm Dumbbell Row', search: 'dumbbell one arm row',
      sets: 4, reps: '10–15', tip: 'Pause 2 sec at the top of each rep', notes: '',
      svgKey: 'singleArmRow',
    },
    {
      id: 'u4', name: 'Band Pull-Apart', search: 'band pull apart',
      sets: 3, reps: '20', tip: 'Pull to a full T — rear delts and traps', notes: '',
      svgKey: 'bandPullApart',
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
    },
    {
      id: 'u6', name: 'Lateral Raises', search: 'dumbbell lateral raise',
      sets: 4, reps: '15–20', tip: '1-sec pause at top, 3-sec lowering', notes: '',
      svgKey: 'lateralRaises',
    },
    {
      id: 'u7', name: 'Alternating Bicep Curl', search: 'dumbbell alternate bicep curl',
      sets: 3, reps: '10–15', tip: 'Twist palm up at the top every rep', notes: '',
      svgKey: 'bicepCurl',
    },
    {
      id: 'u8', name: 'Overhead Tricep Extension', search: 'dumbbell triceps extension',
      sets: 3, reps: '12–15', tip: "Elbows stay pointing up — don't flare", notes: '',
      svgKey: 'tricepExtension',
    },
  ],
  lower: [
    {
      id: 'l1', name: 'Hip Thrust', search: 'hip thrust',
      sets: 4, reps: '15–20', tip: '2-sec hold at top, squeeze glutes hard', notes: '',
      svgKey: 'hipThrust',
    },
    {
      id: 'l2', name: 'Glute Bridge', search: 'glute bridge',
      sets: 3, reps: '20–25', tip: 'Feet flat, drive through heels', notes: '',
      svgKey: 'gluteBridge',
    },
    {
      id: 'l3', name: 'Low Box Step Up', search: 'step up',
      sets: 3, reps: '12', tip: '20–25cm box max — no deep knee bend', notes: '',
      svgKey: 'lowBoxStepUp',
    },
    {
      id: 'l4', name: 'Terminal Knee Extension', search: 'terminal knee extension',
      sets: 3, reps: '15–20', tip: 'Rebuilds VMO — critical for ACL recovery', notes: '',
      svgKey: 'terminalKneeExt',
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
    },
    {
      id: 'l7', name: 'Dead Bug', search: 'dead bug',
      sets: 3, reps: '10 each side', tip: 'Core stability protects the knee', notes: '',
      svgKey: 'coreFinisher',
    },
    {
      id: 'l8', name: 'Seated Hip Abduction', search: 'hip abduction',
      sets: 3, reps: '20', tip: 'Strengthens hip abductors — supports knee', notes: '',
      svgKey: 'hipAbduction',
      instructions: [
        'Lie on your side on a mat, legs stacked, head resting on your lower arm.',
        'Keep your body in a straight line from head to feet.',
        'Raise the top leg to ~45°, keeping it straight and toes pointing forward (not up).',
        'Hold 1 second at the top. Squeeze the outer glute.',
        'Lower slowly — take 2 seconds. Don\'t let it crash down.',
        'Complete all reps, then flip and work the other side.',
      ],
    },
  ],
}
