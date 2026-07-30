import { formatCurrency, formatTimeRemaining, mapAuctionFromApi } from './auctionData'

export { formatCurrency }

export const DETAIL_TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'bids', label: 'Bid History' },
  { id: 'seller', label: 'Seller' },
]

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'

function resolveDisplayStatus(startTime, endTime, now = Date.now()) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  if (now < start) return 'UPCOMING'
  if (now < end) return 'LIVE'
  return 'ENDED'
}

function formatRelativeTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const diffMs = Date.now() - date.getTime()
  if (diffMs < 60_000) return 'Just now'
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} min ago`
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)} hr ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function yearsOnPlatform(createdAt) {
  if (!createdAt) return 1
  const years = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
  return Math.max(1, Math.round(years) || 1)
}

/** Maps GET /api/auctions/:id payload into the existing details UI shape. */
export function mapAuctionDetailsFromApi(auction) {
  const now = Date.now()
  const end = new Date(auction.endTime).getTime()
  const seller = auction.seller && typeof auction.seller === 'object' ? auction.seller : null
  const images = Array.isArray(auction.images) ? auction.images : []
  const participantCount = Array.isArray(auction.participants)
    ? auction.participants.length
    : Number(auction.participantCount) || 0

  const gallery =
    images.length > 0
      ? images.map((src, index) => ({
          src,
          alt: `${auction.title} image ${index + 1}`,
        }))
      : [{ src: '', alt: auction.title }]

  const bids = Array.isArray(auction.bids) ? auction.bids : []

  return {
    id: auction.id,
    title: auction.title,
    shortTitle: auction.title.split('—')[0].trim(),
    category: auction.category,
    condition: auction.condition,
    status: resolveDisplayStatus(auction.startTime, auction.endTime, now),
    apiStatus: auction.status,
    currentBid: auction.currentBid ?? auction.startingBid ?? 0,
    estimatedValue: auction.reservePrice ?? auction.startingBid ?? 0,
    startingPrice: auction.startingBid ?? 0,
    reservePrice: auction.reservePrice ?? 0,
    bidIncrement: auction.bidIncrement ?? 1,
    endsInSeconds: Math.max(0, Math.floor((end - now) / 1000)),
    participants: participantCount,
    highestBidder: auction.highestBidder || null,
    views: Math.max(participantCount * 12, participantCount),
    image: images[0] || '',
    imageAlt: auction.title,
    gallery,
    description: auction.description || auction.shortDescription || '',
    startTime: auction.startTime,
    endTime: auction.endTime,
    timeRemaining: formatTimeRemaining(auction.startTime, auction.endTime, now),
    specifications: {
      Brand: auction.brand || '—',
      Condition: auction.condition || '—',
      Category: auction.category || '—',
      Location: auction.location || '—',
      'Starting Bid': formatCurrency(auction.startingBid),
      'Bid Increment': formatCurrency(auction.bidIncrement),
      'Start Date': new Date(auction.startTime).toLocaleString(),
      'End Date': new Date(auction.endTime).toLocaleString(),
    },
    bidHistory: bids.map((bid) => ({
      id: bid.id,
      user: bid.user?.username || 'Bidder',
      amount: bid.amount,
      time: formatRelativeTime(bid.time),
      status: bid.status || 'Outbid',
    })),
    seller: {
      name: seller?.username || 'Seller',
      avatar: seller?.avatar || DEFAULT_AVATAR,
      verified: Boolean(seller?.username),
      rating: null,
      reviewCount: 0,
      completedAuctions: 0,
      yearsOnPlatform: yearsOnPlatform(seller?.createdAt),
      location: auction.location || '',
      responseTime: '',
    },
  }
}

export function mapRelatedAuctionsFromApi(auctions = []) {
  return auctions.map(mapAuctionFromApi)
}
