import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import AppSidebar from '@/features/dashboard/components/AppSidebar'
import DashboardHeader from '@/features/dashboard/components/DashboardHeader'

function buildBreadcrumbs(pathname) {
  if (pathname.startsWith('/dashboard')) {
    return [{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]
  }
  if (pathname.startsWith('/profile')) {
    return [{ label: 'Home', href: '/dashboard' }, { label: 'Profile' }]
  }
  if (pathname.startsWith('/my-auctions')) {
    return [{ label: 'Home', href: '/dashboard' }, { label: 'My Auctions' }]
  }
  if (pathname.startsWith('/auctions/create')) {
    return [{ label: 'Home', href: '/dashboard' }, { label: 'Create Auction' }]
  }
  return [{ label: 'Home', href: '/dashboard' }, { label: 'App' }]
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-neutral-50/60 text-foreground">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        )}
      >
        <DashboardHeader
          onOpenSidebar={() => setMobileOpen(true)}
          breadcrumbs={buildBreadcrumbs(location.pathname)}
        />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
