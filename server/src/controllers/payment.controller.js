const paymentService = require('../services/payment.service')
const catchAsync = require('../utils/catchAsync')
const ApiResponse = require('../utils/ApiResponse')

const createOrder = catchAsync(async (req, res) => {
  const result = await paymentService.createOrder({
    auctionId: req.body.auctionId,
    userId: req.user._id,
  })

  return ApiResponse.ok(res, 'Razorpay order created successfully', result)
})

const verifyPayment = catchAsync(async (req, res) => {
  const result = await paymentService.verifyPayment({
    auctionId: req.body.auctionId,
    userId: req.user._id,
    razorpay_order_id: req.body.razorpay_order_id,
    razorpay_payment_id: req.body.razorpay_payment_id,
    razorpay_signature: req.body.razorpay_signature,
  })

  return ApiResponse.ok(res, 'Payment verified successfully', result)
})

const markPaymentFailed = catchAsync(async (req, res) => {
  const result = await paymentService.markPaymentFailed({
    auctionId: req.body.auctionId,
    userId: req.user._id,
  })

  return ApiResponse.ok(res, 'Payment marked as failed', result)
})

module.exports = {
  createOrder,
  verifyPayment,
  markPaymentFailed,
}
