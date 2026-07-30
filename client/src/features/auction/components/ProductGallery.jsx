import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProductGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' })
  const frameRef = useRef(null)

  const active = images[activeIndex] || images[0]
  if (!active) return null

  const handleMouseMove = (event) => {
    const frame = frameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${active.src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '220%',
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' })
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-neutral-50 shadow-sm"
      >
        <img
          src={active.src}
          alt={active.alt || title}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="eager"
          decoding="async"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-no-repeat opacity-0 transition-opacity duration-200 lg:block lg:group-hover:opacity-100"
          style={zoomStyle}
        />
      </div>

      <div className="grid grid-cols-4 gap-3" role="listbox" aria-label="Product images">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            aria-label={`View image ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'aspect-square overflow-hidden rounded-xl border bg-neutral-50 transition-all duration-200',
              index === activeIndex
                ? 'border-neutral-950 ring-2 ring-neutral-950/10'
                : 'border-border/70 hover:border-neutral-400'
            )}
          >
            <img
              src={image.src}
              alt={image.alt || `${title} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
