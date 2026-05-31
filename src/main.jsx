import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, background: '#0F0F0E', minHeight: '100dvh', fontFamily: 'system-ui, sans-serif' }}>
          <p style={{ color: '#f87171', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Something went wrong</p>
          <p style={{ color: '#888780', fontSize: 13, marginBottom: 20 }}>{this.state.error?.message}</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload() }}
            style={{ padding: '12px 20px', borderRadius: 10, background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Clear data and reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
