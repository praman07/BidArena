import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BrandLogo from '@/components/common/BrandLogo'
import useAuth from '@/features/auth/hooks/useAuth'
import { useToast } from '@/components/ui/useToast'
import { NAV_LINKS } from '../constants/landingData'

function NavLink({ link, className, onClick }) {
  const classes = cn(
    'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
    className
  )

  if (link.type === 'route') {
    return (
      <Link to={link.href} className={classes} onClick={onClick}>
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={classes} onClick={onClick}>
      {link.label}
    </a>
  )
}

export default function Navbar() {
  const { user, isAuthenticated, isInitializing, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('You have been signed out')
      setMobileOpen(false)
      navigate('/login', { replace: true })
    } catch {
      toast.error('Could not sign you out. Please try again.')
    }
  }

  const authActions = () => {
    if (isInitializing) {
      return <div className="h-8 w-28 animate-pulse rounded-lg bg-neutral-100" aria-hidden="true" />
    }

    if (isAuthenticated) {
      return (
        <>
          <Link
            to="/dashboard"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'rounded-lg')}
          >
            {user?.username || 'Dashboard'}
          </Link>
          <Link
            to="/profile"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-lg')}
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-lg')}
          >
            Logout
          </button>
        </>
      )
    }

    return (
      <>
        <Link
          to="/login"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'rounded-lg')}
        >
          Login
        </Link>
        <Link to="/register" className={cn(buttonVariants({ size: 'sm' }), 'rounded-lg')}>
          Register
        </Link>
      </>
    )
  }

  const mobileAuthActions = () => {
    if (isInitializing) return null

    if (isAuthenticated) {
      return (
        <div className="mt-2 flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )
    }

    return (
      <div className="mt-2 flex flex-col gap-2">
        <Link
          to="/login"
          className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium"
          onClick={() => setMobileOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
          onClick={() => setMobileOpen(false)}
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b bg-white/95 backdrop-blur-sm transition-all duration-300',
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6',
          scrolled ? 'h-14' : 'h-16'
        )}
      >
        <BrandLogo imgClassName={scrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-10'} />

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} link={link} />
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">{authActions()}</div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                link={link}
                className="text-base"
                onClick={() => setMobileOpen(false)}
              />
            ))}
            {mobileAuthActions()}
          </div>
        </div>
      )}
    </header>
  )
}
