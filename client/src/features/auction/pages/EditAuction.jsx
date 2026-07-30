import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
    privateNotes: '',
    acceptTerms: true,
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  const onSave = handleSubmit(async (data) => {
    try {
      const auction = await updateAuctionRequest({ id, formValues: data })
      toast.success(`“${auction.title}” updated successfully`)
      navigate('/my-auctions')
    } catch (error) {
      toast.error(error.message || 'Could not update auction. Please try again.')
    }
  })

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
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Edit Auction</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Update your listing details. Changes apply immediately after saving.
        </p>
      </motion.div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSave()
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
          values={values}
          coverImage={coverImage}
          imageCount={imageCount}
          onPublish={onSave}
          onCancel={() => navigate('/my-auctions')}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  )
}
