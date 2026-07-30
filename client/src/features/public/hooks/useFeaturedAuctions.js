import { useCallback, useEffect, useRef, useState } from 'react'
import { getFeaturedAuctionsRequest } from '@/features/auction/services/auctionService'

/** Short-lived in-memory cache so landing remounts don't refetch immediately. */
const CACHE_TTL_MS = 60_000
let cache = { data: null, fetchedAt: 0, promise: null }

export function clearFeaturedAuctionsCache() {
  cache = { data: null, fetchedAt: 0, promise: null }
}

async function fetchFeaturedAuctions({ force = false } = {}) {
  const now = Date.now()
  // Do not treat an empty cache as authoritative — listings may appear after publish.
  if (
    !force &&
    Array.isArray(cache.data) &&
    cache.data.length > 0 &&
    now - cache.fetchedAt < CACHE_TTL_MS
  ) {
    return cache.data
  }

  if (!force && cache.promise) {
    return cache.promise
  }

  cache.promise = getFeaturedAuctionsRequest()
    .then((auctions) => {
      cache = { data: auctions, fetchedAt: Date.now(), promise: null }
      return auctions
    })
    .catch((error) => {
      cache.promise = null
      throw error
    })

  return cache.promise
}

/**
 * Loads featured ACTIVE auctions for the landing page.
 * Dedupes in-flight requests and caches results briefly.
 */
export default function useFeaturedAuctions() {
  const [auctions, setAuctions] = useState(() => cache.data || [])
  const [loading, setLoading] = useState(() => !cache.data)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const load = useCallback(async ({ force = false } = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFeaturedAuctions({ force })
      if (mounted.current) {
        setAuctions(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      if (mounted.current) {
        setError(err.message || 'Unable to load featured auctions.')
        if (!cache.data) setAuctions([])
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load({ force: false })
    return () => {
      mounted.current = false
    }
  }, [load])

  const retry = useCallback(() => load({ force: true }), [load])

  return { auctions, loading, error, retry }
}
