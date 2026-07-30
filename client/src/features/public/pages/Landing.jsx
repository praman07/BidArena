import { lazy, Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'

// Below-the-fold sections load lazily to keep the initial paint fast.
const LiveAuctionSection = lazy(() => import('../components/LiveAuctionSection'))
const HowItWorks = lazy(() => import('../components/HowItWorks'))
const FeaturedCategories = lazy(() => import('../components/FeaturedCategories'))
const FeaturesSection = lazy(() => import('../components/FeaturesSection'))
const StatisticsSection = lazy(() => import('../components/StatisticsSection'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const FinalCTA = lazy(() => import('../components/FinalCTA'))
const Footer = lazy(() => import('../components/Footer'))

export default function Landing() {
  return (
    <div className="bg-white text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Suspense fallback={null}>
          <LiveAuctionSection />
          <HowItWorks />
          <FeaturedCategories />
          <FeaturesSection />
          <StatisticsSection />
          <Testimonials />
          <FinalCTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
