const auctionEngineService = require('./auctionEngine.service')
const auctionRoomStore = require('./auctionRoomStore.service')

/**
 * Auction Heat Service
 * Calculates a normalized heat score (0-100) based on live auction activity.
 */
class AuctionHeatService {
  constructor() {
    // Map<auctionId, Array<Date>> to track sliding window of chat activity
    this.chatHistory = new Map()
  }

  /**
   * Records a chat event for a specific auction.
   * @param {string} auctionId 
   */
  recordChatEvent(auctionId) {
    if (!this.chatHistory.has(auctionId)) {
      this.chatHistory.set(auctionId, [])
    }
    this.chatHistory.get(auctionId).push(new Date())
  }

  /**
   * Calculates the normalized heat score for an auction.
   * @param {string} auctionId 
   * @returns {number} Normalized score between 0 and 100
   */
  calculateHeat(auctionId) {
    const state = auctionEngineService.getAuctionState(auctionId)
    const roomStats = auctionRoomStore.getRoomStats(auctionId)

    const now = new Date()
    const sixtySecondsAgo = new Date(now.getTime() - 60000)

    // 1. Calculate Recent Bid Frequency
    let recentBidsCount = 0
    if (state && state.bidHistory) {
      // Assuming bidHistory is sorted newest to oldest
      for (const bid of state.bidHistory) {
        if (new Date(bid.timestamp) >= sixtySecondsAgo) {
          recentBidsCount++
        } else {
          break // Stop early since it's sorted
        }
      }
    }

    // 2. Calculate Recent Chat Activity
    let recentChatsCount = 0
    if (this.chatHistory.has(auctionId)) {
      const chats = this.chatHistory.get(auctionId)
      // Filter out old chats from memory
      const recentChats = chats.filter(timestamp => timestamp >= sixtySecondsAgo)
      this.chatHistory.set(auctionId, recentChats)
      recentChatsCount = recentChats.length
    }

    // 3. Extract Population
    const activeBidders = roomStats ? roomStats.userCount : 0
    const spectators = roomStats ? roomStats.spectatorCount : 0

    // 4. Calculate Raw Score
    // Algorithm: Bids (5x), Bidders (3x), Chats (2x), Spectators (1x)
    const rawScore = (recentBidsCount * 5) + (activeBidders * 3) + (recentChatsCount * 2) + (spectators * 1)

    // 5. Normalize (Clamp to 0-100)
    // For a highly active auction, 100 is the ceiling.
    const normalizedScore = Math.min(Math.max(Math.round(rawScore), 0), 100)

    return normalizedScore
  }
}

const auctionHeatService = new AuctionHeatService()
module.exports = auctionHeatService
