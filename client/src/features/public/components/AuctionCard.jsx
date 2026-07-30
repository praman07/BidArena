import { Link } from 'react-router-dom'
import { BadgeCheck, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/landingData'

export default function AuctionCard({ auction }) {
  const {
    title,
    category,
    image,
    imageAlt,
    seller,
    currentBid,
    timeRemaining,
    participants,
  } = auction

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10">
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
          aria-hidden="true"
        />
        <Badge variant="live" className="absolute left-3 top-3 shadow-sm">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          LIVE
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

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Current bid
            </p>
            <p className="text-xl font-semibold tracking-tight">
              {formatCurrency(currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Ends in
            </p>
            <p className="font-mono text-sm font-medium">{timeRemaining}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {participants} bidding
          </span>
          <Link
            to="/auctions"
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-lg')}
            aria-label={`Join auction: ${title}`}
          >
            Join Auction
          </Link>
        </div>
      </div>
    </article>
  )
}
