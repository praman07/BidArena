const mongoose = require('mongoose')
const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const Winner = require('../models/Winner')

const toObjectId = (id) => new mongoose.Types.ObjectId(id)

const formatRelativeTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const diffMs = Date.now() - date.getTime()
  if (diffMs < 60_000) return 'Just now'
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} min ago`
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)} hr ago`
  if (diffMs < 86_400_000 * 7) return `${Math.floor(diffMs / 86_400_000)} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const resolveDisplayStatus = (auction) => {
  const now = Date.now()
  const start = new Date(auction.startTime).getTime()
  const end = new Date(auction.endTime).getTime()
  if (auction.status === 'ENDED' || now >= end) return 'ENDED'
  if (auction.status === 'DRAFT') return 'DRAFT'
  if (now < start) return 'UPCOMING'
  return 'LIVE'
}

const getStats = async (userId) => {
  const sellerId = toObjectId(userId)

  const [auctionStats, totalBidsPlaced, wonAuctions] = await Promise.all([
    Auction.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          totalAuctions: { $sum: 1 },
          activeAuctions: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] },
          },
          endedAuctions: {
            $sum: { $cond: [{ $eq: ['$status', 'ENDED'] }, 1, 0] },
          },
        },
      },
    ]),
    Bid.countDocuments({ userId: sellerId }),
    Winner.countDocuments({ userId: sellerId }),
  ])

  const stats = auctionStats[0] || {
    totalAuctions: 0,
    activeAuctions: 0,
    endedAuctions: 0,
  }

  return {
    totalAuctions: stats.totalAuctions || 0,
    activeAuctions: stats.activeAuctions || 0,
    endedAuctions: stats.endedAuctions || 0,
    wonAuctions: wonAuctions || 0,
    totalBidsPlaced: totalBidsPlaced || 0,
  }
}

const getRecentAuctions = async (userId) => {
  const auctions = await Auction.find({ seller: userId })
    .sort({ createdAt: -1 })
    .limit(5)

  return auctions.map((auction) => {
    const json = auction.toPublicJSON()
    return {
      ...json,
      displayStatus: resolveDisplayStatus(auction),
    }
  })
}

const getRecentActivity = async (userId) => {
  const sellerId = toObjectId(userId)

  const [createdAuctions, bids, wins, endedAuctions] = await Promise.all([
    Auction.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title images createdAt status auctionId'),
    Bid.find({ userId: sellerId })
      .sort({ timestamp: -1, createdAt: -1 })
      .limit(10),
    Winner.find({ userId: sellerId }).sort({ timestamp: -1, createdAt: -1 }).limit(10),
    Auction.find({ seller: sellerId, status: 'ENDED' })
      .sort({ endTime: -1, updatedAt: -1 })
      .limit(10)
      .select('title images endTime updatedAt auctionId'),
  ])

  const bidAuctionIds = [...new Set(bids.map((bid) => bid.auctionId).filter(Boolean))]
  const winAuctionIds = [...new Set(wins.map((win) => win.auctionId).filter(Boolean))]
  const lookupIds = [...new Set([...bidAuctionIds, ...winAuctionIds])]

  const relatedAuctions = lookupIds.length
    ? await Auction.find({
        $or: [
          { auctionId: { $in: lookupIds } },
          {
            _id: {
              $in: lookupIds
                .filter((id) => mongoose.Types.ObjectId.isValid(id))
                .map((id) => toObjectId(id)),
            },
          },
        ],
      }).select('title images auctionId')
    : []

  const auctionByKey = new Map()
  relatedAuctions.forEach((auction) => {
    auctionByKey.set(auction.auctionId, auction)
    auctionByKey.set(auction._id.toString(), auction)
  })

  const activity = []

  createdAuctions.forEach((auction) => {
    activity.push({
      id: `created-${auction._id}`,
      type: 'created',
      title: 'Auction Created',
      detail: `Listed ${auction.title}`,
      time: formatRelativeTime(auction.createdAt),
      timestamp: new Date(auction.createdAt).getTime(),
      image: auction.images?.[0] || null,
    })
  })

  bids.forEach((bid) => {
    const auction = auctionByKey.get(bid.auctionId)
    activity.push({
      id: `bid-${bid._id}`,
      type: 'bid',
      title: 'Bid Placed',
      detail: auction
        ? `Bid $${Number(bid.amount).toLocaleString('en-US')} on ${auction.title}`
        : `Bid $${Number(bid.amount).toLocaleString('en-US')}`,
      time: formatRelativeTime(bid.timestamp || bid.createdAt),
      timestamp: new Date(bid.timestamp || bid.createdAt).getTime(),
      image: auction?.images?.[0] || null,
    })
  })

  wins.forEach((win) => {
    const auction = auctionByKey.get(win.auctionId)
    activity.push({
      id: `won-${win._id}`,
      type: 'won',
      title: 'Auction Won',
      detail: auction
        ? `Won ${auction.title} for $${Number(win.winningBid).toLocaleString('en-US')}`
        : `Won auction for $${Number(win.winningBid).toLocaleString('en-US')}`,
      time: formatRelativeTime(win.timestamp || win.createdAt),
      timestamp: new Date(win.timestamp || win.createdAt).getTime(),
      image: auction?.images?.[0] || null,
    })
  })

  endedAuctions.forEach((auction) => {
    activity.push({
      id: `ended-${auction._id}`,
      type: 'ended',
      title: 'Auction Ended',
      detail: `${auction.title} has ended`,
      time: formatRelativeTime(auction.endTime || auction.updatedAt),
      timestamp: new Date(auction.endTime || auction.updatedAt).getTime(),
      image: auction.images?.[0] || null,
    })
  })

  return activity
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)
    .map(({ timestamp, ...rest }) => rest)
}

module.exports = {
  getStats,
  getRecentAuctions,
  getRecentActivity,
}
