const auctionService = require('../services/auction.service')
const catchAsync = require('../utils/catchAsync')
const ApiResponse = require('../utils/ApiResponse')

const createAuction = catchAsync(async (req, res) => {
  const auction = await auctionService.createAuction({
    sellerId: req.user._id,
    payload: req.body,
    files: req.files || [],
  })

  return ApiResponse.created(res, 'Auction created successfully', {
    auction: auction.toPublicJSON(),
  })
})

const getAllAuctions = catchAsync(async (req, res) => {
  const result = await auctionService.getAllAuctions({
    page: req.query.page,
    limit: req.query.limit,
  })

  return ApiResponse.ok(res, 'Auctions fetched successfully', result)
})

module.exports = {
  createAuction,
  getAllAuctions,
}
