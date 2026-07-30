const crypto = require('crypto')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const env = require('../config/env')
const Auction = require('../models/Auction')
const Winner = require('../models/Winner')
const ApiError = require('../utils/ApiError')

let razorpayClient = null

const getRazorpay = () => {
  if (!env.razorpayEnabled) {
    throw ApiError.internal('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpayClient
}

const toIdString = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  return value._id?.toString?.() || value.id?.toString?.() || value.toString?.() || null
}

const assertAuctionEnded = (auction) => {
  const now = Date.now()
  const end = new Date(auction.endTime).getTime()
  const ended = auction.status === 'ENDED' || (!Number.isNaN(end) && now >= end)
  if (!ended) {
    throw ApiError.badRequest('Payment is only available after the auction ends')
  }
}

/**
 * Resolves the winning user id + amount from Auction + Winner collection.
 */
const resolveWinnerContext = async (auction) => {
  let winnerId = toIdString(auction.winner) || toIdString(auction.highestBidder)
  let winningAmount = Number(auction.transactionAmount || auction.currentBid || 0)

  const winnerDoc = await Winner.findOne({
    $or: [
      { auctionId: auction.auctionId },
      { auctionId: auction._id.toString() },
    ],
  })

  if (winnerDoc) {
    winnerId = toIdString(winnerDoc.userId) || winnerId
    winningAmount = Number(winnerDoc.winningBid) || winningAmount
  }

  if (!winnerId) {
    throw ApiError.badRequest('This auction has no winner to charge')
  }

  if (!(winningAmount > 0)) {
    throw ApiError.badRequest('Winning bid amount is invalid')
  }

  return { winnerId, winningAmount }
}

const loadAuctionForPayment = async (auctionId) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw ApiError.notFound('Auction not found')
  }

  const auction = await Auction.findById(auctionId)
    .populate('seller', 'username email avatar')
    .populate('winner', 'username email avatar')
    .populate('highestBidder', 'username email avatar')

  if (!auction) {
    throw ApiError.notFound('Auction not found')
  }

  return auction
}

/**
 * Creates a Razorpay order for the auction winner.
 */
const createOrder = async ({ auctionId, userId }) => {
  const auction = await loadAuctionForPayment(auctionId)

  assertAuctionEnded(auction)

  if (auction.paymentStatus === 'PAID') {
    throw ApiError.conflict('Payment has already been completed for this auction')
  }

  const { winnerId, winningAmount } = await resolveWinnerContext(auction)

  if (String(winnerId) !== String(userId)) {
    throw ApiError.forbidden('Only the auction winner can make this payment')
  }

  // Keep Auction.winner in sync for dashboard / details UI
  if (!auction.winner || toIdString(auction.winner) !== winnerId) {
    auction.winner = winnerId
  }
  if (!auction.transactionAmount || auction.transactionAmount <= 0) {
    auction.transactionAmount = winningAmount
  }
  if (auction.status !== 'ENDED') {
    auction.status = 'ENDED'
  }
  if (auction.paymentStatus === 'FAILED') {
    auction.paymentStatus = 'PENDING'
  }

  const amountPaise = Math.round(winningAmount * 100)
  if (!(amountPaise >= 100)) {
    throw ApiError.badRequest('Payment amount must be at least ₹1.00')
  }

  const receipt = `auction_${auction._id.toString()}`.slice(0, 40)

  const order = await getRazorpay().orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt,
    notes: {
      auctionId: auction._id.toString(),
      auctionCode: auction.auctionId,
      winnerId: String(winnerId),
    },
  })

  auction.orderId = order.id
  auction.paymentStatus = 'PENDING'
  await auction.save()

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.RAZORPAY_KEY_ID,
    auction: auction.toPublicJSON(),
  }
}

/**
 * Verifies Razorpay checkout signature and marks the auction as paid.
 */
const verifyPayment = async ({
  auctionId,
  userId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw ApiError.badRequest('Missing Razorpay payment details')
  }

  const auction = await loadAuctionForPayment(auctionId)

  assertAuctionEnded(auction)

  if (auction.paymentStatus === 'PAID') {
    throw ApiError.conflict('Payment has already been completed for this auction')
  }

  const { winnerId, winningAmount } = await resolveWinnerContext(auction)

  if (String(winnerId) !== String(userId)) {
    throw ApiError.forbidden('Only the auction winner can verify this payment')
  }

  if (auction.orderId && auction.orderId !== razorpay_order_id) {
    throw ApiError.badRequest('Order ID does not match this auction')
  }

  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))

  if (!valid) {
    auction.paymentStatus = 'FAILED'
    await auction.save()
    throw ApiError.badRequest('Invalid payment signature')
  }

  auction.winner = winnerId
  auction.paymentStatus = 'PAID'
  auction.paymentId = razorpay_payment_id
  auction.orderId = razorpay_order_id
  auction.signature = razorpay_signature
  auction.paidAt = new Date()
  auction.paymentMethod = 'razorpay'
  auction.transactionAmount = winningAmount
  if (auction.status !== 'ENDED') {
    auction.status = 'ENDED'
  }

  await auction.save()

  try {
    const auctionEngine = require('../auction-engine/AuctionEngine')
    auctionEngine.logPaymentStatus?.(auction._id.toString(), 'PAID', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: winningAmount,
    })
  } catch {
    // Timeline logging is best-effort
  }

  return {
    success: true,
    auction: auction.toPublicJSON(),
  }
}

/**
 * Marks payment as failed after a checkout abort / gateway failure.
 */
const markPaymentFailed = async ({ auctionId, userId }) => {
  const auction = await loadAuctionForPayment(auctionId)
  const { winnerId } = await resolveWinnerContext(auction)

  if (String(winnerId) !== String(userId)) {
    throw ApiError.forbidden('Only the auction winner can update this payment')
  }

  if (auction.paymentStatus === 'PAID') {
    throw ApiError.conflict('Payment has already been completed for this auction')
  }

  auction.paymentStatus = 'FAILED'
  await auction.save()

  return { auction: auction.toPublicJSON() }
}

module.exports = {
  createOrder,
  verifyPayment,
  markPaymentFailed,
}
