import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  CATEGORIES,
  DEFAULT_FILTERS,
  PRICE_RANGES,
  SORT_OPTIONS,
  STATUSES,
} from '../constants/auctionData'

const selectClassName = cn(
  'flex h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

export default function AuctionFilters({ filters, onChange, onClear, resultCount }) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.status !== DEFAULT_FILTERS.status ||
    filters.priceRange !== DEFAULT_FILTERS.priceRange ||
    filters.sort !== DEFAULT_FILTERS.sort

  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <section aria-label="Search and filters" className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder="Search auctions, categories, or sellers…"
          aria-label="Search auctions"
          className="h-12 rounded-xl border-border/70 pl-12 pr-4 text-base shadow-sm"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </span>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className={selectClassName}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          <select
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            className={selectClassName}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'All Status' ? status : status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Price Range
          </span>
          <select
            value={filters.priceRange}
            onChange={(e) => update('priceRange', e.target.value)}
            className={selectClassName}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sort
          </span>
          <select
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value)}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="h-11 w-full rounded-lg"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear Filters
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">{resultCount}</span>{' '}
        {resultCount === 1 ? 'auction' : 'auctions'}
      </p>
    </section>
  )
}
