import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/theme.css'
import { RaidProvider } from './context/Raidcontext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RaidProvider>
        <App />
      </RaidProvider>
    </BrowserRouter>
  </React.StrictMode>
)
