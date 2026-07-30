import {
  AUCTIONS,
  formatCurrency,
} from './auctionData'
import rolexDaytona from '@/assets/images/rolex-daytona.jpg'
import omegaSeamaster from '@/assets/images/omega-seamaster.jpg'
import featuredWatch from '@/assets/images/featured-watch.jpg'
import patekPhilippe from '@/assets/images/patek-philippe.jpg'
import lamborghini from '@/assets/images/lamborghini.jpg'
import porsche from '@/assets/images/porsche.jpg'
import diamondRing from '@/assets/images/diamond-ring.jpg'
import goldNecklace from '@/assets/images/gold-necklace.jpg'
import picasso from '@/assets/images/picasso.jpg'
import leicaCamera from '@/assets/images/leica-camera.jpg'
import luxuryHandbag from '@/assets/images/luxury-handbag.jpg'
import hermesBirkin from '@/assets/images/hermes-birkin.jpg'

export { formatCurrency }

const SELLER_AVATARS = {
  'Geneva Timepieces':
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'Atelier Horology':
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'Analog Archive':
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'Autohaus Klassik':
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  'Marlow Gallery':
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'Vault Collectibles':
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'Maison Aurele':
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  TechVault:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  SoleVault:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80',
  'Maison Atelier':
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  'Estate Collective':
    'https://images.unsplash.com/photo-1544005313-94a5ddfe1c2e?auto=format&fit=crop&w=200&q=80',
}

const GALLERY_BY_CATEGORY = {
  'Luxury Watches': [
    { src: rolexDaytona, alt: 'Rolex Daytona front dial close-up' },
    { src: omegaSeamaster, alt: 'Luxury chronograph case and bracelet detail' },
    { src: featuredWatch, alt: 'Watch photographed in dramatic studio light' },
    { src: patekPhilippe, alt: 'Dress watch on wrist in natural light' },
  ],
  Vehicles: [
    { src: lamborghini, alt: 'Sports car exterior three-quarter view' },
    { src: porsche, alt: 'Performance coupe on an open highway' },
    { src: lamborghini, alt: 'Low-angle view of the front fascia' },
    { src: porsche, alt: 'Rear profile at dusk' },
  ],
  Jewellery: [
    { src: diamondRing, alt: 'Diamond ring on a dark surface' },
    { src: goldNecklace, alt: 'Gold necklace with pendant detail' },
    { src: diamondRing, alt: 'Ring side profile showing setting' },
    { src: goldNecklace, alt: 'Jewellery photographed on marble' },
  ],
  'Fine Art': [
    { src: picasso, alt: 'Oil painting full composition' },
    { src: picasso, alt: 'Brushwork and texture detail' },
    { src: picasso, alt: 'Framed artwork in gallery light' },
    { src: picasso, alt: 'Canvas corner and signature area' },
  ],
  Cameras: [
    { src: leicaCamera, alt: 'Vintage camera front view' },
    { src: leicaCamera, alt: 'Lens and focusing ring detail' },
    { src: leicaCamera, alt: 'Camera body from above' },
    { src: leicaCamera, alt: 'Viewfinder and shutter controls' },
  ],
  Fashion: [
    { src: luxuryHandbag, alt: 'Luxury handbag studio portrait' },
    { src: hermesBirkin, alt: 'Leather bag on a clean backdrop' },
    { src: luxuryHandbag, alt: 'Hardware and stitch detail' },
    { src: hermesBirkin, alt: 'Interior lining and pocket layout' },
  ],
}

const DEFAULT_GALLERY = GALLERY_BY_CATEGORY['Luxury Watches']

