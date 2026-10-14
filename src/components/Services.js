'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import TiltCard from './TiltCard'
import { servicesList } from '@/data/servicesData'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

export default function Services() {
  const featuredService = servicesList[0]
  const otherServices = servicesList.slice(1)

  return (
    <section id="services" style={{ paddingTop: 56, paddingBottom: 80, background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          <motion.div {...fadeUp(0)}>
            <div className="tag"><span className="dot" />Full-Spectrum Engineering & Applied AI</div>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Enterprise Services &{' '}<span className="gradient-text-blue">AI Solutions</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 480 }}>
            From autonomous LLM agents and custom ML pipelines to mission-critical web platforms and cross-platform mobile apps.
          </motion.p>
        </div>

        {/* Featured AI card */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 14 }}>
          <div style={{
            borderRadius: 20, padding: '32px 28px',
            background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 24px 48px var(--card-shadow)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, padding: '5px 12px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{featuredService.heroTag}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{featuredService.category}</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {featuredService.title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{featuredService.shortDesc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                {featuredService.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {featuredService.tags.map((t) => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                <Link href={`/services/${featuredService.slug}`} className="btn-primary" style={{ fontSize: 13, textDecoration: 'none' }}>
                  Explore Full Service & Architecture →
                </Link>
                <Link href="/contact" className="btn-outline" style={{ fontSize: 13, textDecoration: 'none' }}>
                  Request Consultation
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service cards grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="services-grid">
          {otherServices.map((s, i) => (
            <motion.div key={s.slug} {...fadeUp(0.04 * i)}>
              <Link href={`/services/${s.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <TiltCard style={{
                  height: '100%', borderRadius: 18, padding: '24px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  transition: 'border-color 0.2s, transform 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'var(--accent)', flexShrink: 0 }}>{s.icon}</div>
                    <span style={{ fontSize: 9, padding: '3px 8px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.category}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>{s.shortDesc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.tags.slice(0, 4).map((t) => (
                      <span key={t} style={{ fontSize: 10, padding: '3px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>
                    <span>View Specifications & Delivery</span>
                    <span>→</span>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
