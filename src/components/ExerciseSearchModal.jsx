import { useState, useMemo } from 'react'
import { filterExercises, MUSCLE_GROUPS, EQUIPMENT_GROUPS, YUHONAS_BASE } from '../services/localExercises'

const ACL_FLAG_WORDS = ['squat', 'lunge', 'jump', 'lateral', 'split']
const LOWER_MUSCLES = ['glutes', 'hamstrings', 'quadriceps', 'calves']

export default function ExerciseSearchModal({ targetDay, onAdd, onClose, aclMode = true }) {
  const [query, setQuery] = useState('')
  const [activeMuscle, setActiveMuscle] = useState(null)
  const [activeEquip, setActiveEquip] = useState(null)

  const showAclWarning = activeMuscle && LOWER_MUSCLES.includes(
    MUSCLE_GROUPS.find(g => g.label === activeMuscle)?.muscles[0]
  )

  const results = useMemo(() =>
    filterExercises({ query, muscleGroup: activeMuscle, equipment: activeEquip }, 40),
    [query, activeMuscle, activeEquip]
  )

  const isAclUnsafe = (name) => ACL_FLAG_WORDS.some(w => name.toLowerCase().includes(w))

  const toggleMuscle = (label) => {
    setQuery('')
    setActiveMuscle(prev => prev === label ? null : label)
    setActiveEquip(null)
  }

  const toggleEquip = (value) => {
    setQuery('')
    setActiveEquip(prev => prev === value ? null : value)
    setActiveMuscle(null)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 480, background: '#1C1C1A', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '92vh', border: '1px solid #2A2A28' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 4, borderRadius: 4, background: '#2A2A28' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, margin: 0 }}>Add Exercise</h2>
              <p style={{ color: '#888780', fontSize: 12, margin: '2px 0 0' }}>
                Adding to {targetDay === 'upper' ? 'Upper Day' : 'Lower Day'} · {results.length} exercises
              </p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveMuscle(null); setActiveEquip(null) }}
              placeholder="Search exercises..."
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Muscle pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
            {MUSCLE_GROUPS.map(g => (
              <button
                key={g.label}
                onClick={() => toggleMuscle(g.label)}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: `1px solid ${activeMuscle === g.label ? '#0F6E56' : '#2A2A28'}`, background: activeMuscle === g.label ? '#0F6E56' : '#0F0F0E', color: activeMuscle === g.label ? '#fff' : '#888780', fontSize: 13, cursor: 'pointer', minHeight: 32, whiteSpace: 'nowrap' }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Equipment pills */}
          <div style={{ display: 'flex', gap: 6, paddingBottom: 12 }}>
            {EQUIPMENT_GROUPS.map(g => (
              <button
                key={g.value}
                onClick={() => toggleEquip(g.value)}
                style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${activeEquip === g.value ? '#185FA5' : '#2A2A28'}`, background: activeEquip === g.value ? '#185FA5' : '#0F0F0E', color: activeEquip === g.value ? '#fff' : '#888780', fontSize: 13, cursor: 'pointer', minHeight: 32 }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {showAclWarning && aclMode && (
            <div style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
              <p style={{ color: '#fbbf24', fontSize: 13, margin: 0 }}>
                ⚠️ ACL Safe Mode on — squats, lunges, jumps are blocked for lower-day routines.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>
          {results.length === 0 && (
            <p style={{ color: '#555452', fontSize: 14, textAlign: 'center', paddingTop: 24 }}>
              {query || activeMuscle || activeEquip ? 'No results found.' : 'Search by name or filter above.'}
            </p>
          )}

          {results.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {results.map(ex => {
                const unsafe = isAclUnsafe(ex.name)
                const img0 = ex.images?.[0] ? YUHONAS_BASE + ex.images[0] : null
                const img1 = ex.images?.[1] ? YUHONAS_BASE + ex.images[1] : null
                return (
                  <div key={ex.id} style={{ background: '#0F0F0E', borderRadius: 12, overflow: 'hidden', border: '1px solid #2A2A28', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: 120, background: '#111' }}>
                      {img0 ? (
                        <>
                          <img src={img0} alt={ex.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: 'exImg0 1.6s steps(1) infinite' }} />
                          {img1 && <img src={img1} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: 'exImg1 1.6s steps(1) infinite' }} />}
                        </>
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 28 }}>🏋️</span>
                        </div>
                      )}
                      {unsafe && (
                        <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(217,119,6,0.9)', borderRadius: 6, padding: '2px 6px', fontSize: 11, color: '#fff' }}>⚠️</div>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ color: '#F0EEE8', fontSize: 13, fontWeight: 600, margin: '0 0 2px', lineHeight: 1.3 }}>{ex.name}</p>
                      <p style={{ color: '#888780', fontSize: 11, margin: '0 0 8px', textTransform: 'capitalize', flex: 1 }}>
                        {ex.primaryMuscles?.[0]} · {ex.equipment}
                      </p>
                      <button
                        onClick={() => onAdd(ex)}
                        disabled={aclMode && targetDay === 'lower' && unsafe}
                        style={{ padding: '8px 0', borderRadius: 8, background: (aclMode && targetDay === 'lower' && unsafe) ? '#2A2A28' : '#0F6E56', color: (aclMode && targetDay === 'lower' && unsafe) ? '#555452' : '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: (aclMode && targetDay === 'lower' && unsafe) ? 'not-allowed' : 'pointer', minHeight: 36 }}
                      >
                        {aclMode && targetDay === 'lower' && unsafe ? '⚠️ ACL risk' : `Add to ${targetDay === 'upper' ? 'Upper' : 'Lower'}`}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
