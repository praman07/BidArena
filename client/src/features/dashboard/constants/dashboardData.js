import rolexDaytona from '@/assets/images/rolex-daytona.jpg'
import patekPhilippe from '@/assets/images/patek-philippe.jpg'
import leicaCamera from '@/assets/images/leica-camera.jpg'
import lamborghini from '@/assets/images/lamborghini.jpg'
import diamondRing from '@/assets/images/diamond-ring.jpg'
import luxuryHandbag from '@/assets/images/luxury-handbag.jpg'
import omegaSeamaster from '@/assets/images/omega-seamaster.jpg'
import picasso from '@/assets/images/picasso.jpg'
import rareSneakers from '@/assets/images/rare-sneakers.jpg'
import porsche from '@/assets/images/porsche.jpg'

export const DASHBOARD_USER = {
  name: 'Akhil',
  fullName: 'Akhil Sharma',
  email: 'akhil@bidarena.com',
  username: 'akhil',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  role: 'Collector',
}

export const SIDEBAR_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Browse Auctions', href: '/auctions', icon: 'Compass' },
  { label: 'My Auctions', href: '/my-auctions', icon: 'Gavel' },
  { label: 'Create Auction', href: '/auctions/create', icon: 'PlusCircle' },
  { label: 'Live Auctions', href: '/auctions', icon: 'Radio' },
  { label: 'Profile', href: '/profile', icon: 'User' },
]

export const WELCOME = {
  greeting: 'Welcome back, Akhil',
  message: 'You have 3 auctions ending today and 2 new bids on your watchlist.',
}

export const STATS = [
  {
    id: 'active',
    label: 'Active Auctions',
    value: '24',
    trend: '+12.4%',
    trendUp: true,
    icon: 'Radio',
    chart: [28, 32, 30, 38, 42, 40, 48],
  },
  {
    id: 'mine',
    label: 'My Auctions',
    value: '8',
    trend: '+2',
    trendUp: true,
    icon: 'Gavel',
    chart: [4, 5, 5, 6, 7, 7, 8],
  },
  {
    id: 'winning',
    label: 'Winning Bids',
    value: '5',
    trend: '-1',
    trendUp: false,
    icon: 'Trophy',
    chart: [6, 7, 6, 5, 6, 5, 5],
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    value: '14',
    trend: '+3',
    trendUp: true,
    icon: 'Heart',
    chart: [8, 9, 10, 11, 12, 13, 14],
  },
]

export const QUICK_ACTIONS = [
  {
    id: 'create',
    title: 'Create Auction',
    description: 'List a new lot with photos, reserve, and schedule.',
    href: '/auctions/create',
    icon: 'PlusCircle',
    accent: 'neutral',
  },
  {
    id: 'browse',
    title: 'Browse Auctions',
    description: 'Explore live and upcoming premium marketplace lots.',
    href: '/auctions',
    icon: 'Compass',
    accent: 'muted',
  },
  {
    id: 'live',
    title: 'Browse Live Auctions',
    description: 'Find live lots and enter a room to bid in real time.',
    href: '/auctions',
    icon: 'Zap',
    accent: 'live',
  },
]

export const RECENT_AUCTIONS = [
  {
    id: 'rolex-daytona',
    title: 'Rolex Daytona Cosmograph',
    image: rolexDaytona,
    imageAlt: 'Rolex Daytona chronograph wristwatch',
    currentBid: 28500,
    status: 'LIVE',
    timeRemaining: '01:42:18',
  },
  {
    id: 'patek-philippe',
    title: 'Patek Philippe Calatrava',
    image: patekPhilippe,
    imageAlt: 'Patek Philippe dress watch',
    currentBid: 41200,
    status: 'LIVE',
    timeRemaining: '04:08:55',
  },
  {
    id: 'leica-m6',
    title: 'Vintage Leica M6 Camera',
    image: leicaCamera,
    imageAlt: 'Vintage Leica rangefinder camera',
    currentBid: 3200,
    status: 'ENDING',
    timeRemaining: '00:47:22',
  },
  {
    id: 'diamond-halo-ring',
    title: 'Diamond Halo Ring, 2.1ct',
    image: diamondRing,
    imageAlt: 'Diamond halo engagement ring',
    currentBid: 8900,
    status: 'LIVE',
    timeRemaining: '03:15:09',
  },
  {
    id: 'picasso-painting',
    title: 'Original Picasso Drawing',
    image: picasso,
    imageAlt: 'Classical oil painting of flowers',
    currentBid: 0,
    status: 'UPCOMING',
    timeRemaining: 'Starts in 2d',
  },
]

