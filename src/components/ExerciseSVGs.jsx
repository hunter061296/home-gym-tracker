// Stick figure SVG illustrations for each exercise.
// ViewBox: 0 0 160 120. Teal figure (#0f6e56) on transparent bg.

const S = { strokeLinecap: 'round', strokeLinejoin: 'round' }

const Limb = (props) => (
  <line {...S} stroke="#0f6e56" strokeWidth={2.8} {...props} />
)
const Head = ({ cx, cy, r = 9 }) => (
  <circle cx={cx} cy={cy} r={r} fill="#1e293b" stroke="#0f6e56" strokeWidth={2.5} />
)
const DBH = ({ x, y }) => (
  <g>
    <circle cx={x - 7} cy={y} r={5} fill="#475569" />
    <rect x={x - 6} y={y - 1.5} width={12} height={3} rx={1} fill="#64748b" />
    <circle cx={x + 7} cy={y} r={5} fill="#475569" />
  </g>
)
const DBV = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y - 6} r={4.5} fill="#475569" />
    <rect x={x - 1.5} y={y - 5} width={3} height={10} rx={1} fill="#64748b" />
    <circle cx={x} cy={y + 6} r={4.5} fill="#475569" />
  </g>
)
const Bench = ({ x, y, w = 110 }) => (
  <g>
    <rect x={x} y={y} width={w} height={6} rx={3} fill="#334155" />
    <rect x={x + 4} y={y + 6} width={5} height={14} rx={2} fill="#334155" />
    <rect x={x + w - 9} y={y + 6} width={5} height={14} rx={2} fill="#334155" />
  </g>
)
const Floor = ({ y = 108 }) => (
  <line x1={8} y1={y} x2={152} y2={y} stroke="#334155" strokeWidth={2} />
)

// ─── UPPER EXERCISES ───────────────────────────────────────────────────────

export const BenchPressIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Bench x={14} y={65} w={128} />
    {/* lying figure - head on right */}
    <Head cx={139} cy={54} r={8} />
    {/* neck + body */}
    <Limb x1={139} y1={62} x2={124} y2={65} />
    <Limb x1={124} y1={65} x2={48} y2={65} />
    {/* legs angled down-left */}
    <Limb x1={48} y1={65} x2={34} y2={82} />
    <Limb x1={34} y1={82} x2={22} y2={98} />
    <Limb x1={48} y1={65} x2={64} y2={82} />
    <Limb x1={64} y1={82} x2={80} y2={94} />
    {/* arms pressing straight up */}
    <Limb x1={112} y1={65} x2={110} y2={46} />
    <Limb x1={110} y1={46} x2={112} y2={27} />
    <Limb x1={96} y1={65} x2={94} y2={46} />
    <Limb x1={94} y1={46} x2={92} y2={27} />
    <DBH x={113} y={22} />
    <DBH x={93} y={22} />
  </svg>
)

export const FloorPressIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor y={90} />
    {/* lying figure */}
    <Head cx={139} cy={68} r={8} />
    <Limb x1={139} y1={76} x2={124} y2={79} />
    <Limb x1={124} y1={79} x2={46} y2={79} />
    {/* legs, knees bent */}
    <Limb x1={46} y1={79} x2={38} y2={92} />
    <Limb x1={38} y1={92} x2={52} y2={92} />
    <Limb x1={46} y1={79} x2={64} y2={92} />
    <Limb x1={64} y1={92} x2={80} y2={92} />
    {/* Arms: upper arm on floor, forearm presses up - elbow at floor */}
    <Limb x1={110} y1={78} x2={110} y2={90} />
    <Limb x1={110} y1={90} x2={113} y2={72} />
    <Limb x1={94} y1={78} x2={93} y2={90} />
    <Limb x1={93} y1={90} x2={92} y2={72} />
    {/* Elbow dots on floor */}
    <circle cx={110} cy={90} r={3} fill="#0f6e56" opacity={0.6} />
    <circle cx={93} cy={90} r={3} fill="#0f6e56" opacity={0.6} />
    <DBH x={113} y={67} />
    <DBH x={92} y={67} />
  </svg>
)

