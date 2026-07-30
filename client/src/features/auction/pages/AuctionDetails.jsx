import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/features/public/components/Navbar'
import { cn } from '@/lib/utils'
import ProductGallery from '../components/ProductGallery'
import AuctionSummary from '../components/AuctionSummary'
import BidHistory from '../components/BidHistory'
import SellerCard from '../components/SellerCard'
import Specifications from '../components/Specifications'
import RelatedAuctions from '../components/RelatedAuctions'
import StickyBidCard from '../components/StickyBidCard'
import {
  DETAIL_TABS,
  getAuctionDetails,
  getRelatedAuctions,
} from '../constants/auctionDetailsData'

const Footer = lazy(() => import('@/features/public/components/Footer'))

export default function AuctionDetails() {
  const { id } = useParams()
  const auction = useMemo(() => getAuctionDetails(id), [id])
  const related = useMemo(() => getRelatedAuctions(id, 4), [id])

  const [activeTab, setActiveTab] = useState('description')
  const [wishlisted, setWishlisted] = useState(false)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveTab('description')
    setWishlisted(false)
  }, [id])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: auction?.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      // User cancelled share or clipboard unavailable — no-op for static demo.
    }
  }

  if (!auction) {
    return (
      <div className="bg-white text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight">Auction not found</h1>
          <p className="mt-3 text-muted-foreground">
            This listing may have ended or the link is incorrect.
          </p>
          <Link
            to="/auctions"
            className="mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline"
          >
            Back to Browse Auctions
          </Link>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="bg-white text-foreground">
      <Navbar />

      <main className="pb-28 lg:pb-24">
        <div className="border-b border-border/70 bg-neutral-50/60 pt-28 sm:pt-32">
          <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li>
                  <Link to="/auctions" className="transition-colors hover:text-foreground">
                    Browse Auctions
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li className="font-medium text-foreground">{auction.shortTitle}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 sm:py-12">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
            aria-label="Auction overview"
          >
            <ProductGallery images={auction.gallery} title={auction.title} />
            <AuctionSummary
              auction={auction}
              wishlisted={wishlisted}
              onToggleWishlist={() => setWishlisted((prev) => !prev)}
              onShare={handleShare}
            />
          </motion.section>

          <section aria-label="Auction details" className="space-y-6">
            <div
              role="tablist"
              aria-label="Detail sections"
              className="flex gap-1 overflow-x-auto border-b border-border/70"
            >
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'border-neutral-950 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className="min-h-[220px]"
            >
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl space-y-4 text-[15px] leading-7 text-muted-foreground"
                >
                  {auction.description.split('\n\n').map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Specifications specifications={auction.specifications} />
                </motion.div>
              )}

              {activeTab === 'bids' && (
                <motion.div
                  key="bids"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BidHistory bids={auction.bidHistory} />
                </motion.div>
              )}

              {activeTab === 'seller' && (
                <motion.div
                  key="seller"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SellerCard seller={auction.seller} />
                </motion.div>
              )}
            </div>
          </section>

          <RelatedAuctions auctions={related} />
        </div>
      </main>

      <StickyBidCard auction={auction} visible={showSticky} />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
