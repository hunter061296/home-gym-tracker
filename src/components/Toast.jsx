export function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: t.type === 'danger' ? '#DC2626' : t.type === 'warning' ? '#D97706' : '#1C1C1A',
            border: `1px solid ${t.type === 'danger' ? '#DC2626' : t.type === 'warning' ? '#D97706' : '#2A2A28'}`,
            color: '#F0EEE8',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            animation: 'slideDown 0.2s ease-out',
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