export const SingleArmRowIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Bench x={10} y={62} w={52} />
    {/* Bent-over figure — torso ~45° */}
    <Head cx={130} cy={35} r={8} />
    {/* Torso angled: head top-right → hip bottom-left */}
    <Limb x1={124} y1={40} x2={82} y2={68} />
    {/* Right arm (support) onto bench */}
    <Limb x1={96} y1={52} x2={68} y2={63} />
    <Limb x1={68} y1={63} x2={54} y2={63} />
    {/* Left arm (rowing) pulling up */}
    <Limb x1={84} y1={58} x2={84} y2={42} />
    <Limb x1={84} y1={42} x2={92} y2={28} />
    {/* Right leg (front) */}
    <Limb x1={82} y1={68} x2={78} y2={88} />
    <Limb x1={78} y1={88} x2={70} y2={105} />
    {/* Left leg (back) */}
    <Limb x1={82} y1={68} x2={102} y2={86} />
    <Limb x1={102} y1={86} x2={116} y2={100} />
    {/* Dumbbell at rowing hand - elbow up */}
    <DBV x={86} y={22} />
    {/* elbow indicator */}
    <circle cx={84} cy={42} r={3} fill="#0f6e56" opacity={0.7} />
  </svg>
)

export const BandPullApartIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Standing figure */}
    <Head cx={80} cy={16} />
    <Limb x1={80} y1={25} x2={80} y2={68} />
    <Limb x1={80} y1={68} x2={68} y2={88} />
    <Limb x1={68} y1={88} x2={65} y2={108} />
    <Limb x1={80} y1={68} x2={92} y2={88} />
    <Limb x1={92} y1={88} x2={95} y2={108} />
    {/* Arms stretched out in T — band pulled apart */}
    <Limb x1={68} y1={38} x2={16} y2={48} />
    <Limb x1={92} y1={38} x2={144} y2={48} />
    {/* Band — stretched teal-ish line between hands */}
    <path d="M 18 48 Q 80 54 142 48" stroke="#14b8a6" strokeWidth={2.5} fill="none" strokeDasharray="5,3" strokeLinecap="round" />
    {/* Shoulder dots */}
    <circle cx={68} cy={38} r={4} fill="#0f6e56" />
    <circle cx={92} cy={38} r={4} fill="#0f6e56" />
    {/* Hand dots */}
    <circle cx={16} cy={48} r={4} fill="#14b8a6" />
    <circle cx={144} cy={48} r={4} fill="#14b8a6" />
  </svg>
)

export const ShoulderPressIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Bench x={28} y={78} w={104} />
    {/* Seated figure */}
    <Head cx={80} cy={18} />
    <Limb x1={80} y1={27} x2={80} y2={78} />
    {/* Legs seated */}
    <Limb x1={80} y1={78} x2={54} y2={92} />
    <Limb x1={54} y1={92} x2={42} y2={106} />
    <Limb x1={80} y1={78} x2={106} y2={92} />
    <Limb x1={106} y1={92} x2={118} y2={106} />
    {/* Arms overhead — upper arm at ~30°, pressing up */}
    <Limb x1={68} y1={38} x2={52} y2={54} />
    <Limb x1={52} y1={54} x2={46} y2={30} />
    <Limb x1={92} y1={38} x2={108} y2={54} />
    <Limb x1={108} y1={54} x2={114} y2={30} />
    {/* Elbow dots */}
    <circle cx={52} cy={54} r={3.5} fill="#0f6e56" opacity={0.7} />
    <circle cx={108} cy={54} r={3.5} fill="#0f6e56" opacity={0.7} />
    <DBH x={46} y={24} />
    <DBH x={114} y={24} />
  </svg>
)

export const LateralRaisesIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Standing figure */}
    <Head cx={80} cy={16} />
    <Limb x1={80} y1={25} x2={80} y2={68} />
    <Limb x1={80} y1={68} x2={68} y2={88} />
    <Limb x1={68} y1={88} x2={65} y2={108} />
    <Limb x1={80} y1={68} x2={92} y2={88} />
    <Limb x1={92} y1={88} x2={95} y2={108} />
    {/* Arms raised to T — slight upward angle with downward elbow (3-sec lower) */}
    <Limb x1={68} y1={40} x2={22} y2={50} />
    <Limb x1={92} y1={40} x2={138} y2={50} />
    {/* Arrows suggesting slow lowering */}
    <path d="M 25 50 L 20 58 L 30 56" fill="#14b8a6" opacity={0.6} />
    <path d="M 135 50 L 140 58 L 130 56" fill="#14b8a6" opacity={0.6} />
    <DBH x={18} y={50} />
    <DBH x={142} y={50} />
  </svg>
)

