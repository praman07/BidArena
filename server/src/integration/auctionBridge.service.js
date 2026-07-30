/**
 * Domain A ↔ Domain B integration bridge.
 * Keeps Domain A client events and Domain B auction-engine as the bid/timer/winner core.
 */
const mongoose = require('mongoose')
const Auction = require('../models/Auction')
const auctionEngine = require('../auction-engine/AuctionEngine')
const auctionTimer = require('../auction-engine/TimerManager')
const auctionRoomStore = require('../auction-engine/RecoveryManager')
const liveAuctionService = require('../services/liveAuction.service')
const ApiError = require('../utils/ApiError')

const MARKETPLACE_ROOM = 'marketplace'

const remainingSecondsFor = (endTime) => liveAuctionService.remainingSecondsFor(endTime)

/**
 * Registers a Mongo auction document into Domain B engine (+ starts timer when live).
 */
const registerAuction = (auctionDoc, { startTimer = true } = {}) => {
  if (!auctionDoc?._id) return null

  const auctionId = auctionDoc._id.toString()
  const startingPrice = Number(auctionDoc.startingBid ?? auctionDoc.startingPrice ?? 0)
  const minIncrement = Number(auctionDoc.bidIncrement ?? auctionDoc.minIncrement ?? 1)
  const currentBid = Number(auctionDoc.currentBid ?? auctionDoc.currentHighestBid ?? startingPrice)
  const sellerId =
    auctionDoc.seller?._id?.toString?.() ||
    auctionDoc.seller?.toString?.() ||
    null

  const existing = auctionEngine.auctions?.get?.(auctionId)
  if (!existing) {
    auctionEngine.initAuction({
      auctionId,
      title: auctionDoc.title,
      startingPrice,
      minIncrement,
      status:
        auctionDoc.status === 'ENDED' || auctionDoc.status === 'CANCELLED'
          ? 'ENDED'
          : 'ACTIVE',
      sellerId,
      mongoKey: auctionDoc.auctionId || auctionId,
      endTime: auctionDoc.endTime,
      startTime: auctionDoc.startTime,
    })
  } else {
    existing.title = auctionDoc.title || existing.title
    existing.minIncrement = minIncrement
    existing.startingPrice = startingPrice
    existing.sellerId = sellerId || existing.sellerId
    existing.mongoKey = auctionDoc.auctionId || existing.mongoKey
    existing.endTime = auctionDoc.endTime
    existing.startTime = auctionDoc.startTime
    if (auctionDoc.status === 'ENDED' || auctionDoc.status === 'CANCELLED') {
      existing.status = 'ENDED'
    } else if (existing.status !== 'ENDED') {
      existing.status = 'ACTIVE'
    }
  }

  // Hydrate live bid mirror from Mongo when re-registering after restart
  const state = auctionEngine.getAuctionState(auctionId)
  if (state) {
    state.sellerId = state.sellerId || sellerId
    state.mongoKey = state.mongoKey || auctionDoc.auctionId || auctionId
    state.endTime = auctionDoc.endTime
    state.startTime = auctionDoc.startTime
    if (currentBid > Number(state.currentHighestBid || 0)) {
      state.currentHighestBid = currentBid
    }
    if (auctionDoc.highestBidder) {
      const hb = auctionDoc.highestBidder
      state.highestBidder = {
        userId: hb._id?.toString?.() || hb.toString?.() || hb.userId || String(hb),
        username: hb.username || 'Bidder',
      }
    }
    if (auctionDoc.status === 'ENDED' || auctionDoc.status === 'CANCELLED') {
      state.status = 'ENDED'
    }
    if (typeof auctionDoc.totalBidsCount === 'number') {
      state.totalBidsCount = Math.max(state.totalBidsCount || 0, auctionDoc.totalBidsCount)
    }
  }

  if (startTimer) {
    ensureTimer(auctionId, auctionDoc.endTime, auctionDoc.startTime, auctionDoc.status)
  }

  return state
}

const ensureTimer = (auctionId, endTime, startTime, status) => {
  if (status === 'ENDED' || status === 'CANCELLED' || status === 'DRAFT') return
  if (auctionTimer.getTime(auctionId) != null) return

  const now = Date.now()
  const start = startTime ? new Date(startTime).getTime() : 0
  const remaining = remainingSecondsFor(endTime)
  if (remaining <= 0) return
  if (start && now < start) return

  auctionTimer.startTimer(auctionId, remaining)
}

/**
 * Hydrates engine from Mongo if the process restarted.
 */
const ensureRegistered = async (auctionId) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  let state = auctionEngine.auctions?.get?.(auctionId) || null
  if (state) {
    ensureTimer(auctionId, state.endTime, state.startTime, state.status)
    return state
  }

  const auction = await Auction.findById(auctionId)
  if (!auction) throw ApiError.notFound('Auction not found')
  return registerAuction(auction)
}

/**
 * Places a bid through Domain B AuctionEngine, then returns Domain A–shaped payloads.
 */
const placeBidViaEngine = async ({ auctionId, user, amount, socketId }) => {
  await ensureRegistered(auctionId)

  const result = await auctionEngine.processBid(auctionId, {
    auctionId,
    amount,
    socketId,
    user: {
      userId: user.id || user.userId,
      username: user.username,
      role: user.role,
    },
  })

  if (!result?.success) {
    throw ApiError.badRequest(result?.message || 'Bid rejected')
  }

  // Let Mongo catch up briefly, then return authoritative live snapshot for UI
  const live = await liveAuctionService.getLiveAuctionState(auctionId)

  return {
    engine: result,
    live,
    bid: {
      id: result.bidRecord.bidId,
      bidId: result.bidRecord.bidId,
      amount: result.bidRecord.amount,
      time: result.bidRecord.timestamp,
      createdAt: result.bidRecord.timestamp,
      user: {
        id: result.bidRecord.userId,
        username: result.bidRecord.username,
      },
      status: 'Leading',
    },
  }
}

const joinRoomPresence = (auctionId, socketId, user) => {
  try {
    return auctionRoomStore.joinRoom(auctionId, socketId, {
      userId: user?.id,
      username: user?.username,
      role: user?.role || 'bidder',
    })
  } catch {
    return null
  }
}

const leaveRoomPresence = (auctionId, socketId) => {
  try {
    return auctionRoomStore.leaveRoom(auctionId, socketId)
  } catch {
    return null
  }
}

module.exports = {
  MARKETPLACE_ROOM,
  registerAuction,
  ensureRegistered,
  ensureTimer,
  placeBidViaEngine,
  joinRoomPresence,
  leaveRoomPresence,
  remainingSecondsFor,
}
