const app = require('./app')
const connectDB = require('./config/db')
const env = require('./config/env')

const startServer = async () => {
  try {
    await connectDB()
    app.listen(env.PORT, () => {
      console.log(`BidArena API listening on port ${env.PORT} [${env.NODE_ENV}]`)
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

// Handle graceful shutdown for server restarts
const gracefulShutdown = () => {
  console.log('Initiating graceful shutdown...')
  const auctionTimerService = require('./services/auctionTimer.service')
  auctionTimerService.cleanupAll()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

module.exports = { app, startServer }
