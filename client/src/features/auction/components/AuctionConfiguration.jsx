import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TIMEZONES } from '../constants/categories'

const selectClassName = cn(
  'flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
)

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>
}

export default function AuctionConfiguration({ register, errors }) {
  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">Auction Configuration</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Set pricing rules and the bidding window.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="startingPrice">Starting Price (USD)</Label>
          <Input
            id="startingPrice"
            type="number"
            min="0"
            step="1"
            className="mt-1.5"
            placeholder="18000"
            aria-invalid={Boolean(errors.startingPrice)}
            {...register('startingPrice')}
          />
          <FieldError message={errors.startingPrice?.message} />
        </div>

        <div>
          <Label htmlFor="reservePrice">Reserve Price (USD)</Label>
          <Input
            id="reservePrice"
            type="number"
            min="0"
            step="1"
            className="mt-1.5"
            placeholder="26000"
            aria-invalid={Boolean(errors.reservePrice)}
            {...register('reservePrice')}
          />
          <FieldError message={errors.reservePrice?.message} />
        </div>

        <div>
          <Label htmlFor="bidIncrement">Bid Increment (USD)</Label>
          <Input
            id="bidIncrement"
            type="number"
            min="1"
            step="1"
            className="mt-1.5"
            placeholder="50"
            aria-invalid={Boolean(errors.bidIncrement)}
            {...register('bidIncrement')}
          />
          <FieldError message={errors.bidIncrement?.message} />
        </div>

        <div>
          <Label htmlFor="startDate">Auction Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            className="mt-1.5"
            aria-invalid={Boolean(errors.startDate)}
            {...register('startDate')}
          />
          <FieldError message={errors.startDate?.message} />
        </div>

        <div>
          <Label htmlFor="endDate">Auction End Date</Label>
          <Input
            id="endDate"
            type="datetime-local"
            className="mt-1.5"
            aria-invalid={Boolean(errors.endDate)}
            {...register('endDate')}
          />
          <FieldError message={errors.endDate?.message} />
        </div>

        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            className={cn(selectClassName, 'mt-1.5')}
            aria-invalid={Boolean(errors.timezone)}
            {...register('timezone')}
          >
            {TIMEZONES.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
          <FieldError message={errors.timezone?.message} />
        </div>
      </div>
    </section>
  )
}
