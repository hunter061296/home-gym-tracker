import { useState, useEffect, useRef, useMemo } from 'react'
import ExerciseCard from './ExerciseCard'
import RestTimer from './RestTimer'
import { loadTimerSettings } from '../services/storage'
import { getDefaultRestTime } from '../data/timerCategories'
import { initAudioContext, playBeep } from '../services/timerAudio'
import { isExerciseComplete, getLastPerformance } from '../utils/sets'

export default function WorkoutSession({ session, program, history, onUpdate, onComplete, onExit }) {
  const [confirmExit, setConfirmExit] = useState(false)
  const [timerState, setTimerState] = useState(null)
  const [, setRenderTick] = useState(0)
  const [pulseExId, setPulseExId] = useState(null)
  const timerRef = useRef(null)
  const settingsRef = useRef(loadTimerSettings())

  const exercises = program.routines[session.routineId]?.exercises || program.routines[Object.keys(program.routines)[0]]?.exercises || []
  const completedCount = session.exerciseStates.filter(isExerciseComplete).length
  const allDone = completedCount === exercises.length
  const progress = completedCount / exercises.length

  // Most recent logged performance per exercise — for the "last time" reference.
  const lastByExercise = useMemo(() => {
    const m = {}
    for (const ex of exercises) m[ex.id] = getLastPerformance(history, ex.id)
    return m
  }, [history, exercises])
  const typeLabel = session.routineName || (session.type === 'upper' ? 'Upper Day' : 'Lower Day')
  const typeColor = session.type === 'upper' ? '#185FA5' : '#0F6E56'

  // Keep timerRef in sync with state (needed for the stable interval)
  useEffect(() => { timerRef.current = timerState }, [timerState])

  // Request notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Intercept Android hardware back button — show exit dialog instead of quitting
  useEffect(() => {
    history.pushState({ workoutActive: true }, '')

    const handlePop = () => {
      setConfirmExit(prev => {
        if (prev) {
          // Dialog already open — back button closes it; re-push so next back still works
          history.pushState({ workoutActive: true }, '')
          return false
        }
        // Open dialog and push so another back press can dismiss it
        history.pushState({ workoutActive: true }, '')
        return true
      })
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Stable countdown interval — runs for the lifetime of this component
  useEffect(() => {
    const id = setInterval(() => {
      const t = timerRef.current
      if (!t || t.finished) return

      const remaining = t.duration - (Date.now() - t.startTime) / 1000

      if (remaining <= 0) {
        const settings = settingsRef.current
        if (settings.audioBeep) playBeep()
        if (settings.vibration) navigator.vibrate?.([200, 100, 200])
        fireNotification(t)

        setTimerState(s => s ? { ...s, finished: true, sheetOpen: true } : null)

        const exId = t.exerciseId
        setTimeout(() => {
          setTimerState(null)
          setPulseExId(exId)
          setTimeout(() => setPulseExId(null), 3000)
        }, 1500)
      } else {
        setRenderTick(n => n + 1)
      }
    }, 250)
    return () => clearInterval(id)
  }, []) // mount only — reads live values via refs

  const handleSetComplete = (exIdx, setIdx) => {
    // Init audio context on first user gesture inside workout
    initAudioContext()

    const settings = settingsRef.current
    if (!settings.autoStart) return

    const exercise = exercises[exIdx]
    const setNumber = setIdx + 1 // 1-indexed for display
    const isLastSet = setNumber === exercise.sets
    const isLastExercise = exIdx === exercises.length - 1
    if (isLastSet && isLastExercise) return // don't timer after final set of final exercise

    const restDuration = exercise.restSeconds || getDefaultRestTime(exercise.name, settings.restTimes)

    setTimerState({
      startTime: Date.now(),
      duration: restDuration,
      exerciseName: exercise.name,
      exerciseId: exercise.id,
      setNumber,
      totalSets: exercise.sets,
      sheetOpen: true,
      finished: false,
    })
  }

  const adjustTimer = (delta) => {
    setTimerState(s => {
      if (!s) return null
      const elapsed = (Date.now() - s.startTime) / 1000
      const remaining = s.duration - elapsed
      const newRemaining = Math.max(5, remaining + delta)
      // Shift startTime so the new remaining is correct
      return { ...s, startTime: Date.now() - (s.duration - newRemaining) * 1000 }
    })
  }

  const presetTimer = (seconds) => {
    setTimerState(s => s ? { ...s, startTime: Date.now(), duration: seconds } : null)
  }

  const skipTimer = () => setTimerState(null)
  const toggleSheet = (open) => setTimerState(s => s ? { ...s, sheetOpen: open } : null)

  const updateState = (id, newState) => {
    onUpdate({
      ...session,
      exerciseStates: session.exerciseStates.map(s => s.id === id ? newState : s),
    })
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0F0F0E' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: '#0F0F0E', borderBottom: timerState?.sheetOpen ? 'none' : '1px solid #2A2A28' }}>
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button
              onClick={() => setConfirmExit(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', fontSize: 14, minHeight: 44 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
              Exit
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#F0EEE8', fontSize: 16, fontWeight: 700, margin: 0 }}>{typeLabel}</h2>
              <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{session.date}</p>
            </div>
            <div style={{ background: typeColor, color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
              {completedCount}/{exercises.length}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 5, background: '#2A2A28', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 5, background: progress === 1 ? '#22C55E' : typeColor, width: `${progress * 100}%`, transition: 'width 500ms ease-out' }} />
          </div>
        </div>

        {/* Mini timer bar — lives below progress bar */}
        {timerState && !timerState.sheetOpen && (
          <RestTimer
            timerState={timerState}
            onSkip={skipTimer}
            onAdjust={adjustTimer}
            onPreset={presetTimer}
            onToggleSheet={toggleSheet}
          />
        )}
      </div>

      {/* Exercise cards */}
      <div style={{ padding: '16px 16px 32px', maxWidth: 480, margin: '0 auto' }}>
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            state={session.exerciseStates[i]}
            lastPerformance={lastByExercise[exercise.id]}
            onUpdateState={s => updateState(exercise.id, s)}
            dayType={session.type}
            isPulsing={pulseExId === exercise.id}
            onSetComplete={(setIdx) => handleSetComplete(i, setIdx)}
          />
        ))}

        {allDone ? (
          <button
            onClick={() => onComplete(session)}
            style={{ width: '100%', padding: '18px 0', borderRadius: 14, background: '#22C55E', color: '#fff', fontSize: 18, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 32 }}
          >
            🎉 Complete Workout
          </button>
        ) : (
          <p style={{ textAlign: 'center', color: '#555452', fontSize: 14, paddingBottom: 32 }}>
            {exercises.length - completedCount} exercise{exercises.length - completedCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      {/* Rest timer full sheet */}
      {timerState?.sheetOpen && (
        <RestTimer
          timerState={timerState}
          onSkip={skipTimer}
          onAdjust={adjustTimer}
          onPreset={presetTimer}
          onToggleSheet={toggleSheet}
        />
      )}

      {/* Exit confirm */}
      {confirmExit && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '0 24px' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#1C1C1A', borderRadius: 16, padding: 24, border: '1px solid #2A2A28' }}>
            <h3 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Exit workout?</h3>
            <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>Your progress won't be saved.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmExit(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#2A2A28', color: '#F0EEE8', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Keep Going</button>
              <button onClick={onExit} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44 }}>Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function fireNotification(t) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const payload = {
    body: `${t.exerciseName} — time for set ${t.setNumber + 1}`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    silent: false,
    vibrate: [200, 100, 200],
    tag: 'rest-timer',
    renotify: true,
  }
  // Service-worker path — survives screen lock on Android
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification('Rest complete 💪', payload))
      .catch(() => new Notification('Rest complete 💪', payload))
  } else {
    try { new Notification('Rest complete 💪', payload) } catch (_) {}
  }
}
