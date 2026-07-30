import CountdownTimer from '@/features/auction/components/CountdownTimer'

export default function Timer({ remainingSeconds = 0, ended = false }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {ended ? 'Auction ended' : 'Time remaining'}
      </p>
      <div className="mt-3">
        <CountdownTimer remainingSeconds={remainingSeconds} controlled />
      </div>
    </div>
  )
}
