import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-heading" className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-xl border border-border bg-neutral-50/60 px-6 py-16 text-center sm:px-16"
        >
          <h2
            id="final-cta-heading"
            className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Ready to Join Your Next Auction?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Create a free account and start bidding on extraordinary items in
            minutes — or list your first auction today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/auctions"
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-xl px-7')}
            >
              Browse Auctions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/register"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-xl bg-white px-7')}
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
