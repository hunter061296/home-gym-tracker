// Renders either the full bottom sheet or the mini sticky bar depending on timerState.sheetOpen

const CIRCLE_R = 54
const CIRC = 2 * Math.PI * CIRCLE_R

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function timerColor(remaining) {
  if (remaining <= 5) return '#DC2626'
  if (remaining <= 20) return '#D97706'
  return '#22C55E'
}

export default function RestTimer({ timerState, onSkip, onAdjust, onPreset, onToggleSheet }) {
  if (!timerState) return null

  const remaining = Math.max(0, timerState.duration - (Date.now() - timerState.startTime) / 1000)
  const progress = timerState.duration > 0 ? remaining / timerState.duration : 0
  const color = timerColor(remaining)
  const ringOffset = CIRC * (1 - Math.min(1, Math.max(0, progress)))

  // ── Mini bar (sheet minimised) ──────────────────────────────────────────────
  if (!timerState.sheetOpen) {
    return (
      <div
        onClick={() => onToggleSheet(true)}
        style={{ background: '#1C1C1A', borderBottom: '1px solid #2A2A28', padding: '6px 16px 8px', cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: '#888780', fontSize: 12 }}>Rest</span>
          <span style={{ color, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {fmtTime(remaining)} remaining
          </span>
          <span style={{ color: '#0F6E56', fontSize: 12 }}>tap to open ↑</span>
        </div>
        <div style={{ height: 2, background: '#2A2A28', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: color, transition: 'width 0.25s linear, background-color 0.5s' }} />
        </div>
      </div>
    )
  }

  // ── Full bottom sheet ───────────────────────────────────────────────────────
  return (
    <>
      {/* Tap-outside to minimise */}
      <div
        onClick={() => onToggleSheet(false)}
        style={{ position: 'fixed', inset: 0, zIndex: 55 }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: '#1C1C1A',
        borderRadius: '20px 20px 0 0',
        border: '1px solid #2A2A28',
        borderBottom: 'none',
        padding: '14px 20px 44px',
        animation: 'slideUp 0.25s ease-out',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: '#2A2A28' }} />
        </div>

        {timerState.finished ? (
          <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
            <p style={{ color: '#22C55E', fontSize: 30, fontWeight: 700 }}>Time's up! 💪</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#888780', fontSize: 13, textAlign: 'center', margin: '0 0 2px' }}>Rest</p>
            <p style={{ color: '#555452', fontSize: 13, textAlign: 'center', margin: '0 0 20px' }}>
              {timerState.exerciseName} — Set {timerState.setNumber} of {timerState.totalSets}
            </p>

            {/* Ring + countdown */}
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg
                width="160" height="160" viewBox="0 0 160 160"
                style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
              >
                <circle cx="80" cy="80" r={CIRCLE_R} fill="none" stroke="#2A2A28" strokeWidth="7" />
                <circle
                  cx="80" cy="80" r={CIRCLE_R}
                  fill="none"
                  stroke={color}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.5s' }}
                />
              </svg>
              <span style={{ color: '#F0EEE8', fontSize: 52, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px', zIndex: 1 }}>
                {fmtTime(remaining)}
              </span>
            </div>

            {/* Adjust + skip */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <button onClick={() => onAdjust(-15)} style={adjBtn}>−15s</button>
              <button
                onClick={onSkip}
                style={{ ...adjBtn, flex: 2, background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.25)' }}
              >
                Skip
              </button>
              <button onClick={() => onAdjust(+15)} style={adjBtn}>+15s</button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {[45, 60, 90, 120].map(s => (
                <button
                  key={s}
                  onClick={() => onPreset(s)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    minHeight: 36, fontSize: 13, fontWeight: 600,
                    background: Math.round(timerState.duration) === s ? '#0F6E56' : '#2A2A28',
                    color: Math.round(timerState.duration) === s ? '#fff' : '#888780',
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

const adjBtn = {
  flex: 1, padding: '12px 0', borderRadius: 12,
  background: '#2A2A28', color: '#F0EEE8',
  border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, minHeight: 48,
}
