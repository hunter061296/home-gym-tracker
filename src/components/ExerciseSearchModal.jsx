import { useState, useEffect, useRef } from 'react'
import { searchExercises, byBodyPart, byEquipment } from '../services/api'

const ACL_FLAG_WORDS = ['squat', 'lunge', 'jump', 'lateral', 'split']

// WorkoutX uses Title Case for bodyPart/equipment
const BODY_PARTS = ['Chest', 'Back', 'Shoulders', 'Upper Arms', 'Lower Arms', 'Upper Legs', 'Lower Legs', 'Waist']
const BODY_PART_LABELS = { 'Chest': 'Chest', 'Back': 'Back', 'Shoulders': 'Shoulders', 'Upper Arms': 'Arms', 'Lower Arms': 'Forearms', 'Upper Legs': 'Quads/Glutes', 'Lower Legs': 'Calves', 'Waist': 'Core' }
const EQUIPMENT = ['Dumbbell', 'Bands', 'Body Weight']
const EQUIP_LABELS = { 'Dumbbell': 'Dumbbell', 'Bands': 'Band', 'Body Weight': 'Bodyweight' }
const LOWER_BODY_PARTS = ['Upper Legs', 'Lower Legs']

export default function ExerciseSearchModal({ targetDay, onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeBodyPart, setActiveBodyPart] = useState(null)
  const [activeEquipment, setActiveEquipment] = useState(null)
  const [imgErrors, setImgErrors] = useState({})
  const debounceRef = useRef(null)

  const showAclWarning = activeBodyPart && LOWER_BODY_PARTS.includes(activeBodyPart)

  const runSearch = async (q) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const data = await searchExercises(q)
      setResults(data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const runFilter = async (bodyPart, equipment) => {
    setLoading(true)
    try {
      let data = []
      if (bodyPart) data = await byBodyPart(bodyPart)
      else if (equipment) data = await byEquipment(equipment)
      setResults(data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!query.trim()) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(query), 500)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const toggleBodyPart = (bp) => {
    setQuery('')
    const next = activeBodyPart === bp ? null : bp
    setActiveBodyPart(next)
    setActiveEquipment(null)
    if (next) runFilter(next, null)
    else setResults([])
  }

  const toggleEquipment = (eq) => {
    setQuery('')
    const next = activeEquipment === eq ? null : eq
    setActiveEquipment(next)
    setActiveBodyPart(null)
    if (next) runFilter(null, next)
    else setResults([])
  }

  const isAclUnsafe = (name) =>
    ACL_FLAG_WORDS.some(w => name.toLowerCase().includes(w))

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 480, background: '#1C1C1A', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '92vh', border: '1px solid #2A2A28' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 4, borderRadius: 4, background: '#2A2A28' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, margin: 0 }}>Add Exercise</h2>
              <p style={{ color: '#888780', fontSize: 12, margin: '2px 0 0' }}>Adding to {targetDay === 'upper' ? 'Upper Day' : 'Lower Day'}</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveBodyPart(null); setActiveEquipment(null) }}
              placeholder="Search exercises..."
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Body part pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 4 }}>
            {BODY_PARTS.map(bp => (
              <button
                key={bp}
                onClick={() => toggleBodyPart(bp)}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: `1px solid ${activeBodyPart === bp ? '#0F6E56' : '#2A2A28'}`, background: activeBodyPart === bp ? '#0F6E56' : '#0F0F0E', color: activeBodyPart === bp ? '#fff' : '#888780', fontSize: 13, cursor: 'pointer', minHeight: 32, whiteSpace: 'nowrap' }}
              >
                {BODY_PART_LABELS[bp]}
              </button>
            ))}
          </div>

          {/* Equipment pills */}
          <div style={{ display: 'flex', gap: 6, paddingBottom: 12 }}>
            {EQUIPMENT.map(eq => (
              <button
                key={eq}
                onClick={() => toggleEquipment(eq)}
                style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${activeEquipment === eq ? '#185FA5' : '#2A2A28'}`, background: activeEquipment === eq ? '#185FA5' : '#0F0F0E', color: activeEquipment === eq ? '#fff' : '#888780', fontSize: 13, cursor: 'pointer', minHeight: 32 }}
              >
                {EQUIP_LABELS[eq]}
              </button>
            ))}
          </div>

          {/* ACL warning banner */}
          {showAclWarning && (
            <div style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
              <p style={{ color: '#fbbf24', fontSize: 13, margin: 0 }}>
                ⚠️ ACL Injury — avoid deep squats, lunges, jumps, lateral instability moves. Stick to hip-dominant and knee-stable exercises.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#2A2A28', borderRadius: 12, height: 180, animation: 'shimmer 1.4s infinite' }} />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (query || activeBodyPart || activeEquipment) && (
            <p style={{ color: '#888780', fontSize: 14, textAlign: 'center', paddingTop: 24 }}>No results found.</p>
          )}

          {!loading && results.length === 0 && !query && !activeBodyPart && !activeEquipment && (
            <p style={{ color: '#555452', fontSize: 14, textAlign: 'center', paddingTop: 24 }}>Search by name or filter above.</p>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {results.map(ex => {
                const unsafe = isAclUnsafe(ex.name)
                return (
                  <div key={ex.id} style={{ background: '#0F0F0E', borderRadius: 12, overflow: 'hidden', border: '1px solid #2A2A28', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: 120, background: '#111' }}>
                      {imgErrors[ex.id] ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#555452', fontSize: 24 }}>🏋️</span>
                        </div>
                      ) : (
                        <img
                          src={ex.gifUrl ? `${ex.gifUrl}?api-key=wx_419d7e78264b999296d35cf96668bd7494ddf9f97b2998c295e17771` : ''}
                          alt={ex.name}
                          onError={() => setImgErrors(p => ({ ...p, [ex.id]: true }))}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      )}
                      {unsafe && (
                        <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(217,119,6,0.9)', borderRadius: 6, padding: '2px 6px', fontSize: 11, color: '#fff' }}>⚠️</div>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ color: '#F0EEE8', fontSize: 13, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3 }}>{ex.name}</p>
                      <p style={{ color: '#888780', fontSize: 11, margin: '0 0 8px', textTransform: 'capitalize', flex: 1 }}>{ex.target}</p>
                      <button
                        onClick={() => onAdd(ex)}
                        disabled={targetDay === 'lower' && unsafe}
                        style={{ padding: '8px 0', borderRadius: 8, background: (targetDay === 'lower' && unsafe) ? '#2A2A28' : '#0F6E56', color: (targetDay === 'lower' && unsafe) ? '#555452' : '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: (targetDay === 'lower' && unsafe) ? 'not-allowed' : 'pointer', minHeight: 36 }}
                      >
                        {targetDay === 'lower' && unsafe ? '⚠️ ACL risk' : `Add to ${targetDay === 'upper' ? 'Upper' : 'Lower'}`}
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
