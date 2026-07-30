import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/useToast'
import { cn } from '@/lib/utils'
import EmptyState from '@/features/dashboard/components/EmptyState'
import { TableSkeleton } from '@/features/dashboard/components/LoadingSkeleton'
import { formatCurrency } from '@/features/dashboard/constants/dashboardData'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import {
  deleteAuctionRequest,
  getMyAuctionsRequest,
} from '../services/auctionService'

const STATUS_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Ended', value: 'ENDED' },
]

function statusBadge(status) {
  if (status === 'ACTIVE' || status === 'LIVE') {
    return <Badge variant="live">ACTIVE</Badge>
  }
  if (status === 'ENDED') {
    return <Badge variant="outline">ENDED</Badge>
  }
  if (status === 'DRAFT') {
    return <Badge variant="secondary">DRAFT</Badge>
  }
  return <Badge variant="outline">UPCOMING</Badge>
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function MyAuctions() {
  const toast = useToast()
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadAuctions = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMyAuctionsRequest()
      setAuctions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Could not load your auctions.')
      setAuctions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuctions()
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return auctions.filter((auction) => {
      const status = auction.displayStatus || auction.status
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter
      const matchesSearch = !query || auction.title?.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [auctions, search, statusFilter])

  const handleDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const id = deletingId
    try {
      await deleteAuctionRequest(id)
      setAuctions((prev) => prev.filter((auction) => auction.id !== id))
      setDeletingId(null)
      toast.success('Auction deleted successfully')
    } catch (err) {
      toast.error(err.message || 'Could not delete auction.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Auctions</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage the lots you have listed on BidArena.
          </p>
        </div>
        <Link
          to="/auctions/create"
          className={cn(buttonVariants({ size: 'sm' }), 'rounded-lg self-start sm:self-auto')}
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Create Auction
        </Link>
      </motion.div>

      <section aria-label="Search and filters" className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            aria-label="Search my auctions by title"
            className="h-12 rounded-xl border-border/70 pl-12 pr-4 text-base shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Status filter">
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.value
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'border-neutral-950 bg-neutral-950 text-white'
                    : 'border-border/70 bg-white text-muted-foreground hover:text-foreground'
                )}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        {!loading && !error && (
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'auction' : 'auctions'}
          </p>
        )}
      </section>

      {loading && <TableSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-border/70 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button type="button" className="mt-4 rounded-lg" onClick={loadAuctions}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && auctions.length === 0 && (
        <EmptyState
          title="No auctions created yet."
          description="List your first lot to start receiving bids."
          actionLabel="Create Auction"
          actionHref="/auctions/create"
        />
      )}

      {!loading && !error && auctions.length > 0 && filtered.length === 0 && (
        <EmptyState
          title="No matching auctions"
          description="Try a different status filter or search term."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="border-b border-border/70 bg-neutral-50/80">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Auction</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Current Bid</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Starting Bid</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Bids</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Start</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">End</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((auction) => {
                  const image = auction.images?.[0]
                  const status = auction.displayStatus || auction.status
                  return (
                    <tr
                      key={auction.id}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-neutral-50/60"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt={auction.title}
                              className="h-12 w-12 rounded-lg object-cover ring-1 ring-border/70"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 ring-1 ring-border/70 text-[10px] text-muted-foreground">
                              No img
                            </div>
                          )}
                          <span className="max-w-[220px] truncate font-medium tracking-tight">
                            {auction.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{auction.category}</td>
                      <td className="px-4 py-3.5 font-semibold tracking-tight">
                        {formatCurrency(auction.currentBid ?? auction.startingBid ?? 0)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatCurrency(auction.startingBid ?? 0)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {auction.totalBids ?? 0}
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(status)}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDate(auction.startTime)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDate(auction.endTime)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Link
                            to={`/auctions/${auction.id}`}
                            className={cn(
                              buttonVariants({ size: 'sm', variant: 'outline' }),
                              'rounded-lg'
                            )}
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </Link>
                          <Link
                            to={`/edit-auction/${auction.id}`}
                            className={cn(
                              buttonVariants({ size: 'sm', variant: 'outline' }),
                              'rounded-lg'
                            )}
                            title="Edit auction"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </Link>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-red-600 hover:text-red-700"
                            onClick={() => setDeletingId(auction.id)}
                            title="Delete auction"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={Boolean(deletingId)}
        title="Delete auction?"
        description="This permanently removes the auction from BidArena. This cannot be undone."
        isLoading={isDeleting}
        onCancel={() => {
          if (!isDeleting) setDeletingId(null)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
