import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  AUCTION_CATEGORIES,
  MAX_DETAILED_DESCRIPTION,
  MAX_SHORT_DESCRIPTION,
  PRODUCT_CONDITIONS,
} from '../constants/categories'

const selectClassName = cn(
  'flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
)

const textareaClassName = cn(
  'flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
)

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>
}

export default function AuctionBasicInfo({ register, errors, watch }) {
  const shortDescription = watch('shortDescription') || ''
  const detailedDescription = watch('detailedDescription') || ''

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">Basic Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell collectors what they are bidding on.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            className="mt-1.5"
            placeholder="Rolex Daytona Cosmograph — Ceramic Bezel"
            aria-invalid={Boolean(errors.productName)}
            {...register('productName')}
          />
          <FieldError message={errors.productName?.message} />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className={cn(selectClassName, 'mt-1.5')}
            aria-invalid={Boolean(errors.category)}
            {...register('category')}
          >
            <option value="">Select category</option>
            {AUCTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            className="mt-1.5"
            placeholder="Rolex"
            aria-invalid={Boolean(errors.brand)}
            {...register('brand')}
          />
          <FieldError message={errors.brand?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="condition">Condition</Label>
          <select
            id="condition"
            className={cn(selectClassName, 'mt-1.5')}
            aria-invalid={Boolean(errors.condition)}
            {...register('condition')}
          >
            <option value="">Select condition</option>
            {PRODUCT_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
          <FieldError message={errors.condition?.message} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="shortDescription">Short Description</Label>
            <span className="text-xs text-muted-foreground">
              {shortDescription.length}/{MAX_SHORT_DESCRIPTION}
            </span>
          </div>
          <textarea
            id="shortDescription"
            rows={3}
            className={cn(textareaClassName, 'mt-1.5')}
            placeholder="A concise summary collectors will see in listings."
            aria-invalid={Boolean(errors.shortDescription)}
            {...register('shortDescription')}
          />
          <FieldError message={errors.shortDescription?.message} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="detailedDescription">Detailed Description</Label>
            <span className="text-xs text-muted-foreground">
              {detailedDescription.length}/{MAX_DETAILED_DESCRIPTION}
            </span>
          </div>
          <textarea
            id="detailedDescription"
            rows={6}
            className={cn(textareaClassName, 'mt-1.5 min-h-[160px]')}
            placeholder="Share provenance, condition notes, accessories included, and authenticity details."
            aria-invalid={Boolean(errors.detailedDescription)}
            {...register('detailedDescription')}
          />
          <FieldError message={errors.detailedDescription?.message} />
        </div>
      </div>
    </section>
  )
}
