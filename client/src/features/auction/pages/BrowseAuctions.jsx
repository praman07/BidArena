import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/features/public/components/Navbar'
import AuctionFilters from '../components/AuctionFilters'
import FeaturedAuction from '../components/FeaturedAuction'
import AuctionGrid from '../components/AuctionGrid'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import {
  AUCTIONS,
  DEFAULT_FILTERS,
  PAGE_SIZE,
  filterAuctions,
} from '../constants/auctionData'

const Footer = lazy(() => import('@/features/public/components/Footer'))

export default function BrowseAuctions() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filtered = useMemo(() => filterAuctions(AUCTIONS, filters), [filters])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

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

          <FeaturedAuction />

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
            ) : pageItems.length === 0 ? (
              <EmptyState onClear={clearFilters} />
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
