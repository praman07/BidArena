import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useAuth from '@/features/auth/hooks/useAuth'
import StatsCards from '../components/StatsCards'
import QuickActions from '../components/QuickActions'
import RecentAuctionsTable from '../components/RecentAuctionsTable'
import LiveAuctionGrid from '../components/LiveAuctionGrid'
import ActivityTimeline from '../components/ActivityTimeline'
import RightSidebarWidgets from '../components/RightSidebarWidgets'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { DASHBOARD_USER, WELCOME } from '../constants/dashboardData'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  const name = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : DASHBOARD_USER.name

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingSkeleton />

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
          {WELCOME.message}
        </p>
      </motion.section>

      <StatsCards />
      <QuickActions />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-8">
          <RecentAuctionsTable />
          <LiveAuctionGrid />
          <ActivityTimeline />
        </div>
        <RightSidebarWidgets />
      </div>
    </div>
  )
}
