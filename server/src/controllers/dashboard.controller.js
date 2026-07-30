const dashboardService = require('../services/dashboard.service')
const catchAsync = require('../utils/catchAsync')
const ApiResponse = require('../utils/ApiResponse')

const getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getStats(req.user._id)
  return ApiResponse.ok(res, 'Dashboard stats fetched successfully', { stats })
})

const getRecentAuctions = catchAsync(async (req, res) => {
  const auctions = await dashboardService.getRecentAuctions(req.user._id)
  return ApiResponse.ok(res, 'Recent auctions fetched successfully', { auctions })
})

const getRecentActivity = catchAsync(async (req, res) => {
  const activity = await dashboardService.getRecentActivity(req.user._id)
  return ApiResponse.ok(res, 'Recent activity fetched successfully', { activity })
})

module.exports = {
  getStats,
  getRecentAuctions,
  getRecentActivity,
}
