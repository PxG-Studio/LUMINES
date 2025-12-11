import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './utils/pwa'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  registerServiceWorker('/sw.js', {
    onSuccess: () => console.info('Service worker registered'),
    onUpdate: () => console.info('New content is available; please refresh.'),
  })
}
