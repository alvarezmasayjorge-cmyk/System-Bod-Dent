require('dotenv').config()
const bcrypt = require('bcryptjs')
const prisma = require('./prisma')

async function main() {
  console.log('🌱 Iniciando seed...')

  // Admin
  const adminPass = await bcrypt.hash('dental2026', 10)
  const admin = await prisma.usuario.upsert({
    where: { email: 'dra.mariela@gmail.com' },
    update: { password: adminPass },
    create: {
      nombre: 'Dra. Mariela Yepez',
      email: 'dra.mariela@gmail.com',
      password: adminPass,
      rol: 'admin'
    }
  })
  console.log('✅ Admin creado:', admin.email)

  // 5 Doctores
  const doctorPass = await bcrypt.hash('doctor123', 10)
  const doctores = [
    { nombre: 'Dr. Carlos Mendoza',   email: 'carlos.mendoza@dental.com'  },
    { nombre: 'Dra. Ana Rodríguez',   email: 'ana.rodriguez@dental.com'   },
    { nombre: 'Dr. Luis Vargas',      email: 'luis.vargas@dental.com'     },
    { nombre: 'Dra. María Torres',    email: 'maria.torres@dental.com'    },
    { nombre: 'Dr. Pedro Gutiérrez',  email: 'pedro.gutierrez@dental.com' },
  ]

  for (const doc of doctores) {
    const u = await prisma.usuario.upsert({
      where: { email: doc.email },
      update: {},
      create: { ...doc, password: doctorPass, rol: 'doctor' }
    })
    console.log('✅ Doctor creado:', u.email)
  }

  // Asignar pacientes y citas sin doctor al admin
  const p = await prisma.paciente.updateMany({
    where: { doctorId: null },
    data: { doctorId: admin.id }
  })
  const c = await prisma.cita.updateMany({
    where: { doctorId: null },
    data: { doctorId: admin.id }
  })
  console.log(`✅ ${p.count} pacientes y ${c.count} citas asignadas al admin`)
  console.log('🎉 Seed completado')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
