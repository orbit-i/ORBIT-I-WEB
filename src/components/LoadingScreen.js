'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let ignore = false

    // Instant bypass on mobile screens for rapid First Contentful Paint & smooth rendering
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    if (isMobile) {
      setMounted(true)
      setDone(true)
      return
    }

    const mountTimer = setTimeout(() => {
      if (!ignore) setMounted(true)
    }, 0)

    // Check if session has already seen the intro
    const hasLoaded = typeof window !== 'undefined' ? sessionStorage.getItem('orbit-loaded') : null
    if (hasLoaded) {
      const doneTimer = setTimeout(() => {
        if (!ignore) setDone(true)
      }, 0)
      return () => {
        ignore = true
        clearTimeout(mountTimer)
        clearTimeout(doneTimer)
      }
    }

    const steps = [
      { target: 50, delay: 30 },
      { target: 90, delay: 80 },
      { target: 100, delay: 140 },
    ]
    const stepTimers = steps.map(({ target, delay }) =>
      setTimeout(() => {
        if (!ignore) setProgress(target)
      }, delay)
    )
    const completeTimer = setTimeout(() => {
      if (typeof window !== 'undefined') sessionStorage.setItem('orbit-loaded', 'true')
      if (!ignore) setDone(true)
    }, 220)

    return () => {
      ignore = true
      clearTimeout(mountTimer)
      stepTimers.forEach(clearTimeout)
      clearTimeout(completeTimer)
    }
  }, [])

  if (!mounted || done) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="orbit-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#06101f',
          }}
        >
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              style={{
                position: 'absolute',
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 20}%`,
                width: 4, height: 4, borderRadius: '50%',
                background: '#3b82f6', opacity: 0.3,
              }}
              animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          ))}

          {/* Center content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative' }}>

            {/* Orbit rings around logo */}
            <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: 130, height: 130,
                  borderRadius: '50%', border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: 95, height: 95,
                  borderRadius: '50%', border: '1px solid rgba(99,140,210,0.12)',
                }}
              >
                <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'rgba(99,140,210,0.5)' }} />
              </motion.div>

              {/* Real logo */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/orbitlogo-removebg-preview.png"
                  alt="ORBIT-I"
                  width={68}
                  height={68}
                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.6))' }}
                  priority
                />
              </motion.div>
            </div>

            {/* Company name */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', gap: 1 }}>
                {'ORBIT-I'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                      fontFamily: 'Space Grotesk', fontSize: 30, fontWeight: 800,
                      color: char === '-' ? '#3b82f6' : '#e8f0fe',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: '#3a5a7a', textTransform: 'uppercase' }}>
                Private Limited
              </p>
              <p style={{ fontSize: 11, color: '#3a5a7a', marginTop: 2, fontStyle: 'italic' }}>
                Building Ideas. Creating Impact.
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 220, height: 2, background: '#0d1f3c', borderRadius: 100, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: 100,
                    background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
                    boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ fontSize: 11, color: '#3a5a7a', fontFamily: 'Space Grotesk', letterSpacing: '0.1em' }}>
                  LOADING ASSETS... {progress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
