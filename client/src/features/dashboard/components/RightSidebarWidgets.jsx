import { Activity, Bell, CalendarClock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  formatCurrency,
  NOTIFICATIONS,
  PLATFORM_STATUS,
  UPCOMING_AUCTIONS,
} from '../constants/dashboardData'

export default function RightSidebarWidgets({ upcomingAuctions }) {
  const upcoming =
    upcomingAuctions && upcomingAuctions.length
      ? upcomingAuctions.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.image || item.images?.[0],
          startsIn: item.displayStatus || item.status || 'Soon',
          estimatedValue: item.currentBid || item.estimatedValue || item.startingBid || 0,
        }))
      : UPCOMING_AUCTIONS

  return (
    <aside className="space-y-5" aria-label="Dashboard widgets">
      <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold tracking-tight">Upcoming Auctions</h2>
        </div>
        {upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="h-11 w-11 rounded-lg object-cover ring-1 ring-border/70"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium tracking-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.startsIn} · {formatCurrency(item.estimatedValue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming auctions yet.</p>
        )}
      </section>

      <section
        id="notifications"
        className="rounded-xl border border-border/70 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-sm font-semibold tracking-tight">Notifications</h2>
          </div>
          <Badge variant="secondary">
            {NOTIFICATIONS.filter((n) => n.unread).length} new
          </Badge>
        </div>
        <ul className="space-y-3">
          {NOTIFICATIONS.slice(0, 3).map((item) => (
            <li
              key={item.id}
              className={cn(
                'rounded-lg border border-border/60 px-3 py-2.5',
                item.unread ? 'bg-neutral-50' : 'bg-white'
              )}
            >
              <p className="text-sm font-medium tracking-tight">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold tracking-tight">Platform Status</h2>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{PLATFORM_STATUS.message}</p>
          <Badge className="border border-emerald-100 bg-emerald-50 text-emerald-700">
            {PLATFORM_STATUS.status}
          </Badge>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-neutral-50 px-2.5 py-2 text-center">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Uptime</dt>
            <dd className="mt-0.5 text-sm font-semibold tracking-tight">
              {PLATFORM_STATUS.uptime}
            </dd>
          </div>
          <div className="rounded-lg bg-neutral-50 px-2.5 py-2 text-center">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Live</dt>
            <dd className="mt-0.5 text-sm font-semibold tracking-tight">
              {PLATFORM_STATUS.liveRooms}
            </dd>
          </div>
          <div className="rounded-lg bg-neutral-50 px-2.5 py-2 text-center">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Latency</dt>
            <dd className="mt-0.5 text-sm font-semibold tracking-tight">
              {PLATFORM_STATUS.latency}
            </dd>
          </div>
        </dl>
      </section>
    </aside>
  )
}
