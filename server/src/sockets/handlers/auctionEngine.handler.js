const SOCKET_EVENTS = require('../../constants/socket.events')
const auctionEngineService = require('../../services/auctionEngine.service')

/**
 * Registers Auction Engine socket event handlers.
 * @param {import('socket.io').Server} io - Socket.IO server instance
 * @param {import('socket.io').Socket} socket - Connected socket instance
 */
const registerAuctionEngineHandlers = (io, socket) => {
  /**
   * Handle placement of bids into the authoritative Auction Engine
   * Payload: { auctionId: string, amount: number, user: { userId: string, username: string } }
   */
  socket.on(SOCKET_EVENTS.BID_PLACE, async (payload = {}) => {
    try {
      const auctionId = typeof payload === 'string' ? payload : payload?.auctionId
      const amount = payload?.amount
      const user = payload?.user

      if (!auctionId) {
        socket.emit(SOCKET_EVENTS.BID_ERROR, {
          code: 'INVALID_AUCTION_ID',
          message: 'auctionId is required to place a bid',
        })
        return
      }

      // Process bid sequentially and atomically through authoritative engine
      const result = await auctionEngineService.processBid(auctionId, {
        amount,
        user,
        socketId: socket.id,
      })

      // If bid validation or execution failed
      if (!result.success) {
        console.warn(`[AuctionEngine] Bid rejected for socket ${socket.id}: ${result.message}`)
        socket.emit(SOCKET_EVENTS.BID_ERROR, {
          code: result.code,
          message: result.message,
          details: result.details || null,
        })
        return
      }

      console.log(
        `[AuctionEngine] Bid accepted! Auction ${auctionId} -> New High: $${result.updatedState.currentHighestBid} by ${result.updatedState.highestBidder.username}`
      )

      // Acknowledge bid acceptance to the bidder socket
      socket.emit(SOCKET_EVENTS.BID_ACCEPTED, {
        success: true,
        auctionId,
        bidRecord: result.bidRecord,
        currentHighestBid: result.updatedState.currentHighestBid,
      })

      // Broadcast updated authoritative auction state to everyone in the auction room
      const roomName = `auction:${auctionId}`
      io.in(roomName).emit(SOCKET_EVENTS.AUCTION_STATE_UPDATE, result.broadcastPayload)
    } catch (error) {
      console.error(`[AuctionEngine Error] Exception during bid processing for socket ${socket.id}:`, error.message)
      socket.emit(SOCKET_EVENTS.BID_ERROR, {
        code: 'ENGINE_EXCEPTION',
        message: 'An error occurred in the auction engine during bid processing',
      })
    }
  })
}

module.exports = registerAuctionEngineHandlers