export const BicepCurlIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Standing figure */}
    <Head cx={80} cy={16} />
    <Limb x1={80} y1={25} x2={80} y2={68} />
    <Limb x1={80} y1={68} x2={68} y2={88} />
    <Limb x1={68} y1={88} x2={65} y2={108} />
    <Limb x1={80} y1={68} x2={92} y2={88} />
    <Limb x1={92} y1={88} x2={95} y2={108} />
    {/* Left arm at side (resting) */}
    <Limb x1={68} y1={40} x2={58} y2={58} />
    <Limb x1={58} y1={58} x2={54} y2={76} />
    <DBH x={52} y={80} />
    {/* Right arm — curled, palm supinated at top */}
    <Limb x1={92} y1={40} x2={102} y2={58} />
    <Limb x1={102} y1={58} x2={92} y2={32} />
    {/* Elbow locked in position */}
    <circle cx={102} cy={58} r={3.5} fill="#0f6e56" opacity={0.7} />
    {/* Dumbbell at curled hand, horizontal */}
    <DBH x={88} y={27} />
    {/* Rotation indicator */}
    <path d="M 97 27 Q 104 20 110 28" stroke="#14b8a6" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  </svg>
)

export const TricepExtensionIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Standing figure */}
    <Head cx={80} cy={16} />
    <Limb x1={80} y1={25} x2={80} y2={68} />
    <Limb x1={80} y1={68} x2={68} y2={88} />
    <Limb x1={68} y1={88} x2={65} y2={108} />
    <Limb x1={80} y1={68} x2={92} y2={88} />
    <Limb x1={92} y1={88} x2={95} y2={108} />
    {/* Both arms overhead, hands clasped on single DB */}
    <Limb x1={68} y1={40} x2={72} y2={25} />
    <Limb x1={72} y1={25} x2={74} y2={42} />
    <Limb x1={92} y1={40} x2={88} y2={25} />
    <Limb x1={88} y1={25} x2={86} y2={42} />
    {/* elbows pointing up/forward */}
    <circle cx={72} cy={25} r={3} fill="#0f6e56" opacity={0.7} />
    <circle cx={88} cy={25} r={3} fill="#0f6e56" opacity={0.7} />
    {/* Single DB vertical above head */}
    <DBV x={80} y={14} />
  </svg>
)

// ─── LOWER EXERCISES ───────────────────────────────────────────────────────

export const GobletSquatIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Deep squat — head at y=30, hips at y=72 (below knee height), knees wide */}
    <Head cx={80} cy={28} />
    {/* Spine angled slightly forward */}
    <Limb x1={80} y1={37} x2={76} y2={72} />
    {/* Knees out wide in deep squat */}
    <Limb x1={76} y1={72} x2={52} y2={62} />
    <Limb x1={52} y1={62} x2={44} y2={88} />
    <Limb x1={44} y1={88} x2={48} y2={108} />
    <Limb x1={76} y1={72} x2={100} y2={62} />
    <Limb x1={100} y1={62} x2={112} y2={88} />
    <Limb x1={112} y1={88} x2={108} y2={108} />
    {/* Arms holding dumbbell at chest */}
    <Limb x1={68} y1={48} x2={60} y2={58} />
    <Limb x1={60} y1={58} x2={70} y2={62} />
    <Limb x1={84} y1={48} x2={92} y2={58} />
    <Limb x1={92} y1={58} x2={82} y2={62} />
    {/* Dumbbells at chest */}
    <DBV x={75} y={56} />
    <DBV x={85} y={56} />
    {/* Chest dot */}
    <circle cx={80} cy={56} r={2} fill="#14b8a6" />
  </svg>
)

export const BulgarianSplitIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Bench for rear foot */}
    <Bench x={90} y={72} w={62} />
    <Floor />
    {/* Figure in split squat — torso upright at x=58 */}
    <Head cx={58} cy={16} />
    <Limb x1={58} y1={25} x2={58} y2={68} />
    {/* Front leg — lunging forward-down */}
    <Limb x1={58} y1={68} x2={42} y2={90} />
    <Limb x1={42} y1={90} x2={38} y2={108} />
    {/* Rear leg — going back and up to bench */}
    <Limb x1={58} y1={68} x2={82} y2={80} />
    <Limb x1={82} y1={80} x2={96} y2={72} />
    {/* Rear foot on bench */}
    <circle cx={96} cy={72} r={4} fill="#0f6e56" opacity={0.8} />
    {/* Arms with dumbbells at sides */}
    <Limb x1={46} y1={38} x2={38} y2={58} />
    <Limb x1={38} y1={58} x2={32} y2={76} />
    <Limb x1={70} y1={38} x2={76} y2={56} />
    <Limb x1={76} y1={56} x2={80} y2={74} />
    <DBV x={30} y={82} />
    <DBV x={82} y={80} />
  </svg>
)

