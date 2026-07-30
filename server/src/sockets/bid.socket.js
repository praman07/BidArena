const SOCKET_EVENTS = require('../constants/socket.events')
const auctionEngineService = require('../auction-engine/AuctionEngine')
const broadcastService = require('../auction-engine/BroadcastManager')

/**
 * Registers bid validation socket event listeners.
 * @param {import('socket.io').Server} io - Socket.IO server instance
 * @param {import('socket.io').Socket} socket - Socket connection instance
 */
const registerBidHandlers = (io, socket) => {
  /**
   * Handle bid placement validation
   * Payload: {
   *   auctionId: string,
   *   amount: number,
   *   user: { userId: string, username: string, role?: string },
   *   auctionState?: { status?: string, currentHighestBid?: number, currentHighestBidderId?: string, minIncrement?: number, startingPrice?: number }
   * }
   */
  socket.on(SOCKET_EVENTS.BID_PLACE, async (payload = {}) => {
    try {
      const auctionId = payload.auctionId;
      if (!auctionId) {
         socket.emit(SOCKET_EVENTS.BID_ERROR, { message: 'auctionId is required' });
         return;
      }

      // 1. Process bid through the engine (validates, mutates state, persists to DB)
      const result = await auctionEngineService.processBid(auctionId, payload);

      if (!result.success) {
        console.warn(`[BidValidation Error] Invalid bid from socket ${socket.id}: ${result.message}`)

        // Emit error response strictly to the requesting socket
        socket.emit(SOCKET_EVENTS.BID_ERROR, {
          code: result.code,
          message: result.message,
          details: result.details || null,
        })
        return
      }

      console.log(`[BidValidation Success] Valid bid of ${payload.amount} for auction ${payload.auctionId} by user ${payload.user?.userId}`)

      // 2. Emit acceptance strictly to the requesting socket
      socket.emit(SOCKET_EVENTS.BID_ACCEPTED, {
        success: true,
        auctionId: result.auctionId,
        amount: Number(payload.amount),
        bidRecord: result.bidRecord,
      })

      // 3. Broadcast updates to the entire room
      const state = result.updatedState;
      broadcastService.broadcastHighestBid(auctionId, {
        currentHighestBid: state.currentHighestBid,
        highestBidder: state.highestBidder,
        timestamp: state.lastBidAt,
      });

      broadcastService.broadcastAuctionStats(auctionId, {
        totalBidsCount: state.totalBidsCount,
        currentHighestBid: state.currentHighestBid,
        startingPrice: state.startingPrice,
        lastBidAt: state.lastBidAt,
      });
      
    } catch (error) {
      console.error(`[BidValidation Exception] Error processing bid for socket ${socket.id}:`, error.message)
      
      socket.emit(SOCKET_EVENTS.BID_ERROR, {
        code: 'VALIDATION_EXCEPTION',
        message: 'An error occurred while validating your bid',
      })
    }
  })
}

module.exports = registerBidHandlers
