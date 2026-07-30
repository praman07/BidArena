import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function getPageNumbers(current, total) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set([1, total, current, current - 1, current + 1])
  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
    .reduce((acc, page, index, arr) => {
      if (index > 0 && page - arr[index - 1] > 1) acc.push('…')
      acc.push(page)
      return acc
    }, [])
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <nav
      aria-label="Auction pagination"
      className="flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((item, index) =>
            item === '…' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                variant={item === page ? 'default' : 'outline'}
                size="sm"
                className={cn('h-9 w-9 rounded-lg p-0', item === page && 'pointer-events-none')}
                onClick={() => onPageChange(item)}
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </Button>
            )
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
