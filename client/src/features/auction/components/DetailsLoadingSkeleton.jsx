function Block({ className }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-100 ${className}`} />
}

export default function DetailsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-12" aria-busy="true">
      <Block className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <Block className="aspect-[4/3] rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Block key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
          <Block className="h-6 w-24 rounded-full" />
          <Block className="mt-4 h-8 w-[80%]" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Block className="h-16" />
            <Block className="h-16" />
            <Block className="h-12" />
            <Block className="h-12" />
          </div>
          <Block className="mt-6 h-20" />
          <Block className="mt-6 h-11 w-full rounded-xl" />
        </div>
      </div>
      <Block className="h-10 w-80" />
      <Block className="h-40 w-full" />
    </div>
  )
}
