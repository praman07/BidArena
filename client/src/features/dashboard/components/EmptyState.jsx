import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Inbox } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'When there is activity to show, it will appear in this space.',
  actionLabel,
  actionHref,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center shadow-sm"
      role="status"
    >
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-border/70">
          <Gavel className="h-8 w-8 text-neutral-400" aria-hidden="true" />
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white">
          <Inbox className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className={cn(buttonVariants({ size: 'sm' }), 'mt-5 rounded-lg')}
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  )
}
