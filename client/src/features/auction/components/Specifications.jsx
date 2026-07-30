export default function Specifications({ specifications = {} }) {
  const entries = Object.entries(specifications)

  return (
    <dl className="overflow-hidden rounded-xl border border-border/70">
      {entries.map(([label, value], index) => (
        <div
          key={label}
          className={
            index % 2 === 0
              ? 'grid gap-1 border-b border-border/50 bg-white px-5 py-4 last:border-0 sm:grid-cols-[220px_1fr] sm:gap-6'
              : 'grid gap-1 border-b border-border/50 bg-neutral-50/50 px-5 py-4 last:border-0 sm:grid-cols-[220px_1fr] sm:gap-6'
          }
        >
          <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium tracking-tight text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
