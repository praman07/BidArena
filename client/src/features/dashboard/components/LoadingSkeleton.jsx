function Block({ className }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-100 ${className}`} />
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <Block className="h-10 w-10 rounded-xl" />
        <Block className="h-9 w-24" />
      </div>
      <Block className="mt-4 h-3 w-24" />
      <Block className="mt-3 h-8 w-16" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white p-4 shadow-sm">
      <Block className="mb-4 h-4 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Block className="h-12 w-12 rounded-lg" />
            <Block className="h-4 flex-1" />
            <Block className="h-4 w-16" />
            <Block className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
      <Block className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Block className="h-4 w-[75%]" />
        <Block className="h-6 w-24" />
        <Block className="h-8 w-full" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div>
        <Block className="h-8 w-64" />
        <Block className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Block key={i} className="h-40 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TableSkeleton />
        <div className="space-y-4">
          <Block className="h-48 rounded-xl" />
          <Block className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
