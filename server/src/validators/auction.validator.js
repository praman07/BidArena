const { body } = require('express-validator')

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true' || value === '1'
  return Boolean(value)
}

const createAuctionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Product name must be between 3 and 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Detailed description is required')
    .isLength({ min: 40, max: 2000 })
    .withMessage('Detailed description must be between 40 and 2000 characters'),
  body('shortDescription')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage('Short description must be at most 160 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('brand').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body('condition').trim().notEmpty().withMessage('Condition is required'),
  body('startingBid')
    .notEmpty()
    .withMessage('Starting bid is required')
    .isFloat({ gt: 0 })
    .withMessage('Starting bid must be greater than 0')
    .toFloat(),
  body('reservePrice')
    .notEmpty()
    .withMessage('Reserve price is required')
    .isFloat({ gt: 0 })
    .withMessage('Reserve price must be greater than 0')
    .toFloat(),
  body('bidIncrement')
    .notEmpty()
    .withMessage('Bid increment is required')
    .isFloat({ gt: 0 })
    .withMessage('Bid increment must be greater than 0')
    .toFloat(),
  body('startTime')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  body('endTime')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate(),
  body('timezone').optional({ checkFalsy: true }).trim(),
  body('shippingAvailable').optional().customSanitizer(parseBoolean),
  body('pickupAvailable').optional().customSanitizer(parseBoolean),
  body('shippingCost')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Shipping cost cannot be negative')
    .toFloat(),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('privateNotes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Private notes must be at most 500 characters'),
  body('acceptTerms')
    .customSanitizer(parseBoolean)
    .custom((value) => value === true)
    .withMessage('You must accept the terms and conditions'),
  body().custom((_, { req }) => {
    const startingBid = Number(req.body.startingBid)
    const reservePrice = Number(req.body.reservePrice)
    if (reservePrice < startingBid) {
      throw new Error('Reserve price must be at least the starting bid')
    }

    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)
    if (!(endTime > startTime)) {
      throw new Error('End date must be after the start date')
    }

    const shippingAvailable = parseBoolean(req.body.shippingAvailable)
    const pickupAvailable = parseBoolean(req.body.pickupAvailable)
    if (!shippingAvailable && !pickupAvailable) {
      throw new Error('Enable shipping or pickup for delivery options')
    }

    return true
  }),
]

const updateAuctionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Product name must be between 3 and 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Detailed description is required')
    .isLength({ min: 40, max: 2000 })
    .withMessage('Detailed description must be between 40 and 2000 characters'),
  body('shortDescription')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage('Short description must be at most 160 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('brand').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body('condition').trim().notEmpty().withMessage('Condition is required'),
  body('startingBid')
    .notEmpty()
    .withMessage('Starting bid is required')
    .isFloat({ gt: 0 })
    .withMessage('Starting bid must be greater than 0')
    .toFloat(),
  body('reservePrice')
    .notEmpty()
    .withMessage('Reserve price is required')
    .isFloat({ gt: 0 })
    .withMessage('Reserve price must be greater than 0')
    .toFloat(),
  body('bidIncrement')
    .notEmpty()
    .withMessage('Bid increment is required')
    .isFloat({ gt: 0 })
    .withMessage('Bid increment must be greater than 0')
    .toFloat(),
  body('startTime')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  body('endTime')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate(),
  body('timezone').optional({ checkFalsy: true }).trim(),
  body('shippingAvailable').optional().customSanitizer(parseBoolean),
  body('pickupAvailable').optional().customSanitizer(parseBoolean),
  body('shippingCost')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Shipping cost cannot be negative')
    .toFloat(),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('privateNotes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Private notes must be at most 500 characters'),
  body().custom((_, { req }) => {
    const startingBid = Number(req.body.startingBid)
    const reservePrice = Number(req.body.reservePrice)
    if (reservePrice < startingBid) {
      throw new Error('Reserve price must be at least the starting bid')
    }

    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)
    if (!(endTime > startTime)) {
      throw new Error('End date must be after the start date')
    }

    const shippingAvailable = parseBoolean(req.body.shippingAvailable)
    const pickupAvailable = parseBoolean(req.body.pickupAvailable)
    if (!shippingAvailable && !pickupAvailable) {
      throw new Error('Enable shipping or pickup for delivery options')
    }

    return true
  }),
]

module.exports = {
  createAuctionValidator,
  updateAuctionValidator,
}
