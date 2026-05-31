import { useState } from 'react'
import { loadDeloadDate, saveDeloadDate, loadTimerSettings, saveTimerSettings } from '../services/storage'
import { playBeep, initAudioContext } from '../services/timerAudio'

const OVERLOAD_LADDER = [
  { n: 1, title: 'Add reps',        body: 'Hit the top of your rep range (e.g. 12 reps) for all sets before moving up.' },
  { n: 2, title: 'Add weight',      body: 'Increase by 1–2.5kg. Drop back to the bottom of your rep range and build again.' },
  { n: 3, title: 'Add a set',       body: 'Go from 3 to 4 sets, or 4 to 5. More volume = more signal to grow.' },
  { n: 4, title: 'Slow eccentric',  body: 'Add a 3-sec lowering phase. Same weight, dramatically more time under tension.' },
  { n: 5, title: 'Pause reps',      body: 'Hold 2 seconds at the hardest point (bottom of press, top of row). No bouncing.' },
  { n: 6, title: 'Shorter rest',    body: 'Cut rest by 15 sec per week. Forces the same work in less time.' },
  { n: 7, title: 'Increase range',  body: 'Deepening squat depth, fuller stretch on rows. More range = more stimulus.' },
]

const CAT_LABELS = { compound: 'Compound', isolation: 'Isolation', rehab: 'Rehab / Band', core: 'Core' }

