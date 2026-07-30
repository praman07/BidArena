import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import GuestRoute from '@/routes/GuestRoute'
import Loader from '@/components/common/Loader'
import ErrorBoundary from '@/components/common/ErrorBoundary'

const Login = lazy(() => import('@/features/auth/pages/Login'))
const Register = lazy(() => import('@/features/auth/pages/Register'))
const Profile = lazy(() => import('@/features/profile/pages/Profile'))
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'))
const BrowseAuctions = lazy(() => import('@/features/auction/pages/BrowseAuctions'))
const AuctionDetails = lazy(() => import('@/features/auction/pages/AuctionDetails'))
const CreateAuction = lazy(() => import('@/features/auction/pages/CreateAuction'))
const EditAuction = lazy(() => import('@/features/auction/pages/EditAuction'))
const MyAuctions = lazy(() => import('@/features/auction/pages/MyAuctions'))
const AuctionRoom = lazy(() => import('@/features/auction-room/pages/AuctionRoom'))
const Landing = lazy(() => import('@/features/public/pages/Landing'))
const NotFound = lazy(() => import('@/features/common/pages/NotFound'))

function PageFallback() {
  return <Loader fullScreen label="Loading page" />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auctions" element={<BrowseAuctions />} />
            <Route path="/browse-auctions" element={<BrowseAuctions />} />
            <Route path="/auctions/:id" element={<AuctionDetails />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-auctions" element={<MyAuctions />} />
                <Route path="/auctions/create" element={<CreateAuction />} />
                <Route path="/edit-auction/:id" element={<EditAuction />} />
                <Route path="/auctions/:id/edit" element={<EditAuction />} />
              </Route>
            </Route>

            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/auction-room/:id" element={<AuctionRoom />} />
                <Route path="/auction/:id" element={<AuctionRoom />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
