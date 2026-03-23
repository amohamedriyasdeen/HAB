import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.jsx'
import { themeConfig } from './config/themeConfig'

const favicon = document.querySelector('link[rel="icon"]');
if (favicon) favicon.href = themeConfig.auth.favicon;

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const isDev = import.meta.env.DEV;
    return (
      <div style={{ padding: 32, fontFamily: 'monospace' }}>
        <h2 style={{ color: '#d32f2f' }}>Something went wrong</h2>
        {isDev && (
          <>
            <pre style={{ background: '#fff3f3', padding: 16, borderRadius: 6, color: '#b71c1c', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error.message}
            </pre>
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error.stack}
            </pre>
          </>
        )}
        <button onClick={() => this.setState({ error: null })} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)
