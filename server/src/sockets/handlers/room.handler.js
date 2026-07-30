const SOCKET_EVENTS = require('../../constants/socket.events')

/**
 * Registers room management socket handlers (join and leave rooms).
 * @param {import('socket.io').Server} io - Socket.IO server instance
 * @param {import('socket.io').Socket} socket - Connected socket instance
 */
const registerRoomHandlers = (io, socket) => {
  /**
   * Handle join room event
   */
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (data) => {
    try {
      const roomId = typeof data === 'string' ? data : data?.roomId

      if (!roomId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'roomId is required to join a room' })
        return
      }

      socket.join(roomId)
      console.log(`[Socket] Client ${socket.id} joined room: ${roomId}`)

      socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
        roomId,
        message: `Successfully joined room ${roomId}`,
      })
    } catch (error) {
      console.error(`[Socket Error] Error joining room for socket ${socket.id}:`, error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' })
    }
  })

  /**
   * Handle leave room event
   */
  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (data) => {
    try {
      const roomId = typeof data === 'string' ? data : data?.roomId

      if (!roomId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'roomId is required to leave a room' })
        return
      }

      socket.leave(roomId)
      console.log(`[Socket] Client ${socket.id} left room: ${roomId}`)

      socket.emit(SOCKET_EVENTS.ROOM_LEFT, {
        roomId,
        message: `Successfully left room ${roomId}`,
      })
    } catch (error) {
      console.error(`[Socket Error] Error leaving room for socket ${socket.id}:`, error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to leave room' })
    }
  })
}

module.exports = registerRoomHandlers
