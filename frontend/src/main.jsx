import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/tour.css'
import './styles/tour-controls.css'
import './styles/era.css'
import './styles/hero-focus.css'
import './styles/scroll-hero.css'
import './styles/hero-match.css'
import './styles/blank-fix.css'
import './styles/circle-fix.css'
import './styles/circle-center.css'
import './styles/location-transition.css'
import './styles/apartment-cta.css'
import './styles/persistent-rail.css'
import './styles/residence-story.css'
import './styles/credentials-3d.css'
import './styles/apartments.css'
import './styles/lifestyle-slides.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #fee2e2', maxWidth: '600px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 10px', color: '#dc2626', fontSize: '18px' }}>Something went wrong loading this view</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>{this.state.error?.message || 'Unknown render exception'}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/admin/login';
                }}
                style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
              >
                Reset Session & Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
