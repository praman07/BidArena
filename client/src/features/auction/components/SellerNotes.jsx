import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { MAX_PRIVATE_NOTES } from '../constants/categories'

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>
}

export default function SellerNotes({ register, errors, watch }) {
  const privateNotes = watch('privateNotes') || ''

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">Seller Notes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Private notes stay visible only to you and BidArena support.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="privateNotes">Private Notes</Label>
            <span className="text-xs text-muted-foreground">
              {privateNotes.length}/{MAX_PRIVATE_NOTES}
            </span>
          </div>
          <textarea
            id="privateNotes"
            rows={4}
            className={cn(
              'mt-1.5 flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
            )}
            placeholder="Internal reminders about packaging, reserve strategy, or provenance docs."
            aria-invalid={Boolean(errors.privateNotes)}
            {...register('privateNotes')}
          />
          <FieldError message={errors.privateNotes?.message} />
        </div>

        <label className="flex items-start gap-2.5 text-sm leading-5">
          <Checkbox className="mt-0.5" {...register('acceptTerms')} />
          <span>
            I agree to BidArena’s auction terms, authenticity policy, and seller obligations.
          </span>
        </label>
        <FieldError message={errors.acceptTerms?.message} />
      </div>
    </section>
  )
}
