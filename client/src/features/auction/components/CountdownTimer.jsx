import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0)
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

/**
 * Displays a countdown.
 * When `controlled` is true, remaining time comes from the server (no local tick).
 */
export default function CountdownTimer({
  initialSeconds,
  remainingSeconds,
  controlled = false,
  compact = false,
  className,
  labelClassName,
}) {
  const serverValue =
    remainingSeconds !== undefined && remainingSeconds !== null
      ? remainingSeconds
      : initialSeconds

  const [remaining, setRemaining] = useState(serverValue ?? 0)

  useEffect(() => {
    setRemaining(serverValue ?? 0)
  }, [serverValue])

  useEffect(() => {
    if (controlled) return undefined
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [controlled])

  const time = formatCountdown(controlled ? serverValue : remaining)

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
            <p
              className={cn(
                'text-[10px] uppercase tracking-wide text-muted-foreground',
                labelClassName
              )}
            >
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
