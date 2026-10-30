const { test } = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcryptjs')
process.env.NETLIFY = 'true'
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:1/test'
process.env.JWT_SECRET = 'test-only-never-use-in-production'
const prismaPath = require.resolve('../src/prisma')
const user = { id: 1, email: 'test@example.invalid', nombre: 'Prueba', rol: 'admin', password: bcrypt.hashSync('test-password', 4) }
require.cache[prismaPath] = { id: prismaPath, filename: prismaPath, loaded: true, exports: { usuario: { findUnique: async ({ where }) => { assert.equal(where.email, user.email); return user } } } }
const { handler } = require('../netlify/functions/api')
const event = (path, body) => ({ path, httpMethod: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'content-length': String(body ? Buffer.byteLength(JSON.stringify(body)) : 0) }, queryStringParameters: {}, requestContext: {}, body: body ? JSON.stringify(body) : null, isBase64Encoded: false })
test('health works on public and direct function paths without database access', async () => {
 for (const path of ['/api/health', '/.netlify/functions/api/api/health']) {
  const r = await handler(event(path), {})
  assert.equal(r.statusCode, 200)
  assert.deepEqual(JSON.parse(r.body), { ok: true })
 }
})
test('patient data requires authentication', async () => {
 const r = await handler(event('/api/pacientes'), {})
 assert.equal(r.statusCode, 401)
})
test('login accepts valid credentials and rejects invalid ones using a simulated user', async () => {
 const r = await handler(event('/api/auth/login', { email: user.email, password: 'test-password' }), {})
 assert.equal(r.statusCode, 200, r.body)
 assert.ok(JSON.parse(r.body).token)
 assert.equal(JSON.parse(r.body).usuario.email, user.email)
 const wrong = await handler(event('/api/auth/login', { email: user.email, password: 'wrong' }), {})
 assert.equal(wrong.statusCode, 401)
})
test('missing server configuration returns 503 without exposing values', async () => {
 const key = process.env.JWT_SECRET
 delete process.env.JWT_SECRET
 try { assert.equal((await handler(event('/api/health'), {})).statusCode, 503) }
 finally { process.env.JWT_SECRET = key }
})
