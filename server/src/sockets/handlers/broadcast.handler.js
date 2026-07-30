const SOCKET_EVENTS = require('../../constants/socket.events')
const broadcastService = require('../../services/broadcast.service')

/**
 * Registers Broadcast Socket Event Listeners and Utilities
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const registerBroadcastHandlers = (io, socket) => {
  /**
   * Optional client trigger to request an immediate broadcast sync of auction state
   * Payload: { auctionId: string }
   */
  socket.on('broadcast:request_sync', (payload = {}) => {
    const auctionId = typeof payload === 'string' ? payload : payload?.auctionId
    if (!auctionId) return

    console.log(`[Broadcast] Sync requested by socket ${socket.id} for auction: ${auctionId}`)
    // Trigger broadcast updates for requested auction
    broadcastService.broadcastHighestBid(auctionId, payload.highestBidData)
    broadcastService.broadcastAuctionStats(auctionId, payload.statsData)
  })
}

module.exports = registerBroadcastHandlers
