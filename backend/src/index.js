const app = require('./app')
const { iniciarRecordatorios } = require('./recordatorios')
const PORT = process.env.PORT || 3000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
    iniciarRecordatorios()
  })
}

module.exports = app
