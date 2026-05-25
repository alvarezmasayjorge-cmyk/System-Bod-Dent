import axios from 'axios'

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd ? '/_/backend' : (import.meta.env.VITE_API_URL || 'http://localhost:3000'),
})

// Agrega el token JWT a cada request automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
