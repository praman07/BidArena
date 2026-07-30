export const CATEGORIES = [
  'All Categories',
  'Luxury Watches',
  'Fine Art',
  'Vehicles',
  'Jewellery',
  'Electronics',
  'Collectibles',
  'Fashion',
  'Real Estate',
  'Cameras',
]

export const STATUSES = ['All Status', 'LIVE', 'UPCOMING']

export const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 – $10,000', min: 1000, max: 10000 },
  { label: '$10,000 – $50,000', min: 10000, max: 50000 },
  { label: '$50,000+', min: 50000, max: Infinity },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-high', label: 'Highest Bid' },
  { value: 'price-low', label: 'Lowest Bid' },
  { value: 'ending-soon', label: 'Ending Soon' },
]

export const PAGE_SIZE = 12

export const DEFAULT_FILTERS = {
  search: '',
  category: 'All Categories',
  status: 'All Status',
  priceRange: 'Any Price',
  sort: 'newest',
}

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
    return '—'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatTimeRemaining(startTime, endTime, now = Date.now()) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) return '—'

  if (now < start) {
    const diff = start - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    if (days > 0) return `Starts in ${days}d`
    if (hours > 0) return `Starts in ${hours}h`
    return 'Starts soon'
  }

  if (now >= end) return 'Ended'

  const diff = end - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function computeProgress(startTime, endTime, now = Date.now()) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  if (!(end > start)) return 4
  if (now <= start) return 8
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

function resolveDisplayStatus(startTime, endTime, now = Date.now()) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  if (now < start) return 'UPCOMING'
  if (now < end) return 'LIVE'
  return 'ENDED'
}

/** Maps API auction documents into the shape used by browse cards/filters. */
export function mapAuctionFromApi(auction) {
  const now = Date.now()
  const start = new Date(auction.startTime).getTime()
  const end = new Date(auction.endTime).getTime()
  const sellerName =
    typeof auction.seller === 'object' && auction.seller?.username
      ? auction.seller.username
      : typeof auction.seller === 'string'
        ? auction.seller
        : 'Seller'

  const participantCount = Array.isArray(auction.participants)
    ? auction.participants.length
    : Number(auction.participantCount) || 0

  return {
    id: auction.id,
    title: auction.title,
    category: auction.category,
    status: resolveDisplayStatus(auction.startTime, auction.endTime, now),
    image: auction.images?.[0] || '',
    imageAlt: auction.title,
    seller: sellerName,
    currentBid: auction.currentBid ?? auction.startingBid ?? 0,
    startingBid: auction.startingBid ?? 0,
    estimatedValue: auction.reservePrice ?? auction.startingBid ?? 0,
    timeRemaining: formatTimeRemaining(auction.startTime, auction.endTime, now),
    endsInHours: Math.max(0, (end - now) / (1000 * 60 * 60)),
    endsInSeconds: Math.max(0, Math.floor((end - now) / 1000)),
    endsAt: end,
    startsAt: start,
    createdAt: new Date(auction.createdAt || 0).getTime(),
    participants: participantCount,
    progress: computeProgress(auction.startTime, auction.endTime, now),
    description: auction.shortDescription || auction.description || '',
  }
}

export function filterAuctions(auctions, filters) {
  const range = PRICE_RANGES.find((r) => r.label === filters.priceRange) ?? PRICE_RANGES[0]
  const query = filters.search.trim().toLowerCase()

  let results = auctions.filter((auction) => {
    const matchesSearch =
      !query ||
      auction.title.toLowerCase().includes(query) ||
      auction.category.toLowerCase().includes(query)

    const matchesCategory =
      filters.category === 'All Categories' || auction.category === filters.category

    const matchesStatus =
      filters.status === 'All Status' || auction.status === filters.status

    const bid = auction.currentBid || auction.startingBid || 0
    const matchesPrice = bid >= range.min && bid <= range.max

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  switch (filters.sort) {
    case 'oldest':
      results = [...results].sort((a, b) => a.createdAt - b.createdAt)
      break
    case 'price-high':
      results = [...results].sort(
        (a, b) => (b.currentBid || b.startingBid) - (a.currentBid || a.startingBid)
      )
      break
    case 'price-low':
      results = [...results].sort(
        (a, b) => (a.currentBid || a.startingBid) - (b.currentBid || b.startingBid)
      )
      break
    case 'ending-soon':
      results = [...results].sort((a, b) => a.endsAt - b.endsAt)
      break
    case 'newest':
    default:
      results = [...results].sort((a, b) => b.createdAt - a.createdAt)
      break
  }

  return results
}
