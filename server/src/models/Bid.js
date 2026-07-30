const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
  bidId: { type: String, required: true, unique: true },
  auctionId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid
