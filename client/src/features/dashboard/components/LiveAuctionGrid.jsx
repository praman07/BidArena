import { Link } from 'react-router-dom'
import AuctionCard from '@/features/auction/components/AuctionCard'
import EmptyState from './EmptyState'

export default function LiveAuctionGrid({ auctions = [] }) {
  if (!auctions.length) {
    return (
      <EmptyState
        title="No live auctions"
        description="Check back soon — premium live rooms open throughout the day."
        actionLabel="Browse Auctions"
        actionHref="/auctions"
      />
    )
  }

  return (
    <section aria-labelledby="live-auctions-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Live Now</p>
          <h2 id="live-auctions-heading" className="mt-1 text-lg font-semibold tracking-tight">
            Live Auctions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Rooms with active bidding right now.
          </p>
        </div>
        <Link
          to="/auctions"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {auctions.map((auction, index) => (
          <AuctionCard key={auction.id} auction={auction} index={index} />
        ))}
      </div>
    </section>
  )
}
