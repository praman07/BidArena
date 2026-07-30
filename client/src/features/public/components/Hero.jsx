import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Gavel, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HERO_AUCTION, IMAGES, formatCurrency } from '../constants/landingData'

function LivePulse() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
    </span>
  )
}

function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Large premium product image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="overflow-hidden rounded-2xl shadow-2xl shadow-neutral-900/15"
      >
        <img
          src={IMAGES.hero}
          alt="Luxury chronograph watch photographed in dramatic studio light"
          className="h-[420px] w-full object-cover sm:h-[520px]"
          fetchpriority="high"
        />
      </motion.div>

      {/* Floating live auction card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        className="absolute -bottom-8 -left-4 w-72 rounded-xl border border-border/60 bg-white/95 p-5 shadow-xl shadow-neutral-900/10 backdrop-blur-sm sm:-left-10"
      >
        <div className="flex items-center justify-between">
          <Badge variant="live">
            <LivePulse />
            LIVE AUCTION
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {HERO_AUCTION.participants}
          </span>
        </div>

        <p className="mt-3 text-sm font-medium leading-snug">{HERO_AUCTION.title}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Current bid
            </p>
            <p className="text-xl font-semibold tracking-tight">
              {formatCurrency(HERO_AUCTION.currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Ends in
            </p>
            <p className="font-mono text-sm font-medium">{HERO_AUCTION.timeRemaining}</p>
          </div>
        </div>

        <Link
          to="/auctions"
          className={cn(buttonVariants({ size: 'sm' }), 'mt-4 w-full rounded-lg')}
        >
          Join Auction
        </Link>
      </motion.div>

      {/* Floating bid notification */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
        className="absolute -right-3 top-8 hidden rounded-xl border border-border/60 bg-white/95 p-3.5 shadow-lg shadow-neutral-900/10 backdrop-blur-sm sm:block lg:-right-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
            <Gavel className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium">
              {HERO_AUCTION.latestBidder} placed a bid
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(HERO_AUCTION.currentBid)} · just now
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="overflow-hidden pb-28 pt-32 sm:pt-40"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Badge variant="outline" className="mb-6 px-3 py-1 shadow-sm">
            <LivePulse />
            <span className="ml-1">250+ auctions live right now</span>
          </Badge>

          <h1
            id="hero-heading"
            className="text-[2.75rem] font-semibold leading-[1.05] tracking-tighter text-foreground sm:text-6xl lg:text-[4.25rem]"
          >
            Bid Smarter.
            <br />
            Win{' '}
            <span className="text-neutral-400">Extraordinary.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            BidArena is the premium marketplace for real-time online auctions.
            Discover rare finds, sell to a global audience of collectors, and
            bid live with instant updates — all in one trusted platform.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auctions"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'rounded-xl px-7 shadow-md shadow-neutral-900/10 transition-shadow hover:shadow-lg'
              )}
            >
              Browse Auctions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/register"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'rounded-xl px-7 shadow-sm'
              )}
            >
              Start Selling
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Free to join · No listing fees for your first auction
          </p>
        </motion.div>

        <HeroShowcase />
      </div>
    </section>
  )
}
