import { doneCount, totalSets as countSets, isExerciseComplete, formatSetsSummary } from '../utils/sets'

export default function CompletionScreen({ session, program, onDone }) {
  const exercises = program.routines[session.routineId]?.exercises || program.routines[Object.keys(program.routines)[0]]?.exercises || []
  const totalSets = session.exerciseStates.reduce((s, e) => s + doneCount(e), 0)
  const completedExs = session.exerciseStates.filter(isExerciseComplete).length

  return (
    <div style={{ minHeight: '100dvh', background: '#0F0F0E', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>💪</div>
        <h1 style={{ color: '#F0EEE8', fontSize: 30, fontWeight: 700, marginBottom: 6 }}>Workout Done!</h1>
        <p style={{ color: '#888780', fontSize: 15 }}>
          {new Date(session.completedAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Stat value={session.duration} unit="min" label="Duration" color="#14b8a6" />
          <Stat value={completedExs} unit={`/${exercises.length}`} label="Exercises" color="#185FA5" />
          <Stat value={totalSets} unit=" sets" label="Total Sets" color="#a855f7" />
        </div>
      </div>

      {/* Exercise log */}
      <div style={{ flex: 1, padding: '0 16px 24px', maxWidth: 480, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Exercise Log</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {exercises.map((ex, i) => {
            const s = session.exerciseStates[i]
            if (!s) return null
            const done = doneCount(s)
            const total = countSets(s)
            const complete = total > 0 && done === total
            const summary = formatSetsSummary(s)
            return (
              <div key={ex.id} style={{ background: '#1C1C1A', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #2A2A28' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: complete ? '#22C55E' : '#2A2A28', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {complete ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                  ) : (
                    <span style={{ color: '#888780', fontSize: 11 }}>{done}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: complete ? '#F0EEE8' : '#888780', fontSize: 14, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
                  {summary && <p style={{ color: '#555452', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</p>}
                </div>
                <span style={{ color: complete ? '#22C55E' : '#555452', fontSize: 12, flexShrink: 0 }}>{done}/{total}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 16px 40px', maxWidth: 480, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <button
          onClick={onDone}
          style={{ width: '100%', padding: '16px 0', borderRadius: 14, background: '#0F6E56', color: '#fff', fontSize: 17, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 44 }}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

function Stat({ value, unit, label, color }) {
  return (
    <div style={{ background: '#1C1C1A', borderRadius: 12, padding: 14, textAlign: 'center', border: '1px solid #2A2A28' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
        <span style={{ color: '#F0EEE8', fontSize: 26, fontWeight: 700 }}>{value}</span>
        <span style={{ color, fontSize: 13, fontWeight: 600 }}>{unit}</span>
      </div>
      <p style={{ color: '#888780', fontSize: 11, margin: 0 }}>{label}</p>
    </div>
  )
}
