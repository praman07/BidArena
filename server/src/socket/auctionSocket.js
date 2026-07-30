const liveAuctionService = require('../services/liveAuction.service')
const ApiError = require('../utils/ApiError')

/** Active countdown intervals keyed by auction Mongo id. */
const countdownTimers = new Map()
/** Auctions already finalized to avoid duplicate end broadcasts. */
const endedAuctions = new Set()

const EVENTS = {
  JOIN: 'joinAuction',
  LEAVE: 'leaveAuction',
  PLACE_BID: 'placeBid',
  JOINED: 'auctionJoined',
  BID_PLACED: 'bidPlaced',
  UPDATED: 'auctionUpdated',
  COUNTDOWN: 'countdownUpdated',
  ENDED: 'auctionEnded',
  WINNER: 'winnerAnnounced',
  ERROR: 'bidError',
}

const emitError = (socket, message, code = 'ERROR') => {
  socket.emit(EVENTS.ERROR, { code, message })
}

const stopCountdown = (auctionId) => {
  const timer = countdownTimers.get(auctionId)
  if (timer) {
    clearInterval(timer)
    countdownTimers.delete(auctionId)
  }
}

const broadcastEnd = async (io, auctionId) => {
  if (endedAuctions.has(auctionId)) return
  endedAuctions.add(auctionId)
  stopCountdown(auctionId)

  try {
    const result = await liveAuctionService.endAuction(auctionId)
    const room = liveAuctionService.roomName(auctionId)

    io.to(room).emit(EVENTS.ENDED, {
      auctionId,
      status: 'ENDED',
      auction: result.auction,
    })

    io.to(room).emit(EVENTS.COUNTDOWN, {
      auctionId,
      remainingSeconds: 0,
    })

    if (result.winner) {
      io.to(room).emit(EVENTS.WINNER, result.winner)
    } else {
      io.to(room).emit(EVENTS.WINNER, {
        auctionId,
        winner: null,
        winningAmount: 0,
        amount: 0,
        message: 'Auction ended with no bids',
      })
    }

    io.to(room).emit(EVENTS.UPDATED, {
      auctionId,
      currentBid: result.auction.currentBid,
      highestBidder: result.auction.highestBidder,
      participants: result.auction.participantCount,
      totalBids: result.auction.totalBidsCount,
      status: 'ENDED',
      remainingSeconds: 0,
    })
  } catch (error) {
    console.error(`[AuctionSocket] Failed to end auction ${auctionId}:`, error.message)
  }
}

const ensureCountdown = (io, auctionId, endTime) => {
  if (countdownTimers.has(auctionId) || endedAuctions.has(auctionId)) return

  const tick = async () => {
    const remainingSeconds = liveAuctionService.remainingSecondsFor(endTime)
    const room = liveAuctionService.roomName(auctionId)

    io.to(room).emit(EVENTS.COUNTDOWN, {
      auctionId,
      remainingSeconds,
    })

    if (remainingSeconds <= 0) {
      await broadcastEnd(io, auctionId)
    }
  }

  // Immediate tick so joiners get a fresh value quickly
  tick().catch((err) => console.error('[AuctionSocket] countdown tick error:', err.message))
  const interval = setInterval(() => {
    tick().catch((err) => console.error('[AuctionSocket] countdown tick error:', err.message))
  }, 1000)

  countdownTimers.set(auctionId, interval)
}

/**
 * Registers live auction room handlers for a connected socket.
 */
const registerAuctionSocket = (io, socket) => {
  socket.on(EVENTS.JOIN, async (payload = {}) => {
    try {
      const auctionId =
        typeof payload === 'string' ? payload : payload.auctionId || payload.id

      if (!auctionId) {
        emitError(socket, 'auctionId is required', 'MISSING_AUCTION_ID')
        return
      }

      const room = liveAuctionService.roomName(auctionId)
      const alreadyJoined = socket.data.joinedAuctions?.has(auctionId)

      if (!alreadyJoined) {
        socket.join(room)
        socket.data.joinedAuctions.add(auctionId)
      }

      const state = await liveAuctionService.getLiveAuctionState(auctionId)

      socket.emit(EVENTS.JOINED, {
        auctionId,
        ...state,
        reconnected: Boolean(alreadyJoined),
      })

      if (state.remainingSeconds <= 0 || state.status === 'ENDED') {
        if (!endedAuctions.has(auctionId)) {
          await broadcastEnd(io, auctionId)
        } else {
          socket.emit(EVENTS.ENDED, {
            auctionId,
            status: 'ENDED',
            auction: state.auction,
          })
          if (state.highestBidder) {
            socket.emit(EVENTS.WINNER, {
              auctionId,
              winner: state.highestBidder,
              winningAmount: state.currentBid,
              amount: state.currentBid,
            })
          }
        }
        return
      }

      ensureCountdown(io, auctionId, state.endTime)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to join auction room'
      emitError(socket, message, 'JOIN_FAILED')
    }
  })

  socket.on(EVENTS.LEAVE, (payload = {}) => {
    try {
      const auctionId =
        typeof payload === 'string' ? payload : payload.auctionId || payload.id
      if (!auctionId) return

      const room = liveAuctionService.roomName(auctionId)
      socket.leave(room)
      socket.data.joinedAuctions?.delete(auctionId)
    } catch (error) {
      console.error(`[AuctionSocket] leave failed:`, error.message)
    }
  })

  socket.on(EVENTS.PLACE_BID, async (payload = {}) => {
    try {
      const auctionId = payload.auctionId || payload.id
      const amount = payload.amount

      if (!auctionId) {
        emitError(socket, 'auctionId is required', 'MISSING_AUCTION_ID')
        return
      }
      if (!socket.user?.id) {
        emitError(socket, 'Authentication required', 'UNAUTHORIZED')
        return
      }

      const result = await liveAuctionService.placeBid({
        auctionId,
        userId: socket.user.id,
        amount,
      })

      const room = liveAuctionService.roomName(auctionId)

      io.to(room).emit(EVENTS.BID_PLACED, {
        auctionId,
        bid: result.bid,
        currentBid: result.currentBid,
        highestBidder: result.highestBidder,
        participants: result.participants,
        bids: result.bids,
        status: result.status,
      })

      io.to(room).emit(EVENTS.UPDATED, {
        auctionId,
        currentBid: result.currentBid,
        highestBidder: result.highestBidder,
        participants: result.participants,
        totalBids: result.bids.length,
        status: result.status,
        remainingSeconds: result.remainingSeconds,
        bids: result.bids,
      })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not place bid'
      emitError(socket, message, 'BID_REJECTED')
    }
  })

  socket.on('disconnect', () => {
    socket.data.joinedAuctions?.clear()
  })
}

module.exports = registerAuctionSocket
module.exports.EVENTS = EVENTS
