const SOCKET_EVENTS = require('../../constants/socket.events')
const bidPipelineService = require('../../services/bidPipeline.service')

/**
 * Registers the Bid Pipeline socket event handler.
 * Domain B: Auction Engine & Real-Time
 *
 * Listens for bid:place events and routes them through the full pipeline:
 *   Validation → Engine → Broadcast
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const registerBidPipelineHandlers = (io, socket) => {
  /**
   * Unified bid placement handler.
   *
   * Expected payload:
   * {
   *   auctionId: string,
   *   amount: number,
   *   user: { userId: string, username: string, role?: string },
   *   stateSeed?: { startingPrice?: number, minIncrement?: number, status?: string }
   * }
   */
  socket.on(SOCKET_EVENTS.BID_PLACE, async (payload = {}) => {
    const auctionId = payload?.auctionId
    const amount = payload?.amount
    const user = payload?.user
    const stateSeed = payload?.stateSeed || {}

    console.log(
      `[BidPipeline] bid:place received — auction: ${auctionId}, amount: ${amount}, user: ${user?.userId}`
    )

    // Guard: missing auctionId fails fast without touching pipeline
    if (!auctionId) {
      socket.emit(SOCKET_EVENTS.BID_ERROR, {
        code: 'MISSING_AUCTION_ID',
        message: 'auctionId is required to place a bid',
      })
      return
    }

    try {
      // Route through the full sequential, atomic pipeline
      const result = await bidPipelineService.processBid(
        auctionId,
        { amount, user, socketId: socket.id },
        stateSeed
      )

      if (!result.success) {
        console.warn(
          `[BidPipeline] Bid rejected — auction: ${auctionId}, code: ${result.code}, reason: ${result.message}`
        )

        // Emit error privately to the bidder only
        socket.emit(SOCKET_EVENTS.BID_ERROR, {
          code: result.code,
          message: result.message,
          details: result.details || null,
        })
        return
      }

      console.log(
        `[BidPipeline] Bid accepted — auction: ${auctionId}, new high: $${result.updatedState.currentHighestBid}, bidder: ${result.updatedState.highestBidder.username}`
      )

      // Acknowledge success privately to the bidder
      socket.emit(SOCKET_EVENTS.BID_ACCEPTED, {
        success: true,
        auctionId,
        bidRecord: result.bidRecord,
        currentHighestBid: result.updatedState.currentHighestBid,
      })

      // Room-wide state broadcast is handled inside bidPipelineService.processBid
    } catch (err) {
      console.error(
        `[BidPipeline] Unhandled exception — socket: ${socket.id}, auction: ${auctionId}`,
        err.message
      )

      socket.emit(SOCKET_EVENTS.BID_ERROR, {
        code: 'PIPELINE_EXCEPTION',
        message: 'An internal error occurred while processing your bid',
      })
    }
  })
}

module.exports = registerBidPipelineHandlers
