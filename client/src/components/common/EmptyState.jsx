import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'When there is activity to show, it will appear in this space.',
  actionLabel,
  actionHref,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center shadow-sm"
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-border/70">
        <Inbox className="h-6 w-6 text-neutral-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Link to={actionHref} className={cn(buttonVariants({ size: 'sm' }), 'mt-5 rounded-lg')}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
