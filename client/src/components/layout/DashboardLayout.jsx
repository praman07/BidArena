import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function DashboardLayout() {
  return (
    <div>
      <div>DashboardLayout</div>
      <Navbar />
      <Outlet />
    </div>
  )
}
