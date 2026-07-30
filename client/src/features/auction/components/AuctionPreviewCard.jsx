import { ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function formatCurrency(value) {
  const amount = Number(value)
  if (!amount || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDuration(startDate, endDate) {
  if (!startDate || !endDate) return '—'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end - start
  if (Number.isNaN(diff) || diff <= 0) return '—'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

export default function AuctionPreviewCard({
  values,
  coverImage,
  imageCount,
  onPublish,
  onSaveDraft,
  isSubmitting,
  isDraftSaving,
  mode = 'create',
  onCancel,
}) {
  const isEdit = mode === 'edit'
  return (
    <aside className="rounded-xl border border-border/70 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
        <Badge variant="secondary">{imageCount} photos</Badge>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-neutral-50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={values.productName || 'Auction cover preview'}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
            <p className="text-xs">Cover image preview</p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Product</p>
          <p className="mt-1 text-base font-semibold tracking-tight">
            {values.productName?.trim() || 'Untitled auction'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Starting price
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight">
              {formatCurrency(values.startingPrice)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Duration</p>
            <p className="mt-1 text-sm font-medium tracking-tight">
              {formatDuration(values.startDate, values.endDate)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Category</p>
          <p className="mt-1 text-sm font-medium tracking-tight">
            {values.category || 'Not selected'}
          </p>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="space-y-2">
        <Button
          type="button"
          className="w-full rounded-xl"
          size="lg"
          disabled={isSubmitting}
          onClick={onPublish}
        >
          {isEdit
            ? isSubmitting
              ? 'Saving…'
              : 'Save Changes'
            : isSubmitting
              ? 'Publishing…'
              : 'Publish Auction'}
        </Button>
        {isEdit ? (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            size="lg"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            size="lg"
            disabled={isDraftSaving || isSubmitting}
            onClick={onSaveDraft}
          >
            {isDraftSaving ? 'Saving draft…' : 'Save Draft'}
          </Button>
        )}
      </div>
    </aside>
  )
}
