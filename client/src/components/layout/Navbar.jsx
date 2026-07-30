import { Link, useNavigate } from 'react-router-dom'
import { Gavel, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/useToast'
import useAuth from '@/features/auth/hooks/useAuth'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('You have been signed out')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Could not sign you out. Please try again.')
    }
  }

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="BidArena home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white">
            <Gavel className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-tight">BidArena</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.username}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
