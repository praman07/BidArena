const { validateBid } = require('./BidValidator')
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
        sellerId: data.sellerId || null,
        mongoKey: data.mongoKey || auctionId,
        endTime: data.endTime || null,
        startTime: data.startTime || null,
        createdAt: new Date(),
      })

      // --- ASYNC DATABASE PERSISTENCE ---
      Promise.all([
        Timeline.create({
          auctionId,
          eventType: 'AUCTION_CREATED',
          details: { startingPrice, minIncrement },
        }),
        Timeline.create({
          auctionId,
          eventType: 'AUCTION_STARTED',
          details: { status: data.status || 'ACTIVE' },
        }),
      ]).catch((err) =>
        console.error(`[AuctionEngine] Failed to persist creation timeline for ${auctionId}:`, err)
      )
    }

    return this.auctions.get(auctionId)
  }

  /**
   * Hydrates the authoritative auction state from MongoDB if it doesn't exist in memory.
   * @param {string} auctionId
   */
  async hydrateAuction(auctionId) {
    if (this.auctions.has(auctionId)) return;

    try {
      const auction = await Auction.findOne({ auctionId }).lean();
      if (!auction) {
        this.initAuction({ auctionId });
        return;
      }

      const bids = await Bid.find({ auctionId }).sort({ timestamp: -1 }).limit(50).lean();

      const startingPrice = Number(auction.startingPrice) || Number(auction.startingBid) || 0;
      const minIncrement = Number(auction.minIncrement) || Number(auction.bidIncrement) || 1;
      const currentHighestBid = Number(auction.currentHighestBid) || Number(auction.currentBid) || startingPrice;

      this.auctions.set(auctionId, {
        auctionId,
        title: auction.title || `Auction ${auctionId}`,
        status: auction.status || 'ACTIVE',
        startingPrice,
        minIncrement,
        currentHighestBid,
        highestBidder: auction.highestBidder ? { userId: auction.highestBidder } : null,
        totalBidsCount: auction.totalBidsCount || 0,
        lastBidAt: auction.lastBidAt || null,
        bidHistory: bids || [],
        createdAt: auction.createdAt || new Date(),
      });

      if (auction.status === 'ACTIVE' && auction.endTime) {
        const remaining = Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000);
        if (remaining > 0) {
          const auctionTimerService = require('./TimerManager');
          auctionTimerService.startTimer(auctionId, remaining);
        } else {
          this.closeAuction(auctionId);
        }
      }
    } catch (err) {
      console.error(`[AuctionEngine] Failed to hydrate auction ${auctionId}:`, err);
      this.initAuction({ auctionId });
    }
  }

  /**
   * Gets the authoritative state snapshot of an auction.
   * Does not auto-create empty auctions (Domain A registers via bridge).
   */
  getAuctionState(auctionId) {
    return this.auctions.get(auctionId) || null
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

    await this.hydrateAuction(auctionId);

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
  async _executeAtomicBidUpdate(auctionId, bidPayload) {
    const state = this.getAuctionState(auctionId)
    if (!state) {
      return {
        success: false,
        code: 'AUCTION_NOT_FOUND',
        message: `Auction with ID '${auctionId}' does not exist`,
      }
    }

    // Reject late bids if auction is closed/locked
    if (state.status !== 'ACTIVE' && state.status !== 'LIVE') {
      return {
        success: false,
        code: 'AUCTION_CLOSED',
        message: `Auction with ID '${auctionId}' is no longer active.`,
      }
    }

    // Build current state context for validator
    const stateContext = {
      status: state.status === 'LIVE' ? 'ACTIVE' : state.status,
      currentHighestBid: state.currentHighestBid,
      currentHighestBidderId: state.highestBidder?.userId || null,
      minIncrement: state.minIncrement,
      startingPrice: state.startingPrice,
      sellerId: state.sellerId || null,
    }

    // Execute validation rules against live state
    const validation = validateBid(
      { ...bidPayload, auctionId: bidPayload.auctionId || auctionId },
      stateContext
    )
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
    state.status = 'ACTIVE'
    state.bidHistory.unshift(bidRecord)

    // Keep history capped at last 50 bids for memory efficiency
    if (state.bidHistory.length > 50) {
      state.bidHistory.pop()
    }

    const mongoKey = state.mongoKey || auctionId

    // Persist before acknowledging so Domain A live reads stay consistent
    try {
      await Promise.all([
        Bid.create({
          bidId: bidRecord.bidId,
          auctionId: mongoKey,
          userId: bidRecord.userId,
          amount: bidAmount,
          timestamp: bidRecord.timestamp,
        }),
        Auction.findByIdAndUpdate(auctionId, {
          $set: {
            currentBid: bidAmount,
            currentHighestBid: bidAmount,
            highestBidder: bidRecord.userId,
            totalBidsCount: state.totalBidsCount,
            lastBidAt: bidRecord.timestamp,
            status: 'LIVE',
          },
          $addToSet: { participants: bidRecord.userId },
        }),
        Timeline.create({
          auctionId: mongoKey,
          eventType: 'BID_PLACED',
          details: { bidId: bidRecord.bidId, amount: bidAmount, userId: bidRecord.userId },
          timestamp: bidRecord.timestamp,
        }),
      ])
    } catch (err) {
      console.error(`[AuctionEngine] Failed to persist bid ${bidRecord.bidId}:`, err)
    }

    // Prepare clean payload for broadcasting
    const broadcastPayload = {
      auctionId: state.auctionId,
      currentHighestBid: state.currentHighestBid,
      currentBid: state.currentHighestBid,
      highestBidder: {
        id: state.highestBidder.userId,
        userId: state.highestBidder.userId,
        username: state.highestBidder.username,
      },
      totalBidsCount: state.totalBidsCount,
      lastBidAt: state.lastBidAt,
      latestBid: bidRecord,
      status: 'LIVE',
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
    if (!state || state.status === 'ENDED' || state.status === 'CLOSED') {
      return null
    }

    // Lock the auction (Domain A schema uses ENDED)
    state.status = 'ENDED'

    const broadcastService = require('./BroadcastManager')

    // Broadcast final state
    broadcastService.broadcastAuctionState(auctionId, {
      ...state,
      status: 'ENDED',
      currentBid: state.currentHighestBid,
    })

    // Determine and broadcast winner
    if (state.highestBidder) {
      const winnerPayload = {
        auctionId: state.auctionId,
        winner: {
          id: state.highestBidder.userId,
          userId: state.highestBidder.userId,
          username: state.highestBidder.username,
        },
        winningBid: state.currentHighestBid,
        winningAmount: state.currentHighestBid,
        amount: state.currentHighestBid,
      }
      broadcastService.broadcastAuctionWinner(auctionId, winnerPayload)

      const mongoKey = state.mongoKey || state.auctionId
      Promise.all([
        Winner.findOneAndUpdate(
          { auctionId: mongoKey },
          {
            auctionId: mongoKey,
            userId: state.highestBidder.userId,
            winningBid: state.currentHighestBid,
            timestamp: new Date(),
          },
          { upsert: true, new: true }
        ),
        Timeline.create({
          auctionId: mongoKey,
          eventType: 'WINNER_SELECTED',
          details: {
            winnerUserId: state.highestBidder.userId,
            winningBid: state.currentHighestBid,
          },
        }),
      ]).catch((err) =>
        console.error(`[AuctionEngine] Failed to persist winner for ${auctionId}:`, err)
      )
    }

    // Persist auction closure on Mongo _id
    const closureUpdate = {
      status: 'ENDED',
    }
    if (state.highestBidder) {
      closureUpdate.winner = state.highestBidder.userId
      closureUpdate.highestBidder = state.highestBidder.userId
      closureUpdate.paymentStatus = 'PENDING'
      closureUpdate.transactionAmount = state.currentHighestBid
      closureUpdate.currentBid = state.currentHighestBid
      closureUpdate.currentHighestBid = state.currentHighestBid
    }

    Promise.all([
      Auction.findByIdAndUpdate(auctionId, { $set: closureUpdate }),
      Timeline.create({
        auctionId: state.mongoKey || auctionId,
        eventType: 'AUCTION_CLOSED',
        details: {
          hasWinner: !!state.highestBidder,
          winningBid: state.currentHighestBid,
        },
      }),
    ]).catch((err) =>
      console.error(`[AuctionEngine] Failed to persist closure for ${auctionId}:`, err)
    )

    broadcastService.broadcastTimerEnded(auctionId)

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
