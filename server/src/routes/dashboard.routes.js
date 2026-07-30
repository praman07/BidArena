const express = require('express')
const dashboardController = require('../controllers/dashboard.controller')
const { requireAuth } = require('../middlewares/auth.middleware')

const router = express.Router()

router.use(requireAuth)

router.get('/stats', dashboardController.getStats)
router.get('/recent-auctions', dashboardController.getRecentAuctions)
router.get('/recent-activity', dashboardController.getRecentActivity)

module.exports = router
