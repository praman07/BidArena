/**
 * Bid Validation Rules
 * Domain B: Auction Engine
 */

/**
 * Validates a bid payload against current auction state.
 * @param {Object} payload - { auctionId, amount, user }
 * @param {Object} auctionState - { status, currentHighestBid, currentHighestBidderId, minIncrement, startingPrice }
 * @returns {{ isValid: boolean, code?: string, message?: string, details?: Object }}
 */
const validateBid = (payload = {}, auctionState = {}) => {
  const { auctionId, amount, user } = payload
  const {
    status = 'ACTIVE',
    currentHighestBid = 0,
    currentHighestBidderId = null,
    minIncrement = 1,
    startingPrice = 0,
  } = auctionState

  // 1. Validate User
  if (!user || !user.userId) {
    return {
      isValid: false,
      code: 'UNAUTHORIZED',
      message: 'User authentication is required to place a bid',
    }
  }

  if (user.role === 'spectator') {
    return {
      isValid: false,
      code: 'FORBIDDEN_ROLE',
      message: 'Spectators are not allowed to place bids',
    }
  }

  // 2. Validate Auction Identifier
  if (!auctionId || typeof auctionId !== 'string') {
    return {
      isValid: false,
      code: 'INVALID_AUCTION_ID',
      message: 'A valid auctionId must be provided',
    }
  }

  // 3. Validate Active Status
  const normalizedStatus = String(status).toUpperCase()
  if (normalizedStatus !== 'ACTIVE') {
    return {
      isValid: false,
      code: 'AUCTION_NOT_ACTIVE',
      message: `Bidding is disabled. Auction status is '${normalizedStatus}'`,
    }
  }

  // 4. Validate Amount
  const bidAmount = Number(amount)
  if (isNaN(bidAmount) || bidAmount <= 0) {
    return {
      isValid: false,
      code: 'INVALID_BID_AMOUNT',
      message: 'Bid amount must be a positive number',
    }
  }

  // 5. Reject Duplicate Top Bidder
  if (currentHighestBidderId && currentHighestBidderId === user.userId) {
    return {
      isValid: false,
      code: 'DUPLICATE_BIDDER',
      message: 'You are already the highest bidder on this auction',
    }
  }

  // 6. Calculate Minimum Required Bid
  const minRequiredBid =
    currentHighestBid > 0 ? currentHighestBid + minIncrement : Math.max(startingPrice, minIncrement)

  // 7. Validate Bid exceeds current highest bid
  if (bidAmount <= currentHighestBid) {
    return {
      isValid: false,
      code: 'BID_TOO_LOW',
      message: `Bid amount (${bidAmount}) must exceed current highest bid of ${currentHighestBid}`,
      details: { currentHighestBid, minRequiredBid },
    }
  }

  // 8. Validate Minimum Increment
  if (bidAmount < minRequiredBid) {
    return {
      isValid: false,
      code: 'MIN_INCREMENT_NOT_MET',
      message: `Bid amount (${bidAmount}) must be at least ${minRequiredBid} (minimum increment: ${minIncrement})`,
      details: { currentHighestBid, minIncrement, minRequiredBid },
    }
  }

  return {
    isValid: true,
    details: {
      auctionId,
      userId: user.userId,
      username: user.username,
      bidAmount,
      previousHighestBid: currentHighestBid,
      minRequiredBid,
    },
  }
}

module.exports = {
  validateBid,
}
