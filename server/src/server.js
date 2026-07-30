const http = require('http')
const app = require('./app')
const connectDB = require('./config/db')
const env = require('./config/env')
const { initSocket } = require('./sockets/index')

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB()

    // 2. Create HTTP Server
    const server = http.createServer(app)

    // 3. Initialize Socket.IO
    initSocket(server)

    // 4. Start Server
    server.listen(env.PORT, () => {
      console.log(`BidArena API listening on port ${env.PORT} [${env.NODE_ENV}]`)
    })

    // 5. Handle Graceful Shutdown
    const shutdown = () => {
      console.log('Shutting down server gracefully...')
      server.close(() => {
        console.log('HTTP Server closed.')
        process.exit(0)
      })
    }
    
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

startServer()
