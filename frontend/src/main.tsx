import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppSettingsProvider } from './context/AppSettingsProvider'
import { ensureDemoUser } from './lib/auth'
import { ensureDemoSessions } from './lib/interviewHistory'

ensureDemoUser()
ensureDemoSessions()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </StrictMode>,
)
