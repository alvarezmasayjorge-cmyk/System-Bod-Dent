const serverless = require('serverless-http')

let handler
exports.handler = async (event, context) => {
  if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
    return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Falta configurar el servidor.' }) }
  }
  handler ||= serverless(require('../../src/app'))
  const prefix = '/.netlify/functions/api'
  const path = event.path?.startsWith(prefix + '/') ? event.path.slice(prefix.length) : event.path
  return handler({ ...event, path }, context)
}
