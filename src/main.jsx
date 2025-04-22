import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Gunakan baseURL dari .env (pakai VITE_ prefix wajib untuk Vite)
axios.defaults.baseURL = import.meta.env.VITE_API_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
