import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '../constants/auctionDetailsData'

export default function BidHistory({ bids = [] }) {
  if (!bids.length) {
    return (
      <div
        className="rounded-xl border border-dashed border-border bg-neutral-50/60 px-6 py-14 text-center"
        role="status"
      >
        <p className="text-base font-medium tracking-tight">No bids yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first to place a bid when the room opens.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-border/70 bg-neutral-50/80">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Bid Amount</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr
                key={bid.id}
                className="border-b border-border/50 last:border-0 transition-colors hover:bg-neutral-50/60"
              >
                <td className="px-4 py-3.5 font-medium tracking-tight">{bid.user}</td>
                <td className="px-4 py-3.5 font-semibold tracking-tight">
                  {bid.amount == null ? '—' : formatCurrency(bid.amount)}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{bid.time}</td>
                <td className="px-4 py-3.5">
                  <Badge
                    variant={bid.status === 'Leading' ? 'live' : 'outline'}
                    className={
                      bid.status === 'Scheduled'
                        ? 'border-neutral-200 bg-neutral-50 text-neutral-600'
                        : undefined
                    }
                  >
                    {bid.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
