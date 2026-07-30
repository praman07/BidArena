const SOCKET_EVENTS = require('../../constants/socket.events')
const { validateBid } = require('../../validators/bid.validator')

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
  socket.on(SOCKET_EVENTS.BID_PLACE, (payload = {}) => {
    try {
      const auctionState = payload?.auctionState || {
        status: 'ACTIVE',
        currentHighestBid: 0,
        currentHighestBidderId: null,
        minIncrement: 1,
      }

      // Execute bid validation rules
      const validationResult = validateBid(payload, auctionState)

      if (!validationResult.isValid) {
        console.warn(`[BidValidation Error] Invalid bid from socket ${socket.id}: ${validationResult.message}`)

        // Emit error response strictly to the requesting socket (NO broadcasting)
        socket.emit(SOCKET_EVENTS.BID_ERROR, {
          code: validationResult.code,
          message: validationResult.message,
          details: validationResult.details || null,
        })
        return
      }

      console.log(`[BidValidation Success] Valid bid of ${payload.amount} for auction ${payload.auctionId} by user ${payload.user?.userId}`)

      // Emit validation success strictly to the requesting socket (NO broadcasting)
      socket.emit(SOCKET_EVENTS.BID_VALIDATED, {
        success: true,
        auctionId: payload.auctionId,
        amount: Number(payload.amount),
        details: validationResult.details,
      })
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
