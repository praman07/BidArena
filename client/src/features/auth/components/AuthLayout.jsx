import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, ShieldCheck, Timer, TrendingUp } from 'lucide-react'

const highlights = [
  {
    icon: Timer,
    title: 'Real-time bidding',
    description: 'Live rooms with instant bid updates and countdowns.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted marketplace',
    description: 'A curated platform built for serious collectors and sellers.',
  },
  {
    icon: TrendingUp,
    title: 'Premium listings',
    description: 'Luxury goods, rare finds, and professional auction houses.',
  },
]

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — branding */}
      <aside className="relative hidden w-1/2 flex-col justify-between bg-neutral-950 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2.5" aria-label="BidArena home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Gavel className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">BidArena</span>
        </Link>

        <div className="max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl font-semibold leading-tight tracking-tight"
          >
            Where every bid counts.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mt-4 text-base leading-relaxed text-neutral-400"
          >
            BidArena is the premium destination for real-time online auctions.
            Discover exceptional items, join live bidding rooms, and win with
            confidence.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 space-y-6"
          >
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="h-4 w-4 text-neutral-300" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-neutral-400">{description}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>

        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} BidArena. All rights reserved.
        </p>
      </aside>

      {/* Right panel — form content */}
      <main className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile-only brand mark */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            aria-label="BidArena home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Gavel className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              BidArena
            </span>
          </Link>
          {children}
        </motion.div>
      </main>
    </div>
  )
}
