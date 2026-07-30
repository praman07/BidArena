import { motion } from 'framer-motion'
import { FEATURES } from '../constants/landingData'

export default function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-heading"
      className="border-y border-border bg-neutral-50/60 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Platform
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Why BidArena
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for collectors, sellers, and auction houses that expect more.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: 'easeOut' }}
              className="rounded-xl border border-border bg-white p-6 transition-shadow duration-300 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
