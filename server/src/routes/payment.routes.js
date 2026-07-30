const express = require('express')
const { body } = require('express-validator')
const paymentController = require('../controllers/payment.controller')
const validate = require('../middlewares/validate.middleware')
const { requireAuth } = require('../middlewares/auth.middleware')

const router = express.Router()

router.use(requireAuth)

router.post(
  '/create-order',
  body('auctionId').trim().notEmpty().withMessage('auctionId is required'),
  validate,
  paymentController.createOrder
)

router.post(
  '/verify',
  body('auctionId').trim().notEmpty().withMessage('auctionId is required'),
  body('razorpay_order_id').trim().notEmpty().withMessage('razorpay_order_id is required'),
  body('razorpay_payment_id').trim().notEmpty().withMessage('razorpay_payment_id is required'),
  body('razorpay_signature').trim().notEmpty().withMessage('razorpay_signature is required'),
  validate,
  paymentController.verifyPayment
)

router.post(
  '/failed',
  body('auctionId').trim().notEmpty().withMessage('auctionId is required'),
  validate,
  paymentController.markPaymentFailed
)

module.exports = router
