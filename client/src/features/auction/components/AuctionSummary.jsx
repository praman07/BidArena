import { Link } from 'react-router-dom'
import { Eye, Heart, Share2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/auctionDetailsData'
import CountdownTimer from './CountdownTimer'

function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
      <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
    </span>
  )
}

export default function AuctionSummary({
  auction,
  wishlisted,
  onToggleWishlist,
  onShare,
}) {
  const isLive = auction.status === 'LIVE'

  return (
    <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        {isLive ? (
          <Badge variant="live">
            <LivePulse />
            LIVE
          </Badge>
        ) : (
          <Badge variant="outline">UPCOMING</Badge>
        )}
        <Badge variant="secondary">{auction.category}</Badge>
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        {auction.title}
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {isLive ? 'Current highest bid' : 'Opening soon'}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {isLive ? formatCurrency(auction.currentBid) : '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Estimated value
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-muted-foreground">
            {formatCurrency(auction.estimatedValue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Starting price
          </p>
          <p className="mt-1 text-base font-medium tracking-tight">
            {formatCurrency(auction.startingPrice)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Reserve price
          </p>
          <p className="mt-1 text-base font-medium tracking-tight">
            {formatCurrency(auction.reservePrice)}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Auction ends in
        </p>
        <div className="mt-3">
          <CountdownTimer initialSeconds={auction.endsInSeconds} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          {auction.participants} participants
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-4 w-4" aria-hidden="true" />
          {auction.views.toLocaleString()} views
        </span>
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-lg"
          onClick={onToggleWishlist}
          aria-label={wishlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-pressed={wishlisted}
        >
          <Heart
            className={cn('h-4 w-4', wishlisted && 'fill-current text-red-500')}
            aria-hidden="true"
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-lg"
          onClick={onShare}
          aria-label="Share auction"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to={`/auction-room/${auction.id}`}
          className={cn(buttonVariants({ size: 'lg' }), 'rounded-xl sm:flex-1')}
        >
          Join Live Auction
        </Link>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-xl sm:flex-1"
          onClick={onToggleWishlist}
        >
          <Heart
            className={cn('h-4 w-4', wishlisted && 'fill-current text-red-500')}
            aria-hidden="true"
          />
          {wishlisted ? 'Saved to Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>
    </div>
  )
}
