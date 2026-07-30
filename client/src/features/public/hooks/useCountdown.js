import { useEffect, useState } from 'react'

function getParts(endTime) {
  const end = new Date(endTime).getTime()
  if (Number.isNaN(end)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true }
  }

  const diff = Math.max(0, end - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    days,
    hours,
    minutes,
    seconds,
    ended: diff <= 0,
  }
}

/** Live countdown that ticks every second for a given endTime. */
export default function useCountdown(endTime) {
  const [parts, setParts] = useState(() => getParts(endTime))

  useEffect(() => {
    setParts(getParts(endTime))
    const id = window.setInterval(() => {
      setParts(getParts(endTime))
    }, 1000)
    return () => window.clearInterval(id)
  }, [endTime])

  const label = parts.ended
    ? 'Ended'
    : [
        parts.days > 0 ? `${String(parts.days).padStart(2, '0')}d` : null,
        `${String(parts.hours).padStart(2, '0')}h`,
        `${String(parts.minutes).padStart(2, '0')}m`,
        `${String(parts.seconds).padStart(2, '0')}s`,
      ]
        .filter(Boolean)
        .join(' ')

  return { ...parts, label }
}
