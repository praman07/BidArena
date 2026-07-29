const app = require('./app')
const connectDB = require('./config/db')
const env = require('./config/env')

// TODO: Connect database and start HTTP server
const startServer = async () => {
  // await connectDB()
  // const PORT = env.PORT || 5000
  // app.listen(PORT, () => {})
}

startServer()

module.exports = { app, startServer }
