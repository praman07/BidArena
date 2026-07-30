import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/features/auction/constants/auctionDetailsData'

export default function WinnerModal({
  open,
  winner,
  winningAmount = 0,
  message,
  onClose,
  canPay = false,
  onPayNow,
  paying = false,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/45"
        aria-label="Close winner dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border/70 bg-white p-6 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <Trophy className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 id="winner-dialog-title" className="mt-4 text-2xl font-semibold tracking-tight">
          🎉 Auction Ended
        </h2>
        {winner ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">Winner</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">{winner.username}</p>
            <p className="mt-4 text-sm text-muted-foreground">Winning Amount</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatCurrency(winningAmount)}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {message || 'This auction ended with no winning bids.'}
          </p>
        )}
        {canPay ? (
          <Button
            type="button"
            className="mt-6 w-full rounded-xl"
            disabled={paying}
            onClick={onPayNow}
          >
            {paying ? 'Processing…' : 'Pay Now'}
          </Button>
        ) : null}
        <Button
          type="button"
          variant={canPay ? 'outline' : 'default'}
          className="mt-3 w-full rounded-xl"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  )
}
