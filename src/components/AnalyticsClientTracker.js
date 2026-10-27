'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsClientTracker() {
  const pathname = usePathname()
  const lastPath = useRef('')

  useEffect(() => {
    if (!pathname || pathname.startsWith('/control-vault') || pathname.startsWith('/api')) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    // Detect referrer & screen info
    const referrer = typeof document !== 'undefined' ? document.referrer : ''
    
    // Log visit
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer,
        }),
      }).catch(() => {})
    } catch {}
  }, [pathname])

  return null
}
