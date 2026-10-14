'use client'

import { useEffect } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Team from '@/components/Team'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  // Handle hash scrolling when navigating from another page
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 400)
    }
  }, [])

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
