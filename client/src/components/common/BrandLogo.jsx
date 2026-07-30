import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import primaryLogo from '@/assets/bidarena_primary_logo.png'

/**
 * Shared BidArena brand mark for navbars and headers.
 * The asset already includes the wordmark.
 */
export default function BrandLogo({
  to = '/',
  className,
  imgClassName,
  inverted = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn('inline-flex shrink-0 items-center', className)}
      aria-label="BidArena home"
    >
      <img
        src={primaryLogo}
        alt="BidArena"
        className={cn(
          'h-9 w-auto object-contain object-left sm:h-10',
          inverted && 'brightness-0 invert',
          imgClassName
        )}
      />
    </Link>
  )
}
