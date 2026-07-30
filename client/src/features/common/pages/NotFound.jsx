import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50/60 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link to="/" className={cn(buttonVariants(), 'rounded-lg')}>
          Go home
        </Link>
        <Link to="/auctions" className={cn(buttonVariants({ variant: 'outline' }), 'rounded-lg')}>
          Browse auctions
        </Link>
      </div>
    </div>
  )
}
