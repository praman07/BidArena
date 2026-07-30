const express = require('express')
const auctionController = require('../controllers/auction.controller')
const {
  createAuctionValidator,
  updateAuctionValidator,
} = require('../validators/auction.validator')
const validate = require('../middlewares/validate.middleware')
const { requireAuth } = require('../middlewares/auth.middleware')
const { uploadAuctionImages } = require('../middlewares/upload.middleware')

const router = express.Router()

router.get('/', auctionController.getAllAuctions)
router.get('/my', requireAuth, auctionController.getMyAuctions)
router.get('/:id', auctionController.getAuctionById)

router.post(
  '/',
  requireAuth,
  uploadAuctionImages,
  createAuctionValidator,
  validate,
  auctionController.createAuction
)

router.patch(
  '/:id',
  requireAuth,
  updateAuctionValidator,
  validate,
  auctionController.updateAuction
)

router.delete('/:id', requireAuth, auctionController.deleteAuction)

module.exports = router
