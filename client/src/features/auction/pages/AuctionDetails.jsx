import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, RefreshCw } from 'lucide-react'
import Navbar from '@/features/public/components/Navbar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useAuth from '@/features/auth/hooks/useAuth'
import useAuctionSocket from '@/hooks/useAuctionSocket'
import ProductGallery from '../components/ProductGallery'
import AuctionSummary from '../components/AuctionSummary'
import BidHistory from '../components/BidHistory'
import SellerCard from '../components/SellerCard'
import Specifications from '../components/Specifications'
import RelatedAuctions from '../components/RelatedAuctions'
import StickyBidCard from '../components/StickyBidCard'
import DetailsLoadingSkeleton from '../components/DetailsLoadingSkeleton'
import WinnerModal from '@/features/auction-room/components/WinnerModal'
import useAuctionPayment from '@/features/payment/hooks/useAuctionPayment'
import { getAuctionByIdRequest } from '../services/auctionService'
import {
  DETAIL_TABS,
  mapAuctionDetailsFromApi,
  mapRelatedAuctionsFromApi,
} from '../constants/auctionDetailsData'

const Footer = lazy(() => import('@/features/public/components/Footer'))

export default function AuctionDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [auction, setAuction] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('description')
  const [wishlisted, setWishlisted] = useState(false)
  const [showSticky, setShowSticky] = useState(false)

  const { live, dismissWinner } = useAuctionSocket(id, {
    enabled: Boolean(user && id),
  })

  const loadAuction = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAuctionByIdRequest(id)
      setAuction(mapAuctionDetailsFromApi(data.auction))
      setRelated(mapRelatedAuctionsFromApi(data.relatedAuctions || []))
    } catch (err) {
      setAuction(null)
      setRelated([])
      setError(err.message || 'Could not load this auction. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveTab('description')
    setWishlisted(false)
    loadAuction()
  }, [loadAuction])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const liveAuction = useMemo(() => {
    if (!auction) return null
    if (!live.joined) return auction

    const status =
      live.ended || live.status === 'ENDED'
        ? 'ENDED'
        : live.remainingSeconds > 0
          ? 'LIVE'
          : auction.status

    const winnerFromLive = live.winner?.winner
      ? {
          id: live.winner.winner.id || live.winner.winner.userId,
          username: live.winner.winner.username,
        }
      : null

    return {
      ...auction,
      status,
      apiStatus: status === 'ENDED' ? 'ENDED' : auction.apiStatus,
      currentBid: live.currentBid || auction.currentBid,
      participants: live.participants || auction.participants,
      endsInSeconds: live.remainingSeconds,
      highestBidder: live.highestBidder || auction.highestBidder,
      winner: winnerFromLive || auction.winner,
      bidHistory: live.bids?.length ? live.bids : auction.bidHistory,
    }
  }, [auction, live])

  const winnerId =
    liveAuction?.winner?.id ||
    liveAuction?.winner?._id ||
    (typeof liveAuction?.winner === 'string' ? liveAuction.winner : null) ||
    liveAuction?.highestBidder?.id ||
    liveAuction?.highestBidder?._id ||
    null

  const isEnded =
    liveAuction?.status === 'ENDED' || liveAuction?.apiStatus === 'ENDED'
  const isWinner =
    Boolean(user?.id) && Boolean(winnerId) && String(user.id) === String(winnerId)
  const paymentStatus = liveAuction?.paymentStatus || 'PENDING'
  const canPay = Boolean(isEnded && isWinner && paymentStatus !== 'PAID')

  const applyPaymentAuction = useCallback((paidAuction) => {
    if (!paidAuction) return
    setAuction((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        status: paidAuction.status || prev.status,
        apiStatus: paidAuction.status || prev.apiStatus,
        winner: paidAuction.winner || prev.winner,
        paymentStatus: paidAuction.paymentStatus || prev.paymentStatus,
        paymentId: paidAuction.paymentId || prev.paymentId,
        orderId: paidAuction.orderId || prev.orderId,
        paidAt: paidAuction.paidAt || prev.paidAt,
        paymentMethod: paidAuction.paymentMethod || prev.paymentMethod,
        transactionAmount: paidAuction.transactionAmount || prev.transactionAmount,
      }
    })
  }, [])

  const { paying, startPayment } = useAuctionPayment({
    auctionId: id,
    onPaid: applyPaymentAuction,
    onFailed: applyPaymentAuction,
  })

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: liveAuction?.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      // User cancelled share or clipboard unavailable — no-op.
    }
  }

  const shell = (content) => (
    <div className="bg-white text-foreground">
      <Navbar />
      {content}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )

  if (loading) {
    return shell(
      <main className="border-b border-border/70 bg-neutral-50/60 pt-28 sm:pt-32">
        <DetailsLoadingSkeleton />
      </main>
    )
  }

  if (error) {
    return shell(
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50/60 px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
          <Button type="button" className="mt-6 rounded-lg" onClick={loadAuction}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </Button>
          <Link
            to="/auctions"
            className="mt-4 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Browse Auctions
          </Link>
        </div>
      </main>
    )
  }

  if (!liveAuction) {
    return shell(
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
    )
  }

  return shell(
    <>
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
                <li className="font-medium text-foreground">{liveAuction.shortTitle}</li>
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
            <ProductGallery images={liveAuction.gallery} title={liveAuction.title} />
            <AuctionSummary
              auction={liveAuction}
              wishlisted={wishlisted}
              onToggleWishlist={() => setWishlisted((prev) => !prev)}
              onShare={handleShare}
              remainingSeconds={liveAuction.endsInSeconds}
              serverControlled={live.joined}
              canPay={canPay}
              paymentStatus={paymentStatus}
              onPayNow={startPayment}
              paying={paying}
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

            <div role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="min-h-[220px]">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl space-y-4 text-[15px] leading-7 text-muted-foreground"
                >
                  {(liveAuction.description || 'No description provided.')
                    .split('\n\n')
                    .map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
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
                  <Specifications specifications={liveAuction.specifications} />
                </motion.div>
              )}

              {activeTab === 'bids' && (
                <motion.div
                  key="bids"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BidHistory bids={liveAuction.bidHistory} />
                </motion.div>
              )}

              {activeTab === 'seller' && (
                <motion.div
                  key="seller"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SellerCard seller={liveAuction.seller} />
                </motion.div>
              )}
            </div>
          </section>

          <RelatedAuctions auctions={related} />
        </div>
      </main>

      <StickyBidCard
        auction={liveAuction}
        visible={showSticky}
        remainingSeconds={liveAuction.endsInSeconds}
        serverControlled={live.joined}
        canPay={canPay}
        paymentStatus={paymentStatus}
        onPayNow={startPayment}
        paying={paying}
      />

      <WinnerModal
        open={Boolean(live.winner)}
        winner={live.winner?.winner}
        winningAmount={live.winner?.winningAmount}
        message={live.winner?.message}
        onClose={dismissWinner}
        canPay={canPay}
        onPayNow={() => {
          dismissWinner()
          startPayment()
        }}
        paying={paying}
      />
    </>
  )
}
