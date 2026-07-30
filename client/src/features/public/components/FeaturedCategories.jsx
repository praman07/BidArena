import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../constants/landingData'

export default function FeaturedCategories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="scroll-mt-16 py-20 sm:py-28"
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
            Collections
          </p>
          <h2
            id="categories-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Featured Categories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore curated collections across every passion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {CATEGORIES.map(({ image, label, listings }) => (
            <Link
              key={label}
              to="/auctions"
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/15"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Dark overlay for legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-colors duration-300 group-hover:from-black/80"
                aria-hidden="true"
              />
              <ArrowUpRight
                className="absolute right-4 top-4 h-4 w-4 text-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                aria-hidden="true"
              />
              <div className="relative p-4 sm:p-5">
                <span className="block text-sm font-semibold text-white sm:text-base">
                  {label}
                </span>
                <span className="mt-0.5 block text-xs text-white/70">{listings}</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
