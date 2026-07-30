const crypto = require('crypto')
const mongoose = require('mongoose')
const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const Winner = require('../models/Winner')
const ApiError = require('../utils/ApiError')

/** Sequential bid queues keyed by Mongo auction _id string. */
const bidQueues = new Map()

const roomName = (auctionId) => `auction_${auctionId}`

const remainingSecondsFor = (endTime) => {
  const end = new Date(endTime).getTime()
  if (Number.isNaN(end)) return 0
  return Math.max(0, Math.floor((end - Date.now()) / 1000))
}

const mapBidRow = (bid, index) => {
  const user = bid.userId
  return {
    id: bid._id.toString(),
    bidId: bid.bidId,
    amount: bid.amount,
    time: bid.timestamp || bid.createdAt,
    createdAt: bid.createdAt || bid.timestamp,
    user:
      user && typeof user === 'object'
        ? {
            id: user._id?.toString?.() || user.id,
            username: user.username,
            avatar: user.avatar,
          }
        : { id: String(bid.userId), username: 'Bidder', avatar: null },
    status: index === 0 ? 'Leading' : 'Outbid',
  }
}

const mapHighestBidder = (bidder) => {
  if (!bidder) return null
  if (typeof bidder === 'object' && bidder.username) {
    return {
      id: bidder._id?.toString?.() || bidder.id,
      username: bidder.username,
      avatar: bidder.avatar || null,
    }
  }
  return { id: String(bidder), username: 'Bidder', avatar: null }
}

/**
 * Loads live auction snapshot from MongoDB (source of truth).
 */
const getLiveAuctionState = async (auctionId) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(auctionId)
    .populate('seller', 'username email avatar createdAt')
    .populate('highestBidder', 'username avatar')

  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  const remainingSeconds = remainingSecondsFor(auction.endTime)

  // Sync ENDED status if timer already elapsed
  if (
    remainingSeconds === 0 &&
    auction.status !== 'ENDED' &&
    auction.status !== 'CANCELLED' &&
    auction.status !== 'DRAFT'
  ) {
    auction.status = 'ENDED'
    await auction.save()
  }

  const bids = await Bid.find({
    $or: [{ auctionId: auction.auctionId }, { auctionId: auction._id.toString() }],
  })
    .populate('userId', 'username avatar')
    .sort({ amount: -1, timestamp: -1, createdAt: -1 })
    .limit(50)

  const participants = Array.isArray(auction.participants) ? auction.participants.length : 0

  return {
    auctionId: auction._id.toString(),
    auction: {
      ...auction.toPublicJSON(),
      highestBidder: mapHighestBidder(auction.highestBidder),
      totalBidsCount: auction.totalBidsCount || bids.length,
      remainingSeconds,
    },
    currentBid: auction.currentBid ?? auction.startingBid ?? 0,
    bidIncrement: auction.bidIncrement ?? 1,
    highestBidder: mapHighestBidder(auction.highestBidder),
    participants,
    bids: bids.map(mapBidRow),
    remainingSeconds,
    status: auction.status,
    endTime: auction.endTime,
    startTime: auction.startTime,
  }
}

/**
 * Places a bid atomically (queued per auction). Validates increment rules.
 */
const placeBid = async ({ auctionId, userId, amount }) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const previous = bidQueues.get(auctionId) || Promise.resolve()
  const run = previous.catch(() => {}).then(() => executePlaceBid({ auctionId, userId, amount }))
  bidQueues.set(
    auctionId,
    run.catch(() => {})
  )
  return run
}

