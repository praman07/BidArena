/**
 * In-Memory Auction Room State Manager
 * Domain B: Auction Engine & Real-Time
 */

class AuctionRoomStore {
  constructor() {
    // Map<auctionId, RoomData>
    this.rooms = new Map()
    // Map<socketId, Map<auctionId, { isSpectator, userId }>>
    this.socketToRooms = new Map()
  }

  /**
   * Helper to format room statistics
   * @param {string} auctionId
   * @returns {Object} Room stats summary
   */
  getRoomStats(auctionId) {
    const room = this.rooms.get(auctionId)
    if (!room) {
      return {
        auctionId,
        userCount: 0,
        spectatorCount: 0,
        totalCount: 0,
        activeUsers: [],
      }
    }

    const activeUsers = Array.from(room.users.values()).map((u) => ({
      userId: u.userId,
      username: u.username,
      role: u.role,
      joinedAt: u.joinedAt,
    }))

    return {
      auctionId,
      userCount: room.users.size,
      spectatorCount: room.spectators.size,
      totalCount: room.users.size + room.spectators.size,
      activeUsers,
    }
  }

  /**
   * Join an auction room
   * @param {string} auctionId
   * @param {string} socketId
   * @param {Object} [userPayload] - { userId, username, role }
   * @returns {Object} Result payload with room stats and updated state
   */
  joinRoom(auctionId, socketId, userPayload = {}) {
    if (!auctionId) throw new Error('auctionId is required')
    if (!socketId) throw new Error('socketId is required')

    // Initialize room if it does not exist
    if (!this.rooms.has(auctionId)) {
      this.rooms.set(auctionId, {
        auctionId,
        users: new Map(),
        spectators: new Map(),
        createdAt: new Date(),
      })
    }

    const room = this.rooms.get(auctionId)
    const isSpectator = !userPayload?.userId || userPayload?.role === 'spectator'

    let participant = null

    if (isSpectator) {
      participant = {
        socketId,
        joinedAt: new Date(),
      }
      room.spectators.set(socketId, participant)
    } else {
      participant = {
        socketId,
        userId: userPayload.userId,
        username: userPayload.username || `User_${userPayload.userId.slice(-4)}`,
        role: userPayload.role || 'bidder',
        joinedAt: new Date(),
      }
      room.users.set(userPayload.userId, participant)
    }

    // Track socket to room mapping
    if (!this.socketToRooms.has(socketId)) {
      this.socketToRooms.set(socketId, new Map())
    }
    this.socketToRooms.get(socketId).set(auctionId, {
      isSpectator,
      userId: userPayload?.userId || null,
    })

    return {
      auctionId,
      isSpectator,
      participant,
      stats: this.getRoomStats(auctionId),
    }
  }

  /**
   * Leave an auction room
   * @param {string} auctionId
   * @param {string} socketId
   * @returns {Object|null} Left room info and updated stats
   */
  leaveRoom(auctionId, socketId) {
    const room = this.rooms.get(auctionId)
    if (!room) return null

    let removedUser = null

    // Check and remove from spectators
    if (room.spectators.has(socketId)) {
      removedUser = room.spectators.get(socketId)
      room.spectators.delete(socketId)
    }

    // Check and remove from users
    for (const [userId, user] of room.users.entries()) {
      if (user.socketId === socketId) {
        removedUser = user
        room.users.delete(userId)
        break
      }
    }

    // Clean up socketToRooms mapping
    const userRooms = this.socketToRooms.get(socketId)
    if (userRooms) {
      userRooms.delete(auctionId)
      if (userRooms.size === 0) {
        this.socketToRooms.delete(socketId)
      }
    }

    // Clean up empty room state
    const stats = this.getRoomStats(auctionId)
    if (stats.totalCount === 0) {
      this.rooms.delete(auctionId)
    }

    return {
      auctionId,
      removedUser,
      stats,
    }
  }

  /**
   * Handle disconnect cleanup for a socket
   * @param {string} socketId
   * @returns {Array<Object>} List of affected rooms and updated stats
   */
  handleDisconnect(socketId) {
    const userRooms = this.socketToRooms.get(socketId)
    if (!userRooms) return []

    const affectedRooms = []

    for (const auctionId of Array.from(userRooms.keys())) {
      const result = this.leaveRoom(auctionId, socketId)
      if (result) {
        affectedRooms.push(result)
      }
    }

    this.socketToRooms.delete(socketId)
    return affectedRooms
  }
}

// Export singleton instance for app-wide in-memory state tracking
const auctionRoomStore = new AuctionRoomStore()
module.exports = auctionRoomStore
