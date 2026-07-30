import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Heart, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/auctionData'

function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
      <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
    </span>
  )
}

export default function AuctionCard({ auction, index = 0 }) {
  const {
    id,
    title,
    category,
    status,
    image,
    imageAlt,
    seller,
    currentBid,
    startingBid,
    timeRemaining,
    participants,
    progress,
  } = auction

  const navigate = useNavigate()
  const [wishlisted, setWishlisted] = useState(false)
  const isLive = status === 'LIVE'

  return (
    <motion.article
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/auctions/${id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate(`/auctions/${id}`)
        }
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.32), ease: 'easeOut' }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          aria-hidden="true"
        />

        {isLive ? (
          <Badge variant="live" className="absolute left-3 top-3 shadow-sm">
            <LivePulse />
            LIVE
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="absolute left-3 top-3 border-white/20 bg-black/40 text-white backdrop-blur-sm"
          >
            {status === 'ENDED' ? 'ENDED' : 'UPCOMING'}
          </Badge>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setWishlisted((prev) => !prev)
          }}
          aria-label={wishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
          aria-pressed={wishlisted}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors',
            wishlisted
              ? 'border-red-200 bg-white text-red-500'
              : 'border-white/20 bg-black/40 text-white hover:bg-black/55'
          )}
        >
          <Heart
            className={cn('h-4 w-4', wishlisted && 'fill-current')}
            aria-hidden="true"
          />
        </button>

        <Badge
          variant="outline"
          className="absolute bottom-3 left-3 border-white/20 bg-black/40 text-white backdrop-blur-sm"
        >
          {category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">by {seller}</p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {isLive ? 'Current bid' : 'Starting bid'}
            </p>
            <p className="text-xl font-semibold tracking-tight">
              {formatCurrency(isLive ? currentBid : startingBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Starting bid
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {formatCurrency(startingBid)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {isLive ? 'Ends in' : status === 'ENDED' ? 'Status' : 'Starts'}
            </span>
            <span className="font-mono font-medium text-foreground">{timeRemaining}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isLive ? 'bg-neutral-950' : 'bg-neutral-300'
              )}
              style={{ width: `${Math.min(Math.max(progress, 4), 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {participants} {isLive ? 'bidding' : 'watching'}
          </span>
          <Link
            to={`/auctions/${id}`}
            onClick={(event) => event.stopPropagation()}
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-lg')}
            aria-label={`${isLive ? 'Join' : 'View'} auction: ${title}`}
          >
            {isLive ? 'Join Auction' : 'View Details'}
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
