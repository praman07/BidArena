import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>
}

export default function ShippingSection({ register, errors, watch }) {
  const shippingAvailable = watch('shippingAvailable')

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">Shipping & Delivery</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose how the winning bidder receives the item.
      </p>

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <Checkbox {...register('shippingAvailable')} />
            Shipping Available
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <Checkbox {...register('pickupAvailable')} />
            Pickup Available
          </label>
        </div>
        <FieldError message={errors.pickupAvailable?.message} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="shippingCost">Shipping Cost (USD)</Label>
            <Input
              id="shippingCost"
              type="number"
              min="0"
              step="1"
              className="mt-1.5"
              placeholder="25"
              disabled={!shippingAvailable}
              aria-invalid={Boolean(errors.shippingCost)}
              {...register('shippingCost')}
            />
            <FieldError message={errors.shippingCost?.message} />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              className="mt-1.5"
              placeholder="Geneva, Switzerland"
              aria-invalid={Boolean(errors.location)}
              {...register('location')}
            />
            <FieldError message={errors.location?.message} />
          </div>
        </div>
      </div>
    </section>
  )
}