export default function SettingsTab({ onResetProgram, history }) {
  const [deloadDate, setDeloadDate] = useState(loadDeloadDate)
  const [confirmReset, setConfirmReset] = useState(false)
  const [timerSettings, setTimerSettings] = useState(loadTimerSettings)
  const [notifStatus, setNotifStatus] = useState('')
  const [countdown, setCountdown] = useState(0)

  const updateTimer = (patch) => {
    setTimerSettings(prev => {
      const next = { ...prev, ...patch }
      saveTimerSettings(next)
      return next
    })
  }

  const updateRestTime = (cat, val) => {
    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed < 10) return
    updateTimer({ restTimes: { ...timerSettings.restTimes, [cat]: parsed } })
  }

  const testBeep = () => {
    initAudioContext()
    playBeep()
  }

  const testNotification = async () => {
    // ── Diagnostics ──────────────────────────────────────────────
    const supported = 'Notification' in window
    const swSupported = 'serviceWorker' in navigator
    const permission = supported ? Notification.permission : 'unsupported'

    if (!supported) {
      setNotifStatus('❌ Notifications API not supported in this browser.')
      return
    }

    // Request permission if not yet decided
    if (permission === 'default') {
      const result = await Notification.requestPermission()
      if (result !== 'granted') {
        setNotifStatus('❌ Permission denied. Open browser site settings and allow notifications.')
        return
      }
    }

    if (Notification.permission === 'denied') {
      setNotifStatus('❌ Blocked in browser. Go to browser → Site Settings → Notifications → Allow.')
      return
    }

    // ── Fire with 5-second delay so you can lock screen ──────────
    setNotifStatus('⏳ Notification in 5 seconds — lock your screen now!')
    setCountdown(5)

    const tick = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) clearInterval(tick)
        return n - 1
      })
    }, 1000)

    await new Promise(r => setTimeout(r, 5000))

    const payload = {
      body: 'Dumbbell Bench Press — time for set 3',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      silent: false,
      tag: 'rest-timer-test',
      requireInteraction: false,
    }

    let method = 'unknown'
    try {
      if (swSupported) {
        const reg = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((_, rej) => setTimeout(() => rej(new Error('SW timeout')), 3000)),
        ])
        await reg.showNotification('Rest complete 💪', payload)
        method = 'service-worker'
      } else {
        new Notification('Rest complete 💪', payload)
        method = 'direct'
      }
      setNotifStatus(`✅ Sent via ${method}. Did it appear on your lock screen?`)
    } catch (err) {
      // SW failed — fall back to direct Notification
      try {
        new Notification('Rest complete 💪', payload)
        setNotifStatus(`⚠️ SW failed (${err.message}), sent via direct Notification instead.`)
      } catch (err2) {
        setNotifStatus(`❌ Both methods failed: ${err2.message}`)
      }
    }
  }

  const weeksSinceDeload = deloadDate
    ? Math.floor((Date.now() - new Date(deloadDate).getTime()) / (7 * 86400000))
    : null

  const deloadWarning = weeksSinceDeload === null || weeksSinceDeload >= 6

  const logDeload = () => {
    const today = new Date().toISOString().split('T')[0]
    saveDeloadDate(today)
    setDeloadDate(today)
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ color: '#F0EEE8', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Settings</h1>

      {/* ACL Mode */}
      <Section title="ACL Mode">
        <div style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>🦵</span>
            <p style={{ color: '#fbbf24', fontSize: 15, fontWeight: 700, margin: 0 }}>ACL Mode — Always On</p>
          </div>
          <p style={{ color: '#888780', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            All lower-day exercises are knee-safe: hip-dominant, zero deep knee flexion under load, zero lateral instability movements.
            When browsing exercises, unsafe movements (squats, lunges, jumps) are flagged automatically.
          </p>
        </div>
      </Section>

      {/* Deload */}
      <Section title="Deload Tracker">
        {deloadWarning && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>
              ⚠️ {weeksSinceDeload === null ? 'No deload logged yet.' : `${weeksSinceDeload} weeks since last deload.`} Consider scheduling one.
            </p>
          </div>
        )}
        <p style={{ color: '#888780', fontSize: 13, marginBottom: 12 }}>
          {deloadDate
            ? `Last deload: ${new Date(deloadDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (${weeksSinceDeload}w ago)`
            : 'No deload logged.'}
        </p>
        <button
          onClick={logDeload}
          style={{ padding: '10px 20px', borderRadius: 10, background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}
        >
          Log Deload Week
        </button>
      </Section>

      {/* Progressive overload ladder */}
      <Section title="Progressive Overload Ladder">
        <p style={{ color: '#888780', fontSize: 13, marginBottom: 12 }}>7 techniques, in order. Work through them before adding weight.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OVERLOAD_LADDER.map(item => (
            <div key={item.n} style={{ display: 'flex', gap: 12 }}>
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{item.n}</span>
              <div>
                <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{item.title}</p>
                <p style={{ color: '#888780', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Nutrition */}
      <Section title="Nutrition Target">
        <div style={{ background: '#1C1C1A', borderRadius: 10, padding: 14, border: '1px solid #2A2A28' }}>
          <p style={{ color: '#F0EEE8', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>140–175g protein daily</p>
          <p style={{ color: '#888780', fontSize: 13, margin: 0 }}>Split across 4 meals (~35–44g each). Priority: chicken, eggs, Greek yogurt, cottage cheese, whey.</p>
        </div>
      </Section>

      {/* Timer settings */}
      <Section title="Rest Timer">
        {/* Auto-start toggle */}
        <Toggle
          label="Auto-start after each set"
          checked={timerSettings.autoStart}
          onChange={v => updateTimer({ autoStart: v })}
        />
        <Toggle
          label="Vibration on timer end"
          checked={timerSettings.vibration}
          onChange={v => updateTimer({ vibration: v })}
        />
        <Toggle
          label="Audio beep on timer end"
          checked={timerSettings.audioBeep}
          onChange={v => updateTimer({ audioBeep: v })}
        />
        <Toggle
          label="Browser notifications"
          checked={typeof window !== 'undefined' && window.Notification?.permission === 'granted'}
          onChange={() => {
            if (window.Notification?.permission !== 'granted') {
              window.Notification?.requestPermission()
            }
          }}
          hint={typeof window !== 'undefined' ? (window.Notification?.permission ?? 'unsupported') : ''}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={testBeep}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#2A2A28', color: '#888780', border: 'none', cursor: 'pointer', fontSize: 13, minHeight: 36 }}
          >
            Test beep 🔔
          </button>
          <button
            onClick={testNotification}
            disabled={countdown > 0}
            style={{ padding: '8px 16px', borderRadius: 8, background: countdown > 0 ? '#0F6E56' : '#2A2A28', color: '#fff', border: 'none', cursor: countdown > 0 ? 'default' : 'pointer', fontSize: 13, minHeight: 36, fontWeight: countdown > 0 ? 700 : 400 }}
          >
            {countdown > 0 ? `Lock screen! ${countdown}s` : 'Test notification 🔔'}
          </button>
        </div>
        {notifStatus && (
          <p style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5, color: notifStatus.startsWith('✅') ? '#34d399' : notifStatus.startsWith('⏳') ? '#fbbf24' : '#f87171' }}>
            {notifStatus}
          </p>
        )}

        {/* Per-category rest times */}
        <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 10px' }}>Default rest times</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(CAT_LABELS).map(([cat, label]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#F0EEE8', fontSize: 14 }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  min={10} max={300}
                  value={timerSettings.restTimes[cat]}
                  onChange={e => updateRestTime(cat, e.target.value)}
                  style={{ width: 60, padding: '6px 10px', borderRadius: 8, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 14, textAlign: 'center', outline: 'none' }}
                />
                <span style={{ color: '#888780', fontSize: 13 }}>sec</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Reset */}
      <Section title="Program">
        <button
          onClick={() => setConfirmReset(true)}
          style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(220,38,38,0.12)', color: '#f87171', fontSize: 14, fontWeight: 600, border: '1px solid rgba(220,38,38,0.3)', cursor: 'pointer', minHeight: 44 }}
        >
          Reset Program to Defaults
        </button>
      </Section>

      {/* Confirm reset */}
      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 24px' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
            <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Reset program?</h3>
            <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>All your exercise customisations will be lost. History is kept.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
              <button onClick={() => { onResetProgram(); setConfirmReset(false) }} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2A2A28' }}>
      <div>
        <span style={{ color: '#F0EEE8', fontSize: 14 }}>{label}</span>
        {hint && <span style={{ color: '#555452', fontSize: 12, marginLeft: 8 }}>{hint}</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: checked ? '#0F6E56' : '#2A2A28',
          position: 'relative', transition: 'background 200ms',
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: checked ? 21 : 3,
          transition: 'left 200ms',
        }} />
      </button>
    </div>
  )
}