const executePlaceBid = async ({ auctionId, userId, amount }) => {
  const auction = await Auction.findById(auctionId)
  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  if (auction.status === 'ENDED' || auction.status === 'CANCELLED') {
    throw ApiError.badRequest('This auction has ended')
  }

  if (auction.status === 'DRAFT') {
    throw ApiError.badRequest('This auction is not open for bidding')
  }

  const now = Date.now()
  if (now < new Date(auction.startTime).getTime()) {
    throw ApiError.badRequest('This auction has not started yet')
  }
  if (now >= new Date(auction.endTime).getTime()) {
    auction.status = 'ENDED'
    await auction.save()
    throw ApiError.badRequest('This auction has ended')
  }

  const sellerId = auction.seller?.toString?.() || String(auction.seller)
  if (sellerId === userId.toString()) {
    throw ApiError.badRequest('You cannot bid on your own auction')
  }

  const bidAmount = Number(amount)
  if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
    throw ApiError.badRequest('Enter a valid bid amount')
  }

  const currentBid = Number(auction.currentBid ?? auction.startingBid ?? 0)
  const increment = Number(auction.bidIncrement ?? auction.minIncrement ?? 1)
  const minRequired = currentBid + increment

  if (bidAmount <= currentBid) {
    throw ApiError.badRequest(`Bid must be greater than the current bid (${currentBid})`)
  }
  if (bidAmount < minRequired) {
    throw ApiError.badRequest(
      `Bid must be at least ${minRequired} (current bid + increment)`
    )
  }

  const bid = await Bid.create({
    bidId: `bid_${crypto.randomBytes(8).toString('hex')}`,
    auctionId: auction.auctionId || auction._id.toString(),
    userId,
    amount: bidAmount,
    timestamp: new Date(),
  })

  auction.currentBid = bidAmount
  auction.currentHighestBid = bidAmount
  auction.highestBidder = userId
  auction.totalBidsCount = (auction.totalBidsCount || 0) + 1
  auction.lastBidAt = new Date()
  if (auction.status !== 'LIVE' && auction.status !== 'ACTIVE') {
    auction.status = 'LIVE'
  }

  const participantIds = (auction.participants || []).map((id) => id.toString())
  if (!participantIds.includes(userId.toString())) {
    auction.participants = [...(auction.participants || []), userId]
  }

  await auction.save()
  await auction.populate('highestBidder', 'username avatar')
  await bid.populate('userId', 'username avatar')

  const bids = await Bid.find({
    $or: [{ auctionId: auction.auctionId }, { auctionId: auction._id.toString() }],
  })
    .populate('userId', 'username avatar')
    .sort({ amount: -1, timestamp: -1, createdAt: -1 })
    .limit(50)

  return {
    bid: mapBidRow(bid, 0),
    auction: {
      ...auction.toPublicJSON(),
      highestBidder: mapHighestBidder(auction.highestBidder),
      totalBidsCount: auction.totalBidsCount,
      remainingSeconds: remainingSecondsFor(auction.endTime),
    },
    currentBid: bidAmount,
    highestBidder: mapHighestBidder(auction.highestBidder),
    participants: auction.participants.length,
    bids: bids.map(mapBidRow),
    remainingSeconds: remainingSecondsFor(auction.endTime),
    status: auction.status,
  }
}

/**
 * Ends an auction and records the winner (highest bidder).
 */
const endAuction = async (auctionId) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(auctionId).populate(
    'highestBidder',
    'username avatar'
  )
  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  if (auction.status !== 'ENDED') {
    auction.status = 'ENDED'
    await auction.save()
  }

  let winnerPayload = null
  const highest = auction.highestBidder

  if (highest) {
    const winningAmount = auction.currentBid ?? auction.currentHighestBid ?? 0
    const key = auction.auctionId || auction._id.toString()

    await Winner.findOneAndUpdate(
      { auctionId: key },
      {
        auctionId: key,
        userId: highest._id || highest,
        winningBid: winningAmount,
        timestamp: new Date(),
      },
      { upsert: true, new: true }
    )

    winnerPayload = {
      auctionId: auction._id.toString(),
      winner: mapHighestBidder(highest),
      winningAmount,
      amount: winningAmount,
    }
  }

  return {
    auctionId: auction._id.toString(),
    status: 'ENDED',
    auction: {
      ...auction.toPublicJSON(),
      highestBidder: mapHighestBidder(auction.highestBidder),
      status: 'ENDED',
      remainingSeconds: 0,
    },
    winner: winnerPayload,
  }
}

module.exports = {
  roomName,
  remainingSecondsFor,
  getLiveAuctionState,
  placeBid,
  endAuction,
}
