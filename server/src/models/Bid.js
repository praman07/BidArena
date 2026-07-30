const mongoose = require('mongoose')

/**
 * Bid document
 * - auction  → auctionId (string: auction.auctionId or Auction._id)
 * - bidder   → userId (ObjectId ref User)
 * - amount
 * - createdAt (via timestamps)
 */
const bidSchema = new mongoose.Schema(
  {
    bidId: { type: String, required: true, unique: true },
    auctionId: { type: String, required: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

bidSchema.virtual('auction').get(function getAuction() {
  return this.auctionId
})

bidSchema.virtual('bidder').get(function getBidder() {
  return this.userId
})

bidSchema.index({ auctionId: 1, amount: -1, createdAt: -1 })

const Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid
