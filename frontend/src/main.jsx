import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initPush } from './services/push'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// initialize push subscriptions when SW is ready
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(() => {
    initPush().catch(() => {})
  })
}
