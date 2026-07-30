const SOCKET_EVENTS = require('../constants/socket.events')
const { getIO } = require('../sockets')

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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_HIGHEST_BID, payload)
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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_STATS, payload)
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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_BIDDER_COUNT, payload)
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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_SPECTATORS, payload)
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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_ROOM_UPDATE, payload)
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

    getIO().in(roomName).emit(SOCKET_EVENTS.BROADCAST_AUCTION_STATE, payload)
    console.log(`[Broadcast] Full auction state broadcast to ${roomName}`)
  }
}

// Export singleton instance of BroadcastService
const broadcastService = new BroadcastService()
module.exports = broadcastService
