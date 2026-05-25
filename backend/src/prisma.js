const { PrismaClient } = require('@prisma/client')

let prisma

if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://'))) {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const connectionString = process.env.DATABASE_URL
  const adapter = new PrismaPg({ connectionString })
  prisma = new PrismaClient({ adapter })
} else {
  const path = require('path')
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  
  const dbPath = `file:${path.resolve(__dirname, '../dev.db')}`
  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  
  prisma = new PrismaClient({ adapter })
}

module.exports = prisma