export const RomanianDeadliftIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <Floor />
    {/* Hinge position — torso ~40° forward, head at top-left area */}
    <Head cx={34} cy={32} />
    {/* Spine — flat, angled forward */}
    <Limb x1={36} y1={40} x2={88} y2={68} />
    {/* Hips */}
    <circle cx={88} cy={68} r={4} fill="#0f6e56" opacity={0.6} />
    {/* Legs straight down from hip */}
    <Limb x1={88} y1={68} x2={78} y2={90} />
    <Limb x1={78} y1={90} x2={74} y2={108} />
    <Limb x1={88} y1={68} x2={100} y2={90} />
    <Limb x1={100} y1={90} x2={104} y2={108} />
    {/* Arms hanging down with dumbbells */}
    <Limb x1={52} y1={50} x2={56} y2={72} />
    <Limb x1={64} y1={56} x2={68} y2={78} />
    <DBH x={54} y={77} />
    <DBH x={68} y={83} />
    {/* Arrow showing hip hinge direction */}
    <path d="M 96 50 Q 106 55 108 68" stroke="#14b8a6" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeDasharray="3,2" />
  </svg>
)

export const HipThrustIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Bench (upper back rests on it) */}
    <Bench x={10} y={56} w={62} />
    <Floor />
    {/* Figure: upper back on bench, hips raised, feet on floor */}
    {/* Head */}
    <Head cx={22} cy={46} r={8} />
    {/* Upper body on bench */}
    <Limb x1={28} y1={52} x2={64} y2={56} />
    {/* Lower back + hips raised */}
    <Limb x1={64} y1={56} x2={88} y2={50} />
    {/* Glute peak */}
    <circle cx={88} cy={50} r={4} fill="#14b8a6" opacity={0.7} />
    {/* Legs from hip down to feet */}
    <Limb x1={88} y1={50} x2={104} y2={80} />
    <Limb x1={104} y1={80} x2={100} y2={108} />
    <Limb x1={88} y1={50} x2={118} y2={78} />
    <Limb x1={118} y1={78} x2={124} y2={108} />
    {/* Arms on bench/sides */}
    <Limb x1={40} y1={54} x2={38} y2={68} />
    <Limb x1={60} y1={56} x2={64} y2={68} />
    {/* Dumbbell on hips */}
    <DBH x={80} y={46} />
    <DBH x={96} y={46} />
  </svg>
)

export const CalfRaiseIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Step */}
    <rect x={40} y={92} width={80} height={8} rx={2} fill="#334155" />
    <rect x={40} y={100} width={80} height={10} rx={2} fill="#293548" />
    <Floor />
    {/* Standing on toes — figure raised */}
    <Head cx={80} cy={14} />
    <Limb x1={80} y1={23} x2={80} y2={68} />
    <Limb x1={80} y1={68} x2={68} y2={84} />
    {/* Heels raised — on ball of foot */}
    <Limb x1={68} y1={84} x2={64} y2={92} />
    <Limb x1={80} y1={68} x2={92} y2={84} />
    <Limb x1={92} y1={84} x2={96} y2={92} />
    {/* Toe/ball of foot on step edge */}
    <circle cx={64} cy={92} r={3.5} fill="#0f6e56" />
    <circle cx={96} cy={92} r={3.5} fill="#0f6e56" />
    {/* Upward arrows showing rise */}
    <path d="M 78 10 L 82 4 L 86 10" fill="none" stroke="#14b8a6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    {/* Arms with dumbbells */}
    <Limb x1={68} y1={38} x2={58} y2={60} />
    <Limb x1={58} y1={60} x2={52} y2={80} />
    <Limb x1={92} y1={38} x2={102} y2={60} />
    <Limb x1={102} y1={60} x2={108} y2={80} />
    <DBV x={50} y={86} />
    <DBV x={110} y={86} />
  </svg>
)

