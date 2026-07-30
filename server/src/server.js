const http = require('http')
const app = require('./app')
const connectDB = require('./config/db')
const env = require('./config/env')
const { initSocket } = require('./sockets')

const server = http.createServer(app)

// Initialize Socket.IO engine
initSocket(server)

const startServer = async () => {
  try {
    // Database connection can be enabled here when DB setup is ready
    // await connectDB()

    const PORT = env.PORT || 5000
    server.listen(PORT, () => {
      console.log(`[Server] Running in ${env.NODE_ENV} mode on port ${PORT}`)
      console.log(`[Socket] Socket.IO engine ready on port ${PORT}`)
    })
  } catch (error) {
    console.error('[Server] Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

module.exports = { app, server, startServer }

