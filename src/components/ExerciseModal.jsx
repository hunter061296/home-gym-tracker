import { useState, useEffect } from 'react'
import { EXERCISE_SVGS } from './ExerciseSVGs'
import { getGifUrl, getYuhonaImages } from '../data/exerciseImages'

export default function ExerciseModal({ exercise, onClose }) {
  const [showHowTo, setShowHowTo] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const instructions = exercise.instructions || []
  const gifUrl = getGifUrl(exercise)
  const yuhonaImgs = !gifUrl ? getYuhonaImages(exercise) : null
  const SVGIcon = (!gifUrl && !yuhonaImgs && exercise.svgKey) ? EXERCISE_SVGS[exercise.svgKey] : null
  const target = exercise.target || ''
  const secondary = exercise.secondaryMuscles || []

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, background: '#1C1C1A', borderRadius: '20px 20px 0 0', maxHeight: '92dvh', overflowY: 'auto', animation: 'slideUp 250ms ease-out' }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#2A2A28' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 16px 12px' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
            <h2 style={{ color: '#F0EEE8', fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{exercise.name}</h2>
            <p style={{ color: '#0F6E56', fontSize: 14, fontWeight: 600, margin: 0 }}>{exercise.sets} sets × {exercise.reps}</p>
            {target && (
              <p style={{ color: '#888780', fontSize: 12, margin: '2px 0 0', textTransform: 'capitalize' }}>
                {target}{secondary.length > 0 ? ` · ${secondary.slice(0, 2).join(', ')}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#2A2A28', border: 'none', color: '#888780', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* GIF / animated JPGs / SVG */}
        <div style={{ height: 220, background: '#111', overflow: 'hidden', position: 'relative' }}>
          {gifUrl ? (
            <GifImage src={gifUrl} name={exercise.name} />
          ) : yuhonaImgs ? (
            <AnimatedJpg urls={yuhonaImgs} name={exercise.name} />
          ) : SVGIcon ? (
            <div style={{ height: '100%', padding: 8 }}><SVGIcon /></div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>🏋️</span>
            </div>
          )}
        </div>

        {/* YouTube link */}
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' exercise form')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', color: '#888780', fontSize: 12, textDecoration: 'none', borderBottom: '1px solid #2A2A28' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#DC2626"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/><polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/></svg>
          Watch on YouTube
        </a>

        {/* Tip */}
        <div style={{ margin: '14px 16px 10px', padding: '10px 12px', borderRadius: 8, background: 'rgba(15,110,86,0.12)', borderLeft: '3px solid #0F6E56' }}>
          <p style={{ color: '#F0EEE8', fontSize: 13, margin: 0 }}>{exercise.tip}</p>
          {exercise.notes && <p style={{ color: '#888780', fontSize: 12, margin: '4px 0 0' }}>Note: {exercise.notes}</p>}
        </div>

        {/* How-to */}
        <div style={{ padding: '4px 16px 32px' }}>
          {instructions.length > 0 ? (
            <>
              <button
                onClick={() => setShowHowTo(!showHowTo)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F6E56', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', minHeight: 44 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                How To
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showHowTo ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}><polyline points="6,9 12,15 18,9"/></svg>
              </button>
              {showHowTo && (
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {instructions.map((step, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10 }}>
                      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                      <p style={{ color: '#888780', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </>
          ) : (
            <p style={{ color: '#555452', fontSize: 13, paddingTop: 8 }}>No instructions available.</p>
          )}
        </div>
      </div>
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
          <span style={{ fontSize: 40 }}>🏋️</span>
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