export const CoreFinisherIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Hollow hold: lying on back, slight curve, legs and arms raised */}
    {/* Floor / mat */}
    <rect x={10} y={72} width={140} height={5} rx={2} fill="#1e3a2f" />
    {/* Figure on back — curved spine (hollow) */}
    <path d="M 20 68 Q 80 58 140 68" stroke="#0f6e56" strokeWidth={2.8} fill="none" strokeLinecap="round" />
    {/* Head at left */}
    <Head cx={18} cy={62} r={8} />
    {/* Arms raised overhead (to the left) */}
    <Limb x1={16} y1={60} x2={10} y2={44} />
    <Limb x1={22} y1={58} x2={16} y2={42} />
    {/* Legs raised (to the right) */}
    <Limb x1={120} y1={66} x2={130} y2={50} />
    <Limb x1={130} y1={50} x2={144} y2={38} />
    <Limb x1={128} y1={66} x2={142} y2={52} />
    <Limb x1={142} y1={52} x2={152} y2={40} />
    {/* Hollow curve arrow */}
    <path d="M 70 82 Q 80 90 90 82" stroke="#14b8a6" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    {/* Core area highlight */}
    <ellipse cx={80} cy={64} rx={20} ry={6} fill="#0f6e56" opacity={0.15} />
    {/* Label indicators */}
    <text x={80} y={108} textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="sans-serif">hollow hold</text>
  </svg>
)

// ─── New lower-day icons ─────────────────────────────────────────────────────

export const GluteBridgeIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Floor */}
    <line x1="10" y1="105" x2="150" y2="105" stroke="#334155" strokeWidth="2" />
    {/* Body: lying on back, hips raised */}
    {/* Upper back flat on floor */}
    <Limb x1="30" y1="100" x2="70" y2="100" />
    {/* Head */}
    <Head cx="22" cy="97" r="8" />
    {/* Torso rises to hips */}
    <Limb x1="70" y1="100" x2="95" y2="72" />
    {/* Hips → knees */}
    <Limb x1="95" y1="72" x2="115" y2="95" />
    {/* Knees → feet flat */}
    <Limb x1="115" y1="95" x2="125" y2="105" />
    {/* Arms at sides, hands on floor */}
    <Limb x1="50" y1="100" x2="55" y2="110" />
    <Limb x1="65" y1="100" x2="70" y2="110" />
    {/* Glute highlight arrow */}
    <line x1="95" y1="68" x2="95" y2="55" stroke="#0f6e56" strokeWidth="2" strokeLinecap="round" />
    <polyline points="90,60 95,52 100,60" fill="none" stroke="#0f6e56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="80" y="46" fontSize="9" fill="#888780" fontFamily="system-ui">Glute squeeze</text>
  </svg>
)

export const LowBoxStepUpIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Floor */}
    <line x1="10" y1="105" x2="150" y2="105" stroke="#334155" strokeWidth="2" />
    {/* Low box ~20cm */}
    <rect x="80" y="88" width="50" height="17" rx="2" fill="#1e3a5f" stroke="#334155" strokeWidth="1.5" />
    {/* Figure stepping up: lead foot on box, trail foot still on floor */}
    {/* Head */}
    <Head cx="88" cy="38" r="9" />
    {/* Torso upright */}
    <Limb x1="88" y1="47" x2="88" y2="72" />
    {/* Lead leg: foot on box */}
    <Limb x1="88" y1="72" x2="92" y2="87" />
    <Limb x1="92" y1="87" x2="95" y2="88" />
    {/* Trail leg: foot still on floor */}
    <Limb x1="88" y1="72" x2="78" y2="90" />
    <Limb x1="78" y1="90" x2="72" y2="105" />
    {/* Arms: dumbbells at sides */}
    <Limb x1="88" y1="52" x2="72" y2="65" />
    <Limb x1="88" y1="52" x2="104" y2="65" />
    <DBH x={68} y={67} />
    <DBH x={108} y={67} />
    {/* Low box label */}
    <text x="82" y="83" fontSize="8" fill="#888780" fontFamily="system-ui">~20cm</text>
  </svg>
)

export const TerminalKneeExtIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Floor */}
    <line x1="10" y1="105" x2="150" y2="105" stroke="#334155" strokeWidth="2" />
    {/* Band anchor on left wall */}
    <rect x="12" y="60" width="8" height="8" rx="2" fill="#334155" />
    {/* Band: dotted line from anchor to knee */}
    <line x1="20" y1="64" x2="78" y2="80" stroke="#d97706" strokeWidth="2" strokeDasharray="4,3" />
    {/* Figure standing, slight knee bend on right leg */}
    <Head cx="90" cy="35" r="9" />
    {/* Torso */}
    <Limb x1="90" y1="44" x2="90" y2="70" />
    {/* Right leg (working): slight knee bend */}
    <Limb x1="90" y1="70" x2="80" y2="88" />
    <Limb x1="80" y1="88" x2="84" y2="105" />
    {/* Left leg: support */}
    <Limb x1="90" y1="70" x2="96" y2="88" />
    <Limb x1="96" y1="88" x2="98" y2="105" />
    {/* Arms */}
    <Limb x1="90" y1="52" x2="74" y2="64" />
    <Limb x1="90" y1="52" x2="106" y2="64" />
    {/* Band around knee highlight */}
    <circle cx="80" cy="88" r="5" fill="none" stroke="#d97706" strokeWidth="2" />
    <text x="95" y="85" fontSize="9" fill="#0f6e56" fontFamily="system-ui">Extend fully</text>
  </svg>
)

