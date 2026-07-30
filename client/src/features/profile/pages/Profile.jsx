import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, User } from 'lucide-react'
import useAuth from '@/features/auth/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'

export default function Profile() {
  const { user } = useAuth()

  const displayName = user?.username || 'Collector'
  const email = user?.email || '—'
  const avatar = user?.avatar || FALLBACK_AVATAR
  const role = user?.role || 'user'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your BidArena account details.
        </p>
      </motion.div>

      <div className="rounded-xl border border-border/70 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={avatar}
            alt=""
            className="h-20 w-20 rounded-2xl object-cover ring-1 ring-border/70"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">{displayName}</h2>
              <Badge variant="secondary" className="capitalize">
                {role}
              </Badge>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {email}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-4 w-4" aria-hidden="true" />
              @{user?.username || 'user'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link to="/my-auctions" className={cn(buttonVariants(), 'rounded-lg')}>
            My Auctions
          </Link>
          <Link
            to="/auctions/create"
            className={cn(buttonVariants({ variant: 'outline' }), 'rounded-lg')}
          >
            Create Auction
          </Link>
          <Link
            to="/dashboard"
            className={cn(buttonVariants({ variant: 'outline' }), 'rounded-lg')}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
