const { Server } = require('socket.io')
const corsOptions = require('../config/cors')
const SOCKET_EVENTS = require('../constants/socket.events')

let io = null

const initSocket = (server) => {
  io = new Server(server, { cors: corsOptions })

  // Lazy load handlers to avoid circular dependencies during module initialization
  const registerAuctionSockets = require('./auction.socket')
  const registerBidSockets = require('./bid.socket')
  const registerChatSockets = require('./chat.socket')

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)

    // Register modular sockets
    registerAuctionSockets(io, socket)
    registerBidSockets(io, socket)
    registerChatSockets(io, socket)

    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (Reason: ${reason})`)
      // Trigger cleanup logic if needed
      const { handleAuctionDisconnectCleanup } = require('./auction.socket')
      if (handleAuctionDisconnectCleanup) handleAuctionDisconnectCleanup(io, socket)
    })
  })

  return io
}

const getIO = () => {
  if (!io) throw new Error('Socket.IO is not initialized! Call initSocket(server) first.')
  return io
}

module.exports = { initSocket, getIO }