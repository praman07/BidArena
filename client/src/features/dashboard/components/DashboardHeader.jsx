import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, LogOut, Menu, Search, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import useAuth from '@/features/auth/hooks/useAuth'
import { useToast } from '@/components/ui/useToast'
import { DASHBOARD_USER, NOTIFICATIONS } from '../constants/dashboardData'

export default function DashboardHeader({ onOpenSidebar, breadcrumbs = [] }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unread = NOTIFICATIONS.filter((n) => n.unread).length
  const displayName = user?.username || DASHBOARD_USER.name

  useEffect(() => {
    const onPointerDown = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

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
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-lg lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="relative ml-auto hidden max-w-md flex-1 sm:block lg:max-w-sm xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search auctions, bids, sellers…"
            aria-label="Global search"
            className="h-10 rounded-xl border-border/70 pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-lg sm:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>

          <div className="relative" ref={notifRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative rounded-lg"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen((open) => !open)
                setProfileOpen(false)
              }}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border/70 bg-white shadow-xl shadow-neutral-900/10">
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                  <p className="text-sm font-semibold tracking-tight">Notifications</p>
                  <span className="text-xs text-muted-foreground">{unread} unread</span>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.slice(0, 4).map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        'border-b border-border/50 px-4 py-3 last:border-0',
                        item.unread && 'bg-neutral-50/80'
                      )}
                    >
                      <p className="text-sm font-medium tracking-tight">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-neutral-100"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((open) => !open)
                setNotifOpen(false)
              }}
            >
              <img
                src={DASHBOARD_USER.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-border/70"
              />
              <span className="hidden text-sm font-medium tracking-tight xl:inline">
                {displayName}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border/70 bg-white py-1 shadow-xl shadow-neutral-900/10">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Settings
                </button>
                <div className="my-1 border-t border-border/70" />
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
