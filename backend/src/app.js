const express = require('express')
const cors = require('cors')
// En Netlify las variables se inyectan en Functions.
if (!process.env.NETLIFY) require('dotenv').config()
const pacientesRouter = require('./routes/pacientes')
const citasRouter = require('./routes/citas')
const authRouter = require('./routes/auth')
const usuariosRouter = require('./routes/usuarios')


const app = express()

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true,
}))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))

// Rutas
app.use('/api/pacientes', pacientesRouter)
app.use('/api/citas', citasRouter)
app.use('/api/auth', authRouter)
app.use('/api/usuarios', usuariosRouter)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🦷 Dental System API funcionando!',
    version: '1.0.0'
  })
})


module.exports = app
