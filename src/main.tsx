import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClipboardProvider } from './context/ClipboardContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClipboardProvider>
      <App />
    </ClipboardProvider>
  </StrictMode>,
)