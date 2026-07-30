const liveAuctionService = require('../services/liveAuction.service')
const auctionBridge = require('../integration/auctionBridge.service')
const auctionTimer = require('../auction-engine/TimerManager')
const broadcastService = require('../auction-engine/BroadcastManager')
const ApiError = require('../utils/ApiError')

const EVENTS = {
  JOIN: 'joinAuction',
  LEAVE: 'leaveAuction',
  PLACE_BID: 'placeBid',
  JOIN_MARKETPLACE: 'joinMarketplace',
  LEAVE_MARKETPLACE: 'leaveMarketplace',
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

/**
 * Domain A socket façade powered by Domain B auction-engine.
 * Client event names stay unchanged (joinAuction / placeBid / …).
 */
const registerAuctionSocket = (io, socket) => {
  socket.on(EVENTS.JOIN_MARKETPLACE, () => {
    socket.join(auctionBridge.MARKETPLACE_ROOM)
  })

  socket.on(EVENTS.LEAVE_MARKETPLACE, () => {
    socket.leave(auctionBridge.MARKETPLACE_ROOM)
  })

  socket.on(EVENTS.JOIN, async (payload = {}) => {
    try {
      if (!socket.user?.id) {
        emitError(socket, 'Authentication required to join an auction room', 'UNAUTHORIZED')
        return
      }

      const auctionId =
        typeof payload === 'string' ? payload : payload.auctionId || payload.id

      if (!auctionId) {
        emitError(socket, 'auctionId is required', 'MISSING_AUCTION_ID')
        return
      }

      const room = liveAuctionService.roomName(auctionId)
      const alreadyJoined = socket.data.joinedAuctions?.has(auctionId)

      // Hydrate Domain B engine from Mongo (handles server restart)
      await auctionBridge.ensureRegistered(auctionId)

      if (!alreadyJoined) {
        socket.join(room)
        socket.data.joinedAuctions.add(auctionId)
        auctionBridge.joinRoomPresence(auctionId, socket.id, socket.user)
      }

      const state = await liveAuctionService.getLiveAuctionState(auctionId)
      const engineRemaining = auctionTimer.getTime(auctionId)
      const remainingSeconds =
        engineRemaining != null ? engineRemaining : state.remainingSeconds

      socket.emit(EVENTS.JOINED, {
        auctionId,
        ...state,
        remainingSeconds,
        reconnected: Boolean(alreadyJoined),
      })

      if (remainingSeconds <= 0 || state.status === 'ENDED') {
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
      auctionBridge.leaveRoomPresence(auctionId, socket.id)
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

      // Domain B engine validates + persists; Domain A events fan out to clients
      const result = await auctionBridge.placeBidViaEngine({
        auctionId,
        user: socket.user,
        amount,
        socketId: socket.id,
      })

      const room = liveAuctionService.roomName(auctionId)
      const live = result.live

      const bidPlacedPayload = {
        auctionId,
        bid: result.bid,
        currentBid: live.currentBid,
        highestBidder: live.highestBidder,
        participants: live.participants,
        bids: live.bids,
        status: live.status === 'ACTIVE' ? 'LIVE' : live.status,
      }

      io.to(room).emit(EVENTS.BID_PLACED, bidPlacedPayload)
      io.to(room).emit(EVENTS.UPDATED, {
        auctionId,
        currentBid: live.currentBid,
        highestBidder: live.highestBidder,
        participants: live.participants,
        totalBids: live.bids?.length || live.auction?.totalBidsCount,
        status: bidPlacedPayload.status,
        remainingSeconds: live.remainingSeconds,
        bids: live.bids,
      })

      // Also notify Domain B broadcast layer / marketplace listeners
      broadcastService.broadcastHighestBid(auctionId, {
        currentHighestBid: live.currentBid,
        highestBidder: live.highestBidder,
        totalBidsCount: live.auction?.totalBidsCount,
        status: bidPlacedPayload.status,
      })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not place bid'
      emitError(socket, message, 'BID_REJECTED')
    }
  })

  socket.on('disconnect', () => {
    const joined = socket.data.joinedAuctions
    if (joined?.size) {
      joined.forEach((auctionId) => {
        auctionBridge.leaveRoomPresence(auctionId, socket.id)
      })
      joined.clear()
    }
  })
}

module.exports = registerAuctionSocket
module.exports.EVENTS = EVENTS
