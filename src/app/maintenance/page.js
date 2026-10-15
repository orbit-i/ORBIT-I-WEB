'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrbitLogo from '@/components/OrbitLogo'
import { MessageCircle, Mail } from 'lucide-react'

export default function MaintenancePage() {
  const telemetry = [
    { name: 'Core API Gateway', status: 'Operational', color: '#10b981' },
    { name: 'Distributed Cloud Clusters', status: 'Operational', color: '#10b981' },
    { name: 'Client Portal & Auth Services', status: 'Calibrating', color: '#f59e0b' },
    { name: 'Data Pipeline Synced', status: 'Active', color: '#10b981' },
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
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            fontFamily: 'Space Grotesk',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fef08a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}>
            Scheduled Orbital Calibration
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
            System Upgrades in Progress
          </span>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 28,
            maxWidth: 520,
            margin: '0 auto 28px',
          }}>
            ORBIT-I infrastructure engineering team is currently conducting scheduled system maintenance and performance calibrations to ensure maximum reliability and speed.
          </p>

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
              Need immediate enterprise assistance or have a mission-critical request?
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
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  background: 'var(--bg-card)',
                }}
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
