'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrbitLogo from '@/components/OrbitLogo'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, rgba(99,102,241,0.12) 0%, rgba(7,13,26,1) 70%)',
      }}>
        {/* Decorative orbital ring */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px dashed rgba(99,102,241,0.2)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        <div style={{
          maxWidth: 620,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '48px 32px',
          background: 'rgba(13,22,39,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-hover)',
          borderRadius: 28,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* Logo badge */}
          <div style={{ display: 'inline-flex', marginBottom: 20 }}>
            <OrbitLogo size={56} showText={false} />
          </div>

          <div style={{
            fontSize: 'clamp(72px, 12vw, 120px)',
            fontWeight: 800,
            fontFamily: 'Space Grotesk',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 50%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}>
            404
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)',
            padding: '4px 14px',
            borderRadius: 100,
            marginBottom: 18,
          }}>
            Orbital Trajectory Lost
          </span>

          <h1 style={{
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'Space Grotesk',
            marginBottom: 14,
            lineHeight: 1.3,
          }}>
            Deep Space Anomaly Detected
          </h1>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
          }}>
            The telemetry coordinates you requested do not exist within the ORBIT-I system registry or have been repositioned into an alternate orbit.
          </p>

          {/* Quick buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Link
              href="/"
              className="btn-primary"
              style={{
                textDecoration: 'none',
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ← Return to Orbit (Home)
            </Link>

            <Link
              href="/services"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                padding: '12px 22px',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Explore Services
            </Link>

            <Link
              href="/contact"
              style={{
                textDecoration: 'none',
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                background: 'var(--bg-card)',
                transition: 'all 0.2s',
              }}
            >
              Contact Mission Control
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
