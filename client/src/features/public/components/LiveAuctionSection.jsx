import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useFeaturedAuctions from '../hooks/useFeaturedAuctions'
import AuctionCard from './AuctionCard'

function AuctionCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-[80%] animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
        <div className="mt-4 flex justify-between">
          <div className="h-8 w-24 animate-pulse rounded bg-neutral-100" />
          <div className="h-8 w-20 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="mt-2 flex gap-2 border-t border-border/70 pt-4">
          <div className="h-8 flex-1 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-8 flex-1 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

export default function LiveAuctionSection() {
  const { auctions, loading, error, retry } = useFeaturedAuctions()

  return (
    <section id="live-auctions" aria-labelledby="live-auctions-heading" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Live Now
          </p>
          <h2
            id="live-auctions-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Live Auctions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join auctions happening right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-14"
        >
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <AuctionCardSkeleton key={`featured-skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-neutral-50/60 px-6 py-16 text-center">
              <p className="text-base font-medium tracking-tight">
                Unable to load featured auctions.
              </p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
              <Button type="button" className="mt-6 rounded-lg" onClick={retry}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Retry
              </Button>
            </div>
          ) : null}

          {!loading && !error && auctions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-neutral-50/60 px-6 py-16 text-center">
              <p className="text-base font-medium tracking-tight">No Live Auctions Available</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Be the first to list a lot and go live on BidArena.
              </p>
              <Link
                to="/auctions/create"
                className={cn(buttonVariants(), 'mt-6 rounded-lg')}
              >
                Create Auction
              </Link>
            </div>
          ) : null}

          {!loading && !error && auctions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {auctions.map((auction) => (
                <AuctionCard key={auction._id || auction.id} auction={auction} />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
