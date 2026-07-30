import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, PlusCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QUICK_ACTIONS } from '../constants/dashboardData'

const ICONS = { PlusCircle, Compass, Zap }

const accentStyles = {
  neutral: 'bg-neutral-950 text-white hover:bg-neutral-900',
  muted: 'bg-white text-foreground hover:bg-neutral-50',
  live: 'bg-red-50 text-red-700 hover:bg-red-100/80 border-red-100',
}

export default function QuickActions({ actions = QUICK_ACTIONS }) {
  return (
    <section aria-labelledby="quick-actions-heading">
      <div className="mb-4">
        <h2 id="quick-actions-heading" className="text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jump into the highest-impact workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = ICONS[action.icon] || PlusCircle
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + index * 0.05, ease: 'easeOut' }}
            >
              <Link
                to={action.href}
                className={cn(
                  'group flex h-full flex-col rounded-xl border border-border/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10',
                  accentStyles[action.accent] || accentStyles.muted
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    action.accent === 'neutral'
                      ? 'bg-white/10'
                      : action.accent === 'live'
                        ? 'bg-red-100'
                        : 'bg-neutral-100'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{action.title}</h3>
                <p
                  className={cn(
                    'mt-1 flex-1 text-sm',
                    action.accent === 'neutral' ? 'text-neutral-300' : 'text-muted-foreground'
                  )}
                >
                  {action.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Get started
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
