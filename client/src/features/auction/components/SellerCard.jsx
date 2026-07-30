import { BadgeCheck, MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SellerCard({ seller }) {
  if (!seller) {
    return (
      <div
        className="rounded-xl border border-dashed border-border bg-neutral-50/60 px-6 py-14 text-center"
        role="status"
      >
        <p className="text-base font-medium tracking-tight">Seller unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Seller details could not be loaded for this listing.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <img
          src={seller.avatar}
          alt={`${seller.name} avatar`}
          className="h-16 w-16 rounded-full object-cover ring-1 ring-border/70"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{seller.name}</h3>
            {seller.verified && (
              <Badge variant="secondary" className="gap-1">
                <BadgeCheck className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
                Verified
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {seller.rating != null ? (
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="font-medium text-foreground">{seller.rating}</span>
                ({seller.reviewCount || 0} reviews)
              </span>
            ) : (
              <span className="text-muted-foreground">Seller on BidArena</span>
            )}
            {seller.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {seller.location}
              </span>
            )}
          </div>

          {seller.responseTime && (
            <p className="mt-2 text-sm text-muted-foreground">{seller.responseTime}</p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Rating
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {seller.rating != null ? seller.rating : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Completed
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {seller.completedAuctions}+
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-neutral-50/60 px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                On platform
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {seller.yearsOnPlatform} years
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
