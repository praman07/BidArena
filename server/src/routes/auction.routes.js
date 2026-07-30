const express = require('express')
const auctionController = require('../controllers/auction.controller')
const { createAuctionValidator } = require('../validators/auction.validator')
const validate = require('../middlewares/validate.middleware')
const { requireAuth } = require('../middlewares/auth.middleware')
const { uploadAuctionImages } = require('../middlewares/upload.middleware')

const router = express.Router()

router.get('/', auctionController.getAllAuctions)

router.post(
  '/',
  requireAuth,
  uploadAuctionImages,
  createAuctionValidator,
  validate,
  auctionController.createAuction
)

module.exports = router
