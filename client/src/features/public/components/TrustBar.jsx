import { motion } from 'framer-motion'
import { TRUST_ITEMS } from '../constants/landingData'

export default function TrustBar() {
  return (
    <section
      aria-label="Platform trust indicators"
      className="border-y border-border bg-neutral-50/60"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4"
      >
        {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-white shadow-sm">
              <Icon className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{label}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
