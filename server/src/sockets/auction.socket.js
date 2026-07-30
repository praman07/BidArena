const SOCKET_EVENTS = require('../constants/socket.events')
const auctionRoomStore = require('../auction-engine/RecoveryManager')
const auctionEngineService = require('../auction-engine/AuctionEngine')
const auctionTimerService = require('../auction-engine/TimerManager')

/**
 * Registers auction room management socket event listeners.
 * @param {import('socket.io').Server} io - Socket.IO server instance
 * @param {import('socket.io').Socket} socket - Socket connection instance
 */
const registerAuctionRoomHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.AUCTION_JOIN, (payload) => {
    try {
      const auctionId = typeof payload === 'string' ? payload : payload?.auctionId
      const userPayload = typeof payload === 'object' ? payload?.user || payload : {}

      if (!auctionId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'auctionId is required to join an auction room' })
        return
      }

      const roomName = `auction:${auctionId}`
      socket.join(roomName)

      // Update in-memory state
      const { isSpectator, participant, stats } = auctionRoomStore.joinRoom(
        auctionId,
        socket.id,
        userPayload
      )

      console.log(
        `[AuctionRoom] Socket ${socket.id} joined room ${auctionId} as ${
          isSpectator ? 'Spectator' : `User (${participant.username})`
        }`
      )

      // Fetch authoritative server state for reconnection recovery
      const auctionState = auctionEngineService.getAuctionState(auctionId)
      const remainingTime = auctionTimerService.getTime(auctionId)

      // Acknowledge join to the connected socket
      socket.emit(SOCKET_EVENTS.AUCTION_JOINED, {
        auctionId,
        isSpectator,
        participant,
        stats,
        auctionState,
        timerState: { remainingTime }
      })

      // Notify other occupants in the auction room
      socket.to(roomName).emit(SOCKET_EVENTS.AUCTION_USER_JOINED, {
        auctionId,
        isSpectator,
        participant,
      })

      // Broadcast updated room statistics to all sockets in the auction room
      io.in(roomName).emit(SOCKET_EVENTS.AUCTION_ROOM_STATS, stats)
    } catch (error) {
      console.error(`[AuctionRoom Error] Join failed for socket ${socket.id}:`, error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join auction room' })
    }
  })

  socket.on(SOCKET_EVENTS.AUCTION_LEAVE, (payload) => {
    try {
      const auctionId = typeof payload === 'string' ? payload : payload?.auctionId

      if (!auctionId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'auctionId is required to leave an auction room' })
        return
      }

      const roomName = `auction:${auctionId}`

      // Update in-memory state
      const leaveResult = auctionRoomStore.leaveRoom(auctionId, socket.id)

      socket.leave(roomName)
      console.log(`[AuctionRoom] Socket ${socket.id} left room ${auctionId}`)

      // Acknowledge leave to the socket
      socket.emit(SOCKET_EVENTS.AUCTION_LEFT, {
        auctionId,
        message: `Successfully left auction room ${auctionId}`,
      })

      if (leaveResult) {
        const { removedUser, stats } = leaveResult

        // Notify remaining occupants in room
        io.in(roomName).emit(SOCKET_EVENTS.AUCTION_USER_LEFT, {
          auctionId,
          socketId: socket.id,
          removedUser,
        })

        // Broadcast updated room stats to room occupants
        io.in(roomName).emit(SOCKET_EVENTS.AUCTION_ROOM_STATS, stats)
      }
    } catch (error) {
      console.error(`[AuctionRoom Error] Leave failed for socket ${socket.id}:`, error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to leave auction room' })
    }
  })
}

const handleAuctionDisconnectCleanup = (io, socket) => {
  const affectedRooms = auctionRoomStore.handleDisconnect(socket.id)

  affectedRooms.forEach(({ auctionId, removedUser, stats }) => {
    const roomName = `auction:${auctionId}`

    console.log(`[AuctionRoom] Disconnect cleanup for socket ${socket.id} in room ${auctionId}`)

    // Broadcast user left notice to remaining room members
    io.in(roomName).emit(SOCKET_EVENTS.AUCTION_USER_LEFT, {
      auctionId,
      socketId: socket.id,
      removedUser,
    })

    // Broadcast updated stats to remaining members
    io.in(roomName).emit(SOCKET_EVENTS.AUCTION_ROOM_STATS, stats)
  })
}

module.exports = registerAuctionRoomHandlers;
module.exports.handleAuctionDisconnectCleanup = handleAuctionDisconnectCleanup;
