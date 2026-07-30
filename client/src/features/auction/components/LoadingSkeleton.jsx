function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-[80%] animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-[40%] animate-pulse rounded bg-neutral-100" />
        <div className="flex justify-between gap-4 pt-1">
          <div className="space-y-2">
            <div className="h-2.5 w-16 animate-pulse rounded bg-neutral-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
          <div className="space-y-2 text-right">
            <div className="ml-auto h-2.5 w-14 animate-pulse rounded bg-neutral-100" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
        <div className="h-1.5 w-full animate-pulse rounded-full bg-neutral-100" />
        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
          <div className="h-8 w-28 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading auctions"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
