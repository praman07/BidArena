import { NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gavel,
  Heart,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Radio,
  Settings,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useAuth from '@/features/auth/hooks/useAuth'
import { useToast } from '@/components/ui/useToast'
import { DASHBOARD_USER, SIDEBAR_NAV } from '../constants/dashboardData'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'

const ICONS = {
  LayoutDashboard,
  Compass,
  Gavel,
  PlusCircle,
  Radio,
  Heart,
  Bell,
  User,
  Settings,
}

export default function AppSidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const displayName = user?.username || DASHBOARD_USER.name
  const email = user?.email || DASHBOARD_USER.email
  const avatar = user?.avatar || FALLBACK_AVATAR

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
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-[1px] lg:hidden"
          aria-label="Close sidebar"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/70 bg-white transition-all duration-300',
          collapsed ? 'w-[76px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b border-border/70 px-4',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onCloseMobile}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Gavel className="h-4 w-4" aria-hidden="true" />
            </span>
            {!collapsed && (
              <span className="text-base font-semibold tracking-tight">BidArena</span>
            )}
          </NavLink>

          <button
            type="button"
            onClick={onToggle}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
          {SIDEBAR_NAV.map((item) => {
            const Icon = ICONS[item.icon] || LayoutDashboard
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-neutral-950 text-white'
                      : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
                  )
                }
                end={item.href === '/dashboard'}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-border/70 p-3">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
              <img
                src={avatar}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-1 ring-border/70"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tracking-tight">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
