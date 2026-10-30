'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function MaintenanceGuard() {
  const pathname = usePathname()
  const router = useRouter()
  const [maintenance, setMaintenance] = useState(null)

  useEffect(() => {
    let isMounted = true

    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/maintenance', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (isMounted) {
          setMaintenance(data)
        }
      } catch {}
    }

    checkMaintenance()
    // Re-check periodically every 60s
    const timer = setInterval(checkMaintenance, 60000)
    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [pathname])

  useEffect(() => {
    if (!maintenance) return

    // 1. Never block admin/control routes or maintenance page itself
    const isExemptRoute =
      pathname === '/maintenance' ||
      pathname.startsWith('/control-vault-2026') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/superadmin') ||
      pathname.startsWith('/portal') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next')

    // 2. Never block authenticated administrators
    let isAdmin = false
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('orbit_user_data')
        const adminRole = localStorage.getItem('orbit_admin_role')
        if (adminRole === 'ADMIN') isAdmin = true
        if (userStr) {
          const parsed = JSON.parse(userStr)
          if (parsed && (parsed.role === 'ADMIN' || parsed.role === 'admin')) {
            isAdmin = true
          }
        }
      } catch {}
    }

    if (isAdmin) return

    if (maintenance.enabled) {
      if (isExemptRoute) return

      // Parse all allowed routes
      const baseAllowed = Array.isArray(maintenance.allowed_routes) ? maintenance.allowed_routes : []
      const customAllowed = typeof maintenance.custom_allowed_routes === 'string'
        ? maintenance.custom_allowed_routes.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
        : []

      const allAllowed = [...baseAllowed, ...customAllowed].map((r) => {
        let clean = r.trim().toLowerCase()
        if (!clean.startsWith('/')) clean = '/' + clean
        if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1)
        return clean
      })

      const currentClean = (pathname || '/').toLowerCase()

      const isAllowed = allAllowed.some((allowed) => {
        if (allowed === '/') return currentClean === '/'
        return currentClean === allowed || currentClean.startsWith(allowed + '/')
      })

      if (!isAllowed) {
        router.replace('/maintenance')
      }
    } else {
      // If maintenance is OFF and user visits /maintenance directly, redirect to homepage
      if (pathname === '/maintenance') {
        router.replace('/')
      }
    }
  }, [maintenance, pathname, router])

  return null
}

