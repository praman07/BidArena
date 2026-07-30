const SOCKET_EVENTS = require('../constants/socket.events')
// getIO will be required lazily to avoid circular dependencies

/**
 * Socket.IO Real-Time Broadcasting Service
 * Domain B: Auction Engine & Real-Time
 */
class BroadcastService {
  /**
   * Helper to format standard room name for an auction
   * @param {string} auctionId
   * @returns {string}
   */
  getRoomName(auctionId) {
    return `auction:${auctionId}`
  }

  /**
   * Broadcast highest bid update to all clients in the auction room
   * @param {string} auctionId
   * @param {Object} data - { currentHighestBid, highestBidder, timestamp }
   */
  broadcastHighestBid(auctionId, data = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      currentHighestBid: data.currentHighestBid || 0,
      highestBidder: data.highestBidder || null,
      timestamp: data.timestamp || new Date(),
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_HIGHEST_BID, payload)
    console.log(`[Broadcast] Highest bid broadcast to ${roomName}: $${payload.currentHighestBid}`)
  }

  /**
   * Broadcast auction statistics to all clients in the auction room
   * @param {string} auctionId
   * @param {Object} stats - { totalBidsCount, currentHighestBid, startingPrice, lastBidAt }
   */
  broadcastAuctionStats(auctionId, stats = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      totalBidsCount: stats.totalBidsCount || 0,
      currentHighestBid: stats.currentHighestBid || 0,
      startingPrice: stats.startingPrice || 0,
      lastBidAt: stats.lastBidAt || null,
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_STATS, payload)
    console.log(`[Broadcast] Auction stats broadcast to ${roomName}`)
  }

  /**
   * Broadcast active bidder count to the auction room
   * @param {string} auctionId
   * @param {number} count
   */
  broadcastBidderCount(auctionId, count = 0) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      bidderCount: Number(count) || 0,
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_BIDDER_COUNT, payload)
    console.log(`[Broadcast] Bidder count (${payload.bidderCount}) broadcast to ${roomName}`)
  }

  /**
   * Broadcast spectator count to the auction room
   * @param {string} auctionId
   * @param {number} count
   */
  broadcastSpectators(auctionId, count = 0) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      spectatorCount: Number(count) || 0,
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_SPECTATORS, payload)
    console.log(`[Broadcast] Spectator count (${payload.spectatorCount}) broadcast to ${roomName}`)
  }

  /**
   * Broadcast overall room updates (member and spectator counts)
   * @param {string} auctionId
   * @param {Object} roomStats - { userCount, spectatorCount, totalCount, activeUsers }
   */
  broadcastRoomUpdate(auctionId, roomStats = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      userCount: roomStats.userCount || 0,
      spectatorCount: roomStats.spectatorCount || 0,
      totalCount: roomStats.totalCount || 0,
      activeUsers: roomStats.activeUsers || [],
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_ROOM_UPDATE, payload)
    console.log(`[Broadcast] Room update broadcast to ${roomName}`)
  }

  /**
   * Broadcast complete current state of the auction
   * @param {string} auctionId
   * @param {Object} state - Authoritative auction state object
   */
  broadcastAuctionState(auctionId, state = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      status: state.status || 'ACTIVE',
      currentHighestBid: state.currentHighestBid || 0,
      highestBidder: state.highestBidder || null,
      totalBidsCount: state.totalBidsCount || 0,
      lastBidAt: state.lastBidAt || null,
      recentBids: state.recentBids || [],
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_AUCTION_STATE, payload)
    console.log(`[Broadcast] Full auction state broadcast to ${roomName}`)
  }
  /**
   * Broadcast remaining time for an auction to the room
   * @param {string} auctionId
   * @param {number} remainingTime - Time left in seconds
   */
  broadcastTime(auctionId, remainingTime) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = {
      auctionId,
      remainingTime: Math.max(0, Number(remainingTime) || 0),
    }

    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_TIME_UPDATE, payload)
  }

  /**
   * Broadcast that an auction's timer has ended
   * @param {string} auctionId
   */
  broadcastTimerEnded(auctionId) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    
    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_TIMER_ENDED, { auctionId })
    console.log(`[Broadcast] Timer ended broadcast to ${roomName}`)
  }

  /**
   * Broadcast the auction winner to the room
   * @param {string} auctionId
   * @param {Object} winnerPayload - { winner, winningBid, auctionId }
   */
  broadcastAuctionWinner(auctionId, winnerPayload) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    
    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_AUCTION_WINNER, winnerPayload)
    console.log(`[Broadcast] Auction winner broadcast to ${roomName}`)
  }

  /**
   * Broadcast unified live statistics to the room
   * @param {string} auctionId
   * @param {Object} statsPayload 
   */
  broadcastLiveStats(auctionId, statsPayload) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    
    // Only emit, avoid spamming console logs every second
    require('../sockets').getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_LIVE_STATS, statsPayload)
  }
}

// Export singleton instance of BroadcastService
const broadcastService = new BroadcastService()
module.exports = broadcastService
