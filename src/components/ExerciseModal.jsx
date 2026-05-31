import { EXERCISE_SVGS } from './ExerciseSVGs'
import { useEffect } from 'react'

export default function ExerciseModal({ exercise, onClose }) {
  const SVGIcon = EXERCISE_SVGS[exercise.svgKey]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-800 rounded-t-3xl overflow-y-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-2">
          <div>
            <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#14b8a6' }}>
              {exercise.sets} sets × {exercise.repsRange}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Large SVG */}
        <div className="mx-5 rounded-2xl bg-slate-900 p-2 mb-4" style={{ height: 200 }}>
          {SVGIcon && <SVGIcon />}
        </div>

        {/* How-to steps */}
        <div className="px-5 mb-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">How To</p>
          <ol className="space-y-3">
            {exercise.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: '#0F6E56' }}
                >
                  {i + 1}
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Progression tip */}
        <div className="mx-5 mb-8 rounded-xl p-4 bg-slate-900 border border-slate-700">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#14b8a6' }}>
            Progressive Overload
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{exercise.progressionTip}</p>
        </div>
      </div>
    </div>
  )
}
