import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/features/auction/constants/auctionDetailsData'

export default function BidPanel({
  currentBid = 0,
  bidIncrement = 1,
  highestBidder,
  disabled = false,
  isSubmitting = false,
  onPlaceBid,
  error,
}) {
  const minBid = useMemo(
    () => Number(currentBid || 0) + Number(bidIncrement || 1),
    [currentBid, bidIncrement]
  )
  const [amount, setAmount] = useState(String(minBid))

  useEffect(() => {
    setAmount(String(minBid))
  }, [minBid])

  const handleSubmit = (event) => {
    event.preventDefault()
    onPlaceBid?.(Number(amount))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm space-y-4"
      noValidate
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Place a Bid</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Minimum next bid is {formatCurrency(minBid)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-border/70 bg-neutral-50/80 px-3 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Current bid
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight">
            {formatCurrency(currentBid)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-neutral-50/80 px-3 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Highest bidder
          </p>
          <p className="mt-1 truncate text-base font-semibold tracking-tight">
            {highestBidder?.username || '—'}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bid-amount">Your bid amount</Label>
        <Input
          id="bid-amount"
          type="number"
          min={minBid}
          step={bidIncrement || 1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled || isSubmitting}
          className="h-11 rounded-lg"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? 'Placing bid…' : 'Place Bid'}
      </Button>
    </form>
  )
}
