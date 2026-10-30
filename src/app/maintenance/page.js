'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrbitLogo from '@/components/OrbitLogo'
import { MessageCircle, Mail, ArrowRight, ExternalLink } from 'lucide-react'

export default function MaintenancePage() {
  const [config, setConfig] = useState({
    title: 'Scheduled Orbital Calibration',
    message:
      'ORBIT-I infrastructure engineering team is currently conducting scheduled system maintenance and performance calibrations to ensure maximum reliability and speed.',
    estimated_return: '1-2 Hours',
    allowed_routes: ['/careers', '/contact', '/verify'],
    custom_allowed_routes: '',
  })

  useEffect(() => {
    fetch('/api/maintenance')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setConfig((prev) => ({
            ...prev,
            title: data.title || prev.title,
            message: data.message || prev.message,
            estimated_return: data.estimated_return || prev.estimated_return,
            allowed_routes: Array.isArray(data.allowed_routes) ? data.allowed_routes : prev.allowed_routes,
            custom_allowed_routes: data.custom_allowed_routes || '',
          }))
        }
      })
      .catch(() => {})
  }, [])

  const routeTitles = {
    '/careers': 'Careers & Internships Portal',
    '/contact': 'Contact Us & Technical Inquiries',
    '/verify': 'Certificate Verification Registry',
    '/services': 'Services Catalog',
    '/about': 'About ORBIT-I',
    '/blog': 'Engineering Insights Blog',
    '/team': 'Core Leadership Team',
    '/locations': 'Official Sindh Hubs & Locations',
  }

  const customList = (config.custom_allowed_routes || '')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)

  const activePortals = Array.from(new Set([...config.allowed_routes, ...customList]))
    .map((path) => {
      let clean = path.toLowerCase().trim()
      if (!clean.startsWith('/')) clean = '/' + clean
      return {
        path: clean,
        title: routeTitles[clean] || `Portal: ${clean}`,
      }
    })
    .filter((p) => p.path !== '/' && p.path !== '/maintenance')

  const telemetry = [
    { name: 'Core API Gateway', status: 'Operational', color: '#10b981' },
    { name: 'Distributed Cloud Clusters', status: 'Operational', color: '#10b981' },
    { name: 'Data Pipeline Synced', status: 'Active', color: '#10b981' },
    { name: 'Estimated Completion', status: config.estimated_return || '1-2 Hours', color: '#f59e0b' },
  ]

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.08) 0%, rgba(7,13,26,1) 75%)',
      }}>
        {/* Pulsing orbital ring */}
        <div style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          border: '1px dashed rgba(245,158,11,0.2)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        <div style={{
          maxWidth: 680,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '48px 32px',
          background: 'rgba(13,22,39,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 28,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* Logo badge */}
          <div style={{ display: 'inline-flex', marginBottom: 20 }}>
            <OrbitLogo size={56} showText={false} />
          </div>

          <div style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 800,
            fontFamily: 'Space Grotesk',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fef08a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}>
            {config.title}
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f59e0b',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            padding: '4px 14px',
            borderRadius: 100,
            marginBottom: 18,
          }}>
            System Upgrades in Progress · ETA: {config.estimated_return}
          </span>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 28,
            maxWidth: 520,
            margin: '0 auto 28px',
          }}>
            {config.message}
          </p>

          {/* Accessible Live Portals */}
          {activePortals.length > 0 && (
            <div style={{
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 28,
              textAlign: 'left',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Accessible Services During Maintenance:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {activePortals.map((portal) => (
                  <Link
                    key={portal.path}
                    href={portal.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      padding: '7px 14px',
                      borderRadius: 100,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{portal.title}</span>
                    <ArrowRight size={12} color="#4ade80" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Telemetry Status Board */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            textAlign: 'left',
          }}>
            {telemetry.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: item.color }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Emergency Contact Strip */}
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Need urgent enterprise assistance or have a mission-critical inquiry?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <a
                href="https://wa.me/923190375751"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  background: '#25d366',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <MessageCircle size={15} /> WhatsApp Support
              </a>
              <a
                href="mailto:contactus@orbit-i.tech"
                className="btn-secondary"
                style={{
                  textDecoration: 'none',
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Mail size={15} /> contactus@orbit-i.tech
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

