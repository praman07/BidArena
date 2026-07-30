import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/auctionDetailsData'
import CountdownTimer from './CountdownTimer'

export default function StickyBidCard({
  auction,
  visible,
  remainingSeconds,
  serverControlled = false,
  canPay = false,
  paymentStatus = 'PENDING',
  onPayNow,
  paying = false,
}) {
  const isLive = auction.status === 'LIVE' || auction.status === 'ACTIVE'
  const isEnded = auction.status === 'ENDED' || auction.apiStatus === 'ENDED'
  const isPaid = paymentStatus === 'PAID'
  const timerSeconds =
    remainingSeconds !== undefined && remainingSeconds !== null
      ? remainingSeconds
      : auction.endsInSeconds

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
                    {isLive || isEnded ? 'Current bid' : 'Est. value'}{' '}
                    <span className="font-semibold text-foreground">
                      {formatCurrency(
                        isLive || isEnded ? auction.currentBid : auction.estimatedValue
                      )}
                    </span>
                  </span>
                  {!isEnded ? (
                    <span className="inline-flex items-center gap-1.5">
                      Ends in
                      <CountdownTimer
                        initialSeconds={timerSeconds}
                        remainingSeconds={timerSeconds}
                        controlled={serverControlled}
                        compact
                        className="text-foreground"
                      />
                    </span>
                  ) : (
                    <span className="font-medium text-foreground">
                      {isPaid ? 'Payment completed' : 'Auction ended'}
                    </span>
                  )}
                </div>
              </div>

              {canPay && !isPaid ? (
                <Button
                  type="button"
                  size="lg"
                  className="shrink-0 rounded-xl"
                  disabled={paying}
                  onClick={onPayNow}
                >
                  {paying
                    ? 'Processing…'
                    : paymentStatus === 'FAILED'
                      ? 'Retry Payment'
                      : 'Pay Now'}
                </Button>
              ) : !isEnded ? (
                <Link
                  to={`/auction-room/${auction.id}`}
                  className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 rounded-xl')}
                >
                  Join Auction
                </Link>
              ) : null}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
