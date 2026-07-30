const { Server } = require('socket.io')
const corsOptions = require('../config/cors')
const SOCKET_EVENTS = require('../constants/socket.events')
const registerRoomHandlers = require('./handlers/room.handler')
const {
  registerAuctionRoomHandlers,
  handleAuctionDisconnectCleanup,
} = require('./handlers/auctionRoom.handler')
const registerBidHandlers = require('./handlers/bid.handler')
const registerBroadcastHandlers = require('./handlers/broadcast.handler')

let io = null

/**
 * Initializes Socket.IO on the provided HTTP server instance.
 * @param {import('http').Server} server - HTTP Server instance
 * @returns {import('socket.io').Server} Socket.IO server instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: corsOptions,
  })

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)

    // Register room event handlers
    registerRoomHandlers(io, socket)
    registerAuctionRoomHandlers(io, socket)
    registerBidHandlers(io, socket)
    registerBroadcastHandlers(io, socket)

    // Handle disconnect and perform cleanup
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (Reason: ${reason})`)
      handleAuctionDisconnectCleanup(io, socket)
    })
  })

  return io
}

/**
 * Gets the initialized Socket.IO server instance.
 * @returns {import('socket.io').Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized! Call initSocket(server) first.')
  }
  return io
}

module.exports = {
  initSocket,
  getIO,
}
