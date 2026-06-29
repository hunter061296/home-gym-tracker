import { useState } from 'react'
import { DEFAULT_OVERLOAD } from '../data/defaultProgram'

export default function EditExerciseModal({ exercise, onSave, onClose }) {
  const [sets, setSets] = useState(String(exercise.sets))
  const [reps, setReps] = useState(exercise.reps)
  const [tip, setTip] = useState(exercise.tip)
  const [notes, setNotes] = useState(exercise.notes || '')
  const [restSeconds, setRestSeconds] = useState(exercise.restSeconds ? String(exercise.restSeconds) : '')

  // Progressive overload state
  const overload = exercise.progressiveOverload || DEFAULT_OVERLOAD
  const [poEnabled, setPoEnabled] = useState(overload.enabled)
  const [poType, setPoType] = useState(overload.type)
  const [poIncrementWeight, setPoIncrementWeight] = useState(String(overload.incrementWeight))
  const [poIncrementReps, setPoIncrementReps] = useState(String(overload.incrementReps))

  const handleSave = () => {
    const parsedSets = parseInt(sets, 10)
    if (isNaN(parsedSets) || parsedSets < 1 || parsedSets > 6) return
    const parsedRest = restSeconds ? parseInt(restSeconds, 10) : undefined
    const parsedWeightInc = parseFloat(poIncrementWeight)
    const parsedRepsInc = parseInt(poIncrementReps, 10)
    onSave({
      ...exercise,
      sets: parsedSets,
      reps,
      tip,
      notes,
      restSeconds: parsedRest || undefined,
      progressiveOverload: {
        enabled: poEnabled,
        type: poType,
        incrementWeight: isNaN(parsedWeightInc) || parsedWeightInc <= 0 ? DEFAULT_OVERLOAD.incrementWeight : parsedWeightInc,
        incrementReps: isNaN(parsedRepsInc) || parsedRepsInc < 1 ? DEFAULT_OVERLOAD.incrementReps : parsedRepsInc,
        lastIncreasedWeek: overload.lastIncreasedWeek,
      },
    })
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 480, background: '#1C1C1A', borderRadius: '16px 16px 0 0', padding: '20px 20px 40px', border: '1px solid #2A2A28', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: '#2A2A28' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, margin: 0 }}>Edit Exercise</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <p style={{ color: '#888780', fontSize: 14, marginBottom: 20 }}>{exercise.name}</p>

        <Field label="Sets (1–6)">
          <input
            type="number"
            min={1}
            max={6}
            value={sets}
            onChange={e => setSets(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Reps / Range">
          <input
            type="text"
            value={reps}
            onChange={e => setReps(e.target.value)}
            placeholder="e.g. 8–12 or 20"
            style={inputStyle}
          />
        </Field>

        <Field label="Progressive Overload Tip">
          <textarea
            value={tip}
            onChange={e => setTip(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
          />
        </Field>

        <Field label="Rest Duration (seconds)" hint="Leave blank to use category default">
          <input
            type="number"
            min={15}
            max={300}
            value={restSeconds}
            onChange={e => setRestSeconds(e.target.value)}
            placeholder="e.g. 90 (blank = auto)"
            style={inputStyle}
          />
        </Field>

        <Field label="Personal Notes">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. use 10kg, feel it in left shoulder"
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
          />
        </Field>

        {/* ── Progressive Overload Section ── */}
        <div style={{ marginBottom: 16, padding: '14px 14px 10px', borderRadius: 12, background: '#0F0F0E', border: poEnabled ? '1px solid #0F6E56' : '1px solid #2A2A28' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: poEnabled ? 12 : 0 }}>
            <label style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={poEnabled ? '#34d399' : '#888780'} strokeWidth="2" strokeLinecap="round">
                <polyline points="22,7 13.5,15.5 8.5,10.5"/>
                <polyline points="18,7 13.5,11.5 8.5,6.5"/>
              </svg>
              Progressive Overload
            </label>
            <button
              onClick={() => setPoEnabled(!poEnabled)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
                background: poEnabled ? '#0F6E56' : '#2A2A28', transition: 'background 200ms', flexShrink: 0,
              }}
              aria-label={poEnabled ? 'Disable progressive overload' : 'Enable progressive overload'}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 2, left: poEnabled ? 22 : 2,
                transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>

          {poEnabled && (
            <div>
              {/* Overload type: weight vs reps */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setPoType('weight')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${poType === 'weight' ? '#0F6E56' : '#2A2A28'}`,
                    background: poType === 'weight' ? 'rgba(15,110,86,0.2)' : 'transparent',
                    color: poType === 'weight' ? '#34d399' : '#888780', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 36,
                  }}
                >
                  ⚖️ Weight
                </button>
                <button
                  onClick={() => setPoType('reps')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${poType === 'reps' ? '#0F6E56' : '#2A2A28'}`,
                    background: poType === 'reps' ? 'rgba(15,110,86,0.2)' : 'transparent',
                    color: poType === 'reps' ? '#34d399' : '#888780', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 36,
                  }}
                >
                  🔁 Reps
                </button>
              </div>

              {poType === 'weight' ? (
                <Field label="Weight Increase (kg)">
                  <input
                    type="number"
                    min={0.5}
                    max={50}
                    step={0.5}
                    value={poIncrementWeight}
                    onChange={e => setPoIncrementWeight(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 2.5"
                  />
                </Field>
              ) : (
                <Field label="Rep Increase">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    value={poIncrementReps}
                    onChange={e => setPoIncrementReps(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 1"
                  />
                </Field>
              )}

              <p style={{ color: '#555452', fontSize: 12, margin: '0 0 6px', lineHeight: 1.4 }}>
                {poType === 'weight'
                  ? `Each week, weight will increase by ${poIncrementWeight || '2.5'} kg. Old weight is kept as a fallback.`
                  : `Each week, rep target will increase by ${poIncrementReps || '1'}.`
                }
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#0F6E56', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 44, marginTop: 4 }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <label style={{ color: '#888780', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
        {hint && <span style={{ color: '#555452', fontSize: 11 }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: '#0F0F0E',
  border: '1px solid #2A2A28',
  color: '#F0EEE8',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}
