const { validateBid } = require('../validators/bid.validator')
const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const Timeline = require('../models/Timeline')
const Winner = require('../models/Winner')

/**
 * Authoritative In-Memory Auction Engine
 * Domain B: Auction Engine & Real-Time Core
 */
class AuctionEngineService {
  constructor() {
    // Map<auctionId, AuctionAuthoritativeState>
    this.auctions = new Map()
    // Map<auctionId, Promise> for sequential bid queue execution per auction
    this.queues = new Map()
  }

  /**
   * Initializes or updates an authoritative auction state.
   * @param {Object} data - Initial auction details
   * @returns {Object} Created or existing auction state
   */
  initAuction(data = {}) {
    const auctionId = data.auctionId || `auction_${Date.now()}`
    
    if (!this.auctions.has(auctionId)) {
      const startingPrice = Number(data.startingPrice) || 0
      const minIncrement = Number(data.minIncrement) || 1

      this.auctions.set(auctionId, {
        auctionId,
        title: data.title || `Auction ${auctionId}`,
        status: data.status || 'ACTIVE',
        startingPrice,
        minIncrement,
        currentHighestBid: startingPrice,
        highestBidder: null,
        totalBidsCount: 0,
        lastBidAt: null,
        bidHistory: [],
        createdAt: new Date(),
      })

      // --- ASYNC DATABASE PERSISTENCE ---
      Promise.all([
        Timeline.create({
          auctionId,
          eventType: 'AUCTION_CREATED',
          details: { startingPrice: startingPrice, minIncrement: minIncrement },
        }),
        Timeline.create({
          auctionId,
          eventType: 'AUCTION_STARTED',
          details: { status: 'ACTIVE' },
        })
      ]).catch(err => console.error(`[AuctionEngine] Failed to persist creation timeline for ${auctionId}:`, err))
    }

    return this.auctions.get(auctionId)
  }

  /**
   * Gets the authoritative state snapshot of an auction.
   * @param {string} auctionId
   * @returns {Object|null}
   */
  getAuctionState(auctionId) {
    if (!this.auctions.has(auctionId)) {
      // Auto-initialize standard active state if requested for testing/mocking
      this.initAuction({ auctionId })
    }
    return this.auctions.get(auctionId)
  }

  /**
   * Enqueues a bid attempt for sequential atomic processing per auction.
   * Eliminates race conditions by locking bid processing order per auctionId.
   * @param {string} auctionId
   * @param {Object} bidPayload - { amount, user, socketId }
   * @returns {Promise<Object>} Result of atomic bid processing
   */
  async processBid(auctionId, bidPayload = {}) {
    if (!auctionId) throw new Error('auctionId is required for bid processing')

    // Retrieve or initialize the Promise queue for this auction
    const currentQueue = this.queues.get(auctionId) || Promise.resolve()

    // Append atomic execution task to sequential queue
    const executionPromise = currentQueue.then(async () => {
      return this._executeAtomicBidUpdate(auctionId, bidPayload)
    })

    // Update queue reference for next concurrent bid
    this.queues.set(
      auctionId,
      executionPromise.catch(() => {}) // Prevent unhandled rejection breaking queue
    )

    return executionPromise
  }

