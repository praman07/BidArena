import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/auctionDetailsData'
import CountdownTimer from './CountdownTimer'

export default function StickyBidCard({ auction, visible }) {
  const isLive = auction.status === 'LIVE'

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden lg:block"
          aria-label="Sticky bid summary"
        >
          <div className="pointer-events-auto border-t border-border/70 bg-white/95 shadow-[0_-8px_30px_rgba(23,23,23,0.08)] backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tracking-tight">
                  {auction.shortTitle || auction.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    {isLive ? 'Current bid' : 'Est. value'}{' '}
                    <span className="font-semibold text-foreground">
                      {formatCurrency(isLive ? auction.currentBid : auction.estimatedValue)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    Ends in
                    <CountdownTimer
                      initialSeconds={auction.endsInSeconds}
                      compact
                      className="text-foreground"
                    />
                  </span>
                </div>
              </div>

              <Link
                to={`/auction-room/${auction.id}`}
                className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 rounded-xl')}
              >
                Join Auction
              </Link>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
