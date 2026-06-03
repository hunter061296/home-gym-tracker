import { useState, useEffect, useRef } from 'react'
import { loadProgram, saveProgram, loadHistory, saveHistory, resetToDefault, loadAclMode, saveAclMode, loadPlateIncrements, savePlateIncrements } from './services/storage'
import { getLastPerformance } from './utils/sets'
// SCHEDULE removed — schedule now lives in program.schedule
import HomeScreen from './components/HomeScreen'
import WorkoutSession from './components/WorkoutSession'
import CompletionScreen from './components/CompletionScreen'
import HistoryTab from './components/HistoryTab'
import ExerciseEditor from './components/ExerciseEditor'
import SettingsTab from './components/SettingsTab'
import { ToastContainer } from './components/Toast'

export default function App() {
  const [tab, setTab] = useState('home')
  const [view, setView] = useState('tabs') // 'tabs' | 'workout' | 'complete'
  const [session, setSession] = useState(null)
  const [completedSession, setCompletedSession] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const [program, setProgram] = useState(loadProgram)
  const [toasts, setToasts] = useState([])
  const [aclMode, setAclMode] = useState(loadAclMode)
  const [plateIncrements, setPlateIncrements] = useState(loadPlateIncrements)

  const updateAclMode = (v) => { setAclMode(v); saveAclMode(v) }
  const updatePlateIncrements = (v) => { setPlateIncrements(v); savePlateIncrements(v) }

  const pushToast = (msg, type = 'info') => {
    const id = Date.now()
    setToasts(ts => [...ts, { id, msg, type }])
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3000)
  }

  // Double-tap back to exit (tabs view only — workout handles its own back button)
  const backWarnedRef = useRef(false)
  const backTimerRef = useRef(null)
  useEffect(() => {
    if (view !== 'tabs') return
    // Push one state so the first back press fires popstate instead of closing
    window.history.pushState({ gymExit: true }, '')

    const handlePop = () => {
      if (!backWarnedRef.current) {
        // First press — show toast, mark warned; do NOT push again so second press closes
        backWarnedRef.current = true
        pushToast('Press back again to exit')
        // Re-arm after 2s if user doesn't press again
        backTimerRef.current = setTimeout(() => {
          backWarnedRef.current = false
          window.history.pushState({ gymExit: true }, '')
        }, 2000)
      }
      // Second press within 2s: warned is true, we do nothing → browser closes PWA
    }

    window.addEventListener('popstate', handlePop)
    return () => {
      window.removeEventListener('popstate', handlePop)
      clearTimeout(backTimerRef.current)
      backWarnedRef.current = false
    }
  }, [view])

  const updateProgram = (p) => {
    setProgram(p)
    saveProgram(p)
  }

  const startWorkout = (routineId) => {
    const routine = program.routines[routineId]
    if (!routine) return
    const newSession = {
      routineId,
      routineName: routine.name,
      type: routine.type,
      startTime: Date.now(),
      date: new Date().toLocaleDateString('en-CA'),
      exerciseStates: routine.exercises.map(e => ({
        id: e.id,
        name: e.name,
        sets: Array.from({ length: e.sets }, () => ({ weight: '', reps: '', done: false })),
      })),
    }
    setSession(newSession)
    setView('workout')
  }

  const finishWorkout = (sess) => {
    const record = {
      ...sess,
      id: Date.now(),
      completedAt: Date.now(),
      duration: Math.max(1, Math.round((Date.now() - sess.startTime) / 60000)),
    }
    const newHistory = [record, ...history]
    setHistory(newHistory)
    saveHistory(newHistory)
    setCompletedSession(record)
    setView('complete')
  }

  const exitWorkout = () => {
    setView('tabs')
    setSession(null)
  }

  const logWorkout = (routineId) => {
    const routine = program.routines[routineId]
    if (!routine) return
    const now = Date.now()
    const record = {
      id: now,
      routineId,
      routineName: routine.name,
      type: routine.type,
      date: new Date().toLocaleDateString('en-CA'),
      startTime: now - 60 * 60 * 1000,
      completedAt: now,
      duration: 60,
      loggedManually: true,
      exerciseStates: routine.exercises.map(e => {
        const last = getLastPerformance(history, e.id)
        return {
          id: e.id,
          name: e.name,
          sets: Array.from({ length: e.sets }, (_, i) => ({
            weight: last?.sets?.[i]?.weight ?? '',
            reps: last?.sets?.[i]?.reps ?? '',
            done: true,
          })),
        }
      }),
    }
    const next = [record, ...history]
    setHistory(next)
    saveHistory(next)
    pushToast(`${routine.name} logged ✓`)
  }

  const doneComplete = () => {
    setView('tabs')
    setSession(null)
    setCompletedSession(null)
    setTab('home')
  }

  // Full-screen views
  if (view === 'workout' && session) {
    return (
      <>
        <ToastContainer toasts={toasts} />
        <WorkoutSession
          session={session}
          program={program}
          history={history}
          plateIncrements={plateIncrements}
          onUpdate={setSession}
          onComplete={finishWorkout}
          onExit={exitWorkout}
        />
      </>
    )
  }

  if (view === 'complete' && completedSession) {
    return <CompletionScreen session={completedSession} program={program} history={history} onDone={doneComplete} />
  }

  const todayRoutineId = program.schedule[new Date().getDay()]

  return (
    <div style={{ minHeight: '100dvh', background: '#0F0F0E', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <ToastContainer toasts={toasts} />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        {tab === 'home' && <HomeScreen onStartWorkout={startWorkout} onLogWorkout={logWorkout} history={history} program={program} />}
        {tab === 'history' && <HistoryTab history={history} onClear={() => { saveHistory([]); setHistory([]) }} />}
        {tab === 'program' && <ExerciseEditor program={program} onUpdateProgram={updateProgram} onAddToast={pushToast} aclMode={aclMode} />}
        {tab === 'settings' && <SettingsTab onResetProgram={() => { updateProgram(resetToDefault()); pushToast('Program reset to defaults') }} history={history} aclMode={aclMode} onAclModeChange={updateAclMode} plateIncrements={plateIncrements} onPlateIncrementsChange={updatePlateIncrements} onToast={pushToast} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#1C1C1A', borderTop: '1px solid #2A2A28', display: 'flex', zIndex: 50 }}>
        <NavBtn active={tab === 'home'} onClick={() => setTab('home')} label="Home" icon={<HomeIcon />} />
        <NavBtn active={tab === 'history'} onClick={() => setTab('history')} label="History" icon={<HistoryIcon />} />
        <WorkoutNavBtn todayRoutineId={todayRoutineId} onStart={() => startWorkout(todayRoutineId)} active={false} />
        <NavBtn active={tab === 'program'} onClick={() => setTab('program')} label="Program" icon={<ProgramIcon />} />
        <NavBtn active={tab === 'settings'} onClick={() => setTab('settings')} label="Settings" icon={<SettingsIcon />} />
      </nav>
    </div>
  )
}

function NavBtn({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: active ? '#0F6E56' : '#888780', fontSize: 10, fontWeight: 500, minHeight: 64 }}
    >
      {icon}
      {label}
    </button>
  )
}

function WorkoutNavBtn({ todayRoutineId, onStart, active }) {
  const isRestDay = todayRoutineId === 'rest'
  return (
    <button
      onClick={isRestDay ? undefined : onStart}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: isRestDay ? 'default' : 'pointer', minHeight: 64 }}
    >
      <div style={{ width: 42, height: 42, borderRadius: '50%', background: isRestDay ? '#2A2A28' : '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -14 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isRestDay ? '#555452' : '#fff'} strokeWidth="2.5" strokeLinecap="round">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      </div>
      <span style={{ fontSize: 10, fontWeight: 500, color: isRestDay ? '#555452' : '#0F6E56', marginTop: -2 }}>
        {isRestDay ? 'Rest' : 'Workout'}
      </span>
    </button>
  )
}

function HomeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
}
function HistoryIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
}
function ProgramIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
}
function SettingsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
