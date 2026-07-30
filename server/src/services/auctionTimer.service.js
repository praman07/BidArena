const broadcastService = require('./broadcast.service')

/**
 * Server-Side Timer Service for Auctions
 * 
 * Manages the authoritative countdown timers for all active auctions.
 * Clients receive time updates via Socket.IO broadcasts and cannot manipulate the timer.
 */
class AuctionTimerService {
  constructor() {
    // Map to store timer details: auctionId -> { intervalId, remainingTime }
    this.timers = new Map()
  }

  /**
   * Starts a countdown timer for a specific auction.
   * @param {string} auctionId - The unique identifier for the auction
   * @param {number} durationInSeconds - The total duration in seconds
   */
  startTimer(auctionId, durationInSeconds) {
    if (!auctionId || typeof durationInSeconds !== 'number' || durationInSeconds <= 0) {
      console.warn(`[Timer] Invalid start parameters for auction ${auctionId}`)
      return
    }

    // Stop existing timer if one is already running for this auction
    this.stopTimer(auctionId)

    console.log(`[Timer] Starting timer for auction ${auctionId}: ${durationInSeconds}s`)
    
    const timerState = {
      remainingTime: durationInSeconds,
      intervalId: null
    }

    const auctionEngineService = require('./auctionEngine.service')
    const auctionRoomStore = require('./auctionRoomStore.service')

    // Tick every 1 second (1000ms)
    timerState.intervalId = setInterval(() => {
      timerState.remainingTime -= 1

      // Broadcast current time (legacy support)
      broadcastService.broadcastTime(auctionId, timerState.remainingTime)

      // --- Unified Live Statistics Heartbeat ---
      const state = auctionEngineService.getAuctionState(auctionId)
      const roomStats = auctionRoomStore.getRoomStats(auctionId)
      
      const liveStats = {
        auctionId,
        bidCount: state?.totalBidsCount || 0,
        activeBidders: roomStats?.userCount || 0,
        spectatorCount: roomStats?.spectatorCount || 0,
        currentHighestBid: state?.currentHighestBid || 0,
        status: state?.status || 'UNKNOWN',
        remainingTime: timerState.remainingTime
      }
      broadcastService.broadcastLiveStats(auctionId, liveStats)

      // Check if timer ended
      if (timerState.remainingTime <= 0) {
        this.stopTimer(auctionId)
        broadcastService.broadcastTimerEnded(auctionId)
        
        // Lock auction and determine winner
        const auctionEngineService = require('./auctionEngine.service')
        auctionEngineService.closeAuction(auctionId)
      }
    }, 1000)

    this.timers.set(auctionId, timerState)
  }

  /**
   * Stops an active timer for an auction.
   * @param {string} auctionId 
   */
  stopTimer(auctionId) {
    const timer = this.timers.get(auctionId)
    if (timer && timer.intervalId) {
      clearInterval(timer.intervalId)
      this.timers.delete(auctionId)
      console.log(`[Timer] Stopped timer for auction ${auctionId}`)
    }
  }

  /**
   * Retrieves the remaining time for a specific auction.
   * @param {string} auctionId 
   * @returns {number|null} Remaining time in seconds, or null if timer is not active.
   */
  getTime(auctionId) {
    const timer = this.timers.get(auctionId)
    return timer ? timer.remainingTime : null
  }

  /**
   * Cleans up all active timers. 
   * Useful for graceful server shutdowns or restarts.
   */
  cleanupAll() {
    console.log(`[Timer] Cleaning up all ${this.timers.size} active timers...`)
    for (const [auctionId, timer] of this.timers.entries()) {
      if (timer.intervalId) {
        clearInterval(timer.intervalId)
      }
    }
    this.timers.clear()
    console.log(`[Timer] Cleanup complete.`)
  }
}

// Export a singleton instance
const auctionTimerService = new AuctionTimerService()
module.exports = auctionTimerService