  /**
   * Private method performing atomic state validation and mutation.
   * Runs sequentially inside the auction queue.
   * @param {string} auctionId
   * @param {Object} bidPayload
   * @private
   */
  _executeAtomicBidUpdate(auctionId, bidPayload) {
    const state = this.getAuctionState(auctionId)
    if (!state) {
      return {
        success: false,
        code: 'AUCTION_NOT_FOUND',
        message: `Auction with ID '${auctionId}' does not exist`,
      }
    }

    // Reject late bids if auction is closed/locked
    if (state.status !== 'ACTIVE') {
      return {
        success: false,
        code: 'AUCTION_CLOSED',
        message: `Auction with ID '${auctionId}' is no longer active.`,
      }
    }

    // Build current state context for validator
    const stateContext = {
      status: state.status,
      currentHighestBid: state.currentHighestBid,
      currentHighestBidderId: state.highestBidder?.userId || null,
      minIncrement: state.minIncrement,
      startingPrice: state.startingPrice,
    }

    // Execute validation rules against live state
    const validation = validateBid(bidPayload, stateContext)
    if (!validation.isValid) {
      return {
        success: false,
        code: validation.code,
        message: validation.message,
        details: validation.details || null,
      }
    }

    const bidAmount = Number(bidPayload.amount)
    const bidder = {
      userId: bidPayload.user.userId,
      username: bidPayload.user.username || `User_${bidPayload.user.userId.slice(-4)}`,
      socketId: bidPayload.socketId || null,
    }

    const bidRecord = {
      bidId: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: bidder.userId,
      username: bidder.username,
      amount: bidAmount,
      timestamp: new Date(),
    }

    // --- ATOMIC STATE MUTATIONS ---
    state.currentHighestBid = bidAmount
    state.highestBidder = bidder
    state.totalBidsCount += 1
    state.lastBidAt = bidRecord.timestamp
    state.bidHistory.unshift(bidRecord)

    // Keep history capped at last 50 bids for memory efficiency
    if (state.bidHistory.length > 50) {
      state.bidHistory.pop()
    }

    // --- ASYNC DATABASE PERSISTENCE ---
    // Fire and forget to not block the atomic execution queue
    Promise.all([
      Bid.create({
        bidId: bidRecord.bidId,
        auctionId,
        userId: bidRecord.userId,
        amount: bidAmount,
        timestamp: bidRecord.timestamp
      }),
      Auction.updateOne(
        { auctionId },
        { 
          $set: { 
            currentHighestBid: bidAmount,
            highestBidder: bidRecord.userId,
            totalBidsCount: state.totalBidsCount,
            lastBidAt: bidRecord.timestamp
          }
        },
        { upsert: true }
      ),
      Timeline.create({
        auctionId,
        eventType: 'BID_PLACED',
        details: { bidId: bidRecord.bidId, amount: bidAmount, userId: bidRecord.userId },
        timestamp: bidRecord.timestamp
      })
    ]).catch(err => console.error(`[AuctionEngine] Failed to persist bid ${bidRecord.bidId}:`, err))

    // Prepare clean payload for broadcasting
    const broadcastPayload = {
      auctionId: state.auctionId,
      currentHighestBid: state.currentHighestBid,
      highestBidder: {
        userId: state.highestBidder.userId,
        username: state.highestBidder.username,
      },
      totalBidsCount: state.totalBidsCount,
      lastBidAt: state.lastBidAt,
      latestBid: bidRecord,
    }

    return {
      success: true,
      auctionId,
      bidRecord,
      updatedState: state,
      broadcastPayload,
    }
  }

  /**
   * Closes an auction, locks it from further bids, and determines the winner.
   * @param {string} auctionId
   * @returns {Object} The final state of the closed auction
   */
  closeAuction(auctionId) {
    const state = this.getAuctionState(auctionId)
    if (!state || state.status === 'CLOSED') {
      return null
    }

    // Lock the auction
    state.status = 'CLOSED'
    console.log(`[AuctionEngine] Auction ${auctionId} locked and closed.`)

    const broadcastService = require('./broadcast.service')

    // Broadcast final state
    broadcastService.broadcastAuctionState(auctionId, state)

    // Determine and broadcast winner
    if (state.highestBidder) {
      const winnerPayload = {
        auctionId: state.auctionId,
        winner: state.highestBidder,
        winningBid: state.currentHighestBid,
      }
      broadcastService.broadcastAuctionWinner(auctionId, winnerPayload)

      // Async database persistence for winner
      Promise.all([
        Winner.create({
          auctionId: state.auctionId,
          userId: state.highestBidder.userId,
          winningBid: state.currentHighestBid,
        }),
        Timeline.create({
          auctionId,
          eventType: 'WINNER_SELECTED',
          details: { winnerUserId: state.highestBidder.userId, winningBid: state.currentHighestBid }
        })
      ]).catch(err => console.error(`[AuctionEngine] Failed to persist winner for ${auctionId}:`, err))
    } else {
      console.log(`[AuctionEngine] Auction ${auctionId} closed with no winner.`)
    }

    // Async database persistence for auction closure
    Promise.all([
      Auction.updateOne({ auctionId }, { $set: { status: 'CLOSED' } }, { upsert: true }),
      Timeline.create({
        auctionId,
        eventType: 'AUCTION_CLOSED',
        details: { 
          hasWinner: !!state.highestBidder,
          winningBid: state.currentHighestBid 
        }
      })
    ]).catch(err => console.error(`[AuctionEngine] Failed to persist closure for ${auctionId}:`, err))

    return state
  }

  /**
   * Logs a payment status update to the timeline.
   * @param {string} auctionId
   * @param {string} status - e.g., 'PENDING', 'COMPLETED', 'FAILED'
   * @param {Object} metadata - Optional additional details
   */
  logPaymentStatus(auctionId, status, metadata = {}) {
    Timeline.create({
      auctionId,
      eventType: 'PAYMENT_STATUS_UPDATED',
      details: { status, ...metadata }
    }).catch(err => console.error(`[AuctionEngine] Failed to persist payment status for ${auctionId}:`, err))
  }
}

// Export singleton instance of authoritative auction engine
const auctionEngineService = new AuctionEngineService()
module.exports = auctionEngineService
