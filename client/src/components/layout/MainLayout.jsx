import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <div>
      <div>MainLayout</div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
