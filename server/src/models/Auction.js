const mongoose = require('mongoose')

const auctionSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  startingPrice: { type: Number, required: true },
  currentHighestBid: { type: Number, default: 0 },
  minIncrement: { type: Number, default: 1 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBidsCount: { type: Number, default: 0 },
  lastBidAt: { type: Date }
}, { timestamps: true })

const Auction = mongoose.model('Auction', auctionSchema)

module.exports = Auction
