const mongoose = require('mongoose')

const timelineSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, index: true },
  eventType: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const Timeline = mongoose.model('Timeline', timelineSchema)

module.exports = Timeline
