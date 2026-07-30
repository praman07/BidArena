import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import Navbar from '@/features/public/components/Navbar'
import { Button } from '@/components/ui/button'
import useMarketplaceSocket from '@/hooks/useMarketplaceSocket'
import AuctionFilters from '../components/AuctionFilters'
import FeaturedAuction from '../components/FeaturedAuction'
import AuctionGrid from '../components/AuctionGrid'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getAuctionsRequest } from '../services/auctionService'
import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
  filterAuctions,
  mapAuctionFromApi,
} from '../constants/auctionData'

const Footer = lazy(() => import('@/features/public/components/Footer'))

export default function BrowseAuctions() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAuctions = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await getAuctionsRequest({ page: 1, limit: 100 })
      const mapped = (data.auctions || []).map(mapAuctionFromApi)
      setAuctions(mapped)
    } catch (err) {
      if (!silent) {
        setAuctions([])
        setError(err.message || 'Could not load auctions. Please try again.')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAuctions()
  }, [loadAuctions])

  useMarketplaceSocket({
    enabled: true,
    onUpdate: useCallback(
      (payload) => {
        if (!payload?.auctionId) {
          loadAuctions({ silent: true })
          return
        }
        // Patch current bid / status in-place when possible
        setAuctions((prev) => {
          const idx = prev.findIndex((a) => a.id === payload.auctionId)
          if (idx === -1) {
            if (payload.type === 'created') {
              loadAuctions({ silent: true })
            }
            return prev
          }
          const next = [...prev]
          next[idx] = {
            ...next[idx],
            currentBid: payload.currentBid ?? next[idx].currentBid,
            status:
              payload.status === 'ENDED'
                ? 'ENDED'
                : payload.status === 'LIVE' || payload.type === 'bid'
                  ? 'LIVE'
                  : next[idx].status,
          }
          return next
        })
      },
      [loadAuctions]
    ),
  })

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filtered = useMemo(() => filterAuctions(auctions, filters), [auctions, filters])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const featured = useMemo(
    () => filtered.find((auction) => auction.status === 'LIVE') || filtered[0] || null,
    [filtered]
  )

  const clearFilters = () => setFilters(DEFAULT_FILTERS)
  const hasActiveFilters =
    filters.search ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.status !== DEFAULT_FILTERS.status ||
    filters.priceRange !== DEFAULT_FILTERS.priceRange ||
    filters.sort !== DEFAULT_FILTERS.sort

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white text-foreground">
      <Navbar />

      <main>
        <section className="border-b border-border/70 bg-neutral-50/60 pt-28 sm:pt-32">
          <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Marketplace
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Browse Auctions
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Discover premium live and upcoming auctions.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
          <AuctionFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            resultCount={filtered.length}
          />

          {!loading && !error && featured && <FeaturedAuction auction={featured} />}

          <section aria-labelledby="auction-grid-heading">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2
                  id="auction-grid-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  All Auctions
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Curated lots from verified sellers worldwide.
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton count={6} />
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50/60 px-6 py-16 text-center">
                <h3 className="text-xl font-semibold tracking-tight">Something went wrong</h3>
                <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
                <Button type="button" className="mt-6 rounded-lg" onClick={loadAuctions}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </Button>
              </div>
            ) : pageItems.length === 0 ? (
              <EmptyState
                title={
                  hasActiveFilters ? 'No auctions found' : 'No auctions available.'
                }
                description={
                  hasActiveFilters
                    ? 'We couldn’t find any listings that match your filters. Try adjusting your search, category, or price range.'
                    : 'There are no active auctions to show right now. Create one to get started.'
                }
                onClear={clearFilters}
                showClear={Boolean(hasActiveFilters)}
                actionLabel="Create Auction"
                actionHref="/auctions/create"
              />
            ) : (
              <>
                <AuctionGrid auctions={pageItems} />
                <div className="mt-10">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
