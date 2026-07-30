import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/useToast'
import useAuth from '@/features/auth/hooks/useAuth'
import useAuctionSocket from '@/hooks/useAuctionSocket'
import useAuctionPayment from '@/features/payment/hooks/useAuctionPayment'
import ProductGallery from '@/features/auction/components/ProductGallery'
import DetailsLoadingSkeleton from '@/features/auction/components/DetailsLoadingSkeleton'
import { getAuctionByIdRequest } from '@/features/auction/services/auctionService'
import {
  formatCurrency,
  mapAuctionDetailsFromApi,
} from '@/features/auction/constants/auctionDetailsData'
import BidPanel from '../components/BidPanel'
import BidHistory from '../components/BidHistory'
import Timer from '../components/Timer'
import Participants from '../components/Participants'
import WinnerModal from '../components/WinnerModal'

export default function AuctionRoom() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const [auction, setAuction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [placing, setPlacing] = useState(false)

  const { live, placeBid, clearError, clearSuccess, dismissWinner } = useAuctionSocket(id, {
    enabled: Boolean(id),
  })

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
        transactionAmount: paidAuction.transactionAmount || prev.transactionAmount,
      }
    })
  }, [])

  const { paying, startPayment } = useAuctionPayment({
    auctionId: id,
    onPaid: applyPaymentAuction,
    onFailed: applyPaymentAuction,
  })

  const loadAuction = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAuctionByIdRequest(id)
      setAuction(mapAuctionDetailsFromApi(data.auction))
    } catch (err) {
      setAuction(null)
      setError(err.message || 'Could not load this auction room.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadAuction()
  }, [loadAuction])

  useEffect(() => {
    if (!live.lastError) return
    toast.error(live.lastError)
    setPlacing(false)
    clearError()
  }, [live.lastError, toast, clearError])

  useEffect(() => {
    if (!live.lastSuccessBid) return
    toast.success(`Bid placed: ${formatCurrency(live.lastSuccessBid.amount)}`)
    setPlacing(false)
    clearSuccess()
  }, [live.lastSuccessBid, toast, clearSuccess])

  useEffect(() => {
    if (!live.joined || !live.bids) return
    setPlacing(false)
  }, [live.currentBid, live.bids, live.joined])

  const view = useMemo(() => {
    if (!auction) return null
    const status =
      live.ended || live.status === 'ENDED'
        ? 'ENDED'
        : live.remainingSeconds > 0 || auction.status === 'LIVE'
          ? 'LIVE'
          : auction.status

    return {
      ...auction,
      status,
      currentBid: live.joined ? live.currentBid : auction.currentBid,
      bidIncrement: live.bidIncrement || auction.bidIncrement,
      participants: live.joined ? live.participants : auction.participants,
      endsInSeconds: live.joined ? live.remainingSeconds : auction.endsInSeconds,
      highestBidder: live.highestBidder,
      bidHistory: live.joined && live.bids.length ? live.bids : auction.bidHistory,
    }
  }, [auction, live])

  const handlePlaceBid = (amount) => {
    setPlacing(true)
    placeBid(amount)
  }

  if (loading) {
    return <DetailsLoadingSkeleton />
  }

  if (error || !view) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50/60 px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Unable to open auction room</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{error || 'Auction not found.'}</p>
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
    )
  }

  const ended = view.status === 'ENDED' || live.ended

  const winnerId =
    live.winner?.winner?.id ||
    live.winner?.winner?.userId ||
    view.winner?.id ||
    view.highestBidder?.id ||
    null
  const isWinner =
    Boolean(user?.id) && Boolean(winnerId) && String(user.id) === String(winnerId)
  const canPay =
    Boolean(ended && isWinner && (view.paymentStatus || 'PENDING') !== 'PAID')

  return (
    <div className="space-y-8 pb-10">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link to={`/auctions/${view.id}`} className="transition-colors hover:text-foreground">
              Auction Details
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="font-medium text-foreground">Live Room</li>
        </ol>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {ended ? (
              <Badge variant="outline">ENDED</Badge>
            ) : (
              <Badge variant="live">LIVE</Badge>
            )}
            <Badge variant="secondary">{view.category}</Badge>
            <Badge variant="outline">
              {live.connected ? (live.joined ? 'Connected' : 'Joining…') : 'Reconnecting…'}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{view.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Current bid {formatCurrency(view.currentBid)}
            {view.highestBidder?.username
              ? ` · Leading: ${view.highestBidder.username}`
              : ''}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <ProductGallery images={view.gallery} title={view.title} />
          <BidHistory bids={view.bidHistory} />
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Timer remainingSeconds={view.endsInSeconds} ended={ended} />
          <Participants count={view.participants} />
          <BidPanel
            currentBid={view.currentBid}
            bidIncrement={view.bidIncrement}
            highestBidder={view.highestBidder}
            disabled={ended || !live.joined}
            isSubmitting={placing}
            onPlaceBid={handlePlaceBid}
          />
        </div>
      </div>

      <WinnerModal
        open={Boolean(live.winner)}
        winner={live.winner?.winner}
        winningAmount={live.winner?.winningAmount}
        message={live.winner?.message}
        onClose={dismissWinner}
        canPay={canPay}
        paying={paying}
        onPayNow={() => {
          dismissWinner()
          startPayment()
        }}
      />
    </div>
  )
}
