const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const pacientesRouter = require('./routes/pacientes')
const { iniciarRecordatorios } = require('./recordatorios')
const citasRouter = require('./routes/citas')
const authRouter = require('./routes/auth')
const usuariosRouter = require('./routes/usuarios')

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

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

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🦷 Dental System API funcionando!',
    version: '1.0.0'
  })
})

// Seed automático si no hay usuarios
async function seedSiEsNecesario() {
  const prisma = require('./prisma')
  const bcrypt = require('bcryptjs')
  try {
    const count = await prisma.usuario.count()
    if (count > 0) {
      console.log(`ℹ️  Ya existen ${count} usuario(s), seed omitido`)
      return
    }
    console.log('🌱 Creando usuarios iniciales...')
    const adminPass = await bcrypt.hash('dental2026', 10)
    const admin = await prisma.usuario.create({
      data: { nombre: 'Dra. Mariela Yepez', email: 'dra.mariela@gmail.com', password: adminPass, rol: 'admin' }
    })
    console.log('✅ Admin creado:', admin.email)
    const doctorPass = await bcrypt.hash('doctor123', 10)
    const doctores = [
      { nombre: 'Dr. Carlos Mendoza',  email: 'carlos.mendoza@dental.com'  },
      { nombre: 'Dra. Ana Rodríguez',  email: 'ana.rodriguez@dental.com'   },
      { nombre: 'Dr. Luis Vargas',     email: 'luis.vargas@dental.com'     },
      { nombre: 'Dra. María Torres',   email: 'maria.torres@dental.com'    },
      { nombre: 'Dr. Pedro Gutiérrez', email: 'pedro.gutierrez@dental.com' },
    ]
    for (const doc of doctores) {
      await prisma.usuario.create({ data: { ...doc, password: doctorPass, rol: 'doctor' } })
      console.log('✅ Doctor creado:', doc.email)
    }
    await prisma.paciente.updateMany({ where: { doctorId: null }, data: { doctorId: admin.id } })
    await prisma.cita.updateMany({ where: { doctorId: null }, data: { doctorId: admin.id } })
    console.log('🎉 Seed completado')
  } catch (e) {
    console.error('❌ Error en seed:', e.message)
  }
}

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  await seedSiEsNecesario()
  iniciarRecordatorios()
})