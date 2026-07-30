import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import Loader from '@/components/common/Loader'

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <Loader fullScreen label="Checking your session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