export const HipAbductionIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Mat on floor */}
    <rect x="15" y="96" width="130" height="8" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
    {/* Figure lying on side */}
    {/* Head */}
    <Head cx="28" cy="90" r="8" />
    {/* Torso horizontal */}
    <Limb x1="36" y1="90" x2="100" y2="90" />
    {/* Bottom leg (on mat) */}
    <Limb x1="100" y1="90" x2="140" y2="94" />
    {/* Top leg: raised ~45° */}
    <Limb x1="100" y1="90" x2="135" y2="72" />
    {/* Support arm (lower) */}
    <Limb x1="38" y1="90" x2="28" y2="80" />
    {/* Top arm resting on hip */}
    <Limb x1="65" y1="90" x2="68" y2="82" />
    {/* Angle indicator arc */}
    <path d="M 115 90 A 15 15 0 0 0 127 80" fill="none" stroke="#0f6e56" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="125" y="70" fontSize="9" fill="#888780" fontFamily="system-ui">45°</text>
    {/* Band around thighs (optional) */}
    <line x1="108" y1="88" x2="118" y2="83" stroke="#d97706" strokeWidth="2" strokeDasharray="3,2" />
  </svg>
)

export const SeatedLegCurlIcon = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Bench */}
    <rect x="30" y="70" width="80" height="8" rx="3" fill="#334155" />
    <rect x="34" y="78" width="6" height="18" rx="2" fill="#334155" />
    <rect x="100" y="78" width="6" height="18" rx="2" fill="#334155" />
    {/* Band anchor at floor in front */}
    <rect x="14" y="94" width="8" height="8" rx="2" fill="#334155" />
    {/* Band: from ankle to anchor */}
    <line x1="22" y1="98" x2="100" y2="98" stroke="#d97706" strokeWidth="2" strokeDasharray="4,3" />
    {/* Figure seated */}
    <Head cx="55" cy="42" r="9" />
    {/* Torso upright */}
    <Limb x1="55" y1="51" x2="55" y2="70" />
    {/* Arms */}
    <Limb x1="55" y1="56" x2="40" y2="66" />
    <Limb x1="55" y1="56" x2="70" y2="66" />
    {/* Thigh resting on bench */}
    <Limb x1="55" y1="70" x2="95" y2="70" />
    {/* Lower leg curled back */}
    <Limb x1="95" y1="70" x2="85" y2="95" />
    {/* Ankle / foot */}
    <Limb x1="85" y1="95" x2="78" y2="100" />
    {/* Band wrap at ankle */}
    <circle cx="85" cy="95" r="5" fill="none" stroke="#d97706" strokeWidth="2" />
    <text x="92" y="62" fontSize="9" fill="#0f6e56" fontFamily="system-ui">Curl back</text>
  </svg>
)

// ─── Map svgKey → component ─────────────────────────────────────────────────

export const EXERCISE_SVGS = {
  benchPress: BenchPressIcon,
  floorPress: FloorPressIcon,
  singleArmRow: SingleArmRowIcon,
  bandPullApart: BandPullApartIcon,
  shoulderPress: ShoulderPressIcon,
  lateralRaises: LateralRaisesIcon,
  bicepCurl: BicepCurlIcon,
  tricepExtension: TricepExtensionIcon,
  gobletSquat: GobletSquatIcon,
  bulgarianSplit: BulgarianSplitIcon,
  romanianDeadlift: RomanianDeadliftIcon,
  hipThrust: HipThrustIcon,
  calfRaise: CalfRaiseIcon,
  coreFinisher: CoreFinisherIcon,
  gluteBridge: GluteBridgeIcon,
  lowBoxStepUp: LowBoxStepUpIcon,
  terminalKneeExt: TerminalKneeExtIcon,
  hipAbduction: HipAbductionIcon,
  seatedLegCurl: SeatedLegCurlIcon,
}
