import { motion } from 'framer-motion'
import AuctionCard from './AuctionCard'

export default function RelatedAuctions({ auctions = [] }) {
  if (!auctions.length) {
    return (
      <section aria-labelledby="related-auctions-heading" className="space-y-3">
        <h2 id="related-auctions-heading" className="text-2xl font-semibold tracking-tight">
          Related Auctions
        </h2>
        <p className="rounded-xl border border-dashed border-border bg-neutral-50/60 px-6 py-10 text-center text-sm text-muted-foreground">
          No related auctions right now.
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="related-auctions-heading" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          More to explore
        </p>
        <h2
          id="related-auctions-heading"
          className="mt-2 text-2xl font-semibold tracking-tight"
        >
          Related Auctions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Similar lots collectors are watching right now.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {auctions.map((auction, index) => (
          <AuctionCard key={auction.id} auction={auction} index={index} />
        ))}
      </div>
    </section>
  )
}
