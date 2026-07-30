import {
  BadgeCheck,
  Bell,
  Clock,
  Compass,
  Crown,
  Gavel,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react'

/** Central Unsplash image registry — every visual on the landing page lives here. */
const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMAGES = {
  hero: unsplash('photo-1547996160-81dfa63595aa', 1200),
  auctions: {
    watch: unsplash('photo-1523170335258-f5ed11844a49'),
    art: unsplash('photo-1579783902614-a3fb3927b6a5'),
    camera: unsplash('photo-1526170375885-4d8ecf77b99f'),
    car: unsplash('photo-1503376780353-7e6692767b70'),
    ring: unsplash('photo-1605100804763-247f67b3557e'),
    sneakers: unsplash('photo-1542291026-7eec264c27ff'),
  },
  categories: {
    electronics: unsplash('photo-1505740420928-5e560c06d30e', 700),
    watches: unsplash('photo-1524592094714-0f0654e20314', 700),
    art: unsplash('photo-1578301978693-85fa9c0320b9', 700),
    collectibles: unsplash('photo-1603048588665-791ca8aea617', 700),
    vehicles: unsplash('photo-1553440569-bcc63803a83d', 700),
    realEstate: unsplash('photo-1564013799919-ab600027ffc6', 700),
    fashion: unsplash('photo-1445205170230-053b83016050', 700),
    jewellery: unsplash('photo-1515562141207-7a88fb7ce338', 700),
  },
  avatars: {
    elena: unsplash('photo-1494790108377-be9c29b29330', 200),
    james: unsplash('photo-1507003211169-0a1dd7228f2d', 200),
    priya: unsplash('photo-1573496359142-b8d87734a5a2', 200),
  },
}

export const NAV_LINKS = [
  { label: 'Browse Auctions', href: '/auctions', type: 'route' },
  { label: 'Categories', href: '#categories', type: 'anchor' },
  { label: 'Live Auctions', href: '#live-auctions', type: 'anchor' },
  { label: 'How It Works', href: '#how-it-works', type: 'anchor' },
]

export const TRUST_ITEMS = [
  { icon: BadgeCheck, label: 'Trusted Sellers', detail: '12,000+ verified' },
  { icon: Lock, label: 'Secure Payments', detail: 'Escrow protected' },
  { icon: ShieldCheck, label: 'Verified Auctions', detail: 'Authenticated items' },
  { icon: Clock, label: '24/7 Availability', detail: 'Bid from anywhere' },
]

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in under a minute and verify your identity to unlock bidding.',
  },
  {
    step: 2,
    icon: Compass,
    title: 'Explore Auctions',
    description: 'Browse curated listings across categories, from watches to real estate.',
  },
  {
    step: 3,
    icon: Gavel,
    title: 'Bid Live',
    description: 'Join live rooms and place bids in real time with instant updates.',
  },
  {
    step: 4,
    icon: Trophy,
    title: 'Win Auctions',
    description: 'Secure your item with protected payments and tracked delivery.',
  },
]

export const CATEGORIES = [
  { image: IMAGES.categories.electronics, label: 'Electronics', listings: '1,240 listings' },
  { image: IMAGES.categories.watches, label: 'Luxury Watches', listings: '860 listings' },
  { image: IMAGES.categories.art, label: 'Art', listings: '1,530 listings' },
  { image: IMAGES.categories.collectibles, label: 'Collectibles', listings: '2,110 listings' },
  { image: IMAGES.categories.vehicles, label: 'Vehicles', listings: '430 listings' },
  { image: IMAGES.categories.realEstate, label: 'Real Estate', listings: '150 listings' },
  { image: IMAGES.categories.fashion, label: 'Fashion', listings: '980 listings' },
  { image: IMAGES.categories.jewellery, label: 'Jewellery', listings: '740 listings' },
]

export const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time Bidding',
    description: 'Sub-second bid updates keep every participant perfectly in sync.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'Every seller passes identity and provenance checks before listing.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    description: 'Escrow-protected payments and encrypted sessions on every auction.',
  },
  {
    icon: Bell,
    title: 'Instant Updates',
    description: 'Outbid alerts and auction milestones reach you the moment they happen.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive Experience',
    description: 'A seamless experience across desktop, tablet, and mobile.',
  },
  {
    icon: Crown,
    title: 'Premium Marketplace',
    description: 'Curated listings vetted for authenticity, condition, and value.',
  },
]

export const STATISTICS = [
  { value: 10000, suffix: '+', label: 'Auctions Completed' },
  { value: 5000, suffix: '+', label: 'Active Users' },
  { value: 250, suffix: '+', label: 'Live Auctions' },
  { value: 99, suffix: '%', label: 'Customer Satisfaction' },
]

export const TESTIMONIALS = [
  {
    name: 'Elena Marchetti',
    role: 'Private Art Collector',
    avatar: IMAGES.avatars.elena,
    verified: true,
    quote:
      'BidArena is the first platform where live bidding actually feels live. I won a Basquiat lithograph from my study in Milan without missing a single bid.',
  },
  {
    name: 'Daniel Reyes',
    role: 'Vintage Watch Dealer',
    avatar: IMAGES.avatars.james,
    verified: true,
    quote:
      'The verification process gives my buyers real confidence. My average hammer price has increased 22% since I moved my inventory to BidArena.',
  },
  {
    name: 'Priya Raghavan',
    role: 'Gallery Owner, Chennai',
    avatar: IMAGES.avatars.priya,
    verified: true,
    quote:
      'We run weekly sales for emerging artists and the live rooms are flawless. The platform feels premium in a way our collectors immediately notice.',
  },
]

export const FOOTER_COLUMNS = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'Browse Auctions', href: '/auctions' },
      { label: 'Live Auctions', href: '#live-auctions' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Create Account', href: '/register' },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Luxury Watches', href: '#categories' },
      { label: 'Art', href: '#categories' },
      { label: 'Collectibles', href: '#categories' },
      { label: 'Vehicles', href: '#categories' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Shipping & Delivery', href: '#' },
      { label: 'Returns', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Auction Rules', href: '#' },
    ],
  },
]

export const HERO_AUCTION = {
  title: 'Heritage Titanium Chronometer, Ref. 79030',
  currentBid: 24750,
  timeRemaining: '02:14:36',
  participants: 38,
  latestBidder: 'A. Khanna',
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
