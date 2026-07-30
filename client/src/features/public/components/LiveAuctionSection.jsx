import { motion } from 'framer-motion'
import { LIVE_AUCTIONS } from '../constants/landingData'
import AuctionCard from './AuctionCard'

export default function LiveAuctionSection() {
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
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LIVE_AUCTIONS.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
