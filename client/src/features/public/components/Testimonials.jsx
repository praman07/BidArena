import { motion } from 'framer-motion'
import { BadgeCheck, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../constants/landingData'

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Social Proof
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Trusted by Collectors Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            What buyers and sellers say about their BidArena experience.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, avatar, verified, quote }, index) => (
            <motion.figure
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
              className="flex flex-col rounded-xl border border-border/70 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Quote className="h-6 w-6 text-neutral-200" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                {quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5">
                <img
                  src={avatar}
                  alt={`Portrait of ${name}`}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <p className="flex items-center gap-1 text-sm font-semibold">
                    {name}
                    {verified && (
                      <>
                        <BadgeCheck
                          className="h-4 w-4 text-sky-500"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Verified member</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
