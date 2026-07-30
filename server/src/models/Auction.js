const mongoose = require('mongoose')

const AUCTION_STATUSES = ['DRAFT', 'ACTIVE', 'UPCOMING', 'LIVE', 'ENDED', 'CANCELLED']
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED']

const auctionSchema = new mongoose.Schema(
  {
    auctionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    startingBid: {
      type: Number,
      required: true,
      min: 0,
    },
    currentBid: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bidIncrement: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one image is required',
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: AUCTION_STATUSES,
      default: 'ACTIVE',
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    shippingAvailable: {
      type: Boolean,
      default: false,
    },
    pickupAvailable: {
      type: Boolean,
      default: false,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    privateNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    // Auction-engine compatible mirrors
    startingPrice: {
      type: Number,
      required: true,
    },
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    minIncrement: {
      type: Number,
      default: 1,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'PENDING',
      index: true,
    },
    paymentId: {
      type: String,
      default: '',
    },
    orderId: {
      type: String,
      default: '',
    },
    signature: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      default: '',
    },
    transactionAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalBidsCount: {
      type: Number,
      default: 0,
    },
    lastBidAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

auctionSchema.index({ endTime: 1, status: 1 })

const mapUserRef = (user) => {
  if (!user) return null
  if (typeof user === 'object' && (user.username || user.email)) {
    return {
      id: user._id?.toString?.() || user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }
  }
  return user._id?.toString?.() || user.toString?.() || user
}

auctionSchema.methods.toPublicJSON = function toPublicJSON() {
  const seller = this.seller
  const sellerPayload =
    seller && typeof seller === 'object' && seller.username
      ? {
          id: seller._id?.toString?.() || seller.id,
          username: seller.username,
          email: seller.email,
          avatar: seller.avatar,
        }
      : seller

  return {
    id: this._id.toString(),
    auctionId: this.auctionId,
    title: this.title,
    description: this.description,
    shortDescription: this.shortDescription,
    category: this.category,
    brand: this.brand,
    condition: this.condition,
    startingBid: this.startingBid,
    currentBid: this.currentBid,
    reservePrice: this.reservePrice,
    bidIncrement: this.bidIncrement,
    images: this.images,
    seller: sellerPayload,
    participants: this.participants,
    participantCount: Array.isArray(this.participants) ? this.participants.length : 0,
    highestBidder: mapUserRef(this.highestBidder),
    winner: mapUserRef(this.winner),
    totalBidsCount: this.totalBidsCount || 0,
    status: this.status,
    paymentStatus: this.paymentStatus || 'PENDING',
    paymentId: this.paymentId || '',
    orderId: this.orderId || '',
    paidAt: this.paidAt || null,
    paymentMethod: this.paymentMethod || '',
    transactionAmount: this.transactionAmount || 0,
    startTime: this.startTime,
    endTime: this.endTime,
    timezone: this.timezone,
    shippingAvailable: this.shippingAvailable,
    pickupAvailable: this.pickupAvailable,
    shippingCost: this.shippingCost,
    location: this.location,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

const Auction = mongoose.model('Auction', auctionSchema)

module.exports = Auction
module.exports.AUCTION_STATUSES = AUCTION_STATUSES
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES
