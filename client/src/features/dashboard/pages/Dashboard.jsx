import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import useAuth from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import StatsCards from '../components/StatsCards'
import QuickActions from '../components/QuickActions'
import RecentAuctionsTable from '../components/RecentAuctionsTable'
import LiveAuctionGrid from '../components/LiveAuctionGrid'
import ActivityTimeline from '../components/ActivityTimeline'
import RightSidebarWidgets from '../components/RightSidebarWidgets'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { DASHBOARD_USER } from '../constants/dashboardData'
import {
  getDashboardRecentActivityRequest,
  getDashboardRecentAuctionsRequest,
  getDashboardStatsRequest,
} from '../services/dashboardService'
import { getAuctionsRequest } from '@/features/auction/services/auctionService'
import { mapAuctionFromApi } from '@/features/auction/constants/auctionData'

function buildStatsCards(stats) {
  const total = stats?.totalAuctions ?? 0
  const active = stats?.activeAuctions ?? 0
  const won = stats?.wonAuctions ?? 0
  const bids = stats?.totalBidsPlaced ?? 0

  const spark = (value) => {
    const base = Math.max(1, Number(value) || 1)
    return [base * 0.55, base * 0.7, base * 0.62, base * 0.85, base * 0.78, base * 0.92, base]
  }

  return [
    {
      id: 'total',
      label: 'Total Auctions',
      value: String(total),
      trend: `${stats?.endedAuctions ?? 0} ended`,
      trendUp: true,
      icon: 'Gavel',
      chart: spark(total),
    },
    {
      id: 'active',
      label: 'Active Auctions',
      value: String(active),
      trend: active > 0 ? 'Live now' : 'None live',
      trendUp: active > 0,
      icon: 'Radio',
      chart: spark(active),
    },
    {
      id: 'won',
      label: 'Won Auctions',
      value: String(won),
      trend: won > 0 ? 'Wins' : 'No wins yet',
      trendUp: won > 0,
      icon: 'Trophy',
      chart: spark(won),
    },
    {
      id: 'bids',
      label: 'Total Bids',
      value: String(bids),
      trend: `${bids} placed`,
      trendUp: true,
      icon: 'Heart',
      chart: spark(bids),
    },
  ]
}

function mapRecentAuction(auction) {
  return {
    id: auction.id,
    title: auction.title,
    image: auction.images?.[0] || '',
    imageAlt: auction.title,
    currentBid: auction.currentBid ?? auction.startingBid ?? 0,
    status: auction.status,
    displayStatus: auction.displayStatus || auction.status,
    endTime: auction.endTime,
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentAuctions, setRecentAuctions] = useState([])
  const [activity, setActivity] = useState([])
  const [liveAuctions, setLiveAuctions] = useState([])

  const name = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : DASHBOARD_USER.name

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, recentData, activityData, marketplace] = await Promise.all([
        getDashboardStatsRequest(),
        getDashboardRecentAuctionsRequest(),
        getDashboardRecentActivityRequest(),
        getAuctionsRequest({ page: 1, limit: 12 }).catch(() => ({ auctions: [] })),
      ])

      setStats(statsData)
      setRecentAuctions((recentData || []).map(mapRecentAuction))
      setActivity(activityData || [])

      const mappedLive = (marketplace.auctions || [])
        .map(mapAuctionFromApi)
        .filter((auction) => auction.status === 'LIVE')
        .slice(0, 3)
      setLiveAuctions(mappedLive)
    } catch (err) {
      setError(err.message || 'Could not load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const statsCards = useMemo(() => buildStatsCards(stats), [stats])

  const welcomeMessage = useMemo(() => {
    const active = stats?.activeAuctions ?? 0
    const bids = stats?.totalBidsPlaced ?? 0
    if (!stats) return 'Your marketplace overview will appear here.'
    return `You have ${active} active auction${active === 1 ? '' : 's'} and ${bids} bid${bids === 1 ? '' : 's'} placed.`
  }, [stats])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
        <Button type="button" className="mt-6 rounded-lg" onClick={loadDashboard}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {name}{' '}
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {welcomeMessage}
        </p>
      </motion.section>

      <StatsCards stats={statsCards} />
      <QuickActions />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-8">
          <RecentAuctionsTable auctions={recentAuctions} />
          <LiveAuctionGrid auctions={liveAuctions} />
          <ActivityTimeline items={activity} />
        </div>
        <RightSidebarWidgets
          upcomingAuctions={recentAuctions.filter((a) => a.displayStatus === 'UPCOMING').slice(0, 3)}
        />
      </div>
    </div>
  )
}
