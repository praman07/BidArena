import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../constants/dashboardData'
import EmptyState from './EmptyState'

function statusBadge(status) {
  if (status === 'LIVE' || status === 'ACTIVE') return <Badge variant="live">LIVE</Badge>
  if (status === 'ENDING') {
    return (
      <Badge className="border border-amber-100 bg-amber-50 text-amber-700">ENDING</Badge>
    )
  }
  if (status === 'ENDED') {
    return <Badge variant="outline">ENDED</Badge>
  }
  return <Badge variant="outline">UPCOMING</Badge>
}

function formatEndDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function RecentAuctionsTable({ auctions = [] }) {
  if (!auctions.length) {
    return (
      <EmptyState
        title="Create your first auction"
        description="List a premium lot to start receiving bids on BidArena."
        actionLabel="Create Auction"
        actionHref="/auctions/create"
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
          to="/my-auctions"
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
                <th className="px-4 py-3 font-medium text-muted-foreground">End Date</th>
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
                        alt={auction.imageAlt || auction.title}
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-border/70"
                      />
                      <span className="font-medium tracking-tight">{auction.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold tracking-tight">
                    {formatCurrency(auction.currentBid)}
                  </td>
                  <td className="px-4 py-3.5">
                    {statusBadge(auction.displayStatus || auction.status)}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {formatEndDate(auction.endTime || auction.endDate)}
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
