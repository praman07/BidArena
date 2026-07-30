const mongoose = require('mongoose')

const winnerSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  winningBid: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const Winner = mongoose.model('Winner', winnerSchema)

module.exports = Winner