export const LIVE_AUCTIONS = [
  {
    id: 'rolex-daytona',
    title: 'Rolex Daytona Cosmograph — Ceramic Bezel',
    category: 'Luxury Watches',
    status: 'LIVE',
    image: rolexDaytona,
    imageAlt: 'Rolex Daytona chronograph wristwatch in close-up',
    currentBid: 28500,
    estimatedValue: 35000,
    timeRemaining: '01:42:18',
    participants: 52,
    progress: 78,
  },
  {
    id: 'lamborghini-huracan',
    title: 'Lamborghini Huracán EVO — Low Mileage',
    category: 'Vehicles',
    status: 'LIVE',
    image: lamborghini,
    imageAlt: 'Orange Lamborghini Huracán sports car',
    currentBid: 218000,
    estimatedValue: 245000,
    timeRemaining: '18:30:00',
    participants: 24,
    progress: 89,
  },
  {
    id: 'hermes-kelly',
    title: 'Hermès Kelly 28 — Gold Hardware',
    category: 'Fashion',
    status: 'LIVE',
    image: luxuryHandbag,
    imageAlt: 'Luxury red handbag in studio light',
    currentBid: 16800,
    estimatedValue: 22000,
    timeRemaining: '07:33:21',
    participants: 48,
    progress: 80,
  },
]

export const ACTIVITY = [
  {
    id: 'a1',
    type: 'created',
    title: 'Created Auction',
    detail: 'Listed Omega Seamaster Planet Ocean Chronograph',
    time: '12 min ago',
    image: omegaSeamaster,
  },
  {
    id: 'a2',
    type: 'bid',
    title: 'Placed Bid',
    detail: 'Bid $28,500 on Rolex Daytona Cosmograph',
    time: '38 min ago',
    image: rolexDaytona,
  },
  {
    id: 'a3',
    type: 'won',
    title: 'Won Auction',
    detail: 'Won Nike Dunk Low — University Red for $680',
    time: 'Yesterday',
    image: rareSneakers,
  },
  {
    id: 'a4',
    type: 'outbid',
    title: 'Outbid',
    detail: 'Outbid on Porsche 911 Carrera S — now $124,000',
    time: 'Yesterday',
    image: porsche,
  },
  {
    id: 'a5',
    type: 'bid',
    title: 'Placed Bid',
    detail: 'Bid $8,900 on Diamond Halo Engagement Ring',
    time: '2 days ago',
    image: diamondRing,
  },
]

export const UPCOMING_AUCTIONS = [
  {
    id: 'picasso-painting',
    title: 'Original Picasso Drawing',
    startsIn: '2 days',
    image: picasso,
    estimatedValue: 185000,
  },
  {
    id: 'hermes-kelly',
    title: 'Hermès Kelly 28',
    startsIn: '1 day',
    image: luxuryHandbag,
    estimatedValue: 22000,
  },
  {
    id: 'omega-seamaster',
    title: 'Omega Seamaster Chronograph',
    startsIn: '6 hours',
    image: omegaSeamaster,
    estimatedValue: 11000,
  },
]

export const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'You were outbid',
    body: 'Porsche 911 Carrera S jumped to $124,000',
    time: '8 min ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Auction ending soon',
    body: 'Rolex Daytona ends in under 2 hours',
    time: '24 min ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'New follower bid',
    body: 'A collector joined your Leica M6 room',
    time: '1 hr ago',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Payment settled',
    body: 'Nike Dunk Low purchase cleared escrow',
    time: 'Yesterday',
    unread: false,
  },
]

export const PLATFORM_STATUS = {
  status: 'Operational',
  uptime: '99.98%',
  liveRooms: 42,
  latency: '48ms',
  message: 'All bidding systems are running normally.',
}

export const formatCurrency = (value) => {
  if (!value) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
