import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FEATURED_AUCTION, formatCurrency } from '../constants/auctionData'

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':')
}

function LivePulse() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
    </span>
  )
}

export default function FeaturedAuction() {
  const auction = FEATURED_AUCTION
  const [remaining, setRemaining] = useState(auction.endsInSeconds)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      aria-labelledby="featured-auction-heading"
      className="relative overflow-hidden rounded-2xl border border-border/70 shadow-xl shadow-neutral-900/10"
    >
      <div className="absolute inset-0">
        <img
          src={auction.image}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-neutral-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
      </div>

      <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12 lg:py-16">
        <div className="max-w-xl text-white">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="live" className="shadow-sm">
              <LivePulse />
              Featured Live
            </Badge>
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
            >
              {auction.category}
            </Badge>
          </div>

          <h2
            id="featured-auction-heading"
            className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {auction.title}
          </h2>
          <p className="mt-3 text-base text-neutral-300 sm:text-lg">
            {auction.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/auctions/${auction.id}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'rounded-xl bg-white text-neutral-950 hover:bg-neutral-100'
              )}
            >
              Join Auction
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to={`/auctions/${auction.id}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white'
              )}
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:justify-self-end lg:w-full lg:max-w-xs">
          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-wide text-neutral-300">
              Current bid
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-neutral-300">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Ends in
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-white">
              {formatCountdown(remaining)}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-neutral-300">
              <Users className="h-3 w-3" aria-hidden="true" />
              Participants
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {auction.participants}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
