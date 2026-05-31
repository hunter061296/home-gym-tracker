import { useState } from 'react'

export default function HistoryTab({ history, onClear }) {
  const [expanded, setExpanded] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  if (!history.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <h2 style={{ color: '#F0EEE8', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>No workouts yet</h2>
        <p style={{ color: '#888780', fontSize: 14 }}>Complete your first workout to see it here.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 2 }}>History</h1>
          <p style={{ color: '#888780', fontSize: 14, margin: 0 }}>{history.length} workout{history.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button
          onClick={() => setConfirmClear(true)}
          style={{ color: '#DC2626', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', minHeight: 44 }}
        >
          Clear all
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map(session => {
          const totalSets = session.exerciseStates.reduce((s, e) => s + e.completedSets.filter(Boolean).length, 0)
          const completedExs = session.exerciseStates.filter(s => s.completedSets.every(Boolean)).length
          const exerciseCount = session.exerciseStates.length
          const isOpen = expanded === session.id
          const isUpper = session.type === 'upper'

          return (
            <div key={session.id} style={{ background: '#1C1C1A', borderRadius: 14, overflow: 'hidden', border: '1px solid #2A2A28' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : session.id)}
                style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', minHeight: 44 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isUpper ? '#1a3d6b' : '#0d4030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                  {isUpper ? 'U' : 'L'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: 0 }}>
                      {isUpper ? 'Upper Day' : 'Lower Day'}
                    </p>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isUpper ? '#1e3a5f' : '#0d3d2a', color: isUpper ? '#60a5fa' : '#34d399' }}>
                      {completedExs === exerciseCount ? 'Full' : `${completedExs}/${exerciseCount}`}
                    </span>
                  </div>
                  <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>
                    {fmtDate(session.date)} · {session.duration}min · {totalSets} sets
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>

              {isOpen && (
                <div style={{ borderTop: '1px solid #2A2A28', padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {session.exerciseStates.map((s, i) => {
                    const done = s.completedSets.filter(Boolean).length
                    const total = s.completedSets.length
                    return (
                      <div key={s.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done === total ? '#22C55E' : '#2A2A28', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {done === total ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                          ) : (
                            <span style={{ color: '#888780', fontSize: 10 }}>{done}</span>
                          )}
                        </div>
                        <p style={{ flex: 1, color: '#888780', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name || `Exercise ${i + 1}`}
                        </p>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{done}/{total}</p>
                          {s.weight && <p style={{ color: '#555452', fontSize: 11, margin: 0, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.weight}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm clear */}
      {confirmClear && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 24px' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
            <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Clear history?</h3>
            <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>This can't be undone. All {history.length} workouts will be deleted.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmClear(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>
                Cancel
              </button>
              <button onClick={() => { onClear(); setConfirmClear(false) }} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const diff = Math.round((new Date() - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
