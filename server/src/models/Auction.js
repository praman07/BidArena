const mongoose = require('mongoose')

// TODO: Define Auction schema fields and methods
const auctionSchema = new mongoose.Schema({}, { timestamps: true })

const Auction = mongoose.model('Auction', auctionSchema)

module.exports = Auction
