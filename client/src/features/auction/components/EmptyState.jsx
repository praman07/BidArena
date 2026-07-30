import { motion } from 'framer-motion'
import { Gavel, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50/60 px-6 py-20 text-center"
      role="status"
    >
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border/70">
          <Gavel className="h-10 w-10 text-neutral-400" aria-hidden="true" />
        </div>
        <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white shadow-md">
          <SearchX className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight">No auctions found</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn’t find any listings that match your filters. Try adjusting your
        search, category, or price range.
      </p>

      {onClear && (
        <Button type="button" onClick={onClear} className="mt-6 rounded-lg">
          Clear Filters
        </Button>
      )}
    </motion.div>
  )
}
