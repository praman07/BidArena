import rolexDaytona from '@/assets/images/rolex-daytona.jpg'
import patekPhilippe from '@/assets/images/patek-philippe.jpg'
import leicaCamera from '@/assets/images/leica-camera.jpg'
import lamborghini from '@/assets/images/lamborghini.jpg'
import picasso from '@/assets/images/picasso.jpg'
import pokemonCards from '@/assets/images/pokemon-cards.jpg'
import diamondRing from '@/assets/images/diamond-ring.jpg'
import macbookPro from '@/assets/images/macbook-pro.jpg'
import rareSneakers from '@/assets/images/rare-sneakers.jpg'
import luxuryHandbag from '@/assets/images/luxury-handbag.jpg'
import porsche from '@/assets/images/porsche.jpg'
import featuredWatch from '@/assets/images/featured-watch.jpg'
import goldNecklace from '@/assets/images/gold-necklace.jpg'
import headphones from '@/assets/images/headphones.jpg'
import villa from '@/assets/images/villa.jpg'
import omegaSeamaster from '@/assets/images/omega-seamaster.jpg'
import hermesBirkin from '@/assets/images/hermes-birkin.jpg'
import vintageVinyl from '@/assets/images/vintage-vinyl.jpg'

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
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'most-bids', label: 'Most Participants' },
]

export const PAGE_SIZE = 12

export const FEATURED_AUCTION = {
  id: 'heritage-chronometer',
  title: 'Heritage Titanium Chronometer, Ref. 79030',
  category: 'Luxury Watches',
  status: 'LIVE',
  image: featuredWatch,
  imageAlt: 'Luxury titanium chronometer photographed in dramatic studio light',
  seller: 'Geneva Timepieces',
  currentBid: 24750,
  estimatedValue: 32000,
  timeRemaining: '02:14:36',
  endsInSeconds: 2 * 3600 + 14 * 60 + 36,
  participants: 38,
  description:
    'A rare limited-edition chronometer with exhibition caseback and certified provenance from a private European collection.',
}

