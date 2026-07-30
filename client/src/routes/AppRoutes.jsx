import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import GuestRoute from '@/routes/GuestRoute'
import Login from '@/features/auth/pages/Login'
import Register from '@/features/auth/pages/Register'
import Profile from '@/features/profile/pages/Profile'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import BrowseAuctions from '@/features/auction/pages/BrowseAuctions'
import AuctionDetails from '@/features/auction/pages/AuctionDetails'
import CreateAuction from '@/features/auction/pages/CreateAuction'
import EditAuction from '@/features/auction/pages/EditAuction'
import MyAuctions from '@/features/auction/pages/MyAuctions'
import AuctionRoom from '@/features/auction-room/pages/AuctionRoom'
import Landing from '@/features/public/pages/Landing'
import NotFound from '@/features/common/pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auctions" element={<BrowseAuctions />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/auctions/create" element={<CreateAuction />} />
            <Route path="/auctions/:id/edit" element={<EditAuction />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/auction-room/:id" element={<AuctionRoom />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="/auctions/:id" element={<AuctionDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
