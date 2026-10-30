import axios from 'axios'

// La URL configurada tiene prioridad también en producción (Netlify u otro servidor).
const configuredUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
const api = axios.create({
  baseURL: import.meta.env.PROD ? (configuredUrl || '/') : (configuredUrl || 'http://localhost:3000'),
  timeout: 15000,
})

// Agrega el token JWT a cada request automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
