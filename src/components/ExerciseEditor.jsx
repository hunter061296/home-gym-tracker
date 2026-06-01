import { useState } from 'react'
import { DAY_NAMES, TYPE_CONFIG } from '../data/defaultProgram'
import EditExerciseModal from './EditExerciseModal'
import ExerciseSearchModal from './ExerciseSearchModal'
import ExerciseModal from './ExerciseModal'

export default function ExerciseEditor({ program, onUpdateProgram, onAddToast, aclMode }) {
  const routineIds = Object.keys(program.routines || {})
  const [activeRoutineId, setActiveRoutineId] = useState(routineIds[0] || null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [editingDow, setEditingDow] = useState(null)       // day-of-week whose schedule is being changed
  const [routineMenu, setRoutineMenu] = useState(null)      // routineId with open ⋮ menu
  const [showCreate, setShowCreate] = useState(false)
  const [renameTarget, setRenameTarget] = useState(null)    // routineId to rename
  const [confirmDelete, setConfirmDelete] = useState(null)  // routineId to delete
  const [editTarget, setEditTarget] = useState(null)
  const [previewTarget, setPreviewTarget] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [deletedUndo, setDeletedUndo] = useState(null)

  // Always use a valid active ID
  const effectiveId = program.routines[activeRoutineId] ? activeRoutineId : routineIds[0]
  const routine = program.routines[effectiveId]
  const exercises = routine?.exercises || []

  // ── Exercise mutations ─────────────────────────────────────────────────────

  const updateExercises = (next) => {
    onUpdateProgram({
      ...program,
      routines: { ...program.routines, [effectiveId]: { ...routine, exercises: next } },
    })
  }

  const move = (index, dir) => {
    const next = [...exercises]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    updateExercises(next)
  }

  const remove = (index) => {
    const removed = exercises[index]
    updateExercises(exercises.filter((_, i) => i !== index))
    setDeletedUndo({ exercise: removed, routineId: effectiveId, index })
    onAddToast(`Removed "${removed.name}"`)
    setTimeout(() => setDeletedUndo(null), 4000)
  }

  const undoDelete = () => {
    if (!deletedUndo) return
    const { exercise, routineId: rid, index } = deletedUndo
    const r = program.routines[rid]
    if (!r) return
    const next = [...r.exercises]
    next.splice(index, 0, exercise)
    onUpdateProgram({ ...program, routines: { ...program.routines, [rid]: { ...r, exercises: next } } })
    setDeletedUndo(null)
  }

  const saveEdit = (updated) => {
    updateExercises(exercises.map(e => e.id === updated.id ? updated : e))
  }

  const addFromSearch = (libEx) => {
    const newEx = {
      id: `custom-${Date.now()}`,
      name: cap(libEx.name),
      sets: 3, reps: '10–12',
      tip: `Target: ${(libEx.primaryMuscles || []).join(', ')}`,
      notes: '',
      target: (libEx.primaryMuscles || [])[0] || '',
      secondaryMuscles: libEx.secondaryMuscles || [],
      instructions: libEx.instructions || [],
      yImages: libEx.images || [],
    }
    updateExercises([...exercises, newEx])
    setShowSearch(false)
    onAddToast(`Added "${newEx.name}" to ${routine?.name}`)
  }

  // ── Routine mutations ──────────────────────────────────────────────────────

  const createRoutine = ({ name, type, copyFromId }) => {
    const id = `${type}-${Date.now()}`
    const baseExercises = copyFromId
      ? JSON.parse(JSON.stringify(program.routines[copyFromId]?.exercises || []))
      : []
    onUpdateProgram({
      ...program,
      routines: { ...program.routines, [id]: { id, name, type, exercises: baseExercises } },
    })
    setActiveRoutineId(id)
    setShowCreate(false)
    onAddToast(`Created "${name}"`)
  }

  const renameRoutine = (routineId, newName) => {
    const r = program.routines[routineId]
    onUpdateProgram({ ...program, routines: { ...program.routines, [routineId]: { ...r, name: newName } } })
    setRenameTarget(null)
    onAddToast(`Renamed to "${newName}"`)
  }

  const duplicateRoutine = (routineId) => {
    const source = program.routines[routineId]
    const id = `${source.type}-${Date.now()}`
    const name = `${source.name} B`
    onUpdateProgram({
      ...program,
      routines: {
        ...program.routines,
        [id]: { id, name, type: source.type, exercises: JSON.parse(JSON.stringify(source.exercises)) },
      },
    })
    setActiveRoutineId(id)
    setRoutineMenu(null)
    onAddToast(`Duplicated as "${name}"`)
  }

  const deleteRoutine = (routineId) => {
    const { [routineId]: _, ...rest } = program.routines
    // Unassign from any schedule days
    const newSchedule = { ...program.schedule }
    for (const dow of Object.keys(newSchedule)) {
      if (newSchedule[dow] === routineId) newSchedule[dow] = 'rest'
    }
    onUpdateProgram({ ...program, routines: rest, schedule: newSchedule })
    const remaining = Object.keys(rest)
    setActiveRoutineId(remaining[0] || null)
    setConfirmDelete(null)
    setRoutineMenu(null)
    onAddToast('Routine deleted')
  }

  const assignDay = (dow, newRoutineId) => {
    onUpdateProgram({ ...program, schedule: { ...program.schedule, [dow]: newRoutineId } })
    setEditingDow(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Program</h1>

      {/* ── Schedule section ── */}
      <div style={{ marginBottom: 20, background: '#1C1C1A', borderRadius: 14, border: '1px solid #2A2A28', overflow: 'hidden' }}>
        <button
          onClick={() => setScheduleOpen(o => !o)}
          style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44 }}
        >
          <span style={{ color: '#F0EEE8', fontSize: 15, fontWeight: 600 }}>Weekly Schedule</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: scheduleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {scheduleOpen && (
          <div style={{ borderTop: '1px solid #2A2A28' }}>
            {[1, 2, 3, 4, 5, 6, 0].map(dow => {
              const rId = program.schedule[dow]
              const isRest = rId === 'rest'
              const r = isRest ? null : program.routines[rId]
              const typeColor = r ? TYPE_CONFIG[r.type]?.color : '#2A2A28'
              return (
                <button
                  key={dow}
                  onClick={() => setEditingDow(dow)}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', borderBottom: dow !== 0 ? '1px solid #2A2A28' : 'none', cursor: 'pointer', minHeight: 44 }}
                >
                  <span style={{ width: 32, color: '#888780', fontSize: 13, textAlign: 'left', flexShrink: 0 }}>{DAY_NAMES[dow]}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColor, flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: 'left', color: isRest ? '#555452' : '#F0EEE8', fontSize: 14, fontWeight: isRest ? 400 : 500 }}>
                    {isRest ? 'Rest' : r?.name || 'Unknown'}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555452" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Routine tabs ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {routineIds.map(rid => {
            const r = program.routines[rid]
            const isActive = rid === effectiveId
            const tc = TYPE_CONFIG[r.type]
            return (
              <div key={rid} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => { setActiveRoutineId(rid); setRoutineMenu(null) }}
                  style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${isActive ? tc.border : '#2A2A28'}`, background: isActive ? tc.bg : 'transparent', color: isActive ? tc.text : '#888780', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 40, paddingRight: isActive ? 32 : 14 }}
                >
                  {r.name}
                </button>
                {/* ⋮ menu button on active tab */}
                {isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setRoutineMenu(routineMenu === rid ? null : rid) }}
                    style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 22, height: 22, borderRadius: 4, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc.text }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
          {/* Add routine */}
          <button
            onClick={() => setShowCreate(true)}
            style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 10, border: '1px dashed #2A2A28', background: 'transparent', color: '#0F6E56', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 40, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New
          </button>
        </div>

        {/* Routine ⋮ menu dropdown */}
        {routineMenu === effectiveId && (
          <div style={{ marginTop: 6, background: '#1C1C1A', border: '1px solid #2A2A28', borderRadius: 10, overflow: 'hidden' }}>
            <MenuAction label="Rename" icon="✏️" onClick={() => { setRenameTarget(effectiveId); setRoutineMenu(null) }} />
            <MenuAction label="Duplicate" icon="⧉" onClick={() => duplicateRoutine(effectiveId)} />
            <MenuAction
              label="Delete"
              icon="🗑"
              danger
              disabled={routineIds.length <= 1}
              onClick={() => { setConfirmDelete(effectiveId); setRoutineMenu(null) }}
            />
          </div>
        )}
      </div>

      {/* Exercise count */}
      <p style={{ color: '#888780', fontSize: 13, marginBottom: 16 }}>
        {exercises.length} exercises · {exercises.reduce((a, e) => a + e.sets, 0)} total sets
      </p>

      {/* ── Exercise rows ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={{ background: '#1C1C1A', borderRadius: 12, border: '1px solid #2A2A28', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
              <ArrowBtn disabled={i === 0} onClick={() => move(i, -1)} up />
              <ArrowBtn disabled={i === exercises.length - 1} onClick={() => move(i, 1)} up={false} />
            </div>
            <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setPreviewTarget(ex)}>
              <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
              <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{ex.sets} sets × {ex.reps}</p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <IconBtn title="Preview" onClick={() => setPreviewTarget(ex)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </IconBtn>
              <IconBtn title="Edit" onClick={() => setEditTarget(ex)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </IconBtn>
              <IconBtn title="Remove" danger onClick={() => remove(i)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowSearch(true)}
        style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#1C1C1A', border: '1px dashed #2A2A28', color: '#0F6E56', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Exercise
      </button>

      {/* ── Undo toast ── */}
      {deletedUndo && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#1C1C1A', border: '1px solid #2A2A28', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#888780', fontSize: 13 }}>Exercise removed</span>
          <button onClick={undoDelete} style={{ color: '#0F6E56', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Undo</button>
        </div>
      )}

      {/* ── Schedule day picker modal ── */}
      {editingDow !== null && (
        <BottomSheet onClose={() => setEditingDow(null)} title={`${DAY_NAMES[editingDow]} — assign routine`}>
          <PickerOption
            label="Rest"
            selected={program.schedule[editingDow] === 'rest'}
            dot="#2A2A28"
            onClick={() => assignDay(editingDow, 'rest')}
          />
          <div style={{ height: 1, background: '#2A2A28', margin: '8px 0' }} />
          {Object.values(program.routines).map(r => (
            <PickerOption
              key={r.id}
              label={r.name}
              sub={r.type === 'upper' ? 'Upper' : 'Lower'}
              selected={program.schedule[editingDow] === r.id}
              dot={TYPE_CONFIG[r.type]?.color}
              onClick={() => assignDay(editingDow, r.id)}
            />
          ))}
        </BottomSheet>
      )}

      {/* ── Create routine modal ── */}
      {showCreate && (
        <CreateRoutineModal
          routines={program.routines}
          onCreate={createRoutine}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* ── Rename modal ── */}
      {renameTarget && (
        <RenameModal
          initialName={program.routines[renameTarget]?.name || ''}
          onSave={name => renameRoutine(renameTarget, name)}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {/* ── Confirm delete modal ── */}
      {confirmDelete && (
        <ConfirmModal
          title={`Delete "${program.routines[confirmDelete]?.name}"?`}
          body="It will be removed from the schedule. This can't be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteRoutine(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Exercise modals ── */}
      {previewTarget && <ExerciseModal exercise={previewTarget} onClose={() => setPreviewTarget(null)} />}
      {editTarget && <EditExerciseModal exercise={editTarget} onSave={saveEdit} onClose={() => setEditTarget(null)} />}
      {showSearch && (
        <ExerciseSearchModal
          targetDay={routine?.type || 'upper'}
          onAdd={addFromSearch}
          onClose={() => setShowSearch(false)}
          aclMode={aclMode}
        />
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ArrowBtn({ disabled, onClick, up }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: 24, height: 24, borderRadius: 6, background: disabled ? 'transparent' : '#2A2A28', border: 'none', color: disabled ? '#2A2A28' : '#888780', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {up ? <polyline points="18,15 12,9 6,15"/> : <polyline points="6,9 12,15 18,9"/>}
      </svg>
    </button>
  )
}

function IconBtn({ onClick, danger, title, children }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width: 36, height: 36, borderRadius: 8, background: danger ? 'rgba(220,38,38,0.12)' : '#2A2A28', border: 'none', color: danger ? '#f87171' : '#888780', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
    </button>
  )
}

function MenuAction({ label, icon, onClick, danger, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', borderBottom: '1px solid #2A2A28', cursor: disabled ? 'default' : 'pointer', minHeight: 44, opacity: disabled ? 0.4 : 1 }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ color: danger ? '#f87171' : '#F0EEE8', fontSize: 14 }}>{label}</span>
    </button>
  )
}

function BottomSheet({ onClose, title, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div style={{ background: '#1C1C1A', borderRadius: '16px 16px 0 0', padding: '20px 16px 36px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#2A2A28' }} />
        </div>
        <p style={{ color: '#888780', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{title}</p>
        {children}
      </div>
    </div>
  )
}

function PickerOption({ label, sub, selected, dot, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '100%', padding: '12px 4px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', minHeight: 44 }}
    >
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <div style={{ flex: 1, textAlign: 'left' }}>
        <span style={{ color: '#F0EEE8', fontSize: 15, fontWeight: selected ? 600 : 400 }}>{label}</span>
        {sub && <span style={{ color: '#555452', fontSize: 13, marginLeft: 8 }}>{sub}</span>}
      </div>
      {selected && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      )}
    </button>
  )
}

function CreateRoutineModal({ routines, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('upper')
  const [copyFromId, setCopyFromId] = useState('')

  const valid = name.trim().length > 0
  const routineList = Object.values(routines)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 20px' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
        <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Routine</h3>

        <Label>Name</Label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Upper B"
          style={inputStyle}
        />

        <Label>Type</Label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['upper', 'lower'].map(t => (
            <button key={t} onClick={() => setType(t)}
              style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${type === t ? TYPE_CONFIG[t].border : '#2A2A28'}`, background: type === t ? TYPE_CONFIG[t].bg : 'transparent', color: type === t ? TYPE_CONFIG[t].text : '#888780', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44 }}>
              {t === 'upper' ? 'Upper' : 'Lower'}
            </button>
          ))}
        </div>

        <Label>Copy exercises from (optional)</Label>
        <select
          value={copyFromId}
          onChange={e => setCopyFromId(e.target.value)}
          style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
        >
          <option value="">Start empty</option>
          {routineList.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
          <button
            onClick={() => valid && onCreate({ name: name.trim(), type, copyFromId: copyFromId || null })}
            disabled={!valid}
            style={{ flex: 2, padding: '12px 0', borderRadius: 10, background: valid ? '#0F6E56' : '#2A2A28', color: valid ? '#fff' : '#555452', fontSize: 15, fontWeight: 600, border: 'none', cursor: valid ? 'pointer' : 'default', minHeight: 44 }}>
            Create Routine
          </button>
        </div>
      </div>
    </div>
  )
}

function RenameModal({ initialName, onSave, onClose }) {
  const [name, setName] = useState(initialName)
  const valid = name.trim().length > 0 && name.trim() !== initialName
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 20px' }}>
      <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
        <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Rename Routine</h3>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
          <button onClick={() => valid && onSave(name.trim())} disabled={!valid}
            style={{ flex: 2, padding: '12px 0', borderRadius: 10, background: valid ? '#0F6E56' : '#2A2A28', color: valid ? '#fff' : '#555452', fontSize: 15, fontWeight: 600, border: 'none', cursor: valid ? 'pointer' : 'default', minHeight: 44 }}>Save</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ title, body, confirmLabel, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
        <h3 style={{ color: '#F0EEE8', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <p style={{ color: '#888780', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{children}</p>
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0F0F0E',
  border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 15, outline: 'none',
  marginBottom: 16, boxSizing: 'border-box',
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }
