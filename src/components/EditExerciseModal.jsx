import { useState } from 'react'

export default function EditExerciseModal({ exercise, onSave, onClose }) {
  const [sets, setSets] = useState(String(exercise.sets))
  const [reps, setReps] = useState(exercise.reps)
  const [tip, setTip] = useState(exercise.tip)
  const [notes, setNotes] = useState(exercise.notes || '')

  const handleSave = () => {
    const parsed = parseInt(sets, 10)
    if (isNaN(parsed) || parsed < 1 || parsed > 6) return
    onSave({ ...exercise, sets: parsed, reps, tip, notes })
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

        <Field label="Personal Notes">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. use 10kg, feel it in left shoulder"
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
          />
        </Field>

        <button
          onClick={handleSave}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#0F6E56', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 44, marginTop: 8 }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#888780', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
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