const SPECS_BY_CATEGORY = {
  'Luxury Watches': {
    Brand: 'Rolex',
    Condition: 'Excellent — unworn presentation',
    Year: '2023',
    Model: 'Cosmograph Daytona 116500LN',
    Certificate: 'Rolex Official Certificate + Box',
    Origin: 'Geneva, Switzerland',
    Material: 'Oystersteel & Cerachrom ceramic',
    Dimensions: '40mm case · 20mm bracelet',
  },
  Vehicles: {
    Brand: 'Lamborghini',
    Condition: 'Collector grade · 2,140 miles',
    Year: '2022',
    Model: 'Huracán EVO',
    Certificate: 'Manufacturer service history',
    Origin: 'Sant’Agata Bolognese, Italy',
    Material: 'Carbon fiber & aluminum body',
    Dimensions: '4,520 × 1,933 × 1,165 mm',
  },
  Jewellery: {
    Brand: 'Maison Aurele',
    Condition: 'Mint · professionally cleaned',
    Year: '2021',
    Model: 'Halo Solitaire 2.1ct',
    Certificate: 'GIA Diamond Dossier',
    Origin: 'Antwerp, Belgium',
    Material: 'Platinum & natural diamond',
    Dimensions: 'Size 6.5 · adjustable',
  },
  'Fine Art': {
    Brand: 'Studio Archive',
    Condition: 'Museum conservation grade',
    Year: '1962',
    Model: 'Original drawing on paper',
    Certificate: 'Independent provenance report',
    Origin: 'Paris, France',
    Material: 'Ink & graphite on archival paper',
    Dimensions: '48 × 36 cm (framed)',
  },
  Cameras: {
    Brand: 'Leica',
    Condition: 'Fully serviced · shutter accurate',
    Year: '1989',
    Model: 'M6 Rangefinder',
    Certificate: 'Leica Classic Passport',
    Origin: 'Wetzlar, Germany',
    Material: 'Brass & vulcanite body',
    Dimensions: '138 × 77 × 33.5 mm',
  },
  Fashion: {
    Brand: 'Hermès',
    Condition: 'Pristine · dust bag included',
    Year: '2020',
    Model: 'Kelly 28 / Birkin 35',
    Certificate: 'Hermès authenticity card',
    Origin: 'Paris, France',
    Material: 'Togo leather & gold hardware',
    Dimensions: '28–35 cm body',
  },
  Electronics: {
    Brand: 'Apple',
    Condition: 'Sealed retail packaging',
    Year: '2024',
    Model: 'MacBook Pro 16" M3 Max',
    Certificate: 'Apple Limited Warranty',
    Origin: 'Cupertino, USA',
    Material: 'Aluminum unibody',
    Dimensions: '14.01 × 9.77 × 0.66 in',
  },
  Collectibles: {
    Brand: 'The Pokémon Company',
    Condition: 'Graded · sealed sleeves',
    Year: '1999',
    Model: '1st Edition Base Set Lot',
    Certificate: 'PSA / BGS grading slips',
    Origin: 'Japan / USA distribution',
    Material: 'Trading card stock',
    Dimensions: 'Standard card · binder lot',
  },
  'Real Estate': {
    Brand: 'Estate Collective',
    Condition: 'Turnkey · recently renovated',
    Year: '2018',
    Model: 'Coastal villa experience',
    Certificate: 'Title & inspection packet',
    Origin: 'Amalfi Coast, Italy',
    Material: 'Stone, terracotta & glass',
    Dimensions: '4 bedrooms · private pool',
  },
}

const DESCRIPTIONS = {
  'rolex-daytona': `This Rolex Cosmograph Daytona 116500LN represents one of the most sought-after modern sports watches in the secondary market. Finished in Oystersteel with a black Cerachrom ceramic bezel, the piece retains its full manufacturer presentation: outer box, inner case, booklets, and official Rolex certificate.

The automatic chronograph calibre 4130 is chronometer-certified and offers a power reserve of approximately 72 hours. The dial features applied indexes, luminous Chromalight hands, and three snailed subdials — a configuration collectors regard as the definitive contemporary Daytona look.

Sourced from a private Geneva collection and authenticated by our in-house horology desk, the watch shows no signs of wear on the case, bracelet, or clasp. Serial and reference engravings remain crisp. Bidding is open to verified members only; escrow protection applies through settlement and insured delivery.`,

  default: `This carefully curated lot has been authenticated by BidArena’s specialist desk and is offered with full provenance documentation. Condition notes, service history, and supporting certificates are available in the Specifications tab.

The item is held in secure storage pending hammer and is eligible for insured worldwide shipping. All bids are binding once confirmed in the live room. Escrow funds are released only after buyer inspection windows close successfully.`,
}

const BID_NAMES = [
  'A. Khanna',
  'M. Laurent',
  'S. Okada',
  'E. Marchetti',
  'J. Whitfield',
  'P. Raghavan',
  'C. Moreau',
  'R. Delgado',
  'N. Bergström',
  'L. Chen',
]

function buildBidHistory(currentBid, status) {
  if (status !== 'LIVE' || !currentBid) {
    return [
      {
        id: 'bid-0',
        user: 'Auction Desk',
        amount: null,
        time: 'Auction opens soon',
        status: 'Scheduled',
      },
    ]
  }

  const amounts = [
    currentBid,
    Math.round(currentBid * 0.97),
    Math.round(currentBid * 0.94),
    Math.round(currentBid * 0.91),
    Math.round(currentBid * 0.88),
    Math.round(currentBid * 0.85),
    Math.round(currentBid * 0.82),
    Math.round(currentBid * 0.78),
  ]

  const times = [
    'Just now',
    '2 min ago',
    '8 min ago',
    '14 min ago',
    '27 min ago',
    '41 min ago',
    '1 hr ago',
    '2 hr ago',
  ]

  return amounts.map((amount, index) => ({
    id: `bid-${index}`,
    user: BID_NAMES[index % BID_NAMES.length],
    amount,
    time: times[index],
    status: index === 0 ? 'Leading' : index === 1 ? 'Outbid' : 'Outbid',
  }))
}

function buildSeller(name) {
  return {
    name,
    avatar: SELLER_AVATARS[name] || SELLER_AVATARS['Geneva Timepieces'],
    verified: true,
    rating: 4.9,
    reviewCount: 128,
    completedAuctions: 340,
    yearsOnPlatform: 6,
    location: 'Geneva, Switzerland',
    responseTime: 'Usually responds within 1 hour',
  }
}

