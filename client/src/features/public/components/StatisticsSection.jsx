import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { STATISTICS } from '../constants/landingData'

const COUNT_DURATION_MS = 1600

function useCountUp(target, start) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return undefined

    let frame
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1)
      // Ease-out cubic so the counter decelerates as it lands.
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, start])

  return value
}

function StatCounter({ value, suffix, label, start }) {
  const count = useCountUp(value, start)

  return (
    <div className="text-center">
      <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {count.toLocaleString('en-US')}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-neutral-400">{label}</p>
    </div>
  )
}

export default function StatisticsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="statistics-heading"
      className="bg-neutral-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="statistics-heading" className="sr-only">
          Platform statistics
        </h2>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {STATISTICS.map(({ value, suffix, label }) => (
            <StatCounter
              key={label}
              value={value}
              suffix={suffix}
              label={label}
              start={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
