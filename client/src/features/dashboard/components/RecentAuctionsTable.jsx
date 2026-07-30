import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, RECENT_AUCTIONS } from '../constants/dashboardData'
import EmptyState from './EmptyState'

function statusBadge(status) {
  if (status === 'LIVE') return <Badge variant="live">LIVE</Badge>
  if (status === 'ENDING') {
    return (
      <Badge className="border border-amber-100 bg-amber-50 text-amber-700">ENDING</Badge>
    )
  }
  return <Badge variant="outline">UPCOMING</Badge>
}

export default function RecentAuctionsTable({ auctions = RECENT_AUCTIONS }) {
  if (!auctions.length) {
    return (
      <EmptyState
        title="No recent auctions"
        description="Create a listing or join a live room to see activity here."
        actionLabel="Browse Auctions"
        actionHref="/auctions"
      />
    )
  }

  return (
    <section aria-labelledby="recent-auctions-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 id="recent-auctions-heading" className="text-lg font-semibold tracking-tight">
            Recent Auctions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your latest lots and watched listings.
          </p>
        </div>
        <Link
          to="/auctions"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border/70 bg-neutral-50/80">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Auction</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Current Bid</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Time Remaining</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr
                  key={auction.id}
                  className="border-b border-border/50 last:border-0 transition-colors hover:bg-neutral-50/60"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={auction.image}
                        alt={auction.imageAlt}
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-border/70"
                      />
                      <span className="font-medium tracking-tight">{auction.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold tracking-tight">
                    {formatCurrency(auction.currentBid)}
                  </td>
                  <td className="px-4 py-3.5">{statusBadge(auction.status)}</td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">
                    {auction.timeRemaining}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/auctions/${auction.id}`}
                      className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'rounded-lg')}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
