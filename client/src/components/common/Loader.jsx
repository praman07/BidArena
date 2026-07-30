import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Loader({ className, label = 'Loading', fullScreen = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-2 text-muted-foreground',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
