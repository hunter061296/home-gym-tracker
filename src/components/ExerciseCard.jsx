import { useState } from 'react'
import { EXERCISE_SVGS } from './ExerciseSVGs'
import { getExerciseImages } from '../data/exerciseImages'

const ACL_FLAG_WORDS = ['squat', 'lunge', 'jump', 'lateral', 'split']

export default function ExerciseCard({ exercise, state, onUpdateState, apiData, dayType, isPulsing, onSetComplete }) {
  const [showHowTo, setShowHowTo] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const allDone = state.completedSets.length > 0 && state.completedSets.every(Boolean)
  const doneSets = state.completedSets.filter(Boolean).length
  const nextSetIdx = state.completedSets.findIndex(d => !d)

  const instructions = apiData?.instructions?.length > 0
    ? apiData.instructions
    : exercise.instructions || []

  const photos = getExerciseImages(exercise.id)
  const SVGIcon = (!photos && exercise.svgKey) ? EXERCISE_SVGS[exercise.svgKey] : null

  const isAclUnsafe = dayType === 'lower' &&
    ACL_FLAG_WORDS.some(w => exercise.name.toLowerCase().includes(w))

  const toggleSet = (i) => {
    const wasUnchecked = !state.completedSets[i]
    const next = [...state.completedSets]
    next[i] = !next[i]
    onUpdateState({ ...state, completedSets: next })
    if (wasUnchecked && onSetComplete) onSetComplete(i)
  }

  // Completed + collapsed → compact row
  if (allDone && collapsed) {
    return (
      <div style={{ background: '#1C1C1A', border: '1px solid #22C55E', borderRadius: 12, padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={12} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#F0EEE8', fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exercise.name}</p>
          {state.weight && <p style={{ color: '#888780', fontSize: 12, margin: 0 }}>{state.weight}</p>}
        </div>
        <span style={{ color: '#22C55E', fontSize: 12, flexShrink: 0 }}>{doneSets}/{exercise.sets}</span>
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
          </div>
          <p style={{ color: '#0F6E56', fontSize: 14, fontWeight: 600, margin: 0 }}>{exercise.sets} sets × {exercise.reps}</p>
          {apiData?.target && (
            <p style={{ color: '#888780', fontSize: 12, margin: '2px 0 0', textTransform: 'capitalize' }}>
              {apiData.target}{apiData.secondaryMuscles?.length > 0 ? ` · ${apiData.secondaryMuscles.slice(0, 2).join(', ')}` : ''}
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

      {/* Illustration: real photos (animated) > SVG > YouTube link */}
      <div style={{ height: 200, background: '#111', overflow: 'hidden', position: 'relative' }}>
        {photos ? (
          <AnimatedPhotos img0={photos.img0} img1={photos.img1} name={exercise.name} />
        ) : SVGIcon ? (
          <div style={{ height: '100%', padding: 8 }}><SVGIcon /></div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 36 }}>🏋️</span>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' exercise form')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0F6E56', fontSize: 13, textDecoration: 'underline' }}
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>

      {/* Tip */}
      <div style={{ margin: '12px 16px 8px', padding: '10px 12px', borderRadius: 8, background: 'rgba(15,110,86,0.12)', borderLeft: '3px solid #0F6E56' }}>
        <p style={{ color: '#F0EEE8', fontSize: 13, margin: 0 }}>{exercise.tip}</p>
        {exercise.notes && <p style={{ color: '#888780', fontSize: 12, margin: '4px 0 0' }}>Note: {exercise.notes}</p>}
      </div>

      {/* Sets */}
      <div style={{ padding: '10px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ color: '#888780', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1, margin: 0 }}>Sets completed</p>
          <span style={{ color: '#888780', fontSize: 12 }}>{doneSets}/{exercise.sets}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {state.completedSets.map((done, i) => {
            const isNext = isPulsing && i === nextSetIdx
            return (
            <button
              key={i}
              onClick={() => toggleSet(i)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: `2px solid ${done ? '#22C55E' : isNext ? '#0F6E56' : '#2A2A28'}`,
                background: done ? '#22C55E' : '#0F0F0E', color: done ? '#fff' : isNext ? '#0F6E56' : '#888780',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                fontWeight: 700, fontSize: 15, flexShrink: 0,
                animation: isNext ? 'setGlow 1s ease-in-out infinite' : 'none',
                transition: 'transform 100ms, border-color 300ms',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {done ? <Check size={16} /> : <span>{i + 1}</span>}
            </button>
            )
          })}
        </div>
      </div>

      {/* Weight input */}
      <div style={{ padding: '0 16px 12px' }}>
        <input
          type="text"
          value={state.weight}
          onChange={e => onUpdateState({ ...state, weight: e.target.value })}
          placeholder="Weight / notes (e.g. 12.5kg each)"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0F0F0E', border: '1px solid #2A2A28', color: '#F0EEE8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#0F6E56'}
          onBlur={e => e.target.style.borderColor = '#2A2A28'}
        />
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

function AnimatedPhotos({ img0, img1, name }) {
  const [loaded0, setLoaded0] = useState(false)
  const [loaded1, setLoaded1] = useState(false)
  const [err0, setErr0] = useState(false)
  const both = loaded0 && loaded1

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Skeleton shown until both images loaded */}
      {!both && !err0 && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#1C1C1A 25%,#2A2A28 50%,#1C1C1A 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      )}
      {err0 ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 32 }}>🏋️</span>
          <span style={{ color: '#555452', fontSize: 12 }}>{name}</span>
        </div>
      ) : (
        <>
          <img
            src={img0}
            alt={`${name} position 1`}
            onLoad={() => setLoaded0(true)}
            onError={() => setErr0(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: both ? 'exImg0 2s steps(1) infinite' : 'none', opacity: both ? undefined : 0 }}
          />
          <img
            src={img1}
            alt={`${name} position 2`}
            onLoad={() => setLoaded1(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', animation: both ? 'exImg1 2s steps(1) infinite' : 'none', opacity: both ? undefined : 0 }}
          />
        </>
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