function buildGallery(auction) {
  const byCategory = GALLERY_BY_CATEGORY[auction.category] || DEFAULT_GALLERY
  const primary = { src: auction.image, alt: auction.imageAlt }
  const rest = byCategory.filter((img) => img.src !== auction.image).slice(0, 3)
  return [primary, ...rest].slice(0, 4)
}

function buildSpecs(auction) {
  const base = SPECS_BY_CATEGORY[auction.category] || SPECS_BY_CATEGORY['Luxury Watches']
  if (auction.id === 'rolex-daytona') return base
  if (auction.id === 'patek-philippe') {
    return {
      ...base,
      Brand: 'Patek Philippe',
      Model: 'Calatrava Ref. 5227G',
      Material: '18k white gold',
      Dimensions: '39mm case · leather strap',
    }
  }
  if (auction.id === 'lamborghini-huracan') return SPECS_BY_CATEGORY.Vehicles
  if (auction.id === 'diamond-halo-ring') return SPECS_BY_CATEGORY.Jewellery
  if (auction.id === 'picasso-painting') return SPECS_BY_CATEGORY['Fine Art']
  if (auction.id === 'leica-m6') return SPECS_BY_CATEGORY.Cameras
  if (auction.id === 'hermes-kelly' || auction.id === 'birkin-35') {
    return SPECS_BY_CATEGORY.Fashion
  }
  return {
    ...base,
    Brand: auction.seller.split(' ')[0],
    Model: auction.title.split('—')[0].trim(),
  }
}

function buildDescription(auction) {
  if (DESCRIPTIONS[auction.id]) return DESCRIPTIONS[auction.id]
  return `${auction.title} is offered through BidArena’s verified marketplace with authenticated provenance and escrow-protected settlement.

${DESCRIPTIONS.default}

Current bidding stands at ${formatCurrency(auction.currentBid)} against an estimated value of ${formatCurrency(auction.estimatedValue)}. ${auction.participants} collectors are actively following this lot.`
}

/** Fully styled Rolex lot used as the canonical details example. */
export const ROLEX_DETAILS = {
  id: 'rolex-daytona',
  title: 'Rolex Daytona Cosmograph — Ceramic Bezel',
  shortTitle: 'Rolex Daytona',
  category: 'Luxury Watches',
  status: 'LIVE',
  currentBid: 28500,
  estimatedValue: 35000,
  startingPrice: 18000,
  reservePrice: 26000,
  endsInSeconds: 1 * 3600 + 42 * 60 + 18,
  participants: 52,
  views: 1840,
  watchers: 96,
  image: rolexDaytona,
  imageAlt: 'Rolex Daytona chronograph wristwatch in close-up',
  seller: buildSeller('Geneva Timepieces'),
  gallery: [
    { src: rolexDaytona, alt: 'Rolex Daytona dial and ceramic bezel close-up' },
    { src: omegaSeamaster, alt: 'Bracelet and clasp detail under studio light' },
    { src: featuredWatch, alt: 'Case profile in dramatic side lighting' },
    { src: patekPhilippe, alt: 'Wrist presence reference photograph' },
  ],
  description: DESCRIPTIONS['rolex-daytona'],
  specifications: SPECS_BY_CATEGORY['Luxury Watches'],
  bidHistory: buildBidHistory(28500, 'LIVE'),
}

export function getAuctionDetails(id) {
  if (id === ROLEX_DETAILS.id) return ROLEX_DETAILS

  const auction = AUCTIONS.find((item) => item.id === id)
  if (!auction) return null

  const endsInSeconds = Math.max(60, Math.round(auction.endsInHours * 3600))

  return {
    id: auction.id,
    title: auction.title,
    shortTitle: auction.title.split('—')[0].trim(),
    category: auction.category,
    status: auction.status,
    currentBid: auction.currentBid,
    estimatedValue: auction.estimatedValue,
    startingPrice: Math.round((auction.currentBid || auction.estimatedValue) * 0.55),
    reservePrice: Math.round((auction.estimatedValue || auction.currentBid) * 0.75),
    endsInSeconds,
    participants: auction.participants,
    views: Math.round(auction.participants * 28 + 420),
    watchers: Math.round(auction.participants * 1.6),
    image: auction.image,
    imageAlt: auction.imageAlt,
    seller: buildSeller(auction.seller),
    gallery: buildGallery(auction),
    description: buildDescription(auction),
    specifications: buildSpecs(auction),
    bidHistory: buildBidHistory(auction.currentBid, auction.status),
  }
}

export function getRelatedAuctions(currentId, limit = 4) {
  const current = AUCTIONS.find((item) => item.id === currentId)
  const sameCategory = AUCTIONS.filter(
    (item) => item.id !== currentId && item.category === current?.category
  )
  const others = AUCTIONS.filter(
    (item) => item.id !== currentId && item.category !== current?.category
  )
  return [...sameCategory, ...others].slice(0, limit)
}

export const DETAIL_TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'bids', label: 'Bid History' },
  { id: 'seller', label: 'Seller' },
]
