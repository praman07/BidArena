const crypto = require('crypto')
const mongoose = require('mongoose')
const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const uploadService = require('./upload.service')
const ApiError = require('../utils/ApiError')

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true' || value === '1'
  return Boolean(value)
}

const resolveStatus = (startTime, endTime, { asDraft = false } = {}) => {
  if (asDraft) return 'DRAFT'
  const now = Date.now()
  if (now >= endTime.getTime()) return 'ENDED'
  return 'ACTIVE'
}

const mapBid = (bid, index) => {
  const user = bid.userId
  return {
    id: bid._id.toString(),
    bidId: bid.bidId,
    amount: bid.amount,
    time: bid.timestamp || bid.createdAt,
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

const createAuction = async ({ sellerId, payload, files = [] }) => {
  if (!files.length) {
    throw ApiError.badRequest('At least one image is required')
  }

  const imageUrls = await uploadService.uploadImages(files)

  const startingBid = Number(payload.startingBid)
  const reservePrice = Number(payload.reservePrice)
  const bidIncrement = Number(payload.bidIncrement)
  const startTime = new Date(payload.startTime)
  const endTime = new Date(payload.endTime)
  const asDraft = parseBoolean(payload.saveAsDraft)
  const status = resolveStatus(startTime, endTime, { asDraft })

  const auction = await Auction.create({
    auctionId: `auc_${crypto.randomBytes(8).toString('hex')}`,
    title: payload.title.trim(),
    description: payload.description.trim(),
    shortDescription: payload.shortDescription?.trim() || '',
    category: payload.category.trim(),
    brand: payload.brand?.trim() || '',
    condition: payload.condition.trim(),
    startingBid,
    currentBid: startingBid,
    reservePrice,
    bidIncrement,
    images: imageUrls,
    seller: sellerId,
    participants: [],
    status,
    startTime,
    endTime,
    timezone: payload.timezone || 'UTC',
    shippingAvailable: parseBoolean(payload.shippingAvailable),
    pickupAvailable: parseBoolean(payload.pickupAvailable),
    shippingCost: Number(payload.shippingCost) || 0,
    location: payload.location.trim(),
    privateNotes: payload.privateNotes?.trim() || '',
    startingPrice: startingBid,
    currentHighestBid: startingBid,
    minIncrement: bidIncrement,
  })

  await auction.populate('seller', 'username email avatar createdAt')
  return auction
}

const getAllAuctions = async ({ page = 1, limit = 12 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12))
  const skip = (pageNum - 1) * limitNum

  const filter = { status: 'ACTIVE' }

  const [auctions, total] = await Promise.all([
    Auction.find(filter)
      .populate('seller', 'username email avatar createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Auction.countDocuments(filter),
  ])

  return {
    auctions: auctions.map((auction) => auction.toPublicJSON()),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
  }
}

const getAuctionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(id)
    .populate('seller', 'username email avatar createdAt')
    .populate('highestBidder', 'username avatar')

  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  const [bids, related] = await Promise.all([
    Bid.find({
      $or: [{ auctionId: auction.auctionId }, { auctionId: auction._id.toString() }],
    })
      .populate('userId', 'username avatar')
      .sort({ amount: -1, timestamp: -1, createdAt: -1 })
      .limit(50),
    Auction.find({
      status: 'ACTIVE',
      category: auction.category,
      _id: { $ne: auction._id },
    })
      .populate('seller', 'username email avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(4),
  ])

  return {
    auction: {
      ...auction.toPublicJSON(),
      bids: bids.map(mapBid),
    },
    relatedAuctions: related.map((item) => item.toPublicJSON()),
  }
}

const resolveDisplayStatus = (auction) => {
  const now = Date.now()
  const start = new Date(auction.startTime).getTime()
  const end = new Date(auction.endTime).getTime()
  if (auction.status === 'ENDED' || now >= end) return 'ENDED'
  if (auction.status === 'DRAFT') return 'DRAFT'
  if (now < start) return 'UPCOMING'
  return 'ACTIVE'
}

const assertOwner = (auction, userId) => {
  const sellerId = auction.seller?._id?.toString?.() || auction.seller?.toString?.()
  if (!sellerId || sellerId !== userId.toString()) {
    throw ApiError.forbidden('You can only manage your own auctions')
  }
}

const getMyAuctions = async (userId) => {
  const auctions = await Auction.find({ seller: userId }).sort({ createdAt: -1 })

  const results = await Promise.all(
    auctions.map(async (auction) => {
      const totalBids = await Bid.countDocuments({
        $or: [{ auctionId: auction.auctionId }, { auctionId: auction._id.toString() }],
      })
      return {
        ...auction.toPublicJSON(),
        totalBids,
        displayStatus: resolveDisplayStatus(auction),
      }
    })
  )

  return results
}

const deleteAuction = async ({ auctionId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(auctionId)
  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  assertOwner(auction, userId)
  await auction.deleteOne()
  return { id: auctionId }
}

const updateAuction = async ({ auctionId, userId, payload }) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(auctionId)
  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  assertOwner(auction, userId)

  const startingBid = Number(payload.startingBid ?? auction.startingBid)
  const reservePrice = Number(payload.reservePrice ?? auction.reservePrice)
  const bidIncrement = Number(payload.bidIncrement ?? auction.bidIncrement)
  const startTime = payload.startTime ? new Date(payload.startTime) : auction.startTime
  const endTime = payload.endTime ? new Date(payload.endTime) : auction.endTime

  if (!(reservePrice >= startingBid)) {
    throw ApiError.badRequest('Reserve price must be at least the starting bid')
  }
  if (!(endTime > startTime)) {
    throw ApiError.badRequest('End date must be after the start date')
  }

  auction.title = payload.title?.trim() || auction.title
  auction.description = payload.description?.trim() || auction.description
  auction.shortDescription =
    payload.shortDescription !== undefined
      ? payload.shortDescription.trim()
      : auction.shortDescription
  auction.category = payload.category?.trim() || auction.category
  auction.brand = payload.brand !== undefined ? payload.brand.trim() : auction.brand
  auction.condition = payload.condition?.trim() || auction.condition
  auction.startingBid = startingBid
  auction.reservePrice = reservePrice
  auction.bidIncrement = bidIncrement
  auction.startTime = startTime
  auction.endTime = endTime
  auction.timezone = payload.timezone || auction.timezone
  auction.location = payload.location?.trim() || auction.location
  auction.privateNotes =
    payload.privateNotes !== undefined ? payload.privateNotes.trim() : auction.privateNotes
  auction.shippingAvailable =
    payload.shippingAvailable !== undefined
      ? parseBoolean(payload.shippingAvailable)
      : auction.shippingAvailable
  auction.pickupAvailable =
    payload.pickupAvailable !== undefined
      ? parseBoolean(payload.pickupAvailable)
      : auction.pickupAvailable
  auction.shippingCost =
    payload.shippingCost !== undefined ? Number(payload.shippingCost) || 0 : auction.shippingCost

  // Keep engine mirrors in sync
  auction.startingPrice = startingBid
  auction.minIncrement = bidIncrement
  if (!auction.currentBid || auction.currentBid < startingBid) {
    auction.currentBid = startingBid
    auction.currentHighestBid = startingBid
  }

  if (auction.status !== 'DRAFT') {
    auction.status = resolveStatus(startTime, endTime, { asDraft: false })
  }

  await auction.save()
  await auction.populate('seller', 'username email avatar createdAt')
  return auction
}

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getMyAuctions,
  deleteAuction,
  updateAuction,
}
