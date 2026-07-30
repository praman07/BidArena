const SOCKET_EVENTS = require('../constants/socket.events')
const { getIO } = require('../sockets')

/**
 * Socket.IO Real-Time Broadcasting Service
 * Domain B: Auction Engine & Real-Time
 *
 * All methods target a specific auction room: `auction:<auctionId>`
 * No validation. No persistence. No timers.
 */
class BroadcastService {
  getRoomName(auctionId) {
    return `auction:${auctionId}`
  }

  /**
   * Broadcast the current highest bid to the entire room.
   * @param {string} auctionId
   * @param {{ currentHighestBid: number, highestBidder: Object, timestamp: Date }} data
   */
  broadcastHighestBid(auctionId, data = {}) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_HIGHEST_BID, {
        auctionId,
        currentHighestBid: data.currentHighestBid || 0,
        highestBidder: data.highestBidder || null,
        timestamp: data.timestamp || new Date(),
      })
  }

  /**
   * Broadcast auction statistics to the entire room.
   * @param {string} auctionId
   * @param {{ totalBidsCount: number, currentHighestBid: number, startingPrice: number, lastBidAt: Date }} stats
   */
  broadcastAuctionStats(auctionId, stats = {}) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_STATS, {
        auctionId,
        totalBidsCount: stats.totalBidsCount || 0,
        currentHighestBid: stats.currentHighestBid || 0,
        startingPrice: stats.startingPrice || 0,
        lastBidAt: stats.lastBidAt || null,
      })
  }

  /**
   * Broadcast active bidder count to the room.
   * @param {string} auctionId
   * @param {number} count
   */
  broadcastBidderCount(auctionId, count = 0) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_BIDDER_COUNT, {
        auctionId,
        bidderCount: Number(count) || 0,
      })
  }

  /**
   * Broadcast spectator count to the room.
   * @param {string} auctionId
   * @param {number} count
   */
  broadcastSpectators(auctionId, count = 0) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_SPECTATORS, {
        auctionId,
        spectatorCount: Number(count) || 0,
      })
  }

  /**
   * Broadcast room member and spectator counts to the room.
   * @param {string} auctionId
   * @param {{ userCount: number, spectatorCount: number, totalCount: number, activeUsers: Array }} roomStats
   */
  broadcastRoomUpdate(auctionId, roomStats = {}) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_ROOM_UPDATE, {
        auctionId,
        userCount: roomStats.userCount || 0,
        spectatorCount: roomStats.spectatorCount || 0,
        totalCount: roomStats.totalCount || 0,
        activeUsers: roomStats.activeUsers || [],
      })
  }

  /**
   * Broadcast the full authoritative auction state to the room.
   * @param {string} auctionId
   * @param {Object} state
   */
  broadcastAuctionState(auctionId, state = {}) {
    if (!auctionId) return
    getIO()
      .in(this.getRoomName(auctionId))
      .emit(SOCKET_EVENTS.BROADCAST_AUCTION_STATE, {
        auctionId,
        status: state.status || 'ACTIVE',
        currentHighestBid: state.currentHighestBid || 0,
        highestBidder: state.highestBidder || null,
        totalBidsCount: state.totalBidsCount || 0,
        lastBidAt: state.lastBidAt || null,
        recentBids: state.recentBids || [],
      })
  }
}

const broadcastService = new BroadcastService()
module.exports = broadcastService
