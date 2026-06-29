import { useState } from 'react'
import { EXERCISE_SVGS } from './ExerciseSVGs'
import { getGifUrl, getYuhonaImages } from '../data/exerciseImages'
import { getSetEntries, formatSetsSummary, fmtSetShort, getIsoWeek } from '../utils/sets'

const ACL_FLAG_WORDS = ['squat', 'lunge', 'jump', 'lateral', 'split']

export default function ExerciseCard({ exercise, state, lastPerformance, plateIncrements = [], onUpdateState, dayType, isPulsing, onSetComplete }) {
  const [showHowTo, setShowHowTo] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeSetIdx, setActiveSetIdx] = useState(null)

  const sets = getSetEntries(state)
  const allDone = sets.length > 0 && sets.every(s => s.done)
  const doneSets = sets.filter(s => s.done).length
  const totalCount = sets.length
  const nextSetIdx = sets.findIndex(s => !s.done)

  const instructions = exercise.instructions || []
  const gifUrl = getGifUrl(exercise)
  const yuhonaImgs = !gifUrl ? getYuhonaImages(exercise) : null
  const SVGIcon = (!gifUrl && !yuhonaImgs && exercise.svgKey) ? EXERCISE_SVGS[exercise.svgKey] : null

  const target = exercise.target || ''
  const secondary = exercise.secondaryMuscles || []

  // Progressive overload detection
  const po = exercise.progressiveOverload
  const isOverloadActive = po?.enabled && po.lastIncreasedWeek === getIsoWeek()
  const overloadLabel = isOverloadActive
    ? (po.type === 'weight' ? `+${po.incrementWeight}kg` : `+${po.incrementReps} reps`)
    : ''

  const isAclUnsafe = dayType === 'lower' &&
    ACL_FLAG_WORDS.some(w => exercise.name.toLowerCase().includes(w))

  const updateSet = (i, patch) => {
    const next = sets.map((s, idx) => idx === i ? { ...s, ...patch } : s)
    onUpdateState({ ...state, sets: next })
  }

  const toggleSetDone = (i) => {
    const s = sets[i]
    const turningOn = !s.done
    const prev = lastPerformance?.sets?.[i]
    const patch = { done: turningOn }
    // Auto-fill from last time so a quick tap logs the same weight/reps.
    if (turningOn) {
      if (!s.weight && prev?.weight) patch.weight = String(prev.weight)
      if (!s.reps && prev?.reps) patch.reps = String(prev.reps)
    }
    updateSet(i, patch)
    if (turningOn && onSetComplete) onSetComplete(i)
  }

  const addSet = () => {
    onUpdateState({ ...state, sets: [...sets, { weight: '', reps: '', done: false }] })
  }

  const removeLastSet = () => {
    if (sets.length <= 1) return
    onUpdateState({ ...state, sets: sets.slice(0, -1) })
  }

  // Quick-pick chip fills the focused set's weight, or the next unfinished set.
  const fillWeight = (value) => {
    const i = (activeSetIdx != null && activeSetIdx < sets.length)
      ? activeSetIdx
      : (nextSetIdx >= 0 ? nextSetIdx : sets.length - 1)
    updateSet(i, { weight: String(value) })
  }

  // Completed + collapsed → compact row
  if (allDone && collapsed) {
    return (
      <div style={{ background: '#1C1C1A', border: '1px solid #22C55E', borderRadius: 12, padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={12} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {exercise.name}
            {isOverloadActive && <span style={{ marginLeft: 6, fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>⚡</span>}
          </p>
          {formatSetsSummary(state) && <p style={{ color: '#888780', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatSetsSummary(state)}</p>}
        </div>
        <span style={{ color: '#22C55E', fontSize: 12, flexShrink: 0 }}>{doneSets}/{totalCount}</span>
        <button onClick={() => setCollapsed(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6,9 12,15 18,9" /></svg>
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: '#1C1C1A',
      border: `1px solid ${allDone ? '#22C55E' : '#2A2A28'}`,
      borderRadius: 12, marginBottom: 16, overflow: 'hidden',
      transition: 'border-color 300ms, box-shadow 300ms',
      boxShadow: isPulsing ? '0 0 0 2px #0F6E56, 0 0 24px rgba(15,110,86,0.35)' : 'none',
      animation: isPulsing ? 'cardPulse 1.5s ease-in-out 2' : 'none',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
            <h3 style={{ color: '#F0EEE8', fontSize: 16, fontWeight: 700, margin: 0 }}>{exercise.name}</h3>
            {dayType === 'lower' && (
              <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: 'rgba(15,110,86,0.25)', color: '#34d399', fontWeight: 600 }}>🦵 Knee-safe</span>
            )}
            {isAclUnsafe && (
              <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: 'rgba(217,119,6,0.25)', color: '#fbbf24', fontWeight: 600 }}>⚠️ Check form</span>
            )}
            {isOverloadActive && (
              <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: 'rgba(217,119,6,0.25)', color: '#fbbf24', fontWeight: 600 }}>
                ⚡ {overloadLabel}
              </span>
            )}
          </div>
          <p style={{ color: '#0F6E56', fontSize: 14, fontWeight: 600, margin: 0 }}>{exercise.sets} sets × {exercise.reps}</p>
          {target && (
            <p style={{ color: '#888780', fontSize: 12, margin: '2px 0 0', textTransform: 'capitalize' }}>
              {target}{secondary.length > 0 ? ` · ${secondary.slice(0, 2).join(', ')}` : ''}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {allDone && (
            <>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} />
              </div>
              <button onClick={() => setCollapsed(true)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18,15 12,9 6,15" /></svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Illustration: local GIF > yuhonas animated JPGs > SVG > placeholder */}
      <div style={{ height: 200, background: '#111', overflow: 'hidden', position: 'relative' }}>
        {gifUrl ? (
          <GifImage src={gifUrl} name={exercise.name} />
        ) : yuhonaImgs ? (
          <AnimatedJpg urls={yuhonaImgs} name={exercise.name} />
        ) : SVGIcon ? (
          <div style={{ height: '100%', padding: 8 }}><SVGIcon /></div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 40 }}>🏋️</span>
          </div>
        )}
      </div>

      {/* YouTube search link — always visible */}
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' exercise form')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', color: '#888780', fontSize: 12, textDecoration: 'none', borderBottom: '1px solid #2A2A28' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#DC2626"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/><polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/></svg>
        Watch on YouTube
      </a>

      {/* Tip */}
      <div style={{ margin: '12px 16px 8px', padding: '10px 12px', borderRadius: 8, background: 'rgba(15,110,86,0.12)', borderLeft: '3px solid #0F6E56' }}>
        <p style={{ color: '#F0EEE8', fontSize: 13, margin: 0 }}>{exercise.tip}</p>
        {exercise.notes && <p style={{ color: '#888780', fontSize: 12, margin: '4px 0 0' }}>Note: {exercise.notes}</p>}
      </div>

      {/* Sets — per-set weight + reps logging */}
      <div style={{ padding: '10px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1, margin: 0 }}>Sets</p>
          <span style={{ color: '#888780', fontSize: 12 }}>{doneSets}/{totalCount}</span>
        </div>

        {/* Column labels */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 4px' }}>
          <span style={{ width: 26, color: '#555452', fontSize: 11, textAlign: 'center' }}>#</span>
          <span style={{ flex: 1, color: '#555452', fontSize: 11 }}>
            {lastPerformance ? `Prev · ${fmtDate(lastPerformance.date)}` : 'Prev'}
          </span>
          <span style={{ width: 68, color: '#555452', fontSize: 11, textAlign: 'center' }}>kg</span>
          <span style={{ width: 56, color: '#555452', fontSize: 11, textAlign: 'center' }}>reps</span>
          <span style={{ width: 40 }} />
        </div>

        {sets.map((s, i) => {
          const prev = lastPerformance?.sets?.[i]
          const isNext = isPulsing && i === nextSetIdx
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 36, borderRadius: 8, background: s.done ? 'rgba(34,197,94,0.12)' : '#0F0F0E', border: `1px solid ${s.done ? '#22C55E' : isNext ? '#0F6E56' : '#2A2A28'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.done ? '#22C55E' : isNext ? '#0F6E56' : '#888780', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <span style={{ flex: 1, color: '#555452', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prev ? fmtSetShort(prev) : '—'}
              </span>
              <input
                inputMode="decimal"
                value={s.weight}
                onChange={e => updateSet(i, { weight: e.target.value })}
                placeholder={prev?.weight != null && prev?.weight !== '' ? String(prev.weight) : '–'}
                style={{ width: 68, padding: '9px 8px', borderRadius: 8, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 14, textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#0F6E56'; setActiveSetIdx(i) }}
                onBlur={e => e.target.style.borderColor = '#2A2A28'}
              />
              <input
                inputMode="numeric"
                value={s.reps}
                onChange={e => updateSet(i, { reps: e.target.value })}
                placeholder={prev?.reps != null && prev?.reps !== '' ? String(prev.reps) : '–'}
                style={{ width: 56, padding: '9px 8px', borderRadius: 8, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 14, textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0F6E56'}
                onBlur={e => e.target.style.borderColor = '#2A2A28'}
              />
              <button
                onClick={() => toggleSetDone(i)}
                aria-label={s.done ? `Set ${i + 1} done` : `Mark set ${i + 1} done`}
                style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${s.done ? '#22C55E' : isNext ? '#0F6E56' : '#2A2A28'}`,
                  background: s.done ? '#22C55E' : '#0F0F0E', color: s.done ? '#fff' : '#888780',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  animation: isNext ? 'setGlow 1s ease-in-out infinite' : 'none',
                  transition: 'transform 100ms, border-color 300ms',
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Check size={15} />
              </button>
            </div>
          )
        })}

        {/* Quick-fill weight chips (customizable in Settings) */}
        {plateIncrements.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', padding: '4px 0 2px' }}>
            <span style={{ color: '#555452', fontSize: 11, flexShrink: 0 }}>kg</span>
            {plateIncrements.map(inc => (
              <button
                key={inc}
                onClick={() => fillWeight(inc)}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 16, border: '1px solid #2A2A28', background: '#0F0F0E', color: '#F0EEE8', fontSize: 13, cursor: 'pointer', minHeight: 32 }}
              >
                {inc}
              </button>
            ))}
          </div>
        )}

        {/* Add / remove set */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={addSet}
            style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: '1px dashed #2A2A28', background: 'transparent', color: '#888780', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 40 }}
          >
            + Add set
          </button>
          {sets.length > 1 && (
            <button
              onClick={removeLastSet}
              aria-label="Remove last set"
              style={{ width: 44, borderRadius: 8, border: '1px solid #2A2A28', background: 'transparent', color: '#888780', fontSize: 18, cursor: 'pointer', minHeight: 40 }}
            >
              −
            </button>
          )}
        </div>
      </div>

      {/* How-to */}
      {instructions.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F6E56', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: 44 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            How To
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showHowTo ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}><polyline points="6,9 12,15 18,9"/></svg>
          </button>
          {showHowTo && (
            <ol style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {instructions.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 10 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  <p style={{ color: '#888780', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{step}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}

function AnimatedJpg({ urls, name }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={urls[0]} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: 'exImg0 1.6s steps(1) infinite' }} />
      {urls[1] && <img src={urls[1]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: 'exImg1 1.6s steps(1) infinite' }} />}
    </div>
  )
}

function GifImage({ src, name }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!loaded && !error && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#1C1C1A 25%,#2A2A28 50%,#1C1C1A 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      )}
      {error ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 32 }}>🏋️</span>
          <span style={{ color: '#555452', fontSize: 12 }}>{name}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: loaded ? 1 : 0, transition: 'opacity 300ms' }}
        />
      )}
    </div>
  )
}

function Check({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

function fmtDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d)) return ''
  const diff = Math.round((new Date() - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
