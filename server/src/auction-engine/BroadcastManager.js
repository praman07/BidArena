const SOCKET_EVENTS = require('../constants/socket.events')

/** Domain A client-facing events (used by React useAuctionSocket). */
const CLIENT_EVENTS = {
  BID_PLACED: 'bidPlaced',
  UPDATED: 'auctionUpdated',
  COUNTDOWN: 'countdownUpdated',
  ENDED: 'auctionEnded',
  WINNER: 'winnerAnnounced',
  MARKETPLACE: 'marketplaceUpdated',
}

/**
 * Socket.IO Real-Time Broadcasting Service
 * Domain B engine → Domain A live Socket.IO server
 */
class BroadcastService {
  getIO() {
    try {
      // Prefer Domain A live server (JWT-authenticated)
      return require('../socket/socketServer').getIO()
    } catch {
      try {
        return require('../sockets').getIO()
      } catch {
        return null
      }
    }
  }

  /** Room naming aligned with Domain A / client: auction_<mongoId> */
  getRoomName(auctionId) {
    return `auction_${auctionId}`
  }

  emit(roomName, event, payload) {
    const io = this.getIO()
    if (!io) return
    io.in(roomName).emit(event, payload)
  }

  emitMarketplace(payload) {
    const io = this.getIO()
    if (!io) return
    io.to('marketplace').emit(CLIENT_EVENTS.MARKETPLACE, payload)
  }

  broadcastHighestBid(auctionId, data = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const currentBid = data.currentHighestBid ?? data.currentBid ?? 0
    const highestBidder = data.highestBidder
      ? {
          id: data.highestBidder.id || data.highestBidder.userId,
          userId: data.highestBidder.userId || data.highestBidder.id,
          username: data.highestBidder.username,
        }
      : null

    const legacy = {
      auctionId,
      currentHighestBid: currentBid,
      highestBidder,
      timestamp: data.timestamp || new Date(),
    }

    this.emit(roomName, SOCKET_EVENTS.BROADCAST_HIGHEST_BID, legacy)
    this.emit(roomName, CLIENT_EVENTS.UPDATED, {
      auctionId,
      currentBid,
      highestBidder,
      totalBids: data.totalBidsCount,
      status: data.status || 'LIVE',
    })
    this.emitMarketplace({
      type: 'bid',
      auctionId,
      currentBid,
      highestBidder,
      status: data.status || 'LIVE',
    })
  }

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
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_STATS, payload)
    this.emit(roomName, CLIENT_EVENTS.UPDATED, {
      auctionId,
      currentBid: payload.currentHighestBid,
      totalBids: payload.totalBidsCount,
      status: 'LIVE',
    })
  }

  broadcastBidderCount(auctionId, count = 0) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = { auctionId, bidderCount: Number(count) || 0 }
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_BIDDER_COUNT, payload)
  }

  broadcastSpectators(auctionId, count = 0) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const payload = { auctionId, spectatorCount: Number(count) || 0 }
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_SPECTATORS, payload)
  }

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
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_ROOM_UPDATE, payload)
    this.emit(roomName, CLIENT_EVENTS.UPDATED, {
      auctionId,
      participants: payload.userCount,
    })
  }

  broadcastAuctionState(auctionId, state = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const status = state.status === 'CLOSED' ? 'ENDED' : state.status || 'ACTIVE'
    const currentBid = state.currentHighestBid ?? state.currentBid ?? 0
    const highestBidder = state.highestBidder
      ? {
          id: state.highestBidder.userId || state.highestBidder.id,
          userId: state.highestBidder.userId || state.highestBidder.id,
          username: state.highestBidder.username,
        }
      : null

    this.emit(roomName, SOCKET_EVENTS.BROADCAST_AUCTION_STATE, {
      auctionId,
      status,
      currentHighestBid: currentBid,
      highestBidder,
      totalBidsCount: state.totalBidsCount || 0,
      lastBidAt: state.lastBidAt || null,
      recentBids: state.recentBids || state.bidHistory || [],
    })

    this.emit(roomName, CLIENT_EVENTS.UPDATED, {
      auctionId,
      status,
      currentBid,
      highestBidder,
      totalBids: state.totalBidsCount || 0,
      remainingSeconds: status === 'ENDED' ? 0 : undefined,
    })
  }

  broadcastTime(auctionId, remainingTime) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const remainingSeconds = Math.max(0, Number(remainingTime) || 0)
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_TIME_UPDATE, {
      auctionId,
      remainingTime: remainingSeconds,
    })
    this.emit(roomName, CLIENT_EVENTS.COUNTDOWN, {
      auctionId,
      remainingSeconds,
    })
  }

  broadcastTimerEnded(auctionId) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_TIMER_ENDED, { auctionId })
    this.emit(roomName, CLIENT_EVENTS.ENDED, {
      auctionId,
      status: 'ENDED',
    })
    this.emit(roomName, CLIENT_EVENTS.COUNTDOWN, {
      auctionId,
      remainingSeconds: 0,
    })
    this.emitMarketplace({
      type: 'ended',
      auctionId,
      status: 'ENDED',
    })
  }

  broadcastAuctionWinner(auctionId, winnerPayload = {}) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    const winner = winnerPayload.winner
      ? {
          id: winnerPayload.winner.id || winnerPayload.winner.userId,
          userId: winnerPayload.winner.userId || winnerPayload.winner.id,
          username: winnerPayload.winner.username,
        }
      : null
    const amount =
      winnerPayload.winningAmount ?? winnerPayload.winningBid ?? winnerPayload.amount ?? 0

    this.emit(roomName, SOCKET_EVENTS.BROADCAST_AUCTION_WINNER, winnerPayload)
    this.emit(roomName, CLIENT_EVENTS.WINNER, {
      auctionId,
      winner,
      winningAmount: amount,
      amount,
      message: winner ? undefined : 'Auction ended with no bids',
    })
    this.emitMarketplace({
      type: 'winner',
      auctionId,
      winner,
      winningAmount: amount,
      status: 'ENDED',
    })
  }

  broadcastLiveStats(auctionId, statsPayload) {
    if (!auctionId) return
    const roomName = this.getRoomName(auctionId)
    this.emit(roomName, SOCKET_EVENTS.BROADCAST_LIVE_STATS, statsPayload)
  }
}

const broadcastService = new BroadcastService()
module.exports = broadcastService
module.exports.CLIENT_EVENTS = CLIENT_EVENTS
