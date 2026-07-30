import { Link } from 'react-router-dom'
import { BadgeCheck, Clock, Gavel } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/landingData'
import useCountdown from '../hooks/useCountdown'

export default function AuctionCard({ auction }) {
  const id = auction._id || auction.id
  const title = auction.title
  const category = auction.category
  const image = auction.images?.[0] || ''
  const seller = auction.sellerName || 'Seller'
  const currentBid = auction.currentBid ?? auction.startingBid ?? 0
  const startingBid = auction.startingBid ?? 0
  const totalBids = auction.totalBids ?? 0
  const { label: timeRemaining } = useCountdown(auction.endTime)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10">
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
          aria-hidden="true"
        />
        <Badge variant="live" className="absolute left-3 top-3 shadow-sm">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          ACTIVE
        </Badge>
        <Badge
          variant="outline"
          className="absolute right-3 top-3 border-white/20 bg-black/40 text-white backdrop-blur-sm"
        >
          {category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
          {title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {seller}
          <BadgeCheck className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
          <span className="sr-only">Verified seller</span>
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Current bid
            </p>
            <p className="text-xl font-semibold tracking-tight">
              {formatCurrency(currentBid)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Starting {formatCurrency(startingBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Ends in
            </p>
            <p className="font-mono text-sm font-medium">{timeRemaining}</p>
            <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
              <Gavel className="h-3 w-3" aria-hidden="true" />
              {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-4">
          <Link
            to={`/auction/${id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'flex-1 rounded-lg')}
            aria-label={`Place bid on ${title}`}
          >
            Place Bid
          </Link>
          <Link
            to={`/auction/${id}`}
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'flex-1 rounded-lg'
            )}
            aria-label={`View details for ${title}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
