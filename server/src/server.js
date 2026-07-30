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
    const shutdown = async () => {
      console.log('Shutting down server gracefully...')
      
      // 1. Stop all running auction timers
      try {
        const timerManager = require('./auction-engine/TimerManager');
        timerManager.cleanupAll();
      } catch (err) {
        console.error('Failed to cleanup timers:', err.message);
      }

      // 2. Close Socket.IO
      try {
        const sockets = require('./sockets');
        if (sockets.getIO) {
          sockets.getIO().close();
          console.log('Socket.IO closed.');
        }
      } catch (err) {
        console.error('Failed to close Socket.IO:', err.message);
      }

      // 3. Close MongoDB connection
      try {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
      } catch (err) {
        console.error('Failed to close MongoDB:', err.message);
      }

      // 4. Close HTTP server
      server.close(() => {
        console.log('HTTP Server closed.')
        // 5. Exit process
        process.exit(0)
      })
    }
    
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    // Handle Nodemon restart
    process.once('SIGUSR2', () => {
      console.log('Nodemon restart detected. Shutting down server gracefully...')
      server.close(() => {
        console.log('HTTP Server closed for nodemon restart.')
        process.kill(process.pid, 'SIGUSR2')
      })
    })
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

startServer()
