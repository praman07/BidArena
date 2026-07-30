import { motion } from 'framer-motion'
import { ShieldCheck, Timer, TrendingUp } from 'lucide-react'
import BrandLogo from '@/components/common/BrandLogo'

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
      <aside className="relative hidden w-1/2 flex-col justify-between bg-neutral-950 p-12 text-white lg:flex">
        <BrandLogo inverted imgClassName="h-10" />

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

      <main className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo imgClassName="h-10" />
          </div>

          {children}
        </motion.div>
      </main>
    </div>
  )
}
