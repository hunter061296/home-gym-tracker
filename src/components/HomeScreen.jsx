import { useState } from 'react'
import { SCHEDULE, DAY_NAMES } from '../data/defaultProgram'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const REST_TIPS = [
  'Go for a 20–30 min walk — active recovery beats total rest.',
  'Run through a mobility routine: hip circles, thoracic rotations, ankle work.',
  'Contrast shower: 2 min hot → 30 sec cold × 3 rounds.',
  'Foam roll quads, hamstrings, glutes for 10 minutes.',
  'Hit your protein target today — recovery happens at the table.',
]

const TYPE_CONFIG = {
  upper: { label: 'Upper Day', color: '#185FA5', bg: 'rgba(24,95,165,0.12)', border: 'rgba(24,95,165,0.35)', text: '#60a5fa' },
  lower: { label: 'Lower Day', color: '#0F6E56', bg: 'rgba(15,110,86,0.12)', border: 'rgba(15,110,86,0.35)', text: '#34d399' },
  rest:  { label: 'Rest Day',  color: '#888780', bg: 'rgba(136,135,128,0.08)', border: 'rgba(136,135,128,0.2)', text: '#888780' },
}

export default function HomeScreen({ onStartWorkout, onLogWorkout, history, program }) {
  const [confirmLog, setConfirmLog] = useState(null) // 'upper' | 'lower' | null
  const now = new Date()
  const dow = now.getDay()
  const type = SCHEDULE[dow]
  const cfg = TYPE_CONFIG[type]
  const exercises = type !== 'rest' ? program[type] : []
  const totalSets = exercises.reduce((a, e) => a + e.sets, 0)
  const streak = calcStreak(history)
  const lastW = history[0]
  const restTip = REST_TIPS[dow % REST_TIPS.length]

  const handleLog = (t) => {
    onLogWorkout(t)
    setConfirmLog(null)
  }

  return (
    <div style={{ padding: '24px 16px 16px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#888780', fontSize: 14, marginBottom: 2 }}>
          {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{greeting()}</h1>
        <p style={{ color: '#555452', fontSize: 13 }}>15kg dumbbells · bench · bands · ACL-safe</p>
      </div>

      {/* Today's card */}
      <div style={{ borderRadius: 14, border: `1px solid ${cfg.border}`, background: cfg.bg, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Today</p>
            <h2 style={{ color: cfg.text, fontSize: 22, fontWeight: 700 }}>{cfg.label}</h2>
          </div>
          {type !== 'rest' && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#888780', fontSize: 11, marginBottom: 2 }}>Exercises</p>
              <p style={{ color: '#F0EEE8', fontSize: 22, fontWeight: 700 }}>{exercises.length}</p>
            </div>
          )}
        </div>

        {type !== 'rest' ? (
          <>
            <p style={{ color: '#888780', fontSize: 13, marginBottom: 16 }}>
              {exercises.length} exercises · {totalSets} total sets
            </p>
            <button
              onClick={() => onStartWorkout(type)}
              style={{ width: '100%', padding: '16px 0', borderRadius: 12, background: cfg.color, color: '#fff', fontSize: 17, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 44, marginBottom: 10 }}
            >
              Start Workout
            </button>
            {confirmLog === type ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmLog(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: '#2A2A28', color: '#888780', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLog(type)}
                  style={{ flex: 2, padding: '10px 0', borderRadius: 10, background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
                >
                  Yes, log as done
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmLog(type)}
                style={{ width: '100%', padding: '10px 0', borderRadius: 10, background: 'transparent', color: '#555452', fontSize: 13, border: '1px solid #2A2A28', cursor: 'pointer', minHeight: 36 }}
              >
                Already did it? Log as done
              </button>
            )}
          </>
        ) : (
          <>
            <p style={{ color: '#888780', fontSize: 14, marginBottom: 8 }}>Recovery day.</p>
            <p style={{ color: '#888780', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>💡 {restTip}</p>
            {confirmLog ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmLog(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: '#2A2A28', color: '#888780', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLog(confirmLog)}
                  style={{ flex: 2, padding: '10px 0', borderRadius: 10, background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
                >
                  Log {confirmLog === 'upper' ? 'Upper' : 'Lower'} Day
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmLog('upper')}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: 'rgba(24,95,165,0.15)', color: '#60a5fa', fontSize: 13, fontWeight: 600, border: '1px solid rgba(24,95,165,0.35)', cursor: 'pointer', minHeight: 36 }}
                >
                  Log Upper Day
                </button>
                <button
                  onClick={() => setConfirmLog('lower')}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: 'rgba(15,110,86,0.15)', color: '#34d399', fontSize: 13, fontWeight: 600, border: '1px solid rgba(15,110,86,0.35)', cursor: 'pointer', minHeight: 36 }}
                >
                  Log Lower Day
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Weekly strip */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>This Week</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 0].map(d => {
            const t = SCHEDULE[d]
            const isToday = d === dow
            const dot = t === 'upper' ? '#185FA5' : t === 'lower' ? '#0F6E56' : '#2A2A28'
            return (
              <div
                key={d}
                style={{
                  flex: 1, borderRadius: 10, padding: '8px 0',
                  background: isToday ? '#2A2A28' : '#1C1C1A',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  border: isToday ? '1px solid #3a3a38' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 500, color: isToday ? '#F0EEE8' : '#888780' }}>
                  {DAY_NAMES[d]}
                </span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
                {isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#F0EEE8' }} />}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <Dot color="#185FA5" label="Upper" />
          <Dot color="#0F6E56" label="Lower" />
          <Dot color="#2A2A28" label="Rest" />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatCard label="Streak" value={`${streak}w`} sub="consecutive weeks" />
        <StatCard
          label="Last Workout"
          value={lastW ? fmtDate(lastW.date) : '—'}
          sub={lastW ? cap(lastW.type) + ' Day' : 'none yet'}
        />
      </div>

      {/* Today's exercise list preview */}
      {type !== 'rest' && (
        <div>
          <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Today's Exercises
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {exercises.map((ex, i) => (
              <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#1C1C1A', borderRadius: 10, padding: '10px 14px', border: '1px solid #2A2A28' }}>
                <span style={{ color: '#555452', fontSize: 13, width: 18 }}>{i + 1}</span>
                <p style={{ flex: 1, color: '#F0EEE8', fontSize: 14, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
                <span style={{ color: '#888780', fontSize: 12, flexShrink: 0 }}>{ex.sets}×{ex.reps}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Dot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: '#555452', fontSize: 12 }}>{label}</span>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: '#1C1C1A', borderRadius: 12, padding: 16, border: '1px solid #2A2A28' }}>
      <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{value}</p>
      <p style={{ color: '#555452', fontSize: 12 }}>{sub}</p>
    </div>
  )
}

function calcStreak(history) {
  if (!history.length) return 0
  // Count consecutive weeks with 4+ workouts
  const byWeek = {}
  history.forEach(h => {
    const d = new Date(h.date + 'T12:00:00')
    const week = getWeekKey(d)
    byWeek[week] = (byWeek[week] || 0) + 1
  })
  let streak = 0
  const now = new Date()
  for (let w = 0; w < 52; w++) {
    const d = new Date(now)
    d.setDate(d.getDate() - w * 7)
    const key = getWeekKey(d)
    if ((byWeek[key] || 0) >= 4) streak++
    else if (w > 0) break
  }
  return streak
}

function getWeekKey(d) {
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const diff = Math.round((new Date() - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : '' }
