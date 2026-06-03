import { useState } from 'react'
import { exercisesInHistory, exerciseSeries } from '../utils/stats'
import { formatSetsSummary } from '../utils/sets'
import MiniChart from './MiniChart'

export default function ProgressView({ history }) {
  const [openId, setOpenId] = useState(null)
  const exercises = exercisesInHistory(history)

  if (!exercises.length) {
    return (
      <p style={{ color: '#555452', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
        Log a few workouts to see your progress here.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {exercises.map(ex => {
        const series = exerciseSeries(history, ex.id)
        const withWeight = series.filter(p => p.e1rm > 0)
        const best = withWeight.reduce((m, p) => Math.max(m, p.e1rm), 0)
        const bestTop = series.reduce((m, p) => Math.max(m, p.topWeight), 0)
        const isOpen = openId === ex.id
        const sessionCount = series.length

        return (
          <div key={ex.id} style={{ background: '#1C1C1A', borderRadius: 14, overflow: 'hidden', border: '1px solid #2A2A28' }}>
            <button
              onClick={() => setOpenId(isOpen ? null : ex.id)}
              style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', minHeight: 44 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
                <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>
                  {sessionCount} session{sessionCount !== 1 ? 's' : ''}
                  {bestTop > 0 && ` · best ${fmtKg(bestTop)}kg`}
                  {best > 0 && ` · est. 1RM ${fmtKg(best)}kg`}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>

            {isOpen && (
              <div style={{ borderTop: '1px solid #2A2A28', padding: '14px 16px 16px' }}>
                {withWeight.length >= 2 ? (
                  <>
                    <p style={{ color: '#555452', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Estimated 1RM over time</p>
                    <MiniChart values={series.map(p => p.e1rm)} />
                  </>
                ) : (
                  <p style={{ color: '#555452', fontSize: 13, margin: '0 0 12px' }}>
                    Log weight on at least two sessions to see a trend chart.
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {[...series].reverse().slice(0, 12).map(p => (
                    <div key={p.sessionId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#888780', fontSize: 12, width: 64, flexShrink: 0 }}>{fmtDate(p.date)}</span>
                      <span style={{ flex: 1, color: '#F0EEE8', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatSetsSummary(p.summary) || '—'}
                      </span>
                      {p.e1rm > 0 && (
                        <span style={{ color: '#34d399', fontSize: 12, flexShrink: 0 }}>{fmtKg(p.e1rm)}kg</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function fmtKg(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

function fmtDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d)) return ''
  const diff = Math.round((new Date() - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yest.'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
