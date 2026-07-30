import { Gavel, Trophy, TrendingDown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import EmptyState from './EmptyState'

const TYPE_META = {
  created: {
    icon: Gavel,
    className: 'bg-neutral-100 text-neutral-950',
  },
  bid: {
    icon: Zap,
    className: 'bg-sky-50 text-sky-600',
  },
  won: {
    icon: Trophy,
    className: 'bg-emerald-50 text-emerald-600',
  },
  outbid: {
    icon: TrendingDown,
    className: 'bg-red-50 text-red-600',
  },
  ended: {
    icon: TrendingDown,
    className: 'bg-neutral-100 text-neutral-700',
  },
}

export default function ActivityTimeline({ items = [] }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No recent activity"
        description="Bids, wins, and listings you create will appear in this timeline."
        actionLabel="Create Auction"
        actionHref="/auctions/create"
      />
    )
  }

  return (
    <section aria-labelledby="activity-heading">
      <div className="mb-4">
        <h2 id="activity-heading" className="text-lg font-semibold tracking-tight">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A timeline of your latest marketplace actions.
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-white p-5 shadow-sm">
        <ol className="space-y-5">
          {items.map((item, index) => {
            const meta = TYPE_META[item.type] || TYPE_META.bid
            const Icon = meta.icon
            return (
              <li key={item.id} className="relative flex gap-4">
                {index < items.length - 1 && (
                  <span
                    className="absolute left-[19px] top-10 h-[calc(100%-8px)] w-px bg-border/70"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    meta.className
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tracking-tight">{item.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-border/70"
                      />
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
