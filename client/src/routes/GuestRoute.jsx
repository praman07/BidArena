import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import Loader from '@/components/common/Loader'
import { APP_CONSTANTS } from '@/constants/appConstants'

export default function GuestRoute() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <Loader fullScreen label="Checking your session" />
  }

  if (isAuthenticated) {
    return <Navigate to={APP_CONSTANTS.DEFAULT_REDIRECT} replace />
  }

  return <Outlet />
}
