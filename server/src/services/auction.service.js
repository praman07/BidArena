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

  const auction = await Auction.findById(id).populate(
    'seller',
    'username email avatar createdAt'
  )

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

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
}
