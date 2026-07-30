import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MAX_IMAGES } from '../constants/categories'

export default function ImageUploader({ images, onChange, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState([])

  const simulateUpload = (files) => {
    const incoming = Array.from(files).filter((file) => file.type.startsWith('image/'))
    const remaining = MAX_IMAGES - images.length
    const selected = incoming.slice(0, remaining)

    selected.forEach((file) => {
      const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`
      setUploading((prev) => [...prev, { id, name: file.name, progress: 12 }])

      let progress = 12
      const interval = setInterval(() => {
        progress = Math.min(progress + 18 + Math.random() * 20, 100)
        setUploading((prev) =>
          prev.map((item) => (item.id === id ? { ...item, progress: Math.round(progress) } : item))
        )

        if (progress >= 100) {
          clearInterval(interval)
          const previewUrl = URL.createObjectURL(file)
          onChange((prev) => [
            ...prev,
            {
              id,
              name: file.name,
              url: previewUrl,
              file,
            },
          ])
          setUploading((prev) => prev.filter((item) => item.id !== id))
        }
      }, 180)
    })
  }

  const handleFiles = (fileList) => {
    if (!fileList?.length) return
    simulateUpload(fileList)
  }

  const removeImage = (id) => {
    onChange((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target?.url?.startsWith('blob:')) URL.revokeObjectURL(target.url)
      return prev.filter((img) => img.id !== id)
    })
  }

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Product Images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop high-quality photos. First image becomes the cover.
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {images.length}/{MAX_IMAGES} images
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors',
          dragging
            ? 'border-neutral-950 bg-neutral-50'
            : 'border-border bg-neutral-50/50 hover:border-neutral-400 hover:bg-neutral-50',
          error && 'border-red-300 bg-red-50/40'
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-border/70">
          <Upload className="h-5 w-5 text-neutral-700" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium tracking-tight">
          Drop images here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG up to 8 files · Recommended 1200×900
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <AnimatePresence initial={false}>
        {uploading.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploading.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-border/70 bg-neutral-50 px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-200"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {images.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-neutral-50"
            >
              <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(event) => {
                  event.stopPropagation()
                  removeImage(image.id)
                }}
                aria-label={`Remove ${image.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          No images uploaded yet
        </div>
      )}
    </section>
  )
}
