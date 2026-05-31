import { useState } from 'react'
import ExerciseCard from './ExerciseCard'

export default function WorkoutSession({ session, program, apiData, onUpdate, onComplete, onExit }) {
  const [confirmExit, setConfirmExit] = useState(false)
  const exercises = program[session.type]
  const completedCount = session.exerciseStates.filter(s => s.completedSets.every(Boolean)).length
  const allDone = completedCount === exercises.length
  const progress = completedCount / exercises.length

  const updateState = (id, newState) => {
    onUpdate({
      ...session,
      exerciseStates: session.exerciseStates.map(s => s.id === id ? newState : s),
    })
  }

  const typeLabel = session.type === 'upper' ? 'Upper Day' : 'Lower Day'
  const typeColor = session.type === 'upper' ? '#185FA5' : '#0F6E56'

  return (
    <div style={{ minHeight: '100dvh', background: '#0F0F0E' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: '#0F0F0E', borderBottom: '1px solid #2A2A28', padding: '14px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button
            onClick={() => setConfirmExit(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', fontSize: 14, minHeight: 44 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
            Exit
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#F0EEE8', fontSize: 16, fontWeight: 700, margin: 0 }}>{typeLabel}</h2>
            <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{session.date}</p>
          </div>
          <div style={{ background: typeColor, color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
            {completedCount}/{exercises.length}
          </div>
        </div>
        <div style={{ height: 6, background: '#2A2A28', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 6, background: progress === 1 ? '#22C55E' : typeColor, width: `${progress * 100}%`, transition: 'width 500ms ease-out' }} />
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: '16px 16px 32px', maxWidth: 480, margin: '0 auto' }}>
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            state={session.exerciseStates[i]}
            onUpdateState={s => updateState(exercise.id, s)}
            apiData={apiData[exercise.id]}
            dayType={session.type}
          />
        ))}

        {allDone ? (
          <button
            onClick={() => onComplete(session)}
            style={{ width: '100%', padding: '18px 0', borderRadius: 14, background: '#22C55E', color: '#fff', fontSize: 18, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 32 }}
          >
            🎉 Complete Workout
          </button>
        ) : (
          <p style={{ textAlign: 'center', color: '#555452', fontSize: 14, paddingBottom: 32 }}>
            {exercises.length - completedCount} exercise{exercises.length - completedCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      {/* Exit confirm modal */}
      {confirmExit && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 24px' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
            <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Exit workout?</h3>
            <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>Your progress won't be saved.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmExit(false)}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
              >
                Keep Going
              </button>
              <button
                onClick={onExit}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
