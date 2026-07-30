import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Native checkbox with a visible custom checkmark (Windows/Chrome
 * often hide the native tick when Tailwind border/bg utilities are applied).
 */
const Checkbox = forwardRef(function Checkbox({ className, ...props }, ref) {
  return (
    <span className={cn('relative inline-flex h-4 w-4 shrink-0', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none flex h-4 w-4 items-center justify-center rounded border border-input bg-background text-white',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1',
          'peer-checked:border-neutral-950 peer-checked:bg-neutral-950',
          '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
          'peer-disabled:opacity-50'
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </span>
  )
})

export { Checkbox }
