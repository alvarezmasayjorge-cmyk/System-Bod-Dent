const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL
if (!connectionString || !/^postgres(ql)?:\/\//.test(connectionString)) {
  throw new Error('Configura DATABASE_URL con la conexión PostgreSQL de Neon.')
}

const adapter = new PrismaPg({ connectionString, max: 2, connectionTimeoutMillis: 10000 })
module.exports = new PrismaClient({ adapter })
