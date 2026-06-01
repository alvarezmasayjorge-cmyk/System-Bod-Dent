const { PrismaClient } = require('@prisma/client')

const connectionString = process.env.DATABASE_URL
let prisma;

if (connectionString && connectionString.startsWith('postgres')) {
  const { PrismaPg } = require('@prisma/adapter-pg')

  const adapter = new PrismaPg({ connectionString })
  prisma = new PrismaClient({ adapter })
} else {
  // Ocultamos el require de NCC (Vercel) para evitar fallos de dependencias nativas
  const evalRequire = eval('require')
  const { PrismaBetterSqlite3 } = evalRequire('@prisma/adapter-better-sqlite3')
  
  const adapter = new PrismaBetterSqlite3({ url: connectionString || 'file:./dev.db' })
  prisma = new PrismaClient({ adapter })
}

module.exports = prisma