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

const getFeaturedAuctions = catchAsync(async (req, res) => {
  const auctions = await auctionService.getFeaturedAuctions({
    limit: req.query.limit,
  })

  return ApiResponse.ok(res, 'Featured auctions fetched successfully', { auctions })
})

const getAuctionById = catchAsync(async (req, res) => {
  const result = await auctionService.getAuctionById(req.params.id)
  return ApiResponse.ok(res, 'Auction fetched successfully', result)
})

const getMyAuctions = catchAsync(async (req, res) => {
  const auctions = await auctionService.getMyAuctions(req.user._id)
  return ApiResponse.ok(res, 'Your auctions fetched successfully', { auctions })
})

const deleteAuction = catchAsync(async (req, res) => {
  const result = await auctionService.deleteAuction({
    auctionId: req.params.id,
    userId: req.user._id,
  })
  return ApiResponse.ok(res, 'Auction deleted successfully', result)
})

const updateAuction = catchAsync(async (req, res) => {
  const auction = await auctionService.updateAuction({
    auctionId: req.params.id,
    userId: req.user._id,
    payload: req.body,
  })
  return ApiResponse.ok(res, 'Auction updated successfully', {
    auction: auction.toPublicJSON(),
  })
})

module.exports = {
  createAuction,
  getAllAuctions,
  getFeaturedAuctions,
  getAuctionById,
  getMyAuctions,
  deleteAuction,
  updateAuction,
}