export const AUCTIONS = [
  {
    id: 'rolex-daytona',
    title: 'Rolex Daytona Cosmograph — Ceramic Bezel',
    category: 'Luxury Watches',
    status: 'LIVE',
    image: rolexDaytona,
    imageAlt: 'Rolex Daytona chronograph wristwatch in close-up',
    seller: 'Geneva Timepieces',
    currentBid: 28500,
    estimatedValue: 35000,
    timeRemaining: '01:42:18',
    endsInHours: 1.7,
    participants: 52,
    progress: 78,
    featured: true,
  },
  {
    id: 'patek-philippe',
    title: 'Patek Philippe Calatrava — Ref. 5227G',
    category: 'Luxury Watches',
    status: 'LIVE',
    image: patekPhilippe,
    imageAlt: 'Patek Philippe dress watch on a wrist',
    seller: 'Atelier Horology',
    currentBid: 41200,
    estimatedValue: 48000,
    timeRemaining: '04:08:55',
    endsInHours: 4.1,
    participants: 31,
    progress: 86,
  },
  {
    id: 'leica-m6',
    title: 'Vintage Leica M6 Rangefinder Camera',
    category: 'Cameras',
    status: 'LIVE',
    image: leicaCamera,
    imageAlt: 'Vintage Leica camera on a plain backdrop',
    seller: 'Analog Archive',
    currentBid: 3200,
    estimatedValue: 4500,
    timeRemaining: '00:47:22',
    endsInHours: 0.8,
    participants: 67,
    progress: 71,
  },
  {
    id: 'lamborghini-huracan',
    title: 'Lamborghini Huracán EVO — Low Mileage',
    category: 'Vehicles',
    status: 'LIVE',
    image: lamborghini,
    imageAlt: 'Orange Lamborghini Huracán sports car',
    seller: 'Autohaus Klassik',
    currentBid: 218000,
    estimatedValue: 245000,
    timeRemaining: '18:30:00',
    endsInHours: 18.5,
    participants: 24,
    progress: 89,
  },
  {
    id: 'picasso-painting',
    title: 'Original Picasso Drawing — Provenance Verified',
    category: 'Fine Art',
    status: 'UPCOMING',
    image: picasso,
    imageAlt: 'Classical oil painting of flowers in a vase',
    seller: 'Marlow Gallery',
    currentBid: 0,
    estimatedValue: 185000,
    timeRemaining: 'Starts in 2d',
    endsInHours: 48,
    participants: 89,
    progress: 12,
  },
  {
    id: 'pokemon-collection',
    title: 'Pokemon Card Collection — 1st Edition Base Set',
    category: 'Collectibles',
    status: 'LIVE',
    image: pokemonCards,
    imageAlt: 'Rare collectible trading cards fanned out',
    seller: 'Vault Collectibles',
    currentBid: 12400,
    estimatedValue: 18000,
    timeRemaining: '06:22:41',
    endsInHours: 6.4,
    participants: 143,
    progress: 69,
  },
  {
    id: 'diamond-halo-ring',
    title: 'Diamond Halo Engagement Ring, 2.1ct',
    category: 'Jewellery',
    status: 'LIVE',
    image: diamondRing,
    imageAlt: 'Diamond halo ring displayed on a dark surface',
    seller: 'Maison Aurele',
    currentBid: 8900,
    estimatedValue: 12000,
    timeRemaining: '03:15:09',
    endsInHours: 3.3,
    participants: 28,
    progress: 74,
  },
  {
    id: 'macbook-pro-m3',
    title: 'MacBook Pro 16" M3 Max — Sealed',
    category: 'Electronics',
    status: 'LIVE',
    image: macbookPro,
    imageAlt: 'Silver MacBook Pro open on a desk',
    seller: 'TechVault',
    currentBid: 2100,
    estimatedValue: 3200,
    timeRemaining: '02:55:33',
    endsInHours: 2.9,
    participants: 41,
    progress: 66,
  },
  {
    id: 'nike-dunk-rare',
    title: "Nike Dunk Low — Rare 'University Red' Pair",
    category: 'Fashion',
    status: 'LIVE',
    image: rareSneakers,
    imageAlt: 'Red Nike sneaker against a matching red backdrop',
    seller: 'SoleVault',
    currentBid: 680,
    estimatedValue: 950,
    timeRemaining: '08:12:04',
    endsInHours: 8.2,
    participants: 56,
    progress: 72,
  },
  {
    id: 'hermes-kelly',
    title: 'Hermès Kelly 28 — Gold Hardware',
    category: 'Fashion',
    status: 'UPCOMING',
    image: luxuryHandbag,
    imageAlt: 'Luxury red handbag photographed in studio light',
    seller: 'Maison Atelier',
    currentBid: 0,
    estimatedValue: 22000,
    timeRemaining: 'Starts in 1d',
    endsInHours: 26,
    participants: 72,
    progress: 8,
  },
  {
    id: 'porsche-911',
    title: 'Porsche 911 Carrera S — One Owner',
    category: 'Vehicles',
    status: 'LIVE',
    image: porsche,
    imageAlt: 'Black Porsche driving on an open highway at dusk',
    seller: 'Autohaus Klassik',
    currentBid: 124000,
    estimatedValue: 145000,
    timeRemaining: '12:05:18',
    endsInHours: 12.1,
    participants: 35,
    progress: 85,
  },
  {
    id: 'cartier-necklace',
    title: 'Cartier Love Necklace — 18k Yellow Gold',
    category: 'Jewellery',
    status: 'LIVE',
    image: goldNecklace,
    imageAlt: 'Gold necklace with pendant on marble surface',
    seller: 'Maison Aurele',
    currentBid: 4500,
    estimatedValue: 6200,
    timeRemaining: '05:40:12',
    endsInHours: 5.7,
    participants: 19,
    progress: 73,
  },
  {
    id: 'sony-headphones',
    title: 'Sony WH-1000XM5 — Limited Edition Bundle',
    category: 'Electronics',
    status: 'UPCOMING',
    image: headphones,
    imageAlt: 'Black over-ear headphones on a colorful surface',
    seller: 'TechVault',
    currentBid: 0,
    estimatedValue: 420,
    timeRemaining: 'Starts in 6h',
    endsInHours: 6,
    participants: 14,
    progress: 5,
  },
  {
    id: 'amalfi-villa',
    title: 'Amalfi Coast Villa — Exclusive Weekend Stay',
    category: 'Real Estate',
    status: 'LIVE',
    image: villa,
    imageAlt: 'Luxury white villa with pool overlooking the coast',
    seller: 'Estate Collective',
    currentBid: 18500,
    estimatedValue: 25000,
    timeRemaining: '09:18:44',
    endsInHours: 9.3,
    participants: 22,
    progress: 74,
  },
  {
    id: 'omega-seamaster',
    title: 'Omega Seamaster Planet Ocean Chronograph',
    category: 'Luxury Watches',
    status: 'LIVE',
    image: omegaSeamaster,
    imageAlt: 'Luxury chronograph watch photographed from above',
    seller: 'Geneva Timepieces',
    currentBid: 8250,
    estimatedValue: 11000,
    timeRemaining: '02:14:36',
    endsInHours: 2.2,
    participants: 38,
    progress: 75,
  },
  {
    id: 'birkin-35',
    title: 'Hermès Birkin 35 — Togo Leather',
    category: 'Fashion',
    status: 'LIVE',
    image: hermesBirkin,
    imageAlt: 'Luxury leather handbag on a clean backdrop',
    seller: 'Maison Atelier',
    currentBid: 16800,
    estimatedValue: 21000,
    timeRemaining: '07:33:21',
    endsInHours: 7.6,
    participants: 48,
    progress: 80,
  },
  {
    id: 'vinyl-collection',
    title: 'First Press Vinyl Collection — 120 LPs',
    category: 'Collectibles',
    status: 'UPCOMING',
    image: vintageVinyl,
    imageAlt: 'Stack of vintage vinyl records',
    seller: 'Analog Archive',
    currentBid: 0,
    estimatedValue: 3800,
    timeRemaining: 'Starts in 3d',
    endsInHours: 72,
    participants: 33,
    progress: 10,
  },
]

