import { motion } from 'framer-motion'
import { Gavel, Heart, Radio, Trophy, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATS } from '../constants/dashboardData'

const ICONS = { Radio, Gavel, Trophy, Heart }

function MiniChart({ values, up }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(max - min, 1)

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 36" className="h-9 w-24" aria-hidden="true">
      <polyline
        fill="none"
        stroke={up ? '#171717' : '#ef4444'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default function StatsCards({ stats = STATS }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = ICONS[stat.icon] || Gavel
        return (
          <motion.article
            key={stat.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
            className="rounded-xl border border-border/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                <Icon className="h-4.5 w-4.5 h-4 w-4" aria-hidden="true" />
              </div>
              <MiniChart values={stat.chart} up={stat.trendUp} />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  stat.trendUp ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {stat.trendUp ? (
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {stat.trend}
              </span>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
