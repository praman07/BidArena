import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/useToast'
import AuctionBasicInfo from '../components/AuctionBasicInfo'
import AuctionConfiguration from '../components/AuctionConfiguration'
import ShippingSection from '../components/ShippingSection'
import SellerNotes from '../components/SellerNotes'
import AuctionPreviewCard from '../components/AuctionPreviewCard'
import { TableSkeleton } from '@/features/dashboard/components/LoadingSkeleton'
import {
  getAuctionByIdRequest,
  updateAuctionRequest,
} from '../services/auctionService'
import {
  createAuctionDefaults,
  createAuctionDraftSchema,
  createAuctionSchema,
} from '../validation/createAuctionSchema'

function toLocalInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

function mapAuctionToForm(auction) {
  return {
    productName: auction.title || '',
    category: auction.category || '',
    brand: auction.brand || '',
    condition: auction.condition || '',
    shortDescription: auction.shortDescription || '',
    detailedDescription: auction.description || '',
    startingPrice: auction.startingBid ?? '',
    reservePrice: auction.reservePrice ?? '',
    bidIncrement: auction.bidIncrement ?? 50,
    startDate: toLocalInput(auction.startTime),
    endDate: toLocalInput(auction.endTime),
    timezone: auction.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    shippingAvailable: Boolean(auction.shippingAvailable),
    pickupAvailable: Boolean(auction.pickupAvailable),
    shippingCost: auction.shippingCost ?? 0,
    location: auction.location || '',
    privateNotes: auction.privateNotes || '',
    acceptTerms: auction.status !== 'DRAFT',
  }
}

export default function EditAuction() {
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [imageCount, setImageCount] = useState(0)
  const [isDraft, setIsDraft] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: createAuctionDefaults(),
    mode: 'onBlur',
  })

  const values = watch()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const data = await getAuctionByIdRequest(id)
        if (cancelled) return
        const auction = data.auction
        setIsDraft(auction.status === 'DRAFT')
        reset(mapAuctionToForm(auction))
        setCoverImage(auction.images?.[0] || '')
        setImageCount(auction.images?.length || 0)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load auction.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, reset])

  const saveAuction = async (data, { publish = false } = {}) => {
    const auction = await updateAuctionRequest({
      id,
      formValues: data,
      publish,
    })
    return auction
  }

  const onPublish = handleSubmit(async (data) => {
    try {
      const auction = await saveAuction(data, { publish: isDraft })
      if (isDraft) {
        toast.success(`“${auction.title}” is now live`)
      } else {
        toast.success(`“${auction.title}” updated successfully`)
      }
      navigate('/my-auctions')
    } catch (error) {
      toast.error(error.message || 'Could not update auction. Please try again.')
    }
  })

  const onSaveDraft = async () => {
    clearErrors()
    const raw = getValues()
    const parsed = createAuctionDraftSchema.safeParse(raw)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path?.[0]
        if (field) {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      toast.error(parsed.error.issues[0]?.message || 'Complete the required fields to save a draft')
      return
    }

    setIsDraftSaving(true)
    try {
      const auction = await saveAuction(parsed.data, { publish: false })
      toast.success(`Draft “${auction.title}” saved`)
      navigate('/my-auctions')
    } catch (error) {
      toast.error(error.message || 'Could not save draft. Please try again.')
    } finally {
      setIsDraftSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <TableSkeleton />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-7xl rounded-xl border border-border/70 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">{loadError}</p>
        <Button type="button" className="mt-4 rounded-lg" onClick={() => navigate('/my-auctions')}>
          Back to My Auctions
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {isDraft ? 'Finish Draft' : 'Edit Auction'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {isDraft
              ? 'Review the listing, accept the terms, then publish to make it live.'
              : 'Update your listing details. Changes apply immediately after saving.'}
          </p>
        </div>
        {isDraft ? (
          <Badge variant="secondary" className="self-start sm:self-auto">
            DRAFT
          </Badge>
        ) : null}
      </motion.div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onPublish()
        }}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
        noValidate
      >
        <div className="space-y-6">
          {coverImage && (
            <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
              <img
                src={coverImage}
                alt="Auction cover"
                className="aspect-[16/7] w-full object-cover"
              />
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Existing images stay attached. Image replacement is not available in this edit
                flow.
              </p>
            </div>
          )}
          <AuctionBasicInfo register={register} errors={errors} watch={watch} />
          <AuctionConfiguration register={register} errors={errors} />
          <ShippingSection register={register} errors={errors} watch={watch} />
          <SellerNotes register={register} errors={errors} watch={watch} />
        </div>

        <AuctionPreviewCard
          mode="edit"
          isDraft={isDraft}
          values={values}
          coverImage={coverImage}
          imageCount={imageCount}
          onPublish={onPublish}
          onSaveDraft={isDraft ? onSaveDraft : undefined}
          onCancel={() => navigate('/my-auctions')}
          isSubmitting={isSubmitting}
          isDraftSaving={isDraftSaving}
        />
      </form>
    </div>
  )
}
