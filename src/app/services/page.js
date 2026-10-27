'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Link from 'next/link'
import { servicesList } from '@/data/servicesData'

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Hero */}
        <section style={{ padding: '48px 0 60px', position: 'relative', overflow: 'hidden' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 840 }}>
            <span className="tag" style={{ marginBottom: 16 }}><span className="dot" />Comprehensive Technology Solutions</span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 18 }}>
              Engineering Capabilities & <span className="gradient-text-blue">Service Directory</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Explore our 7 specialized engineering verticals designed for startups, high-growth SMEs, and established enterprises in <strong>Nawabshah, Karachi, Lahore, Islamabad, Sukkur, Sibi</strong>, and worldwide.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
              {servicesList.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <TiltCard style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 16,
                    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--accent)' }}>
                        {service.icon}
                      </div>
                      <span style={{ fontSize: 10, padding: '4px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {service.category}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {service.title}
                    </h2>

                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                      {service.shortDesc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
                      {service.features.slice(0, 3).map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {service.tags.slice(0, 4).map((t) => (
                        <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--accent-glow)', borderRadius: 6, color: 'var(--accent-light)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
                      <span>View Specifications & Delivery Details</span>
                      <span>→</span>
                    </div>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
