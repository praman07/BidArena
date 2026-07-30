const { validateBid } = require('./BidValidator')
const auctionRoomStore = require('./RecoveryManager')
const broadcastService = require('./BroadcastManager')

/**
 * Bid Pipeline Service
 * Domain B: Auction Engine & Real-Time
 *
 * Orchestrates the complete, sequential bid lifecycle:
 *   1. Validate payload
 *   2. Validate against live auction state
 *   3. Commit atomic state update
 *   4. Prepare broadcast payload
 *   5. Broadcast to room
 *
 * Single responsibility: wires all Domain B modules together.
 * No DB. No timers. No payments.
 */

/**
 * Authoritative in-memory auction engine state.
 * Map<auctionId, AuctionState>
 */
const auctionStates = new Map()

/**
 * Sequential execution queue per auction.
 * Prevents race conditions on concurrent bid events.
 * Map<auctionId, Promise>
 */
const auctionQueues = new Map()

/**
 * Returns or initialises authoritative state for an auction.
 * @param {string} auctionId
 * @param {Object} [seed] - Optional initial seed values
 * @returns {Object} Live auction state
 */
const getOrInitState = (auctionId, seed = {}) => {
  if (!auctionStates.has(auctionId)) {
    const startingPrice = Number(seed.startingPrice) || 0
    auctionStates.set(auctionId, {
      auctionId,
      status: seed.status || 'ACTIVE',
      startingPrice,
      minIncrement: Number(seed.minIncrement) || 1,
      currentHighestBid: startingPrice,
      currentHighestBidderId: null,
      highestBidder: null,
      totalBidsCount: 0,
      lastBidAt: null,
      bidHistory: [],
    })
  }
  return auctionStates.get(auctionId)
}

/**
 * Executes the atomic state mutation after all validations pass.
 * @param {Object} state - Live auction state (mutated in place)
 * @param {Object} bidPayload - { amount, user, socketId }
 * @returns {Object} Result with bidRecord and broadcastPayload
 */
const commitBid = (state, bidPayload) => {
  const bidAmount = Number(bidPayload.amount)
  const bidder = {
    userId: bidPayload.user.userId,
    username: bidPayload.user.username || `User_${bidPayload.user.userId.slice(-4)}`,
    socketId: bidPayload.socketId || null,
  }

  const bidRecord = {
    bidId: `bid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: bidder.userId,
    username: bidder.username,
    amount: bidAmount,
    timestamp: new Date(),
  }

  // --- ATOMIC STATE MUTATIONS ---
  state.currentHighestBid = bidAmount
  state.currentHighestBidderId = bidder.userId
  state.highestBidder = bidder
  state.totalBidsCount += 1
  state.lastBidAt = bidRecord.timestamp
  state.bidHistory.unshift(bidRecord)

  // Cap history at 50 entries to manage memory
  if (state.bidHistory.length > 50) state.bidHistory.pop()

  return {
    bidRecord,
    broadcastPayload: {
      auctionId: state.auctionId,
      currentHighestBid: state.currentHighestBid,
      highestBidder: {
        userId: state.highestBidder.userId,
        username: state.highestBidder.username,
      },
      totalBidsCount: state.totalBidsCount,
      lastBidAt: state.lastBidAt,
      latestBid: bidRecord,
    },
  }
}

/**
 * Private: executes validation + commit atomically inside a queue slot.
 * @param {string} auctionId
 * @param {Object} bidPayload
 * @param {Object} [stateSeed]
 * @returns {Object} Pipeline result
 */
const _runPipelineSlot = (auctionId, bidPayload, stateSeed) => {
  const state = getOrInitState(auctionId, stateSeed)

  // Build validation context from live state
  const validationContext = {
    status: state.status,
    currentHighestBid: state.currentHighestBid,
    currentHighestBidderId: state.currentHighestBidderId,
    minIncrement: state.minIncrement,
    startingPrice: state.startingPrice,
  }

  const validation = validateBid(
    { auctionId, ...bidPayload },
    validationContext
  )

  if (!validation.isValid) {
    return {
      success: false,
      code: validation.code,
      message: validation.message,
      details: validation.details || null,
    }
  }

  const { bidRecord, broadcastPayload } = commitBid(state, bidPayload)

  return {
    success: true,
    auctionId,
    bidRecord,
    updatedState: state,
    broadcastPayload,
  }
}

/**
 * Public entry point.
 * Enqueues a bid for sequential, atomic processing and then triggers broadcasts.
 *
 * @param {string} auctionId - Target auction identifier
 * @param {Object} bidPayload - { amount, user: { userId, username }, socketId }
 * @param {Object} [stateSeed] - Optional initial state seed (used on first bid for an auction)
 * @returns {Promise<Object>} Pipeline result
 */
const processBid = async (auctionId, bidPayload = {}, stateSeed = {}) => {
  if (!auctionId) {
    return {
      success: false,
      code: 'INVALID_AUCTION_ID',
      message: 'auctionId is required',
    }
  }

  // Append to sequential queue to prevent race conditions
  const currentQueue = auctionQueues.get(auctionId) || Promise.resolve()

  const executionPromise = currentQueue.then(async () => {
    const result = _runPipelineSlot(auctionId, bidPayload, stateSeed)

    // Only broadcast on successful bid commit
    if (result.success) {
      const state = result.updatedState
      const roomStats = auctionRoomStore.getRoomStats(auctionId)

      // Broadcast all real-time updates to the auction room
      broadcastService.broadcastHighestBid(auctionId, {
        currentHighestBid: state.currentHighestBid,
        highestBidder: state.highestBidder,
        timestamp: state.lastBidAt,
      })

      broadcastService.broadcastAuctionStats(auctionId, {
        totalBidsCount: state.totalBidsCount,
        currentHighestBid: state.currentHighestBid,
        startingPrice: state.startingPrice,
        lastBidAt: state.lastBidAt,
      })

      broadcastService.broadcastBidderCount(auctionId, roomStats.userCount || 0)
      broadcastService.broadcastSpectators(auctionId, roomStats.spectatorCount || 0)

      broadcastService.broadcastAuctionState(auctionId, {
        status: state.status,
        currentHighestBid: state.currentHighestBid,
        highestBidder: state.highestBidder,
        totalBidsCount: state.totalBidsCount,
        lastBidAt: state.lastBidAt,
        recentBids: state.bidHistory.slice(0, 5),
      })
    }

    return result
  })

  // Update queue ref; swallow errors so queue never breaks
  auctionQueues.set(auctionId, executionPromise.catch(() => {}))

  return executionPromise
}

/**
 * Returns the current authoritative state snapshot for an auction.
 * @param {string} auctionId
 * @returns {Object|null}
 */
const getAuctionState = (auctionId) => auctionStates.get(auctionId) || null

module.exports = {
  processBid,
  getAuctionState,
  getOrInitState,
}
