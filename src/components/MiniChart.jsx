// Lightweight inline SVG line chart — no charting dependency.
export default function MiniChart({ values, color = '#0F6E56', height = 90 }) {
  const nums = (values || []).filter(v => typeof v === 'number' && !isNaN(v))
  if (nums.length < 2) return null

  const W = 300, H = height, pad = 10
  const max = Math.max(...nums)
  const min = Math.min(...nums)
  const range = max - min || 1
  const n = nums.length
  const x = i => pad + (i * (W - 2 * pad)) / (n - 1)
  const y = v => H - pad - ((v - min) / range) * (H - 2 * pad)
  const line = nums.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${pad},${H - pad} ${line} ${(W - pad)},${H - pad}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 'auto', display: 'block' }}>
      <polygon points={area} fill={color} opacity="0.12" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {nums.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill={color} />
      ))}
    </svg>
  )
}