export const formatCurrency = (value) => {
  if (!value) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export const DEFAULT_FILTERS = {
  search: '',
  category: 'All Categories',
  status: 'All Status',
  priceRange: 'Any Price',
  sort: 'ending-soon',
}

export function filterAuctions(auctions, filters) {
  const range = PRICE_RANGES.find((r) => r.label === filters.priceRange) ?? PRICE_RANGES[0]
  const query = filters.search.trim().toLowerCase()

  let results = auctions.filter((auction) => {
    const matchesSearch =
      !query ||
      auction.title.toLowerCase().includes(query) ||
      auction.category.toLowerCase().includes(query) ||
      auction.seller.toLowerCase().includes(query)

    const matchesCategory =
      filters.category === 'All Categories' || auction.category === filters.category

    const matchesStatus =
      filters.status === 'All Status' || auction.status === filters.status

    const bid = auction.currentBid || auction.estimatedValue
    const matchesPrice = bid >= range.min && bid <= range.max

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  switch (filters.sort) {
    case 'price-high':
      results = [...results].sort(
        (a, b) => (b.currentBid || b.estimatedValue) - (a.currentBid || a.estimatedValue)
      )
      break
    case 'price-low':
      results = [...results].sort(
        (a, b) => (a.currentBid || a.estimatedValue) - (b.currentBid || b.estimatedValue)
      )
      break
    case 'most-bids':
      results = [...results].sort((a, b) => b.participants - a.participants)
      break
    case 'newest':
      results = [...results].reverse()
      break
    case 'ending-soon':
    default:
      results = [...results].sort((a, b) => a.endsInHours - b.endsInHours)
      break
  }

  return results
}
