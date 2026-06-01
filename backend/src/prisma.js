const { PrismaClient } = require('@prisma/client')

const connectionString = process.env.DATABASE_URL
let prisma;

if (connectionString && connectionString.startsWith('postgres')) {
  const { Pool } = require('pg')
  const { PrismaPg } = require('@prisma/adapter-pg')
  
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg({ pool })
  prisma = new PrismaClient({ adapter })
} else {
  // Para SQLite o desarrollo local, usar el adaptador de SQLite
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  
  const adapter = new PrismaBetterSqlite3({ url: connectionString || 'file:./dev.db' })
  prisma = new PrismaClient({ adapter })
}

module.exports = prisma