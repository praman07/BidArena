import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { FilePenLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/useToast'
import ImageUploader from '../components/ImageUploader'
import AuctionBasicInfo from '../components/AuctionBasicInfo'
import AuctionConfiguration from '../components/AuctionConfiguration'
import ShippingSection from '../components/ShippingSection'
import SellerNotes from '../components/SellerNotes'
import AuctionPreviewCard from '../components/AuctionPreviewCard'
import { createAuctionRequest } from '../services/auctionService'
import {
  createAuctionDefaults,
  createAuctionSchema,
} from '../validation/createAuctionSchema'

export default function CreateAuction() {
  const toast = useToast()
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [imageError, setImageError] = useState('')
  const [draftStatus, setDraftStatus] = useState('Draft')
  const [isDraftSaving, setIsDraftSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: createAuctionDefaults(),
    mode: 'onBlur',
  })

  const values = watch()

  const submitAuction = async (data, { saveAsDraft = false } = {}) => {
    if (images.length === 0) {
      setImageError('Upload at least one product image')
      toast.error('Add at least one product image before publishing')
      return
    }

    const imageFiles = images.map((image) => image.file).filter(Boolean)
    if (imageFiles.length === 0) {
      setImageError('Upload at least one product image')
      toast.error('Add at least one product image before publishing')
      return
    }

    setImageError('')

    try {
      const auction = await createAuctionRequest({
        formValues: data,
        imageFiles,
        saveAsDraft,
      })

      if (saveAsDraft) {
        setDraftStatus('Draft · Saved')
        toast.success('Draft saved successfully')
        return
      }

      setDraftStatus('Published')
      toast.success(`“${auction.title}” published successfully`)
      navigate('/browse-auctions')
    } catch (error) {
      toast.error(error.message || 'Could not create auction. Please try again.')
    }
  }

  const onPublish = handleSubmit(async (data) => {
    await submitAuction(data, { saveAsDraft: false })
  })

  const onSaveDraft = handleSubmit(async (data) => {
    setIsDraftSaving(true)
    try {
      await submitAuction(data, { saveAsDraft: true })
    } finally {
      setIsDraftSaving(false)
    }
  })

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
            Create Auction
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Fill in the details below to publish your auction.
          </p>
        </div>

        <Badge variant="outline" className="gap-1.5 rounded-full self-start sm:self-auto">
          <FilePenLine className="h-3.5 w-3.5" aria-hidden="true" />
          {draftStatus}
        </Badge>
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
          <ImageUploader
            images={images}
            onChange={(updater) => {
              setImages(updater)
              setImageError('')
            }}
            error={imageError}
          />
          <AuctionBasicInfo register={register} errors={errors} watch={watch} />
          <AuctionConfiguration register={register} errors={errors} />
          <ShippingSection register={register} errors={errors} watch={watch} />
          <SellerNotes register={register} errors={errors} watch={watch} />
        </div>

        <AuctionPreviewCard
          values={values}
          coverImage={images[0]?.url}
          imageCount={images.length}
          onPublish={onPublish}
          onSaveDraft={onSaveDraft}
          isSubmitting={isSubmitting}
          isDraftSaving={isDraftSaving}
        />
      </form>
    </div>
  )
}
