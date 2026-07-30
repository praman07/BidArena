import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    label: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  }
}

export default function CountdownTimer({
  initialSeconds,
  compact = false,
  className,
  labelClassName,
}) {
  const [remaining, setRemaining] = useState(initialSeconds)

  useEffect(() => {
    setRemaining(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const time = formatCountdown(remaining)

  if (compact) {
    return (
      <span className={cn('font-mono font-semibold tracking-tight', className)}>
        {time.label}
      </span>
    )
  }

  const units = [
    { key: 'hours', value: time.hours, label: 'Hrs' },
    { key: 'minutes', value: time.minutes, label: 'Min' },
    { key: 'seconds', value: time.seconds, label: 'Sec' },
  ]

  return (
    <div className={cn('flex items-center gap-2', className)} aria-live="polite">
      {units.map((unit, index) => (
        <div key={unit.key} className="flex items-center gap-2">
          <div className="min-w-[4.25rem] rounded-xl border border-border/70 bg-neutral-50 px-3 py-2 text-center">
            <p className="font-mono text-xl font-semibold tracking-tight">{unit.value}</p>
            <p className={cn('text-[10px] uppercase tracking-wide text-muted-foreground', labelClassName)}>
              {unit.label}
            </p>
          </div>
          {index < units.length - 1 && (
            <span className="text-lg font-semibold text-muted-foreground" aria-hidden="true">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
