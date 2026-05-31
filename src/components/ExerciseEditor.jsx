import { useState } from 'react'
import EditExerciseModal from './EditExerciseModal'
import ExerciseSearchModal from './ExerciseSearchModal'

export default function ExerciseEditor({ program, onUpdateProgram, onAddToast }) {
  const [day, setDay] = useState('upper')
  const [editTarget, setEditTarget] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [deletedUndo, setDeletedUndo] = useState(null)

  const exercises = program[day]

  const move = (index, dir) => {
    const next = [...exercises]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    onUpdateProgram({ ...program, [day]: next })
  }

  const remove = (index) => {
    const removed = exercises[index]
    const next = exercises.filter((_, i) => i !== index)
    onUpdateProgram({ ...program, [day]: next })
    setDeletedUndo({ exercise: removed, day, index })
    onAddToast(`Removed "${removed.name}"`)
    setTimeout(() => setDeletedUndo(null), 4000)
  }

  const undoDelete = () => {
    if (!deletedUndo) return
    const { exercise, day: d, index } = deletedUndo
    const next = [...program[d]]
    next.splice(index, 0, exercise)
    onUpdateProgram({ ...program, [d]: next })
    setDeletedUndo(null)
  }

  const saveEdit = (updated) => {
    const next = exercises.map(e => e.id === updated.id ? updated : e)
    onUpdateProgram({ ...program, [day]: next })
  }

  const addFromSearch = (apiEx) => {
    const newEx = {
      id: `custom-${Date.now()}`,
      name: cap(apiEx.name),
      search: apiEx.name,
      sets: 3,
      reps: '10–12',
      tip: `Target: ${apiEx.target}`,
      notes: '',
      wxId: apiEx.id,  // WorkoutX ID — used to auto-resolve the GIF
    }
    onUpdateProgram({ ...program, [day]: [...program[day], newEx] })
    setShowSearch(false)
    onAddToast(`Added "${newEx.name}" to ${day === 'upper' ? 'Upper' : 'Lower'} Day`)
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Program</h1>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: '#1C1C1A', borderRadius: 12, padding: 4, border: '1px solid #2A2A28' }}>
        {['upper', 'lower'].map(d => (
          <button
            key={d}
            onClick={() => setDay(d)}
            style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, minHeight: 44, background: day === d ? (d === 'upper' ? '#185FA5' : '#0F6E56') : 'transparent', color: day === d ? '#fff' : '#888780', transition: 'background 200ms' }}
          >
            {d === 'upper' ? 'Upper Day' : 'Lower Day'}
          </button>
        ))}
      </div>

      <p style={{ color: '#888780', fontSize: 13, marginBottom: 16 }}>
        {exercises.length} exercises · {exercises.reduce((a, e) => a + e.sets, 0)} total sets
      </p>

      {/* Exercise rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={{ background: '#1C1C1A', borderRadius: 12, border: '1px solid #2A2A28', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Reorder arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? 'transparent' : '#2A2A28', border: 'none', color: i === 0 ? '#2A2A28' : '#888780', cursor: i === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18,15 12,9 6,15"/></svg>
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === exercises.length - 1}
                style={{ width: 24, height: 24, borderRadius: 6, background: i === exercises.length - 1 ? 'transparent' : '#2A2A28', border: 'none', color: i === exercises.length - 1 ? '#2A2A28' : '#888780', cursor: i === exercises.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6,9 12,15 18,9"/></svg>
              </button>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
              <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{ex.sets} sets × {ex.reps}</p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => setEditTarget(ex)}
                style={{ width: 36, height: 36, borderRadius: 8, background: '#2A2A28', border: 'none', color: '#888780', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Edit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                onClick={() => remove(i)}
                style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(220,38,38,0.12)', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add exercise button */}
      <button
        onClick={() => setShowSearch(true)}
        style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#1C1C1A', border: '1px dashed #2A2A28', color: '#0F6E56', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Exercise
      </button>

      {/* Undo toast */}
      {deletedUndo && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#1C1C1A', border: '1px solid #2A2A28', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#888780', fontSize: 13 }}>Exercise removed</span>
          <button onClick={undoDelete} style={{ color: '#0F6E56', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Undo</button>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditExerciseModal
          exercise={editTarget}
          onSave={saveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Search modal */}
      {showSearch && (
        <ExerciseSearchModal
          targetDay={day}
          onAdd={addFromSearch}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  )
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }
